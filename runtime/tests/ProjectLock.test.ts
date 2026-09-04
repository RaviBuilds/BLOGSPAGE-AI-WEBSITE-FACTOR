/**
 * ProjectLock Advanced Tests
 * 
 * Tests stale lock handling, timeout behavior, and error paths.
 * Focus on branch coverage for M2.1 acceptance.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { ProjectLock } from '../state/ProjectLock';

describe('ProjectLock - Advanced Scenarios', () => {
  const testWorkspace = path.join(__dirname, 'test-workspace-lock-advanced');
  let lock: ProjectLock;

  beforeAll(async () => {
    await fs.mkdir(testWorkspace, { recursive: true });
  });

  beforeEach(() => {
    lock = new ProjectLock(testWorkspace, {
      maxWaitMs: 2000,
      staleAgeMs: 5000, // 5 seconds
      retryDelayMs: 50
    });
  });

  afterEach(async () => {
    // Cleanup any lock files
    try {
      const dirs = await fs.readdir(testWorkspace);
      for (const dir of dirs) {
        const lockPath = path.join(testWorkspace, dir, '.state-transition.lock');
        await fs.unlink(lockPath).catch(() => {});
      }
    } catch {}
  });

  afterAll(async () => {
    await fs.rm(testWorkspace, { recursive: true, force: true });
  });

  describe('Stale Lock Handling', () => {
    test('should remove stale lock and acquire', async () => {
      const projectId = 'test-stale-lock';
      const projectPath = path.join(testWorkspace, projectId);
      await fs.mkdir(projectPath, { recursive: true });
      
      // Create a lock file
      const lockPath = path.join(projectPath, '.state-transition.lock');
      const staleLock = {
        owner: 'stale-process',
        pid: 99999,
        acquiredAt: new Date(Date.now() - 10000).toISOString()
      };
      await fs.writeFile(lockPath, JSON.stringify(staleLock));
      
      // Manually set the file modification time to be old (6 seconds ago, older than staleAgeMs=5000)
      const oldTime = new Date(Date.now() - 6000);
      await fs.utimes(lockPath, oldTime, oldTime);
      
      // Should detect stale lock, remove it, and acquire
      await lock.acquire(projectId);
      
      // Verify lock is now held by current process
      const lockData = JSON.parse(await fs.readFile(lockPath, 'utf-8'));
      expect(lockData.pid).toBe(process.pid);
      
      await lock.release(projectId);
    });

    test('should not remove active lock', async () => {
      const projectId = 'test-active-lock';
      const projectPath = path.join(testWorkspace, projectId);
      await fs.mkdir(projectPath, { recursive: true });
      
      // Create recent lock file (within staleAgeMs)
      const lockPath = path.join(projectPath, '.state-transition.lock');
      const activeLock = {
        owner: 'active-process',
        pid: 88888,
        acquiredAt: new Date().toISOString()
      };
      await fs.writeFile(lockPath, JSON.stringify(activeLock));
      
      // Should timeout without removing active lock
      await expect(lock.acquire(projectId)).rejects.toThrow(/timeout/i);
      
      // Verify original lock still exists
      const lockData = JSON.parse(await fs.readFile(lockPath, 'utf-8'));
      expect(lockData.pid).toBe(88888);
      
      // Cleanup
      await fs.unlink(lockPath);
    });
  });

  describe('Error Handling', () => {
    test('should handle lock already released (ENOENT)', async () => {
      const projectId = 'test-enoent-release';
      const projectPath = path.join(testWorkspace, projectId);
      await fs.mkdir(projectPath, { recursive: true });
      
      // Lock doesn't exist, release should handle gracefully
      await expect(lock.release(projectId)).resolves.not.toThrow();
    });

    test('should rethrow non-ENOENT error when stale lock removal fails', async () => {
      const projectId = 'test-stale-unlink-fail';
      const projectPath = path.join(testWorkspace, projectId);
      await fs.mkdir(projectPath, { recursive: true });

      const lockPath = path.join(projectPath, '.state-transition.lock');
      await fs.writeFile(lockPath, JSON.stringify({ owner: 'stale' }));
      const oldTime = new Date(Date.now() - 6000);
      await fs.utimes(lockPath, oldTime, oldTime);

      // Force unlink of the lock file to fail with a non-ENOENT error
      const fsSync = require('fs') as typeof import('fs');
      const realUnlink = fsSync.promises.unlink.bind(fsSync.promises);
      const spy = jest.spyOn(fsSync.promises, 'unlink').mockImplementation(
        async (p: any) => {
          if (String(p).endsWith('.state-transition.lock')) {
            const err = new Error('EPERM: operation not permitted') as NodeJS.ErrnoException;
            err.code = 'EPERM';
            throw err;
          }
          return realUnlink(p);
        }
      );

      try {
        await expect(lock.acquire(projectId)).rejects.toThrow(/EPERM/);
        // Stale lock must NOT have been silently consumed
        expect(fsSync.existsSync(lockPath)).toBe(true);
      } finally {
        spy.mockRestore();
      }
    });

    test('should throw on non-ENOENT release failure', async () => {
      const projectId = 'test-release-unlink-fail';
      const projectPath = path.join(testWorkspace, projectId);
      await fs.mkdir(projectPath, { recursive: true });

      await lock.acquire(projectId);
      const lockPath = path.join(projectPath, '.state-transition.lock');
      const fsSyncCheck = require('fs') as typeof import('fs');
      expect(fsSyncCheck.existsSync(lockPath)).toBe(true);

      const fsSync = require('fs') as typeof import('fs');
      const realUnlink = fsSync.promises.unlink.bind(fsSync.promises);
      const spy = jest.spyOn(fsSync.promises, 'unlink').mockImplementation(async () => {
        const err = new Error('EPERM: operation not permitted') as NodeJS.ErrnoException;
        err.code = 'EPERM';
        throw err;
      });

      try {
        await expect(lock.release(projectId)).rejects.toThrow(/EPERM/);
      } finally {
        spy.mockRestore();
        // Cleanup the still-held lock
        await realUnlink(lockPath).catch(() => {});
      }
    });

    test('should handle getLockAge on missing lock file', async () => {
      const projectId = 'test-missing-lock';
      const projectPath = path.join(testWorkspace, projectId);
      await fs.mkdir(projectPath, { recursive: true });
      
      // getLockAge should return null for non-existent lock
      const age = await (lock as any).getLockAge(projectId);
      expect(age).toBeNull();
    });
  });

  describe('Timeout', () => {
    test('should timeout if lock held beyond maxWaitMs', async () => {
      const projectId = 'test-timeout';
      const projectPath = path.join(testWorkspace, projectId);
      await fs.mkdir(projectPath, { recursive: true });
      
      // Acquire lock with first instance
      await lock.acquire(projectId);
      
      // Try to acquire with second instance (should timeout quickly)
      const lock2 = new ProjectLock(testWorkspace, {
        maxWaitMs: 500,
        staleAgeMs: 10000,
        retryDelayMs: 50
      });
      
      await expect(lock2.acquire(projectId)).rejects.toThrow(/timeout/i);
      
      await lock.release(projectId);
    });
  });
});
