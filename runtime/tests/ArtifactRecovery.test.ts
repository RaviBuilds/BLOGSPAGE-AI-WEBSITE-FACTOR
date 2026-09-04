/**
 * Crash/orphan reconciliation tests — M2.3-A HIGH-2 fix.
 *
 * Verifies: valid orphans from a crashed save are ADOPTED (completing the
 * commit, keeping version allocation correct across restart), corrupt/
 * schema-invalid orphans are DELETED, identity-contradicting orphans FAIL
 * CLOSED, malformed or structurally invalid manifests FAIL CLOSED on every
 * path, manifest-recorded versions whose files are missing FAIL CLOSED,
 * stale temp files are swept, and unrecorded version files are never
 * readable.
 */

import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { ArtifactRepository } from '../artifacts/ArtifactRepository';
import { ArtifactStore } from '../artifacts/ArtifactStore';
import { ManifestManager } from '../artifacts/ManifestManager';
import { ManifestIntegrityError } from '../artifacts/ManifestIntegrityError';
import { ArtifactType, VersionStatus } from '../artifacts/ArtifactTypes';

describe('crash/orphan reconciliation (HIGH-2)', () => {
  const testWorkspace = path.join(__dirname, 'test-workspace-recovery');
  const projectId = 'proj-1';
  const artifactsDir = path.join(testWorkspace, projectId, 'artifacts');
  const manifestPath = path.join(artifactsDir, 'manifest.json');
  let store: ArtifactStore;
  let manifestManager: ManifestManager;
  let repo: ArtifactRepository;

  const researchDoc = {
    artifactId: 'art-br-1',
    producer: 'RESEARCH_AGENT',
    businessIdentityAndLocation: [
      {
        fact: 'Business name',
        value: 'Acme Co',
        source: 'Google Business Profile',
        sourceType: 'business_listing',
        confidence: 'high',
        verificationStatus: 'verified'
      }
    ],
    servicesOrOfferings: [],
    contactAndOperatingDetails: [],
    publicReputationSignals: [],
    discoveredAssets: [],
    competitorObservations: [],
    sourceList: [],
    explicitGaps: []
  };

  /**
   * A schema-valid, identity-consistent document for the given version —
   * exactly what a crashed saveArtifact would have written to disk.
   */
  const crashedWrite = (version: number, artifactId: string) => ({
    ...researchDoc,
    artifactId,
    artifactType: 'BUSINESS_RESEARCH',
    projectId,
    artifactVersion: version,
    versionStatus: 'CURRENT'
  });

  beforeEach(() => {
    store = new ArtifactStore(testWorkspace);
    manifestManager = new ManifestManager(testWorkspace);
    repo = new ArtifactRepository(testWorkspace);
  });

  afterEach(async () => {
    await fs.rm(testWorkspace, { recursive: true, force: true });
  });

  test('a valid orphan from a crashed save is adopted and allocation continues', async () => {
    await repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, researchDoc);

    // Simulate a crash between the version-file write and the manifest write.
    await store.writeVersion(
      projectId,
      ArtifactType.BUSINESS_RESEARCH,
      2,
      crashedWrite(2, 'art-br-2')
    );

    // "Restart": a fresh repository instance reconciles on the next save.
    const restarted = new ArtifactRepository(testWorkspace);
    const result = await restarted.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, {
      ...researchDoc,
      artifactId: 'art-br-3'
    });

    expect(result.version).toBe(3);

    const manifest = await manifestManager.read(projectId);
    const state = manifest.artifacts[ArtifactType.BUSINESS_RESEARCH]!;
    expect(state.versions.map(v => v.version)).toEqual([1, 2, 3]);
    expect(state.currentVersion).toBe(3);
    expect(state.versions.find(v => v.version === 2)?.status).toBe(VersionStatus.SUPERSEDED);

    const current = await restarted.getCurrentArtifact(
      projectId,
      ArtifactType.BUSINESS_RESEARCH
    );
    expect(current.artifactVersion).toBe(3);
    expect(current.artifactId).toBe('art-br-3');
  });

  test('a corrupt orphan (invalid JSON) is deleted and does not block allocation', async () => {
    await repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, researchDoc);
    await fs.writeFile(
      store.getArtifactVersionPath(projectId, ArtifactType.BUSINESS_RESEARCH, 2),
      '{ this is not json',
      'utf-8'
    );

    const result = await repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, {
      ...researchDoc,
      artifactId: 'art-br-2'
    });

    expect(result.version).toBe(2);
    const committed = await repo.getArtifactVersion(
      projectId,
      ArtifactType.BUSINESS_RESEARCH,
      2
    );
    expect(committed.artifactId).toBe('art-br-2');
  });

  test('a schema-invalid orphan is deleted', async () => {
    await repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, researchDoc);
    await fs.writeFile(
      store.getArtifactVersionPath(projectId, ArtifactType.BUSINESS_RESEARCH, 2),
      JSON.stringify({ artifactId: 'junk' }),
      'utf-8'
    );

    const result = await repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, {
      ...researchDoc,
      artifactId: 'art-br-2'
    });

    expect(result.version).toBe(2);
    const committed = await repo.getArtifactVersion(
      projectId,
      ArtifactType.BUSINESS_RESEARCH,
      2
    );
    expect(committed.artifactId).toBe('art-br-2');
  });

  test('version allocation stays correct across restart with adoption', async () => {
    await repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, researchDoc);
    await store.writeVersion(
      projectId,
      ArtifactType.BUSINESS_RESEARCH,
      2,
      crashedWrite(2, 'art-br-2')
    );

    const restarted = new ArtifactRepository(testWorkspace);
    expect(
      (
        await restarted.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, {
          ...researchDoc,
          artifactId: 'art-br-3'
        })
      ).version
    ).toBe(3);
    expect(
      (
        await restarted.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, {
          ...researchDoc,
          artifactId: 'art-br-4'
        })
      ).version
    ).toBe(4);
  });

  test('a schema-valid orphan whose identity contradicts its path fails closed', async () => {
    await repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, researchDoc);

    // Schema-valid, but the file at v2.json claims artifactVersion 9.
    await store.writeVersion(
      projectId,
      ArtifactType.BUSINESS_RESEARCH,
      2,
      crashedWrite(9, 'art-br-x')
    );

    const orphanPath = store.getArtifactVersionPath(
      projectId,
      ArtifactType.BUSINESS_RESEARCH,
      2
    );
    await expect(
      repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, {
        ...researchDoc,
        artifactId: 'art-br-2'
      })
    ).rejects.toThrow(ManifestIntegrityError);

    // The ambiguous orphan was neither adopted nor deleted.
    expect(fsSync.existsSync(orphanPath)).toBe(true);
  });

  test('a schema-valid orphan with a foreign projectId fails closed', async () => {
    await repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, researchDoc);
    const foreign = { ...crashedWrite(2, 'art-br-2'), projectId: 'proj-OTHER' };
    await store.writeVersion(projectId, ArtifactType.BUSINESS_RESEARCH, 2, foreign);

    await expect(
      repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, {
        ...researchDoc,
        artifactId: 'art-br-2'
      })
    ).rejects.toThrow(ManifestIntegrityError);
  });

  test('missing version file for a recorded version fails closed on save and read', async () => {
    await repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, researchDoc);
    await fs.rm(store.getArtifactVersionPath(projectId, ArtifactType.BUSINESS_RESEARCH, 1));

    await expect(
      repo.getCurrentArtifact(projectId, ArtifactType.BUSINESS_RESEARCH)
    ).rejects.toThrow(ManifestIntegrityError);
    await expect(
      repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, {
        ...researchDoc,
        artifactId: 'art-br-2'
      })
    ).rejects.toThrow(ManifestIntegrityError);

    // hasArtifact runs only the cheap structural check (no dir scan) per the
    // approved plan; the full reconciliation in saveArtifact fails closed.
    await expect(repo.hasArtifact(projectId, ArtifactType.BUSINESS_RESEARCH)).resolves.toBe(
      true
    );
  });

  test('malformed manifest JSON fails closed on every path', async () => {
    await repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, researchDoc);
    await fs.writeFile(manifestPath, '{ not json', 'utf-8');

    await expect(
      repo.getCurrentArtifact(projectId, ArtifactType.BUSINESS_RESEARCH)
    ).rejects.toThrow(ManifestIntegrityError);
    await expect(repo.hasArtifact(projectId, ArtifactType.BUSINESS_RESEARCH)).rejects.toThrow(
      ManifestIntegrityError
    );
    await expect(
      repo.getArtifactVersion(projectId, ArtifactType.BUSINESS_RESEARCH, 1)
    ).rejects.toThrow(ManifestIntegrityError);
    await expect(
      repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, researchDoc)
    ).rejects.toThrow(ManifestIntegrityError);
  });

  test('manifest with a foreign projectId fails closed', async () => {
    await repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, researchDoc);
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
    manifest.projectId = 'proj-OTHER';
    await fs.writeFile(manifestPath, JSON.stringify(manifest), 'utf-8');

    await expect(
      repo.getCurrentArtifact(projectId, ArtifactType.BUSINESS_RESEARCH)
    ).rejects.toThrow(ManifestIntegrityError);
  });

  test('manifest with two CURRENT entries fails closed', async () => {
    await fs.mkdir(artifactsDir, { recursive: true });
    await fs.writeFile(
      manifestPath,
      JSON.stringify({
        projectId,
        artifacts: {
          BUSINESS_RESEARCH: {
            currentVersion: 2,
            versions: [
              {
                version: 1,
                status: 'CURRENT',
                artifactId: 'a1',
                writtenAt: '2026-01-01T00:00:00.000Z'
              },
              {
                version: 2,
                status: 'CURRENT',
                artifactId: 'a2',
                writtenAt: '2026-01-02T00:00:00.000Z'
              }
            ]
          }
        }
      }),
      'utf-8'
    );

    await expect(
      repo.getCurrentArtifact(projectId, ArtifactType.BUSINESS_RESEARCH)
    ).rejects.toThrow(ManifestIntegrityError);
  });

  test('manifest with an unknown artifact type key fails closed', async () => {
    await fs.mkdir(artifactsDir, { recursive: true });
    await fs.writeFile(
      manifestPath,
      JSON.stringify({
        projectId,
        artifacts: {
          MYSTERY_TYPE: {
            currentVersion: 1,
            versions: [
              {
                version: 1,
                status: 'CURRENT',
                artifactId: 'a1',
                writtenAt: '2026-01-01T00:00:00.000Z'
              }
            ]
          }
        }
      }),
      'utf-8'
    );

    await expect(repo.hasArtifact(projectId, ArtifactType.BUSINESS_RESEARCH)).rejects.toThrow(
      ManifestIntegrityError
    );
  });

  test('stale temp files are swept by reconciliation; real files untouched', async () => {
    await repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, researchDoc);

    const typeDir = path.join(artifactsDir, 'BUSINESS_RESEARCH');
    await fs.writeFile(path.join(typeDir, 'v1.json.tmp-999-999'), 'partial', 'utf-8');
    await fs.writeFile(path.join(artifactsDir, 'manifest.json.tmp-999-999'), 'partial', 'utf-8');

    await repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, {
      ...researchDoc,
      artifactId: 'art-br-2'
    });

    expect(fsSync.existsSync(path.join(typeDir, 'v1.json.tmp-999-999'))).toBe(false);
    expect(fsSync.existsSync(path.join(artifactsDir, 'manifest.json.tmp-999-999'))).toBe(
      false
    );
    expect(fsSync.existsSync(path.join(typeDir, 'v1.json'))).toBe(true);
    expect(fsSync.existsSync(path.join(typeDir, 'v2.json'))).toBe(true);
  });

  test('unrecorded (orphan) version files are not readable before reconciliation', async () => {
    await repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, researchDoc);
    await store.writeVersion(
      projectId,
      ArtifactType.BUSINESS_RESEARCH,
      2,
      crashedWrite(2, 'art-br-2')
    );

    await expect(
      repo.getArtifactVersion(projectId, ArtifactType.BUSINESS_RESEARCH, 2)
    ).rejects.toThrow(ManifestIntegrityError);

    // After reconciliation adopts the orphan it is a recorded (superseded)
    // version and readable.
    await repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, {
      ...researchDoc,
      artifactId: 'art-br-3'
    });
    const adopted = await repo.getArtifactVersion(
      projectId,
      ArtifactType.BUSINESS_RESEARCH,
      2
    );
    expect(adopted.artifactId).toBe('art-br-2');
  });
});