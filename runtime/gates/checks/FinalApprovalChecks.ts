/**
 * Final Approval checks from quality-gates.md §8.
 */

import { ProblemClass } from '../GateTypes';
import { GateCheckSpec } from '../ValidationContext';

export function getFinalApprovalChecks(): GateCheckSpec[] {
  return [
    {
      id: 'final_critic_passed',
      name: 'Critic validation passed',
      canonicalSource: 'quality-gates.md §8.1',
      description: 'Critic verdict supports delivery',
      blocking: true,
      problemClass: ProblemClass.RENDERED_QUALITY_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'critic_verdict_ship');
        return { passed, reason: passed ? undefined : 'Critic verdict does not support delivery' };
      }
    },
    {
      id: 'final_no_unresolved_integrity',
      name: 'No unresolved factual integrity issues',
      canonicalSource: 'quality-gates.md §8.2',
      description: 'All factual integrity issues resolved',
      blocking: true,
      problemClass: ProblemClass.FACTUAL_INTEGRITY_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'no_unresolved_factual_issues');
        return { passed, reason: passed ? undefined : 'Unresolved factual integrity issues' };
      }
    }
  ];
}
