import * as fs from 'fs';
import * as path from 'path';
import { MigrationEngine } from '../state/MigrationEngine';
import { TransactionLog } from '../state/TransactionLog';

const TEST_WORKSPACE = './test-migration';
const TEST_PROJECT_ID = 'test-migration-project';

describe('MigrationEngine', () => {
  let migrationEngine: MigrationEngine;
  let transactionLog: TransactionLog;

  beforeEach(async () => {
    migrationEngine = new MigrationEngine(TEST_WORKSPACE);
    transactionLog = new TransactionLog(TEST_WORKSPACE);
    
    const projectPath = path.join(TEST_WORKSPACE, TEST_PROJECT_ID);
    if (fs.existsSync(projectPath)) {
      await fs.promises.rm(projectPath, { recursive: true, force: true });
    }
    await fs.promises.mkdir(path.join(projectPath, 'state'), { recursive: true });
  });

  afterEach(async () => {
    if (fs.existsSync(TEST_WORKSPACE)) {
      await fs.promises.rm(TEST_WORKSPACE, { recursive: true, force: true });
    }
  });

  test('should detect M1 project', async () => {
    const m1History = {
      projectId: TEST_PROJECT_ID,
      transitions: [
        { from: 'NEW', to: 'RESEARCHING', timestamp: '2026-01-01T00:00:00Z', triggeredBy: 'test' }
      ]
    };

    const historyPath = path.join(TEST_WORKSPACE, TEST_PROJECT_ID, 'state', 'state-history.json');
    await fs.promises.writeFile(historyPath, JSON.stringify(m1History, null, 2));

    const isM1 = await migrationEngine.detectM1Project(TEST_PROJECT_ID);
    expect(isM1).toBe(true);
  });

  test('should not detect M2.1 project as M1', async () => {
    await transactionLog.initialize(TEST_PROJECT_ID, 'NEW', 'test-txid');
    
    const isM1 = await migrationEngine.detectM1Project(TEST_PROJECT_ID);
    expect(isM1).toBe(false);
  });

  test('should generate deterministic txIds', () => {
    const input = {
      projectId: 'test-project',
      migrationVersion: 'M1_TO_M2.1',
      transitionOrdinal: 0,
      fromState: 'NEW',
      toState: 'RESEARCHING',
      timestamp: '2026-01-01T00:00:00Z',
      triggeredBy: 'test'
    };

    const txId1 = migrationEngine.generateDeterministicTxId(input);
    const txId2 = migrationEngine.generateDeterministicTxId(input);

    expect(txId1).toBe(txId2);
    expect(txId1).toMatch(/^M1-[a-f0-9]{32}$/);
  });

  test('should generate different txIds for different inputs', () => {
    const input1 = {
      projectId: 'test-project',
      migrationVersion: 'M1_TO_M2.1',
      transitionOrdinal: 0,
      fromState: 'NEW',
      toState: 'RESEARCHING',
      timestamp: '2026-01-01T00:00:00Z',
      triggeredBy: 'test'
    };

    const input2 = { ...input1, transitionOrdinal: 1 };

    const txId1 = migrationEngine.generateDeterministicTxId(input1);
    const txId2 = migrationEngine.generateDeterministicTxId(input2);

    expect(txId1).not.toBe(txId2);
  });

  test('should migrate M1 project to M2.1', async () => {
    const m1History = {
      projectId: TEST_PROJECT_ID,
      transitions: [
        { from: 'NEW', to: 'RESEARCHING', timestamp: '2026-01-01T00:00:00Z', triggeredBy: 'init' },
        { from: 'RESEARCHING', to: 'RESEARCH_READY', timestamp: '2026-01-02T00:00:00Z', triggeredBy: 'complete' }
      ]
    };

    const historyPath = path.join(TEST_WORKSPACE, TEST_PROJECT_ID, 'state', 'state-history.json');
    await fs.promises.writeFile(historyPath, JSON.stringify(m1History, null, 2));

    await migrationEngine.migrateM1Project(TEST_PROJECT_ID);

    const records = await transactionLog.readAll(TEST_PROJECT_ID);
    expect(records).toHaveLength(3); // INITIAL_STATE + 2 transitions
    expect(records[0].recordType).toBe('INITIAL_STATE');
    if (records[0].recordType === 'INITIAL_STATE') {
      expect(records[0].state).toBe('RESEARCHING');
    }
    expect(records[1].recordType).toBe('STATE_TRANSITION');
    expect(records[2].recordType).toBe('STATE_TRANSITION');
  });

  test('should be idempotent', async () => {
    const m1History = {
      projectId: TEST_PROJECT_ID,
      transitions: [
        { from: 'NEW', to: 'RESEARCHING', timestamp: '2026-01-01T00:00:00Z', triggeredBy: 'test' }
      ]
    };

    const historyPath = path.join(TEST_WORKSPACE, TEST_PROJECT_ID, 'state', 'state-history.json');
    await fs.promises.writeFile(historyPath, JSON.stringify(m1History, null, 2));

    await migrationEngine.migrateM1Project(TEST_PROJECT_ID);
    const records1 = await transactionLog.readAll(TEST_PROJECT_ID);

    // Second migration should be no-op
    await migrationEngine.migrateM1Project(TEST_PROJECT_ID);
    const records2 = await transactionLog.readAll(TEST_PROJECT_ID);

    expect(records1.length).toBe(records2.length);
    expect(records1[0].txId).toBe(records2[0].txId);
  });

  test('should reject M1 project with empty transitions', async () => {
    const m1History = {
      projectId: TEST_PROJECT_ID,
      transitions: []  // Empty transitions array
    };

    const historyPath = path.join(TEST_WORKSPACE, TEST_PROJECT_ID, 'state', 'state-history.json');
    await fs.promises.writeFile(historyPath, JSON.stringify(m1History, null, 2));

    await expect(migrationEngine.migrateM1Project(TEST_PROJECT_ID))
      .rejects.toThrow(/empty state history/i);
  });
});
