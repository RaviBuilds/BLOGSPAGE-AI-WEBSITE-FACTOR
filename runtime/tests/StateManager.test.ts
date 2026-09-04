/**
 * StateManager Tests
 * 
 * Tests the high-level StateManager API for project state transitions.
 * Focuses on branch coverage for initialization, transition, and state retrieval.
 */

import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { StateManager } from '../state/StateManager';
import { TransitionResult } from '../state/TransitionEngine';

describe('StateManager', () => {
  const testWorkspace = path.join(__dirname, 'test-workspace-statemgr');
  let manager: StateManager;

  beforeAll(async () => {
    await fs.mkdir(testWorkspace, { recursive: true });
  });

  beforeEach(() => {
    manager = new StateManager(testWorkspace);
  });

  afterAll(async () => {
    await fs.rm(testWorkspace, { recursive: true, force: true });
  });

  // Initialization Tests
  describe('Project Initialization', () => {
    test('should initialize new project with initial state', async () => {
      const projectId = `test-${Date.now()}`;
      const projectDir = path.join(testWorkspace, projectId);
      await fs.mkdir(projectDir, { recursive: true });
      
      await manager.initializeProject(projectId, 'NEW', 'init-tx');

      const state = await manager.getCurrentState(projectId);
      expect(state).toBe('NEW');
    });

    test('should throw error when initializing with missing projectId', async () => {
      // Empty projectId should cause directory creation to fail
      await expect(manager.initializeProject('', 'NEW', 'init-tx'))
        .rejects.toThrow();
    });

    test('should initialize and verify project exists', async () => {
      const projectId = `test-${Date.now()}`;
      const projectDir = path.join(testWorkspace, projectId);
      await fs.mkdir(projectDir, { recursive: true });
      
      await manager.initializeProject(projectId, 'NEW', 'init-tx');
      
      const exists = await manager.projectExists(projectId);
      expect(exists).toBe(true);
    });
  });

  // Transition Tests
  describe('State Transitions', () => {
    let projectId: string;

    beforeEach(async () => {
      projectId = `test-${Date.now()}`;
      const projectDir = path.join(testWorkspace, projectId);
      await fs.mkdir(projectDir, { recursive: true });
      await manager.initializeProject(projectId, 'NEW', 'init-tx');
    });

    test('should execute valid transition', async () => {
      const result: TransitionResult = await manager.transition({
        projectId,
        txId: 'tx-001',
        from: 'NEW',
        to: 'RESEARCHING',
        triggeredBy: 'test'
      });

      expect(result.from).toBe('NEW');
      expect(result.to).toBe('RESEARCHING');
      expect(result.txId).toBe('tx-001');
      expect(result.idempotent).toBe(false);
    });

    test('should return idempotent result for duplicate txId', async () => {
      await manager.transition({
        projectId,
        txId: 'tx-dup',
        from: 'NEW',
        to: 'RESEARCHING',
        triggeredBy: 'test'
      });

      const result = await manager.transition({
        projectId,
        txId: 'tx-dup',
        from: 'NEW',
        to: 'RESEARCHING',
        triggeredBy: 'test'
      });

      expect(result.idempotent).toBe(true);
    });

    test('should reject duplicate txId with conflict', async () => {
      await manager.transition({
        projectId,
        txId: 'tx-conflict',
        from: 'NEW',
        to: 'RESEARCHING',
        triggeredBy: 'test'
      });

      await expect(manager.transition({
        projectId,
        txId: 'tx-conflict',
        from: 'NEW',
        to: 'BLOCKED',
        triggeredBy: 'test',
        returnTarget: 'NEW'
      })).rejects.toThrow(/conflict/i);
    });

    test('should detect state drift', async () => {
      await manager.transition({
        projectId,
        txId: 'tx-advance',
        from: 'NEW',
        to: 'RESEARCHING',
        triggeredBy: 'test'
      });

      await expect(manager.transition({
        projectId,
        txId: 'tx-drift',
        from: 'NEW',
        to: 'BLOCKED',
        triggeredBy: 'test',
        returnTarget: 'NEW'
      })).rejects.toThrow(/drift/i);
    });

    test('should throw error when txId is missing', async () => {
      await expect(manager.transition({
        projectId,
        txId: '',
        from: 'NEW',
        to: 'RESEARCHING',
        triggeredBy: 'test'
      })).rejects.toThrow(/txId is required/i);
    });
  });

  // State Retrieval
  describe('State Retrieval', () => {
    test('should get current state', async () => {
      const projectId = `test-${Date.now()}`;
      const projectDir = path.join(testWorkspace, projectId);
      await fs.mkdir(projectDir, { recursive: true });
      await manager.initializeProject(projectId, 'NEW', 'init-tx');

      const state = await manager.getCurrentState(projectId);
      expect(state).toBe('NEW');
    });

    test('should throw for non-existent project', async () => {
      await expect(manager.getCurrentState('non-existent'))
        .rejects.toThrow();
    });

    test('should check if project exists', async () => {
      const projectId = `test-${Date.now()}`;
      
      const existsBefore = await manager.projectExists(projectId);
      expect(existsBefore).toBe(false);

      const projectDir = path.join(testWorkspace, projectId);
      await fs.mkdir(projectDir, { recursive: true });
      await manager.initializeProject(projectId, 'NEW', 'init-tx');

      const existsAfter = await manager.projectExists(projectId);
      expect(existsAfter).toBe(true);
    });

    test('should return false for non-existent project in projectExists', async () => {
      const nonExistentId = `non-existent-${Date.now()}`;
      const exists = await manager.projectExists(nonExistentId);
      expect(exists).toBe(false);
    });

    test('should get state history', async () => {
      const projectId = `test-${Date.now()}`;
      const projectDir = path.join(testWorkspace, projectId);
      await fs.mkdir(projectDir, { recursive: true });
      await manager.initializeProject(projectId, 'NEW', 'init-tx');
      
      await manager.transition({
        projectId,
        txId: 'tx-hist-1',
        from: 'NEW',
        to: 'RESEARCHING',
        triggeredBy: 'test'
      });

      const history = await manager.getStateHistory(projectId);
      expect(history.transitions.length).toBeGreaterThanOrEqual(1);
      expect(history.transitions[history.transitions.length - 1].to).toBe('RESEARCHING');
    });

    test('should trigger M1 migration when calling getStateHistory on M1 project', async () => {
      const projectId = `m1-project-${Date.now()}`;
      const projectDir = path.join(testWorkspace, projectId);
      const stateDir = path.join(projectDir, 'state');
      await fs.mkdir(stateDir, { recursive: true });

      // Create M1 project structure (state-history.json in state/ without transaction.log)
      // M1 format: all transitions have both from and to
      const stateHistoryPath = path.join(stateDir, 'state-history.json');
      const timestamp1 = '2024-01-01T00:00:00.000Z';
      const timestamp2 = '2024-01-01T00:01:00.000Z';
      const m1History = {
        projectId,
        transitions: [
          {
            from: 'NEW',
            to: 'RESEARCHING',
            timestamp: timestamp1,
            triggeredBy: 'init'
          },
          {
            from: 'RESEARCHING',
            to: 'RESEARCH_READY',
            timestamp: timestamp2,
            triggeredBy: 'complete'
          }
        ]
      };
      await fs.writeFile(stateHistoryPath, JSON.stringify(m1History, null, 2));

      // Call getStateHistory - should trigger M1 migration
      const history = await manager.getStateHistory(projectId);
      
      // Verify migration occurred and history is accessible
      // M1 migration creates: INITIAL_STATE (RESEARCHING) + 2 transitions = 3 records
      expect(history.transitions.length).toBeGreaterThanOrEqual(2);
      expect(history.transitions.find(t => t.to === 'RESEARCHING')).toBeDefined();
      expect(history.transitions.find(t => t.to === 'RESEARCH_READY')).toBeDefined();

      // Verify transaction log now exists (M2.1 format)
      // TransactionLog creates it at projectDir/transaction.log
      const transactionLogPath = path.join(projectDir, 'transaction.log');
      expect(fsSync.existsSync(transactionLogPath)).toBe(true);
    });
  });
});
