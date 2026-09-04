---
document: Blogspage AI Design System V1
phase: 3
name: Composition & Pattern System
status: canonical
version: 1.1.0
source: 03-composition-pattern-system-raw.md
---

# Blogspage AI Design System V1

# Phase 3 — Composition & Pattern System

**Derived from:** `01-DOCUMENTATION/03-composition-pattern-system-raw.md`. The raw
source is organised as forty-two numbered subsections (§3.0–§3.41) followed by a
closing commentary block. Section references written as "raw §3.n" in this
document cite those subsection numbers.

**Scope boundary:** This document defines the Phase 3 composition and pattern
**vocabulary** — what compositional constructs, modes, families, parameters and
relationships are available to the factory. It does not decide which of them any
specific business receives, which is Phase 4 territory per
`03-REGISTRY/phase-ownership-matrix.md` rows 32 and 33. Where the raw source
states or implies a per-business decision, this document preserves the source
content and marks it non-normative rather than relocating or deleting it.
See §35 and §36.

**Phase 3 is factory-global and produces no per-project artifact.** Every normative
statement here holds for the factory as a whole, independent of any business. Phase 3
issues **capability** statements (this construct exists, this is what it can do) and
**fit** statements (this construct suits this condition). It does not issue **value**
statements (this project gets this, at this setting, in this order) — those belong to
Phase 4 alone. The vocabulary flows downstream as
`Phase 3 vocabulary → Composition Plan → Design Blueprint`, and both of those
artifacts are **Phase 4-owned**. §35.0 states the boundary in full, with the
adjudication test used throughout this document.

**Normative language:** MUST, SHOULD and MAY carry their source strength. The raw
Phase 3 source is predominantly advisory; §2.3 records the full normative
inventory. Where the source uses first-person editorial phrasing ("I would…",
"we should…"), this document marks the statement as source commentary rather than
promoting it to a requirement.

---

## 1. Purpose

Phase 3 transforms **Foundation + Design Language + Business Research** into **a
unique page composition** (raw §3.0).

The source states the purpose negatively first:

> The purpose is not to provide templates.

and then positively:

> The purpose is to provide the AI with a **design vocabulary, composition logic,
> and creative decision framework**.

The raw source expresses the input-to-output flow as:

```
FOUNDATION
    ↓
DESIGN LANGUAGE
    ↓
BUSINESS PROFILE
    ↓
CONTENT MODEL
    ↓
ASSET MODEL
    ↓
COMPOSITION ENGINE
    ↓
UNIQUE WEBSITE
```

Two of these tiers are not Phase 3 constructs. `FOUNDATION` is Phase 1 and
`DESIGN LANGUAGE` is Phase 2; both are referenced, not redefined here (see
canonicalization rule 9). `BUSINESS PROFILE`, `CONTENT MODEL` and `ASSET MODEL`
are named as inputs by the source without being specified in Phase 3; §36 records
that they arrive from outside Phase 3 without a stated contract.

**Source title note.** The raw document titles itself "PHASE 3 — COMPOSITION
ENGINE & PATTERN SYSTEM". The factory-approved phase name is "Composition &
Pattern System". Both refer to the same phase; "Composition Engine" is preserved
below wherever the source uses it as the name of a specific construct.

---

## 2. Scope

### 2.1 What Phase 3 supplies

| Construct | This document |
|---|---|
| Composition principle | §3 |
| Four composition levels | §4 |
| Composition decision stack | §5 |
| Content hierarchy classes | §6 |
| Content weight scale | §7 |
| Composition axes | §8 |
| Composition modes C01–C10 | §9 |
| Section pattern taxonomy | §10 |
| Pattern families (14) | §11 |
| Pattern metadata shape | §12 |
| Pattern parameters | §13 |
| Pattern library status | §14 |
| Sequencing constructs | §15 |
| Transition relationships | §16 |
| Rhythm, contrast, anchors, quiet zones | §17–§20 |
| Visual tension mechanisms | §21 |
| Creative intensity and risk | §22 |
| Repetition budget | §23 |
| Novelty dimensions | §24 |
| Family balance | §25 |
| Constraint hierarchy and safety filters | §26 |
| Mobile, content and asset transformation | §27–§29 |
| Pattern selection reasoning model | §30 |
| Pattern vs template rule | §31 |

**Three entries above are references or reframings, not Phase 3 definitions.** Per
§35.0:

| Entry | Status |
|---|---|
| §5 composition decision stack | Non-normative whole-pipeline reasoning map. No step in it is a Phase 3 decision. |
| §17 per-language rhythm profiles | Reference to Phase 2 §14.2, which governs. Phase 3 owns rhythm as a concept and its token vocabulary. |
| §22 creative intensity | Bands and influence names only. The score itself is a Phase 4 value; the derivation is UNDEFINED. |

§33 is not listed above because it is not Phase 3 content: it illustrates a
**Phase 4 Composition Plan** built from this vocabulary.

### 2.2 What Phase 3 does not supply

The raw source contains no Phase 3 content on: breakpoints, tablet behaviour,
viewport values, component implementation, token names, anti-pattern lists,
accessibility criteria beyond naming a filter, or novelty thresholds. None of
these has been added. Where the brief for this canonicalization anticipated such
content, §36 records its absence.

### 2.3 Normative inventory

The raw Phase 3 source contains **one** explicit requirement:

| Strength | Statement | Raw |
|---|---|---|
| MUST | The AI **must** classify content into the five hierarchy classes before choosing layouts | §3.4 |

Two further statements are imperative in force though not phrased with "must":

| Strength as written | Statement | Raw |
|---|---|---|
| Prohibition ("must never") | Creative freedom **must never** override business psychology | §3.25 |
| Directive consequence | If novelty is LOW, **redesign composition** — not "change the color" | §3.24 |

Everything else in the source is advisory ("should", "can", "could", "may",
"I would"). This document preserves that distribution. No advisory statement has
been promoted to a requirement.

---

## 3. Core Principle

> **Composition is more important than components.**

The source distinguishes three levels of question (raw §3.1):

| Level | Question it answers |
|---|---|
| Component | "What is this thing?" |
| Pattern | "How can this content be arranged?" |
| Composition | **"Why should this content appear this way here?"** |

The source states that composition is "the level Blogspage AI needs."

Raw §3.41 proposes a restatement as the official Phase 3 principle:

> **The AI does not assemble sections. It composes an experience.**

