/**
 * ProjectId / path-isolation tests — M2.3-A HIGH-1 fix.
 *
 * Verifies the exact validation rule, that every path-constructing component
 * (ArtifactStore, ManifestManager, ProcessWriteLock) rejects traversal,
 * absolute paths and invalid ids BEFORE any filesystem side effect, that the
 * ProcessWriteLock uses the same validated project identity, and that
 * constructed paths always resolve inside the workspace root.
 */

import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { ArtifactStore } from '../artifacts/ArtifactStore';
import { ManifestManager } from '../artifacts/ManifestManager';
import { ProcessWriteLock } from '../artifacts/ProcessWriteLock';
import { ArtifactRepository } from '../artifacts/ArtifactRepository';
import { ArtifactType } from '../artifacts/ArtifactTypes';
import {
  InvalidArtifactVersionError,
  InvalidProjectIdError,
  PROJECT_ID_PATTERN,
  validateProjectId
} from '../artifacts/validateProjectId';

describe('projectId path isolation (HIGH-1)', () => {
  const testWorkspace = path.join(__dirname, 'test-workspace-project-id');
  let store: ArtifactStore;
  let manager: ManifestManager;
  let repo: ArtifactRepository;

  /** Every traversal / absolute-path / invalid-id shape the rule must reject. */
  const invalidIds: string[] = [
    '../escape',
    '..\\escape',
    'a/../b',
    'sub/dir',
    'sub\\dir',
    '/absolute',
    '\\absolute',
    'C:\\absolute',
    '\\\\server\\share',
    '.',
    '..',
    '.hidden',
    'proj x', // whitespace
    'proj\t x', // tab
    ''
  ];

  beforeEach(() => {
    store = new ArtifactStore(testWorkspace);
    manager = new ManifestManager(testWorkspace);
    repo = new ArtifactRepository(testWorkspace);
  });

  afterEach(async () => {
    await fs.rm(testWorkspace, { recursive: true, force: true });
  });

  test('the validation rule accepts sane ids and rejects every invalid shape', () => {
    expect(PROJECT_ID_PATTERN.test('proj-1')).toBe(true);
    expect(PROJECT_ID_PATTERN.test('Proj_2026.site-01')).toBe(true);
    expect(validateProjectId('x'.repeat(128))).toBe('x'.repeat(128));

    for (const bad of invalidIds) {
      expect(() => validateProjectId(bad)).toThrow(InvalidProjectIdError);
    }
    for (const bad of [null, undefined, 42, {}, []]) {
      expect(() => validateProjectId(bad as unknown as string)).toThrow(InvalidProjectIdError);
    }
    expect(() => validateProjectId('x'.repeat(129))).toThrow(InvalidProjectIdError);
  });

  test('ArtifactStore path builders reject invalid ids and stay inside the workspace', () => {
    for (const bad of invalidIds) {
      expect(() =>
        store.getArtifactVersionPath(bad, ArtifactType.BUSINESS_RESEARCH, 1)
      ).toThrow(InvalidProjectIdError);
    }

    const good = store.getArtifactVersionPath('proj-1', ArtifactType.BUSINESS_RESEARCH, 1);
    const rootWithSeparator = path.resolve(testWorkspace) + path.sep;
    expect(path.resolve(good).startsWith(rootWithSeparator)).toBe(true);
  });

  test('ArtifactStore write/read reject traversal and invalid versions without side effects', async () => {
    await expect(
      store.writeVersion('../escape', ArtifactType.BUSINESS_RESEARCH, 1, { a: 1 })
    ).rejects.toThrow(InvalidProjectIdError);

    // nothing was created outside (or inside) the workspace by the attempt
    expect(fsSync.existsSync(path.resolve(testWorkspace, '..', 'escape'))).toBe(false);
    expect(fsSync.existsSync(path.join(testWorkspace, 'escape'))).toBe(false);

    for (const badVersion of [0, -1, 1.5, NaN, Infinity]) {
      await expect(
        store.writeVersion('proj-1', ArtifactType.BUSINESS_RESEARCH, badVersion, { a: 1 })
      ).rejects.toThrow(InvalidArtifactVersionError);
      await expect(
        store.readVersion('proj-1', ArtifactType.BUSINESS_RESEARCH, badVersion)
      ).rejects.toThrow(InvalidArtifactVersionError);
    }
    for (const badVersion of ['1', null] as unknown[]) {
      await expect(
        store.writeVersion('proj-1', ArtifactType.BUSINESS_RESEARCH, badVersion as number, {
          a: 1
        })
      ).rejects.toThrow(InvalidArtifactVersionError);
    }
  });

  test('ManifestManager read/write reject invalid ids', async () => {
    for (const bad of ['../escape', 'sub/dir', '']) {
      await expect(manager.read(bad)).rejects.toThrow(InvalidProjectIdError);
      await expect(
        manager.write(bad, { projectId: bad, artifacts: {} })
      ).rejects.toThrow(InvalidProjectIdError);
    }
  });

  test('ProcessWriteLock rejects invalid ids without creating directories or lock files', async () => {
    const lock = new ProcessWriteLock(testWorkspace);

    await expect(lock.withLock('../escape', async () => undefined)).rejects.toThrow(
      InvalidProjectIdError
    );

    // the traversal target was never created — validation fires before
    // acquire()'s mkdir
    expect(fsSync.existsSync(path.resolve(testWorkspace, '..', 'escape'))).toBe(false);
    expect(fsSync.existsSync(path.join(testWorkspace, 'escape'))).toBe(false);
  });

  test('ArtifactRepository public API rejects invalid ids/versions before any side effect', async () => {
    for (const bad of ['../escape', 'sub\\dir', '.']) {
      await expect(
        repo.saveArtifact(bad, ArtifactType.BUSINESS_RESEARCH, {
          artifactId: 'x'
        } as unknown as Parameters<typeof repo.saveArtifact>[2])
      ).rejects.toThrow(InvalidProjectIdError);
      await expect(
        repo.getCurrentArtifact(bad, ArtifactType.BUSINESS_RESEARCH)
      ).rejects.toThrow(InvalidProjectIdError);
      await expect(repo.hasArtifact(bad, ArtifactType.BUSINESS_RESEARCH)).rejects.toThrow(
        InvalidProjectIdError
      );
    }

    await expect(
      repo.getArtifactVersion('proj-1', ArtifactType.BUSINESS_RESEARCH, 0)
    ).rejects.toThrow(InvalidArtifactVersionError);
    await expect(
      repo.getArtifactVersion('proj-1', ArtifactType.BUSINESS_RESEARCH, NaN)
    ).rejects.toThrow(InvalidArtifactVersionError);

    expect(fsSync.existsSync(path.resolve(testWorkspace, '..', 'escape'))).toBe(false);
  });
});

