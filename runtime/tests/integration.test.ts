/**
 * Integration tests for M2.2 with M2.1.
 * 
 * Validates that M2.2 gate evaluation integrates properly with M2.1 state management.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { GateEvaluator } from '../gates/GateEvaluator';
import { GateName, ArtifactType } from '../gates/GateTypes';
import { State } from '../state/StateMachine';
import { StateManager } from '../state/StateManager';
import { MockValidationContext } from './MockValidationContext';

describe('M2.2 Integration with M2.1', () => {
  let context: MockValidationContext;
  let evaluator: GateEvaluator;
  let stateManager: StateManager;
  const testWorkspace = path.join(__dirname, 'test-workspace-integration');
  let projectId: string;

  beforeAll(async () => {
    await fs.mkdir(testWorkspace, { recursive: true });
  });

  beforeEach(async () => {
    // Use unique project ID for each test
    projectId = `integration-test-${Date.now()}`;
    
    context = new MockValidationContext();
    evaluator = new GateEvaluator(context);
    stateManager = new StateManager(testWorkspace);
    
    // Create project directory before initializing
    const projectDir = path.join(testWorkspace, projectId);
    await fs.mkdir(projectDir, { recursive: true });
    
    await stateManager.initializeProject(projectId, State.NEW, 'init-tx');
  });

  afterAll(async () => {
    await fs.rm(testWorkspace, { recursive: true, force: true });
  });

  it('validates transition before calling M2.1', async () => {
    // Setup passing gate validation
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

    // M2.1: transition to RESEARCHING
    await stateManager.transition({
      projectId,
      from: State.NEW,
      to: State.RESEARCHING,
      triggeredBy: 'test',
      txId: 'tx-to-researching'
    });

    // M2.2: evaluate gate
    const gateResult = await evaluator.evaluateTransition(
      projectId,
      State.RESEARCHING,
      State.RESEARCH_READY
    );

    expect(gateResult.passed).toBe(true);
    expect(gateResult.gate).toBe(GateName.RESEARCH_VALIDATION);

    // M2.1: execute transition if gate passed
    if (gateResult.passed) {
      await stateManager.transition({
        projectId,
        from: State.RESEARCHING,
        to: State.RESEARCH_READY,
        triggeredBy: 'gate_passed',
        txId: 'tx-to-research-ready'
      });
    }

    // Verify final state
    const finalState = await stateManager.getCurrentState(projectId);
    expect(finalState).toBe(State.RESEARCH_READY);
  });

  it('prevents transition when gate fails', async () => {
    // Setup failing gate validation (missing artifacts)
    context.setCondition(projectId, 'fabricated_fact_present', false);

    // M2.1: transition to RESEARCHING
    await stateManager.transition({
      projectId,
      from: State.NEW,
      to: State.RESEARCHING,
      triggeredBy: 'test',
      txId: 'tx-to-researching-2'
    });

    // M2.2: evaluate gate
    const gateResult = await evaluator.evaluateTransition(
      projectId,
      State.RESEARCHING,
      State.RESEARCH_READY
    );

    expect(gateResult.passed).toBe(false);

    // Orchestrator would route to exception state instead
    if (!gateResult.passed && gateResult.recommendedRoute) {
      await stateManager.transition({
        projectId,
        from: State.RESEARCHING,
        to: gateResult.recommendedRoute,
        triggeredBy: 'gate_failure',
        txId: 'tx-to-exception'
      });
    }

    // Verify routed to exception state
    const finalState = await stateManager.getCurrentState(projectId);
    expect(finalState).not.toBe(State.RESEARCH_READY);
  });
});
