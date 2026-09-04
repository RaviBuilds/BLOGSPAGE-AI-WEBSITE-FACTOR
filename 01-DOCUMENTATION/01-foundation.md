---
document: Blogspage AI Design System V1
phase: 1
name: Foundation
status: canonical
version: 1.0.0
source: 01-foundation-raw.md
---

# Blogspage AI Design System V1

# Phase 1 — Foundation

**Derived from:** `01-DOCUMENTATION/01-foundation-raw.md`. The raw source is
organised as an introduction, twenty-six numbered sections (01–26), a proposed
Foundation V1 specification, and a closing correction regarding the five-language
plan. Section references in this document cite those raw section numbers.

**Scope boundary:** This document defines Phase 1 Foundation only. It defines
capability, constraint, and requirement. It does not define visual personality,
which is Phase 2 Design Language territory. Where the source explicitly names
later-phase concerns, they are recorded as dependencies rather than specified.

---

## 1. Purpose

The Foundation is defined as:

> The rules that every Blogspage website MUST obey, while deliberately leaving
> enough freedom for the AI to create unexpected, art-directed compositions.

The Foundation constitutes the **constitution** of the system (raw §01).

Foundation resolves into a layered flow:

```
FOUNDATION
│
├── Technical consistency
├── UX consistency
├── Accessibility
├── Responsive behavior
├── Quality constraints
│
└── Creative freedom
        ↓
   Design Language
        ↓
  Business Personality
        ↓
  Unique Composition
```

## 2. Scope

### 2.1 What the Foundation Is Not

The Foundation MUST NOT be a specification in which every site uses:

| Prohibited uniformity |
|---|
| 12px radius |
| Same spacing |
| Same buttons |
| Same cards |
| Same section width |
| Same hero |

Such uniformity would create the exact template problem the system exists to
avoid.

### 2.2 What the Foundation Is

The Foundation is a constraint system supplying technical consistency, UX
consistency, accessibility, responsive behavior, and quality constraints, plus an
explicit allowance for creative freedom.

## 3. Core Principles

The following five rules are the constitutional principles of the system (raw
§01).

### Rule 01 — Foundation is a constraint system, not a visual template

The Foundation MUST define what is **allowed, required, and forbidden**. It MUST
NOT prescribe exactly how a page must look.

The source notes that the research makes the same distinction between a rigid
template, a component library, and a design system.

### Rule 02 — Creativity is a first-class requirement

The AI MUST be allowed to:

- break symmetry
- create unusual compositions
- overlap elements
- vary section heights
- create unexpected whitespace
- use editorial cropping
- combine different content densities
- create visual tension
- introduce asymmetry
- create immersive moments
- vary section rhythm

**Condition:** These allowances hold **provided that usability, accessibility,
hierarchy and conversion are preserved.**

Creativity is an explicit system requirement, not an accidental outcome.

### Rule 03 — Do not optimise every section for efficiency

A premium website does not need every section to be maximally dense.

Sometimes the correct design decision is:

```
ONE IMAGE
+
ONE SENTENCE
+
MASSIVE WHITESPACE
```

rather than:

```
IMAGE
HEADING
PARAGRAPH
3 FEATURES
2 BUTTONS
BADGE
STAT
```

A premium website is defined partly by **what it omits**.

### Rule 04 — Content determines composition

The design MUST respond to the content available. Presentation adapts according
to content volume.

| Content volume | Treatment |
|---|---|
| 3 services | Large visual treatment |
| 7 services | Structured grid |
| 20+ treatments | Categorized / accordion architecture |

### Rule 05 — Real business identity beats design-system identity

The website MUST feel like **"This is XYZ Dental Clinic."** and MUST NOT feel
like **"This is a Blogspage website."**

Blogspage's signature is **quality and craftsmanship**, not an obvious repeated
visual template.

## 4. Foundation Architecture

The architecture has three layers (raw §02):

```
GLOBAL FOUNDATION
      ↓
 DESIGN LANGUAGE
      ↓
  BUSINESS BRAND
```

### Layer A — Global

Never changes fundamentally.

Contents: accessibility; responsive mechanics; grid primitives; containers;
interaction behavior; semantic HTML; form behavior; focus states; image
performance; motion safety; baseline typography mechanics.

### Layer B — Design Language

Changes substantially.

Contents: typography personality; spacing rhythm; corner language; border
language; grid behavior; motion character; image treatment; visual density.

