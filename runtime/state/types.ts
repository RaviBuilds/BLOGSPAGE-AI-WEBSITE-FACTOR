import { State } from './StateMachine';

/**
 * Current state record structure.
 * 
 * Per state-machine.md §1 rule 1: "A project has exactly one state at any time"
 * 
 * criticIteration is NOT part of state tracking; it's artifact provenance
 * stamped on artifacts (Critic Report, etc.) per state-machine.md §6.
 * M9 will implement it on artifacts when critique functionality is added.
 */
export interface CurrentState {
  state: State;
  projectId: string;
  updatedAt: string;
  exceptionState: ExceptionStateContext | null;
}

/**
 * Exception state context (for NEEDS_* and RETURN_TO_* states).
 */
export interface ExceptionStateContext {
  returnTarget: State;
  reason: string;
  enteredAt: string;
}

/**
 * State transition record for history.
 */
export interface StateTransition {
  from: State;
  to: State;
  timestamp: string;
  triggeredBy: string;
}

/**
 * State history record.
 */
export interface StateHistory {
  projectId: string;
  transitions: StateTransition[];
}
