/**
 * Gate coordination for M2.4 — the thin adapter between the orchestrator and
 * frozen M2.2.
 *
 * M2.4 MUST NOT know the internal semantics of individual gate conditions.
 * This coordinator does exactly two things:
 *   1. ask M2.2's GateEvaluator to evaluate the action's canonical gate,
 *   2. interpret the returned ValidationResult at the ORCHESTRATION level
 *      only (pass → declared success transition; fail → M2.2's
 *      recommendedRoute; fail-without-route → fail closed).
 *
 * It adds no gate definitions, no problem classification and no routing
 * entries of its own. Unresolved M2.2 conditions remain exactly as frozen:
 * GateEvaluator contains ConditionContractUnresolvedError as a blocking
 * CheckFailure and the gate fails closed — that behavior is preserved, never
 * worked around.
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 * Factory version: 0.2.0
 */

import { GateEvaluator } from '../../gates/GateEvaluator';
import { GateName, ValidationResult } from '../../gates/GateTypes';
import { logger } from '../../logging/Logger';
import { State } from '../../state/StateMachine';
import { ActionDefinition, FailureType, OrchestrationError } from '../types';

/** A gate outcome interpreted at the orchestration level. */
export type GateInterpretation =
  | { kind: 'pass'; result: ValidationResult }
  | { kind: 'route'; result: ValidationResult; targetState: State; returnTarget?: State }
  | { kind: 'fail-closed'; result: ValidationResult };

export class GateCoordinator {
  constructor(private readonly evaluator: GateEvaluator) {}

  /**
   * Evaluate the gate declared by an action (after its artifacts are
   * persisted — artifact-first, per the M2.3-A audit ordering).
   *
   * An action without a gate trivially passes.
   *
   * @throws OrchestrationError (GATE_EVALUATION_ERROR) when M2.2 evaluation
   *   itself throws — that is an infrastructure/contract failure, not a
   *   gate verdict; fail-closed.
   */
  async evaluateForAction(
    projectId: string,
    action: ActionDefinition,
    currentState: State
  ): Promise<ValidationResult> {
    if (!action.gateAfterAction) {
      return {
        passed: true,
        gate: null,
        failures: [],
        requiresHumanApproval: false
      };
    }

    try {
      return await this.evaluator.evaluateGate(
        projectId,
        action.gateAfterAction,
        currentState
      );
    } catch (error) {
      logger.error('Gate evaluation threw', {
        component: 'GateCoordinator',
        projectId,
        gate: action.gateAfterAction,
        error: error instanceof Error ? error.message : String(error)
      });
      throw new OrchestrationError(
        FailureType.GATE_EVALUATION_ERROR,
        `Gate ${action.gateAfterAction} evaluation threw: ${
          error instanceof Error ? error.message : String(error)
        }`,
        projectId,
        undefined,
        error
      );
    }
  }

  /**
   * Interpret a gate result for the orchestrator, using ONLY M2.2's own
   * contract (ValidationResult.passed / recommendedRoute / returnTarget).
   * No routing decision is made here.
   */
  interpret(result: ValidationResult): GateInterpretation {
    if (result.passed) {
      return { kind: 'pass', result };
    }

    if (!result.recommendedRoute) {
      // failure-routing.md §1 rule 6: unclear root cause routes to human
      // review rather than guessing. A gate failure without a route is a
      // contract violation by the evaluator — fail closed.
      return { kind: 'fail-closed', result };
    }

    return {
      kind: 'route',
      result,
      targetState: result.recommendedRoute,
      returnTarget: result.returnTarget
    };
  }
}
