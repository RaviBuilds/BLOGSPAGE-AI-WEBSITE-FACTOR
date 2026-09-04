/**
 * Tests for GateEvaluator.
 * 
 * Validates gate evaluation logic against quality-gates.md specifications.
 */

import { GateEvaluator } from '../gates/GateEvaluator';
import { GateName, ProblemClass, ArtifactType } from '../gates/GateTypes';
import { State } from '../state/StateMachine';
import { MockValidationContext } from './MockValidationContext';

describe('GateEvaluator', () => {
  let context: MockValidationContext;
  let evaluator: GateEvaluator;
  const projectId = 'test-project-001';

  beforeEach(() => {
    context = new MockValidationContext();
    evaluator = new GateEvaluator(context);
  });

  describe('Research Validation Gate', () => {
    it('passes when all checks pass', async () => {
      context.setArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, true);
      context.setArtifact(projectId, ArtifactType.BUSINESS_INTELLIGENCE, true);
      context.setArtifact(projectId, ArtifactType.ASSET_INVENTORY, true);
      context.setArtifact(projectId, ArtifactType.BRAND_PROFILE, true);

      context.setCondition(projectId, 'business_identity_unambiguous', true);
      context.setCondition(projectId, 'business_research_exists', true);
      context.setCondition(projectId, 'business_intelligence_exists', true);
      context.setCondition(projectId, 'asset_inventory_exists', true);
      context.setCondition(projectId, 'brand_profile_exists', true);
      context.setCondition(projectId, 'fabricated_fact_present', false);
      context.setCondition(projectId, 'all_facts_have_provenance', true);

      const result = await evaluator.evaluateGate(
        projectId,
        GateName.RESEARCH_VALIDATION,
        State.RESEARCHING
      );

      expect(result.passed).toBe(true);
      expect(result.gate).toBe(GateName.RESEARCH_VALIDATION);
      expect(result.failures).toHaveLength(0);
      expect(result.requiresHumanApproval).toBe(true);
    });

    it('fails when fabricated facts present', async () => {
      context.setArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, true);
      context.setArtifact(projectId, ArtifactType.BUSINESS_INTELLIGENCE, true);
      context.setArtifact(projectId, ArtifactType.ASSET_INVENTORY, true);
      context.setArtifact(projectId, ArtifactType.BRAND_PROFILE, true);

      context.setCondition(projectId, 'business_research_exists', true);
      context.setCondition(projectId, 'business_intelligence_exists', true);
      context.setCondition(projectId, 'asset_inventory_exists', true);
      context.setCondition(projectId, 'brand_profile_exists', true);
      context.setCondition(projectId, 'fabricated_fact_present', true);
      context.setCondition(projectId, 'all_facts_have_provenance', true);

      const result = await evaluator.evaluateGate(
        projectId,
        GateName.RESEARCH_VALIDATION,
        State.RESEARCHING
      );

      expect(result.passed).toBe(false);
      expect(result.problemClass).toBe(ProblemClass.FACTUAL_INTEGRITY_PROBLEM);
    });

    it('routes to RETURN_TO_RESEARCH for business understanding problem', async () => {
      context.setArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, true);
      context.setArtifact(projectId, ArtifactType.BUSINESS_INTELLIGENCE, true);
      context.setArtifact(projectId, ArtifactType.ASSET_INVENTORY, true);
      context.setArtifact(projectId, ArtifactType.BRAND_PROFILE, true);

      context.setCondition(projectId, 'business_identity_unambiguous', false);
      context.setCondition(projectId, 'business_research_exists', true);
      context.setCondition(projectId, 'business_intelligence_exists', true);
      context.setCondition(projectId, 'asset_inventory_exists', true);
      context.setCondition(projectId, 'brand_profile_exists', true);
      context.setCondition(projectId, 'fabricated_fact_present', false);
      context.setCondition(projectId, 'all_facts_have_provenance', true);

      const result = await evaluator.evaluateGate(
        projectId,
        GateName.RESEARCH_VALIDATION,
        State.RESEARCHING
      );

      expect(result.passed).toBe(false);
      expect(result.problemClass).toBe(ProblemClass.BUSINESS_UNDERSTANDING_PROBLEM);
      expect(result.recommendedRoute).toBe(State.RETURN_TO_RESEARCH);
    });
  });

  describe('Transition evaluation', () => {
    it('allows transitions without gates', async () => {
      const result = await evaluator.evaluateTransition(
        projectId,
        State.NEEDS_CONTENT,
        State.RESEARCHING
      );

      expect(result.passed).toBe(true);
      expect(result.gate).toBeNull();
    });
  });

  describe('Unknown gate handling', () => {
    it('fails with an explicit unknown_gate failure for an unregistered gate name', async () => {
      const unknownGate = 'NOT_A_REGISTERED_GATE' as GateName;

      const result = await evaluator.evaluateGate(projectId, unknownGate, State.NEW);

      expect(result.passed).toBe(false);
      expect(result.gate).toBe(unknownGate);
      expect(result.failures).toHaveLength(1);
      expect(result.failures[0].checkId).toBe('unknown_gate');
      expect(result.failures[0].blocking).toBe(true);
      expect(result.failures[0].reason).toContain('not implemented');
      expect(result.requiresHumanApproval).toBe(false);
    });
  });

  describe('Dominant problem classification', () => {
    it('classifies from non-blocking failures when no blocking failure exists', async () => {
      // Research gate: satisfy every blocking requirement and leave only the
      // non-blocking identity check failing, so dominance is resolved from
      // the non-blocking failure's problem class.
      context.setArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, true);
      context.setArtifact(projectId, ArtifactType.BUSINESS_INTELLIGENCE, true);
      context.setArtifact(projectId, ArtifactType.ASSET_INVENTORY, true);
      context.setArtifact(projectId, ArtifactType.BRAND_PROFILE, true);

      context.setCondition(projectId, 'business_identity_unambiguous', false); // non-blocking
      context.setCondition(projectId, 'business_research_exists', true);
      context.setCondition(projectId, 'business_intelligence_exists', true);
      context.setCondition(projectId, 'asset_inventory_exists', true);
      context.setCondition(projectId, 'brand_profile_exists', true);
      context.setCondition(projectId, 'fabricated_fact_present', false);
      context.setCondition(projectId, 'all_facts_have_provenance', true);

      const result = await evaluator.evaluateGate(
        projectId,
        GateName.RESEARCH_VALIDATION,
        State.RESEARCHING
      );

      expect(result.passed).toBe(false);
      expect(result.failures).toHaveLength(1);
      expect(result.failures[0].blocking).toBe(false);
      expect(result.problemClass).toBe(ProblemClass.BUSINESS_UNDERSTANDING_PROBLEM);
      expect(result.recommendedRoute).toBe(State.RETURN_TO_RESEARCH);
    });
  });
});
