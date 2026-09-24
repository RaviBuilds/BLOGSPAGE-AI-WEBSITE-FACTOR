/**
 * Reconciliation tests — state/artifact divergence detection and crash
 * recovery, using the real M2.1 StateManager and M2.3 ArtifactRepository.
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 */

import { ArtifactRepository } from '../../artifacts/ArtifactRepository';
import { GateEvaluator } from '../../gates/GateEvaluator';
import { State } from '../../state/StateMachine';
import { StateManager } from '../../state/StateManager';
import { v4 as uuidv4 } from 'uuid';
import { Orchestrator } from '../../orchestrator/Orchestrator';
import { StageRegistry } from '../../orchestrator/StageRegistry';
import { GateCoordinator } from '../../orchestrator/coordination/GateCoordinator';
import { Reconciliation } from '../../orchestrator/coordination/Reconciliation';
import { TransitionCoordinator } from '../../orchestrator/coordination/TransitionCoordinator';
import { FailureType, OrchestrationError } from '../../orchestrator/types';
import {
  AllPassValidationContext,
  bootstrapResearchProject,
  makeWorkspaceRoot,
  removeWorkspaceRoot,
  researchFixtureDocs,
  saveResearchFixtureSet
} from './helpers';

describe('Reconciliation (M2.4)', () => {
  const projectId = 'recon-proj';
  let workspaceRoot: string;
  let repo: ArtifactRepository;
  let reconciliation: Reconciliation;
  let stageRegistry: StageRegistry;
  let gateCoordinator: GateCoordinator;
  let transitionCoordinator: TransitionCoordinator;
  let stateManager: StateManager;

  beforeEach(async () => {
    workspaceRoot = makeWorkspaceRoot('recon');
    stateManager = await bootstrapResearchProject(workspaceRoot, projectId);
    repo = new ArtifactRepository(workspaceRoot);
    stageRegistry = new StageRegistry();
    gateCoordinator = new GateCoordinator(
      new GateEvaluator(new AllPassValidationContext())
    );
    transitionCoordinator = new TransitionCoordinator(stateManager);
    reconciliation = new Reconciliation(
      stageRegistry,
      repo,
      gateCoordinator,
      transitionCoordinator
    );
  });

  afterEach(async () => {
    await removeWorkspaceRoot(workspaceRoot);
  });

  it('reports no divergence for an action without expected outputs', async () => {
    const noOutputAction = {
      actionId: 'NO_OUTPUT_TEST_ACTION',
      workerId: null,
      workerVersion: '0.0.0',
      applicableStates: [State.RETURN_TO_RESEARCH],
      requiredInputs: [],
      expectedOutputs: [],
      gateAfterAction: null,
      transitionOnSuccess: { to: State.RESEARCHING },
      requiresProjectInput: false
    };
    const outcome = await reconciliation.reconcileBeforeAction(
      projectId,
      State.RETURN_TO_RESEARCH,
      noOutputAction
    );
    expect(outcome.completedTransition).toBe(false);
  });

  it('reports a fresh start when none of the expected outputs exist', async () => {
    const action = stageRegistry.getActionForState(State.RESEARCHING)!;
    const outcome = await reconciliation.reconcileBeforeAction(
      projectId,
      State.RESEARCHING,
      action
    );
    expect(outcome.completedTransition).toBe(false);
    expect(outcome.diagnosis).toContain('fresh');
  });

  it('fails closed on a PARTIAL artifact set (RESTART_AMBIGUITY)', async () => {
    const action = stageRegistry.getActionForState(State.RESEARCHING)!;
    const docs = researchFixtureDocs('partial-exec');
    // Persist only two of the four expected outputs.
    await repo.saveArtifact(projectId, docs[0].artifactType, docs[0].document);
    await repo.saveArtifact(projectId, docs[1].artifactType, docs[1].document);

    await expect(
      reconciliation.reconcileBeforeAction(projectId, State.RESEARCHING, action)
    ).rejects.toMatchObject({ failureType: FailureType.RESTART_AMBIGUITY });
  });

  it('fails closed when a state is reached without its producing artifacts (RESTART_AMBIGUITY)', async () => {
    // Simulate external/manual advancement: RESEARCHING → RESEARCH_READY
    // with NO artifacts persisted. The divergence check must refuse.
    await stateManager.transition({
      projectId,
      txId: uuidv4(),
      from: State.RESEARCHING,
      to: State.RESEARCH_READY,
      triggeredBy: 'test:manual-divergence'
    });

    await expect(
      reconciliation.verifyStateArtifacts(projectId, State.RESEARCH_READY)
    ).rejects.toMatchObject({ failureType: FailureType.RESTART_AMBIGUITY });

    // And the full orchestrator run surfaces the same fail-closed refusal.
    const orchestrator = new Orchestrator({
      workspaceRoot,
      validationContext: new AllPassValidationContext()
    });
    await expect(orchestrator.run(projectId)).rejects.toBeInstanceOf(
      OrchestrationError
    );
  });

  it('completes the interrupted transition when the gate passes on re-evaluation', async () => {
    const action = stageRegistry.getActionForState(State.RESEARCHING)!;
    await saveResearchFixtureSet(repo, projectId, 'crash-exec');

    const outcome = await reconciliation.reconcileBeforeAction(
      projectId,
      State.RESEARCHING,
      action
    );

    expect(outcome.completedTransition).toBe(true);
    expect(await stateManager.getCurrentState(projectId)).toBe(State.RESEARCH_READY);
  });

  it('proceeds with the normal action flow (no double routing) when the gate fails on re-evaluation', async () => {
    const action = stageRegistry.getActionForState(State.RESEARCHING)!;
    await saveResearchFixtureSet(repo, projectId, 'crash-exec');

    const failing = new Reconciliation(
      stageRegistry,
      repo,
      new GateCoordinator(
        // Every condition false → gate fails; reconciliation must NOT route
        // by itself (that happens exactly once in the normal action flow).
        new GateEvaluator({
          hasArtifact: async () => true,
          checkCondition: async () => false
        })
      ),
      transitionCoordinator
    );

    const outcome = await failing.reconcileBeforeAction(
      projectId,
      State.RESEARCHING,
      action
    );

    expect(outcome.completedTransition).toBe(false);
    expect(outcome.diagnosis).toContain('gate fails');
    // State untouched by reconciliation itself.
    expect(await stateManager.getCurrentState(projectId)).toBe(State.RESEARCHING);
  });

  it('verifyStateArtifacts passes when the producing action outputs all exist', async () => {
    await saveResearchFixtureSet(repo, projectId, 'ok-exec');
    await expect(
      reconciliation.verifyStateArtifacts(projectId, State.RESEARCH_READY)
    ).resolves.toBeUndefined();
  });

  it('is a no-op for states that are no action success target', async () => {
    await expect(
      reconciliation.verifyStateArtifacts(projectId, State.RESEARCHING)
    ).resolves.toBeUndefined();
    await expect(
      reconciliation.verifyStateArtifacts(projectId, State.RETURN_TO_RESEARCH)
    ).resolves.toBeUndefined();
  });


});
