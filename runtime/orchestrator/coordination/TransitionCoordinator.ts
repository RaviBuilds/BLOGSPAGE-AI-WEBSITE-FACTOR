/**
 * Transition coordination for M2.4 — the thin adapter between the
 * orchestrator and frozen M2.1.
 *
 * M2.4 asks M2.1 whether a transition is legal (TransitionTable) rather than
 * maintaining any transition knowledge of its own, then requests the
 * transition through StateManager. All transaction semantics — WAL
 * append, drift detection, txId idempotency, per-project locking, projection
 * updates — remain entirely M2.1's.
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 * Factory version: 0.2.0
 */

import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../logging/Logger';
import { StateManager } from '../../state/StateManager';
import { State } from '../../state/StateMachine';
import { TransitionTable } from '../../state/TransitionTable';
import { TransitionResult } from '../../state/TransitionEngine';
import {
  FailureType,
  OrchestrationError
} from '../types';

export class TransitionCoordinator {
  private readonly transitionTable: TransitionTable;

  constructor(
    private readonly stateManager: StateManager,
    transitionTable?: TransitionTable
  ) {
    this.transitionTable = transitionTable ?? new TransitionTable();
  }

  /**
   * Whether M2.1's canonical table considers from → to (with optional
   * exception-state returnTarget) legal. Pure delegation — no local table.
   */
  isTransitionLegal(from: State, to: State, returnTarget?: string): boolean {
    return this.transitionTable.isValidTransition(from, to, returnTarget);
  }

  /** Whether a target is one of M2.1's dynamic returnTarget exception states. */
  isDynamicReturnState(state: State): boolean {
    return this.transitionTable.isDynamicReturnState(state);
  }

  /** Whether a state may serve as a returnTarget per M2.1's table. */
  isValidReturnTarget(state: State): boolean {
    return this.transitionTable.isValidReturnTarget(state);
  }


  /**
   * Request a state transition.
   *
   * Legality is checked against M2.1's table BEFORE touching the WAL, so an
   * orchestration bug surfaces as a typed ILLEGAL_TRANSITION failure instead
   * of a state-layer rejection with side effects. The authoritative check
   * still happens again inside M2.1 under the project lock.
   *
   * A fresh txId is generated per request by default. Section J: a caller
   * retrying the SAME logical transition (e.g. after an infrastructure
   * failure where the commit outcome is unknown) may pass an explicit
   * `txId` — M2.1 then applies its own semantic-comparison idempotency for
   * that transaction instead of a new, semantically-distinct one. The
   * orchestrator's normal flow never reuses txIds across logical transitions.
   *
   * @throws OrchestrationError (ILLEGAL_TRANSITION | TRANSITION_EXECUTION_FAILED)
   */
  async requestTransition(
    projectId: string,
    from: State,
    to: State,
    triggeredBy: string,
    returnTarget?: State,
    txId?: string
  ): Promise<TransitionResult> {
    if (!this.isTransitionLegal(from, to, returnTarget)) {
      throw new OrchestrationError(
        FailureType.ILLEGAL_TRANSITION,
        `Requested transition ${from} → ${to}` +
          (returnTarget ? ` (returnTarget ${returnTarget})` : '') +
          ` is not legal per the canonical transition table (state-machine.md §4)`,
        projectId
      );
    }

    const resolvedTxId = txId ?? uuidv4();
    try {
      const result = await this.stateManager.transition({
        projectId,
        txId: resolvedTxId,
        from,
        to,
        triggeredBy,
        returnTarget
      });

      logger.info('State transition committed', {
        component: 'TransitionCoordinator',
        projectId,
        from,
        to,
        txId: result.txId,
        idempotent: result.idempotent,
        triggeredBy
      });

      return result;
    } catch (error) {
      throw new OrchestrationError(
        FailureType.TRANSITION_EXECUTION_FAILED,
        `Transition ${from} → ${to} failed in M2.1: ${
          error instanceof Error ? error.message : String(error)
        }`,
        projectId,
        undefined,
        error
      );
    }
  }
}
