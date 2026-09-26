/**
 * Human approval coordination for M2.3-B — the policy layer over ApprovalStore.
 *
 * Canonical source: 02-CONTROL-PLANE/human-approval.md
 *   §1    three gates, each governing one transition
 *   §4.4 / §5.4 / §6.4  canonical rejection routes per gate
 *   §7    the six invariants
 *
 * WHAT THIS OWNS
 * --------------
 * Policy only. It does not persist (ApprovalStore does), does not evaluate gates
 * (M2.2 does) and does not perform state transitions (M2.1, via the
 * orchestrator's TransitionCoordinator). It decides: what a decision means,
 * which canonical route a rejection takes, whether that route is legal from the
 * gate's state, and whether a re-decision is a no-op or a supersession.
 *
 * THE SIX INVARIANTS
 * ------------------
 * 1. Exactly three gates exist        → any other gate number is rejected.
 * 2. Every decision is recorded, with
 *    the reason on rejection          → every call persists; a reason-less
 *                                       rejection is recorded AND marked.
 * 3. Gate 3 needs a passing Critic
 *    Validation                       → NOT enforceable here (it is a gate
 *                                       condition, M2.2's; see note below).
 * 4. Gate 1 and 2 approvals are
 *    preconditions for final approval → isFinalGateUnlocked().
 * 5. Approval is never inferred from
 *    silence or absence of objection  → absence reads as null, never APPROVED.
 * 6. A rejection without a stated
 *    reason routes to
 *    NEEDS_HUMAN_REVIEW               → reasonStated false ⇒ that route.
 *
 * INVARIANT 3 NOTE: this coordinator does NOT check Critic Validation. That is
 * a M2.2 gate condition (`critic_verdict_ship` etc.), and the orchestrator
 * evaluates it as the Final Approval gate; duplicating it here would create a
 * second source of truth for a gate predicate. Recorded, not re-implemented.
 *
 * M2.3-B Milestone: Seam 1, gate condition contracts, human approval/resume.
 * Factory version: 0.2.0
 */

import { State } from '../../state/StateMachine';
import { TransitionTable } from '../../state/TransitionTable';
import { ApprovalStore } from './ApprovalStore';
import {
  ApprovalDecision,
  ApprovalPolicyError,
  ApprovalRecord,
  GATE_DEFINITIONS,
  HumanApprovalGate,
  canonicalRoutesForGate,
  isHumanApprovalGate
} from './ApprovalTypes';

export interface ApprovalRequest {
  projectId: string;
  gate: HumanApprovalGate;
  /** Approver identity. Required: approval is never anonymous. */
  decidedBy: string;
  /** Free-text reason, as the canonical tables express rejections. */
  reason?: string;
  /** For a rejection: the canonical route. Omitted ⇒ NEEDS_HUMAN_REVIEW. */
  route?: State;
  /** Injectable for deterministic tests; defaults to now. */
  decidedAt?: string;
}

export type ApprovalOutcome =
  | { kind: 'approved'; record: ApprovalRecord; transitionTo: State; idempotent: boolean }
  | {
      kind: 'rejected';
      record: ApprovalRecord;
      route: State;
      reasonStated: boolean;
      /** Whether the canonical route is a legal transition from the gate's state. */
      transitionLegal: boolean;
      idempotent: boolean;
    };

export class ApprovalCoordinator {
  private readonly table = new TransitionTable();

  constructor(private readonly store: ApprovalStore) {}

  /** The recorded decision for a gate, or null. Absence is never approval. */
  async getDecision(projectId: string, gate: HumanApprovalGate): Promise<ApprovalRecord | null> {
    return this.store.read(projectId, gate);
  }

  /**
   * §7 invariant 4: Gate 1 AND Gate 2 approvals are preconditions for final
   * approval. Returns whether both are recorded APPROVED.
   */
  async isFinalGateUnlocked(projectId: string): Promise<boolean> {
    const [g1, g2] = await Promise.all([
      this.store.read(projectId, 1),
      this.store.read(projectId, 2)
    ]);
    return g1?.decision === 'APPROVED' && g2?.decision === 'APPROVED';
  }

  /**
   * Record an approval. Idempotent: re-approving the same gate is a no-op that
   * returns the existing decision and does not rewrite the record.
   *
   * @returns the outcome, whose `transitionTo` is the state the gate governs
   *   (human-approval.md §1). Performing that transition is the caller's job —
   *   this coordinator never transitions state.
   */
  async approve(request: ApprovalRequest): Promise<ApprovalOutcome> {
    return this.decide(request, 'APPROVED');
  }