The source frames this as a proposal ("I would make this the official Phase 3
principle") and as "the biggest improvement over our previous version." It is
recorded here as the source's stated core principle, with its editorial framing
preserved.


---

## 4. Four Composition Levels

Raw §3.2 defines four levels.

### 4.1 Level 1 — Page Composition

The overall visual journey. The source gives three journey examples:

| Example | Journey |
|---|---|
| A | Opening → Trust → Discovery → Story → Proof → Action |
| B | Opening → Atmosphere → Product → Story → Social Proof → Reservation |
| C | Opening → Transformation → Programs → Community → Results → Membership |

The source closes the subsection with: "The business determines this."

**These are examples, not a universal sequence.** Per canonicalization rule 6 and
the sequencing constraint, none of the three is a Phase 3 default. Which journey
a given business receives is a Phase 4 decision
(`phase-ownership-matrix.md` row 34). Example B corresponds in content to the
restaurant example in §32.3 and example C to the gym example in §32.2, but the
source does not label them as such.

### 4.2 Level 2 — Chapter Composition

"A long page should feel like a series of **chapters**." The source's example:

```
CHAPTER 01   Introduction
CHAPTER 02   Why this business
CHAPTER 03   What they offer
CHAPTER 04   Proof
CHAPTER 05   Action
```

Each chapter can have its own visual mood. The stated effect: "This makes the
page feel less like a pile of sections."

The five-chapter example is illustrative. The source does not fix a chapter count
and does not state how chapter boundaries are decided; §36 records that the
chapter-assignment mechanism is undefined.

### 4.3 Level 3 — Section Composition

"This is where our patterns live." The source's examples map one content purpose
to alternative patterns:

| Content purpose | Pattern option |
|---|---|
| Services | Editorial Index |
| Services | Asymmetric Image Grid |

The pairing of one purpose with two different patterns is the point: section
composition is a choice, not a lookup.

### 4.4 Level 4 — Element Composition

Within a section, the following elements "can have different positions, scales
and relationships":

Heading · Image · Metadata · CTA · Decorative line · Number

The source states: "This is where creative freedom really emerges."

---

## 5. Composition Decision Stack

Raw §3.3 gives an ordered decision sequence: "The AI should make decisions in
this order." Preserved complete and in order.

| # | Decision |
|---:|---|
| 1 | What is the business trying to achieve? |
| 2 | Who is the visitor? |
| 3 | What does the visitor need to feel? |
| 4 | What information must be understood? |
| 5 | What content actually exists? |
| 6 | What visual assets exist? |
| 7 | Which design language fits? |
| 8 | What should be emphasized? |
| 9 | What should be intentionally de-emphasized? |
| 10 | What should the next visual moment be? |
| 11 | Which pattern best expresses that moment? |
| 12 | How should that pattern be modified? |
| 13 | How does it connect to the previous section? |
| 14 | How does it prepare the next section? |
| 15 | Does the whole page feel distinctive? |

The source's stated rationale: "This is much closer to how a creative director
thinks."

**Non-normative — this is a whole-pipeline reasoning map, not a Phase 3 procedure.**

The fifteen steps span the entire factory, not Phase 3. Applying the §35.0
adjudication test step by step:

| Steps | Activity | Owner |
|---:|---|---|
| 1–4 | Business goal, visitor, desired feeling, required information | Business Research |
| 5–6 | Available content and visual assets | Business Research / input boundary |
| 7 | Design language selection | **Phase 4** (matrix Row 35) |
| 8–14 | Emphasis, de-emphasis, visual moment, pattern choice, pattern modification, connection to previous and next section | **Phase 4** decisions, made in **Phase 3 vocabulary** |
| 15 | Whether the whole page feels distinctive | **Phase 6** (matrix Row 43) |

**No step in this stack is a Phase 3 decision.** Phase 3's role is to supply the
vocabulary in which steps 8–14 are expressed — the composition axes, modes, families,
transition types and anchor concepts this document defines. The stack is preserved as
source content describing the order in which the pipeline reasons, and it confers no
decision right on Phase 3.

This resolves §36 item 2: the stack is a description of the whole pipeline's
reasoning, not a claim of Phase 3 ownership. The Phase Ownership Matrix needs no new
row for it, because every step already maps to an existing row.


---

## 6. Content Hierarchy

Raw §3.4. Before choosing layouts, the AI **must** classify content into five
classes. This is the source's single explicit requirement (§2.3).

| Class |
|---|
| PRIMARY |
| SECONDARY |
| SUPPORTING |
| UTILITY |
| DECORATIVE |

The source gives one worked example, for a dental clinic:

| Class | Example content |
|---|---|
| PRIMARY | Book Consultation |
| SECONDARY | Cosmetic Dentistry |
| SUPPORTING | Doctor credentials |
| UTILITY | Phone / Location |
| DECORATIVE | Clinic imagery |

"The composition should reflect this hierarchy."

The dental assignment is an example of the classification, not a fixed mapping
for dental businesses. The source states no rule for deriving the classification
from a business profile; §36 records this as undefined.

---

## 7. Content Weight

Raw §3.5. Each content item receives a visual weight on a 1–5 scale.

| Weight | Meaning |
|---:|---|
| 1 | background |
| 2 | supporting |
| 3 | normal |
| 4 | important |
| 5 | dominant |

The source's example assignment:

| Item | Weight |
|---|---:|
| Headline | 5 |
| CTA | 5 |
| Rating | 4 |
| Secondary paragraph | 2 |
| Decorative label | 1 |

"Then the layout reflects those priorities." The stated purpose: "This prevents
every element from visually shouting."

**Registry note.** The source does not name this scale. No parameter registry
entry corresponds to it, so no canonical identifier is asserted here. §36 records
that the content-weight scale is unnamed and its relationship to the five
hierarchy classes of §6 is unstated — an item may carry both a class and a
weight, and the source does not say how they interact.

---

## 8. Composition Axes

Raw §3.10. "Every major section can vary on multiple axes":

Alignment · Scale · Density · Symmetry · Image dominance · Typography dominance ·
Whitespace · Overlap · Depth · Contrast

The source's stated shift is from categorical to parametric choice. Instead of
choosing "Use asymmetric section," the AI chooses:

```
Asymmetry = 8
Image dominance = 7
Typography dominance = 9
Whitespace = 8
Overlap = 4
```

Stated effect: "This makes the output far less repetitive."

**Limitations recorded.** The example uses a numeric scale whose bounds the source
never states, and it names `Asymmetry` as an axis while the axis list contains
`Symmetry`. Whether these are the same axis under opposite polarity is not
stated. Neither the scale nor the polarity question is resolved here; both are
recorded in §36.

---

## 9. Composition Modes

Raw §3.11: "We should define several broad composition modes." Ten modes, IDs
`C01`–`C10`, preserved exactly as written.

| ID | Name | What dominates |
|---|---|---|
| C01 | Typographic | Typography dominates |
| C02 | Image Dominant | Image is the primary visual |
| C03 | Information Dominant | Content structure dominates |
| C04 | Spatial | Whitespace and geometry dominate |
| C05 | Narrative | Storytelling dominates |
| C06 | Kinetic | Movement dominates |
| C07 | Human | People and emotional imagery dominate |
| C08 | Product/Service | Offer itself dominates |
| C09 | Proof | Credibility dominates |
| C10 | Atmospheric | Mood dominates |

**Ordering rule.** "A section chooses a mode before choosing its detailed
pattern." This is the source's stated sequencing between mode and pattern
selection and is preserved at source strength.

**Design language references.** These modes are Phase 3 constructs and are
distinct from the five design languages. Where a mode name resembles a design
language characteristic — C01 Typographic and DL-03's heavy-typography character,
C04 Spatial and DL-05's monumental voids — the source draws no mapping. None is
asserted here. Design languages are referenced by their canonical registry IDs
`DL-01`–`DL-05` throughout this document; see §12.3 for the legacy-name mapping.

**ID collision note.** The `C` prefix serves two different purposes in the source:
`C01`–`C10` are composition modes here, while `C` is the CTA pattern family in
raw §3.13 (§11 of this document). The source does not acknowledge the collision.
Recorded in §36; no identifier has been changed.


---

## 10. Section Pattern Taxonomy

Raw §3.12. "The previous pattern list remains, but now it sits underneath
composition modes."

The source gives one worked example of the resulting layered selection:

| Layer | Value in the example |
|---|---|
| CONTENT PURPOSE | Services |
| COMPOSITION MODE | Typographic |
| PATTERN | Editorial Service Index |
| VISUAL VARIANT | Offset |
| CREATIVE PARAMETERS | High whitespace · High type scale · Low card usage |

The source contrasts this with the flat form it replaces:

> This is much more powerful than simply:
> `Services = S01`

**What this establishes.** A pattern reference alone is insufficient; the source
positions content purpose, mode, pattern, variant and parameters as five distinct
layers of one selection. The `VISUAL VARIANT` layer appears only here — "Offset"
is the sole variant named anywhere in the source, and no variant vocabulary is
defined. Recorded in §36.

---

## 11. Pattern Families

Raw §3.13: "We'll retain these pattern families." Fourteen families, prefixes and
names preserved exactly as written.

| Prefix | Family |
|---|---|
| H | Hero |
| T | Trust |
| S | Services |
| A | About/Story |
| P | People |
| ST | Statistics |
| PR | Process |
| R | Reviews |
| G | Gallery |
| TR | Transformation |
| L | Location |
| B | Booking |
| C | CTA |
| F | Footer |

"But each family can have multiple composition modes."

**This is the complete pattern taxonomy the source provides at family level.**
The families are prefixes and names only. The source assigns no per-family
metadata, no per-family mode list, and no per-family pattern enumeration. See §14
for the library status and §36 for what that leaves undefined.

**Naming note.** Family `A` is named "About/Story" in the source. Both halves of
the name are retained; no separate Story family exists.


---

## 12. Pattern Metadata

Raw §3.14: "Every pattern **should eventually** contain metadata such as:"

The source provides exactly one metadata example, for pattern `S01`, reproduced
verbatim below including its original field spellings:

```json
{
  "id": "S01",
  "purpose": "services",
  "compositionModes": [
    "typographic",
    "editorial"
  ],
  "languages": [
    "editorial",
    "architectural"
  ],
  "contentDensity": "low-medium",
  "imageDependency": "medium",
  "creativeIntensity": 8,
  "visualTension": 7,
  "motionIntensity": 3,
  "bestFor": [
    "3-8 services"
  ],
  "avoidWhen": [
    "20+ services"
  ]
}
```

The source's stated role for this layer: "This is the data layer that eventually
allows AI selection."

### 12.1 Status of this example

The phrasing "should eventually contain" makes this a **target shape, not a
populated schema**. `S01` is the only pattern for which any metadata exists in the
source. No metadata is asserted here for any other pattern, and this block has not
been generalised into a schema, a type definition, or a required field list.


### 12.2 Field-level observations

| Field in source | Registry status | Note |
|---|---|---|
| `id` | No registry entry | Pattern-scoped identifier |
| `purpose` | No registry entry | Corresponds to the content-purpose layer of §10 |
| `compositionModes` | No registry entry | Values `typographic`, `editorial` — see below |
| `languages` | No registry entry | Values are legacy design language names; see §12.3 |
| `contentDensity` | Fit expression of registry parameter `contentDensity` | Registry scopes the parameter **by language** (Phase 2 §11.2); here it expresses pattern **fit** — see below |
| `imageDependency` | **Name conflict** — registry canonical identifier is `assetDependency` | See §12.3 |
| `creativeIntensity` | Fit expression of registry parameter `creativeIntensity` | Registry scopes the parameter **per project**; here it expresses pattern **fit** — see below |
| `visualTension` | Fit expression of registry parameter `visualTension` | Registry scopes the parameter **by language** (Phase 2 §4.3); here it expresses pattern **fit** — see below |
| `motionIntensity` | Canonical identifier `motionIntensity`, range 0–3 | Value `3` is in range. **No conflict:** this is Phase 1's parameter (matrix Row 9) used within its declared range, not a fit expression |
| `bestFor` | No registry entry | Best-fit condition, content-count based |
| `avoidWhen` | No registry entry | Avoidance condition, content-count based |

**Three fields carry names the Parameter Registry governs, at a different scope than
the registry assigns.** `creativeIntensity`, `visualTension` and `contentDensity` are
registry parameters scoped to a project or a design language; this example applies
them to an individual pattern.

**Resolution — pattern metadata expresses fit, not value.** Per §35.0 and
`phase-ownership-matrix.md` §6 decision 15, a pattern-scoped occurrence of one of
these names is a **fit statement**: it says what conditions the pattern suits. It is
not a value statement and does not assign anything to a project. The distinction:

| Statement | Kind | Owner |
|---|---|---|
| "Pattern S01 suits high creative intensity" | Fit | Phase 3 |
| "This project's `creativeIntensity` is 8" | Value | Phase 4 |

To keep the two kinds textually distinct, pattern-scoped fit fields are read under
distinct fit identifiers:

| Field as written in the source | Read as | Meaning |
|---|---|---|
| `creativeIntensity` (pattern-scoped) | `patternIntensityFit` | Creative intensity range this pattern suits |
| `visualTension` (pattern-scoped) | `patternTensionFit` | Visual tension range this pattern suits |
| `contentDensity` (pattern-scoped) | `patternDensityFit` | Content density this pattern suits |

These three fit identifiers are **naming mechanisms, not new parameters**. They carry
no ranges, no scales and no values beyond what the source states, and they are not
added to the Parameter Registry's parameter tables. The unqualified registry names
`creativeIntensity`, `visualTension` and `contentDensity` remain reserved for the
project-level and language-level **values** the registry governs. The source's field
names are preserved verbatim in the §12 block; this mapping is additive, exactly as
the `imageDependency` → `assetDependency` mapping in §12.3 is.

**What remains undefined.** How pattern-level fit aggregates into a project-level
value — whether a project's `creativeIntensity` constrains which patterns are
eligible, or is derived from the patterns chosen, or neither — is **UNDEFINED** and
assigned to **Phase 4**. No mapping, precedence, conversion or aggregation rule is
defined here. Recorded in §36 items 5 and 7 and in `phase-ownership-matrix.md` §7
issue 10.

`motionIntensity` is excluded from this treatment. It is Phase 1's parameter (matrix
Row 9), the source's value `3` is inside its declared 0–3 range, and it therefore
raises no scope conflict.

