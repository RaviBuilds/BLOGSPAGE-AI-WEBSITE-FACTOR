/**
 * Orchestrator lifecycle tests (M2.4).
 *
 * Real M2.1 (StateManager/WAL) and real M2.3 (ArtifactRepository) are wired
 * in every scenario; the ValidationContext is a stub in the scenarios that
 * need a gate verdict the frozen production context cannot yet produce
 * (all six gates fail closed under the current condition contract — pinned
 * by ProductionWiring.test.ts). The production-wired vertical slice lives
 * in ResearchVerticalSlice.test.ts.
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 */

import { v4 as uuidv4 } from 'uuid';
import { ArtifactRepository } from '../../artifacts/ArtifactRepository';
import { ArtifactType } from '../../artifacts/ArtifactTypes';
import { State } from '../../state/StateMachine';
import { StateManager } from '../../state/StateManager';
import { WorkspaceManager } from '../../workspace/WorkspaceManager';
import {
  Orchestrator,
  OrchestratorDeps
} from '../../orchestrator/Orchestrator';
import {
  ActionDefinition,
  ExecutionContext,
  FailureType,
  OrchestrationError,
  Worker,
  WorkerOutput
} from '../../orchestrator/types';
import {
  RESEARCH_ACTION,
  StageRegistry
} from '../../orchestrator/StageRegistry';
import {
  AllPassValidationContext,
  FabricatedFactValidationContext,
  MissingArtifactsValidationContext,
  bootstrapResearchProject,
  makeWorkspaceRoot,
  removeWorkspaceRoot,
  researchFixtureDocs,
  saveResearchFixtureSet
} from './helpers';

const projectId = 'orch-proj';

function makeOrchestrator(
  workspaceRoot: string,
  overrides: Partial<OrchestratorDeps> = {}
): Orchestrator {
  return new Orchestrator({
    workspaceRoot,
    validationContext: new AllPassValidationContext(),
    ...overrides
  });
}

/** Stub worker that throws — worker domain failure. */
class FailingWorker implements Worker {
  readonly workerId = 'ResearchWorker';
  readonly version = '0.1.0';
  async execute(): Promise<WorkerOutput> {
    throw new Error('domain explosion');
  }
}

/** Stub worker omitting one declared output. */
class MalformedOutputWorker implements Worker {
  readonly workerId = 'ResearchWorker';
  readonly version = '0.1.0';
  async execute(context: ExecutionContext): Promise<WorkerOutput> {
    return {
      artifacts: researchFixtureDocs(context.executionId)
        .filter(a => a.artifactType !== ArtifactType.BRAND_PROFILE)
        .map(entry => ({
          artifactType: entry.artifactType,
          document: entry.document,
          consumedInputs: []
        })),
      metadata: {
        executionId: context.executionId,
        workerId: this.workerId,
        workerVersion: this.version,
        executedAt: new Date().toISOString(),
        executionDurationMs: 1
      }
    };
  }
}

/** Stub worker whose BRAND_PROFILE fails the canonical schema on write. */
class SchemaInvalidWorker implements Worker {
  readonly workerId = 'ResearchWorker';
  readonly version = '0.1.0';
  async execute(context: ExecutionContext): Promise<WorkerOutput> {
    const docs = researchFixtureDocs(context.executionId).map(entry => ({
      artifactType: entry.artifactType,
      document: entry.document,
      consumedInputs: []
    }));
    // brand-profile requires all five observation arrays.
    const brandProfile = docs.find(
      a => a.artifactType === ArtifactType.BRAND_PROFILE
    )!;
    delete (brandProfile.document as Record<string, unknown>)[
      'observedToneOfVoice'
    ];
    return {
      artifacts: docs,
      metadata: {
        executionId: context.executionId,
        workerId: this.workerId,
        workerVersion: this.version,
        executedAt: new Date().toISOString(),
        executionDurationMs: 1
      }
    };
  }
}