### Layer C — Business

Unique to every client.

Contents: brand colors; imagery; logo; business information; content hierarchy;
CTA; image ratios; business tone; local information.

## 5. Layout Foundation

Raw §03 identifies this as the most important part of the Foundation.

**Rule:** The system MUST NOT create one universal page grid and force all
content into it. It MUST instead provide a **layout grammar**.

### 5.1 Core Primitives

| Primitive |
|---|
| Container |
| Grid |
| Stack |
| Cluster |
| Split |
| Sidebar |
| Frame |
| Bleed |
| Overlay |
| Layer |
| Rail |
| Stage |

These primitives are design vocabulary, not sections.

A single primitive expands into many configurations. `Grid` can become:

- 2 columns
- 3 columns
- 5 columns
- asymmetric columns
- 12-column editorial grid
- full bleed
- nested grid

### 5.2 Full-Bleed Capability

**Rule:** Every major visual element MUST be capable of breaking outside the
standard content container.

Permitted pattern — content escaping the container:

```
┌──────────────────────────────────────────┐
│                                          │
│  TEXT  │████████████████████│            │
│        │       IMAGE        │            │
│        │████████████████████│            │
│                                          │
└──────────────────────────────────────────┘
```

Rather than constraining every element:

```
┌──────────────────────────────┐
│      content container       │
│                              │
└──────────────────────────────┘
```

Full-bleed capability is one of the main tools for creating bespoke
compositions. Asymmetric and overlapping layouts break predictable block layouts
and create a bespoke feel.

### 5.3 Container System

**Rule:** The system MUST NOT apply `max-width: 1200px` everywhere (raw §04).

| Container class | Approximate width |
|---|---|
| Standard content | 70–80rem |
| Wide content | 85–95rem |
| Cinematic content | 100rem+ |
| Full bleed | 100vw |

**These are not hard visual numbers at this version.** They become tokens that
each design language MAY reinterpret.

This permits differing container expression without rewriting the underlying
system:

| Design language | Container expression |
|---|---|
| Swiss | Tight controlled container |
| Architectural | Edge-to-edge |
| Editorial | Asymmetric wide composition |

## 6. Grid System

The source points toward CSS Grid, Subgrid and Container Queries for responsive
composition (raw §05).

### 6.1 Base Grid

Foundation V1 MUST support a 12-column desktop grid.

**Rule:** The system MUST NOT assume every section uses all 12 columns.

### 6.2 Permitted Column Compositions

| Composition |
|---|
| 6 / 6 |
| 7 / 5 |
| 5 / 7 |
| 8 / 4 |
| 4 / 8 |
| 3 / 6 / 3 |
| 2 / 7 / 3 |
| 1 / 5 / 6 |

### 6.3 Deliberate Grid Operations

The following are deliberately supported:

- offset left
- offset right
- overlap
- bleed

These give the AI a richer visual vocabulary.

## 7. Spacing System

Spacing MUST be systematic, but **rhythm MUST NOT be uniform** (raw §06).

Instead of every section repeating one value (120px / 120px / 120px / 120px), the
AI MUST be able to create varied rhythm such as 48px / 160px / 96px / 240px /
72px / 180px, depending on narrative importance.

### 7.1 Scale Versus Rhythm

The system separates two distinct concepts. These MUST NOT be merged.

| Concept | Nature |
|---|---|
| Spacing scale | Mathematical system |
| Spacing rhythm | Creative composition |

### 7.2 Foundation Spacing Scale

```
8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 128 / 160 / 192
```

A design language controls **how aggressively those values are used**.

| Design language | Characteristic progression |
|---|---|
| Editorial | 96 → 160 → 192 |
| Bold | 32 → 48 → 64 |
| Swiss | 48 → 64 → 80 |

This is the mechanism for maintaining consistency without sameness.

## 8. Typography Foundation

Typography is one of the system's biggest creativity levers (raw §07). The source
strongly recommends fluid typography using `clamp()` and emphasises readable line
lengths and appropriate contrast.

### 8.1 Required Type Roles

The Foundation MUST define the following roles:

| Role |
|---|
| Display |
| H1 |
| H2 |
| H3 |
| H4 |
| Body |
| Small |
| Label |
| Eyebrow |
| Navigation |
| Button |
| Metadata |
| Caption |

