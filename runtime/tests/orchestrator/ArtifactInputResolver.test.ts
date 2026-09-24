/**
 * ArtifactInputResolver tests — exact CURRENT-version resolution through
 * the real M2.3 ArtifactRepository.
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 */

import { ArtifactRepository } from '../../artifacts/ArtifactRepository';
import { ArtifactType } from '../../artifacts/ArtifactTypes';
import {
  MissingInputArtifactError,
  FailureType
} from '../../orchestrator/types';
import { ArtifactInputResolver } from '../../orchestrator/execution/ArtifactInputResolver';
import {
  bootstrapResearchProject,
  makeWorkspaceRoot,
  removeWorkspaceRoot,
  researchFixtureDocs
} from './helpers';

describe('ArtifactInputResolver (M2.4)', () => {
  const projectId = 'resolver-proj';
  let workspaceRoot: string;
  let repo: ArtifactRepository;
  let resolver: ArtifactInputResolver;

  beforeEach(async () => {
    workspaceRoot = makeWorkspaceRoot('resolver');
    await bootstrapResearchProject(workspaceRoot, projectId);
    repo = new ArtifactRepository(workspaceRoot);
    resolver = new ArtifactInputResolver(repo);
  });

  afterEach(async () => {
    await removeWorkspaceRoot(workspaceRoot);
  });

  it('throws a typed MISSING_INPUT_ARTIFACT failure when a required input is absent', async () => {
    await expect(
      resolver.resolveInputs(projectId, [ArtifactType.BUSINESS_RESEARCH])
    ).rejects.toThrow(MissingInputArtifactError);

    await expect(
      resolver.resolveInputs(projectId, [ArtifactType.BUSINESS_RESEARCH])
    ).rejects.toMatchObject({ failureType: FailureType.MISSING_INPUT_ARTIFACT });
  });

  it('resolves the exact CURRENT version after multiple saves', async () => {
    const docs = researchFixtureDocs('exec-A');
    await repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, docs[0].document);
    await repo.saveArtifact(projectId, ArtifactType.BUSINESS_RESEARCH, {
      ...docs[0].document,
      artifactId: 'exec-B-BR'
    });

    const resolved = await resolver.resolveInputs(projectId, [
      ArtifactType.BUSINESS_RESEARCH
    ]);

    expect(resolved).toHaveLength(1);
    expect(resolved[0].artifactType).toBe(ArtifactType.BUSINESS_RESEARCH);
    expect(resolved[0].version).toBe(2);
    expect(resolved[0].artifactId).toBe('exec-B-BR');
    // The full CURRENT document is carried into the ExecutionContext.
    expect(resolved[0].document['projectId']).toBe(projectId);
    expect(resolved[0].document['versionStatus']).toBe('CURRENT');
  });

  it('resolves multiple distinct inputs in declaration order', async () => {
    for (const entry of researchFixtureDocs('exec-A')) {
      await repo.saveArtifact(projectId, entry.artifactType, entry.document);
    }

    const resolved = await resolver.resolveInputs(projectId, [
      ArtifactType.BRAND_PROFILE,
      ArtifactType.ASSET_INVENTORY,
      ArtifactType.BUSINESS_INTELLIGENCE,
      ArtifactType.BUSINESS_RESEARCH
    ]);

    expect(resolved.map(r => r.artifactType)).toEqual([
      ArtifactType.BRAND_PROFILE,
      ArtifactType.ASSET_INVENTORY,
      ArtifactType.BUSINESS_INTELLIGENCE,
      ArtifactType.BUSINESS_RESEARCH
    ]);
    expect(resolved.every(r => r.version === 1)).toBe(true);
  });

  it('resolves to an empty list when no inputs are required (bootstrap actions)', async () => {
    const resolved = await resolver.resolveInputs(projectId, []);
    expect(resolved).toEqual([]);
  });
});
