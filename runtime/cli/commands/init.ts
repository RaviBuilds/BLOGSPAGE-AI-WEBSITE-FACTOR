import { ProjectInitializer } from '../../workspace/ProjectInitializer';
import { logger } from '../../logging/Logger';

/**
 * Init command handler.
 * 
 * Initialize new project from business input.
 * 
 * Usage: runtime init <path-to-benchmark>
 */
export async function initCommand(benchmarkPath: string): Promise<void> {
  try {
    console.log(`Initializing project from: ${benchmarkPath}`);
    console.log('');

    const initializer = new ProjectInitializer();
    const projectRecord = await initializer.initialize(benchmarkPath);

    console.log('✓ Project initialized successfully');
    console.log('');
    console.log(`Project ID:      ${projectRecord.projectId}`);
    console.log(`Business Name:   ${projectRecord.businessName}`);
    console.log(`Workspace:       ${projectRecord.workspaceRoot}`);
    console.log(`Factory Version: ${projectRecord.factoryVersion}`);
    console.log(`Created:         ${projectRecord.createdAt}`);
    console.log('');
    console.log(`Next: runtime status ${projectRecord.projectId}`);

    process.exit(0);
  } catch (error) {
    const err = error as Error;
    
    console.error('✗ Initialization failed');
    console.error('');
    console.error(`Error: ${err.message}`);
    console.error('');
    
    logger.error('Init command failed', {
      component: 'InitCommand',
      error: err.message,
      stack: err.stack
    });

    process.exit(1);
  }
}
