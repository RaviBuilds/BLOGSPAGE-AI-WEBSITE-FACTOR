---
document: Blogspage AI Website Factory
layer: Control Plane
status: draft
version: 0.2.0
---

# Artifact Contracts

**Derived from:** Phase 0 — Factory Operating System, §0.4, §0.8, §0.9, §0.11, §0.12; Phase 4 §4.2, §4.3.

**Scope boundary:** This document defines artifact purpose, ownership, and validation expectation. It does not define artifact file format. No schemas are defined at this version.

---

## 1. Handoff Philosophy

Artifacts are the only sanctioned communication channel between roles. Per §0.11, every stage has a defined output, and that output is how the next stage receives its input.

**Rules**

1. Every artifact declares one producing role and at least one consuming role.
2. A consuming role must not infer information the artifact does not state.
3. A consuming role must not modify an artifact it consumes.
4. An artifact is either complete or incomplete. Partial artifacts do not pass gates.
5. When required information is unavailable, the artifact records it as unknown. It is never filled by invention.
6. Per §0.12, a role must not proceed on an incomplete upstream artifact.
7. All project artifacts live inside that project's workspace. No artifact is shared across projects.
8. An approved artifact is immutable. A role needing it changed raises regression rather than editing it, per `versioning.md` §6.1.

A role resolves every artifact reference to its CURRENT version. Superseded versions are never valid input. See `versioning.md` §6.2.

## 2. Provenance Requirement

Per §0.8, every factual item carried by any artifact records:

| Element | Requirement |
|---|---|
| Fact | The claim itself |
| Value | The stated value |
| Source | Where it came from |
| Source type | The kind of source |
| Confidence | Strength of support |
| Verification status | Verified, inferred, or unknown |

A factual item without provenance is treated as unknown, regardless of plausibility.

## 3. Asset Status Lifecycle

Per §0.9, assets move through explicit statuses:

```
DISCOVERED → REVIEWED → APPROVED → USED
DISCOVERED → REJECTED
```

| Status | Meaning | Who sets it |
|---|---|---|
| Discovered | Found during research, not yet reviewed | Research Agent |
| Reviewed | Examined, awaiting decision | Human |
| Approved | Cleared for use | Human |
| Used | Consumed by the implementation | Implementation Engineer |
| Rejected | Not permitted for use | Human |

**Rules**

1. Only approved assets may be used in implementation.
2. The Research Agent may not approve assets it discovered.
3. A rejected asset may not be reintroduced without a new human decision.
4. Insufficient approved assets is an asset problem, not a design defect. It routes to NEEDS_ASSETS.

---

## 4. Artifact Register

| Artifact | Producer | Primary consumer |
|---|---|---|
| Business research | Research Agent | Research Agent (intelligence), Creative Director |
| Business intelligence | Research Agent | Creative Director |
| Asset inventory | Research Agent, approved by human | Creative Director, Composition Designer, Implementation Engineer |
| Brand profile | Research Agent | Creative Director |
| Creative direction | Creative Director | Creative Director (blueprint), human approver, Independent Critic |
| Design blueprint | Creative Director | Implementation Engineer, Independent Critic |
| Implementation report | Implementation Engineer | Independent Critic |
| Rendered result | Implementation Engineer, via the build | Independent Critic |
| Critic report | Independent Critic | Human approver, Refinement Engineer, Creative Director |
| Refinement plan | Independent Critic | Refinement Engineer |
| Final report | Control Plane | Human approver |

The composition plan is a component of the design blueprint record, per §0.4, and is produced by the Composition Designer. It is **not** a peer artifact and has no row of its own in this register. Its contract is §5.11, which defines it as a blueprint component. See `phase-ownership-matrix.md` §6 decision 13.

---

## 5. Artifact Definitions

### 5.1 Business Research

| Aspect | Definition |
|---|---|
| Purpose | Record what can be found and sourced about the business |
| Producing role | Research Agent |
| Consuming role | Research Agent for intelligence structuring; Creative Director |
| Required information | Business identity and location; services or offerings as stated by the business; contact and operating details; public reputation signals; discovered assets; competitor observations; the source list, with what each source did and did not establish; explicit gaps |
| Validation expectation | Every factual item carries provenance. Gaps are stated, not filled. No fabricated reviews, statistics, credentials, or affiliations. |

### 5.2 Business Intelligence

| Aspect | Definition |
|---|---|
| Purpose | Convert research into a structured, truth-classified package usable for creative decisions |
| Producing role | Research Agent |
| Consuming role | Creative Director |
| Required information | Verified facts; inferred traits, labelled as inferred; unknowns, named explicitly; audience understanding; service structure; positioning signals; SEO-relevant business context; constraints imposed by content or asset reality |
| Validation expectation | Every item classified as verified, inferred, or unknown, per §4.3. Inference is never presented as fact. The package satisfies the Phase 4 input contract, per §4.2. |

