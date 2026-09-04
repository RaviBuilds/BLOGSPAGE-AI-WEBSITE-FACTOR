import * as fs from 'fs';
import * as path from 'path';
import { TransitionEngine } from '../state/TransitionEngine';
import { TransactionLog } from '../state/TransactionLog';
import { ProjectionBuilder } from '../state/ProjectionBuilder';
import { ConflictingTransactionError } from '../state/ConflictingTransactionError';

describe('TransitionEngine', () => {
  let engine: TransitionEngine;
  let testWorkspace: string;
  let testProjectId: string;

  beforeEach(async () => {
    testWorkspace = path.join(process.cwd(), 'test-transition-engine-' + Date.now());
    testProjectId = 'test-project-' + Date.now();
    engine = new TransitionEngine(testWorkspace);

    // Initialize project with NEW state
    const projectPath = path.join(testWorkspace, testProjectId);
    await fs.promises.mkdir(projectPath, { recursive: true });

    const transactionLog = new TransactionLog(testWorkspace);
    await transactionLog.initialize(testProjectId, 'NEW', 'init-txid');

    // Build initial projections
    const projectionBuilder = new ProjectionBuilder(testWorkspace);
    const records = await transactionLog.readAll(testProjectId);
    const projections = projectionBuilder.rebuildFromLog(records);
    await projectionBuilder.writeProjections(testProjectId, projections);
  });

  afterEach(async () => {
    if (fs.existsSync(testWorkspace)) {
      await fs.promises.rm(testWorkspace, { recursive: true, force: true });
    }
  });

  // Valid transitions
  test('should execute valid NEW → RESEARCHING transition', async () => {
    const result = await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-001',
      from: 'NEW',
      to: 'RESEARCHING',
      triggeredBy: 'test'
    });

    expect(result.idempotent).toBe(false);
    expect(result.alreadyCommitted).toBe(false);
    expect(result.from).toBe('NEW');
    expect(result.to).toBe('RESEARCHING');

    const currentState = await engine.getCurrentState(testProjectId);
    expect(currentState).toBe('RESEARCHING');
  });

  test('should execute valid transition chain', async () => {
    await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-001',
      from: 'NEW',
      to: 'RESEARCHING',
      triggeredBy: 'test'
    });

    await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-002',
      from: 'RESEARCHING',
      to: 'RESEARCH_READY',
      triggeredBy: 'test'
    });

    const currentState = await engine.getCurrentState(testProjectId);
    expect(currentState).toBe('RESEARCH_READY');
  });

  test('should execute complete workflow', async () => {
    const transitions = [
      { from: 'NEW', to: 'RESEARCHING' },
      { from: 'RESEARCHING', to: 'RESEARCH_READY' },
      { from: 'RESEARCH_READY', to: 'CREATIVE_DIRECTION' },
      { from: 'CREATIVE_DIRECTION', to: 'BLUEPRINT_READY' },
      { from: 'BLUEPRINT_READY', to: 'IMPLEMENTING' }
    ];

    for (let i = 0; i < transitions.length; i++) {
      await engine.executeTransition({
        projectId: testProjectId,
        txId: `tx-workflow-${i}`,
        from: transitions[i].from,
        to: transitions[i].to,
        triggeredBy: 'test'
      });
    }

    const currentState = await engine.getCurrentState(testProjectId);
    expect(currentState).toBe('IMPLEMENTING');
  });

  // Invalid transitions
  test('should reject invalid NEW → DELIVERED transition', async () => {
    await expect(engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-invalid',
      from: 'NEW',
      to: 'DELIVERED',
      triggeredBy: 'test'
    })).rejects.toThrow(/Invalid transition/);
  });

  test('should leave WAL unchanged after invalid transition', async () => {
    const transactionLog = new TransactionLog(testWorkspace);
    const logBefore = await transactionLog.readAll(testProjectId);

    await expect(engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-invalid',
      from: 'NEW',
      to: 'DELIVERED',
      triggeredBy: 'test'
    })).rejects.toThrow();

    const logAfter = await transactionLog.readAll(testProjectId);
    expect(logAfter.length).toBe(logBefore.length);
  });

  // WAL and projection consistency
  test('should append exactly one WAL record per transition', async () => {
    const transactionLog = new TransactionLog(testWorkspace);
    const logBefore = await transactionLog.readAll(testProjectId);

    await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-001',
      from: 'NEW',
      to: 'RESEARCHING',
      triggeredBy: 'test'
    });

    const logAfter = await transactionLog.readAll(testProjectId);
    expect(logAfter.length).toBe(logBefore.length + 1);
  });

  test('should update current-state projection after transition', async () => {
    await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-001',
      from: 'NEW',
      to: 'RESEARCHING',
      triggeredBy: 'test'
    });

    const projectionPath = path.join(testWorkspace, testProjectId, 'state', 'current-state.json');
    const projection = JSON.parse(await fs.promises.readFile(projectionPath, 'utf-8'));
    expect(projection.state).toBe('RESEARCHING');
  });

  test('should update state-history projection after transition', async () => {
    await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-001',
      from: 'NEW',
      to: 'RESEARCHING',
      triggeredBy: 'test'
    });

    const historyPath = path.join(testWorkspace, testProjectId, 'state', 'state-history.json');
    const history = JSON.parse(await fs.promises.readFile(historyPath, 'utf-8'));
    expect(history.transitions).toHaveLength(1);
    expect(history.transitions[0].from).toBe('NEW');
    expect(history.transitions[0].to).toBe('RESEARCHING');
  });

  // Drift detection
  test('should detect state drift and reject transition', async () => {
    // First, advance state legitimately
    await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-advance',
      from: 'NEW',
      to: 'RESEARCHING',
      triggeredBy: 'test'
    });

    // Now attempt transition from wrong state
    // Drift: caller thinks state is NEW, but actual state is RESEARCHING
    await expect(engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-001',
      from: 'NEW',
      to: 'BLOCKED',
      triggeredBy: 'test',
      returnTarget: 'NEW'
    })).rejects.toThrow(/State drift detected/);
  });

  // Exception state transitions
  test('should accept valid exception transition with returnTarget', async () => {
    const result = await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-001',
      from: 'NEW',
      to: 'BLOCKED',
      triggeredBy: 'test',
      returnTarget: 'NEW'
    });

    expect(result.from).toBe('NEW');
    expect(result.to).toBe('BLOCKED');

    const currentState = await engine.getCurrentState(testProjectId);
    expect(currentState).toBe('BLOCKED');
  });

  test('should store returnTarget in metadata', async () => {
    await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-001',
      from: 'NEW',
      to: 'BLOCKED',
      triggeredBy: 'test',
      returnTarget: 'NEW'
    });

    const transactionLog = new TransactionLog(testWorkspace);
    const records = await transactionLog.readAll(testProjectId);
    const lastRecord = records[records.length - 1];

    expect(lastRecord.recordType).toBe('STATE_TRANSITION');
    if (lastRecord.recordType === 'STATE_TRANSITION') {
      expect(lastRecord.metadata?.returnTarget).toBe('NEW');
    }
  });

  test('should reject invalid returnTarget (exception state)', async () => {
    // Attempt to use an exception state as returnTarget
    // BLOCKED is a dynamic state that requires returnTarget
    // Try to transition BLOCKED → NEEDS_CONTENT with returnTarget=NEEDS_HUMAN_REVIEW (invalid - exception state)
    
    // First, enter BLOCKED state from NEW
    await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-enter-blocked',
      from: 'NEW',
      to: 'BLOCKED',
      triggeredBy: 'test',
      returnTarget: 'NEW'
    });

    // Now try to transition from BLOCKED with invalid returnTarget (exception state)
    await expect(engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-001',
      from: 'BLOCKED',
      to: 'NEEDS_CONTENT',
      triggeredBy: 'test',
      returnTarget: 'NEEDS_HUMAN_REVIEW'  // Invalid: exception state as returnTarget
    })).rejects.toThrow(/Invalid/);
  });

  test('should accept return from exception state to recorded target', async () => {
    // Enter exception state
    await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-001',
      from: 'NEW',
      to: 'BLOCKED',
      triggeredBy: 'test',
      returnTarget: 'NEW'
    });

    // Return to recorded target
    await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-002',
      from: 'BLOCKED',
      to: 'NEW',
      triggeredBy: 'test',
      returnTarget: 'NEW'
    });

    const currentState = await engine.getCurrentState(testProjectId);
    expect(currentState).toBe('NEW');
  });

  // txId idempotency
  test('should handle duplicate txId with identical payload idempotently', async () => {
    const params = {
      projectId: testProjectId,
      txId: 'tx-idempotent',
      from: 'NEW',
      to: 'RESEARCHING',
      triggeredBy: 'test'
    };

    const result1 = await engine.executeTransition(params);
    expect(result1.idempotent).toBe(false);
    expect(result1.alreadyCommitted).toBe(false);

    const transactionLog = new TransactionLog(testWorkspace);
    const logAfterFirst = await transactionLog.readAll(testProjectId);

    const result2 = await engine.executeTransition(params);
    expect(result2.idempotent).toBe(true);
    expect(result2.alreadyCommitted).toBe(true);
    expect(result2.txId).toBe(params.txId);
    expect(result2.timestamp).toBe(result1.timestamp);

    const logAfterSecond = await transactionLog.readAll(testProjectId);
    expect(logAfterSecond.length).toBe(logAfterFirst.length);
  });

  test('should reject duplicate txId with conflicting destination', async () => {
    await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-conflict',
      from: 'NEW',
      to: 'RESEARCHING',
      triggeredBy: 'test'
    });

    await expect(engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-conflict',
      from: 'NEW',
      to: 'BLOCKED',
      triggeredBy: 'test',
      returnTarget: 'NEW'
    })).rejects.toThrow(ConflictingTransactionError);
  });

  test('should reject duplicate txId with conflicting triggeredBy', async () => {
    await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-conflict',
      from: 'NEW',
      to: 'RESEARCHING',
      triggeredBy: 'agent-1'
    });

    await expect(engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-conflict',
      from: 'NEW',
      to: 'RESEARCHING',
      triggeredBy: 'agent-2'
    })).rejects.toThrow(ConflictingTransactionError);
  });

  test('should reject duplicate txId with conflicting returnTarget', async () => {
    await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-conflict',
      from: 'NEW',
      to: 'BLOCKED',
      triggeredBy: 'test',
      returnTarget: 'NEW'
    });

    await expect(engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-conflict',
      from: 'NEW',
      to: 'BLOCKED',
      triggeredBy: 'test',
      returnTarget: 'RESEARCHING'
    })).rejects.toThrow(ConflictingTransactionError);
  });

  test('should allow different txId for new transition', async () => {
    await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-001',
      from: 'NEW',
      to: 'RESEARCHING',
      triggeredBy: 'test'
    });

    await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-002',
      from: 'RESEARCHING',
      to: 'RESEARCH_READY',
      triggeredBy: 'test'
    });

    const currentState = await engine.getCurrentState(testProjectId);
    expect(currentState).toBe('RESEARCH_READY');
  });

  // Lock behavior
  test('should release lock after successful transition', async () => {
    await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-001',
      from: 'NEW',
      to: 'RESEARCHING',
      triggeredBy: 'test'
    });

    const lockPath = path.join(testWorkspace, testProjectId, '.state-transition.lock');
    expect(fs.existsSync(lockPath)).toBe(false);
  });

  test('should release lock even when transition fails', async () => {
    await expect(engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-invalid',
      from: 'NEW',
      to: 'DELIVERED',
      triggeredBy: 'test'
    })).rejects.toThrow();

    const lockPath = path.join(testWorkspace, testProjectId, '.state-transition.lock');
    expect(fs.existsSync(lockPath)).toBe(false);
  });

  // getCurrentState
  test('should return current state from WAL', async () => {
    const state1 = await engine.getCurrentState(testProjectId);
    expect(state1).toBe('NEW');

    await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-001',
      from: 'NEW',
      to: 'RESEARCHING',
      triggeredBy: 'test'
    });

    const state2 = await engine.getCurrentState(testProjectId);
    expect(state2).toBe('RESEARCHING');
  });

  // Real concurrency test
  test('should serialize concurrent transitions to same project', async () => {
    const transactionLog = new TransactionLog(testWorkspace);

    const transition1 = engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-concurrent-1',
      from: 'NEW',
      to: 'RESEARCHING',
      triggeredBy: 'concurrent-test'
    });

    const transition2 = engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-concurrent-2',
      from: 'NEW',
      to: 'NEEDS_CONTENT',
      triggeredBy: 'concurrent-test',
      returnTarget: 'NEW'
    });

    const results = await Promise.allSettled([transition1, transition2]);

    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failureCount = results.filter(r => r.status === 'rejected').length;

    expect(successCount).toBe(1);
    expect(failureCount).toBe(1);

    const failedResult = results.find(r => r.status === 'rejected') as PromiseRejectedResult;
    expect(failedResult.reason.message).toMatch(/State drift detected/);

    const log = await transactionLog.readAll(testProjectId);
    const transitionRecords = log.filter(r => r.recordType === 'STATE_TRANSITION');
    expect(transitionRecords).toHaveLength(1);

    const currentState = await engine.getCurrentState(testProjectId);
    expect(['RESEARCHING', 'NEEDS_CONTENT']).toContain(currentState);
  });

  // Additional coverage for uncovered branches
  test('should reject idempotent transaction with mismatched returnTarget', async () => {
    // First transition: NEW -> BLOCKED with returnTarget=NEW
    await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-return-mismatch',
      from: 'NEW',
      to: 'BLOCKED',
      triggeredBy: 'test',
      returnTarget: 'NEW'
    });

    // Second transition: same txId but different returnTarget (should fail)
    await expect(engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-return-mismatch',
      from: 'NEW',
      to: 'BLOCKED',
      triggeredBy: 'test',
      returnTarget: 'RESEARCHING'  // Different returnTarget
    })).rejects.toThrow(ConflictingTransactionError);
  });

  test('should reject idempotent transaction with returnTarget vs no returnTarget', async () => {
    // First transition: NEW -> BLOCKED with returnTarget
    await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-return-present',
      from: 'NEW',
      to: 'BLOCKED',
      triggeredBy: 'test',
      returnTarget: 'NEW'
    });

    // Second transition: same txId but no returnTarget (should fail)
    await expect(engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-return-present',
      from: 'NEW',
      to: 'BLOCKED',
      triggeredBy: 'test'
      // No returnTarget
    })).rejects.toThrow(ConflictingTransactionError);
  });

  test('should trigger M1 migration when calling getCurrentState on M1 project', async () => {
    const m1ProjectId = `m1-project-${Date.now()}`;
    const m1ProjectDir = path.join(testWorkspace, m1ProjectId);
    const stateDir = path.join(m1ProjectDir, 'state');
    await fs.promises.mkdir(stateDir, { recursive: true });

    // Create M1 project structure
    const stateHistoryPath = path.join(stateDir, 'state-history.json');
    const m1History = {
      projectId: m1ProjectId,
      transitions: [
        {
          from: 'NEW',
          to: 'RESEARCHING',
          timestamp: '2024-01-01T00:00:00.000Z',
          triggeredBy: 'init'
        }
      ]
    };
    await fs.promises.writeFile(stateHistoryPath, JSON.stringify(m1History, null, 2));

    // Call getCurrentState - should trigger M1 migration
    const currentState = await engine.getCurrentState(m1ProjectId);
    
    // Verify migration occurred and state is accessible
    expect(currentState).toBe('RESEARCHING');

    // Verify transaction log now exists
    const transactionLog = new TransactionLog(testWorkspace);
    expect(transactionLog.exists(m1ProjectId)).toBe(true);
  });

  test('should trigger M1 migration inside executeTransition', async () => {
    // M1 project: legacy state files exist, NO transaction.log
    const m1ProjectId = `m1-project-tx-${Date.now()}`;
    const stateDir = path.join(testWorkspace, m1ProjectId, 'state');
    await fs.promises.mkdir(stateDir, { recursive: true });

    const m1History = {
      projectId: m1ProjectId,
      transitions: [
        {
          from: 'NEW',
          to: 'RESEARCHING',
          timestamp: '2024-01-01T00:00:00.000Z',
          triggeredBy: 'm1-agent'
        }
      ]
    };
    await fs.promises.writeFile(
      path.join(stateDir, 'state-history.json'),
      JSON.stringify(m1History, null, 2)
    );
    await fs.promises.writeFile(
      path.join(stateDir, 'current-state.json'),
      JSON.stringify({
        state: 'RESEARCHING',
        projectId: m1ProjectId,
        updatedAt: '2024-01-01T00:00:00.000Z',
        exceptionState: null
      })
    );

    // Live transition on M1 project: migration must run first (inside lock)
    const result = await engine.executeTransition({
      projectId: m1ProjectId,
      txId: 'tx-m1-live-001',
      from: 'RESEARCHING',
      to: 'RESEARCH_READY',
      triggeredBy: 'test'
    });

    expect(result.idempotent).toBe(false);
    expect(result.from).toBe('RESEARCHING');
    expect(result.to).toBe('RESEARCH_READY');

    // Migration created the WAL with M1 records, live transition appended after
    const transactionLog = new TransactionLog(testWorkspace);
    expect(transactionLog.exists(m1ProjectId)).toBe(true);
    const records = await transactionLog.readAll(m1ProjectId);
    // INITIAL_STATE + replayed M1 transition + new live transition
    expect(records.length).toBe(3);
    expect(records[records.length - 1].recordType).toBe('STATE_TRANSITION');

    const currentState = await engine.getCurrentState(m1ProjectId);
    expect(currentState).toBe('RESEARCH_READY');
  });

  test('should reject transition when WAL exists but is empty (drift check)', async () => {
    // An empty transaction.log yields zero records: authoritative state cannot
    // be reconstructed, so the drift check must fail closed.
    const emptyLogProject = `empty-wal-${Date.now()}`;
    const stateDir = path.join(testWorkspace, emptyLogProject, 'state');
    await fs.promises.mkdir(stateDir, { recursive: true });
    await fs.promises.writeFile(
      path.join(stateDir, 'transaction.log'),
      ''
    );

    await expect(engine.executeTransition({
      projectId: emptyLogProject,
      txId: 'tx-empty-wal',
      from: 'NEW',
      to: 'RESEARCHING',
      triggeredBy: 'test'
    })).rejects.toThrow(/No transaction log found/);
  });

  test('should reject transition on uninitialized project (no WAL)', async () => {
    // A project with no transaction.log has no authoritative state.
    // Transitions must fail closed - never assume NEW.
    const uninitializedProject = `uninit-${Date.now()}`;
    await fs.promises.mkdir(
      path.join(testWorkspace, uninitializedProject, 'state'),
      { recursive: true }
    );
    // No transaction.log written

    await expect(engine.executeTransition({
      projectId: uninitializedProject,
      txId: 'tx-uninit',
      from: 'NEW',
      to: 'RESEARCHING',
      triggeredBy: 'test'
    })).rejects.toThrow(/No transaction log found/);
  });

  test('should detect conflict when same txId has different from state', async () => {
    // Commit first transaction
    await engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-conflict-from',
      from: 'NEW',
      to: 'RESEARCHING',
      triggeredBy: 'test'
    });

    // Retry with SAME txId but different from-state (different semantics)
    await expect(engine.executeTransition({
      projectId: testProjectId,
      txId: 'tx-conflict-from',
      from: 'RESEARCHING',
      to: 'RESEARCH_READY',
      triggeredBy: 'test'
    })).rejects.toThrow(ConflictingTransactionError);

    // Verify no extra WAL record was appended by the conflicting attempt
    const transactionLog = new TransactionLog(testWorkspace);
    const records = await transactionLog.readAll(testProjectId);
    expect(records.length).toBe(2); // INITIAL_STATE + 1 committed transition
  });
});
