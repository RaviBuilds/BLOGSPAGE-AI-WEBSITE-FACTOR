/**
 * M2.3-B — Human approval lifecycle (human-approval.md §1, §4–§7).
 *
 * Proves the six §7 invariants and the canonical rejection routing, plus the
 * resume path a run uses to get past a human-stop state.
 *
 * The rejections that route to a state which is NOT a legal transition from the
 * gate's own state are the KNOWN CANONICAL SEAM (three Gate 1 routes, one Gate 2
 * route — see m2.3-b-decisions.md §4). They are asserted as REPORTED, never
 * forced: the coordinator must not produce a usable transition for them.
 *
 * M2.3-B Milestone: Seam 1, gate condition contracts, human approval/resume.
 * Factory version: 0.2.0
 */

import * as fs from 'fs';
import * as path from 'path';
import { ApprovalStore } from '../../orchestrator/approval/ApprovalStore';
import { ApprovalCoordinator } from '../../orchestrator/approval/ApprovalCoordinator';
import {
  ApprovalPolicyError,
  GATE_DEFINITIONS,
  canonicalRoutesForGate
} from '../../orchestrator/approval/ApprovalTypes';
import { State } from '../../state/StateMachine';
import { bootstrapResearchProject, makeWorkspaceRoot, removeWorkspaceRoot, uuidv4 } from './helpers';

const PROJECT = 'lifecycle-proj';
const APPROVER = 'human-approver';

