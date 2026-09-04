import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../logging/Logger';

/**
 * Configuration for ProjectLock behavior.
 */
export interface ProjectLockConfig {
  maxWaitMs?: number;
  staleAgeMs?: number;
  retryDelayMs?: number;
}

/**
 * Per-project filesystem lock for state transitions and migration.
 * 
 * Uses atomic file creation with 'wx' flag to ensure only one process
 * can acquire the lock at a time.
 * 
 * Lock file: .state-transition.lock
 * Protects: transaction.log writes, migration
 */
export class ProjectLock {
  private workspaceRoot: string;
  private readonly maxWaitMs: number;
  private readonly staleAgeMs: number;
  private readonly retryDelayMs: number;

  constructor(workspaceRoot: string = './projects', config?: ProjectLockConfig) {
    this.workspaceRoot = workspaceRoot;
    this.maxWaitMs = config?.maxWaitMs ?? 30000; // 30 second timeout
    this.staleAgeMs = config?.staleAgeMs ?? 60000; // 60 second stale threshold
    this.retryDelayMs = config?.retryDelayMs ?? 100;
  }

  /**
   * Get path to lock file.
   */
  private getLockPath(projectId: string): string {
    return path.join(this.workspaceRoot, projectId, '.state-transition.lock');
  }

  /**
   * Acquire exclusive lock for project.
   * 
   * Atomically creates lock file using 'wx' flag.
   * Retries with timeout if lock is held by another process.
   * Removes stale locks (>60s old).
   * 
   * @throws Error if lock acquisition times out
   */
  async acquire(projectId: string): Promise<void> {
    const lockPath = this.getLockPath(projectId);
    const startTime = Date.now();

    while (Date.now() - startTime < this.maxWaitMs) {
      try {
        // Atomic exclusive creation
        const fd = await fs.promises.open(lockPath, 'wx');
        
        // Write lock metadata
        const lockData = {
          owner: 'state-transition',
          pid: process.pid,
          acquiredAt: new Date().toISOString()
        };
        
        await fs.promises.writeFile(fd, JSON.stringify(lockData, null, 2));
        await fd.close();

        logger.debug('Lock acquired', {
          component: 'ProjectLock',
          projectId,
          pid: process.pid
        });

        return; // Success
      } catch (error) {
        const err = error as NodeJS.ErrnoException;
        
        if (err.code === 'EEXIST') {
          // Lock exists, check if stale
          const lockAge = await this.getLockAge(lockPath);
          
          if (lockAge !== null && lockAge > this.staleAgeMs) {
            logger.warn('Removing stale lock', {
              component: 'ProjectLock',
              projectId,
              lockAgeMs: lockAge
            });
            
            try {
              await fs.promises.unlink(lockPath);
            } catch (unlinkError) {
              // Another process may have removed it
              if ((unlinkError as NodeJS.ErrnoException).code !== 'ENOENT') {
                throw unlinkError;
              }
            }
            
            continue; // Retry acquisition
          }

          // Active lock, wait and retry
          await this.sleep(this.retryDelayMs);
          continue;
        }

        // Unexpected error
        throw error;
      }
    }

    throw new Error(
      `Lock acquisition timeout for project ${projectId} after ${this.maxWaitMs}ms`
    );
  }

  /**
   * Release lock for project.
   */
  async release(projectId: string): Promise<void> {
    const lockPath = this.getLockPath(projectId);

    try {
      await fs.promises.unlink(lockPath);
      
      logger.debug('Lock released', {
        component: 'ProjectLock',
        projectId,
        pid: process.pid
      });
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      
      if (err.code !== 'ENOENT') {
        logger.error('Failed to release lock', {
          component: 'ProjectLock',
          projectId,
          error: err.message
        });
        throw error;
      }
    }
  }

  /**
   * Execute function with lock held.
   * 
   * Ensures lock is always released even if function throws.
   */
  async withLock<T>(projectId: string, fn: () => Promise<T>): Promise<T> {
    await this.acquire(projectId);
    
    try {
      return await fn();
    } finally {
      await this.release(projectId);
    }
  }

  /**
   * Get age of lock file in milliseconds.
   * Returns null if lock doesn't exist.
   */
  private async getLockAge(lockPath: string): Promise<number | null> {
    try {
      const stats = await fs.promises.stat(lockPath);
      return Date.now() - stats.mtimeMs;
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
