---
document: Blogspage AI Website Factory
layer: Control Plane
status: draft
version: 0.1.0
---

# Workflow

**Derived from:** Phase 0 — Factory Operating System, §0.2, §0.5, §0.6, §0.11, §0.12; Phase 4 §4.0, §4.2.

**Scope boundary:** This document defines stage sequence, ownership, and validation. It does not define design content produced within a stage.

---

## 1. Lifecycle

```
INPUT
  → RESEARCH
      └─ BUSINESS INTELLIGENCE  (sub-stage of RESEARCH)
  → CREATIVE DIRECTION
  → COMPOSITION
  → DESIGN BLUEPRINT
  → IMPLEMENTATION
  → CRITIQUE
  → REFINEMENT
  → APPROVAL
  → DELIVERY
```

Business Intelligence is a sub-stage, not a peer stage. It is owned by the Research Agent and carries no state of its own. See §3.2 and `agent-roles.md`.

## 2. Stage Summary

| # | Stage | Owning role | Owning phase | Executes in state | Exit state |
|---|---|---|---|---|---|
| 1 | Input | Human (submitter) | Control Plane | NEW | RESEARCHING |
| 2 | Research | Research Agent | Control Plane input to Phase 4 | RESEARCHING | RESEARCH_READY |
| 2a | Business Intelligence | Research Agent | Control Plane input to Phase 4 | RESEARCHING | no state of its own |
| 3 | Creative Direction | Creative Director | Phase 4 | CREATIVE_DIRECTION | no state of its own |
| 4 | Composition | Composition Designer | Phase 3 vocabulary, Phase 4 decision | CREATIVE_DIRECTION | no state of its own |
| 5 | Design Blueprint | Creative Director | Phase 4 | CREATIVE_DIRECTION | BLUEPRINT_READY |
| 6 | Implementation | Implementation Engineer | Phase 5 | IMPLEMENTING | BUILD_READY |
| 7 | Critique | Independent Critic | Phase 6 | CRITIQUING | REFINING or APPROVED |
| 8 | Refinement | Refinement Engineer | Phase 6 | REFINING | CRITIQUING |
| 9 | Approval | Human (approver) | Control Plane | APPROVED | DELIVERED |
| 10 | Delivery | Control Plane | Control Plane | DELIVERED | terminal |

Stages 3, 4, and 5 execute within the single CREATIVE_DIRECTION state. This follows Phase 4 §4.0, in which composition strategy and blueprint production occur inside Phase 4, and Phase 0 §0.4, which files the composition plan alongside the blueprint. State definitions are in `state-machine.md`.

---

## 3. Stage Definitions

### 3.1 INPUT

| Aspect | Definition |
|---|---|
| Input | Business identity, source URLs, client notes, supplied content, supplied assets, any credentials required for authorised access |
| Produced | A registered project with an isolated workspace and an initial project record |
| Owner | Human submitter; Control Plane registers the project |
| Must validate before proceeding | The business is unambiguously identified; the project workspace exists and is isolated; at least one usable research entry point is present |
| Failure | Missing input routes to NEEDS_CONTENT, NEEDS_ASSETS, or NEEDS_CREDENTIALS |

No research may begin before the project is registered and isolated.

### 3.2 RESEARCH

| Aspect | Definition |
|---|---|
| Input | Registered project input |
| Produced | Business research artifact, business intelligence artifact, asset inventory, brand profile |
| Owner | Research Agent |
| Must validate before proceeding | Research Validation gate, including both Research Completeness and Business Intelligence Completeness check groups |
| Failure | BLOCKED, NEEDS_CONTENT, NEEDS_ASSETS, NEEDS_CREDENTIALS, or NEEDS_HUMAN_REVIEW |

**Business Intelligence sub-stage.** Within RESEARCH, the Research Agent additionally:

1. extracts verified facts from gathered research
2. records provenance for every factual item, per §0.8
3. identifies inferred traits and labels them as inferred
4. marks unestablished information as unknown
5. structures the business intelligence
6. prepares the Business Intelligence Package required by Phase 4, per §4.2

Three conceptual responsibilities remain distinct even though the Research Agent owns the first two:

| Responsibility | Question it answers | Owner |
|---|---|---|
| Research | What can be found and sourced about this business? | Research Agent |
| Business Intelligence | What is verified, what is inferred, what is unknown, and how is it structured? | Research Agent |
| Creative Direction | What should this business's website feel like and why? | Creative Director |

