/**
 * Transition table - encodes 69 canonical transition rules.
 * 
 * Source: state-machine.md §4
 * - 64 fixed/static rules
 * - 5 dynamic returnTarget rules
 * - 69 total canonical rules
 * 
 * This table is an implementation projection of canonical state-machine.md.
 * Any drift from the source is a bug.
 */
export class TransitionTable {
  private readonly fixedTransitions: Map<string, Set<string>>;
  
  /**
   * Primary (non-exception) states that can be returnTargets.
   * 
   * Exception states cannot be returnTargets per M2.1 contract.
   */
  private readonly PRIMARY_STATES = [
    'NEW',
    'RESEARCHING',
    'RESEARCH_READY',
    'CREATIVE_DIRECTION',
    'BLUEPRINT_READY',
    'IMPLEMENTING',
    'BUILD_READY',
    'CRITIQUING',
    'REFINING',
    'APPROVED',
    'DELIVERED'
  ];

  constructor() {
    this.fixedTransitions = this.buildFixedTransitions();
  }

  /**
   * Check if transition from -> to is valid.
   * 
   * @param from Source state
   * @param to Target state
   * @param returnTarget Optional return target for exception states
   */
  isValidTransition(from: string, to: string, returnTarget?: string): boolean {
    // Handle dynamic returnTarget rules
    if (this.isDynamicReturnState(from)) {
      if (returnTarget && to === returnTarget) {
        // Validate returnTarget is a primary state (not an exception state)
        if (!this.isValidReturnTarget(returnTarget)) {
          return false;
        }
        return true;
      }
    }

    // Check fixed transitions
    const validNextStates = this.fixedTransitions.get(from);
    return validNextStates ? validNextStates.has(to) : false;
  }

  /**
   * Get valid next states for given state.
   */
  getValidNextStates(from: string): string[] {
    const validStates = this.fixedTransitions.get(from);
    return validStates ? Array.from(validStates) : [];
  }

  /**
   * Check if state has dynamic returnTarget behavior.
   * 
   * 5 dynamic states:
   * - BLOCKED
   * - NEEDS_HUMAN_REVIEW
   * - NEEDS_CONTENT
   * - NEEDS_ASSETS
   * - NEEDS_CREDENTIALS
   */
  isDynamicReturnState(state: string): boolean {
    return [
      'BLOCKED',
      'NEEDS_HUMAN_REVIEW',
      'NEEDS_CONTENT',
      'NEEDS_ASSETS',
      'NEEDS_CREDENTIALS'
    ].includes(state);
  }

  /**
   * Check if a state is a valid returnTarget (primary state).
   * 
   * Exception states cannot be returnTargets.
   */
  isValidReturnTarget(returnTarget: string): boolean {
    return this.PRIMARY_STATES.includes(returnTarget);
  }