  /**
   * Record a rejection and resolve its canonical route.
   *
   * Routing resolution (faithful to §7 invariant 6 and failure-routing.md §1
   * rule 6 — never guess a root cause):
   *   - a blank/absent reason       ⇒ NEEDS_HUMAN_REVIEW, reasonStated false
   *   - a reason but no route given ⇒ NEEDS_HUMAN_REVIEW (root cause not
   *                                   diagnosed by the caller)
   *   - an explicit route           ⇒ must be canonical for this gate
   */
  async reject(request: ApprovalRequest): Promise<ApprovalOutcome> {
    return this.decide(request, 'REJECTED');
  }

  private async decide(
    request: ApprovalRequest,
    decision: ApprovalDecision
  ): Promise<ApprovalOutcome> {
    const { projectId, gate } = request;

    // §7 invariant 1: exactly three gates exist.
    if (!isHumanApprovalGate(gate)) {
      throw new ApprovalPolicyError(
        `Invalid human approval gate ${String(gate)}: exactly three gates exist and ` +
          `additional gates are not introduced per project ` +
          `(human-approval.md §7 invariant 1)`,
        projectId
      );
    }

    if (typeof request.decidedBy !== 'string' || request.decidedBy.trim().length === 0) {
      throw new ApprovalPolicyError(
        `An approval/rejection must name its approver (decidedBy); approval is never anonymous`,
        projectId
      );
    }

    const existing = await this.store.read(projectId, gate);
    const decidedAt = request.decidedAt ?? new Date().toISOString();

    // Resolve the rejection's canonical route BEFORE the idempotency check, so
    // a changed route or reason is correctly treated as a new decision rather
    // than a no-op (and so an invalid route throws regardless).
    const reasonStated = typeof request.reason === 'string' && request.reason.trim().length > 0;
    const reason = reasonStated ? request.reason!.trim() : undefined;
    const route =
      decision === 'REJECTED'
        ? this.resolveRejectionRoute(projectId, gate, reasonStated, request.route)
        : undefined;

    // Idempotency: an identical re-decision changes nothing and writes nothing.
    // "Identical" means the same decision AND, for a rejection, the same
    // canonical route and reason.
    if (
      existing &&
      existing.decision === decision &&
      (decision === 'APPROVED' ||
        (existing.route === route && existing.reason === reason))
    ) {
      return this.toOutcome({ ...existing }, gate, decision, true, request);
    }

    const base = {
      projectId,
      gate,
      decision,
      decidedBy: request.decidedBy,
      decidedAt,
      // Preserve the superseded decision rather than overwriting history.
      ...(existing
        ? { supersedes: { decision: existing.decision, decidedAt: existing.decidedAt } }
        : {})
    };

    const record = await this.store.save(projectId, gate, {
      ...base,
      ...(decision === 'REJECTED' ? { ...(reason ? { reason } : {}), route } : {})
    });

    return this.toOutcome(record, gate, decision, false, request);
  }

  /**
   * Resolve a rejection's canonical route. Never invents a destination outside
   * the gate's canonical set.
   */
  private resolveRejectionRoute(
    projectId: string,
    gate: HumanApprovalGate,
    reasonStated: boolean,
    requested?: State
  ): State {
    const canonical = canonicalRoutesForGate(gate);

    // §7 invariant 6 / failure-routing.md §1 rule 6: an unresolved root cause
    // goes to human review rather than being guessed at.
    if (!reasonStated || !requested) {
      return State.NEEDS_HUMAN_REVIEW;
    }

    if (!canonical.includes(requested)) {
      const section = gate === 1 ? '4.4' : gate === 2 ? '5.4' : '6.4';
      throw new ApprovalPolicyError(
        `Rejection route ${requested} is not one of gate ${gate}'s canonical routes ` +
          `[${canonical.join(', ')}] (human-approval.md §${section})`,
        projectId
      );
    }

    return requested;
  }

  private toOutcome(
    record: ApprovalRecord,
    gate: HumanApprovalGate,
    decision: ApprovalDecision,
    idempotent: boolean,
    request: ApprovalRequest
  ): ApprovalOutcome {
    if (decision === 'APPROVED') {
      return {
        kind: 'approved',
        record,
        transitionTo: GATE_DEFINITIONS[gate].transitionTo,
        idempotent
      };
    }

    const route = (record.route ?? State.NEEDS_HUMAN_REVIEW) as State;
    const reasonStated = typeof request.reason === 'string' && request.reason.trim().length > 0;

    return {
      kind: 'rejected',
      record,
      route,
      reasonStated,
      // KNOWN CANONICAL SEAM: some canonical routes are not legal transitions
      // from the gate's own state (see ApprovalTypes.GATE_REJECTION_ROUTES).
      // Reported, never forced — the caller must not request an illegal
      // transition, and M2.1 re-checks authoritatively under its lock.
      transitionLegal: this.table.isValidTransition(GATE_DEFINITIONS[gate].occursAt, route),
      idempotent
    };
  }
}