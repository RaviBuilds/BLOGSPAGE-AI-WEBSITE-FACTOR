# M2.4 Orchestrator

The M2.4 orchestrator is the **control-plane coordinator** for the Blogspage
AI Website Factory runtime. It sequences work stages and coordinates the
frozen infrastructure modules — it owns no domain semantics of its own.

```
Orchestrator.run(projectId)
   │
   │  read state ──────────────► M2.1 StateManager (WAL, frozen)
   │  verify divergence ───────► Reconciliation (M2.1 + M2.3 as truth)
   │  next action ─────────────► StageRegistry (pure data)
   │  resolve inputs ──────────► M2.3 ArtifactRepository (CURRENT pointers)
   │  dispatch worker ─────────► Worker (domain work, pure producer)
   │  validate output envelope ► OutputCoordinator (structure only)
   │  persist artifacts ───────► M2.3 ArtifactRepository   ← ARTIFACT FIRST
   │  evaluate gate ───────────► M2.2 GateEvaluator        (frozen)
   │  interpret verdict ───────► M2.2 recommendedRoute ONLY
   │  request transition ──────► M2.1 StateManager         ← STATE SECOND
   ▼
   loop until terminal / human-stop / cycle-guard / max-steps
```

## Ownership boundaries

| Concern | Owner | M2.4 role |
|---|---|---|
| States, transitions, WAL, txId idempotency | M2.1 (frozen) | requests transitions; never validates locally |
| Gate definitions, checks, classification, routing | M2.2 (frozen) | calls GateEvaluator; follows `recommendedRoute`; never re-classifies |
| Artifact persistence, schemas, versions, manifests | M2.3-A (frozen) | calls saveArtifact via OutputCoordinator; never touches files |
| Stage sequencing, worker dispatch, recovery | **M2.4** | everything in the diagram above |

Workers **must not** mutate state, persist artifacts, touch the filesystem,
call M2.1/M2.2/M2.3, or implement gate semantics. A worker receives an
immutable `ExecutionContext` (exact input versions frozen) and returns
artifacts as data.

## Module map

| File | Responsibility |
|---|---|
| `types.ts` | ActionDefinition, ExecutionContext (+ freeze), Worker/WorkerOutput, failure taxonomy, human-stop states |
| `StageRegistry.ts` | state → ActionDefinition data (exactly one registered action: RESEARCH_ACTION) |
| `Orchestrator.ts` | the run loop (the only sequencing logic in M2.4) + phase logging |
| `execution/ArtifactInputResolver.ts` | exact CURRENT-version input resolution via M2.3 |
| `execution/ProjectInputLoader.ts` | loads `input/business-input.yaml` through M1's workspace contract |
| `execution/WorkerDispatcher.ts` | workerId → Worker resolution |
| `execution/OutputCoordinator.ts` | output envelope validation + persistence through M2.3 |
| `coordination/GateCoordinator.ts` | GateEvaluator adapter; interprets pass / route / fail-closed |
| `coordination/TransitionCoordinator.ts` | legality pre-check via M2.1's table + transition requests (optional txId reuse for the same logical retry) |
| `coordination/Reconciliation.ts` | crash-divergence detection and minimal safe recovery |
| `workers/Worker.ts` | canonical worker contract (re-export) |
| `workers/ResearchWorker.ts` | deterministic benchmark research worker (vertical slice) |

Deliberately pruned per the no-premature-expansion rule: no separate
`FailureHandler.ts` / `ExecutionContext.ts` / `WorkerOutput.ts` files (their
contents are cohesive parts of `types.ts`), and no speculative future-stage
registry entries — the default registry contains exactly the research action.

## Failure handling (fail closed)

Every orchestration failure stops the run with a typed `OrchestrationError`
(`FailureType`): missing input, unknown worker, unavailable project input,
worker error, invalid output envelope, persistence failure, gate evaluation
error, route-less gate failure, illegal transition, restart ambiguity.
**No automatic retry** of possibly non-idempotent work. The only "failure"
that is not an error is a gate FAIL carrying M2.2's `recommendedRoute` — the
orchestrator requests that route through M2.1, provided M2.1's canonical
table deems it legal from the current state.

