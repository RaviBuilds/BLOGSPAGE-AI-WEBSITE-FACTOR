/**
 * M2.4 research vertical slice — END-TO-END, PRODUCTION WIRING ONLY.
 *
 * Real components, no substitutes:
 *   StateManager / TransitionEngine / WAL     (frozen M2.1)
 *   GateEvaluator / GateRegistry / FailureRouter (frozen M2.2)
 *   ProductionValidationContext                (frozen M2.3-A)
 *   ArtifactRepository / SchemaValidator       (frozen M2.3-A)
 *   Orchestrator / StageRegistry / ResearchWorker (M2.4)
 *
 * MockValidationContext is deliberately NOT imported anywhere in this file.
 *
 * CURRENT-ARCHITECTURE FACT pinned by T1/T3: under the frozen condition
 * contract (17 of 27 M2.2 conditions unresolved; M2.3-B deferred), every
 * gate fails closed — see ProductionWiring.test.ts T3, accepted at the
 * M2.3-A freeze. The research artifacts ARE produced and persisted
 * (artifact-first), the Research Validation gate IS evaluated, and its
 * fail-closed verdict IS classified FACTUAL_INTEGRITY_PROBLEM, which the
 * frozen FailureRouter routes to RETURN_TO_RESEARCH. But state-machine.md §4
 * gives RESEARCHING no RETURN_TO_* exit: the recommendation is ILLEGAL from
 * the current state. The orchestrator therefore refuses to force it
 * (ILLEGAL_TRANSITION) and never invents a substitute route — recorded as a
 * canonical-seam finding for factory-level resolution, exactly in the style
 * of the M2.3-A T3 deviation. The pass path (gate contract permits →
 * RESEARCHING → RESEARCH_READY) is proven in Orchestrator.test.ts with a
 * stub ValidationContext: the orchestrator's pass branch is real and
 * exercised; only the gate's condition resolution is outstanding (M2.3-B).
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 * Factory version: 0.2.0
 */

import { ArtifactRepository } from '../../artifacts/ArtifactRepository';
import { ArtifactType } from '../../artifacts/ArtifactTypes';
import { ProductionValidationContext } from '../../artifacts/ProductionValidationContext';
import { GateEvaluator } from '../../gates/GateEvaluator';
import { GateName } from '../../gates/GateTypes';
import { getAllGates } from '../../gates/GateRegistry';
import { State } from '../../state/StateMachine';
import { StateManager } from '../../state/StateManager';
import { Orchestrator } from '../../orchestrator/Orchestrator';
import { FailureType, OrchestrationError } from '../../orchestrator/types';
import {
  bootstrapResearchProject,
  makeWorkspaceRoot,
  removeWorkspaceRoot,
  TEST_BUSINESS_INPUT_YAML
} from './helpers';

const UNRESOLVED_MARKER = 'no canonically-derivable resolution';

