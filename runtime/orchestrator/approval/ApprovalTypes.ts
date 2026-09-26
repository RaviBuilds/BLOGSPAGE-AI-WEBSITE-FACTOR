/**
 * Human approval types for M2.3-B.
 *
 * Canonical source: 02-CONTROL-PLANE/human-approval.md
 * - §1  the three gates (the complete set), and the transition each governs
 * - §4.4 / §5.4 / §6.4  the canonical rejection routes per gate
 * - §7  the six approval invariants
 *
 * This module models the CANON'S OWN TOKENS. The rejection routes are canonical
 * STATE names (already machine tokens in state-machine.md §2), so no new
 * vocabulary is invented; the reason is free text, exactly as the canonical
 * tables express it ("Facts are wrong or unsupported"). No reason-code
 * taxonomy is invented, because no canonical document defines one.
 *
 * M2.3-B Milestone: Seam 1, gate condition contracts, human approval/resume.
 * Factory version: 0.2.0
 */

import * as crypto from 'crypto';
import { State } from '../../state/StateMachine';

/**
 * The three human approval gates. human-approval.md §7 invariant 1:
 * "Exactly three human approval gates exist. Additional gates are not
 * introduced per project."
 */
export const HUMAN_APPROVAL_GATES = [1, 2, 3] as const;

export type HumanApprovalGate = (typeof HUMAN_APPROVAL_GATES)[number];

export function isHumanApprovalGate(value: unknown): value is HumanApprovalGate {
  return (
    typeof value === 'number' && (HUMAN_APPROVAL_GATES as readonly number[]).includes(value)
  );
}

/**
 * Per gate: where it occurs, and the state it governs the transition INTO
 * (human-approval.md §1 "Governs transition" column).
 */
export const GATE_DEFINITIONS: Record<
  HumanApprovalGate,
  { name: string; occursAt: State; approves: string; transitionTo: State }
> = {
  1: {
    name: 'Business Understanding',
    occursAt: State.RESEARCH_READY,
    approves: 'That the factory understands the business correctly',
    transitionTo: State.CREATIVE_DIRECTION
  },
  2: {
    name: 'Design Blueprint',
    occursAt: State.BLUEPRINT_READY,
    approves: 'That the intended direction is correct',
    transitionTo: State.IMPLEMENTING
  },
  3: {
    name: 'Final Website',
    occursAt: State.CRITIQUING,
    approves: 'That the result is ready to deliver',
    transitionTo: State.APPROVED
  }
};

/**
 * The canonical rejection routes per gate, transcribed verbatim from
 * human-approval.md §4.4 (Gate 1), §5.4 (Gate 2) and §6.4 (Gate 3).
 *
 * NEEDS_HUMAN_REVIEW is a member of every gate's set because every table ends
 * with "Reason not stated | NEEDS_HUMAN_REVIEW", and §7 invariant 6 states it
 * outright: "A rejection without a stated reason routes to NEEDS_HUMAN_REVIEW
 * rather than being guessed at."
 *
 * KNOWN CANONICAL SEAM (recorded, NOT patched — see m2.3-b-decisions.md §4):
 * three Gate 1 routes and one Gate 2 route are NOT legal transitions from the
 * state the gate occurs in. state-machine.md §4 gives RESEARCH_READY no
 * transition to NEEDS_CONTENT, NEEDS_ASSETS or NEEDS_CREDENTIALS, and gives
 * BLUEPRINT_READY no transition to NEEDS_ASSETS. This module therefore records
 * the canon faithfully AND exposes a legality check, so the coordinator fails
 * closed instead of forcing an illegal transition. The correct fix is a
 * factory-level canon decision, not an implementation patch.
 */
