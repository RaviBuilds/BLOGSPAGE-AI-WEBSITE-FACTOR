import { TransactionLog, StateTransitionRecord } from './TransactionLog';
import { ProjectionBuilder } from './ProjectionBuilder';
import { TransitionTable } from './TransitionTable';
import { ProjectLock } from './ProjectLock';
import { MigrationEngine } from './MigrationEngine';
import { ConflictingTransactionError } from './ConflictingTransactionError';
import { logger } from '../logging/Logger';

/**
 * Parameters for state transition.
 */
export interface TransitionParams {
  projectId: string;
  txId: string; // REQUIRED - caller must provide
  from: string;
  to: string;
  triggeredBy: string;
  returnTarget?: string; // For exception states
  metadata?: Record<string, unknown>;
}

/**
 * Result of a state transition execution.
 */
export interface TransitionResult {
  /** Whether this was an idempotent retry of an existing transaction */
  idempotent: boolean;
  
  /** Transaction ID */
  txId: string;
  
  /** Source state */
  from: string;
  
  /** Destination state */
  to: string;
  
  /** Timestamp of the committed transaction */
  timestamp: string;
  
  /** Whether transaction was already committed (true) or newly committed (false) */
  alreadyCommitted: boolean;
}

/**
 * Transition engine - orchestrates state transitions with drift protection.
 * 
 * Architecture:
 * - Validates transition against canonical rules
 * - Detects state drift before every transition
 * - Appends to transaction.log (authoritative)
 * - Updates projections (derived)
 * - Protected by per-project lock
 */
export class TransitionEngine {
  private transactionLog: TransactionLog;
  private projectionBuilder: ProjectionBuilder;
  private transitionTable: TransitionTable;
  private projectLock: ProjectLock;
  private migrationEngine: MigrationEngine;

  constructor(workspaceRoot: string = './projects') {
    this.transactionLog = new TransactionLog(workspaceRoot);
    this.projectionBuilder = new ProjectionBuilder(workspaceRoot);
    this.transitionTable = new TransitionTable();
    this.projectLock = new ProjectLock(workspaceRoot);
    this.migrationEngine = new MigrationEngine(workspaceRoot);
  }

  /**
   * Execute state transition.
   * 
   * Process (within project lock):
   * 1. Check for M1 migration
   * 2. Read authoritative WAL
   * 3. Check txId deduplication
   * 4. Validate transition
   * 5. Check drift
   * 6. Append to transaction.log
   * 7. Update projections
   * 
   * @returns TransitionResult with idempotency information
   */
  async executeTransition(params: TransitionParams): Promise<TransitionResult> {
    return await this.projectLock.withLock(params.projectId, async () => {
      // Check for M1 migration
      // Migration runs INSIDE the project lock we already hold:
      // calling migrateM1Project() here would re-acquire the same lock
      // and deadlock (EEXIST against our own lock → retry until timeout).
      const needsMigration = await this.migrationEngine.detectM1Project(params.projectId);
      if (needsMigration) {
        await this.migrationEngine.performMigrationUnlocked(params.projectId);
      }

      // Read authoritative WAL (also used for drift detection)
      const records = await this.transactionLog.readAll(params.projectId);
      
      // txId deduplication check (MUST occur within lock)
      const existingRecord = await this.transactionLog.findRecordByTxId(
        params.projectId,
        params.txId
      );

      if (existingRecord) {
        // txId already exists - check semantics
        if (this.compareTransactionSemantics(existingRecord, params)) {
          // Idempotent: same txId + identical semantics → return success
          logger.info('Idempotent transaction detected', {
            component: 'TransitionEngine',
            projectId: params.projectId,
            txId: params.txId
          });

          return {
            idempotent: true,
            txId: params.txId,
            from: existingRecord.from,
            to: existingRecord.to,
            timestamp: existingRecord.timestamp,
            alreadyCommitted: true
          };
        } else {
          // Conflict: same txId + different semantics → fatal error
          throw new ConflictingTransactionError(
            `Transaction ID ${params.txId} already exists with conflicting payload. ` +
            `Existing: ${existingRecord.from} -> ${existingRecord.to} (triggeredBy: ${existingRecord.triggeredBy}), ` +
            `Requested: ${params.from} -> ${params.to} (triggeredBy: ${params.triggeredBy})`,
            params.txId,
            {
              from: existingRecord.from,
              to: existingRecord.to,
              triggeredBy: existingRecord.triggeredBy,
              returnTarget: existingRecord.metadata?.returnTarget as string | undefined
            },
            {
              from: params.from,
              to: params.to,
              triggeredBy: params.triggeredBy,
              returnTarget: params.returnTarget
            }
          );
        }
      }

      // Validate transition
      const isValid = this.transitionTable.isValidTransition(
        params.from,
        params.to,
        params.returnTarget
      );

      if (!isValid) {
        const errorMsg = this.transitionTable.isDynamicReturnState(params.from) && params.returnTarget
          ? `Invalid returnTarget: ${params.returnTarget} is not a valid primary state`
          : `Invalid transition: ${params.from} -> ${params.to}`;
        
        throw new Error(
          errorMsg + `. Valid next states: ${this.transitionTable.getValidNextStates(params.from).join(', ')}`
        );
      }

      // Drift detection
      await this.checkDriftFromRecords(records, params.from);

      // Build record with exception context
      const timestamp = new Date().toISOString();
      const record: StateTransitionRecord = {
        txId: params.txId,
        projectId: params.projectId,
        recordType: 'STATE_TRANSITION',
        timestamp,
        triggeredBy: params.triggeredBy,
        from: params.from,
        to: params.to,
        metadata: this.buildMetadata(params)
      };

      // Append to transaction log (with datasync)
      await this.transactionLog.append(record);

      // Update projections (failure here does not rollback WAL)
      const updatedRecords = await this.transactionLog.readAll(params.projectId);
      const projections = this.projectionBuilder.rebuildFromLog(updatedRecords);
      await this.projectionBuilder.writeProjections(params.projectId, projections);

      logger.info('State transition executed', {
        component: 'TransitionEngine',
        projectId: params.projectId,
        txId: params.txId,
        from: params.from,
        to: params.to
      });

      return {
        idempotent: false,
        txId: params.txId,
        from: params.from,
        to: params.to,
        timestamp,
        alreadyCommitted: false
      };
    });
  }

