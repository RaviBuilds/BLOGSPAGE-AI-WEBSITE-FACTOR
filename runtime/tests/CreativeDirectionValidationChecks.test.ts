/**
 * Tests for Creative Direction Validation (Gate 2).
 *
 * Validates the explicit gate checks implemented from
 * 02-CONTROL-PLANE/quality-gates.md §4 and their wiring in GateRegistry.
 *
 * Canonical facts under test:
 * - §2 register row 2: Gate 2 evaluates the Creative Direction artifact
 *   WITHIN CREATIVE_DIRECTION (source === destination, NOT a state transition).
 * - §4.1: nine "must be true" requirements → nine explicit checks.
 * - §4.2: four blocking conditions, enforced through the corresponding
 *   §4.1 checks.
 * - §4.3 + failure-routing.md §3: problem classes and routes.
 */

import { getCreativeDirectionValidationChecks } from '../gates/checks/CreativeDirectionValidationChecks';
import { getAllGates, getGate, getGateForTransition } from '../gates/GateRegistry';
import { GateEvaluator } from '../gates/GateEvaluator';
import { GateName, ProblemClass, ArtifactType } from '../gates/GateTypes';
import { ValidationContext } from '../gates/ValidationContext';
import { State } from '../state/StateMachine';
import { MockValidationContext } from './MockValidationContext';

/**
 * Context answering true for every artifact and condition EXCEPT conditions
 * whose satisfaction is the ABSENCE of something (inverse-logic checks).
 * Research Validation's 'fabricated_fact_present' is such a condition: the
 * check passes when it is false. Setting it false lets every gate pass.
 */
class AllPassingValidationContext implements ValidationContext {
  async hasArtifact(): Promise<boolean> {
    return true;
  }

  async checkCondition(_projectId: string, condition: string): Promise<boolean> {
    return condition !== 'fabricated_fact_present';
  }
}

/**
 * Context making every registered check fail: false for positive conditions,
 * true for inverse-logic conditions (whose check fails when the condition is
 * true, e.g. 'fabricated_fact_present').
 */
class AllFailingValidationContext implements ValidationContext {
  async hasArtifact(): Promise<boolean> {
    return false;
  }

  async checkCondition(_projectId: string, condition: string): Promise<boolean> {
    return condition === 'fabricated_fact_present';
  }
}

/**
 * Recording context that captures every queried condition, so tests can
 * prove each check performs a real evaluation query.
 */
class RecordingValidationContext implements ValidationContext {
  readonly queriedConditions = new Set<string>();

  async hasArtifact(): Promise<boolean> {
    return true;
  }

  async checkCondition(_projectId: string, condition: string): Promise<boolean> {
    this.queriedConditions.add(condition);
    return true;
  }
}

/**
 * Context whose condition queries throw. Used to verify that check
 * evaluation errors are surfaced as blocking failures (GateEvaluator
 * evaluateChecks catch branch). Artifact queries succeed so the failure
 * set isolates the error path of the registered checks.
 */
class ThrowingValidationContext implements ValidationContext {
  async hasArtifact(): Promise<boolean> {
    return true;
  }

  async checkCondition(): Promise<boolean> {
    throw new Error('context failure');
  }
}