  /**
   * Build fixed transition adjacency map.
   * 
   * Encoding of 64 static rules from state-machine.md §4.
   */
  private buildFixedTransitions(): Map<string, Set<string>> {
    const transitions = new Map<string, Set<string>>();

    // Helper to add transition
    const add = (from: string, ...toStates: string[]) => {
      if (!transitions.has(from)) {
        transitions.set(from, new Set());
      }
      toStates.forEach(to => transitions.get(from)!.add(to));
    };

    // NEW → RESEARCHING, NEEDS_CONTENT, NEEDS_ASSETS, NEEDS_CREDENTIALS, BLOCKED
    add('NEW', 'RESEARCHING', 'NEEDS_CONTENT', 'NEEDS_ASSETS', 'NEEDS_CREDENTIALS', 'BLOCKED');

    // RESEARCHING → RESEARCH_READY, NEEDS_CONTENT, NEEDS_ASSETS, NEEDS_CREDENTIALS, NEEDS_HUMAN_REVIEW, BLOCKED
    add('RESEARCHING', 'RESEARCH_READY', 'NEEDS_CONTENT', 'NEEDS_ASSETS', 'NEEDS_CREDENTIALS', 'NEEDS_HUMAN_REVIEW', 'BLOCKED');

    // RESEARCH_READY → CREATIVE_DIRECTION, RETURN_TO_RESEARCH, NEEDS_HUMAN_REVIEW, BLOCKED
    add('RESEARCH_READY', 'CREATIVE_DIRECTION', 'RETURN_TO_RESEARCH', 'NEEDS_HUMAN_REVIEW', 'BLOCKED');

    // CREATIVE_DIRECTION → BLUEPRINT_READY, RETURN_TO_RESEARCH, NEEDS_ASSETS, NEEDS_HUMAN_REVIEW, BLOCKED
    add('CREATIVE_DIRECTION', 'BLUEPRINT_READY', 'RETURN_TO_RESEARCH', 'NEEDS_ASSETS', 'NEEDS_HUMAN_REVIEW', 'BLOCKED');

    // BLUEPRINT_READY → IMPLEMENTING, RETURN_TO_BLUEPRINT, RETURN_TO_RESEARCH, NEEDS_HUMAN_REVIEW, BLOCKED
    add('BLUEPRINT_READY', 'IMPLEMENTING', 'RETURN_TO_BLUEPRINT', 'RETURN_TO_RESEARCH', 'NEEDS_HUMAN_REVIEW', 'BLOCKED');

    // IMPLEMENTING → BUILD_READY, RETURN_TO_BLUEPRINT, NEEDS_CONTENT, NEEDS_ASSETS, NEEDS_HUMAN_REVIEW, BLOCKED
    add('IMPLEMENTING', 'BUILD_READY', 'RETURN_TO_BLUEPRINT', 'NEEDS_CONTENT', 'NEEDS_ASSETS', 'NEEDS_HUMAN_REVIEW', 'BLOCKED');

    // BUILD_READY → CRITIQUING, RETURN_TO_BLUEPRINT, BLOCKED
    add('BUILD_READY', 'CRITIQUING', 'RETURN_TO_BLUEPRINT', 'BLOCKED');

    // CRITIQUING → APPROVED, REFINING, RETURN_TO_BLUEPRINT, RETURN_TO_RESEARCH, NEEDS_ASSETS, NEEDS_CONTENT, NEEDS_HUMAN_REVIEW, BLOCKED
    add('CRITIQUING', 'APPROVED', 'REFINING', 'RETURN_TO_BLUEPRINT', 'RETURN_TO_RESEARCH', 'NEEDS_ASSETS', 'NEEDS_CONTENT', 'NEEDS_HUMAN_REVIEW', 'BLOCKED');

    // REFINING → CRITIQUING, RETURN_TO_BLUEPRINT, RETURN_TO_RESEARCH, NEEDS_HUMAN_REVIEW, BLOCKED
    add('REFINING', 'CRITIQUING', 'RETURN_TO_BLUEPRINT', 'RETURN_TO_RESEARCH', 'NEEDS_HUMAN_REVIEW', 'BLOCKED');

    // APPROVED → DELIVERED, REFINING, RETURN_TO_BLUEPRINT, RETURN_TO_RESEARCH
    add('APPROVED', 'DELIVERED', 'REFINING', 'RETURN_TO_BLUEPRINT', 'RETURN_TO_RESEARCH');

    // DELIVERED → (terminal state, no transitions)
    add('DELIVERED'); // Empty set

    // Exception states with fixed transitions
    // BLOCKED → recorded return state, NEEDS_HUMAN_REVIEW
    add('BLOCKED', 'NEEDS_HUMAN_REVIEW');

    // NEEDS_HUMAN_REVIEW → recorded return state, RETURN_TO_RESEARCH, RETURN_TO_BLUEPRINT, BLOCKED
    add('NEEDS_HUMAN_REVIEW', 'RETURN_TO_RESEARCH', 'RETURN_TO_BLUEPRINT', 'BLOCKED');

    // NEEDS_CONTENT → RESEARCHING, recorded return state, BLOCKED
    add('NEEDS_CONTENT', 'RESEARCHING', 'BLOCKED');

    // NEEDS_ASSETS → RESEARCHING, CREATIVE_DIRECTION, recorded return state, BLOCKED
    add('NEEDS_ASSETS', 'RESEARCHING', 'CREATIVE_DIRECTION', 'BLOCKED');

    // NEEDS_CREDENTIALS → RESEARCHING, recorded return state, BLOCKED
    add('NEEDS_CREDENTIALS', 'RESEARCHING', 'BLOCKED');

    // RETURN_TO_RESEARCH → RESEARCHING
    add('RETURN_TO_RESEARCH', 'RESEARCHING');

    // RETURN_TO_BLUEPRINT → CREATIVE_DIRECTION
    add('RETURN_TO_BLUEPRINT', 'CREATIVE_DIRECTION');

    return transitions;
  }
}
