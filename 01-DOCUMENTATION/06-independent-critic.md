---
document: Blogspage AI Design System V1
phase: 6
name: Independent Design Critic, Diagnostic & Refinement Engine
status: canonical
version: 1.0.0
source: 06-independent-critic-raw.md
---

# Blogspage AI Design System V1

# Phase 6 — Independent Design Critic, Diagnostic & Refinement Engine

**Derived from:** `01-DOCUMENTATION/06-independent-critic-raw.md`. The raw source is
organised as sixty-five numbered subsections (§6.0–§6.64). Section references written
as "raw §6.n" in this document cite those subsection numbers.

**Scope boundary:** Phase 6 is the **judgement** phase. It consumes the rendered
website, the Phase 4 Design Blueprint, the Phase 5 Implementation Report and the
upstream business record, and it produces a Critic Report and a Refinement Plan. Phase 6
answers **whether the delivered result is good, and if not, why and where the fault
originated**. It does not decide what the business should receive (Phase 4), does not
build (Phase 5), and does not authorise delivery (human approver). Where the raw source
restates a construct that Phase 1, 2, 3, 4 or 5 owns, this document references the
owning phase rather than redefining it.

**Phase 6 consumes the full evidence chain and produces two artifacts:**

```
Design Blueprint (Phase 4)  +  Website source & Implementation Report (Phase 5)
     |  plus the upstream business record and the rendered result
Independent Critic
     |  produces
Critic Report  +  Refinement Plan        (Phase 6-owned, per project)
     |  consumed by
Human approver (Gate 3)  ·  Refinement Engineer  ·  Creative Director on regression
```

See `02-CONTROL-PLANE/artifact-contracts.md` §5.7 and §5.8,
`02-CONTROL-PLANE/quality-gates.md` §7 and §8, `02-CONTROL-PLANE/agent-roles.md` §3.5
and §3.6, `02-CONTROL-PLANE/failure-routing.md`, `02-CONTROL-PLANE/human-approval.md`
§4.3, and `03-REGISTRY/phase-ownership-matrix.md` Rows 40–43.

