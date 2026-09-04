---
document: Blogspage AI Website Factory
layer: Registry
artifact: Parameter Registry
status: draft
version: 0.4.0
authority: factory-global
---

# Parameter Registry

**Purpose:** the single authoritative record of every named parameter in the factory — what it is called, what it means, what range it takes, who owns it, who consumes it, and whether it is a hard constraint, a preference, or a runtime value.

**Derived from:** `01-DOCUMENTATION/01-foundation.md` (Phase 1) and `01-DOCUMENTATION/02-visual-design-languages.md` (Phase 2), plus the reconciliation decisions recorded in §8. §6.7 additionally derives from canonical Phase 3 and §6.8 from canonical Phase 4.

**Companion registry.** Phase 6's critic evaluation metrics are **not** recorded here. They are registered in `03-REGISTRY/critic-metrics-registry.md`, per §8 decision 21. A parameter constrains what implementation may produce; a metric scores what it did produce. See §6.9.

**Source document versions.** Recorded per `versioning.md` §3.1 rule 1:

| Source document | Version | Status |
|---|---|---|
| `01-DOCUMENTATION/01-foundation.md` | 1.0.0 | canonical |
| `01-DOCUMENTATION/02-visual-design-languages.md` | 1.0.0 | canonical |
| `01-DOCUMENTATION/03-composition-pattern-system.md` | 1.1.0 | canonical |
| `01-DOCUMENTATION/04-ai-creative-direction.md` | 1.0.0 | canonical |
| `01-DOCUMENTATION/05-ai-implementation.md` | 1.0.0 | canonical |
| `01-DOCUMENTATION/06-independent-critic.md` | 1.0.0 | canonical |

This is derivation metadata. It records which document versions this registry was reconciled from. It confers no authority over those documents, does not version them, and does not alter the precedence set by `source-of-truth.md` §1. A MAJOR change to either document makes this registry stale, per `versioning.md` §3.1 rule 2.

**Scope boundary:** This registry records parameter identity and classification. It does not restate design rationale. Where this registry and a phase document disagree on a parameter name or range, this registry governs; where they disagree on design substance, the phase document governs and the conflict is recorded in §7.

**Registration status:** Registered. This artifact is a recognized factory-global registry under `02-CONTROL-PLANE/source-of-truth.md` §3.1, and a versioned factory-global artifact under `02-CONTROL-PLANE/versioning.md` §3 (`Registries` row) and §3.1. Its authority is confined to the cross-phase concerns it explicitly assigns itself; it does not displace the canonical phase documents on phase-owned subject matter, per `source-of-truth.md` §3.1 rules 2, 3, 4 and 9. The scope boundary above states how that split applies here.

---

## 1. Classification Vocabulary

Every parameter is classified on three axes. The axes are independent.

### 1.1 Constraint Class

| Class | Meaning | Violation is |
|---|---|---|
| **Hard constraint** | MUST / MUST NOT. Non-negotiable. Applies regardless of design language, business type or creative ambition. | A defect. Blocks release. |
| **Preference** | SHOULD / SHOULD NOT, or a stated default. A deliberate, justified departure is permitted. | A judgement call, not a defect. |
| **Runtime value** | A value selected per project from a defined range. Has no correct value in the abstract. | Only meaningful as out-of-range. |
| **Capability set** | An enumeration of what the system can express. Neither a rule nor a value — the vocabulary other parameters draw from. | Using a member not in the set. |

### 1.2 Override Permission

| Marker | Meaning |
|---|---|
| **No** | MUST NOT be overridden by any phase, agent, language or project. |
| **By language** | A design language MAY set a different default within the owner's declared range. |
| **By project** | A project MAY select a different value within the declared range. |
| **By justification** | May be departed from where the departure is explicit and recorded. |

### 1.3 Ownership Roles

Per decision 12, exactly one phase **owns** each parameter. Other phases relate to it as:

| Role | Permission |
|---|---|
| **Owner** | Defines the parameter, its range, and its meaning. Single. |
| **Consumer** | Reads the value and acts on it. MUST NOT redefine it. |
| **Transformer** | Converts the value into another representation without changing its meaning. |
| **Evaluator** | Checks compliance. MUST NOT change the value or the rule. |

A phase that finds an owned parameter inadequate MUST raise the issue with the owner. It MUST NOT silently redefine it locally.

---

## 2. Creative Control Parameters

These are the parameters that govern creative expression. Decision 4 separates two that the source documents treat as one concept. They are **related but not numerically constrained** — neither bounds the other. See §2.3.

### 2.1 Creative Budget

| Field | Value |
|---|---|
| Canonical identifier | `creativeBudget` |
| Owner | Foundation (Phase 1) |
| Consumers | Phase 2 (informs language selection), Phase 4, Phase 5, Phase 6 |
| Definition | The creative latitude appropriate to a business and category context. |
| Scale / range | 1–10 |
| Constraint class | Preference |
| Override | By justification |
| Source | Foundation §18.3 |

Creative Budget expresses how much creative latitude suits the business and its category — conservatism of the industry, risk tolerance, audience expectation. It derives from business context, not from the chosen design language.

**It is not a ceiling.** `creativeBudget` does not cap `creativeIntensity`, and it is not an upper bound on any other parameter. It is a contextual indication of appropriate latitude, not a numeric limit applied to a second value.

Foundation §18.3 per-business values:

| Business | `creativeBudget` |
|---|:--:|
| Dental clinic | 5 / 10 |
| Medical clinic | 4 / 10 |
| Law firm | 3 / 10 |
| Luxury salon | 8 / 10 |
| Gym | 8 / 10 |
| Fine dining | 9 / 10 |

The source presents these as examples. Values for business types not listed are **UNDEFINED / TO BE RESOLVED**, and no derivation rule is stated.

### 2.2 Creative Intensity

| Field | Value |
|---|---|
| Canonical identifier | `creativeIntensity` |
| Owner | Phase 2 |
| Consumers | Phase 3, Phase 4, Phase 5, Phase 6 |
| Definition | The strength with which the selected design language is expressed. |
| Scale / range | 1–10 |
| Constraint class | Runtime value |
| Override | By project |
| Source | Phase 2 §9 |

Phase 2 §9.2 target ranges by business type:

| Business type | Target range |
|---|:--:|
| Medical | 4–6 |
| Dental | 6–8 |
| Legal | 3–5 |
| Salon | 7–9 |
| Gym | 8–10 |
| Restaurant | 8–10 |

