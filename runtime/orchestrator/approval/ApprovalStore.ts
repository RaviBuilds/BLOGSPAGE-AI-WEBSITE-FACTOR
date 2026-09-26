/**
 * Persistence for human approval/rejection records (M2.3-B).
 *
 * WHY NOT AN ARTIFACT TYPE
 * ------------------------
 * `human-approval.md` §7 invariant 2 requires every approval and rejection to
 * be recorded, but an approval record is NOT a 12th artifact:
 * `04-SCHEMA/_common/artifact-envelope.schema.json` declares the
 * `definitions.artifactType` enum a CLOSED set ("Closed set of exactly eleven
 * peer artifacts ... No thirteenth type is added by a schema and none is
 * introduced by a project run"). Persisting an approval as an artifact would
 * also make it indistinguishable from real content on every read path — e.g.
 * `hasArtifact(REFINEMENT_PLAN)` would report true for a project with no
 * refinement plan — and would force edits to the frozen `ArtifactTypes.ts`
 * plus the canonical envelope. See m2.3-b-decisions.md §3.
 *
 * STORAGE LAYOUT (deliberately OUTSIDE the artifacts tree)
 * --------------------------------------------------------
 *   {workspaceRoot}/{projectId}/control/approvals/gate-{1|2|3}.json
 *
 * Artifacts live at `{projectId}/artifacts/...` and the artifact write lock is
 * `{projectId}/.artifact-write.lock`; `ArtifactRepository.cleanupTempFiles`
 * scans only `{projectId}/artifacts`. Putting approval records under
 * `{projectId}/control/` therefore makes them structurally invisible to
 * artifact reconciliation — no orphan disposal, adoption or deletion can ever
 * reach them (proven in ApprovalStore.test.ts).
 *
 * INTEGRITY
 * ---------
 * One record per gate, written durably and atomically via the M2.3-A
 * `durableWrite` helper (temp write → fsync → rename), and carrying a SHA-256
 * digest over its own canonical JSON minus the digest field. Every read
 * recomputes the digest, so an edited or truncated record file fails closed
 * with ApprovalIntegrityError rather than being trusted.
 *
 * READS FAIL CLOSED: a corrupt/unparseable/mismatched record raises; absence
 * returns null. Absence is NEVER treated as approval (§7 invariant 5).
 *
 * M2.3-B Milestone: Seam 1, gate condition contracts, human approval/resume.
 * Factory version: 0.2.0
 */

import * as fs from 'fs';
import * as path from 'path';
import { durableWrite } from '../../artifacts/durableWrite';
import {
  assertPathInsideWorkspace,
  validateProjectId
} from '../../artifacts/validateProjectId';
import { logger } from '../../logging/Logger';
import { ApprovalWriteLock } from './ApprovalWriteLock';
import {
  ApprovalIntegrityError,
  ApprovalPolicyError,
  ApprovalRecord,
  ApprovalRecordInput,
  HumanApprovalGate,
  canonicalJson,
  computeApprovalDigest,
  isHumanApprovalGate
} from './ApprovalTypes';

export class ApprovalStore {
  private readonly workspaceRoot: string;
  private readonly lock: ApprovalWriteLock;

  constructor(workspaceRoot: string = './projects') {
    this.workspaceRoot = workspaceRoot;
    this.lock = new ApprovalWriteLock(workspaceRoot);
  }

  /** `{workspaceRoot}/{projectId}/control/approvals` — never the artifacts tree. */
  private getApprovalsDir(projectId: string): string {
    validateProjectId(projectId);
    const dir = path.join(this.workspaceRoot, projectId, 'control', 'approvals');
    return assertPathInsideWorkspace(dir, this.workspaceRoot);
  }

  /** One record per gate: `gate-{n}.json`. */
  getApprovalPath(projectId: string, gate: HumanApprovalGate): string {
    if (!isHumanApprovalGate(gate)) {
      throw new ApprovalPolicyError(
        `Invalid human approval gate ${String(gate)}: exactly three gates exist ` +
          `(human-approval.md §7 invariant 1)`,
        projectId
      );
    }
    return path.join(this.getApprovalsDir(projectId), `gate-${gate}.json`);
  }

  /** Whether a decision has been recorded for this gate. */
  async has(projectId: string, gate: HumanApprovalGate): Promise<boolean> {
    return fs.existsSync(this.getApprovalPath(projectId, gate));
  }

  /**
   * Read the recorded decision for a gate.
   *
   * @returns the verified record, or null when no decision is recorded.
   * @throws ApprovalIntegrityError when a record exists but is unreadable,
   *   malformed, or fails its digest check. Absence is null; corruption is an
   *   error, never a silent null.
   */
  async read(projectId: string, gate: HumanApprovalGate): Promise<ApprovalRecord | null> {
    const filePath = this.getApprovalPath(projectId, gate);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
    } catch (error) {
      throw new ApprovalIntegrityError(
        projectId,
        gate,
        `record is not parseable JSON (${error instanceof Error ? error.message : String(error)})`
      );
    }