This is the artifact referred to as the Business Intelligence Package.

### 5.3 Asset Inventory

| Aspect | Definition |
|---|---|
| Purpose | Record every candidate asset and its approval status |
| Producing role | Research Agent discovers; human approves |
| Consuming role | Creative Director, Composition Designer, Implementation Engineer |
| Required information | Asset identity; origin and source; usage-rights position; current status per §3 above; suitability observations, including quality and quantity limits |
| Validation expectation | No asset is approved by the role that discovered it. Implementation reads only approved entries. Asset scarcity is recorded as a constraint rather than left implicit. |

### 5.4 Brand Profile

| Aspect | Definition |
|---|---|
| Purpose | Record observed brand reality as fact, separate from creative recommendation |
| Producing role | Research Agent |
| Consuming role | Creative Director |
| Required information | Existing name usage and naming conventions; existing marks or logos where present; observed colour and typographic usage; observed tone of voice; existing brand inconsistencies |
| Validation expectation | Observation only. Recommendations, aspirations, and target aesthetics are out of scope and belong to creative direction. Absence of an existing brand is recorded as such. |

Per §0.4, the brand profile is stored outside the blueprint record because it holds facts, not decisions.

### 5.5 Design Blueprint

| Aspect | Definition |
|---|---|
| Purpose | Serve as the binding design decision record that governs implementation |
| Producing role | Creative Director, incorporating the Composition Designer's composition plan |
| Consuming role | Implementation Engineer, Independent Critic |
| Required information | Design intent statement; selected visual grammar and rationale; narrative strategy; composition plan, including section sequence and arrangement; imagery strategy tied to approved assets; content mapping to verified facts; accessibility and SEO expectations; explicitly stated constraints; the CURRENT registry versions resolved against |
| Validation expectation | Every decision traceable to business intelligence or stated creative rationale. Precise enough to implement without guesswork. Contains no unverified factual claim. Uses only Phase 3 vocabulary. |

The blueprint is authoritative over implementation. See `source-of-truth.md`.

The registry versions recorded are the **exact versions consumed** when the blueprint was produced, resolved as CURRENT at that moment, per §7 and `versioning.md` §5. Recording them establishes what the blueprint was resolved against; it confers no authority over the registries or over canonical documentation, per `versioning.md` §3.1.

**Design Intent Statement.** The blueprint carries the approved Design Intent Statement **by reference** to the Creative Direction artifact, §5.10, and records the exact Creative Direction version consumed. The blueprint does not re-author it. Exactly one authored instance exists per project, per §6 invariant 7.

**Composition Plan.** The composition plan is a component of this record, contracted at §5.11. It is not a separate artifact and carries no independent version.

### 5.6 Implementation Report

| Aspect | Definition |
|---|---|
| Purpose | Declare how the blueprint was realised and where reality diverged from it |
| Producing role | Implementation Engineer |
| Consuming role | Independent Critic |
| Required information | Blueprint decisions implemented; deviations, with reason and the blueprint decision affected; assets used, by approved identity; content sources used; accessibility, SEO, and performance measures applied; known limitations; unresolved conflicts; the CURRENT registry versions implemented against |
| Validation expectation | Deviations are declared, never silent. An empty deviation list asserts full blueprint fidelity. Build success is reported as a fact, not as a quality claim. |

The registry versions recorded are those CURRENT at the time of the build, per `versioning.md` §5. Where they differ from the versions the blueprint was resolved against, the difference is a declared deviation like any other. Recording them confers no authority over the registries or over canonical documentation, per `versioning.md` §3.1.

### 5.7 Critic Report

| Aspect | Definition |
|---|---|
| Purpose | Record an independent judgement of the rendered website |
| Producing role | Independent Critic |
| Consuming role | Human approver, Refinement Engineer, Creative Director on regression |
| Required information | Assessment of the rendered result; per-finding description, severity, root cause, and owning phase; intent test result against the design intent statement; accessibility findings; factual-integrity findings; an explicit overall verdict; `criticIteration`; the exact Rendered Result and implementation version evaluated |
| Validation expectation | Every finding has a root cause and an owning phase. Verdict is unambiguous. Judgement addresses the rendered outcome, not source-code intent. |

**Verdict vocabulary.** The verdict is a **recommendation**, not a state. `failure-routing.md` §3.1 maps each recommendation to a state. `REBUILD` is a valid recommendation and never a state. The critic does not transition the project.

**Intent test.** The intent test is performed against the Design Intent Statement as authored in the Creative Direction artifact, §5.10, and carried into the blueprint by reference.