Phase 2 §9.1 constrains intensity by business type, customer expectation, trust requirement, conversion sensitivity and brand maturity. Phase 2 §13 classifies brand maturity as Mature / Developing / Weak but does not state how each classification shifts an intensity value — recorded in Phase 2 §21 and in §7 below.

### 2.3 Relationship Between Budget and Intensity

**Rule:** `creativeBudget` and `creativeIntensity` are **related but not numerically constrained**.

The two parameters answer different questions:

| Parameter | Question it answers |
|---|---|
| `creativeBudget` | How much creative latitude is appropriate to this business and category? |
| `creativeIntensity` | How strongly is the selected design language expressed? |

**There is no comparison between them.** Specifically:

- `creativeIntensity` is **not** capped by `creativeBudget`.
- Neither value is a ceiling, floor or bound on the other.
- No formula, ratio, offset or derivation converts one into the other.
- A project whose `creativeIntensity` reads higher than its `creativeBudget` is **not** in violation of anything. The two are not on a shared axis, so the comparison carries no meaning.

Both are consumed as independent inputs. A consumer requiring a relationship between them MUST NOT invent one.

**Why the source tables do not conflict.** Foundation §18.3 lists per-business `creativeBudget` values and Phase 2 §9.2 lists per-business-type `creativeIntensity` ranges. Because the two parameters are not comparable, differing numbers for the same business label are not a contradiction and require no reconciliation. Both tables stand as written, and both are presented by their sources as examples rather than as complete specifications.

One genuine caveat survives: the business labels differ between the two documents — "Luxury salon" vs "Salon", "Fine dining" vs "Restaurant" — so any attempt to align rows across the two tables is inferred rather than stated. That labelling mismatch is recorded in §7.

### 2.4 Creativity Hierarchy

| Field | Value |
|---|---|
| Canonical identifier | `creativityHierarchy` |
| Owner | Phase 2 |
| Consumers | All phases |
| Definition | The order in which requirements must be satisfied. Levels 1–5 are gates; creative expression yields to everything above it. |
| Scale / range | Ordered list, 8 levels |
| Constraint class | Hard constraint (the ordering) |
| Override | No |
| Source | Phase 2 §18 |

```
1. Business truth
2. Customer needs
3. Conversion
4. Usability
5. Accessibility
6. Brand identity
7. Design language
8. Creative expression
```

The ordering is stated with "must always prioritize" and is a MUST. Once levels 1–7 are satisfied, the AI **should** actively search for the most distinctive tasteful composition available — a SHOULD, preserved as such.

**This is a satisfaction sequence, not a trade-off ranking.** The list states the order in which requirements must be *satisfied*, not an order in which they may be *sacrificed*. A lower-numbered level does not purchase the right to fail a higher-numbered one.

**Levels 1–5 are gates.** Business truth, customer needs, conversion, usability and accessibility are each a gate that MUST be satisfied. A design that fails any one of them is not acceptable at any level of creative ambition, and no amount of satisfaction at another level compensates for the failure.

Levels 6–8 — brand identity, design language, creative expression — are where genuine judgement and trade-off live. Creative expression yields to everything above it.

**On accessibility at level 5.** Its position in the sequence is **not** a licence to trade it against conversion or usability. Accessibility is a gate, and per decision 6 and §3.1 its parameters are absolute and non-overridable. Being listed below conversion means conversion is *addressed earlier in the sequence*, not that conversion outranks an accessibility minimum. Where an aesthetic or conversion goal conflicts with an accessibility minimum, the minimum wins and the goal must be re-expressed some other way. The Foundation §16 requirements are unweakened by this section, and the Phase 2 §18 text is unamended.

---

## 3. Accessibility Parameters

Per decision 6, accessibility parameters are **absolute**. Owner: Foundation. No design language, creative intensity, business type or aesthetic goal may weaken them. There is no "creative exemption."

### 3.1 Absolute Rule

Foundation §16 states accessibility is **not optional** and is **not decorative**. Every parameter in §3.2 is a hard constraint with override permission **No**.

Creative Budget and Creative Intensity have no effect on any accessibility parameter. A high `creativeIntensity` does not relax contrast, tap target size, focus visibility or motion-preference handling. Where an aesthetic preference and an accessibility minimum conflict, the accessibility minimum wins and the aesthetic preference must be re-expressed some other way.

### 3.2 Accessibility Parameter Set

| Parameter | Canonical identifier | Requirement | Source |
|---|---|---|---|
| Body text contrast | `contrastBodyMin` | ≥ 4.5:1 | Foundation §16.1 |
| Large text contrast | `contrastLargeMin` | ≥ 3:1 | Foundation §16.1 |
| Focus visibility | `focusVisible` | Focus states MUST be visible | Foundation §16.1 |
| Tap target minimum | `tapTargetMin` | 44 × 44 px | Foundation §16.1 |
| Reduced motion | `prefersReducedMotion` | MUST be respected | Foundation §16.1, §12.4 |
| Semantic structure | `semanticStructure` | Heading order MUST be logical; landmarks required | Foundation §16.1 |
| Alt text | `altTextRequired` | Meaningful images MUST have alt text | Foundation §16.1 |
| Keyboard operability | `keyboardOperable` | All interactive elements MUST be keyboard operable | Foundation §16.1 |

Owner for every row: Foundation. Constraint class for every row: Hard constraint. Override for every row: No. Consumers: Phase 5 (implements), Phase 6 (evaluates).

### 3.3 Reduced Motion and Motion Parameters

`prefersReducedMotion` interacts with both motion parameters in §4 but is not one of them. When the user preference is set, motion MUST be reduced regardless of `motionIntensity`, `motionExpression`, or the per-language motion band. This is a hard override in the accessibility direction only — it can lower effective motion, never raise it.

---

## 4. Motion Parameters

Per decision 5, motion has three separate representations. They are registered as three distinct parameters. **No mapping between them is defined, and none may be invented.**

### 4.1 `motionIntensity`

| Field | Value |
|---|---|
| Canonical identifier | `motionIntensity` |
| Owner | Foundation (Phase 1) |
| Consumers | Phase 5 (implements), Phase 6 (evaluates) |
| Definition | Structural motion budget — how much movement the built site is permitted. |
| Scale / range | 0–3 integer |
| Constraint class | Runtime value (selection within the 0–3 range) |
| Override | By project; by language via the per-language defaults below |
| Source | Foundation §12.3 |

Foundation §12.3 keys the scale to **business type**, not design language:

| Business type | `motionIntensity` |
|---|:--:|
| Dental | 1 |
| Luxury salon | 1–2 |
| Restaurant | 2 |
| Gym | 2–3 |

