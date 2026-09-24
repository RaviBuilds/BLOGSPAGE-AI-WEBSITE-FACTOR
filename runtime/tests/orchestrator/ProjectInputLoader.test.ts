/**
 * ProjectInputLoader tests — the M2.4-approved input adapter over M1's
 * workspace contract (Sections P/Q).
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { WorkspaceManager } from '../../workspace/WorkspaceManager';
import { ProjectInputLoader } from '../../orchestrator/execution/ProjectInputLoader';
import { FailureType, OrchestrationError } from '../../orchestrator/types';
import {
  bootstrapResearchProject,
  makeWorkspaceRoot,
  removeWorkspaceRoot,
  TEST_BUSINESS_INPUT_YAML
} from './helpers';

describe('ProjectInputLoader (M2.4)', () => {
  const projectId = 'loader-proj';
  let workspaceRoot: string;
  let loader: ProjectInputLoader;

  beforeEach(async () => {
    workspaceRoot = makeWorkspaceRoot('loader');
    loader = new ProjectInputLoader(workspaceRoot);
  });

  afterEach(async () => {
    await removeWorkspaceRoot(workspaceRoot);
  });

  it('parses the multi-document benchmark business input (header + input)', async () => {
    await bootstrapResearchProject(workspaceRoot, projectId, TEST_BUSINESS_INPUT_YAML);

    const input = (await loader.load(projectId)) as Record<string, unknown>;
    expect((input['businessIdentity'] as Record<string, unknown>)['name']).toBe(
      'Test Dental Studio'
    );
    expect(input['suppliedBrand']).toBeDefined();
  });

  it('fails closed with PROJECT_INPUT_UNAVAILABLE when the input file is missing', async () => {
    const ws = new WorkspaceManager(workspaceRoot);
    await ws.createWorkspace(projectId);

    await expect(loader.load(projectId)).rejects.toMatchObject({
      failureType: FailureType.PROJECT_INPUT_UNAVAILABLE
    });
  });

  it('fails closed with PROJECT_INPUT_UNAVAILABLE on unparseable YAML', async () => {
    const ws = new WorkspaceManager(workspaceRoot);
    await ws.createWorkspace(projectId);
    await fs.writeFile(
      path.join(ws.getInputPath(projectId), 'business-input.yaml'),
      'businessIdentity: [unclosed',
      'utf-8'
    );

    await expect(loader.load(projectId)).rejects.toBeInstanceOf(OrchestrationError);
  });

  it('fails closed when the input contains no valid YAML documents', async () => {
    const ws = new WorkspaceManager(workspaceRoot);
    await ws.createWorkspace(projectId);
    // Comment-only document: parses to null, filtered out.
    await fs.writeFile(
      path.join(ws.getInputPath(projectId), 'business-input.yaml'),
      '# only a header comment\n',
      'utf-8'
    );

    await expect(loader.load(projectId)).rejects.toMatchObject({
      failureType: FailureType.PROJECT_INPUT_UNAVAILABLE
    });
  });

  it('loads the M1 project record when present', async () => {
    await bootstrapResearchProject(workspaceRoot, projectId);
    const recordPath = path.join(
      workspaceRoot,
      projectId,
      'project-record.json'
    );
    await fs.writeFile(
      recordPath,
      JSON.stringify({
        projectId,
        businessName: 'Recorded Business',
        createdAt: '2026-09-05T00:00:00.000Z',
        workspaceRoot: 'ws',
        inputSource: 'benchmark',
        factoryVersion: '0.2.0'
      }),
      'utf-8'
    );

    const record = await loader.loadProjectRecord(projectId);
    expect(record.businessName).toBe('Recorded Business');
    expect(record.projectId).toBe(projectId);
  });

  it('synthesizes a minimal honest record when no M1 record file exists', async () => {
    const ws = new WorkspaceManager(workspaceRoot);
    await ws.createWorkspace(projectId);

    const record = await loader.loadProjectRecord(projectId);
    expect(record.projectId).toBe(projectId);
    expect(record.factoryVersion).toBe('0.2.0');
    expect(record.inputSource).toBe('input/business-input.yaml');
  });
});
