/**
 * M2.3-B — Approval resume integration (Orchestrator wiring).
 *
 * Proves the approval lifecycle is wired into the orchestrator WITHOUT changing
 * existing run() semantics:
 *   1. With no recorded decision, run() stops at the human gate exactly as
 *      before — approval is never inferred (human-approval.md §7 inv. 5).
 *   2. A recorded approval is the ONLY thing that completes the gate's
 *      transition, through M2.1's canonical WAL.
 *   3. A recorded rejection follows its canonical route when that route is
 *      legal from the gate's state.
 *   4. The KNOWN CANONICAL SEAM routes (canonical but not legal from the gate's
 *      state) are reported and NOT forced — state is left untouched.
 *
 * M2.3-B Milestone: Seam 1, gate condition contracts, human approval/resume.
 * Factory version: 0.2.0
 */

import { Orchestrator } from '../../orchestrator/Orchestrator';
import { ApprovalStore } from '../../orchestrator/approval/ApprovalStore';
import { ApprovalCoordinator } from '../../orchestrator/approval/ApprovalCoordinator';
import { State } from '../../state/StateMachine';
import { StateManager } from '../../state/StateManager';
import {
  AllPassValidationContext,
  bootstrapResearchProject,
  makeWorkspaceRoot,
  removeWorkspaceRoot
} from './helpers';

const APPROVER = 'human-approver';