**Per-language defaults — FACTORY-DEFINED V1 DEFAULT**

| Design language | `motionIntensity` 0–3 |
|---|:--:|
| DL-01 Editorial | 1 |
| DL-02 Swiss | 0 |
| DL-03 Bold | 3 |
| DL-04 Soft | 1 |
| DL-05 Architectural | 2 |

**Provenance.** These five values are factory-authored V1 operational decisions. They were **not** extracted from Foundation §12.3, from Phase 2, or from any raw source, and they were **not** derived from `motionExpression`. Foundation §23.2 delegates the per-language default to Phase 2 and Phase 2 never states one, so no source-derived per-language layer exists. See Design Language Registry §5.6 and §5 for the provenance-layer scheme.

**Foundation §12.3's business-type values are unamended** and remain Foundation's. Which governs when a business-type value and a per-language default both apply to one project is **UNDEFINED / TO BE RESOLVED** and is recorded in §7.

**No mapping to `motionExpression` is created.** Decision 5 stands: the 0–3 and 1–10 scales are separate parameters, and no conversion between them is defined or permitted in either direction.

The concrete semantics of each of the four levels — what 0, 1, 2 and 3 each permit — remain **UNDEFINED / TO BE RESOLVED**. Supplying a per-language default does not define what the level means.

### 4.2 `motionExpression`

| Field | Value |
|---|---|
| Canonical identifier | `motionExpression` |
| Owner | Phase 2 |
| Consumers | Phase 3, Phase 4 |
| Definition | The motion dimension of the design language scoring profile. Stylistic character, not permitted quantity. |
| Scale / range | 1–10 integer |
| Constraint class | Preference (AI guidance) |
| Override | By language — it *is* a per-language value |
| Source | Phase 2 §4.3 |

Values: DL-01 = 4, DL-02 = 2, DL-03 = 9, DL-04 = 3, DL-05 = 7.

**Naming note.** Phase 2 §4.3 labels this dimension "Motion." Foundation §12.3 uses "Motion Intensity" for its own 0–3 parameter. The identifier `motionExpression` is assigned by this registry to keep the two distinct, because no better term exists in either source document. It is a registry-assigned name, not a source term — flagged in §7.

`motionExpression` MUST NOT be renamed `motionIntensity`, and MUST NOT be used as an input to any calculation producing a `motionIntensity` value.

### 4.3 `motionCharacter`

| Field | Value |
|---|---|
| Canonical identifier | `motionCharacter` |
| Owner | Phase 2 |
| Consumers | Phase 3, Phase 5 |
| Definition | The qualitative motion band and described motion behaviour per design language. |
| Scale / range | Ordinal labels: Minimal · Low · Low-to-moderate · Moderate-high · High |
| Constraint class | Preference |
| Override | By language |
| Source | Phase 2 §5.x.10, §6.1 |

Values: DL-01 = Low to moderate, DL-02 = Minimal, DL-03 = High, DL-04 = Low, DL-05 = Moderate-high.

This is a third representation, distinct from both §4.1 and §4.2. Its relationship to either is **UNDEFINED / TO BE RESOLVED**. Phase 2 §10 records the identical problem for visual tension, confirming this is a known source-level gap rather than an artifact of this registry.

### 4.4 `motionCapabilities`

| Field | Value |
|---|---|
| Canonical identifier | `motionCapabilities` |
| Owner | Foundation |
| Consumers | Phase 2 (selects from), Phase 5 (implements) |
| Definition | The enumerated motion behaviours the system can express. |
| Constraint class | Capability set |
| Override | No — a language may not extend the set |
| Source | Foundation §12.1, §12.2 |

A design language MAY select from this set and MAY prefer some members over others. It MUST NOT introduce a motion behaviour outside it.

---

## 5. Structural Parameters

Per decision 11, Foundation owns capabilities, ranges and mechanics; Phase 2 owns per-language preference within them.

### 5.1 Grid

| Parameter | Identifier | Owner | Range / value | Class | Override |
|---|---|---|---|---|---|
| Base grid | `gridColumns` | Foundation | 12 columns | Hard constraint | No |
| Column compositions | `gridCompositions` | Foundation | 8 permitted compositions (§6.2) | Capability set | No |
| Grid operations | `gridOperations` | Foundation | offset left · offset right · overlap · bleed (§6.3) | Capability set | No |
| Grid relationship | `gridRelationship` | Phase 2 | Break · Control · Compress-and-energize · Flow-through · Construct | Preference | By language |

Consumers: Phase 3 (composes with), Phase 5 (implements), Phase 6 (evaluates). A language expresses a relationship to the grid; it cannot change the grid's mechanics.

### 5.2 Spacing

| Parameter | Identifier | Owner | Range / value | Class | Override |
|---|---|---|---|---|---|
| Spacing scale | `spacingScale` | Foundation | 8 · 12 · 16 · 24 · 32 · 48 · 64 · 80 · 96 · 128 · 160 · 192 | Capability set | No |
| Spacing progression | `spacingProgression` | Foundation §7.2 | Per-language triples; 2 of 5 UNDEFINED | Preference | By language |
| Spacing rhythm | `spacingRhythm` | Phase 2 | Per-language ordinal sequence (§5.x.6) | Preference | By language |

`spacingProgression` values sit in Foundation §7.2 while Foundation §23.2 delegates "spacing rhythm aggressiveness" to Phase 2. The ownership inversion is recorded in §7. DL-04 and DL-05 progressions are **UNDEFINED / TO BE RESOLVED**.

### 5.3 Containers

| Parameter | Identifier | Owner | Range / value | Class | Override |
|---|---|---|---|---|---|
| Container classes | `containerClasses` | Foundation | Standard 70–80rem · Wide 85–95rem · Cinematic 100rem+ · Full bleed 100vw | Capability set | No |
| Container widths | `containerWidth` | Foundation | Approximate — §24.2 records them as unresolved | Preference | By language |
| Container expression | `containerExpression` | Phase 2 per §23.2 | **5 of 5 — FACTORY-DEFINED V1 DEFAULT** | Preference | By language |

**Per-language `containerExpression` — FACTORY-DEFINED V1 DEFAULT**

| Design language | FACTORY-DEFINED V1 DEFAULT | SOURCE-DERIVED — Foundation §5.3 |
|---|---|---|
| DL-01 Editorial | Asymmetric / occasional bleed | Asymmetric wide composition |
| DL-02 Swiss | Controlled / contained | Tight controlled container |
| DL-03 Bold | Flexible / occasional bleed | Not present in the source |
| DL-04 Soft | Fluid / soft containment | Not present in the source |
| DL-05 Architectural | Wide / edge-oriented | Edge-to-edge |

