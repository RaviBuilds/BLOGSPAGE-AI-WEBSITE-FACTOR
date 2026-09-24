/**
 * ExecutionContext tests — immutability of the frozen snapshot and exact
 * version preservation (Section D).
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 */

import { ArtifactType } from '../../artifacts/ArtifactTypes';
import { State } from '../../state/StateMachine';
import {
  freezeExecutionContext,
  ExecutionContext,
  ResolvedArtifact
} from '../../orchestrator/types';

function makeContext(inputs: ResolvedArtifact[]): ExecutionContext {
  return freezeExecutionContext({
    executionId: 'exec-frozen-1',
    projectId: 'proj-frozen',
    currentState: State.RESEARCHING,
    actionId: 'RESEARCH_ACTION',
    workerId: 'ResearchWorker',
    workerVersion: '0.1.0',
    inputs,
    registryVersions: {},
    expectedOutputs: [ArtifactType.BUSINESS_RESEARCH],
    projectRecord: {
      projectId: 'proj-frozen',
      businessName: 'Frozen Business',
      createdAt: '2026-09-05T00:00:00.000Z',
      workspaceRoot: 'workspace/proj-frozen',
      inputSource: 'input/business-input.yaml',
      factoryVersion: '0.2.0'
    },
    startedAt: '2026-09-05T00:00:01.000Z'
  });
}

describe('ExecutionContext (M2.4)', () => {
  it('preserves the exact resolved input versions and content', () => {
    const document = {
      artifactId: 'resolved-1',
      projectId: 'proj-frozen',
      artifactType: 'BUSINESS_RESEARCH',
      artifactVersion: 3,
      versionStatus: 'CURRENT',
      payloadField: 'value'
    };
    const context = makeContext([
      {
        artifactType: ArtifactType.BUSINESS_RESEARCH,
        version: 3,
        artifactId: 'resolved-1',
        document
      }
    ]);

    expect(context.executionId).toBe('exec-frozen-1');
    expect(context.inputs).toHaveLength(1);
    expect(context.inputs[0].version).toBe(3);
    expect(context.inputs[0].artifactId).toBe('resolved-1');
    expect(context.inputs[0].artifactType).toBe(ArtifactType.BUSINESS_RESEARCH);
    expect(context.inputs[0].document['payloadField']).toBe('value');
  });

  it('freezes the context object, the inputs array, and each resolved artifact', () => {
    const context = makeContext([
      {
        artifactType: ArtifactType.BUSINESS_RESEARCH,
        version: 1,
        artifactId: 'a-1',
        document: { artifactId: 'a-1' }
      }
    ]);

    expect(Object.isFrozen(context)).toBe(true);
    expect(Object.isFrozen(context.inputs)).toBe(true);
    expect(Object.isFrozen(context.inputs[0])).toBe(true);
  });

  it('prevents a worker from mutating the snapshot (strict-mode TypeError)', () => {
    const context = makeContext([
      {
        artifactType: ArtifactType.BUSINESS_RESEARCH,
        version: 1,
        artifactId: 'a-1',
        document: { artifactId: 'a-1' }
      }
    ]);

    expect(() => {
      (context as { executionId: string }).executionId = 'hijacked';
    }).toThrow(TypeError);

    expect(() => {
      (context.inputs as unknown as ResolvedArtifact[]).push({
        artifactType: ArtifactType.BRAND_PROFILE,
        version: 1,
        artifactId: 'smuggled',
        document: {}
      });
    }).toThrow(TypeError);

    expect(() => {
      (context.inputs[0] as { version: number }).version = 99;
    }).toThrow(TypeError);

    // The snapshot survives the mutation attempts unchanged.
    expect(context.executionId).toBe('exec-frozen-1');
    expect(context.inputs).toHaveLength(1);
    expect(context.inputs[0].version).toBe(1);
  });

  it('does not expose repository or filesystem handles to the worker', () => {
    const context = makeContext([]);
    const keys = Object.keys(context);

    expect(keys).not.toContain('repository');
    expect(keys).not.toContain('stateManager');
    expect(keys).not.toContain('workspaceRootHandle');
    expect(keys).not.toContain('fs');
  });
});
