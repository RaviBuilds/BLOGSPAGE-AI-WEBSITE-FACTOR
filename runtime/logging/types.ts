export interface LogContext {
  projectId?: string;
  component?: string;
  event?: string;
  [key: string]: any;
}

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
