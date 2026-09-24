/**
 * State/artifact reconciliation for M2.4.
 *
 * The M2.3-A audit fixed the ordering artifact-first → state-transition.
 * Across a crash, that ordering leaves a small, well-defined space of
 * divergence between M2.1's authoritative WAL and M2.3's authoritative
 * manifest. Reconciliation reads BOTH authorities fresh (never in-memory
 * state from a previous run) and does the minimum safe thing:
 *
 *   1. Expected outputs EXIST but the state has not advanced
 *      (crash between artifact persistence and the gate/transition): the
 *      gate is re-evaluated from M2.3. If it PASSES, the interrupted
 *      transition is completed. If it FAILS, the orchestrator proceeds with
 *      the normal action flow — the failure path re-runs the action and
 *      routes through M2.2 exactly once, in the normal flow. (A gate-failed
 *      crash-after-route and an ordinary regression re-entry are
 *      indistinguishable from persisted data alone; proceeding with the
 *      normal flow is the safe choice — it never double-routes and never
 *      blocks re-entry after a regression, per failure-routing.md §8.)
 *
 *      LINEAGE EVIDENCE POLICY (Section N): the persisted artifact contracts
 *      (artifact-contracts.md §7, the shared envelope) provide NO
 *      execution-level correlation field — there is no way to prove from
 *      M2.3-A data alone that a CURRENT artifact was produced by "the
 *      interrupted attempt" rather than an earlier one. M2.4 therefore never
 *      SKIPS work on the strength of that correlation. What it relies on is
 *      exactly the evidence M2.3-A does guarantee: manifest-recorded CURRENT
 *      status per (project, artifact type), envelope-identity consistency,
 *      and the SHA-256 content-integrity chain — re-established end to end
 *      by validateCurrentArtifact whenever the gate reads content. The
 *      worker is re-run whenever the gate does not pass; the only
 *      "resume" decision taken is completing a transition whose gate
 *      demonstrably passes against the persisted artifacts. Ambiguity never
 *      becomes assumed completion.
 *
 *   2. Expected outputs PARTIALLY exist: ambiguous — fail closed
 *      (RESTART_AMBIGUITY). Partial artifact sets cannot be interpreted
 *      safely without guessing.
 *
 *   3. State advanced but expected artifacts ABSENT (possible only via
 *      external corruption or manual M2.1 transitions): fail closed
 *      (RESTART_AMBIGUITY) before the human-stop check, so divergence is
 *      never silently absorbed.
 *
 * No M2.1 state, transition rule or projection is modified by this module;
 * recovery actions are ordinary legal transitions requested through
 * M2.1's StateManager.
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 * Factory version: 0.2.0
 */

import { ArtifactRepository } from '../../artifacts/ArtifactRepository';
import { logger } from '../../logging/Logger';
import { State } from '../../state/StateMachine';
import { StageRegistry } from '../StageRegistry';
import { ActionDefinition, FailureType, OrchestrationError } from '../types';
import { GateCoordinator } from './GateCoordinator';
import { TransitionCoordinator } from './TransitionCoordinator';

export interface ReconciliationOutcome {
  /** Whether reconciliation completed an interrupted transition itself. */
  completedTransition: boolean;
  /** Human-readable diagnosis recorded for observability. */
  diagnosis: string;
}

export class Reconciliation {
  constructor(
    private readonly stageRegistry: StageRegistry,
    private readonly artifactRepository: ArtifactRepository,
    private readonly gateCoordinator: GateCoordinator,
    private readonly transitionCoordinator: TransitionCoordinator
  ) {}

  /**
   * Detect and repair recoverable divergence BEFORE dispatching an action
   * for the given state. Called with the freshly-read current state on every
   * orchestration step.
   */
  async reconcileBeforeAction(
    projectId: string,
    currentState: State,
    action: ActionDefinition
  ): Promise<ReconciliationOutcome> {
    if (action.expectedOutputs.length === 0) {
      return { completedTransition: false, diagnosis: 'no expected outputs' };
    }

    const existence = await this.checkExpectedOutputs(projectId, action);
    const existingCount = existence.filter(e => e.exists).length;

    if (existingCount === 0) {
      return {
        completedTransition: false,
        diagnosis: 'no expected outputs persisted — fresh action execution'
      };
    }

    if (existingCount < existence.length) {
      const missing = existence
        .filter(e => !e.exists)
        .map(e => e.artifactType)
        .join(', ');
      throw new OrchestrationError(
        FailureType.RESTART_AMBIGUITY,
        `Partial artifact set detected for action ${action.actionId}: ` +
          `${existingCount}/${existence.length} persisted (missing: ${missing}). ` +
          `Cannot determine a safe recovery without guessing — failing closed.`,
        projectId
      );
    }

    // All expected outputs exist but the state has not advanced: crash
    // between persistence and gate/transition. Re-evaluate the gate from
    // M2.3 and complete the transition only if it passes NOW.
    const gateResult = await this.gateCoordinator.evaluateForAction(
      projectId,
      action,
      currentState
    );

    if (gateResult.passed) {
      logger.info(
        'Reconciliation: artifacts persisted and gate passes — completing interrupted transition',
        {
          component: 'Reconciliation',
          projectId,
          currentState,
          targetState: action.transitionOnSuccess.to
        }
      );
      await this.transitionCoordinator.requestTransition(
        projectId,
        currentState,
        action.transitionOnSuccess.to,
        `orchestrator:reconciliation:${action.actionId}`
      );
      return {
        completedTransition: true,
        diagnosis: 'gate passed on re-evaluation — interrupted transition completed'
      };
    }

    // Gate fails on the persisted artifacts. This is indistinguishable from
    // an ordinary regression re-entry; do NOT route here (the normal action
    // flow re-evaluates and routes exactly once). Proceed with the action.
    logger.warn(
      'Reconciliation: artifacts persisted but gate does not pass — proceeding with normal action flow',
      {
        component: 'Reconciliation',
        projectId,
        currentState,
        failureCount: gateResult.failures.length
      }
    );
    return {
      completedTransition: false,
      diagnosis: 'artifacts exist but gate fails — normal action flow will re-run and route'
    };
  }

  /**
   * Detect the inverse divergence: the project sits in (or is entering) a
   * state that is the declared success target of an action, but that
   * action's expected outputs are absent. Only reachable through external
   * corruption or manual M2.1 transitions; fail closed.
   *
   * @throws OrchestrationError (RESTART_AMBIGUITY)
   */
  async verifyStateArtifacts(projectId: string, state: State): Promise<void> {
    const producingActions = this.stageRegistry
      .getAllActions()
      .filter(a => a.transitionOnSuccess.to === state && a.expectedOutputs.length > 0);

    for (const action of producingActions) {
      const existence = await this.checkExpectedOutputs(projectId, action);
      const missing = existence.filter(e => !e.exists).map(e => e.artifactType);
      if (missing.length > 0) {
        throw new OrchestrationError(
          FailureType.RESTART_AMBIGUITY,
          `State ${state} is the success target of ${action.actionId} but its ` +
            `expected artifacts are absent: ${missing.join(', ')}. ` +
            `State/artifact divergence — failing closed.`,
          projectId
        );
      }
    }
  }

  private async checkExpectedOutputs(
    projectId: string,
    action: ActionDefinition
  ): Promise<{ artifactType: string; exists: boolean }[]> {
    const existence: { artifactType: string; exists: boolean }[] = [];
    for (const artifactType of action.expectedOutputs) {
      existence.push({
        artifactType,
        exists: await this.artifactRepository.hasArtifact(projectId, artifactType)
      });
    }
    return existence;
  }
}

