import { ProjectInitializer } from '../../workspace/ProjectInitializer';
import { StateStore } from '../../state/StateStore';
import { configManager } from '../../config/ConfigManager';
import { logger } from '../../logging/Logger';

/**
 * Status command handler.
 * 
 * Display current project state.
 * 
 * Usage: runtime status <project-id>
 */
export async function statusCommand(projectId: string): Promise<void> {
  try {
    const initializer = new ProjectInitializer();
    const stateStore = new StateStore(configManager.getWorkspaceRoot());

    // Load project record
    const projectRecord = await initializer.loadProjectRecord(projectId);
    
    // Load current state
    const currentState = await stateStore.getCurrentState(projectId);

    console.log('');
    console.log('Project Status');
    console.log('═'.repeat(60));
    console.log(`Project ID:      ${projectRecord.projectId}`);
    console.log(`Business Name:   ${projectRecord.businessName}`);
    console.log(`State:           ${currentState.state}`);
    console.log(`Last Updated:    ${currentState.updatedAt}`);
    console.log(`Workspace:       ${projectRecord.workspaceRoot}`);
    console.log(`Factory Version: ${projectRecord.factoryVersion}`);
    console.log(`Created:         ${projectRecord.createdAt}`);
    console.log('═'.repeat(60));
    console.log('');

    process.exit(0);
  } catch (error) {
    const err = error as Error;
    
    console.error('✗ Status command failed');
    console.error('');
    console.error(`Error: ${err.message}`);
    console.error('');
    
    logger.error('Status command failed', {
      component: 'StatusCommand',
      projectId,
      error: err.message
    });

    process.exit(1);
  }
}