**`criticIteration`** is stamped by the Control Plane, per `state-machine.md` §6. The critic records it; it does not author it.

The exact versions recorded are those actually consumed, per §7.

### 5.8 Refinement Plan

| Aspect | Definition |
|---|---|
| Purpose | Specify which findings are to be corrected, by which role, at which phase |
| Producing role | Independent Critic |
| Consuming role | Refinement Engineer, and the owning role for regressed findings |
| Required information | Finding reference; assigned owning phase; assigned executing role; whether refinement or regression is required; ordering where findings interact; findings deliberately not actioned, with reason; `criticIteration` |
| Validation expectation | No finding is assigned to a role lacking authority to resolve it. Findings requiring blueprint change are marked for regression rather than refinement. |

**Executing role.** A finding owned by Phase 6 is executed by the Refinement Engineer. A finding owned by Phase 5 and discovered post-build is executed by the **Implementation Engineer** inside REFINING, per `state-machine.md` REFINING. The Refinement Engineer coordinates the plan in both cases and does not become the implementation owner.

**`criticIteration`** is the cycle whose findings this plan addresses. Stamped by the Control Plane, per `state-machine.md` §6.

### 5.9 Final Report

| Aspect | Definition |
|---|---|
| Purpose | Present the delivery case to the human approver and record the delivered state |
| Producing role | Control Plane |
| Consuming role | Human approver |
| Required information | Business understanding summary as approved at Gate 1; design direction as approved at Gate 2; critic verdict and outstanding accepted findings; refinement history, including the `criticIteration` of each cycle; factory and project versions used; delivery contents |
| Validation expectation | Reflects the actual delivered state. Outstanding accepted findings are disclosed, not omitted. |

The refinement history records each critique cycle by `criticIteration`, per `state-machine.md` §6. Where a reset occurred, the regression that caused it is recorded alongside it.

### 5.10 Creative Direction

| Aspect | Definition |
|---|---|
| Purpose | Record the business-specific creative point of view, and author the Design Intent Statement, before binding design decisions are made |
| Owning phase | Phase 4, per `phase-ownership-matrix.md` Row 36 |
| Producing role | Creative Director |
| Consuming role | Creative Director when producing the blueprint; human approver; Independent Critic for the intent test |
| Scope | Per project. One CURRENT version at a time. |
| Required information | **The Design Intent Statement, authored here**; creative rationale for the direction taken; positioning read drawn from business intelligence; brand personality and maturity assessment; the exact versions of the business intelligence, brand profile, and asset inventory consumed |
| Validation expectation | Creative Direction Validation gate, `quality-gates.md` §4. Direction is grounded in business truth, not aspiration. Facts are not introduced here. |

**The Design Intent Statement is authoritative in this artifact.** The Design Blueprint consumes it by reference and does not re-author it, per §5.5. There is exactly one authored instance in the factory. `quality-gates.md` §7.1 requires the Independent Critic to test the rendered result against it.

**Lifecycle.** Produced within the CREATIVE_DIRECTION state, before the blueprint. Versioned per `versioning.md` §6.2 as CURRENT / SUPERSEDED / HISTORICAL. An approved Creative Direction is immutable; change routes to RETURN_TO_BLUEPRINT.

The exact versions recorded are those actually consumed, per §7.

### 5.11 Composition Plan

| Aspect | Definition |
|---|---|
| Purpose | State the concrete section sequence and per-section arrangement for one project |
| Owning phase | Phase 4, per `phase-ownership-matrix.md` §6 decision 13 |
| Producing role | Composition Designer |
| Consuming role | Creative Director, who incorporates it into the blueprint; thereafter the Implementation Engineer and Independent Critic read it through the blueprint |
| Scope | **A component of the Design Blueprint record, not a peer artifact.** Per §0.4 and §4 above. |
| Required information | Concrete section sequence; per-section arrangement; pattern selections; narrative transitions between sections |
| Validation expectation | Evaluated as part of Blueprint Validation, `quality-gates.md` §2 and §5, which assesses "Design blueprint, including composition plan." There is no separate composition gate. |

**Versioning.** Versioned with its containing blueprint. It has no independent version, no independent CURRENT status, and no independent lifecycle.

**Vocabulary vs decision.** The plan is written wholly in Phase 3 vocabulary and remains a Phase 4 artifact. Supplying the words does not transfer the decision right. See `phase-ownership-matrix.md` §6 decisions 13, 14 and 15, and Row 34's artifact chain.

### 5.12 Rendered Result

