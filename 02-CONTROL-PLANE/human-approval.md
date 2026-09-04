---
document: Blogspage AI Website Factory
layer: Control Plane
status: draft
version: 0.1.0
---

# Human Approval

**Derived from:** Phase 0 — Factory Operating System, §0.6, §0.7, §0.9, §0.10.

**Scope boundary:** This document defines where human judgement is required. It does not define design criteria.

---

## 1. Principle

Human involvement is strategic. Per §0.7, the human reviews at creative-director level, not at implementation-detail level.

Three approval gates exist. This is the complete set.

| Gate | Name | Approves | Governs transition |
|---|---|---|---|
| Gate 1 | Business Understanding | That the factory understands the business correctly | RESEARCH_READY → CREATIVE_DIRECTION |
| Gate 2 | Design Blueprint | That the intended direction is correct | BLUEPRINT_READY → IMPLEMENTING |
| Gate 3 | Final Website | That the result is ready to deliver | CRITIQUING → APPROVED → DELIVERED |

Gate 1 corresponds to the checkpoint named Business Research in Phase 0 §0.6. It is named Business Understanding here because it covers both research and business intelligence, which the Research Agent owns jointly.

## 2. Human and AI Ownership

Per §0.10:

| Decision | AI | Human |
|---|---|---|
| Research | Performs | Reviews |
| Fact verification | Performs | Final authority |
| Design language | Performs | Approves |
| Composition | Performs | Approves |
| Coding | Performs | Reviews |
| Critique | Performs | Reviews |
| Asset approval | Recommends | Decides |
| Final shipment | Recommends | Decides |

## 3. Out of Scope for Human Review

The following are decided by the factory and are not presented for approval:

- individual spacing, margin, and sizing decisions
- individual component or element placement
- code structure and file organisation
- token-level choices within an approved design language
- individual copy phrasing within verified facts
- individual refinement actions taken against a critic finding

**Rule:** If a human is being asked to arbitrate a decision on this list, the factory has failed to encode a rule. The correct fix is a factory-level rule, not a new approval step.

---

## 4. Gate 1 — Business Understanding

| Aspect | Definition |
|---|---|
| Occurs at | RESEARCH_READY, after Research Validation has passed |
| Approver | Human |
| Precondition | Research Validation passed, including both Research Completeness and Business Intelligence Completeness check groups |

### 4.1 What the AI must present

| Item |
|---|
| A summary of what the business is and does, as established |
| Verified facts, with their sources |
| Inferred traits, clearly labelled as inferred |
| Unknowns, named explicitly |
| Audience and service structure as established |
| Discovered assets, with status, for approval decisions |
| Content and asset constraints that will limit design |
| Any source that could not be accessed, and why |

### 4.2 What the human is approving

The statement: this is an accurate understanding of the business.

The human is also the final authority on fact verification, per §0.10, and decides asset approval at this point.

### 4.3 After approval

- the business intelligence artifact becomes the factual basis for all downstream work
- approved assets become the usable asset set
- the project transitions to CREATIVE_DIRECTION
- facts may not be revised downstream without returning here

### 4.4 If rejected

| Rejection reason | Route |
|---|---|
| Facts are wrong or unsupported | RETURN_TO_RESEARCH |
| Understanding is incomplete | RETURN_TO_RESEARCH |
| Business content is missing | NEEDS_CONTENT |
| Assets are missing or insufficient | NEEDS_ASSETS |
| A source requires authorisation | NEEDS_CREDENTIALS |
| Reason not stated | NEEDS_HUMAN_REVIEW |

---

## 5. Gate 2 — Design Blueprint

| Aspect | Definition |
|---|---|
| Occurs at | BLUEPRINT_READY, after Blueprint Validation has passed |
| Approver | Human |
| Precondition | Blueprint Validation passed |

### 5.1 What the AI must present

| Item |
|---|
| The design intent statement, in plain terms |
| The selected visual grammar and why this business warrants it |
| The narrative strategy |
| The composition plan, including section sequence |
| The imagery strategy and which approved assets carry it |
| How verified facts map into the website |
| Accessibility and SEO expectations |
| Stated constraints and known limitations |
| Any decision the AI considers debatable, named as such |

### 5.2 What the human is approving

The statement: this is the direction I want the website to take.

The human approves direction, design language, and composition, per §0.10. The human does not approve implementation detail.

### 5.3 After approval

- the blueprint becomes binding on implementation
- implementation may not silently deviate from it
- the project transitions to IMPLEMENTING
- later blueprint change requires RETURN_TO_BLUEPRINT, not in-place revision

### 5.4 If rejected

| Rejection reason | Route |
|---|---|
| Wrong creative direction for this business | RETURN_TO_BLUEPRINT |
| Composition does not serve the direction | RETURN_TO_BLUEPRINT |
| Direction rests on a misunderstanding of the business | RETURN_TO_RESEARCH |
| Direction requires assets that do not exist | NEEDS_ASSETS |
| Requires new Phase 3 vocabulary | NEEDS_HUMAN_REVIEW, handled as a factory-level change |

Rejection at this gate is inexpensive by design. It occurs before implementation.

---

## 6. Gate 3 — Final Website

| Aspect | Definition |
|---|---|
| Occurs at | CRITIQUING, after Critic Validation has passed; governs entry to APPROVED and then DELIVERED |
| Approver | Human |
| Precondition | Critic Validation passed and the critic verdict supports delivery |

### 6.1 What the AI must present

| Item |
|---|
| The rendered website |
| The critic verdict and its reasoning |
| Findings resolved, and how |
| Outstanding accepted findings, disclosed explicitly |
| Confirmation that presented business facts are verified |
| Accessibility and SEO status |
| Refinement history across iterations |
| Factory and project versions used |
| A delivery recommendation |

### 6.2 What the human is approving

The statement: this is ready to present or deliver.

Per §0.10, final shipment is the human's decision. The AI recommends only.

### 6.3 After approval

- the project transitions to APPROVED, then to DELIVERED once delivery is prepared
- the delivered state is version-stamped against the factory version used
- the delivered record becomes immutable; later work opens a new iteration

### 6.4 If rejected

| Rejection reason | Route |
|---|---|
| Execution quality issue within Phase 6 scope | REFINING |
| Wrong creative direction or composition | RETURN_TO_BLUEPRINT |
| Factual error in presented content | RETURN_TO_RESEARCH |
| Asset quality or quantity shortfall | NEEDS_ASSETS |
| Missing content | NEEDS_CONTENT |
| Reason not stated | NEEDS_HUMAN_REVIEW |

Root-cause diagnosis governs the route. See `failure-routing.md`.

---

## 7. Approval Invariants

1. Exactly three human approval gates exist. Additional gates are not introduced per project.
2. Every approval and rejection is recorded, with the reason on rejection.
3. Gate 3 cannot be reached without a passing Critic Validation.
4. Gate 1 and Gate 2 approval records are preconditions for Final Approval.
5. Approval is never inferred from silence or from absence of objection.
6. A rejection without a stated reason routes to NEEDS_HUMAN_REVIEW rather than being guessed at.
