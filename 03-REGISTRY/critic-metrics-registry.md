---
document: Blogspage AI Website Factory
layer: Registry
artifact: Critic Metrics Registry
status: draft
version: 0.1.0
authority: factory-global
---

# Critic Metrics Registry

**Purpose:** the single authoritative record of every named critic evaluation metric — what it is called, what it scores, what range or vocabulary it takes, what weight it carries, and at what strength any threshold on it is stated.

**Derived from:** `01-DOCUMENTATION/06-independent-critic.md` (Phase 6), plus the governing decisions recorded in §6.

**Source document versions.** Recorded per `versioning.md` §3.1 rule 1:

| Source document | Version | Status |
|---|---|---|
| `01-DOCUMENTATION/06-independent-critic.md` | 1.0.0 | canonical |

This is derivation metadata. It records which document version this registry was reconciled from. It confers no authority over that document, does not version it, and does not alter the precedence set by `source-of-truth.md` §1. A MAJOR change to Phase 6 makes this registry stale, per `versioning.md` §3.1 rule 2.

**Scope boundary:** This registry records metric identity, weight and stated threshold strength. It does not define evaluation method, does not restate Phase 6's critique rationale, and does not create a gate. Where this registry and Phase 6 disagree on a metric name, this registry governs; where they disagree on evaluation substance, Phase 6 governs and the conflict is recorded in §5.

**Registration status:** Registered. This artifact is a recognized factory-global registry under `02-CONTROL-PLANE/source-of-truth.md` §3.1, and a versioned factory-global artifact under `02-CONTROL-PLANE/versioning.md` §3 (`Registries` row) and §3.1. Its authority is confined to the cross-phase concerns it explicitly assigns itself; it does not displace canonical Phase 6 on phase-owned subject matter, per `source-of-truth.md` §3.1 rules 2, 3, 4 and 9. The scope boundary above states how that split applies here.

**Why this registry is separate from the parameter registry.** A design parameter is authored upstream and constrains what implementation may produce. A critic metric is scored on what implementation did produce, and constrains nothing. The two are different kinds with different owners, different lifecycles and opposite directions of travel, so they are registered separately rather than as one subsection of the other. `artifact-contracts.md` §7 already enumerates "critic metrics" as a distinct registry an artifact records the version of. This registry is the record that reference resolves to.

**Relationship to `parameter-registry.md`.** These metrics were previously recorded as §6.9 of `parameter-registry.md`. That subsection is withdrawn and its content is carried here without change of meaning. See `parameter-registry.md` §7 and its resolved-issue table.

---

## 1. Metric Kind

Every entry in this registry is an **evaluation metric**. The kind is defined once here rather than per row.

| Property | Definition |
|---|---|
| Scored on | The rendered result, per `artifact-contracts.md` §5.12 |
| Scored by | Independent Critic, authority level 6 per `source-of-truth.md` §1 |
| Authored by | No upstream phase. A metric has no author, only a scorer |
| Constrains implementation | No. A metric is diagnostic, never prescriptive |
| Override permission | None. Per `source-of-truth.md` §2, a critic finding is a diagnosis, not an override |
| Registered for | Identifier stability only, per §6 decision 1 |

---

## 2. Scorecard Dimensions

Phase 6's seven weighted scorecard dimensions. Weights are `06-independent-critic.md` §21.1, preserved exactly. Owner is Phase 6 for all seven.

| Dimension | Identifier | Weight | Suggested threshold | Kind |
|---|---|:--:|---|---|
| Business Fit | `businessFit` | 15% | ≥ 90 | Evaluation dimension |
| Brand Specificity | `brandSpecificity` | 10% | **none stated** | Evaluation dimension |
| Visual Quality | `visualQuality` | 20% | ≥ 90 | Evaluation dimension |
| UX / Usability | `ux` | 15% | ≥ 90 | Evaluation dimension |
| Conversion | `conversion` | 15% | ≥ 90 | Evaluation dimension |
| Technical Quality | `technical` | 10% | **none stated** | Evaluation dimension |
| Creative Distinction | `creativeDistinctiveness` | 15% | ≥ 85 | Evaluation dimension |

The seven weights sum to 100. That the weights sum to 100 is a property of the source table; it does not by itself establish an aggregation method. See §3.

### 2.1 Scored outside the weighted 100

| Output | Identifier | Range / vocabulary | Suggested threshold | Kind |
|---|---|---|---|---|
| Blueprint Fidelity | `blueprintFidelity` | 0–100 | **none stated** | Evaluation dimension |
| Template Risk | `templateRisk` | LOW · MEDIUM · HIGH | = LOW | Evaluation dimension |
| AI-Generic Risk | `aiGenericRisk` | LOW · MEDIUM · HIGH | = LOW | Evaluation dimension |
| Overall score | `overallScore` | **UNDEFINED** — no aggregation formula stated | ≥ 90 | Evaluation dimension |

`blueprintFidelity` is the only metric in this registry with an explicitly stated numeric range.