describe('CreativeDirectionValidationChecks (quality-gates.md §4)', () => {
  const checks = getCreativeDirectionValidationChecks();

  describe('Canonical check structure (§4.1)', () => {
    it('implements exactly nine checks, one per §4.1 requirement', () => {
      expect(checks).toHaveLength(9);
    });

    it('uses stable, unique check IDs', () => {
      const ids = checks.map(c => c.id);
      expect(new Set(ids).size).toBe(checks.length);
      for (const id of ids) {
        expect(id).toMatch(/^creative_|^design_/);
      }
    });

    it('carries a traceable canonical source for every check', () => {
      for (const check of checks) {
        expect(check.canonicalSource).toContain('quality-gates.md §4.1');
      }
    });

    it('provides a human-readable name and description for every check', () => {
      for (const check of checks) {
        expect(check.name.length).toBeGreaterThan(0);
        expect(check.description.length).toBeGreaterThan(0);
      }
    });

    it('classifies every check with a canonical problem class', () => {
      for (const check of checks) {
        expect(Object.values(ProblemClass)).toContain(check.problemClass);
      }
    });

    it('marks checks blocking per §4.2 and completes the §4.1 requirements', () => {
      const blockingIds = checks.filter(c => c.blocking).map(c => c.id).sort();
      expect(blockingIds).toEqual([
        'creative_asset_inventory_respected',
        'creative_decisions_traceable',
        'creative_design_intent_statement_present',
        'creative_direction_business_specific',
        'creative_intent_precedes_selection',
        'creative_no_facts_outside_intelligence',
        'creative_verified_facts_unaltered'
      ]);
      expect(checks.filter(c => !c.blocking).map(c => c.id).sort()).toEqual([
        'creative_industry_heuristic_only',
        'creative_input_versions_recorded'
      ]);
    });
  });

  describe('Per-check evaluation', () => {
    // Each check queries the condition identified by its own stable ID.
    it.each(checks.map(c => [c.id, c] as const))(
      '%s passes when its canonical requirement is satisfied',
      async (_id, check) => {
        const context = new MockValidationContext();
        context.setCondition('p1', check.id, true);
        const result = await check.evaluate('p1', context);
        expect(result.passed).toBe(true);
        expect(result.reason).toBeUndefined();
      }
    );

    it.each(checks.map(c => [c.id, c] as const))(
      '%s fails with a human-readable reason when its requirement is unmet',
      async (_id, check) => {
        const context = new MockValidationContext(); // all conditions default false
        const result = await check.evaluate('p1', context);
        expect(result.passed).toBe(false);
        expect(result.reason).toBeTruthy();
        expect(typeof result.reason).toBe('string');
      }
    );
  });
});

describe('Gate 2 wiring in GateRegistry (quality-gates.md §2, §4)', () => {
  it('registers CREATIVE_DIRECTION_VALIDATION within CREATIVE_DIRECTION — not a state transition', () => {
    const gate = getGate(GateName.CREATIVE_DIRECTION_VALIDATION);
    expect(gate).toBeDefined();
    expect(gate!.sourceState).toBe(State.CREATIVE_DIRECTION);
    expect(gate!.destinationState).toBe(State.CREATIVE_DIRECTION);
    expect(gate!.owner).toBe('CONTROL_PLANE');
    expect(gate!.canonicalSource).toBe('quality-gates.md §4');
  });

  it('requires the Creative Direction artifact (§4 Evaluates)', () => {
    const gate = getGate(GateName.CREATIVE_DIRECTION_VALIDATION);
    expect(gate!.requiredArtifacts).toEqual([ArtifactType.CREATIVE_DIRECTION]);
  });

  it('wires the nine §4.1 checks into the registry', () => {
    const gate = getGate(GateName.CREATIVE_DIRECTION_VALIDATION);
    expect(gate!.checks).toHaveLength(9);
  });

  it('has no human approval gate after Gate 2 (human gates follow §2 row mapping)', () => {
    const gate = getGate(GateName.CREATIVE_DIRECTION_VALIDATION);
    expect(gate!.requiresHumanApprovalAfter).toBe(false);
    expect(gate!.humanGateAfter).toBeUndefined();
  });

  it('is resolvable via getGateForTransition within CREATIVE_DIRECTION only', () => {
    expect(getGateForTransition(State.CREATIVE_DIRECTION, State.CREATIVE_DIRECTION)?.gate)
      .toBe(GateName.CREATIVE_DIRECTION_VALIDATION);
    // Gate 2 must not govern the CREATIVE_DIRECTION → BLUEPRINT_READY
    // transition; that is Gate 3 (Blueprint Validation, quality-gates.md §5).
    expect(getGateForTransition(State.CREATIVE_DIRECTION, State.BLUEPRINT_READY)?.gate)
      .toBe(GateName.BLUEPRINT_VALIDATION);
  });
});

