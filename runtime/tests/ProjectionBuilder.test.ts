/**
 * ProjectionBuilder Tests
 * 
 * Tests validation and error handling paths in ProjectionBuilder.
 * Focus on branch coverage for M2.1 acceptance.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { ProjectionBuilder } from '../state/ProjectionBuilder';

describe('ProjectionBuilder', () => {
  const testWorkspace = path.join(__dirname, 'test-workspace-projbuilder');
  let builder: ProjectionBuilder;

  beforeAll(async () => {
    await fs.mkdir(testWorkspace, { recursive: true });
  });

  beforeEach(() => {
    builder = new ProjectionBuilder(testWorkspace);
  });

  afterAll(async () => {
    await fs.rm(testWorkspace, { recursive: true, force: true });
  });

  describe('Validation', () => {
    test('should throw on empty records array', () => {
      expect(() => builder.rebuildFromLog([])).toThrow(/Cannot build projections from empty log/i);
    });

    test('should throw when first record is not INITIAL_STATE', () => {
      const invalidRecords = [{
        txId: 'test',
        projectId: 'test',
        recordType: 'STATE_TRANSITION',
        timestamp: new Date().toISOString(),
        from: 'NEW',
        to: 'RESEARCHING',
        triggeredBy: 'test'
      }];
      
      expect(() => builder.rebuildFromLog(invalidRecords as any))
        .toThrow(/First record must be INITIAL_STATE/i);
    });

    test('should throw on non-STATE_TRANSITION after initial state', () => {
      const records = [
        {
          txId: 'init',
          projectId: 'test',
          recordType: 'INITIAL_STATE',
          timestamp: new Date().toISOString(),
          state: 'NEW',
          triggeredBy: 'test'
        },
        {
          txId: 'tx-001',
          projectId: 'test',
          recordType: 'INVALID_TYPE',
          timestamp: new Date().toISOString()
        }
      ];
      
      expect(() => builder.rebuildFromLog(records as any))
        .toThrow(/Expected STATE_TRANSITION at position/i);
    });

    test('should successfully build projections from valid records', () => {
      const records = [
        {
          txId: 'init',
          projectId: 'test-valid',
          recordType: 'INITIAL_STATE',
          timestamp: '2026-09-02T21:00:00.000Z',
          state: 'NEW',
          triggeredBy: 'test'
        },
        {
          txId: 'tx-001',
          projectId: 'test-valid',
          recordType: 'STATE_TRANSITION',
          timestamp: '2026-09-02T21:01:00.000Z',
          from: 'NEW',
          to: 'RESEARCHING',
          triggeredBy: 'test'
        }
      ];
      
      const projections = builder.rebuildFromLog(records as any);
      
      expect(projections.currentState.state).toBe('RESEARCHING');
      expect(projections.currentState.projectId).toBe('test-valid');
      expect(projections.stateHistory.transitions.length).toBe(1);
      expect(projections.stateHistory.transitions[0].to).toBe('RESEARCHING');
    });
  });

  describe('writeProjections', () => {
    test('should write projections successfully', async () => {
      const projectId = 'test-proj-write';
      const projectPath = path.join(testWorkspace, projectId);
      await fs.mkdir(projectPath, { recursive: true });
      
      const now = new Date().toISOString();
      const projections = {
        currentState: {
          projectId,
          state: 'NEW',
          lastTransitionTimestamp: now,
          lastTransitionTxId: 'init-tx'
        },
        stateHistory: {
          projectId,
          transitions: []
        }
      };
      
      await builder.writeProjections(projectId, projections);
      
      // Verify files were written
      const statePath = path.join(projectPath, 'state');
      const currentStatePath = path.join(statePath, 'current-state.json');
      const historyPath = path.join(statePath, 'state-history.json');
      
      expect(await fs.access(currentStatePath).then(() => true).catch(() => false)).toBe(true);
      expect(await fs.access(historyPath).then(() => true).catch(() => false)).toBe(true);
    });
  });

  describe('readCurrentState', () => {
    test('should return null for non-existent project', async () => {
      const result = await builder.readCurrentState('non-existent-project');
      expect(result).toBeNull();
    });

    test('should read existing current state projection', async () => {
      const projectId = 'test-proj-read';
      const projectPath = path.join(testWorkspace, projectId);
      const statePath = path.join(projectPath, 'state');
      await fs.mkdir(statePath, { recursive: true });
      
      const now = new Date().toISOString();
      const currentState = {
        projectId,
        state: 'RESEARCHING',
        lastTransitionTimestamp: now,
        lastTransitionTxId: 'test-tx'
      };
      
      const currentStatePath = path.join(statePath, 'current-state.json');
      await fs.writeFile(currentStatePath, JSON.stringify(currentState, null, 2));
      
      const result = await builder.readCurrentState(projectId);
      
      expect(result).not.toBeNull();
      expect(result?.state).toBe('RESEARCHING');
      expect(result?.projectId).toBe(projectId);
      expect(result?.lastTransitionTxId).toBe('test-tx');
    });
  });
});
