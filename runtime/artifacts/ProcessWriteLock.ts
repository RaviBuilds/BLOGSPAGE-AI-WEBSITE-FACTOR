import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../logging/Logger';
import { assertPathInsideWorkspace, validateProjectId } from './validateProjectId';

/**
 * Configuration for ProcessWriteLock behavior.
 */
export interface ProcessWriteLockConfig {
  maxWaitMs?: number;
  staleAgeMs?: number;
  retryDelayMs?: number;
}

/**
 * Per-project filesystem lock guarding artifact writes.
 *
 * Deliberately a SEPARATE lock file from M2.1's state/ProjectLock.ts
 * (.state-transition.lock): artifact persistence (M2.3-A) and state
 * transitions (M2.1, frozen) are independent concerns that must not
 * contend on the same lock, since a gate evaluation can need to read
 * artifacts while a concurrent artifact write is in progress for a
 * different artifact type, and vice versa for state transitions. Holding
 * a single shared lock across both would serialize unrelated operations
 * and risk deadlock if either layer is ever composed to acquire both locks
 * in inconsistent order.
 *
 * Lock file: .artifact-write.lock, at projects/{projectId}/.artifact-write.lock
 *
 * Mechanism mirrors state/ProjectLock.ts exactly (atomic 'wx' file creation,
 * stale-lock detection and removal, retry loop) because that is this
 * codebase's established, working pattern for filesystem-based mutual
 * exclusion on Windows and POSIX alike. This is a new, independent
 * implementation — it does not import from or modify state/ProjectLock.ts.
 */
export class ProcessWriteLock {
  private workspaceRoot: string;
  private readonly maxWaitMs: number;
  private readonly staleAgeMs: number;
  private readonly retryDelayMs: number;

  constructor(workspaceRoot: string = './projects', config?: ProcessWriteLockConfig) {
    this.workspaceRoot = workspaceRoot;
    this.maxWaitMs = config?.maxWaitMs ?? 30000;
    this.staleAgeMs = config?.staleAgeMs ?? 60000;
    this.retryDelayMs = config?.retryDelayMs ?? 100;
  }

  private getLockPath(projectId: string): string {
    // HIGH-1 fix: lock paths use the SAME validated project identity as the
    // artifact and manifest paths. Validation happens before acquire()'s
    // mkdir, so an invalid projectId can create no directories and no lock
    // files anywhere.
    validateProjectId(projectId);
    const lockPath = path.join(this.workspaceRoot, projectId, '.artifact-write.lock');
    return assertPathInsideWorkspace(lockPath, this.workspaceRoot);
  }

  /**
   * Acquire exclusive artifact-write lock for project.
   *
   * @throws Error if lock acquisition times out
   */
  async acquire(projectId: string): Promise<void> {
    const lockPath = this.getLockPath(projectId);
    const startTime = Date.now();

    // Ensure parent directory exists before attempting lock creation.
    await fs.promises.mkdir(path.dirname(lockPath), { recursive: true });

    while (Date.now() - startTime < this.maxWaitMs) {
      try {
        const fd = await fs.promises.open(lockPath, 'wx');

        const lockData = {
          owner: 'artifact-write',
          pid: process.pid,
          acquiredAt: new Date().toISOString()
        };

        await fs.promises.writeFile(fd, JSON.stringify(lockData, null, 2));
        await fd.close();

        logger.debug('Artifact write lock acquired', {
          component: 'ProcessWriteLock',
          projectId,
          pid: process.pid
        });

        return;
      } catch (error) {
        const err = error as NodeJS.ErrnoException;

        if (err.code === 'EEXIST') {
          const lockAge = await this.getLockAge(lockPath);

          if (lockAge !== null && lockAge > this.staleAgeMs) {
            logger.warn('Removing stale artifact write lock', {
              component: 'ProcessWriteLock',
              projectId,
              lockAgeMs: lockAge
            });

            try {
              await fs.promises.unlink(lockPath);
            } catch (unlinkError) {
              if ((unlinkError as NodeJS.ErrnoException).code !== 'ENOENT') {
                throw unlinkError;
              }
            }

            continue;
          }

          await this.sleep(this.retryDelayMs);
          continue;
        }

        throw error;
      }
    }

    throw new Error(
      `Artifact write lock acquisition timeout for project ${projectId} after ${this.maxWaitMs}ms`
    );
  }

  /**
   * Release the artifact-write lock for project.
   */
  async release(projectId: string): Promise<void> {
    const lockPath = this.getLockPath(projectId);

    try {
      await fs.promises.unlink(lockPath);

      logger.debug('Artifact write lock released', {
        component: 'ProcessWriteLock',
        projectId,
        pid: process.pid
      });
    } catch (error) {
      const err = error as NodeJS.ErrnoException;

      if (err.code !== 'ENOENT') {
        logger.error('Failed to release artifact write lock', {
          component: 'ProcessWriteLock',
          projectId,
          error: err.message
        });
        throw error;
      }
    }
  }

  /**
   * Execute a function with the artifact-write lock held.
   *
   * Ensures the lock is always released even if the function throws.
   */
  async withLock<T>(projectId: string, fn: () => Promise<T>): Promise<T> {
    await this.acquire(projectId);

    try {
      return await fn();
    } finally {
      await this.release(projectId);
    }
  }

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
