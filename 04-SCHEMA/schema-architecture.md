---
document: Blogspage AI Website Factory
layer: Schema
artifact: Schema Architecture
status: draft
version: 0.2.0
authority: factory-global
---

# Schema Architecture

**Purpose:** to state how factory schemas are organised before any schema is written — what a schema is responsible for, what it inherits from the Control Plane rather than deciding for itself, and which structural questions remain genuinely open.

**Derived from:** `02-CONTROL-PLANE/artifact-contracts.md`, `02-CONTROL-PLANE/versioning.md`, `02-CONTROL-PLANE/state-machine.md`, `02-CONTROL-PLANE/source-of-truth.md`, `02-CONTROL-PLANE/agent-roles.md`, `02-CONTROL-PLANE/workflow.md`, `02-CONTROL-PLANE/failure-routing.md`, and the registry layer. Schemas are a Control-Plane-derived concern, not a phase-owned one, and no phase document confers authority here.

Phase documents are **cited** where a constraint the schema layer must respect lives in one: `01-DOCUMENTATION/03-composition-pattern-system.md`, `01-DOCUMENTATION/04-ai-creative-direction.md`, `01-DOCUMENTATION/05-ai-implementation.md` and `01-DOCUMENTATION/06-independent-critic.md` are cited in §3.8, §6 and §7. Citation is not derivation: each of those references records a decision the owning document already made, and this document neither restates it as its own nor acquires authority over it.

**Scope boundary:** This document is **prose only**. It defines no field, no type, no enumeration, no required-or-optional marking, and no validation rule. It contains no schema file and prescribes no serialisation format. Where the Control Plane already fixes something, this document records where that decision lives rather than restating it; where nothing fixes it, this document records the gap and does not fill it.

**Registration status:** Registered as a factory-global artifact under `versioning.md` §3 (`Schemas` row). Under that row, MAJOR means a required element changed or a structure became incompatible, MINOR means an optional element was added, and PATCH means a description was corrected. This document is versioned as one unit; individual schemas, when they exist, are versioned each on their own under the same row.

**Authority position.** Schemas sit at authority level 3, inside canonical factory documentation, per `source-of-truth.md` §3. A schema is a **shape**, never a rule. It may express what the Control Plane already requires; it may not require anything the Control Plane does not. Where a schema and a canonical document diverge, the canonical document prevails and the divergence is a defect, per `source-of-truth.md` §3 rule 3.

---

## 1. What a Schema Is Responsible For

`artifact-contracts.md` §8 item 1 records the current position exactly: no schemas are defined, and that document defines contracts only. That is the boundary this document works from.

A contract in §5 states, for each artifact, who produces it, who consumes it, what information it must carry, and what validation is expected of it. A schema would state how that information is **shaped**. The two are not the same work, and the second cannot begin until it is clear which parts of the first are already settled.

Three responsibilities are therefore separated throughout this document:

| Responsibility | Held by | Status |
|---|---|---|
| What an artifact must contain and why | `artifact-contracts.md` §5 | Fixed |
| How that content is shaped and typed | Schemas, not yet written | Open |
| What happens at runtime when the shape is violated | `failure-routing.md`, `quality-gates.md` | Out of scope here |

A schema that takes on the first responsibility is overreaching. A schema that defers the third is behaving correctly.

---

## 2. The Envelope and the Payload

Every artifact the factory produces carries two kinds of information, and they behave differently enough to be designed separately.

**The envelope** is what makes an artifact identifiable, versionable and traceable. It is the same kind of information for every artifact: what this is, which project it belongs to, which version it is, what it was produced from, who produced it. The envelope is a **cross-artifact concern**. It is largely already decided, because `artifact-contracts.md` §7 and `versioning.md` §3.1 and §5 decided it while defining traceability rather than while defining schemas.

**The payload** is the artifact's actual content — the business intelligence, the creative direction, the blueprint decisions, the critic findings. The payload is a **per-artifact concern**, different in every one of the twelve contracts, and it is where the real schema-design work remains.

This split matters for sequencing. The envelope can be settled first, from material that already exists, and settling it does not require any of the open payload questions to be answered. The payload cannot be settled at all for several artifacts, because the values it would carry have no defined scale in any canonical document. Attempting both at once would let payload gaps block envelope work that is otherwise ready.

**The split is analytical, not structural.** Saying that an artifact has an envelope and a payload does not assert that the two are separate objects, separate documents, or separate files. Whether the envelope is physically shared or repeated per artifact is an open question — see §4.2.

---

## 3. Envelope Concerns Already Fixed by Contract

Fourteen envelope concerns are labelled A–N below and sorted into three columns: **already fixed** by an existing canonical document, **still open** as a schema-design decision, and **deferred** as runtime behaviour outside schema scope. This section covers the first column. A schema author reading these does not decide them; they read them from the document named and shape them.

Nine of the fourteen are fixed. One of the nine — concern M, accessibility — is fixed at a **stronger** status than the others: it is absolute, and §3.8 sets out what that adds. Another — concern N, owning phase — is fixed and routinely conflated with concern E, and §3.9 separates them.

### 3.1 A — Artifact type

