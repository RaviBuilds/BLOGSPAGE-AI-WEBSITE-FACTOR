/**
 * StateMachine Tests
 * 
 * Tests canonical state machine constants and verification functions.
 * Focuses on branch coverage for state count verification.
 */

import { getAllStates, verifyStateCount, CANONICAL_STATE_COUNT } from '../state/StateMachine';

describe('StateMachine', () => {
  test('should return all 18 canonical states', () => {
    const states = getAllStates();
    expect(states).toHaveLength(18);
    expect(states).toContain('NEW');
    expect(states).toContain('DELIVERED');
    expect(states).toContain('BLOCKED');
  });

  test('should verify state count matches canonical count', () => {
    // This should not throw - current implementation has 18 states
    expect(() => verifyStateCount()).not.toThrow();
  });

  test('should detect state count drift below canonical count', () => {
    // Narrow seam: verifyStateCount accepts an explicit state list so drift
    // detection is testable without mutating the canonical State enum.
    const drifted = getAllStates().slice(0, 17);
    expect(() => verifyStateCount(drifted)).toThrow(
      /State count drift detected: expected 18, got 17/
    );
  });

  test('should detect state count drift above canonical count', () => {
    const drifted = [...getAllStates(), 'EXTRA_STATE' as never];
    expect(() => verifyStateCount(drifted)).toThrow(
      /expected 18, got 19/
    );
  });

  test('should accept exactly the canonical 18 states', () => {
    expect(() => verifyStateCount(getAllStates())).not.toThrow();
  });
});
