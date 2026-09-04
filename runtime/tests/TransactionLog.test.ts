import * as fs from 'fs';
import * as path from 'path';
import { TransactionLog, LogRecord } from '../state/TransactionLog';

const TEST_WORKSPACE = './test-transaction-log';
const TEST_PROJECT_ID = 'test-project-txlog';

describe('TransactionLog', () => {
  let transactionLog: TransactionLog;

  beforeEach(async () => {
    transactionLog = new TransactionLog(TEST_WORKSPACE);
    
    // Clean up test workspace
    const projectPath = path.join(TEST_WORKSPACE, TEST_PROJECT_ID);
    if (fs.existsSync(projectPath)) {
      await fs.promises.rm(projectPath, { recursive: true, force: true });
    }
    await fs.promises.mkdir(projectPath, { recursive: true });
  });

  afterEach(async () => {
    if (fs.existsSync(TEST_WORKSPACE)) {
      await fs.promises.rm(TEST_WORKSPACE, { recursive: true, force: true });
    }
  });

  describe('initialization', () => {
    test('should initialize with INITIAL_STATE record', async () => {
      await transactionLog.initialize(TEST_PROJECT_ID, 'NEW', 'test-txid-001');

      const records = await transactionLog.readAll(TEST_PROJECT_ID);
      
      expect(records).toHaveLength(1);
      expect(records[0].recordType).toBe('INITIAL_STATE');
      expect(records[0].txId).toBe('test-txid-001');
      expect(records[0].projectId).toBe(TEST_PROJECT_ID);
      if (records[0].recordType === 'INITIAL_STATE') {
        expect(records[0].state).toBe('NEW');
      }
    });

    test('should write newline-terminated records', async () => {
      await transactionLog.initialize(TEST_PROJECT_ID, 'NEW', 'test-txid-001');

      const logPath = transactionLog.getTransactionLogPath(TEST_PROJECT_ID);
      const content = await fs.promises.readFile(logPath, 'utf-8');
      
      expect(content.endsWith('\n')).toBe(true);
    });
  });

  describe('append', () => {
    test('should append STATE_TRANSITION records', async () => {
      await transactionLog.initialize(TEST_PROJECT_ID, 'NEW', 'txid-init');

      await transactionLog.append({
        txId: 'txid-001',
        projectId: TEST_PROJECT_ID,
        recordType: 'STATE_TRANSITION',
        timestamp: new Date().toISOString(),
        triggeredBy: 'test',
        from: 'NEW',
        to: 'RESEARCHING'
      });

      const records = await transactionLog.readAll(TEST_PROJECT_ID);
      expect(records).toHaveLength(2);
      expect(records[1].recordType).toBe('STATE_TRANSITION');
    });

    test('should preserve record order', async () => {
      await transactionLog.initialize(TEST_PROJECT_ID, 'NEW', 'txid-init');

      for (let i = 0; i < 5; i++) {
        await transactionLog.append({
          txId: `txid-${i}`,
          projectId: TEST_PROJECT_ID,
          recordType: 'STATE_TRANSITION',
          timestamp: new Date().toISOString(),
          triggeredBy: 'test',
          from: 'STATE_A',
          to: 'STATE_B',
          metadata: { sequence: i }
        });
      }

      const records = await transactionLog.readAll(TEST_PROJECT_ID);
      expect(records).toHaveLength(6); // 1 INITIAL_STATE + 5 transitions
      
      for (let i = 0; i < 5; i++) {
        const record = records[i + 1];
        if (record.recordType === 'STATE_TRANSITION') {
          expect(record.metadata?.sequence).toBe(i);
        }
      }
    });
  });

  describe('crash recovery', () => {
    test('should recover from incomplete physical tail (no final newline)', async () => {
      await transactionLog.initialize(TEST_PROJECT_ID, 'NEW', 'txid-init');
      await transactionLog.append({
        txId: 'txid-001',
        projectId: TEST_PROJECT_ID,
        recordType: 'STATE_TRANSITION',
        timestamp: new Date().toISOString(),
        triggeredBy: 'test',
        from: 'NEW',
        to: 'RESEARCHING'
      });

      // Simulate incomplete write by appending partial JSON without newline
      const logPath = transactionLog.getTransactionLogPath(TEST_PROJECT_ID);
      await fs.promises.appendFile(logPath, '{"txId":"incomplete","proj');

      // Should recover by truncating incomplete tail
      const records = await transactionLog.readAll(TEST_PROJECT_ID);
      expect(records).toHaveLength(2); // Only complete records
    });

    test('should FATAL on file with incomplete tail and no prior newline', async () => {
      // Create log file with content but no newline (triggers recovery, then fails)
      const logPath = transactionLog.getTransactionLogPath(TEST_PROJECT_ID);
      await fs.promises.mkdir(path.dirname(logPath), { recursive: true });
      await fs.promises.writeFile(logPath, '{"incomplete": "data"'); // No newline, triggers recovery

      // Recovery will fail because lastNewlineIndex === -1
      await expect(transactionLog.readAll(TEST_PROJECT_ID))
        .rejects.toThrow(/FATAL.*no valid records/);
    });

    test('should FATAL on newline-terminated corrupt record', async () => {
      await transactionLog.initialize(TEST_PROJECT_ID, 'NEW', 'txid-init');

      // Write malformed but newline-terminated record
      const logPath = transactionLog.getTransactionLogPath(TEST_PROJECT_ID);
      await fs.promises.appendFile(logPath, '{invalid json}\n');

      await expect(transactionLog.readAll(TEST_PROJECT_ID))
        .rejects.toThrow(/FATAL.*Corrupt complete record/);
    });

    test('should FATAL on historical corruption during recovery', async () => {
      await transactionLog.initialize(TEST_PROJECT_ID, 'NEW', 'txid-init');

      // Write valid record first, then add incomplete tail with corrupted history
      const logPath = transactionLog.getTransactionLogPath(TEST_PROJECT_ID);
      
      // Overwrite with corrupted complete portion + incomplete tail
      await fs.promises.writeFile(logPath, '{corrupted}\n{"incomplete": "tail"');

      // This triggers recovery, which finds corruption in the complete portion
      await expect(transactionLog.readAll(TEST_PROJECT_ID))
        .rejects.toThrow(/FATAL.*Historical corruption/);
    });

    test('should FATAL on schema-invalid record (missing recordType)', async () => {
      await transactionLog.initialize(TEST_PROJECT_ID, 'NEW', 'txid-init');

      // Write valid JSON but missing required fields
      const logPath = transactionLog.getTransactionLogPath(TEST_PROJECT_ID);
      const invalidRecord = { txId: 'test', projectId: 'test' }; // Missing recordType
      await fs.promises.appendFile(logPath, JSON.stringify(invalidRecord) + '\n');

      await expect(transactionLog.readAll(TEST_PROJECT_ID))
        .rejects.toThrow(/FATAL.*Invalid record structure/);
    });

    test('should FATAL on unknown recordType', async () => {
      await transactionLog.initialize(TEST_PROJECT_ID, 'NEW', 'txid-init');

      // Write valid JSON with unknown recordType
      const logPath = transactionLog.getTransactionLogPath(TEST_PROJECT_ID);
      const invalidRecord = {
        txId: 'test-tx',
        projectId: TEST_PROJECT_ID,
        recordType: 'UNKNOWN_TYPE', // Invalid recordType
        timestamp: new Date().toISOString(),
        triggeredBy: 'test'
      };
      await fs.promises.appendFile(logPath, JSON.stringify(invalidRecord) + '\n');

      await expect(transactionLog.readAll(TEST_PROJECT_ID))
        .rejects.toThrow(/FATAL.*Invalid record structure/);
    });

    test('should FATAL on STATE_TRANSITION missing from/to fields', async () => {
      await transactionLog.initialize(TEST_PROJECT_ID, 'NEW', 'txid-init');

      // STATE_TRANSITION without from/to fields
      const logPath = transactionLog.getTransactionLogPath(TEST_PROJECT_ID);
      const invalidRecord = {
        txId: 'test-tx',
        projectId: TEST_PROJECT_ID,
        recordType: 'STATE_TRANSITION',
        timestamp: new Date().toISOString(),
        triggeredBy: 'test'
        // Missing from/to
      };
      await fs.promises.appendFile(logPath, JSON.stringify(invalidRecord) + '\n');

      await expect(transactionLog.readAll(TEST_PROJECT_ID))
        .rejects.toThrow(/FATAL.*Invalid record structure/);
    });

    test('should FATAL on historical corruption in complete records', async () => {
      await transactionLog.initialize(TEST_PROJECT_ID, 'NEW', 'txid-init');
      
      // Corrupt the first line (INITIAL_STATE)
      const logPath = transactionLog.getTransactionLogPath(TEST_PROJECT_ID);
      await fs.promises.writeFile(logPath, '{corrupted}\n');

      await expect(transactionLog.readAll(TEST_PROJECT_ID))
        .rejects.toThrow(/FATAL/);
    });
  });

  describe('crash recovery - edge cases', () => {
    test('should default workspaceRoot to ./projects', () => {
      const defaultLog = new TransactionLog();
      expect(defaultLog.getTransactionLogPath('proj')).toBe(
        path.join('./projects', 'proj', 'transaction.log')
      );
    });

    test('should treat empty log file as zero records (not corruption)', async () => {
      await transactionLog.initialize(TEST_PROJECT_ID, 'NEW', 'txid-init');
      const logPath = transactionLog.getTransactionLogPath(TEST_PROJECT_ID);

      // Empty WAL: physically present but contains no records.
      // Per contract it is not truncated, not treated as corruption;
      // it simply yields zero records (downstream drift check rejects).
      await fs.promises.writeFile(logPath, '');

      const records = await transactionLog.readAll(TEST_PROJECT_ID);
      expect(records).toEqual([]);
    });

    test('should FATAL on schema-invalid record within complete portion during tail recovery', async () => {
      await transactionLog.initialize(TEST_PROJECT_ID, 'NEW', 'txid-init');
      const logPath = transactionLog.getTransactionLogPath(TEST_PROJECT_ID);

      // Complete portion: valid INITIAL_STATE line + schema-invalid line (valid JSON, invalid structure)
      // followed by a physically incomplete final tail (no trailing newline).
      const validInit = JSON.stringify({
        txId: 'txid-init',
        projectId: TEST_PROJECT_ID,
        recordType: 'INITIAL_STATE',
        timestamp: new Date().toISOString(),
        triggeredBy: 'test',
        state: 'NEW'
      });
      const schemaInvalid = JSON.stringify({
        txId: 'broken',
        projectId: TEST_PROJECT_ID
        // missing recordType/timestamp/triggeredBy
      });
      await fs.promises.writeFile(
        logPath,
        `${validInit}\n${schemaInvalid}\n{"incomplete":"tail"`
      );

      await expect(transactionLog.readAll(TEST_PROJECT_ID))
        .rejects.toThrow(/FATAL.*Historical corruption.*line 2/);
    });

    test('should FATAL on null record in log', async () => {
      await transactionLog.initialize(TEST_PROJECT_ID, 'NEW', 'txid-init');
      const logPath = transactionLog.getTransactionLogPath(TEST_PROJECT_ID);

      // Valid JSON that parses to null - structurally invalid record
      await fs.promises.appendFile(logPath, 'null\n');

      await expect(transactionLog.readAll(TEST_PROJECT_ID))
        .rejects.toThrow(/FATAL.*Invalid record structure/);
    });

    test.each([
      ['missing txId', {
        projectId: TEST_PROJECT_ID, recordType: 'STATE_TRANSITION',
        timestamp: '2024-01-01T00:00:00.000Z', triggeredBy: 'test', from: 'NEW', to: 'RESEARCHING'
      }],
      ['missing projectId', {
        txId: 'tx-x', recordType: 'STATE_TRANSITION',
        timestamp: '2024-01-01T00:00:00.000Z', triggeredBy: 'test', from: 'NEW', to: 'RESEARCHING'
      }],
      ['missing timestamp', {
        txId: 'tx-x', projectId: TEST_PROJECT_ID, recordType: 'STATE_TRANSITION',
        triggeredBy: 'test', from: 'NEW', to: 'RESEARCHING'
      }],
      ['missing triggeredBy', {
        txId: 'tx-x', projectId: TEST_PROJECT_ID, recordType: 'STATE_TRANSITION',
        timestamp: '2024-01-01T00:00:00.000Z', from: 'NEW', to: 'RESEARCHING'
      }],
      ['INITIAL_STATE missing state', {
        txId: 'tx-x', projectId: TEST_PROJECT_ID, recordType: 'INITIAL_STATE',
        timestamp: '2024-01-01T00:00:00.000Z', triggeredBy: 'test'
      }],
      ['STATE_TRANSITION missing to', {
        txId: 'tx-x', projectId: TEST_PROJECT_ID, recordType: 'STATE_TRANSITION',
        timestamp: '2024-01-01T00:00:00.000Z', triggeredBy: 'test', from: 'NEW'
      }]
    ])('should FATAL on record with %s', async (_label, invalidRecord) => {
      await transactionLog.initialize(TEST_PROJECT_ID, 'NEW', 'txid-init');
      const logPath = transactionLog.getTransactionLogPath(TEST_PROJECT_ID);

      await fs.promises.appendFile(logPath, JSON.stringify(invalidRecord) + '\n');

      await expect(transactionLog.readAll(TEST_PROJECT_ID))
        .rejects.toThrow(/FATAL.*Invalid record structure/);
    });
  });

  describe('exists', () => {
    test('should return false for non-existent log', () => {
      expect(transactionLog.exists('non-existent')).toBe(false);
    });

    test('should return true after initialization', async () => {
      await transactionLog.initialize(TEST_PROJECT_ID, 'NEW', 'txid-init');
      expect(transactionLog.exists(TEST_PROJECT_ID)).toBe(true);
    });
  });
});
