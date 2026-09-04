---
document: Blogspage AI Design System V1
phase: 5
name: AI Website Implementation & Creative Preservation
status: canonical
version: 1.0.0
source: 05-ai-implementation-raw.md
---

# Blogspage AI Design System V1

# Phase 5 — AI Website Implementation & Creative Preservation

**Derived from:** `01-DOCUMENTATION/05-ai-implementation-raw.md`. The raw source is
organised as fifty-nine numbered subsections (§5.0–§5.58). Section references written
as "raw §5.n" in this document cite those subsection numbers.

**Scope boundary:** Phase 5 is the **implementation** phase. It consumes the approved
Design Blueprint and Composition Plan produced by Phase 4 and produces a rendered
website plus an implementation report. Phase 5 answers **how** the approved design is
built. It does not answer **what** the business should receive — that is Phase 4's
decision, already made and approved. Where the raw source restates a construct that
Phase 1, 2, 3 or 4 owns, this document references the owning phase rather than
redefining it.

**Phase 5 consumes two Phase 4 artifacts and produces two of its own:**

```
Design Blueprint     (Phase 4-owned, embeds the Composition Plan)
    |  consumed by
Implementation Engineer
    |  produces
Website source  +  Implementation Report   (Phase 5-owned, per project)
    |  consumed by
Phase 6              (independent critique)
```

See `02-CONTROL-PLANE/artifact-contracts.md` §5.5 and §5.6,
`02-CONTROL-PLANE/agent-roles.md` §3.4, and
`03-REGISTRY/phase-ownership-matrix.md` Phase 5 rows.

