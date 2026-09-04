---
document: Blogspage AI Website Factory
layer: Control Plane
status: draft
version: 0.2.0
---

# Versioning

**Derived from:** Phase 0 — Factory Operating System, §0.14, §0.15.

**Scope boundary:** This document defines versioning principles. It does not define tooling, storage mechanics, or release automation. No version-management tooling is specified at this version.

---

## 1. Principle

Per §0.14, versioning exists so the factory can improve without losing the history of previous projects.

**Rules**

1. Factory-global scope and business-project scope are versioned independently.
2. A delivered project records the factory versions it was built against.
3. Improving the factory never retroactively alters a delivered project.
4. Versions are recorded, not inferred.
5. A superseded version is retained, not overwritten.

## 2. Semantic-Style Scheme

Versions are expressed conceptually as `MAJOR.MINOR.PATCH`.

| Component | Increments when |
|---|---|
| MAJOR | A change breaks compatibility with existing artifacts, roles, or downstream expectations |
| MINOR | Capability is added in a way existing artifacts remain valid under |
| PATCH | A correction is made that changes no meaning |

**Compatibility rule:** A MAJOR change to any factory-global asset requires an explicit decision about existing in-flight projects. In-flight projects continue on their recorded version unless deliberately migrated.

## 3. Factory-Global Versioning

| Asset | Versioned unit | MAJOR means | MINOR means | PATCH means |
|---|---|---|---|---|
| Factory | The factory as a whole, aggregating the units below | Lifecycle, roles, gates, or authority hierarchy changed incompatibly | A capability was added | Editorial correction |
| Documentation | Each canonical document | A rule changed in a way that invalidates existing artifacts | A rule was added or clarified with no invalidation | Wording or formatting correction |
| Design languages | Phase 2 language set | A language's grammar changed incompatibly, or a language was removed | A language or expressive capability was added | Correction with no expressive change |
| Pattern library | Phase 3 vocabulary | A pattern's meaning or contract changed, or a pattern was removed | A pattern was added | Correction with no behavioural change |
| Agent instructions | Each role's instruction set | A role's boundary, authority, or output contract changed | Guidance was added within the same boundary | Clarification |
| Schemas | Each schema | A required element changed, or a structure became incompatible | An optional element was added | Description correction |
| Registries | Each registry document in `03-REGISTRY` | An identifier, ownership assignment, or parameter contract changed in a way that invalidates existing artifacts, or an entry was removed | An entry, parameter, or resolved value was added with no invalidation | Correction with no change in meaning |

**Rules**

1. Factory-global assets contain no business-specific data, per §0.15 and §0.16.
2. Adding Phase 3 vocabulary is a factory change, never a project decision. See `failure-routing.md` §4.
3. A MAJOR change to agent instructions requires review of the gates that depend on those instructions.
4. A MAJOR change to a registry requires review of every artifact type that records a registry version, per §5.

### 3.1 Registry Artifacts

The following are versioned factory-global artifacts:

| Artifact | Versioned unit |
|---|---|
| `03-REGISTRY/design-language-registry.md` | The design language registry |
| `03-REGISTRY/parameter-registry.md` | The parameter registry |
| `03-REGISTRY/critic-metrics-registry.md` | The critic metrics registry |
| `03-REGISTRY/phase-ownership-matrix.md` | The phase ownership matrix |

Each is versioned independently under the `Registries` row of §3, using the same `MAJOR.MINOR.PATCH` scheme as every other factory-global asset. Their authority and its limits are defined in `source-of-truth.md` §3.1; this section defines only how they are versioned.

**Relationship to the factory version.** Registries are factory-global units aggregated into the factory version, exactly as documentation, schemas and agent instructions are (§3, `Factory` row). A MAJOR registry change is a MAJOR factory-global change and triggers the §2 compatibility rule for in-flight projects.

**Relationship to phase documentation versions.** Two orderings apply, and they are not in conflict because they describe different things:

| Ordering | Meaning |
|---|---|
| Resolution order | A consumer resolves the factory version, then the CURRENT registry versions, then the phase documentation versions those registries reconcile. This is the lookup path |
| Derivation order | A registry is derived from the phase documents it reconciles, so it records the documentation versions it was derived from. Documentation is the upstream dependency |

**Rules**

1. Each registry records the canonical documentation versions it was derived from.
2. A MAJOR documentation change makes any registry derived from it **stale**. Stale registries are reproduced at factory level, not patched per project, per §5's stale rule.
3. Resolution order does **not** grant a registry precedence over canonical documentation. Precedence is governed solely by `source-of-truth.md` §1 and §3.1.
4. A registry version is never edited in place once consumed by a delivered project. History is preserved per §6.

**Relationship to project artifacts.** Project artifacts record the CURRENT registry versions they were resolved or implemented against, per §5. The full provenance chain is:

```
Factory version
  → Registry versions
    → Phase / documentation versions
      → Design blueprint
        → Implementation
          → Critic / refinement
```

Recording a registry version does not make a project artifact authoritative over the registry, and does not make the registry authoritative over canonical documentation.

## 4. Business Project Versioning

Per §0.14, a project's artifacts are versioned individually so that iteration history survives.

| Artifact | Versioned unit | New version created when |
|---|---|---|
| Business project | The project as a whole | A delivery occurs, or a post-delivery iteration begins |
| Research and business intelligence | Each research cycle | Research is corrected after RETURN_TO_RESEARCH |
| Design blueprint | Each blueprint | The blueprint is produced or reproduced after RETURN_TO_BLUEPRINT |
| Implementation | Each build | Implementation is produced against a blueprint version |
| Critic iteration | Each critique pass | Critique runs, including every re-critique after refinement |
| Refinement | Each refinement pass | Refinement addresses a set of findings |
| Final delivery | Each delivery | Gate 3 approval leads to delivery |