Per the parameter constraints on this canonicalization, `motionIntensity`,
`motionExpression`, `creativeBudget` and `creativeIntensity` are referenced only.
None is redefined in this document. `motionExpression` and `creativeBudget` do not
appear in the Phase 3 source at all.

### 12.3 Identifier mappings

Design language values in the metadata example are legacy names. They map to
canonical registry IDs as follows, per `03-REGISTRY/design-language-registry.md`
§1 and §3:

| Source form | Appears in | Canonical ID |
|---|---|---|
| `editorial` | §3.14 `languages`, §3.12 mode value | DL-01 Editorial Luxury |
| `architectural` | §3.14 `languages` | DL-05 Architectural / Sophisticated |
| Editorial / Editorial Luxury | §3.8, §3.31, §3.33 | DL-01 |
| Swiss | §3.8 | DL-02 Swiss / Structured |
| Bold / Bold Energetic | §3.8, §3.32 | DL-03 Bold Energetic |
| Soft | §3.8, §3.33 | DL-04 Soft Premium / Wellness |
| Architectural | §3.8, §3.31, §3.32 | DL-05 |

Parameter name mapping:

| Source form | Canonical identifier | Authority |
|---|---|---|
| `imageDependency` | `assetDependency` | `parameter-registry.md` §5, Phase 2 §12.3 |

The legacy forms are preserved above and inside the verbatim block. No source
identifier has been rewritten in place; the mapping is additive.

**Ambiguity in `compositionModes`.** The example lists `"typographic"` and
`"editorial"`. `typographic` corresponds to mode C01. `editorial` is not a
composition mode in §9 — it is a design language name. Whether this is a source
error, or evidence of a mode vocabulary broader than C01–C10, is not stated.
Recorded in §36.


---

## 13. Pattern Parameters

Raw §3.15. "Patterns should expose **controlled creative parameters**."

The source's example set, preserved with its stated ranges:

| Parameter | Range as written |
|---|---|
| Image size | 30–70% |
| Text width | 25–60% |
| Offset | 0–4 columns |
| Overlap | 0–25% |
| Spacing | compact → expansive |
| Alignment | left / center / edge |
| Headline scale | medium → monumental |

Stated effect: "The AI can then generate different compositions from one pattern."

**Status.** The source introduces these with "Example:", so this is an
illustrative parameter set rather than a closed list. Per canonicalization rule 6
it is not treated as the definitive parameter vocabulary. None of these seven has
a canonical identifier in the Parameter Registry, and no identifiers have been
coined for them here.

**Relationship to §8 axes is unstated.** `Overlap` and `Alignment` appear both as
composition axes (§8) and as pattern parameters here, with different value forms:
axes take numeric values in the §8 example, while `Alignment` here takes an
enumeration and `Overlap` a percentage. The source does not say whether these are
the same construct at two levels or two distinct constructs. Recorded in §36.

---

## 14. Pattern Library Status

Raw §3.38 states a target for the V1 library. The source's phrasing is
"I would now target roughly", which makes this an **intention**, not a delivered
library.

| Family | Target count |
|---|---:|
| Hero | 10 |
| Trust | 5 |
| Services | 10 |
| Story | 7 |
| People | 5 |
| Stats | 4 |
| Process | 5 |
| Reviews | 7 |
| Gallery | 8 |
| Transformation | 5 |
| Location | 5 |
| Booking | 5 |
| CTA | 6 |
| Footer | 5 |
| **Stated total** | **≈ 87 composition patterns** |

The source qualifies the number immediately:

> But unlike the previous version, **87 patterns are not 87 templates**.
>
> They are: 87 starting points inside a much larger compositional space.

### 14.1 Patterns actually specified in the source: none

**No individual pattern is specified anywhere in the Phase 3 source.** There is no
pattern with a stated name, composition mode, compatible language set, content
density, asset dependency, creativity value, visual tension value, motion value,
best-fit condition, avoidance condition, responsive behaviour or signature
characteristic — with the single partial exception of `S01`, whose metadata
example is reproduced in §12.

The target counts above are therefore aspirational. The gap between 87 targeted
and 0 specified is recorded in §36 as the largest open item in Phase 3.

### 14.2 Pattern IDs present in the source

Nine pattern IDs appear in the source. All are used illustratively — either inside
the §12 metadata example or inside the dental blueprint example of §33. All are
preserved here; none has been renamed, and no additional ID has been created.

| ID | Family | Where it appears | Named? |
|---|---|---|---|
| S01 | S — Services | Raw §3.12 (`Services = S01`), §3.14 (metadata example), §3.39 (dental blueprint) | No name given; §3.12 associates the pattern "Editorial Service Index" with the Services purpose in the same example |
| H04 | H — Hero | Raw §3.39 dental blueprint | No |
| T04 | T — Trust | Raw §3.39 dental blueprint | No |
| P02 | P — People | Raw §3.39 dental blueprint (as `doctor`) | No |
| TR02 | TR — Transformation | Raw §3.39 dental blueprint | No |
| R01 | R — Reviews | Raw §3.39 dental blueprint | No |
| L01 | L — Location | Raw §3.39 dental blueprint | No |
| B02 | B — Booking | Raw §3.39 dental blueprint | No |

**Count: 8 distinct IDs** across 9 occurrences of ID references (S01 appears in
three separate sections).

The numbering implies unlisted siblings: the Hero ID is the fourth in its family,
the Trust ID the fourth, the People ID the second, the Transformation ID the
second, and the Booking ID the second — so lower-numbered patterns in each of
those five families are implied. The source specifies none of them, and no
identifier for any implied sibling is written anywhere in this document. Five
families (A, ST, PR, G, F) have no ID instance in the source at all.

### 14.3 Pattern names present without IDs

The source names several patterns in prose without assigning IDs. Preserved as
source terminology; no ID has been inferred for any of them.

| Name as written | Raw location | Context |
|---|---|---|
| Editorial Index | §3.2 Level 3 | Services section option |
| Asymmetric Image Grid | §3.2 Level 3 | Services section option |
| Editorial Service Index | §3.12 | Pattern layer of the taxonomy example |

Additional composition descriptors appear inside the three business examples of
§32 (Asymmetric Hero, Quiet Trust, Cinematic Transformation, and others). Those
are treated as descriptions within an example rather than as pattern names, and
are preserved in §32 in their original context.


---

## 15. Section Sequencing

### 15.1 Section Sequence Engine

Raw §3.16. "Section ordering should be driven by:"

Business psychology · Customer journey · Content importance · Conversion ·
Narrative · Available assets

followed by the explicit negative:

> Not by a universal template.

The source adds: "The research explicitly recommends dynamic section sequencing
and gives examples such as Trust before Services for dentistry and Atmosphere
before Reviews for restaurants."

**Ownership.** These six drivers are the Phase 3 vocabulary for *what sequencing
responds to*. The act of ordering sections for a specific business is assigned to
Phase 4 by `phase-ownership-matrix.md` row 34. The two named orderings
(Trust before Services; Atmosphere before Reviews) are cited examples, not Phase 3
rules. See §35.

**Citation note.** "The research" is referenced here and in three other places
(§3.26, §3.29, §3.25) without a locatable document in this repository. Recorded in
§36.

### 15.2 Mandatory vs Optional Sections

Raw §3.17. The AI should classify sections on a five-level scale:

| Level |
|---|
| MANDATORY |
| Recommended |
| Conditional |
| Optional |
| Avoid |

The source's two industry examples:

| Industry | Section | Classification |
|---|---|---|
| Dental | Trust | **Mandatory** |
| Dental | Team | **Recommended** |
| Dental | Gallery | **Conditional** |
| Dental | Huge statistics | **Optional** |
| Restaurant | Atmosphere | **Mandatory** |
| Restaurant | Menu | **Mandatory** |
| Restaurant | Reviews | **Recommended** |
| Restaurant | Doctor-style credentials | **Avoid** |

"This keeps the page business-specific."

**Non-normative.** The five-level scale is Phase 3 vocabulary. The per-industry
assignments in the table above are **Phase 4 decisions shown illustratively** and
carry no normative force. Per the §35.0 adjudication test they fail test 1: they
would not be true before a business was researched. The dental and restaurant rows
are preserved as the source's examples and are not asserted as factory-wide industry
rules; they do not bind Phase 4 to those classifications. The source states no
condition for `Conditional` and no mechanism for deriving a classification from an
industry; recorded in §36.

**Casing note.** The source capitalises `MANDATORY` fully and the remaining four
levels in title case. The distinction is preserved as written; the source does not
say whether it carries meaning.

### 15.3 Section Dependency Graph

Raw §3.18. "Sections can also have relationships." Two examples:

| Example | Chain |
|---|---|
| A | Hero → Trust → Services → Expert → Proof → Booking |
| B | Hero → Atmosphere → Menu → Story → Reviews → Reservation |

> So the AI thinks in terms of a **narrative graph**, not a list.

The source names the construct a graph but both examples are linear chains. No
branching, optional node, or non-linear relationship is shown, and no dependency
type is defined. Recorded in §36.

---

## 16. Section Transition Rules

Raw §3.19. "Every section gets a transition relationship." Seven relationship
types:

| Transition |
|---|
| Continue |
| Contrast |
| Escalate |
| Decompress |
| Reframe |
| Reveal |
| Conclude |

The source's examples:

```
Hero      → Contrast   → Trust
Trust     → Continue   → Services
Services  → Decompress → About
About     → Escalate   → Transformation
```

The source's own assessment: "This is a major addition."

**Relationship to §18.** Five of these seven names overlap the Visual Contrast
Engine behaviours in raw §3.9 (Continuity, Contrast, Escalation, Decompression,
Transition), in a different grammatical form and with `Transition` there against
`Reframe`/`Reveal`/`Conclude` here. The source does not state whether these are one
vocabulary or two. Recorded in §36.


---

## 17. Visual Rhythm

Raw §3.8. "Every page gets a rhythm profile."

The source gives one rhythm profile per design language. Legacy language names are
preserved as written, with canonical registry IDs added:

