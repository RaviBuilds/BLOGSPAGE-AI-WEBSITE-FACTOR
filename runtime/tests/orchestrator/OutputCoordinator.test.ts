/**
 * OutputCoordinator tests — worker-output envelope validation and
 * persistence strictly through the real M2.3 ArtifactRepository.
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 */

import { ArtifactRepository } from '../../artifacts/ArtifactRepository';
import { ArtifactType } from '../../artifacts/ArtifactTypes';
import {
  ExecutionContext,
  FailureType,
  OrchestrationError,
  WorkerOutput
} from '../../orchestrator/types';
import { OutputCoordinator } from '../../orchestrator/execution/OutputCoordinator';
import {
  bootstrapResearchProject,
  makeWorkspaceRoot,
  removeWorkspaceRoot,
  researchFixtureDocs
} from './helpers';

describe('OutputCoordinator (M2.4)', () => {
  const projectId = 'output-proj';
  let workspaceRoot: string;
  let repo: ArtifactRepository;
  let coordinator: OutputCoordinator;
  let context: ExecutionContext;

  const expectedOutputs = [
    ArtifactType.BUSINESS_RESEARCH,
    ArtifactType.BUSINESS_INTELLIGENCE,
    ArtifactType.ASSET_INVENTORY,
    ArtifactType.BRAND_PROFILE
  ];

  const makeContext = (): ExecutionContext => ({
    executionId: 'exec-1',
    projectId,
    currentState: 'RESEARCHING' as ExecutionContext['currentState'],
    actionId: 'RESEARCH_STAGE',
    workerId: 'ResearchWorker',
    workerVersion: '0.1.0',
    inputs: [],
    registryVersions: {},
    expectedOutputs,
    projectRecord: {
      projectId,
      businessName: 'test',
      createdAt: new Date().toISOString(),
      workspaceRoot: 'x',
      inputSource: 'input/business-input.yaml',
      factoryVersion: '0.2.0'
    },
    startedAt: new Date().toISOString()
  });

  const validOutput = (): WorkerOutput => ({
    artifacts: researchFixtureDocs('exec-1').map(entry => ({
      artifactType: entry.artifactType,
      document: entry.document,
      consumedInputs: []
    })),
    metadata: {
      executionId: 'exec-1',
      workerId: 'ResearchWorker',
      workerVersion: '0.1.0',
      executedAt: new Date().toISOString(),
      executionDurationMs: 5
    }
  });

  beforeEach(async () => {
    workspaceRoot = makeWorkspaceRoot('output');
    await bootstrapResearchProject(workspaceRoot, projectId);
    repo = new ArtifactRepository(workspaceRoot);
    coordinator = new OutputCoordinator();
    context = makeContext();
  });

  afterEach(async () => {
    await removeWorkspaceRoot(workspaceRoot);
  });

  it('accepts a structurally valid output', () => {
    const outcome = coordinator.validateOutput(validOutput(), expectedOutputs, context);
    expect(outcome.valid).toBe(true);
    expect(outcome.errors).toEqual([]);
  });

  it('flags a missing expected artifact', () => {
    const output = validOutput();
    output.artifacts = output.artifacts.filter(
      a => a.artifactType !== ArtifactType.BRAND_PROFILE
    );
    const outcome = coordinator.validateOutput(output, expectedOutputs, context);
    expect(outcome.valid).toBe(false);
    expect(outcome.errors.some(e => e.includes('BRAND_PROFILE'))).toBe(true);
  });

  it('flags an undeclared artifact type (a role writes only its declared outputs)', () => {
    const output = validOutput();
    output.artifacts.push({
      artifactType: ArtifactType.CRITIC_REPORT,
      document: { artifactId: 'x' },
      consumedInputs: []
    });
    const outcome = coordinator.validateOutput(output, expectedOutputs, context);
    expect(outcome.valid).toBe(false);
    expect(outcome.errors.some(e => e.includes('Undeclared artifact type'))).toBe(true);
  });

  it('flags duplicate artifact types', () => {
    const output = validOutput();
    output.artifacts.push({ ...output.artifacts[0] });
    const outcome = coordinator.validateOutput(output, expectedOutputs, context);
    expect(outcome.valid).toBe(false);
    expect(outcome.errors.some(e => e.includes('Duplicate artifact type'))).toBe(true);
  });

  it('flags a document without an artifactId', () => {
    const output = validOutput();
    delete (output.artifacts[0].document as Record<string, unknown>)['artifactId'];
    const outcome = coordinator.validateOutput(output, expectedOutputs, context);
    expect(outcome.valid).toBe(false);
    expect(outcome.errors.some(e => e.includes('artifactId'))).toBe(true);
  });

  it('flags worker-set persistence-owned envelope fields', () => {
    const output = validOutput();
    (output.artifacts[0].document as Record<string, unknown>)['artifactVersion'] = 7;
    (output.artifacts[1].document as Record<string, unknown>)['versionStatus'] = 'CURRENT';
    const outcome = coordinator.validateOutput(output, expectedOutputs, context);
    expect(outcome.valid).toBe(false);
    expect(outcome.errors.some(e => e.includes('artifactVersion'))).toBe(true);
    expect(outcome.errors.some(e => e.includes('versionStatus'))).toBe(true);
  });

  it('rejects a projectId mismatch between document and execution context', () => {
    const output = validOutput();
    (output.artifacts[0].document as Record<string, unknown>)['projectId'] =
      'some-other-project';
    const outcome = coordinator.validateOutput(output, expectedOutputs, context);
    expect(outcome.valid).toBe(false);
    expect(outcome.errors.some(e => e.includes('projectId'))).toBe(true);
  });

  it('rejects an artifactType mismatch between document and declared type', () => {
    const output = validOutput();
    (output.artifacts[0].document as Record<string, unknown>)['artifactType'] =
      'CRITIC_REPORT';
    const outcome = coordinator.validateOutput(output, expectedOutputs, context);
    expect(outcome.valid).toBe(false);
    expect(outcome.errors.some(e => e.includes('artifactType'))).toBe(true);
  });

  it('accepts documents that declare matching projectId and artifactType', () => {
    const output = validOutput();
    (output.artifacts[0].document as Record<string, unknown>)['projectId'] = projectId;
    (output.artifacts[0].document as Record<string, unknown>)['artifactType'] =
      ArtifactType.BUSINESS_RESEARCH;
    const outcome = coordinator.validateOutput(output, expectedOutputs, context);
    expect(outcome.valid).toBe(true);
  });

  it('flags missing consumedInputs declarations', () => {
    const output = validOutput();
    delete (output.artifacts[2] as unknown as Record<string, unknown>)['consumedInputs'];
    const outcome = coordinator.validateOutput(output, expectedOutputs, context);
    expect(outcome.valid).toBe(false);
    expect(outcome.errors.some(e => e.includes('consumedInputs'))).toBe(true);
  });

  it('flags metadata that does not identify the same execution', () => {
    const output = validOutput();
    output.metadata.executionId = 'someone-elses-execution';
    const outcome = coordinator.validateOutput(output, expectedOutputs, context);
    expect(outcome.valid).toBe(false);
    expect(outcome.errors.some(e => e.includes('executionId'))).toBe(true);
  });

  it('flags a workerId mismatch in the output metadata', () => {
    const output = validOutput();
    output.metadata.workerId = 'SomeOtherWorker';
    const outcome = coordinator.validateOutput(output, expectedOutputs, context);
    expect(outcome.valid).toBe(false);
    expect(outcome.errors.some(e => e.includes('workerId'))).toBe(true);
  });

  it('flags a workerVersion mismatch in the output metadata', () => {
    const output = validOutput();
    output.metadata.workerVersion = '9.9.9';
    const outcome = coordinator.validateOutput(output, expectedOutputs, context);
    expect(outcome.valid).toBe(false);
    expect(outcome.errors.some(e => e.includes('workerVersion'))).toBe(true);
  });

  it('persists valid artifacts through M2.3 and reports assigned versions', async () => {
    const persisted = await coordinator.persistArtifacts(
      projectId,
      validOutput().artifacts,
      repo,
      'exec-1'
    );

    expect(persisted).toHaveLength(4);
    expect(persisted.every(p => p.version === 1)).toBe(true);

    const stored = await repo.getCurrentArtifact(projectId, ArtifactType.BUSINESS_RESEARCH);
    expect(stored['artifactId']).toBe('exec-1-BR');
    expect(stored['artifactType']).toBe('BUSINESS_RESEARCH');
    expect(stored['artifactVersion']).toBe(1);
    expect(stored['versionStatus']).toBe('CURRENT');
  });

  it('wraps an M2.3 schema rejection as ARTIFACT_PERSISTENCE_FAILED (fail closed)', async () => {
    const output = validOutput();
    // Schema-invalid: business-research requires all eight payload arrays.
    delete (output.artifacts[0].document as Record<string, unknown>)['explicitGaps'];

    await expect(
      coordinator.persistArtifacts(projectId, output.artifacts, repo, 'exec-1')
    ).rejects.toMatchObject({ failureType: FailureType.ARTIFACT_PERSISTENCE_FAILED });

    // The rejection is an OrchestrationError with the cause preserved.
    await expect(
      coordinator.persistArtifacts(projectId, output.artifacts, repo, 'exec-1')
    ).rejects.toBeInstanceOf(OrchestrationError);

    // Nothing of the failed save leaked into the manifest.
    expect(await repo.hasArtifact(projectId, ArtifactType.BUSINESS_RESEARCH)).toBe(false);
  });
});
