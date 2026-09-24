/**
 * Shared orchestration types for M2.4 — the Control-Plane orchestrator.
 *
 * M2.4 is the control-plane coordinator. It owns orchestration (deciding what
 * runs next, resolving inputs, dispatching workers, coordinating artifact
 * persistence, gate evaluation and state transitions) and owns NOTHING that
 * the frozen modules already own:
 *
 *   - state / transitions / WAL        → runtime/state (M2.1, frozen)
 *   - gate definitions / routing       → runtime/gates, runtime/routing (M2.2, frozen)
 *   - artifact persistence / manifests → runtime/artifacts (M2.3-A, frozen)
 *
 * This module introduces NO canonical state, NO canonical transition, NO gate
 * predicate and NO artifact storage of its own.
 *
 * Canonical sources:
 * - 02-CONTROL-PLANE/workflow.md (stage sequence, stage inputs/outputs)
 * - 02-CONTROL-PLANE/state-machine.md §2 (states; §4 transitions)
 * - 02-CONTROL-PLANE/quality-gates.md §2 (gate register)
 * - 02-CONTROL-PLANE/agent-roles.md §3.1 (Research Agent)
 * - 02-CONTROL-PLANE/artifact-contracts.md §5.1-5.4 (research artifacts)
 * - 02-CONTROL-PLANE/versioning.md §6.2 (CURRENT resolution)
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 * Factory version: 0.2.0
 */

import { State } from '../state/StateMachine';
import { ArtifactType, ArtifactDocument } from '../artifacts/ArtifactTypes';
import { GateName, ValidationResult } from '../gates/GateTypes';
import { ProjectRecord } from '../workspace/ProjectInitializer';

export { State };
export { ArtifactType, ArtifactDocument };
export { GateName, ValidationResult };
export { ProjectRecord };

/**
 * One executable orchestration step, registered against a state.
 *
 * An action is DATA, not logic. It declares:
 * - which worker runs (or null for pure routing-completion actions),
 * - which artifact types must already exist (requiredInputs),
 * - which artifact types the worker must produce (expectedOutputs),
 * - which canonical gate governs the exit transition (gateAfterAction),
 * - which state the project enters when the gate passes (transitionOnSuccess).
 *
 * Gate FAILURE destinations are NOT recorded here — they come from M2.2's
 * FailureRouter via the gate result's recommendedRoute, so M2.4 never
 * duplicates failure-routing semantics.
 */
export interface ActionDefinition {
  /** Stable identifier, e.g. 'RESEARCH_STAGE'. */
  actionId: string;
  /**
   * Worker to dispatch, or null for an action that performs no domain work
   * (e.g. completing a RETURN_TO_* routing transition, whose only legal exit
   * is fixed by state-machine.md §4).
   */
  workerId: string | null;
  /** Semver of the registered worker implementation (ignored when workerId is null). */
  workerVersion: string;
  /** States in which this action applies. Exactly one action per state. */
  applicableStates: State[];
  /** Artifact types that must exist (at their CURRENT version) before dispatch. */
  requiredInputs: ArtifactType[];
  /** Artifact types the worker must produce; validated before persistence. */
  expectedOutputs: ArtifactType[];
  /** Canonical gate evaluated after artifacts are persisted; null = none. */
  gateAfterAction: GateName | null;
  /** State transitioned into when the gate passes. */
  transitionOnSuccess: { to: State };
  /**
   * Whether the worker consumes the project's business input
   * (workspace input/business-input.yaml, per M1's workspace contract).
   */
  requiresProjectInput: boolean;
}

/**
 * One resolved input artifact: the CURRENT version of a required input,
 * resolved through M2.3's repository at orchestration time and frozen into
 * the ExecutionContext (versioning.md §6.2 rule 4 — consumers resolve to
 * CURRENT; §7 — recording stamps the exact version consumed).
 */
export interface ResolvedArtifact {
  artifactType: ArtifactType;
  version: number;
  artifactId: string;
  document: ArtifactDocument;
}

