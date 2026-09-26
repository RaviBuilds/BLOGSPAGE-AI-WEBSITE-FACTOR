/**
 * M2.3-B — ApprovalStore: persistence, integrity and containment.
 *
 * What is proven:
 * 1. Round trip: a decision is written and read back verified.
 * 2. Absence is null — never an implicit approval (human-approval.md §7 inv. 5).
 * 3. Integrity fails closed: any post-commit edit (decision, reason, projectId)
 *    is detected by the content digest.
 * 4. Only the three canonical gates exist (§7 inv. 1), and project isolation
 *    matches the artifact layer (invalid ids are rejected before side effects).
 * 5. Approval records live OUTSIDE the artifacts tree, so M2.3-A artifact
 *    reconciliation cannot adopt, delete or otherwise touch them.
 *
 * M2.3-B Milestone: Seam 1, gate condition contracts, human approval/resume.
 * Factory version: 0.2.0
 */

import * as fs from 'fs';
import * as path from 'path';
import { ApprovalStore } from '../../orchestrator/approval/ApprovalStore';
import {
  ApprovalIntegrityError,
  ApprovalPolicyError,
  ApprovalRecordInput
} from '../../orchestrator/approval/ApprovalTypes';
import { ArtifactRepository } from '../../artifacts/ArtifactRepository';
import { ArtifactType } from '../../artifacts/ArtifactTypes';
import { InvalidProjectIdError } from '../../artifacts/validateProjectId';
import { makeWorkspaceRoot, removeWorkspaceRoot, researchFixtureDocs } from './helpers';

const PROJECT = 'approval-proj';

function approvedInput(): ApprovalRecordInput {
  return {
    projectId: PROJECT,
    gate: 1,
    decision: 'APPROVED',
    decidedBy: 'human-approver',
    decidedAt: '2026-01-01T00:00:00.000Z'
  };
}

