/**
 * Structured orchestration logging tests (Section S).
 *
 * Asserts that one orchestration run emits the required debugging surface
 * through the repository's existing Logger singleton — no second logging
 * infrastructure is created and no log transport is reconfigured.
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 */

import { ArtifactRepository } from '../../artifacts/ArtifactRepository';
import { logger } from '../../logging/Logger';
import { Orchestrator } from '../../orchestrator/Orchestrator';
import {
  AllPassValidationContext,
  bootstrapResearchProject,
  makeWorkspaceRoot,
  removeWorkspaceRoot
} from './helpers';

interface CapturedCall {
  message: string;
  meta: Record<string, unknown>;
}

describe('Orchestration structured logging (M2.4)', () => {
  const projectId = 'log-proj';
  let workspaceRoot: string;
  let captured: CapturedCall[];
  let infoSpy: jest.SpyInstance;

  beforeAll(() => {
    infoSpy = jest.spyOn(logger, 'info').mockImplementation((message, context) => {
      captured.push({
        message,
        meta: (context ?? {}) as Record<string, unknown>
      });
    });
  });

  afterAll(() => {
    infoSpy.mockRestore();
  });

  beforeEach(async () => {
    captured = [];
    workspaceRoot = makeWorkspaceRoot('log');
    await bootstrapResearchProject(workspaceRoot, projectId);
    const repo = new ArtifactRepository(workspaceRoot);

    const orchestrator = new Orchestrator({
      workspaceRoot,
      validationContext: new AllPassValidationContext()
    });
    await orchestrator.run(projectId);
  });

  afterEach(async () => {
    await removeWorkspaceRoot(workspaceRoot);
  });

  function callsFor(message: string): CapturedCall[] {
    return captured.filter(c => c.message === message);
  }

  it('emits the full orchestration phase sequence', () => {
    for (const message of [
      'Orchestration started',
      'Action selected',
      'Input resolution complete',
      'Worker dispatched',
      'Worker completed',
      'Worker output validated',
      'Artifacts persisted',
      'Gate evaluated',
      'Transition requested',
      'Orchestration step completed',
      'Orchestration run finished'
    ]) {
      expect(callsFor(message).length).toBeGreaterThan(0);
    }
  });

  it('carries the correlation identifiers and stage context on the action log', () => {
    const actionSelected = callsFor('Action selected')[0];
    expect(actionSelected.meta['component']).toBe('Orchestrator');
    expect(actionSelected.meta['projectId']).toBe(projectId);
    expect(actionSelected.meta['currentState']).toBe('RESEARCHING');
    expect(actionSelected.meta['actionId']).toBe('RESEARCH_ACTION');
    expect(actionSelected.meta['workerId']).toBe('ResearchWorker');
    expect(actionSelected.meta['workerVersion']).toBe('0.1.0');
    expect(typeof actionSelected.meta['executionId']).toBe('string');
  });

  it('records input versions, output versions, the gate result and the transition', () => {
    // Input versions (empty for the bootstrap research action, but present).
    const inputs = callsFor('Input resolution complete')[0];
    expect(Array.isArray(inputs.meta['inputVersions'])).toBe(true);

    // Output artifact versions with type → version mapping.
    const persisted = callsFor('Artifacts persisted')[0];
    const outputVersions = persisted.meta['outputVersions'] as Record<
      string,
      unknown
    >[];
    expect(outputVersions).toHaveLength(4);
    expect(outputVersions.every(v => typeof v['version'] === 'number')).toBe(true);

    // Gate evaluation outcome.
    const gate = callsFor('Gate evaluated')[0];
    expect(gate.meta['gate']).toBe('RESEARCH_VALIDATION');
    expect(gate.meta['gatePassed']).toBe(true);

    // Transition request with from/to.
    const transition = callsFor('Transition requested')[0];
    expect(transition.meta['from']).toBe('RESEARCHING');
    expect(transition.meta['to']).toBe('RESEARCH_READY');
  });

  it('marks the run outcome and the human stop', () => {
    const finished = callsFor('Orchestration run finished')[0];
    expect(finished.meta['outcome']).toBeUndefined(); // info-level completion
    expect(finished.meta['stopped']).toBe('human-stop');
    expect(finished.meta['finalState']).toBe('RESEARCH_READY');
    expect(finished.meta['projectId']).toBe(projectId);

    const step = callsFor('Orchestration step completed')[0];
    expect(step.meta['gatePassed']).toBe(true);
    expect(step.meta['persistedCount']).toBe(4);
    expect(step.meta['transitionedTo']).toBe('RESEARCH_READY');
  });
});
