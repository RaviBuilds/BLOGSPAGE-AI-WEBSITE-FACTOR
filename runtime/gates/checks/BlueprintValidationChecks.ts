/**
 * Blueprint Validation checks from quality-gates.md §5.
 */

import { ProblemClass } from '../GateTypes';
import { GateCheckSpec } from '../ValidationContext';

export function getBlueprintValidationChecks(): GateCheckSpec[] {
  return [
    {
      id: 'blueprint_exists',
      name: 'Design blueprint exists',
      canonicalSource: 'quality-gates.md §5',
      description: 'Design blueprint artifact exists',
      blocking: true,
      problemClass: ProblemClass.COMPOSITION_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'design_blueprint_exists');
        return { passed, reason: passed ? undefined : 'Design blueprint missing' };
      }
    },
    {
      id: 'blueprint_complete',
      name: 'Composition is complete',
      canonicalSource: 'quality-gates.md §5.1',
      description: 'Structure, layout, interactions, and responsive behavior defined',
      blocking: false,
      problemClass: ProblemClass.COMPOSITION_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'composition_complete');
        return { passed, reason: passed ? undefined : 'Blueprint composition incomplete' };
      }
    },
    {
      id: 'blueprint_intent_preserved',
      name: 'Creative intent preserved',
      canonicalSource: 'quality-gates.md §5.1',
      description: 'Blueprint preserves creative direction intent',
      blocking: false,
      problemClass: ProblemClass.CREATIVE_STRATEGY_PROBLEM,
      evaluate: async (projectId, context) => {
        const passed = await context.checkCondition(projectId, 'creative_intent_preserved');
        return { passed, reason: passed ? undefined : 'Creative intent not preserved' };
      }
    }
  ];
}
