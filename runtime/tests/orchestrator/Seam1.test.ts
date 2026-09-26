/**
 * M2.3-B — Seam 1: the RESEARCHING → RETURN_TO_RESEARCH transition.
 *
 * THE DEFECT THIS TEST CLOSES
 * ---------------------------
 * failure-routing.md §2 maps two problem classes to owning phase "Research" and
 * destination RETURN_TO_RESEARCH:
 *   - "Business understanding problem | Facts wrong, incomplete, or
 *      misclassified | Research | RETURN_TO_RESEARCH"
 *   - "Factual integrity problem | Unverified or fabricated claim presented |
 *      Research | RETURN_TO_RESEARCH"
 * and §5 makes "Is a presented fact wrong, unverified, or fabricated?" the
 * FIRST ordered routing question. state-machine.md §2 gives RETURN_TO_RESEARCH
 * the single valid next state RESEARCHING, and §4 gives RETURN_TO_RESEARCH →
 * RESEARCHING. But before M2.3-B, §4 gave RESEARCHING NO RETURN_TO_* exit, so
 * the only state that can produce a research/factual-integrity failure could
 * not legally reach the one canonical state that repairs it. The research
 * correction loop was inoperable and M2.4 was forced to refuse the canonical
 * recommendation as ILLEGAL_TRANSITION (recorded as a canonical-seam finding in
 * ResearchVerticalSlice.test.ts / Orchestrator.test.ts before this change).
 *
 * WHAT WAS CHANGED (and what was not)
 * -----------------------------------
 * Exactly one edge was added, in the canonical doc and its implementation
 * projection together:
 *   - 02-CONTROL-PLANE/state-machine.md §2 (RESEARCHING "Valid next states")
 *     and §4 (transition table row for RESEARCHING)
 *   - runtime/state/TransitionTable.ts buildFixedTransitions()
 * No state was added, no state removed, no other row touched. This test proves
 * BOTH halves: the new edge exists, and every other rule is equal to what the
 * canonical table says.
 *
 * M2.3-B Milestone: Seam 1, gate condition contracts, human approval/resume.
 * Factory version: 0.2.0
 */

import * as fs from 'fs';
import * as path from 'path';
import { State, getAllStates } from '../../state/StateMachine';
import { TransitionTable } from '../../state/TransitionTable';

/**
 * Locate a repository-root directory by walking upward from this file's
 * directory. Mirrors SchemaValidator.locateSchemaRoot()'s deliberate
 * upward-walk (robust to ts-node vs compiled layout) instead of hardcoding a
 * segment count.
 */
function locateRepoDir(name: string): string {
  let dir = __dirname;

  for (let i = 0; i < 10; i++) {
    const candidate = path.join(dir, name);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate;
    }

    const parent = path.dirname(dir);
    if (parent === dir) {
      break; // reached filesystem root
    }
    dir = parent;
  }

  throw new Error(`Could not locate ${name} directory by walking upward from ${__dirname}`);
}

/**
 * Parse state-machine.md §4 (the transition table) into FROM → [TO...].
 *
 * §4 is sliced between its heading and §5 so the §2 per-state "Valid next
 * states" rows cannot be mistaken for table rows. Two non-state tokens appear
 * in the To column and are dropped here:
 *   - "terminal"              (DELIVERED)
 *   - "recorded return state" (the dynamic returnTarget rule)
 * The second is why the comparison below is against the table's FIXED rules
 * only; the dynamic rule is asserted separately.
 */
function parseCanonicalTransitionTable(): Map<string, string[]> {
  const docPath = path.join(locateRepoDir('02-CONTROL-PLANE'), 'state-machine.md');
  const doc = fs.readFileSync(docPath, 'utf-8');

  const start = doc.indexOf('## 4. Transition Table');
  if (start === -1) {
    throw new Error('state-machine.md §4 heading not found');
  }
  const end = doc.indexOf('## 5. Invariants', start);
  if (end === -1) {
    throw new Error('state-machine.md §5 heading not found');
  }
  const section = doc.slice(start, end);

  const table = new Map<string, string[]>();

  for (const line of section.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) {
      continue;
    }

    const cells = trimmed
      .split('|')
      .slice(1, -1)
      .map(cell => cell.trim());

    if (cells.length !== 2) {
      continue; // separator row or malformed
    }

    const [from, to] = cells;
    if (from === 'From' || from.startsWith('---') || from.length === 0) {
      continue; // header or separator
    }

    const targets = to
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0 && t !== 'terminal' && t !== 'recorded return state');

    table.set(from, targets);
  }

  return table;
}

const sorted = (values: string[]): string[] => [...values].sort();

