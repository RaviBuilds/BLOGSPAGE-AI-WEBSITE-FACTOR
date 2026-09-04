/**
 * Implementation Validation checks from quality-gates.md §6.
 */

import { ProblemClass } from '../GateTypes';
import { GateCheckSpec } from '../ValidationContext';

export function getImplementationValidationChecks(): GateCheckSpec[] {
  return [
    {
      id: 'implementation_build_success',
      name: 'Build succeeds',
      canonicalSource: 'quality-gates.md §6.1',
      description: 'Website builds without errors',
      blocking: true,
      problemClass: ProblemClass.IMPLEMENTATION_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'build_success');
        return { passed, reason: passed ? undefined : 'Build failed' };
      }
    },
    {
      id: 'implementation_blueprint_faithful',
      name: 'Blueprint requirements honored',
      canonicalSource: 'quality-gates.md §6.1',
      description: 'Implementation follows design blueprint',
      blocking: false,
      problemClass: ProblemClass.IMPLEMENTATION_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'blueprint_requirements_honored');
        return { passed, reason: passed ? undefined : 'Blueprint requirements not honored' };
      }
    },
    {
      id: 'implementation_report_exists',
      name: 'Implementation report exists',
      canonicalSource: 'quality-gates.md §6',
      description: 'Implementation report artifact produced',
      blocking: true,
      problemClass: ProblemClass.IMPLEMENTATION_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'implementation_report_exists');
        return { passed, reason: passed ? undefined : 'Implementation report missing' };
      }
    }
  ];
}