| Language (source name) | Canonical ID | Rhythm profile |
|---|---|---|
| Editorial | DL-01 | Quiet → Dramatic → Quiet → Human → Dramatic → Quiet → Action |
| Bold | DL-03 | Impact → Dense → Image → Impact → Motion → Dense → CTA |
| Swiss | DL-02 | Information → Proof → Information → Explanation → Proof → Action |
| Soft | DL-04 | Calm → Human → Image → Story → Calm → Action |
| Architectural | DL-05 | Monumental → Void → Structure → Cinema → Void → Monumental |

"This becomes a major creative control."

**Status — reference, not redefinition.** The source introduces these with
"Example:", so they are illustrative profiles, not fixed per-language sequences.
Substantively similar rhythm profiles already exist in the canonical Phase 2 document
at §14.2.

**Phase 2 owns per-language rhythm.** `phase-ownership-matrix.md` Row 26 assigns the
per-language section rhythm profile to **Phase 2**. The table above is therefore a
**reference to Phase 2 §14.2**, reproduced for readability, and is **not a Phase 3
redefinition**. Where the two documents differ in wording or token order, **Phase 2
§14.2 governs**. Phase 3 does not maintain an independent set of per-language rhythm
profiles.

What Phase 3 does own is the layer above and below the profile:

| Layer | Concern | Owner |
|---|---|---|
| Per-language rhythm profile | Which rhythm sequence a design language carries | **Phase 2** (§14.2, matrix Row 26) |
| Rhythm as a composition concept | That pages have rhythm, that it is a creative control, and the token vocabulary used to express it | **Phase 3** (this section) |
| Concrete per-project rhythm sequence | The actual ordered rhythm a project receives | **Phase 4** (matrix Row 34) |

This three-layer split resolves §36 item 3 and `design-language-registry.md` §8
item 17: the duplication was two phases describing different layers of one concern,
not two competing definitions of the same layer.

**Rhythm token vocabulary.** Across §3.8, §3.32 and §3.39 the source uses the
following rhythm tokens without defining them: Quiet, Dramatic, Human, Action,
Impact, Dense, Image, Motion, CTA, Information, Proof, Explanation, Calm, Story,
Monumental, Void, Structure, Cinema, Cinematic. No closed token list is stated and
the tokens are not mapped to composition modes. The token vocabulary is Phase 3's
layer per the table above; closing it into a defined set remains open and is recorded
in §36.

---

## 18. Visual Contrast Engine

Raw §3.9. "Adjacent sections should not always behave the same way."

The AI should compare the previous section against the next and decide whether to
create:

| Behaviour | Movement as written |
|---|---|
| **Continuity** | soft → soft |
| **Contrast** | quiet → dramatic |
| **Escalation** | medium → large → monumental |
| **Decompression** | dense → spacious |
| **Transition** | light → dark |

"This is how we create page-level storytelling."

See §16 for the unresolved relationship between these five behaviours and the
seven transition types.

---

## 19. Visual Anchors

### 19.1 Visual Anchor System

Raw §3.6. "Every website should have **3–5 visual anchors**."

The source's examples of what can serve as an anchor:

Hero image · Doctor portrait · Large statistic · Signature service ·
Transformation photograph

Two directives follow:

- "The AI should deliberately distribute these throughout the page."
- "Do not put five major visual moments in five consecutive sections."

The 3–5 count is stated with "should", so it is a strong recommendation rather than
a requirement. The consecutive-sections statement is a prohibition in form but is
not marked MUST in the source; its strength is preserved as written.

### 19.2 Visual Anchor Distribution

Raw §3.34. "A useful rule:"

| Page region | Anchors |
|---|---|
| FIRST THIRD | 1–2 major anchors |
| MIDDLE | 1–2 major anchors |
| FINAL THIRD | 1 major anchor **+** conversion anchor |

"This prevents visual fatigue."

The source labels this "a useful rule", which this document preserves without
elevating it to a MUST. The distribution sums to 3–5 anchors plus a conversion
anchor, consistent with §19.1, though the source does not state whether the
conversion anchor counts inside the 3–5 range. Recorded in §36.

---

## 20. Quiet Zones

Raw §3.7. "A premium website also needs moments of restraint."

A quiet zone could be:

| Form |
|---|
| one sentence **+** large whitespace |
| single image |
| small label **+** no CTA |

"Quiet zones provide contrast for the next high-impact moment."

The source uses "could be", so these three forms are illustrative. No count,
placement rule or frequency is stated for quiet zones.

---

## 21. Visual Tension

Raw §3.20. "Visual tension can be created through:"

Size · Position · Alignment · Cropping · Whitespace · Density · Typography ·
Color · Overlap · Depth

Two directives:

- "The AI should intentionally choose one or two primary tension mechanisms per
  section."
- "Don't use everything at once."

**Registry note.** `visualTension` is a Parameter Registry identifier scoped by
design language (Phase 2 §4.3). This section supplies the *mechanisms* by which
tension is produced at section level; it does not redefine the parameter. The
one-or-two-mechanisms limit is stated with "should".


---

## 22. Creative Intensity and Creative Risk

### 22.1 Creative Intensity

Raw §3.21. "Each website receives a creative intensity score."

| Band | Label |
|---|---|
| 1–3 | Conservative |
| 4–6 | Modern |
| 7–8 | Expressive |
| 9–10 | Highly Art Directed |

The score is influenced by:

Industry · Brand personality · Customer expectations · Assets · Design language ·
Business maturity

"Then the AI can push the composition appropriately."

**What Phase 3 supplies here, and what it does not.** `creativeIntensity` is a
Parameter Registry identifier whose derivation the registry assigns to **Phase 4**
and whose scope is **per project**. Under the §35.0 statement kinds:

| This section states | Kind | Status |
|---|---|---|
| The four bands and their labels | Capability — the vocabulary of intensity levels | Phase 3, preserved as source content |
| The six named influences | Capability — which factors bear on the score | Phase 3, names only |
| What score a given project receives | **Value** | **Phase 4**, not stated here |
| How the six influences combine into a score | Derivation | **UNDEFINED**, assigned to Phase 4 |

Per the parameter constraints on this canonicalization, `creativeIntensity` is
referenced here and **not redefined**. No scoring formula, weighting or derivation
rule is stated in the source and none has been added. The band labels are vocabulary;
the score itself is a Phase 4 value.

**`brandMaturity` terminology.** The source's sixth influence, "Business maturity",
is the registry parameter `brandMaturity` in prose form. `brandMaturity` is the
canonical identifier; "Business maturity" and "business maturity" are recognised
terminology variants of it, recorded in `parameter-registry.md` §6. The registry
records `brandMaturity`'s definition and range as **UNDEFINED**, and this section does
not fill them. Its effect on `creativeIntensity` therefore remains **UNDEFINED** and
is assigned to **Phase 4**; naming the influence is not the same as defining it.

Recorded in §36 items 5 and 6.

### 22.2 Creative Risk

Raw §3.22. "Creative intensity and creative risk are different."

The source's contrast:

| Example | Classification |
|---|---|
| Bold typography | = high intensity |
| Unusual navigation | = high risk |

The stated intent:

> We want to encourage **high creative expression** while generally keeping **low
> interaction risk.**

"That's an important distinction for production websites."

The qualifier "generally" is preserved: this is a stated preference, not an
absolute constraint. `creativeRisk` has no Parameter Registry entry and no scale is
defined for it in the source — "high" and "low" are the only values used. Recorded
in §36.

---

## 23. Pattern Repetition Budget

Raw §3.23. "Every page gets a repetition budget."

| Repeated element | Budget as written |
|---|---|
| Same card treatment | ≤ 2 major uses |
| Same grid | ≤ 2 major uses |
| Same alignment strategy | should vary |
| Same image ratio | avoid excessive repetition |
| Same CTA treatment | avoid repeated visual treatment |

"This helps prevent template drift."

The source introduces the table with "For example:", so the two numeric limits are
illustrative values rather than fixed factory constants. The final three entries
are qualitative and have no numeric threshold; "major use" is not defined. Recorded
in §36.

---

## 24. Composition Novelty

Raw §3.24. "Before finalizing the page, the AI evaluates:" nine dimensions.

| # | Novelty dimension |
|---:|---|
| 1 | Hero uniqueness |
| 2 | Section sequence uniqueness |
| 3 | Grid diversity |
| 4 | Typography variation |
| 5 | Image composition |
| 6 | Rhythm |
| 7 | Pattern repetition |
| 8 | CTA treatment |
| 9 | Overall visual identity |

The result is a three-level determination:

```
Novelty: LOW / MEDIUM / HIGH
```

with a stated consequence:

> If LOW: redesign composition.
> Not: change the color.
>
> This is critical.

The consequence is preserved at full strength (see §2.3): a LOW novelty result
directs a compositional redesign, explicitly not a surface colour change.

### 24.1 Undefined mechanisms

Per the novelty constraints on this canonicalization, the following are **explicitly
recorded as undefined in the source**:

- **No scoring formula.** The section is titled "Composition Novelty Score" but no
  score is computed; only a LOW/MEDIUM/HIGH label is produced.
- **No thresholds.** Nothing states what makes a page LOW rather than MEDIUM or
  HIGH.
- **No comparison algorithm.** "Uniqueness" implies comparison against something,
  but the comparison target is never named.
- **No cross-project memory.** No mechanism is described for remembering prior
  generated sites, so "uniqueness" has no stated corpus.
- **No dimension weighting.** The nine dimensions are unweighted and no aggregation
  rule is given.
- **No redesign loop bound.** No iteration limit is stated for the redesign
  directive.

No algorithm, threshold, formula, weighting or memory system has been invented to
fill these gaps.

### 24.2 Phase boundary

`phase-ownership-matrix.md` row 348 assigns evaluation of the generated result to
Phase 6, and `parameter-registry.md` records novelty-related evaluation under
Phase 6. This Phase 3 section places a novelty evaluation before finalisation,
inside the composition process. The overlap is real and **is not resolved here**;
see §35 and §36 item 7.

---

## 25. Pattern Family Balance

Raw §3.35. A page should not become "10 card sections" or "10 image sections".

The engine should balance:

Typography · Image · Information · Human · Proof · Whitespace · Interaction

"according to the language."