**Precedence.** The factory-defined value governs operational V1 decisions. The source-derived column is preserved for provenance and is never the operative value. Three divergences (DL-01, DL-02, DL-05) are intentional V1 operational decisions, not corrections to Foundation §5.3. Full divergence notes are in Design Language Registry §5.9.

Foundation §5.3 states the widths are "not hard visual numbers at this version" and become tokens each language MAY reinterpret. `containerWidth` remains approximate per Foundation §24.2 — that is unchanged, and the factory defaults govern expression, not mechanics.

### 5.4 Corners, Borders and Elevation

| Parameter | Identifier | Owner | Range / value | Class | Override |
|---|---|---|---|---|---|
| Shape range | `shapeRange` | Foundation §11.1 | sharp · subtle · soft · rounded · organic | Capability set | No |
| Per-language shape default | `shapeDefault` | Phase 2 per §23.2; values in Foundation §11.1 | 5 of 5 present, 4 use out-of-range terms | Preference | By language |
| Border language | `borderLanguage` | Phase 2 per §23.2 | **5 of 5 — FACTORY-DEFINED V1 DEFAULT** | Preference | By language |
| Elevation preference | `elevationPreference` | Foundation §11.2 | Structural borders preferred before heavy shadows | Preference | By justification |

**Per-language `borderLanguage` — FACTORY-DEFINED V1 DEFAULT**

| Design language | FACTORY-DEFINED V1 DEFAULT | SOURCE-DERIVED |
|---|---|---|
| DL-01 Editorial | Minimal / selective | Not present in the source |
| DL-02 Swiss | Structural / visible | Not present in the source |
| DL-03 Bold | Graphic / strong | Not present in the source |
| DL-04 Soft | Soft / restrained | Not present in the source |
| DL-05 Architectural | Thin / architectural | Not present in the source |

**Provenance.** Factory-authored V1 operational decisions. Not extracted from Foundation, Phase 2, or any raw source. Foundation §23.2 delegates border defaults to Phase 2 and Phase 2 assigns none, so no source-derived layer exists and none is displaced. The negative statements in Phase 2 §17.1 ("Heavy borders" as a DL-04 anti-pattern) and Foundation §11.2's elevation preference were not used to derive these values; both stand unamended. See Design Language Registry §5.5.

The `shapeDefault` vocabulary mismatch — "refined", "high contrast", "softer", "very sharp" are not members of `shapeRange` — is a source-level inconsistency inside Foundation §11.1. Recorded in §7. Not corrected here.

### 5.5 Typography

| Parameter | Identifier | Owner | Range / value | Class | Override |
|---|---|---|---|---|---|
| Type scale mechanics | `typeScale` | Foundation §8 | Fluid scaling required | Hard constraint | No |
| Heading hierarchy | `headingHierarchy` | Foundation | Logical order required | Hard constraint | No |
| Typography personality | `typographyPersonality` | Phase 2 §5.x.5 | 5 of 5 defined | Preference | By language |
| Typography drama | `typographyDrama` | Phase 2 §4.3 | 1–10 | Preference | By language |

Foundation §8.1 states the boundary explicitly: "Foundation says H1 must scale fluidly; Design Language says what H1 looks like."

### 5.6 Imagery

| Parameter | Identifier | Owner | Range / value | Class | Override |
|---|---|---|---|---|---|
| Aspect ratios | `imageRatios` | Foundation §10.1 | 1:1 · 4:5 · 3:4 · 4:3 · 16:9 · 21:9 | Capability set | No |
| Image treatments | `imageTreatments` | Foundation §10.1 | portrait · landscape · full bleed · masked · cropped · object-positioned | Capability set | No |
| Poor-photography pivot | `poorPhotoPivot` | Foundation §10.2 | Applies to every language | Hard constraint | No |
| Image DNA | `imageDNA` | Phase 2 §5.x.7 | 5 of 5 defined | Preference | By language |
| Asset dependency | `assetDependency` | Phase 2 §12.3 | Low-medium → Very high | Preference | By language |
| Asset fallback | `assetFallback` | Phase 2 | 2 of 5 defined | Preference | By language |

### 5.7 Navigation

| Parameter | Identifier | Owner | Range / value | Class | Override |
|---|---|---|---|---|---|
| Navigation function | `navigationFunction` | Foundation §17 | Brand + primary links + primary CTA MUST be accessible | Hard constraint | No |
| Navigation implementations | `navigationTypes` | Foundation §17 | minimal · transparent · floating · sticky · edge · compact · overlay | Capability set | No |
| Navigation expression | `navigationExpression` | Phase 2 per §23.2 | **5 of 5 — FACTORY-DEFINED V1 DEFAULT** | Preference | By language |

**Per-language `navigationExpression` — FACTORY-DEFINED V1 DEFAULT**

| Design language | FACTORY-DEFINED V1 DEFAULT | SOURCE-DERIVED |
|---|---|---|
| DL-01 Editorial | Minimal / refined | Not present in the source |
| DL-02 Swiss | Structured / precise | Not present in the source |
| DL-03 Bold | Strong / graphic | Not present in the source |
| DL-04 Soft | Subtle / floating | Not present in the source |
| DL-05 Architectural | Minimal / cinematic | Not present in the source |

**Provenance.** Factory-authored V1 operational decisions. Not extracted from Foundation §17, Phase 2, or any raw source. Foundation §23.2 delegates navigation visual expression to Phase 2 and Phase 2 assigns none, so no source-derived layer exists and none is displaced. See Design Language Registry §5.10.

Per decision 9 this is a clean split: Foundation defines what navigation must do and what forms exist; Phase 2 defines which form each language wears. The Phase 2 half is now supplied by factory default rather than by Phase 2 authorship, and Foundation §23.2's delegation is unamended.

**These are expression descriptors, not selections from `navigationTypes`.** Which of the seven Foundation implementation types each expression resolves to is **UNDEFINED / TO BE RESOLVED** and is recorded in §7. `navigationFunction` remains a hard constraint for every language — the defaults above remove no required element and extend no capability set.

### 5.8 Density

| Parameter | Identifier | Owner | Range / value | Class | Override |
|---|---|---|---|---|---|
| Content density | `contentDensity` | Phase 2 §11.2 | Low → Medium, or Medium → High per language | Preference | By language |
| Information density score | `informationDensity` | Phase 2 §4.3 | 1–10 | Preference | By language |

