import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../logging/Logger';

/**
 * Transaction log record types.
 * 
 * Per M2.1 design:
 * - INITIAL_STATE: bootstrap record, written once
 * - STATE_TRANSITION: all subsequent state changes
 */
export type LogRecord = InitialStateRecord | StateTransitionRecord;

export interface InitialStateRecord {
  txId: string;
  projectId: string;
  recordType: 'INITIAL_STATE';
  timestamp: string;
  state: string;
  triggeredBy: string;
}

export interface StateTransitionRecord {
  txId: string;
  projectId: string;
  recordType: 'STATE_TRANSITION';
  timestamp: string;
  triggeredBy: string;
  from: string;
  to: string;
  metadata?: Record<string, unknown>;
}

/**
 * Transaction log - authoritative append-only write-ahead log.
 * 
 * Architecture:
 * - transaction.log is the authoritative source of truth
 * - Newline-delimited JSON (JSONL) format
 * - Each record is a single line terminated with \n
 * - Uses fsync after each append for durability
 * - Supports crash recovery for incomplete physical writes
 */
export class TransactionLog {
  private workspaceRoot: string;

  constructor(workspaceRoot: string = './projects') {
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * Get path to transaction.log file.
   */
  getTransactionLogPath(projectId: string): string {
    return path.join(this.workspaceRoot, projectId, 'transaction.log');
  }

  /**
   * Check if transaction log exists for project.
   */
  exists(projectId: string): boolean {
    return fs.existsSync(this.getTransactionLogPath(projectId));
  }

  /**
   * Append a log record to transaction.log.
   * 
   * Atomic append with fsync for durability.
   */
  async append(record: LogRecord): Promise<void> {
    const logPath = this.getTransactionLogPath(record.projectId);
    const line = JSON.stringify(record) + '\n';

    const fileHandle = await fs.promises.open(logPath, 'a');
    
    try {
      await fileHandle.write(line);
      await fileHandle.datasync();
      
      logger.debug('Transaction log appended', {
        component: 'TransactionLog',
        projectId: record.projectId,
        recordType: record.recordType,
        txId: record.txId
      });
    } finally {
      await fileHandle.close();
    }
  }

  /**
   * Read all log records from transaction.log.
   * 
   * Performs crash recovery if needed.
   * @throws Error on unrecoverable corruption
   */
  async readAll(projectId: string): Promise<LogRecord[]> {
    const logPath = this.getTransactionLogPath(projectId);
    
    if (!fs.existsSync(logPath)) {
      return [];
    }

    const buffer = await fs.promises.readFile(logPath);
    
    // Check for incomplete physical tail
    const needsRecovery = buffer.length > 0 && !this.endsWithNewline(buffer);
    
    if (needsRecovery) {
      logger.warn('Incomplete physical tail detected, attempting recovery', {
        component: 'TransactionLog',
        projectId
      });
      
      await this.recoverFromIncompleteWrite(projectId, buffer);
      return this.readAll(projectId);
    }

    // Parse line-by-line
    const content = buffer.toString('utf-8');
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    const records: LogRecord[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      try {
        const record = JSON.parse(line);
        
        if (!this.isValidLogRecord(record)) {
          throw new Error(
            `FATAL: Invalid record structure at line ${i + 1}. ` +
            `Transaction log corrupted. Manual intervention required.`
          );
        }
        
        records.push(record as LogRecord);
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new Error(
            `FATAL: Corrupt complete record at line ${i + 1}. ` +
            `Transaction log corrupted. Manual intervention required. ` +
            `Error: ${(error as Error).message}`
          );
        }
        throw error;
      }
    }

    return records;
  }

  /**
   * Recover from incomplete physical write.
   */
  private async recoverFromIncompleteWrite(
    projectId: string,
    buffer: Buffer
  ): Promise<void> {
    const content = buffer.toString('utf-8');
    const lastNewlineIndex = content.lastIndexOf('\n');
    
    if (lastNewlineIndex === -1) {
      throw new Error(
        `FATAL: Transaction log has no valid records. Manual intervention required.`
      );
    }

    const completePortion = content.substring(0, lastNewlineIndex + 1);
    const incompleteTail = content.substring(lastNewlineIndex + 1);
    
    // Validate complete portion
    const lines = completePortion.split('\n').filter(line => line.trim().length > 0);
    
    for (let i = 0; i < lines.length; i++) {
      try {
        const record = JSON.parse(lines[i]);
        if (!this.isValidLogRecord(record)) {
          throw new Error(`Invalid record structure at line ${i + 1}`);
        }
      } catch (error) {
        throw new Error(
          `FATAL: Historical corruption detected at line ${i + 1}. ` +
          `Transaction log corrupted. Manual intervention required. ` +
          `Error: ${(error as Error).message}`
        );
      }
    }

    const logPath = this.getTransactionLogPath(projectId);
    await fs.promises.writeFile(logPath, completePortion, 'utf-8');
    
    logger.warn('Incomplete tail truncated, recovery successful', {
      component: 'TransactionLog',
      projectId,
      incompleteTail: incompleteTail.substring(0, 100),
      recoveredRecords: lines.length
    });
  }

  private endsWithNewline(buffer: Buffer): boolean {
    if (buffer.length === 0) return false;

    // LF termination (0x0A) covers both Unix (\n) and Windows (\r\n) writes:
    // a CRLF-terminated file always ends with \n. JSON.parse also tolerates
    // a trailing \r within a split line, so no separate CR check is needed.
    return buffer[buffer.length - 1] === 0x0A;
  }

  private isValidLogRecord(record: unknown): boolean {
    if (typeof record !== 'object' || record === null) return false;
    
    const r = record as Record<string, unknown>;
    
    if (typeof r.txId !== 'string') return false;
    if (typeof r.projectId !== 'string') return false;
    if (typeof r.recordType !== 'string') return false;
    if (typeof r.timestamp !== 'string') return false;
    if (typeof r.triggeredBy !== 'string') return false;
    
    if (r.recordType === 'INITIAL_STATE') {
      if (typeof r.state !== 'string') return false;
      return true;
    }
    
    if (r.recordType === 'STATE_TRANSITION') {
      if (typeof r.from !== 'string') return false;
      if (typeof r.to !== 'string') return false;
      return true;
    }
    
    return false;
  }

  /**
   * Find a record by txId.
   * 
   * Scans all records in the transaction log.
   * Used for txId deduplication within the project lock.
   */
  async findRecordByTxId(
    projectId: string,
    txId: string
  ): Promise<StateTransitionRecord | null> {
    const records = await this.readAll(projectId);
    
    for (const record of records) {
      if (record.recordType === 'STATE_TRANSITION' && record.txId === txId) {
        return record as StateTransitionRecord;
      }
    }
    
    return null;
  }

  /**
   * Initialize transaction log with INITIAL_STATE record.
   */
  async initialize(
    projectId: string,
    initialState: string,
    txId: string,
    triggeredBy: string = 'SYSTEM_BOOTSTRAP'
  ): Promise<void> {
    const record: InitialStateRecord = {
      txId,
      projectId,
      recordType: 'INITIAL_STATE',
      timestamp: new Date().toISOString(),
      state: initialState,
      triggeredBy
    };

    await this.append(record);
    
    logger.info('Transaction log initialized', {
      component: 'TransactionLog',
      projectId,
      initialState,
      txId
    });
  }
}