**Fixed.** `artifact-contracts.md` §5 defines exactly twelve artifact types, in this order: Business Research (§5.1), Business Intelligence (§5.2), Asset Inventory (§5.3), Brand Profile (§5.4), Design Blueprint (§5.5), Implementation Report (§5.6), Critic Report (§5.7), Refinement Plan (§5.8), Final Report (§5.9), Creative Direction (§5.10), Composition Plan (§5.11), Rendered Result (§5.12). The set is closed by that section. A schema does not add a thirteenth type, and a project run does not introduce one.

Titles are cited as §5 writes them. §5.2 records that Business Intelligence is the artifact referred to elsewhere as the **Business Intelligence Package**; both names denote one artifact type, and §6 below uses the longer form where it cites `artifact-contracts.md` §8.

One of the twelve is not a peer of the others. The Composition Plan is **a component of the Design Blueprint record**, per §5.11, with no independent version, no independent CURRENT status and no independent gate. This is why `artifact-contracts.md` §4's Artifact Register lists eleven rows rather than twelve, and its closing note says so explicitly. The count difference is not a discrepancy: §4 registers peer artifacts, §5 contracts all twelve.

Any typing of artifacts must therefore reflect that one type is contained rather than standalone. That is a shaping consequence of an already-fixed contract decision, not a new decision.

### 3.2 B — Artifact version and lifecycle status

**Fixed.** `versioning.md` §6.2 defines the three statuses — CURRENT, SUPERSEDED, HISTORICAL — with their meanings and their authority. Rule 1 of that section fixes the cardinality: for a given project and artifact type, exactly one version is CURRENT, never zero and never more than one.

`versioning.md` §4 fixes the versioned unit for each project artifact and states that project artifacts use **simple incrementing iteration numbers rather than semantic versions**, because they are instances rather than contracts. Factory-global assets use `MAJOR.MINOR.PATCH` per §2; project artifacts do not. A schema for a project artifact and a schema for a factory-global asset therefore carry different kinds of version value, and that difference is already decided.

§6.2 also states that these are artifact version statuses and **not** project states, that they appear nowhere in `state-machine.md`, and that they never determine which state a project is in. A schema must not conflate the two.

### 3.3 C — Factory version

**Fixed.** `versioning.md` §3 defines the factory version as the aggregate of the units below it in that table — documentation, design languages, pattern library, agent instructions, schemas, registries. §1 rule 2 requires that a delivered project record the factory versions it was built against, and §5 places the factory version specifically on the Final Report, alongside all of the linkages the other artifacts carry.

Schemas are one of the aggregated units. A MAJOR schema change is therefore a MAJOR factory-global change and triggers the §2 compatibility rule for in-flight projects. This document's own version participates in that aggregate.

### 3.4 D — Registry and upstream artifact versions

**Fixed.** `artifact-contracts.md` §7 is the complete decision. It separates two operations that a schema must not merge: **resolution**, which happens while work is in progress and always uses CURRENT, and **recording**, which happens at the moment an artifact is produced and stamps the exact versions actually consumed. §7 states the reason plainly — recording `CURRENT` alone is insufficient because CURRENT moves, and an artifact must remain interpretable after the versions it consumed have been superseded.

The §7 "Applies to" table fixes which artifact records which consumed input. Four registry versions are named there — parameter, design language, phase ownership, critic metrics — recorded on Creative Direction, Design Blueprint, Implementation Report and Critic Report. `versioning.md` §5 gives the same linkage from the versioning side, per artifact.

§7 rule 3 constrains the schema author directly: no version number is invented, and only versions that exist in the consumed documents are recorded.

### 3.5 E — Producer

**Fixed.** Every contract in `artifact-contracts.md` §5 names a Producing role and a Consuming role. `agent-roles.md` defines those roles, their boundaries and their authority. The producer of an artifact is therefore determinable from the contract without a schema decision.

Two producers are not agents. The Rendered Result is produced by the Implementation Engineer **via the build**, per §5.12, and the Final Report is produced by the **Control Plane**, per §5.9. A schema that assumes every artifact has a human-or-agent author would be wrong on both.

### 3.6 F — Provenance chain

**Fixed.** `versioning.md` §3.1 states the full chain as an ordered diagram: factory version, then registry versions, then phase and documentation versions, then design blueprint, then implementation, then critic and refinement. The same section distinguishes **resolution order**, which is the lookup path a consumer follows, from **derivation order**, which is the dependency direction, and states that the two are not in conflict because they describe different things.

Two rules attach that a schema must not weaken. Recording a version confers no authority over the document consumed, per §3.1 and §7 rule 2. And an artifact whose dependency version changed is **stale**; stale artifacts are reproduced, not reused, per `versioning.md` §5.

### 3.7 G — `criticIteration`

**Fixed.** `state-machine.md` §6 defines the counter, where it is stamped, and by whom. It is stamped by the Control Plane on entry to CRITIQUING. `agent-roles.md` §3.5 states that the Independent Critic **records** it, and its MUST NOT list states that the critic does not set or reset it.

