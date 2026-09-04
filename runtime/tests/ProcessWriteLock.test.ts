/**
 * ProcessWriteLock tests — M2.3-A.
 *
 * Mirrors state/ProjectLock.test.ts's coverage pattern (stale lock removal,
 * active lock timeout, ENOENT on release) for this independent lock file.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { ProcessWriteLock } from '../artifacts/ProcessWriteLock';

describe('ProcessWriteLock', () => {
  const testWorkspace = path.join(__dirname, 'test-workspace-write-lock');
  let lock: ProcessWriteLock;

  beforeAll(async () => {
    await fs.mkdir(testWorkspace, { recursive: true });
  });

  beforeEach(() => {
    lock = new ProcessWriteLock(testWorkspace, {
      maxWaitMs: 2000,
      staleAgeMs: 5000,
      retryDelayMs: 50
    });
  });

  afterAll(async () => {
    await fs.rm(testWorkspace, { recursive: true, force: true });
  });

  test('acquire then release works for a fresh project', async () => {
    const projectId = 'test-basic';
    await lock.acquire(projectId);

    const lockPath = path.join(testWorkspace, projectId, '.artifact-write.lock');
    const lockData = JSON.parse(await fs.readFile(lockPath, 'utf-8'));
    expect(lockData.pid).toBe(process.pid);
    expect(lockData.owner).toBe('artifact-write');

    await lock.release(projectId);
    await expect(fs.access(lockPath)).rejects.toThrow();
  });

  test('withLock releases the lock even if the function throws', async () => {
    const projectId = 'test-withlock-throw';

    await expect(
      lock.withLock(projectId, async () => {
        throw new Error('boom');
      })
    ).rejects.toThrow('boom');

    // Lock must be released, so a fresh acquire succeeds immediately.
    await lock.acquire(projectId);
    await lock.release(projectId);
  });

  test('removes a stale lock and acquires', async () => {
    const projectId = 'test-stale';
    const projectPath = path.join(testWorkspace, projectId);
    await fs.mkdir(projectPath, { recursive: true });

    const lockPath = path.join(projectPath, '.artifact-write.lock');
    await fs.writeFile(lockPath, JSON.stringify({ owner: 'stale', pid: 99999 }));
    const oldTime = new Date(Date.now() - 6000);
    await fs.utimes(lockPath, oldTime, oldTime);

    await lock.acquire(projectId);
    const lockData = JSON.parse(await fs.readFile(lockPath, 'utf-8'));
    expect(lockData.pid).toBe(process.pid);

    await lock.release(projectId);
  });

  test('times out against an active lock', async () => {
    const projectId = 'test-timeout';
    await lock.acquire(projectId);

    const lock2 = new ProcessWriteLock(testWorkspace, {
      maxWaitMs: 300,
      staleAgeMs: 10000,
      retryDelayMs: 50
    });

    await expect(lock2.acquire(projectId)).rejects.toThrow(/timeout/i);
    await lock.release(projectId);
  });

  test('release on an already-released lock does not throw (ENOENT tolerated)', async () => {
    const projectId = 'test-double-release';
    await lock.acquire(projectId);
    await lock.release(projectId);
    await expect(lock.release(projectId)).resolves.toBeUndefined();
  });
});
