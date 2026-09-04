/**
 * Canonical state enumeration from state-machine.md §2
 * 
 * 11 primary states + 7 exception states = 18 total
 * 
 * Canonical source: 02-CONTROL-PLANE/state-machine.md §2
 * Factory version: 0.2.0
 * 
 * DO NOT MODIFY without corresponding canon change.
 * 
 * NOTE: M1 defines states only. Transition table implemented in M2.
 */
export enum State {
  // Primary states (11)
  NEW = 'NEW',
  RESEARCHING = 'RESEARCHING',
  RESEARCH_READY = 'RESEARCH_READY',
  CREATIVE_DIRECTION = 'CREATIVE_DIRECTION',
  BLUEPRINT_READY = 'BLUEPRINT_READY',
  IMPLEMENTING = 'IMPLEMENTING',
  BUILD_READY = 'BUILD_READY',
  CRITIQUING = 'CRITIQUING',
  REFINING = 'REFINING',
  APPROVED = 'APPROVED',
  DELIVERED = 'DELIVERED',
  
  // Exception states (7)
  NEEDS_CONTENT = 'NEEDS_CONTENT',
  NEEDS_ASSETS = 'NEEDS_ASSETS',
  NEEDS_CREDENTIALS = 'NEEDS_CREDENTIALS',
  BLOCKED = 'BLOCKED',
  NEEDS_HUMAN_REVIEW = 'NEEDS_HUMAN_REVIEW',
  RETURN_TO_RESEARCH = 'RETURN_TO_RESEARCH',
  RETURN_TO_BLUEPRINT = 'RETURN_TO_BLUEPRINT'
}

/**
 * Verify canonical state count.
 * 
 * State machine must have exactly 18 states per state-machine.md §2.
 * This constant serves as a drift detector.
 */
export const CANONICAL_STATE_COUNT = 18;

/**
 * Get all canonical states as array.
 */
export function getAllStates(): State[] {
  return Object.values(State);
}

/**
 * Verify state count matches canon.
 * 
 * @throws Error if state count drifts from canonical 18
 */
export function verifyStateCount(states: State[] = getAllStates()): void {
  const actualCount = states.length;
  if (actualCount !== CANONICAL_STATE_COUNT) {
    throw new Error(
      `State count drift detected: expected ${CANONICAL_STATE_COUNT}, got ${actualCount}. ` +
      `Canon source: state-machine.md §2`
    );
  }
}