`artifact-contracts.md` §5.7, §5.8 and §5.12 place it on the Critic Report, the Refinement Plan and the Rendered Result. `state-machine.md` §6 states that it is independent of the CURRENT / SUPERSEDED / HISTORICAL model: each new critic report supersedes its predecessor as an artifact, while `criticIteration` is the ordinal of the cycle, not the status of the artifact. A schema must carry both and must not derive one from the other.

Two properties are recorded there as deliberate. The reset rule is **factory-defined V1**, not source-derived, per `phase-ownership-matrix.md` §6 decision 4a and its §7 issue 13. And there is **no numeric maximum**: escalation after three failed cycles sits in the critic's MAY column, a permission rather than a cap, and the Control Plane does not terminate a project on the counter.

### 3.8 M — Accessibility as a hard constraint

**Fixed, and fixed more strongly than any other concern in this section.** Accessibility is not an ordinary payload value that happens to be important. Four canonical documents converge on the same position, and they use the same word: absolute.

`phase-ownership-matrix.md` Row 10 classifies it Canonical — absolute, and §6 decision 6 states it is absolute and non-overridable. Row 25 adds that creative intensity levels 1–5 are gates, and that level 5 never licenses failing a minimum. `parameter-registry.md` §3 states the same rule from the parameter side: accessibility is absolute and non-overridable, the minimum wins, and a creative goal that collides with it must be re-expressed some other way. `05-ai-implementation.md` §14.1 states that accessibility is absolute and that the §22.1 creative exception procedure **does not apply to it**. `06-independent-critic.md` states that accessibility is **absolute, not weighted** — it cannot be traded against any other evaluation dimension, and a high overall score never compensates for a major accessibility failure.

Five properties follow, and every one of them is a shaping constraint rather than a runtime rule:

| Property | Consequence for shape |
|---|---|
| Absolute | It is not a preference, a target, or a score to be maximised |
| Non-tradeable | It cannot be balanced against creative intensity, visual tension, or any critic dimension |
| Non-overridable | No role, phase, or parameter value overrides it |
| Not an ordinary weighted metric | It is excluded from weighted aggregation, per `06-independent-critic.md` |
| Excluded from the general creative exception path | The `05-ai-implementation.md` §22.1 exception procedure does not reach it, per §14.1 |

**What the schema layer must not do.** A schema MUST NOT represent accessibility in a shape that implies optional tradeability, weighted compensation, creative exemption, or conversion override. Four concrete shapes are forbidden by the sources above: giving accessibility a weight alongside the weighted critic dimensions; making it a nullable or optional element where the contract requires it; placing it inside a structure the creative exception path can modify; or expressing it as a value convertible into, or offsettable by, any creative parameter.

**What the schema layer does not do.** It does not gate. Whether an accessibility failure blocks a gate, which state the project moves to, and which role repairs it are `quality-gates.md`'s and `failure-routing.md`'s, exactly as concern K in §5.1 states for every other violation. The distinction held throughout this document applies here without modification: a schema may make a violation detectable; it does not decide the consequence. Recording that this constraint category is different is a shaping obligation. Enforcing it is not.

`artifact-contracts.md` §5.5 requires the Design Blueprint to carry accessibility expectations, and §5.7's Critic Report carries the findings against them. Both payloads are therefore affected, and neither may be typed in a way that contradicts the five properties above.

### 3.9 N — Owning phase

**Fixed.** `artifact-contracts.md` carries `Owning phase` as an explicit contract row — §5.10 records Phase 4 per `phase-ownership-matrix.md` Row 36, and §5.11 records Phase 4 per that matrix's §6 decision 13. `workflow.md` §2 carries an owning phase per stage, and `failure-routing.md` §3 routes on it as a column of the routing table.

Three attributes that look interchangeable are not, and concern E in §3.5 covers only the first:

| Attribute | Meaning | Where it is fixed |
|---|---|---|
| Producer | The role that produced this artifact | Each `artifact-contracts.md` §5 contract's Producing role; `agent-roles.md` |
| Executing role | The role performing work in the current state | `workflow.md` §2; `state-machine.md` |
| Owning phase | The phase holding conceptual authority over the content, and the routing target for a defect in it | `artifact-contracts.md` §5.10 and §5.11; `phase-ownership-matrix.md`; `failure-routing.md` §3 |

The producer or executing role **can differ from the owning phase**, and the factory built two invariants because it does. `agent-roles.md` §4 invariant 7 and `phase-ownership-matrix.md` §6 decision 19 establish that ownership of a correction follows the owning phase, not the state and not the executing role: a Phase 5-owned defect actioned inside REFINING is corrected by the Implementation Engineer. `workflow.md` §2 shows the same split structurally, listing owning role and owning phase as separate columns, and its composition-plan stage records that Phase 3 supplies the vocabulary while the decision is recorded as a Phase 4 artifact.

Owning phase determines conceptual authority and routing. `artifact-contracts.md` §5.7's validation expectation requires every critic finding to name its owning phase, and `quality-gates.md` §7.2 treats a finding without one as a blocking condition. An envelope carrying producer but not owning phase cannot express the distinction these invariants exist to protect.

This is read from the documents named, not decided here. The field's name, form and placement remain a shaping question governed by concerns H and I.

---

## 4. Envelope Concerns Still Open as Schema Decisions