The Research Agent must not perform the third.

### 3.3 CREATIVE DIRECTION

| Aspect | Definition |
|---|---|
| Input | Business Intelligence Package, brand profile, approved asset inventory |
| Produced | Business-specific creative direction and design intent, per Phase 4 |
| Owner | Creative Director |
| Owning phase | Phase 4 |
| Must validate before proceeding | Creative Direction Validation gate |
| Failure | RETURN_TO_RESEARCH when the direction cannot be grounded in business truth |

Creative direction states a point of view before any pattern is selected. It may not introduce facts absent from the business intelligence artifact.

### 3.4 COMPOSITION

| Aspect | Definition |
|---|---|
| Input | Approved creative direction, Phase 3 composition and pattern vocabulary |
| Produced | Composition plan for the project |
| Owner | Composition Designer |
| Owning phase | Phase 3 supplies vocabulary; the decision is recorded as a Phase 4 artifact |
| Must validate before proceeding | Composition is internally coherent, expresses the creative direction, and uses only vocabulary defined by Phase 3 |
| Failure | Composition defects route to Phase 3 or Phase 4 per `failure-routing.md` |

The Composition Designer selects and arranges; it does not invent new global patterns. New vocabulary is a Phase 3 change, not a project decision.

### 3.5 DESIGN BLUEPRINT

| Aspect | Definition |
|---|---|
| Input | Creative direction, composition plan, business intelligence, approved assets |
| Produced | Design blueprint — the binding design decision record for implementation |
| Owner | Creative Director |
| Owning phase | Phase 4 |
| Must validate before proceeding | Blueprint Validation gate, then human Gate 2 |
| Failure | RETURN_TO_RESEARCH or NEEDS_HUMAN_REVIEW |

No code may be written before the blueprint exists and passes Gate 2.

### 3.6 IMPLEMENTATION

| Aspect | Definition |
|---|---|
| Input | Approved design blueprint, approved assets, verified business content |
| Produced | Rendered website source and an implementation report |
| Owner | Implementation Engineer |
| Owning phase | Phase 5 |
| Must validate before proceeding | Implementation Validation gate |
| Failure | Blueprint-level obstacles route to RETURN_TO_BLUEPRINT rather than being silently resolved in code |

The Implementation Engineer must not silently deviate from the blueprint. Any required deviation is reported and routed.

### 3.7 CRITIQUE

| Aspect | Definition |
|---|---|
| Input | Rendered website, design blueprint, design intent, implementation report |
| Produced | Critic report and, where defects exist, a refinement plan with root-cause attribution |
| Owner | Independent Critic |
| Owning phase | Phase 6 |
| Must validate before proceeding | Critic Validation gate |
| Failure | Regression to an earlier phase where the root cause is upstream |

Critique evaluates the rendered result, not the source code's intentions. Build success does not satisfy this stage.

### 3.8 REFINEMENT

| Aspect | Definition |
|---|---|
| Input | Critic report and refinement plan |
| Produced | Revised implementation and a record of what was changed against which finding |
| Owner | Refinement Engineer |
| Owning phase | Phase 6 |
| Must validate before proceeding | Re-critique. Refinement always returns to CRITIQUING |
| Failure | Findings that cannot be resolved at refinement level route to the owning phase |

Refinement may not close its own findings. Only the Independent Critic may confirm resolution.

### 3.9 APPROVAL

| Aspect | Definition |
|---|---|
| Input | Passing critic report, refinement history, final report |
| Produced | Recorded human approval decision |
| Owner | Human approver |
| Must validate before proceeding | Final Approval gate |
| Failure | Rejection routes by stated reason per `failure-routing.md` |

### 3.10 DELIVERY

| Aspect | Definition |
|---|---|
| Input | Approved website and final report |
| Produced | Delivered project, version-stamped against the factory version it was built with |
| Owner | Control Plane |
| Must validate before proceeding | Terminal stage |
| Failure | Post-delivery defects open a new versioned iteration; they do not mutate the delivered record |

---

## 4. Progression Rules

1. No stage may begin before its upstream gate has passed. Per §0.12, an agent must not continue on incomplete upstream output.
2. Every stage consumes declared artifacts and produces declared artifacts. Undeclared side channels between roles are prohibited.
3. A stage may not modify an upstream artifact. It requests correction by routing to the owning stage.
4. Ownership is singular. Exactly one role owns each stage.
5. Human approval occurs only at the three defined gates.
