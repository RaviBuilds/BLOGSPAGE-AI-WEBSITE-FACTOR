/**
 * TransitionCoordinator tests — thin delegation to the real frozen M2.1
 * StateManager / TransitionTable (Section J).
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 */

import { v4 as uuidv4 } from 'uuid';
import { State } from '../../state/StateMachine';
import { StateManager } from '../../state/StateManager';
import { TransitionCoordinator } from '../../orchestrator/coordination/TransitionCoordinator';
import { FailureType } from '../../orchestrator/types';
import {
  bootstrapResearchProject,
  makeWorkspaceRoot,
  removeWorkspaceRoot
} from './helpers';

describe('TransitionCoordinator (M2.4)', () => {
  const projectId = 'txc-proj';
  let workspaceRoot: string;
  let stateManager: StateManager;
  let coordinator: TransitionCoordinator;

  beforeEach(async () => {
    workspaceRoot = makeWorkspaceRoot('txc');
    stateManager = await bootstrapResearchProject(workspaceRoot, projectId);
    coordinator = new TransitionCoordinator(stateManager);
  });

  afterEach(async () => {
    await removeWorkspaceRoot(workspaceRoot);
  });

  it('delegates a legal transition to M2.1 and generates a unique txId', async () => {
    const result = await coordinator.requestTransition(
      projectId,
      State.RESEARCHING,
      State.RESEARCH_READY,
      'test:txc'
    );

    expect(result.idempotent).toBe(false);
    expect(result.alreadyCommitted).toBe(false);
    expect(result.txId).toBeTruthy();
    expect(result.from).toBe(State.RESEARCHING);
    expect(result.to).toBe(State.RESEARCH_READY);

    // M2.1's WAL is authoritative: the transition really happened there.
    expect(await stateManager.getCurrentState(projectId)).toBe(State.RESEARCH_READY);
  });

  it('generates distinct txIds for distinct logical transitions', async () => {
    const a = await coordinator.requestTransition(
      projectId,
      State.RESEARCHING,
      State.RESEARCH_READY,
      'test:txc-a'
    );

    const otherProject = 'txc-proj-2';
    const wsManager = await import('../../workspace/WorkspaceManager');
    const ws = new wsManager.WorkspaceManager(workspaceRoot);
    await ws.createWorkspace(otherProject);
    const sm2 = new StateManager(workspaceRoot);
    await sm2.initializeProject(otherProject, State.NEW, uuidv4());
    const coordinator2 = new TransitionCoordinator(sm2);
    const b = await coordinator2.requestTransition(
      otherProject,
      State.NEW,
      State.RESEARCHING,
      'test:txc-b'
    );

    expect(a.txId).not.toBe(b.txId);
  });

  it('applies M2.1 idempotency when the SAME logical transition is retried with the same txId', async () => {
    const sharedTxId = 'logical-transition-tx-1';

    const first = await coordinator.requestTransition(
      projectId,
      State.RESEARCHING,
      State.RESEARCH_READY,
      'test:txc-retry',
      undefined,
      sharedTxId
    );
    expect(first.idempotent).toBe(false);

    // Same logical transition, same txId: M2.1 deduplicates semantically
    // (same from/to/triggeredBy) instead of recording a new transaction.
    const retry = await coordinator.requestTransition(
      projectId,
      State.RESEARCHING,
      State.RESEARCH_READY,
      'test:txc-retry',
      undefined,
      sharedTxId
    );

    expect(retry.txId).toBe(sharedTxId);
    expect(first.txId).toBe(sharedTxId);
    expect(retry.idempotent).toBe(true);
    expect(retry.alreadyCommitted).toBe(true);
    expect(await stateManager.getCurrentState(projectId)).toBe(State.RESEARCH_READY);
  });

  it('refuses an illegal transition without touching M2.1', async () => {
    // RESEARCHING → DELIVERED is not legal per state-machine.md §4.
    await expect(
      coordinator.requestTransition(
        projectId,
        State.RESEARCHING,
        State.DELIVERED,
        'test:txc-illegal'
      )
    ).rejects.toMatchObject({ failureType: FailureType.ILLEGAL_TRANSITION });

    expect(await stateManager.getCurrentState(projectId)).toBe(State.RESEARCHING);
  });

  it('wraps an M2.1 rejection (state drift) as TRANSITION_EXECUTION_FAILED', async () => {
    // The WAL is authoritative: request a table-legal transition whose
    // `from` no longer matches the actual state (the project was already
    // advanced to RESEARCH_READY) — M2.1's drift detection fires, which the
    // coordinator wraps as a typed infrastructure failure.
    await stateManager.transition({
      projectId,
      txId: uuidv4(),
      from: State.RESEARCHING,
      to: State.RESEARCH_READY,
      triggeredBy: 'test:advance-first'
    });

    await expect(
      coordinator.requestTransition(
        projectId,
        State.RESEARCHING,
        State.RESEARCH_READY,
        'test:txc-drift'
      )
    ).rejects.toMatchObject({ failureType: FailureType.TRANSITION_EXECUTION_FAILED });

    expect(await stateManager.getCurrentState(projectId)).toBe(State.RESEARCH_READY);
  });

  it('exposes M2.1 table queries for routing decisions without owning a table', () => {
    expect(coordinator.isTransitionLegal(State.RESEARCHING, State.RESEARCH_READY)).toBe(true);
    expect(coordinator.isTransitionLegal(State.RESEARCHING, State.DELIVERED)).toBe(false);
    expect(coordinator.isDynamicReturnState(State.NEEDS_CONTENT)).toBe(true);
    expect(coordinator.isDynamicReturnState(State.RESEARCHING)).toBe(false);
    expect(coordinator.isValidReturnTarget(State.RESEARCHING)).toBe(true);
    expect(coordinator.isValidReturnTarget(State.NEEDS_CONTENT)).toBe(false);
  });
});
