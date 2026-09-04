import { logger } from '../logging/Logger';

/**
 * Logging tests.
 * 
 * Verifies structured logging functionality.
 */
describe('Logger', () => {
  test('should log info messages without throwing', () => {
    expect(() => {
      logger.info('Test info message', { component: 'Test' });
    }).not.toThrow();
  });

  test('should log warn messages without throwing', () => {
    expect(() => {
      logger.warn('Test warning message', { component: 'Test' });
    }).not.toThrow();
  });

  test('should log error messages without throwing', () => {
    expect(() => {
      logger.error('Test error message', { component: 'Test' });
    }).not.toThrow();
  });

  test('should log debug messages without throwing', () => {
    expect(() => {
      logger.debug('Test debug message', { component: 'Test' });
    }).not.toThrow();
  });

  test('should accept context objects', () => {
    expect(() => {
      logger.info('Test message with context', {
        component: 'Test',
        projectId: 'test-123',
        event: 'test-event',
        customField: 'custom value'
      });
    }).not.toThrow();
  });

  test('should log without context', () => {
    expect(() => {
      logger.info('Test message without context');
    }).not.toThrow();
  });

  test('should handle empty context object', () => {
    expect(() => {
      logger.info('Test message with empty context', {});
    }).not.toThrow();
  });

  test('should handle all log levels', () => {
    expect(() => {
      logger.log('info', 'Info via log method');
      logger.log('warn', 'Warn via log method');
      logger.log('error', 'Error via log method');
      logger.log('debug', 'Debug via log method');
    }).not.toThrow();
  });

  test('should handle log with context via log method', () => {
    expect(() => {
      logger.log('info', 'Message with context', { component: 'TestComponent' });
    }).not.toThrow();
  });

  test('should handle log without context via log method', () => {
    expect(() => {
      logger.log('warn', 'Message without context');
    }).not.toThrow();
  });
});