describe('Approval resume integration (M2.3-B)', () => {
  let workspaceRoot: string;
  let orchestrator: Orchestrator;
  let store: ApprovalStore;

  beforeEach(async () => {
    workspaceRoot = makeWorkspaceRoot('resumerun');
    store = new ApprovalStore(workspaceRoot);
    orchestrator = new Orchestrator({
      workspaceRoot,
      validationContext: new AllPassValidationContext(),
      approvalStore: store,
      approvalCoordinator: new ApprovalCoordinator(store)
    });
  });

  afterEach(async () => {
    await removeWorkspaceRoot(workspaceRoot);
  });

  /** Reach RESEARCH_READY through a real orchestrated pass (stub gate). */
  async function reachResearchReady(projectId: string): Promise<StateManager> {
    await bootstrapResearchProject(workspaceRoot, projectId);
    const summary = await orchestrator.run(projectId);
    expect(summary.finalState).toBe(State.RESEARCH_READY);
    return new StateManager(workspaceRoot);
  }

  it('stops at the human gate when no decision is recorded, and moves nothing', async () => {
    const projectId = 'resume-none';
    const stateManager = await reachResearchReady(projectId);

    // run() stopped at the human gate (unchanged existing behaviour)...
    expect(await stateManager.getCurrentState(projectId)).toBe(State.RESEARCH_READY);

    // ...and an explicit resume attempt still moves nothing, because approval is
    // never inferred from the absence of a decision.
    const outcome = await orchestrator.resumeWithApproval(projectId, 1);
    expect(outcome.transitioned).toBe(false);
    expect(outcome.decision).toBeNull();
    expect(outcome.reason).toMatch(/no approval or rejection has been recorded/);

    expect(await stateManager.getCurrentState(projectId)).toBe(State.RESEARCH_READY);
  });

  it('completes Gate 1 on a recorded approval, through the canonical WAL', async () => {
    const projectId = 'resume-approve';
    const stateManager = await reachResearchReady(projectId);

    const recorded = await orchestrator.recordApproval(
      { projectId, gate: 1, decidedBy: APPROVER },
      'APPROVED'
    );
    expect(recorded.kind).toBe('approved');

    const outcome = await orchestrator.resumeWithApproval(projectId, 1);
    expect(outcome.transitioned).toBe(true);
    expect(outcome.from).toBe(State.RESEARCH_READY);
    expect(outcome.to).toBe(State.CREATIVE_DIRECTION);
    expect(typeof outcome.txId).toBe('string');

    expect(await stateManager.getCurrentState(projectId)).toBe(State.CREATIVE_DIRECTION);

    // The WAL records the human decision as the trigger.
    const history = await stateManager.getStateHistory(projectId);
    const last = history.transitions[history.transitions.length - 1];
    expect(last.to).toBe(State.CREATIVE_DIRECTION);
    expect(last.triggeredBy).toBe('orchestrator:human-gate:1:approved');
  });

  it('does not resume a gate the project has not reached', async () => {
    const projectId = 'resume-wrongstate';
    await bootstrapResearchProject(workspaceRoot, projectId);
    const stateManager = new StateManager(workspaceRoot);

    // The project is at RESEARCHING, not Gate 1's RESEARCH_READY.
    await orchestrator.recordApproval(
      { projectId, gate: 1, decidedBy: APPROVER },
      'APPROVED'
    );

    const outcome = await orchestrator.resumeWithApproval(projectId, 1);
    expect(outcome.transitioned).toBe(false);
    expect(outcome.reason).toMatch(/occurs at RESEARCH_READY/);
    expect(await stateManager.getCurrentState(projectId)).toBe(State.RESEARCHING);
  });

  it('follows a rejection canonical route when it is legal from the gate state', async () => {
    const projectId = 'resume-reject';
    const stateManager = await reachResearchReady(projectId);

    await orchestrator.recordApproval(
      {
        projectId,
        gate: 1,
        decidedBy: APPROVER,
        reason: 'Facts are wrong or unsupported',
        route: State.RETURN_TO_RESEARCH
      },
      'REJECTED'
    );

    const outcome = await orchestrator.resumeWithApproval(projectId, 1);
    expect(outcome.transitioned).toBe(true);
    expect(outcome.to).toBe(State.RETURN_TO_RESEARCH);
    expect(await stateManager.getCurrentState(projectId)).toBe(State.RETURN_TO_RESEARCH);

    const history = await stateManager.getStateHistory(projectId);
    expect(history.transitions[history.transitions.length - 1].triggeredBy).toBe(
      'orchestrator:human-gate:1:rejected'
    );
  });

  it('refuses to force a canonical route that is illegal from the gate state (KNOWN SEAM)', async () => {
    const projectId = 'resume-seam';
    const stateManager = await reachResearchReady(projectId);

    // human-approval.md §4.4 names NEEDS_ASSETS as a Gate 1 rejection route, but
    // state-machine.md §4 gives RESEARCH_READY no transition to NEEDS_ASSETS.
    await orchestrator.recordApproval(
      {
        projectId,
        gate: 1,
        decidedBy: APPROVER,
        reason: 'Assets are missing or insufficient',
        route: State.NEEDS_ASSETS
      },
      'REJECTED'
    );

    const outcome = await orchestrator.resumeWithApproval(projectId, 1);
    expect(outcome.transitioned).toBe(false);
    expect(outcome.to).toBe(State.NEEDS_ASSETS);
    expect(outcome.reason).toMatch(/not legal per the canonical transition table/);

    // Fail closed: the project did NOT move.
    expect(await stateManager.getCurrentState(projectId)).toBe(State.RESEARCH_READY);

    // The decision itself is still recorded (§7 inv. 2) — recorded, not acted on.
    expect((await orchestrator.approvals.getDecision(projectId, 1))!.decision).toBe('REJECTED');
  });

  it('is idempotent: re-recording the same approval does not change the record', async () => {
    const projectId = 'resume-idem';
    await reachResearchReady(projectId);

    await orchestrator.recordApproval(
      { projectId, gate: 1, decidedBy: APPROVER, decidedAt: '2026-05-01T00:00:00.000Z' },
      'APPROVED'
    );
    const before = await orchestrator.approvals.getDecision(projectId, 1);

    await orchestrator.recordApproval(
      { projectId, gate: 1, decidedBy: APPROVER, decidedAt: '2026-06-01T00:00:00.000Z' },
      'APPROVED'
    );

    expect(await orchestrator.approvals.getDecision(projectId, 1)).toEqual(before);
    expect(await store.list(projectId)).toHaveLength(1);
  });

  it('reports rather than forces when the gate transition was already committed', async () => {
    const projectId = 'resume-twice';
    await reachResearchReady(projectId);

    await orchestrator.recordApproval(
      { projectId, gate: 1, decidedBy: APPROVER },
      'APPROVED'
    );

    const first = await orchestrator.resumeWithApproval(projectId, 1);
    expect(first.transitioned).toBe(true);

    // Second attempt: the project is no longer at the gate's state, so nothing
    // is forced and the run reports why.
    const second = await orchestrator.resumeWithApproval(projectId, 1);
    expect(second.transitioned).toBe(false);
    expect(second.reason).toMatch(/occurs at RESEARCH_READY/);
  });
});