**Normative language:** MUST, SHOULD and MAY carry their source strength. The raw
Phase 6 source is written largely as design commentary in the first person ("This is a
major improvement", "I would use", "That is a key improvement"). §2.3 separates the
genuine requirements from that commentary. Editorial approval of an idea is not itself
a requirement, and this document does not promote it to one.

**Quantities:** Phase 6 is the first raw phase to state numeric weights, thresholds and
score examples. Every such quantity is preserved exactly as the source gives it, and
labelled with the strength the source itself assigned. Raw §6.46 is prefaced by the
source's own word **"Suggested"**; it is carried as suggested, not as a pass condition.
Raw §6.44 weights and raw §6.60 scores are carried as source-stated and illustrative
respectively. No threshold, weight, formula or scale in this document was invented here.

**Ownership status:** All four Phase 6 rows in `03-REGISTRY/phase-ownership-matrix.md`
(Rows 40–43) are recorded as **provisional**, not canonical. Row 43 (novelty
evaluation) is recorded there as **not operable**, because `noveltyThreshold` and
`noveltyComparison` are both UNDEFINED. §17 and §28 record this rather than resolving
it.

---

## 1. Purpose

Phase 6 inspects the rendered website and judges whether it is actually good, diagnoses
why where it is not, and verifies that corrections improved it (raw §6.0).

The source states Phase 6's job as a five-step obligation rather than a rating exercise:

> Its job is not merely: "Rate the website."
>
> Its job is: **Inspect → diagnose → prioritize → prescribe → validate improvement.**

A Phase 6 pass therefore does not end at a verdict. It ends only when a prescribed
correction has been re-inspected in its newly rendered state (§24).

### 1.1 Position of Phase 6 in the loop

Raw §6.0 states the complete loop, including its return to the critic after
implementation:

```
DESIGN BLUEPRINT
    |
WEBSITE BUILD
    |
RENDERED WEBSITE
    |
INDEPENDENT CRITIC
    |
DIAGNOSIS
    |
REFINEMENT PLAN
    |
IMPLEMENTATION
    |
RENDER
    |
INDEPENDENT CRITIC
    |
COMPARE
    |
APPROVE / REFINE / REBUILD
```

The critic appears twice. The second appearance is not optional; it is what makes the
prescription verifiable. See §24 for the re-evaluation requirement and §27 for the
outcome vocabulary at the foot of this diagram.

### 1.2 Phase 6's four core questions

Raw §6.62 reduces the phase to four questions, each bound to a dimension group:

| # | Question | Answered by |
|---|---|---|
| 1 | Is it right? | Business Fit |
| 2 | Is it good? | Visual / UX / Technical Quality |
| 3 | Is it distinctive? | Creative Quality |
| 4 | Is it genuinely finished? | Independent Refinement |

Question 4 is the one that distinguishes Phase 6 from a scoring pass. "Genuinely
finished" is established by independent re-inspection, not by the builder's or the
refiner's own report.

### 1.3 Authority, and its limit

Raw §6.0 opens by calling Phase 6 "the **final quality authority** in the Blogspage AI
Factory."

That phrase is preserved as the source's, and scoped here, because the Control Plane
places final delivery authority with the human approver:

| Source | Statement |
|---|---|
| `agent-roles.md` §3.5 | The Independent Critic MUST NOT approve delivery |
| `agent-roles.md` §4.6 | Delivery authority is human |
| `human-approval.md` §6.2 | Final shipment is the human's decision; the AI recommends |
| `quality-gates.md` §8 | Final Approval gate owner is the human approver |

**Reconciliation.** Phase 6 is the final authority on **quality judgement** among the
factory's AI roles: no AI role overrides the critic's assessment, and no path reaches
APPROVED without passing through critique (`state-machine.md` §5 invariant 1). Phase 6
is **not** the authority on **delivery**. It recommends; the human decides. Recorded as
discrepancy **D1** in §28.

---

## 2. Source Mapping and Requirement Strength

### 2.1 Coverage

The raw source contains 65 subsections, §6.0 through §6.64. All 65 are represented in
this document. None was dropped.

The raw file is a Word export: it carries HTML entities (`&mdash;`, `&rarr;`, `&darr;`,
`&ge;`, `&boxvr;`) and blank-line padding between every line of content. Entities are
rendered to their characters in this document; ASCII arrows are used inside code blocks.
The trailing `Top of Form` / `Bottom of Form` artefacts at raw lines 1751–1755 are export
residue and carry no content.

### 2.2 Raw-to-canonical section map

| Raw | Subject | Canonical |
|---|---|---|
| 6.0 | Purpose, inspect→validate loop | §1, §1.1 |
| 6.1 | Judges outcomes, not intentions | §3.1 |
| 6.2 | Independent in role | §4 |
| 6.3 | Critic inputs | §5.1 |
| 6.4 | Target Experience extraction | §5.2 |
| 6.5 | Two evaluation modes | §6.1 |
| 6.6 | Seven evaluation dimensions | §6.2 |
| 6.7 | Business Fit | §8 |
| 6.8 | Brand Specificity | §9 |
| 6.9 | Visual Quality | §11.1 |
| 6.10 | UX / Usability | §12.1 |
| 6.11 | Conversion | §13.1 |
| 6.12 | Technical Quality | §14.1, §15, §16 |
| 6.13 | Creative Distinction | §17.1 |
| 6.14 | Blueprint Fidelity | §10.1 |
| 6.15 | Creative Drift | §10.2 |
| 6.16 | Root-cause diagnosis | §19 |
| 6.17 | Evidence-based criticism | §7.1 |
| 6.18 | Observation vs opinion | §7.2 |
| 6.19 | Severity system P0–P3 | §20.1 |
| 6.20 | Fix priority | §20.2 |
| 6.21 | Never "change everything" | §22.2 |
| 6.22 | Section-by-section diagnosis | §18.1 |
| 6.23 | Page-level diagnosis | §18.2 |
| 6.24 | Scroll story test | §18.3 |
| 6.25 | Visual rhythm test | §11.2 |
| 6.26 | Visual anchor test | §11.3 |
| 6.27 | Quiet zone test | §11.4 |
| 6.28 | Pattern repetition test | §11.5 |
| 6.29 | AI-Generic Risk | §17.2 |
| 6.30 | Template Risk | §17.3 |
| 6.31 | Competitive differentiation | §17.4 |
| 6.32 | Category familiarity | §17.5 |
| 6.33 | Mobile critic | §12.2 |
| 6.34 | Accessibility critic | §14.2 |
| 6.35 | Conversion path simulation | §13.2 |
| 6.36 | Five-second test | §12.3 |
| 6.37 | Ten-second test | §12.3 |
| 6.38 | Thirty-second test | §12.3 |
| 6.39 | Design language integrity | §10.3 |
| 6.40 | Language contamination | §10.4 |
| 6.41 | Creative intent test | §10.5 |
| 6.42 | Polished / premium / creative | §11.6 |
| 6.43 | Blogspage signature standard | §17.6 |
| 6.44 | Critic scorecard and weights | §21.1 |
| 6.45 | Hard-fail rules | §21.2 |
| 6.46 | Suggested quality threshold | §21.3 |
| 6.47 | Score alone does not decide | §21.4 |
| 6.48 | Refinement plan | §23.1 |
| 6.49 | Instructions must be specific | §23.2 |
| 6.50 | Refinement scope | §23.3 |
| 6.51 | Regression protection | §24.1 |
| 6.52 | Before/after comparison | §24.2 |
| 6.53 | Evidence of improvement | §24.3 |
| 6.54 | Iteration stop conditions | §24.4 |
| 6.55 | Blueprint reconsideration | §22.3 |
| 6.56 | Asset reality check | §22.4 |
| 6.57 | Content reality check | §22.4 |
| 6.58 | Phase regression | §22.5 |
| 6.59 | Full diagnostic loop | §25 |
| 6.60 | Critic report structure | §26 |
| 6.61 | Final approval states | §27 |
| 6.62 | Four core questions | §1.2, §29.1 |
| 6.63 | Final principle | §3.2, §29.2 |
| 6.64 | Complete factory | §29.3, §29.4 |

### 2.3 Requirement strength inventory

The raw source states few hard prohibitions but many obligations. This inventory
separates them from the source's editorial commentary.

**MUST-strength statements (source wording):**

| Raw | Statement |
|---|---|
| 6.17 | "Every major criticism **must** include evidence" |
| 6.18 | "The critic **must** distinguish" observation, interpretation, recommendation |
| 6.16 | The critic **must** diagnose root cause (section title) |
| 6.2 | "The critic **must** be comfortable saying: The implementation is wrong" |
| 6.45 | Hard-fail conditions → "**DO NOT SHIP**" regardless of score |
| 6.30 | Interchangeable-client test: "If yes: **FAIL**" |
| 6.61 | "The critic returns **exactly one**" outcome |

**SHOULD-strength statements:** raw §6.21 (never "change everything" unless
fundamentally wrong), §6.22 and §6.24 (section scoring, scroll narration), §6.31–§6.32
(differentiation, familiarity), §6.35–§6.38 (path simulation, timed tests), §6.43
(portfolio question), §6.51–§6.53 (regression checks, comparison, evidence of
improvement), §6.56–§6.57 (asset and content reality checks).

**Source commentary, not requirements.** The following are the author's assessments of
their own proposals and carry no obligation: "This is an important improvement" (§6.5),
"That is a key improvement" (§6.2), "This is a major improvement" (§6.16), "This is
extremely important" (§6.39), "This is a powerful addition" (§6.55), "This creates an
extremely useful architecture" (§6.58), "This is important" (§6.47), "This is essential"
(§6.51), "That matters for your creativity requirement" (§6.63), "I would use" (§6.6,
§6.44), "I would make this the official principle" (§6.63).

**Suggested, by the source's own label.** Raw §6.46 opens with the single word
"Suggested:" before its ten threshold values. §21.3 preserves that label.

### 2.4 Identifier naming

The raw source names scores in prose ("Business Fit", "Creative Distinction") in §6.6
and §6.44, and in `camelCase` in the §6.60 report example. Registry canon is `camelCase`
for machine-readable fields. The §6.60 field names are the source's own and are preserved
verbatim in §26.

Two naming inconsistencies exist inside the source itself:

| §6.6 / §6.44 prose | §6.60 field | Note |
|---|---|---|
| Creative Distinction | `creativeDistinctiveness` | Two names for one dimension |
| UX / Usability | `ux` | Abbreviated in the report |

None of these score names is present in `03-REGISTRY/parameter-registry.md`. They are
Phase 6 report fields, not registry parameters, and this document does not add them to
the registry. Recorded as **N1** in §28.

---

## 3. Core Principles

### 3.1 The critic judges outcomes, not intentions

Raw §6.1 states the phase's governing principle:

> **The critic judges outcomes, not intentions.**

The builder may believe "This looks premium." The source's response is blunt: "The critic
doesn't care what the builder intended." The only admissible question is:

> **"What does the rendered website actually communicate?"**

The source grounds this in the variability of its own technical system:

> This is especially important because the same underlying technical system can produce
> very different visual outcomes depending on token application, composition, hierarchy
> and imagery.

Because identical infrastructure can yield excellent or generic results, infrastructure
correctness proves nothing about outcome quality. This aligns with the Control Plane:

| Source | Statement |
|---|---|
| `quality-gates.md` §1 rule 5 | "A successful build satisfies no gate on its own" |
| `quality-gates.md` §6 | Passing Implementation Validation "is not a quality verdict and never substitutes for one" |
| `quality-gates.md` §7.1 | "Judgement addresses the rendered result, not source-code intent" |
| `quality-gates.md` §7.2 | Critique resting on build success rather than rendered outcome is a blocking condition |
| `artifact-contracts.md` §5.6 | "Build success is reported as a fact, not as a quality claim" |

**Rule.** Phase 6 MUST evaluate the rendered result. A green build, a clean type-check
and an empty console are inputs to the Technical Quality dimension only (§16). They are
never evidence for any other dimension.

### 3.2 The critic's responsibility is appropriateness, not safety

Raw §6.63 supplies what the source proposes as Phase 6's official principle:

> **The critic's responsibility is not to make every website safer, cleaner, or more
> conventional. Its responsibility is to make each website more appropriate, more
> intentional, more distinctive, and more effective.**

With the operative consequence:

> The critic should **not punish creativity simply because it is unusual**.
>
> It should punish: **unjustified creativity.**

**Rule.** Unusualness is not a defect. The test is justification: whether an unusual
decision serves the business, the audience and the design intent. A critic that converges
every site toward convention has failed its own mandate. This principle bounds every
evaluation dimension in §8–§17, and it is the reason Template Risk (§17.3) and AI-Generic
Risk (§17.2) exist as explicit penalties in the opposite direction.

### 3.3 Judgement is the only thing Phase 6 adds

Per `artifact-contracts.md` §6 invariant 3, "Judgement enters the system only through the
critic report." Facts enter through research; design decisions enter through the
blueprint. Phase 6 introduces neither.

**Consequences:**

1. Phase 6 MUST NOT introduce a new business fact. An apparent factual gap is a
   research finding, routed per §21.2 and §22.
2. Phase 6 MUST NOT introduce a new design decision. A better composition idea is a
   recommendation attached to a finding, not an authored change.
3. Phase 6 MUST NOT edit any artifact it consumes (`artifact-contracts.md` §1 rule 3).

---

## 4. Independence of the Critic

### 4.1 Independent in role, not necessarily in model

Raw §6.2 defines independence precisely, and narrowly:

> Even when the same model is used, the critic receives a **different system prompt and
> evaluation framework**.

Independence is therefore a property of **role, prompt and framework** — not of model
identity. The same underlying model may serve as builder and critic provided the critic
operates under a distinct evaluation framework and does not inherit the builder's
context or self-justification.

The source states the three roles as three different instructions:

| Role | Instruction |
|---|---|
| Builder | "Create this." |
| Critic | "Prove whether this is good." |
| Refiner | "Fix what the critic proves is weak." |

The critic's verb is **prove**. A finding is not an assertion of taste; it is an
evidenced claim (§7).

### 4.2 The critic must be willing to indict the blueprint

Raw §6.2 requires the critic to be comfortable stating both:

> **The implementation is wrong.**
>
> and also: **The blueprint itself needs reconsideration.**

The second is the harder and more consequential capability. A critic that can only fault
implementation will misroute every strategic defect into refinement, which
`quality-gates.md` §7.2 names a blocking condition. See §19 and §22.2.

### 4.3 Separation of duties

Independence is enforced by the Control Plane, not merely asserted here:

| Source | Rule |
|---|---|
| `agent-roles.md` §4 | No role critiques or approves its own output |
| `quality-gates.md` §1 rule 1 | Each gate is evaluated by a role other than the one that produced the artifact |
| `quality-gates.md` §9 invariant 1 | No gate is owned by the producing role |
| `agent-roles.md` §3.4 | The Implementation Engineer MUST NOT critique or approve its own output |
| `phase-ownership-matrix.md` Row 41 | Only the Independent Critic may confirm a finding is resolved |
| `phase-ownership-matrix.md` Row 42 | The Refinement Engineer MUST NOT close its own findings |

### 4.4 Prohibitions on the critic

Consolidated from `agent-roles.md` §3.5 and `phase-ownership-matrix.md` Rows 40–41:

| The Independent Critic MUST NOT |
|---|
| Modify the implementation, the blueprint or the research |
| Approve delivery — that authority is human |
| Judge source-code intent in place of the rendered result |
| Treat build success as evidence of quality |
| Assign an upstream root cause to implementation to avoid regression |
| Close a finding without re-inspecting the newly rendered state |

### 4.5 Separation of critic and refiner

The critic and the Refinement Engineer are distinct roles (`agent-roles.md` §3.6). The
critic prescribes and verifies; the refiner executes. Per
`phase-ownership-matrix.md` Row 42, the Refinement Engineer addresses only findings
assigned to refinement, MUST NOT close its own findings, MUST NOT advance to APPROVED,
and MUST NOT alter the blueprint.

**Rule.** The role that made a correction never certifies that correction. Verification
in §24 belongs to the critic.

### 4.6 Critique cannot be bypassed

`state-machine.md` §5 invariant 1: "APPROVED is reachable only from CRITIQUING. No state
bypasses independent critique." Invariant 3: "REFINING cannot reach APPROVED directly; it
must pass through CRITIQUING." `quality-gates.md` §9 invariant 3 states it again:
"Critique cannot be bypassed. Final Approval requires a passing Critic Validation."

---

## 5. Inputs and the Target Experience

### 5.1 Critic inputs

Raw §6.3 lists the evidence the critic receives, grouped by origin:

```
/business/
    research.md
    business.json
    brand.json
    reviews.json
    assets.json
    competitors.json
    seo.json
/design/
    design-blueprint.json
    language-spec.json
    composition-plan.json
/build/
    source-code
    implementation-report.md
/render/
    desktop screenshots
    tablet screenshots
    mobile screenshots
```

> It should evaluate **the complete evidence chain**.

**ILLUSTRATIVE — NON-NORMATIVE (file layout).** The paths and filenames above are the
source's own illustration. `artifact-contracts.md` §12 states that it "does not define
artifact file format" and that "No schemas are defined at this version." This document
creates no schema and mandates no filenames. The normative reading is by artifact
identity:

| Raw §6.3 group | Control Plane artifact | Contract |
|---|---|---|
| `/business/` research, business, brand, reviews | Business research, business intelligence, brand profile | §5.1–§5.4 |
| `/business/assets.json` | Asset inventory | §5.3 |
| `/design/` blueprint, language spec, composition plan | Design blueprint (embeds the Composition Plan) | §5.5 |
| `/build/` source and report | Website source, Implementation Report | §5.6 |
| `/render/` screenshots | The rendered result | — |

Two observations on this list:

1. **`competitors.json` and `seo.json` have no named artifact contract.** They are
   implied by raw §6.31 (competitive comparison) and raw §6.12 (SEO), but
   `artifact-contracts.md` §4 registers no competitor or SEO artifact. Recorded as **D2**
   in §28.
2. **The rendered result is not a registered artifact either.** Phase 6's entire mandate
   rests on it (§3.1), yet no contract defines who captures it, at which viewports, or in
   what state. Recorded as **D3** in §28.

**Rule.** Per `artifact-contracts.md` §1 rule 2, the critic MUST NOT infer information an
artifact does not state, and per §1 rule 6 MUST NOT proceed on an incomplete upstream
artifact. Per §31, every artifact reference resolves to its CURRENT version.

### 5.2 First establish the target

Raw §6.4 requires the critic to establish what the site was *supposed* to be before
judging what it is. The engine extracts:

| Extracted for the Target Experience |
|---|
| Business purpose |
| Customer |
| Business psychology |
| Desired perception |
| Primary CTA |
| Design language |
| Creative intensity |
| Visual tension |
| Image dominance |
| Typography dominance |
| Narrative strategy |
| Section sequence |
| Major visual anchors |

> This becomes: **TARGET EXPERIENCE**
>
> The critic judges the website against that target.

**Rule.** The Target Experience is **derived, not authored.** Every item above is read
from upstream artifacts — the business record, the blueprint, the composition plan. The
critic MUST NOT supply a value the upstream artifacts do not state; where one is absent,
that absence is itself a finding against the owning phase, not a gap for the critic to
fill (§3.3, §19).

This ordering matters: without an established target, "quality" collapses into the
critic's personal taste, which §7.2 exists to prevent.

### 5.3 Field naming for Target Experience items

The raw source writes these as spaced prose. Registry canon for machine-readable fields
is `camelCase`:

| Raw §6.4 label | Registry name | Registry status |
|---|---|---|
| Design language | `designLanguage` → `DL-01`…`DL-05` | Registered (Phase 2) |
| Creative intensity | `creativeIntensity` | Registered |
| Visual tension | `visualTension` | Registered |
| Image dominance | `imageDominance` | **Absent from the registry** |
| Typography dominance | `typographyDominance` | **Absent from the registry** |
| Narrative strategy | `narrativeStrategy` | Registered |
| Section sequence | Blueprint-decided (Row 34) | Per-project |

`imageDominance` and `typographyDominance` were recorded as absent from
`03-REGISTRY/parameter-registry.md` during the Phase 5 audit (finding N1 there) and remain
absent. Phase 6 cannot evaluate against a parameter that has no registered definition or
value range. Carried forward as **N2** in §28.

### 5.4 Registry version resolution

Per `artifact-contracts.md` §5.6, the Implementation Report records the registry versions
CURRENT at build time, and any difference from the versions the blueprint was resolved
against is a declared deviation. The critic reads both. A finding that turns out to be a
registry-version mismatch is a provenance finding, not a design defect.

---

## 6. The Evaluation Model

### 6.1 Two evaluation modes

Raw §6.5 separates two questions that are routinely conflated:

| Mode | Question |
|---|---|
| **Mode A — Blueprint Fidelity** | Did the implementation preserve the intended design? |
| **Mode B — Outcome Quality** | Is the resulting website actually good? |

> These are not the same.

The source then gives the two diagnostic cases that make the separation load-bearing:

**Case 1 — fidelity high, outcome poor:**

```
Blueprint quality        = excellent
Implementation fidelity  = excellent
Outcome quality          = poor
```

> Then the critic should identify that **the problem originated in the blueprint**.

**Case 2 — fidelity low, outcome mediocre:**

```
Blueprint       = excellent
Implementation fidelity = poor
Outcome         = mediocre
```

> Then the builder is the problem.

**Rule.** Fidelity and quality MUST be assessed and reported separately. A faithful
implementation of a weak blueprint is a Phase 4 finding, not a Phase 5 finding. This is
the mechanism by which Phase 6 routes correctly (§19, §22.5), and it is why §21.1 keeps
Blueprint Fidelity outside the weighted score.

### 6.2 The seven dimensions plus one overlay

Raw §6.6 states the dimension set. The source's own framing is "I would now use seven
rather than six", which is authorial preference; the resulting set is what §6.44 then
weights, so it is carried as the operative structure.

| # | Dimension | Canonical section |
|---|---|---|
| 1 | Business Fit | §8 |
| 2 | Brand Specificity | §9 |
| 3 | Visual Quality | §11 |
| 4 | UX / Usability | §12 |
| 5 | Conversion | §13 |
| 6 | Technical Quality | §16 |
| 7 | Creative Distinction | §17 |

> And then overlay: Blueprint Fidelity — as a separate dimension.

Blueprint Fidelity (§10) is an **overlay**, not a member of the seven. It is scored
separately (§10.1) and excluded from the weighted average (§21.1).

### 6.3 Dimensions that are not weighted but can block

Three assessments sit outside the seven weighted dimensions and can independently prevent
shipment:

| Assessment | Section | Basis |
|---|---|---|
| Accessibility | §14 | Raw §6.45 hard-fail; `quality-gates.md` §8.2 |
| Factual integrity | §21.2 | Raw §6.45 hard-fail; `quality-gates.md` §8.2 |
| Template Risk / AI-Generic Risk | §17 | Raw §6.44 separate; §6.45 hard-fail |

A high weighted score does not override any of these (§21.2).

---

## 7. Evidence Standard

### 7.1 Evidence-based criticism

Raw §6.17 states the requirement in MUST form:

> Every major criticism **must** include evidence.

The source's worked instance:

> **Observation:** Services feel repetitive.
>
> **Evidence:** 6 visually identical cards with same image ratio, same heading hierarchy
> and same spacing.
>
> **Impact:** Reduces hierarchy and creates template-like appearance.
>
> **Severity:** P1.
>
> **Correction:** Convert first service into dominant feature, remaining services into
> secondary index.

> That is much more actionable than: "Make services more creative."

**ILLUSTRATIVE — NON-NORMATIVE.** The "6 cards" instance, the P1 assignment and the
feature/index correction are the source's example, not a rule that six cards is a defect.
The normative content is the **shape**: observation, evidence, impact, severity,
correction.

**Rule.** A finding without evidence drawn from the rendered result is not a finding. The
critic MUST cite what is observable — counts, ratios, alignments, measured relationships —
rather than an impression.

### 7.2 Observation, interpretation, recommendation

Raw §6.18 requires the critic to keep three things distinct:

| Layer | Source example |
|---|---|
| **Observation** | "Six cards have identical size and structure." |
| **Interpretation** | "This reduces hierarchy." |
| **Recommendation** | "Use unequal composition." |

> This makes the critic more objective.

**Rule.** These three MUST be separable in every finding. The value of the separation is
that each layer can be challenged independently: an observation can be checked against the
render, an interpretation against the design intent, a recommendation against ownership.
Collapsing them produces the untestable assertion the source is trying to eliminate.

### 7.3 What evidence is admissible

Derived from §3.1 and §7.1 together:

| Admissible | Not admissible on its own |
|---|---|
| The rendered result at the relevant viewport | A successful build |
| Observable counts, ratios and relationships | A passing type-check |
| The blueprint's stated decision, for fidelity claims | The builder's stated intent |
| The design intent statement, for intent claims | The critic's unsupported preference |
| The business record, for factual claims | Plausibility |

---

## 8. Business Fit

Raw §6.7 is dimension 1. The critic asks:

| Question |
|---|
| Does it clearly communicate the business? |
| Does it match the customer's emotional needs? |
| Does it highlight the correct value proposition? |
| Does the page hierarchy suit this business? |
| Are industry expectations respected? |

The source's rationale:

> The research emphasizes that different industries have fundamentally different
> psychological drivers and therefore need different design architecture.

**Boundary.** Business Fit is judged against the business record and the Target Experience
(§5.2), both upstream. The critic does not decide what the business *should* emphasise —
that is Phase 4's decision, already approved at Gate 2. The critic judges whether the
rendered result delivers the emphasis that was decided.

**Routing.** A Business Fit failure is most often a Phase 4 strategy finding or a research
finding, not an implementation finding. See §19.2 and §22.

---

## 9. Brand Specificity

Raw §6.8 is dimension 2. Its single question:

> **Does this feel like this exact business?**

The checklist:

| Check |
|---|
| Brand personality |
| Real imagery |
| Actual services |
| Business story |
| Location |
| Proof |
| Tone |
| Visual identity |

The source's decisive statement:

> A premium-looking generic dental website is still a bad Blogspage result.

**Rule.** Visual polish does not satisfy Brand Specificity. A site that could belong to any
business in the category fails this dimension regardless of its Visual Quality score. This
is the dimension most tightly coupled to Template Risk (§17.3).

**Boundary.** "Real imagery," "actual services," "location" and "proof" are all business
facts. The critic verifies that what is rendered matches the verified upstream record. It
never supplies a missing fact (§3.3). Fabricated proof is a hard-fail (§21.2).

---

## 10. Blueprint Fidelity and Creative Drift

Blueprint Fidelity is Mode A of §6.1 — the overlay dimension, scored separately from the
seven.

### 10.1 Fidelity sub-scores

Raw §6.14 states it as a separate score across seven aspects:

| Fidelity aspect |
|---|
| Visual fidelity |
| Composition fidelity |
| Typography fidelity |
| Rhythm fidelity |
| Pattern fidelity |
| CTA fidelity |
| Image fidelity |

> Example: Blueprint Fidelity = 94/100

**ILLUSTRATIVE — NON-NORMATIVE (the value 94/100).** The source gives 94 as an example of
the form, not a target. The source states the 0–100 range (raw §6.44: "Blueprint Fidelity:
0–100") but supplies **no aggregation formula** across the seven aspects and **no passing
fidelity value**. Recorded as **U1** in §28.

**Input.** Per `artifact-contracts.md` §5.6, the Implementation Report declares every
deviation with its reason and the blueprint decision affected, and "an empty deviation list
asserts full blueprint fidelity." The critic tests that assertion against the render.
Undeclared drift discovered by the critic is a more serious finding than declared
deviation, because it breaches the Phase 5 prohibition on silent alteration
(`phase-ownership-matrix.md` Row 39).

### 10.2 Creative Drift

Raw §6.15 classifies drift on a four-point scale:

| Level | Source example |
|---|---|
| NONE | — |
| LOW | Small spacing/crop differences |
| MEDIUM | Section composition simplified |
| HIGH | Design language or page rhythm materially changed |

**Rule.** The scale and its three examples are the source's. No mapping from drift level to
severity (§20.1), to score deduction, or to routing outcome is stated by the source.
Recorded as **U2** in §28.

The examples do carry a usable signal: LOW is dimensional, MEDIUM is structural, HIGH is
strategic. HIGH drift means the delivered site is no longer the approved design, which bears
on whether the Gate 2 approval still covers what was built.

### 10.3 Design language integrity

Raw §6.39 tests whether the selected design language survived implementation:

> The critic knows the selected language. For example — Expected: Editorial Luxury.
>
> Then asks: Does the result actually feel editorial? Or did implementation drift toward
> generic SaaS?

**ILLUSTRATIVE — NON-NORMATIVE.** "Editorial Luxury" and "generic SaaS" are the source's
example pair. Design languages are Phase 2-owned and registered as `DL-01`…`DL-05`; the
critic reads the selected identifier from the blueprint rather than naming languages itself.

"Drift toward generic SaaS" names the specific failure mode: convergence on the statistical
default, which is what AI-Generic Risk measures (§17.2).

### 10.4 Design language contamination

Raw §6.40 identifies a distinct failure — not drift away from a language, but two languages
mixed:

> Expected: Soft Premium
>
> Actual: soft colors + aggressive typography + kinetic motion + hard borders
>
> Result: visual language contradiction.

**ILLUSTRATIVE — NON-NORMATIVE.** The example is the source's. Phase 2 owns the coherence
rules for each language; the critic detects that the rendered result violates the selected
language's own profile, and cites Phase 2's definition as the evidence.

Contamination is distinguishable from drift: drift is a consistent move toward a different
language, contamination is internal contradiction. Both are fidelity findings; contamination
additionally indicates the site has no coherent language at all.

### 10.5 Creative intent test

Raw §6.41 requires the intent test:

> Read Phase 4's Design Intent Statement.
>
> Then ask: **Does the rendered site actually deliver that emotional experience?**
>
> This is more important than checking whether every planned section exists.

This is the one Phase 6 check the Control Plane requires by name:
`quality-gates.md` §7.1 requires the critic report to record "the intent test against the
design intent statement," and `phase-ownership-matrix.md` Row 38 notes this makes the Design
Intent Statement a required Phase 4 output.

**Rule.** The intent test MUST be recorded in the Critic Report with an explicit result. A
structural checklist of present sections does not satisfy it. Per raw §6.41, presence of
planned sections is the weaker signal; delivery of the intended emotional experience is the
stronger one.

**Boundary.** If the Design Intent Statement is absent from the blueprint, the critic cannot
perform a required check. That is a Phase 4 artifact-completeness finding, and per
`artifact-contracts.md` §1 rule 6 the critic does not proceed as though the statement said
something it does not. Recorded as **D4** in §28.

---

## 11. Visual Quality

### 11.1 The dimension

Raw §6.9 is dimension 3. Evaluate:

| Aspect |
|---|
| Composition |
| Typography |
| Spacing |
| Grid |
| Color |
| Image treatment |
| Depth |
| Hierarchy |
| Consistency |
| Craftsmanship |

The source immediately qualifies the dimension:

> But don't score based purely on aesthetics.
>
> Ask: **Are visual decisions intentional?**

**Rule.** The test is intentionality, not attractiveness. An attractive page assembled from
defaults scores worse on this dimension than a less conventionally pretty page whose
decisions are demonstrably deliberate. This is the dimension-level expression of §3.2.

**Boundary.** Composition, spacing, grid and typography constructs are Phase 1-, 2- and
3-owned. The critic evaluates their application in the render; it does not redefine them.

### 11.2 Visual rhythm test

Raw §6.25 contrasts a varied rhythm against a flat one:

```
quiet -> impact -> information -> human -> cinematic -> quiet -> action
```

versus:

```
section -> section -> section -> section -> section
```

> The second is structurally correct but aesthetically weak.

**ILLUSTRATIVE — NON-NORMATIVE.** The seven-beat sequence is an example of variation, not a
mandated rhythm. Per `phase-ownership-matrix.md` decision 8, section rhythm splits three
ways: the per-language rhythm profile is Phase 2's, rhythm as a composition concept is
Phase 3's, and the concrete per-project sequence is a blueprint decision. Phase 6 evaluates
the rendered rhythm against those; it does not author a sequence.

The finding this test produces is precise: "structurally correct but aesthetically weak" is
exactly the defect a build-success check cannot detect (§3.1).

### 11.3 Visual anchor test

Raw §6.26 checks the distribution of major visual anchors:

| Question |
|---|
| Are there 3–5 memorable moments? |
| Are they distributed? |
| Is one section overpowering everything else? |
| Does the CTA get an appropriate final visual anchor? |

**Source-stated quantity.** The range "3–5 memorable moments" is the source's own figure. It
appears once, inside a question, and the source supplies no rule for what happens at 2 or at
7. It is carried as a diagnostic prompt, not a pass condition. Recorded as **U3** in §28.

Major visual anchors are part of the Target Experience (§5.2), so the blueprint's intended
anchors are the comparison basis where they are stated.

### 11.4 Quiet zone test

Raw §6.27 checks restraint:

> Without quiet zones: everything screams. With too many: the website feels empty.
>
> The critic should judge the balance.

The source states this as a judgement of balance with no threshold, and none is added here.
Both failure directions are named, which prevents the check from becoming a one-way push
toward more whitespace.

### 11.5 Pattern repetition test

Raw §6.28 tracks repetition across six axes:

| Tracked |
|---|
| Grid repetition |
| Card repetition |
| Alignment repetition |
| Image ratio repetition |
| Animation repetition |
| CTA repetition |

The source's rationale:

> The research explicitly identifies repetitive grids, excessive cards and predictable
> alternating sections as common AI-design anti-patterns.

**Boundary.** Anti-patterns are owned upstream: universal anti-patterns are Phase 1's
(`phase-ownership-matrix.md` Row 13) and language-specific anti-patterns are Phase 2's
(Row 28). Per decision 7, "Phase 6 evaluates both." Phase 6 therefore detects violations of
anti-patterns defined elsewhere and MUST NOT introduce a new anti-pattern of its own. A
repetition the critic dislikes but which no owning phase has named as an anti-pattern is
reportable as a Visual Quality observation with evidence, not as an anti-pattern violation.

No repetition count threshold is stated by the source. Recorded as **U4** in §28.

### 11.6 Polished is not premium is not creative

Raw §6.42 separates three commonly conflated grades:

| Grade | Source definition |
|---|---|
| **Polished** | Clean, neat, professional |
| **Premium** | Sophisticated, intentional, refined |
| **Creative** | Distinctive, memorable, art-directed |

The source's worked case:

> A site can be: polished = 10, premium = 8, creative = 4 — and still fail the Blogspage
> standard.

**ILLUSTRATIVE — NON-NORMATIVE.** The values 10, 8 and 4 are the source's example on an
unstated scale. The source does not define a polished/premium/creative scoring axis in the
scorecard (§21.1), where these qualities fall under Visual Quality and Creative Distinction.
The point being made is structural: high polish with low creative distinction is a failure
profile, which is the same argument §21.4 makes numerically.

---

## 12. UX and Usability

### 12.1 The dimension

Raw §6.10 is dimension 4. Evaluate:

| Aspect |
|---|
| Comprehension |
| Navigation |
| Wayfinding |
| Information hierarchy |
| Interaction clarity |
| Mobile behavior |
| Readability |
| Accessibility |

The source's rationale:

> The research makes accessibility and clear focus/interaction behavior a foundational
> requirement.

Accessibility appears here as a UX aspect and again in raw §6.12 as a Technical Quality
aspect, with its own dedicated critic in raw §6.34. §14 treats it as an absolute requirement
rather than a weighted contributor, because raw §6.45 makes major accessibility failure a
hard-fail regardless of score.

### 12.2 Mobile receives its own complete review

Raw §6.33 refuses to treat mobile as a derived view:

> Mobile receives its own complete review.
>
> Not: "Desktop shrinks correctly."
>
> Instead: **"Is mobile an intentionally designed experience?"**

Checked:

| Aspect |
|---|
| Hierarchy |
| Navigation |
| CTA |
| Typography |
| Cropping |
| Spacing |
| Interaction |
| Sticky elements |
| Scroll behavior |

The source's rationale:

> The research specifically requires intentional mobile restructuring rather than simply
> compressing desktop layouts.

**Rule.** Mobile is evaluated as a designed experience in its own right. "It reflows without
breaking" satisfies responsiveness, not this check. A mobile view that is merely a compressed
desktop is a finding even when nothing is visually broken.

**Tablet.** Raw §6.3 lists tablet screenshots among the critic's inputs, but raw §6.33
prescribes a dedicated review for mobile only, and no section addresses tablet-specific
transformation. The gap was recorded during the Phase 5 audit and persists here. Carried
forward as **D5** in §28.

### 12.3 The timed comprehension tests

Raw §6.36, §6.37 and §6.38 form a three-stage ladder testing what a visitor can determine
over time.

**Five-second test (raw §6.36).** The critic answers:

| Question |
|---|
| What is the business? |
| Who is it for? |
| What makes it different? |
| What should I do? |

> If the answer isn't obvious: **P1 issue.**

**Source-stated severity.** This is the one place the source binds a specific check directly
to a severity level. A failure of the five-second test is a P1 (Major) per raw §6.36, not a
P0. Preserved as stated.

**Ten-second test (raw §6.37).** "Can the visitor determine whether this business is relevant
to them?" — the source states this checks **positioning**.

**Thirty-second test (raw §6.38).** "Can the visitor decide whether they trust the business
enough to take action?" — the source states this checks:

| Trust | Proof | Services | Expertise | Clarity |
|---|---|---|---|---|

The three tests are cumulative: comprehension, then relevance, then trust. The source
supplies no procedure for how the timing is simulated, and none is invented here. Recorded
as **U5** in §28.

---

## 13. Conversion

### 13.1 The dimension

Raw §6.11 is dimension 5. Evaluate:

| Aspect |
|---|
| Primary CTA |
| Secondary CTA |
| Contact |
| Booking |
| WhatsApp |
| Phone |
| Directions |
| Reviews |
| Trust |
| Form friction |
| Mobile conversion |

The source's rationale:

> The research specifically emphasizes contextual CTAs and low-friction local-business
> conversion paths.

The channel list (WhatsApp, phone, directions, booking) reflects local-business conversion.
Which channels apply to a given project is determined upstream by the business record and
the blueprint; the critic evaluates the channels that were specified, and does not add
channels the business does not have.

### 13.2 Conversion path simulation

Raw §6.35 requires simulating a visitor rather than inspecting components:

> **Dental** — Landing → understands clinic → sees trust → sees treatment → understands
> doctor → clicks booking
>
> Ask: At what step could they hesitate?
>
> This is more useful than simply looking at button color.

**ILLUSTRATIVE — NON-NORMATIVE.** The dental path is the source's example for one business
type. The path for any project derives from that business's actual conversion goal and the
blueprint's narrative strategy.

**Rule.** The output of this check is a **located** hesitation point, not a general
observation that conversion could be stronger. Locating the step is what makes the finding
actionable and assignable (§19).

---

## 14. Accessibility

### 14.1 Position in the model

Accessibility appears three times in the source: as a UX aspect (raw §6.10), as a Technical
Quality aspect (raw §6.12), and as its own critic (raw §6.34). Raw §6.45 makes "major
accessibility failure" a hard-fail regardless of score, and raw §6.46 lists
"Accessibility = PASS" as a threshold item — a binary, unlike every other item in that list.

**Rule.** Accessibility is **absolute, not weighted.** It cannot be traded against any other
dimension. A high overall score never compensates for a major accessibility failure. This is
reinforced by the Control Plane: `quality-gates.md` §8.1 requires accessibility requirements
to be met before Final Approval, and §8.2 makes any unresolved blocking accessibility finding
a blocking condition.

### 14.2 The accessibility critic

Raw §6.34 checks:

| Check |
|---|
| Contrast |
| Keyboard |
| Focus |
| Touch targets |
| Semantic headings |
| Forms |
| Reduced motion |
| Alt text |

The source's rationale:

> The research establishes these as non-negotiable foundation requirements.

**Boundary.** Accessibility requirements are **Phase 1 Foundation-owned**. The source calls
them "foundation requirements," and Phase 6 evaluates compliance against Phase 1's
definitions. Phase 6 does not set accessibility criteria.

**No thresholds are stated.** The source names eight check areas but supplies no contrast
ratio, no touch target size, no WCAG level, and no definition of what makes a failure "major"
as required by the raw §6.45 hard-fail. Those values belong to Phase 1 and are not supplied
here. Recorded as **U6** in §28.

Note on the P0 boundary: raw §6.19 places "inaccessible critical interaction" at P0, which
gives one concrete instance of a major failure without defining the general class.

---

## 15. Performance

### 15.1 Position in the model

Performance appears in raw §6.12 as one of the eleven Technical Quality aspects, and in raw
§6.45 as a hard-fail trigger: "Severe performance problem → DO NOT SHIP."

**Rule.** Performance is scored inside Technical Quality (10% weight, §21.1), but a **severe**
performance problem is a hard-fail that no score overrides (§21.2).

### 15.2 No budgets are stated

The raw source names performance as an evaluation target and as a hard-fail trigger, but
supplies:

| Missing | Consequence |
|---|---|
| No metric set (LCP, CLS, INP, TTFB or otherwise) | The critic has no measurement to cite |
| No budget values | No pass/fail line |
| No definition of "severe" | The hard-fail trigger cannot be evaluated objectively |
| No measurement tool or method | Results are not reproducible |

**No budgets are invented here.** Performance budgets are Phase 1 Foundation territory — raw
Phase 1 lists "image performance" among Layer A concerns. Recorded as **U7** in §28.

Until budgets exist, a performance finding is reportable as an evidenced observation
(§7.1), and the hard-fail can only be triggered on a problem severe enough to be
self-evident from the render. This is a real operational gap, not a stylistic one.

---

## 16. Technical Quality and SEO

### 16.1 The dimension

Raw §6.12 is dimension 6. Evaluate:

| Aspect |
|---|
| Build |
| TypeScript |
| Console |
| Responsive |
| Accessibility |
| SEO |
| Performance |
| Interactions |
| Forms |
| Links |
| Images |

The source's constraint, which is the reason this dimension carries the joint-lowest weight:

> Technical correctness remains mandatory, but is **not allowed to inflate the creative
> score.**

**Rule.** Technical correctness is mandatory and insufficient. Build, TypeScript and Console
are evidence for **this dimension only** (§3.1). They never raise Visual Quality, Creative
Distinction, Brand Specificity or any other dimension. This is the anti-pattern the whole
phase exists to prevent (§1.1).

### 16.2 Overlap with other sections

Three aspects listed here are governed elsewhere in this document because the source treats
them as more than technical checks:

| Aspect | Governed by | Reason |
|---|---|---|
| Accessibility | §14 | Raw §6.34 dedicated critic; raw §6.45 hard-fail |
| Performance | §15 | Raw §6.45 hard-fail |
| Responsive | §12.2 | Raw §6.33 dedicated mobile critic |

Their presence in the Technical Quality list is preserved as the source has it. The stronger
treatment governs where they conflict: accessibility is absolute (§14.1), not a 10%-weighted
line item.

### 16.3 SEO

SEO appears once in the raw source, as an aspect name in this list. The source states no
SEO criteria, no required tags, no structured data requirements and no ranking assumptions.
None are added.

Raw §6.3 lists `seo.json` among the critic's inputs, and per finding **D2** (§28) that file
has no artifact contract. So the SEO check is currently underdetermined at both ends: no
contract for the input, no criteria for the evaluation. Recorded as **U8** in §28.

### 16.4 Interactions, forms, links, images

The source names these four without criteria. Each is checkable against upstream
definitions rather than against Phase 6 invention:

| Aspect | Upstream basis |
|---|---|
| Interactions | Phase 1 interaction behavior and focus states; Phase 2 motion profile |
| Forms | Phase 1 form behavior; raw §6.34 form accessibility |
| Links | Blueprint's page and navigation structure |
| Images | Blueprint image direction; Phase 1 image performance |

Where the upstream definition is silent, the critic reports an evidenced observation rather
than asserting a violation.

---

## 17. Creative Distinction and Risk

### 17.1 The dimension

Raw §6.13 is dimension 7, and the source elevates it explicitly:

> This is one of the **most important Blogspage metrics**.

Evaluate:

| Aspect |
|---|
| Originality |
| Composition |
| Visual tension |
| Narrative |
| Unexpected but appropriate decisions |
| Pattern diversity |
| Art direction |
| Memorability |

The governing question:

> **Would a human designer recognize intentional creative authorship here?**

Note "unexpected **but appropriate**" — the source pairs novelty with fitness in the same
breath, which is the same balance §17.5 enforces. Creative Distinction is not a reward for
strangeness.

### 17.2 AI-Generic Risk

Raw §6.29 scores:

| Score |
|---|
| LOW |
| MEDIUM |
| HIGH |

The question:

> Does this look like the statistical default an AI would produce?

This is the measurable form of the drift named in §10.3. The source gives the three-level
scale and the question, and no criteria for assigning a level. Recorded as **U9** in §28.

### 17.3 Template Risk

Raw §6.30 states this is:

> Separate from AI risk.

The question:

> Could another client's logo, colors and text be inserted here and produce essentially the
> same website?
>
> If yes: **FAIL**

> This directly addresses the original problem you raised when we started building this
> system.

**Rule.** Template Risk carries a **source-stated FAIL** on a yes answer. This is the
strongest single consequence in the raw phase and it is preserved at full strength. It is
reinforced by raw §6.45, where "high template risk" is a DO-NOT-SHIP hard-fail, and by raw
§6.46, where "Template Risk = LOW" is a threshold item.

Template Risk and AI-Generic Risk are separate axes:

| Axis | Failure it detects |
|---|---|
| AI-Generic Risk | The site converges on the statistical default |
| Template Risk | The site is substitutable across clients |

A site can be distinctive and still be substitutable — a distinctive template is still a
template. This is why the source keeps them apart, and why §9's "premium-looking generic
dental website" fails.

**Scale note.** §6.30 asks a yes/no question while §6.46 requires "Template Risk = LOW",
implying the same three-level scale as AI-Generic Risk. The source does not reconcile the
binary with the scale. Recorded as **U10** in §28. Both forms are preserved; a yes answer to
the §6.30 question is a FAIL under either reading.

### 17.4 Competitive differentiation test

Raw §6.31:

> Compare the rendered website against competitors.
>
> **Does this business look meaningfully different from its local competitors without
> becoming inappropriate for the category?**
>
> This makes the critic aware of the business's actual market.

The clause "without becoming inappropriate for the category" makes this a two-sided test in
a single question: differentiation alone does not pass it.

**Input dependency.** This test requires `competitors.json`, which per finding **D2** has no
artifact contract — no defined shape, owner or population method. The critic cannot compare
against competitor data whose structure is undefined. This is the second Phase 6 check that
is specified but not yet operable.

### 17.5 Category familiarity test

Raw §6.32 is the counterweight:

> Creative differentiation should not create confusion.
>
> Can a visitor still immediately understand what this business is?

The source's resulting balance:

```
Category familiarity + Creative differentiation
```

**Rule.** These two are held **simultaneously**, not traded. A site that is unmistakably
distinctive but leaves the visitor unsure what the business does fails §17.5 regardless of
its Creative Distinction score. This connects directly to the five-second test (§12.3) and
to raw §6.63's principle that the critic's job is not to make sites safer, nor merely
stranger, but more appropriate and more distinctive at once.

### 17.6 Blogspage signature standard

Raw §6.43:

> The final critic should ask: **Would this website improve Blogspage AI's portfolio?**
>
> A website that is technically excellent but generic should not be considered a showcase
> piece.

This is a SHOULD-strength question (§2.3), and it is the final restatement of the phase's
core argument: technical excellence plus generic design is not a good result.

**Boundary.** The portfolio question is a judgement about brand standard, not a computed
score. It produces no numeric output and no automatic routing outcome. It belongs in the
critic's summary judgement (§21.4), where the source places the human-style verdict.

### 17.7 Novelty — concept present, mechanics unresolved

Novelty appears in the Phase 6 loop diagram (raw §6.59, "NOVELTY / BRAND") and is carried in
`phase-ownership-matrix.md` Row 43 as a Phase 6 ownership row. But:

| Fact | Source |
|---|---|
| Row 43 is **provisional** | `phase-ownership-matrix.md` |
| Row 43 is **not operable** | `noveltyThreshold` and `noveltyComparison` are UNDEFINED |
| Phase 2 §17.3 leaves the novelty threshold undefined | Prior canonical phase |
| Phase 3 §24 gives LOW/MEDIUM/HIGH with no threshold | Prior canonical phase |
| Raw Phase 6 states no novelty algorithm, corpus or comparison basis | This source |

**Rule.** Novelty is preserved as a **concept** the critic attends to, with its mechanics
explicitly unresolved. No threshold, corpus, comparison method or scoring formula is
invented here. Phase 3's LOW/MEDIUM/HIGH composition novelty and Phase 6's AI-Generic Risk
LOW/MEDIUM/HIGH are separate scales owned by separate phases; this document does not merge
them. Recorded as **F4** in §28.

---

## 18. Section and Page Diagnosis

### 18.1 Section-by-section diagnosis

Raw §6.22 gives each section a score. The source's section list:

| Section |
|---|
| Hero |
| Trust |
| Services |
| About |
| Team |
| Process |
| Reviews |
| Gallery |
| Location |
| CTA |
| Footer |

**ILLUSTRATIVE — NON-NORMATIVE.** This eleven-section list is the source's example of a
typical local-business page, not a required page structure. Section inventory is a blueprint
decision, and Phase 6 evaluates the sections that were actually planned and built. A section
absent from this list is still evaluated; a section on this list that the blueprint never
specified is not a missing-section finding.

For each section, the critic records:

| Field |
|---|
| Purpose |
| Quality |
| Business fit |
| Creative quality |
| Issues |
| Recommendation |

> This lets refinement become targeted.

Targeting is the point: per-section diagnosis is what makes §23's preserve/change split
possible instead of a whole-page verdict.

**Scale note.** The source says "each section gets a score" without stating a scale. Recorded
as **U11** in §28.

### 18.2 Page-level diagnosis

Raw §6.23 evaluates the page as a whole through a four-stage arc:

```
Opening → Development → Climax → Resolution
```

Questions:

| Question |
|---|
| Does the page build interest? |
| Does it provide enough contrast? |
| Does it become more persuasive? |
| Does it naturally lead to action? |

The four questions map to the four stages in order, and each is a question about progression
rather than about any single section. A page can score well section by section and still fail
here — which is why the source runs both levels.

### 18.3 Scroll story test

Raw §6.24 requires the critic to narrate the experience in first person:

```
I arrive → I understand → I become interested → I trust → I explore → I decide → I act
```

> If a stage is missing or weak: identify where the problem occurs.

**Rule.** The output is a **located** stage, in the same way §13.2 requires a located
hesitation point. The seven stages are the source's, and they parallel the conversion path
(§13.2) and the timed tests (§12.3) from the visitor's side.

**Boundary.** This is a SHOULD-strength narration exercise (§2.3), not a scored dimension.
Its value is diagnostic: it converts "the page feels flat" into "the trust stage is absent
between Services and CTA."

---

## 19. Root Cause Diagnosis

### 19.1 The requirement

Raw §6.16 states this as a major improvement over unstructured criticism:

> Don't say: "Hero looks weak."
>
> Instead classify:
>
> **Problem:** Hero feels generic.
>
> **Root cause:** Implementation drift.
>
> **Evidence:** Blueprint specified asymmetric editorial composition, but rendered result
> uses centered alignment.
>
> **Correction:** Restore offset composition.

**ILLUSTRATIVE — NON-NORMATIVE.** The hero instance is the source's example. The normative
content is the four-part classification: problem, root cause, evidence, correction.

**Rule.** Every finding MUST carry a root cause. "Hero looks weak" is not a finding because it
cannot be assigned to a phase. This is the mechanism that makes §22 routing possible: the root
cause determines who receives the work.

### 19.2 The eight possible root causes

Raw §6.16 lists them:

| # | Root cause | Typically routes to |
|---|---|---|
| 1 | Blueprint problem | Phase 4 |
| 2 | Implementation problem | Phase 5 |
| 3 | Content problem | Content source / research |
| 4 | Asset problem | Asset source / research |
| 5 | Typography problem | Phase 5, or Phase 4 if the decision itself is wrong |
| 6 | Responsive problem | Phase 5 |
| 7 | Conversion problem | Phase 4, or Phase 5 if the plan was not implemented |
| 8 | Technical problem | Phase 5 |

**The routing column is derived, not source-stated.** The raw source lists the eight causes
and separately lists the outcome states (§27), but never maps cause to destination. The
mapping above follows from the Mode A / Mode B separation (§6.1): a cause that is a defect in
what was *decided* routes to the deciding phase, and a cause that is a defect in what was
*built* routes to the builder. Where a cause could be either — typography and conversion
especially — the critic determines which by checking the blueprint: if the render matches the
blueprint and is still wrong, the blueprint is the cause.

**Rule.** The critic MUST state the root cause. It MAY recommend a destination. It does not
execute the routing decision (§22.1).

Recorded as **U12** in §28: the source provides no cause-to-destination mapping.

---

## 20. Severity and Fix Priority

### 20.1 Severity system

Raw §6.19 defines four levels. Preserved exactly as stated, including the examples at each
level:

| Level | Name | Source examples |
|---|---|---|
| **P0** | Ship Blocker | incorrect business facts · broken booking · inaccessible critical interaction · broken mobile · unusable CTA |
| **P1** | Major | generic visual structure · significant conversion issue · strong brand mismatch · major blueprint drift |
| **P2** | Moderate | spacing · typography · crop · rhythm issue |
| **P3** | Polish | micro-interaction · subtle alignment · minor visual refinement |

**No fifth level exists.** No P4, no sub-levels, no severity above P0. The four levels are the
complete set.

Two observations about the P0 list, both supported elsewhere in the source:

- "Incorrect business facts" as a P0 aligns with the raw §6.45 factual hard-fail and with
  §3.3 — business truth is absolute.
- "Inaccessible critical interaction" and "broken mobile" as P0s align with §14.1 and §12.2.

The P1 list confirms two mappings used elsewhere in this document: "generic visual structure"
is a P1, matching §7.1's example; "major blueprint drift" is a P1, which is the only place the
source connects drift level (§10.2) to severity — and it connects only the top of the scale.

### 20.2 Fix priority

Raw §6.20 separates severity from sequencing:

> Not every issue deserves equal attention.
>
> Use: **Impact × Confidence × Cost**
>
> High-impact, high-confidence, relatively easy improvements come first.

**No arithmetic is defined.** The source writes "×" between three named factors but supplies
no scales, no units and no computed formula. `Cost` is written as a multiplier while the
guidance says lower cost should rank higher, so the expression cannot be taken literally as
stated. It is preserved as the source's **ordering heuristic** — prioritise high impact, high
confidence, low cost — not as a computable score. Recorded as **U13** in §28.

**Rule.** Severity (§20.1) and fix priority (§20.2) are distinct. Severity states how bad a
finding is; priority states what gets fixed first. A P0 is never deprioritised by this
heuristic — P0s are ship blockers regardless of cost. The heuristic sequences work within the
remaining levels.

---

## 21. Scorecard, Hard-Fails and Thresholds

### 21.1 The critic scorecard

Raw §6.44. The source prefaces the table with "I would use:" — authorial proposal, carried as
the operative weighting because §6.46 and §6.47 both depend on it.

| Dimension | Weight |
|---|---|
| Business Fit | 15% |
| Brand Specificity | 10% |
| Visual Quality | 20% |
| UX / Usability | 15% |
| Conversion | 15% |
| Technical Quality | 10% |
| Creative Distinction | 15% |
| **Total** | **100%** |

The weights are preserved exactly. Two structural facts follow from them:

- **Visual Quality (20%) is the single heaviest dimension.**
- **Technical Quality (10%) is joint-lowest with Brand Specificity**, consistent with raw
  §6.12's rule that technical correctness must not inflate the creative score.

Scored separately, outside the weighted 100:

| Separate output | Form |
|---|---|
| **Blueprint Fidelity** | 0–100 |
| **Template Risk / AI-Generic Risk** | See §17.2, §17.3 |

**No aggregation formula is stated.** The source gives weights that sum to 100 and an
`overallScore` in the §6.60 report, but never states the computation, the per-dimension scale,
or rounding. A weighted mean is the obvious reading and is *not* asserted here as canon.
Recorded as **U14** in §28.

**Registry status.** None of these seven dimension names, nor the weights, nor
`blueprintFidelity`, appear in `03-REGISTRY/parameter-registry.md`. Recorded as **N1** in §28.

### 21.2 Hard-fail rules

Raw §6.45. Nine conditions, each of which blocks shipment **regardless of score**:

| # | Hard-fail condition |
|---|---|
| 1 | Wrong business facts |
| 2 | Fake claims |
| 3 | Fake testimonials |
| 4 | Broken critical CTA |
| 5 | Major accessibility failure |
| 6 | Major mobile failure |
| 7 | Broken booking |
| 8 | Severe performance problem |
| 9 | High template risk |

> → **DO NOT SHIP**

> The research makes data integrity and avoidance of fabricated social proof explicit
> requirements.

**Rule.** These nine are absolute. "Regardless of score" is the source's own phrasing and it
is preserved at full strength: a site scoring 100 on every weighted dimension does not ship
with any one of these present. Three of the nine (1–3) are factual-integrity conditions, which
is the scorecard-level enforcement of §3.3.

This aligns with `quality-gates.md` §8.2, which makes unresolved blocking findings a blocking
condition for Final Approval.

**Undefined qualifiers.** Four of the nine turn on a qualifier the source never defines:
"major" accessibility failure, "major" mobile failure, "severe" performance problem, "high"
template risk. Each is recorded in §28 (U6, U15, U7, U10 respectively). The conditions are
preserved as stated; the thresholds are not invented.

### 21.3 Quality thresholds

Raw §6.46. The source's own preface is the single word **"Suggested:"** — preserved, because it
governs the status of every number below.

| Threshold | Value |
|---|---|
| Overall | ≥ 90 |
| Business Fit | ≥ 90 |
| Visual Quality | ≥ 90 |
| Creative Distinction | ≥ 85 |
| Conversion | ≥ 90 |
| UX | ≥ 90 |
| Accessibility | = PASS |
| Critical Issues | = 0 |
| Template Risk | = LOW |
| AI-Generic Risk | = LOW |

**Status: SUGGESTED, not canonical.** These ten values are the source's suggestions and are
**not promoted** to canonical gate criteria by this document. Preserved exactly as written.

Four observations, all internal to the source:

- **Creative Distinction ≥ 85 is the only numeric threshold below 90.** The source does not
  explain why the dimension it calls "one of the most important" carries the lowest bar.
- **Two dimensions have no threshold:** Brand Specificity and Technical Quality are weighted in
  §6.44 but absent from this list. Blueprint Fidelity likewise has no stated passing value
  (§10.1).
- **"Critical Issues = 0"** maps to P0 count = 0 (§20.1), though the source does not state the
  mapping in those words.
- **Accessibility, Template Risk and AI-Generic Risk are not numeric**, so the list mixes
  scored thresholds with categorical gates.

Recorded as **U16** in §28: the suggested thresholds are not ratified anywhere in the Control
Plane, so no gate currently enforces them.

### 21.4 Score alone does not decide

Raw §6.47 is the source's own guard against threshold arithmetic, and it is the reason §21.3
cannot be read as a decision procedure:

> This is important.
>
> A site could score **91** but still have **Creative Distinction = 74**. That should not
> ship.
>
> Likewise: **89** with **Creative = 94**, **Business = 96** might deserve refinement rather
> than rejection.
>
> So the critic evaluates **profile**, not just average.

**ILLUSTRATIVE — NON-NORMATIVE (91/74 and 89/94/96).** The four numbers are the source's
worked cases, not additional thresholds.

**Rule.** The critic evaluates the **profile**, not the average. A passing overall score with a
weak critical dimension does not ship. A near-miss overall score with a strong profile is a
refinement candidate rather than a rejection. This is the phase's clearest statement that
Phase 6 is a judgement, not a calculation — which is exactly why §21.3's numbers stay
suggested and why the summary judgement (§17.6) has standing.

---

## 22. Routing and Phase Regression

### 22.1 The critic recommends, the Control Plane routes

Per `agent-roles.md` §4.6 and `failure-routing.md`, Phase 6 produces findings with root causes
and recommended destinations. The routing decision itself is a Control Plane function.

**Rule.** The critic MUST state a root cause (§19.1) and MAY recommend a destination. It does
not perform the transition, does not edit the implementation, and does not revise the
blueprint (§4.3).

### 22.2 Never "change everything"

Raw §6.21 constrains the scope of any recommendation:

> Unless the design is fundamentally wrong.
>
> Instead:
>
> **Preserve:** Hero · Typography · Brand palette · Doctor section
>
> **Change:** Services · Gallery · Section transitions · CTA treatment
>
> This protects good work while improving weak work.

**ILLUSTRATIVE — NON-NORMATIVE.** The two lists are the source's example, drawn from the same
dental case used throughout. What is normative is the **preserve/change split** itself.

**Rule.** Every refinement recommendation MUST name what is preserved as well as what changes.
A recommendation that only lists changes implicitly puts the whole page at risk and defeats
the regression protection in §24.1. The exception the source states is narrow: "unless the
design is fundamentally wrong."

This is also the source's own argument against wholesale rebuilds, restated in §6.58 as "much
better than simply rebuilding the website" — and it matches `failure-routing.md` §9
invariant 4, which excludes wholesale rebuilds from routing outcomes.

### 22.3 Blueprint reconsideration

Raw §6.55:

> The critic may recommend: Implementation refinement **OR** Blueprint refinement.
>
> Example: Assets cannot support cinematic direction. Recommendation: Return to Phase 4 and
> lower image dominance.
>
> That is better than forcing the implementation agent to solve an impossible design strategy.

**ILLUSTRATIVE — NON-NORMATIVE.** The asset/cinematic instance is the source's example.

This is the practical payoff of the Mode A / Mode B separation (§6.1): when the blueprint asks
for something the inputs cannot deliver, sending the work to Phase 5 guarantees failure. The
critic's ability to send the finding upstream is what prevents an impossible strategy being
retried indefinitely.

**Identifier note.** `imageDominance` is referenced by the source's example but remains absent
from `parameter-registry.md`. Carried from the Phase 5 audit as **N2** in §28.

### 22.4 Reality checks

Two source sections test whether the design strategy is achievable with the actual inputs.

**Asset reality check (raw §6.56):**

> The critic should inspect whether: selected language + selected composition actually matches
> the supplied assets.
>
> The research explicitly says poor imagery should trigger alternative composition strategies
> rather than generic stock imagery.

The stated remedy is a **composition change, not stock imagery**. Substituting generic stock to
rescue a composition would breach both Brand Specificity (§9) and the source's own instruction.

**Content reality check (raw §6.57):**

> Is the design trying to create a visual narrative that the available business content cannot
> support?
>
> If yes: return to Phase 4.

Both checks route upstream by design. Neither is a finding against the builder: an
implementation cannot manufacture assets or content it was not given, and §3.3 forbids the
critic from inventing them either.

### 22.5 Phase regression decision tree

Raw §6.58 states the architecture as a decision tree:

```
Phase 6
  ▼
Problem identified
  ▼
Is problem implementation?
  ├── YES → Phase 5
  └── NO
       ▼
      Is problem design strategy?
       ├── YES → Phase 4
       └── NO  → Phase 6 refinement
```

> This is much better than simply rebuilding the website.

**Order matters.** Implementation is tested first, then design strategy, then local
refinement. The default is the narrowest correction, not the broadest.

**Control Plane mapping.** The source's destinations map to real states as follows:

| Source destination | Control Plane state |
|---|---|
| Phase 5 | `RETURN_TO_IMPLEMENTATION` |
| Phase 4 | `RETURN_TO_BLUEPRINT` |
| Phase 6 refinement | Remains in Phase 6 |

The third branch — "Phase 6 refinement" — is the loop described in §23 and §24, and it is what
makes Phase 6 a *refinement engine* rather than a pure gate.

**Note.** `state-machine.md` defines the transition vocabulary; raw §6.61's `RETURN_TO_PHASE_4`
is the same transition as `RETURN_TO_BLUEPRINT` under a different name. See §27.2 and finding
**F1** in §28.

---

## 23. The Refinement Plan

### 23.1 Plan output

Raw §6.48. The critic outputs a severity-tagged list:

| Priority | Item |
|---|---|
| P1 | Fix hero composition |
| P1 | Fix repetitive service layout |
| P2 | Improve mobile spacing |
| P2 | Improve review hierarchy |
| P3 | Refine button motion |

**ILLUSTRATIVE — NON-NORMATIVE.** The five items are the source's example. What is normative is
the form: every refinement item carries a severity from §20.1, and the plan is ordered by it.

Note that the example contains no P0 — consistent with §21.2, a P0 is a hard-fail, so a plan
containing one is not a refinement candidate but a blocked build.

### 23.2 Instructions must be specific

Raw §6.49 contrasts a useless instruction with a usable one:

> **Bad:** "Make the hero more premium."
>
> **Good:** "Restore the blueprint's asymmetric 7/5 image-text relationship, move the image 2
> columns beyond the main container, reduce CTA count from two to one, and preserve the
> editorial whitespace."
>
> This gives the implementation agent actionable instructions.

**ILLUSTRATIVE — NON-NORMATIVE.** The 7/5 ratio, the 2-column overhang and the CTA count are
the source's example values, not required measurements.

**Rule.** A refinement instruction MUST be specific enough to execute without interpretation.
Note what the "good" example actually does: it cites the blueprint ("restore the blueprint's…"),
gives measurable relationships, and states a preservation constraint in the same breath as the
changes. That is §22.2 and §7.1 applied at instruction level.

### 23.3 Refinement scope

Raw §6.50. Each issue gets five fields:

| Field |
|---|
| Affected file/component |
| Affected section |
| Required change |
| Do not change |
| Expected outcome |

The source's worked example:

> **Section:** Services
>
> **Change:** Replace equal 6-card grid with unequal feature/index composition.
>
> **Do not change:** Content order · Business copy · Color tokens
>
> **Expected:** Increase hierarchy and reduce template appearance.

**ILLUSTRATIVE — NON-NORMATIVE.** The Services instance is the source's example. The five
fields are normative.

Two fields carry particular weight:

- **"Do not change"** is the per-issue form of §22.2's preserve list. It is what makes
  regression detectable: a change outside the declared scope is a regression by definition.
- **"Expected outcome"** states in advance what improvement should be observable, which is what
  §24.2 and §24.3 then test against. Without it, "improved" has no referent.

**Boundary.** "Affected file/component" is the critic naming *where* the work goes, not writing
it. Phase 5 remains the only phase that edits code (§4.3).

---

## 24. Re-evaluation and Stop Conditions

Refinement is never the end of the loop. Every correction produces a new rendered state, and
that new state is evaluated by the same standard as the first (§3.1).

### 24.1 Regression protection

Raw §6.51 requires five questions **after every correction**:

| Question |
|---|
| Did we fix the problem? |
| Did we damage anything else? |
| Did creative fidelity fall? |
| Did mobile break? |
| Did conversion weaken? |

> This is essential.

**Rule.** These five MUST be answered after every correction, not once at the end of a
refinement batch. The source's phrasing is "after every correction." Four of the five ask about
collateral damage rather than the fix itself, which is the point: a targeted fix that breaks
mobile has made the site worse.

This closes the loop back to evidence: answering "did mobile break?" requires re-rendering and
re-observing the mobile view (§12.2), not reasoning about whether the change should have
affected it.

### 24.2 Before / after comparison

Raw §6.52:

> The critic should compare Version A vs. Version B and determine: **Improved · Unchanged ·
> Regressed**
>
> This prevents meaningless AI tweaking.

**Rule.** Every refinement cycle produces one of three verdicts. "Unchanged" is a real and
important outcome — it is what identifies churn, and per §24.4 accumulating unchanged cycles is
what triggers the stop condition.

### 24.3 Evidence of improvement

Raw §6.53 applies the §7.1 evidence standard to the comparison itself:

> The critic should say: "Version B improved visual hierarchy because the primary service now
> occupies approximately 45% of the section rather than six equal visual units."
>
> Rather than: "Version B looks better."

**ILLUSTRATIVE — NON-NORMATIVE.** The 45% figure is the source's example measurement, not a
target proportion.

**Rule.** An "Improved" verdict MUST be supported by an observable difference. "Looks better" is
not an improvement claim; it is the same unfalsifiable assertion §7.2 exists to eliminate. Note
the source's own hedge — "approximately 45%" — which reflects that the critic is measuring a
render, not reading a spec.

### 24.4 Iteration stop conditions

Raw §6.54 gives two stop conditions and one consequence.

**Stop on success** — all four must hold:

```
Score ≥ threshold
  AND no P0/P1
  AND template risk low
  AND creative quality sufficient
```

**Stop on exhaustion:**

> Or when **3 refinement cycles** have failed to materially improve the website.
>
> Then: **Human review required.**

**Rule.** The three-cycle limit is source-stated and preserved exactly. The consequence is also
source-stated: **human review**, not automatic rejection and not a fourth attempt. This is the
one place the raw phase itself hands control to a human, and it aligns with `human-approval.md`
and `agent-roles.md` §4.6, where final authority rests with humans (§1.3).

**Undefined terms in the success condition.** Two of the four clauses are not operable as
written:

| Clause | Status |
|---|---|
| `Score ≥ threshold` | Threshold is the suggested §21.3 value, not ratified (**U16**) |
| `no P0/P1` | Operable — §20.1 defines both levels |
| `template risk low` | Operable as a category; no criteria for assigning it (**U10**) |
| `creative quality sufficient` | "Sufficient" is undefined (**U17**) |

Recorded as **U17** in §28. Also unstated: what counts as "materially" improved, which
determines whether a cycle counts toward the limit of three. Recorded as **U18**.

**Interaction with §24.2.** The natural reading is that a cycle returning "Unchanged" or
"Regressed" is a cycle that failed to materially improve the site. The source does not state
this mapping explicitly, and it is noted rather than asserted.

---

## 25. The Full Diagnostic Loop

Raw §6.59 renders the complete evaluation sequence. The source's box-drawing diagram is
transcribed here into the same structure:

```
RENDERED WEBSITE
        │
        ▼
INDEPENDENT CRITIC
        │
  ┌─────┼─────┐
  ▼     ▼     ▼
BUSINESS VISUAL UX/CRO
  FIT   QUALITY QUALITY
  │     │     │
  └─────┼─────┘
        ▼
    TECHNICAL
        │
        ▼
  CREATIVE QUALITY
        │
        ▼
 BLUEPRINT FIDELITY
        │
        ▼
   TEMPLATE RISK
        │
        ▼
  NOVELTY / BRAND
        │
        ▼
    ROOT CAUSE
        │
  ┌─────┼─────┐
  ▼     ▼     ▼
CONTENT PHASE 4 PHASE 5
 ISSUE   ISSUE   ISSUE
  │     │     │
  └─────┼─────┘
        ▼
  REFINEMENT PLAN
        │
        ▼
     REBUILD
        │
        ▼
  BEFORE / AFTER
        │
        ▼
   CRITIC AGAIN
```

Four structural facts the diagram establishes:

**1. Three dimensions run in parallel, the rest in sequence.** Business Fit, Visual Quality and
UX/CRO are evaluated together, then Technical, Creative Quality, Blueprint Fidelity, Template
Risk and Novelty/Brand run in series. The source does not explain the ordering; it is preserved
as drawn.

**2. Root cause is the convergence point.** Every dimension feeds into Root Cause, which then
fans out to exactly three destinations: Content, Phase 4, Phase 5. This matches §19.2's eight
causes collapsing into three routing targets, and matches §29's backward-routing diagram.

**3. The loop ends by returning to the critic.** `CRITIC AGAIN` is the last node. Refinement is
never terminal — §24 is a structural consequence of this diagram, not an optional addition.

**4. Novelty is in the loop.** `NOVELTY / BRAND` appears as a step despite having no defined
mechanics (§17.7). The concept is load-bearing in the source's own architecture while remaining
unresolved.

**On the `REBUILD` node.** Here `REBUILD` denotes the corrective build that executes the
refinement plan — the work Phase 5 performs — not a wholesale regeneration of the site. Read as
wholesale rebuild, it would contradict raw §6.21 (§22.2) and raw §6.58's own "much better than
simply rebuilding the website," both in the same source. See §27.2 and finding **F1** in §28.

---

## 26. Critic Report Structure

Raw §6.60 gives the report shape. The source's own framing is "should look roughly like," so the
example is a shape, not a schema.

```yaml
critic:
  overallScore: 93
  businessFit: 95
  brandSpecificity: 94
  visualQuality: 92
  ux: 91
  conversion: 94
  technical: 97
  creativeDistinctiveness: 89
  blueprintFidelity: 94
  templateRisk: low
  aiGenericRisk: low
  creativeIntent:
    passed: true
  issues:
    - id: P1-01
      section: services
      issue: repetitive visual hierarchy
      rootCause: implementation
      severity: P1
      recommendation: unequal feature/index composition
    - id: P2-01
      section: reviews
      issue: insufficient visual distinction
      rootCause: pattern choice
      severity: P2
      recommendation: review spotlight
  decision: refine
```

**ILLUSTRATIVE — NON-NORMATIVE.** Every value above is the source's example, including all nine
scores, both issues and the `refine` decision. **No schema is created from this.** The field
names and nesting are preserved exactly as written.

### 26.1 What the example demonstrates

| Element | What it shows |
|---|---|
| Nine numeric scores | Seven dimensions + overall + blueprint fidelity |
| `templateRisk`, `aiGenericRisk` | Categorical, not numeric — matching §17.2/§17.3 |
| `creativeIntent.passed` | The §10.5 intent test recorded as an explicit boolean |
| `issues[].rootCause` | §19 root cause carried per issue |
| `issues[].id` | Severity-prefixed identifiers (`P1-01`, `P2-01`) |
| `decision` | One of the §27 outcome states |

The `creativeIntent.passed` field is the source's own confirmation that the intent test
(§10.5) is a recorded, explicit result — which is what `quality-gates.md` §7.1 requires.

### 26.2 Internal inconsistencies in the example

Three, all noted rather than corrected:

**Field-name drift.** Two dimensions are named differently here than in §6.6 and §6.44:

| §6.6 / §6.44 | §6.60 field |
|---|---|
| Creative Distinction | `creativeDistinctiveness` |
| UX / Usability | `ux` |

Also `technical` for Technical Quality. Recorded as **N1** in §28.

**A ninth root cause.** `rootCause: pattern choice` does not appear in the §6.16 list of eight
(§19.2). "Pattern choice" is closest to a blueprint problem, since pattern selection is a Phase 4
decision. The source does not reconcile the two lists. Recorded as **U19** in §28.

**Score profile vs. thresholds.** The example passes §21.3 on eight of ten items but shows
`creativeDistinctiveness: 89` against a suggested threshold of ≥ 85 — passing — while
`overallScore: 93` exceeds ≥ 90, and `decision: refine` is returned anyway. This is consistent
with §21.4: the profile decides, not the average. The example is a site that clears the
thresholds and is still sent to refinement.

### 26.3 What the report does not contain

The source's example includes no per-section scores (§18.1), no drift level (§10.2), no fidelity
sub-scores (§10.1), no timed-test results (§12.3), no accessibility result despite
"Accessibility = PASS" being a §21.3 threshold, and no cycle counter for §24.4. The report shape
is therefore narrower than the evaluation the phase describes. No fields are invented to close
the gap. Recorded as **U20** in §28.

---

## 27. Outcome States

### 27.1 The four states

Raw §6.61:

> The critic returns **exactly one**:
>
> `SHIP` · `REFINE` · `REBUILD` · or `RETURN_TO_PHASE_4`
>
> That last one is important. It means: **the problem is creative strategy, not coding.**

**Rule.** The critic returns exactly one state. The four names are the source's own and are
preserved as **critic recommendation vocabulary**.

| State | Meaning |
|---|---|
| `SHIP` | No blocking findings; the site meets the standard |
| `REFINE` | Findings are correctable within the current design strategy |
| `REBUILD` | Source-stated, but see §27.2 |
| `RETURN_TO_PHASE_4` | The problem is creative strategy, not coding |

The source's emphasis on the fourth state is the phase's whole diagnostic argument in one line:
without it, every finding becomes a coding task, and a flawed strategy gets rebuilt rather than
reconsidered.

### 27.2 Mapping to Control Plane states

The critic's four recommendation names are not all Control Plane states. The mapping:

| Critic state (raw §6.61) | Control Plane state | Status |
|---|---|---|
| `SHIP` | Proceeds to Final Approval | Human decision, not the critic's (§1.3) |
| `REFINE` | Remains in Phase 6 / `RETURN_TO_IMPLEMENTATION` | Depends on root cause (§22.5) |
| `REBUILD` | **No corresponding state** | See below |
| `RETURN_TO_PHASE_4` | `RETURN_TO_BLUEPRINT` | Same transition, different name |

**On `SHIP`.** The critic recommending `SHIP` is not the same as the site shipping.
`human-approval.md` §6.2 places Final Approval with a human; `quality-gates.md` §7 requires a
passing Critic Validation as a precondition for it. `SHIP` is therefore a recommendation that
unblocks the human decision, not the decision itself.

**On `REBUILD` — finding F1.** `REBUILD` is not a state in `state-machine.md`, and
`failure-routing.md` §9 invariant 4 states that wholesale rebuilds are not a routing outcome.
The raw source is also internally at odds with a wholesale reading: raw §6.21 forbids "change
everything" except when the design is fundamentally wrong (§22.2), and raw §6.58 calls the
regression tree "much better than simply rebuilding the website."

The reading consistent with the source's own architecture: `REBUILD` is the corrective build
that executes a refinement plan (as in the §25 loop), which routes to
`RETURN_TO_IMPLEMENTATION`. Where a design genuinely is fundamentally wrong, the correct
destination is `RETURN_TO_BLUEPRINT`, not an unscoped regeneration.

All four names are preserved as the critic's vocabulary; the Control Plane column records what
each actually maps to. Recorded as **F1** in §28.

**On `RETURN_TO_PHASE_4`.** This is a naming difference only. The Control Plane names states by
function (`RETURN_TO_BLUEPRINT`), the raw source by phase number. The transition is the same.
Canonical documents use the Control Plane name.

### 27.3 What the critic does not decide

Restating §1.3 and §4.3 at the point of decision, because this is where the boundary is easiest
to lose:

| The critic does | The critic does not |
|---|---|
| Return one outcome state | Execute the transition |
| Recommend a destination | Perform the routing |
| Recommend `SHIP` | Grant Final Approval |
| Identify the root cause | Fix the code or revise the blueprint |
| Escalate after three failed cycles | Overrule the human reviewer |

---

## 28. Open Questions and Findings

Everything recorded here is a gap in the source material or a discrepancy between documents.
None is resolved by invention in this document.

### 28.1 Discrepancies with Control Plane or Registry (D)

| ID | Finding |
|---|---|
| **D1** | Raw §6.0 calls Phase 6 the "final quality authority." `human-approval.md` §6.2 and `agent-roles.md` §4.6 place final authority with humans. Scoped in §1.3 as final *quality-judgement* authority among AI roles. |
| **D2** | `competitors.json` and `seo.json` are named as Phase 6 inputs (raw §6.3) but have no artifact contract — no shape, owner or population method. This makes §17.4 and §16.3 specified but not operable. |
| **D3** | The rendered result — the critic's primary input (§3.1) — is not a registered artifact. No owner, no viewport set, no capture state defined. |
| **D4** | The Design Intent Statement is required for the §10.5 intent test, which `quality-gates.md` §7.1 requires by name. If absent from the blueprint, a required Phase 6 check cannot run. |
| **D5** | Tablet screenshots are listed as inputs (raw §6.3) but no tablet-specific evaluation exists; only mobile gets a dedicated critic (raw §6.33). Carried forward from the Phase 5 audit. |

### 28.2 Naming and registry findings (N)

| ID | Finding |
|---|---|
| **N1** | None of the seven dimension names, the §6.44 weights, `blueprintFidelity`, `templateRisk` or `aiGenericRisk` appear in `parameter-registry.md`. The source also names dimensions inconsistently: `Creative Distinction` / `creativeDistinctiveness`, `UX / Usability` / `ux`, `Technical Quality` / `technical`. |
| **N2** | `imageDominance` and `typographyDominance` remain absent from `parameter-registry.md`. Carried from Phase 5; `imageDominance` is referenced by the raw §6.55 example. |

### 28.3 Undefined values and mechanics (U)

| ID | Finding |
|---|---|
| **U1** | Blueprint Fidelity: seven sub-scores with no aggregation formula and no passing value (§10.1). |
| **U2** | Creative Drift: four levels with no mapping to severity, score deduction or routing (§10.2). |
| **U3** | "3–5 memorable moments" (§11.3) is stated inside a question with no rule for other counts. |
| **U4** | Pattern repetition (§11.5): six tracked axes, no count threshold. |
| **U5** | Timed tests (§12.3): no simulation procedure for 5/10/30 seconds. |
| **U6** | Accessibility (§14.2): eight check areas, no contrast ratio, no touch target size, no WCAG level, no definition of "major failure" for the §21.2 hard-fail. |
| **U7** | Performance (§15.2): no metrics, no budgets, no definition of "severe," no measurement method. |
| **U8** | SEO (§16.3): named once as an aspect, no criteria of any kind. |
| **U9** | AI-Generic Risk (§17.2): three levels, no criteria for assigning one. |
| **U10** | Template Risk (§17.3): §6.30 is binary yes/no, §6.46 requires "= LOW" on a three-level scale. Not reconciled. |
| **U11** | Section scores (§18.1): "each section gets a score" with no scale. |
| **U12** | Root causes (§19.2): eight causes with no source-stated mapping to destinations. |
| **U13** | Fix priority (§20.2): `Impact × Confidence × Cost` has no scales or units, and `Cost` as a multiplier contradicts the stated ordering. |
| **U14** | Scorecard (§21.1): weights sum to 100 but no aggregation formula, per-dimension scale or rounding rule is stated. |
| **U15** | "Major mobile failure" (§21.2) is undefined. |
| **U16** | The ten §21.3 thresholds are prefaced "Suggested" and are ratified nowhere in the Control Plane, so no gate enforces them. Brand Specificity, Technical Quality and Blueprint Fidelity have no threshold at all. |
| **U17** | Stop conditions (§24.4): "creative quality sufficient" is undefined. |
| **U18** | Stop conditions (§24.4): "materially improve" is undefined, so cycle counting toward the limit of three is not operable. |
| **U19** | The §6.60 report uses `rootCause: pattern choice`, a ninth cause absent from the §6.16 list of eight. |
| **U20** | The §6.60 report shape omits per-section scores, drift level, fidelity sub-scores, timed-test results, the accessibility result and the refinement cycle counter. |

### 28.4 Structural findings (F)

| ID | Finding |
|---|---|
| **F1** | `REBUILD` (raw §6.61, §6.59) is not a `state-machine.md` state, and `failure-routing.md` §9 invariant 4 excludes wholesale rebuilds from routing outcomes. The raw source contradicts a wholesale reading in §6.21 and §6.58. Preserved as critic vocabulary and mapped in §27.2. |
| **F2** | Novelty appears in the §6.59 loop as a step, but the source states no algorithm, corpus or comparison basis. The loop contains a node that cannot currently be executed (§17.7). |
| **F3** | All four Phase 6 rows in `phase-ownership-matrix.md` (Rows 40–43) are **provisional**, not canonical. |
| **F4** | Row 43 (novelty evaluation) is recorded as **not operable**: `noveltyThreshold` and `noveltyComparison` are both UNDEFINED. Phase 2 §17.3 and Phase 3 §24 leave the same gap. |

### 28.5 Effect on operability

Phase 6's structure, dimensions, evidence standard, severity system, root-cause model, routing
tree and refinement loop are all fully specified and operable as written. What is not operable is
the numeric layer: the thresholds are suggested rather than ratified, and the accessibility,
performance, novelty and risk-level criteria are undefined. The phase can be run as a diagnostic
engine today. It cannot yet be run as an automated gate.

---

## 29. Phase 6 Close and the Complete Factory

### 29.1 The four core questions

Raw §6.62 restates the phase as four questions, each mapped to a body of evaluation:

| # | Question | Answered by |
|---|---|---|
| 1 | **Is it right?** | Business Fit |
| 2 | **Is it good?** | Visual / UX / Technical Quality |
| 3 | **Is it distinctive?** | Creative Quality |
| 4 | **Is it genuinely finished?** | Independent Refinement |

> Every website ultimately has to answer:

The fourth question is the one that makes Phase 6 a refinement engine rather than a gate.
"Genuinely finished" is not answered by a score; it is answered by the loop in §24 having run
to a stop condition.

### 29.2 Phase 6 final principle

Raw §6.63. The source designates this the official principle:

> **The critic's responsibility is not to make every website safer, cleaner, or more
> conventional. Its responsibility is to make each website more appropriate, more intentional,
> more distinctive, and more effective.**

> That matters for your creativity requirement.
>
> The critic should **not punish creativity simply because it is unusual**.
>
> It should punish: **unjustified creativity.**

**Rule.** This is the interpretive key for the entire phase. It sets the direction of every
judgement:

| The critic pushes toward | The critic does not push toward |
|---|---|
| More appropriate | Safer |
| More intentional | Cleaner |
| More distinctive | More conventional |
| More effective | More familiar |

The distinction between *unusual* and *unjustified* is what §3.2 turns into a test: the question
is never whether a decision is conventional, it is whether the decision can be justified against
the business, the blueprint and the intent. An unusual decision with a reason is a strength. A
conventional decision with no reason is the AI-generic default (§17.2).

This principle also constrains the critic's own failure mode. A critic that reflexively
recommends restraint would systematically erode Creative Distinction — the dimension the source
calls one of the most important — while every individual recommendation looked defensible. §6.63
is the guard against that.

### 29.3 The complete Blogspage AI Factory

Raw §6.64 closes the phase by placing it in the whole system:

```
PHASE 1  FOUNDATION
         "What rules must every site obey?"
              ↓
PHASE 2  VISUAL DESIGN LANGUAGES
         "How should it feel?"
              ↓
PHASE 3  COMPOSITION & PATTERN SYSTEM
         "What visual vocabulary can express it?"
              ↓
PHASE 4  AI CREATIVE DIRECTION
         "What should THIS business become?"
              ↓
PHASE 5  AI IMPLEMENTATION
         "How do we build it?"
              ↓
PHASE 6  INDEPENDENT CRITIC
         "Is it actually good?"
              ↓
         REFINE / REBUILD
              ↓
          FINAL SITE
```

Each phase's question is the source's own. Read in sequence they show why Phase 6 cannot be
merged into Phase 5: Phase 5 answers "how do we build it," and no amount of rigour in answering
that question also answers "is it actually good."

### 29.4 Intelligent backward routing

Raw §6.64 continues:

> And importantly, Phase 6 can send the work **backward intelligently**:

```
Phase 6
   │
   ├── Implementation problem
   │        ↓
   │      Phase 5
   │
   ├── Design-strategy problem
   │        ↓
   │      Phase 4
   │
   └── Content/asset problem
            ↓
     Research/Input correction
```

This is the third statement of the same routing model — after §19.2's eight causes and §22.5's
decision tree — and the three agree. The three destinations here match the three that §25's loop
diagram fans out to.

**The word "intelligently" is doing work.** The alternative architecture is a single backward
edge: failure sends everything to the builder. That architecture cannot fix a flawed strategy or
a missing asset, because neither is the builder's to fix. Phase 6's diagnostic model exists to
make the backward edge selective.

### 29.5 What Phase 6 contributes to the system

Phase 6 is the phase that makes the preceding five accountable. Phases 1–3 define what is
possible, Phase 4 decides what this business becomes, Phase 5 builds it — and none of those
phases can verify its own output, because each judges against its own intent.

The source's answer is structural rather than procedural. Independence of judgement (§4),
evidence from the rendered result (§7), separation of fidelity from quality (§6.1), root cause
before recommendation (§19), and a refinement loop that always re-evaluates (§24). Take away any
one and the phase degrades into review theatre: a critic that reads the blueprint's intent as
achievement, or accepts a green build as quality, or recommends changes without diagnosing
cause, or refines without checking whether the refinement helped.

The numeric layer is not yet ratified (§28.5). The judgement architecture is complete.

---

## 30. Document Close

This document canonicalizes raw §6.0–§6.64 in full. Every source subsection is mapped in §2.2.
No threshold, formula, weight, criterion, severity level, report field or state has been added
beyond what the source states; every gap is recorded in §28 rather than filled.

Phase 6 is the last phase of the factory. Its authority is bounded: it is the final quality
judgement among AI roles, and it is not the final approval, which remains a human decision
(§1.3, §27.2).