describe('Orchestrator (M2.4)', () => {
  let workspaceRoot: string;

  beforeEach(async () => {
    workspaceRoot = makeWorkspaceRoot('orch');
  });

  afterEach(async () => {
    await removeWorkspaceRoot(workspaceRoot);
  });

  it('stops with no-action on NEW (input stage is M1/human-owned)', async () => {
    const stateManager = new StateManager(workspaceRoot);
    const newProjectId = 'orch-proj-new';
    const ws = new WorkspaceManager(workspaceRoot);
    await ws.createWorkspace(newProjectId);
    await stateManager.initializeProject(newProjectId, State.NEW, uuidv4());

    const summary = await makeOrchestrator(workspaceRoot).run(newProjectId);
    expect(summary.stopped).toBe('no-action-for-state');
    expect(summary.finalState).toBe(State.NEW);
    expect(summary.steps).toEqual([]);
  });

  it('stops terminal at DELIVERED', async () => {
    const ws = new WorkspaceManager(workspaceRoot);
    await ws.createWorkspace(projectId);
    const stateManager = new StateManager(workspaceRoot);
    await stateManager.initializeProject(projectId, State.DELIVERED, uuidv4());

    const summary = await makeOrchestrator(workspaceRoot).run(projectId);
    expect(summary.stopped).toBe('terminal');
    expect(summary.finalState).toBe(State.DELIVERED);
  });

  it('performs the gate-pass path: RESEARCHING → RESEARCH_READY, then stops at the human gate', async () => {
    await bootstrapResearchProject(workspaceRoot, projectId);
    const repo = new ArtifactRepository(workspaceRoot);

    const summary = await makeOrchestrator(workspaceRoot).run(projectId);

    expect(summary.stopped).toBe('human-stop');
    expect(summary.finalState).toBe(State.RESEARCH_READY);
    expect(summary.steps).toHaveLength(1);

    const step = summary.steps[0];
    expect(step.actionId).toBe('RESEARCH_ACTION');
    expect(step.workerId).toBe('ResearchWorker');
    expect(step.gate!.name).toBe('RESEARCH_VALIDATION');
    expect(step.gate!.passed).toBe(true);
    expect(step.transition!.from).toBe(State.RESEARCHING);
    expect(step.transition!.to).toBe(State.RESEARCH_READY);
    expect(step.transition!.txId).not.toBeNull();
    expect(step.persisted).toHaveLength(4);
    expect(step.persisted.every(p => p.version === 1)).toBe(true);

    // Envelope injected by M2.3, not the worker.
    const stored = await repo.getCurrentArtifact(projectId, ArtifactType.BUSINESS_RESEARCH);
    expect(stored['projectId']).toBe(projectId);
    expect(stored['artifactType']).toBe('BUSINESS_RESEARCH');
    expect(stored['artifactVersion']).toBe(1);
    expect(stored['versionStatus']).toBe('CURRENT');
  });

  it('commits an M2.2 route recommendation that is legal from the current state (Seam 1 closed; no invented route)', async () => {
    // SEAM 1 CLOSED (M2.3-B): the frozen FailureRouter maps
    // FACTUAL_INTEGRITY_PROBLEM → RETURN_TO_RESEARCH for ANY current state.
    // Before M2.3-B, state-machine.md §4 gave RESEARCHING no RETURN_TO_* exit,
    // so that canonical recommendation was ILLEGAL from the current state and
    // the orchestrator refused it (ILLEGAL_TRANSITION). M2.3-B added the
    // missing RESEARCHING → RETURN_TO_RESEARCH edge, so the orchestrator now
    // commits exactly M2.2's recommendation and then stops safely at
    // RETURN_TO_RESEARCH. It still invents no route of its own — the
    // destination comes only from recommendedRoute. Transition-table proof:
    // tests/orchestrator/Seam1.test.ts.
    await bootstrapResearchProject(workspaceRoot, projectId);
    const repo = new ArtifactRepository(workspaceRoot);

    const summary = await makeOrchestrator(workspaceRoot, {
      validationContext: new FabricatedFactValidationContext()
    }).run(projectId);

    expect(summary.stopped).toBe('no-action-for-state');
    expect(summary.finalState).toBe(State.RETURN_TO_RESEARCH);
    expect(summary.steps[0].gate!.recommendedRoute).toBe(State.RETURN_TO_RESEARCH);
    expect(summary.steps[0].transition).toMatchObject({
      from: State.RESEARCHING,
      to: State.RETURN_TO_RESEARCH
    });

    // Artifact-first held: the worker's artifacts were persisted BEFORE the
    // gate verdict was routed.
    expect(await repo.hasArtifact(projectId, ArtifactType.BUSINESS_RESEARCH)).toBe(true);
    const stateManager = new StateManager(workspaceRoot);
    expect(await stateManager.getCurrentState(projectId)).toBe(State.RETURN_TO_RESEARCH);
  });

  it('routes a content problem to NEEDS_CONTENT and stops at the human-stop state', async () => {
    await bootstrapResearchProject(workspaceRoot, projectId);

    const summary = await makeOrchestrator(workspaceRoot, {
      validationContext: new MissingArtifactsValidationContext()
    }).run(projectId);

    expect(summary.stopped).toBe('human-stop');
    expect(summary.finalState).toBe(State.NEEDS_CONTENT);
    expect(summary.steps[0].gate!.recommendedRoute).toBe(State.NEEDS_CONTENT);
    expect(summary.steps[0].transition!.to).toBe(State.NEEDS_CONTENT);
  });

  it('fails closed with WORKER_NOT_FOUND for an unregistered worker id', async () => {
    await bootstrapResearchProject(workspaceRoot, projectId);
    const registry = new StageRegistry([
      { ...RESEARCH_ACTION, workerId: 'GhostWorker' }
    ]);

    await expect(
      makeOrchestrator(workspaceRoot, { stageRegistry: registry }).run(projectId)
    ).rejects.toMatchObject({ failureType: FailureType.WORKER_NOT_FOUND });
  });

  it('fails closed with WORKER_EXECUTION_ERROR when the worker throws', async () => {
    await bootstrapResearchProject(workspaceRoot, projectId);

    await expect(
      makeOrchestrator(workspaceRoot, { workers: [new FailingWorker()] }).run(projectId)
    ).rejects.toMatchObject({ failureType: FailureType.WORKER_EXECUTION_ERROR });

    // Nothing persisted before the failure.
    const repo = new ArtifactRepository(workspaceRoot);
    expect(await repo.hasArtifact(projectId, ArtifactType.BUSINESS_RESEARCH)).toBe(false);
  });

  it('fails closed with WORKER_OUTPUT_INVALID on a malformed output envelope', async () => {
    await bootstrapResearchProject(workspaceRoot, projectId);

    await expect(
      makeOrchestrator(workspaceRoot, { workers: [new MalformedOutputWorker()] }).run(projectId)
    ).rejects.toMatchObject({ failureType: FailureType.WORKER_OUTPUT_INVALID });

    const repo = new ArtifactRepository(workspaceRoot);
    expect(await repo.hasArtifact(projectId, ArtifactType.BUSINESS_RESEARCH)).toBe(false);
  });

  it('fails closed with ARTIFACT_PERSISTENCE_FAILED on a schema-invalid document', async () => {
    await bootstrapResearchProject(workspaceRoot, projectId);

    await expect(
      makeOrchestrator(workspaceRoot, { workers: [new SchemaInvalidWorker()] }).run(projectId)
    ).rejects.toMatchObject({ failureType: FailureType.ARTIFACT_PERSISTENCE_FAILED });

    // The step is abandoned before gate evaluation — state unchanged.
    const stateManager = new StateManager(workspaceRoot);
    expect(await stateManager.getCurrentState(projectId)).toBe(State.RESEARCHING);
  });

  it('fails closed with ILLEGAL_TRANSITION instead of forcing an illegal transition', async () => {
    await bootstrapResearchProject(workspaceRoot, projectId);
    // A deliberately wrong success target (RESEARCHING → DELIVERED is not
    // legal per state-machine.md §4) — the orchestrator must refuse.
    const badAction: ActionDefinition = {
      ...RESEARCH_ACTION,
      actionId: 'BAD_TARGET_STAGE',
      transitionOnSuccess: { to: State.DELIVERED }
    };
    const registry = new StageRegistry([badAction]);

    await expect(
      makeOrchestrator(workspaceRoot, { stageRegistry: registry }).run(projectId)
    ).rejects.toMatchObject({ failureType: FailureType.ILLEGAL_TRANSITION });

    const stateManager = new StateManager(workspaceRoot);
    expect(await stateManager.getCurrentState(projectId)).toBe(State.RESEARCHING);
  });

  it('fails closed with PROJECT_INPUT_UNAVAILABLE when the business input is missing', async () => {
    // Workspace + state, but no input/business-input.yaml.
    const ws = new WorkspaceManager(workspaceRoot);
    await ws.createWorkspace(projectId);
    const stateManager = new StateManager(workspaceRoot);
    await stateManager.initializeProject(projectId, State.NEW, uuidv4());
    await stateManager.transition({
      projectId,
      txId: uuidv4(),
      from: State.NEW,
      to: State.RESEARCHING,
      triggeredBy: 'test:bootstrap'
    });

    await expect(makeOrchestrator(workspaceRoot).run(projectId)).rejects.toMatchObject({
      failureType: FailureType.PROJECT_INPUT_UNAVAILABLE
    });
  });

  it('stops at a human-stop state and never re-runs reached work', async () => {
    await bootstrapResearchProject(workspaceRoot, projectId);
    const repo = new ArtifactRepository(workspaceRoot);
    await saveResearchFixtureSet(repo, projectId, 'pre-existing');
    const stateManager = new StateManager(workspaceRoot);
    await stateManager.transition({
      projectId,
      txId: uuidv4(),
      from: State.RESEARCHING,
      to: State.RESEARCH_READY,
      triggeredBy: 'test:manual'
    });

    const summary = await makeOrchestrator(workspaceRoot).run(projectId);

    expect(summary.stopped).toBe('human-stop');
    expect(summary.finalState).toBe(State.RESEARCH_READY);
    expect(summary.steps).toHaveLength(0);
  });

  it('completes an interrupted transition via reconciliation without re-running the worker', async () => {
    await bootstrapResearchProject(workspaceRoot, projectId);
    const repo = new ArtifactRepository(workspaceRoot);
    // Crash boundary 6: artifacts persisted, gate passed, transition never ran.
    await saveResearchFixtureSet(repo, projectId, 'crashed-exec');

    const summary = await makeOrchestrator(workspaceRoot).run(projectId);

    expect(summary.finalState).toBe(State.RESEARCH_READY);
    expect(summary.stopped).toBe('human-stop');
    expect(summary.steps).toHaveLength(1);
    expect(summary.steps[0].actionId).toBe('RESEARCH_ACTION');
    expect(summary.steps[0].workerId).toBeNull(); // reconciliation, not a re-run
    expect(summary.steps[0].transition!.to).toBe(State.RESEARCH_READY);

    // The worker did NOT re-run: still the crashed execution's single version.
    const stored = await repo.getCurrentArtifact(projectId, ArtifactType.BUSINESS_RESEARCH);
    expect(stored['artifactVersion']).toBe(1);
    expect(stored['artifactId']).toBe('crashed-exec-BR');
  });

  it('routes every production gate failure through M2.2 (the route-less branch is unreachable under frozen M2.2)', async () => {
    await bootstrapResearchProject(workspaceRoot, projectId);

    // The route-less fail-closed branch in the orchestrator defends against
    // an evaluator-contract violation (a FAIL result with no
    // recommendedRoute). Under the frozen M2.2 FailureRouter every problem
    // class — including UNCLEAR — resolves to a route, so that branch cannot
    // be reached through production wiring; it is covered at the coordinator
    // boundary in GateCoordinator.test.ts. This test pins the observable
    // contract: production gate failures arrive WITH M2.2's route and are
    // followed verbatim.
    const summary = await makeOrchestrator(workspaceRoot, {
      validationContext: new MissingArtifactsValidationContext()
    }).run(projectId);

    expect(summary.steps[0].gate!.passed).toBe(false);
    expect(summary.steps[0].gate!.recommendedRoute).toBe(State.NEEDS_CONTENT);
    expect(summary.steps[0].transition!.to).toBe(State.NEEDS_CONTENT);
  });

  it('rethrows an OrchestrationError raised by a worker as-is', async () => {
    await bootstrapResearchProject(workspaceRoot, projectId);

    class TypedFailureWorker implements Worker {
      readonly workerId = 'ResearchWorker';
      readonly version = '0.1.0';
      async execute(): Promise<WorkerOutput> {
        throw new OrchestrationError(
          FailureType.WORKER_EXECUTION_ERROR,
          'domain failure surfaced as a typed orchestration error',
          projectId
        );
      }
    }

    await expect(
      makeOrchestrator(workspaceRoot, { workers: [new TypedFailureWorker()] }).run(projectId)
    ).rejects.toMatchObject({
      failureType: FailureType.WORKER_EXECUTION_ERROR,
      message: /typed orchestration error/
    });
  });

  it('freezes exact resolved input versions into the worker ExecutionContext when the action declares inputs', async () => {
    await bootstrapResearchProject(workspaceRoot, projectId);
    const repo = new ArtifactRepository(workspaceRoot);
    // Pre-persist an input the (custom) action declares, then verify the
    // orchestrator resolves its exact CURRENT version and hands the worker a
    // frozen snapshot containing it (Sections D + E).
    const inputDoc = researchFixtureDocs('input-exec')[0];
    await repo.saveArtifact(projectId, inputDoc.artifactType, inputDoc.document);

    let capturedContext: ExecutionContext | null = null;
    class CapturingWorker implements Worker {
      readonly workerId = 'ResearchWorker';
      readonly version = '0.1.0';
      async execute(context: ExecutionContext): Promise<WorkerOutput> {
        capturedContext = context;
        // Produce exactly the action's declared outputs.
        const docs = researchFixtureDocs(context.executionId).filter(entry =>
          context.expectedOutputs.includes(entry.artifactType)
        );
        return {
          artifacts: docs.map(entry => ({
            artifactType: entry.artifactType,
            document: entry.document,
            consumedInputs: context.inputs.map(i => ({
              artifactType: i.artifactType,
              version: i.version,
              artifactId: i.artifactId
            }))
          })),
          metadata: {
            executionId: context.executionId,
            workerId: this.workerId,
            workerVersion: this.version,
            executedAt: new Date().toISOString(),
            executionDurationMs: 1
          }
        };
      }
    }

    const registry = new StageRegistry([
      {
        ...RESEARCH_ACTION,
        actionId: 'INPUT_TEST_ACTION',
        // The declared input (BUSINESS_RESEARCH, persisted above) is NOT an
        // expected output of this action — reconciliation therefore treats
        // the run as a fresh execution and the worker runs with the frozen
        // input snapshot.
        requiredInputs: [ArtifactType.BUSINESS_RESEARCH],
        expectedOutputs: [ArtifactType.BUSINESS_INTELLIGENCE]
      }
    ]);
    const summary = await makeOrchestrator(workspaceRoot, {
      stageRegistry: registry,
      workers: [new CapturingWorker()]
    }).run(projectId);

    expect(summary.finalState).toBe(State.RESEARCH_READY);
    expect(capturedContext).not.toBeNull();
    const context = capturedContext!;
    expect(context.inputs).toHaveLength(1);
    expect(context.inputs[0].artifactType).toBe(ArtifactType.BUSINESS_RESEARCH);
    expect(context.inputs[0].version).toBe(1);
    expect(context.inputs[0].artifactId).toBe('input-exec-BR');
    // Section D: the resolved input snapshot is frozen before dispatch.
    expect(Object.isFrozen(context)).toBe(true);
    expect(Object.isFrozen(context.inputs)).toBe(true);
    expect(Object.isFrozen(context.inputs[0])).toBe(true);
    // Section H: the worker declared the exact consumed versions; the
    // orchestrator preserved them on the persisted record trail.
    expect(summary.steps[0].inputVersions).toEqual([
      { artifactType: 'BUSINESS_RESEARCH', version: 1 }
    ]);
  });

  it('honours the max-steps bound', async () => {
    await bootstrapResearchProject(workspaceRoot, projectId);

    const summary = await makeOrchestrator(workspaceRoot, {
      maxStepsPerRun: 1
    }).run(projectId);

    expect(summary.stopped).toBe('max-steps');
    expect(summary.steps).toHaveLength(1);
    expect(summary.finalState).toBe(State.RESEARCH_READY);
  });

  it('produces an idempotent resume: a second run after the human stop changes nothing', async () => {
    await bootstrapResearchProject(workspaceRoot, projectId);
    const orchestrator = makeOrchestrator(workspaceRoot);

    const first = await orchestrator.run(projectId);
    expect(first.finalState).toBe(State.RESEARCH_READY);

    const second = await orchestrator.resume(projectId);
    expect(second.stopped).toBe('human-stop');
    expect(second.finalState).toBe(State.RESEARCH_READY);
    expect(second.steps).toHaveLength(0);
  });
});