Three envelope concerns are genuinely undecided. No canonical document settles them, and this document does not settle them either — it states what each question is, why it is a schema-layer question rather than a Control Plane one, and what constrains any eventual answer.

### 4.1 H — Artifact and project identifier format

**Open.** Every rule in §3 above presupposes that an artifact can be referred to. `versioning.md` §6.2 rule 1 requires exactly one CURRENT version per project and artifact type, which presupposes that "this project" and "this artifact type" are both identifiable. `artifact-contracts.md` §5.12 requires the Rendered Result to record "the exact implementation version rendered", which presupposes that an implementation version can be named unambiguously. §7 requires an artifact to stamp the exact versions consumed, which presupposes the same for every upstream artifact.

**No canonical document states an identifier format.** Not for a project, not for an artifact, not for an artifact version. `artifact-contracts.md` §5.3 requires the Asset Inventory to record "asset identity" and §5.6 requires the Implementation Report to record assets used "by approved identity", but neither states what an identity looks like. Those are the closest the contracts come, and they concern assets rather than artifacts.

This is a schema-layer question because the Control Plane's rules are all satisfiable by more than one identifier scheme, and choosing between them changes no rule. It is not answered here because answering it means inventing a format, and no source constrains the choice.

What does constrain an eventual answer: identifiers must distinguish a project from another project, per `source-of-truth.md` §4 rule 4, which forbids one project reading another's artifacts. They must distinguish an artifact type from another type, per §3.1 above. They must distinguish a version from a superseded version of the same artifact, per `versioning.md` §6.2 rule 3, which requires superseded versions to remain preserved and readable. And they must remain resolvable after the delivered record becomes immutable, per `versioning.md` §6.

### 4.2 I — Whether the envelope is shared or repeated per artifact

**Open.** §2 above separates envelope from payload analytically. Whether that separation is expressed as one shared structure that every artifact schema draws on, or as the same concerns restated inside each of the twelve schemas, is undecided.

Nothing in the Control Plane requires either. `artifact-contracts.md` §7's table assigns different envelope concerns to different artifacts — registry versions to four of them, `criticIteration` to three, upstream artifact versions to two — so the envelope is **not uniform across all twelve artifacts** even though its concerns are common. A shared structure would therefore have to account for concerns that apply to some artifacts and not others, which is a real design question and not a formatting preference.

The Composition Plan is the sharpest case. Per `artifact-contracts.md` §5.11 it has no independent version, no independent CURRENT status and no independent lifecycle, and per §5.11's versioning note it is versioned with its containing blueprint. An envelope applied uniformly to all twelve would give it version fields the contract says it does not have.

### 4.3 J — How "by reference" is physically expressed

**Open.** `artifact-contracts.md` §6 invariant 7 fixes the substance: there is exactly one authored Design Intent Statement per project, in the Creative Direction artifact §5.10, and **every other reference is by reference**. §5.5 restates it from the blueprint's side — the blueprint carries the approved statement by reference and records the exact Creative Direction version consumed, and does not re-author it. `phase-ownership-matrix.md` §6 decision 18 records the same resolution.

What "by reference" means as a shape is not stated anywhere. The requirement is clear and the expression of it is not.

This matters more than a typing detail, because the invariant is enforceable only if the shape makes re-authoring impossible or at least detectable. A shape that permits the blueprint to carry a copy of the statement's text alongside a version pointer would satisfy every stated rule while defeating invariant 7 in practice. Whether the reference is expressible in a way that cannot degrade into a copy is the open question.

The same question applies, unresolved, to the Composition Plan's containment in the blueprint (§5.11) and to the Rendered Result's binding to exactly one implementation version (§5.12 and invariant 8). All three are relationships the contracts fix and the shapes do not yet express.

---

## 5. Concerns Deferred as Runtime Behaviour

Two concerns look like schema concerns and are not. They are recorded here so that a schema author does not absorb them by accident.

### 5.1 K — What happens when a shape is violated

**Deferred.** A schema can describe a shape. What the factory *does* about a violation is already owned elsewhere, and a schema that encoded its own consequences would be creating rules — which the authority position above forbids it, because a schema is a shape and never a rule.

Validation expectations live in `artifact-contracts.md` §5, one per contract, and gating lives in `quality-gates.md`. Routing on failure lives in `failure-routing.md`. `source-of-truth.md` §3 rule 3 states that a divergence between canonical documentation and a source document routes to NEEDS_HUMAN_REVIEW for a deliberate decision, rather than being resolved in place.

The distinction to hold: a schema may make a violation **detectable**. It does not decide whether the violation blocks a gate, which state the project moves to, or which role repairs it. `critic-metrics-registry.md` §6 decision 4 makes the parallel point for metrics — registration is not gating — and the same separation applies to shapes.

### 5.2 L — Invalidation and staleness cascade

**Deferred.** `versioning.md` §5 states the staleness rule: an artifact whose dependency version changed is stale, and stale artifacts are reproduced rather than reused. §6.1 states the four steps a change to an approved artifact must complete, including that every dependent artifact is invalidated per the matrix in `failure-routing.md` §8.

That cascade is runtime behaviour over a graph of produced artifacts. A schema can carry the recorded dependency versions that make the cascade computable — that is concern D, already fixed in §3.4 — but it does not perform the computation and does not define the matrix. The matrix is `failure-routing.md` §8's.