Project artifacts use simple incrementing iteration numbers rather than semantic versions, because they are instances rather than contracts.

## 5. Version Linkage

Every project artifact records the versions it depends on.

| Artifact | Must record |
|---|---|
| Business intelligence | Research cycle number |
| Design blueprint | Business intelligence version, design language version, pattern library version, agent instruction version, CURRENT registry versions resolved against |
| Implementation | Blueprint version, pattern library version, agent instruction version, CURRENT registry versions implemented against |
| Critic report | Implementation version, blueprint version, critic instruction version |
| Refinement | Critic report version and the findings addressed |
| Final report | All of the above, plus the factory version |

**Rule:** An artifact whose dependency version changed is stale. Stale artifacts are reproduced, not reused. See `failure-routing.md` §8.

## 6. Immutability

| Record | Mutability |
|---|---|
| Source documents in `00-SOURCE-DOCUMENTS` | Immutable. Never edited. See `source-of-truth.md` |
| Delivered project record | Immutable once DELIVERED |
| Approved gate decisions | Immutable. A changed decision is a new decision record |
| Critic reports | Immutable once issued. Re-critique produces a new report |
| Superseded artifact versions | Retained for history. Never authoritative. See §6.2 |

Post-delivery work opens a new project iteration. It never mutates the delivered record.

### 6.1 Approved Artifact Immutability

An approved artifact is fixed. Approval is granted by the gate governing that artifact, or by a human approval gate where one applies.

**Rule:** Once an artifact is approved, no role may silently modify it. This binds the producing role as well as every downstream consumer.

A required change to an approved artifact must complete all four steps:

| Step | Requirement |
|---|---|
| 1. New version | The change produces a new artifact version. The approved version is never edited in place |
| 2. Reason recorded | The new version records why the change was required and which finding, gate, or decision prompted it |
| 3. Downstream invalidated | Every artifact depending on the changed artifact is invalidated per the matrix in `failure-routing.md` §8 |
| 4. Workflow triggered | Work re-enters the lifecycle at the phase owning the changed artifact, per `failure-routing.md`. The owning phase reproduces it; downstream phases reproduce theirs |

**Rules**

1. Silent modification of an approved artifact is a control-plane violation, not a permitted shortcut.
2. A downstream role that finds an approved upstream artifact defective raises it for regression. It does not repair it.
3. Invalidated downstream artifacts are reproduced by their owning roles, never patched to match.
4. Re-approval is required when the changed subject matter was the subject of a human gate, per `human-approval.md`.

### 6.2 Current and Superseded Versions

Every project artifact version carries a version status, so history is preserved without remaining in force.

| Version status | Meaning | Authoritative |
|---|---|---|
| CURRENT | The single version in force for a given project and artifact type | Yes |
| SUPERSEDED | A previously current version, replaced by a newer one | No |
| HISTORICAL | A version retained as part of a delivered record | Only as the record of that delivery |

**Rules**

1. For a given project and artifact type, exactly one version is CURRENT. Never zero, never more than one.
2. Producing a new version moves the previous CURRENT version to SUPERSEDED in the same operation.
3. A SUPERSEDED or HISTORICAL version is preserved and readable. It is never deleted or overwritten.
4. No role may consume a SUPERSEDED or HISTORICAL version as input to new work. Consumers resolve to CURRENT.
5. A SUPERSEDED version may be cited as evidence of what was previously decided. Citing it does not restore its authority.
6. On delivery, the CURRENT version of each artifact is stamped into the delivered record, which is immutable per §6.

**These are artifact version statuses, not project states.** They do not appear in `state-machine.md` and never determine which state a project is in. A project in any state has exactly one CURRENT version of each artifact it has produced.

**Application to factory-global registry versions.** The same three statuses — CURRENT, SUPERSEDED, HISTORICAL — apply to the registry artifacts of §3.1, with the definitions above used unchanged. No parallel vocabulary is introduced.

The scope of "exactly one CURRENT" differs by scope, and only by scope:

| Scope | Exactly one CURRENT per |
|---|---|
| Business project artifact | Project and artifact type (rule 1 above) |
| Factory-global registry | Registry document, factory-wide |

**Rules**

1. Exactly one version of each registry document is CURRENT factory-wide. Never zero, never more than one.
2. Consumers resolve registry entries against the CURRENT registry version, per `source-of-truth.md` §3.1 rule 6.
3. A SUPERSEDED or HISTORICAL registry version is retained, readable, and never authoritative for new work. It may be cited as evidence of a previous decision; citing it does not restore its authority.
4. A delivered project's HISTORICAL registry versions remain authoritative only as the record of that delivery, per the definition above and §6.

These are artifact version statuses in the factory-global scope. They introduce no project state and appear nowhere in `state-machine.md`.

## 7. Versioning Invariants

1. Factory-global and project scopes version independently.
2. Every delivered project is reproducible in intent from its recorded versions.
3. Factory improvement never rewrites delivered history.
4. Every regression produces a new artifact version rather than an in-place edit.
5. Version numbers are recorded at the time of production.
6. An approved artifact is never modified in place. Change flows through a new version, a recorded reason, downstream invalidation, and re-entry at the owning phase.
7. Exactly one version of each project artifact type is CURRENT at any time.
8. History is preserved but never authoritative.