## Loop safety

No new canonical states and no infinite loops: runs stop at `DELIVERED`
(terminal), at all human-stop states (`NEEDS_*`, `BLOCKED`,
`NEEDS_HUMAN_REVIEW`, `RESEARCH_READY`, `BLUEPRINT_READY`, `APPROVED`), when
a state has no registered action, under a per-run cycle guard (any state
visited more than twice), and at the max-steps bound (default 8).

## Current-architecture facts (frozen-seam findings, recorded not patched)

1. **All six gates still fail closed** under the condition contract (17 of 27
   M2.2 conditions unresolved) — accepted at the M2.3-A freeze and pinned by
   `tests/ProductionWiring.test.ts` T3. M2.3-B formalized those conditions'
   contracts (`02-CONTROL-PLANE/gate-conditions.md`) and resolves none of the
   semantic ones, so this fact is unchanged.
2. **Canonical seam — RESOLVED in M2.3-B (Seam 1).** The frozen `FailureRouter`
   maps `FACTUAL_INTEGRITY_PROBLEM` → `RETURN_TO_RESEARCH` regardless of the
   current state, but `state-machine.md §4` previously gave `RESEARCHING` no
   `RETURN_TO_*` exit, so M2.4 refused the recommendation
   (`ILLEGAL_TRANSITION`, project stayed in `RESEARCHING`). M2.3-B added the
   missing edge `RESEARCHING → RETURN_TO_RESEARCH` to `state-machine.md §2/§4`
   and to `runtime/state/TransitionTable.ts` — one edge, no other row changed.
   Under production wiring the vertical slice now persists all four artifacts,
   evaluates the gate (FAIL, unresolved conditions), receives the
   `RETURN_TO_RESEARCH` recommendation, and **commits exactly that route**,
   then stops safely (`no-action-for-state`) at `RETURN_TO_RESEARCH`.
   `RETURN_TO_RESEARCH` deliberately has **no registered action**: its only
   legal exit (`→ RESEARCHING`) belongs to the human/future milestone that
   supplies the corrected facts, exactly as for the `NEEDS_*` return states
   (registering a null-worker loop action would re-run the same deterministic
   worker and churn artifact versions for no gain). See
   `tests/orchestrator/Seam1.test.ts` (canon/table drift guard) and
   `tests/orchestrator/ResearchVerticalSlice.test.ts`.
3. The gate-pass path (`RESEARCHING → RESEARCH_READY`, then human Gate 1) is
   fully implemented and proven in `tests/orchestrator/Orchestrator.test.ts`;
   only M2.3-B condition resolution stands between the production wiring and
   that outcome.
4. **Human approval/resume (M2.3-B):** `human-approval.md`'s three gates and
   six invariants are implemented in `orchestrator/approval/`, persisting
   approval/rejection records to an orchestrator-surface store
   (`{workspaceRoot}/{projectId}/control/approvals/`) — NOT as a 12th artifact
   type, because the envelope's `artifactType` enum is a canonically closed set
   of eleven peer artifacts. Gate 1/2 approval commits the gate's transition
   (`RESEARCH_READY → CREATIVE_DIRECTION`), which is how a run resumes past a
   human-stop state.

## Adding a worker (future milestones)

1. Implement `Worker` from `workers/Worker.ts` — `workerId`, semver
   `version`, `execute(context)`.
2. Derive artifact documents from `context.inputs` / `context.projectInput`
   only; set `artifactId` and payload fields; do **not** set
   `artifactType`, `projectId`, `artifactVersion` or `versionStatus`
   (M2.3 injects them).
3. Register the worker in the `OrchestratorDeps.workers` list and add the
   stage's `ActionDefinition` to `StageRegistry.defaultActions()`.
4. Schema validity is enforced on write by M2.3 against the canonical
   `04-SCHEMA` shapes; content quality is judged by M2.2's gates.

M2.4 Milestone. Factory version 0.2.0. Frozen modules untouched.
