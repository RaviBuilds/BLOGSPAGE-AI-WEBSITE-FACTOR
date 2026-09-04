import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../logging/Logger';

/**
 * Workspace manager.
 * 
 * Responsibilities:
 * - Create isolated workspace directories for each project
 * - Manage workspace structure per artifact-contracts.md §1 rule 7
 * 
 * Workspace structure:
 * projects/{projectId}/
 *   ├── input/              # Business input files
 *   ├── artifacts/          # Generated artifacts (versioned)
 *   ├── state/              # Current state and history
 *   └── logs/               # Execution logs
 */
export class WorkspaceManager {
  private workspaceRoot: string;

  constructor(workspaceRoot: string = './projects') {
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * Create workspace for project.
   * 
   * Creates directory structure:
   * - input/
   * - artifacts/
   * - state/
   * - logs/
   * 
   * @throws Error if workspace already exists
   */
  async createWorkspace(projectId: string): Promise<void> {
    const workspacePath = this.getWorkspacePath(projectId);
    
    // Check if workspace already exists
    if (fs.existsSync(workspacePath)) {
      throw new Error(`Workspace already exists: ${projectId}`);
    }

    // Create workspace root
    await fs.promises.mkdir(workspacePath, { recursive: true });
    
    // Create subdirectories
    const subdirs = ['input', 'artifacts', 'state', 'logs'];
    for (const subdir of subdirs) {
      const subdirPath = path.join(workspacePath, subdir);
      await fs.promises.mkdir(subdirPath, { recursive: true });
    }
    
    logger.info('Workspace created', {
      component: 'WorkspaceManager',
      projectId,
      path: workspacePath
    });
  }

  /**
   * Get workspace path for project.
   */
  getWorkspacePath(projectId: string): string {
    return path.join(this.workspaceRoot, projectId);
  }

  /**
   * Get input directory path.
   */
  getInputPath(projectId: string): string {
    return path.join(this.getWorkspacePath(projectId), 'input');
  }

  /**
   * Get artifacts directory path.
   */
  getArtifactsPath(projectId: string): string {
    return path.join(this.getWorkspacePath(projectId), 'artifacts');
  }

  /**
   * Get state directory path.
   */
  getStatePath(projectId: string): string {
    return path.join(this.getWorkspacePath(projectId), 'state');
  }

  /**
   * Get logs directory path.
   */
  getLogsPath(projectId: string): string {
    return path.join(this.getWorkspacePath(projectId), 'logs');
  }

  /**
   * Check if workspace exists.
   */
  async workspaceExists(projectId: string): Promise<boolean> {
    const workspacePath = this.getWorkspacePath(projectId);
    return fs.existsSync(workspacePath);
  }

  /**
   * Delete workspace for project.
   * 
   * Used for rollback when initialization fails.
   * Only removes workspaces; never removes if workspace doesn't exist.
   * 
   * @param projectId Project ID whose workspace to remove
   */
  async deleteWorkspace(projectId: string): Promise<void> {
    const workspacePath = this.getWorkspacePath(projectId);
    
    if (fs.existsSync(workspacePath)) {
      // Windows-safe deletion: fs.rm retries transient EBUSY/ENOTEMPTY/EPERM
      // errors that occur when recently-closed file handles (e.g. WAL datasync
      // handles during init rollback) are still being released by the OS.
      await fs.promises.rm(workspacePath, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 100
      });
      
      logger.info('Workspace deleted', {
        component: 'WorkspaceManager',
        projectId,
        path: workspacePath
      });
    }
  }

  /**
   * Get normalized workspace path for JSON serialization.
   * 
   * Returns forward-slash path for cross-platform JSON storage.
   * Filesystem operations should use getWorkspacePath() instead.
   */
  getNormalizedWorkspacePath(projectId: string): string {
    const workspacePath = this.getWorkspacePath(projectId);
    // Normalize to forward slashes for JSON serialization
    return workspacePath.replace(/\\/g, '/');
  }
}
