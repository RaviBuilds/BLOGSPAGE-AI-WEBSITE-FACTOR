---
document: Blogspage AI Website Factory
layer: Control Plane
status: draft
version: 0.2.0
---

# Quality Gates

**Derived from:** Phase 0 — Factory Operating System, §0.9, §0.10, §0.12.

**Scope boundary:** This document defines validation checkpoints and their ownership. It does not define design criteria; the substance of design judgement belongs to Phases 1–6.

---

## 1. Gate Rules

Per §0.12, an agent must not proceed when the previous output is incomplete.

1. Each gate is evaluated by a role other than the one that produced the artifact under review.
2. A gate result is pass or fail. There is no conditional pass.
3. A failed gate must state the root cause and the owning phase before the project leaves the gate.
4. Failure handling is defined in `failure-routing.md`. Gates diagnose; they do not repair.
5. A successful build satisfies no gate on its own.
6. A gate may not be waived to preserve schedule.

## 2. Gate Register

| Gate | Evaluates | Gate owner | State transition governed |
|---|---|---|---|
| Research Validation | Business research, business intelligence, asset inventory, brand profile | Control Plane | RESEARCHING → RESEARCH_READY |
| Creative Direction Validation | Creative Direction artifact, including the authoritative Design Intent Statement | Control Plane | Within CREATIVE_DIRECTION |
| Blueprint Validation | Design blueprint, including composition plan | Control Plane | CREATIVE_DIRECTION → BLUEPRINT_READY |
| Implementation Validation | Website source, implementation report, Rendered Result | Control Plane | IMPLEMENTING → BUILD_READY |
| Critic Validation | Critic report and refinement plan | Control Plane | CRITIQUING → APPROVED or REFINING |
| Final Approval | Complete delivery case | Human approver | CRITIQUING → APPROVED, and APPROVED → DELIVERED |

Human approval gates 1, 2, and 3 are defined in `human-approval.md`. They sit after Research Validation, after Blueprint Validation, and at Final Approval respectively.

---

## 3. Research Validation

Business Intelligence Validation is not a separate gate. It is a named check group inside this gate. Both groups are blocking.

### 3.1 Research Completeness checks

| Must be true |
|---|
| The business is unambiguously identified |
| Services or offerings are recorded as stated by the business |
| Contact and operating details are recorded or explicitly marked unknown |
| Every factual item carries source, source type, and verification status |
| Sources are recorded, including what each source failed to establish |
| Gaps are stated explicitly |
| Discovered assets are recorded with status |

### 3.2 Business Intelligence Completeness checks

| Must be true |
|---|
| Every item is classified verified, inferred, or unknown |
| Inferred traits are labelled as inferred |
| Unknowns are named rather than omitted |
| Audience and service structure are established or explicitly unknown |
| Content and asset constraints are recorded |
| The package satisfies the Phase 4 input contract |
| The brand profile records observation only, with no creative recommendation |

### 3.3 Blocking conditions

- any fabricated fact, review, statistic, credential, or affiliation
- any factual item without provenance
- inference presented as verified fact
- unresolved source authorisation requirements
- business identity ambiguity

### 3.4 On failure

| Cause | Result |
|---|---|
| Missing or unverifiable business content | NEEDS_CONTENT |
| Missing or unusable assets | NEEDS_ASSETS |
| Unmet source authorisation | NEEDS_CREDENTIALS |
| Fabrication detected | RETURN_TO_RESEARCH, with the offending item recorded |
| Ambiguous ownership of the defect | NEEDS_HUMAN_REVIEW |

---

## 4. Creative Direction Validation

| Aspect | Definition |
|---|---|
| Gate owner | Control Plane |
| Evaluates | The **Creative Direction** artifact, contracted at `artifact-contracts.md` §5.10, produced by the Creative Director |

This gate evaluates the artifact in which the Design Intent Statement is authoritatively authored. See `artifact-contracts.md` §6 invariant 7.

### 4.1 Must be true

| Requirement |
|---|
| A creative intent is stated before any pattern or language selection |
| The Design Intent Statement is present and authored in this artifact |
| The exact versions of every consumed input are recorded, per `artifact-contracts.md` §7 |
| Every creative decision traces to the business intelligence artifact or to stated rationale |
| No factual claim appears that is absent from business intelligence |
| Verified facts are unaltered |
| The direction accounts for the approved asset inventory as a constraint |
| The direction is specific to this business, not carried over from a prior project |
| Industry is used as a heuristic only, never as a determinant of outcome |

### 4.2 Blocking conditions

- creative direction that contradicts a verified fact
- direction stated only as pattern selection, with no articulated intent
- direction that cannot be implemented within the approved asset reality
- direction that reproduces a previous project's outcome

### 4.3 On failure

| Cause | Result |
|---|---|
| Direction ungrounded in business truth | RETURN_TO_RESEARCH |
| Insufficient approved assets to support the direction | NEEDS_ASSETS |
| Strategy disagreement requiring judgement | NEEDS_HUMAN_REVIEW |

---

## 5. Blueprint Validation

| Aspect | Definition |
|---|---|
| Gate owner | Control Plane |
| Evaluates | Design blueprint, including the composition plan. Contracted at `artifact-contracts.md` §5.5, with the composition plan component at §5.11. |

The composition plan is evaluated here as a blueprint component. There is no separate composition gate.

### 5.1 Must be true

| Requirement |
|---|
| A design intent statement is present |
| Visual grammar selection is recorded with rationale |
| Composition plan states section sequence and arrangement |
| Composition uses only vocabulary defined by Phase 3 |
| Imagery strategy references only approved assets |
| Content mapping references only verified facts |
| Accessibility and SEO expectations are stated |
| Decisions are precise enough to implement without guesswork |
| Constraints and known limitations are stated explicitly |

