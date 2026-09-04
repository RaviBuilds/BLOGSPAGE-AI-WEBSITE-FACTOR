---
document: Blogspage AI Website Factory
layer: Control Plane
status: draft
version: 0.2.0
---

# Agent Roles

**Derived from:** Phase 0 — Factory Operating System, §0.5, §0.8, §0.9, §0.10; Phase 4 §4.2, §4.3.

**Scope boundary:** This document defines responsibility boundaries. It does not define the design content a role produces; that belongs to the role's corresponding phase.

---

## 1. Logical Separation

These are **logical roles**, not necessarily separate systems. The same AI model may perform several of them. Responsibilities remain separated regardless.

**Rules**

1. A role may read only the artifacts declared as its inputs.
2. A role may write only the artifacts declared as its outputs.
3. A role must not perform another role's responsibility, even when technically capable.
4. Shared model does not mean shared authority. Each role operates only under its own mandate.
5. Where a single role owns multiple conceptual responsibilities, those responsibilities remain distinct and separately validated.

## 2. Role Register

Six roles exist. This is the complete set.

| # | Role | Corresponding phase | Owns stage |
|---|---|---|---|
| 1 | Research Agent | Control Plane research, producing Phase 4 input | Research, including Business Intelligence |
| 2 | Creative Director | Phase 4 | Creative Direction, Design Blueprint |
| 3 | Composition Designer | Phase 3 vocabulary, Phase 4 decision | Composition |
| 4 | Implementation Engineer | Phase 5 | Implementation |
| 5 | Independent Critic | Phase 6 | Critique |
| 6 | Refinement Engineer | Phase 6 | Refinement |

Business Intelligence is a responsibility of the Research Agent, not a separate role. See §3.1.

---

## 3. Role Definitions

### 3.1 Research Agent

| Aspect | Definition |
|---|---|
| Corresponding phase | Control Plane research stage; produces the Business Intelligence Package that Phase 4 §4.2 consumes |
| Responsibility | Establish what is true about the business and structure it for creative use |
| Inputs | Project input: business identity, source URLs, client notes, supplied content and assets, authorised credentials |
| Outputs | Business research artifact, business intelligence artifact, asset inventory, brand profile |

**Sub-responsibilities.** The Research Agent is responsible for:

1. collecting business research
2. extracting verified facts
3. recording provenance
4. identifying inferred traits
5. structuring business intelligence
6. preparing the Business Intelligence Package required by Phase 4

**Conceptual separation within the role.** Research and Business Intelligence remain distinct responsibilities under shared ownership:

| Responsibility | Question answered | Validated by |
|---|---|---|
| Research | What can be found and sourced? | Research Completeness checks |
| Business Intelligence | What is verified, inferred, or unknown, and how is it structured? | Business Intelligence Completeness checks |

**MUST**

- record source, source type, and verification status for every factual item, per §0.8
- classify every item as verified, inferred, or unknown, per §4.3
- label inferred conclusions as inferred and never present them as verified
- report gaps explicitly rather than filling them
- record discovered assets as discovered, awaiting human approval, per §0.9
- distinguish observed brand facts from brand recommendations

**MUST NOT**

- fabricate facts, reviews, statistics, credentials, or affiliations
- present inference as verified fact
- access sources without authorisation; unmet access requirements route to NEEDS_CREDENTIALS
- form creative direction, select a design language, or decide composition
- approve its own assets
- write to any downstream artifact

### 3.2 Creative Director

| Aspect | Definition |
|---|---|
| Corresponding phase | Phase 4 |
| Responsibility | Form a business-specific creative point of view and record binding design decisions |
| Inputs | Business Intelligence Package, brand profile, approved asset inventory, Phase 1–3 factory documentation |
| Outputs | Creative Direction artifact — including the authoritative Design Intent Statement — and the design blueprint. Contracted at `artifact-contracts.md` §5.10 and §5.5. |

**MUST**

- state creative intent before selecting any pattern or language
- author the Design Intent Statement in the Creative Direction artifact, as its single authoritative instance
- carry the approved Design Intent Statement into the blueprint by reference, not by re-authoring it
- ground every creative decision in the business intelligence artifact
- record rationale for each significant decision so the Critic can test intent
- respect the approved asset inventory as a real constraint
- state decisions precisely enough to be implemented without guesswork
- record the exact versions of every input consumed, per `artifact-contracts.md` §7

**MUST NOT**

- introduce facts absent from the business intelligence artifact
- alter, reinterpret, or override verified business facts
- select an outcome because it was used for a previous business
- derive composition from industry alone, per §0.17
- write implementation code
- judge its own output at the Critic gate

### 3.3 Composition Designer

| Aspect | Definition |
|---|---|
| Corresponding phase | Phase 3 supplies the vocabulary; the project decision is recorded as a Phase 4 artifact |
| Responsibility | Translate creative direction into a concrete composition plan |
| Inputs | Approved Creative Direction artifact, Phase 3 composition and pattern vocabulary |
| Outputs | Composition plan, contracted at `artifact-contracts.md` §5.11 as a component of the design blueprint record, not as a peer artifact |

**MUST**

- use only composition and pattern vocabulary defined by Phase 3
- ensure the composition expresses the stated creative direction
- ensure section sequence and arrangement are decided for this business
- account for the volume and quality of approved assets

