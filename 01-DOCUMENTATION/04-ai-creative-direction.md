---
document: Blogspage AI Design System V1
phase: 4
name: AI Creative Direction & Design Decision Engine
status: canonical
version: 1.0.0
source: 04-ai-creative-direction-raw.md
---

# Blogspage AI Design System V1

# Phase 4 — AI Creative Direction & Design Decision Engine

**Derived from:** `01-DOCUMENTATION/04-ai-creative-direction-raw.md`. The raw source
is organised as forty-nine numbered subsections (§4.0–§4.48) followed by a closing
author commentary block. Section references written as "raw §4.n" in this document
cite those subsection numbers.

**Scope boundary:** Phase 4 is the **decision** phase. It consumes the
factory-global vocabularies of Phases 1, 2 and 3 and produces **per-project
values** — this business, this design language, this section sequence, this
pattern, at this setting, in this order. Phase 3 §35.0 states the boundary from
the other side: Phases 1–3 issue **capability** and **fit** statements, and
Phase 4 alone issues **value** statements. Where the raw source restates a
construct that Phase 2 or Phase 3 defines, this document references the owning
phase rather than redefining it, per canonicalization rule 9.

**Phase 4 is per-project and produces two artifacts.** Both are Phase 4-owned:

```
Phase 3 Vocabulary  (factory-global)
    ↓  consumed by
Composition Designer
    ↓  produces
Composition Plan    (Phase 4-owned, per project)
    ↓  consumed by
Creative Director
    ↓  produces
Design Blueprint    (Phase 4-owned, per project, embeds the Composition Plan)
    ↓  consumed by
Phase 5             (implementation)
```

See `03-REGISTRY/phase-ownership-matrix.md` §6 decisions 13, 14 and 15, and
`02-CONTROL-PLANE/artifact-contracts.md` §5.5.

**Normative language:** MUST, SHOULD and MAY carry their source strength. The raw
Phase 4 source is predominantly advisory but carries more genuine prohibitions than
Phase 3; §2.3 records the full normative inventory. Where the source uses
first-person editorial phrasing ("I'd make this…", "I would stop here"), this
document marks the statement as source commentary rather than promoting it to a
requirement.

**Parameter naming:** The raw §4.45 blueprint is written in `snake_case`. Registry
decision 15 makes `camelCase` canonical for field identifiers, with `snake_case` a
legacy variant that maps onto it. §36.4 carries the full mapping. Source spelling is
preserved verbatim inside quoted source blocks.

---

## 1. Purpose

Phase 4 is the bridge between two statements (raw §4.0):

> **"We researched this business."**

and:

> **"We know exactly what website experience we should create."**

> It must produce a **Design Blueprint** before any coding begins.

That is the source's one unambiguous requirement at the phase level, and it is
preserved at full strength: no implementation work begins without a blueprint.

The raw source expresses the phase flow as:

```
BUSINESS RESEARCH
    ↓
BUSINESS INTELLIGENCE
    ↓
CREATIVE DIRECTION
    ↓
DESIGN LANGUAGE
    ↓
NARRATIVE STRATEGY
    ↓
COMPOSITION STRATEGY
    ↓
DESIGN BLUEPRINT
    ↓
AI CODING AGENT
```

`BUSINESS RESEARCH` is upstream of Phase 4 and `AI CODING AGENT` is Phase 5. Both
are referenced, not defined here. The six intermediate tiers are Phase 4 stages and
are specified in §4–§22 below.

The source closes the subsection with its own rationale:

> The research supports this broader architecture: the AI should dynamically select
> the design language, section sequence and layout primitives based on business
> context rather than rely on a fixed template.

---

## 2. Scope

### 2.1 What Phase 4 supplies

| Construct | This document | Raw |
|---|---|---|
| Core principle — creative point of view | §3 | §4.1 |
| Input contract | §4 | §4.2 |
| Business Truth Layer | §5 | §4.3 |
| Business DNA | §6 | §4.4 |
| Customer Psychology Model | §7 | §4.5 |
| Business Value Proposition | §8 | §4.6 |
| Positioning Statement | §9 | §4.7 |
| Creative North Star | §10 | §4.8 |
| Brand Personality Matrix | §11 | §4.9 |
| Brand Maturity | §12 | §4.10 |
| Asset Intelligence and Asset Capability Score | §13 | §4.11–§4.12 |
| Content Intelligence | §14 | §4.13 |
| Competitive Visual Analysis and Differentiation Score | §15 | §4.14–§4.15 |
| Design Language Selection | §16 | §4.16 |
| Primary + Secondary Influence | §17 | §4.17 |
| Creative Intensity | §18 | §4.18 |
| Creative Risk | §19 | §4.19 |
| Visual Tension | §20 | §4.20 |
| Content Density | §21 | §4.21 |
| Image and Typography Dominance | §22 | §4.22–§4.23 |
| Narrative Strategy N01–N08 | §23 | §4.24 |
| Primary Conversion Action | §24 | §4.25 |
| Section Priority Matrix | §25 | §4.26 |
| Section Ordering Engine | §26 | §4.27 |
| Chapter Engine | §27 | §4.28 |
| Composition Mode Selection | §28 | §4.29 |
| Pattern Selection | §29 | §4.30 |
| Pattern Parameterization | §30 | §4.31 |
| Section Relationship Engine | §31 | §4.32 |
| Visual anchors, quiet zones, rhythm | §32 | §4.33–§4.35 |
| Creative governance — repetition, novelty, category balance, boundaries | §33 | §4.36–§4.39 |
| Content, asset and competitor adaptation | §34 | §4.40–§4.42 |
| Design Confidence and Uncertainty Handling | §35 | §4.43–§4.44 |
| Design Blueprint — field contract and illustrative instance | §36 | §4.45 |
| Creative Quality Gate | §37 | §4.47 |
| Decision pipeline and the Ultimate Rule | §38 | §4.46, §4.48 |
| Phase boundaries | §39 | — |
| Open questions / ambiguities | §40 | — |

**Several entries above are selections from vocabulary owned elsewhere, not Phase 4
definitions.** Per §39:

| Entry | Status |
|---|---|
| §16 design languages | DL-01…DL-05 are Phase 2. Phase 4 scores and selects among them. |
| §28 composition modes | The ten modes are Phase 3 `C01`–`C10`. Phase 4 selects; it does not define. |
| §31 section relationships | The seven types are Phase 3 §16. Phase 4 assigns them per adjacent pair. |
| §32 anchors, quiet zones, rhythm | Phase 3 §19 (anchors), §20 (quiet zones), §17 (rhythm) own the constructs. Phase 4 distributes them per project. |
| §33.2 novelty | Evaluation and threshold are Phase 6 per matrix Row 43. Boundary recorded in §39.3. |
| §37 creative quality gate | Overlaps Control Plane Blueprint Validation. Boundary recorded in §39.3. |

### 2.2 What Phase 4 does not supply

The raw source contains no Phase 4 content on: scoring formulas or weights for any
of its numeric scores, aggregation rules for composite scores, thresholds that
convert a score into a decision, derivation rules that map a business input to an
output value, component or token implementation, breakpoints or viewport values, or
the specification of any individual pattern. None of these has been added. §40
records each absence.

**This is the defining characteristic of the Phase 4 source.** It names a large
number of scores, scales and matrices and specifies the derivation of almost none of
them. Every score below is preserved with its stated range and its illustrative
examples; no formula has been invented to connect inputs to outputs.

### 2.3 Normative inventory

The raw Phase 4 source contains the following explicit requirements:

| Strength | Statement | Raw |
|---|---|---|
| MUST | Phase 4 **must** produce a Design Blueprint before any coding begins | §4.0 |
| MUST | Before the blueprint is approved, the AI **must** answer the nine quality gate questions | §4.47 |

The following are prohibitions or absolute constraints in force though not phrased
with "must":

| Strength as written | Statement | Raw |
|---|---|---|
| Rule (absolute) | Creative freedom applies to presentation, **never** to factual reality | §4.3 |
| Prohibition | The secondary language **cannot** override business psychology | §4.17 |
| Prohibition | Section ordering is **never** from a default template | §4.27 |
| **No freedom** | Business facts, credentials, reviews, ratings, legal information and critical contact information admit **no** creative freedom | §4.39 |
| Directive consequence | If novelty is LOW, **recompose** — not "change the colors" | §4.37 |
| Constraint | Do not become visually strange simply for the sake of being different | §4.15 |
| Constraint | Do not overcommit to photography-dependent or brand-specific decisions when evidence is uncertain | §4.44 |

Everything else in the source is advisory ("should", "can", "may", "I'd"). This
document preserves that distribution. No advisory statement has been promoted to a
requirement.

**Note on §4.36.** The repetition budget numbers are explicitly qualified by the
source as "guidance constraints, not absolute laws". They are preserved at that
strength and are not stated as factory limits.

---

## 3. Core Principle

Raw §4.1 states the principle in one line:

> **The AI is not choosing a design. It is forming a creative point of view.**

The source's own assessment: "This is the biggest improvement."

The principle is expressed as an ordering constraint on the output. The blueprint
should not *merely* begin with selections:

```
Primary language: Editorial
Hero: H04
Services: S01
```

It should first state a point of view:

> **"This business should feel sophisticated, reassuring and highly personal. Its
> website should emphasize expertise through editorial storytelling, use real human
> photography as the emotional anchor, and alternate quiet moments with high-impact
> visual compositions."**

> Only after that should it choose patterns.

The source closes: "That makes the system much more creative."

**Interpretation.** The source uses "should", so this is a strong recommendation
rather than a MUST. The substantive content is the ordering: intent precedes
selection. §10 carries the Design Intent Statement that operationalises it, and §38
records the pipeline position where it sits.

The pattern IDs `H04` and `S01` in the negative example are illustrative references
to Phase 3 §14.2's eight illustrative IDs. Neither is specified anywhere in the
factory; see §29.2.

---

## 4. Phase 4 Input Contract

Raw §4.2. "The engine receives a structured Business Intelligence Package":

```
/business-intelligence/
    business.json
    brand.json
    audience.json
    services.json
    reviews.json
    assets.json
    seo.json
    competitors.json
    research.md
```

> The raw URLs are primarily consumed by the research stage, not by the design
> engine.

**Nine files, eight JSON plus one Markdown.** The source states the filenames and
nothing else: no field list, no schema, no required/optional marking, and no
statement of which Phase 4 stage consumes which file. The mapping from these files
to the constructs in §5–§15 is not stated and has not been inferred.

**Relationship to the Control Plane.** `02-CONTROL-PLANE/artifact-contracts.md`
governs the Research Dossier as the upstream artifact into Phase 4. The source's
nine-file package and the Control Plane's dossier contract are not reconciled by
the source; recorded in §40.

**Boundary.** Business Research is upstream of Phase 4 and is not specified here.
Phase 3 §35.2 makes the same referral for business profile, content model and asset
model.

---

## 5. Business Truth Layer

Raw §4.3. "Before creativity begins, the AI establishes" a three-way classification
of everything known about the business:

| Class | Definition as written |
|---|---|
| **VERIFIED** | Facts directly supported by research |
| **INFERRED** | Reasonable conclusions derived from evidence |
| **UNKNOWN** | Information not established |

The source's rationale:

> This is important because the research explicitly requires no hallucinated
> statistics, testimonials, credentials or business facts.

### 5.1 The truth rule

The source states a rule in bold, and it is preserved at full strength:

> **Creative freedom applies to presentation, never to factual reality.**

This is the strongest constraint in Phase 4 and the root of three downstream
mechanisms: the "no freedom" tier of the Creative Boundary Engine (§33.4), the
`truth` check in the blueprint (§36), and the Business question in the Creative
Quality Gate (§37).

**Enforcement is elsewhere.** The rule states the constraint; it does not state how
a violation is detected. `02-CONTROL-PLANE/quality-gates.md` §5 fails a blueprint on
"any unverified factual claim" and routes a blueprint that conflicts with business
truth to `RETURN_TO_RESEARCH`. The source does not describe that mechanism.

**What the source does not state.** No procedure for classifying an item into one of
the three classes, no evidence standard that distinguishes VERIFIED from INFERRED,
and no rule for what design decisions an UNKNOWN permits or forbids. §35 covers the
related uncertainty guidance the source does give. Recorded in §40.

---


## 6. Business DNA

Raw §4.4. "The engine creates a structured profile" of sixteen attributes:

| # | Attribute |
|---:|---|
| 1 | Industry |
| 2 | Sub-industry |
| 3 | Location |
| 4 | Business model |
| 5 | Customer type |
| 6 | Price positioning |
| 7 | Brand maturity |
| 8 | Brand personality |
| 9 | Customer psychology |
| 10 | Core offering |
| 11 | Primary differentiator |
| 12 | Trust requirement |
| 13 | Local intent |
| 14 | Competitive intensity |
| 15 | Content richness |
| 16 | Asset richness |

**Attribute names only.** The source gives no value type, range, or enumeration for
any of the sixteen. Four are elaborated in later subsections — brand maturity (§12),
brand personality (§11), customer psychology (§7), asset richness (§13) — and the
remaining twelve appear only here.

Two of the names touch registry parameters: `brandMaturity` is Phase 2-owned per
`parameter-registry.md` §6.5 (see §12 for the scale conflict), and "Content richness"
relates to `contentDensity` (§21) without the source stating whether they are the
same quantity. The relationship is not asserted; recorded in §40.

---

## 7. Customer Psychology Model

Raw §4.5. "The AI identifies the dominant emotional drivers."

The source's three industry examples:

