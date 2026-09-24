/**
 * Worker dispatch for M2.4.
 *
 * Maps a declared workerId to the registered Worker instance. This is the
 * only place worker identity is resolved; the orchestrator never hardcodes
 * worker knowledge and never instantiates workers mid-run.
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 * Factory version: 0.2.0
 */

import { FailureType, OrchestrationError, Worker } from '../types';

export class WorkerDispatcher {
  private readonly workers: Map<string, Worker>;

  constructor(workers: Worker[] = []) {
    this.workers = new Map();
    for (const worker of workers) {
      if (this.workers.has(worker.workerId)) {
        throw new Error(
          `WorkerDispatcher: workerId '${worker.workerId}' registered more than once`
        );
      }
      this.workers.set(worker.workerId, worker);
    }
  }

  /** All registered workers (introspection for tests/diagnostics). */
  getRegisteredWorkerIds(): string[] {
    return Array.from(this.workers.keys());
  }

  /**
   * Resolve the worker for an action.
   *
   * @throws OrchestrationError (WORKER_NOT_FOUND) when no worker is
   *   registered under the declared id — fail-closed.
   */
  getWorker(workerId: string, projectId?: string): Worker {
    const worker = this.workers.get(workerId);
    if (!worker) {
      throw new OrchestrationError(
        FailureType.WORKER_NOT_FOUND,
        `No worker registered under id '${workerId}'`,
        projectId
      );
    }
    return worker;
  }
}
