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
 * SEAM 1 CLOSED (M2.3-B) — this file no longer pins an ILLEGAL_TRANSITION.
 * Under the frozen condition contract (17 of 27 M2.2 conditions unresolved;
 * M2.3-B formalizes their contracts but deliberately does NOT resolve the
 * semantic ones), the Research Validation gate fails closed — see
 * ProductionWiring.test.ts T3, accepted at the M2.3-A freeze. The research
 * artifacts ARE produced and persisted (artifact-first), the gate IS
 * evaluated, and its fail-closed verdict IS classified
 * FACTUAL_INTEGRITY_PROBLEM, which the frozen FailureRouter routes to
 * RETURN_TO_RESEARCH.
 *
 * That recommendation used to be ILLEGAL: state-machine.md §2/§4 gave
 * RESEARCHING no RETURN_TO_* exit, so M2.4 refused to force it
 * (ILLEGAL_TRANSITION) and recorded the canonical-seam finding for
 * factory-level resolution. M2.3-B resolved it by adding the missing edge
 * (RESEARCHING → RETURN_TO_RESEARCH) to state-machine.md and
 * TransitionTable — no orchestration logic was added, because the edge alone
 * makes the existing gate-failure routing legal. The run now commits the
 * canonical route and then stops safely: RETURN_TO_RESEARCH has no
 * registered action, and its only legal exit (→ RESEARCHING) belongs to the
 * human/future milestone that supplies the corrected facts, exactly as for
 * the NEEDS_* return states.
 *
 * The pass path (gate contract permits → RESEARCHING → RESEARCH_READY) is
 * proven in Orchestrator.test.ts with a stub ValidationContext: the
 * orchestrator's pass branch is real and exercised; only the gate's
 * condition resolution is outstanding.
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
import { RunSummary } from '../../orchestrator/types';
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
  //
  // No try/catch: since Seam 1 closed, the canonical route is legal and the
  // run stops cleanly. A thrown OrchestrationError here is a real regression
  // and must fail the test rather than be swallowed.
  async function runSlice(): Promise<RunSummary> {
    return orchestrator.run(projectId);
  }

  it('T1: produces all four research artifacts BEFORE the gate verdict, commits the canonical seam route, and stops safely', async () => {
    const summary = await runSlice();

    // SEAM 1 CLOSED (M2.3-B): the frozen condition contract makes the Research
    // Validation gate fail closed; the dominant blocking failure carries
    // FACTUAL_INTEGRITY_PROBLEM; the frozen FailureRouter recommends
    // RETURN_TO_RESEARCH — and that route is now LEGAL from RESEARCHING. The
    // orchestrator commits it, then stops safely: RETURN_TO_RESEARCH has no
    // registered action, and its only legal exit (→ RESEARCHING) belongs to
    // the human/future milestone that supplies the corrected facts.
    expect(summary.stopped).toBe('no-action-for-state');
    expect(summary.finalState).toBe(State.RETURN_TO_RESEARCH);
    expect(summary.steps).toHaveLength(1);

    const step = summary.steps[0];
    expect(step.fromState).toBe(State.RESEARCHING);
    expect(step.gate!.passed).toBe(false);
    expect(step.gate!.recommendedRoute).toBe(State.RETURN_TO_RESEARCH);
    expect(step.transition).toMatchObject({
      from: State.RESEARCHING,
      to: State.RETURN_TO_RESEARCH
    });

    // Artifact-first ordering held: all four artifacts were persisted BEFORE
    // the gate verdict and remain intact.
    for (const artifactType of [
      ArtifactType.BUSINESS_RESEARCH,
      ArtifactType.BUSINESS_INTELLIGENCE,
      ArtifactType.ASSET_INVENTORY,
      ArtifactType.BRAND_PROFILE
    ]) {
      expect(await repo.hasArtifact(projectId, artifactType)).toBe(true);
    }

    const stateManager = new StateManager(workspaceRoot);
    expect(await stateManager.getCurrentState(projectId)).toBe(State.RETURN_TO_RESEARCH);
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

  it('T5: the M2.1 WAL records exactly the canonical seam route — one orchestrator transition to RETURN_TO_RESEARCH, never an invented route', async () => {
    await runSlice();

    const stateManager = new StateManager(workspaceRoot);
    const history = await stateManager.getStateHistory(projectId);
    const triggeredBy = history.transitions.map(t => t.triggeredBy);

    // Bootstrap (NEW → RESEARCHING, triggered by the test helper) plus
    // exactly ONE orchestrator transition: the M2.2-recommended route, which
    // Seam 1 made legal. The orchestrator added no route of its own, and the
    // count is pinned so an invented or duplicated transition cannot hide.
    expect(triggeredBy.filter(t => t.startsWith('test:'))).toHaveLength(1);
    expect(triggeredBy.filter(t => t.startsWith('orchestrator:'))).toHaveLength(1);

    const last = history.transitions[history.transitions.length - 1];
    expect(last.from).toBe(State.RESEARCHING);
    expect(last.to).toBe(State.RETURN_TO_RESEARCH);
    expect(last.triggeredBy).toBe('orchestrator:gate-fail:RESEARCH_VALIDATION');

    expect(await stateManager.getCurrentState(projectId)).toBe(State.RETURN_TO_RESEARCH);
  });
});