/**
 * Immutable snapshot of everything a worker needs. Built fresh per
 * orchestration step; never held across steps; never mutated by the worker.
 */
export interface ExecutionContext {
  /** Unique per worker-dispatch attempt (orchestrator-generated UUID). */
  executionId: string;
  projectId: string;
  currentState: State;
  actionId: string;
  workerId: string;
  workerVersion: string;
  /** Exact input artifact versions (empty for bootstrap actions). */
  inputs: ResolvedArtifact[];
  /**
   * Factory-global registry versions consumed, per artifact-contracts.md §7.
   * Research artifacts record no registry versions (that table applies to
   * Creative Direction / Blueprint / Implementation / Critic), so this is an
   * empty record in M2.4; the field exists so the contract is already honest.
   */
  registryVersions: Record<string, string>;
  /** Artifact types the worker must produce. */
  expectedOutputs: ArtifactType[];
  /** M1 project record. */
  projectRecord: ProjectRecord;
  /**
   * Parsed business input (input/business-input.yaml), present when the
   * action declares requiresProjectInput. Project input is M1-owned data;
   * the orchestrator loads it via the M1 workspace contract and hands it to
   * the worker so the worker itself performs no filesystem access.
   */
  projectInput?: unknown;
  /** ISO timestamp of context construction. */
  startedAt: string;
}

/**
 * Freeze an ExecutionContext (Section D: "the simplest safe implementation"
 * — Object.freeze, no immutability library).
 *
 * The context object itself, the inputs array, and each ResolvedArtifact are
 * frozen so a worker cannot mutate its snapshot. Payload documents are the
 * worker's own data and are deliberately NOT deep-frozen here: M2.3 owns the
 * persisted copy and validates it independently on write.
 *
 * Frozen at construction by the orchestrator; workers receive the frozen
 * snapshot and cannot swap or reorder resolved inputs.
 */
export function freezeExecutionContext(context: ExecutionContext): ExecutionContext {
  for (const input of context.inputs) {
    Object.freeze(input);
  }
  Object.freeze(context.inputs);
  Object.freeze(context);
  return context;
}

/**
 * One artifact produced by a worker, NOT yet persisted. The document is the
 * caller-side document for ArtifactRepository.saveArtifact: it must carry
 * artifactId (and payload fields); artifactType, projectId, artifactVersion
 * and versionStatus are injected by the persistence layer (M2.3-A) and must
 * NOT be set by the worker.
 */
export interface ArtifactOutput {
  artifactType: ArtifactType;
  document: ArtifactDocument;
  /**
   * The exact input versions consumed to produce this artifact
   * (artifact-contracts.md §6 invariant 9, §7). Empty for bootstrap work.
   */
  consumedInputs: ConsumedArtifact[];
}

export interface ConsumedArtifact {
  artifactType: ArtifactType;
  version: number;
  artifactId: string;
}

/** Full worker result, before persistence. */
export interface WorkerOutput {
  artifacts: ArtifactOutput[];
  metadata: {
    executionId: string;
    workerId: string;
    workerVersion: string;
    executedAt: string;
    executionDurationMs: number;
  };
  warnings?: string[];
}

/** Result of persisting one artifact through M2.3. */
export interface PersistedArtifact {
  artifactType: ArtifactType;
  version: number;
  artifactId: string;
}

/**
 * Canonical worker contract. A worker performs domain work only: it receives
 * an immutable ExecutionContext and returns artifacts. It MUST NOT mutate
 * factory state, persist artifacts, read/write the filesystem, call M2.1/M2.2
 * or M2.3 APIs directly, or implement gate semantics.
 */
export interface Worker {
  readonly workerId: string;
  readonly version: string;
  execute(context: ExecutionContext): Promise<WorkerOutput>;
}

/**
 * Orchestration failure taxonomy. These are ORCHESTRATION-level failure
 * classes — none of them introduces a new project state; state outcomes
 * always flow through M2.1's canonical transition set.
 */
