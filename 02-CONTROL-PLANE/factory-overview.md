---
document: Blogspage AI Website Factory
layer: Control Plane
status: draft
version: 0.1.0
---

# Factory Overview

**Derived from:** Phase 0 — Factory Operating System, §0.1, §0.3, §0.4, §0.15, §0.16, §0.17, §0.18.

**Scope boundary:** This document defines how the factory operates. It does not define how websites look. All visual design authority belongs to Phases 1–6.

---

## 1. Purpose

The Blogspage AI Website Factory produces premium, modern, creative, business-specific websites for local businesses.

The factory exists to make the following properties simultaneously repeatable:

| Property | Requirement |
|---|---|
| Engineering quality | Consistent across every project |
| UX quality | Consistent across every project |
| Accessibility | Strong on every delivered site |
| SEO | Strong on every delivered site |
| Technical infrastructure | Reusable across projects |
| Visual output | Substantially varied between projects |
| Creative direction | Specific to each business |
| Design method | Composition-driven, not template-driven |
| Evaluation | Independently critiqued before delivery |
| Correction | Refined by root cause, not rebuilt wholesale |

Consistency applies to quality and infrastructure. It does not apply to visual outcome.

## 2. What the Factory Is

The factory is an operational production system that:

- accepts a defined business input
- researches and establishes verified business truth
- forms a business-specific creative point of view
- produces an approved design blueprint before any code is written
- implements the blueprint without silently altering it
- independently critiques the rendered result
- routes defects to the phase that owns them
- delivers only after explicit human approval

## 3. What the Factory Is NOT

| The factory is not | Rule |
|---|---|
| A template generator | Output composition is decided per business. Reused layout shells are prohibited as a design method. |
| An industry template library | Per §0.17, industry may inform decision-making; it must never determine final composition. |
| A theme switcher | A design language is a visual grammar, not a theme. See Phase 2. |
| A code-completion pipeline | A successful build is not evidence of a finished website. |
| A shared content pool | Business content is isolated per project. |
| A design authority | The Control Plane governs operations. Phases 1–6 govern design. |

Named per-industry implementations of any kind are prohibited artifacts of this factory.

## 4. Control Plane and Phases 1–6

The Control Plane sits above the phases and governs their execution order, inputs, outputs, validation, and failure handling. It never overrides their internal content.

| Layer | Owns | Does not own |
|---|---|---|
| Control Plane | Lifecycle, state, roles, handoffs, gates, approvals, failure routing, versioning, authority hierarchy, project isolation | Any visual, typographic, spatial, or compositional decision |
| Phase 1 — Foundation | Foundational design system substrate | Project lifecycle |
| Phase 2 — Five Visual Design Languages | Visual grammars | Project lifecycle |
| Phase 3 — Composition & Pattern System | Composition and pattern vocabulary | Project lifecycle |
| Phase 4 — AI Creative Direction & Design Decision Engine | Creative direction, composition strategy, design blueprint | Project lifecycle |
| Phase 5 — AI Website Implementation & Creative Preservation | Implementation and creative preservation | Project lifecycle |
| Phase 6 — Independent Design Critic, Diagnostic & Refinement | Rendered-quality judgement and refinement | Project lifecycle |

**Rule:** If a Control Plane document appears to specify a design outcome, the Control Plane document is defective and must be corrected.

## 5. Production Lifecycle

```
INPUT
  → RESEARCH  (includes Business Intelligence)
  → CREATIVE DIRECTION
  → COMPOSITION
  → DESIGN BLUEPRINT
  → IMPLEMENTATION
  → CRITIQUE
  → REFINEMENT
  → APPROVAL
  → DELIVERY
```

Stage detail, ownership, and validation are defined in `workflow.md`. Project state is defined in `state-machine.md`.

Three human approval gates punctuate this lifecycle: Business Understanding, Design Blueprint, and Final Website. See `human-approval.md`.

## 6. Business and Project Isolation

Per §0.3 and §0.4, every business receives its own workspace. No business shares mutable content with another business.

| Scope | Contains | Mutability |
|---|---|---|
| Factory (global) | Rules, tokens, patterns, agent instructions, schemas | Versioned, shared, read-only to a project run |
| Business (project) | Input, research, assets, brand, content, blueprint, build, critic, final | Owned by that project only |

**Rules**

1. A project run must not write to factory-global scope.
2. A project must not read another project's artifacts.
3. Per §0.16, business-specific data must never be encoded into factory rules. Factory rules may express industry heuristics; whether a specific treatment applies to a specific business is decided during research and creative direction.

Authority precedence between these scopes is defined in `source-of-truth.md`.

## 7. Reusable Infrastructure vs Visual Identity

This distinction is the factory's central operating tension and is resolved as follows.

| Reusable across businesses | Never reusable across businesses |
|---|---|
| Build tooling and project scaffolding | Page composition |
| Accessibility mechanics | Section sequence |
| SEO mechanics | Visual grammar selection |
| Performance practices | Typographic expression |
| Data and content plumbing | Imagery strategy |
| Component primitives as capability | Component arrangement as design |
| Validation and testing harnesses | Narrative structure |

**Rule:** Reusable infrastructure must never become a reusable visual template. Two projects may share the entire technical substrate and must still differ visibly in composition.

## 8. Creativity and Business Specificity

| Principle | Operational consequence |
|---|---|
| Business research precedes creative direction | Creative direction may not begin before research validation passes |
| Creativity governs presentation, never facts | Verified business facts outrank all creative decisions |
| Business truth is always preserved | Fabricated facts, reviews, statistics, or credentials are a hard failure at any gate |
| Composition outranks templates | Composition is decided per business by Phases 3 and 4 |
| Build success is not completion | A project cannot reach approval on build status alone; it must pass independent critique |
| Critique is independent | The role that judges the result must not be the role that produced it |
| Defects are routed, not absorbed | Root cause determines the owning phase. See `failure-routing.md` |
| Human review is strategic | Humans approve direction and delivery, not individual implementation details |

## 9. Related Control Plane Documents

| Document | Defines |
|---|---|
| `workflow.md` | Lifecycle stages, inputs, outputs, ownership |
| `state-machine.md` | Project states and legal transitions |
| `agent-roles.md` | Logical roles and their boundaries |
| `artifact-contracts.md` | Artifact handoff expectations |
| `quality-gates.md` | Validation gates between stages |
| `human-approval.md` | Human approval checkpoints |
| `failure-routing.md` | Root-cause diagnosis and phase ownership of defects |
| `versioning.md` | Versioning principles |
| `source-of-truth.md` | Hierarchy of authority |