describe('Human approval lifecycle (M2.3-B)', () => {
  let workspaceRoot: string;
  let store: ApprovalStore;
  let coordinator: ApprovalCoordinator;

  beforeEach(async () => {
    workspaceRoot = makeWorkspaceRoot('approval');
    await fs.promises.mkdir(path.join(workspaceRoot, PROJECT), { recursive: true });
    store = new ApprovalStore(workspaceRoot);
    coordinator = new ApprovalCoordinator(store);
  });

  afterEach(async () => {
    await removeWorkspaceRoot(workspaceRoot);
  });

  describe('§7 inv. 1 — exactly three gates exist', () => {
    it('defines a gate for each of 1, 2 and 3 with its canonical transition', () => {
      expect(GATE_DEFINITIONS[1]).toMatchObject({
        occursAt: State.RESEARCH_READY,
        transitionTo: State.CREATIVE_DIRECTION
      });
      expect(GATE_DEFINITIONS[2]).toMatchObject({
        occursAt: State.BLUEPRINT_READY,
        transitionTo: State.IMPLEMENTING
      });
      expect(GATE_DEFINITIONS[3]).toMatchObject({
        occursAt: State.CRITIQUING,
        transitionTo: State.APPROVED
      });
    });

    it('refuses a gate number outside the canonical three', async () => {
      await expect(
        coordinator.approve({ projectId: PROJECT, gate: 4 as never, decidedBy: APPROVER })
      ).rejects.toThrow(ApprovalPolicyError);
    });
  });

  describe('§7 inv. 5 — approval is never inferred from silence', () => {
    it('reports no decision, and the final gate stays locked, when nothing is recorded', async () => {
      expect(await coordinator.getDecision(PROJECT, 1)).toBeNull();
      expect(await coordinator.isFinalGateUnlocked(PROJECT)).toBe(false);
    });

    it('refuses an anonymous decision', async () => {
      await expect(
        coordinator.approve({ projectId: PROJECT, gate: 1, decidedBy: '   ' })
      ).rejects.toThrow(/never anonymous/);
    });
  });

  describe('approval records the decision and reports the gate transition', () => {
    it('records the approval and returns the state the gate governs', async () => {
      const outcome = await coordinator.approve({
        projectId: PROJECT,
        gate: 1,
        decidedBy: APPROVER,
        decidedAt: '2026-02-01T00:00:00.000Z'
      });

      expect(outcome.kind).toBe('approved');
      expect(outcome.idempotent).toBe(false);
      if (outcome.kind !== 'approved') throw new Error('expected approved');
      expect(outcome.transitionTo).toBe(State.CREATIVE_DIRECTION);

      const record = await coordinator.getDecision(PROJECT, 1);
      expect(record!.decision).toBe('APPROVED');
      expect(record!.reason).toBeUndefined();
    });

    it('drives a real resume past the human-stop state through M2.1', async () => {
      // Gate 1 occurs at RESEARCH_READY. Reach that state as the orchestrator
      // does on a gate pass, then approve and commit the gate's transition.
      // A dedicated project id, because this test bootstraps a real workspace
      // (the shared beforeEach fixture only creates a bare directory).
      const resumeProject = 'resume-proj';
      const stateManager = await bootstrapResearchProject(workspaceRoot, resumeProject);
      await stateManager.transition({
        projectId: resumeProject,
        txId: uuidv4(),
        from: State.RESEARCHING,
        to: State.RESEARCH_READY,
        triggeredBy: 'orchestrator:gate-pass:RESEARCH_ACTION'
      });

      const outcome = await coordinator.approve({
        projectId: resumeProject,
        gate: 1,
        decidedBy: APPROVER
      });
      if (outcome.kind !== 'approved') throw new Error('expected approved');

      await stateManager.transition({
        projectId: resumeProject,
        txId: uuidv4(),
        from: State.RESEARCH_READY,
        to: outcome.transitionTo,
        triggeredBy: 'orchestrator:human-gate:1'
      });

      expect(await stateManager.getCurrentState(resumeProject)).toBe(State.CREATIVE_DIRECTION);
    });
  });

  describe('idempotency', () => {
    it('is a no-op when the same approval is recorded twice', async () => {
      await coordinator.approve({ projectId: PROJECT, gate: 1, decidedBy: APPROVER });
      const second = await coordinator.approve({
        projectId: PROJECT,
        gate: 1,
        decidedBy: APPROVER
      });

      expect(second.idempotent).toBe(true);
      expect(second.kind).toBe('approved');
      expect(await store.list(PROJECT)).toHaveLength(1);
    });

    it('does not rewrite the record on an idempotent re-approval', async () => {
      await coordinator.approve({
        projectId: PROJECT,
        gate: 1,
        decidedBy: APPROVER,
        decidedAt: '2026-02-01T00:00:00.000Z'
      });
      const before = await coordinator.getDecision(PROJECT, 1);

      await coordinator.approve({
        projectId: PROJECT,
        gate: 1,
        decidedBy: APPROVER,
        decidedAt: '2026-03-01T00:00:00.000Z'
      });

      expect(await coordinator.getDecision(PROJECT, 1)).toEqual(before);
    });
  });

  describe('§7 inv. 6 and reason-less rejection', () => {
    it('routes a rejection without a stated reason to NEEDS_HUMAN_REVIEW', async () => {
      const outcome = await coordinator.reject({
        projectId: PROJECT,
        gate: 1,
        decidedBy: APPROVER
      });

      expect(outcome.kind).toBe('rejected');
      if (outcome.kind !== 'rejected') throw new Error('expected rejected');
      expect(outcome.reasonStated).toBe(false);
      expect(outcome.route).toBe(State.NEEDS_HUMAN_REVIEW);
      expect(outcome.transitionLegal).toBe(true);
    });

    it('routes a rejection with a reason but no diagnosed route to NEEDS_HUMAN_REVIEW', async () => {
      // The root cause is not diagnosed, so it is not guessed at
      // (failure-routing.md §1 rule 6).
      const outcome = await coordinator.reject({
        projectId: PROJECT,
        gate: 2,
        decidedBy: APPROVER,
        reason: 'Something feels off but I cannot say which part'
      });

      if (outcome.kind !== 'rejected') throw new Error('expected rejected');
      expect(outcome.reasonStated).toBe(true);
      expect(outcome.route).toBe(State.NEEDS_HUMAN_REVIEW);
    });

    it('treats a whitespace-only reason as no reason', async () => {
      const outcome = await coordinator.reject({
        projectId: PROJECT,
        gate: 1,
        decidedBy: APPROVER,
        reason: '   '
      });

      if (outcome.kind !== 'rejected') throw new Error('expected rejected');
      expect(outcome.reasonStated).toBe(false);
      expect(outcome.route).toBe(State.NEEDS_HUMAN_REVIEW);
    });

    it('records the rejection with its reason and route (§7 inv. 2)', async () => {
      await coordinator.reject({
        projectId: PROJECT,
        gate: 3,
        decidedBy: APPROVER,
        reason: 'Factual error in presented content',
        route: State.RETURN_TO_RESEARCH
      });

      const record = await coordinator.getDecision(PROJECT, 3);
      expect(record!.decision).toBe('REJECTED');
      expect(record!.reason).toBe('Factual error in presented content');
      expect(record!.route).toBe(State.RETURN_TO_RESEARCH);
    });

    it('refuses a route outside the gate canonical set', async () => {
      await expect(
        coordinator.reject({
          projectId: PROJECT,
          gate: 1,
          decidedBy: APPROVER,
          reason: 'Facts are wrong or unsupported',
          route: State.REFINING // canonical for gate 3, not gate 1
        })
      ).rejects.toThrow(/not one of gate 1's canonical routes/);
    });
  });

  describe('canonical rejection routes resolve as expected', () => {
    it('declares each canonical route set de-duplicated', () => {
      expect(canonicalRoutesForGate(1)).toEqual([
        State.RETURN_TO_RESEARCH,
        State.NEEDS_CONTENT,
        State.NEEDS_ASSETS,
        State.NEEDS_CREDENTIALS,
        State.NEEDS_HUMAN_REVIEW
      ]);
      expect(canonicalRoutesForGate(2)).toEqual([
        State.RETURN_TO_BLUEPRINT,
        State.RETURN_TO_RESEARCH,
        State.NEEDS_ASSETS,
        State.NEEDS_HUMAN_REVIEW
      ]);
      expect(canonicalRoutesForGate(3)).toEqual([
        State.REFINING,
        State.RETURN_TO_BLUEPRINT,
        State.RETURN_TO_RESEARCH,
        State.NEEDS_ASSETS,
        State.NEEDS_CONTENT,
        State.NEEDS_HUMAN_REVIEW
      ]);
    });

    it('accepts and legalises every Gate 3 canonical route', async () => {
      for (const route of canonicalRoutesForGate(3)) {
        const outcome = await coordinator.reject({
          projectId: PROJECT,
          gate: 3,
          decidedBy: APPROVER,
          reason: `canonical route ${route}`,
          route
        });

        if (outcome.kind !== 'rejected') throw new Error('expected rejected');
        expect(outcome.route).toBe(route);
        expect(outcome.transitionLegal).toBe(true);
      }
    });
  });

  describe('§7 inv. 4 — Gate 1 and Gate 2 approvals are preconditions for final approval', () => {
    it('stays locked until both Gate 1 and Gate 2 are approved', async () => {
      await coordinator.approve({ projectId: PROJECT, gate: 3, decidedBy: APPROVER });
      expect(await coordinator.isFinalGateUnlocked(PROJECT)).toBe(false);

      await coordinator.approve({ projectId: PROJECT, gate: 1, decidedBy: APPROVER });
      expect(await coordinator.isFinalGateUnlocked(PROJECT)).toBe(false);

      await coordinator.approve({ projectId: PROJECT, gate: 2, decidedBy: APPROVER });
      expect(await coordinator.isFinalGateUnlocked(PROJECT)).toBe(true);
    });

    it('is not unlocked by a rejection at either gate', async () => {
      await coordinator.approve({ projectId: PROJECT, gate: 1, decidedBy: APPROVER });
      await coordinator.reject({
        projectId: PROJECT,
        gate: 2,
        decidedBy: APPROVER,
        reason: 'Wrong creative direction for this business',
        route: State.RETURN_TO_BLUEPRINT
      });

      expect(await coordinator.isFinalGateUnlocked(PROJECT)).toBe(false);
    });
  });

  describe('re-decisions preserve history rather than overwriting it', () => {
    it('records the superseded decision when an approval follows a rejection', async () => {
      await coordinator.reject({
        projectId: PROJECT,
        gate: 1,
        decidedBy: APPROVER,
        reason: 'Understanding is incomplete',
        route: State.RETURN_TO_RESEARCH,
        decidedAt: '2026-04-01T00:00:00.000Z'
      });

      const outcome = await coordinator.approve({
        projectId: PROJECT,
        gate: 1,
        decidedBy: APPROVER,
        decidedAt: '2026-04-02T00:00:00.000Z'
      });

      expect(outcome.idempotent).toBe(false);
      const record = await coordinator.getDecision(PROJECT, 1);
      expect(record!.decision).toBe('APPROVED');
      expect(record!.supersedes).toEqual({
        decision: 'REJECTED',
        decidedAt: '2026-04-01T00:00:00.000Z'
      });
    });

    it('records a changed rejection route as a new decision, not a no-op', async () => {
      const first = await coordinator.reject({
        projectId: PROJECT,
        gate: 3,
        decidedBy: APPROVER,
        reason: 'Execution quality issue within Phase 6 scope',
        route: State.REFINING
      });
      const second = await coordinator.reject({
        projectId: PROJECT,
        gate: 3,
        decidedBy: APPROVER,
        reason: 'Missing content',
        route: State.NEEDS_CONTENT
      });

      expect(first.idempotent).toBe(false);
      expect(second.idempotent).toBe(false);
      const record = await coordinator.getDecision(PROJECT, 3);
      expect(record!.route).toBe(State.NEEDS_CONTENT);
      expect(record!.reason).toBe('Missing content');
    });
  });

  describe('KNOWN CANONICAL SEAM — canonical routes that are illegal from the gate state', () => {
    // human-approval.md §4.4 and §5.4 name routes that state-machine.md §4 does
    // not permit from the state the gate occurs in. The coordinator REPORTS the
    // illegality and never forces the transition. Recorded for factory-level
    // resolution (m2.3-b-decisions.md §4); not patched by this milestone.
    it.each([
      [1, State.NEEDS_CONTENT],
      [1, State.NEEDS_ASSETS],
      [1, State.NEEDS_CREDENTIALS],
      [2, State.NEEDS_ASSETS]
    ])('reports gate %i → %s as canonical but not a legal transition', async (gate, route) => {
      const outcome = await coordinator.reject({
        projectId: PROJECT,
        gate: gate as never,
        decidedBy: APPROVER,
        reason: `canonical route ${route}`,
        route
      });

      if (outcome.kind !== 'rejected') throw new Error('expected rejected');
      expect(outcome.route).toBe(route); // canonical, and faithfully recorded
      expect(outcome.transitionLegal).toBe(false); // but not legal from the gate's state
    });

    it('routes that ARE legal from the gate state are marked legal', async () => {
      const outcome = await coordinator.reject({
        projectId: PROJECT,
        gate: 1,
        decidedBy: APPROVER,
        reason: 'Facts are wrong or unsupported',
        route: State.RETURN_TO_RESEARCH
      });

      if (outcome.kind !== 'rejected') throw new Error('expected rejected');
      expect(outcome.transitionLegal).toBe(true);
    });
  });
});