  /**
   * Compare immutable transaction semantics for idempotency.
   * 
   * Fields that MUST match:
   * - from
   * - to
   * - triggeredBy
   * - returnTarget (if present)
   * 
   * Fields that DO NOT participate:
   * - timestamp (retry may have different timestamp)
   * - other metadata (except returnTarget)
   */
  private compareTransactionSemantics(
    existing: StateTransitionRecord,
    params: TransitionParams
  ): boolean {
    // Basic transition semantics
    if (existing.from !== params.from) return false;
    if (existing.to !== params.to) return false;
    if (existing.triggeredBy !== params.triggeredBy) return false;

    // returnTarget comparison
    const existingReturnTarget = existing.metadata?.returnTarget as string | undefined;
    const requestedReturnTarget = params.returnTarget;

    // Both have returnTarget: must match
    if (existingReturnTarget && requestedReturnTarget) {
      return existingReturnTarget === requestedReturnTarget;
    }

    // One has returnTarget, other doesn't: mismatch
    if (existingReturnTarget !== requestedReturnTarget) {
      return false;
    }

    // Neither has returnTarget: match
    return true;
  }

  /**
   * Build metadata for state transition record.
   * 
   * Includes returnTarget for exception states.
   */
  private buildMetadata(params: TransitionParams): Record<string, unknown> {
    const metadata: Record<string, unknown> = {
      ...(params.metadata || {})
    };

    // Add returnTarget for exception states
    if (params.returnTarget) {
      metadata.returnTarget = params.returnTarget;
    }

    return metadata;
  }

  /**
   * Check for state drift from already-read records.
   * 
   * @throws Error if drift detected
   */
  private async checkDriftFromRecords(
    records: any[],
    expectedState: string
  ): Promise<void> {
    if (records.length === 0) {
      throw new Error(`No transaction log found for project`);
    }

    const projections = this.projectionBuilder.rebuildFromLog(records);
    const actualState = projections.currentState.state;

    if (actualState !== expectedState) {
      throw new Error(
        `FATAL: State drift detected. ` +
        `Expected: ${expectedState}, Actual: ${actualState}. ` +
        `Transaction log is authoritative. Projection may be corrupted.`
      );
    }
  }

  /**
   * Get current state for project.
   */
  async getCurrentState(projectId: string): Promise<string> {
    const needsMigration = await this.migrationEngine.detectM1Project(projectId);
    if (needsMigration) {
      await this.migrationEngine.migrateM1Project(projectId);
    }

    const records = await this.transactionLog.readAll(projectId);
    
    if (records.length === 0) {
      throw new Error(`No transaction log found for project ${projectId}`);
    }

    const projections = this.projectionBuilder.rebuildFromLog(records);
    return projections.currentState.state;
  }
}
