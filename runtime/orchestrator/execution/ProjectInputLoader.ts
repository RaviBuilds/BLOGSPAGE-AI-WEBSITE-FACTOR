/**
 * Project input loading for M2.4.
 *
 * Loads and parses the project's business input
 * (`<workspace>/<projectId>/input/business-input.yaml`) through M1's
 * workspace contract (WorkspaceManager.getInputPath — M1 owns the workspace
 * layout, and ProjectInitializer copies the input there at registration).
 *
 * Project input is M1-owned project data, NOT an M2.3 artifact: the
 * orchestrator reads it so that workers never perform filesystem access
 * themselves. This is the only file the orchestrator layer reads outside
 * M2.3, and it is exactly the read M1's own ProjectInitializer performs.
 *
 * Multi-document YAML (the benchmark header document + the business input)
 * is handled the same way ProjectInitializer handles it: all documents are
 * loaded, null/comment-only documents are filtered, and the last valid
 * document is the business input.
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 * Factory version: 0.2.0
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { logger } from '../../logging/Logger';
import { ProjectRecord } from '../../workspace/ProjectInitializer';
import { FailureType, OrchestrationError } from '../types';

export class ProjectInputLoader {
  /**
   * @param workspaceRoot The same workspace root M1 uses ('./projects' in
   *   production; tests pass an isolated temp root).
   */
  constructor(private readonly workspaceRoot: string) {}

  /**
   * Load and parse the project's business input.
   *
   * @throws OrchestrationError (PROJECT_INPUT_UNAVAILABLE) when the input
   *   file is missing or unparseable — fail-closed, the step is not
   *   dispatched with an unusable input.
   */
  async load(projectId: string): Promise<unknown> {
    // Same layout contract as WorkspaceManager.getInputPath(projectId):
    // <root>/<projectId>/input/business-input.yaml. Path containment is
    // guaranteed by validateProjectId at every M2.1/M2.3 boundary; the id
    // here has already passed those boundaries before reaching this call.
    const inputPath = path.join(
      this.workspaceRoot,
      projectId,
      'input',
      'business-input.yaml'
    );

    let content: string;
    try {
      content = await fs.promises.readFile(inputPath, 'utf-8');
    } catch (error) {
      throw new OrchestrationError(
        FailureType.PROJECT_INPUT_UNAVAILABLE,
        `Project business input not found at ${inputPath}`,
        projectId,
        undefined,
        error
      );
    }

    let documents: unknown[];
    try {
      documents = yaml.loadAll(content);
    } catch (error) {
      throw new OrchestrationError(
        FailureType.PROJECT_INPUT_UNAVAILABLE,
        `Failed to parse project business input at ${inputPath}: ${
          error instanceof Error ? error.message : String(error)
        }`,
        projectId,
        undefined,
        error
      );
    }

    const valid = (documents ?? []).filter(doc => doc !== null && doc !== undefined);
    if (valid.length === 0) {
      throw new OrchestrationError(
        FailureType.PROJECT_INPUT_UNAVAILABLE,
        `Project business input at ${inputPath} contains no valid YAML documents`,
        projectId
      );
    }

    const businessInput = valid[valid.length - 1];
    logger.info('Project business input loaded', {
      component: 'ProjectInputLoader',
      projectId,
      inputPath
    });

    return businessInput;
  }

  /**
   * Load the M1 project record when it exists (M1 writes
   * `<workspace>/<projectId>/project-record.json` at registration); when a
   * project was registered through a path that skips that file (as tests
   * bootstrapping M2.1 state directly do), a minimal record carrying only
   * the facts M2.4 itself knows is synthesized. The ExecutionContext's
   * projectRecord is therefore always present and always honest about its
   * source.
   */
  async loadProjectRecord(projectId: string): Promise<ProjectRecord> {
    const recordPath = path.join(this.workspaceRoot, projectId, 'project-record.json');
    try {
      const content = await fs.promises.readFile(recordPath, 'utf-8');
      return JSON.parse(content) as ProjectRecord;
    } catch {
      logger.info('No M1 project record file present; synthesizing minimal record', {
        component: 'ProjectInputLoader',
        projectId
      });
      return {
        projectId,
        businessName: `project-${projectId}`,
        createdAt: new Date().toISOString(),
        workspaceRoot: path
          .join(this.workspaceRoot, projectId)
          .replace(/\\/g, '/'),
        inputSource: 'input/business-input.yaml',
        factoryVersion: '0.2.0'
      };
    }
  }
}