### 2.2 Name resolution

Phase 6 names three dimensions two ways. Per `parameter-registry.md` §8 decision 14, the identifier is canonical and the prose spelling is a recognised terminology variant:

| Canonical identifier | Phase 6 prose name | Status |
|---|---|---|
| `creativeDistinctiveness` | Creative Distinction | prose variant |
| `ux` | UX / Usability | prose variant |
| `technical` | Technical Quality | prose variant |

The canonical form is the one Phase 6's own §26 report emits, so this preserves the machine-readable field rather than replacing it. Phase 6 §21.1 prose and §26's report field are both retained in the source; this mapping is additive and edits neither.

---

## 3. Strength of Every Threshold Above

**The thresholds are SUGGESTED, not canonical.** `06-independent-critic.md` §21.3 carries the source's own one-word preface, "Suggested:", and §21.4 states outright that the critic evaluates profile rather than average. Recording those values here **does not ratify them** and creates no gate. `quality-gates.md` enforces none of them and contains no numeric score or threshold of its own. Registration records what Phase 6 states, at the strength Phase 6 states it.

**Per-dimension scale is undefined.** The weights sum to 100 and the thresholds are written as numbers on an implied 0–100, but no canonical document states the per-dimension scale, the aggregation computation, or rounding. A weighted mean is the obvious reading and is **not** asserted here. Recorded in §5 and as `06-independent-critic.md` §28 finding U14.

**Registering a metric does not make it operable.** Per `parameter-registry.md` §8 decision 17, applied here to metrics: an identifier may be registered while its scale remains UNDEFINED, and a registered metric with an undefined scale MUST NOT act as a numeric gate. `overallScore` is registered and is not computable from this registry.

---

## 4. Hard-Fail Conditions

**Nine hard-fails outrank every score.** `06-independent-critic.md` §21.2 lists nine conditions that block shipment regardless of any score above. No threshold in this registry overrides them, and no score in this registry satisfies them.

Four of the nine turn on an undefined qualifier — "major", "severe" or "high" — with no defined threshold in any canonical document. This registry records that the conditions exist and that four are unquantified. It does **not** supply the missing qualifiers.

---

## 5. Unresolved Metric Issues

Carried from `parameter-registry.md` §7 issues 25–29, which are withdrawn there and renumbered here.

| # | Issue | Nature | Blocks |
|:--:|---|---|---|
| 1 | Per-dimension scale and aggregation | §2 registers seven weighted dimensions whose weights sum to 100, but no canonical document states the per-dimension scale, the aggregation computation or rounding. A weighted mean is not asserted | Phase 6 |
| 2 | Two dimensions have no threshold | `brandSpecificity` and `technical` are weighted in §2 but absent from Phase 6 §21.3's suggested list. `blueprintFidelity` likewise has no stated passing value | Phase 6 |
| 3 | Thresholds are unratified | Phase 6 §21.3's ten values carry the source's own "Suggested:" label. No Control Plane gate enforces them, so §2 records them without ratifying them | Phase 6 gating |
| 4 | `templateRisk` binary vs three-level | Phase 6 §17.3 asks a yes/no question; §21.3 requires `= LOW`, implying the three-level scale. Unreconciled in the source; both forms preserved in §2.1 | Phase 6 |
| 5 | Hard-fail qualifiers undefined | Four of Phase 6 §21.2's nine hard-fails turn on "major", "severe" or "high" with no defined threshold. §4 records the identifiers only | Phase 6 |
| 6 | `noveltyThreshold` and `noveltyComparison` are absent | The novelty check Phase 2 requires and Phase 6 evaluates has no registered threshold or comparison basis. Tracked as `parameter-registry.md` §7 issue 12; repeated here because it blocks a Phase 6 evaluation | Phase 6 |

**No contradiction remains in this registry.** Every item above is a missing value, a missing method, or an unreconciled dual representation in the source. None is filled by invention here.

---

## 6. Governing Decisions

Decisions 1 and 2 were previously recorded as `parameter-registry.md` §8 decisions 18 and 19 and are relocated here with the content they govern.

| # | Decision |
|:--:|---|
| 1 | **Evaluation metrics are a distinct kind.** A critic scorecard dimension is scored on the produced result; it is not authored by an upstream phase, does not constrain implementation, and carries no override permission. Metrics are registered for identifier stability only |
| 2 | **Suggested values are recorded, not ratified.** Where a source labels its own numbers as suggested, this registry records them at that strength. Recording a suggested threshold creates no gate; only `quality-gates.md` creates gates |
| 3 | **Critic metrics are registered separately from design parameters.** The two are different kinds with opposite directions of travel — a parameter constrains what is produced, a metric scores what was produced. Neither is a subsection of the other. `parameter-registry.md` governs parameters; this registry governs metrics |
| 4 | **A metric registration is not a gate.** Gating is `quality-gates.md`'s exclusively. A metric may be registered, weighted and carry a suggested threshold while no gate anywhere enforces it |