describe('projectId Windows identity hardening (M2.3-A remediation)', () => {
  const testWorkspace = path.join(__dirname, 'test-workspace-project-id-win');
  let store: ArtifactStore;

  beforeEach(() => {
    store = new ArtifactStore(testWorkspace);
  });

  afterEach(async () => {
    await fs.rm(testWorkspace, { recursive: true, force: true });
  });

  test('rejects uppercase ids: NTFS is case-insensitive, Foo and foo would collide', () => {
    for (const bad of ['Foo', 'MyProject', 'Dental-001', 'PROJECT_123', 'ABC']) {
      expect(() => validateProjectId(bad)).toThrow(InvalidProjectIdError);
      expect(() => validateProjectId(bad)).toThrow(/lowercase/i);
    }
    // the equivalent lowercase ids remain valid
    expect(validateProjectId('foo')).toBe('foo');
    expect(validateProjectId('abc')).toBe('abc');
    expect(validateProjectId('myproject')).toBe('myproject');
    expect(validateProjectId('dental-001')).toBe('dental-001');
    expect(validateProjectId('project_123')).toBe('project_123');
  });

  test('rejects trailing dots: Windows path resolution strips them, abc. would collide with abc', () => {
    for (const bad of ['abc.', 'abc...', 'foo.', 'a.b.']) {
      expect(() => validateProjectId(bad)).toThrow(InvalidProjectIdError);
      expect(() => validateProjectId(bad)).toThrow(/trailing dot/i);
    }
    // interior dots remain valid
    expect(validateProjectId('abc.def')).toBe('abc.def');
    expect(validateProjectId('proj.site-01')).toBe('proj.site-01');
  });

  test('rejects Windows reserved device names, with or without extension', () => {
    for (const bad of [
      'CON', 'PRN', 'AUX', 'NUL',
      'COM1', 'COM2', 'COM9',
      'LPT1', 'LPT9',
      'CONIN$', 'CONOUT$',
      'nul', 'con', 'com1',
      'NUL.json', 'con.txt', 'com1.md'
    ]) {
      expect(() => validateProjectId(bad)).toThrow(InvalidProjectIdError);
    }
    // reserved-name rejection explains itself ('nul' passes the lowercase
    // check and reaches the reserved-name check)
    expect(() => validateProjectId('nul')).toThrow(/reserved/i);
  });

  test('rejects ids containing whitespace', () => {
    for (const bad of ['abc ', ' abc', 'ab c', 'abc\t', 'abc\n']) {
      expect(() => validateProjectId(bad)).toThrow(InvalidProjectIdError);
    }
  });

  test('never silently transforms the submitted identity', () => {
    // accepted ids are returned EXACTLY as submitted
    expect(validateProjectId('myproject')).toBe('myproject');
    expect(validateProjectId('dental-001')).toBe('dental-001');
    // rejected ids throw — they are never lowercased, trimmed or normalized
    expect(() => validateProjectId('Foo')).toThrow(InvalidProjectIdError);
    expect(() => validateProjectId('abc.')).toThrow(InvalidProjectIdError);
  });

  test('path builders reject every new collision class before any filesystem side effect', () => {
    const collisionClasses = ['Foo', 'ABC', 'abc.', 'abc...', 'CON', 'NUL.json', 'COM1', 'LPT9'];

    for (const bad of collisionClasses) {
      expect(() =>
        store.getArtifactVersionPath(bad, ArtifactType.BUSINESS_RESEARCH, 1)
      ).toThrow(InvalidProjectIdError);
    }

    // none of the rejected ids created anything anywhere
    for (const dirName of ['Foo', 'ABC', 'abc', 'CON', 'COM1']) {
      expect(fsSync.existsSync(path.join(testWorkspace, dirName))).toBe(false);
    }
  });
});