The seven balance categories partially echo the composition modes of §9
(Typographic, Image Dominant, Information Dominant, Human, Proof) but the source
neither maps them nor states balance ratios. The phrase "according to the language"
defers the balance targets to the design language without specifying per-language
values. Recorded in §36.


---

## 26. Constraint Hierarchy and Safety Filters

### 26.1 Creative Constraint Hierarchy

Raw §3.36. "The AI has freedom in this order:"

```
BUSINESS TRUTH
    ↓
CUSTOMER NEED
    ↓
CONVERSION
    ↓
USABILITY
    ↓
ACCESSIBILITY
    ↓
BRAND
    ↓
DESIGN LANGUAGE
    ↓
CREATIVITY
    ↓
EXPERIMENTATION
```

> This means the AI can push creativity **as far as the higher layers allow**.

"That's the balance we want."

The nine layers are preserved in source order. Creativity and experimentation sit
at the bottom, meaning they yield to every layer above them.

### 26.2 Industry Safety Layer

Raw §3.25. The source's strongest prohibition:

> Creative freedom **must never** override business psychology.

The source's cited examples: "the research specifically warns against transferring
aggressive gym aesthetics into dental environments and against hiding restaurant
booking/menu actions behind immersive storytelling."

The resulting filter chain:

```
CREATIVE FREEDOM
    ↓
BUSINESS SAFETY FILTER
    ↓
USABILITY FILTER
    ↓
ACCESSIBILITY FILTER
```

**Strength.** "Must never" is preserved verbatim. This is the one absolute
prohibition in the Phase 3 source (§2.3).

**Filter definitions are absent.** The three filters are named but no filter has
stated criteria, inputs, or pass/fail conditions. The accessibility filter in
particular names no standard, and Phase 1 owns accessibility per the ownership
matrix — this section references the filter rather than defining accessibility
criteria. Recorded in §36.

**Relationship to §26.1 is unstated.** The constraint hierarchy places usability
above accessibility; this filter chain places them in the same order but omits
business truth, customer need, conversion, brand, design language, creativity and
experimentation. Whether the filter chain is a subset of the hierarchy or a separate
runtime check is not stated. Recorded in §36.

---

## 27. Mobile Composition

### 27.1 Mobile Composition Engine

Raw §3.26. "Mobile gets its own composition decisions."

It can change:

| Changeable on mobile |
|---|
| sequence |
| image ratio |
| overlap |
| typography scale |
| navigation |
| sticky CTA |
| interaction |
| carousel behavior |

> The research explicitly states that mobile layouts should be intentionally
> restacked rather than simply compressed.

That mobile may reorder the sequence is significant: mobile is not constrained to
the desktop section order.

### 27.2 Mobile Pattern Transformation

Raw §3.27. Three desktop → mobile transformations, preserved as given:

| Desktop | Mobile |
|---|---|
| asymmetric overlap | image → headline → text → CTA |
| horizontal gallery | snap carousel / vertical stack |
| sticky storytelling | sequential story |

> The pattern can **transform**, rather than merely shrink.

This principle is preserved as the core mobile concept of Phase 3.

### 27.3 No tablet tier and no breakpoints

The raw Phase 3 source contains **no tablet tier**. It describes desktop and mobile
only. It also contains no breakpoint values, no viewport widths, and no
implementation detail for any of the three transformations above.

Per the mobile constraints on this canonicalization, no tablet stage has been
interpolated and no breakpoint has been invented. A desktop → tablet → mobile
progression cannot be recorded because the source does not provide the middle term.
Recorded in §36 item 10.

---

## 28. Content-Driven Transformation

Raw §3.28. "The same pattern can change based on content."

| Content volume | Resulting treatment |
|---|---|
| 3 services | visual showcase |
| 8 services | structured list |
| 20 services | categorized navigation |
| 2 team members | expert spotlight |
| 6 team members | editorial profiles |
| 20 team members | searchable/filterable team |

"This creates a content-responsive system."

The counts are the source's examples. No boundary rule is stated — the source does
not say what happens at 4, 5, 12 or 15 services, and the thresholds between
treatments are not defined. The `bestFor` / `avoidWhen` fields in the §12 metadata
example ("3-8 services", "20+ services") are the same kind of content condition
expressed per pattern. No interpolation rule has been added. Recorded in §36.

---

## 29. Asset-Driven Transformation

Raw §3.29. Composition responds to asset quality.

| Asset condition | Direction |
|---|---|
| excellent photography | AI **can** increase image dominance, visual storytelling, cinematic composition |
| weak photography | AI **should** increase typography, structure, color, spacing, graphic composition |

The source's rationale:

> This is especially important for local businesses because photography quality
> varies dramatically. The research explicitly recommends moving toward
> typography-led layouts when photographic assets are insufficient.

**Modal distinction preserved.** The source writes "AI can increase" for excellent
photography and "AI should increase" for weak photography. The asymmetry is
retained: strengthening typography in the weak-asset case carries more force than
increasing image dominance in the strong-asset case.

**Registry note.** Asset dependency is governed by the canonical identifier
`assetDependency` (see §12.3). "excellent" and "weak" photography are the only
asset-quality levels named in the source; no assessment scale or rubric is defined.
Recorded in §36.


---

## 30. Pattern Selection Reasoning Model

Raw §3.30, titled "Pattern Selection Formula". The source presents it
"Conceptually":

```
PATTERN SCORE

  Language Compatibility
+ Industry Compatibility
+ Content Compatibility
+ Asset Compatibility
+ Conversion Compatibility
+ Creative Value
+ Novelty
+ Narrative Fit
- Repetition Risk
- Usability Risk
```

The source immediately limits it:

> We don't have to implement this mathematically yet.
>
> But this becomes the reasoning model behind the AI.

**Status: reasoning model, not an algorithm.** Eight positive terms and two
negative terms are named. No term has a weight, a range, a unit, or a measurement
method, and no total is defined. The source explicitly declines mathematical
implementation. Per the novelty constraints on this canonicalization, no scoring
formula has been constructed from these terms.

**Term provenance.** `Repetition Risk` corresponds to §23, `Novelty` to §24,
`Usability Risk` to §22.2's interaction risk, and `Narrative Fit` to §15.3's
narrative graph. `Language Compatibility`, `Industry Compatibility`,
`Content Compatibility`, `Asset Compatibility`, `Conversion Compatibility` and
`Creative Value` are named only here and are otherwise undefined. Recorded in §36.

---

## 31. Pattern vs Template Rule

Raw §3.37. The source's definition of failure and of success.

A pattern **becomes a template** when it repeats all five of:

| Sameness |
|---|
| same structure |
| same sequence |
| same visual hierarchy |
| same spacing |
| same imagery |

The system **should allow**:

| Variation |
|---|
| same underlying pattern |
| different composition |
| different parameters |
| different sequence |
| different rhythm |

> That is what keeps it reusable without looking copied.

This rule is the operative safeguard behind canonicalization rule 6 and behind the
"Do not turn Phase 3's available pattern vocabulary into a fixed page template"
constraint. It is the source's own statement of that boundary.

---

## 32. Composition Examples

**Non-normative.** The source gives three worked examples. **All three are
illustrations of the engine producing different outcomes, not specifications for
their industries.** Per canonicalization rule 12 they are preserved in full; per
rule 6 none is a rule. Legacy design language names are preserved with canonical IDs
added.

Per the §35.0 adjudication test, every value in these three examples is a **Phase 4
value statement** shown illustratively: the language selections, creative intensity
scores, section sequences, rhythm sequences and pattern assignments would none of
them be true before a business was researched. They demonstrate the vocabulary in
use and do not bind Phase 4 to these outcomes for these industries.

### 32.1 Dental

Raw §3.31. Stated inputs: premium cosmetic dentist · excellent portraits ·
8 major services · 4.9 Google rating · 320 reviews · strong doctor profile ·
primary goal: consultation.

"AI could generate:"

| Field | Value | Canonical ID |
|---|---|---|
| LANGUAGE | Editorial Luxury | DL-01 |
| SECONDARY | Architectural | DL-05 |
| CREATIVE INTENSITY | 8 | — |

Sequence:

```
Hero → Trust Spotlight → Signature Treatments → Doctor Story
     → Patient Transformation → Service Index → Reviews
     → Clinic Environment → Consultation CTA
```

"And visually:"

```
Asymmetric Hero
    ↓
Quiet Trust
    ↓
Large Editorial Service
    ↓
Portrait-led Story
    ↓
Cinematic Transformation
    ↓
Structured Service Index
    ↓
Sparse Review Moment
    ↓
Full-bleed Clinic image
    ↓
Minimal CTA
```

"This doesn't look like a generic dental template."

Note that the source pairs a secondary design language with a primary one here and
in §32.2 and §32.3, but Phase 3 states no rule for how two languages combine within
one page. Recorded in §36.

### 32.2 Gym

Raw §3.32, opening with "Same engine."

Stated inputs: premium boutique gym · excellent photography · 3 videos ·
6 programs · strong community · free trial.

"AI could choose:"

| Field | Value | Canonical ID |
|---|---|---|
| LANGUAGE | Bold Energetic | DL-03 |
| SECONDARY | Architectural | DL-05 |
| CREATIVE INTENSITY | 9 | — |

Sequence:

```
Cinematic Hero → Giant Stats → Programs → Transformation
              → Trainers → Community → Facility → Reviews → Free Trial
```

Visual rhythm:

```
Impact → Dense → Image → Impact → Human → Cinema → Quiet → Impact
```

"Completely different experience."

This rhythm differs from the Bold/DL-03 profile in §17 (Impact → Dense → Image →
Impact → Motion → Dense → CTA) at positions 5, 6, 7 and 8, confirming that the §17
profiles are starting points rather than fixed sequences.

### 32.3 Restaurant

Raw §3.33.

| Field | Value | Canonical ID |
|---|---|---|
| LANGUAGE | Editorial Luxury | DL-01 |
| SECONDARY | Soft | DL-04 |

Sequence:

```
Atmospheric Hero → Restaurant Story → Signature Dishes → Menu
                → Experience Gallery → Reviews → Location → Reservation
```

> Again, the page is driven by the business story, not a generic local-business
> template.

This example states no creative intensity value, unlike §32.1 and §32.2.


---

## 33. Downstream Consumption — the Composition Plan