`contentDensity` (band) and `informationDensity` (1–10 score) are two representations of density with no stated mapping — the same pattern as motion and visual tension. Registered separately, not reconciled.

### 5.9 Responsive Behaviour

| Parameter | Identifier | Owner | Range / value | Class | Override |
|---|---|---|---|---|---|
| Responsive behaviour | `responsiveBehavior` | Foundation | Required | Hard constraint | No |
| Mobile compression prohibition | `noDesktopCompression` | Foundation | MUST NOT compress desktop into mobile | Hard constraint | No |

Phase 2 §20.1 states responsive behavior is Foundation's, not Phase 2's. The prohibition on compressing desktop into mobile is transcribed in Phase 2 §17.2's universal list but is structural, so per decision 7 it is a Foundation-owned universal rule.

---

## 6. Composition and Evaluation Parameters

### 6.1 Visual Tension

| Parameter | Identifier | Owner | Range / value | Class | Override |
|---|---|---|---|---|---|
| Visual tension band | `visualTensionBand` | Phase 2 §5.x.8 | Low-medium · Medium-high · High | Preference | By language |
| Visual tension score | `visualTension` | Phase 2 §4.3 | 1–10 | Preference | By language |

Phase 2 §10 explicitly records that the source does not reconcile these two. Registered as two parameters. No mapping is defined.

### 6.2 Anti-Patterns

Per decision 7, anti-patterns split by scope.

| Parameter | Identifier | Owner | Consumers | Class | Override |
|---|---|---|---|---|---|
| Universal anti-patterns | `universalAntiPatterns` | Foundation | Phase 3, 5; Phase 6 evaluates | Hard constraint | No |
| Language anti-patterns | `languageAntiPatterns` | Phase 2 §17.1 | Phase 3, 5; Phase 6 evaluates | Preference | By justification |

The 12 universal anti-template rules are structural and language-independent, so **Foundation owns them**. Phase 2 §17.2 transcribes them, but that transcription is a **non-normative reference** — the authoritative statement of a universal anti-pattern is Foundation's, and the Phase 2 copy carries no independent normative force. Nothing in the Phase 2 copy is deleted; it is scoped, not removed.

Phase 2 §17.1's per-language lists are language-scoped and all 25 entries are preserved in full. See Design Language Registry §5.14.

A language-specific anti-pattern MUST NOT be promoted to a universal prohibition. Phase 2 §17.1 gives the reason: kinetic typography is a DL-04 anti-pattern and a DL-03 motion option simultaneously.

The qualifier "automatically" is retained on the first three universal rules exactly as the source writes it — the target is automatic default use, not the existence of those compositions.

### 6.3 Novelty

Per decision 8, novelty splits into authoring and evaluation.

| Parameter | Identifier | Owner | Consumers | Class | Override |
|---|---|---|---|---|---|
| Novelty requirement | `noveltyRequirement` | Phase 2 §17.3 | Phase 3 | Preference (stated as "should") | By justification |
| Novelty checklist | `noveltyChecklist` | Phase 2 §17.3 | Phase 6 evaluates | Capability set | No |
| Novelty threshold | `noveltyThreshold` | Phase 6 | Phase 6 | **UNDEFINED / TO BE RESOLVED** | — |
| Cross-project comparison | `noveltyComparison` | Phase 6 | Phase 6 | **UNDEFINED / TO BE RESOLVED** | — |

The nine checklist items: hero composition · section sequence · grid structure · typography treatment · image placement · CTA style · card strategy · gallery strategy · rhythm.

The remedy when too many repeat is stated: **regenerate the composition, not merely the colors.**

Two things are missing and both are needed before the check is operable — the threshold for "too many," and the mechanism for comparing against previous projects. The source qualifies the comparison with "where possible," implying it may be unavailable at runtime. No threshold is invented here.

### 6.4 Section Sequence

Per decision 8, section-sequence ownership splits.

| Parameter | Identifier | Owner | Consumers | Class | Override |
|---|---|---|---|---|---|
| Section rhythm profile | `sectionRhythm` | Phase 2 §14.2 | Phase 3 | Preference (examples) | By language |
| Per-language section behavior | `sectionBehavior` | Phase 2 §5.x.9 | Phase 3, 5 | Preference | By language |
| Concrete section sequence | `sectionSequence` | Phase 4 | Phase 5, 6 | Runtime value | By project |
| Section vocabulary | `sectionVocabulary` | Phase 3 | All downstream | Capability set | — |

Phase 2 §14.1 names different section sets per language. A dash in that table means the source does not name that section for that language; it does **not** mean the section is forbidden. Whether the omissions are deliberate exclusions or merely unspecified is **UNDEFINED / TO BE RESOLVED**.

Section rhythm is a rhythm profile, not a template. Signature patterns (§16) are likewise characteristic, not required sections. Neither may be read as a fixed page sequence.

### 6.5 Language Selection

| Parameter | Identifier | Owner | Range / value | Class | Override |
|---|---|---|---|---|---|
| Scoring profile | `scoringProfile` | Phase 2 §4.3 | 10 dimensions × 5 languages, 1–10 | Preference (AI guidance) | No |
| Primary language | `primaryLanguage` | Phase 4 selects; Phase 2 defines the set | DL-01…DL-05 | Runtime value | By project |
| Secondary influence | `secondaryInfluence` | Phase 4 selects; Phase 2 defines compatibility | DL-01…DL-05 or none | Runtime value | By project |
| Combination status | `combinationStatus` | Phase 2 §15 | Strong · Caution | Preference | No |
| Psychology contradiction ban | `psychologyContradiction` | Phase 2 §15.3 | Secondary influence MUST NEVER contradict business psychology | Hard constraint | No |
| Influence proportion | `influenceProportion` | Phase 2 | One example only: 70/20/10 | **UNDEFINED / TO BE RESOLVED** | — |
| Brand maturity | `brandMaturity` | Phase 2 §13 | Mature · Developing · Weak | Runtime value | By project |
| Content volume | `contentVolume` | Phase 2 §19 | Named as a selection input | Runtime value | By project |
| Asset capability | `assetCapability` | Phase 2 §12 | MUST be evaluated before committing to a direction | Hard constraint (the evaluation) | No |

Phase 2 §19 states there is no single consolidated selection algorithm — the inputs are distributed across sections. Phase 2 §19.2 records that whether the §20.2 mental-model flow is a strict execution order or an illustrative architecture is **UNDEFINED / TO BE RESOLVED**.

