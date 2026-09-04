import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import { TransactionLog, StateTransitionRecord } from './TransactionLog';
import { ProjectionBuilder } from './ProjectionBuilder';
import { ProjectLock } from './ProjectLock';
import { logger } from '../logging/Logger';

/**
 * M1 migration input for deterministic txId generation.
 */
interface MigrationTxInput {
  projectId: string;
  migrationVersion: string;
  transitionOrdinal: number;
  fromState: string | null;
  toState: string;
  timestamp: string;
  triggeredBy: string;
}

/**
 * M1 state history format.
 */
interface M1StateHistory {
  projectId: string;
  transitions: Array<{
    from: string;
    to: string;
    timestamp: string;
    triggeredBy: string;
  }>;
}

/**
 * Migration engine for M1 to M2.1 projects.
 * 
 * Idempotent: same input produces same output.
 */
export class MigrationEngine {
  private transactionLog: TransactionLog;
  private projectionBuilder: ProjectionBuilder;
  private projectLock: ProjectLock;

  constructor(workspaceRoot: string = './projects') {
    this.transactionLog = new TransactionLog(workspaceRoot);
    this.projectionBuilder = new ProjectionBuilder(workspaceRoot);
    this.projectLock = new ProjectLock(workspaceRoot);
  }

  /**
   * Detect if project is M1 (needs migration).
   */
  async detectM1Project(projectId: string): Promise<boolean> {
    const historyPath = this.getM1HistoryPath(projectId);
    const logExists = this.transactionLog.exists(projectId);
    
    return fs.existsSync(historyPath) && !logExists;
  }

  /**
   * Generate deterministic transaction ID for migration.
   */
  generateDeterministicTxId(input: MigrationTxInput): string {
    const canonical = [
      input.projectId,
      input.migrationVersion,
      input.transitionOrdinal.toString(),
      input.fromState || 'NULL',
      input.toState,
      input.timestamp,
      input.triggeredBy
    ].join('|');

    const hash = createHash('sha256')
      .update(canonical)
      .digest('hex');

    return `M1-${hash.substring(0, 32)}`;
  }

  private getM1HistoryPath(projectId: string): string {
    return path.join(
      this.transactionLog['workspaceRoot'],
      projectId,
      'state',
      'state-history.json'
    );
  }

  /**
   * Migrate M1 project to M2.1.
   *
   * Acquires the per-project lock. Use this variant when the caller does NOT
   * already hold the project lock.
   *
   * Idempotent: repeated migration produces identical transaction.log
   */
  async migrateM1Project(projectId: string): Promise<void> {
    await this.projectLock.withLock(projectId, async () => {
      await this.performMigrationUnlocked(projectId);
    });
  }

  /**
   * Migrate M1 project assuming the caller ALREADY holds the project lock.
   *
   * Used by TransitionEngine.executeTransition, which runs migration inside
   * its own lock acquisition. Acquiring the lock again here would deadlock:
   * the atomic `wx` acquisition fails with EEXIST against the caller's own
   * lock and retries until maxWaitMs.
   *
   * The migration-necessity re-check is preserved: it remains inside the
   * caller's critical section, so another process could have migrated while
   * the caller waited for the lock.
   */
  async performMigrationUnlocked(projectId: string): Promise<void> {
    // Re-check: another process may have migrated while we waited for the lock
    const stillNeedsMigration = await this.detectM1Project(projectId);

    if (!stillNeedsMigration) {
      logger.info('Migration already completed by another process', {
        component: 'MigrationEngine',
        projectId
      });
      return;
    }

    logger.info('Starting M1 migration', {
      component: 'MigrationEngine',
      projectId
    });

    const m1History = await this.readM1History(projectId);

    if (m1History.transitions.length === 0) {
      throw new Error(`M1 project ${projectId} has empty state history`);
    }

    // Bootstrap with INITIAL_STATE
    const initialState = m1History.transitions[0].to;
    const initialTimestamp = m1History.transitions[0].timestamp;
    const initialTxId = this.generateDeterministicTxId({
      projectId,
      migrationVersion: 'M1_TO_M2.1',
      transitionOrdinal: -1,
      fromState: null,
      toState: initialState,
      timestamp: initialTimestamp,
      triggeredBy: 'M1_MIGRATION_BOOTSTRAP'
    });

    await this.transactionLog.initialize(
      projectId,
      initialState,
      initialTxId,
      'M1_MIGRATION_BOOTSTRAP'
    );

    // Write historical transitions
    for (let i = 0; i < m1History.transitions.length; i++) {
      const transition = m1History.transitions[i];

      const txId = this.generateDeterministicTxId({
        projectId,
        migrationVersion: 'M1_TO_M2.1',
        transitionOrdinal: i,
        fromState: transition.from,
        toState: transition.to,
        timestamp: transition.timestamp,
        triggeredBy: transition.triggeredBy
      });

      const record: StateTransitionRecord = {
        txId,
        projectId,
        recordType: 'STATE_TRANSITION',
        timestamp: transition.timestamp,
        triggeredBy: transition.triggeredBy,
        from: transition.from,
        to: transition.to
      };

      await this.transactionLog.append(record);
    }

    // Rebuild projections
    const records = await this.transactionLog.readAll(projectId);
    const projections = this.projectionBuilder.rebuildFromLog(records);
    await this.projectionBuilder.writeProjections(projectId, projections);

    await this.writeMigrationMarker(projectId);

    logger.info('M1 migration completed', {
      component: 'MigrationEngine',
      projectId,
      transitionsCount: m1History.transitions.length
    });
  }

  private async readM1History(projectId: string): Promise<M1StateHistory> {
    const historyPath = this.getM1HistoryPath(projectId);
    const content = await fs.promises.readFile(historyPath, 'utf-8');
    return JSON.parse(content) as M1StateHistory;
  }

  private async writeMigrationMarker(projectId: string): Promise<void> {
    const markerPath = path.join(
      this.transactionLog['workspaceRoot'],
      projectId,
      'state',
      '.migrated-from-m1'
    );

    const marker = {
      migratedAt: new Date().toISOString(),
      migrationVersion: 'M1_TO_M2.1'
    };

    await fs.promises.writeFile(markerPath, JSON.stringify(marker, null, 2), 'utf-8');
  }
}
