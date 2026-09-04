import { RuntimeConfig } from './types';
import { logger } from '../logging/Logger';

/**
 * Configuration manager.
 * 
 * M1: Uses defaults only, no environment variables.
 * M7: Will add environment variable loading (ANTHROPIC_API_KEY, etc.)
 */
export class ConfigManager {
  private config: RuntimeConfig;

  constructor() {
    this.config = this.loadDefaults();
    
    logger.info('Configuration loaded', {
      component: 'ConfigManager',
      workspaceRoot: this.config.workspace.root,
      factoryVersion: this.config.factoryVersion
    });
  }

  /**
   * Load default configuration.
   * 
   * M1: Defaults only.
   * M7: Will merge with environment variables.
   */
  private loadDefaults(): RuntimeConfig {
    return {
      workspace: {
        root: './projects'
      },
      logging: {
        level: 'info',
        structured: true
      },
      factoryVersion: '0.2.0'
    };
  }

  /**
   * Get full configuration.
   */
  getConfig(): RuntimeConfig {
    return this.config;
  }

  /**
   * Get workspace root path.
   */
  getWorkspaceRoot(): string {
    return this.config.workspace.root;
  }

  /**
   * Get factory version.
   */
  getFactoryVersion(): string {
    return this.config.factoryVersion;
  }
}

// Singleton instance
export const configManager = new ConfigManager();