export const GATE_REJECTION_ROUTES: Record<HumanApprovalGate, readonly State[]> = {
  1: [
    State.RETURN_TO_RESEARCH, // Facts are wrong or unsupported
    State.RETURN_TO_RESEARCH, // Understanding is incomplete
    State.NEEDS_CONTENT, //      Business content is missing (SEAM: illegal from RESEARCH_READY)
    State.NEEDS_ASSETS, //       Assets are missing or insufficient (SEAM: illegal from RESEARCH_READY)
    State.NEEDS_CREDENTIALS, //  A source requires authorisation (SEAM: illegal from RESEARCH_READY)
    State.NEEDS_HUMAN_REVIEW //  Reason not stated
  ],
  2: [
    State.RETURN_TO_BLUEPRINT, // Wrong creative direction for this business
    State.RETURN_TO_BLUEPRINT, // Composition does not serve the direction
    State.RETURN_TO_RESEARCH, //  Direction rests on a misunderstanding of the business
    State.NEEDS_ASSETS, //        Direction requires assets that do not exist (SEAM: illegal from BLUEPRINT_READY)
    State.NEEDS_HUMAN_REVIEW //   Requires new Phase 3 vocabulary / factory-level change
  ],
  3: [
    State.REFINING, //           Execution quality issue within Phase 6 scope
    State.RETURN_TO_BLUEPRINT, // Wrong creative direction or composition
    State.RETURN_TO_RESEARCH, //  Factual error in presented content
    State.NEEDS_ASSETS, //        Asset quality or quantity shortfall
    State.NEEDS_CONTENT, //       Missing content
    State.NEEDS_HUMAN_REVIEW //   Reason not stated
  ]
};

/** The canonical route set for a gate, de-duplicated. */
export function canonicalRoutesForGate(gate: HumanApprovalGate): State[] {
  return Array.from(new Set(GATE_REJECTION_ROUTES[gate]));
}

export type ApprovalDecision = 'APPROVED' | 'REJECTED';

/**
 * One persisted approval or rejection record.
 *
 * §7 invariant 2: "Every approval and rejection is recorded, with the reason
 * on rejection." `reason` is therefore required whenever `decision` is
 * REJECTED — enforced in ApprovalStore.validateRecord, not merely documented.
 */
export interface ApprovalRecord {
  projectId: string;
  gate: HumanApprovalGate;
  decision: ApprovalDecision;
  /** Who decided. Required: an approval is never anonymous. */
  decidedBy: string;
  /** ISO-8601 timestamp of the decision. */
  decidedAt: string;
  /** Required on REJECTED; where the rejection routes (a canonical state). */
  reason?: string;
  route?: State;
  /**
   * Set when a NEW decision supersedes a previously recorded one for the same
   * gate (e.g. an approval after an earlier rejection). The superseded decision
   * is preserved here rather than overwritten silently, so §7 invariant 2
   * ("every approval and rejection is recorded") holds across re-decisions.
   */
  supersedes?: { decision: ApprovalDecision; decidedAt: string };
  /** SHA-256 over the canonical JSON of this record minus this field. */
  contentSha256: string;
}

/** A record as supplied by the caller, before the digest is computed. */
export type ApprovalRecordInput = Omit<ApprovalRecord, 'contentSha256'>;

/**
 * Deterministic JSON: object keys sorted recursively, so a record's digest is
 * reproducible regardless of property insertion order.
 */
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value) ?? 'null';
  }

  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(',')}]`;
  }

  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`).join(',')}}`;
}

/**
 * Digest of a record's content, excluding the digest field itself (a digest
 * cannot cover itself). Recomputed and compared on every read, so an edited
 * record file fails closed rather than being trusted.
 */
export function computeApprovalDigest(input: ApprovalRecordInput): string {
  return crypto.createHash('sha256').update(canonicalJson(input), 'utf-8').digest('hex');
}

/** Raised when a persisted approval record is unreadable, corrupt or tampered. */
export class ApprovalIntegrityError extends Error {
  constructor(
    public readonly projectId: string,
    public readonly gate: number,
    public readonly reason: string
  ) {
    super(`Approval record for gate ${gate} of project ${projectId} failed integrity: ${reason}`);
    this.name = 'ApprovalIntegrityError';
  }
}

/** Raised when a decision or rejection violates human-approval.md. */
export class ApprovalPolicyError extends Error {
  constructor(message: string, public readonly projectId?: string) {
    super(message);
    this.name = 'ApprovalPolicyError';
  }
}