**Rule:** The Foundation MUST NOT define the actual font personality. Font
personality is Design Language territory.

The division of responsibility:

| Layer | Statement |
|---|---|
| Foundation | H1 must scale fluidly |
| Editorial | H1 = elegant serif |
| Bold | H1 = heavy condensed sans |
| Swiss | H1 = precise grotesque |
| Architectural | H1 = wide modern sans |

### 8.2 Fluid Type

The type system MUST be based around `clamp()` rather than fixed per-breakpoint
sizes.

Required approach:

```
clamp()
```

Rejected approach:

```
desktop 72px
tablet  60px
mobile  48px
```

`clamp()` gives much smoother scaling.

### 8.3 Reading Width

**This is a hard Foundation rule** (raw §08).

Long paragraphs MUST NOT stretch across an enormous screen.

**Target:** approximately 65–75 characters per line. The source explicitly
recommends this range for reading rhythm.

The system MUST provide the following prose widths rather than allowing arbitrary
paragraph widths:

```
.prose
.prose-narrow
.prose-wide
```

## 9. Color and Token Foundation

The source does not specify a standalone color scale within Phase 1. Color is
addressed through:

- **Layer C — Business:** brand colors are business-scoped (§4).
- **Token architecture:** color appears as a primitive and through semantic
  tokens (§20).
- **Accessibility:** contrast validation is a non-negotiable requirement (§14).
- **Anti-patterns:** generic gradients are rejected (§19).

Color as depth mechanism is covered in §11.

## 10. Image and Media Foundation

Raw §09 notes this area is extremely important to the business workflow because
the AI is intended to be fed real images from the business. The source emphasises
authentic business photography and deliberate cropping rather than generic stock
imagery.

### 10.1 Required Image Capability

The Foundation MUST support:

**Ratios:** `1:1`, `4:5`, `3:4`, `4:3`, `16:9`, `21:9`

**Orientations and treatments:** portrait, landscape, full bleed, masked, cropped,
object-positioned

The source lists these as a single flat capability set. No fixed pairing between a
ratio and a treatment is specified.

**Division of responsibility:** **Foundation provides image capability.** Design
Language chooses how aggressively to use it.

### 10.2 Image Quality Rules

The AI MUST ask: *Do we have enough authentic imagery?*

| Imagery availability | Required response |
|---|---|
| YES | Use image-led design |
| SOME | Use image selectively |
| POOR | Reduce image dependence |

**Hard rule:** Poor photography MUST cause the system to pivot toward
typography-led layouts. It MUST NOT fall back to generic stock or AI-generated
faces. The source explicitly designates this a hard rule (raw §10).

## 11. Shape, Borders and Depth

### 11.1 Shape Foundation

**Rule:** The Foundation MUST NOT establish a single global shape value such as
"everything rounded 16px" (raw §11).

The Foundation MUST instead provide a range:

| Shape value |
|---|
| sharp |
| subtle |
| soft |
| rounded |
| organic |

Design Language controls the default:

| Design language | Shape default |
|---|---|
| Swiss | sharp / subtle |
| Editorial | refined / subtle |
| Soft Premium | softer / organic |
| Bold | sharp / high contrast |
| Architectural | very sharp |

### 11.2 Borders and Depth

The Foundation MUST support three depth mechanisms (raw §12):

| Depth mechanism |
|---|
| Structure |
| Color |
| Elevation |

**Preference rule:** The system SHOULD prefer borders, background shifts,
overlap, scale and layering **before** heavy shadows.

The source explicitly warns against excessive shadows and recommends structural
borders, subtle fills and very restrained shadows instead.

## 12. Motion and Interaction

This is an area where the system wants **creativity but not chaos** (raw §13).

### 12.1 Motion Capability

The Foundation provides:

| Motion primitive |
|---|
| fade |
| slide |
| reveal |
| scale |
| mask |
| clip |
| parallax |
| stagger |
| marquee |
| sticky |

### 12.2 Motion Purpose Rule

Motion MUST obey:

```
purpose > decoration
```

Every animation MUST communicate one of:

- hierarchy
- transition
- interaction
- feedback
- storytelling

Motion MUST NOT exist simply *"because AI can animate it."*

The source supports high-fidelity interaction with subtle micro-interactions
rather than overwhelming animation.

### 12.3 Motion Intensity

`motionIntensity` is a Foundation parameter (raw §14):