| Industry | Dominant drivers as written |
|---|---|
| **Dental** | Trust · Safety · Expertise · Reassurance · Outcome confidence |
| **Gym** | Motivation · Transformation · Identity · Belonging · Performance |
| **Restaurant** | Desire · Atmosphere · Experience · Convenience · Social status |

The source's rationale:

> The research explicitly identifies these industry-level psychological differences
> as reasons generic cross-industry templates fail.

**Non-normative.** The three industry rows are the source's examples of the model in
use. They are not a factory-wide industry-to-psychology table, and they do not bind
Phase 4 to these drivers for any business in those industries. Per canonicalization
rule 11 they are not an industry preset.

**What the source does not state.** No closed set of emotional drivers, no method for
identifying which drivers dominate for a given business, and no count constraint (all
three examples happen to list five). Recorded in §40.

**Downstream use.** Customer psychology constrains two later decisions at prohibition
strength: the secondary language cannot override it (§17), and it is one of the
inputs to section ordering (§26).

---

## 8. Business Value Proposition

Raw §4.6. The AI determines:

> **What is the business really selling?**
>
> Not merely the literal service.

The source's three examples separate the literal service from the real value:

| Industry | Service | Real value as written |
|---|---|---|
| Dental | dentistry | confidence **+** expertise **+** reassurance |
| Gym | fitness training | transformation **+** identity **+** community |
| Restaurant | food | atmosphere **+** experience **+** desire |

> This becomes a major creative input.

**Non-normative.** As with §7, the three rows illustrate the distinction rather than
fixing a per-industry value proposition. The source states no derivation method.

**Relationship to §7.** The value terms overlap the psychology drivers substantially
(transformation and identity appear in both gym rows; atmosphere, experience and
desire in both restaurant rows). The source does not state whether the value
proposition is derived from the psychology model, is an independent judgement, or is
the same information at a different granularity. Recorded in §40.

---


## 9. Positioning Statement

Raw §4.7. "The engine creates a one-sentence positioning statement" from a
four-slot template:

> **For [audience], this business is [positioning], distinguished by [evidence], and
> should be perceived as [desired perception].**

The source's example:

> For image-conscious adults seeking premium cosmetic care, this clinic should be
> perceived as an expert, highly personal practice distinguished by its
> specialist-led approach and strong patient trust.

> This is much more useful to the design engine than just industry = dental.

**Template and instance diverge.** The template has four slots in the order
audience → positioning → evidence → perception. The example fills audience, then
perception, then evidence, and does not separately fill a positioning slot. The
source does not comment on the difference. Both are preserved as written; the
divergence is recorded in §40 rather than silently reconciled by rewriting either
one.

The `evidence` slot is the point where §5's truth classification enters the creative
chain: the distinguishing evidence is subject to the VERIFIED / INFERRED / UNKNOWN
discipline. The source does not state this explicitly.

---

## 10. Creative North Star

Raw §4.8. "The engine then creates" a **Design Intent Statement** from a three-slot
template:

> **"The website should make visitors feel X, believe Y, and confidently take Z
> action."**

The source's example:

> "Make prospective patients feel reassured, believe they are in expert hands, and
> confidently book a consultation."

> This becomes the top-level design constraint.

**This is the operative form of §3's core principle.** The point of view that §4.1
requires before pattern selection is captured here as a fillable statement with three
slots: an emotion (`feel`), a belief (`believe`), and an action (`take`).