---

## 6. The Payload Stays Open, Per Artifact

Payload typing is not deferred and not fixed. It is **open per artifact**, and for several artifacts it cannot be closed at all yet, because the values the payload would carry have no defined scale in any canonical document.

This is the point at which the schema layer inherits the factory's existing value gaps rather than introducing new ones. Seven are already recorded, each in a document that owns it:

| Gap | Recorded in | Effect on payload typing |
|---|---|---|
| No breakpoint values exist in any canonical document | `artifact-contracts.md` §8 item 2, `phase-ownership-matrix.md` §7 issue 11 | The Rendered Result's capture context names desktop, tablet and mobile without boundaries |
| Phase 6 states no tablet-specific evaluation criteria | `artifact-contracts.md` §8 item 3, `phase-ownership-matrix.md` §7 issue 12 | Tablet is a required capture with nothing stated to evaluate it against |
| The Business Intelligence Package's internal structure is unreconciled against the research file layout | `artifact-contracts.md` §8 item 4 | The §5.2 payload has two candidate structures and no reconciliation |
| The Pattern Library is empty — 0 of ~87 patterns specified | `artifact-contracts.md` §8 item 5, `phase-ownership-matrix.md` §7 issues 9 and 10 | The Composition Plan's pattern selections have no populated set to select from |
| `competitorSameness` has no declared scale | `parameter-registry.md` §7 issue 23 | A registered identifier with an UNDEFINED range, per that registry's §8 decision 17 |
| Critic per-dimension scale and aggregation are unstated | `critic-metrics-registry.md` §5 item 1 | `overallScore` is registered and not computable; seven weighted dimensions have no stated scale |
| The Business Truth classification vocabulary is unreconciled | `04-ai-creative-direction.md` §5 | `uncertain` maps to no canonical truth class; the Business Intelligence payload's classification cannot be typed as an enumeration |

**The seventh gap, stated in full.** The canonical truth classes are three, and they remain three: `VERIFIED`, `INFERRED`, `UNKNOWN`, per `04-ai-creative-direction.md` §5's Business Truth Layer. `artifact-contracts.md` §5.2's validation expectation requires every item in the Business Intelligence Package to be classified verified, inferred or unknown, and states that inference is never presented as fact.

The source also uses a fourth term. `04-ai-creative-direction.md` §36.2's examples emit `uncertain` alongside `unknown` as though the two were distinct, and that document's own §5 analysis records that `uncertain` **maps to no truth-layer class**: it may be `INFERRED`, it may be a low-confidence `VERIFIED`, or it may be a fourth state, and the source does not say which.

`uncertain` is **not** a fourth canonical class, and this document does not make it one. Its relationship to the three canonical classes is unresolved and must be decided by the owning document before it can be used in a schema enumeration. Until then, a schema MUST NOT enumerate the truth classification at all — typing it as three states silently discards `uncertain`, and typing it as four states invents a canonical class. Both are the failure mode §10 decision 4 forbids.

An eighth item is a decision rather than a gap: `creativeRisk` is **deliberately unregistered**, per `parameter-registry.md` §8 decision 20. A schema author who finds it in Phase 4 §19 and not in any registry is seeing an intended absence. It MUST NOT be added to a registry to close the apparent gap, and a schema MUST NOT invent a scale for it.

### 6.1 What is closed, and therefore typable

Not every payload value is open. Two construct sets are closed, and a schema author needs to know that closure is real before assuming the whole payload is blocked.

**Design languages are a closed set of five.** `DL-01` Editorial Luxury, `DL-02` Swiss / Structured, `DL-03` Bold Energetic, `DL-04` Soft Premium / Wellness, `DL-05` Architectural / Sophisticated. `04-ai-creative-direction.md` §36.3's field table records both `strategy.primaryLanguage` and `strategy.secondaryInfluence` as taking `DL-01…DL-05`, and `phase-ownership-matrix.md` records the languages as Phase 2-owned constructs. A schema does not add a sixth language, and does not accept a design language value outside the five.

**Composition modes are a closed set of ten**, `C01`–`C10`, per `03-composition-pattern-system.md` §9.

**The identifier form of a construct ID is canonical and must not be restyled.** `parameter-registry.md` §8 decision 15 sets `camelCase` as the canonical form of a **field identifier** and states explicitly that the convention governs field identifiers only — it does **not** restyle prefixed construct IDs (`C01`, `S01`, `DL-01`), uppercase classification constants (`PRIMARY`, `MANDATORY`), natural-language prose names, or verbatim source quotations. A schema that normalises `DL-01` to `dl01`, or `PRIMARY` to `primary`, has broken a canonical identifier under the pretext of a naming convention.

Closure of the set is not the same as closure of the payload. The five languages are a closed enumeration; the per-language *values* those languages carry remain governed by §7.5's scope rules and by whatever the owning registry declares.

### 6.2 Pattern readiness, and the identifier decisions attached to it

The gap table above records that the Pattern Library is empty. Three registry decisions attach to that row, and each one is a shaping constraint that survives the library staying empty.

