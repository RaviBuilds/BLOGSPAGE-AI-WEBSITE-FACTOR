/**
 * Critic Validation checks from quality-gates.md §7.
 */

import { ProblemClass } from '../GateTypes';
import { GateCheckSpec } from '../ValidationContext';

export function getCriticValidationChecks(): GateCheckSpec[] {
  return [
    {
      id: 'critic_report_exists',
      name: 'Critic report exists',
      canonicalSource: 'quality-gates.md §7',
      description: 'Critic report artifact exists with verdict',
      blocking: true,
      problemClass: ProblemClass.RENDERED_QUALITY_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'critic_report_exists');
        return { passed, reason: passed ? undefined : 'Critic report missing' };
      }
    },
    {
      id: 'critic_verdict_stated',
      name: 'Verdict is stated',
      canonicalSource: 'quality-gates.md §7.1',
      description: 'Critic verdict is SHIP or REFINE',
      blocking: true,
      problemClass: ProblemClass.FACTORY_RULE_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'critic_verdict_stated');
        return { passed, reason: passed ? undefined : 'Critic verdict not stated' };
      }
    },
    {
      id: 'critic_no_blockers',
      name: 'No blocking findings',
      canonicalSource: 'quality-gates.md §7.2',
      description: 'No safety, legal, or critical accessibility blockers',
      blocking: true,
      problemClass: ProblemClass.ACCESSIBILITY_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'no_blocking_findings');
        return { passed, reason: passed ? undefined : 'Blocking findings present' };
      }
    }
  ];
}
