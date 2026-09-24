/**
 * Canonical worker contract re-export for M2.4.
 *
 * The Worker interface itself is defined in ../types.ts alongside the
 * output/execution-context types it references; this module exists so worker
 * implementations import from the workers/ directory, keeping the worker
 * surface in one discoverable place.
 *
 * A worker:
 *   - receives an immutable ExecutionContext (exact input versions frozen),
 *   - performs its role's domain work,
 *   - returns artifacts as data (NOT persisted — persistence is coordinated
 *     by the orchestrator through M2.3's repository),
 *   - records the exact input versions it consumed.
 *
 * A worker MUST NOT:
 *   - mutate Factory state or invoke M2.1 transitions,
 *   - persist artifacts or touch the filesystem,
 *   - call M2.2 gate evaluation or implement gate semantics,
 *   - decide the next stage.
 *
 * Canonical source: agent-roles.md §1 (logical separation — a role may read
 * only its declared inputs and write only its declared outputs).
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 * Factory version: 0.2.0
 */

export { Worker, WorkerOutput, ArtifactOutput, ConsumedArtifact, ExecutionContext } from '../types';
