/**
 * GateCoordinator tests — the thin adapter over frozen M2.2 (Section I).
 *
 * The adapter is unit-tested at its own boundary: the fake evaluator below
 * stands in for GateEvaluator ONLY to exercise the coordinator's outcome
 * interpretation (pass / route / fail-closed) — production wiring truth is
 * pinned separately in ResearchVerticalSlice.test.ts using the real
 * GateEvaluator + ProductionValidationContext.
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 */

import { GateEvaluator } from '../../gates/GateEvaluator';
import { GateName, ValidationResult } from '../../gates/GateTypes';
import { State } from '../../state/StateMachine';
import { GateCoordinator } from '../../orchestrator/coordination/GateCoordinator';
import { ActionDefinition, FailureType } from '../../orchestrator/types';

function actionWith(gate: GateName | null): ActionDefinition {
  return {
    actionId: 'TEST_ACTION',
    workerId: 'SomeWorker',
    workerVersion: '1.0.0',
    applicableStates: [State.RESEARCHING],
    requiredInputs: [],
    expectedOutputs: [],
    gateAfterAction: gate,
    transitionOnSuccess: { to: State.RESEARCH_READY },
    requiresProjectInput: false
  };
}

function fakeEvaluator(
  behavior: (projectId: string, gate: GateName) => Promise<ValidationResult>
): GateEvaluator {
  return {
    evaluateGate: behavior,
    evaluateTransition: async () => {
      throw new Error('not used');
    }
  } as unknown as GateEvaluator;
}

describe('GateCoordinator (M2.4)', () => {
  const projectId = 'gatec-proj';

  it('passes through trivially for an action without a gate (no M2.2 call)', async () => {
    let evaluatorCalled = false;
    const coordinator = new GateCoordinator(
      fakeEvaluator(async () => {
        evaluatorCalled = true;
        throw new Error('M2.2 must not be consulted for gateless actions');
      })
    );

    const result = await coordinator.evaluateForAction(
      projectId,
      actionWith(null),
      State.RESEARCHING
    );

    expect(evaluatorCalled).toBe(false);
    expect(result.passed).toBe(true);
    expect(result.gate).toBeNull();
  });

  it('delegates to the evaluator for a gated action', async () => {
    const coordinator = new GateCoordinator(
      fakeEvaluator(async (_p, gate) => ({
        passed: true,
        gate,
        failures: [],
        requiresHumanApproval: true
      }))
    );

    const result = await coordinator.evaluateForAction(
      projectId,
      actionWith(GateName.RESEARCH_VALIDATION),
      State.RESEARCHING
    );

    expect(result.passed).toBe(true);
    expect(result.gate).toBe(GateName.RESEARCH_VALIDATION);
  });

  it('wraps an evaluator exception as GATE_EVALUATION_ERROR (fail closed)', async () => {
    const coordinator = new GateCoordinator(
      fakeEvaluator(async () => {
        throw new Error('evaluation infrastructure exploded');
      })
    );

    await expect(
      coordinator.evaluateForAction(
        projectId,
        actionWith(GateName.RESEARCH_VALIDATION),
        State.RESEARCHING
      )
    ).rejects.toMatchObject({ failureType: FailureType.GATE_EVALUATION_ERROR });
  });

  it('interprets a pass result', async () => {
    const coordinator = new GateCoordinator(
      fakeEvaluator(async (_p, gate) => ({
        passed: true,
        gate,
        failures: [],
        requiresHumanApproval: true
      }))
    );

    const result = await coordinator.evaluateForAction(
      projectId,
      actionWith(GateName.RESEARCH_VALIDATION),
      State.RESEARCHING
    );
    const interpretation = coordinator.interpret(result);

    expect(interpretation.kind).toBe('pass');
  });

  it('interprets a fail result with M2.2 routing as a route (never re-routes itself)', async () => {
    const coordinator = new GateCoordinator(
      fakeEvaluator(async (_p, gate) => ({
        passed: false,
        gate,
        failures: [],
        requiresHumanApproval: false,
        problemClass: 'CONTENT_PROBLEM' as never,
        recommendedRoute: State.NEEDS_CONTENT,
        returnTarget: State.RESEARCHING
      }))
    );

    const result = await coordinator.evaluateForAction(
      projectId,
      actionWith(GateName.RESEARCH_VALIDATION),
      State.RESEARCHING
    );
    const interpretation = coordinator.interpret(result);

    expect(interpretation.kind).toBe('route');
    if (interpretation.kind === 'route') {
      // The route target IS M2.2's recommendation, verbatim.
      expect(interpretation.targetState).toBe(State.NEEDS_CONTENT);
      expect(interpretation.returnTarget).toBe(State.RESEARCHING);
    }
  });

  it('interprets a fail result WITHOUT a route as fail-closed (never guesses)', async () => {
    const coordinator = new GateCoordinator(
      fakeEvaluator(async (_p, gate) => ({
        passed: false,
        gate,
        failures: [],
        requiresHumanApproval: false
      }))
    );

    const result = await coordinator.evaluateForAction(
      projectId,
      actionWith(GateName.RESEARCH_VALIDATION),
      State.RESEARCHING
    );
    const interpretation = coordinator.interpret(result);

    expect(interpretation.kind).toBe('fail-closed');
  });
});