### 5.2 Blocking conditions

- any unverified factual claim in the blueprint
- composition that depends on assets that are not approved
- new global pattern vocabulary invented at project level
- decisions stated so loosely that implementation must guess
- blueprint that does not express the approved creative direction

### 5.3 On failure

| Cause | Result |
|---|---|
| Blueprint conflicts with business truth | RETURN_TO_RESEARCH |
| Blueprint internally incoherent or imprecise | Remains in CREATIVE_DIRECTION for correction |
| Asset dependency unmet | NEEDS_ASSETS |
| Requires new Phase 3 vocabulary | NEEDS_HUMAN_REVIEW, as a factory-level change |

Passing this gate does not authorise implementation. Human Gate 2 must also be approved.

---

## 6. Implementation Validation

| Aspect | Definition |
|---|---|
| Gate owner | Control Plane |
| Evaluates | Website source, implementation report, and the **Rendered Result**, contracted at `artifact-contracts.md` §5.6 and §5.12 |

### 6.1 Must be true

| Requirement |
|---|
| The project builds and renders |
| A Rendered Result exists for this implementation version, with capture context recorded, per `artifact-contracts.md` §5.12 |
| The exact versions of every consumed input are recorded, per `artifact-contracts.md` §7 |
| Every blueprint decision is either implemented or declared as a deviation |
| No deviation is undeclared |
| Only approved assets are used |
| Only verified business content is presented |
| Accessibility requirements are implemented |
| SEO requirements are implemented |
| The implementation report is complete |

### 6.2 Blocking conditions

- silent deviation from the blueprint
- use of discovered, pending, or rejected assets
- invented or placeholder business facts in rendered output
- missing implementation report
- build failure

### 6.3 On failure

| Cause | Result |
|---|---|
| Blueprint decision cannot be implemented as specified | RETURN_TO_BLUEPRINT |
| Required content missing | NEEDS_CONTENT |
| Required assets missing or unapproved | NEEDS_ASSETS |
| Implementation defect within blueprint scope | Remains in IMPLEMENTING for correction |

**Rule:** Passing this gate means the build is ready for critique. It is not a quality verdict and never substitutes for one.

---

## 7. Critic Validation

| Aspect | Definition |
|---|---|
| Gate owner | Control Plane |
| Evaluates | Critic report and refinement plan for completeness and usability |

This gate validates that the critique is fit to act on. It does not re-judge the website.

### 7.1 Must be true

| Requirement |
|---|
| The critic report states an explicit overall verdict |
| Every finding carries a description, severity, root cause, and owning phase |
| The intent test against the Design Intent Statement is recorded. The statement is the one authored in the Creative Direction artifact, `artifact-contracts.md` §5.10 |
| Accessibility findings are recorded |
| Factual-integrity findings are recorded |
| Judgement addresses the rendered result, not source-code intent |
| The Rendered Result evaluated is identified, and is bound to the implementation version under critique, per `artifact-contracts.md` §5.12 |
| `criticIteration` is recorded on both the critic report and the refinement plan |
| The verdict is drawn from the recommendation vocabulary in `failure-routing.md` §3.1 |
| Every finding requiring action appears in the refinement plan |
| No finding is assigned to a role lacking authority to resolve it |
| Each actioned finding names its executing role, per `artifact-contracts.md` §5.8 |

### 7.2 Blocking conditions

- a finding with no root cause or no owning phase
- an ambiguous or absent verdict
- an upstream root cause assigned to implementation in order to avoid regression
- a blueprint-level finding assigned to refinement rather than regression
- critique that rests on build success rather than rendered outcome

### 7.3 On failure

| Cause | Result |
|---|---|
| Critic report incomplete | Remains in CRITIQUING for completion |
| Ownership of a finding is genuinely unclear | NEEDS_HUMAN_REVIEW |
| Findings owned by Phase 6 | REFINING |
| Findings owned by Phase 4 | RETURN_TO_BLUEPRINT |
| Findings owned by research or business truth | RETURN_TO_RESEARCH |
| Findings caused by asset or content shortfall | NEEDS_ASSETS or NEEDS_CONTENT |

Routing detail is in `failure-routing.md`.

---

## 8. Final Approval

| Aspect | Definition |
|---|---|
| Gate owner | Human approver. Per §0.10, final shipment is the human's decision and the AI provides a recommendation only |
| Evaluates | The complete delivery case |

### 8.1 Must be true

| Requirement |
|---|
| Critic Validation has passed |
| The critic verdict supports delivery |
| No unresolved finding of blocking severity remains |
| Any accepted outstanding finding is explicitly disclosed |
| Business facts presented in the website are verified |
| Accessibility and SEO requirements are met |
| The final report reflects the actual delivered state |
| Gate 1 and Gate 2 approvals are on record |

### 8.2 Blocking conditions

- any unresolved factual-integrity finding
- any unresolved blocking accessibility finding
- critic verdict that does not support delivery
- undisclosed outstanding findings
- missing Gate 1 or Gate 2 approval record

### 8.3 On failure

Rejection must state a reason. The reason determines the route, per `failure-routing.md`. A rejection without a stated reason routes to NEEDS_HUMAN_REVIEW.

---

## 9. Gate Invariants

1. No gate is owned by the role that produced the artifact under review.
2. Research Validation carries two blocking check groups: Research Completeness and Business Intelligence Completeness.
3. Critique cannot be bypassed. Final Approval requires a passing Critic Validation.
4. Build success alone satisfies no gate.
5. Every gate failure produces a root cause, an owning phase, and a target state.
6. Fabricated business facts fail every gate at which they are detected.