Raw §3.39. "The composition engine should produce a **Design Blueprint** before
coding."

**How this section is framed.** The source's phrasing assigns the blueprint to the
composition engine, which reads as a Phase 3 output. Per §35.0 that reading does not
survive the adjudication test: every value in the example below is business-specific
and would not be true before a business was researched. This section is therefore
framed as **what a downstream Phase 4 consumer produces from Phase 3 vocabulary**,
not as a Phase 3 output.

The example is an **illustrative instance of a Phase 4 Composition Plan**. Its shape
is a proper subset of the Design Blueprint contract in
`02-CONTROL-PLANE/artifact-contracts.md` §5.5 — specifically the composition-plan
subset of that contract's required information. That contract names the producing
role as "Creative Director, incorporating the Composition Designer's composition
plan", and requires the blueprint to use "only Phase 3 vocabulary". Both artifacts are
**Phase 4-owned**. See §35.0 for the full artifact chain.

Phase 3's contribution to the example is the **vocabulary** it is written in: the
composition modes, pattern family prefixes, rhythm tokens, anchor concept and
parameter names. Phase 3 supplies those words. Phase 4 chose these particular values.

The source gives one example blueprint, for the dental case. Reproduced with its
original keys and values:

```yaml
business:
  industry: dental
  positioning: premium cosmetic
  goal: consultations

design:
  primary_language: editorial
  secondary_language: architectural
  creative_intensity: 8
  visual_tension: 7
  content_density: medium
  image_dependency: high

narrative:
  sequence:
    - hero
    - trust
    - services
    - doctor
    - transformation
    - reviews
    - location
    - booking
  rhythm:
    - quiet
    - dramatic
    - information
    - human
    - cinematic
    - quiet
    - action
  anchors:
    - hero_portrait
    - doctor
    - transformation
    - clinic

patterns:
  hero: H04
  trust: T04
  services: S01
  doctor: P02
  transformation: TR02
  reviews: R01
  location: L01
  booking: B02
```

> **This blueprint should exist before the AI starts writing React.**
>
> That is a major architectural improvement.

### 33.1 Status of this example — non-normative Phase 4 instance

**Non-normative.** This is the source's single example blueprint, reframed per §33's
opening as an **illustrative Phase 4 Composition Plan instance for the dental case**.
Per canonicalization rule 6 it is **not** a schema and **not** a required output
contract, and it is not a Phase 3 output. The eight pattern IDs in it are the
illustrative IDs catalogued in §14.2. The `sequence` has eight entries while `rhythm`
has seven and `anchors` four; the source does not state how they align.

Every value in the block is a **Phase 4 value statement** under §35.0: the language
pair, the four parameter settings, the section sequence, the rhythm sequence, the
anchor set and the eight pattern assignments. None binds Phase 4 to this outcome for
dental businesses. The authoritative shape of the Design Blueprint is
`artifact-contracts.md` §5.5, not this example.


### 33.2 Identifier mappings in the blueprint

| Blueprint key | Value | Canonical mapping |
|---|---|---|
| `primary_language` | `editorial` | DL-01 |
| `secondary_language` | `architectural` | DL-05 |
| `creative_intensity` | 8 | `creativeIntensity` (Parameter Registry; referenced, not redefined) |
| `visual_tension` | 7 | `visualTension` (Parameter Registry) |
| `content_density` | medium | `contentDensity` (Parameter Registry) |
| `image_dependency` | high | `assetDependency` (Parameter Registry canonical name) |

The blueprint uses `snake_case` keys while the §12 metadata example uses
`camelCase` for the same concepts (`creative_intensity` vs `creativeIntensity`,
`image_dependency` vs `imageDependency`, `content_density` vs `contentDensity`,
`visual_tension` vs `visualTension`). The source does not reconcile the two casing
conventions.

**Resolved — `camelCase` governs field identifiers.** Per
`parameter-registry.md` §6, the canonical form of a parameter or field identifier is
`camelCase`. The `snake_case` keys above are legacy source forms and map to the
canonical `camelCase` identifiers in the mapping table above. The source spellings are
preserved verbatim inside the quoted block; the mapping is additive and nothing has
been rewritten in place.

The convention governs **field identifiers only**. It does not alter, and this section
does not restyle:

| Kept as written | Examples in this document |
|---|---|
| Prefixed construct IDs | `C01`–`C10`, `S01`, `H04`, `TR02`, `DL-01` |
| Uppercase classification constants | `MANDATORY`, `PRIMARY`, `LOW`, `HIGH` |
| Natural-language prose names | "Editorial Luxury", "Business maturity", rhythm tokens such as Quiet and Dramatic |
| Verbatim source quotations | every fenced block in this document |

Recorded as resolved in §36 item 9.

### 33.3 Design Blueprint ownership — resolved

The raw source names the Design Blueprint as the **Phase 3 output**.
`phase-ownership-matrix.md` Row 34 assigns the Design Blueprint to **Phase 4**.

**Resolved by reframing, not by amending the matrix.** The apparent conflict came
from reading the source's "the composition engine should produce" as an ownership
claim. It is not one. The example the source gives is business-specific throughout,
so it cannot be a factory-global Phase 3 output; and its shape is a proper subset of
the blueprint contract in `artifact-contracts.md` §5.5, so it is not a competing
contract either. What the source actually describes is the **Phase 4 Composition
Plan** — the Composition Designer's output, expressed in Phase 3 vocabulary and
embedded into the Creative Director's Design Blueprint.

The resolution assigns:

| Concern | Owner |
|---|---|
| Composition vocabulary the plan is written in | **Phase 3** (this document) |
| The Composition Plan artifact | **Phase 4** (Composition Designer) |
| The Design Blueprint artifact | **Phase 4** (Creative Director) |
| Blueprint contract and required shape | **Control Plane** (`artifact-contracts.md` §5.5) |

**No Control Plane change was required.** `artifact-contracts.md` and
`agent-roles.md` already model this chain correctly. §33 has been reframed to match
them.

The blueprint's `business` block (industry, positioning, goal) and its per-business
`sequence` are business-specific creative decisions. Under the corrected framing that
is exactly what is expected of a Phase 4 artifact, and it confirms the reframing
rather than contradicting it.

Recorded as resolved in §36 item 1 and in `phase-ownership-matrix.md` §7 issue 7.


---

## 34. Phase 3 Final Architecture

Raw §3.40. The source's pipeline diagram, transcribed from its box-drawing form:

```
BUSINESS RESEARCH
        │
        ▼
BUSINESS PROFILE
        │
   ┌────┴────┬─────────┐
   ▼         ▼         ▼
Psychology  Brand    Assets
   │         │         │
   └────┬────┴─────────┘
        ▼
DESIGN LANGUAGE
        │
        ▼
CREATIVE PROFILE
        │
   ┌────┴─────┬─────────┐
   ▼          ▼         ▼
Intensity  Tension   Density
   │          │         │
   └────┬─────┴─────────┘
        ▼
CONTENT HIERARCHY
        │
        ▼
SECTION SEQUENCE
        │
        ▼
CHAPTER STRUCTURE
        │
        ▼
PATTERN SELECTION
        │
        ▼
PATTERN PARAMETERS
        │
        ▼
SECTION RHYTHM
        │
        ▼
VISUAL ANCHOR DISTRIBUTION
        │
        ▼
NOVELTY CHECK
        │
        ▼
DESIGN BLUEPRINT
        │
        ▼
NEXT.JS BUILD
```

**Transcription note.** The raw file encodes this diagram as HTML entities
(`&boxv;`, `&boxdr;`, `&#9660;` and similar) across lines 1686–1784. The rendering
above preserves the structure and every node label without altering any label.

**Boundary observations.** The pipeline spans more than Phase 3. `BUSINESS RESEARCH`
and `BUSINESS PROFILE` precede Phase 3; `DESIGN LANGUAGE` is Phase 2;
`NEXT.JS BUILD` is Phase 5; `NOVELTY CHECK` overlaps Phase 6 per §24.2; and
`DESIGN BLUEPRINT` is assigned to Phase 4 per §33.3. The diagram is preserved as the
source's own architectural summary. It does not assign Phase 3 ownership over the
Phase 2, Phase 4, Phase 5 or Phase 6 stages it depicts. `CREATIVE PROFILE` and its
three sub-nodes appear only in this diagram and are not defined elsewhere in the
source. Recorded in §36.

### 34.1 Source commentary

Raw §3.41 and the closing block contain the source author's own assessment. It is
recorded here as **commentary, not specification**:

- A self-rating of **9.5/10** for the revised Phase 3.
- The stated reason for not rating it 10: "we haven't yet tested it against **real
  businesses and actual generated websites**." The source continues: "A design
  system cannot honestly become a 10/10 purely on paper. We need to run it through
  actual cases and discover where the composition engine produces repetition,
  awkward transitions, weak mobile behavior, or insufficient creative expression."
- The stated next milestone: running the system through actual cases.
- A "Where we are now" summary describing Phase 1 as foundation (technical + UX +
  accessibility + creative constraints), Phase 2 as five visual design languages
  ("five different visual grammars"), and Phase 3 as the composition engine
  (business-driven section sequencing → pattern selection → pattern variation →
  visual rhythm → creative intensity → novelty → design blueprint).

The 9.5/10 figure is an editorial judgement and carries no normative weight. The
untested status is a genuine limitation and is carried into §36.


---

## 35. Phase Boundaries

This section states what Phase 3 owns, what it references, and where the source
crosses a boundary the Phase Ownership Matrix draws elsewhere. Nothing here changes
the matrix.

### 35.0 The Phase 3 / Phase 4 boundary

**Phase 3 is factory-global. It produces no per-project artifact.**

Everything in this document holds for the factory as a whole, independent of any
particular business. Phase 3 defines what compositional constructs exist, what they
can do, and what conditions they suit. It never states what a specific business
receives.

**Three kinds of statement.** The boundary is drawn by statement kind, not by
subject matter:

| Kind | Says | Issued by |
|---|---|---|
| **Capability** | This construct exists and this is what it can do | Phases 1, 2, 3 |
| **Fit** | This construct suits this condition better or worse than that one | Phases 1, 2, 3 |
| **Value** | This project gets this construct, at this setting, in this order | **Phase 4 only** |