**Normative language:** MUST, SHOULD and MAY carry their source strength. The raw
Phase 5 source is predominantly advisory in phrasing but carries a small set of
genuine prohibitions, which §2.3 inventories in full. Where the source uses
first-person editorial phrasing ("I would put this at the very top", "we should
eventually keep"), this document marks the statement as source commentary rather than
promoting it to a requirement.

**Identifier naming:** The raw source uses legacy design language names and spaced
prose labels for fields ("Image dominance", "Creative intensity"). Registry canon is
`DL-01`…`DL-05` for design languages and `camelCase` for machine-readable fields. §4.5
carries the full mapping. Source spelling is preserved verbatim inside quoted source
blocks and illustrative instances.

---

## 1. Purpose

Phase 5 converts the Phase 4 Design Blueprint into a real, production-ready website
while preserving its creative intent (raw §5.0).

The implementation agent has one core responsibility, stated by the source as its
single defining sentence:

> **Translate the approved design strategy into code without flattening, simplifying,
> or replacing its visual identity.**

The source grounds this in its own research rationale:

> The research's composition-over-configuration principle supports this separation:
> reusable technical infrastructure should enable dynamic composition rather than
> dictate it.

### 1.1 The Complete Responsibility Chain

Raw §5.1 expresses the full chain from blueprint to delivered site:

```
PHASE 4 DESIGN BLUEPRINT
    |
IMPLEMENTATION INTERPRETATION
    |
IMPLEMENTATION PLAN
    |
FOUNDATION + TOKENS
    |
PRIMITIVES
    |
COMPOSITION PATTERNS
    |
PAGE ASSEMBLY
    |
RESPONSIVE IMPLEMENTATION
    |
INTERACTION + MOTION
    |
SEO + ACCESSIBILITY + PERFORMANCE
    |
RENDERED WEBSITE
    |
CREATIVE QA
    |
CORRECTION
    |
FINAL WEBSITE
```

The source names the key addition to this chain explicitly:

> The key addition is: **Creative QA**
>
> The build isn't complete when the code works.

That statement is the organising principle of the whole phase. It is reinforced
independently by `02-CONTROL-PLANE/quality-gates.md`, which states that passing
Implementation Validation is not a quality verdict and never substitutes for one: a
successful build satisfies no gate on its own.

### 1.2 The Two Governing Rules

Raw §5.57 states what the source itself considers the two most important Phase 5
rules. Source commentary frames them ("I would put this at the very top of the future
coding-agent instructions"); the rules themselves are preserved at full strength:

> **You are not free to make the website look generic simply because generic
> implementation is easier. Preserve the visual intent of the Design Blueprint.**

> **You are not required to implement a creative idea literally when doing so harms
> usability, accessibility, responsiveness, performance, or maintainability. Preserve
> the intent and adapt the implementation intelligently.**

> Those two rules give us the balance.

The two rules are complementary, not competing. The first forbids convenience-driven
simplification. The second permits intelligent adaptation under genuine constraint.
Neither licenses a silent change: adaptation under the second rule is subject to the
exception-handling procedure in §23.

---

## 2. Scope

### 2.1 What Phase 5 supplies

| Construct | This document | Raw |
|---|---|---|
| Purpose and responsibility chain | §1 | §5.0, §5.1 |
| The two governing rules | §1.2 | §5.57 |
| Implementation inputs | §3 | §5.4, §5.14 |
| Blueprint consumption and non-redesign rule | §4.1 | §5.2 |
| Identifier and registry mapping | §4.5 | §5.4, §5.30 |
| Implementation Contract | §4.3 | §5.4 |
| Creative Invariants | §4.4 | §5.5 |
| Implementation Plan | §4.6 | §5.6 |
| Blueprint-driven assembly and pattern resolver | §4.7, §4.8 | §5.14, §5.15 |
| Technology baseline | §5.1 | §5.7 |
| Architecture layers | §5.2 | §5.8 |
| Reusable infrastructure vs visual templates | §6 | §5.10, §5.12 |
| Foundation layer | §7.1 | §5.9 |
| Primitive layer | §7.2 | §5.10 |
| Pattern layer | §7.3 | §5.11 |
| Section layer | §7.4 | §5.12 |
| Business layer | §7.5 | §5.13 |
| Design token application and philosophy | §8 | §5.16, §5.17 |
| Controlled creative exceptions | §8.3 | §5.18 |
| Typography implementation and preservation | §9 | §5.19, §5.20 |
| Layout implementation | §10 | §5.8, §5.10 |
| Image implementation | §11.1 | §5.21 |
| Authentic asset priority | §11.2 | §5.22 |
| Missing asset strategy | §11.3 | §5.23 |
| Video strategy | §11.4 | §5.36 |
| Asset provenance | §11.5 | §5.51 |
| Responsive implementation and transformation | §12 | §5.24, §5.25, §5.26 |
| Motion system and reduced motion | §13.1, §13.2 | §5.27, §5.28 |
| Interaction quality | §13.3 | §5.29 |
| Navigation implementation | §13.4 | §5.30 |
| Accessibility | §14 | §5.34, §5.48 |
| SEO implementation | §15 | §5.33 |
| Performance | §16 | §5.35 |
| Business content and conversion implementation | §17 | §5.13, §5.31, §5.46 |
| Forms | §18.1 | §5.32 |
| Third-party integration layer | §18.2 | §5.37 |
| Creative preservation rule | §19.1 | §5.39 |
| Anti-generic inspection | §19.2 | §5.45 |
| Rendered result as QA source of truth | §20.1 | §5.40 |
| Visual QA loop | §20.2 | §5.41 |
| Design drift detection | §20.3 | §5.42 |
| Creative Fidelity score | §20.4 | §5.43 |
| Premium Quality score | §20.5 | §5.44 |
| Code quality | §21.1 | §5.38 |
| Conversion QA | §21.2 | §5.47 |
| Responsive QA matrix | §21.3 | §5.49 |
| Visual regression | §21.4 | §5.50 |
| Final delivery checklist | §21.5 | §5.53 |
| Implementation report | §21.6 | §5.54 |
| Exception handling | §22.1 | §5.3 |
| Implementation failure handling | §22.2 | §5.52 |
| Phase boundaries and internal roles | §23 | §5.2, §5.55, §5.58 |
| Complete Phase 5 pipeline | §23.4 | §5.56 |
| Open questions | §24 | — |
| Summary | §25 | — |

Every one of the fifty-nine raw subsections appears in the table above. No raw
subsection has been dropped.

### 2.2 What Phase 5 does not supply

| Construct | Owner |
|---|---|
| Business strategy, positioning, value proposition | Phase 4 |
| Business facts, reviews, credentials, statistics | Business research, human-verified |
| Design language selection | Phase 4 (selection); Phase 2 (the languages) |
| Composition vocabulary, pattern families, composition modes | Phase 3 |
| Pattern selection and parameterization | Phase 4 |
| Section sequence, narrative strategy, rhythm distribution | Phase 4 |
| The Design Blueprint and Composition Plan | Phase 4 |
| Accessibility requirements themselves | Phase 1 Foundation |
| Structural primitives, grid, spacing, type mechanics | Phase 1 Foundation |
| Independent quality verdict on the finished website | Phase 6 |
| Final delivery approval | Human approver |

Phase 5 **implements** every construct above. It does not author any of them. Per
`03-REGISTRY/phase-ownership-matrix.md`, an implementer must not alter a rule to fit
the implementation.

### 2.3 Normative inventory

The raw source's genuine requirement-strength statements, in full. Everything not
listed here is advisory or illustrative in the source and is preserved at that
strength.

| # | Requirement | Raw | Source strength marker |
|---:|---|---|---|
| 1 | Phase 5 MUST NOT redesign Phase 4 | §5.2 | "This remains a hard rule" |
| 2 | Never silently redesign | §5.3 | "Never silently redesign." |
| 3 | Typography MUST preserve the blueprint's hierarchy | §5.19 | "must preserve" |
| 4 | The coding agent MUST check the typographic outcomes in §9.2 | §5.20 | "must check" |
| 5 | No unverified or fabricated imagery in the final build | §5.22 | "NO unverified/fabricated imagery in final" |
| 6 | The agent MUST NOT silently substitute generic stock photography | §5.23 | "should **not** silently substitute" |
| 7 | Each major composition MUST have desktop, tablet and mobile strategies | §5.24 | "must have" |
| 8 | Every motion-heavy design MUST support `prefers-reduced-motion` | §5.28 | "must support" |
| 9 | All interactive elements need the eight states in §13.3 | §5.29 | "need" |
| 10 | Phase 5 does not invent its own conversion hierarchy | §5.31 | "It does not invent" |
| 11 | Every project MUST support the SEO items in §15 | §5.33 | "should support", applied to every project |
| 12 | The implementation engine MUST enforce the accessibility items in §14 | §5.34 | "must enforce", "hard constraints inherited from Foundation" |
| 13 | The premium visual experience MUST remain fast | §5.35 | "must remain fast" |
| 14 | Missing integration credentials MUST be reported, never invented | §5.37 | "reported rather than invented" |
| 15 | Never simplify the design merely because a simpler implementation is easier | §5.39 | "hard Phase 5 rule", "Never" |
| 16 | Never add complexity the design does not justify | §5.39 | "Never" |
| 17 | The agent MUST inspect the actual rendered result, not merely the code | §5.40 | "must inspect", "This is essential." |
| 18 | The visual QA loop is mandatory | §5.41 | "should be mandatory" |
| 19 | The coding agent MUST verify the business facts in §17.3; no invented information | §5.46 | "must verify", "No invented information." |
| 20 | Do not make the site generic because generic is easier | §5.57 | Stated as the first rule |
| 21 | Preserve intent and adapt implementation under genuine constraint | §5.57 | Stated as the second rule |

**Requirements 5, 6, 12, 14 and 19 are reinforced by the Control Plane** and are
absolute regardless of the source's softer phrasing. `quality-gates.md` makes invented
or placeholder business facts in rendered output, and the use of discovered, pending or
rejected assets, blocking conditions; `agent-roles.md` states the Implementation
Engineer must not invent business content or substitute placeholder facts.

### 2.4 Source commentary, not requirement

The following raw statements are authorial reflection. They are preserved as
commentary and carry no requirement strength.

| Raw | Statement |
|---|---|
| §5.5 | "This is a major improvement." |
| §5.17 | "This protects both creativity and maintainability." |
| §5.18 | "This is important." |
| §5.39 | "That gives us the balance." |
| §5.50 | "we should eventually keep screenshots" — a stated future intention, not a current requirement |
| §5.52 | "This is much better than hiding problems." |
| §5.55 | "At this point, I would actually divide Phase 5 into three internal roles" |
| §5.55 | "This is a major improvement over the previous Phase 5." |
| §5.57 | "I would put this at the very top of the future coding-agent instructions" |
| §5.58 | "there is one final layer I would eventually add" — Phase 6, since established |

---

## 3. Implementation Inputs

Phase 5 begins only when a Phase 4 Design Blueprint has been approved. The inputs are:

| Input | Owner | Phase 5 use |
|---|---|---|
| Design Blueprint | Phase 4 | The authoritative statement of what is to be built |
| Composition Plan (embedded in the blueprint) | Phase 4 | Per-section mode, pattern and parameters |
| Verified business facts | Business research, human-verified | Content of the business layer (§7.5) |
| Approved assets and their metadata | Asset approval, human-verified | Image and video implementation (§11) |
| Foundation constraints | Phase 1 | Hard constraints that bound every choice |
| Design language definitions | Phase 2 | Token and expression values |
| Pattern and composition vocabulary | Phase 3 | The meaning of each pattern the blueprint names |

Phase 5 has no authority to supply a missing input by inference. A missing input is a
gap to be reported through §22.2, not a blank to be filled.

---

## 4. Blueprint Consumption

### 4.1 Phase 5 must not redesign Phase 4

Raw §5.2 opens with "This remains a hard rule." The division of authority:

| Phase 4 determines | Phase 5 determines |
|---|---|
| What | How |
| Why | Technical implementation |
| Hierarchy | Responsive behavior |
| Visual direction | Interaction |
| Composition | Performance |

> The coding agent may **interpret implementation**, but should not casually replace
> creative decisions.

The permission and the prohibition are both narrow. "Interpret implementation" covers
the *how* column. "Should not casually replace creative decisions" covers the *what*
column. The word "casually" is the operative limit: a replacement is permitted only
under the genuine-conflict procedure of §22.1, never as a matter of convenience.

### 4.2 Interpretation versus replacement

| Permitted | Not permitted |
|---|---|
| Choosing DOM structure, wrappers, utility classes | Changing hero composition |
| Deciding component decomposition | Reducing image dominance the blueprint set |
| Selecting CSS technique for a stated effect | Replacing a named pattern with a simpler one |
| Adapting under a recorded, genuine conflict | Adapting because a literal build is harder |

### 4.3 The Implementation Contract

Raw §5.4: "Before writing code, the agent creates" an Implementation Contract, which
"becomes the coding agent's checklist."

The source states this as **one worked example for a fictional business**. It is the
only statement of contract structure in Phase 5: there is no field list, no schema, no
typing, and no required/optional marking anywhere in the source.

> **ILLUSTRATIVE INSTANCE — NON-NORMATIVE**
>
> Every value below is an example. This is not a preset, not a default, and not a
> template. Only the field *names* carry forward. Design language names appear in the
> source's original form; §4.5 maps them to canonical `DL-` identifiers.

```
IMPLEMENTATION CONTRACT

Design language:        Editorial Luxury
Primary influence:      Architectural
Creative intensity:     8
Visual tension:         7
Image dominance:        8
Typography dominance:   9

Required patterns:      H04  T04  S01  P02  R02  G04  B02

Required visual traits:
  - asymmetry
  - editorial whitespace
  - oversized typography
  - image overlap
  - sparse cards
  - restrained motion
```

**Field inventory.** Names only, with the owning phase of each value:

| Field | Canonical identifier | Value owner |
|---|---|---|
| Design language | `primaryLanguage` | Phase 4 selects; Phase 2 defines |
| Primary influence | `secondaryInfluence` | Phase 4 selects; Phase 2 defines |
| Creative intensity | `creativeIntensity` | Phase 4 (1–10) |
| Visual tension | `visualTension` | Phase 4 (1–10) |
| Image dominance | `imageDominance` | Phase 4 (1–10) |
| Typography dominance | `typographyDominance` | Phase 4 (1–10) |
| Required patterns | pattern IDs | Phase 4 selects; Phase 3 defines |
| Required visual traits | — **no canonical identifier exists** | Phase 4 |

**No schema has been authored here.** No field is typed, none is marked required, and
no value set is enumerated beyond what the owning phase already declares. "Required
visual traits" has no counterpart field in the Phase 4 Design Blueprint field contract
and no registry identifier; that gap is recorded in §24.

The source labels the field "Primary influence" while assigning it the *secondary*
language value ("Architectural", where the design language is "Editorial Luxury").
Phase 4 names this field `secondaryInfluence`. The label appears to be a source-level
slip; it is recorded in §24 and not silently renamed inside the quoted instance.

### 4.4 Creative Invariants

Raw §5.5 requires Phase 4 decisions to be marked at one of three preservation levels.
The examples are the source's own:

| Level | Meaning | Source examples |
|---|---|---|
| **MUST PRESERVE** | Not alterable by implementation | Hero composition · Primary headline scale · Image dominance · Section rhythm · Primary CTA hierarchy · Major visual anchors |
| **SHOULD PRESERVE** | Alterable only with recorded reason | Exact spacing · Minor crop · Secondary alignment · Small animation details |
| **IMPLEMENTATION FLEXIBILITY** | Freely chosen by Phase 5 | DOM structure · internal wrappers · utility classes · component decomposition · CSS implementation |

The source states the purpose directly:

> It prevents the agent from changing important design decisions simply because
> another implementation is easier.

Two limits on this construct as the source leaves it:

- The lists are **examples**, not closed sets. The source provides no rule for
  classifying a decision the three lists do not name.
- **Who assigns the level is unstated.** The source says decisions "should be marked"
  without saying whether Phase 4 marks them in the blueprint or Phase 5 derives them
  on intake. Recorded in §24.

### 4.5 Identifier and registry mapping

The raw source uses legacy design language names. Registry canon is `DL-01`…`DL-05`.
The mapping, from `03-REGISTRY/design-language-registry.md`:

| Raw name (§5.4, §5.30, §5.54) | Canonical |
|---|---|
| Editorial, Editorial Luxury | `DL-01` |
| Swiss | `DL-02` |
| Bold | `DL-03` |
| Soft | `DL-04` |
| Architectural | `DL-05` |

Machine-readable fields use registry `camelCase`: `creativeIntensity`,
`visualTension`, `imageDominance`, `typographyDominance`, `contentDensity`,
`assetDependency`, `motionExpression`, `motionIntensity`.

**Pattern identifiers.** The source names H04, T04, S01, P02, R02, G04 and B02. Five of
these — H04, T04, S01, P02 and B02 — match Phase 3's inventory of eight IDs. Two do not:

| Phase 5 ID | Phase 3 status |
|---|---|
| `R02` | Phase 3 records `R01` in the R — Reviews family. No `R02` exists. |
| `G04` | Phase 3's G family has no ID instance at all. |

This is a cross-phase identifier discrepancy. It is recorded in §24 and **not** resolved
here by substituting a similar-looking ID: Phase 3 owns the pattern vocabulary, and
adding to it is a factory change, not a Phase 5 decision. Note that Phase 3's inventory
is itself illustrative — it records that no pattern is actually specified in its source —
so the absence may reflect an incomplete library rather than a wrong ID in Phase 5.

### 4.6 Implementation Plan

Raw §5.6: "Before coding, generate", then "Then code." The plan is a precondition of
writing code, not a parallel activity.

| # | Plan element |
|---:|---|
| 1 | Route structure |
| 2 | Component tree |
| 3 | Token mapping |
| 4 | Pattern mapping |
| 5 | Content mapping |
| 6 | Asset mapping |
| 7 | Responsive strategy |
| 8 | Interaction strategy |
| 9 | Integration plan |
| 10 | QA plan |

The source states no format, no approval step, and no completeness test for the plan.
Recorded in §24.

### 4.7 Blueprint-driven assembly

Raw §5.14 — the page is assembled from the blueprint rather than hand-built per
business:

```
Blueprint
    |
Section map
    |
Pattern resolver
    |
Pattern parameters
    |
Content
    |
Rendered section
```

> That means the same technical system can implement different compositions.

This is the mechanism that makes §6's distinction real: one reusable technical system,
many distinct visual outcomes.

### 4.8 Pattern resolver

Raw §5.15 maps a section plus a pattern ID to a pattern component:

```
hero     + H04  ->  AsymmetricHero
services + S01  ->  EditorialServiceIndex
reviews  + R02  ->  ReviewMasonry
```

> The resolver should not become a giant if/else machine.
>
> Keep the mappings explicit and maintainable.

The resolver's failure behaviour when a blueprint names a pattern with no registered
implementation is **not specified** by the source. Recorded in §24.

---

## 5. Technology Baseline and Architecture

### 5.1 Technology baseline

Raw §5.7 states the stack for "your Blogspage system". This is the complete list the
source gives; nothing has been added to it:

| Item |
|---|
| Next.js |
| React |
| TypeScript |
| Tailwind CSS |
| CSS Variables / Design Tokens |
| Shadcn/UI selectively |
| Next/Image |
| Next/Font |
| Vercel-compatible architecture |

> The research specifically recommends Tailwind CSS v4's token-oriented CSS-first
> approach and responsive CSS primitives such as Grid and Container Queries.

Three limits on this list as the source leaves it:

- **No versions are pinned** except the reference to Tailwind CSS v4. No version is
  stated for Next.js, React or TypeScript.
- **"Selectively"** qualifies Shadcn/UI without stating the selection criterion.
- **No package beyond this list is authorised by Phase 5.** In particular the source
  names no animation library, no testing library, no visual-regression tool and no
  analytics package, while §13, §21.1 and §21.4 describe work that would ordinarily
  use them. Those gaps are recorded in §24 and are not filled here.

`agent-roles.md` places the technology baseline within the Implementation Engineer's
remit. Adding a dependency not on this list is an implementation decision that must be
recorded in the implementation report (§21.6) under code quality (§21.1), which
requires "minimal dependencies".

### 5.2 Architecture layers

Raw §5.8 — the generated project should conceptually contain:

```
FOUNDATION
    |
PRIMITIVES
    |
PATTERNS
    |
SECTIONS
    |
PAGE COMPOSITION
    |
BUSINESS CONTENT
```

And explicitly not:

```
page.tsx
└── 4,000 lines of JSX
```

The layering is the source's structural answer to a single failure mode: business
content and visual decisions tangled together in one file, which cannot be re-composed
for a different blueprint.

---

## 6. Reusable Infrastructure, Not Visual Templates

This distinction is the load-bearing idea of Phase 5's architecture. The source states
it in two places, once for each layer where it could be violated.

**At the primitive layer** (raw §5.10):

> Primitives should expose **capabilities**, not brand-specific styling.

**At the section layer** (raw §5.12) — a section describes content purpose plus
selected pattern:

```
<section type="services">
  pattern = "editorial-index"
</section>
```

rather than:

```
<DentalServicesSection />
```

> This keeps the architecture industry-independent.

**And at the business layer** (raw §5.13):

> This data should not be embedded throughout JSX.

### 6.1 What is reused and what varies

| Reused across every website | Varies per website |
|---|---|
| Foundation layer (§7.1) — "stable across business websites" | Token values at language and business tier |
| Primitive components (§7.2) | Which patterns are selected |
| Pattern implementations (§7.3) | Pattern parameters |
| The pattern resolver (§4.8) | Section sequence and rhythm |
| Section and business layer structure | Business content and assets |

The test is directional: technical infrastructure is shared, visual outcome is not. A
primitive that encodes a brand decision, or a section component named for an industry,
has crossed the line. Per the source's own framing in §1, "reusable technical
infrastructure should enable dynamic composition rather than dictate it."

**This is not a template system.** No visual template exists to be filled with a
different business's content. Two websites built from this infrastructure with
different blueprints are expected to look genuinely different, not like two skins of
one layout.

---

## 7. The Five Architecture Layers

### 7.1 Foundation layer

Raw §5.9. Contents:

| Item |
|---|
| tokens |
| grid |
| spacing |
| typography mechanics |
| responsive utilities |
| motion utilities |
| accessibility primitives |
| image utilities |

> This layer should be stable across business websites.

Every item here corresponds to something Phase 1 Foundation owns. Phase 5 supplies the
technical realisation; it does not set the rule. Where a Foundation constraint and an
implementation convenience conflict, the constraint governs.

### 7.2 Primitive layer

Raw §5.10. The source's examples, grouped by evident kind:

| Kind | Primitives |
|---|---|
| Layout | Container · Grid · Stack · Split · Bleed · Frame · Layer · Rail · Stage |
| Content | Heading · Text · Image · Badge · Icon |
| Interactive | Button · Link · Input |

> Primitives should expose **capabilities**, not brand-specific styling.

The grouping above is an organisational convenience of this document; the source
presents a single flat list and assigns no categories. The list is given as "Examples",
so it is not a closed set. No primitive's props, API or behaviour is specified anywhere
in the source.

### 7.3 Pattern layer

Raw §5.11. The source's examples:

AsymmetricHero · EditorialServiceIndex · TrustSpotlight · MasonryGallery ·
PractitionerStory · ProgramRail · ReviewMasonry · CinematicHero ·
StructuredServiceIndex

> Patterns implement compositional ideas from Phase 3.

The pattern layer is where Phase 3's vocabulary becomes code. The names above are
implementation component names, not Phase 3 pattern identifiers; §4.8 carries the
mapping between the two. The source defines no pattern's parameters, and states no
requirement that every Phase 3 pattern have an implementation. Recorded in §24.

### 7.4 Section layer

Raw §5.12. A section describes **content purpose plus selected pattern** — see §6 for
the full statement and the industry-independence rule that follows from it.

### 7.5 Business layer

Raw §5.13. Contains actual business information:

business · services · team · reviews · faq · locations · hours · contact · social

> This data should not be embedded throughout JSX.

Everything in this layer is human-verified business fact. Phase 5 places it; Phase 5
never authors it. Per §2.3 requirement 19 and the Control Plane, invented or
placeholder business facts in rendered output are a blocking condition.

---

## 8. Design Tokens

### 8.1 Three-tier token application

Raw §5.16 — tokens apply in three layers:

```
GLOBAL
    |
LANGUAGE
    |
BUSINESS
```

The source's worked example:

| Tier | Example |
|---|---|
| Global | spacing scale |
| Editorial (`DL-01`) | large section rhythm |
| Business | brand accent color |

> The research explicitly recommends this three-tier token structure.

The tiers correspond to the ownership split already established upstream: global tokens
realise Foundation mechanics, language tokens realise the Phase 2 design language, and
business tokens carry the one project-specific layer. Phase 5 authors no value at any
tier — it applies values the owning phase supplies.

The source does not state precedence when two tiers set the same token. Reading the
diagram as an override chain (business over language over global) is the natural
inference but is **not stated**. Recorded in §24.

### 8.2 Token philosophy

Raw §5.17. The rule is a preference with a recorded-exception clause, not a prohibition:

> The AI should not generate arbitrary values everywhere.

Prefer:

```
token  ->  semantic token  ->  pattern-specific usage
```

over:

```
mt-[137px]   mr-[43px]   gap-[29px]
```

> unless an intentional art-directed value is genuinely necessary.
>
> And when it is necessary: record why.

Two obligations follow, and both matter: prefer tokens, and **when departing, record
the reason**. An unrecorded arbitrary value fails the second obligation even if the
value itself was justified.

### 8.3 Controlled creative exceptions

Raw §5.18 makes the permission explicit. Premium design sometimes requires unusual
values — the source's examples are a headline offset of `17vw` and an image overlap of
`11%`. Of these the source says plainly: "That's fine."

The distinction the agent must draw:

| Legitimate | Not legitimate |
|---|---|
| intentional art direction | arbitrary inconsistency |

> A design system should not prevent creativity.
>
> It should prevent **accidental mess**.

The values `17vw` and `11%` are illustrations of the *kind* of value permitted. They
are not defaults, thresholds, or recommended figures. The source gives no test for
distinguishing art direction from inconsistency beyond the requirement in §8.2 to
record the reason; the recorded justification is what makes the difference inspectable.

---

## 9. Typography Implementation

### 9.1 Type roles and fluid sizing

Raw §5.19 opens with a requirement: "Typography must preserve the blueprint's
hierarchy." The implementation should support these roles, using fluid sizing:

Display · H1 · H2 · H3 · H4 · Body · Label · Caption · Navigation · CTA

> The research recommends fluid typography and emphasizes readable line lengths and
> contrast.

Fluid scaling is a Foundation-owned hard constraint, not a Phase 5 preference. Phase 5
implements the mechanism; it does not decide whether to. No numeric size, ratio, clamp
expression or scale value appears anywhere in the Phase 5 source, and none is supplied
here.

### 9.2 Typography preservation

Raw §5.20 — "The coding agent must check":

| Check |
|---|
| Headline wrap |
| Line count |
| Max width |
| Weight |
| Tracking |
| Line height |
| Mobile scale |

The source explains why these seven and not a declared font size:

> Because:
>
> `font-size: 72px`
>
> isn't the design.
>
> The **headline shape on the page** is the design.

This is the typographic case of the general rule in §20.1: the artifact under inspection
is the rendered outcome, not the declaration that was supposed to produce it. A correct
token that wraps a headline into four ragged lines has failed. All seven checks are
rendered-output observations, which is why they belong to the visual QA loop (§20.2) and
cannot be satisfied by reading code.

---

## 10. Layout Implementation

The source has no subsection dedicated to layout as a topic. Its layout content is
distributed across three places already canonicalised here:

| Layout concern | Where the source addresses it | This document |
|---|---|---|
| Layer ordering, page composition | §5.8 | §5.2 |
| Layout primitives (Container, Grid, Stack, Split, Bleed, Frame, Layer, Rail, Stage) | §5.10 | §7.2 |
| CSS layout mechanisms — Grid, Container Queries | §5.7 | §5.1 |
| Grid and spacing as Foundation concerns | §5.9 | §7.1 |
| Composition assembly from the blueprint | §5.14, §5.15 | §4.7, §4.8 |

**No grid definition, column count, gutter value, container width or breakpoint value
appears in the Phase 5 source.** Grid and spacing are Foundation-owned (§7.1) and the
composition itself is Phase 4-owned. Phase 5's layout responsibility is to realise both
without altering either. Nothing has been invented to fill this section.

Colour is the same case: the Phase 5 source has no colour subsection. Its only colour
statements are "brand accent color" as a business-tier token example (§8.1) and
"contrast" as an accessibility requirement (§14) and QA test (§14.2). Palette
definition belongs to Phase 2 and contrast minimums to Foundation. Phase 5 applies
colour through the token tiers and verifies contrast; it defines no palette.

---

## 11. Image, Video and Asset Implementation

### 11.1 Image implementation

Raw §5.21 opens with the governing statement: "Asset metadata drives implementation."

For every image, the metadata the implementation reads:

| Metadata field |
|---|
| subject |
| ratio |
| orientation |
| quality |
| priority |
| usage |
| position |
| crop preference |

What the implementation agent chooses in response:

| Implementation choice |
|---|
| object-fit |
| object-position |
| aspect ratio |
| crop |
| bleed |
| mask |
| overlap |

> rather than simply putting every image into a standard card.
>
> The research strongly emphasizes deliberate image ratios and editorial cropping as
> part of premium presentation.

The two lists are the phase boundary in miniature: metadata is supplied by the approved
asset record, and the treatment is Phase 5's decision. "Standard card" is named as the
failure mode — it is the image-level form of the generic drift that §19.2 inspects for.

### 11.2 Authentic asset priority

Raw §5.22 states a strict hierarchy:

```
Approved business assets
    |
Approved licensed assets
    |
Suitable placeholders during development
    |
NO unverified/fabricated imagery in final
```

> The research explicitly cautions around unauthorized scraping and recommends
> authenticated/authorized media sourcing.

The fourth level is a prohibition, not a tier. Placeholders are permitted **during
development only**; no unverified or fabricated image may appear in the final build.
The Control Plane reinforces this: use of discovered, pending or rejected assets in
rendered output is a blocking condition. "Approved" means human-approved — Phase 5
cannot approve an asset for itself.

### 11.3 Missing asset strategy

Raw §5.23. Where the blueprint expects a cinematic hero and the business has no
appropriate imagery, the prohibition comes first:

> The agent should **not silently substitute generic stock photography**.

The three permitted responses:

| Strategy | Response |
|---|---|
| A | Typography-led hero |
| B | Approved alternate image |
| C | Simplified visual composition |

> while preserving the visual intention.

All three preserve intent by other means rather than downgrading the design. Note what
is absent from the list: sourcing a new unapproved image. The strategies operate within
the approved asset set or move the composition to typography.

This is the §1.2 second rule in a concrete case, so the §22.1 exception procedure
applies: the substitution is a recorded deviation, not a silent one. Which strategy to
choose is left to judgement; the source states no selection rule. Recorded in §24.

### 11.4 Video strategy

Raw §5.36, for cinematic designs:

| Context | Treatment |
|---|---|
| Desktop | video may load progressively |
| Mobile | poster image / lightweight video / static alternative |

> The AI should not automatically ship huge background videos to every mobile visitor.

The mobile row is a set of three alternatives, not a sequence. No file-size threshold,
bitrate, duration or resolution is stated anywhere in the source, and none is added
here. "Huge" is the source's only magnitude term.

### 11.5 Asset provenance

Raw §5.51. For each final asset, maintain:

| Record |
|---|
| source |
| license/permission status |
| approval status |
| usage context |

> This is particularly important because your workflow may involve social media and
> Google Business Profile assets. The research specifically highlights API and policy
> constraints around these sources.

Provenance is what makes §11.2 auditable: without a per-asset record of source and
approval status, the prohibition on unverified imagery cannot be verified at delivery.
The source states no storage format or location for these records. Recorded in §24.

---

## 12. Responsive Implementation

### 12.1 Three required strategies

Raw §5.24 — each major composition **must** have:

| Tier |
|---|
| Desktop strategy |
| Tablet strategy |
| Mobile strategy |

> The research explicitly states that mobile should not simply be a compressed desktop
> design.

The prohibition on compressing desktop into mobile is a Foundation-owned hard
constraint, not a Phase 5 invention. Phase 5 restates and enforces it.

**On the tablet tier.** Phase 5 requires three strategies including tablet. Foundation
likewise requires desktop, tablet and mobile. Phase 3, however, defines responsive
transformation for desktop and mobile only and records that no tablet behaviour was
interpolated for its patterns. Phase 5 therefore requires a tablet strategy for which
Phase 3 supplies no per-pattern transformation. This is an upstream gap, not a conflict
resolved here: Phase 5 states the requirement its own source states, and the missing
Phase 3 layer is recorded in §24.

### 12.2 Responsive transformation

Raw §5.25 — every pattern should define its `desktop → tablet → mobile`
transformation. The source's worked example:

| Tier | Treatment |
|---|---|
| Desktop | asymmetric overlap |
| Tablet | reduced overlap |
| Mobile | stacked editorial composition |

> That's much better than simply adding:
>
> `md:flex-col`
>
> to everything.

The example is an illustration of one pattern's transformation, not a rule for all
patterns. What generalises is the requirement that each transformation be *designed*
and *declared per pattern*, rather than emerging from a reflexive utility class applied
uniformly.

**No breakpoint values are defined by Phase 5.** The tier names are strategy labels.
The viewport widths in §21.3 are inspection targets for QA, not breakpoints, and the
source is explicit on that point. Where breakpoint values are defined, if anywhere, is
recorded in §24.

### 12.3 Mobile as a creative composition

Raw §5.26 — mobile may change:

order · crop · scale · alignment · spacing · interaction · CTA position ·
typography · navigation

> It should feel intentionally designed.

This is a permission, and a broad one. Mobile is not a constrained derivative of the
desktop layout; it may differ across nine dimensions. The constraint is the closing
sentence: the difference must read as deliberate design, not as degradation.

The permission has one boundary worth stating explicitly, because the source's list
includes `order` and `CTA position`: reordering is a presentation decision and does not
license changing the conversion hierarchy Phase 4 set (§17.2), nor does it license
breaking the logical heading order Foundation requires (§14.2). Mobile may present the
primary CTA differently; it may not demote it.

---

## 13. Motion and Interaction

### 13.1 Motion system

Raw §5.27 — motion implementation should use reusable primitives:

Reveal · Fade · Slide · Scale · Mask · Stagger · Parallax · Marquee

> But the actual intensity comes from Phase 2/4.

The split is clean and matters: Phase 5 owns the **motion vocabulary as code**; Phase 2
and Phase 4 own **how much motion** and **in what character**. The registry records
`motionExpression` and `motionIntensity` as the identifiers carrying those values.

Phase 5 defines no duration, easing curve, delay or distance value. None appears in the
source. The upstream `motionIntensity` scale semantics are undefined at registry level,
which means Phase 5 receives an intensity value whose interpretation is not fully
specified — recorded in §24.

### 13.2 Reduced motion

Raw §5.28 — every motion-heavy design **must** support `prefers-reduced-motion`:

> and provide a useful non-motion experience.

Two obligations, and the second is the substantive one. Honouring the media query while
leaving content that only becomes visible through a reveal animation satisfies the
letter and fails the requirement. The non-motion experience must be *useful*, meaning
the content and its hierarchy remain fully available without motion.

Reduced motion is an accessibility requirement inherited from Foundation (§14). It is
absolute and is not traded against visual ambition.

### 13.3 Interaction quality

Raw §5.29 — all interactive elements need these eight states:

| State |
|---|
| default |
| hover |
| focus |
| active |
| disabled |
| loading |
| success |
| error |

> The research specifically emphasizes visible focus states and adequate interactive
> targets.

Focus visibility and touch-target adequacy are Foundation accessibility constraints, so
`focus` is not merely one of eight stylistic states — it carries independent
accessibility weight and cannot be omitted or rendered invisible for aesthetic reasons.

The source states no visual specification for any state, and no dimension for
interactive targets. Foundation owns touch-target minimums; Phase 5 does not restate a
number the Phase 5 source never gives.

### 13.4 Navigation implementation

Raw §5.30 — navigation expression varies by design language:

| Design language | Expression |
|---|---|
| Editorial (`DL-01`) | minimal / elegant |
| Swiss (`DL-02`) | structured |
| Bold (`DL-03`) | strong / graphic |
| Soft (`DL-04`) | subtle / floating |
| Architectural (`DL-05`) | minimal / cinematic |

> But core information architecture remains usable.

These are expression descriptors, not selections from Foundation's set of navigation
implementation types. Which implementation type each expression resolves to is not
stated by Phase 5 and is undefined upstream. Recorded in §24.

The closing clause is the binding half: Foundation requires brand, primary links and
primary CTA to remain accessible in every navigation implementation. No language's
expression may remove a required element. A "minimal" navigation is a visual treatment,
not permission to drop the primary CTA.

---

## 14. Accessibility

### 14.1 Accessibility is absolute

Raw §5.34 — "The implementation engine must enforce":

| Requirement |
|---|
| semantic HTML |
| keyboard navigation |
| focus visibility |
| contrast |
| touch targets |
| form accessibility |
| reduced motion |
| image alt text |

The source closes the subsection with the sentence that governs how the whole list is
read:

> These are hard constraints inherited from Foundation.

**Three consequences, stated plainly:**

1. **Phase 5 does not own these requirements.** Foundation does. Phase 5 enforces them.
   Phase 5 cannot relax, reinterpret or scope-limit any item on this list.
2. **They are not traded against creative ambition.** No level of `creativeIntensity`,
   no design language, and no visual concept purchases an exemption. Where an aesthetic
   goal conflicts with an accessibility minimum, the minimum wins and the goal must be
   re-expressed some other way. This is the Parameter Registry's position on
   accessibility parameters — absolute and non-overridable — applied at implementation.
3. **The §22.1 exception procedure does not apply to them.** That procedure resolves
   conflicts between a blueprint and an implementation constraint. Accessibility is not
   one side of such a negotiation; it is a boundary on every outcome. The §1.2 second
   rule names accessibility as a reason to adapt an implementation, never as something
   adaptation may cost.

**No specific standard, level or numeric threshold is stated in the Phase 5 source.**
No WCAG version, no conformance level, no contrast ratio, and no touch-target dimension
appears anywhere in it. Those values live in Foundation. None has been supplied here.

### 14.2 Accessibility QA

Raw §5.48 — the tests to run:

| Test |
|---|
| keyboard test |
| focus test |
| contrast test |
| heading hierarchy |
| alt-text test |
| form-label test |
| touch-target test |
| reduced-motion test |

The eight tests correspond one-to-one with the eight enforcement items in §14.1. Each
requirement has a matching verification, which is what makes the list enforceable rather
than aspirational.

The source names no tool, no automated checker and no pass threshold for any test.
Recorded in §24. `quality-gates.md` treats accessibility failures in rendered output as
blocking, so a failed test here is not a matter for judgement.

---

## 15. SEO Implementation

Raw §5.33 — every project should support:

| Item |
|---|
| Title |
| Description |
| Canonical |
| Open Graph |
| Structured Data |
| Semantic headings |
| Alt text |
| Sitemap |
| Robots |
| LocalBusiness schema |

> The research specifically recommends LocalBusiness structured data for local
> businesses.

Two items on this list are simultaneously accessibility requirements: semantic headings
and alt text. Where the two purposes could diverge, the accessibility obligation
governs — alt text describes the image for a user who cannot see it, and is not a
keyword field.

All SEO content derives from verified business facts. The prohibition on invented
information in §17.3 applies to metadata exactly as it applies to visible copy: a
fabricated description or a `LocalBusiness` schema containing unverified hours is
invented business content in rendered output.

The source states no character limits, no title format, and no schema property list.
None is supplied here.

---

## 16. Performance

Raw §5.35 opens with the requirement: "The premium visual experience must remain fast."

What the engine should consider:

| Factor |
|---|
| image dimensions |
| image format |
| lazy loading |
| priority loading |
| video strategy |
| fonts |
| third-party scripts |
| JavaScript |
| layout shifts |
| animation cost |

**No performance budget, metric, score or threshold appears in the Phase 5 source.** No
Core Web Vitals target, no load-time figure, no bundle-size limit, and no Lighthouse
score is stated. The list above is a list of *factors to consider*, not measurements to
hit. Nothing numeric has been added here; the absence is recorded in §24.

The requirement's phrasing sets the relationship between performance and visual
ambition: the premium experience must *remain* fast, meaning performance is a property
the design must retain rather than a competing goal to be balanced against it. Where a
visual technique cannot be made performant, that is a §22.1 conflict — the intent is
preserved and the implementation adapted, per the §1.2 second rule, which names
performance explicitly.

---

## 17. Business Content and Conversion

### 17.1 Business content placement

The business layer (§7.5) holds the verified facts. Phase 5's obligation is placement
and presentation, never authorship. The full content set from raw §5.13:

business · services · team · reviews · faq · locations · hours · contact · social

### 17.2 Conversion implementation

Raw §5.31 — the coding agent consumes Phase 4's conversion hierarchy:

| Level |
|---|
| Primary CTA |
| Secondary CTA |
| Utility action |

> It does not invent its own conversion hierarchy.

The source's examples of how the three levels resolve per business type:

> **NON-NORMATIVE EXAMPLES.** These illustrate that CTAs are contextual. They are not
> industry presets and bind no project. Phase 4 selects the actual actions.

| Business | Primary | Secondary | Utility |
|---|---|---|---|
| Dental | Book | WhatsApp | Call |
| Gym | Start Trial | WhatsApp | Directions |
| Restaurant | Reserve | Menu | Directions |

> The research supports this contextual CTA approach.

Phase 5 implements the hierarchy Phase 4 set: which action is primary, which secondary,
which utility. Phase 5 decides how each is rendered, positioned and made accessible —
including the mobile presentation permitted by §12.3 — but may not reorder the
hierarchy itself.

### 17.3 Business-specific inspection

Raw §5.46 — "The coding agent must verify":

| Item |
|---|
| Business name |
| Services |
| Location |
| Contact |
| Hours |
| Reviews |
| Credentials |
| CTAs |
| Images |

The subsection closes with three words that carry the weight:

> No invented information.

This is absolute and is reinforced by the Control Plane, which treats invented or
placeholder business facts in rendered output as a blocking condition. It applies to
every surface: visible copy, metadata (§15), structured data, alt text, and integration
configuration. A plausible-sounding opening hour is invented information. So is a
credential the research did not verify.

Where required content is missing, the response is a `CONTENT GAP` report under §22.2 —
not a plausible substitute.

---

## 18. Forms and Integrations

### 18.1 Forms

Raw §5.32 — implementation should prioritize:

| Priority |
|---|
| few fields |
| clear labels |
| inline validation |
| mobile usability |
| success state |
| error state |

> Avoid unnecessary contact-form complexity, consistent with the research's
> low-friction conversion findings.

"Clear labels" is also a Foundation accessibility requirement — form accessibility
appears in the §14.1 enforcement list and the form-label test in §14.2. A visually
implied label is not a label.

The source states no field count, no validation library, and no submission mechanism.
None is supplied here.

### 18.2 Third-party integration layer

Raw §5.37 — standardized integration support:

| Integration |
|---|
| Booking |
| WhatsApp |
| Google Maps |
| Analytics |
| Forms |
| Reservations |
| Social |
| CRM |

> But missing credentials should be reported rather than invented.

The closing clause is a hard prohibition in effect: a fabricated API key, placeholder
booking URL or invented map coordinate is invented business configuration. Missing
credentials produce an `INTEGRATION GAP` report under §22.2, and the implementation
report (§21.6) records them — the source's own example report lists "Missing: Booking
API credentials" for exactly this reason.

No provider, SDK, endpoint or configuration schema is named for any integration in the
source. Recorded in §24.

---

## 19. Creative Preservation

### 19.1 The creative preservation rule

Raw §5.39 states this as "a hard Phase 5 rule":

> **Never simplify the design merely because a simpler implementation is easier.**

The permitted consequence:

```
Design complexity  ->  Implementation complexity
```

> should be accepted when it is genuinely required to preserve the intended experience.

And the symmetrical prohibition:

> **Never add complexity that the design does not justify.**

Two prohibitions, pointing in opposite directions:

| Prohibited | Failure mode |
|---|---|
| Simplifying because implementation is easier | The design is flattened; the site drifts generic |
| Adding complexity the design does not justify | Gratuitous engineering; maintainability lost for nothing |

The test in both directions is the same: does the design justify it? Complexity that
serves the intended experience is accepted. Complexity that serves nothing is not.
Simplicity that serves the implementer's convenience is not.

### 19.2 Anti-generic inspection

Raw §5.45 — explicitly inspect:

| Inspection question |
|---|
| Did the page drift into a generic hero? |
| Did services become a standard 3-card grid? |
| Did cards become overly rounded? |
| Did all sections become the same height? |
| Did image/text alternation become repetitive? |
| Did the visual rhythm flatten? |
| Did the site become SaaS-looking? |
| Did mobile become a compressed desktop? |

> The research's anti-pattern list supports these checks.

These eight questions are the operational form of §19.1's first prohibition. Each names
a specific way an implementation converges on the generic default despite a distinctive
blueprint — and each is observable only in the rendered result, not in code.

The last question restates a Foundation-owned hard constraint (§12.1). The others align
with universal and language-level anti-patterns owned upstream; Phase 5 inspects for
them but does not author the anti-pattern lists.

The source states no pass threshold and no procedure for a failed question. A failure
here is design drift, so §20.2's loop applies: fix and re-render.

---

## 20. Creative QA and Fidelity

### 20.1 The rendered result is the source of truth

Raw §5.40 — after implementation, the agent **must** inspect the actual rendered result:

> Not merely the code.

```
Code
    |
Browser
    |
Rendered page
    |
Visual inspection
```

> This is essential.

This is the premise the whole QA section rests on. Correct code that produces a wrong
page has failed. The seven typographic checks in §9.2, the eight anti-generic questions
in §19.2 and the nine drift categories in §20.3 are all rendered-output observations for
this reason.

### 20.2 Visual QA loop

Raw §5.41:

```
BUILD
    |
RENDER
    |
INSPECT
    |
COMPARE TO BLUEPRINT
    |
IDENTIFY DRIFT
    |
FIX
    |
RENDER AGAIN
```

> This loop should be mandatory.

The loop ends with `RENDER AGAIN`, not with `FIX`. A fix is not complete until the
re-rendered result has been inspected. The source states no iteration limit and no exit
criterion for the loop; both are recorded in §24.

### 20.3 Design drift detection

Raw §5.42 — the categories to check:

| Drift category |
|---|
| Hero drift |
| Typography drift |
| Spacing drift |
| Image drift |
| Section rhythm drift |
| CTA drift |
| Pattern drift |
| Mobile drift |
| Motion drift |

The source's example of what drift means concretely:

| Phase 4 specified | Actual result | Verdict |
|---|---|---|
| Hero image = dominant | Hero image = small | Design drift |

Drift is measured against the blueprint, which is why §4.4's Creative Invariants matter
operationally: drift in a MUST PRESERVE decision is a defect, while variation in an
IMPLEMENTATION FLEXIBILITY item is not drift at all.

### 20.4 Creative Fidelity score

Raw §5.43 introduces a `0–100` Creative Fidelity measure. The source's worked example:

> **ILLUSTRATIVE VALUES — NON-NORMATIVE.** These numbers demonstrate the shape of the
> measure. They are not targets, thresholds or benchmarks.

| Dimension | Example score |
|---|---|
| Blueprint fidelity | 94 |
| Typography fidelity | 91 |
| Composition fidelity | 96 |
| Image fidelity | 88 |
| Rhythm fidelity | 92 |
| **Overall** | **92** |

> If too low:
>
> revise implementation.

**What the source does not define:** what "too low" means. No threshold, no pass mark,
and no rule for computing `Overall` from the five dimensions. The five example values
average to 92.2, so the stated overall of 92 is consistent with a rounded mean, but the
source declares no formula and one cannot be established from a single example.
Recorded in §24; no threshold or formula has been invented here.

Fidelity measures **conformance to the blueprint**, nothing else. A high fidelity score
says the implementation reproduced what Phase 4 specified; it says nothing about whether
what Phase 4 specified was good.

### 20.5 Premium Quality score

Raw §5.44 keeps this deliberately separate from fidelity, and states why:

> A website can perfectly reproduce a bad blueprint.

The dimensions to evaluate:

Visual polish · Composition · Typography · Spacing · Imagery · Interaction ·
Brand specificity · Conversion · Accessibility · Performance

> This gives:
>
> Premium Score

**What the source does not define:** the scale, the computation, or the pass condition.
The example implementation report in §21.6 shows "Premium quality: 91/100", implying a
0–100 scale, but §5.44 itself declares none. Recorded in §24.

**Boundary with Phase 6.** This score is an implementation self-check that feeds the
implementation report. It is **not** a quality verdict and does not substitute for one.
The Control Plane is explicit on both halves: the Implementation Engineer must not
critique or approve its own output, and passing implementation validation is never a
quality verdict. The source itself supplies the reasoning in §5.58:

> **The AI that builds the website should not be the only AI deciding whether the
> website is good.**

Phase 5 measures, records and reports. Phase 6 judges. The tension between §5.44's
evaluative framing and that boundary is recorded in §24.

---

## 21. Functional QA and Delivery

### 21.1 Code quality

Raw §5.38 — every build should enforce:

| Requirement |
|---|
| TypeScript |
| strong typing |
| small components |
| no unnecessary duplication |
| clear naming |
| minimal dependencies |
| no dead code |
| no magic-number explosion |
| semantic structure |

"No magic-number explosion" is the code-level counterpart of §8.2's token philosophy:
the same concern, expressed once as a design-system rule and once as a code-quality
rule. "Minimal dependencies" is what bounds §5.1 — a package not on the technology
baseline needs justification, not merely a use.

The source states no linter, formatter, complexity metric or component size limit.
Recorded in §24.

### 21.2 Conversion QA

Raw §5.47 — check:

| Check |
|---|
| Primary CTA obvious? |
| Mobile CTA accessible? |
| Phone clickable? |
| WhatsApp works? |
| Booking works? |
| Directions work? |
| Form works? |

These are functional tests of the conversion paths §17.2 implements. Four of the seven
depend on integrations (§18.2): where credentials are missing, the check cannot pass and
the gap is reported rather than marked complete.

### 21.3 Responsive QA matrix

Raw §5.49 — the widths the agent should inspect:

| Tier | Widths |
|---|---|
| Mobile | 375px · 390px · 430px |
| Tablet | 768px · 1024px |
| Desktop | 1280px · 1440px · 1920px |

The source is explicit about what these numbers are, and are not:

> Not because every exact width needs handcrafted layouts, but because the rendered
> behavior needs validation across meaningful ranges.

**These eight widths are inspection targets, not breakpoints.** They are the only
concrete numeric values in the entire Phase 5 source apart from the illustrative scores
in §20.4 and §20.5. No breakpoint is defined by Phase 5 (§12.2), and nothing here should
be read as one.

### 21.4 Visual regression

Raw §5.50 states an intention rather than a current requirement — "we should eventually
keep screenshots for":

| Baseline |
|---|
| blueprint |
| baseline build |
| approved final |

> Then future modifications can be compared visually.
>
> This becomes especially valuable once Blogspage has dozens of generated websites.

The source's own framing ("eventually") marks this as a planned capability. It is
preserved at that strength: not a delivery gate for a single project. No tool, storage
location or comparison method is named. Recorded in §24.

### 21.5 Final delivery checklist

Raw §5.53 — before declaring the website complete:

| ✓ | Item |
|---|---|
| ✓ | Build passes |
| ✓ | TypeScript passes |
| ✓ | No obvious console errors |
| ✓ | Responsive |
| ✓ | Accessibility reviewed |
| ✓ | SEO reviewed |
| ✓ | Performance reviewed |
| ✓ | Business data verified |
| ✓ | Assets verified |
| ✓ | CTAs tested |
| ✓ | Visual fidelity checked |
| ✓ | Anti-generic review passed |
| ✓ | Premium quality review passed |

The list mixes functional and creative items deliberately — the first three are build
correctness, the last three are creative preservation. Per §1, a passing build satisfies
only the first three lines.

**This checklist declares the website complete for Phase 5's purposes.** It is not final
delivery approval, which is a human decision, and it does not pre-empt Phase 6's
independent critique. `quality-gates.md` is explicit that a successful build satisfies
no gate on its own.

### 21.6 Implementation report

Raw §5.54 — "The agent should generate something like":

> **ILLUSTRATIVE INSTANCE — NON-NORMATIVE.** Business name, language selection, pattern
> IDs, scores and deviations are all example values for a fictional business. Only the
> field names carry forward. `R02` and `G04` are reproduced as the source has them; see
> §4.5.

```
IMPLEMENTATION REPORT

Business:            XYZ Dental
Primary language:    Editorial Luxury
Secondary:           Architectural
Patterns:            H04  T04  S01  P02  R02  G04  B02

Creative fidelity:   93/100
Premium quality:     91/100

Accessibility:       Passed
SEO:                 Passed
Conversion:          Passed

Missing:             Booking API credentials
Known deviation:     Mobile hero overlap reduced from 18%
                     to 8% for usability.
```

> This gives you traceability.

**Field inventory**, names only:

| Field | Content |
|---|---|
| Business | The business the site was built for |
| Primary language | Phase 4's selected design language |
| Secondary | Phase 4's secondary influence |
| Patterns | The pattern IDs implemented |
| Creative fidelity | §20.4 score |
| Premium quality | §20.5 score |
| Accessibility / SEO / Conversion | Outcome of §14.2, §15, §21.2 |
| Missing | Gaps reported under §22.2 |
| Known deviation | Recorded exceptions under §22.1 |

The "Known deviation" line is the §22.1 procedure's visible output: a deviation recorded
with its reason. The `18% → 8%` overlap figures are that example's specifics, not a
guideline.

Per `artifact-contracts.md`, the implementation report is a Phase 5-owned per-project
artifact consumed by Phase 6. Its purpose is traceability, and its two most consequential
fields are the two that admit failure: `Missing` and `Known deviation`.

---

## 22. Exceptions and Failures

### 22.1 Exception handling

Raw §5.3 acknowledges that "There will be situations where a blueprint cannot be
implemented literally." The source's example:

| Blueprint asks for | Which creates |
|---|---|
| complex desktop overlap + mobile preservation | mobile usability problem |

The five-step procedure:

| # | Step |
|---:|---|
| 1 | identify conflict |
| 2 | explain conflict |
| 3 | preserve creative intent |
| 4 | modify implementation minimally |
| 5 | record change |

> Never silently redesign.

The steps are ordered and none is optional. Two carry most of the weight:

- **Step 3 precedes step 4.** Intent is preserved first; only then is the implementation
  modified. A change that abandons the intent is not an exception, it is a redesign.
- **Step 5 is what distinguishes an exception from a violation.** An unrecorded change
  is a silent redesign regardless of how well justified it was. The record surfaces in
  the implementation report as a `Known deviation` (§21.6).

"Modify implementation minimally" bounds the change: the smallest adaptation that
resolves the conflict, not the most convenient rebuild.

This procedure resolves conflicts between the blueprint and implementation constraints.
It does **not** apply to accessibility requirements (§14.1), which are boundaries on
every outcome rather than one side of a negotiation.

### 22.2 Implementation failure handling

Raw §5.52 — the AI should categorize problems:

| Category | Meaning |
|---|---|
| `BLOCKER` | Cannot continue. |
| `DESIGN CONFLICT` | Blueprint and implementation conflict. |
| `CONTENT GAP` | Required content missing. |
| `ASSET GAP` | Required asset missing. |
| `INTEGRATION GAP` | Credentials/config missing. |
| `QUALITY ISSUE` | Build works but needs refinement. |

The source's rationale, in its own words: "This is much better than hiding problems."

Each category has a corresponding response already established in this document:

| Category | Response |
|---|---|
| `DESIGN CONFLICT` | The §22.1 five-step procedure |
| `CONTENT GAP` | Report; never invent (§17.3) |
| `ASSET GAP` | The three strategies in §11.3; never substitute silently |
| `INTEGRATION GAP` | Report; never invent credentials (§18.2) |
| `QUALITY ISSUE` | Record in the implementation report (§21.6) |
| `BLOCKER` | Stop and escalate |

The source states no escalation path, no severity ordering, and no rule for who resolves
each category. `failure-routing.md` owns routing across the factory; Phase 5's
contribution is the categorisation itself. Recorded in §24.

---

## 23. Phase Boundaries and Internal Roles

### 23.1 Internal roles

Raw §5.55 divides Phase 5 into three internal roles, "even if one AI model performs all
three":

| Role | Responsibility |
|---|---|
| **A — Implementation Engineer** | Builds the site |
| **B — Responsive Engineer** | Ensures the creative composition survives different screens |
| **C — Creative Preservation Engineer** | Checks: "Did the implementation actually preserve the intended design?" |

The Control Plane defines **one** Phase 5 agent role, the Implementation Engineer. These
three are internal sub-responsibilities of that single role, not three registered agents,
which `agent-roles.md` permits. The distinction matters for one reason: Role C's
self-check does not make Phase 5 its own critic. It remains an implementation-level
verification feeding the implementation report, subject to the same boundary as §20.5.

### 23.2 Independence from Phase 6

Raw §5.58 supplies the reason Phase 6 exists:

> **The AI that builds the website should not be the only AI deciding whether the
> website is good.**

Phase 5's creative QA (§19, §20) and Phase 6's critique are different activities with
different authority:

| | Phase 5 creative QA | Phase 6 critique |
|---|---|---|
| Question | Did I build what the blueprint specified? | Is the result good? |
| Measured against | The Design Blueprint | Independent quality standards |
| Authority | Records and reports | Renders a verdict |
| Can approve delivery | No | No — humans approve |

Phase 5 scoring its own output is self-verification, not self-approval. `agent-roles.md`
states the Implementation Engineer must not critique or approve its own output, and
`quality-gates.md` states that implementation validation is never a quality verdict.
Both hold regardless of how high a Premium Score Phase 5 records.

The source's sketch of the Phase 6 relationship (raw §5.58):

```
Website  ->  Critic  ->  Score  ->  Problems  ->  Specific corrections
         ->  Implementation agent  ->  New version
```

Phase 6 is a separate canonical phase and this document does not define it. What Phase 5
owes Phase 6 is the website and the implementation report — including its recorded gaps
and deviations, which is precisely the material an independent critic needs.

### 23.3 Position in the system

Raw §5.58's summary of the architecture:

| Phase | Produces |
|---|---|
| 1 — Foundation | Global rules and constraints |
| 2 — Visual Design Languages | Five visual grammars |
| 3 — Composition & Pattern System | Design vocabulary |
| 4 — AI Creative Direction Engine | Business-specific Design Blueprint |
| 5 — AI Implementation & Creative Preservation | Production website + visual and technical QA |
| 6 — Independent Design Critic & Refinement Engine | Independent critique |

### 23.4 The complete Phase 5 pipeline

Raw §5.56, with the parallel QA branch the source draws:

```
DESIGN BLUEPRINT
    |
IMPLEMENTATION CONTRACT
    |
CREATIVE INVARIANTS
    |
IMPLEMENTATION PLAN
    |
DESIGN TOKENS
    |
PRIMITIVES
    |
PATTERNS
    |
SECTIONS
    |
PAGE COMPOSITION
    |
RESPONSIVE
    |
INTERACTION/MOTION
    |
SEO + ACCESSIBILITY
    |
PERFORMANCE
    |
RENDER WEBSITE
    |
    +---------------+---------------+
    |                               |
FUNCTIONAL QA                  CREATIVE QA
    |                               |
    +---------------+---------------+
    |
DRIFT CHECK
    |
ANTI-GENERIC QA
    |
PREMIUM QA
    |
FIX
    |
RE-RENDER
    |
FINAL APPROVAL
```

Two features of this pipeline are worth naming. Functional QA and creative QA run **in
parallel** and rejoin — neither substitutes for the other. And the pipeline ends at
`FINAL APPROVAL`, which is not Phase 5's to give: it is the human approval gate, with
Phase 6's independent critique preceding it.

---

## 24. Open Questions

Every item below is a mechanism the raw Phase 5 source names but does not define, or a
cross-document discrepancy observed during canonicalization. **None has been resolved
here.** Undefined means undefined.

### 24.1 Undefined thresholds and scales

| # | Question | Origin |
|---:|---|---|
| 1 | What Creative Fidelity score is "too low" and triggers revision? No threshold is stated. | §20.4 / raw §5.43 |
| 2 | How is the Fidelity `Overall` computed from its five dimensions? A rounded mean fits the single example but no formula is declared. | §20.4 / raw §5.43 |
| 3 | What scale does the Premium Quality score use, how is it computed, and what is its pass condition? §5.44 declares none; the report example implies 0–100. | §20.5 / raw §5.44 |
| 4 | What performance budget, metric or threshold applies? None appears anywhere in the source. | §16 / raw §5.35 |
| 5 | What accessibility standard, conformance level, contrast ratio or touch-target dimension applies? Phase 5 defers entirely to Foundation and states no value. | §14 / raw §5.34 |
| 6 | What is the pass condition for the eight anti-generic inspection questions? | §19.2 / raw §5.45 |
| 7 | What video file-size, bitrate, duration or resolution counts as "huge"? | §11.4 / raw §5.36 |

### 24.2 Undefined mechanisms

| # | Question | Origin |
|---:|---|---|
| 8 | Are breakpoint values defined anywhere? Phase 5 names desktop/tablet/mobile as strategy tiers and defines no values; the §21.3 widths are explicitly inspection targets, not breakpoints. | §12.2 / raw §5.24, §5.25, §5.49 |
| 9 | Who assigns Creative Invariant levels — does Phase 4 mark them in the blueprint, or does Phase 5 derive them on intake? | §4.4 / raw §5.5 |
| 10 | How is a decision classified when the three Creative Invariant example lists do not name it? | §4.4 / raw §5.5 |
| 11 | What does the pattern resolver do when a blueprint names a pattern with no registered implementation? | §4.8 / raw §5.15 |
| 12 | Must every Phase 3 pattern have a Phase 5 implementation? No such requirement is stated. | §7.3 / raw §5.11 |
| 13 | What precedence applies when two token tiers set the same token? An override chain is the natural reading but is not stated. | §8.1 / raw §5.16 |
| 14 | What is the iteration limit and exit criterion for the mandatory visual QA loop? | §20.2 / raw §5.41 |
| 15 | Which missing-asset strategy (A, B or C) applies in which circumstance? No selection rule is given. | §11.3 / raw §5.23 |
| 16 | What format, approval step or completeness test applies to the ten-element Implementation Plan? | §4.6 / raw §5.6 |
| 17 | Where are asset provenance records stored, and in what format? | §11.5 / raw §5.51 |
| 18 | What is the escalation path and severity ordering for the six failure categories, and who resolves each? | §22.2 / raw §5.52 |
| 19 | What criterion governs "Shadcn/UI selectively"? | §5.1 / raw §5.7 |
| 20 | What versions apply to Next.js, React and TypeScript? Only Tailwind CSS v4 is versioned. | §5.1 / raw §5.7 |
| 21 | What tools perform the accessibility tests, visual regression comparison, and code-quality enforcement? The source describes work that implies tooling but authorises no package. | §14.2, §21.1, §21.4 |
| 22 | Which navigation implementation type does each design language's expression descriptor resolve to? | §13.4 / raw §5.30 |
| 23 | What are the level semantics of `motionIntensity`, and how do the three motion representations (primitives, expression, intensity) map onto one another? | §13.1 / raw §5.27 |
| 24 | What provider, endpoint or configuration shape applies to each of the eight integrations? | §18.2 / raw §5.37 |

### 24.3 Cross-document discrepancies

| # | Observation | Documents |
|---:|---|---|
| 25 | Pattern IDs `R02` and `G04` appear in the Phase 5 source but not in Phase 3's inventory of eight IDs. Phase 3 records `R01` in the Reviews family and no ID at all in the G family. Not normalized here: Phase 3 owns the pattern vocabulary, and its inventory is itself illustrative, so the absence may reflect an incomplete library rather than a wrong ID in Phase 5. | raw §5.4, §5.15, §5.54 vs. Phase 3 §14.2 |
| 26 | Phase 5 and Foundation both require a tablet tier; Phase 3 defines responsive transformation for desktop and mobile only. Phase 5 therefore requires a tablet strategy for which no per-pattern transformation exists upstream. | §12.1 vs. Phase 3 |
| 27 | Raw §5.4 labels a field "Primary influence" while giving it the secondary language value. Phase 4 names this field `secondaryInfluence`. Preserved as the source has it, inside the quoted instance. | §4.3 / raw §5.4 |
| 28 | "Required visual traits" (raw §5.4) has no counterpart field in the Phase 4 Design Blueprint contract and no registry identifier. | §4.3 / raw §5.4 |
| 29 | §5.44's Premium Quality score and §5.45's anti-generic inspection are evaluative in framing, while `agent-roles.md` forbids self-critique and `quality-gates.md` states implementation validation is never a quality verdict. Resolved in this document by preserving both as implementation-level self-checks that feed the implementation report and explicitly do not constitute a verdict — the underlying tension is recorded, not eliminated. | §20.5, §19.2 vs. Control Plane |
| 30 | Phase 5's creative QA (§19–§20) and Phase 6's critique overlap in subject matter while differing in authority. The boundary is stated in §23.2; where the practical division of labour lies is not specified. | §23.2 |

---

## 25. Summary

Phase 5 builds the approved design. Its entire discipline reduces to holding two things
at once: **the design must survive implementation**, and **implementation must not
pretend the design is easier than it is**.

**What Phase 5 owns**

- Technical realisation of the Phase 4 Design Blueprint across five architecture layers
  — foundation, primitives, patterns, sections, business content
- Responsive strategy per composition, per tier
- Interaction states, motion vocabulary as code, navigation implementation
- Enforcement of Foundation's accessibility constraints in rendered output
- SEO, performance and integration implementation
- Creative QA — drift detection, anti-generic inspection, fidelity measurement
- The rendered website and the implementation report

**What Phase 5 never does**

- Redesign what Phase 4 decided
- Invent business facts, credentials, or imagery
- Simplify a design because a simpler build is easier
- Change a design decision without recording it
- Trade an accessibility requirement for a visual effect
- Judge whether the finished website is good, or approve its own delivery

**The single distinction that makes the phase work.** Phase 5 produces *reusable
technical infrastructure*, not visual templates. Primitives expose capabilities, not
brand styling. Sections declare content purpose plus a selected pattern, not an industry.
Business data lives in one layer, not scattered through JSX. This is what lets one
technical system produce genuinely different websites rather than one layout wearing
different colours.

**The two rules, restated.** Do not make it generic because generic is easier. Do not
implement a creative idea literally when doing so harms usability, accessibility,
responsiveness, performance or maintainability — preserve the intent and adapt the
implementation, recording the change.

**Where Phase 5 stops.** At a built website, a completed checklist, and an honest report
naming its own gaps and deviations. The verdict belongs to Phase 6 and the approval to a
human. In the source's own words: the AI that builds the website should not be the only
AI deciding whether the website is good.

---
