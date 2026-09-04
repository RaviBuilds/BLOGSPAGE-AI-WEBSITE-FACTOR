/**
 * ArtifactRepository tests — M2.3-A.
 *
 * Exercises the full save/read flow against real schemas (via
 * SchemaValidator), including version increment, CURRENT/SUPERSEDED
 * manifest transitions, and validation rejection.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { ArtifactRepository, ArtifactValidationError } from '../artifacts/ArtifactRepository';
import { ArtifactType } from '../artifacts/ArtifactTypes';

describe('ArtifactRepository', () => {
  const testWorkspace = path.join(__dirname, 'test-workspace-artifact-repo');
  let repo: ArtifactRepository;

  const validBusinessResearch = {
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

  beforeEach(() => {
    repo = new ArtifactRepository(testWorkspace);
  });

  afterEach(async () => {
    await fs.rm(testWorkspace, { recursive: true, force: true });
  });

  test('saveArtifact persists version 1 and reports it back', async () => {
    const result = await repo.saveArtifact(
      'proj-1',
      ArtifactType.BUSINESS_RESEARCH,
      validBusinessResearch
    );

    expect(result.version).toBe(1);
    expect(result.artifactId).toBe('art-br-1');
  });

  test('hasArtifact is false before save and true after', async () => {
    expect(await repo.hasArtifact('proj-1', ArtifactType.BUSINESS_RESEARCH)).toBe(false);

    await repo.saveArtifact('proj-1', ArtifactType.BUSINESS_RESEARCH, validBusinessResearch);

    expect(await repo.hasArtifact('proj-1', ArtifactType.BUSINESS_RESEARCH)).toBe(true);
  });

  test('getCurrentArtifact returns the latest saved version', async () => {
    await repo.saveArtifact('proj-1', ArtifactType.BUSINESS_RESEARCH, validBusinessResearch);
    await repo.saveArtifact('proj-1', ArtifactType.BUSINESS_RESEARCH, {
      ...validBusinessResearch,
      artifactId: 'art-br-2'
    });

    const current = await repo.getCurrentArtifact('proj-1', ArtifactType.BUSINESS_RESEARCH);
    expect(current.artifactVersion).toBe(2);
    expect(current.artifactId).toBe('art-br-2');
  });

  test('getArtifactVersion can still read a superseded version', async () => {
    await repo.saveArtifact('proj-1', ArtifactType.BUSINESS_RESEARCH, validBusinessResearch);
    await repo.saveArtifact('proj-1', ArtifactType.BUSINESS_RESEARCH, {
      ...validBusinessResearch,
      artifactId: 'art-br-2'
    });

    const v1 = await repo.getArtifactVersion('proj-1', ArtifactType.BUSINESS_RESEARCH, 1);
    expect(v1.artifactId).toBe('art-br-1');
  });

  test('getCurrentArtifact throws when nothing has been saved', async () => {
    await expect(
      repo.getCurrentArtifact('proj-1', ArtifactType.BUSINESS_RESEARCH)
    ).rejects.toThrow(/No artifact/);
  });

  test('saveArtifact rejects an invalid document and persists nothing', async () => {
    await expect(
      repo.saveArtifact('proj-1', ArtifactType.BUSINESS_RESEARCH, { artifactId: 'bad' })
    ).rejects.toThrow(ArtifactValidationError);

    expect(await repo.hasArtifact('proj-1', ArtifactType.BUSINESS_RESEARCH)).toBe(false);
  });

  test('saveArtifact requires an artifactId even if schema would otherwise pass', async () => {
    const docWithoutId = { ...validBusinessResearch };
    delete (docWithoutId as any).artifactId;

    await expect(
      repo.saveArtifact('proj-1', ArtifactType.BUSINESS_RESEARCH, docWithoutId)
    ).rejects.toThrow(/artifactId/);
  });

  test('separate artifact types and separate projects do not interfere', async () => {
    await repo.saveArtifact('proj-1', ArtifactType.BUSINESS_RESEARCH, validBusinessResearch);
    await repo.saveArtifact('proj-2', ArtifactType.BUSINESS_RESEARCH, {
      ...validBusinessResearch,
      artifactId: 'art-proj2'
    });

    const p1 = await repo.getCurrentArtifact('proj-1', ArtifactType.BUSINESS_RESEARCH);
    const p2 = await repo.getCurrentArtifact('proj-2', ArtifactType.BUSINESS_RESEARCH);

    expect(p1.artifactId).toBe('art-br-1');
    expect(p2.artifactId).toBe('art-proj2');
  });
});