**`assetDependency` is the canonical identifier.** The source forms `imageDependency` (Phase 3 §3.14) and `image_dependency` (Phase 3 §3.39) are **recognised terminology variants** that map to it, per `parameter-registry.md` §8 decision 14 and §5, with the mapping recorded in `03-composition-pattern-system.md` §12.3 and §33.2. The mapping is additive and the source quotations are not rewritten. A schema uses `assetDependency` and treats the two source spellings as legacy inputs, not as separate parameters.

**Construct identifier namespaces MUST be disjoint**, per `parameter-registry.md` §8 decision 16. The first and only application is the CTA pattern family: the canonical prefix is **`CT`**, `C` is recorded as a legacy alias under decision 14, and composition modes `C01`–`C10` are unchanged. `parameter-registry.md` §6.7 states why the family moved rather than the modes — the modes are referenced by ID across canonical Phases 3 and 4, while no CTA pattern ID appears in any source document at all.

**That migration is prepared, not executed.** `parameter-registry.md` §6.7's migration scope states that reserving `CT` creates no CTA pattern, assigns no CTA pattern ID, and does not populate the library. Phase 3 §14 remains accurate at 0 of the ~87 targeted patterns. A schema may therefore rely on `CT` and `C01`–`C10` never colliding, and may not rely on any pattern existing.

**The consequence for payload typing.** A Composition Plan's pattern selections can be constrained to a disjoint, well-formed identifier namespace right now, and cannot be constrained to a value set, because the value set is empty. Those are two different kinds of readiness and only the first is available.

**The rule this document sets for payload work:** where a value has no declared scale, the schema records the absence exactly as the registries do. It does not choose a type to make the shape complete. A schema that assigns `overallScore` a range, or `competitorSameness` a three-level enumeration, or a breakpoint a pixel boundary, has invented factory canon at the schema layer — which is precisely the failure mode `source-of-truth.md` §3 rule 3 classifies as a defect.

**Sequencing consequence.** Envelope work can proceed now, because §3 shows nine of its fourteen concerns already fixed and §4 shows three of the remaining five to be genuine design choices rather than missing data. Payload work can proceed only for artifacts whose content is fully stated. For the rest, the blocking item is upstream and is not a schema problem to solve.

---

## 7. Payload Semantic Safeguards

Everything in this section is **already decided elsewhere**. Nothing here is new canon, no parameter is defined, and no value, scale, range or mapping is supplied. These are citations carried forward because each records a distinction that a schema can silently destroy by typing two things as one.

The failure mode is specific. A schema author who sees two similarly-named numeric parameters will reach for the obvious relationship — a bound, a conversion, a derivation — and encoding it creates a rule the Control Plane does not have. §10 decision 1 forbids that, and §10 decision 3 requires these to be read rather than re-decided. Each safeguard below therefore names the distinction, names the document that fixed it, and stops.

### 7.1 A — `creativeBudget` is not a bound on `creativeIntensity`

The two are **related concepts, not a numeric bound pair**. `creativeBudget` is **not a ceiling** for `creativeIntensity`, and neither parameter numerically constrains the other.

Fixed three times: `parameter-registry.md` §2.3 and its resolved-issue table, and `phase-ownership-matrix.md` Row 14, Row 24 and §6 decision 4. Because neither bounds the other, differing values across source tables are **not a conflict** and must not be reconciled by a schema.

A schema MUST NOT express one as the maximum, minimum, or permitted range of the other, and MUST NOT validate one against the other.

### 7.2 B — `motionExpression` is not `motionIntensity`

Three motion representations exist unmapped in the sources: `motionCharacter`, `motionExpression`, `motionIntensity`. `phase-ownership-matrix.md` Row 22 states that the qualitative character is **not a restatement** of `motionIntensity`, and that **no consumer may convert between them in either direction**. §6 decision 5 confirms it. `parameter-registry.md` §7 issues 3, 4 and 5 record that the level semantics are unstated, that `motionExpression` is a registry-assigned name, and that no mapping is permitted.

This is a prohibition rather than a gap. No conversion, formula, mapping or derivation between them may be invented — not by a schema, and not by a consumer reading one. A schema MUST NOT type them as convertible, and MUST NOT assign `motionIntensity` a semantic enumeration its levels have not been given.

### 7.3 C — Capability, Fit and Project Value are three different kinds of statement

The three-way split is fixed by `phase-ownership-matrix.md` §6 **decision 15**, which states in terms that capability, fit and value are three distinct statement kinds: a *capability* statement says a construct exists and what it can do, a *fit* statement says how well a construct suits a condition, and a *value* statement assigns a concrete value for one project. Phases 1–3 may issue capability and fit statements; **only Phase 4 issues value statements.**

| Kind | States | Issued by |
|---|---|---|
| Capability | What exists — the range or ability available | Phases 1–3; Phase 1 owns capabilities and ranges, per `phase-ownership-matrix.md` §6 decisions 15 and 11 |
| Fit | Where a construct is appropriate | Phases 1–3, per `phase-ownership-matrix.md` §6 decision 15 and `parameter-registry.md` §8 decision 13 |
| Project value | What the project receives | **Phase 4 only**, per the same two decisions |