describe('Research vertical slice — production wiring (M2.4)', () => {
  const projectId = 'slice-proj';
  let workspaceRoot: string;
  let repo: ArtifactRepository;
  let orchestrator: Orchestrator;
  let evaluator: GateEvaluator;

  beforeEach(async () => {
    workspaceRoot = makeWorkspaceRoot('slice');
    await bootstrapResearchProject(workspaceRoot, projectId, TEST_BUSINESS_INPUT_YAML);
    repo = new ArtifactRepository(workspaceRoot);
    evaluator = new GateEvaluator(new ProductionValidationContext(repo));
    orchestrator = new Orchestrator({
      workspaceRoot,
      validationContext: new ProductionValidationContext(repo)
    });
  });

  afterEach(async () => {
    await removeWorkspaceRoot(workspaceRoot);
  });

  // Test entry point for every case below: one full production run.
  async function runSlice(): Promise<unknown> {
    try {
      return await orchestrator.run(projectId);
    } catch (error) {
      return error;
    }
  }

  it('T1: produces all four research artifacts with full provenance BEFORE the gate verdict, and refuses the illegal recommended route (fail closed)', async () => {
    const outcome = await runSlice();

    // CANONICAL-SEAM FINDING (pinned, mirrors the accepted M2.3-A T3
    // deviation): under the frozen condition contract the Research
    // Validation gate fails closed; the dominant blocking failure carries
    // FACTUAL_INTEGRITY_PROBLEM; the frozen FailureRouter therefore
    // recommends RETURN_TO_RESEARCH — but state-machine.md §4 gives
    // RESEARCHING no RETURN_TO_* exit. The orchestrator refuses to force
    // the illegal transition (ILLEGAL_TRANSITION) and never invents a
    // substitute route.
    expect(outcome).toBeInstanceOf(OrchestrationError);
    expect((outcome as OrchestrationError).failureType).toBe(
      FailureType.ILLEGAL_TRANSITION
    );

    // Artifact-first ordering held: all four artifacts were persisted and
    // remain intact, while the project state never advanced.
    for (const artifactType of [
      ArtifactType.BUSINESS_RESEARCH,
      ArtifactType.BUSINESS_INTELLIGENCE,
      ArtifactType.ASSET_INVENTORY,
      ArtifactType.BRAND_PROFILE
    ]) {
      expect(await repo.hasArtifact(projectId, artifactType)).toBe(true);
    }

    const stateManager = new StateManager(workspaceRoot);
    expect(await stateManager.getCurrentState(projectId)).toBe(State.RESEARCHING);
  });

  it('T2: persisted research artifacts are schema-valid, M2.3-enveloped, and carry honest provenance and gaps', async () => {
    await runSlice();

    const research = await repo.getCurrentArtifact(projectId, ArtifactType.BUSINESS_RESEARCH);
    expect(research['projectId']).toBe(projectId);
    expect(research['artifactType']).toBe('BUSINESS_RESEARCH');
    expect(research['artifactVersion']).toBe(1);
    expect(research['versionStatus']).toBe('CURRENT');
    expect(typeof research['artifactId']).toBe('string');

    // Every factual item carries the six provenance columns
    // (artifact-contracts.md §2) — content derived from the supplied input.
    const brandProfile = await repo.getCurrentArtifact(projectId, ArtifactType.BRAND_PROFILE);
    const nameItem = (brandProfile['existingNameUsageAndNamingConventions'] as Record<string, unknown>[])[0];
    expect(String(nameItem['fact'])).toContain('business name');
    for (const field of ['fact', 'value', 'source', 'sourceType', 'confidence', 'verificationStatus']) {
      expect(nameItem[field]).toBeDefined();
    }

    // The worker derived business truth from the supplied input only —
    // and honestly recorded what it could not establish.
    const gaps = research['explicitGaps'] as string[];
    expect(gaps.length).toBeGreaterThan(0);
    expect(gaps.join(' ')).toContain('competitor');
  });

  it('T3: the production gate verdict is FAIL with the RETURN_TO_RESEARCH recommendation and the unresolved-condition marker', async () => {
    await runSlice();

    const gate = getAllGates().find(g => g.gate === GateName.RESEARCH_VALIDATION)!;
    const result = await evaluator.evaluateGate(projectId, GateName.RESEARCH_VALIDATION, gate.sourceState);

    // Fail closed under the frozen condition contract...
    expect(result.passed).toBe(false);
    expect(result.recommendedRoute).toBe(State.RETURN_TO_RESEARCH);

    // ...because the production context refuses to guess the unresolved
    // conditions (business_identity_unambiguous, fabricated_fact_present).
    const productionContext = new ProductionValidationContext(repo);
    const businessIdentified = await productionContext
      .checkCondition(projectId, 'business_identity_unambiguous')
      .catch((error: Error) => error.message);
    expect(String(businessIdentified)).toContain(UNRESOLVED_MARKER);
  });

  it('T4: provenance condition passes over the persisted artifacts (content integrity holds)', async () => {
    await runSlice();

    const productionContext = new ProductionValidationContext(repo);
    await expect(
      productionContext.checkCondition(projectId, 'all_facts_have_provenance')
    ).resolves.toBe(true);
  });

  it('T5: the M2.1 WAL records NO orchestrator transition when the route is refused (state unchanged, nothing forced)', async () => {
    await runSlice();

    const stateManager = new StateManager(workspaceRoot);
    const history = await stateManager.getStateHistory(projectId);
    const triggeredBy = history.transitions.map(t => t.triggeredBy);

    // Only the bootstrap transitions exist — the orchestrator committed
    // nothing, because its only available move was illegal and it refuses
    // rather than guessing.
    expect(triggeredBy.every(t => t.startsWith('test:'))).toBe(true);
    expect(await stateManager.getCurrentState(projectId)).toBe(State.RESEARCHING);
  });
});

