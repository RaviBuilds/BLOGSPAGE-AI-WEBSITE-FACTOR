---
document: Blogspage AI Website Factory
layer: Control Plane
status: draft
version: 0.1.0
---

# Source of Truth

**Derived from:** Phase 0 — Factory Operating System, §0.8, §0.15, §0.16, §0.17; Phase 4 §4.3; Phase 6 phase-regression behaviour.

**Scope boundary:** This document defines which authority prevails when records disagree. It does not define design criteria.

---

## 1. Authority Hierarchy

Authority descends. A lower level may never silently contradict a higher level.

| Level | Authority | Held by |
|---|---|---|
| 1 | Verified business facts | Research Agent, with the human as final authority on verification |
| 2 | Approved business inputs | Human submitter and approver |
| 3 | Canonical factory documentation and the registry layer (`03-REGISTRY`) | Factory, versioned globally |
| 4 | Approved design blueprint | Creative Director, approved at Gate 2 |
| 5 | Implementation | Implementation Engineer |
| 6 | Critic findings | Independent Critic |
| 7 | Refinements | Refinement Engineer |

## 2. Conflict Resolution

**Rule:** When two levels disagree, the higher level prevails and the lower level is corrected. The higher level is never adjusted to match the lower.

| Conflict | Resolution |
|---|---|
| Blueprint contradicts a verified fact | The blueprint is wrong. RETURN_TO_BLUEPRINT, or RETURN_TO_RESEARCH if the fact itself is in question |
| Implementation contradicts the blueprint | The implementation is wrong, unless the blueprint is unimplementable, which routes to RETURN_TO_BLUEPRINT |
| Implementation contradicts a verified fact | The implementation is wrong. Factual integrity is non-negotiable |
| Creative direction contradicts approved input | The direction is wrong |
| Factory documentation contradicts a verified business fact | The fact prevails for that project; the documentation is reviewed as a factory-level issue |
| Two canonical documents contradict each other | NEEDS_HUMAN_REVIEW. The contradiction is resolved at factory level, not per project |
| Critic finding contradicts the blueprint | The finding is a diagnosis, not an override. It triggers regression under level 4's owner |
| Refinement contradicts a critic finding | The refinement is wrong. Only the Critic may close a finding |

**Levels 6 and 7 are diagnostic and corrective, not authoring.** A critic finding does not itself change a design decision; it causes the owning role to change it.

## 3. Source Documents and Canonical Documentation

| Record | Role | Mutability |
|---|---|---|
| Source documents in `00-SOURCE-DOCUMENTS` | Original authored intent for Phase 0 and Phases 1–6 | Immutable. Never edited, never regenerated |
| Extracted raw documentation in `01-DOCUMENTATION` | Faithful text extraction of the source documents | Derived. Not authored against |
| Canonical factory documentation | Operational rules derived from the source documents | Authoritative for execution, versioned |

**Rules**

1. Source documents are preserved unchanged and remain the record of original intent.
2. Canonical documentation is derived from source documents. It restates them as executable rules; it does not replace or reinterpret their intent.
3. Where canonical documentation and a source document diverge in meaning, the divergence is a defect. It routes to NEEDS_HUMAN_REVIEW for a deliberate decision.
4. Agents execute against canonical documentation, not against raw extractions.
5. Canonical documentation carries no business-specific data.

### 3.1 Registry Layer

`03-REGISTRY` is a recognized factory-global layer. It sits at authority level 3 alongside canonical factory documentation. It is **not** a higher authority than canonical documentation and **not** a replacement for the six phases.

| Record | Role | Mutability |
|---|---|---|
| Registries in `03-REGISTRY` | Factory-global authority for the cross-phase concerns explicitly assigned to them in the registry documents themselves | Versioned per `versioning.md` §3.1. Authoritative within its assigned scope only |

**Rules**