On the fit-versus-value axis specifically, `parameter-registry.md` §8 decision 13 is explicit: a parameter name applied to a **construct** is a fit statement; the same name applied to a **project** is a value statement; Phases 1–3 may issue fit statements, and **only Phase 4 issues project-specific value statements**. The unqualified registry identifier is always the project value. Decision 13 settles that two-way axis; the third kind, capability, comes from matrix decision 15 above and must not be read out of decision 13 alone.

`03-composition-pattern-system.md` §12.2 supplies the distinct fit identifiers — `patternIntensityFit`, `patternTensionFit`, `patternDensityFit` — and states that the unqualified names stay reserved for project and language values. On the capability side, `04-ai-creative-direction.md` §11 records four asset capability scores and states that the source does not state their relationship to `assetDependency`, and that none is asserted.

Three kinds sharing one name, with fit-to-value aggregation recorded as unresolved in `parameter-registry.md` §7 issue 21. A schema MUST NOT collapse them into a single field, and MUST NOT invent the aggregation rule that issue 21 leaves open.

### 7.4 D — `imageDominance` and `typographyDominance` appear at more than one scope

Both are registered as project-scope values in `parameter-registry.md` §6.8, and `04-ai-creative-direction.md` §36.3 uses the same names at pattern scope with different values. `parameter-registry.md` §7 issue 24 records the situation and records that **no derivation rule between the scopes exists**.

These may appear at different scopes where a source explicitly supports it. A schema MUST NOT invent a derivation rule between those scopes, and MUST NOT treat a pattern-scope value as computable from a project-scope value or the reverse.

### 7.5 E — Parameter scope must not be flattened

Scope is a meaningful semantic property of a parameter, not a presentational detail. Flattening it discards the distinction that makes §7.3 and §7.4 legible.

`parameter-registry.md` §5's scope column registers three values, and these are the canonical set:

| Registered scope | Meaning |
|---|---|
| Per project | The value is issued once for the project |
| By language | The value varies by design language |
| Applies to every language | The value is invariant across languages |

Two clarifications, so that this safeguard is not read as more than it is. First, **fit versus value is a separate axis from scope**, governed by `parameter-registry.md` §8 decision 13 as recorded in §7.3 above; a fit identifier such as `patternIntensityFit` is not a fourth scope. Second, finer scope distinctions are observable in the later phases — implementation-level and evaluation-level parameter use in `05-ai-implementation.md` and `06-independent-critic.md`, and the factory-global authority level in `versioning.md` §3 — but these are **not registry-registered scope values**. They are recorded here as observations only, and a schema MUST NOT treat them as an enumeration or promote them to canonical scope values.

No new parameter definition is created by this section, and no scope is assigned to any parameter here. Scope for any given parameter is read from `parameter-registry.md`.

### 7.6 What this section does not do

It defines no parameter, no scale, no range, no level semantics and no mapping. It resolves none of the following, all of which remain open in the documents that own them: scoring formulas, aggregation formulas, thresholds, breakpoints, the novelty algorithm, critic scales, `creativeRisk` semantics, and the `competitorSameness` scale. Recording a distinction is not the same as closing it.

---

## 8. Summary of the Fourteen Concerns

The three columns of §3, §4 and §5 collected in one place.

| # | Concern | Column | Where it is settled, or why it is not |
|:--:|---|---|---|
| A | Artifact type | Fixed | `artifact-contracts.md` §5.1–§5.12; twelve types, set closed |
| B | Artifact version and lifecycle status | Fixed | `versioning.md` §6.2 and §4 |
| C | Factory version | Fixed | `versioning.md` §3 and §1 rule 2 |
| D | Registry and upstream artifact versions | Fixed | `artifact-contracts.md` §7; `versioning.md` §5 |
| E | Producer | Fixed | Each §5 contract's Producing role; `agent-roles.md` |
| F | Provenance chain | Fixed | `versioning.md` §3.1 |
| G | `criticIteration` | Fixed | `state-machine.md` §6 |
| H | Artifact and project identifier format | Open | No canonical document states a format; more than one scheme satisfies every rule |
| I | Envelope shared or repeated per artifact | Open | Nothing requires either; the envelope is not uniform across all twelve artifacts |
| J | How "by reference" is physically expressed | Open | Invariant 7 fixes the substance; no document states the shape |
| K | What happens when a shape is violated | Deferred | `quality-gates.md`, `failure-routing.md`, per-contract validation expectations |
| L | Invalidation and staleness cascade | Deferred | `versioning.md` §5 and §6.1; `failure-routing.md` §8 |
| M | Accessibility as a hard constraint | Fixed | `phase-ownership-matrix.md` Row 10, Row 25 and §6 decision 6; `parameter-registry.md` §3; `05-ai-implementation.md` §14.1; `06-independent-critic.md` — absolute, not weighted |
| N | Owning phase | Fixed | `artifact-contracts.md` §5.10 and §5.11; `phase-ownership-matrix.md`; `failure-routing.md` §3; distinct from producer and executing role |

Nine fixed, three open, two deferred. The payload, per §6, is open per artifact and inherits seven recorded value gaps plus one deliberate non-registration.

