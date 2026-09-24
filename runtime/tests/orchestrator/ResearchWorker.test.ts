/**
 * ResearchWorker tests — deterministic benchmark worker (Section P).
 *
 * Schema validity is proven through the REAL M2.3 ArtifactRepository (which
 * validates every save against the canonical 04-SCHEMA shapes) — the worker
 * itself performs no validation and no persistence.
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 */

import { ArtifactRepository } from '../../artifacts/ArtifactRepository';
import { ArtifactType } from '../../artifacts/ArtifactTypes';
import { State } from '../../state/StateMachine';
import { ResearchWorker } from '../../orchestrator/workers/ResearchWorker';
import { ExecutionContext } from '../../orchestrator/types';
import {
  bootstrapResearchProject,
  makeWorkspaceRoot,
  removeWorkspaceRoot,
  TEST_BUSINESS_INPUT_YAML,
  parseBusinessInputYaml
} from './helpers';

function makeContext(
  projectId: string,
  projectInput: unknown,
  executionId = 'worker-exec-1'
): ExecutionContext {
  return {
    executionId,
    projectId,
    currentState: State.RESEARCHING,
    actionId: 'RESEARCH_ACTION',
    workerId: 'ResearchWorker',
    workerVersion: '0.1.0',
    inputs: [],
    registryVersions: {},
    expectedOutputs: [
      ArtifactType.BUSINESS_RESEARCH,
      ArtifactType.BUSINESS_INTELLIGENCE,
      ArtifactType.ASSET_INVENTORY,
      ArtifactType.BRAND_PROFILE
    ],
    projectRecord: {
      projectId,
      businessName: 'Test',
      createdAt: '2026-09-05T00:00:00.000Z',
      workspaceRoot: 'ws',
      inputSource: 'input/business-input.yaml',
      factoryVersion: '0.2.0'
    },
    projectInput,
    startedAt: '2026-09-05T00:00:01.000Z'
  };
}

const parseYaml = parseBusinessInputYaml;

describe('ResearchWorker (M2.4)', () => {
  const projectId = 'worker-proj';
  let workspaceRoot: string;
  let repo: ArtifactRepository;
  const worker = new ResearchWorker();

  beforeEach(async () => {
    workspaceRoot = makeWorkspaceRoot('worker');
    await bootstrapResearchProject(workspaceRoot, projectId, TEST_BUSINESS_INPUT_YAML);
    repo = new ArtifactRepository(workspaceRoot);
  });

  afterEach(async () => {
    await removeWorkspaceRoot(workspaceRoot);
  });

  it('produces exactly the four declared research artifact types', async () => {
    const context = makeContext(projectId, parseYaml(TEST_BUSINESS_INPUT_YAML));
    const output = await worker.execute(context);

    expect(output.artifacts.map(a => a.artifactType)).toEqual([
      ArtifactType.BUSINESS_RESEARCH,
      ArtifactType.BUSINESS_INTELLIGENCE,
      ArtifactType.ASSET_INVENTORY,
      ArtifactType.BRAND_PROFILE
    ]);
    expect(output.metadata.executionId).toBe('worker-exec-1');
    expect(output.metadata.workerId).toBe('ResearchWorker');
  });

  it('produces documents that all validate against the canonical schemas on write', async () => {
    const context = makeContext(projectId, parseYaml(TEST_BUSINESS_INPUT_YAML));
    const output = await worker.execute(context);

    // saveArtifact rejects schema-invalid documents — persistence success
    // across all four IS the schema-validity proof (real M2.3 validation).
    for (const artifact of output.artifacts) {
      const saved = await repo.saveArtifact(
        projectId,
        artifact.artifactType,
        artifact.document
      );
      expect(saved.version).toBe(1);
    }
  });

  it('is deterministic: identical input and execution identity yield identical content', async () => {
    const input = parseYaml(TEST_BUSINESS_INPUT_YAML);
    const first = await worker.execute(makeContext(projectId, input, 'same-exec'));
    const second = await worker.execute(makeContext(projectId, input, 'same-exec'));

    expect(second.metadata.executionId).toBe(first.metadata.executionId);
    expect(second.artifacts.map(a => a.document)).toEqual(
      first.artifacts.map(a => a.document)
    );
  });

  it('records unknown instead of inventing when the supplied input is minimal', async () => {
    const minimalInput = parseYaml(`
businessIdentity:
  name: Bare Business
`);
    const output = await worker.execute(makeContext(projectId, minimalInput));

    const research = output.artifacts.find(
      a => a.artifactType === ArtifactType.BUSINESS_RESEARCH
    )!.document;
    const gaps = research['explicitGaps'] as string[];
    expect(gaps.length).toBeGreaterThan(0);

    // No logo supplied → no invented asset entry; scarcity recorded honestly.
    const inventory = output.artifacts.find(
      a => a.artifactType === ArtifactType.ASSET_INVENTORY
    )!.document;
    expect(inventory['assets']).toEqual([]);

    // All research artifacts remain schema-valid on write.
    for (const artifact of output.artifacts) {
      await repo.saveArtifact(projectId, artifact.artifactType, artifact.document);
    }
  });

  it('refuses to execute without the parsed project input', async () => {
    const context = makeContext(projectId, undefined);
    await expect(worker.execute(context)).rejects.toThrow(
      /requires the parsed project business input/
    );
  });
});
