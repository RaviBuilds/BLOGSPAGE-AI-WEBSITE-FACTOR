#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './commands/init';
import { statusCommand } from './commands/status';

/**
 * Blogspage AI Website Factory Runtime CLI
 * 
 * M1: Project initialization and status commands
 */

const program = new Command();

program
  .name('runtime')
  .description('Blogspage AI Website Factory Runtime')
  .version('0.1.0');

program
  .command('init <business-input-path>')
  .description('Initialize new project from business input')
  .action((path: string) => {
    initCommand(path).catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
  });

program
  .command('status <project-id>')
  .description('Show current project state')
  .action((projectId: string) => {
    statusCommand(projectId).catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
  });

program.parse();
