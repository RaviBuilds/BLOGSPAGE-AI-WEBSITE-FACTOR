---
document: Blogspage AI Website Factory
layer: Control Plane
status: draft
version: 0.2.0
---

# State Machine

**Derived from:** Phase 0 — Factory Operating System, §0.2.

**Scope boundary:** This document defines project state and legal transitions. It does not define work content within a state. Stage detail is in `workflow.md`.

---

## 1. Rules

1. A project has exactly one state at any time.
2. Only transitions listed in this document are legal.
3. A state may be exited only when its exit condition is met.
4. Every exception state must record a return target before it is entered.
5. No state is a dead end except DELIVERED.
6. The 11 primary and 7 exception states below are the complete set. New states must not be introduced by a project run.

## 2. Primary States

### NEW

| Aspect | Definition |
|---|---|
| Entry condition | A project is registered with an isolated workspace |
| Responsibility | Control Plane |
| Exit condition | Business is unambiguously identified and at least one usable research entry point exists |
| Valid next states | RESEARCHING, NEEDS_CONTENT, NEEDS_ASSETS, NEEDS_CREDENTIALS, BLOCKED |

### RESEARCHING

| Aspect | Definition |
|---|---|
| Entry condition | Project input accepted |
| Responsibility | Research Agent |
| Exit condition | Research complete, business intelligence complete, provenance recorded, Research Validation gate passed |
| Valid next states | RESEARCH_READY, RETURN_TO_RESEARCH, NEEDS_CONTENT, NEEDS_ASSETS, NEEDS_CREDENTIALS, NEEDS_HUMAN_REVIEW, BLOCKED |

### RESEARCH_READY

RESEARCH_READY means all four of the following are true:

1. raw research is complete
2. business intelligence is complete
3. required research artifacts are validated
4. the Business Intelligence Package is ready for Creative Direction

| Aspect | Definition |
|---|---|
| Entry condition | Research Validation gate passed |
| Responsibility | Control Plane, pending human Gate 1 |
| Exit condition | Human Gate 1 — Business Understanding — approved |
| Valid next states | CREATIVE_DIRECTION, RETURN_TO_RESEARCH, NEEDS_HUMAN_REVIEW, BLOCKED |

### CREATIVE_DIRECTION

| Aspect | Definition |
|---|---|
| Entry condition | Gate 1 approved |
| Responsibility | Creative Director, with Composition Designer |
| Exit condition | Creative direction, composition plan, and design blueprint produced and Blueprint Validation gate passed |
| Valid next states | BLUEPRINT_READY, RETURN_TO_RESEARCH, NEEDS_ASSETS, NEEDS_HUMAN_REVIEW, BLOCKED |

This state contains the Creative Direction, Composition, and Design Blueprint stages.

### BLUEPRINT_READY

| Aspect | Definition |
|---|---|
| Entry condition | Blueprint Validation gate passed |
| Responsibility | Control Plane, pending human Gate 2 |
| Exit condition | Human Gate 2 — Design Blueprint — approved |
| Valid next states | IMPLEMENTING, RETURN_TO_BLUEPRINT, RETURN_TO_RESEARCH, NEEDS_HUMAN_REVIEW, BLOCKED |

### IMPLEMENTING

| Aspect | Definition |
|---|---|
| Entry condition | Gate 2 approved |
| Responsibility | Implementation Engineer |
| Exit condition | Website builds, blueprint decisions are honoured, implementation report produced, Implementation Validation gate passed |
| Valid next states | BUILD_READY, RETURN_TO_BLUEPRINT, NEEDS_CONTENT, NEEDS_ASSETS, NEEDS_HUMAN_REVIEW, BLOCKED |

### BUILD_READY

| Aspect | Definition |
|---|---|
| Entry condition | Implementation Validation gate passed |
| Responsibility | Control Plane |
| Exit condition | Rendered website is available for independent critique |
| Valid next states | CRITIQUING, RETURN_TO_BLUEPRINT, BLOCKED |

BUILD_READY is not an approval state. It records that the build is critique-ready.

### CRITIQUING

| Aspect | Definition |
|---|---|
| Entry condition | Rendered website available. The Control Plane increments `criticIteration` on entry, per §6 |
| Responsibility | Independent Critic |
| Exit condition | Critic report produced; every finding carries a root cause and an owning phase |
| Valid next states | APPROVED, REFINING, RETURN_TO_BLUEPRINT, RETURN_TO_RESEARCH, NEEDS_ASSETS, NEEDS_CONTENT, NEEDS_HUMAN_REVIEW, BLOCKED |

### REFINING

| Aspect | Definition |
|---|---|
| Entry condition | Critic report contains findings owned by Phase 6, **or** findings owned by Phase 5 that were discovered after rendering, per `failure-routing.md` §3 |
| Responsibility | Refinement Engineer coordinates the refinement plan. The **Implementation Engineer** performs the implementation correction for any Phase 5-owned finding. Ownership of the correction follows the owning phase; it does not transfer to the Refinement Engineer. |
| Exit condition | All assigned findings addressed and recorded against their finding |
| Valid next states | CRITIQUING, RETURN_TO_BLUEPRINT, RETURN_TO_RESEARCH, NEEDS_HUMAN_REVIEW, BLOCKED |

