/**
 * Abstract validation context for M2.2 gate evaluation.
 * 
 * Provides interface for artifact/condition queries without
 * implementing persistence. Implementation deferred to future milestone.
 * 
 * M2.2 Milestone: Pure gate evaluation library
 * Factory version: 0.2.0
 */

import { ArtifactType } from './GateTypes';

/**
 * Abstract validation context for artifact/condition queries.
 * 
 * Implementation deferred to future milestone.
 * M2.2 tests provide mock implementations.
 */
export interface ValidationContext {
  /**
   * Check whether an artifact exists for the project.
   * 
   * @param projectId - Project identifier
   * @param type - Artifact type
   * @returns true if artifact exists
   */
  hasArtifact(projectId: string, type: ArtifactType): Promise<boolean>;
  
  /**
   * Check a named condition.
   * 
   * Examples:
   * - "business_identity_unambiguous"
   * - "fabricated_fact_present"
   * - "build_success"
   * 
   * @param projectId - Project identifier
   * @param condition - Condition identifier
   * @param params - Optional parameters for condition evaluation
   * @returns true if condition met
   */
  checkCondition(
    projectId: string,
    condition: string,
    params?: Record<string, any>
  ): Promise<boolean>;
}

/**
 * Gate check specification.
 * 
 * Defines a single canonical check from quality-gates.md.
 */
export interface GateCheckSpec {
  id: string;
  name: string;
  canonicalSource: string;
  description: string;
  blocking: boolean;
  problemClass: import('./GateTypes').ProblemClass;
  evaluate: (
    projectId: string,
    context: ValidationContext
  ) => Promise<{ passed: boolean; reason?: string }>;
}

/**
 * Gate definition.
 * 
 * Complete specification of a canonical quality gate.
 */
export interface GateDefinition {
  gate: import('./GateTypes').GateName;
  owner: 'CONTROL_PLANE' | 'HUMAN';
  sourceState: import('../state/StateMachine').State;
  destinationState: import('../state/StateMachine').State;
  canonicalSource: string;
  requiredArtifacts: ArtifactType[];
  checks: GateCheckSpec[];
  requiresHumanApprovalAfter: boolean;
  humanGateAfter?: import('./GateTypes').HumanGate;
}
