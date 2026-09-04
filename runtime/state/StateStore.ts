import * as fs from 'fs';
import * as path from 'path';
import { State } from './StateMachine';
import { CurrentState, StateHistory, StateTransition } from './types';
import { logger } from '../logging/Logger';

/**
 * State persistence layer.
 * 
 * @deprecated M1 implementation. Use StateManager for M2.1 transaction log architecture.
 * 
 * M1 responsibilities:
 * - Persist current state to state/current-state.json
 * - Read current state
 * - Record state transitions to state/state-history.json
 * 
 * M2.1 migration path:
 * - M2.1 projects use transaction.log as authoritative source
 * - StateManager auto-migrates M1 projects on first access
 * - This class remains for backward compatibility only
 * 
 * Canonical requirements:
 * - state-machine.md §1 rule 1: "Exactly one current state"
 * - state-machine.md §1 rule 4: "State changes are logged"
 */
export class StateStore {
  private workspaceRoot: string;

  constructor(workspaceRoot: string = './projects') {
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * Get path to state directory for project.
   */
  private getStatePath(projectId: string): string {
    return path.join(this.workspaceRoot, projectId, 'state');
  }

  /**
   * Get path to current-state.json.
   */
  private getCurrentStatePath(projectId: string): string {
    return path.join(this.getStatePath(projectId), 'current-state.json');
  }

  /**
   * Get path to state-history.json.
   */
  private getStateHistoryPath(projectId: string): string {
    return path.join(this.getStatePath(projectId), 'state-history.json');
  }

  /**
   * Persist current state.
   * 
   * Per state-machine.md §1 rule 1: "Exactly one current state"
   */
  async setState(projectId: string, state: State): Promise<void> {
    const currentState: CurrentState = {
      state,
      projectId,
      updatedAt: new Date().toISOString(),
      exceptionState: null
    };

    const statePath = this.getCurrentStatePath(projectId);
    const content = JSON.stringify(currentState, null, 2);
    
    await fs.promises.writeFile(statePath, content, 'utf-8');
    
    logger.info('State persisted', {
      component: 'StateStore',
      projectId,
      state
    });
  }

  /**
   * Read current state.
   * 
   * @throws Error if project does not exist or state file missing
   */
  async getCurrentState(projectId: string): Promise<CurrentState> {
    const statePath = this.getCurrentStatePath(projectId);
    
    if (!fs.existsSync(statePath)) {
      throw new Error(`Project not found: ${projectId}`);
    }

    const content = await fs.promises.readFile(statePath, 'utf-8');
    const state = JSON.parse(content) as CurrentState;
    
    return state;
  }

  /**
   * Record state transition to history.
   * 
   * Per state-machine.md §1 rule 4: "State changes are logged"
   * 
   * M1: Basic implementation, M2 will use for transition tracking
   */
  async recordTransition(
    projectId: string,
    from: State,
    to: State,
    triggeredBy: string
  ): Promise<void> {
    const historyPath = this.getStateHistoryPath(projectId);
    
    const transition: StateTransition = {
      from,
      to,
      timestamp: new Date().toISOString(),
      triggeredBy
    };

    let history: StateHistory;
    
    if (fs.existsSync(historyPath)) {
      const content = await fs.promises.readFile(historyPath, 'utf-8');
      history = JSON.parse(content);
      history.transitions.push(transition);
    } else {
      history = {
        projectId,
        transitions: [transition]
      };
    }

    const content = JSON.stringify(history, null, 2);
    await fs.promises.writeFile(historyPath, content, 'utf-8');
    
    logger.info('State transition recorded', {
      component: 'StateStore',
      projectId,
      from,
      to
    });
  }

  /**
   * Check if project exists.
   */
  async projectExists(projectId: string): Promise<boolean> {
    const statePath = this.getCurrentStatePath(projectId);
    return fs.existsSync(statePath);
  }
}
