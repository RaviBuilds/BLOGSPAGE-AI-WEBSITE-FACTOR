import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { v4 as uuidv4 } from 'uuid';
import { WorkspaceManager } from './WorkspaceManager';
import { InputValidator } from './InputValidator';
import { StateManager } from '../state/StateManager';
import { State } from '../state/StateMachine';
import { logger } from '../logging/Logger';
import { configManager } from '../config/ConfigManager';

/**
 * Project record interface.
 */
export interface ProjectRecord {
  projectId: string;
  businessName: string;
  createdAt: string;
  workspaceRoot: string;
  inputSource: string;
  factoryVersion: string;
}

/**
 * Project initializer.
 * 
 * Responsibilities:
 * - Load business-input.yaml from benchmark
 * - Validate input
 * - Generate project ID
 * - Create workspace
 * - Copy input to workspace
 * - Set initial state (NEW)
 * - Create project record
 */
export class ProjectInitializer {
  private workspaceManager: WorkspaceManager;
  private inputValidator: InputValidator;
  private stateManager: StateManager;

  constructor() {
    const workspaceRoot = configManager.getWorkspaceRoot();
    this.workspaceManager = new WorkspaceManager(workspaceRoot);
    this.inputValidator = new InputValidator();
    this.stateManager = new StateManager(workspaceRoot);
  }

  /**
   * Initialize project from benchmark business input.
   * 
   * Implements rollback: if initialization fails after workspace creation,
   * the newly-created workspace is deleted and the original error is preserved.
   * 
   * @param benchmarkPath Path to benchmark directory containing business-input.yaml
   * @returns Project record
   */
  async initialize(benchmarkPath: string): Promise<ProjectRecord> {
    logger.info('Initializing project', {
      component: 'ProjectInitializer',
      benchmarkPath
    });

    // 1. Load business-input.yaml
    const inputPath = path.join(benchmarkPath, 'business-input.yaml');
    
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Business input not found: ${inputPath}`);
    }

    let businessInput: any;
    try {
      const content = await fs.promises.readFile(inputPath, 'utf-8');
      // Use loadAll to handle multi-document YAML (benchmark has header doc)
      const documents = yaml.loadAll(content);
      // Filter out null documents (comment-only documents)
      const validDocuments = documents.filter(doc => doc !== null);
      
      if (validDocuments.length === 0) {
        throw new Error('No valid YAML documents found');
      }
      
      // Take the last valid document (actual business input, after header comments)
      businessInput = validDocuments[validDocuments.length - 1];
    } catch (error) {
      throw new Error(`Failed to parse business input: ${(error as Error).message}`);
    }

    // 2. Validate input
    const validationResult = this.inputValidator.validate(businessInput);
    if (!validationResult.valid) {
      throw new Error(`Input validation failed:\n${validationResult.errors.map(e => `  - ${e}`).join('\n')}`);
    }

    // 3. Generate project ID
    const projectId = uuidv4();
    
    logger.info('Project ID generated', {
      component: 'ProjectInitializer',
      projectId
    });

    // 4-8: Workspace creation and initialization with rollback on failure
    let workspaceCreated = false;
    
    try {
      // 4. Create workspace
      await this.workspaceManager.createWorkspace(projectId);
      workspaceCreated = true;

      // 5. Copy business-input.yaml to workspace
      const workspaceInputPath = path.join(
        this.workspaceManager.getInputPath(projectId),
        'business-input.yaml'
      );
      await fs.promises.copyFile(inputPath, workspaceInputPath);
      
      logger.info('Business input copied to workspace', {
        component: 'ProjectInitializer',
        projectId,
        source: inputPath,
        destination: workspaceInputPath
      });

      // 6. Set initial state (NEW) using M2.1 transaction log
      const stateTxId = uuidv4(); // Generate txId for initial state
      await this.stateManager.initializeProject(projectId, State.NEW, stateTxId);
      
      logger.info('Initial state set', {
        component: 'ProjectInitializer',
        projectId,
        state: State.NEW,
        txId: stateTxId
      });

      // 7. Create project record (with normalized path)
      const projectRecord: ProjectRecord = {
        projectId,
        businessName: businessInput.businessIdentity?.name || 'Unknown Business',
        createdAt: new Date().toISOString(),
        workspaceRoot: this.workspaceManager.getNormalizedWorkspacePath(projectId),
        inputSource: inputPath,
        factoryVersion: configManager.getFactoryVersion()
      };

      // 8. Persist project record
      const projectRecordPath = path.join(
        this.workspaceManager.getWorkspacePath(projectId),
        'project-record.json'
      );
      await fs.promises.writeFile(
        projectRecordPath,
        JSON.stringify(projectRecord, null, 2),
        'utf-8'
      );

      logger.info('Project initialized successfully', {
        component: 'ProjectInitializer',
        projectId,
        businessName: businessInput.businessIdentity?.name
      });

      return projectRecord;
      
    } catch (error) {
      // Rollback: remove workspace if it was created during this initialization
      if (workspaceCreated) {
        logger.error('Initialization failed, rolling back workspace', {
          component: 'ProjectInitializer',
          projectId,
          error: (error as Error).message
        });
        
        try {
          await this.workspaceManager.deleteWorkspace(projectId);
        } catch (rollbackError) {
          logger.error('Rollback failed', {
            component: 'ProjectInitializer',
            projectId,
            rollbackError: (rollbackError as Error).message
          });
        }
      }
      
      // Re-throw original error
      throw error;
    }
  }

  /**
   * Load project record from workspace.
   */
  async loadProjectRecord(projectId: string): Promise<ProjectRecord> {
    const workspacePath = this.workspaceManager.getWorkspacePath(projectId);
    const projectRecordPath = path.join(workspacePath, 'project-record.json');
    
    if (!fs.existsSync(projectRecordPath)) {
      throw new Error(`Project not found: ${projectId}`);
    }

    const content = await fs.promises.readFile(projectRecordPath, 'utf-8');
    return JSON.parse(content) as ProjectRecord;
  }
}