describe('Seam 1 — RESEARCHING → RETURN_TO_RESEARCH (M2.3-B)', () => {
  let table: TransitionTable;
  let canonical: Map<string, string[]>;

  beforeAll(() => {
    table = new TransitionTable();
    canonical = parseCanonicalTransitionTable();
  });

  describe('the new edge exists', () => {
    it('declares RESEARCHING → RETURN_TO_RESEARCH legal', () => {
      expect(table.isValidTransition(State.RESEARCHING, State.RETURN_TO_RESEARCH)).toBe(true);
    });

    it('keeps RETURN_TO_RESEARCH → RESEARCHING legal (the repair loop closes)', () => {
      expect(table.isValidTransition(State.RETURN_TO_RESEARCH, State.RESEARCHING)).toBe(true);
    });

    it('gives RESEARCHING exactly the documented next states', () => {
      expect(sorted(table.getValidNextStates(State.RESEARCHING))).toEqual(
        sorted([
          'RESEARCH_READY',
          'RETURN_TO_RESEARCH',
          'NEEDS_CONTENT',
          'NEEDS_ASSETS',
          'NEEDS_CREDENTIALS',
          'NEEDS_HUMAN_REVIEW',
          'BLOCKED'
        ])
      );
    });

    it('states so in state-machine.md §4', () => {
      expect(canonical.get('RESEARCHING')).toContain('RETURN_TO_RESEARCH');
    });
  });

  describe('nothing else was loosened', () => {
    // Negative controls: this edge must not have opened any other route out of
    // RESEARCHING. Each of these is illegal canonically and must stay illegal.
    it.each([
      ['DELIVERED'],
      ['APPROVED'],
      ['IMPLEMENTING'],
      ['CRITIQUING'],
      ['REFINING'],
      ['BLUEPRINT_READY'],
      ['CREATIVE_DIRECTION'],
      ['RETURN_TO_BLUEPRINT']
    ])('still refuses RESEARCHING → %s', target => {
      expect(table.isValidTransition(State.RESEARCHING, target)).toBe(false);
      expect(canonical.get('RESEARCHING')).not.toContain(target);
    });

    it('still refuses RETURN_TO_RESEARCH → anything except RESEARCHING', () => {
      for (const state of getAllStates()) {
        if (state === 'RESEARCHING') {
          continue;
        }
        expect(table.isValidTransition(State.RETURN_TO_RESEARCH, state)).toBe(false);
      }
      expect(sorted(table.getValidNextStates(State.RETURN_TO_RESEARCH))).toEqual(['RESEARCHING']);
    });
  });

  describe('canon/implementation drift guard (every row)', () => {
    it('covers exactly the 18 canonical states', () => {
      expect(canonical.size).toBe(getAllStates().length);
      expect(sorted([...canonical.keys()])).toEqual(sorted(getAllStates()));
    });

    it('matches state-machine.md §4 for every state fixed transitions', () => {
      // The regression guard for "no other route changed": the implementation's
      // fixed adjacency must equal the canonical table exactly, for every row.
      // A stray extra/missing edge in ANY row fails here with that row named.
      const mismatches: string[] = [];

      for (const [from, expected] of canonical.entries()) {
        const actual = table.getValidNextStates(from);
        if (JSON.stringify(sorted(actual)) !== JSON.stringify(sorted(expected))) {
          mismatches.push(
            `${from}: table=[${sorted(actual).join(', ')}] doc=[${sorted(expected).join(', ')}]`
          );
        }
      }

      expect(mismatches).toEqual([]);
    });
  });

  describe('dynamic returnTarget behaviour is unchanged', () => {
    it('still treats exactly the five exception states as dynamic', () => {
      for (const state of [
        'BLOCKED',
        'NEEDS_HUMAN_REVIEW',
        'NEEDS_CONTENT',
        'NEEDS_ASSETS',
        'NEEDS_CREDENTIALS'
      ]) {
        expect(table.isDynamicReturnState(state)).toBe(true);
      }

      // RETURN_TO_RESEARCH is a fixed state, NOT a dynamic return state: its
      // only exit is the single fixed rule asserted above.
      expect(table.isDynamicReturnState(State.RETURN_TO_RESEARCH)).toBe(false);
      expect(table.isDynamicReturnState(State.RESEARCHING)).toBe(false);
    });

    it('still requires a returnTarget to be a primary state', () => {
      expect(table.isValidReturnTarget('RESEARCHING')).toBe(true);
      expect(table.isValidReturnTarget('RESEARCH_READY')).toBe(true);
      // Exception states are not valid return targets (M2.1 contract).
      expect(table.isValidReturnTarget('RETURN_TO_RESEARCH')).toBe(false);
      expect(table.isValidReturnTarget('NEEDS_CONTENT')).toBe(false);
      expect(table.isValidReturnTarget('BLOCKED')).toBe(false);
    });
  });
});