describe('Gate 2 evaluation via GateEvaluator', () => {
  let context: MockValidationContext;
  let evaluator: GateEvaluator;
  const projectId = 'gate2-project';

  beforeEach(() => {
    context = new MockValidationContext();
    evaluator = new GateEvaluator(context);
  });

  function setPassingDirection(withArtifact = true): void {
    context.setArtifact(projectId, ArtifactType.CREATIVE_DIRECTION, withArtifact);
    for (const check of getCreativeDirectionValidationChecks()) {
      context.setCondition(projectId, check.id, true);
    }
  }

  it('passes when the artifact exists and all nine §4.1 requirements hold', async () => {
    setPassingDirection();
    const result = await evaluator.evaluateGate(
      projectId,
      GateName.CREATIVE_DIRECTION_VALIDATION,
      State.CREATIVE_DIRECTION
    );
    expect(result.passed).toBe(true);
    expect(result.gate).toBe(GateName.CREATIVE_DIRECTION_VALIDATION);
    expect(result.failures).toHaveLength(0);
    expect(result.gateOwner).toBe('CONTROL_PLANE');
  });

  it('fails with all nine check failures plus the artifact failure when nothing is provided', async () => {
    const result = await evaluator.evaluateGate(
      projectId,
      GateName.CREATIVE_DIRECTION_VALIDATION,
      State.CREATIVE_DIRECTION
    );
    expect(result.passed).toBe(false);
    // 1 required-artifact failure + 9 check failures
    expect(result.failures).toHaveLength(10);
    const checkIds = result.failures.map(f => f.checkId);
    for (const check of getCreativeDirectionValidationChecks()) {
      expect(checkIds).toContain(check.id);
    }
    // Dominant class comes from the first blocking §4.1 failure
    // (creative_intent_precedes_selection → §4.2 "no articulated intent").
    expect(result.problemClass).toBe(ProblemClass.CREATIVE_STRATEGY_PROBLEM);
    expect(result.recommendedRoute).toBe(State.RETURN_TO_BLUEPRINT);
  });

  it('routes unmet asset reality to NEEDS_ASSETS per §4.3', async () => {
    setPassingDirection();
    context.setCondition(projectId, 'creative_asset_inventory_respected', false);
    const result = await evaluator.evaluateGate(
      projectId,
      GateName.CREATIVE_DIRECTION_VALIDATION,
      State.CREATIVE_DIRECTION
    );
    expect(result.passed).toBe(false);
    expect(result.problemClass).toBe(ProblemClass.ASSET_PROBLEM);
    expect(result.recommendedRoute).toBe(State.NEEDS_ASSETS);
  });

  it('routes fabricated/unverified facts to RETURN_TO_RESEARCH per §4.2 and §4.3', async () => {
    setPassingDirection();
    context.setCondition(projectId, 'creative_no_facts_outside_intelligence', false);
    const result = await evaluator.evaluateGate(
      projectId,
      GateName.CREATIVE_DIRECTION_VALIDATION,
      State.CREATIVE_DIRECTION
    );
    expect(result.passed).toBe(false);
    expect(result.problemClass).toBe(ProblemClass.FACTUAL_INTEGRITY_PROBLEM);
    expect(result.recommendedRoute).toBe(State.RETURN_TO_RESEARCH);
  });

  it('routes ungrounded direction to RETURN_TO_RESEARCH per §4.3', async () => {
    setPassingDirection();
    context.setCondition(projectId, 'creative_decisions_traceable', false);
    const result = await evaluator.evaluateGate(
      projectId,
      GateName.CREATIVE_DIRECTION_VALIDATION,
      State.CREATIVE_DIRECTION
    );
    expect(result.passed).toBe(false);
    expect(result.problemClass).toBe(ProblemClass.BUSINESS_UNDERSTANDING_PROBLEM);
    expect(result.recommendedRoute).toBe(State.RETURN_TO_RESEARCH);
  });

  it('routes an artifact-only failure as UNCLEAR to NEEDS_HUMAN_REVIEW (failure-routing.md §1 rule 6)', async () => {
    // Artifact missing but every check condition true: the only failure is
    // the artifact-existence failure, which carries no problem class, so the
    // dominant classification is UNCLEAR → NEEDS_HUMAN_REVIEW.
    setPassingDirection(false);
    const result = await evaluator.evaluateGate(
      projectId,
      GateName.CREATIVE_DIRECTION_VALIDATION,
      State.CREATIVE_DIRECTION
    );
    expect(result.passed).toBe(false);
    expect(result.failures).toHaveLength(1);
    expect(result.problemClass).toBe(ProblemClass.UNCLEAR);
    expect(result.recommendedRoute).toBe(State.NEEDS_HUMAN_REVIEW);
  });

  it('reports check evaluation errors as blocking failures', async () => {
    const throwingEvaluator = new GateEvaluator(new ThrowingValidationContext());
    const result = await throwingEvaluator.evaluateGate(
      projectId,
      GateName.CREATIVE_DIRECTION_VALIDATION,
      State.CREATIVE_DIRECTION
    );
    expect(result.passed).toBe(false);
    expect(result.failures).toHaveLength(9);
    for (const failure of result.failures) {
      expect(failure.blocking).toBe(true);
      expect(failure.reason).toContain('Check evaluation error');
    }
  });

  it('evaluates Gate 2 through evaluateTransition within CREATIVE_DIRECTION', async () => {
    setPassingDirection();
    const result = await evaluator.evaluateTransition(
      projectId,
      State.CREATIVE_DIRECTION,
      State.CREATIVE_DIRECTION
    );
    expect(result.passed).toBe(true);
    expect(result.gate).toBe(GateName.CREATIVE_DIRECTION_VALIDATION);
  });
});

