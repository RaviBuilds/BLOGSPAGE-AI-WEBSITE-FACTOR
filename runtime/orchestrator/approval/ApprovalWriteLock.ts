/**
 * Per-project filesystem lock guarding APPROVAL-record writes (M2.3-B).
 *
 * WHY A SEPARATE LOCK
 * -------------------
 * The M2.3-A `artifacts/ProcessWriteLock` hardcodes its lock file
 * (`.artifact-write.lock`) and is frozen for this milestone. Approval records
 * are an independent concern — a human decision must never contend on, or be
 * serialized behind, artifact persistence for unrelated artifacts. Reusing the
 * artifact lock would couple the two and risk deadlock if a future caller ever
 * composes them in inconsistent order.
 *
 * This mirrors the codebase's own established precedent: `ProcessWriteLock`
 * documents that it is "a new, independent implementation — it does not import
 * from or modify state/ProjectLock.ts", precisely because an independent
 * concern needs an independent lock. The same reasoning applies here.
 *
 * Lock file: `{workspaceRoot}/{projectId}/.approval-write.lock`
 * Mechanism: atomic 'wx' creation, stale-lock detection and removal, retry
 * loop — the same working pattern used by state/ProjectLock.ts and
 * artifacts/ProcessWriteLock.ts.
 *
 * PATH SAFETY: `validateProjectId` and `assertPathInsideWorkspace` are
 * imported UNMODIFIED from artifacts/validateProjectId.ts, so approval paths
 * share the exact project-isolation guarantees as artifact paths.
 *
 * M2.3-B Milestone: Seam 1, gate condition contracts, human approval/resume.
 * Factory version: 0.2.0
 */

import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../../logging/Logger';
import {
  assertPathInsideWorkspace,
  validateProjectId
} from '../../artifacts/validateProjectId';

export interface ApprovalWriteLockConfig {
  maxWaitMs?: number;
  staleAgeMs?: number;
  retryDelayMs?: number;
}

export class ApprovalWriteLock {
  private readonly workspaceRoot: string;
  private readonly maxWaitMs: number;
  private readonly staleAgeMs: number;
  private readonly retryDelayMs: number;

  constructor(workspaceRoot: string = './projects', config?: ApprovalWriteLockConfig) {
    this.workspaceRoot = workspaceRoot;
    this.maxWaitMs = config?.maxWaitMs ?? 30000;
    this.staleAgeMs = config?.staleAgeMs ?? 60000;
    this.retryDelayMs = config?.retryDelayMs ?? 100;
  }

  private getLockPath(projectId: string): string {
    // Validation happens before acquire()'s mkdir, so an invalid projectId can
    // create no directories and no lock files anywhere (HIGH-1 discipline).
    validateProjectId(projectId);
    const lockPath = path.join(this.workspaceRoot, projectId, '.approval-write.lock');
    return assertPathInsideWorkspace(lockPath, this.workspaceRoot);
  }

  async acquire(projectId: string): Promise<void> {
    const lockPath = this.getLockPath(projectId);
    const startTime = Date.now();

    await fs.promises.mkdir(path.dirname(lockPath), { recursive: true });

    while (Date.now() - startTime < this.maxWaitMs) {
      try {
        const fd = await fs.promises.open(lockPath, 'wx');
        await fs.promises.writeFile(
          fd,
          JSON.stringify(
            { owner: 'approval-write', pid: process.pid, acquiredAt: new Date().toISOString() },
            null,
            2
          )
        );
        await fd.close();

        logger.debug('Approval write lock acquired', {
          component: 'ApprovalWriteLock',
          projectId,
          pid: process.pid
        });
        return;
      } catch (error) {
        const err = error as NodeJS.ErrnoException;

        if (err.code === 'EEXIST') {
          const lockAge = await this.getLockAge(lockPath);

          if (lockAge !== null && lockAge > this.staleAgeMs) {
            logger.warn('Removing stale approval write lock', {
              component: 'ApprovalWriteLock',
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
      `Approval write lock acquisition timeout for project ${projectId} after ${this.maxWaitMs}ms`
    );
  }

  async release(projectId: string): Promise<void> {
    const lockPath = this.getLockPath(projectId);

    try {
      await fs.promises.unlink(lockPath);
      logger.debug('Approval write lock released', {
        component: 'ApprovalWriteLock',
        projectId,
        pid: process.pid
      });
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code !== 'ENOENT') {
        logger.error('Failed to release approval write lock', {
          component: 'ApprovalWriteLock',
          projectId,
          error: err.message
        });
        throw error;
      }
    }
  }

  /** Runs `fn` with the lock held, always releasing it (even on throw). */
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
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}