| Aspect | Definition |
|---|---|
| Purpose | Be the artifact the Independent Critic evaluates. Distinct from source code. |
| Producing role | Implementation Engineer, via the build |
| Consuming role | Independent Critic |
| Capture record owner | Control Plane |
| Scope | Bound to exactly one implementation version, for exactly one `criticIteration` |
| Required information | The exact **implementation version** rendered; **capture context** — viewport, per the three compositions required by Phase 1: desktop, tablet, mobile; **capture state** — what interaction or scroll state was captured; **`criticIteration`**; capture timestamp |
| Validation expectation | Produced under Implementation Validation, `quality-gates.md` §6. Consumed under Critic Validation, §7.1, which requires judgement of the rendered result rather than source-code intent. |

**Never re-used across implementation versions.** A Rendered Result is invalid as evidence for any implementation version other than the one it captured. A new build requires a new capture. See `failure-routing.md` §8.

**Implementation version, defined.** The "exact implementation version rendered",
required above, is the Implementation Report's `artifactVersion` for the build that
produced this capture, per §5.6 and §7. It is recorded as that exact number, never
as the label CURRENT.

**Lifecycle.** Available at BUILD_READY, whose exit condition is "Rendered website is available for independent critique." Invalidated whenever its implementation is invalidated.

**Capture context does not resolve the tablet gap.** Recording a tablet viewport makes the gap explicit, it does not close it. No breakpoint values exist in any canonical document, and none are defined here. Phase 6 states no tablet-specific evaluation criteria. Both remain unresolved and are recorded in §8.

---

## 6. Contract Invariants

1. Facts enter the system only through business research and business intelligence.
2. Design decisions enter the system only through the design blueprint.
3. Judgement enters the system only through the critic report.
4. No artifact may contradict a verified fact recorded upstream.
5. An artifact that cannot be completed truthfully triggers an exception state rather than a lower-quality substitute.
6. An approved artifact changes only by new version, never by in-place edit.
7. There is exactly one authored Design Intent Statement per project, in the Creative Direction artifact, §5.10. Every other reference is by reference.
8. A Rendered Result is bound to one implementation version and is never re-used across versions, §5.12.
9. A produced artifact records the **exact** versions it consumed, §7.

---

## 7. Version Resolution and Recording

Two distinct operations, per `versioning.md` §5 and §6.2.

| Operation | Rule |
|---|---|
| **Resolution**, while work is in progress | A role resolves every artifact and registry reference to its **CURRENT** version. Superseded versions are never valid input. |
| **Recording**, at the moment an artifact is produced | The produced artifact stamps the **exact versions actually consumed**, not the label `CURRENT`. |

Recording `CURRENT` alone is insufficient, because `CURRENT` moves. An artifact must remain interpretable after the versions it consumed have been superseded.

**Applies to**

| Consumed input | Recorded on |
|---|---|
| Registry versions — parameter, design language, phase ownership, critic metrics | Creative Direction, Design Blueprint, Implementation Report, Critic Report |
| Upstream artifact versions — business intelligence, brand profile, asset inventory | Creative Direction, Design Blueprint |
| Creative Direction version, including the Design Intent Statement | Design Blueprint |
| Design Blueprint version | Implementation Report, Critic Report |
| Implementation version | Rendered Result, Critic Report |
| Rendered Result identity and `criticIteration` | Critic Report, Refinement Plan |

**Implementation version defined.** The Implementation Report (§5.6) is the sole
artifact whose version constitutes "implementation version" for a given build. Its
`artifactVersion` — incrementing once per build, per `versioning.md` §4 — is the
authoritative implementation version referenced in this table's Rendered Result and
Critic Report rows, and in `versioning.md` §5's "Critic report" row. No separate
implementation-versioning identity exists.

**Rules**

1. Resolution uses CURRENT. Recording uses the exact version consumed.
2. Recording a consumed version confers no authority over the consumed document, per `versioning.md` §3.1.
3. No version number is invented. Only versions that exist in the consumed documents are recorded.
4. Where a recorded version differs from what an upstream artifact recorded, the difference is a declared deviation, per §5.6.

---

## 8. Unresolved at This Version

Recorded, not resolved. No item below is filled by invention.

| # | Item | Affects |
|:--:|---|---|
| 1 | No schemas are defined. This document defines contracts only. | All artifacts |
| 2 | Breakpoint values are undefined in every canonical document. The Rendered Result capture context names three viewports without defining their boundaries. | §5.12 |
| 3 | Phase 6 states no tablet-specific evaluation criteria, though tablet is a required composition and a required capture. | §5.12 |
| 4 | The Business Intelligence Package's internal structure is unreconciled against the research file layout. | §5.2 |
| 5 | The Pattern Library is empty: 0 of ~87 patterns specified. Composition Plan pattern selections have no populated set to select from. | §5.11 |
| 6 | `criticIteration` reset behaviour is factory-defined V1, not source-derived. | §5.7, §5.8, §5.12 |