describe('Canonical check-count audit across all six gates', () => {
  it('registers the canonical per-gate check counts', () => {
    const gates = getAllGates();
    const counts: Record<string, number> = {};
    for (const gate of gates) {
      counts[gate.gate] = gate.checks.length;
    }
    expect(counts).toEqual({
      [GateName.RESEARCH_VALIDATION]: 4,            // quality-gates.md §3
      [GateName.CREATIVE_DIRECTION_VALIDATION]: 9,  // quality-gates.md §4
      [GateName.BLUEPRINT_VALIDATION]: 3,           // quality-gates.md §5
      [GateName.IMPLEMENTATION_VALIDATION]: 3,      // quality-gates.md §6
      [GateName.CRITIC_VALIDATION]: 3,              // quality-gates.md §7
      [GateName.FINAL_APPROVAL]: 2                  // quality-gates.md §8
    });
  });

  it('registers 24 checks in total, all with unique IDs', () => {
    const allChecks = getAllGates().flatMap(g => g.checks);
    expect(allChecks).toHaveLength(24);
    const ids = allChecks.map(c => c.id);
    expect(new Set(ids).size).toBe(24);
  });

  it('actually evaluates every registered check of every gate', async () => {
    // Every check must pass through a real context evaluation and return a
    // defined pass/fail verdict. Each check queries the condition identified
    // by its own stable ID (single-condition checks) — verified via the
    // recording context.
    for (const gate of getAllGates()) {
      for (const check of gate.checks) {
        const recording = new RecordingValidationContext();
        const outcome = await check.evaluate('audit-project', recording);
        expect(typeof outcome.passed).toBe('boolean');
        expect(recording.queriedConditions.size).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('surfaces a distinct failure for every registered check of every gate', async () => {
    // All-failing context: every registered check must produce exactly one
    // failure carrying its own stable ID (proves GateEvaluator evaluates
    // every check of every gate).
    const evaluator = new GateEvaluator(new AllFailingValidationContext());
    for (const gate of getAllGates()) {
      const result = await evaluator.evaluateGate('audit-project', gate.gate, gate.sourceState);
      expect(result.passed).toBe(false);
      const checkIds = result.failures.map(f => f.checkId);
      for (const check of gate.checks) {
        expect(checkIds).toContain(check.id);
      }
    }
  });

  it('passes every gate when every canonical requirement is satisfied', async () => {
    // All-passing context: every gate must pass with zero failures. The
    // inverse-logic research condition ('fabricated_fact_present') is held
    // false so the no-fabrication check passes.
    const evaluator = new GateEvaluator(new AllPassingValidationContext());
    for (const gate of getAllGates()) {
      const result = await evaluator.evaluateGate('audit-project', gate.gate, gate.sourceState);
      expect(result.passed).toBe(true);
      expect(result.failures).toHaveLength(0);
    }
  });
});