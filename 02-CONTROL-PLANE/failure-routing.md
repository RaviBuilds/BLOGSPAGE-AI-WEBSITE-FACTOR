---
document: Blogspage AI Website Factory
layer: Control Plane
status: draft
version: 0.2.0
---

# Failure Routing

**Derived from:** Phase 0 — Factory Operating System, §0.13.

**Scope boundary:** This document defines how defects are diagnosed and assigned. It does not define how a phase repairs a defect once it owns it.

---

## 1. Principle

Per §0.13, defects are routed to the phase that owns the root cause. The factory diagnoses before it repairs.

**Rules**

1. Diagnose root cause before taking any corrective action.
2. Route the defect to the phase that owns the root cause, not to the phase where the symptom appeared.
3. Never repair a symptom in a downstream phase when the cause is upstream.
4. Never rebuild the whole project as a substitute for diagnosis.
5. When a phase regresses, downstream artifacts affected by the change are invalidated rather than patched.
6. When root cause is genuinely unclear, route to NEEDS_HUMAN_REVIEW rather than guessing.

## 2. Anti-Pattern

Repeatedly adjusting implementation to compensate for an upstream cause is prohibited. Phase 0 §0.13 gives the example of a beautiful design failing because the business has insufficient imagery: the correct route is an asset problem, not endless Phase 5 tweaking.

| Prohibited | Required |
|---|---|
| Tweaking implementation to hide a blueprint flaw | Return to Phase 4 |
| Tweaking implementation to hide an asset shortfall | Raise NEEDS_ASSETS |
| Rewriting content to hide a research gap | Return to research |
| Rebuilding the site to avoid diagnosing a defect | Diagnose, then route |
| Lowering a finding's severity to allow progression | Record the finding honestly |

## 3. Routing Table

| Problem class | Root cause sits in | Owning phase | Resulting state |
|---|---|---|---|
| Content problem | Business content missing, unverifiable, or insufficient | Input and research | NEEDS_CONTENT |
| Asset problem | Assets missing, unapproved, insufficient, or unusable | Input and research | NEEDS_ASSETS |
| Source access problem | Authorisation or credentials unavailable | Input | NEEDS_CREDENTIALS |
| Business understanding problem | Facts wrong, incomplete, or misclassified | Research | RETURN_TO_RESEARCH |
| Factual integrity problem | Unverified or fabricated claim presented | Research | RETURN_TO_RESEARCH |
| Creative strategy problem | Wrong creative point of view for this business | Phase 4 | RETURN_TO_BLUEPRINT |
| Composition problem | Vocabulary misapplied, or vocabulary inadequate | Phase 3 or Phase 4 | See §4 |
| Implementation problem | Blueprint implemented incorrectly or unfaithfully | Phase 5 | Remains in IMPLEMENTING, or REFINING when found post-build |
| Rendered-quality problem | Execution quality visible only in the rendered result | Phase 6 | REFINING |
| Accessibility problem | Implementation defect, or a blueprint decision that cannot be made accessible | Phase 5 or Phase 6 | See §5 |
| Conversion problem | Strategy, execution, or rendered clarity | Phase 4, 5, or 6 | See §6 |
| Factory rule problem | Factory documentation is wrong, missing, or contradictory | Control Plane or the owning phase | NEEDS_HUMAN_REVIEW |

### 3.1 Critic Recommendation Vocabulary

The Independent Critic issues a **recommendation**. A recommendation is not a state. The Control Plane maps each recommendation to a state in `state-machine.md` §4.

| Critic recommendation | Resulting state | Basis |
|---|---|---|
| `SHIP` | No transition by the critic. Proceeds to human Gate 3 — Final Approval | Only a human may approve delivery. `quality-gates.md` §8, §9 |
| `REFINE` | REFINING | Findings owned by Phase 6, or Phase 5-owned findings found post-build |
| `REBUILD` | REFINING, as a **scoped corrective build** that executes the refinement plan | §1 rule 4 forbids rebuilding as a substitute for diagnosis |
| `RETURN_TO_PHASE_4` | RETURN_TO_BLUEPRINT | Same transition, different name |

**`REBUILD` is recommendation vocabulary only.** It is not a state and never becomes one. A recommendation of `REBUILD` does not authorise unscoped regeneration: per §1 rule 4 and §2, the work is a scoped correction against diagnosed findings. Where the design itself is genuinely wrong, the root cause is Phase 4 and the destination is RETURN_TO_BLUEPRINT.

**`RETURN_TO_IMPLEMENTATION` is not a state.** The term appears in Phase 6 source vocabulary as a destination name. It resolves to REFINING, per the Implementation problem row above and `state-machine.md` REFINING.

**Source vocabulary is mapped, not adopted.** Where a canonical phase document names a destination that is not a state in `state-machine.md` §4, the Control Plane records the mapping here. It does not add the state, and it does not modify the phase document.