export enum FailureType {
  MISSING_INPUT_ARTIFACT = 'MISSING_INPUT_ARTIFACT',
  WORKER_NOT_FOUND = 'WORKER_NOT_FOUND',
  PROJECT_INPUT_UNAVAILABLE = 'PROJECT_INPUT_UNAVAILABLE',
  WORKER_EXECUTION_ERROR = 'WORKER_EXECUTION_ERROR',
  WORKER_OUTPUT_INVALID = 'WORKER_OUTPUT_INVALID',
  ARTIFACT_PERSISTENCE_FAILED = 'ARTIFACT_PERSISTENCE_FAILED',
  GATE_EVALUATION_ERROR = 'GATE_EVALUATION_ERROR',
  GATE_FAILED_WITHOUT_ROUTE = 'GATE_FAILED_WITHOUT_ROUTE',
  ILLEGAL_TRANSITION = 'ILLEGAL_TRANSITION',
  TRANSITION_EXECUTION_FAILED = 'TRANSITION_EXECUTION_FAILED',
  RESTART_AMBIGUITY = 'RESTART_AMBIGUITY'
}

/**
 * Base class for all orchestration failures. Fail-closed: every failure here
 * stops the orchestration run; none is silently absorbed.
 */
export class OrchestrationError extends Error {
  constructor(
    public readonly failureType: FailureType,
    message: string,
    public readonly projectId?: string,
    public readonly executionId?: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'OrchestrationError';
  }
}

/** A declared action input does not exist for the project. */
export class MissingInputArtifactError extends OrchestrationError {
  constructor(
    projectId: string,
    public readonly artifactType: ArtifactType,
    executionId?: string
  ) {
    super(
      FailureType.MISSING_INPUT_ARTIFACT,
      `Required input artifact ${artifactType} does not exist for project ${projectId}`,
      projectId,
      executionId
    );
    this.name = 'MissingInputArtifactError';
  }
}

/**
 * States at which the orchestrator must stop and wait for a human.
 *
 * - NEEDS_* / BLOCKED / NEEDS_HUMAN_REVIEW: exception states awaiting human
 *   intervention (state-machine.md §3).
 * - RESEARCH_READY / BLUEPRINT_READY: pending human Gate 1 / Gate 2
 *   (human-approval.md §1).
 * - APPROVED: pending delivery preparation, which is out of M2.4 scope.
 * - DELIVERED is terminal and handled before this check.
 *
 * Resume after a NEEDS_* state is performed by the human (or a future
 * milestone) transitioning through the state's recorded return state; the
 * orchestrator never invents an approval of its own.
 */
export const HUMAN_STOP_STATES: State[] = [
  State.NEEDS_CONTENT,
  State.NEEDS_ASSETS,
  State.NEEDS_CREDENTIALS,
  State.BLOCKED,
  State.NEEDS_HUMAN_REVIEW,
  State.RESEARCH_READY,
  State.BLUEPRINT_READY,
  State.APPROVED
];

export function isHumanStopState(state: State): boolean {
  return HUMAN_STOP_STATES.includes(state);
}

/** Why a run() invocation stopped. */
export type RunStopReason =
  | 'terminal'
  | 'human-stop'
  | 'no-action-for-state'
  | 'cycle-guard'
  | 'max-steps';

/** Observability record for one completed orchestration step. */
export interface StepRecord {
  /** 1-based step index within the run. */
  step: number;
  executionId: string | null;
  fromState: State;
  actionId: string;
  workerId: string | null;
  inputVersions: { artifactType: string; version: number }[];
  persisted: PersistedArtifact[];
  gate: {
    name: GateName | null;
    passed: boolean;
    failureCount: number;
    problemClass?: string;
    recommendedRoute?: string;
  } | null;
  transition: {
    from: State;
    to: State;
    txId: string | null;
    idempotent: boolean | null;
  } | null;
  durationMs: number;
}

/** Result of one run() invocation. */
export interface RunSummary {
  projectId: string;
  steps: StepRecord[];
  stopped: RunStopReason;
  finalState: State;
}