REFINING always returns to CRITIQUING. Refinement may not advance a project to APPROVED.

**Post-build implementation defects.** `failure-routing.md` §3 routes an implementation problem to "Remains in IMPLEMENTING, or REFINING when found post-build." REFINING is therefore the state for a Phase 5-owned defect discovered in the rendered result. Phase 5 retains ownership of the correction; only the Independent Critic may confirm the finding resolved, and re-evaluation returns to CRITIQUING.

**`RETURN_TO_IMPLEMENTATION` is not a factory state.** The term appears in Phase 6 source vocabulary (`01-DOCUMENTATION/06-independent-critic.md` §22.5, §27.2) as a destination name. It resolves to REFINING under this section. Rule 6 above is unchanged: the state set is complete and `RETURN_TO_IMPLEMENTATION` is not a member of it.

**`REBUILD` is recommendation vocabulary, not state vocabulary.** See `failure-routing.md` §3.1.

**`criticIteration`.** Each entry into CRITIQUING increments `criticIteration`, which the Control Plane stamps. See §6.

### APPROVED

| Aspect | Definition |
|---|---|
| Entry condition | Critic Validation gate passed and human Gate 3 — Final Website — approved |
| Responsibility | Human approver |
| Exit condition | Delivery prepared and version-stamped |
| Valid next states | DELIVERED, REFINING, RETURN_TO_BLUEPRINT, RETURN_TO_RESEARCH |

### DELIVERED

| Aspect | Definition |
|---|---|
| Entry condition | Approved website delivered and recorded |
| Responsibility | Control Plane |
| Exit condition | Terminal |
| Valid next states | None. Later work opens a new versioned iteration per `versioning.md` |

---

## 3. Exception States

Every exception state records the state it was entered from and the state it must return to. No exception state may transition directly to APPROVED or DELIVERED.

### BLOCKED

| Aspect | Definition |
|---|---|
| Entry condition | Progress is impossible and the cause is not covered by a more specific exception state |
| Responsibility | Control Plane, escalating to human |
| Exit condition | Cause removed and recorded |
| Valid next states | The recorded return state, or NEEDS_HUMAN_REVIEW |

### NEEDS_HUMAN_REVIEW

| Aspect | Definition |
|---|---|
| Entry condition | A decision exceeds agent authority, or a gate failure is ambiguous in ownership |
| Responsibility | Human |
| Exit condition | Human decision recorded |
| Valid next states | The recorded return state, RETURN_TO_RESEARCH, RETURN_TO_BLUEPRINT, or BLOCKED |

### NEEDS_CONTENT

| Aspect | Definition |
|---|---|
| Entry condition | Required business content is missing, unverifiable, or insufficient |
| Responsibility | Human submitter, supported by Research Agent |
| Exit condition | Content supplied or verified, and provenance recorded |
| Valid next states | RESEARCHING, the recorded return state, or BLOCKED |

Missing content is never resolved by invention. See `source-of-truth.md`.

### NEEDS_ASSETS

| Aspect | Definition |
|---|---|
| Entry condition | Required assets are missing, unapproved, or unusable for the intended composition |
| Responsibility | Human approver, supported by Research Agent |
| Exit condition | Assets supplied and moved to approved status per `artifact-contracts.md` |
| Valid next states | RESEARCHING, CREATIVE_DIRECTION, the recorded return state, or BLOCKED |

### NEEDS_CREDENTIALS

| Aspect | Definition |
|---|---|
| Entry condition | An authorised source requires credentials or permission the factory does not hold |
| Responsibility | Human submitter |
| Exit condition | Credentials or authorisation supplied, or the source is formally excluded |
| Valid next states | RESEARCHING, the recorded return state, or BLOCKED |

Unauthorised access is never an acceptable substitute.

### RETURN_TO_RESEARCH

| Aspect | Definition |
|---|---|
| Entry condition | Root cause is business understanding, factual accuracy, or research completeness |
| Responsibility | Research Agent |
| Exit condition | Research and business intelligence corrected and revalidated |
| Valid next states | RESEARCHING |

Downstream artifacts affected by the correction are invalidated, not patched.

### RETURN_TO_BLUEPRINT

| Aspect | Definition |
|---|---|
| Entry condition | Root cause is creative strategy, composition strategy, or a blueprint decision |
| Responsibility | Creative Director, with Composition Designer |
| Exit condition | Blueprint corrected and revalidated |
| Valid next states | CREATIVE_DIRECTION |

Implementation output affected by a blueprint change is invalidated, not patched.

---

## 4. Transition Table

