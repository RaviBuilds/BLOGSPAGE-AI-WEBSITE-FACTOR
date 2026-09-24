/**
 * Stage registry for M2.4 — the state → action mapping.
 *
 * This is DATA, not a workflow engine and not a second transition table:
 * each entry declares which worker runs in a state, which artifacts it
 * consumes/produces, which canonical M2.2 gate governs the exit, and which
 * canonical M2.1 state the project enters when that gate passes. Gate-failure
 * destinations are never recorded here — they come from M2.2's FailureRouter
 * at runtime.
 *
 * M2.4 registers EXACTLY ONE action: the research vertical slice
 * (workflow.md §2 stage 2, §3.2). No speculative future stage definitions
 * are registered; when a later milestone adds a stage it adds one entry
 * here — no orchestration logic changes. A state without a registered
 * action is a safe orchestrator stop ('no-action-for-state'), never an
 * invented transition.
 *
 * Canonical sources:
 * - workflow.md §2 (stage summary), §3.2 (Research stage)
 * - state-machine.md §2 (RESEARCHING exit condition), §4 (transition table)
 * - quality-gates.md §2 (Research Validation governs RESEARCHING → RESEARCH_READY)
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 * Factory version: 0.2.0
 */

import { State } from '../state/StateMachine';
import { ArtifactType } from '../artifacts/ArtifactTypes';
import { GateName } from '../gates/GateTypes';
import { ActionDefinition } from './types';

/**
 * The Research stage (workflow.md §3.2):
 * input  = registered project input (bootstrap — no prior artifacts),
 * output = business research, business intelligence, asset inventory,
 *          brand profile (agent-roles.md §3.1 outputs),
 * exit   = Research Validation gate (quality-gates.md §3) → RESEARCH_READY.
 */
export const RESEARCH_ACTION: ActionDefinition = {
  actionId: 'RESEARCH_ACTION',
  workerId: 'ResearchWorker',
  workerVersion: '0.1.0',
  applicableStates: [State.RESEARCHING],
  requiredInputs: [],
  expectedOutputs: [
    ArtifactType.BUSINESS_RESEARCH,
    ArtifactType.BUSINESS_INTELLIGENCE,
    ArtifactType.ASSET_INVENTORY,
    ArtifactType.BRAND_PROFILE
  ],
  gateAfterAction: GateName.RESEARCH_VALIDATION,
  transitionOnSuccess: { to: State.RESEARCH_READY },
  requiresProjectInput: true
};

/**
 * Maps states to the action that runs in them. Exactly one action per state.
 */
export class StageRegistry {
  private readonly actions: Map<State, ActionDefinition>;

  constructor(actions: ActionDefinition[] = StageRegistry.defaultActions()) {
    this.actions = new Map();
    for (const action of actions) {
      for (const state of action.applicableStates) {
        if (this.actions.has(state)) {
          throw new Error(
            `StageRegistry: state ${state} already mapped to ` +
              `${this.actions.get(state)!.actionId}; cannot also map ` +
              `${action.actionId}`
          );
        }
        this.actions.set(state, action);
      }
    }
  }

  /** The action registered for a state, or null when the state has none. */
  getActionForState(state: State): ActionDefinition | null {
    return this.actions.get(state) ?? null;
  }

  /** All registered actions (registry introspection, used by reconciliation). */
  getAllActions(): ActionDefinition[] {
    return Array.from(this.actions.values());
  }

  /**
   * The M2.4 action set: exactly the research vertical slice. Future
   * milestones extend this list; the orchestrator itself never changes.
   */
  static defaultActions(): ActionDefinition[] {
    return [RESEARCH_ACTION];
  }
}
