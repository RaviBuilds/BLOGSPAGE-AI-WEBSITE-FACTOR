/**
 * Gate evaluation types for M2.2 quality gate validation layer.
 * 
 * Canonical sources:
 * - 02-CONTROL-PLANE/quality-gates.md §2
 * - 02-CONTROL-PLANE/human-approval.md §1
 * - 02-CONTROL-PLANE/failure-routing.md §3
 * 
 * M2.2 Milestone: Pure gate evaluation library
 * Factory version: 0.2.0
 */

import { State } from '../state/StateMachine';

/**
 * Canonical quality gate names from quality-gates.md §2.
 * 
 * 6 gates total.
 */
export enum GateName {
  RESEARCH_VALIDATION = 'RESEARCH_VALIDATION',
  CREATIVE_DIRECTION_VALIDATION = 'CREATIVE_DIRECTION_VALIDATION',
  BLUEPRINT_VALIDATION = 'BLUEPRINT_VALIDATION',
  IMPLEMENTATION_VALIDATION = 'IMPLEMENTATION_VALIDATION',
  CRITIC_VALIDATION = 'CRITIC_VALIDATION',
  FINAL_APPROVAL = 'FINAL_APPROVAL'
}

/**
 * Human approval gates from human-approval.md §1.
 * 
 * Separate from quality gates — human gates occur AFTER quality gate passes.
 */
export enum HumanGate {
  GATE_1_BUSINESS_UNDERSTANDING = 'GATE_1',
  GATE_2_DESIGN_BLUEPRINT = 'GATE_2',
  GATE_3_FINAL_WEBSITE = 'GATE_3'
}

/**
 * Artifact types from artifact-contracts.md §4.
 * 
 * Enum only — no persistence schema in M2.2.
 */
export enum ArtifactType {
  BUSINESS_RESEARCH = 'BUSINESS_RESEARCH',
  BUSINESS_INTELLIGENCE = 'BUSINESS_INTELLIGENCE',
  ASSET_INVENTORY = 'ASSET_INVENTORY',
  BRAND_PROFILE = 'BRAND_PROFILE',
  CREATIVE_DIRECTION = 'CREATIVE_DIRECTION',
  DESIGN_BLUEPRINT = 'DESIGN_BLUEPRINT',
  IMPLEMENTATION_REPORT = 'IMPLEMENTATION_REPORT',
  RENDERED_RESULT = 'RENDERED_RESULT',
  CRITIC_REPORT = 'CRITIC_REPORT',
  REFINEMENT_PLAN = 'REFINEMENT_PLAN'
}

/**
 * Problem class from failure-routing.md §3.
 * 
 * Used to classify gate check failures for routing.
 */
export enum ProblemClass {
  CONTENT_PROBLEM = 'CONTENT_PROBLEM',
  ASSET_PROBLEM = 'ASSET_PROBLEM',
  CREDENTIALS_PROBLEM = 'CREDENTIALS_PROBLEM',
  BUSINESS_UNDERSTANDING_PROBLEM = 'BUSINESS_UNDERSTANDING_PROBLEM',
  FACTUAL_INTEGRITY_PROBLEM = 'FACTUAL_INTEGRITY_PROBLEM',
  CREATIVE_STRATEGY_PROBLEM = 'CREATIVE_STRATEGY_PROBLEM',
  COMPOSITION_PROBLEM = 'COMPOSITION_PROBLEM',
  IMPLEMENTATION_PROBLEM = 'IMPLEMENTATION_PROBLEM',
  RENDERED_QUALITY_PROBLEM = 'RENDERED_QUALITY_PROBLEM',
  ACCESSIBILITY_PROBLEM = 'ACCESSIBILITY_PROBLEM',
  FACTORY_RULE_PROBLEM = 'FACTORY_RULE_PROBLEM',
  UNCLEAR = 'UNCLEAR'
}

/**
 * Individual gate check failure.
 */
export interface CheckFailure {
  checkId: string;
  checkName: string;
  canonicalSource: string;
  reason: string;
  blocking: boolean;
  problemClass?: ProblemClass;
}

/**
 * Result of gate evaluation.
 */
export interface ValidationResult {
  passed: boolean;
  gate: GateName | null;
  failures: CheckFailure[];
  problemClass?: ProblemClass;
  requiresHumanApproval: boolean;
  humanGate?: HumanGate;
  recommendedRoute?: State;
  returnTarget?: State;
  gateOwner?: 'CONTROL_PLANE' | 'HUMAN';
}