| From | To |
|---|---|
| NEW | RESEARCHING, NEEDS_CONTENT, NEEDS_ASSETS, NEEDS_CREDENTIALS, BLOCKED |
| RESEARCHING | RESEARCH_READY, RETURN_TO_RESEARCH, NEEDS_CONTENT, NEEDS_ASSETS, NEEDS_CREDENTIALS, NEEDS_HUMAN_REVIEW, BLOCKED |
| RESEARCH_READY | CREATIVE_DIRECTION, RETURN_TO_RESEARCH, NEEDS_HUMAN_REVIEW, BLOCKED |
| CREATIVE_DIRECTION | BLUEPRINT_READY, RETURN_TO_RESEARCH, NEEDS_ASSETS, NEEDS_HUMAN_REVIEW, BLOCKED |
| BLUEPRINT_READY | IMPLEMENTING, RETURN_TO_BLUEPRINT, RETURN_TO_RESEARCH, NEEDS_HUMAN_REVIEW, BLOCKED |
| IMPLEMENTING | BUILD_READY, RETURN_TO_BLUEPRINT, NEEDS_CONTENT, NEEDS_ASSETS, NEEDS_HUMAN_REVIEW, BLOCKED |
| BUILD_READY | CRITIQUING, RETURN_TO_BLUEPRINT, BLOCKED |
| CRITIQUING | APPROVED, REFINING, RETURN_TO_BLUEPRINT, RETURN_TO_RESEARCH, NEEDS_ASSETS, NEEDS_CONTENT, NEEDS_HUMAN_REVIEW, BLOCKED |
| REFINING | CRITIQUING, RETURN_TO_BLUEPRINT, RETURN_TO_RESEARCH, NEEDS_HUMAN_REVIEW, BLOCKED |
| APPROVED | DELIVERED, REFINING, RETURN_TO_BLUEPRINT, RETURN_TO_RESEARCH |
| DELIVERED | terminal |
| BLOCKED | recorded return state, NEEDS_HUMAN_REVIEW |
| NEEDS_HUMAN_REVIEW | recorded return state, RETURN_TO_RESEARCH, RETURN_TO_BLUEPRINT, BLOCKED |
| NEEDS_CONTENT | RESEARCHING, recorded return state, BLOCKED |
| NEEDS_ASSETS | RESEARCHING, CREATIVE_DIRECTION, recorded return state, BLOCKED |
| NEEDS_CREDENTIALS | RESEARCHING, recorded return state, BLOCKED |
| RETURN_TO_RESEARCH | RESEARCHING |
| RETURN_TO_BLUEPRINT | CREATIVE_DIRECTION |

## 5. Invariants

1. APPROVED is reachable only from CRITIQUING. No state bypasses independent critique.
2. DELIVERED is reachable only from APPROVED.
3. REFINING cannot reach APPROVED directly; it must pass through CRITIQUING.
4. Gate 1 governs RESEARCH_READY → CREATIVE_DIRECTION. Gate 2 governs BLUEPRINT_READY → IMPLEMENTING. Gate 3 governs CRITIQUING → APPROVED.
5. Every state except DELIVERED has at least one legal outward transition.
6. Every routing destination named in `failure-routing.md` resolves to a state in §4. Source vocabulary that names a non-state destination is mapped, not adopted. See REFINING and §6.

---

## 6. criticIteration

`criticIteration` is a Control-Plane-stamped provenance ordinal. It records which critique cycle an artifact belongs to.

| Aspect | Definition |
|---|---|
| Owner | Control Plane |
| Stamped by | Control Plane. No agent authors it. Producing roles read it. |
| Scope | Per project, per critique cycle |
| Type | Provenance ordinal. **Not** a version status and **not** a workflow state. |
| First value | 1, on first entry into CRITIQUING |
| Increment | +1 on each entry into CRITIQUING for the same strategic design, including ordinary implementation refinement cycles |
| Reset | Resets to 1 after a material upstream strategic regression that produces a new Design Blueprint. **FACTORY-DEFINED V1 — not source-derived.** |
| Maximum | None encoded. See below. |

**Recorded on.** Critic Report, Refinement Plan, and Rendered Result, per `artifact-contracts.md` §5.7, §5.8 and §5.12.

**Relationship to versioning.** `criticIteration` is independent of the CURRENT / SUPERSEDED / HISTORICAL model in `versioning.md` §6.2. Each new critic report supersedes its predecessor as an artifact; `criticIteration` is the ordinal of the cycle, not the status of the artifact.

**Reset rule provenance.** The increment rule follows from the state machine: REFINING exits only to CRITIQUING, so re-evaluation increments. The reset rule is **factory-defined V1** and is recorded as such per `phase-ownership-matrix.md` §6 decision 4a. The source states no reset behaviour.

**No numeric maximum.** `01-DOCUMENTATION/06-independent-critic.md` §29 places "Escalate after three failed cycles" in the critic's **MAY** column, against "Overrule the human reviewer" in MUST NOT. It is a permission to escalate, not an automatic cap. At `criticIteration` 3 the Independent Critic **may** route to NEEDS_HUMAN_REVIEW. The Control Plane does not terminate a project on this counter.
