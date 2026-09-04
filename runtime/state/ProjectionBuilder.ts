import * as fs from 'fs';
import * as path from 'path';
import { LogRecord, StateTransitionRecord } from './TransactionLog';
import { logger } from '../logging/Logger';

/**
 * Current state projection (derived from transaction.log).
 */
export interface CurrentStateProjection {
  projectId: string;
  state: string;
  lastTransitionTimestamp: string;
  lastTransitionTxId: string;
}

/**
 * State history projection (derived from transaction.log).
 */
export interface StateHistoryProjection {
  projectId: string;
  transitions: TransitionEntry[];
}

export interface TransitionEntry {
  txId: string;
  from: string | null;
  to: string;
  timestamp: string;
  triggeredBy: string;
  metadata?: Record<string, unknown>;
}

export interface ProjectionSet {
  currentState: CurrentStateProjection;
  stateHistory: StateHistoryProjection;
}

/**
 * Projection builder - rebuilds derived state from transaction log.
 * 
 * Projections are derived views, NOT authoritative.
 * Always rebuild from transaction.log on startup/recovery.
 */
export class ProjectionBuilder {
  private workspaceRoot: string;

  constructor(workspaceRoot: string = './projects') {
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * Rebuild projections from transaction log records.
   */
  rebuildFromLog(records: LogRecord[]): ProjectionSet {
    if (records.length === 0) {
      throw new Error('Cannot build projections from empty log');
    }

    const firstRecord = records[0];
    if (firstRecord.recordType !== 'INITIAL_STATE') {
      throw new Error('First record must be INITIAL_STATE');
    }

    const projectId = firstRecord.projectId;
    let currentState = firstRecord.state;
    let lastTxId = firstRecord.txId;
    let lastTimestamp = firstRecord.timestamp;

    const transitions: TransitionEntry[] = [];

    // Process STATE_TRANSITION records
    for (let i = 1; i < records.length; i++) {
      const record = records[i];
      
      if (record.recordType !== 'STATE_TRANSITION') {
        throw new Error(`Expected STATE_TRANSITION at position ${i}, got ${record.recordType}`);
      }

      const transition = record as StateTransitionRecord;
      
      transitions.push({
        txId: transition.txId,
        from: transition.from,
        to: transition.to,
        timestamp: transition.timestamp,
        triggeredBy: transition.triggeredBy,
        metadata: transition.metadata
      });

      currentState = transition.to;
      lastTxId = transition.txId;
      lastTimestamp = transition.timestamp;
    }

    return {
      currentState: {
        projectId,
        state: currentState,
        lastTransitionTimestamp: lastTimestamp,
        lastTransitionTxId: lastTxId
      },
      stateHistory: {
        projectId,
        transitions
      }
    };
  }

  /**
   * Write projections to disk.
   */
  async writeProjections(projectId: string, projections: ProjectionSet): Promise<void> {
    const statePath = path.join(this.workspaceRoot, projectId, 'state');
    
    // Ensure state directory exists
    await fs.promises.mkdir(statePath, { recursive: true });

    const currentStatePath = path.join(statePath, 'current-state.json');
    const historyPath = path.join(statePath, 'state-history.json');

    await fs.promises.writeFile(
      currentStatePath,
      JSON.stringify(projections.currentState, null, 2),
      'utf-8'
    );

    await fs.promises.writeFile(
      historyPath,
      JSON.stringify(projections.stateHistory, null, 2),
      'utf-8'
    );

    logger.debug('Projections written', {
      component: 'ProjectionBuilder',
      projectId,
      currentState: projections.currentState.state
    });
  }

  /**
   * Read current state projection from disk.
   */
  async readCurrentState(projectId: string): Promise<CurrentStateProjection | null> {
    const currentStatePath = path.join(
      this.workspaceRoot,
      projectId,
      'state',
      'current-state.json'
    );

    if (!fs.existsSync(currentStatePath)) {
      return null;
    }

    const content = await fs.promises.readFile(currentStatePath, 'utf-8');
    return JSON.parse(content) as CurrentStateProjection;
  }
}
