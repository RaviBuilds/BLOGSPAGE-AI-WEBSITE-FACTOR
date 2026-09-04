/**
 * Creative Direction Validation checks from quality-gates.md §4.
 *
 * Canonical source: 02-CONTROL-PLANE/quality-gates.md §4 (Creative Direction
 * Validation). This gate evaluates the Creative Direction artifact (contracted
 * at artifact-contracts.md §5.10) WITHIN the CREATIVE_DIRECTION state; it does
 * not govern a state transition (quality-gates.md §2 register, row 2).
 *
 * Check-to-canonical mapping:
 * - One check per §4.1 "Must be true" requirement (9 requirements).
 * - Blocking classification per §4.2 blocking conditions; the four §4.2
 *   conditions are enforced through the §4.1 checks whose violation they
 *   describe (no duplicate checks are created for them).
 * - Problem classes per §4.3 "On failure" and failure-routing.md §3.
 */

import { ProblemClass } from '../GateTypes';
import { GateCheckSpec } from '../ValidationContext';

export function getCreativeDirectionValidationChecks(): GateCheckSpec[] {
  return [
    {
      // §4.1 row 1. Blocking per §4.2: "direction stated only as pattern
      // selection, with no articulated intent".
      id: 'creative_intent_precedes_selection',
      name: 'Creative intent stated before pattern or language selection',
      canonicalSource: 'quality-gates.md §4.1',
      description: 'A creative intent is stated before any pattern or language selection',
      blocking: true,
      problemClass: ProblemClass.CREATIVE_STRATEGY_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'creative_intent_precedes_selection');
        return { passed, reason: passed ? undefined : 'Creative intent not stated before pattern or language selection' };
      }
    },
    {
      // §4.1 row 2, with artifact-contracts.md §5.10 and §6 invariant 7
      // (the Design Intent Statement is authoritatively authored here).
      // Blocking per §4.2: absence of an authored Design Intent Statement
      // means the direction has no articulated intent.
      id: 'creative_design_intent_statement_present',
      name: 'Design Intent Statement present and authored in this artifact',
      canonicalSource: 'quality-gates.md §4.1; artifact-contracts.md §5.10, §6 invariant 7',
      description: 'The Design Intent Statement is present and authored in the Creative Direction artifact',
      blocking: true,
      problemClass: ProblemClass.CREATIVE_STRATEGY_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'creative_design_intent_statement_present');
        return { passed, reason: passed ? undefined : 'Design Intent Statement missing or not authored in the Creative Direction artifact' };
      }
    },
    {
      // §4.1 row 3, per artifact-contracts.md §7 input version recording.
      // Non-blocking: a provenance bookkeeping gap, not a defect in the
      // direction's substance; it does not match any §4.2 blocking condition.
      id: 'creative_input_versions_recorded',
      name: 'Consumed input versions recorded',
      canonicalSource: 'quality-gates.md §4.1; artifact-contracts.md §7',
      description: 'The exact versions of every consumed input are recorded',
      blocking: false,
      problemClass: ProblemClass.FACTUAL_INTEGRITY_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'creative_input_versions_recorded');
        return { passed, reason: passed ? undefined : 'Exact versions of consumed inputs are not recorded' };
      }
    },
    {
      // §4.1 row 4. Blocking: ungrounded direction is the gate's primary
      // failure mode; §4.3 routes "Direction ungrounded in business truth"
      // to RETURN_TO_RESEARCH, matching BUSINESS_UNDERSTANDING_PROBLEM in
      // failure-routing.md §3.
      id: 'creative_decisions_traceable',
      name: 'Creative decisions trace to business intelligence or stated rationale',
      canonicalSource: 'quality-gates.md §4.1',
      description: 'Every creative decision traces to the business intelligence artifact or to stated rationale',
      blocking: true,
      problemClass: ProblemClass.BUSINESS_UNDERSTANDING_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'creative_decisions_traceable');
        return { passed, reason: passed ? undefined : 'Creative decision without traceable business intelligence or stated rationale' };
      }
    },
    {
      // §4.1 row 5. Blocking per §4.2: "creative direction that contradicts
      // a verified fact".
      id: 'creative_no_facts_outside_intelligence',
      name: 'No factual claims absent from business intelligence',
      canonicalSource: 'quality-gates.md §4.1',
      description: 'No factual claim appears that is absent from business intelligence',
      blocking: true,
      problemClass: ProblemClass.FACTUAL_INTEGRITY_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'creative_no_facts_outside_intelligence');
        return { passed, reason: passed ? undefined : 'Factual claim present that is absent from business intelligence' };
      }
    },
    {
      // §4.1 row 6. Blocking per §4.2: "creative direction that contradicts
      // a verified fact".
      id: 'creative_verified_facts_unaltered',
      name: 'Verified facts unaltered',
      canonicalSource: 'quality-gates.md §4.1',
      description: 'Verified facts are unaltered',
      blocking: true,
      problemClass: ProblemClass.FACTUAL_INTEGRITY_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'creative_verified_facts_unaltered');
        return { passed, reason: passed ? undefined : 'Verified fact altered in the creative direction' };
      }
    },
    {
      // §4.1 row 7. Blocking per §4.2: "direction that cannot be implemented
      // within the approved asset reality"; §4.3 routes it to NEEDS_ASSETS,
      // matching ASSET_PROBLEM in failure-routing.md §3.
      id: 'creative_asset_inventory_respected',
      name: 'Direction accounts for approved asset inventory',
      canonicalSource: 'quality-gates.md §4.1',
      description: 'The direction accounts for the approved asset inventory as a constraint',
      blocking: true,
      problemClass: ProblemClass.ASSET_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'creative_asset_inventory_respected');
        return { passed, reason: passed ? undefined : 'Direction not implementable within the approved asset inventory' };
      }
    },
    {
      // §4.1 row 8. Blocking per §4.2: "direction that reproduces a previous
      // project's outcome".
      id: 'creative_direction_business_specific',
      name: 'Direction specific to this business',
      canonicalSource: 'quality-gates.md §4.1',
      description: 'The direction is specific to this business, not carried over from a prior project',
      blocking: true,
      problemClass: ProblemClass.CREATIVE_STRATEGY_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'creative_direction_business_specific');
        return { passed, reason: passed ? undefined : 'Direction carried over from a prior project rather than specific to this business' };
      }
    },
    {
      // §4.1 row 9. Non-blocking: industry-as-heuristic is a quality property
      // of the direction's reasoning; it is not one of the §4.2 blocking
      // conditions.
      id: 'creative_industry_heuristic_only',
      name: 'Industry used as heuristic only',
      canonicalSource: 'quality-gates.md §4.1',
      description: 'Industry is used as a heuristic only, never as a determinant of outcome',
      blocking: false,
      problemClass: ProblemClass.CREATIVE_STRATEGY_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'creative_industry_heuristic_only');
        return { passed, reason: passed ? undefined : 'Industry used as a determinant of outcome rather than a heuristic' };
      }
    }
  ];
}