`brandMaturity` classification is required, but its effect on `creativeIntensity` is **UNDEFINED / TO BE RESOLVED** (Phase 2 §13, §21).

**`brandMaturity` terminology variants.** Phase 3 §22.1 names this influence in prose as "Business maturity". That is the same concept as `brandMaturity`, not a separate parameter. `brandMaturity` is the canonical identifier; "Business maturity" and "business maturity" are recognised terminology variants. Phase 3 annotates the correspondence and does not fill the UNDEFINED effect. Issue 14 remains open and is unaffected.

Weak brand handling carries one stated rule: create a restrained system around actual business identity **without inventing an artificial "luxury brand."**

### 6.6 Content Integrity

| Parameter | Identifier | Owner | Requirement | Class | Override |
|---|---|---|---|---|---|
| No invented testimonials | `noInventedTestimonials` | Foundation | MUST NOT invent testimonials | Hard constraint | No |
| No invented statistics | `noInventedStatistics` | Foundation | MUST NOT invent statistics | Hard constraint | No |
| Business truth primacy | `businessTruth` | Business Research | Level 1 of the creativity hierarchy | Hard constraint | No |

Both prohibitions appear in Phase 2 §17.2's universal list. They are content-integrity rules rather than visual ones, so they are language-independent and owned above Phase 2.

### 6.7 Construct Identifier Namespace — pattern family prefixes

This subsection registers **identifiers**, not parameters. It exists because two Phase 3 construct families share the letter `C`, and the collision is unresolvable at schema-authoring time without a canonical decision. Registered under decision 14 (canonical name precedence) and decision 16 below.

**The collision.** `03-composition-pattern-system.md` §9 defines composition modes `C01`–`C10`. §11 of the same document defines fourteen pattern families by prefix, one of which is `C` for CTA. The source does not acknowledge the collision; Phase 3 §36 item 26 and Phase 4 §40.3 item 16 both record it as unresolved. A pattern ID in the `C` family would be written `C01`, which is already a composition mode.

**Resolution.** The canonical CTA pattern family prefix is **`CT`**. `C01`–`C10` remain composition modes and are unchanged. `C` is recorded as a **legacy alias** for the CTA pattern family, per decision 14: the registry identifier is canonical and the Phase 3 spelling is a recognised terminology variant. `03-composition-pattern-system.md` §11 is **not edited** — the source table is preserved verbatim, and this mapping is additive.

**Canonical pattern family prefixes.** Fourteen families, names exactly as Phase 3 §11 states them:

| Canonical prefix | Family | Phase 3 §11 prefix | Status |
|---|---|---|---|
| `H` | Hero | `H` | unchanged |
| `T` | Trust | `T` | unchanged |
| `S` | Services | `S` | unchanged |
| `A` | About/Story | `A` | unchanged |
| `P` | People | `P` | unchanged |
| `ST` | Statistics | `ST` | unchanged |
| `PR` | Process | `PR` | unchanged |
| `R` | Reviews | `R` | unchanged |
| `G` | Gallery | `G` | unchanged |
| `TR` | Transformation | `TR` | unchanged |
| `L` | Location | `L` | unchanged |
| `B` | Booking | `B` | unchanged |
| **`CT`** | **CTA** | `C` | **migrated** — `C` is a legacy alias |
| `F` | Footer | `F` | unchanged |