**MUST NOT**

- define new global patterns; new vocabulary is a Phase 3 change
- reuse a prior project's composition as a starting shell
- introduce per-industry layout presets
- alter the creative direction it received; disagreement routes back to the Creative Director
- write implementation code

### 3.4 Implementation Engineer

| Aspect | Definition |
|---|---|
| Corresponding phase | Phase 5 |
| Responsibility | Build the website so that the blueprint's decisions survive implementation |
| Inputs | Approved design blueprint, composition plan, approved assets, verified business content |
| Outputs | Website source, implementation report, rendered result. Contracted at `artifact-contracts.md` §5.6 and §5.12. |

**MUST**

- implement the blueprint as specified
- preserve creative intent, not merely structural correctness
- use only assets in approved status
- use only verified business content
- meet the factory's accessibility, SEO, and performance requirements
- report every deviation, constraint, and unresolved conflict in the implementation report
- perform the implementation correction for a Phase 5-owned finding actioned inside REFINING, per `state-machine.md` REFINING and §3.6 below
- capture the rendered result for each implementation version, per `artifact-contracts.md` §5.12
- record the exact versions of every input consumed, per `artifact-contracts.md` §7

**MUST NOT**

- silently alter, simplify, or substitute a blueprint decision
- resolve a blueprint-level conflict by improvising; this routes to RETURN_TO_BLUEPRINT
- invent business content or substitute placeholder facts
- use discovered, pending, or rejected assets
- declare the website complete on the basis of a successful build
- critique or approve its own output

### 3.5 Independent Critic

| Aspect | Definition |
|---|---|
| Corresponding phase | Phase 6 |
| Responsibility | Judge the rendered website independently and attribute every defect to a root cause |
| Inputs | Rendered result per `artifact-contracts.md` §5.12, design blueprint, the approved Design Intent Statement from the Creative Direction artifact, implementation report, business intelligence artifact |
| Outputs | Critic report, refinement plan with root-cause attribution and owning phase per finding. Contracted at `artifact-contracts.md` §5.7 and §5.8. |

**MUST**

- evaluate the rendered result, not the source code's intentions
- test the outcome against the stated design intent
- assign each finding a root cause and an owning phase
- recommend phase regression when the root cause is upstream
- state explicitly when the result is acceptable
- state its verdict using the recommendation vocabulary in `failure-routing.md` §3.1 — SHIP, REFINE, REBUILD, or RETURN_TO_PHASE_4
- record the `criticIteration` stamped by the Control Plane on entry to CRITIQUING, per `state-machine.md` §6
- identify the rendered result evaluated, and re-evaluate against a fresh rendered result after any correction

**MUST NOT**

- modify the implementation, blueprint, or research
- accept a successful build as evidence of quality
- attribute an upstream root cause to implementation to avoid regression
- soften findings to allow progression
- approve delivery; that authority is human, per §0.10
- treat `REBUILD` as a state; it is a recommendation only, per `failure-routing.md` §3.1
- re-use a stale rendered result from a superseded implementation version
- set or reset `criticIteration`; that is Control-Plane stamped, per `state-machine.md` §6

### 3.6 Refinement Engineer

| Aspect | Definition |
|---|---|
| Corresponding phase | Phase 6 |
| Responsibility | Apply corrections for findings owned by Phase 6, and coordinate the refinement plan for all findings actioned within REFINING |
| Inputs | Critic report, refinement plan, current implementation |
| Outputs | Revised implementation for Phase 6-owned findings, record of each change against its finding |

**MUST**

- address only findings assigned to refinement
- record which change resolves which finding
- return the project to CRITIQUING for re-evaluation
- escalate findings whose true cause is upstream
- route a Phase 5-owned finding to the Implementation Engineer for correction, per `state-machine.md` REFINING

**MUST NOT**

- close or dismiss its own findings
- advance the project to APPROVED
- make design decisions reserved for the Creative Director
- alter the blueprint; blueprint change routes to RETURN_TO_BLUEPRINT
- introduce changes unrelated to a recorded finding
- take ownership of a Phase 5-owned implementation correction

**Phase 5-owned findings inside REFINING.** A Phase 5-owned defect discovered after rendering is actioned in REFINING, per `failure-routing.md` §3. The **Implementation Engineer** performs that correction; the Refinement Engineer coordinates the plan and does not become the implementation owner. Ownership of a correction follows the owning phase.

---

## 4. Separation Invariants

1. The role that produces an artifact never validates it at that artifact's own gate.
2. The Independent Critic is never the Implementation Engineer or Refinement Engineer within the same iteration.
3. Only the Research Agent establishes facts. All other roles consume them.
4. Only the Creative Director makes binding design decisions.
5. Only the Independent Critic may confirm that a finding is resolved.
6. Only a human may approve delivery.
7. Ownership of a correction follows the owning phase, not the state in which the correction happens. A Phase 5-owned defect actioned inside REFINING is corrected by the Implementation Engineer, per §3.4 and §3.6.
8. Only the Creative Director authors the Design Intent Statement, and only once, in the Creative Direction artifact. All other roles consume it by reference, per `artifact-contracts.md` §6 invariant 7.
