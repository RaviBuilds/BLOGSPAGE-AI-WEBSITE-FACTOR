module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  // Serialized test execution.
  //
  // Why: several M2.1 test suites intentionally use process-CWD-relative
  // filesystem roots that are SHARED across Jest workers
  //   - './test-projects'  (workspace.test.ts, status.test.ts, init.test.ts)
  //   - './projects'       (init.test.ts, status.test.ts - ProjectInitializer
  //                         default workspace root)
  // and each suite performs destructive recursive cleanup (fs.rm -rf) of those
  // shared roots in afterEach/finally. When suites run in parallel workers,
  // one worker deletes the directory tree another worker is actively writing
  // to and asserting against, producing nondeterministic ENOENT/"exists"
  // failures (observed as 158-185 of 185 tests passing across runs).
  //
  // Per-file path isolation is NOT possible without modifying M2.1 test
  // assertions (e.g. workspace.test.ts pins the normalized path format
  // /^test-projects\//) or M2.1 production defaults (ProjectInitializer's
  // './projects'), both of which are protected. Serialized filesystem access
  // is therefore the appropriate deterministic test policy for this
  // repository; it removes the race rather than masking a test defect.
  maxWorkers: 1,
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.test.ts',
    '!**/node_modules/**',
    '!**/dist/**'
  ],
  coverageThreshold: {
    global: {
      lines: 80,
      statements: 80,
      branches: 80,
      functions: 80
    }
  }
};
