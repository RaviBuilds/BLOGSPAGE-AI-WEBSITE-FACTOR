/**
 * The M2.4 Orchestrator — the Control-Plane coordinator.
 *
 * Owns SEQUENCING only. One run() invocation repeatedly:
 *
 *   read state (M2.1)
 *   → verify state/artifact consistency (reconciliation, fail-closed)
 *   → determine the next action (StageRegistry data)
 *   → reconcile any crash divergence (recovery is an ordinary legal
 *     transition; never a state repair)
 *   → resolve exact input artifact versions (M2.3 CURRENT pointers)
 *   → build an immutable ExecutionContext
 *   → dispatch the action's worker
 *   → validate the worker output envelope (structure only)
 *   → persist artifacts through M2.3            ← ARTIFACT FIRST
 *   → evaluate the canonical gate through M2.2
 *   → interpret the gate outcome (pass / M2.2-recommended route / fail-closed)
 *   → request the transition through M2.1       ← STATE SECOND
 *   → record the step and loop
 *
 * It introduces no state, no transition rule, no gate predicate, no artifact
 * storage, no queue and no hidden workflow memory: every decision is derived
 * fresh from M2.1 + M2.3 + the StageRegistry on every step.
 *
 * Loop safety (no new canonical states, no infinite routing loops):
 *   - stops at DELIVERED (terminal) and at all human-stop states,
 *   - stops when a state has no registered action,
 *   - a per-run cycle guard stops after any state is visited twice (a
 *     deterministic re-entry loop, e.g. repeated gate-failure routing under
 *     the frozen fail-closed condition contract, is surfaced as a stopped
 *     run, not absorbed silently),
 *   - a max-steps bound bounds every run.
 *
 * Failure handling is fail-closed throughout: every orchestration failure
 * (missing input, worker error, invalid output, persistence failure, gate
 * evaluation error, route-less gate failure, illegal transition, restart
 * ambiguity) stops the run by throwing the typed OrchestrationError — no
 * automatic retry of possibly non-idempotent work.
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 * Factory version: 0.2.0
 */

import { v4 as uuidv4 } from 'uuid';
import { ArtifactRepository } from '../artifacts/ArtifactRepository';
import { GateEvaluator } from '../gates/GateEvaluator';
import { ValidationContext } from '../gates/ValidationContext';
import { logger } from '../logging/Logger';
import { State } from '../state/StateMachine';
import { StateManager } from '../state/StateManager';
import { StageRegistry } from './StageRegistry';
import { GateCoordinator } from './coordination/GateCoordinator';
import { Reconciliation } from './coordination/Reconciliation';
import { TransitionCoordinator } from './coordination/TransitionCoordinator';
import { ArtifactInputResolver } from './execution/ArtifactInputResolver';
import { OutputCoordinator } from './execution/OutputCoordinator';
import { ProjectInputLoader } from './execution/ProjectInputLoader';
import { WorkerDispatcher } from './execution/WorkerDispatcher';
import { ResearchWorker } from './workers/ResearchWorker';
import {
  ActionDefinition,
  FailureType,
  freezeExecutionContext,
  isHumanStopState,
  OrchestrationError,
  PersistedArtifact,
  ResolvedArtifact,
  RunStopReason,
  RunSummary,
  StepRecord,
  Worker,
  WorkerOutput
} from './types';

export interface OrchestratorDeps {
  /**
   * Workspace root shared with M1/M2.1/M2.3 ('./projects' in production; an
   * isolated temp root in tests).
   */
  workspaceRoot: string;
  /**
   * The ValidationContext M2.2's GateEvaluator evaluates against. Production
   * wiring: ProductionValidationContext over ArtifactRepository. Tests may
   * substitute an isolated context for unit-scoped scenarios ONLY — the
   * vertical-slice test wires the real production context.
   */
  validationContext: ValidationContext;
  stateManager?: StateManager;
  artifactRepository?: ArtifactRepository;
  stageRegistry?: StageRegistry;
  /** Workers registered with the dispatcher (defaults to the M2.4 set). */
  workers?: Worker[];
  /** Upper bound on orchestration steps per run() invocation. */
  maxStepsPerRun?: number;
}

export class Orchestrator {
  private readonly stateManager: StateManager;
  private readonly artifactRepository: ArtifactRepository;
  private readonly stageRegistry: StageRegistry;
  private readonly inputResolver: ArtifactInputResolver;
  private readonly projectInputLoader: ProjectInputLoader;
  private readonly workerDispatcher: WorkerDispatcher;
  private readonly outputCoordinator: OutputCoordinator;
  private readonly gateCoordinator: GateCoordinator;
  private readonly transitionCoordinator: TransitionCoordinator;
  private readonly reconciliation: Reconciliation;
  private readonly maxStepsPerRun: number;