---

## 4. Composition Problems

Composition defects split by whether the vocabulary was misapplied or is inadequate.

| Diagnosis | Owning phase | Resulting state |
|---|---|---|
| Phase 3 vocabulary exists and is adequate, but was selected or arranged poorly | Phase 4 | RETURN_TO_BLUEPRINT |
| The composition does not express the stated creative direction | Phase 4 | RETURN_TO_BLUEPRINT |
| Phase 3 vocabulary is genuinely inadequate for the need | Phase 3 | NEEDS_HUMAN_REVIEW, handled as a factory-level change |
| Composition was correct in the blueprint but built incorrectly | Phase 5 | REFINING |

**Rule:** A project run never resolves a Phase 3 inadequacy by inventing new vocabulary locally. That is a factory change and requires human review.

## 5. Accessibility Problems

| Diagnosis | Owning phase | Resulting state |
|---|---|---|
| Correct blueprint, defective implementation | Phase 5 | REFINING |
| Rendered-state defect visible only in the result, such as contrast in context or focus visibility | Phase 6 | REFINING |
| The blueprint decision itself cannot be made accessible | Phase 4 | RETURN_TO_BLUEPRINT |
| Required accessible content, such as meaningful alternative text, is missing | Input and research | NEEDS_CONTENT |

Accessibility findings are never accepted as outstanding at Final Approval when they are of blocking severity. See `quality-gates.md` §8.

## 6. Conversion Problems

Conversion defects are diagnosed by asking which layer failed.

| Diagnosis | Owning phase | Resulting state |
|---|---|---|
| The strategy is wrong: wrong emphasis, wrong narrative order, wrong priority for this business | Phase 4 | RETURN_TO_BLUEPRINT |
| The strategy is right but the build weakened it: hierarchy, prominence, or clarity lost in implementation | Phase 5 | REFINING |
| Strategy and build are sound but the rendered result reads poorly | Phase 6 | REFINING |
| The business lacks the facts or proof the strategy depends on | Research | RETURN_TO_RESEARCH |
| The business lacks assets the strategy depends on | Input and research | NEEDS_ASSETS |

## 7. Diagnostic Sequence

For any finding, resolve in this order and stop at the first affirmative:

| Order | Question | If yes |
|---|---|---|
| 1 | Is a presented fact wrong, unverified, or fabricated? | RETURN_TO_RESEARCH |
| 2 | Is required content missing? | NEEDS_CONTENT |
| 3 | Is required asset material missing, unapproved, or insufficient? | NEEDS_ASSETS |
| 4 | Is source access blocked by authorisation? | NEEDS_CREDENTIALS |
| 5 | Is the blueprint decision itself wrong for this business? | RETURN_TO_BLUEPRINT |
| 6 | Does resolution require new Phase 3 vocabulary? | NEEDS_HUMAN_REVIEW |
| 7 | Was the blueprint implemented unfaithfully? | Phase 5 correction, or REFINING post-build |
| 8 | Is this rendered execution quality within Phase 6 scope? | REFINING |
| 9 | Is the root cause still unclear? | NEEDS_HUMAN_REVIEW |

Ordering matters. Business truth outranks design, and design outranks implementation. See `source-of-truth.md`.

## 8. Regression Effects

When a phase regresses, downstream artifacts are invalidated so that stale decisions cannot survive.

| Regression | Invalidated |
|---|---|
| RETURN_TO_RESEARCH | Business intelligence, brand profile, creative direction, composition plan, blueprint, implementation, critic report |
| RETURN_TO_BLUEPRINT | Composition plan and blueprint as affected, implementation as affected, critic report |
| REFINING | Critic report for the affected findings, pending re-critique |

**Rules**

1. An invalidated artifact is reproduced by its owning role, not edited by a downstream role.
2. Regression re-enters the normal gate sequence. Gates are not skipped because the work is a repeat.
3. Human Gate 1 or Gate 2 must be re-approved when its subject matter changed materially.
4. Iterations are versioned rather than overwritten. See `versioning.md`.
5. `criticIteration` continues across REFINING cycles. It resets to 1 only when a regression produces a new Design Blueprint, per `state-machine.md` §6. That reset rule is factory-defined V1.

**Rendered Result on regression.** A Rendered Result is bound to one implementation version and is never re-used across implementation versions, per `artifact-contracts.md` §5.12. Any regression that invalidates the implementation also invalidates its Rendered Result.

## 9. Routing Invariants

1. Every finding carries a root cause and an owning phase before any repair begins.
2. Symptom location never determines ownership.
3. No role repairs a defect it lacks authority over.
4. Wholesale rebuilds are not a routing outcome.
5. Unclear ownership routes to NEEDS_HUMAN_REVIEW, never to a best guess.
6. All routing targets are states defined in `state-machine.md`. Critic recommendation vocabulary is mapped to those states in §3.1 and is never treated as a state.