| Value | Meaning |
|---|---|
| 0 | Almost none |
| 1 | Subtle |
| 2 | Expressive |
| 3 | Cinematic |

The Design Language chooses the default. Business context MAY override it.

| Business type | Motion intensity |
|---|---|
| Dental | 1 |
| Luxury Salon | 1–2 |
| Restaurant | 2 |
| Gym | 2–3 |

This gives the future AI Design Engine a parameter it can reason about.

### 12.4 Interaction Foundation

Every interactive element MUST support the following states (raw §17):

| State |
|---|
| default |
| hover |
| active |
| focus |
| disabled |
| loading |
| success |
| error |

Visible `:focus-visible` states MUST be provided.

Visible focus states and minimum interactive-target requirements are
Foundation-level accessibility rules.

## 13. Responsive Foundation

**Core rule: Mobile is not a smaller desktop** (raw §15).

The AI MUST NOT simply compress desktop layouts. It MUST explicitly restack
content for touch interaction.

### 13.1 Required Compositions

Every component and pattern MUST define:

| Required composition |
|---|
| Desktop composition |
| Tablet composition |
| Mobile composition |

Not:

```
Desktop
   ↓
 shrunk
```

Example of correct restacking:

| Viewport | Composition |
|---|---|
| Desktop | Image overlaps text |
| Mobile | Image → Heading → CTA |

The mobile result MUST be a deliberate restack rather than a broken overlap.

### 13.2 Mobile Creative Rules

Mobile MUST be treated as another **creative canvas** (raw §16).

The AI MAY change:

- section ordering
- crop
- image ratio
- navigation
- card arrangement
- typography
- CTA behavior
- sticky controls

This matters because the system is intended for local businesses, where mobile
actions are critical. The source recommends persistent mobile conversion actions
such as Call or Book.

## 14. Accessibility Foundation

Accessibility requirements are **non-negotiable** (raw §18).

The visual AI is allowed to be creative. It is **not** allowed to be creative
with accessibility requirements.

The Foundation includes:

| Accessibility requirement |
|---|
| semantic HTML |
| keyboard navigation |
| focus-visible |
| contrast validation |
| accessible forms |
| reduced motion support |
| alt text |
| touch target requirements |
| screen-reader compatibility |

The source recommends WCAG 2.2 AA contrast and explicit focus/target-size
handling.

## 15. Content and Truth Rules

The design system MUST distinguish (raw §19):

```
CONTENT TRUTH
     from
DESIGN CREATIVITY
```

The AI is free to creatively **present** facts. The AI is **not** free to
creatively **invent** facts.

### 15.1 Content States

The following are content states:

| Content state |
|---|
| Verified |
| Inferred |
| Unknown |

### 15.2 Prohibited Invention

The following MUST NOT be invented:

| Prohibited invention |
|---|
| patients served |
| years of experience |
| awards |
| ratings |
| testimonials |
| credentials |
| statistics |

The source designates this a hard rule.

## 16. Conversion Foundation

The system MUST establish universal conversion principles without prescribing
identical CTAs (raw §20).

Every website MUST have an identifiable:

| Conversion role |
|---|
| Primary conversion action |
| Secondary conversion action |
| Utility action |

Examples:

| Business | Primary | Secondary | Utility |
|---|---|---|---|
| Dental | Book Consultation | WhatsApp | Call |
| Gym | Start Free Trial | WhatsApp | Directions |
| Restaurant | Reserve Table | View Menu | Directions |

CTA strategy MUST adapt to business type rather than using a generic contact
pattern.

## 17. Navigation Foundation

Navigation MUST provide access to (raw §21):

| Required navigation access |
|---|
| Brand |
| Primary destination links |
| Primary CTA |

The visual treatment is controlled by the Design Language.

Possible implementations:

- minimal nav
- transparent nav
- floating nav
- sticky nav
- edge nav
- compact nav
- overlay nav

Division of responsibility:

**Foundation defines functionality. Design Language defines expression.**

## 18. Creative Freedom

A **Creative Freedom Layer** MUST be explicitly created above the Foundation (raw
§22).

### 18.1 Permitted Variation

The AI is allowed to vary:

| Variable |
|---|
| Section height |
| Section order |
| Grid proportions |
| Image scale |
| Image cropping |
| Whitespace |
| Alignment |
| Overlap |
| Content density |
| Typography scale |
| Visual anchors |
| Background transitions |
| Interaction density |
| Scroll rhythm |