  constructor(deps: OrchestratorDeps) {
    this.stateManager = deps.stateManager ?? new StateManager(deps.workspaceRoot);
    this.artifactRepository =
      deps.artifactRepository ?? new ArtifactRepository(deps.workspaceRoot);
    this.stageRegistry = deps.stageRegistry ?? new StageRegistry();
    this.inputResolver = new ArtifactInputResolver(this.artifactRepository);
    this.projectInputLoader = new ProjectInputLoader(deps.workspaceRoot);
    this.workerDispatcher = new WorkerDispatcher(
      deps.workers ?? [new ResearchWorker()]
    );
    this.outputCoordinator = new OutputCoordinator();
    this.gateCoordinator = new GateCoordinator(
      new GateEvaluator(deps.validationContext)
    );
    this.transitionCoordinator = new TransitionCoordinator(this.stateManager);
    this.reconciliation = new Reconciliation(
      this.stageRegistry,
      this.artifactRepository,
      this.gateCoordinator,
      this.transitionCoordinator
    );
    this.maxStepsPerRun = deps.maxStepsPerRun ?? 8;
  }

  /**
   * Orchestrate the project from its current M2.1 state until a stop
   * condition is reached or a fail-closed error is raised.
   *
   * resume() is the same operation: restart/resume reconstructs reality
   * exclusively from M2.1's WAL and M2.3's manifest — there is no
   * orchestrator-side state to restore and nothing in-memory is trusted
   * across invocations.
   */
  async run(projectId: string): Promise<RunSummary> {
    const steps: StepRecord[] = [];
    const stateVisits = new Map<State, number>();
    let stopped: RunStopReason = 'max-steps';

    logger.info('Orchestration started', {
      component: 'Orchestrator',
      projectId
    });

    for (let stepIndex = 1; stepIndex <= this.maxStepsPerRun; stepIndex++) {
      const state = await this.readCurrentState(projectId);

      // Terminal state: workflow complete.
      if (state === State.DELIVERED) {
        stopped = 'terminal';
        break;
      }

      // Inverse divergence check (fail closed before anything else runs).
      await this.reconciliation.verifyStateArtifacts(projectId, state);

      // Human stop: the orchestrator never proceeds past a human gate or an
      // exception state awaiting human intervention.
      if (isHumanStopState(state)) {
        logger.info('Orchestrator stopped at human-stop state', {
          component: 'Orchestrator',
          projectId,
          state
        });
        stopped = 'human-stop';
        break;
      }

      // Cycle guard: a deterministic loop (e.g. repeated gate-failure
      // routing) must surface as a stopped run, not spin forever. A state
      // may be visited at most twice per run (visit → route → re-entry).
      const visits = (stateVisits.get(state) ?? 0) + 1;
      stateVisits.set(state, visits);
      if (visits > 2) {
        logger.warn('Orchestration cycle guard tripped', {
          component: 'Orchestrator',
          projectId,
          state,
          visits
        });
        stopped = 'cycle-guard';
        break;
      }

      const action = this.stageRegistry.getActionForState(state);
      if (!action) {
        logger.info('No action registered for state', {
          component: 'Orchestrator',
          projectId,
          state
        });
        stopped = 'no-action-for-state';
        break;
      }

      const stepStartedAt = Date.now();
      const executionId = uuidv4();

      // Phase log: action selected.
      logger.info('Action selected', {
        component: 'Orchestrator',
        projectId,
        executionId,
        currentState: state,
        actionId: action.actionId,
        workerId: action.workerId,
        workerVersion: action.workerVersion
      });

      // Crash-divergence recovery before dispatch. A completed recovery
      // transition is recorded as a step and the loop re-reads state.
      const reconciliationOutcome = await this.reconciliation.reconcileBeforeAction(
        projectId,
        state,
        action
      );

      if (reconciliationOutcome.completedTransition) {
        steps.push({
          step: stepIndex,
          executionId,
          fromState: state,
          actionId: action.actionId,
          workerId: null,
          inputVersions: [],
          persisted: [],
          gate: null,
          transition: {
            from: state,
            to: action.transitionOnSuccess.to,
            txId: null,
            idempotent: null
          },
          durationMs: Date.now() - stepStartedAt
        });
        continue;
      }

      // 1. Resolve exact input artifact versions from M2.3 CURRENT pointers.
      const inputs: ResolvedArtifact[] = await this.inputResolver.resolveInputs(
        projectId,
        action.requiredInputs,
        executionId
      );

      // 2. Load the project business input when the action declares it.
      const projectInput = action.requiresProjectInput
        ? await this.projectInputLoader.load(projectId)
        : undefined;

      // Phase log: input resolution.
      logger.info('Input resolution complete', {
        component: 'Orchestrator',
        projectId,
        executionId,
        inputVersions: inputs.map(i => ({
          artifactType: i.artifactType,
          version: i.version,
          artifactId: i.artifactId
        }))
      });

      // 3. Build the immutable ExecutionContext (frozen snapshot — Section D).
      const projectRecord = await this.projectInputLoader.loadProjectRecord(projectId);
      const context = freezeExecutionContext({
        executionId,
        projectId,
        currentState: state,
        actionId: action.actionId,
        workerId: action.workerId ?? '',
        workerVersion: action.workerVersion,
        inputs,
        registryVersions: {},
        expectedOutputs: action.expectedOutputs,
        projectRecord,
        projectInput,
        startedAt: new Date().toISOString()
      });

      // 4. Dispatch the worker (routing-completion actions have none).
      let output: WorkerOutput | null = null;
      if (action.workerId) {
        const worker = this.workerDispatcher.getWorker(action.workerId, projectId);
        logger.info('Worker dispatched', {
          component: 'Orchestrator',
          projectId,
          executionId,
          workerId: worker.workerId,
          workerVersion: worker.version
        });
        try {
          output = await worker.execute(context);
        } catch (error) {
          logger.error('Orchestration failed: worker error', {
            component: 'Orchestrator',
            projectId,
            executionId,
            workerId: worker.workerId,
            failureType: FailureType.WORKER_EXECUTION_ERROR,
            outcome: 'failure',
            error: error instanceof Error ? error.message : String(error)
          });
          if (error instanceof OrchestrationError) {
            throw error;
          }
          throw new OrchestrationError(
            FailureType.WORKER_EXECUTION_ERROR,
            `Worker ${action.workerId} failed: ${
              error instanceof Error ? error.message : String(error)
            }`,
            projectId,
            executionId,
            error
          );
        }
        logger.info('Worker completed', {
          component: 'Orchestrator',
          projectId,
          executionId,
          workerId: worker.workerId,
          outcome: 'success',
          artifactCount: output.artifacts.length
        });
      }

      // 5. Validate the worker output envelope (structure only; schema
      //    validation belongs to M2.3, content quality to M2.2).
      let persisted: PersistedArtifact[] = [];
      if (output) {
        const validation = this.outputCoordinator.validateOutput(
          output,
          action.expectedOutputs,
          context
        );
        logger.info('Worker output validated', {
          component: 'Orchestrator',
          projectId,
          executionId,
          outcome: validation.valid ? 'success' : 'failure',
          errorCount: validation.errors.length
        });
        if (!validation.valid) {
          logger.error('Orchestration failed: invalid worker output', {
            component: 'Orchestrator',
            projectId,
            executionId,
            workerId: action.workerId,
            failureType: FailureType.WORKER_OUTPUT_INVALID,
            outcome: 'failure',
            validationErrors: validation.errors
          });
          throw new OrchestrationError(
            FailureType.WORKER_OUTPUT_INVALID,
            `Worker ${action.workerId} produced invalid output: ` +
              validation.errors.join('; '),
            projectId,
            executionId
          );
        }

        // 6. Persist artifacts through M2.3 — ARTIFACT FIRST.
        persisted = await this.outputCoordinator.persistArtifacts(
          projectId,
          output.artifacts,
          this.artifactRepository,
          executionId
        );
        logger.info('Artifacts persisted', {
          component: 'Orchestrator',
          projectId,
          executionId,
          outputVersions: persisted.map(p => ({
            artifactType: p.artifactType,
            version: p.version,
            artifactId: p.artifactId
          }))
        });
      }

      // 7. Evaluate the canonical gate through M2.2.
      const gateResult = await this.gateCoordinator.evaluateForAction(
        projectId,
        action,
        state
      );
      const interpretation = this.gateCoordinator.interpret(gateResult);
      logger.info('Gate evaluated', {
        component: 'Orchestrator',
        projectId,
        executionId,
        gate: gateResult.gate,
        gatePassed: gateResult.passed,
        failureCount: gateResult.failures.length,
        problemClass: gateResult.problemClass,
        recommendedRoute: gateResult.recommendedRoute
      });

      // 8. Request the state transition through M2.1 — STATE SECOND.
      let transition: StepRecord['transition'] = null;

      if (interpretation.kind === 'pass') {
        logger.info('Transition requested', {
          component: 'Orchestrator',
          projectId,
          executionId,
          from: state,
          to: action.transitionOnSuccess.to,
          triggeredBy: `orchestrator:gate-pass:${action.actionId}`
        });
        const result = await this.transitionCoordinator.requestTransition(
          projectId,
          state,
          action.transitionOnSuccess.to,
          `orchestrator:gate-pass:${action.actionId}`
        );
        transition = {
          from: state,
          to: action.transitionOnSuccess.to,
          txId: result.txId,
          idempotent: result.idempotent
        };
      } else if (interpretation.kind === 'route') {
        // The route target is M2.2's recommendation (FailureRouter), never an
        // orchestrator-side routing decision. A dynamic exception target
        // records the router's returnTarget through M2.1's metadata.
        const target = interpretation.targetState;
        const isDynamic = this.transitionCoordinator.isDynamicReturnState(target);
        const returnTarget =
          isDynamic &&
          interpretation.returnTarget &&
          this.transitionCoordinator.isValidReturnTarget(interpretation.returnTarget)
            ? interpretation.returnTarget
            : undefined;

        logger.info('Transition requested (gate-failure route)', {
          component: 'Orchestrator',
          projectId,
          executionId,
          from: state,
          to: target,
          returnTarget,
          triggeredBy: `orchestrator:gate-fail:${gateResult.gate ?? 'unknown'}`
        });
        const result = await this.transitionCoordinator.requestTransition(
          projectId,
          state,
          target,
          `orchestrator:gate-fail:${gateResult.gate ?? 'unknown'}`,
          returnTarget
        );
        transition = {
          from: state,
          to: target,
          txId: result.txId,
          idempotent: result.idempotent
        };
      } else {
        // Gate failed without a recommended route — a contract violation by
        // the evaluator. Fail closed; never guess a destination.
        logger.error('Orchestration failed: gate failed without route', {
          component: 'Orchestrator',
          projectId,
          executionId,
          gate: gateResult.gate,
          failureType: FailureType.GATE_FAILED_WITHOUT_ROUTE,
          outcome: 'failure',
          failureCount: gateResult.failures.length
        });
        throw new OrchestrationError(
          FailureType.GATE_FAILED_WITHOUT_ROUTE,
          `Gate ${gateResult.gate ?? 'unknown'} failed without a recommended ` +
            `route — failing closed (failure-routing.md §1 rule 6)`,
          projectId,
          executionId
        );
      }

      // 9. Record the completed step.
      const stepRecord: StepRecord = {
        step: stepIndex,
        executionId,
        fromState: state,
        actionId: action.actionId,
        workerId: action.workerId,
        inputVersions: inputs.map(i => ({
          artifactType: i.artifactType,
          version: i.version
        })),
        persisted,
        gate: {
          name: gateResult.gate,
          passed: gateResult.passed,
          failureCount: gateResult.failures.length,
          problemClass: gateResult.problemClass,
          recommendedRoute: gateResult.recommendedRoute
        },
        transition,
        durationMs: Date.now() - stepStartedAt
      };
      steps.push(stepRecord);

      logger.info('Orchestration step completed', {
        component: 'Orchestrator',
        projectId,
        executionId,
        step: stepRecord.step,
        fromState: stepRecord.fromState,
        actionId: stepRecord.actionId,
        workerId: stepRecord.workerId,
        persistedCount: stepRecord.persisted.length,
        gatePassed: stepRecord.gate?.passed ?? null,
        transitionedTo: stepRecord.transition?.to ?? null
      });
    }

    const finalState = await this.readCurrentState(projectId);
    logger.info('Orchestration run finished', {
      component: 'Orchestrator',
      projectId,
      stopped,
      steps: steps.length,
      finalState
    });
    return { projectId, steps, stopped, finalState };
  }

  /** resume() is run(): restart/resume has no separate machinery. */
  async resume(projectId: string): Promise<RunSummary> {
    return this.run(projectId);
  }

  /**
   * Read the authoritative state from M2.1's WAL. Never cached, never
   * trusted from a previous step's read.
   */
  private async readCurrentState(projectId: string): Promise<State> {
    const state = await this.stateManager.getCurrentState(projectId);
    return state as State;
  }
}

