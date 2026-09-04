/**
 * ManifestManager tests — M2.3-A.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { ManifestManager } from '../artifacts/ManifestManager';
import { ManifestIntegrityError } from '../artifacts/ManifestIntegrityError';
import { ArtifactType, VersionStatus } from '../artifacts/ArtifactTypes';

describe('ManifestManager', () => {
  const testWorkspace = path.join(__dirname, 'test-workspace-manifest');
  let manager: ManifestManager;

  beforeEach(() => {
    manager = new ManifestManager(testWorkspace);
  });

  afterEach(async () => {
    await fs.rm(testWorkspace, { recursive: true, force: true });
  });

  test('read returns an empty manifest when none exists', async () => {
    const manifest = await manager.read('proj-1');
    expect(manifest.projectId).toBe('proj-1');
    expect(manifest.artifacts).toEqual({});
  });

  test('getNextVersion returns 1 for a type with no versions', async () => {
    const manifest = await manager.read('proj-1');
    expect(manager.getNextVersion(manifest, ArtifactType.BUSINESS_RESEARCH)).toBe(1);
  });

  test('recordNewVersion sets the new version as CURRENT and supersedes the prior CURRENT', async () => {
    let manifest = await manager.read('proj-1');
    manifest = manager.recordNewVersion(manifest, ArtifactType.BUSINESS_RESEARCH, 'art-1', 1);

    let state = manifest.artifacts[ArtifactType.BUSINESS_RESEARCH]!;
    expect(state.currentVersion).toBe(1);
    expect(state.versions).toHaveLength(1);
    expect(state.versions[0].status).toBe(VersionStatus.CURRENT);

    manifest = manager.recordNewVersion(manifest, ArtifactType.BUSINESS_RESEARCH, 'art-2', 2);
    state = manifest.artifacts[ArtifactType.BUSINESS_RESEARCH]!;

    expect(state.currentVersion).toBe(2);
    expect(state.versions).toHaveLength(2);
    expect(state.versions[0].status).toBe(VersionStatus.SUPERSEDED);
    expect(state.versions[1].status).toBe(VersionStatus.CURRENT);
  });

  test('getNextVersion increments from the highest existing version', async () => {
    let manifest = await manager.read('proj-1');
    manifest = manager.recordNewVersion(manifest, ArtifactType.BUSINESS_RESEARCH, 'art-1', 1);
    manifest = manager.recordNewVersion(manifest, ArtifactType.BUSINESS_RESEARCH, 'art-2', 2);

    expect(manager.getNextVersion(manifest, ArtifactType.BUSINESS_RESEARCH)).toBe(3);
  });

  test('write then read round-trips the manifest', async () => {
    let manifest = await manager.read('proj-1');
    manifest = manager.recordNewVersion(manifest, ArtifactType.BRAND_PROFILE, 'art-1', 1);

    await manager.write('proj-1', manifest);
    const reread = await manager.read('proj-1');

    expect(reread.artifacts[ArtifactType.BRAND_PROFILE]?.currentVersion).toBe(1);
  });

  test('hasArtifact and getCurrentVersion reflect manifest state', async () => {
    let manifest = await manager.read('proj-1');
    expect(manager.hasArtifact(manifest, ArtifactType.CRITIC_REPORT)).toBe(false);
    expect(manager.getCurrentVersion(manifest, ArtifactType.CRITIC_REPORT)).toBeNull();

    manifest = manager.recordNewVersion(manifest, ArtifactType.CRITIC_REPORT, 'art-9', 1);
    expect(manager.hasArtifact(manifest, ArtifactType.CRITIC_REPORT)).toBe(true);
    expect(manager.getCurrentVersion(manifest, ArtifactType.CRITIC_REPORT)?.artifactId).toBe('art-9');
  });

  // ------------------------------------------------------------------------
  // HIGH-2: fail-closed manifest reading and structural validation.
  // ------------------------------------------------------------------------

  const structurallyValidManifest = {
    projectId: 'proj-1',
    artifacts: {
      [ArtifactType.BUSINESS_RESEARCH]: {
        currentVersion: 2,
        versions: [
          {
            version: 1,
            status: VersionStatus.SUPERSEDED,
            artifactId: 'a1',
            writtenAt: '2026-01-01T00:00:00.000Z'
          },
          {
            version: 2,
            status: VersionStatus.CURRENT,
            artifactId: 'a2',
            writtenAt: '2026-01-02T00:00:00.000Z'
          }
        ]
      }
    }
  };

  test('read fails closed on an unparseable manifest.json', async () => {
    const manifestPath = path.join(testWorkspace, 'proj-1', 'artifacts', 'manifest.json');
    await fs.mkdir(path.dirname(manifestPath), { recursive: true });
    await fs.writeFile(manifestPath, '{ not json', 'utf-8');

    await expect(manager.read('proj-1')).rejects.toThrow(ManifestIntegrityError);
  });

  test('read fails closed when the manifest projectId does not match', async () => {
    const manifestPath = path.join(testWorkspace, 'proj-1', 'artifacts', 'manifest.json');
    await fs.mkdir(path.dirname(manifestPath), { recursive: true });
    await fs.writeFile(
      manifestPath,
      JSON.stringify({ ...structurallyValidManifest, projectId: 'proj-OTHER' }),
      'utf-8'
    );

    await expect(manager.read('proj-1')).rejects.toThrow(ManifestIntegrityError);
  });

  test('validateManifestStructure accepts a well-formed manifest', () => {
    expect(() =>
      manager.validateManifestStructure(structurallyValidManifest, 'proj-1')
    ).not.toThrow();
  });

  test('validateManifestStructure fails closed on duplicate CURRENT entries', () => {
    const bad = {
      projectId: 'proj-1',
      artifacts: {
        [ArtifactType.BUSINESS_RESEARCH]: {
          currentVersion: 2,
          versions: [
            { version: 1, status: VersionStatus.CURRENT, artifactId: 'a1', writtenAt: 't1' },
            { version: 2, status: VersionStatus.CURRENT, artifactId: 'a2', writtenAt: 't2' }
          ]
        }
      }
    };

    expect(() => manager.validateManifestStructure(bad, 'proj-1')).toThrow(
      ManifestIntegrityError
    );
  });

  test('validateManifestStructure fails closed when currentVersion has no entry', () => {
    const bad = {
      projectId: 'proj-1',
      artifacts: {
        [ArtifactType.BUSINESS_RESEARCH]: {
          currentVersion: 3,
          versions: [
            { version: 1, status: VersionStatus.CURRENT, artifactId: 'a1', writtenAt: 't1' }
          ]
        }
      }
    };

    expect(() => manager.validateManifestStructure(bad, 'proj-1')).toThrow(
      ManifestIntegrityError
    );
  });

  test('validateManifestStructure fails closed on unknown artifact type keys', () => {
    const bad = {
      projectId: 'proj-1',
      artifacts: {
        MYSTERY_TYPE: {
          currentVersion: 1,
          versions: [
            { version: 1, status: VersionStatus.CURRENT, artifactId: 'a1', writtenAt: 't1' }
          ]
        }
      }
    };

    expect(() => manager.validateManifestStructure(bad, 'proj-1')).toThrow(
      ManifestIntegrityError
    );
  });

  test('adoptVersion records a higher version as CURRENT and supersedes the prior one', () => {
    let manifest = manager.adoptVersion(
      structurallyValidManifest as never,
      ArtifactType.BUSINESS_RESEARCH,
      'a3',
      3,
      '2026-01-03T00:00:00.000Z'
    );

    const state = manifest.artifacts[ArtifactType.BUSINESS_RESEARCH]!;
    expect(state.currentVersion).toBe(3);
    expect(state.versions.find(v => v.version === 3)?.status).toBe(VersionStatus.CURRENT);
    expect(state.versions.find(v => v.version === 2)?.status).toBe(VersionStatus.SUPERSEDED);
    void manifest;
  });

  test('adoptVersion records a lower version as SUPERSEDED, preserving the CURRENT', () => {
    const manifest = manager.adoptVersion(
      structurallyValidManifest as never,
      ArtifactType.BUSINESS_RESEARCH,
      'a0',
      1,
      '2025-12-31T00:00:00.000Z'
    );

    const state = manifest.artifacts[ArtifactType.BUSINESS_RESEARCH]!;
    expect(state.currentVersion).toBe(2);
    expect(state.versions.find(v => v.version === 1)?.status).toBe(VersionStatus.SUPERSEDED);
    expect(state.versions.find(v => v.version === 2)?.status).toBe(VersionStatus.CURRENT);
  });
});