Phase 3 may say a pattern is well suited to eight services and poorly suited to two.
It may not say that a given business has eight services, nor that this business
therefore receives that pattern. The first is fit; the second is a value.

**Adjudication test.** For any statement in this document, ask:

1. Would the statement still be true if no business had yet been researched? If yes,
   it is Phase 3 capability or fit. If no, it is a Phase 4 value.
2. Does the statement select, rank, assign or sequence *for one business*? If yes,
   it is a Phase 4 decision regardless of which section it appears in.
3. Does it name a construct, a relationship between constructs, or a condition under
   which a construct fits? If yes, it is Phase 3 vocabulary.

Where this document contains a business-specific illustration — the dental,
gym and restaurant examples in §32, the per-industry section assignments in §15.2,
the blueprint instance in §33 — that illustration is **non-normative**. It shows the
vocabulary in use. It does not transfer the decision right to Phase 3, and it does
not bind Phase 4 to that outcome.

**The artifact chain.** Phase 3 vocabulary flows to Phase 4 through two Phase
4-owned artifacts:

```
Phase 3 Vocabulary  (factory-global, this document)
    ↓  consumed by
Composition Designer
    ↓  produces
Composition Plan    (Phase 4-owned, per project)
    ↓  consumed by
Creative Director
    ↓  produces
Design Blueprint    (Phase 4-owned, per project, embeds the Composition Plan)
```

The Composition Plan is written entirely in the vocabulary this document defines.
That does not make it a Phase 3 artifact. An artifact belongs to the phase that
**decided its contents**, not the phase that **supplied the words**. See
`03-REGISTRY/phase-ownership-matrix.md` §6 decisions 13, 14 and 15, and
`02-CONTROL-PLANE/artifact-contracts.md` §5.5.

### 35.1 Phase 3 owns

