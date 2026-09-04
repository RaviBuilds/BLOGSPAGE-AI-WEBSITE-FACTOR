/**
 * Gate Registry for M2.2.
 * 
 * Defines all 6 canonical quality gates with their checks.
 * 
 * Canonical source: 02-CONTROL-PLANE/quality-gates.md §3-8
 * M2.2 Milestone: Pure gate evaluation library
 * Factory version: 0.2.0
 */

import { State } from '../state/StateMachine';
import { GateName, HumanGate, ArtifactType, ProblemClass } from './GateTypes';
import { GateDefinition } from './ValidationContext';
import { getResearchValidationChecks } from './checks/ResearchValidationChecks';
import { getCreativeDirectionValidationChecks } from './checks/CreativeDirectionValidationChecks';
import { getBlueprintValidationChecks } from './checks/BlueprintValidationChecks';
import { getImplementationValidationChecks } from './checks/ImplementationValidationChecks';
import { getCriticValidationChecks } from './checks/CriticValidationChecks';
import { getFinalApprovalChecks } from './checks/FinalApprovalChecks';

/**
 * Get all 6 canonical gate definitions.
 */
export function getAllGates(): GateDefinition[] {
  return [
    // Gate 1: Research Validation (quality-gates.md §3)
    {
      gate: GateName.RESEARCH_VALIDATION,
      owner: 'CONTROL_PLANE',
      sourceState: State.RESEARCHING,
      destinationState: State.RESEARCH_READY,
      canonicalSource: 'quality-gates.md §3',
      requiredArtifacts: [
        ArtifactType.BUSINESS_RESEARCH,
        ArtifactType.BUSINESS_INTELLIGENCE,
        ArtifactType.ASSET_INVENTORY,
        ArtifactType.BRAND_PROFILE
      ],
      checks: getResearchValidationChecks(),
      requiresHumanApprovalAfter: true,
      humanGateAfter: HumanGate.GATE_1_BUSINESS_UNDERSTANDING
    },
    
    // Gate 2: Creative Direction Validation (quality-gates.md §4)
    // NOTE: This gate validates progression WITHIN CREATIVE_DIRECTION state.
    // It is NOT a state transition (quality-gates.md §2 register, row 2).
    {
      gate: GateName.CREATIVE_DIRECTION_VALIDATION,
      owner: 'CONTROL_PLANE',
      sourceState: State.CREATIVE_DIRECTION,
      destinationState: State.CREATIVE_DIRECTION,
      canonicalSource: 'quality-gates.md §4',
      requiredArtifacts: [
        ArtifactType.CREATIVE_DIRECTION
      ],
      checks: getCreativeDirectionValidationChecks(),
      // No human gate after this quality gate. Human approval gates 1, 2, 3
      // sit after Research Validation, after Blueprint Validation, and at
      // Final Approval respectively (quality-gates.md §2).
      requiresHumanApprovalAfter: false,
      humanGateAfter: undefined
    },
    
    // Gate 3: Blueprint Validation (quality-gates.md §5)
    {
      gate: GateName.BLUEPRINT_VALIDATION,
      owner: 'CONTROL_PLANE',
      sourceState: State.CREATIVE_DIRECTION,
      destinationState: State.BLUEPRINT_READY,
      canonicalSource: 'quality-gates.md §5',
      requiredArtifacts: [
        ArtifactType.DESIGN_BLUEPRINT
      ],
      checks: getBlueprintValidationChecks(),
      requiresHumanApprovalAfter: true,
      humanGateAfter: HumanGate.GATE_2_DESIGN_BLUEPRINT
    },
    
    // Gate 4: Implementation Validation (quality-gates.md §6)
    {
      gate: GateName.IMPLEMENTATION_VALIDATION,
      owner: 'CONTROL_PLANE',
      sourceState: State.IMPLEMENTING,
      destinationState: State.BUILD_READY,
      canonicalSource: 'quality-gates.md §6',
      requiredArtifacts: [
        ArtifactType.IMPLEMENTATION_REPORT,
        ArtifactType.RENDERED_RESULT
      ],
      checks: getImplementationValidationChecks(),
      requiresHumanApprovalAfter: false,
      humanGateAfter: undefined
    },
    
    // Gate 5: Critic Validation (quality-gates.md §7)
    {
      gate: GateName.CRITIC_VALIDATION,
      owner: 'CONTROL_PLANE',
      sourceState: State.CRITIQUING,
      destinationState: State.APPROVED,  // or REFINING based on verdict
      canonicalSource: 'quality-gates.md §7',
      requiredArtifacts: [
        ArtifactType.CRITIC_REPORT
      ],
      checks: getCriticValidationChecks(),
      requiresHumanApprovalAfter: false,  // Human Gate 3 applies after routing to APPROVED
      humanGateAfter: undefined
    },
    
    // Gate 6: Final Approval (quality-gates.md §8)
    {
      gate: GateName.FINAL_APPROVAL,
      owner: 'HUMAN',
      sourceState: State.APPROVED,
      destinationState: State.DELIVERED,
      canonicalSource: 'quality-gates.md §8',
      requiredArtifacts: [
        ArtifactType.CRITIC_REPORT,
        ArtifactType.RENDERED_RESULT
      ],
      checks: getFinalApprovalChecks(),
      requiresHumanApprovalAfter: true,
      humanGateAfter: HumanGate.GATE_3_FINAL_WEBSITE
    }
  ];
}

/**
 * Get gate definition by name.
 */
export function getGate(gateName: GateName): GateDefinition | undefined {
  return getAllGates().find(g => g.gate === gateName);
}

/**
 * Get gate for a state transition.
 * 
 * Returns null if no gate governs this transition.
 */
export function getGateForTransition(from: State, to: State): GateDefinition | null {
  const gates = getAllGates();
  
  for (const gate of gates) {
    if (gate.sourceState === from && gate.destinationState === to) {
      return gate;
    }
  }
  
  return null;
}
