import { TransitionEngine, TransitionParams, TransitionResult } from './TransitionEngine';
import { TransactionLog } from './TransactionLog';
import { ProjectionBuilder, StateHistoryProjection } from './ProjectionBuilder';
import { MigrationEngine } from './MigrationEngine';

/**
 * State manager - public API for M2.1 state persistence.
 * 
 * Responsibilities:
 * - Initialize new projects with INITIAL_STATE
 * - Execute state transitions
 * - Query current state
 * - Query state history
 * - Auto-migrate M1 projects
 * 
 * Architecture:
 * - transaction.log is authoritative
 * - current-state.json and state-history.json are derived projections
 * - Per-project locking prevents concurrent modifications
 * - Drift detection ensures consistency
 */
export class StateManager {
  private transitionEngine: TransitionEngine;
  private transactionLog: TransactionLog;
  private projectionBuilder: ProjectionBuilder;
  private migrationEngine: MigrationEngine;

  constructor(workspaceRoot: string = './projects') {
    this.transitionEngine = new TransitionEngine(workspaceRoot);
    this.transactionLog = new TransactionLog(workspaceRoot);
    this.projectionBuilder = new ProjectionBuilder(workspaceRoot);
    this.migrationEngine = new MigrationEngine(workspaceRoot);
  }

  /**
   * Initialize state for new project.
   * 
   * Creates INITIAL_STATE bootstrap record in transaction.log.
   */
  async initializeProject(
    projectId: string,
    initialState: string,
    txId: string
  ): Promise<void> {
    // Validate projectId is not empty
    if (!projectId || projectId.trim() === '') {
      throw new Error('projectId is required and cannot be empty');
    }

    await this.transactionLog.initialize(projectId, initialState, txId);
    
    // Build initial projections
    const records = await this.transactionLog.readAll(projectId);
    const projections = this.projectionBuilder.rebuildFromLog(records);
    await this.projectionBuilder.writeProjections(projectId, projections);
  }

  /**
   * Execute state transition.
   * 
   * @param params Transition parameters with REQUIRED txId
   * @returns TransitionResult with idempotency information
   */
  async transition(params: TransitionParams): Promise<TransitionResult> {
    if (!params.txId) {
      throw new Error('txId is required for state transitions');
    }

    return await this.transitionEngine.executeTransition(params);
  }

  /**
   * Get current state for project.
   */
  async getCurrentState(projectId: string): Promise<string> {
    return this.transitionEngine.getCurrentState(projectId);
  }

  /**
   * Get state history for project.
   */
  async getStateHistory(projectId: string): Promise<StateHistoryProjection> {
    // Check for M1 migration
    const needsMigration = await this.migrationEngine.detectM1Project(projectId);
    if (needsMigration) {
      await this.migrationEngine.migrateM1Project(projectId);
    }

    const records = await this.transactionLog.readAll(projectId);
    const projections = this.projectionBuilder.rebuildFromLog(records);
    return projections.stateHistory;
  }

  /**
   * Check if project exists (has transaction log).
   */
  async projectExists(projectId: string): Promise<boolean> {
    return this.transactionLog.exists(projectId);
  }
}