describe('ApprovalStore (M2.3-B)', () => {
  let workspaceRoot: string;
  let store: ApprovalStore;

  beforeEach(async () => {
    workspaceRoot = makeWorkspaceRoot('approvalstore');
    await fs.promises.mkdir(path.join(workspaceRoot, PROJECT), { recursive: true });
    store = new ApprovalStore(workspaceRoot);
  });

  afterEach(async () => {
    await removeWorkspaceRoot(workspaceRoot);
  });

  describe('round trip', () => {
    it('writes and reads back a verified approval', async () => {
      await store.save(PROJECT, 1, approvedInput());

      const record = await store.read(PROJECT, 1);
      expect(record).not.toBeNull();
      expect(record!.decision).toBe('APPROVED');
      expect(record!.gate).toBe(1);
      expect(record!.decidedBy).toBe('human-approver');
      expect(record!.contentSha256).toHaveLength(64);
    });

    it('records a rejection with its reason and route (§7 inv. 2)', async () => {
      await store.save(PROJECT, 3, {
        projectId: PROJECT,
        gate: 3,
        decision: 'REJECTED',
        decidedBy: 'human-approver',
        decidedAt: '2026-01-02T00:00:00.000Z',
        reason: 'Execution quality issue within Phase 6 scope',
        route: 'REFINING' as never
      });

      const record = await store.read(PROJECT, 3);
      expect(record!.decision).toBe('REJECTED');
      expect(record!.reason).toBe('Execution quality issue within Phase 6 scope');
      expect(record!.route).toBe('REFINING');
    });

    it('lists recorded decisions in gate order, omitting absent gates', async () => {
      await store.save(PROJECT, 3, { ...approvedInput(), gate: 3 });
      await store.save(PROJECT, 1, approvedInput());

      const records = await store.list(PROJECT);
      expect(records.map(r => r.gate)).toEqual([1, 3]);
    });
  });

  describe('absence is never approval (§7 inv. 5)', () => {
    it('returns null when no decision is recorded', async () => {
      expect(await store.read(PROJECT, 1)).toBeNull();
      expect(await store.has(PROJECT, 1)).toBe(false);
      expect(await store.list(PROJECT)).toEqual([]);
    });
  });

  describe('integrity fails closed', () => {
    const readJson = (file: string): Record<string, unknown> =>
      JSON.parse(fs.readFileSync(file, 'utf-8')) as Record<string, unknown>;

    const writeJson = (file: string, value: Record<string, unknown>): void => {
      fs.writeFileSync(file, JSON.stringify(value, null, 2));
    };

    it('detects an edited decision', async () => {
      await store.save(PROJECT, 1, {
        ...approvedInput(),
        decision: 'REJECTED',
        reason: 'Facts are wrong or unsupported',
        route: 'RETURN_TO_RESEARCH' as never
      });

      const file = store.getApprovalPath(PROJECT, 1);
      const onDisk = readJson(file);
      onDisk['decision'] = 'APPROVED'; // tamper; digest left untouched
      writeJson(file, onDisk);

      await expect(store.read(PROJECT, 1)).rejects.toThrow(ApprovalIntegrityError);
    });

    it('detects an edited reason', async () => {
      await store.save(PROJECT, 2, {
        projectId: PROJECT,
        gate: 2,
        decision: 'REJECTED',
        decidedBy: 'human-approver',
        decidedAt: '2026-01-03T00:00:00.000Z',
        reason: 'Wrong creative direction for this business',
        route: 'RETURN_TO_BLUEPRINT' as never
      });

      const file = store.getApprovalPath(PROJECT, 2);
      const onDisk = readJson(file);
      onDisk['reason'] = 'Looks great';
      writeJson(file, onDisk);

      await expect(store.read(PROJECT, 2)).rejects.toThrow(/digest mismatch/);
    });

    it('detects an unparseable record file', async () => {
      await store.save(PROJECT, 1, approvedInput());
      fs.writeFileSync(store.getApprovalPath(PROJECT, 1), '{ not json');

      await expect(store.read(PROJECT, 1)).rejects.toThrow(/not parseable JSON/);
    });

    it('detects a record whose identity contradicts its path', async () => {
      await store.save(PROJECT, 1, approvedInput());

      const file = store.getApprovalPath(PROJECT, 1);
      const onDisk = readJson(file);
      onDisk['projectId'] = 'someone-else';

      // Recompute the digest so ONLY the identity check can catch this.
      const { contentSha256: _drop, ...rest } = onDisk;
      const { computeApprovalDigest } = await import(
        '../../orchestrator/approval/ApprovalTypes'
      );
      onDisk['contentSha256'] = computeApprovalDigest(rest as ApprovalRecordInput);
      writeJson(file, onDisk);

      await expect(store.read(PROJECT, 1)).rejects.toThrow(/does not match/);
    });
  });

  describe('canonical gate set and project isolation', () => {
    it('refuses a gate outside the canonical three (§7 inv. 1)', async () => {
      await expect(
        store.save(PROJECT, 4 as never, { ...approvedInput(), gate: 4 as never })
      ).rejects.toThrow(ApprovalPolicyError);
    });

    it('refuses a mismatched projectId before any side effect', async () => {
      await expect(
        store.save(PROJECT, 1, { ...approvedInput(), projectId: 'other-proj' })
      ).rejects.toThrow(ApprovalPolicyError);
    });

    it('rejects an invalid projectId without touching the filesystem', async () => {
      await expect(store.read('../escape', 1)).rejects.toThrow(InvalidProjectIdError);
      await expect(
        store.save('../escape', 1, { ...approvedInput(), projectId: '../escape' })
      ).rejects.toThrow(InvalidProjectIdError);
    });
  });

  describe('containment: invisible to artifact reconciliation', () => {
    it('stores records outside the artifacts tree', async () => {
      await store.save(PROJECT, 1, approvedInput());

      const approvalPath = store.getApprovalPath(PROJECT, 1);
      const artifactsDir = path.join(workspaceRoot, PROJECT, 'artifacts');

      expect(approvalPath).toContain(path.join('control', 'approvals'));
      expect(approvalPath.startsWith(artifactsDir)).toBe(false);
    });

    it('survives an artifact commit that runs reconciliation and temp cleanup', async () => {
      await store.save(PROJECT, 1, approvedInput());
      const before = await store.read(PROJECT, 1);

      // A real artifact commit: takes the artifact lock, reconciles orphans,
      // cleans stale temp files under {project}/artifacts, writes the version
      // file and the manifest. None of that may reach {project}/control.
      const repo = new ArtifactRepository(workspaceRoot);
      const doc = researchFixtureDocs('approval-survive')[0];
      await repo.saveArtifact(PROJECT, ArtifactType.BUSINESS_RESEARCH, doc.document);

      expect(await store.read(PROJECT, 1)).toEqual(before);

      // And an approval is never visible as an artifact.
      expect(await repo.hasArtifact(PROJECT, ArtifactType.BUSINESS_RESEARCH)).toBe(true);
      expect(await repo.hasArtifact(PROJECT, ArtifactType.REFINEMENT_PLAN)).toBe(false);
    });
  });
});