Two of the nine fixed concerns are newer additions than the rest and are easy to miss. Concern M is not merely fixed but **absolute** — §3.8 sets out why that is a stronger status than the other eight. Concern N is fixed and **frequently conflated** with concern E; §3.9 separates producer, executing role and owning phase, and the two invariants that exist because they differ.

---

## 9. Unresolved at This Version

Recorded, not resolved. No item below is filled by invention.

| # | Item | Affects |
|:--:|---|---|
| 1 | No schema file exists. This document defines architecture only, in prose. It defines no field, type, enumeration, required-or-optional marking or validation rule | All artifacts |
| 2 | Concern H — no identifier format for a project, an artifact, or an artifact version | Every envelope |
| 3 | Concern I — whether the envelope is one shared structure or repeated per artifact | Every envelope |
| 4 | Concern J — no stated shape for "by reference", so invariant 7 is enforceable in substance but not yet in shape | Creative Direction, Design Blueprint, Composition Plan, Rendered Result |
| 5 | Payload typing is unclosable for the artifacts affected by the seven value gaps in §6 | Business Intelligence Package, Composition Plan, Critic Report, Rendered Result |
| 6 | No serialisation format is chosen. This document neither selects nor implies one | All schemas |
| 7 | The relationship between a schema's version and the artifact version it shapes is unstated. `versioning.md` §3's `Schemas` row versions each schema; whether an artifact records the schema version it was shaped by is not addressed in `artifact-contracts.md` §7's table | All artifacts |
| 8 | The Business Truth vocabulary is unreconciled — `uncertain` maps to no canonical truth class, so the classification cannot be enumerated. Owned by `04-ai-creative-direction.md`, per §6's seventh gap | Business Intelligence Package |
| 9 | Concerns M and N are fixed in substance and unshaped in form. Accessibility's non-tradeable status and the producer / executing role / owning phase distinction are both settled, but no field, name or placement expresses either; both wait on concerns H and I | Design Blueprint, Critic Report, every envelope |

**No contradiction is recorded here.** Every item is a missing decision or a missing value. None is a case of two canonical documents disagreeing.

**Item 6 — implementation note.** The factory has not mandated a serialisation format, and the row above stands unchanged at the factory level. Separately, and at the implementation layer only, JSON Schema **draft-07** is the current choice for authoring schema files in `04-SCHEMA`. draft-07 is **not factory canon**: it is not derived from any canonical document, it settles nothing the row above leaves open, and it binds no artifact contract. A future change of schema dialect is an **implementation migration**, not a factory version change, unless the factory explicitly adopts a dialect as canon — at which point item 6 is resolved by that decision and not by this note.

---

## 10. Governing Decisions

| # | Decision |
|:--:|---|
| 1 | **A schema is a shape, never a rule.** A schema may express what the Control Plane already requires. It may not require anything the Control Plane does not, and it creates no gate. Where a schema and a canonical document diverge, the canonical document prevails and the divergence is a defect |
| 2 | **Envelope and payload are designed separately.** Envelope concerns are cross-artifact and largely already fixed; payload concerns are per-artifact and largely open. Separating them prevents payload gaps from blocking envelope work. The separation is analytical and asserts no structure |
| 3 | **An already-fixed concern is read, not re-decided.** Where a Control Plane document settles an envelope concern, the schema layer cites it and shapes it. Restating it in different words is a divergence risk, not documentation |
| 4 | **A missing value is recorded, never invented.** Where no canonical document declares a scale, range or boundary, the schema records the absence as the registries do. Assigning a type to complete a shape is inventing factory canon at the schema layer |
| 5 | **A deliberate absence is not a gap.** Where a phase document or registry explicitly declines to register something — `creativeRisk`, per `parameter-registry.md` §8 decision 20 — the schema layer honours the refusal and does not close it |
| 6 | **Runtime consequence stays with its owner.** A schema may make a violation detectable. Gating is `quality-gates.md`'s, routing is `failure-routing.md`'s, and the invalidation cascade is `failure-routing.md` §8's |
| 7 | **A hard constraint is shaped as a hard constraint.** Accessibility is absolute, non-tradeable and non-overridable, per §3.8's four sources. A schema MUST NOT shape it as optional, weighted, exemptible or convertible. This constrains shape only; it creates no gate, and the consequence of a failure remains `quality-gates.md`'s and `failure-routing.md`'s under decision 6 |
| 8 | **A distinction the sources drew is preserved, not collapsed.** Where canonical documents state that two similarly-named things are different — `creativeBudget` and `creativeIntensity`, `motionExpression` and `motionIntensity`, capability and fit and project value, the same parameter name at two scopes — a schema preserves the distinction. It invents no bound, conversion, derivation or aggregation between them. §7 collects these and cites the document that fixed each |
| 9 | **A closed set may be typed; an empty set may not.** Where a canonical document closes a construct set — the twelve artifact types, the five design languages `DL-01…DL-05`, the ten composition modes `C01`–`C10` — a schema may rely on that closure. Where the set is empty, as the pattern library is, closure of the *identifier namespace* is available and closure of the *value set* is not. Canonical construct IDs and classification constants are never restyled to satisfy a field-naming convention, per `parameter-registry.md` §8 decision 15 |
