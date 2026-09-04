import * as fs from 'fs';
import * as path from 'path';
import { WorkspaceManager } from '../workspace/WorkspaceManager';
import { v4 as uuidv4 } from 'uuid';

/**
 * Workspace tests.
 * 
 * Verifies workspace isolation and directory structure.
 */
describe('WorkspaceManager', () => {
  const testWorkspaceRoot = './test-projects';
  let workspaceManager: WorkspaceManager;

  beforeAll(() => {
    workspaceManager = new WorkspaceManager(testWorkspaceRoot);
  });

  afterEach(async () => {
    // Cleanup test workspaces
    if (fs.existsSync(testWorkspaceRoot)) {
      await fs.promises.rm(testWorkspaceRoot, { recursive: true, force: true });
    }
  });

  test('should create workspace with all required directories', async () => {
    const projectId = uuidv4();
    
    await workspaceManager.createWorkspace(projectId);
    
    const workspacePath = workspaceManager.getWorkspacePath(projectId);
    expect(fs.existsSync(workspacePath)).toBe(true);
    
    // Verify subdirectories
    expect(fs.existsSync(path.join(workspacePath, 'input'))).toBe(true);
    expect(fs.existsSync(path.join(workspacePath, 'artifacts'))).toBe(true);
    expect(fs.existsSync(path.join(workspacePath, 'state'))).toBe(true);
    expect(fs.existsSync(path.join(workspacePath, 'logs'))).toBe(true);
  });

  test('should throw error if workspace already exists', async () => {
    const projectId = uuidv4();
    
    await workspaceManager.createWorkspace(projectId);
    
    await expect(
      workspaceManager.createWorkspace(projectId)
    ).rejects.toThrow('Workspace already exists');
  });

  test('should support multiple isolated workspaces', async () => {
    const projectId1 = uuidv4();
    const projectId2 = uuidv4();
    
    await workspaceManager.createWorkspace(projectId1);
    await workspaceManager.createWorkspace(projectId2);
    
    const workspace1 = workspaceManager.getWorkspacePath(projectId1);
    const workspace2 = workspaceManager.getWorkspacePath(projectId2);
    
    expect(workspace1).not.toBe(workspace2);
    expect(fs.existsSync(workspace1)).toBe(true);
    expect(fs.existsSync(workspace2)).toBe(true);
  });

  test('workspaceExists should return true for existing workspace', async () => {
    const projectId = uuidv4();
    
    await workspaceManager.createWorkspace(projectId);
    
    const exists = await workspaceManager.workspaceExists(projectId);
    expect(exists).toBe(true);
  });

  test('workspaceExists should return false for non-existent workspace', async () => {
    const projectId = uuidv4();
    
    const exists = await workspaceManager.workspaceExists(projectId);
    expect(exists).toBe(false);
  });

  test('should delete workspace', async () => {
    const projectId = uuidv4();
    
    await workspaceManager.createWorkspace(projectId);
    expect(await workspaceManager.workspaceExists(projectId)).toBe(true);
    
    await workspaceManager.deleteWorkspace(projectId);
    expect(await workspaceManager.workspaceExists(projectId)).toBe(false);
  });

  test('should not error when deleting non-existent workspace', async () => {
    const projectId = uuidv4();
    
    // Should not throw
    await expect(workspaceManager.deleteWorkspace(projectId)).resolves.not.toThrow();
  });

  test('should return normalized paths with forward slashes', () => {
    const projectId = uuidv4();
    const normalizedPath = workspaceManager.getNormalizedWorkspacePath(projectId);
    
    expect(normalizedPath).toMatch(/^test-projects\//);
    expect(normalizedPath).not.toContain('\\');
  });

  test('should get artifacts path', () => {
    const projectId = uuidv4();
    const artifactsPath = workspaceManager.getArtifactsPath(projectId);
    
    expect(artifactsPath).toContain(projectId);
    expect(artifactsPath).toContain('artifacts');
  });

  test('should get state path', () => {
    const projectId = uuidv4();
    const statePath = workspaceManager.getStatePath(projectId);
    
    expect(statePath).toContain(projectId);
    expect(statePath).toContain('state');
  });

  test('should get logs path', () => {
    const projectId = uuidv4();
    const logsPath = workspaceManager.getLogsPath(projectId);
    
    expect(logsPath).toContain(projectId);
    expect(logsPath).toContain('logs');
  });

  test('should use default workspace root when not provided', () => {
    const defaultManager = new WorkspaceManager();
    const projectId = uuidv4();
    
    const workspacePath = defaultManager.getWorkspacePath(projectId);
    expect(workspacePath).toContain('projects');
    expect(workspacePath).toContain(projectId);
  });
});