    return this.verifyRecord(projectId, gate, parsed);
  }

  /**
   * Verify a parsed record's shape AND its digest, failing closed on any
   * mismatch. Exported for direct unit testing.
   */
  verifyRecord(projectId: string, gate: HumanApprovalGate, parsed: unknown): ApprovalRecord {
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new ApprovalIntegrityError(projectId, gate, 'record is not a JSON object');
    }

    const record = parsed as Record<string, unknown>;
    const digest = record['contentSha256'];

    if (typeof digest !== 'string' || digest.length === 0) {
      throw new ApprovalIntegrityError(projectId, gate, 'record carries no contentSha256 digest');
    }

    // Recompute over the record minus the digest field. Anything edited after
    // the commit — the decision, the reason, the approver — changes the digest.
    const { contentSha256: _ignored, ...rest } = record;
    const expected = computeApprovalDigest(rest as ApprovalRecordInput);

    if (expected !== digest) {
      throw new ApprovalIntegrityError(
        projectId,
        gate,
        'content digest mismatch — the record was modified after its commit (tampered or corrupt)'
      );
    }

    // Digest-verified, but shape is still asserted so a well-formed digest over
    // a malformed record cannot slip through.
    this.assertShape(projectId, gate, rest);

    // Return the FULL record, digest included (the digest field is part of the
    // persisted record; stripping it here would drop it from every reader).
    return record as unknown as ApprovalRecord;
  }

  /** Structural validation of a record (shape, not policy). */
  private assertShape(projectId: string, gate: HumanApprovalGate, record: unknown): void {
    const fail = (reason: string): never => {
      throw new ApprovalIntegrityError(projectId, gate, reason);
    };

    const r = record as Record<string, unknown>;

    if (r['projectId'] !== projectId) {
      fail(`record projectId ${JSON.stringify(r['projectId'])} does not match ${projectId}`);
    }
    if (r['gate'] !== gate) {
      fail(`record gate ${JSON.stringify(r['gate'])} does not match path gate ${gate}`);
    }
    if (r['decision'] !== 'APPROVED' && r['decision'] !== 'REJECTED') {
      fail(`record decision ${JSON.stringify(r['decision'])} is not APPROVED or REJECTED`);
    }
    if (typeof r['decidedBy'] !== 'string' || r['decidedBy'].trim().length === 0) {
      fail('record has no approver identity (decidedBy must be a non-empty string)');
    }
    if (typeof r['decidedAt'] !== 'string' || Number.isNaN(Date.parse(r['decidedAt']))) {
      fail('record decidedAt is not an ISO-8601 timestamp');
    }
  }

  /**
   * Persist a decision for a gate, under the approval write lock.
   *
   * The digest is computed here (over the canonical record minus the digest
   * field) and committed with the record, so verification is self-contained.
   */
  async save(
    projectId: string,
    gate: HumanApprovalGate,
    input: ApprovalRecordInput
  ): Promise<ApprovalRecord> {
    // Fail before any side effect on an invalid gate or mismatched payload.
    const filePath = this.getApprovalPath(projectId, gate);

    if (input.projectId !== projectId) {
      throw new ApprovalPolicyError(
        `Approval record projectId ${JSON.stringify(input.projectId)} does not match ` +
          `the target project ${projectId}`,
        projectId
      );
    }
    if (input.gate !== gate) {
      throw new ApprovalPolicyError(
        `Approval record gate ${String(input.gate)} does not match the target gate ${gate}`,
        projectId
      );
    }

    return this.lock.withLock(projectId, async () => {
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

      const contentSha256 = computeApprovalDigest(input);
      const record: ApprovalRecord = { ...input, contentSha256 };

      await durableWrite(filePath, JSON.stringify(record, null, 2), 'utf-8');

      logger.info('Approval recorded', {
        component: 'ApprovalStore',
        projectId,
        gate,
        decision: record.decision,
        route: record.route ?? null
      });

      return record;
    });
  }

  /**
   * Every recorded decision for a project, by gate order. Absent gates are
   * omitted. Used for §7 invariant 4 (Gate 1 and Gate 2 approvals are
   * preconditions for final approval).
   */
  async list(projectId: string): Promise<ApprovalRecord[]> {
    const records: ApprovalRecord[] = [];

    for (const gate of [1, 2, 3] as HumanApprovalGate[]) {
      const record = await this.read(projectId, gate);
      if (record) {
        records.push(record);
      }
    }

    return records;
  }
}