### 18.2 Required Design Question

The AI MUST ask:

> **"What is the most visually compelling composition for this content?"**

The AI MUST NOT ask:

> **"Which standard component do I insert here?"**

This is consistent with the **Composition over Configuration** principle.

### 18.3 Creative Budget

Every website receives a **CREATIVE BUDGET** based on the business (raw §23).

| Business | Creative Budget |
|---|---|
| Dental | 5/10 |
| Gym | 8/10 |
| Luxury Restaurant | 9/10 |
| Traditional Accountant | 4/10 |

**Clarification:** A lower budget does **not** mean *"Dental = boring."* It means
creativity MUST respect the emotional psychology of the customer.

The source warns against cross-pollinating aggressive gym aesthetics into dental,
and against burying restaurant conversion actions behind immersive storytelling.

The source notes this concept will become more significant in later work.

## 19. Anti-Patterns

Regardless of Design Language, the system MUST reject the following (raw §24):

| ❌ Rejected pattern |
|---|
| Same centered hero everywhere |
| Automatic 3-card feature grid |
| Every card rounded |
| Every section same height |
| Every section same background |
| Image-left/text-right → text-left/image-right repetition |
| Generic gradients |
| Excessive pills |
| Excessive shadows |
| Fake statistics |
| Fake testimonials |
| Decorative animation everywhere |
| Desktop simply shrunk for mobile |

## 20. Token Architecture

At the implementation level, the recommended token structure is (raw §25):

```
tokens/
│
├── primitives
│   ├── color
│   ├── spacing
│   ├── type
│   ├── radius
│   ├── shadow
│   ├── motion
│   └── sizing
│
├── semantic
│   ├── background
│   ├── foreground
│   ├── muted
│   ├── border
│   ├── accent
│   ├── destructive
│   └── focus
│
├── language/
│   ├── editorial
│   ├── swiss
│   ├── bold
│   ├── soft
│   └── architectural
│
└── business/
    ├── brand
    ├── imagery
    ├── content
    └── conversion
```

This follows three-tier thinking: global foundation, design-language-specific
tokens, and business-specific tokens.

## 21. The Foundation in One Diagram

The target architecture (raw §26):

```
BLOGSPAGE FOUNDATION
        │
┌───────────────────┬───────────────────┐
│                   │                   │
▼                   ▼                   ▼
STRUCTURE         QUALITY           CREATIVITY
│                   │                   │
Grid              A11y              Asymmetry
Container         Contrast          Overlap
Spacing           UX                Scale
Responsive        Performance       Cropping
Layout primitives Semantics         Rhythm
│                   │                   │
└───────────────────┴───────────────────┘
                    ▼
             DESIGN LANGUAGE
                    │
                    ▼
              BUSINESS BRAND
                    │
                    ▼
         AI CREATIVE COMPOSITION
                    │
                    ▼
        UNIQUE PREMIUM WEBSITE
```

`UNIQUE PREMIUM WEBSITE` is the stated reason the system is being built.

## 22. Foundation V1 Module Specification

The source proposes locking the following **12 Foundation modules** for V1:

| # | Foundation module |
|:--:|---|
| 01 | Principles & creative philosophy |
| 02 | Grid & layout primitives |
| 03 | Containers & responsive mechanics |
| 04 | Spacing & rhythm |
| 05 | Typography mechanics |
| 06 | Color/token architecture |
| 07 | Shape, borders & depth |
| 08 | Image & media system |
| 09 | Motion & interaction |
| 10 | Accessibility |
| 11 | Conversion & content rules |
| 12 | Creative freedom + anti-pattern rules |

### 22.1 Composition-Driven Requirement

The system MUST be **composition-driven**, not merely built on reusable
components. The AI chooses design language, section sequence and layout primitive
according to the business.

The source states this direction is to be preserved.

## 23. Dependencies and Boundaries

### 23.1 What Phase 1 Owns

