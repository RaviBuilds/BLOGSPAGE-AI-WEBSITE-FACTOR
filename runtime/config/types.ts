/**
 * Runtime configuration types.
 */
export interface RuntimeConfig {
  workspace: WorkspaceConfig;
  logging: LoggingConfig;
  factoryVersion: string;
}

export interface WorkspaceConfig {
  root: string; // Default: './projects'
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  structured: boolean;
}
