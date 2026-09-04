/**
 * StateStore (M1 legacy persistence) tests.
 *
 * StateStore is deprecated in M2.1 but its legacy on-disk format
 * (state/state-history.json) is the SOURCE format that MigrationEngine
 * consumes. These tests lock in that legacy contract so migration
 * behavior cannot silently break.
 */

import * as fs from 'fs';
import * as path from 'path';
import { StateStore } from '../state/StateStore';
import { State } from '../state/StateMachine';

describe('StateStore (M1 legacy persistence)', () => {
  const testWorkspace = path.join(__dirname, 'test-workspace-statestore');
  const projectId = 'legacy-m1-project';
  let stateStore: StateStore;

  beforeEach(async () => {
    if (fs.existsSync(testWorkspace)) {
      await fs.promises.rm(testWorkspace, { recursive: true, force: true });
    }
    await fs.promises.mkdir(path.join(testWorkspace, projectId, 'state'), { recursive: true });
    stateStore = new StateStore(testWorkspace);
  });

  afterEach(async () => {
    if (fs.existsSync(testWorkspace)) {
      await fs.promises.rm(testWorkspace, { recursive: true, force: true });
    }
  });

  test('recordTransition creates legacy history file on first call', async () => {
    await stateStore.recordTransition(projectId, State.NEW, State.RESEARCHING, 'm1-agent');

    const historyPath = path.join(testWorkspace, projectId, 'state', 'state-history.json');
    expect(fs.existsSync(historyPath)).toBe(true);

    const history = JSON.parse(await fs.promises.readFile(historyPath, 'utf-8'));
    expect(history.projectId).toBe(projectId);
    expect(history.transitions).toHaveLength(1);
    expect(history.transitions[0]).toMatchObject({
      from: 'NEW',
      to: 'RESEARCHING',
      triggeredBy: 'm1-agent'
    });
    expect(typeof history.transitions[0].timestamp).toBe('string');
  });

  test('recordTransition appends to existing legacy history', async () => {
    await stateStore.recordTransition(projectId, State.NEW, State.RESEARCHING, 'm1-agent');
    await stateStore.recordTransition(projectId, State.RESEARCHING, State.RESEARCH_READY, 'm1-agent');

    const historyPath = path.join(testWorkspace, projectId, 'state', 'state-history.json');
    const history = JSON.parse(await fs.promises.readFile(historyPath, 'utf-8'));
    expect(history.transitions).toHaveLength(2);
    expect(history.transitions[1]).toMatchObject({
      from: 'RESEARCHING',
      to: 'RESEARCH_READY',
      triggeredBy: 'm1-agent'
    });
  });
});
