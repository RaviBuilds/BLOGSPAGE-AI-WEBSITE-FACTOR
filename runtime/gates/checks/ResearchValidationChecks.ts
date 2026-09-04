/**
 * Research Validation checks from quality-gates.md §3.
 */

import { ProblemClass } from '../GateTypes';
import { GateCheckSpec } from '../ValidationContext';

export function getResearchValidationChecks(): GateCheckSpec[] {
  return [
    {
      id: 'research_business_identified',
      name: 'Business is unambiguously identified',
      canonicalSource: 'quality-gates.md §3.1',
      description: 'The business is unambiguously identified',
      blocking: false,
      problemClass: ProblemClass.BUSINESS_UNDERSTANDING_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'business_identity_unambiguous');
        return { passed, reason: passed ? undefined : 'Business identity is ambiguous' };
      }
    },
    {
      id: 'research_artifacts_exist',
      name: 'Required artifacts exist',
      canonicalSource: 'quality-gates.md §3',
      description: 'Business research, intelligence, asset inventory, and brand profile exist',
      blocking: true,
      problemClass: ProblemClass.CONTENT_PROBLEM,
      evaluate: async (projectId, context) => {
        const checks = await Promise.all([
          context.checkCondition(projectId, 'business_research_exists'),
          context.checkCondition(projectId, 'business_intelligence_exists'),
          context.checkCondition(projectId, 'asset_inventory_exists'),
          context.checkCondition(projectId, 'brand_profile_exists')
        ]);
        const passed = checks.every(c => c);
        return { passed, reason: passed ? undefined : 'Required research artifacts missing' };
      }
    },
    {
      id: 'blocking_fabricated_fact',
      name: 'No fabricated facts',
      canonicalSource: 'quality-gates.md §3.3',
      description: 'No fabricated facts, reviews, or credentials',
      blocking: true,
      problemClass: ProblemClass.FACTUAL_INTEGRITY_PROBLEM,
      evaluate: async (projectId, context) => {
        const hasFabricated = await context.checkCondition(projectId, 'fabricated_fact_present');
        return { passed: !hasFabricated, reason: hasFabricated ? 'Fabricated facts detected' : undefined };
      }
    },
    {
      id: 'research_provenance',
      name: 'All facts have provenance',
      canonicalSource: 'quality-gates.md §3.1',
      description: 'Every factual item carries provenance',
      blocking: true,
      problemClass: ProblemClass.FACTUAL_INTEGRITY_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'all_facts_have_provenance');
        return { passed, reason: passed ? undefined : 'Factual items missing provenance' };
      }
    }
  ];
}
