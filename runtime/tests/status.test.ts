import * as fs from 'fs';
import * as path from 'path';
import { ProjectInitializer } from '../workspace/ProjectInitializer';
import { StateStore } from '../state/StateStore';

/**
 * Status command integration tests.
 * 
 * Tests status display for initialized projects.
 */
describe('Status Command', () => {
  const defaultWorkspaceRoot = './projects';
  const testWorkspaceRoot = './test-projects';
  const benchmarkPath = path.resolve('../07-TEST-BUSINESSES/benchmark-001-dental');

  afterEach(async () => {
    // Cleanup test workspaces (both test-projects and projects)
    if (fs.existsSync(testWorkspaceRoot)) {
      await fs.promises.rm(testWorkspaceRoot, { recursive: true, force: true });
    }
    if (fs.existsSync(defaultWorkspaceRoot)) {
      await fs.promises.rm(defaultWorkspaceRoot, { recursive: true, force: true });
    }
  });

  test('should display status for initialized project', async () => {
    // Skip if benchmark not available
    if (!fs.existsSync(benchmarkPath)) {
      console.warn(`Benchmark not found: ${benchmarkPath}`);
      return;
    }

    const initializer = new ProjectInitializer();
    const projectRecord = await initializer.initialize(benchmarkPath);

    // Load project record
    const loadedRecord = await initializer.loadProjectRecord(projectRecord.projectId);
    
    expect(loadedRecord.projectId).toBe(projectRecord.projectId);
    expect(loadedRecord.businessName).toBe('Meridian Dental Studio');

    // Load current state - use default workspace root (./projects) to match ProjectInitializer
    const stateStore = new StateStore('./projects');
    const currentState = await stateStore.getCurrentState(projectRecord.projectId);
    
    expect(currentState.state).toBe('NEW');
    expect(currentState.projectId).toBe(projectRecord.projectId);
    
    // Cleanup - remove from default projects/ directory
    if (fs.existsSync(projectRecord.workspaceRoot)) {
      await fs.promises.rm(path.join('projects', projectRecord.projectId), { recursive: true, force: true });
    }
  }, 10000);

  test('should fail for non-existent project', async () => {
    const initializer = new ProjectInitializer();
    
    await expect(
      initializer.loadProjectRecord('non-existent-project-id')
    ).rejects.toThrow('Project not found');
  });

  test('should fail state check for non-existent project', async () => {
    const stateStore = new StateStore(testWorkspaceRoot);
    
    await expect(
      stateStore.getCurrentState('non-existent-project-id')
    ).rejects.toThrow('Project not found');
  });

  test('should fail for missing project-record.json', async () => {
    // Create a workspace structure in default projects directory without project-record.json
    const testProjectId = 'test-missing-record';
    const workspacePath = path.join(defaultWorkspaceRoot, testProjectId);
    
    await fs.promises.mkdir(workspacePath, { recursive: true });
    
    const initializer = new ProjectInitializer();
    
    await expect(
      initializer.loadProjectRecord(testProjectId)
    ).rejects.toThrow('Project not found');
  });

  test('should fail for malformed project-record.json', async () => {
    // Create a workspace structure in default projects directory with malformed JSON
    const testProjectId = 'test-malformed-record';
    const workspacePath = path.join(defaultWorkspaceRoot, testProjectId);
    
    await fs.promises.mkdir(workspacePath, { recursive: true });
    await fs.promises.writeFile(
      path.join(workspacePath, 'project-record.json'),
      'invalid json content',
      'utf-8'
    );
    
    const initializer = new ProjectInitializer();
    
    await expect(
      initializer.loadProjectRecord(testProjectId)
    ).rejects.toThrow();
  });
});
