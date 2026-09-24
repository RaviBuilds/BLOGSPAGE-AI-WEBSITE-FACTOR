/**
 * StageRegistry tests — the state → action data mapping.
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 */

import { State } from '../../state/StateMachine';
import { ArtifactType } from '../../artifacts/ArtifactTypes';
import { GateName } from '../../gates/GateTypes';
import {
  RESEARCH_ACTION,
  StageRegistry
} from '../../orchestrator/StageRegistry';
import { ActionDefinition } from '../../orchestrator/types';

describe('StageRegistry (M2.4)', () => {
  it('maps RESEARCHING to the research vertical-slice action', () => {
    const registry = new StageRegistry();
    const action = registry.getActionForState(State.RESEARCHING);

    expect(action).not.toBeNull();
    expect(action!.actionId).toBe('RESEARCH_ACTION');
    expect(action).toBe(RESEARCH_ACTION);
    expect(action!.workerId).toBe('ResearchWorker');
    expect(action!.workerVersion).toBe('0.1.0');
    expect(action!.requiredInputs).toEqual([]);
    expect(action!.expectedOutputs).toEqual([
      ArtifactType.BUSINESS_RESEARCH,
      ArtifactType.BUSINESS_INTELLIGENCE,
      ArtifactType.ASSET_INVENTORY,
      ArtifactType.BRAND_PROFILE
    ]);
    expect(action!.gateAfterAction).toBe(GateName.RESEARCH_VALIDATION);
    expect(action!.transitionOnSuccess).toEqual({ to: State.RESEARCH_READY });
    expect(action!.requiresProjectInput).toBe(true);
  });

  it('has exactly one registered action — the research slice, nothing speculative', () => {
    const registry = new StageRegistry();
    const all = registry.getAllActions();

    expect(all).toHaveLength(1);
    expect(all[0].actionId).toBe('RESEARCH_ACTION');
  });

  it('returns null for every state without a registered action', () => {
    const registry = new StageRegistry();
    expect(registry.getActionForState(State.NEW)).toBeNull();
    expect(registry.getActionForState(State.RESEARCH_READY)).toBeNull();
    expect(registry.getActionForState(State.CREATIVE_DIRECTION)).toBeNull();
    expect(registry.getActionForState(State.BLUEPRINT_READY)).toBeNull();
    expect(registry.getActionForState(State.IMPLEMENTING)).toBeNull();
    expect(registry.getActionForState(State.DELIVERED)).toBeNull();
    expect(registry.getActionForState(State.NEEDS_HUMAN_REVIEW)).toBeNull();
    expect(registry.getActionForState(State.NEEDS_CONTENT)).toBeNull();
    expect(registry.getActionForState(State.RETURN_TO_RESEARCH)).toBeNull();
    expect(registry.getActionForState(State.RETURN_TO_BLUEPRINT)).toBeNull();
  });

  it('rejects two actions claiming the same state', () => {
    const intruder: ActionDefinition = {
      ...RESEARCH_ACTION,
      actionId: 'INTRUDER'
    };

    expect(() => new StageRegistry([RESEARCH_ACTION, intruder])).toThrow(
      /already mapped/
    );
  });
});
