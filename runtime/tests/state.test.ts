import { verifyStateCount, getAllStates, CANONICAL_STATE_COUNT } from '../state/StateMachine';

/**
 * State machine tests.
 * 
 * Verifies state enumeration matches canonical state-machine.md §2.
 */
describe('StateMachine', () => {
  test('should have exactly 18 canonical states', () => {
    const states = getAllStates();
    expect(states.length).toBe(CANONICAL_STATE_COUNT);
  });

  test('verifyStateCount should pass without throwing', () => {
    expect(() => verifyStateCount()).not.toThrow();
  });

  test('should include all primary states', () => {
    const states = getAllStates();
    const stateNames = states.map(s => s);
    
    // Primary states (11)
    expect(stateNames).toContain('NEW');
    expect(stateNames).toContain('RESEARCHING');
    expect(stateNames).toContain('RESEARCH_READY');
    expect(stateNames).toContain('CREATIVE_DIRECTION');
    expect(stateNames).toContain('BLUEPRINT_READY');
    expect(stateNames).toContain('IMPLEMENTING');
    expect(stateNames).toContain('BUILD_READY');
    expect(stateNames).toContain('CRITIQUING');
    expect(stateNames).toContain('REFINING');
    expect(stateNames).toContain('APPROVED');
    expect(stateNames).toContain('DELIVERED');
  });

  test('should include all exception states', () => {
    const states = getAllStates();
    const stateNames = states.map(s => s);
    
    // Exception states (7)
    expect(stateNames).toContain('NEEDS_CONTENT');
    expect(stateNames).toContain('NEEDS_ASSETS');
    expect(stateNames).toContain('NEEDS_CREDENTIALS');
    expect(stateNames).toContain('BLOCKED');
    expect(stateNames).toContain('NEEDS_HUMAN_REVIEW');
    expect(stateNames).toContain('RETURN_TO_RESEARCH');
    expect(stateNames).toContain('RETURN_TO_BLUEPRINT');
  });
});
