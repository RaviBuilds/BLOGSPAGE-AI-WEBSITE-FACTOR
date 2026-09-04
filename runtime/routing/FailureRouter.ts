/**
 * Pure failure routing mapper for M2.2.
 * 
 * Implements canonical routing table from failure-routing.md §3.
 * 
 * PURE MAPPING UTILITY — no state mutation, no persistence.
 * 
 * Canonical source: 02-CONTROL-PLANE/failure-routing.md
 * M2.2 Milestone: Pure gate evaluation library
 * Factory version: 0.2.0
 */

import { State } from '../state/StateMachine';
import { ProblemClass } from '../gates/GateTypes';
import { RoutingDecision } from './RoutingTypes';

/**
 * Route a failure to the appropriate exception state.
 * 
 * Pure function implementing failure-routing.md §3 routing table.
 * 
 * Per failure-routing.md §1 rule 6:
 * "When root cause is genuinely unclear, route to NEEDS_HUMAN_REVIEW rather than guessing."
 * 
 * @param problemClass - Classified problem type
 * @param currentState - Current project state
 * @returns Routing decision with target state, return target, and owning phase
 */
export function routeFailure(
  problemClass: ProblemClass,
  currentState: State
): RoutingDecision {
  
  // Canonical routing per failure-routing.md §3
  switch (problemClass) {
    
    case ProblemClass.CONTENT_PROBLEM:
      return {
        targetState: State.NEEDS_CONTENT,
        returnTarget: currentState,
        owningPhase: 'Input and research',
        problemClass
      };
    
    case ProblemClass.ASSET_PROBLEM:
      return {
        targetState: State.NEEDS_ASSETS,
        returnTarget: currentState,
        owningPhase: 'Input and research',
        problemClass
      };
    
    case ProblemClass.CREDENTIALS_PROBLEM:
      return {
        targetState: State.NEEDS_CREDENTIALS,
        returnTarget: currentState,
        owningPhase: 'Input',
        problemClass
      };
    
    case ProblemClass.BUSINESS_UNDERSTANDING_PROBLEM:
    case ProblemClass.FACTUAL_INTEGRITY_PROBLEM:
      return {
        targetState: State.RETURN_TO_RESEARCH,
        returnTarget: State.RESEARCHING,
        owningPhase: 'Research',
        problemClass
      };
    
    case ProblemClass.CREATIVE_STRATEGY_PROBLEM:
    case ProblemClass.COMPOSITION_PROBLEM:
      return {
        targetState: State.RETURN_TO_BLUEPRINT,
        returnTarget: State.CREATIVE_DIRECTION,
        owningPhase: 'Phase 4',
        problemClass
      };
    
    case ProblemClass.IMPLEMENTATION_PROBLEM:
      // Per failure-routing.md §3: stays in IMPLEMENTING pre-build, or REFINING post-build
      if (currentState === State.IMPLEMENTING) {
        // Pre-build: stays in IMPLEMENTING (no state change)
        return {
          targetState: State.IMPLEMENTING,
          returnTarget: State.IMPLEMENTING,
          owningPhase: 'Phase 5',
          problemClass
        };
      } else {
        // Post-build: routes to REFINING
        return {
          targetState: State.REFINING,
          returnTarget: State.CRITIQUING,
          owningPhase: 'Phase 5 or Phase 6',
          problemClass
        };
      }
    
    case ProblemClass.RENDERED_QUALITY_PROBLEM:
      return {
        targetState: State.REFINING,
        returnTarget: State.CRITIQUING,
        owningPhase: 'Phase 6',
        problemClass
      };
    
    case ProblemClass.ACCESSIBILITY_PROBLEM:
      // Per failure-routing.md §5: complex routing based on root cause
      // Implementation defect or blueprint decision that cannot be made accessible
      // Default to REFINING for Phase 5/6 scope
      return {
        targetState: State.REFINING,
        returnTarget: State.CRITIQUING,
        owningPhase: 'Phase 5 or Phase 6',
        problemClass
      };
    
    case ProblemClass.FACTORY_RULE_PROBLEM:
      return {
        targetState: State.NEEDS_HUMAN_REVIEW,
        returnTarget: currentState,
        owningPhase: 'Control Plane or the owning phase',
        problemClass
      };
    
    case ProblemClass.UNCLEAR:
      // Canonical per failure-routing.md §1 rule 6
      return {
        targetState: State.NEEDS_HUMAN_REVIEW,
        returnTarget: currentState,
        owningPhase: 'Unclear — requires human diagnosis',
        problemClass
      };
    
    default:
      // Unknown problem class — route to NEEDS_HUMAN_REVIEW per §1 rule 6
      return {
        targetState: State.NEEDS_HUMAN_REVIEW,
        returnTarget: currentState,
        owningPhase: 'Unknown problem class',
        problemClass
      };
  }
}
