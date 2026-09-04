/**
 * Tests for FailureRouter.
 * 
 * Validates canonical routing table from failure-routing.md §3.
 */

import { routeFailure } from '../routing/FailureRouter';
import { ProblemClass } from '../gates/GateTypes';
import { State } from '../state/StateMachine';

describe('FailureRouter', () => {
  describe('Canonical routing table', () => {
    it('routes CONTENT_PROBLEM to NEEDS_CONTENT', () => {
      const decision = routeFailure(ProblemClass.CONTENT_PROBLEM, State.RESEARCHING);
      
      expect(decision.targetState).toBe(State.NEEDS_CONTENT);
      expect(decision.returnTarget).toBe(State.RESEARCHING);
      expect(decision.owningPhase).toBe('Input and research');
    });

    it('routes ASSET_PROBLEM to NEEDS_ASSETS', () => {
      const decision = routeFailure(ProblemClass.ASSET_PROBLEM, State.CREATIVE_DIRECTION);
      
      expect(decision.targetState).toBe(State.NEEDS_ASSETS);
      expect(decision.returnTarget).toBe(State.CREATIVE_DIRECTION);
    });

    it('routes CREDENTIALS_PROBLEM to NEEDS_CREDENTIALS', () => {
      const decision = routeFailure(ProblemClass.CREDENTIALS_PROBLEM, State.RESEARCHING);
      
      expect(decision.targetState).toBe(State.NEEDS_CREDENTIALS);
      expect(decision.returnTarget).toBe(State.RESEARCHING);
    });

    it('routes BUSINESS_UNDERSTANDING_PROBLEM to RETURN_TO_RESEARCH', () => {
      const decision = routeFailure(ProblemClass.BUSINESS_UNDERSTANDING_PROBLEM, State.CREATIVE_DIRECTION);
      
      expect(decision.targetState).toBe(State.RETURN_TO_RESEARCH);
      expect(decision.returnTarget).toBe(State.RESEARCHING);
    });

    it('routes FACTUAL_INTEGRITY_PROBLEM to RETURN_TO_RESEARCH', () => {
      const decision = routeFailure(ProblemClass.FACTUAL_INTEGRITY_PROBLEM, State.IMPLEMENTING);
      
      expect(decision.targetState).toBe(State.RETURN_TO_RESEARCH);
      expect(decision.returnTarget).toBe(State.RESEARCHING);
    });

    it('routes CREATIVE_STRATEGY_PROBLEM to RETURN_TO_BLUEPRINT', () => {
      const decision = routeFailure(ProblemClass.CREATIVE_STRATEGY_PROBLEM, State.IMPLEMENTING);
      
      expect(decision.targetState).toBe(State.RETURN_TO_BLUEPRINT);
      expect(decision.returnTarget).toBe(State.CREATIVE_DIRECTION);
    });

    it('routes COMPOSITION_PROBLEM to RETURN_TO_BLUEPRINT', () => {
      const decision = routeFailure(ProblemClass.COMPOSITION_PROBLEM, State.IMPLEMENTING);
      
      expect(decision.targetState).toBe(State.RETURN_TO_BLUEPRINT);
      expect(decision.returnTarget).toBe(State.CREATIVE_DIRECTION);
    });

    it('routes IMPLEMENTATION_PROBLEM pre-build to stay in IMPLEMENTING', () => {
      const decision = routeFailure(ProblemClass.IMPLEMENTATION_PROBLEM, State.IMPLEMENTING);
      
      expect(decision.targetState).toBe(State.IMPLEMENTING);
      expect(decision.returnTarget).toBe(State.IMPLEMENTING);
    });

    it('routes IMPLEMENTATION_PROBLEM post-build to REFINING', () => {
      const decision = routeFailure(ProblemClass.IMPLEMENTATION_PROBLEM, State.CRITIQUING);
      
      expect(decision.targetState).toBe(State.REFINING);
      expect(decision.returnTarget).toBe(State.CRITIQUING);
    });

    it('routes RENDERED_QUALITY_PROBLEM to REFINING', () => {
      const decision = routeFailure(ProblemClass.RENDERED_QUALITY_PROBLEM, State.CRITIQUING);
      
      expect(decision.targetState).toBe(State.REFINING);
      expect(decision.returnTarget).toBe(State.CRITIQUING);
    });

    it('routes ACCESSIBILITY_PROBLEM to REFINING', () => {
      const decision = routeFailure(ProblemClass.ACCESSIBILITY_PROBLEM, State.CRITIQUING);
      
      expect(decision.targetState).toBe(State.REFINING);
      expect(decision.returnTarget).toBe(State.CRITIQUING);
    });

    it('routes FACTORY_RULE_PROBLEM to NEEDS_HUMAN_REVIEW', () => {
      const decision = routeFailure(ProblemClass.FACTORY_RULE_PROBLEM, State.RESEARCHING);
      
      expect(decision.targetState).toBe(State.NEEDS_HUMAN_REVIEW);
      expect(decision.returnTarget).toBe(State.RESEARCHING);
    });

    it('routes UNCLEAR to NEEDS_HUMAN_REVIEW per failure-routing.md §1 rule 6', () => {
      const decision = routeFailure(ProblemClass.UNCLEAR, State.IMPLEMENTING);
      
      expect(decision.targetState).toBe(State.NEEDS_HUMAN_REVIEW);
      expect(decision.returnTarget).toBe(State.IMPLEMENTING);
      expect(decision.owningPhase).toContain('Unclear');
    });
  });
});