**Why `CT` and not a change to the modes.** The composition modes are referenced by ID across canonical Phase 3 (§9, §12, §33) and canonical Phase 4 (§28, and §32's rhythm note comparing `information`, `human` and `cinematic` to C03, C07 and C10). The CTA family prefix is referenced by ID **nowhere** — no CTA pattern ID appears in any source document, because Phase 3 §14.1 records that zero patterns are specified. Migrating the prefix with no instances is the smaller change and breaks no existing reference.

**Migration scope.** This is a **prepared migration, not an executed one.** It reserves `CT` and settles which prefix a future CTA pattern carries. It creates **no CTA pattern**, assigns no CTA pattern ID, and does not populate the pattern library. Phase 3 §14 remains accurate: 0 of the ~87 targeted patterns are specified. See `phase-ownership-matrix.md` §7 issue 9.

**Reading rule.** Any occurrence of a bare `C` as a *pattern family* prefix resolves to `CT`. Any occurrence of `C` followed by two digits (`C01`–`C10`) is a *composition mode* and never a pattern family. The two are disjoint under this rule, which is the whole point of the migration.

### 6.8 Phase 4 Strategy Parameters

Canonical Phase 4 names four parameters and records all four as **registry-absent** (`04-ai-creative-direction.md` §19.1, §22.3, §15.2, and consolidated in §40.2). **Three of the four are registered here** so that a schema author has a canonical identifier and owner for each; the fourth, `creativeRisk`, is deliberately left unregistered per decision 20 and the note below. **No range is invented.** Where Phase 4 declares no scale, this registry records the absence.

| Parameter | Identifier | Owner | Range / value | Class | Override |
|---|---|---|---|---|---|
| Image dominance | `imageDominance` | Phase 4 §22.1 | 1–10 | Runtime value | By project |
| Typography dominance | `typographyDominance` | Phase 4 §22.2 | 1–10 | Runtime value | By project |
| Competitor sameness | `competitorSameness` | Phase 4 §15.2 | **UNDEFINED** — emitted as `high`; no scale declared | Runtime value | By project |

**`creativeRisk` is deliberately not registered.** Phase 4 named four registry-absent strategy parameters; three are registered above and `creativeRisk` is not, by decision 20. It remains **document-local to Phase 4 §19**, which states outright that it adds no registry entry, assigns no scale, and does not fold the concept into `creativeIntensity` or `visualTension`. Registering an identifier for it would imply a factory-global contract the source declines to make. Its absence here is a decision, not an oversight — see §7 issue 22 and §8 decision 20.

**Concept ownership vs value ownership.** The same split applies to the three parameters above as to `creativeRisk`: a concept may be owned by one phase and its per-project value by another. `03-composition-pattern-system.md` §22.2 defines creative risk as a concept and distinguishes it from creative intensity, while Phase 4 §19 would own any per-project value. This is decision 13 applied — Phase 3 issues the fit statement, Phase 4 issues the value statement — and it holds whether or not an identifier is registered.

**Two scopes for dominance.** Phase 4 §36.3's illustrative instance shows `strategy.imageDominance: 8` alongside `composition.hero.imageDominance: 9`, so the same name is used at project scope and at pattern scope with different values. Phase 4 states **no derivation rule** between them. Under decision 13 the unqualified registry identifier above is the **project-scope value**; the pattern-scope occurrence is a distinct per-pattern parameter, read under its own path. No mapping is asserted. Recorded in §7.

**Registering an identifier is not defining a scale.** `competitorSameness` remains unusable as a numeric gate, because it has no declared range. Registration closes the *identifier* gap only. `06-independent-critic.md` §28 finding N2 makes the same point for `imageDominance` and `typographyDominance`: an evaluator cannot judge against a parameter with no registered definition. Their identifiers and ranges are now both recorded above, so N2's identifier half is closed; the two-scope question in §7 issue 24 is not.

### 6.9 Withdrawn — Phase 6 critic metrics

Phase 6's seven scorecard dimensions, its two risk axes, `blueprintFidelity` and `overallScore` were briefly recorded here. They are now registered in **`03-REGISTRY/critic-metrics-registry.md`**, per §8 decision 21.

A critic metric is scored on what implementation produced and constrains nothing. A parameter in this registry is authored upstream and constrains what implementation may produce. The two are different kinds travelling in opposite directions, so they are registered separately rather than as one subsection of the other. `artifact-contracts.md` §7 already enumerated "critic metrics" as a distinct registry version an artifact records; that reference now resolves.

This subsection number is retained as a pointer rather than reclaimed, so that any citation of §6.9 leads to the content instead of to a renumbered neighbour. Nothing is registered under it.

---

## 7. Unresolved Parameter Issues

| # | Issue | Nature | Blocks |
|:--:|---|---|---|
| 1 | Business-label mismatch between Foundation §18.3 and Phase 2 §9.2 | "Luxury salon" vs "Salon", "Fine dining" vs "Restaurant" — any cross-table alignment is inferred | Phase 4 |
| 2 | `motionIntensity` selection when business type and design language disagree | §4.1 supplies per-language defaults; Foundation §12.3 supplies business-type values; which governs is unstated | Phases 4, 5 |
| 3 | `motionIntensity` level semantics | What 0, 1, 2, 3 each permit is unstated | Phase 5 |
| 4 | `motionExpression` is a registry-assigned name | No source term distinguishes it from `motionIntensity` | Naming stability |
| 5 | `motionCharacter` ↔ `motionExpression` ↔ `motionIntensity` | Three representations, no mapping, none permitted | Phases 3, 4, 5 |
| 6 | `visualTensionBand` ↔ `visualTension` | Two representations, unreconciled per Phase 2 §10 | Phase 4 |
| 7 | `contentDensity` ↔ `informationDensity` | Two representations, no mapping | Phase 4 |
| 8 | `navigationExpression` → `navigationTypes` resolution | §5.7 supplies expression descriptors; which of the seven Foundation types each resolves to is unstated | Phase 5 |
| 9 | `spacingProgression` — DL-04, DL-05 | Partial | Phase 5 |
| 10 | `shapeDefault` vocabulary outside `shapeRange` | Inconsistency inside Foundation §11.1 | Token authoring |
| 11 | `containerWidth` values approximate | Foundation §24.2 records them unresolved | Token authoring |
| 12 | `noveltyThreshold` and `noveltyComparison` | Novelty check not operable without them | Phase 6 |
| 13 | `influenceProportion` beyond 70/20/10 | One example, no formula | Phase 4 |
| 14 | `brandMaturity` → `creativeIntensity` effect | Classification required, effect unstated | Phase 4 |
| 15 | `creativeBudget` for unlisted business types | Six examples, no derivation rule | Phase 4 |
| 16 | "Caution" combinations — what caution requires | Labelled, never defined | Phase 4 |
| 17 | Selection step ordering | §20.2 flow may be strict or illustrative | Phase 4 |
| 18 | Section omissions in Phase 2 §14.1 | Deliberate exclusion vs unspecified is unstated | Phase 3 |
| 19 | Ownership inversion: `spacingProgression`, `containerExpression` | Source values sit in Foundation while §23.2 delegates them to Phase 2 | Ownership clarity |
| 20 | ~~Phase 4–6 parameters are provisional~~ **RESOLVED** | All six phase documents are canonical. The provisional mechanism is retired, per `phase-ownership-matrix.md` §1.1 and §6 decision 16. Phase 4 parameters are registered in §6.8; Phase 6 critic metrics are registered in `critic-metrics-registry.md` | — |
| 21 | Pattern-level fit → project-level value aggregation | Phase 3 §12.2 expresses `patternIntensityFit`, `patternTensionFit` and `patternDensityFit` as fit statements. Whether a project value constrains pattern eligibility, is derived from the patterns chosen, or neither, is unstated | Phase 4 |
| 22 | `creativeRisk` is deliberately unregistered | **Not an oversight.** Phase 4 §19.1 declines to register it, declares no scale, and refuses to fold it into `creativeIntensity` or `visualTension`. Per §8 decision 20 it stays document-local to Phase 4 §19, so it has no factory-global identifier and is not gate-usable. A schema author MUST NOT add it to this registry to close the gap | Phase 4, Phase 6 |
| 23 | `competitorSameness` has no declared scale | Registered in §6.8. Phase 4 §36.2 emits `high` but declares no scale, and §15.2 does not state whether Low/Medium/High is the scale of the differentiation score, of competitor sameness, or of both | Phase 4, Phase 6 |
| 24 | `imageDominance` / `typographyDominance` at two scopes | Registered in §6.8 as project-scope values. Phase 4 §36.3 also uses the names at pattern scope with different values and states no derivation rule between the scopes | Phase 4, Phase 5 |
| 25 | CTA pattern family prefix migration is unexecuted | §6.7 reserves `CT` and records `C` as a legacy alias. Because zero patterns are specified (Phase 3 §14.1), there is nothing to migrate yet. The reservation is only exercised when the pattern library is populated | Pattern library authoring |

**Critic metric issues moved out.** Issues 25–29 of the previous version covered the critic per-dimension scale, the two dimensions without a threshold, the unratified thresholds, `templateRisk`'s binary-vs-three-level conflict, and the undefined hard-fail qualifiers. All five moved to `critic-metrics-registry.md` §5 with the content they describe, and are renumbered there as items 1–5. None was closed by the move. Issue 30 is renumbered 25 above.

**No contradiction remains in this registry.** Everything above is missing data, an unreconciled dual representation, or a documentation inconsistency.

**Resolved in this pass.**

| Previously | Resolution |
|---|---|
| Phase 4–6 parameters are provisional (issue 20) | Resolved. All six phase documents are canonical, so the provisional mechanism is retired. See §7 issue 20 and `phase-ownership-matrix.md` §6 decision 16. |
| `C` prefix collision — composition modes vs CTA family | Resolved by namespace decision, not by editing Phase 3. Canonical CTA prefix is `CT`; `C` is a legacy alias; `C01`–`C10` are unchanged. See §6.7 and decision 16. |
| `imageDominance`, `typographyDominance`, `competitorSameness` registry-absent | Resolved as an **identifier** gap only. All three are registered with an owner and class in §6.8. `competitorSameness` still has no declared scale, recorded in §7 issue 23, not closed. |
| `creativeRisk` registry-absent | **Deliberately left absent**, per §8 decision 20. Phase 4 §19.1 declines to register it and declares no scale; registering an identifier would imply a factory-global contract the source refuses to make. Recorded in §7 issue 22 as a decision, not a gap. |
| Seven critic dimensions, two risk axes, `blueprintFidelity` and `overallScore` registry-absent | Resolved as an identifier gap, in **`critic-metrics-registry.md`** rather than here, per §8 decision 21. Registered there with Phase 6's weights and its own suggested thresholds, at suggested strength. Scale and aggregation remain open as that registry's §5 item 1. |
| `creativeIntensity` exceeds `creativeBudget` in every source pairing | Not a conflict. The two parameters are related but not numerically constrained, so the comparison carries no meaning and neither source table needs adjusting. See §2.3. |
| `borderLanguage` — all five | Complete by factory-defined V1 default. See §5.4. |
| `navigationExpression` — all five | Complete by factory-defined V1 default. See §5.7. |
| `containerExpression` — DL-03, DL-04 | Complete for all five by factory-defined V1 default. See §5.3. |
| Per-language `motionIntensity` — all five | Complete by factory-defined V1 default. See §4.1. |
| Accessibility at hierarchy level 5 vs absolute status | Not two competing readings. The hierarchy is a satisfaction sequence in which levels 1–5 are gates, so level 5 never licenses failing an accessibility minimum. See §2.4. |

---

## 8. Governing Decisions

| # | Decision |
|:--:|---|
| 1 | Registries live in `03-REGISTRY/` as factory-global authority artifacts |
| 4 | Creative Budget (Foundation, business/category latitude) and Creative Intensity (Phase 2, strength of expression) are separate parameters. They are related but **not numerically constrained** — no comparison, cap, formula or derivation between them |
| 5 | `motionIntensity` 0–3 (Foundation) and `motionExpression` 1–10 (Phase 2) are separate; no mapping |
| 6 | Accessibility parameters are absolute; no creative exemption |
| 7 | Foundation owns universal anti-patterns; Phase 2 owns language-specific ones; Phase 6 evaluates both |
| 8 | Novelty requirement is Phase 2's; novelty evaluation and threshold are Phase 6's. Section rhythm splits three ways: the **per-language rhythm profile** is Phase 2's (§14.2); **rhythm as a composition concept and its token vocabulary** are Phase 3's (§17); the **concrete per-project rhythm sequence** is Phase 4's, fixed in the blueprint (`phase-ownership-matrix.md` Row 34) |
| 9 | Navigation function and available types are Foundation's; visual expression is Phase 2's |
| 10 | Corner, border and container: Foundation owns range and mechanics, Phase 2 owns per-language defaults |
| 11 | Foundation owns capabilities and ranges; Phase 2 owns preferences within them |
| 12 | One authoritative owner per concern; consumers MUST NOT silently redefine |
| 13 | **Fit vs value.** A parameter name applied to a *construct* (a pattern, a mode, a family) is a **fit statement**: it says what conditions that construct suits. The same name applied to a *project* is a **value statement**. Phases 1–3 may issue fit statements; **only Phase 4 issues value statements.** The unqualified registry identifier is always the value; fit statements are read under distinct fit identifiers |
| 14 | **Canonical name precedence.** Where a phase document and this registry name the same concept differently, the registry identifier is canonical and the phase spelling is a recognised terminology variant. Source spellings are preserved verbatim in quoted source blocks; mappings are additive and never rewrite a source quotation in place |
| 15 | **`camelCase` for field identifiers.** The canonical form of a parameter or field identifier is `camelCase`. `snake_case` source forms are legacy variants that map to it. The convention governs field identifiers only — it does not restyle prefixed construct IDs (`C01`, `S01`, `DL-01`), uppercase classification constants (`PRIMARY`, `MANDATORY`), natural-language prose names ("Editorial Luxury"), or verbatim source quotations |
| 16 | **Construct identifier namespaces MUST be disjoint.** Two construct families MUST NOT share an identifier form. Where the source collides, this registry assigns a canonical prefix and records the source form as a legacy alias under decision 14. The first application is the CTA pattern family: canonical `CT`, legacy alias `C`, with composition modes `C01`–`C10` unchanged. See §6.7. The owning phase document is not edited; the mapping is additive |
| 17 | **Registering an identifier does not define its range.** A parameter may be registered with an owner, an identifier and a class while its range remains **UNDEFINED**, when no canonical document declares one. Registration confers identity, not operability, and a registered identifier with an undefined range MUST NOT be used as a numeric gate. See §6.8 |
| 18 | **Relocated.** Evaluation dimensions are a distinct kind — now `critic-metrics-registry.md` §6 decision 1, with the content it governs |
| 19 | **Relocated.** Suggested values are recorded, not ratified — now `critic-metrics-registry.md` §6 decision 2, with the content it governs. The principle is general and applies to any registry; it is stated where the suggested values live |
| 20 | **Non-registration may be deliberate.** Where a canonical phase document explicitly declines to register a parameter, assigns it no scale, and refuses to fold it into a neighbouring parameter, this registry records the refusal rather than overriding it. Such a parameter stays **document-local** to its owning phase: it has no factory-global identifier, no registry row, and MUST NOT be added to close an apparent gap. Absence recorded under this decision is a decision, not an oversight. The first application is `creativeRisk`, document-local to Phase 4 §19. See §6.8 and §7 issue 22 |
| 21 | **One registry per kind.** A registry holds one kind of record. Design parameters are authored upstream and constrain what may be produced; critic metrics are scored on what was produced and constrain nothing. Because they travel in opposite directions and have different owners and lifecycles, they are registered in separate documents rather than as subsections of one another. `parameter-registry.md` governs parameters; `critic-metrics-registry.md` governs metrics. §6.9 is retained as a pointer |
