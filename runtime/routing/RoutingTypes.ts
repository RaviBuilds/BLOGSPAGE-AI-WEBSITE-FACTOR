/**
 * Failure routing types for M2.2.
 * 
 * Canonical source: 02-CONTROL-PLANE/failure-routing.md §3
 * 
 * M2.2 Milestone: Pure gate evaluation library
 * Factory version: 0.2.0
 */

import { State } from '../state/StateMachine';
import { ProblemClass } from '../gates/GateTypes';

/**
 * Routing decision result.
 * 
 * Pure value object from FailureRouter.
 */
export interface RoutingDecision {
  /** Target exception state to route to */
  targetState: State;
  
  /** Return target for exception recovery per state-machine.md §1 rule 4 */
  returnTarget: State;
  
  /** Owning phase responsible for resolution */
  owningPhase: string;
  
  /** Problem class that triggered routing */
  problemClass: ProblemClass;
}
