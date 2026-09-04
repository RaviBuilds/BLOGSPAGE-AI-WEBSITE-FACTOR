import { TransitionTable } from '../state/TransitionTable';

describe('TransitionTable', () => {
  let table: TransitionTable;

  beforeEach(() => {
    table = new TransitionTable();
  });

  test('should validate key primary state transitions', () => {
    expect(table.isValidTransition('NEW', 'RESEARCHING')).toBe(true);
    expect(table.isValidTransition('RESEARCHING', 'RESEARCH_READY')).toBe(true);
    expect(table.isValidTransition('RESEARCH_READY', 'CREATIVE_DIRECTION')).toBe(true);
    expect(table.isValidTransition('CREATIVE_DIRECTION', 'BLUEPRINT_READY')).toBe(true);
    expect(table.isValidTransition('BLUEPRINT_READY', 'IMPLEMENTING')).toBe(true);
    expect(table.isValidTransition('IMPLEMENTING', 'BUILD_READY')).toBe(true);
    expect(table.isValidTransition('BUILD_READY', 'CRITIQUING')).toBe(true);
    expect(table.isValidTransition('CRITIQUING', 'APPROVED')).toBe(true);
    expect(table.isValidTransition('APPROVED', 'DELIVERED')).toBe(true);
  });

  test('should reject invalid transitions', () => {
    expect(table.isValidTransition('NEW', 'DELIVERED')).toBe(false);
    expect(table.isValidTransition('REFINING', 'APPROVED')).toBe(false);
    expect(table.isValidTransition('DELIVERED', 'NEW')).toBe(false);
  });

  test('DELIVERED is terminal', () => {
    expect(table.getValidNextStates('DELIVERED')).toHaveLength(0);
  });

  test('should support dynamic returnTarget transitions', () => {
    expect(table.isValidTransition('BLOCKED', 'IMPLEMENTING', 'IMPLEMENTING')).toBe(true);
    expect(table.isValidTransition('NEEDS_CONTENT', 'CRITIQUING', 'CRITIQUING')).toBe(true);
  });

  test('should reject exception state as returnTarget', () => {
    // Exception states cannot be returnTargets
    expect(table.isValidTransition('BLOCKED', 'NEEDS_CONTENT', 'NEEDS_CONTENT')).toBe(false);
    expect(table.isValidTransition('NEEDS_CONTENT', 'BLOCKED', 'BLOCKED')).toBe(false);
    expect(table.isValidTransition('NEEDS_HUMAN_REVIEW', 'NEEDS_ASSETS', 'NEEDS_ASSETS')).toBe(false);
  });

  test('should reject special transition states as returnTarget', () => {
    // RETURN_TO_* states are special and cannot be returnTargets
    expect(table.isValidTransition('BLOCKED', 'RETURN_TO_RESEARCH', 'RETURN_TO_RESEARCH')).toBe(false);
    expect(table.isValidTransition('NEEDS_CONTENT', 'RETURN_TO_BLUEPRINT', 'RETURN_TO_BLUEPRINT')).toBe(false);
  });

  test('should allow primary states as returnTarget (including terminal)', () => {
    // All primary states including DELIVERED can be returnTargets
    // This allows exception recovery to any valid workflow state
    expect(table.isValidTransition('BLOCKED', 'IMPLEMENTING', 'IMPLEMENTING')).toBe(true);
    expect(table.isValidTransition('BLOCKED', 'CRITIQUING', 'CRITIQUING')).toBe(true);
    expect(table.isValidTransition('BLOCKED', 'DELIVERED', 'DELIVERED')).toBe(true);
    expect(table.isValidTransition('NEEDS_CONTENT', 'APPROVED', 'APPROVED')).toBe(true);
  });

  test('should return false for unknown source state', () => {
    // Unknown source states have no entry in the fixed transition table
    expect(table.isValidTransition('NOT_A_STATE', 'RESEARCHING')).toBe(false);
    expect(table.isValidTransition('', 'NEW')).toBe(false);
  });

  test('should return empty valid next states for unknown source state', () => {
    expect(table.getValidNextStates('NOT_A_STATE')).toEqual([]);
    expect(table.getValidNextStates('')).toEqual([]);
  });

  test('should encode 64 fixed rules', () => {
    const states = [
      'NEW', 'RESEARCHING', 'RESEARCH_READY', 'CREATIVE_DIRECTION',
      'BLUEPRINT_READY', 'IMPLEMENTING', 'BUILD_READY', 'CRITIQUING',
      'REFINING', 'APPROVED', 'DELIVERED', 'BLOCKED', 'NEEDS_HUMAN_REVIEW',
      'NEEDS_CONTENT', 'NEEDS_ASSETS', 'NEEDS_CREDENTIALS',
      'RETURN_TO_RESEARCH', 'RETURN_TO_BLUEPRINT'
    ];

    let fixedRuleCount = 0;
    for (const state of states) {
      fixedRuleCount += table.getValidNextStates(state).length;
    }

    expect(fixedRuleCount).toBe(64);
  });
});
