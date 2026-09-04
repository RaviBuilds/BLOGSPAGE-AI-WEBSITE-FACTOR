/**
 * Tests for GateRegistry.
 * 
 * Validates that all 6 canonical gates are properly defined.
 */

import { getAllGates, getGate, getGateForTransition } from '../gates/GateRegistry';
import { GateName } from '../gates/GateTypes';
import { State } from '../state/StateMachine';

describe('GateRegistry', () => {
  describe('Gate definitions', () => {
    it('defines all 6 canonical gates', () => {
      const gates = getAllGates();
      
      expect(gates).toHaveLength(6);
      expect(gates.map(g => g.gate)).toContain(GateName.RESEARCH_VALIDATION);
      expect(gates.map(g => g.gate)).toContain(GateName.CREATIVE_DIRECTION_VALIDATION);
      expect(gates.map(g => g.gate)).toContain(GateName.BLUEPRINT_VALIDATION);
      expect(gates.map(g => g.gate)).toContain(GateName.IMPLEMENTATION_VALIDATION);
      expect(gates.map(g => g.gate)).toContain(GateName.CRITIC_VALIDATION);
      expect(gates.map(g => g.gate)).toContain(GateName.FINAL_APPROVAL);
    });

    it('includes canonical source references for each gate', () => {
      const gates = getAllGates();
      
      for (const gate of gates) {
        expect(gate.canonicalSource).toBeTruthy();
        expect(gate.canonicalSource).toContain('quality-gates.md');
      }
    });

    it('defines checks for each gate', () => {
      const gates = getAllGates();
      
      for (const gate of gates) {
        expect(gate.checks).toBeDefined();
        expect(Array.isArray(gate.checks)).toBe(true);
      }
    });
  });

  describe('Gate lookup', () => {
    it('finds gate by name', () => {
      const gate = getGate(GateName.RESEARCH_VALIDATION);
      
      expect(gate).toBeDefined();
      expect(gate?.gate).toBe(GateName.RESEARCH_VALIDATION);
    });

    it('finds gate for RESEARCHING → RESEARCH_READY transition', () => {
      const gate = getGateForTransition(State.RESEARCHING, State.RESEARCH_READY);
      
      expect(gate).toBeDefined();
      expect(gate?.gate).toBe(GateName.RESEARCH_VALIDATION);
    });

    it('returns null for transitions without gates', () => {
      const gate = getGateForTransition(State.NEEDS_CONTENT, State.RESEARCHING);
      
      expect(gate).toBeNull();
    });
  });
});