| Owned by Phase 3 | This document |
|---|---|
| Composition principle and the four composition levels | §3, §4 |
| Content hierarchy classes and content weight scale | §6, §7 |
| Composition axes | §8 |
| Composition modes C01–C10 | §9 |
| Pattern taxonomy layering, families, metadata shape, parameters | §10–§13 |
| Sequencing *vocabulary* (drivers, classification levels, dependency relationships, transition types) | §15, §16 |
| Rhythm as a composition concept and the rhythm token vocabulary (**not** the per-language profiles, which are Phase 2's — see §17) | §17 |
| Contrast behaviours, anchors, quiet zones, tension mechanisms | §18–§21 |
| Creative intensity **bands** and the names of its influences (**not** the per-project score, which is Phase 4's — see §22.1) | §22 |
| Repetition budget and novelty dimensions | §23, §24 |
| Family balance categories | §25 |
| Constraint hierarchy and safety filter chain | §26 |
| Mobile / content / asset transformation concepts | §27–§29 |
| Pattern selection reasoning model | §30 |
| Pattern vs template rule | §31 |

### 35.2 Phase 3 references without redefining

| Concept | Authority |
|---|---|
| Technical, UX, accessibility and creative constraints | Phase 1 — `01-foundation.md` |
| The five design languages DL-01…DL-05 and their visual grammars | Phase 2 — `02-visual-design-languages.md`, `design-language-registry.md` |
| Per-language section rhythm profiles (reproduced in §17 for readability; Phase 2 governs) | Phase 2 §14.2 — matrix Row 26 |
| `motionIntensity`, `motionExpression`, `creativeBudget`, `creativeIntensity` | `parameter-registry.md` |
| `contentDensity`, `visualTension`, `assetDependency` | `parameter-registry.md` |
| `brandMaturity` (named in §22.1 prose as "Business maturity"; definition and range UNDEFINED) | `parameter-registry.md` §6.5 |
| The Design Blueprint contract and required shape | `02-CONTROL-PLANE/artifact-contracts.md` §5.5 |
| Business profile, content model, asset model | Upstream of Phase 3; not specified in the source |

### 35.3 Boundary crossings present in the source

Each crossing below is recorded with its disposition after the C-1..C-9
reconciliation pass:

| Source location | Crossing | Matrix position | Disposition |
|---|---|---|---|
| §33 / raw §3.39 | Names the Design Blueprint as the Phase 3 output | Blueprint is Phase 4 (Row 34) | **Resolved.** Reframed as an illustrative Phase 4 Composition Plan instance; §33.3 |
| §5 steps 1–7 / raw §3.3 | Business goals, visitor, content, assets, language choice inside the Phase 3 decision stack | Business Research and Phase 4 | **Resolved.** Reclassified as a non-normative whole-pipeline reasoning map; §5 |
| §17 / raw §3.8 | Per-language rhythm profiles duplicated from Phase 2 | Rhythm profile is Phase 2 (Row 26) | **Resolved.** Recast as a reference to Phase 2 §14.2, which governs; §17 |
| §22.1 / raw §3.21 | States creative intensity bands and influences | Derivation is Phase 4 | **Resolved.** Bands are vocabulary; the score is a Phase 4 value; derivation UNDEFINED; §22.1 |
| §12 / raw §3.14 | Applies project- and language-scoped parameter names to a pattern | Parameters are registry-scoped | **Resolved.** Read as fit statements under distinct fit identifiers; §12.2 |
| §15.2 / raw §3.17 | Per-industry mandatory/avoid assignments | Phase 4 decides per business | **Marked non-normative**; §15.2 |
| §15.1 / raw §3.16 | Named orderings (Trust before Services; Atmosphere before Reviews) | Phase 4 sequencing decision | Preserved as vocabulary; the ordering *relationships* are Phase 3, the applied sequence is Phase 4 |
| §24 / raw §3.24 | Novelty evaluation before finalisation | Result evaluation is Phase 6 (Row 43) | **Open** — §36 item 4. Two checks or one misplaced check is still unstated |
| §34 / raw §3.40 | Pipeline includes `NEXT.JS BUILD` | Phase 5 | Preserved as the source's own architectural summary; no ownership transferred |
| §32 / raw §3.31–§3.33 | Complete per-business outcomes including language choice and sequence | Phase 4 | **Marked non-normative**; §32 |

**Interpretation applied.** In every case above, the source content is preserved and
framed as Phase 3 *vocabulary* or as a non-normative source *example*, not as a Phase
3 decision right. No Phase 4 decision logic has been imported as a Phase 3 rule, no
Phase 5 implementation rule has been added, and no Phase 6 critic rule has been added.
Five crossings are resolved by the reframings recorded in §36.1; two are marked
non-normative; one remains open.

### 35.4 What Phase 3 does not decide

Per the critical ownership distinctions governing this canonicalization:

- Which sections a specific business receives, and in what order — **Phase 4**.
- Which design language a specific business receives — **Phase 4**.
- How any pattern is implemented in code, tokens or components — **Phase 5**.
- Whether the generated result is good — **Phase 6**.

Phase 3 supplies the vocabulary those phases draw on.

---

## 36. Open Questions / Ambiguities

Items below are marked **RESOLVED** where the C-1..C-9 reconciliation pass settled
them by reframing, and left as written where they remain genuinely open. No item has
been filled in with invented content, and nothing has been silently reconciled: every
resolution is a framing decision recorded in this document and in the registries.

### 36.1 Cross-phase conflicts

**1. Design Blueprint ownership — RESOLVED.** Raw §3.39 names the Design Blueprint as
the Phase 3 output; `phase-ownership-matrix.md` Row 34 assigns it to Phase 4.
Resolved by reframing §33: what the source describes is an illustrative **Phase 4
Composition Plan**, a proper subset of the blueprint contract in
`artifact-contracts.md` §5.5. Phase 3 emits **only vocabulary**. No Control Plane
change was required. See §33.3 and §35.0.

**2. Decision-stack ownership — RESOLVED.** Raw §3.3's fifteen steps are a
**non-normative whole-pipeline reasoning map**, not a claim of Phase 3 ownership.
Steps 1–6 are Business Research, step 7 is Phase 4, steps 8–14 are Phase 4 decisions
made in Phase 3 vocabulary, and step 15 is Phase 6. No step is a Phase 3 decision.
See §5.

**3. Rhythm profile duplication — RESOLVED.** Rhythm splits three ways: the
per-language profile is **Phase 2's** (§14.2, matrix Row 26), rhythm as a composition
concept and its token vocabulary are **Phase 3's** (§17), and the concrete per-project
sequence is **Phase 4's** (Row 34). §17's table is a reference to Phase 2, which
governs. `design-language-registry.md` §8 item 17 is closed as two distinct
constructs. See §17.

**4. Novelty evaluation vs Phase 6 — OPEN.** Raw §3.24 places a novelty check inside
composition; the matrix assigns result evaluation to Phase 6. Whether these are two
distinct checks or one misplaced check is unstated. Not addressed by this pass, and
`noveltyThreshold` and `noveltyComparison` remain UNDEFINED. See §24.2.

**5. `creativeIntensity` ownership and scope — RESOLVED as to ownership; derivation
UNDEFINED.** The bands and the six influence names are Phase 3 **capability**
vocabulary. The per-project score is a **Phase 4 value**. How the six influences
combine into a score is **UNDEFINED** and assigned to Phase 4; no formula has been
invented. Pattern-scoped occurrences are read as `patternIntensityFit`. See §22.1
and §12.2.

**6. `brandMaturity` — RESOLVED as to correspondence; effect UNDEFINED.** Raw §3.21's
"Business maturity" **is** the registry's `brandMaturity`, recorded as a terminology
variant in `parameter-registry.md` §6.5. `brandMaturity` is the canonical identifier.
Its effect on `creativeIntensity` remains **UNDEFINED** and assigned to Phase 4;
`parameter-registry.md` §7 issue 14 stays open. See §22.1.

**7. Pattern-level vs project/language-level parameter scope — RESOLVED as to
statement kind; aggregation UNDEFINED.** A parameter name applied to a pattern is a
**fit** statement, read under the distinct fit identifiers `patternIntensityFit`,
`patternTensionFit` and `patternDensityFit`. The unqualified registry names remain
reserved for Phase 4 **values**. How pattern fit aggregates into a project value is
**UNDEFINED** and assigned to Phase 4. Items 5 and 7 interact: both concern the same
fit-to-value gap and neither supplies the missing rule. See §12.2 and
`parameter-registry.md` §8 decision 13, §7 issue 21.

**8. `imageDependency` vs `assetDependency` — RESOLVED.** The source uses
`imageDependency` (§3.14) and `image_dependency` (§3.39); the registry canonical name
is `assetDependency`, which governs per `parameter-registry.md` §8 decision 14. The
source forms are recognised terminology variants. Mapped in §12.3 and §33.2, and not
rewritten inside the source quotes. The mapping was already correct before this pass;
this item records it as settled rather than open.

**9. Casing convention — RESOLVED.** `camelCase` in raw §3.14 against `snake_case` in
raw §3.39 for the same parameters. `camelCase` governs field identifiers per
`parameter-registry.md` §8 decision 15; `snake_case` source forms are legacy variants
that map to it. The convention is scoped to field identifiers and does not restyle
prefixed construct IDs (`C01`, `S01`, `DL-01`), uppercase classification constants
(`MANDATORY`, `PRIMARY`), natural-language prose names, or verbatim source
quotations. See §33.2.


### 36.2 The pattern library gap

**10. Zero patterns are specified.** Raw §3.38 targets "roughly 87" composition
patterns. The source specifies **none** of them. Fourteen family prefixes exist with
names only; eight pattern IDs appear illustratively; one partial metadata example
(`S01`) exists. Every field in the Pattern Data list for this canonicalization — name,
composition mode, compatible design languages, content density, asset dependency,
creativity, visual tension, motion, best-fit conditions, avoidance conditions,
responsive behaviour, signature characteristics — is unpopulated for all patterns
except `S01`, and even `S01` has no name, no responsive behaviour and no signature
characteristics. This is the largest open item in Phase 3. See §14.

**11. Implied but unspecified IDs.** Five of the eight source IDs are not the first
in their family (Hero fourth, Trust fourth, People second, Transformation second,
Booking second), which implies lower-numbered siblings. None of those implied
patterns exists in the source, and no identifier for any of them is written
anywhere in this document. Five families (A, ST, PR, G, F) have no ID instance at
all. Not created here. See §14.2.

**12. Family/target-list mismatch.** Raw §3.13 names family `A — About/Story` and
`ST — Statistics`; raw §3.38 lists "7 Story" and "4 Stats". Whether "Story" is the
whole of family A or only part of it, and whether "Stats" is `ST`, is unstated.

**13. Pattern names without IDs.** `Editorial Index`, `Asymmetric Image Grid` and
`Editorial Service Index` are named without IDs. No IDs inferred. See §14.3.

**14. Visual variant vocabulary.** Raw §3.12 introduces a `VISUAL VARIANT` layer
with one value, "Offset". No variant vocabulary is defined. See §10.

### 36.3 Undefined mechanisms

**15. Novelty mechanisms.** No scoring formula, no LOW/MEDIUM/HIGH thresholds, no
comparison algorithm, no comparison corpus, no cross-project memory, no dimension
weighting, no redesign iteration bound. Explicitly undefined. See §24.1.

**16. Pattern selection scoring.** Raw §3.30's ten terms have no weights, ranges,
units or measurement method, and the source declines mathematical implementation.
`Language Compatibility`, `Industry Compatibility`, `Content Compatibility`,
`Asset Compatibility`, `Conversion Compatibility` and `Creative Value` are named only
there and are otherwise undefined. See §30.

**17. Safety filter criteria.** The Business Safety, Usability and Accessibility
filters (raw §3.25) are named with no criteria, inputs or pass/fail conditions. The
accessibility filter names no standard; Phase 1 owns accessibility. See §26.2.

**18. Content hierarchy derivation.** Raw §3.4 requires classification into five
classes but states no rule for deriving it from a business profile. See §6.

**19. Content weight scale is unnamed** and its interaction with the five hierarchy
classes is unstated. An item may carry both; the source does not say how they
combine. See §7.

**20. Composition axis scale and polarity.** Raw §3.10's example uses numeric values
with no stated bounds, and uses `Asymmetry` while the axis list contains `Symmetry`.
See §8.

**21. Axes vs pattern parameters.** `Overlap` and `Alignment` appear in both raw
§3.10 and raw §3.15 with different value forms (numeric vs percentage/enumeration).
Same construct at two levels, or two constructs? See §13.

**22. Transition vocabulary duplication.** Raw §3.19's seven transitions overlap raw
§3.9's five contrast behaviours in different grammatical form. One vocabulary or
two? See §16.

**23. Rhythm token vocabulary is open.** Nineteen rhythm tokens are used across raw
§3.8, §3.32 and §3.39 without definition, without a closed list, and without mapping
to composition modes. Raw §3.32's gym rhythm also diverges from raw §3.8's Bold
profile. See §17, §32.2.

**24. `compositionModes` value `"editorial"`.** Raw §3.14 lists `editorial` as a
composition mode, but `editorial` is a design language name and is not among
C01–C10. Source error or a broader mode vocabulary? See §12.3.

**25. Composition mode / design language mapping.** No mapping exists between
C01–C10 and DL-01…DL-05, though several mode names resemble language
characteristics. None asserted. See §9.

**26. `C` prefix collision.** `C01`–`C10` are composition modes; `C` is the CTA
pattern family. Unacknowledged in the source. See §9.


**27. Chapter mechanism.** Raw §3.2 Level 2 gives a five-chapter example but no
chapter count rule and no rule for assigning sections to chapters. `CHAPTER
STRUCTURE` appears as a pipeline stage in raw §3.40 with no further definition. See
§4.2.

**28. Dependency graph is linear.** Raw §3.18 calls the construct a narrative graph
but both examples are linear chains. No branching, no optional nodes, no dependency
types. See §15.3.

**29. `Conditional` has no condition.** Raw §3.17's five-level classification
includes `Conditional` with no stated condition, and no mechanism maps an industry to
a classification. Casing differences among the five levels may or may not be
meaningful. See §15.2.

**30. Repetition budget granularity.** "Major use" is undefined; three of the five
budget entries are qualitative with no threshold; the two numeric limits are
introduced as examples. See §23.

**31. Anchor accounting.** Raw §3.6 says 3–5 anchors; raw §3.34 distributes 3–5 plus
a conversion anchor. Whether the conversion anchor counts inside the 3–5 is
unstated. See §19.

**32. Family balance ratios.** Raw §3.35's seven categories are to be balanced
"according to the language", with no per-language values and no mapping to the
composition modes they echo. See §25.

**33. Content transformation thresholds.** Raw §3.28 gives 3/8/20 services and
2/6/20 team members with no boundary rule for intermediate counts. See §28.

**34. Asset quality assessment.** "excellent" and "weak" photography are the only
levels named; no rubric or scale. See §29.

**35. Creative risk scale.** `creativeRisk` has no registry entry and no scale; only
"high" and "low" are used. The preference for low interaction risk is qualified by
"generally". See §22.2.

**36. Multi-language composition.** All three examples in raw §3.31–§3.33 pair a
primary with a secondary design language, but Phase 3 states no rule for how two
languages combine within one page. Raw §3.33 omits creative intensity entirely. See
§32.

**37. `CREATIVE PROFILE`.** Appears only in the raw §3.40 pipeline, with sub-nodes
Intensity, Tension and Density. Not defined anywhere in the source. See §34.

**38. Constraint hierarchy vs filter chain.** Raw §3.36's nine layers and raw
§3.25's four-step filter chain are never related to each other. Subset or separate
runtime check? See §26.2.

### 36.4 Absent content

**39. No tablet tier and no breakpoints.** The source describes desktop and mobile
only, with no viewport values and no implementation detail. A desktop → tablet →
mobile progression cannot be recorded because the middle term does not exist in the
source. See §27.3.

**40. No anti-patterns.** The source contains no anti-pattern section, list or
example. Raw §3.37's pattern-vs-template rule and raw §3.25's industry warnings are
the nearest content and are recorded in §31 and §26.2 respectively. No anti-pattern
catalogue has been invented.

**41. Unverifiable research citations.** "The research" is cited four times (raw
§3.16, §3.25, §3.26, §3.29) with no locatable document in this repository. The cited
claims are preserved as source statements; their provenance is unverified.

**42. Untested system.** The source's own closing commentary states Phase 3 has not
been tested against real businesses or generated websites. See §34.1.

**43. Upstream inputs unspecified.** `BUSINESS PROFILE`, `CONTENT MODEL` and
`ASSET MODEL` are named as Phase 3 inputs in raw §3.0 with no contract, schema or
field list anywhere in the source. See §1.


---

## 37. Summary

Phase 3 supplies a **composition vocabulary**, not a pattern library. What exists and
is usable today:

- One core principle: composition over components; the AI composes an experience
  rather than assembling sections.
- Four composition levels, from page journey down to element placement.
- A fifteen-step decision stack describing the reasoning order.
- Five content hierarchy classes (the source's one MUST) and a 1–5 content weight
  scale.
- Ten composition axes and ten composition modes `C01`–`C10`, with modes chosen
  before patterns.
- A five-layer pattern selection structure: content purpose → composition mode →
  pattern → visual variant → creative parameters.
- Fourteen pattern family prefixes and names.
- A target metadata shape, demonstrated once on `S01`.
- Sequencing vocabulary: six ordering drivers, five classification levels, dependency
  relationships, seven transition types.
- Rhythm profiles per design language, five contrast behaviours, an anchor system with
  a distribution rule, quiet zones, ten tension mechanisms.
- Creative intensity bands, the intensity/risk distinction, a repetition budget, nine
  novelty dimensions, seven balance categories.
- A nine-layer constraint hierarchy and a four-step safety filter chain.
- Mobile transformation (transform, not shrink), content-driven transformation, and
  asset-driven transformation.
- A ten-term selection reasoning model, explicitly not yet mathematical.
- The pattern-versus-template rule that keeps the vocabulary from collapsing into
  templates.
- Three worked examples and one example design blueprint.

What does not exist: **the patterns themselves**. Zero of the roughly 87 targeted
patterns are specified. Novelty mechanisms, selection weights, safety filter criteria,
and most thresholds are undefined. There is no tablet tier and no anti-pattern
content. Forty-three open items are recorded in §36.

Phase 3 is therefore ready to be *referenced* as a vocabulary and is **not** ready to
drive automated pattern selection. Populating the pattern library is the next
substantive body of work, and it is a specification task rather than a
canonicalization task.

