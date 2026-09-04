/**
 * ArtifactStore tests — M2.3-A.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { ArtifactStore } from '../artifacts/ArtifactStore';
import { ArtifactType } from '../artifacts/ArtifactTypes';

describe('ArtifactStore', () => {
  const testWorkspace = path.join(__dirname, 'test-workspace-artifact-store');
  let store: ArtifactStore;

  beforeEach(() => {
    store = new ArtifactStore(testWorkspace);
  });

  afterEach(async () => {
    await fs.rm(testWorkspace, { recursive: true, force: true });
  });

  test('writeVersion then readVersion round-trips the document', async () => {
    const doc = { artifactId: 'art-1', hello: 'world' };
    await store.writeVersion('proj-1', ArtifactType.BUSINESS_RESEARCH, 1, doc);

    const read = await store.readVersion('proj-1', ArtifactType.BUSINESS_RESEARCH, 1);
    expect(read).toEqual(doc);
  });

  test('writeVersion refuses to overwrite an existing version', async () => {
    await store.writeVersion('proj-1', ArtifactType.BUSINESS_RESEARCH, 1, { a: 1 });

    await expect(
      store.writeVersion('proj-1', ArtifactType.BUSINESS_RESEARCH, 1, { a: 2 })
    ).rejects.toThrow(/immutable/);
  });

  test('readVersion throws when the version does not exist', async () => {
    await expect(
      store.readVersion('proj-1', ArtifactType.BUSINESS_RESEARCH, 99)
    ).rejects.toThrow(/not found/);
  });

  test('versionExists reflects presence correctly', async () => {
    expect(await store.versionExists('proj-1', ArtifactType.BUSINESS_RESEARCH, 1)).toBe(false);
    await store.writeVersion('proj-1', ArtifactType.BUSINESS_RESEARCH, 1, { a: 1 });
    expect(await store.versionExists('proj-1', ArtifactType.BUSINESS_RESEARCH, 1)).toBe(true);
  });

  test('different artifact types and versions do not collide', async () => {
    await store.writeVersion('proj-1', ArtifactType.BUSINESS_RESEARCH, 1, { kind: 'research' });
    await store.writeVersion('proj-1', ArtifactType.BRAND_PROFILE, 1, { kind: 'brand' });
    await store.writeVersion('proj-1', ArtifactType.BUSINESS_RESEARCH, 2, { kind: 'research-v2' });

    expect(await store.readVersion('proj-1', ArtifactType.BUSINESS_RESEARCH, 1)).toEqual({ kind: 'research' });
    expect(await store.readVersion('proj-1', ArtifactType.BRAND_PROFILE, 1)).toEqual({ kind: 'brand' });
    expect(await store.readVersion('proj-1', ArtifactType.BUSINESS_RESEARCH, 2)).toEqual({ kind: 'research-v2' });
  });
});