1. Source documents remain immutable. The registry layer changes nothing about §3's rules 1–3.
2. Canonical phase documents remain authoritative for their own phase-owned subject matter. A registry does not displace them.
3. A registry is authoritative only for the cross-phase concerns explicitly assigned to it in its own registry documents. Authority it does not explicitly claim, it does not hold.
4. Registry authority does not permit a registry to redefine a phase-owned concern. A registry may record, classify, cross-reference and identify; it may not restate phase-owned subject matter as something different from what the owning phase says.
5. Where phase-owned content and registry-owned cross-phase metadata appear together, ownership is determined by `03-REGISTRY/phase-ownership-matrix.md`.
6. Registry entries MUST be resolved against CURRENT registry versions, per `versioning.md` §6.2.
7. SUPERSEDED and HISTORICAL registry versions are retained for history and are **not** authoritative for new work. They may be cited as evidence of a previous decision; citing one does not restore its authority.
8. A project may read the registry layer and may not write to it, per §4 rule 3. A registry defect found during a project run is raised as a factory change.
9. Where a registry and a canonical phase document diverge on phase-owned substance, the phase document prevails and the divergence is a defect recorded for factory-level resolution. Where they diverge on a concern the registry is explicitly assigned, the registry prevails.
10. Project artifacts record the CURRENT registry versions they were resolved or implemented against, per `versioning.md` §5.

## 4. Factory and Business Isolation

Per §0.15 and §0.16:

| Scope | Holds | Authority |
|---|---|---|
| Factory | Rules, tokens, patterns, agent instructions, schemas | Level 3, global, applies to every project |
| Business | Input, research, assets, brand, content, blueprint, build, critic, final | Levels 1, 2, 4, 5, 6, 7, scoped to that project only |

**Rules**

1. Business data never enters factory rules. Factory rules may express industry heuristics; whether a heuristic applies to a specific business is decided per project.
2. Per §0.17, industry influences decision-making and never determines final composition. Named per-industry implementations are prohibited.
3. A project may read factory-global documentation and may not write to it.
4. A project may not read or write another project's artifacts.
5. A factory-level change identified during a project run is raised as a factory change, not applied locally.

## 5. Business Truth

Per §4.3 and §0.8, every factual item is classified:

| Classification | Meaning | Usable as fact |
|---|---|---|
| Verified | Directly supported by a recorded source | Yes |
| Inferred | A reasonable conclusion from evidence, labelled as such | No. Usable as design signal only |
| Unknown | Not established | No |

**Rules**

1. Creative freedom applies to presentation, never to factual reality.
2. Inference may inform design decisions and may never be presented to a site visitor as fact.
3. Unknowns are resolved by research or human input, never by invention.
4. Fabricated facts, reviews, statistics, credentials, or affiliations are a hard failure at every gate.
5. The human is the final authority on fact verification.

## 6. Blueprint Authority Over Implementation

The approved blueprint is authoritative over implementation.

**Rules**

1. Implementation may not silently override a blueprint decision.
2. Every deviation is declared in the implementation report.
3. An undeclared deviation is a validation failure, not a stylistic difference.
4. When a blueprint decision cannot be implemented, the project routes to RETURN_TO_BLUEPRINT. Implementation does not choose a substitute.
5. Implementation may resolve detail the blueprint leaves open, within the blueprint's stated intent, and must not resolve detail the blueprint has already decided.

## 7. Critic Authority and Regression

The Independent Critic holds diagnostic authority, not authoring authority.

**Rules**

1. Critic findings may trigger regression to an earlier phase.
2. Regression is owned by the phase that owns the root cause, not by the Critic.
3. The Critic may not modify research, blueprint, or implementation.
4. Only the Critic may confirm that a finding is resolved.
5. The Critic does not approve delivery. That authority is human.

Regression effects on downstream artifacts are defined in `failure-routing.md` §8.

## 8. Authority Invariants

1. Verified business facts outrank every design and implementation decision.
2. Approved inputs outrank factory defaults for that project.
3. Canonical documentation outranks any project-local convenience.
4. Registry authority is confined to the cross-phase concerns explicitly assigned to a registry. A registry never redefines a phase-owned concern, and phase-owned subject matter remains phase-owned.
5. The approved blueprint outranks implementation.
6. Findings and refinements correct lower levels; they never overrule higher ones.
7. Source documents are never edited by the factory.
8. Unresolvable authority conflicts route to NEEDS_HUMAN_REVIEW.