**Strength.** The source calls it "the top-level design constraint" but states no
mechanism by which it constrains anything, and no check that a later decision is
consistent with it. The Creative Quality Gate (§37) asks related questions —
Customer ("will the intended customer feel the right emotion?") and Conversion ("is
the desired action obvious?") — which correspond to the `feel` and `take` slots. The
`believe` slot has no corresponding gate question. Recorded in §40.

The three slots map onto the blueprint field `strategy.designIntent` (§36.2), which
the §4.45 instance fills with prose rather than a slotted form.

---

## 11. Brand Personality Matrix

Raw §4.9. "The AI scores characteristics such as" eleven named traits:

| # | Characteristic |
|---:|---|
| 1 | Premium |
| 2 | Trust |
| 3 | Energy |
| 4 | Warmth |
| 5 | Authority |
| 6 | Innovation |
| 7 | Playfulness |
| 8 | Minimalism |
| 9 | Humanity |
| 10 | Exclusivity |
| 11 | Approachability |

The source's example scores ten of the eleven:

| Characteristic | Example score |
|---|---:|
| Premium | 9 |
| Trust | 9 |
| Energy | 3 |
| Warmth | 7 |
| Authority | 9 |
| Innovation | 7 |
| Playfulness | 2 |
| Minimalism | 8 |
| Humanity | 8 |
| Exclusivity | 7 |

The source's own qualification is preserved at full strength:

> These scores are **creative signals**, not rigid styling instructions.

**Open set.** The source writes "characteristics such as", so the eleven are
illustrative rather than a closed list. No additional characteristic has been added.

**Scale is unstated.** The example uses integers from 2 to 9, implying 1–10 by
analogy with §18, §20 and §22, but the source never declares the range for this
matrix. The bound is not asserted here. Recorded in §40.

**Approachability is unscored** in the example, and the source does not say whether
the omission is meaningful. Preserved as written.

**No mapping to design.** The source states no rule connecting any score to any
design outcome. The "creative signals" qualification is the closest it comes, and it
explicitly disclaims a mechanical reading.

---


## 12. Brand Maturity

Raw §4.10. "Classify" into four levels:

| Level | Name as written |
|---|---|
| LEVEL 1 | Weak / inconsistent |
| LEVEL 2 | Developing |
| LEVEL 3 | Established |
| LEVEL 4 | Strong / premium |

The source states a directive for the two extreme levels only:

| Level | Directive as written |
|---|---|
| **Level 1** | Improve coherence without inventing a fake identity. |
| **Level 4** | Amplify the existing identity. |

Levels 2 and 3 have no stated directive. Preserved as written.

The Level 1 directive is an application of §5's truth rule to brand identity: raising
coherence is presentation, inventing an identity is fabrication.

### 12.1 Scale conflict with the Parameter Registry

**The source's four-level scale and the registry's three-value scale do not agree.**

| Source | Registry (`parameter-registry.md` §6.5) |
|---|---|
| LEVEL 1 — Weak / inconsistent | Weak |
| LEVEL 2 — Developing | Developing |
| LEVEL 3 — Established | *(no corresponding value)* |
| LEVEL 4 — Strong / premium | Mature |

The registry defines `brandMaturity` as Phase 2-owned with three ordinal values
(Mature · Developing · Weak). Raw §4.45 emits `brand_maturity: 3`, a numeric value on
the source's four-level scale, which has no unambiguous registry equivalent —
"Established" could map to either Developing or Mature.

**Not resolved here.** Phase 4 does not own `brandMaturity` and this document does not
amend the registry. The conflict is recorded in §40 and in the cross-phase conflict
report. No mapping between the two scales has been invented, and the source's numeric
`3` is preserved as written in §36.3.

**Compounding gap.** `phase-ownership-matrix.md` line 308 records that the
brand-maturity effect on creative intensity is UNDEFINED. So the parameter has a
contested scale *and* an unspecified downstream effect. Both are open.

---

## 13. Asset Intelligence

### 13.1 Asset evaluation dimensions

Raw §4.11. "The engine evaluates" nine asset dimensions:

| # | Dimension |
|---:|---|
| 1 | Photography quality |
| 2 | Photography quantity |
| 3 | Video quality |
| 4 | People photography |
| 5 | Facility photography |
| 6 | Product/service imagery |
| 7 | Logo quality |
| 8 | Brand asset consistency |
| 9 | Before/after assets |

The source's rationale:

> This matters enormously because the research explicitly warns that highly
> image-dependent directions can fail when photography is poor.

### 13.2 Asset Capability Score

Raw §4.12. "Create" four scores, each on an explicit **0–10** range:

| Score | Range | Example |
|---|---|---:|
| IMAGE CAPABILITY | 0–10 | 9 |
| VIDEO CAPABILITY | 0–10 | 7 |
| PEOPLE CAPABILITY | 0–10 | 10 |
| ENVIRONMENT CAPABILITY | 0–10 | 8 |

> Now the design engine knows what visual opportunities actually exist.

**Note the range.** These four are the only Phase 4 scores the source bounds at
**0–10** rather than 1–10. The distinction is preserved as written; the source does
not say whether it is deliberate.

**Nine dimensions, four scores, no stated mapping.** The source does not say which of
the §13.1 dimensions feed which of the four capability scores, nor how. `ENVIRONMENT
CAPABILITY` has no obvious §13.1 counterpart other than "Facility photography", and
`Logo quality`, `Brand asset consistency` and `Before/after assets` map to none of the
four. Recorded in §40.

**Registry relationship.** `assetDependency` is a registry parameter referenced by
Phase 3 §35.2. The source does not state the relationship between these four
capability scores and `assetDependency`, and none is asserted here.

**Downstream use.** Asset capability is a stated input to design language scoring
(§16, "Asset Fit"), image dominance adjustment (§22.1, "then adjust based on actual
assets"), and asset-to-design adaptation (§34.2). It is also one of the nine Creative
Quality Gate questions (§37).

---

## 14. Content Intelligence

Raw §4.13. "The engine evaluates not just quantity, but **content shape**."

**Nine content dimensions:**

| # | Dimension |
|---:|---|
| 1 | Service volume |
| 2 | Review volume |
| 3 | Team size |
| 4 | Story depth |
| 5 | FAQ depth |
| 6 | Location count |
| 7 | Gallery size |
| 8 | Proof strength |
| 9 | Education depth |

**Then classify** into six content-richness types:

| # | Classification |
|---:|---|
| 1 | Image-rich |
| 2 | Story-rich |
| 3 | Proof-rich |
| 4 | Service-rich |
| 5 | Data-rich |
| 6 | Human-rich |

> A business can be rich in one dimension and poor in another.

**Multi-valued classification.** The closing line establishes that the six types are
not mutually exclusive — a business can hold several. The source does not state
whether one is designated dominant, how many may apply at once, or what threshold
makes a business "rich" in a dimension. Recorded in §40.

**No dimension-to-classification mapping.** As with §13, the nine measured dimensions
and the six output classes are both listed without a stated relationship. `Image-rich`
notably has no §14 dimension behind it (gallery size is the nearest) and appears to
draw on §13 asset data instead, which the source does not say.

**Relationship to Phase 3.** Phase 3 §6 defines five content hierarchy classes and
§7 a content weight scale; those are a different construct at a different granularity
(per-content-item, not per-business). The source does not connect them. No mapping is
asserted.

---


## 15. Competitive Analysis

### 15.1 Competitive Visual Analysis

Raw §4.14. "The engine should analyze":

> **What does this business's competitive landscape already look like?**

The source's example of a competitor baseline:

| Competitors mostly use |
|---|
| white |
| blue |
| centered hero |
| 3-card services |
| doctor image |
| contact form |

Then the engine asks:

> **Where can Blogspage create differentiation without damaging category
> expectations?**

The source's own assessment: "This is an important addition to the previous version."

**Non-normative.** The six-item baseline is a dental-flavoured example of what a
competitive landscape can look like. It is not a factory-held claim about any
industry's competitors, and it is not a list of things to avoid. The same six items
reappear in §34.3 as the input side of a differentiation example.

**The framing question is the substance.** Differentiation is bounded by "without
damaging category expectations" — the same tension §33.3 formalises as two separate
scores. The source states no method for locating that boundary.

### 15.2 Competitive Differentiation Score

Raw §4.15. A three-level scale:

| Level |
|---|
| Low |
| Medium |
| High |

With one conditional directive and one constraint:

> If competitor sameness is high:
>
> Increase creative differentiation.

> But do not become visually strange simply for the sake of being different.

**Two quantities, one scale.** The subsection is titled "Competitive Differentiation
Score" and its three levels are stated without a subject, then the directive refers to
**competitor sameness** — a different quantity, which is what §36.2 records as the
blueprint field `strategy.competitorSameness`. The source does not state whether
Low/Medium/High is the scale of the differentiation score, of competitor sameness, or
of both. Preserved as written; recorded in §40.

The constraint is preserved at its stated strength. It is the counterweight to the
directive: high sameness raises differentiation, but not into strangeness. No
threshold separates the two.

---

## 16. Design Language Selection

Raw §4.16. "Now score the five languages."

The five are Phase 2's design languages, referenced not redefined. Per
`03-REGISTRY/design-language-registry.md`:

Rows are in the source's own listing order; the ID column is the registry's:

| ID | Canonical language (registry) | Source name in §4.16 |
|---|---|---|
| DL-01 | Editorial Luxury | Editorial Luxury |
| DL-05 | Architectural / Sophisticated | Architectural |
| DL-04 | Soft Premium / Wellness | Soft Premium |
| DL-02 | Swiss / Structured | Swiss |
| DL-03 | Bold Energetic | Bold |

**ID attachment is this document's addition**, made to bind the source's short names
to the registry entries **by name correspondence against the locked V1 register**, not
by position in the source's list. The source uses the short names only and assigns no
IDs, and its listing order is not the registry's ID order. No sixth language appears
anywhere in the Phase 4 source, and no language has been renamed: the canonical column
reproduces `design-language-registry.md` §1 exactly.

### 16.1 The scoring expression

The source gives the score "conceptually" as a sum of eight positive terms minus two
negative terms:

```
LANGUAGE SCORE =
      Industry Fit
    + Psychology Fit
    + Brand Fit
    + Asset Fit
    + Content Fit
    + Conversion Fit
    + Competitive Opportunity
    + Creative Opportunity
    - Brand Conflict
    - Usability Risk
```

**Ten named terms, no weights, no ranges, no scale.** The source labels the expression
"conceptually", so the arithmetic form is indicative rather than a formula. It does not
state the range of any term, whether terms are equally weighted, what the resulting
score's range is, or how a score becomes a selection. Recorded in §40.

**Six of the ten terms are "fit" terms**, which is the vocabulary Phase 3 §35.0
reserves for capability statements issued by Phases 1–3. Phase 4's act here is to
evaluate those fits against one business and produce a **value**. The fit knowledge
comes from Phase 2 and Phase 3; the scoring and selection are Phase 4's.

### 16.2 The example scores

| Language | ID | Score |
|---|---|---:|
| Editorial Luxury | DL-01 | 93 |
| Architectural | DL-05 | 86 |
| Soft Premium | DL-04 | 74 |
| Swiss | DL-02 | 61 |
| Bold | DL-03 | 19 |

**Non-normative.** These are one business's scores in the source's example, not
factory-held rankings. The scores are on an implied 0–100 scale that the §4.16
expression does not define — ten unbounded terms cannot be known to sum to 100.
Recorded in §40.

The ordering here produces the §4.17 selection (Editorial primary, Architectural
secondary) and the §36.3 blueprint values, so the three passages are consistent within
the example.

---

## 17. Primary + Secondary Influence

Raw §4.17. "Choose":

| Slot |
|---|
| Primary Language |
| Secondary Influence |

The source's example:

| Slot | Value |
|---|---|
| Primary | Editorial Luxury (DL-01) |
| Secondary | Architectural (DL-05) |

Then the constraint, preserved at prohibition strength:

> But the secondary language cannot override business psychology.

> This builds on the research's separation of design-language-specific rules from
> business-specific identity.

**Naming asymmetry in the source.** The slot is called "Secondary **Influence**" in
the heading and list, then "the secondary **language**" in the constraint. The
registry-canonical field name is `secondaryInfluence` (§36.2). Both source spellings
are preserved where quoted.

**What the source does not state.** Whether a secondary influence is required or
optional, how strongly it may be expressed relative to the primary, what "override"
concretely means as a detectable condition, or whether more than two languages may
combine. Recorded in §40.

**Registry note.** `parameter-registry.md` governs the design language parameters.
The two-slot primary/secondary structure is the source's contribution at the Phase 4
decision level; it selects among Phase 2 languages rather than defining a new one.

---


## 18. Creative Intensity

Raw §4.18. "Determine" a score on an explicit range:

```
1–10
```

The source states the derivation only as a list of contributing factors, with the
qualification that it is calculated **conceptually**:

| # | Input as written |
|---:|---|
| 1 | industry |
| 2 | brand |
| 3 | audience |
| 4 | assets |
| 5 | competition |
| 6 | language |
| 7 | business maturity |

The source's examples, given as ranges rather than single values:

| Business type | Creative intensity |
|---|---|
| Traditional medical practice | 4–5 |
| Premium dentist | 6–8 |
| Luxury salon | 7–9 |
| Boutique gym | 8–10 |
| Fine dining | 8–10 |

**Non-normative.** The five business types are the source's illustrations. They are
not an industry-to-intensity lookup table and do not bind Phase 4 for any business in
those categories. Per canonicalization rule 11 they are not an industry preset.

**Registry ownership.** `creativeIntensity` is a registry parameter. Per
`phase-ownership-matrix.md` line 308 it is "the strength with which the selected design
language is expressed", it is **not** bounded by Foundation's Creative Budget (Row 14),
and the **brand-maturity effect is UNDEFINED**. This document does not amend that.

**Seventh input is the undefined one.** "business maturity" is `brandMaturity`, whose
effect on this score the matrix explicitly records as undefined — and whose scale is
itself contested (§12.1). So input 7 of 7 is doubly unresolved.

**No formula.** "But calculate it conceptually from" is the whole of the derivation.
No weights, no aggregation, no rule that converts seven inputs into one integer.
Recorded in §40.

---

## 19. Creative Risk

Raw §4.19. The source's purpose here is a separation:

> Now separate **creative intensity** from **creative risk**.
>
> This is important.

The distinction is drawn by paired examples:

| Kind | Example as written |
|---|---|
| **High intensity** | Large typography |
| **High risk** | Unusual navigation |
| **High intensity** | Asymmetric layout |
| **High risk** | Hiding essential booking controls |

The conclusion, preserved as the operative statement:

> **Creative expression may be high while interaction risk stays low.**

> This will be a useful production rule.

**The two examples of "high risk" are not equivalent.** Unusual navigation is a
usability hazard; hiding essential booking controls is closer to a violation of the
Foundation requirement that primary CTAs remain accessible
(`phase-ownership-matrix.md` line 194). The source treats both as "risk" without
distinguishing hazard from prohibition. Preserved as written.

**Relationship to §33.4.** The intensity/risk split anticipates the Creative Boundary
Engine's three tiers: intensity operates in the "unlimited freedom" tier (composition,
scale, typography), while risk operates in the "limited freedom" tier (navigation,
conversion actions, interaction behaviour). The source does not draw the connection
explicitly; the alignment is noted here without asserting a rule the source lacks.

### 19.1 No registry entry

**`creativeRisk` has no Parameter Registry entry.**

The source treats it as a first-class score — §4.45 emits `creative_risk: 3` in the
blueprint — but it appears nowhere in `parameter-registry.md`. Canonical Phase 3 §36
item 35 already records the same finding: no registry entry and no stated scale.

Consequences preserved rather than resolved:

- **No declared scale.** §4.18 bounds creative intensity at 1–10 explicitly. §4.19
  bounds nothing. The blueprint value `3` is therefore on an undeclared scale.
- **No derivation.** Unlike intensity, no input list is given at all.
- **No threshold.** No statement of what risk level is acceptable, or what happens
  when risk is high.

This document does **not** add `creativeRisk` to the registry, does not assign it a
scale, and does not fold it into `creativeIntensity` or `visualTension`. It is carried
as **source-named, registry-absent** and recorded in §40 and in the cross-phase
conflict report.

---


## 20. Visual Tension

Raw §4.20. "Score" on an explicit range:

```
1–10
```

"Possible sources" of tension — nine mechanisms:

| # | Source |
|---:|---|
| 1 | Scale |
| 2 | Cropping |
| 3 | Whitespace |
| 4 | Alignment |
| 5 | Density |
| 6 | Typography |
| 7 | Contrast |
| 8 | Overlap |
| 9 | Depth |

The directive:

> The AI should choose the appropriate tension rather than randomly adding asymmetry.

**Registry-owned.** `visualTension` is a registry parameter referenced by Phase 3
§35.2, and Phase 3 §21 owns visual tension mechanisms as vocabulary. Phase 4's act is
to select a per-project value. This document does not restate the Phase 3 mechanism
definitions.

**"Possible sources" is an open list.** The nine are illustrative, not closed.

**No derivation, no mapping.** The source states no method for arriving at a tension
score and no rule connecting a score to which of the nine mechanisms to use, or how
many. The directive against randomness states an intent, not a procedure. Recorded in
§40.

---

## 21. Content Density

Raw §4.21. "Determine" a three-level value:

| Level |
|---|
| Low |
| Medium |
| High |

> This affects the overall visual rhythm.

> The research already emphasizes adapting service presentation to content volume
> rather than forcing all content into the same structure.

**Registry-owned.** `contentDensity` is a registry parameter referenced by Phase 3
§35.2. Phase 4 selects the per-project value.

**Relationship to §14 is unstated.** Content Intelligence measures nine content
dimensions and produces six richness classifications; content density is a separate
three-level value. Whether density is derived from those measurements, and how a
`Service-rich` business maps to `High` density, is not stated. Recorded in §40.

**Effect on rhythm is asserted, not specified.** "This affects the overall visual
rhythm" names a dependency without giving its direction or magnitude. §32.3 carries
the rhythm construct; the source states no density-to-rhythm rule there either.

---

## 22. Image and Typography Dominance

The source treats these as two scores in adjacent subsections. Both are on an
explicit **1–10** range, and **neither has a Parameter Registry entry** (§22.3).

### 22.1 Image Dominance

Raw §4.22. "Score" `1–10`.

The source's examples:

| Business type | Image dominance |
|---|---:|
| Luxury restaurant | 10 |
| Boutique gym | 9 |
| Premium salon | 8 |
| Dental | 6 |
| Accountant | 3 |

Followed by the adjustment directive:

> Then adjust based on actual assets.

**Non-normative.** The five business types illustrate the score's spread. They are not
an industry lookup table. Per canonicalization rule 11 they are not an industry preset.

**Two-stage derivation, neither stage specified.** The structure is: a business-type
starting point, then an asset-based adjustment. The source gives no rule for the
starting point of an unlisted business type, no adjustment magnitude, and no direction
beyond what §34.2 says qualitatively. Recorded in §40.

### 22.2 Typography Dominance

Raw §4.23. "Score" `1–10`.

The source demonstrates the score through its inverse relationship with image
dominance:

| Business condition | Typography | Image |
|---|---:|---:|
| Photography-poor business | 9 | 3 |
| Image-rich restaurant | 5 | 10 |

> This makes the design **asset-aware**.

**Not a strict inverse.** The two example pairs sum to 12 and 15, so the source does
not impose a fixed total or a mechanical trade-off. The §36.3 blueprint instance sets
both to 8, summing to 16 — confirming the two scores vary independently. No constraint
linking them has been invented.

### 22.3 No registry entries

**Neither `imageDominance` nor `typographyDominance` appears in
`parameter-registry.md`.**

Both are emitted as blueprint fields by raw §4.45 (`image_dominance: 8`,
`typography_dominance: 8`), and `image_dominance` appears a second time as a
**pattern-level** parameter inside the hero composition block (`image_dominance: 9`).

Two distinct scopes, one name:

| Scope | Raw §4.45 location | Value |
|---|---|---:|
| Project-level strategy | `strategy.image_dominance` | 8 |
| Pattern-level parameter | `composition.hero.image_dominance` | 9 |

The source does not state the relationship between the two, whether the pattern-level
value must respect the project-level one, or why they differ in the example. Phase 3
§13 owns pattern parameters as vocabulary and Phase 3 §12.2 reads project- and language-scoped
parameter names applied to patterns as **fit statements under distinct fit
identifiers** — the same collision, already recorded there.

This document carries both as **source-named, registry-absent**, does not add them to
the registry, does not assign them scales beyond the source's stated 1–10, and does not
merge them with `contentDensity` or `visualTension`. Recorded in §40 and in the
cross-phase conflict report.

---


## 23. Narrative Strategy

Raw §4.24. "Choose the business's most natural storytelling model." Eight named
models, IDs and arrow forms preserved exactly as written:

| ID | Narrative model |
|---|---|
| **N01** | Trust → Expertise → Action |
| **N02** | Atmosphere → Desire → Action |
| **N03** | Problem → Solution → Proof |
| **N04** | Transformation → Method → Proof |
| **N05** | Story → Offering → Experience |
| **N06** | Identity → Community → Action |
| **N07** | Authority → Education → Conversion |
| **N08** | Discovery → Selection → Booking |

The source's rationale:

> This is more powerful than simply asking "What sections should the website have?"

**This is a genuine Phase 4 vocabulary contribution.** Unlike §28 modes and §31
relationships, the eight narrative strategies appear nowhere in Phase 3. The `N`
prefix does not collide with any of Phase 3 §11's fourteen family prefixes. Phase 4
both defines and selects here.

**Closed set of eight.** The source presents them as an enumerated list without "such
as" or "for example", so the set is closed as written. No ninth model has been added.

**Three-stage shape.** All eight are exactly three stages. The source does not say
whether that is a constraint on the construct or a property of these eight instances.

**What the source does not state.** No rule for selecting among the eight, no mapping
from industry or psychology to a model, and no statement of whether a business may
carry more than one. The §36.3 blueprint emits
`narrative.strategy: trust-expertise-action`, a slug form of N01, without the ID —
so the source does not use its own identifiers in its own output format. Recorded in
§40.

**Relationship to chapters and sequence.** Narrative strategy sits above the Chapter
Engine (§27) and Section Ordering (§26) in the §38 pipeline. The source states no rule
deriving chapters from the chosen narrative, though the §27 example's five chapters
(first impression → expertise → proof → experience → action) are recognisably an
expansion of N01. The correspondence is noted, not asserted as a rule.

---

## 24. Primary Conversion Action

Raw §4.25. "The AI determines" three CTA tiers:

| Tier |
|---|
| Primary CTA |
| Secondary CTA |
| Utility action |

The source's three examples:

| Industry | Primary | Secondary | Utility |
|---|---|---|---|
| Dental | Book Consultation | WhatsApp | Call |
| Gym | Start Free Trial | WhatsApp | Directions |
| Restaurant | Reserve Table | View Menu | Directions |

> The research explicitly supports contextual CTA selection rather than generic contact
> patterns.

**Non-normative.** The three industry rows are examples of contextual selection, not a
per-industry CTA assignment. Per canonicalization rule 11 they are not an industry
preset.

**Foundation constraint applies.** `phase-ownership-matrix.md` line 194 records that
brand, primary links and the primary CTA MUST be accessible, and that there are seven
implementation types in a closed set. The Phase 4 act here is choosing *which action*
occupies each tier; the accessibility requirement and the implementation-type set are
Foundation's and are not restated. §19's "hiding essential booking controls" example is
the risk this constraint guards against.

**Three tiers, no cardinality rule.** The source does not state whether exactly one
action occupies each tier, whether the utility tier is optional, or what distinguishes
a secondary CTA from a utility action other than by example. WhatsApp appears as
secondary twice and Directions as utility twice, but View Menu as secondary is a
content navigation action rather than a contact channel — so the tiers are not cleanly
"contact channel by priority". Recorded in §40.

---


## 25. Section Priority Matrix

Raw §4.26. "Every possible section gets" one of five classifications:

| Level |
|---|
| Mandatory |
| High Priority |
| Conditional |
| Optional |
| Avoid |

### 25.1 Divergence from the Phase 3 scale

**Phase 3 §15.2 defines a five-level scale with different level 2 naming:**

| Phase 3 §15.2 | Phase 4 §4.26 |
|---|---|
| MANDATORY | Mandatory |
| Recommended | **High Priority** |
| Conditional | Conditional |
| Optional | Optional |
| Avoid | Avoid |

Four of five levels match. The second level is `Recommended` in Phase 3 and
`High Priority` in Phase 4 (abbreviated to `High` in the §4.26 examples). The source
does not acknowledge the difference.

**Not resolved here.** Phase 3 §15.2 records the five-level scale as Phase 3
vocabulary; this document does not rename either term or declare one authoritative.
Both spellings are preserved in their own documents. Recorded in §40 and in the
cross-phase conflict report.

Phase 3 also notes a casing distinction (`MANDATORY` fully capitalised, the rest title
case) whose meaning the source does not state. Phase 4's source uses title case
throughout.

### 25.2 The source's examples

| Industry | Section | Classification |
|---|---|---|
| **Dental** | Hero | Mandatory |
| Dental | Trust | Mandatory |
| Dental | Services | Mandatory |
| Dental | Doctor | High |
| Dental | Process | High |
| Dental | Reviews | Mandatory |
| Dental | Gallery | Conditional |
| Dental | FAQ | High |
| Dental | Location | High |
| Dental | Booking | Mandatory |
| **Restaurant** | Hero | Mandatory |
| Restaurant | Atmosphere | Mandatory |
| Restaurant | Menu | Mandatory |
| Restaurant | Story | High |
| Restaurant | Reviews | High |
| Restaurant | Gallery | High |
| Restaurant | Location | Mandatory |
| Restaurant | Reservation | Mandatory |
| Restaurant | Team | Optional |

> This respects the research's principle that premium design is defined partly by what
> it omits.

**Non-normative.** These are Phase 4 decisions shown illustratively for two businesses.
They are not industry presets and do not bind any future dental or restaurant project.
Phase 3 §15.2 marks its own overlapping dental/restaurant table the same way.

**Comparison with Phase 3's example rows.** Where both documents classify the same
industry/section pair they agree in some places and differ in others: dental Trust is
Mandatory in both and dental Gallery is Conditional in both, while Phase 3 lists dental
Team as Recommended and restaurant Reviews as Recommended against Phase 4's `High` —
which is the same level under the two different names of §25.1. Phase 3 additionally
lists "Doctor-style credentials" as Avoid for restaurants and "Huge statistics" as
Optional for dental, neither of which appears in the Phase 4 table. No contradiction is
created by preserving both sets as examples.

**No `Conditional` condition.** As in Phase 3 §15.2, the source states no condition that
resolves `Conditional`, and no mechanism for deriving a classification from an industry.
Recorded in §40.

**Section vocabulary is open.** Between the two examples the source names Hero, Trust,
Services, Doctor, Process, Reviews, Gallery, FAQ, Location, Booking, Atmosphere, Menu,
Story, Reservation and Team. It never states a closed set of possible sections, despite
"every possible section gets". Phase 3 §11 supplies fourteen pattern *families*, which
is a related but distinct taxonomy — several §4.26 section names (FAQ, Menu, Atmosphere,
Reservation) have no Phase 3 family. Recorded in §40.

---


## 26. Section Ordering Engine

Raw §4.27. "The engine creates the actual sequence from" six inputs:

```
Customer journey
    +
Business psychology
    +
Content importance
    +
Conversion
    +
Narrative
    +
Assets
```

Then the prohibition, preserved at full strength:

> Never from a default template.

**This is the sharpest anti-template statement in Phase 4** and the sequencing
counterpart to Phase 3 §31's pattern-versus-template rule. It forbids a default
ordering as the source of a sequence.

**Six inputs, no algorithm.** As with §16's language score, the source gives an additive
list without weights, precedence, or a tie-break rule. Where two inputs disagree — for
instance conversion favouring an early booking section against narrative favouring
proof first — the source states no resolution. Recorded in §40.

**Relationship to Phase 3 §15.1.** Phase 3 owns sequencing *relationships* as
vocabulary and names specific orderings (Trust before Services; Atmosphere before
Reviews) as relationships rather than applied sequences. Phase 3 §35.3 records those as
"preserved as vocabulary; the ordering *relationships* are Phase 3, the applied sequence
is Phase 4." This section is that applied sequence. The division holds without
amendment.

---

## 27. Chapter Engine

Raw §4.28. "Sections are grouped into **chapters**."

The source's five-chapter example:

| Chapter | Name | Sections |
|---|---|---|
| CHAPTER 01 | FIRST IMPRESSION | Hero · Trust |
| CHAPTER 02 | EXPERTISE | Services · Doctor · Process |
| CHAPTER 03 | PROOF | Transformation · Reviews |
| CHAPTER 04 | EXPERIENCE | Gallery · Location |
| CHAPTER 05 | ACTION | Booking · CTA |

> This lets the AI think at page level.

**Genuine Phase 4 construct.** Chapters appear nowhere in Phase 3. The grouping layer
sits between narrative strategy (§23) and section sequence (§26) in the §38 pipeline.

**Non-normative example.** The five chapters and their names are one business's grouping.
The source states no closed set of chapter names, no rule for how many chapters a page
has, no minimum or maximum sections per chapter, and no derivation from the narrative
strategy. Recorded in §40.

**Chapters are not sections.** `CTA` appears here as a section inside CHAPTER 05 and
corresponds to Phase 3 family prefix `C`. The §36.3 blueprint emits chapters as slugs
(`first-impression`, `expertise`, `proof`, `experience`, `action`) matching this
example's five names, while its `sections` list contains no separate `cta` entry — so
the example and the blueprint instance are not perfectly aligned. Preserved as written;
recorded in §40.

---


## 28. Composition Mode Selection

Raw §4.29. "Each section first chooses a mode." Ten modes:

| # | Mode as written in Phase 4 | Phase 3 mode |
|---:|---|---|
| 1 | Typographic | C01 |
| 2 | Image-dominant | C02 |
| 3 | Information-dominant | C03 |
| 4 | Narrative | C05 |
| 5 | Human | C07 |
| 6 | Atmospheric | C10 |
| 7 | Kinetic | C06 |
| 8 | Spatial | C04 |
| 9 | Proof | C09 |
| 10 | Product/service | C08 |

> Only then does it choose a specific pattern.

The source's own assessment: "This is an important improvement over the previous
version."

**These are Phase 3's modes, not new ones.** Phase 3 §9 defines composition modes
`C01`–`C10`. The Phase 4 source lists the same ten concepts in a slightly different
surface form (`Image-dominant` against Phase 3's `Image Dominant`, `Product/service`
against `Product / Service`). Phase 4's act is **selection per section**; the mode
vocabulary is Phase 3's.

**ID attachment is this document's addition**, made to bind the source's mode names to
Phase 3's identifiers **by name correspondence against Phase 3 §9's canonical
definitions**. The Phase 4 source uses no IDs. Phase 3 §9 enumerates the ten modes in a
different order from the Phase 4 source, so each identifier is attached from the mode
Phase 3 defines under that name, never from position in either list.

**Mode precedes pattern.** The ordering constraint — mode first, then pattern — is the
section-level echo of §3's principle that intent precedes selection. Phase 3 §12 records
composition mode as pattern metadata, so a pattern carries a mode; the source's ordering
means the mode is chosen as a requirement and the pattern is then found to match it.

**Prefix collision, unresolved.** Phase 3 uses `C` as both the composition-mode prefix
(`C01`–`C10`) and the CTA pattern family prefix (§11). A reference to `C01` is therefore
ambiguous between a mode and a CTA pattern. This is a Phase 3 identifier issue, not
something Phase 4 resolves; recorded in §40 for the registry's attention.

---

## 29. Pattern Selection

Raw §4.30. "The engine then evaluates" eight inputs:

```
Purpose
    +
Composition mode
    +
Language
    +
Industry
    +
Content
    +
Assets
    +
Conversion
    +
Novelty
```

> Then chooses the pattern.

### 29.1 The source's worked example

```
Services
    ↓
Typographic
    ↓
Editorial compatible
    ↓
3–8 services
    ↓
S01 Editorial Service Index
```

The chain reads: section purpose → composition mode (C01) → language compatibility
(DL-01) → content volume condition → selected pattern.

**Non-normative.** One example of the reasoning chain, not a rule that Services plus
Typographic plus Editorial always yields `S01`.

**`3–8 services` is a content condition**, and the only place in Phase 4 where a
numeric content range gates a pattern choice. §34.1 gives adjacent ranges (3, 8, 20+)
for content-to-design adaptation without reconciling the boundaries — `8` is the top of
this range and the middle case there. Recorded in §40.

### 29.2 The pattern library is empty

**No pattern is specified anywhere in the factory.** Phase 3 §14.1 records that zero
individual patterns are specified against a target of approximately 87, and that this is
the largest open item in Phase 3. Phase 4 cannot select from a library that does not
exist.

Pattern IDs referenced by the Phase 4 source:

| ID | Where in Phase 4 | Phase 3 §14.2 status |
|---|---|---|
| `S01` | §4.1 negative example, §4.30 chain, §4.45 blueprint | Illustrative; partial metadata example only |
| `H04` | §4.1 negative example, §4.45 blueprint | Illustrative; no name, no metadata |
| `T04` | §4.45 blueprint | Illustrative; no name, no metadata |

**Three distinct IDs, all already present in Phase 3's eight.** Phase 4 introduces **no
new pattern ID**. The name `Editorial Service Index` attached to `S01` in §4.30 matches
Phase 3 §14.3's record of the same association from raw §3.12.

**No pattern has been created here.** Per canonicalization rule 6, this document does not
invent pattern specifications, does not name unnamed IDs, and does not enumerate implied
siblings. The gap stands at **0 of ~87 specified**, and §40 records it as blocking for
Phase 4 execution.

### 29.3 Eight inputs, no selection rule

The source states no weighting among the eight inputs and no procedure for the case where
no pattern satisfies all of them — which, with an empty library, is every case. `Novelty`
as the eighth input is notable: it makes pattern selection depend on generation history
(§33.2), which the source elsewhere says is only used "whenever that history is
available". Selection behaviour on a first-ever generation is unstated. Recorded in §40.

---


## 30. Pattern Parameterization

Raw §4.31. "The selected pattern then receives creative values."

The source's example parameter set:

| Parameter as written | Example value |
|---|---:|
| Asymmetry | 8 |
| Image dominance | 7 |
| Whitespace | 9 |
| Overlap | 4 |
| Type scale | 9 |
| Density | 3 |

The rationale, which is the load-bearing claim of the section:

> This means two businesses using the same pattern can still look substantially
> different.

**This is where per-project variation is produced.** Pattern selection (§29) narrows to a
shared vocabulary item; parameterization is what makes two instances of the same pattern
diverge. Combined with §26's prohibition on default ordering, it is the mechanism behind
the factory's anti-template stance.

**Six named parameters, no scale declared.** The example values run 3 to 9, implying 1–10
by analogy with §18, §20 and §22, but the source never states a range for any of the six.
No bound has been asserted. Recorded in §40.

**Phase 3 owns pattern parameters as vocabulary.** Phase 3 §13 defines the parameter
concept and Phase 3 §12.2 records the reading of project- and language-scoped parameter names
applied at pattern scope as **fit statements under distinct fit identifiers**. Phase 4's
act is assigning values. This document does not restate Phase 3's parameter definitions
and does not declare which of these six are canonical registry parameters.

**Name overlaps across scopes.** Four of the six names appear elsewhere in Phase 4 at
different scopes:

| Parameter here | Also appears as |
|---|---|
| Image dominance | `strategy.imageDominance`, project scope (§22.1) |
| Density | `strategy.contentDensity`, project scope, on a Low/Medium/High scale (§21) |
| Whitespace | a visual tension source (§20) |
| Asymmetry | referenced in §20's directive against random asymmetry |

**`Density` is the sharper case:** at project scope it is a three-level ordinal
(Low/Medium/High) and here it is the numeric `3`. The source does not state whether these
are the same parameter on two scales or two different quantities sharing a name. No
reconciliation has been invented. Recorded in §40.

**No derivation.** The source states no rule connecting project-level strategy values to
pattern-level parameter values. The §36.3 instance has `strategy.imageDominance: 8` and
`composition.hero.imageDominance: 9`, which shows they can differ, but not by what rule.

---

## 31. Section Relationship Engine

Raw §4.32. "For every adjacent pair" the engine assigns one of seven relationships:

| # | Relationship |
|---:|---|
| 1 | Continue |
| 2 | Contrast |
| 3 | Escalate |
| 4 | Decompress |
| 5 | Reveal |
| 6 | Reframe |
| 7 | Conclude |

The source's example:

```
Hero
    ↓ Decompress
Trust

Trust
    ↓ Escalate
Signature Service

Service
    ↓ Decompress
Doctor Story
```

> This gives us page-level pacing.

**These are Phase 3's transition types.** Phase 3 §16 defines the same seven section
transitions as vocabulary. Phase 4's act is **assigning one per adjacent pair** for a
specific page. The construct is not redefined here.

**Per-adjacent-pair scope.** "For every adjacent pair" makes this exhaustive over the
section sequence: an *n*-section page carries *n*−1 relationships. That is a stronger
statement than Phase 3 makes, since Phase 3 supplies the types without saying every
adjacency must be typed. Preserved as written.

**Inconsistency in the example.** The second pair ends at `Signature Service` and the
third begins at `Service`. Read as a chain these should be the same section under one
name. The source does not comment. Preserved verbatim rather than silently normalised;
recorded in §40.

**No IDs.** Phase 3 assigns no identifiers to the seven transitions and neither does
Phase 4, so unlike §28 there is no ID mapping to attach. The names are the identifiers.

**Not in the blueprint.** Raw §4.45 emits `rhythm` and `anchors` but **no** field for
section relationships, despite §4.32 being an explicit engine stage in the §38 pipeline.
The pacing decisions have nowhere to be recorded in the stated output format. Recorded in
§40 as a blueprint field gap.

---


## 32. Anchors, Quiet Zones and Rhythm

Three adjacent source subsections that together produce page-level pacing. All three are
Phase 3 constructs applied per project.

### 32.1 Visual Anchor Distribution

Raw §4.33. "Select approximately **3–5 major anchors**."

The source's examples of what can serve as an anchor:

| Anchor example |
|---|
| Hero image |
| Doctor portrait |
| Signature service |
| Transformation image |
| Final CTA |

> Then distribute them throughout the page.

**`3–5` is a stated count**, softened by "approximately". It is the only cardinality
figure the source gives for any Phase 4 construct. Preserved with its qualifier intact —
not hardened into a rule.

**Phase 3 §19 owns visual anchors.** Phase 4 selects which content items become anchors
and where they sit. The distribution rule itself ("throughout the page") is not
quantified: no minimum spacing, no per-chapter allocation. Recorded in §40.

The §36.3 blueprint emits four anchors (`hero`, `doctor`, `transformation`, `booking`),
consistent with the 3–5 range. Note it uses `booking` where this example says
`Final CTA`.

### 32.2 Quiet Zone Distribution

Raw §4.34. "The AI deliberately inserts low-intensity moments":

| Quiet zone form |
|---|
| small statement |
| single image |
| whitespace |
| microcopy |

The rationale:

> This is essential to prevent every section from competing.

**"Essential" is the strongest word the source uses here**, but no count, placement rule,
or minimum frequency is given. Phase 3 §20 owns quiet zones as vocabulary.

**Deliberate is the operative word.** Quiet zones are inserted as a decision, not left
over as gaps between anchors. The source does not state a relationship between anchor
count and quiet zone count, though the anti-competition rationale implies alternation.
No rule has been asserted.

### 32.3 Visual Rhythm Profile

Raw §4.35. "The engine generates a page rhythm":

```
quiet
    → impact
    → information
    → human
    → cinematic
    → quiet
    → action
```

> Different design languages get different preferred rhythms.

> This becomes one of the strongest creative distinctions between websites.

**Seven positions in the example**, with `quiet` appearing twice — so a rhythm profile is
a sequence over a state vocabulary, not a permutation of distinct states. The seven
positions carry six distinct values (`quiet`, `impact`, `information`, `human`,
`cinematic`, `action`).

**Phase 3 §17 owns visual rhythm.** Phase 4 generates the per-project sequence.

**Language-to-rhythm mapping is claimed, not supplied.** "Different design languages get
different preferred rhythms" asserts a dependency on DL-01…DL-05 without giving a single
mapping. Neither Phase 2 nor Phase 3 supplies it either. Recorded in §40.

**Relationship to modes.** Three of the six rhythm values (`information`, `human`,
`cinematic`) resemble composition modes C03, C07 and C10, but the vocabularies are not the
same and the source does not equate them. No mapping is asserted. `quiet` corresponds to
§32.2's quiet zones, which the source also leaves implicit.

The §36.3 blueprint emits exactly this seven-position sequence, so the example and the
instance agree.

---


## 33. Creative Governance

Raw §4.36–§4.39 form a governance cluster: four mechanisms that constrain the creative
decisions made in §16–§32. They are grouped here because they share a subject — limits on
creative freedom — while the source presents them as consecutive independent subsections.

### 33.1 Pattern Repetition Budget

Raw §4.36. "The engine should detect" six repetition signals:

| # | Repetition signal |
|---:|---|
| 1 | Same grid |
| 2 | Same card style |
| 3 | Same alignment |
| 4 | Same image ratio |
| 5 | Same CTA treatment |
| 6 | Same animation |

> and limit repetition.

The source's example budget:

| Constraint as written |
|---|
| Major Bento usage ≤ 2 |
| Major marquee usage ≤ 1 |
| Same card treatment ≤ 2 |
| Same hero pattern = 1 |

Then the qualification, which governs how the four numbers are read:

> These are guidance constraints, not absolute laws.

**The numbers are guidance.** The source explicitly declines to make them binding, so
they are preserved as illustrative budget values and **not** stated as factory limits.
This is the clearest case in Phase 4 of the source pre-empting its own numbers.

**`Bento` and `marquee` are pattern kinds not otherwise defined in Phase 4.** Neither
appears in Phase 3's fourteen families or its eight illustrative pattern IDs. They are
preserved as source vocabulary without being promoted to identifiers. Recorded in §40.

**"Major" is unquantified.** Three of the four constraints qualify usage as "major"
without stating what makes an instance major rather than incidental. No threshold has
been invented.

**Relationship to Foundation's Creative Budget.** `phase-ownership-matrix.md` Row 14
records a Foundation-owned Creative Budget that explicitly does **not** bound
`creativeIntensity`. Whether this repetition budget is that budget, a Phase 4 instance of
it, or an unrelated construct sharing the word is not stated by either document.
Recorded in §40.

### 33.2 Novelty Engine

Raw §4.37. The engine compares the current blueprint against history:

> The system should compare the current blueprint against previous generated blueprints
> whenever that history is available.

Seven novelty dimensions to evaluate:

| # | Novelty dimension |
|---:|---|
| 1 | Hero novelty |
| 2 | Sequence novelty |
| 3 | Grid novelty |
| 4 | Typography novelty |
| 5 | Image treatment novelty |
| 6 | CTA novelty |
| 7 | Rhythm novelty |

Result is one of three levels:

| Level |
|---|
| LOW |
| MEDIUM |
| HIGH |

And the consequence, preserved at full strength:

> If LOW:
>
> **Recompose.**
>
> Not:
>
> "Change the colors."

The source's own assessment: "This is probably one of the most valuable pieces of the
entire factory."

**The prohibition is the substance.** A LOW novelty result requires **recomposition** —
a different composition — and explicitly forbids satisfying the check with a surface
change such as recolouring. That is a genuine prohibition and is carried at full strength.

**Conditional on history.** "Whenever that history is available" makes the whole mechanism
inapplicable to a first generation, and the source states no fallback. This interacts with
§29's use of `Novelty` as the eighth pattern-selection input, which has the same gap.

**Cross-phase boundary — evaluation belongs to Phase 6.** Per
`phase-ownership-matrix.md`:

| Matrix row | Assignment |
|---|---|
| Row 43 | Novelty **evaluation and threshold** → Phase 6 |
| Row 29 | The novelty **requirement** → Phase 2 |

So the source places in Phase 4 a mechanism the matrix splits between Phase 2 (the
requirement) and Phase 6 (the evaluation and threshold). The content is preserved here
because it is in the Phase 4 source, and the boundary is recorded in §39.3 — **ownership is
not reassigned by this document**.

The blueprint field `novelty.score` (§36.2) records the result, and the ninth Creative
Quality Gate question (§37) asks it again in prose.

---


### 33.3 Category-vs-Creativity Balance

Raw §4.38. "Now introduce two separate scores":

| Score |
|---|
| CATEGORY FAMILIARITY |
| CREATIVE DIFFERENTIATION |

The source's examples:

| Business | Familiarity | Creativity |
|---|---:|---:|
| Dental | 8 | 7 |
| Luxury restaurant | 5 | 9 |

> This ensures the website remains understandable while still distinctive.

**Two independent axes, not a trade-off.** The dental example sums to 15 and the
restaurant to 14, so the source does not impose a fixed total. High familiarity and high
creativity can coexist — which is the point of separating them, and the same structural
move as §19's intensity/risk split.

**Naming drift.** The scores are introduced as `CATEGORY FAMILIARITY` and
`CREATIVE DIFFERENTIATION`, then labelled `Familiarity` and `Creativity` in the examples.
`Creativity` is not obviously the same quantity as `CREATIVE DIFFERENTIATION`. Both forms
are preserved; recorded in §40.

**No scale, no derivation, no threshold.** Values 5–9 imply 1–10 without the source saying
so. Neither score has a stated derivation, and neither appears as a blueprint field in
§4.45 — so like §31's relationships, these decisions have no recorded output slot.
Recorded in §40.

**Overlap with §15.2.** `CREATIVE DIFFERENTIATION` here and the "Competitive
Differentiation Score" of §4.15 (Low/Medium/High) appear to be the same quantity on two
different scales. The source does not reconcile them. Recorded in §40.

### 33.4 Creative Boundary Engine

Raw §4.39. Three tiers of creative freedom. **This is the most important governance
statement in Phase 4** and is preserved at full strength.

**Unlimited freedom within:**

| # | Domain |
|---:|---|
| 1 | composition |
| 2 | scale |
| 3 | spacing |
| 4 | alignment |
| 5 | imagery |
| 6 | cropping |
| 7 | typography |
| 8 | rhythm |
| 9 | layering |
| 10 | visual hierarchy |

**Limited freedom within:**

| # | Domain |
|---:|---|
| 1 | navigation |
| 2 | conversion actions |
| 3 | forms |
| 4 | accessibility |
| 5 | readability |
| 6 | interaction behavior |

**No freedom within:**

| # | Domain |
|---:|---|
| 1 | business facts |
| 2 | credentials |
| 3 | reviews |
| 4 | ratings |
| 5 | legal information |
| 6 | critical contact information |

The source's assessment: "That is an excellent separation between creativity and
responsibility."

**The third tier is absolute.** No creative latitude exists over any of those six
categories. This is §5's truth rule expressed as an enumerated domain list, and it is the
mechanism by which the truth rule reaches actual design decisions.

**The three tiers map onto the rest of Phase 4:**

| Tier | Governed by |
|---|---|
| Unlimited | `creativeIntensity` (§18), `visualTension` (§20), dominance scores (§22), pattern parameters (§30) |
| Limited | `creativeRisk` (§19), conversion actions (§24) |
| No freedom | Business Truth Layer (§5), `checks.truth` (§36.2) |

**"Limited" is undefined.** The middle tier names six domains without stating what limit
applies to any of them. Accessibility and readability are Foundation-owned and carry
Foundation requirements, so "limited freedom" there means Foundation's constraints bind —
but the source does not say this, and the other four domains have no stated limit at all.
Recorded in §40.

**Not restated from Foundation.** Accessibility, readability and navigation requirements
belong to Phase 1 and the Control Plane. This section records that Phase 4 creativity is
subordinate to them; it does not reproduce them.

---


## 34. Adaptation Rules

Raw §4.40–§4.42 give three parallel adaptation rules: design adapts to content, to
assets, and to the competitive landscape. They are grouped here because they share a
form — an observed input condition and a design response.

### 34.1 Content-to-Design Adaptation

Raw §4.40. The source's examples:

| Content condition | Design response |
|---|---|
| 3 services | large editorial treatment |
| 8 services | structured visual index |
| 20+ services | categorized navigation/accordion |
| 2 team members | expert spotlight |
| 6 team members | profile system |
| 20 team members | searchable directory |

> This is content-aware design rather than template-aware design.

**Non-normative.** Six illustrative pairs, not a lookup table. The source gives point
values (3, 8, 20+, 2, 6, 20) rather than ranges, so the behaviour between the stated
points is undefined — 5 services and 12 team members fall in gaps. No interpolation rule
has been invented. Recorded in §40.

**Boundary conflict with §29.1.** The pattern selection example gates `S01` on
`3–8 services`, treating 3 through 8 as one band. Here 3 and 8 produce *different*
treatments (large editorial versus structured visual index). The two passages do not
agree on whether 3 and 8 are equivalent. Preserved as written; recorded in §40.

**The design responses are not pattern IDs.** `large editorial treatment`,
`structured visual index`, `expert spotlight`, `profile system`,
`searchable directory` and `categorized navigation/accordion` are descriptions, not
identifiers. `structured visual index` resembles `S01 Editorial Service Index` (§29.1)
without being the same string. No ID has been assigned to any of them. Recorded in §40.

### 34.2 Asset-to-Design Adaptation

Raw §4.41. Two conditions with three responses each:

**Excellent imagery:**

| Response |
|---|
| increase image dominance |
| increase immersive patterns |
| increase cinematic possibilities |

**Poor imagery:**

| Response |
|---|
| increase typography |
| increase structure |
| reduce image real estate |

> The research explicitly supports this type of adaptation.

**Direction only, no magnitude.** Every response is a direction of change (increase,
reduce) with no amount, and the two conditions ("excellent", "poor") have no threshold
against §13.2's 0–10 capability scores. The adaptation is directionally clear and
quantitatively unspecified. Recorded in §40.

**This is the mechanism behind §22's "then adjust based on actual assets"** and the
source of the asset-awareness claim in §22.2. The §22.2 examples (typography 9 / image 3
for a photography-poor business) are this rule applied.

**`immersive patterns` and `cinematic possibilities`** are pattern qualities not defined
in Phase 3 or Phase 4. `cinematic` also appears as a rhythm value in §32.3. No identifier
has been assigned.

### 34.3 Competitor-to-Design Adaptation

Raw §4.42. The competitor baseline (the same six items as §15.1):

| If competitors all look like |
|---|
| white background |
| blue buttons |
| 3 cards |
| doctor portrait |
| reviews |
| contact form |

Then Blogspage "can intentionally choose":

| Differentiated response |
|---|
| Editorial |
| asymmetric hero |
| typographic services |
| large doctor story |
| review spotlight |
| cinematic CTA |

With the bounding condition:

> while still preserving dental trust expectations.

> That gives the business **category differentiation**.

**Non-normative and industry-specific.** This is one dental example paired item-for-item
against a dental competitor baseline. It is not a rule that a white-and-blue competitive
landscape yields these six choices. Per canonicalization rule 11 it is not an industry
preset.

**The bounding clause is the substance.** Differentiation is exercised "while still
preserving dental trust expectations" — the same constraint as §15.1's "without damaging
category expectations" and §33.3's familiarity score. Three passages state the same
tension; none quantifies it.

**`Editorial` here is DL-01**, consistent with §16's example scoring. The remaining five
responses are composition and treatment descriptions, not pattern IDs.

---


## 35. Design Confidence and Uncertainty

Raw §4.43–§4.44. Two subsections that together give Phase 4 its self-assessment
behaviour: report how confident the decisions are, and become conservative when evidence
is thin.

### 35.1 Design Confidence Score

Raw §4.43. "The engine should also report":

```
Design confidence: 0–100
```

The source's example, four sub-scores plus an overall:

| Confidence dimension | Example |
|---|---:|
| Language confidence | 94 |
| Asset confidence | 88 |
| Content confidence | 91 |
| Conversion confidence | 97 |
| **Overall** | **92** |

The rationale, which is the operative statement:

> If research is weak, the AI should become more conservative rather than pretending it
> knows everything.

**Explicit 0–100 range.** This is the only Phase 4 score with a declared 0–100 scale;
§16's language scores use 0–100 implicitly without declaring it.

**The overall score is not derivable from the four sub-scores.** Their arithmetic mean is
92.5, and the stated overall is `92`. So the aggregation is neither a plain mean nor
obviously a weighted one, and the source states no formula. Preserved exactly as written —
no aggregation rule has been invented and the arithmetic discrepancy is not silently
corrected. Recorded in §40.

**Four sub-scores against more decision domains.** Language, asset, content and
conversion have confidence scores; brand, competitive, narrative and composition decisions
do not. The source does not say whether the four are exhaustive. Recorded in §40.

**No threshold.** "Become more conservative" has no trigger value and no defined meaning
in terms of any other Phase 4 parameter. Whether confidence 70 should reduce
`creativeIntensity`, narrow pattern choice, or something else is unstated. Recorded in
§40.

**Not a blueprint field.** §4.45 emits no confidence field despite §4.43 saying the engine
"should also report" it. Recorded in §40 as a blueprint field gap.

### 35.2 Uncertainty Handling

Raw §4.44. The source calls this "another improvement".

> The engine should know when it **doesn't have enough evidence**.

Examples of uncertain or unknown inputs:

| Input | State |
|---|---|
| Photography quality | uncertain |
| Brand positioning | uncertain |
| Price positioning | unknown |

The consequent constraint:

> Then the AI should avoid overcommitting to highly photography-dependent or highly
> brand-specific design decisions.

**Two states, three classes.** The examples use `uncertain` and `unknown` as if distinct,
while §5's Business Truth Layer defines `VERIFIED`, `INFERRED` and `UNKNOWN`. `uncertain`
maps to no truth-layer class — it may correspond to `INFERRED`, or to a low-confidence
`VERIFIED`, or be a fourth state. The source does not say. No mapping has been asserted;
recorded in §40.

**The constraint is directional and unquantified**, in the same shape as §34.2:
"avoid overcommitting" without a threshold for what constitutes overcommitment. It does,
however, connect uncertainty to two specific decision families — image dominance (§22.1)
and brand-derived choices (§11, §12) — which is more specific than §35.1's general
"become more conservative".

**Together §35.1 and §35.2 are Phase 4's honesty mechanism**: the confidence score reports
what the engine does not know, and uncertainty handling constrains what it may decide as a
result. Both are advisory in the source and are preserved at that strength.

---


## 36. Design Blueprint

Raw §4.45 gives the Phase 4 output as a single worked YAML instance for a fictional dental
clinic. That instance is the **only** statement of blueprint structure in the source: there
is no field list, no schema, no type declaration, and no required/optional marking anywhere
in Phase 4.

This section therefore separates two things the source conflates:

| §36.2 — Field Contract | §36.3 — Illustrative Instance |
|---|---|
| Business-neutral. Field **names** and provenance only. | The source's dental example, verbatim. |
| Normative as to which fields exist. | **Non-normative.** No value binds any project. |

> **Illustrative Example ≠ Normative Blueprint Contract.**
> Nothing in §36.3 is a factory default, an industry preset, or a required value. The only
> content carried forward from it into §36.2 is the set of field **names**.

### 36.1 What the source does not specify

Stated plainly, because it determines how §36.2 must be read:

| Absent | Consequence |
|---|---|
| Field types | No field below is typed. `creativeIntensity: 8` shows an integer in one example only. |
| Required vs optional | Every field's obligation is unstated. |
| Enumerations | `mode`, `narrative.strategy`, `rhythm` values are unconstrained sets. |
| Value ranges | Carried only where §18–§22 declare them; never restated here. |
| Nesting rules | Whether `composition.<section>` keys must match `sections` entries is unstated. |
| Schema format | No JSON Schema, no YAML schema, no validation artifact. |

**No schema has been created here.** Per canonicalization rule 6 this document does not
author a schema, does not assign types, does not mark fields required, and does not
enumerate permitted values. §36.2 is a field inventory with provenance, not a contract that
a validator could consume.

---


### 36.2 Design Blueprint Field Contract

Field names in registry-canonical `camelCase` (§36.4 carries the mapping from the source's
`snake_case`). **Provenance** states where the field name comes from:

- **source** — named by raw §4.45.
- **contract** — required of the artifact by `02-CONTROL-PLANE/artifact-contracts.md` §5.5
  or `human-approval.md` §5.1, without a §4.45 field name.

#### business

| Field | Provenance |
|---|---|
| `business.name` | source |
| `business.industry` | source |
| `business.location` | source |

#### truth

| Field | Provenance |
|---|---|
| `truth.verifiedClaims` | source |
| `truth.inferredTraits` | source |
| `truth.unknowns` | source |

The three keys correspond exactly to §5's VERIFIED / INFERRED / UNKNOWN classes. The
source's list-valued placeholders `[...]` state that these are collections without stating
element type or shape.

#### strategy

| Field | Provenance | Scale where declared |
|---|---|---|
| `strategy.designIntent` | source | prose (§10 template) |
| `strategy.primaryLanguage` | source | DL-01…DL-05 (§16) |
| `strategy.secondaryInfluence` | source | DL-01…DL-05 (§17) |
| `strategy.creativeIntensity` | source | 1–10 (§18) |
| `strategy.creativeRisk` | source | **none declared** (§19.1) |
| `strategy.visualTension` | source | 1–10 (§20) |
| `strategy.imageDominance` | source | 1–10 (§22.1) |
| `strategy.typographyDominance` | source | 1–10 (§22.2) |
| `strategy.contentDensity` | source | Low / Medium / High (§21) |
| `strategy.brandMaturity` | source | **contested** (§12.1) |
| `strategy.competitorSameness` | source | **none declared** (§15.2) |

Four of these eleven have **no Parameter Registry entry**: `creativeRisk`,
`imageDominance`, `typographyDominance` and `competitorSameness`. See §19.1, §22.3 and
§15.2. They are carried as source-named, registry-absent, and no scale or range has been
supplied for any of them here.

#### narrative

| Field | Provenance |
|---|---|
| `narrative.strategy` | source |
| `narrative.chapters` | source |

`narrative.strategy` is emitted as a slug, not as an `N01`–`N08` ID (§23).

#### sections

| Field | Provenance |
|---|---|
| `sections` | source |

An ordered list. The order is the §26 sequencing decision; the source does not state that
the list order is significant, though §26 and §31 only make sense if it is.

#### composition

| Field | Provenance |
|---|---|
| `composition.<section>.mode` | source |
| `composition.<section>.pattern` | source |
| `composition.<section>.<patternParameter>` | source |

`<section>` is a key drawn from the `sections` list. `<patternParameter>` is any §30
parameter; the source's instance uses `asymmetry`, `imageDominance` and `whitespace` on one
section only. Which parameters are permitted, and whether they may differ per pattern, is
unstated (§30, §36.1).

#### pacing

| Field | Provenance |
|---|---|
| `rhythm` | source |
| `anchors` | source |

Both are lists at document root, not nested under `composition`. **No field exists for
section relationships** (§31) despite §4.32 being a pipeline stage.

#### novelty and checks

| Field | Provenance |
|---|---|
| `novelty.score` | source |
| `checks.truth` | source |
| `checks.conversion` | source |
| `checks.usability` | source |
| `checks.accessibility` | source |

Four checks only. The Creative Quality Gate (§37) asks **nine** questions; six of them —
brand, customer, content, assets, creativity, restraint — have no corresponding `checks`
field, and `usability` has no gate question. The two lists do not correspond. Recorded in
§40.

#### contract-derived content

`artifact-contracts.md` §5.5 and `human-approval.md` §5.1 require content of the Design
Blueprint that raw §4.45 does not name a field for. Recorded here by requirement, **not**
invented as field names:

| Required content | Source of requirement |
|---|---|
| Imagery strategy tied to approved assets | artifact-contracts §5.5 |
| Content mapping to verified facts | artifact-contracts §5.5 |
| Accessibility expectations | artifact-contracts §5.5 |
| SEO expectations | artifact-contracts §5.5 |
| Stated constraints and limitations | artifact-contracts §5.5 |
| Resolved registry versions | artifact-contracts §5.5 |
| Debatable decisions surfaced for approval | human-approval §5.1 |

**No field names have been minted for these.** Where the Control Plane requires content the
source has no field for, that mismatch is the finding. `checks.accessibility` is the only
partial overlap, and it is a pass/pending flag rather than an expectations statement.
Recorded in §40.

---


### 36.3 Illustrative instance (non-normative)

> **NON-NORMATIVE · ILLUSTRATIVE PHASE 4 INSTANCE**
>
> Reproduced from raw §4.45 for a fictional business. Every value is an example. This is
> **not** a dental preset, **not** a default, and **not** a template. Field names appear in
> the source's original `snake_case`; §36.4 maps them to canonical form.

The source introduces this with: "The output should now be richer:".

```yaml
business:
  name: "Example Dental"
  industry: dental
  location: "Hyderabad"

truth:
  verified_claims: [...]
  inferred_traits: [...]
  unknowns: [...]

strategy:
  design_intent: >
    Reassure patients and establish specialist authority
    while making consultation booking effortless.
  primary_language: editorial
  secondary_language: architectural
  creative_intensity: 8
  creative_risk: 3
  visual_tension: 7
  image_dominance: 8
  typography_dominance: 8
  content_density: medium
  brand_maturity: 3
  competitor_sameness: high

narrative:
  strategy: trust-expertise-action
  chapters:
    - first-impression
    - expertise
    - proof
    - experience
    - action

sections:
  - hero
  - trust
  - signature-services
  - doctor-story
  - transformation
  - reviews
  - location
  - booking

composition:
  hero:
    mode: image-dominant
    pattern: H04
    asymmetry: 8
    image_dominance: 9
    whitespace: 8
  trust:
    mode: proof
    pattern: T04
  services:
    mode: typographic
    pattern: S01

rhythm:
  - quiet
  - impact
  - information
  - human
  - cinematic
  - quiet
  - action

anchors:
  - hero
  - doctor
  - transformation
  - booking

novelty:
  score: high

checks:
  truth: passed
  conversion: passed
  usability: passed
  accessibility: pending
```

**Internal inconsistencies in the instance, preserved not corrected:**

| Observation | Detail |
|---|---|
| `composition` keys do not match `sections` | `services` has a composition block but `sections` lists `signature-services`. |
| Only 3 of 8 sections are composed | `doctor-story`, `transformation`, `reviews`, `location` and `booking` have no composition block. The instance is partial and does not say so. |
| `anchors` do not match `sections` | `doctor` is an anchor; the section is `doctor-story`. |
| `secondary_language` vs §4.17 | §4.17 names the slot "Secondary Influence"; the field is `secondary_language`. A rename, not a case change (§36.4). |
| `brand_maturity: 3` | On the source's 4-level scale (§12), not the registry's 3-value scale. |
| `creative_risk: 3` | On no declared scale (§19.1). |
| `accessibility: pending` | A blueprint shown with an unresolved accessibility check. Whether `pending` permits approval is unstated. |
| Two `image_dominance` scopes | `strategy.image_dominance: 8` and `composition.hero.image_dominance: 9` (§22.3). |
| `narrative.strategy` is a slug | Not `N01` (§23). |
| No `cta` section | Despite §27's CHAPTER 05 containing a `CTA` section. |
| No section-relationship field | §31's per-adjacent-pair decisions have no slot. |
| No confidence field | §35.1's scores have no slot. |

**These are recorded as source properties, not repaired.** Correcting them would require
inventing values or renaming source fields, both of which canonicalization rule 6 forbids.

### 36.4 snake_case → camelCase mapping

Per `parameter-registry.md` decision 15, `camelCase` is canonical and `snake_case` is a
legacy variant. The source blueprint is entirely `snake_case`:

| Source (§4.45) | Canonical | Note |
|---|---|---|
| `verified_claims` | `verifiedClaims` | case only |
| `inferred_traits` | `inferredTraits` | case only |
| `design_intent` | `designIntent` | case only |
| `primary_language` | `primaryLanguage` | case only |
| `secondary_language` | `secondaryInfluence` | **rename**, not case only |
| `creative_intensity` | `creativeIntensity` | case only |
| `creative_risk` | `creativeRisk` | case only; registry-absent |
| `visual_tension` | `visualTension` | case only |
| `image_dominance` | `imageDominance` | case only; registry-absent |
| `typography_dominance` | `typographyDominance` | case only; registry-absent |
| `content_density` | `contentDensity` | case only |
| `brand_maturity` | `brandMaturity` | case only; scale contested |
| `competitor_sameness` | `competitorSameness` | case only |

**`secondary_language` → `secondaryInfluence` is the one substantive change.** It aligns the
field with §4.17's own heading ("Secondary Influence") rather than with its own blueprint
spelling, on the grounds that the source uses both terms for the same slot. This is flagged
explicitly rather than performed silently, and is the only rename in the table.

Fields with no underscore (`name`, `industry`, `location`, `unknowns`, `strategy`,
`chapters`, `sections`, `composition`, `mode`, `pattern`, `asymmetry`, `whitespace`,
`rhythm`, `anchors`, `novelty`, `score`, `checks`, `truth`, `conversion`, `usability`,
`accessibility`) are already canonical.

---


## 37. Creative Quality Gate

Raw §4.47. This is the second of Phase 4's two MUST statements:

> Before the blueprint is approved, the AI **must** answer:

Nine questions, preserved verbatim:

| # | Domain | Question as written |
|---:|---|---|
| 1 | **Business** | Does this actually fit the business? |
| 2 | **Brand** | Does this feel like this company? |
| 3 | **Customer** | Will the intended customer feel the right emotion? |
| 4 | **Conversion** | Is the desired action obvious? |
| 5 | **Content** | Does the design fit the content we actually possess? |
| 6 | **Assets** | Does the visual strategy fit the actual photography/media? |
| 7 | **Creativity** | Is the design distinctive enough? |
| 8 | **Restraint** | Have we avoided creativity that doesn't serve a purpose? |
| 9 | **Novelty** | Does this feel like a new composition rather than a previous template? |

**The obligation is to answer, not to pass.** The source says the AI "must answer" the nine
questions. It does not state that all nine must be answered affirmatively, does not define
a pass condition, and does not say what happens on a negative answer. Preserved at exactly
that strength — no pass/fail semantics have been invented. Recorded in §40.

**Questions 7 and 8 are a deliberate pair.** Creativity asks whether the design is
distinctive enough; Restraint asks whether creativity was spent without purpose. Together
they are the gate-level form of §33.3's two-axis balance and the source's recurring
insistence that novelty is not decoration.

**Each question traces to an earlier section:**

| Gate question | Grounded in |
|---|---|
| Business | §5 truth layer, §6 business DNA |
| Brand | §11 personality, §12 maturity |
| Customer | §7 psychology, §10 `feel` slot |
| Conversion | §24 conversion actions, §10 `take` slot |
| Content | §14 content intelligence, §34.1 |
| Assets | §13 asset capability, §34.2 |
| Creativity | §15.2, §33.3 |
| Restraint | §19 risk, §33.1 repetition budget |
| Novelty | §33.2 novelty engine |

**§10's `believe` slot has no gate question**, and `usability` — which *is* a blueprint
check field — has no gate question either. The nine questions and the four `checks` fields
of §36.2 are two different lists that do not correspond.

### 37.1 Overlap with Control Plane Blueprint Validation

**`02-CONTROL-PLANE/quality-gates.md` §5 defines a Blueprint Validation gate over the same
artifact at the same pipeline position.** The Control Plane gate is materially stronger: it
states explicit fail conditions (any unverified factual claim) and explicit routing
(`RETURN_TO_RESEARCH` when the blueprint conflicts with business truth). The Phase 4 source
gate states nine questions and no consequence.

Two gates, one artifact, one position:

| | Phase 4 §4.47 | Control Plane quality-gates §5 |
|---|---|---|
| Form | nine open questions | fail conditions plus routing |
| Consequence | unstated | defined |
| Who runs it | "the AI" | Control Plane |

**Boundary recorded, ownership not reassigned.** The content is preserved here because it is
in the Phase 4 source. Whether §4.47 is a Phase 4 self-check preceding the Control Plane
gate, or a duplicate of it, is unresolved by both documents. See §39.3 and §40.

**Human approval is separate again.** `human-approval.md` §5.1 requires the blueprint to
surface debatable decisions for human review. That is a third checkpoint over the same
artifact, and §36.2 records it as contract-derived content with no source field.

---


## 38. Decision Pipeline and the Ultimate Rule

### 38.1 Phase 4 Final Decision Pipeline

Raw §4.46. "This is now the complete engine":

```
BUSINESS RESEARCH
    ▼
TRUTH & EVIDENCE
    ▼
BUSINESS DNA
    ▼
CUSTOMER PSYCHOLOGY
    ▼
VALUE PROPOSITION
    ▼
BRAND PERSONALITY
    ▼
ASSET CAPABILITY
    ▼
CONTENT CAPABILITY
    ▼
COMPETITIVE LANDSCAPE
    ▼
CREATIVE NORTH STAR
    ▼
LANGUAGE SCORING
    ▼
PRIMARY + SECONDARY
    ▼
CREATIVE INTENSITY / RISK
    ▼
IMAGE / TYPE / DENSITY
    ▼
NARRATIVE STRATEGY
    ▼
SECTION PRIORITIZATION
    ▼
CHAPTER STRUCTURE
    ▼
SECTION SEQUENCE
    ▼
COMPOSITION MODE
    ▼
PATTERN SELECTION
    ▼
PATTERN PARAMETERS
    ▼
SECTION RHYTHM
    ▼
VISUAL ANCHORS
    ▼
QUIET ZONES
    ▼
NOVELTY CHECK
    ▼
CREATIVE QUALITY GATE
    ▼
DESIGN BLUEPRINT
```

**Twenty-seven stages.** The first is upstream of Phase 4 and the last is the artifact, so
twenty-five are Phase 4 work.

Stage-to-section mapping:

| Pipeline stage | This document |
|---|---|
| BUSINESS RESEARCH | upstream, §4 |
| TRUTH & EVIDENCE | §5 |
| BUSINESS DNA | §6 |
| CUSTOMER PSYCHOLOGY | §7 |
| VALUE PROPOSITION | §8 |
| BRAND PERSONALITY | §11 |
| ASSET CAPABILITY | §13 |
| CONTENT CAPABILITY | §14 |
| COMPETITIVE LANDSCAPE | §15 |
| CREATIVE NORTH STAR | §10 |
| LANGUAGE SCORING | §16 |
| PRIMARY + SECONDARY | §17 |
| CREATIVE INTENSITY / RISK | §18, §19 |
| IMAGE / TYPE / DENSITY | §21, §22 |
| NARRATIVE STRATEGY | §23 |
| SECTION PRIORITIZATION | §25 |
| CHAPTER STRUCTURE | §27 |
| SECTION SEQUENCE | §26 |
| COMPOSITION MODE | §28 |
| PATTERN SELECTION | §29 |
| PATTERN PARAMETERS | §30 |
| SECTION RHYTHM | §32.3 |
| VISUAL ANCHORS | §32.1 |
| QUIET ZONES | §32.2 |
| NOVELTY CHECK | §33.2 |
| CREATIVE QUALITY GATE | §37 |
| DESIGN BLUEPRINT | §36 |

**Eight subsections have no pipeline stage:** §9 positioning statement, §12 brand maturity,
§20 visual tension, §31 section relationships, §33.1 repetition budget, §33.3
category-vs-creativity balance, §33.4 creative boundary engine, and §35 confidence and
uncertainty. Notably §31 and §35 also have no blueprint field (§36.3), so three separate
statements of Phase 4's structure — subsections, pipeline, output — do not agree on what
Phase 4 does. Recorded in §40.

**Ordering differences from the subsection order.** The pipeline puts CREATIVE NORTH STAR
after the capability assessments, while raw §4.8 places it before them. It also puts
CHAPTER STRUCTURE before SECTION SEQUENCE, reversing §4.27/§4.28. Both orderings are
preserved as written in their own sections; the pipeline is the source's own summary and is
reproduced exactly.

**Positioning statement is absent** from the pipeline despite §4.7 calling it more useful
than industry alone.

### 38.2 The Ultimate Phase 4 Rule

Raw §4.48. The source introduces it in first person — "I'd make this the central rule" —
which marks it as author commentary about emphasis. The rule itself:

> **Do not design from what the AI already knows how to build. Design from what this
> business uniquely needs to communicate.**

The source frames it as the distinction between:

> **AI website generation**
>
> and
>
> **Blogspage AI creative direction.**

**Preserved at full strength as the phase's governing intent.** It is the general form of
three specific prohibitions already recorded: never from a default template (§26), recompose
rather than recolour (§33.2), and mode before pattern (§28). Those three are the enforceable
expressions; this is the principle behind them.

**No mechanism.** Like §3's core principle, the rule states an orientation without a check.
Nothing in Phase 4 detects a blueprint that was designed from capability rather than need.
The Restraint and Novelty gate questions (§37) are the nearest instruments.

### 38.3 Source closing commentary

Raw §4.48 is followed by a block the source titles "Final rating". **This is author
commentary on the source document's own development, not a factory claim or a
specification.** It is recorded here for completeness and carries no normative weight:

> **Previous Phase 4: 9.1/10**
>
> **Revised Phase 4: 9.7/10**
>
> I would stop here rather than endlessly adding complexity.
>
> The remaining 0.3 isn't something we can earn through more theoretical rules. We earn it
> by testing this engine against real businesses and seeing whether it actually produces
> **different, intelligent, premium blueprints**.

**Not a quality assertion about the factory.** The numbers are the author's self-assessment
of a draft. Nothing in this document depends on them, and no gate, threshold, or score
elsewhere references them.

**The substantive point is the last sentence**, and it aligns with what §2.2 and §40 record:
the value of the engine is unproven until it is run against real businesses. The source is
explicit that additional theory will not close the gap.

The block also restates the cross-phase architecture:

| Phase | Name | Question it answers |
|---|---|---|
| PHASE 1 | FOUNDATION | What must every website obey? |
| PHASE 2 | VISUAL DESIGN LANGUAGES | How should this website feel? |
| PHASE 3 | COMPOSITION & PATTERN SYSTEM | What visual vocabulary can express it? |
| **PHASE 4** | **AI CREATIVE DIRECTION ENGINE** | **Which decisions are right for THIS business?** |
| PHASE 5 | AI WEBSITE IMPLEMENTATION ENGINE | How do we build the approved blueprint? |

The Phase 4 row is the clearest one-line statement of this document's scope. Note the source
says "across all four phases" while listing five — the phrase predates Phase 5's addition to
the list. Preserved as written.

The raw file ends with `Top of Form` / `Bottom of Form` and a horizontal rule, which are
document-conversion artifacts carrying no content. They are not reproduced.

---


## 39. Phase Boundaries

### 39.1 Phase 4 owns

| Construct | This document |
|---|---|
| Business truth classification per project | §5 |
| Business DNA, psychology, value proposition, positioning | §6–§9 |
| Design Intent Statement | §10 |
| Brand personality and maturity assessment per project | §11–§12 |
| Asset and content capability assessment per project | §13–§14 |
| Competitive analysis and differentiation per project | §15 |
| Design language **selection** and scoring | §16–§17 |
| All per-project parameter **values** | §18–§22, §30 |
| Narrative strategies N01–N08 (defines **and** selects) | §23 |
| Chapter grouping (defines **and** selects) | §27 |
| Conversion action assignment | §24 |
| Section priority, sequence and grouping per project | §25–§27 |
| Composition mode **selection** per section | §28 |
| Pattern **selection** and parameterization | §29–§30 |
| Section relationship **assignment** per pair | §31 |
| Anchor, quiet zone and rhythm **distribution** | §32 |
| Repetition budget, category balance, creative boundaries | §33.1, §33.3, §33.4 |
| Adaptation to content, assets and competitors | §34 |
| Design confidence and uncertainty reporting | §35 |
| **Composition Plan** and **Design Blueprint** artifacts | §36 |

### 39.2 Phase 4 references without redefining

| Construct | Owner | Referenced in |
|---|---|---|
| Design languages DL-01…DL-05 | Phase 2 | §16 |
| `brandMaturity` parameter | Phase 2 | §12 |
| Composition modes C01–C10 | Phase 3 §9 | §28 |
| Pattern families and IDs | Phase 3 §11, §14 | §29 |
| Pattern parameter vocabulary | Phase 3 §13 | §30 |
| Section transitions (seven types) | Phase 3 §16 | §31 |
| Visual anchors | Phase 3 §19 | §32.1 |
| Quiet zones | Phase 3 §20 | §32.2 |
| Visual rhythm | Phase 3 §17 | §32.3 |
| Visual tension mechanisms | Phase 3 §21 | §20 |
| Section priority scale | Phase 3 §15.2 | §25 |
| Sequencing relationships | Phase 3 §15.1 | §26 |
| Accessibility, readability, navigation requirements | Phase 1 / Control Plane | §33.4 |
| Primary CTA accessibility, seven implementation types | Phase 1 | §24 |
| Business Research / Research Dossier | upstream | §4 |
| Implementation | Phase 5 | §1 |

**Phase 3 duplication handled per matrix decision 13.** Where the Phase 4 source restates a
Phase 3 construct (§28 modes, §31 relationships, §32 anchors/quiet zones/rhythm), this
document presents it as a reference with ID mapping to the Phase 3 construct rather than as a
second definition. Phase 3 owns the **capability**; Phase 4 owns the **per-project
selection**.

### 39.3 Boundary crossings recorded, not corrected

Two constructs sit in the Phase 4 source but are assigned elsewhere by the Control Plane or
the ownership matrix. Both are preserved here because they are Phase 4 source content.
**Neither is reassigned by this document.**

**1 — Novelty Engine (§33.2).**

| Aspect | Matrix assignment |
|---|---|
| Novelty evaluation and threshold | Phase 6 (Row 43) |
| Novelty requirement | Phase 2 (Row 29) |

Raw §4.37 places the whole mechanism — dimensions, levels, and the recompose consequence — in
Phase 4. It is also the eighth input to pattern selection (§29). Resolution requires a
registry decision, not a canonicalization decision.

**2 — Creative Quality Gate (§37).**

Overlaps `02-CONTROL-PLANE/quality-gates.md` §5 Blueprint Validation over the same artifact
at the same position. The Control Plane version has fail conditions and routing; the Phase 4
version has nine questions and no consequence. Whether §4.47 is a self-check preceding the
Control Plane gate or a duplicate of it is unresolved by both documents.

### 39.4 Artifact chain

```
Research Dossier / Business Intelligence Package   (upstream)
    ↓
Phase 4 decisions  (§5–§35)
    ↓
Composition Plan   (Phase 4-owned, per project)
    ↓
Design Blueprint   (Phase 4-owned, per project, embeds the Composition Plan)
    ↓
Creative Quality Gate (§37) → Control Plane Blueprint Validation → Human approval
    ↓
Phase 5 implementation
```

Per `phase-ownership-matrix.md` §6 decisions 13–15 and `artifact-contracts.md` §5.5. The
Composition Designer produces the Composition Plan; the Creative Director produces the
Design Blueprint. Both roles and both artifacts are Phase 4.

---


## 40. Open Questions and Ambiguities

Every item below is unresolved **in the source**. None has been closed by invention. Items
are grouped by kind.

### 40.1 Blocking for Phase 4 execution

| # | Item | Detail |
|---:|---|---|
| 1 | **Pattern library empty** | 0 of ~87 patterns specified (Phase 3 §14.1). Phase 4 §29 cannot select from an empty library. Inherited, not new. |
| 2 | **No scoring formulas** | §16 language score, §18 creative intensity, §26 section ordering and §29 pattern selection each list inputs with no weights, no ranges and no aggregation. |
| 3 | **No thresholds anywhere** | No score in Phase 4 has a stated threshold that converts a value into a decision. |
| 4 | **No derivation rules** | No rule maps any business input to any output value. §7, §8, §11, §14, §21, §25, §27, §32, §33.3 all name outputs without derivations. |

### 40.2 Registry-absent parameters

| # | Parameter | Detail |
|---:|---|---|
| 5 | `creativeRisk` | No registry entry, **no declared scale**, no derivation, no threshold. Emitted as `3` (§19.1). |
| 6 | `imageDominance` | No registry entry. Source scale 1–10. Two scopes, project and pattern, with no stated relationship (§22.3). |
| 7 | `typographyDominance` | No registry entry. Source scale 1–10 (§22.2). |

All three are carried as **source-named, registry-absent**. They are not registered here, not
assigned scales beyond what the source declares, and not folded into `contentDensity` or
`visualTension`.

### 40.3 Cross-phase conflicts

| # | Conflict | Detail |
|---:|---|---|
| 8 | `brandMaturity` scale | Source: 4 levels (Weak / Developing / Established / Strong-premium), emits `3`. Registry §6.5: 3 ordinals (Mature / Developing / Weak), Phase 2-owned. `Established` maps to neither cleanly (§12.1). |
| 9 | `brandMaturity` effect undefined | Matrix line 308 records the brand-maturity effect on `creativeIntensity` as UNDEFINED, while §18 lists it as input 7 of 7. |
| 10 | Section priority scale naming | Phase 3 §15.2 level 2 is `Recommended`; Phase 4 §4.26 level 2 is `High Priority` (§25.1). |
| 11 | Novelty ownership | Source places the engine in Phase 4; matrix Row 43 gives evaluation and threshold to Phase 6, Row 29 the requirement to Phase 2 (§39.3). |
| 12 | Quality gate duplication | §4.47 overlaps Control Plane `quality-gates.md` §5 Blueprint Validation over the same artifact (§37.1). |
| 13 | Creative Budget relationship | Matrix Row 14 has a Foundation-owned Creative Budget that does not bound `creativeIntensity`. Whether §33.1's repetition budget is that budget is unstated. |
| 14 | Input contract vs Research Dossier | The nine-file Business Intelligence Package (§4) and `artifact-contracts.md`'s Research Dossier are not reconciled. |
| 15 | Blueprint fields vs contract content | Seven items of contract-required blueprint content have no source field (§36.2). |
| 16 | `C` prefix collision | Phase 3 uses `C` for both composition modes C01–C10 and the CTA pattern family (§28). Inherited from Phase 3, unresolved. |

### 40.4 Internal inconsistencies in the source

| # | Item | Detail |
|---:|---|---|
| 17 | Confidence aggregation | Four sub-scores mean 92.5; stated overall is `92`. No formula given (§35.1). |
| 18 | Positioning template vs example | Template has four slots; the example fills three in a different order and omits `positioning` (§9). |
| 19 | Content volume boundaries | §29.1 gates `S01` on `3–8 services` as one band; §34.1 gives 3 and 8 *different* treatments. |
| 20 | Section relationship example | Chain reads `Signature Service` then `Service` for what should be one section (§31). |
| 21 | Blueprint composition keys | `services` composed but `signature-services` listed; 5 of 8 sections uncomposed; `doctor` anchor vs `doctor-story` section (§36.3). |
| 22 | Gate questions vs check fields | Nine gate questions, four `checks` fields; six questions have no field, `usability` has no question (§36.2, §37). |
| 23 | Pipeline vs subsections | Eight subsections have no pipeline stage; the pipeline reorders North Star and chapters relative to the subsection order (§38.1). |
| 24 | `secondary_language` vs Secondary Influence | Same slot named two ways in the source; canonicalized as a flagged **rename** (§36.4). |
| 25 | Category balance naming | `CATEGORY FAMILIARITY` / `CREATIVE DIFFERENTIATION` become `Familiarity` / `Creativity` in the examples (§33.3). |
| 26 | Differentiation double-scaled | §15.2 uses Low/Medium/High; §33.3 uses a numeric score for what appears to be the same quantity. |
| 27 | `uncertain` vs truth classes | §35.2 uses `uncertain` and `unknown`; §5 defines VERIFIED / INFERRED / UNKNOWN. `uncertain` maps to none of them. |
| 28 | "all four phases" | The closing block says four while listing five (§38.3). |
| 29 | `density` two scales | Project-level `contentDensity` is Low/Medium/High; pattern-level `Density` is numeric `3` (§30). |

---


### 40.5 Unstated scales and ranges

| # | Construct | Detail |
|---:|---|---|
| 30 | Brand personality matrix | Example values 2–9 imply 1–10; never declared (§11). |
| 31 | Language scores | Example 19–93 implies 0–100; the ten-term expression cannot be known to sum to 100 (§16.2). |
| 32 | Pattern parameters | Six parameters, example values 3–9, no declared range (§30). |
| 33 | Category familiarity / creativity | Values 5–9, no declared range (§33.3). |
| 34 | `competitorSameness` | Emitted as `high`; no scale declared (§15.2, §36.2). |
| 35 | Asset capability 0–10 vs others 1–10 | §13.2 uses 0–10 where §18, §20 and §22 use 1–10. Deliberate or not is unstated. |

### 40.6 Unspecified semantics

| # | Item | Detail |
|---:|---|---|
| 36 | `Conditional` condition | No condition resolves a `Conditional` section priority (§25). Same gap as Phase 3 §15.2. |
| 37 | "Limited freedom" undefined | Six domains named, no limit stated for any (§33.4). |
| 38 | Quality gate pass semantics | The AI must *answer* nine questions; no pass condition, no consequence of a negative answer (§37). |
| 39 | `accessibility: pending` | A blueprint is shown with an unresolved check. Whether `pending` permits approval is unstated (§36.3). |
| 40 | Novelty on first generation | The engine is conditional on available history; no fallback, yet novelty is a pattern-selection input (§33.2, §29.3). |
| 41 | "Become more conservative" | No trigger value, no defined effect on any parameter (§35.1). |
| 42 | "Avoid overcommitting" | No threshold for overcommitment (§35.2). |
| 43 | Repetition budget "major" | Three of four constraints qualify usage as "major" with no definition (§33.1). |
| 44 | Anchor distribution | "Distribute throughout the page" — no spacing rule, no per-chapter allocation (§32.1). |
| 45 | Quiet zone cardinality | Called "essential"; no count, placement or frequency (§32.2). |
| 46 | Language-to-rhythm mapping | §32.3 asserts languages have preferred rhythms; no mapping exists in Phase 2, 3 or 4. |
| 47 | Truth classification procedure | No evidence standard separating VERIFIED from INFERRED; no rule for what an UNKNOWN forbids (§5). |
| 48 | Content classification thresholds | Six richness classes, multi-valued, no threshold, no dominance rule (§14). |
| 49 | Dimension-to-score mappings | §13's nine asset dimensions → four capability scores, and §14's nine content dimensions → six classes, both unmapped. |
| 50 | Adaptation magnitudes | §34.1 gives point values with undefined gaps; §34.2 gives directions with no amounts. |
| 51 | Conversion tier semantics | No cardinality per tier; secondary vs utility distinguished only by example (§24). |
| 52 | Section vocabulary open | "Every possible section" without a closed set; four §25 section names have no Phase 3 family. |
| 53 | Chapter rules | No closed chapter set, no count, no sections-per-chapter bound, no derivation from narrative (§27). |
| 54 | Narrative selection rule | No rule for choosing among N01–N08; blueprint emits a slug rather than an ID (§23). |
| 55 | `Bento` / `marquee` | Pattern kinds named in §33.1 that exist in no Phase 3 family or ID list. |
| 56 | Unnamed treatments | §34.1 and §34.3 design responses are descriptions, not identifiers. No IDs assigned. |

### 40.7 Constructs with no output slot

| # | Construct | Detail |
|---:|---|---|
| 57 | Section relationships (§31) | Pipeline stage exists in §4.32; no blueprint field. |
| 58 | Design confidence (§35.1) | Source says the engine "should report" it; no blueprint field. |
| 59 | Category familiarity / creativity (§33.3) | No blueprint field. |
| 60 | Visual tension | Declared as `strategy.visualTension`, but no pipeline stage (§38.1). |

### 40.8 Inherited registry issues

Carried from `parameter-registry.md` §7 as **inherited, not new**: issues 1, 2, 5, 6, 7, 13,
14, 15, 16, 17 and 21. These predate Phase 4 canonicalization and are not restated here.

---


## 41. Summary

Phase 4 is the decision layer. It takes the factory-global vocabularies of Phases 1–3 and a
research package about one business, and produces two per-project artifacts: a Composition
Plan and a Design Blueprint. Nothing is built until the blueprint exists.

**What the source establishes well.** The orientation is genuinely different from template
generation, and the source defends it with prohibitions rather than aspirations: creative
freedom never extends to factual reality (§5), section order never comes from a default
(§26), low novelty requires recomposition rather than recolouring (§33.2), composition mode is
chosen before pattern (§28), and six categories of business fact admit no creative latitude at
all (§33.4). Four structural separations do real work — intensity from risk (§19), familiarity
from differentiation (§33.3), capability from selection (§39.2), and presentation from truth
(§5). The narrative strategies N01–N08 and the chapter layer are original Phase 4 vocabulary.

**What the source leaves open.** Phase 4 names roughly a dozen scores and specifies the
derivation of none. There is no formula, no weight, no threshold, and no rule connecting any
input to any output value anywhere in the phase. The pattern library it selects from is empty.
Three of its blueprint parameters are absent from the registry, one has a scale that conflicts
with the registry, and several decisions it makes have nowhere in the output format to be
recorded. Sixty open items are catalogued in §40.

**The source says as much itself.** Its closing commentary states that the remaining gap
"isn't something we can earn through more theoretical rules" but by testing against real
businesses. That is consistent with what canonicalization found: the architecture is sound and
the parameterization is unspecified.

**What this document did not do.** No formula, threshold, scale, enum, type, required-field
marking, pattern, schema, or industry preset was invented. No registry entry was added or
amended. No ownership was reassigned. Conflicts, inconsistencies and gaps are recorded in §40
in the state the source left them.

