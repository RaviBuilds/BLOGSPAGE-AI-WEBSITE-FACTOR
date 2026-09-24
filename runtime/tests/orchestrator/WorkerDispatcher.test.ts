/**
 * WorkerDispatcher tests — worker identity resolution (Section C/L).
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 */

import { Worker, WorkerOutput, ExecutionContext } from '../../orchestrator/types';
import { FailureType, OrchestrationError } from '../../orchestrator/types';
import { WorkerDispatcher } from '../../orchestrator/execution/WorkerDispatcher';

class StubWorker implements Worker {
  constructor(
    readonly workerId: string,
    readonly version = '1.0.0'
  ) {}
  async execute(): Promise<WorkerOutput> {
    throw new Error('not used');
  }
}

describe('WorkerDispatcher (M2.4)', () => {
  it('resolves a registered worker by id', () => {
    const worker = new StubWorker('ResearchWorker');
    const dispatcher = new WorkerDispatcher([worker]);

    expect(dispatcher.getRegisteredWorkerIds()).toEqual(['ResearchWorker']);
    expect(dispatcher.getWorker('ResearchWorker')).toBe(worker);
  });

  it('rejects duplicate worker registration', () => {
    expect(() => new WorkerDispatcher([new StubWorker('A'), new StubWorker('A')]))
      .toThrow(/more than once/);
  });

  it('fails closed with WORKER_NOT_FOUND for an unknown id', () => {
    const dispatcher = new WorkerDispatcher([new StubWorker('ResearchWorker')]);

    expect(() => dispatcher.getWorker('GhostWorker', 'proj-1')).toThrow(
      OrchestrationError
    );
    try {
      dispatcher.getWorker('GhostWorker', 'proj-1');
    } catch (error) {
      expect(error).toBeInstanceOf(OrchestrationError);
      expect((error as OrchestrationError).failureType).toBe(
        FailureType.WORKER_NOT_FOUND
      );
    }
  });

  it('supports an empty registry (all actions fail worker resolution)', () => {
    const dispatcher = new WorkerDispatcher([]);
    expect(dispatcher.getRegisteredWorkerIds()).toEqual([]);
    expect(() => dispatcher.getWorker('ResearchWorker')).toThrow(OrchestrationError);
  });
});