| Phase 1 owns |
|---|
| Constraint definition: allowed, required, forbidden |
| Layer A — Global Foundation contents (§4) |
| Layout grammar and core primitives (§5) |
| Container classes as tokens (§5.3) |
| 12-column base grid and permitted compositions (§6) |
| Spacing scale, and the scale/rhythm separation (§7) |
| Required typography roles and fluid-type mechanics (§8) |
| Reading width hard rule (§8.3) |
| Image capability: ratios and treatments (§10.1) |
| Image quality pivot rule (§10.2) |
| Shape range and depth mechanisms (§11) |
| Motion primitives, purpose rule, `motionIntensity` parameter (§12) |
| Interaction state requirements (§12.4) |
| Three-composition responsive requirement (§13) |
| Accessibility requirements (§14) |
| Content truth states and invention prohibition (§15) |
| Conversion role requirement (§16) |
| Navigation functional requirement (§17) |
| Creative Freedom Layer and Creative Budget (§18) |
| Anti-pattern rejection list (§19) |
| Token architecture (§20) |

### 23.2 What Belongs to Phase 2 — Design Language

Phase 2 sits on top of the Foundation and defines the personality of the five
languages. Phase 1 MUST NOT specify these:

| Phase 2 owns |
|---|
| Typography personality (font choices per language) |
| Spacing rhythm aggressiveness per language |
| Corner language and border language defaults |
| Grid behavior per language |
| Motion character and default `motionIntensity` |
| Image treatment aggressiveness |
| Visual density |
| Container reinterpretation per language |
| Navigation visual expression |

Recurring boundary statements from the source:

- **Foundation provides image capability.** Design Language chooses how
  aggressively to use it.
- **Foundation defines functionality. Design Language defines expression.**
- Foundation says H1 must scale fluidly; Design Language says what H1 looks like.

### 23.3 Business Layer Dependency

Layer C — Business supplies brand colors, imagery, logo, business information,
content hierarchy, CTA, image ratios, business tone, and local information.
Business context MAY override `motionIntensity` and determines Creative Budget.

### 23.4 Phases 3–6

The raw Foundation document does not reference Phases 3, 4, 5 or 6. No
dependencies on those phases are recorded here.

## 24. Open Questions / Ambiguities

The following items are unresolved in the source and are recorded as such.

### 24.1 The Five Design Languages Are Not Final

The source records an explicit correction to the research's five-language plan:

> The five languages are **not yet final** merely because they were recommended.
> The five are a strong starting point, but before they are locked, each MUST be
> confirmed to have a genuinely different **composition philosophy**, not merely
> a different font/color combination.

**Status:** Open. Affects finalisation of the Phase 2 language set.

**Note:** Despite this, the source names five languages in illustrative tables
throughout — Editorial, Swiss, Bold, Soft / Soft Premium, Architectural — and in
the token architecture (§20). The naming difference between `soft` (token path)
and "Soft Premium" (shape table) appears in the source and is not resolved here.

### 24.2 Container Widths Are Not Fixed

Container widths (§5.3) are stated as approximate and explicitly "not hard visual
numbers yet." Their final values are unresolved and subject to per-language
reinterpretation.

### 24.3 Creative Budget Scale Not Formally Defined

The Creative Budget is expressed as an *n*/10 value with four example businesses.
The source does not define the derivation method, the semantics of each point on
the scale, or how the budget mechanically constrains the Creative Freedom Layer.
The source states only that the concept "will become very powerful later."

### 24.4 Motion Intensity Override Precedence

Business context MAY override the Design Language default `motionIntensity`
(§12.3). The source does not define a resolution rule for conflicts between a
business override and a Design Language default, nor how ranges such as 1–2 and
2–3 are narrowed to a single value.

### 24.5 Content State Consequences Not Specified

`Verified` / `Inferred` / `Unknown` are declared as content states (§15.1). The
source does not specify the presentational or validation consequence of each
state beyond the prohibition on invention.

## 25. Summary

The Foundation is a constraint system, not a visual template. It defines what is
allowed, required and forbidden, and deliberately preserves creative freedom above
that constraint layer.

| Dimension | Foundation position |
|---|---|
| Consistency | Technical, UX, accessibility, responsive, quality |
| Variation | Explicitly required, not accidental |
| Templates | Rejected |
| Composition | Content-determined, not component-inserted |
| Identity | Business identity over design-system identity |
| Truth | Facts may be presented creatively, never invented |
| Accessibility | Non-negotiable; not subject to creative variation |
| Mobile | A separate creative canvas, never a shrunk desktop |

Three-layer architecture: Global Foundation → Design Language → Business Brand,
with the Creative Freedom Layer operating above the Foundation and resolving into
a unique premium website.
