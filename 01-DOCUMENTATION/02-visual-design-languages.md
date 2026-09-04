---
document: Blogspage AI Design System V1
phase: 2
name: Visual Design Languages
status: canonical
version: 1.0.0
source: 02-visual-design-languages-raw.md
---

# Blogspage AI Design System V1

# Phase 2 — Five Visual Design Languages

**Derived from:** `01-DOCUMENTATION/02-visual-design-languages-raw.md`. The raw
source is organised as numbered sections 2.0 through 2.22, with the five languages
carrying their own numbered blocks (DL-01 at 2.4.x, DL-02 at 2.5.x, DL-03 at
2.6.x, DL-04 at 2.7.x, DL-05 at 2.8.x), followed by a closing "Phase 2 — V1
Locked Structure" block. Section references in this document cite those raw
section numbers.

**Scope boundary:** This document defines Phase 2 visual design languages only.
It defines visual grammar, personality, composition philosophy and visual
behavior. It does not define the Foundation (Phase 1), the pattern library, the
business decision engine, or implementation architecture.

**Attribution note:** The source repeatedly cites "the research" without a
resolvable reference. Those citations are preserved as attributions to the source
itself. No external research was consulted.

---

## 1. Purpose

Phase 2 defines the **five visual grammars** that sit above the global Foundation
(raw §2.0).

### 1.1 Division of Responsibility

| Layer | Provides |
|---|---|
| Foundation | technical consistency; accessibility; responsive behavior; structural primitives; quality constraints |
| Design Language | visual personality; composition philosophy; typography personality; spacing rhythm; image behavior; interaction character; visual tension; creative range; section behavior; storytelling style |
| Business Research | business identity; customer psychology; content; imagery; trust signals; conversion requirements |

The AI then combines all three.

```
GLOBAL FOUNDATION
       ↓
VISUAL DESIGN LANGUAGE
       ↓
  BUSINESS CONTEXT
       ↓
CREATIVE COMPOSITION
       ↓
  UNIQUE WEBSITE
```

### 1.2 Stated Goal

The goal is **not** to make five templates.

The goal is to make **five different ways of designing**.

## 2. Scope

Phase 2 owns the visual grammar of five named languages:

| ID | Visual Language |
|---|---|
| DL-01 | Editorial Luxury |
| DL-02 | Swiss / Structured |
| DL-03 | Bold Energetic |
| DL-04 | Soft Premium / Wellness |
| DL-05 | Architectural / Sophisticated |

For each language the source defines, where present: philosophy, emotional
response, visual DNA, composition philosophy, typography DNA, spacing rhythm,
image DNA, visual tension, section behavior, motion, content density, asset
dependency, signature patterns, and anti-patterns.

Categories the source does not define per language are marked
**"Not specified by the source."** where doing so aids canonical clarity.

## 3. Definition of a Visual Design Language

A design language is a **way of designing**, not a fixed page.

The source establishes "design language ≠ template" as a defining property rather
than as a numbered rule. It states the goal is five different ways of designing
rather than five templates (§1.2), and identifies internal variations as one of
the mechanisms that **prevents a language from becoming a hidden template** (raw
§2.12). The source does not phrase this as a "must," and it is not restated as one
here.

The source distinguishes composition from surface styling. Remembering the five
languages by composition behavior is stated as **much more useful** than
remembering them by typeface or color (raw §2.9, reproduced in §6.2), because
**composition, rather than color, is what gives the system real distinction**.

## 4. Core Principles

### 4.1 Composition over Configuration

**Composition over Configuration** is the core principle (raw §2.1).

A component SHOULD NOT dictate the final appearance. The AI SHOULD be able to
take the same underlying primitive and create different compositions.

The same primitive set — `Image + Heading + CTA` — resolves differently per
language:

| Language | Resulting composition |
|---|---|
| Editorial | offset editorial composition |
| Swiss | structured grid composition |
| Bold | oversized typographic composition |
| Soft | organic layered composition |
| Architectural | monumental full-bleed composition |

The source recommends this composition-driven model, including reusable
primitives that accept arbitrary content rather than rigid section-specific
props.

### 4.2 The Five Languages and Their Drivers

| ID | Visual Language | Core Concept | Primary Emotional Driver |
|:--:|---|---|---|
| **DL-01** | Editorial Luxury | Digital editorial / magazine | Sophistication |
| **DL-02** | Swiss / Structured | Precision information system | Trust |
| **DL-03** | Bold Energetic | Kinetic visual energy | Motivation |
| **DL-04** | Soft Premium / Wellness | Human-centered calm | Comfort |
| **DL-05** | Architectural / Sophisticated | Digital architecture | Status |

The source identifies these five as the strongest **initial** set for broad
local-business coverage and visual diversity (raw §2.2).

### 4.3 Design Language Scoring Model

Every language has a **design profile** (raw §2.3).

**These scores are not hard constraints. They are AI guidance.** They SHOULD
influence AI choices rather than mechanically determine them.

| Dimension | Editorial | Swiss | Bold | Soft | Architectural |
|---|:--:|:--:|:--:|:--:|:--:|
| Creativity | 9 | 6 | 10 | 7 | 9 |
| Visual tension | 8 | 4 | 9 | 3 | 8 |
| Whitespace | 9 | 6 | 4 | 9 | 8 |
| Typography drama | 9 | 6 | 10 | 6 | 8 |
| Image dependence | 8 | 5 | 9 | 8 | 10 |
| Motion | 4 | 2 | 9 | 3 | 7 |
| Structural rigidity | 3 | 10 | 5 | 4 | 8 |
| Information density | 4 | 9 | 8 | 4 | 5 |
| Shape softness | 5 | 2 | 2 | 9 | 1 |
| Visual restraint | 8 | 9 | 3 | 8 | 9 |

The source presents the scale as a 1–10 profile but does not state how these
values are derived, nor how they are consumed by the AI. Recorded in §21.

---

## 5. The Five Visual Design Languages

### 5.1 DL-01 — Editorial Luxury

#### 5.1.1 Philosophy

**Design the website like a premium editorial publication.** (raw §2.4.1)

The website SHOULD feel curated, intentional and art-directed.

The source associates this language with magazine-style asymmetry, serif
typography, expansive whitespace and offset imagery, particularly for **high-end
salons, cosmetic dentistry and fine dining**.

#### 5.1.2 Emotional Response

The user should think:

- "This feels sophisticated."
- "These people care about details."
- "This feels expensive."

#### 5.1.3 Visual DNA

Elegant · Editorial · Asymmetric · Refined · Quiet · Layered · Intentional ·
Human · Curated

#### 5.1.4 Composition Philosophy

**Break the grid without destroying the grid.** (raw §2.4.3)

Preferred:

- offset elements
- asymmetrical alignment
- image/text overlap
- large visual anchors
- deliberate empty space
- unexpected proportions
- unusual image crops
- occasional edge bleed

Avoid:

- rigid symmetrical layouts throughout
- equal-sized repeated cards
- predictable section blocks

#### 5.1.5 Typography DNA

- **Primary:** high-contrast serif
- **Secondary:** neutral modern sans

Typography should create editorial contrast, dramatic scale, elegant line breaks,
and sophisticated hierarchy.

Display type MAY itself become a compositional element.

#### 5.1.6 Spacing Rhythm

```
quiet → expansive → intimate → dramatic → expansive
```

Whitespace should feel **luxurious**, not empty.

#### 5.1.7 Image DNA

Best suited to: portraits · close-up details · architecture · environmental
photography · lifestyle imagery · premium service photography

Cropping MAY be expressive.

#### 5.1.8 Visual Tension

**Medium-high.** Created through: asymmetry · scale contrast · overlap · unusual
cropping · typography/image proportion

#### 5.1.9 Section Behavior

| Section | Behavior |
|---|---|
| Hero | split editorial; asymmetric; typographic; layered |
| Services | large editorial rows; typographic lists; hover-image reveal; oversized individual service blocks |
| About | narrative storytelling; founder/practitioner portrait; editorial split |
| Reviews | oversized quote; sparse editorial layout; selected review spotlight |
| Gallery | masonry; uneven grid; cinematic strip |
| CTA | minimal; high-contrast; spacious |

#### 5.1.10 Motion

**Low to moderate.** Preferred: image reveals · masked transitions · slow
movement · subtle parallax · editorial fades

The source emphasizes subtle micro-interactions rather than overwhelming
movement.

#### 5.1.11 Content Density

Best: **Low → Medium**

Too much information should trigger a more structured pattern.

#### 5.1.12 Asset Dependency

**High.** High-quality photography significantly improves this language.

When assets are weak, the AI SHOULD shift toward typography-led editorial
compositions rather than generic stock imagery. The source explicitly recommends
such a pivot.

#### 5.1.13 Signature Patterns

Editorial Split · Oversized Statement · Offset Portrait · Image Overlap · Quiet
Quote · Masonry Story

#### 5.1.14 Anti-Patterns

Generic SaaS cards · Neon gradients · Excessive pills · Dense dashboard-style
layouts · Aggressive animation

#### 5.1.15 Unsuitable Industries

Not specified by the source. The source names best-fit industries for this
language but does not name unsuitable industries.

---

### 5.2 DL-02 — Swiss / Structured

#### 5.2.1 Philosophy

**Make precision itself look premium.** (raw §2.5.1)

This language communicates competence through structure.

The source describes it as utilitarian, highly legible, grid-oriented and
predictable, making it especially suitable for **medical, legal and professional
services**.

#### 5.2.2 Emotional Response

Trust · Authority · Clarity · Competence · Reliability · Control

The user should feel:

- "These people are organized."
- "I immediately understand what they offer."

#### 5.2.3 Visual DNA

Precise · Structured · Measured · Clear · Systematic · Professional · Quietly
confident

#### 5.2.4 Composition Philosophy

**The grid is visible.** (raw §2.5.4)

Use:

- strong alignment
- mathematical proportions
- clear modules
- horizontal lines
- structured columns
- repeated alignment anchors

Unlike Editorial, this language **does not usually break the grid**. It
**celebrates the grid**.

#### 5.2.5 Typography DNA

Primarily: **neo-grotesque sans**

Characteristics: strong legibility · controlled hierarchy · measured scale ·
disciplined labels · clear metadata

#### 5.2.6 Spacing Rhythm

```
consistent · controlled · predictable
```

The creativity comes from **proportion and information hierarchy**, not
decoration.

#### 5.2.7 Image DNA

Literal and trustworthy.

Best: real doctors · actual facility · real equipment · actual team · real
location

Avoid heavy filters.

The source recommends true-color, well-lit photography for this language.

#### 5.2.8 Visual Tension

**Low-medium.** Created through: scale differences · large typography ·
structural lines · column proportions

Not through wild layouts.

#### 5.2.9 Section Behavior

| Section | Behavior |
|---|---|
| Hero | split; structured; typographic; trust-led |
| Trust | rating; credentials; certifications; statistics |
| Services | structured list; comparison; categorized grid; accordion |
| Team | formal grid; clear credentials |
| Process | numbered sequence |
| Reviews | systematic review grid; rating architecture |
| Location | information-first |
| CTA | direct and functional |

#### 5.2.10 Motion

**Minimal.** Interaction should clarify state rather than entertain.

#### 5.2.11 Content Density

**Medium → High**

This makes it especially appropriate where businesses have lots of services or
practical information.

The source explicitly recommends adapting layout to content volume rather than
forcing all services into one layout.

#### 5.2.12 Asset Dependency

**Low-medium.** The source calls this an important advantage: the design can
remain premium without relying on cinematic photography.

#### 5.2.13 Signature Patterns

Structured Split · Service Index · Information Grid · Credential Matrix ·
Numbered Process · Precision Footer

#### 5.2.14 Anti-Patterns

Random overlaps · Organic blobs everywhere · Excessive parallax · Playful rounded
UI · Decorative clutter

#### 5.2.15 Unsuitable Industries

Not specified by the source.

---

### 5.3 DL-03 — Bold Energetic

#### 5.3.1 Philosophy

**Make the website feel like movement.** (raw §2.6.1)

The source associates this direction strongly with **gyms and fitness** through
oversized typography, high contrast, kinetic motion and dense visual energy.

#### 5.3.2 Emotional Response

Excitement · Motivation · Energy · Confidence · Belonging · Action

#### 5.3.3 Visual DNA

Bold · Kinetic · Graphic · Loud · Confident · Physical · Competitive · Dynamic

#### 5.3.4 Composition Philosophy

**Compress and amplify.** (raw §2.6.4)

The page MAY have:

- oversized typography
- dense information zones
- layered elements
- large numbers
- strong image crops
- graphic dividers
- horizontal movement

#### 5.3.5 Typography DNA

Heavy sans-serif.

Potential characteristics: CONDENSED · HEAVY · UPPERCASE · TIGHT · OVERSIZED

The typography SHOULD occupy significant visual territory.

#### 5.3.6 Spacing Rhythm

```
dense → impact → dense → image → massive type → impact
```

Unlike Editorial, silence is used **selectively**.

#### 5.3.7 Image DNA

Best: action · athletes · trainers · movement · equipment · transformation ·
energetic group scenes

Video has significant value.

#### 5.3.8 Visual Tension

**High.** Created through: scale · compression · contrast · motion · unexpected
offsets · oversized type

#### 5.3.9 Section Behavior

| Section | Behavior |
|---|---|
| Hero | cinematic; typographic takeover; full bleed; video-led |
| Stats | giant numbers |
| Programs | visual program blocks |
| Transformations | image-dominant |
| Trainers | large portraits; dense profile metadata |
| Reviews | rapid/moving quote system |
| CTA | bold, unmistakable action |

The source specifically identifies video-led heroes, large statistics and
energetic layouts as strong **fitness** patterns.

#### 5.3.10 Motion

**High.** Potentially: marquee · scroll-linked type · image movement · staggered
reveals · horizontal rails · kinetic typography

**But never meaningless animation.**

#### 5.3.11 Content Density

**Medium → High**

The language handles lots of information well **when the hierarchy is strong**.

#### 5.3.12 Asset Dependency

**High.** Best when the business has: real photography · video · trainers ·
facility shots · transformation material

#### 5.3.13 Signature Patterns

Typographic Takeover · Kinetic Hero · Mega Stats · Program Rail · Transformation
Wall · Marquee

#### 5.3.14 Anti-Patterns

Delicate typography · Overly soft palettes · Entire page filled with huge
whitespace · Calm wellness-like motion · Timid CTAs

#### 5.3.15 Unsuitable Industries

Not named per-language in this section. The source does warn separately that
aggressive gym aesthetics should not be transferred into dental/medical
environments — see §15.3.

---

### 5.4 DL-04 — Soft Premium / Wellness

#### 5.4.1 Philosophy

**Make premium feel human.** (raw §2.7.1)

The goal is not simply luxury. The goal is **luxury without intimidation**.

The source associates this language with muted palettes, fluid shapes,
human-centric photography and feelings of calm and safety.

#### 5.4.2 Emotional Response

Calm · Safety · Warmth · Care · Trust · Rejuvenation · Comfort

#### 5.4.3 Visual DNA

Organic · Warm · Tactile · Human · Fluid · Airy · Gentle · Refined

#### 5.4.4 Composition Philosophy

**Flow rather than structure.** (raw §2.7.4)

Layouts MAY feel connected rather than modular.

Preferred:

- staggered grids
- gentle overlaps
- soft transitions
- flowing content
- rounded compositions
- organic image placement

#### 5.4.5 Typography

Potential: warm serif · soft geometric sans · low-contrast serif

Typography SHOULD feel approachable.

#### 5.4.6 Spacing Rhythm

```
generous → intimate → generous → image → quiet
```

Whitespace communicates **calm**, not status.

#### 5.4.7 Image DNA

Human-centered.

Best: real people · treatment environments · relaxed portraits · natural light ·
tactile close-ups · human interactions

For **salons and beauty businesses**, the source highlights outcome imagery and
before/after experiences.

#### 5.4.8 Visual Tension

**Low-medium.** The source states: "We don't want anxiety."

Tension MAY come from: subtle asymmetry · image layering · gentle scale shifts

#### 5.4.9 Section Behavior

| Section | Behavior |
|---|---|
| Hero | serene image-led; split portrait; soft editorial; quiet statement |
| Services | layered image cards; visual menu; soft accordion |
| About | intimate story |
| Practitioner | human portrait + story |
| Before/after | visual comparison |
| Reviews | conversational |
| Gallery | masonry; soft collage |
| CTA | welcoming rather than aggressive |

#### 5.4.10 Motion

**Low.** Slow, fluid and almost tactile.

#### 5.4.11 Content Density

**Low → Medium**

Overloading the page weakens the emotional goal.

#### 5.4.12 Asset Dependency

**Medium-high.** Authentic photography helps significantly.

#### 5.4.13 Signature Patterns

Soft Split · Organic Grid · Treatment Story · Before/After · Floating Portrait ·
Gentle Testimonial

#### 5.4.14 Anti-Patterns

Harsh black · Aggressive red/neon · Heavy borders · Kinetic typography · Hard
geometric grids everywhere · Aggressive CTAs

#### 5.4.15 Unsuitable Industries

Not specified by the source.

---

### 5.5 DL-05 — Architectural / Sophisticated

#### 5.5.1 Philosophy

**Translate physical luxury into digital space.** (raw §2.8.1)

The website should feel less like a document and more like entering a high-end
physical environment.

The source describes this direction using deep neutrals, strong lines, cinematic
imagery, large structural blocks and minimalist UI.

#### 5.5.2 Emotional Response

Status · Modernity · Exclusivity · Confidence · Power · Precision

#### 5.5.3 Visual DNA

Monumental · Geometric · Cinematic · Minimal · Spatial · Dark · Structural ·
Premium

#### 5.5.4 Composition Philosophy

**Build the page like architecture.** (raw §2.8.4)

Think in: zones · frames · planes · layers · voids · massive surfaces ·
full-bleed imagery

#### 5.5.5 Typography DNA

Wide/extended sans.

Typography acts like **architectural signage**.

Example:

```
PRIVATE
PERFORMANCE
CLUB
```

#### 5.5.6 Spacing Rhythm

```
MONUMENTAL → VOID → STRUCTURE → CINEMATIC → VOID → MONUMENTAL
```

The emptiness is **structural**.

#### 5.5.7 Image DNA

Very high dependency.

Best: architecture · interiors · dramatic portraits · cinematic environmental
shots · high-end facilities · controlled lighting

The source specifically warns that **this direction can fail without strong
professional imagery**.

#### 5.5.8 Visual Tension

**High.** Created through: monumental scale · dark/light contrast · edge-to-edge
imagery · geometry · dramatic cropping

#### 5.5.9 Section Behavior

| Section | Behavior |
|---|---|
| Hero | cinematic full bleed; architectural split; monumental type |
| Services | large structural blocks; numbered systems; oversized service panels |
| About | architectural story |
| Gallery | cinematic; full-bleed; structured gallery |
| Reviews | minimal quote environments |
| CTA | bold but restrained |
| Location | spatial |

#### 5.5.10 Motion

**Moderate-high.** Potential: slow camera-like movement · image scaling ·
clip-path transitions · line reveals · section staging

#### 5.5.11 Content Density

**Low → Medium**

Too much information breaks the architectural feel.

#### 5.5.12 Asset Dependency

**Very high.** This is the **most photography-sensitive** language.

#### 5.5.13 Signature Patterns

Cinematic Hero · Monumental Statement · Structural Grid · Spatial Gallery ·
Architectural Split · Framed CTA

#### 5.5.14 Anti-Patterns

Cute UI · Excessive rounded cards · Playful illustrations · Dense paragraphs ·
SaaS-like card grids · Weak photography

#### 5.5.15 Unsuitable Industries

Not specified by the source.

---

## 6. Comparative Characteristics

### 6.1 Cross-Language Comparison Table

Consolidated from the per-language sections. No values are inferred; every cell
is transcribed from the language's own subsection.

| Attribute | Editorial | Swiss | Bold | Soft | Architectural |
|---|---|---|---|---|---|
| Philosophy | Design like a premium editorial publication | Make precision itself look premium | Make the website feel like movement | Make premium feel human | Translate physical luxury into digital space |
| Grid stance | Break the grid without destroying it | The grid is visible; celebrates the grid | Compress and amplify | Flow rather than structure | Build the page like architecture |
| Typography | High-contrast serif + neutral modern sans | Neo-grotesque sans | Heavy sans-serif | Warm serif / soft geometric sans / low-contrast serif | Wide/extended sans |
| Visual tension | Medium-high | Low-medium | High | Low-medium | High |
| Motion | Low to moderate | Minimal | High | Low | Moderate-high |
| Content density | Low → Medium | Medium → High | Medium → High | Low → Medium | Low → Medium |
| Asset dependency | High | Low-medium | High | Medium-high | Very high |
| Named industry association | High-end salons, cosmetic dentistry, fine dining | Medical, legal, professional services | Gyms and fitness | Salons and beauty (outcome / before-after imagery) | Not named in its own section |

### 6.2 The Crucial Difference Between the Five

The source's shortest way to remember them (raw §2.9):

| Language | Relationship to the grid |
|---|---|
| EDITORIAL | **Break** the grid. |
| SWISS | **Control** the grid. |
| BOLD | **Compress and energize** the grid. |
| SOFT | **Flow through** the grid. |
| ARCHITECTURAL | **Construct** the grid. |

The source states this is **much more useful** than the reductive shorthand:

```
Editorial      = serif
Swiss          = sans
Bold           = neon
Soft           = beige
Architectural  = black
```

because **composition**, rather than color, is what gives the system real
distinction.

Terminology note: the reductive list is presented by the source as the *less*
useful framing. It is not a color or typeface specification for the five
languages, and is not treated as one in this document.

---

## 7. Primary and Secondary Influences

Raw §2.10.

A website MAY use:

```
Primary Language + Secondary Influence
```

Source examples:

- Editorial Luxury + Architectural
- Soft Premium + Editorial
- Bold Energetic + Architectural

The secondary influence SHOULD modify the composition **without destroying the
primary language**.

### 7.1 Proportional Example

The source gives one worked proportional example:

```
70% Editorial
20% Architectural
10% Business expression
```

This is presented as an **example**, not as a required formula. The source does
not define how proportions are assigned for other combinations, nor whether the
three-part split (primary / secondary / business expression) is fixed. Recorded
in §21.

The source states this approach gives substantially more creative combinations.

---

## 8. Internal Variations

Raw §2.12. The source calls this **extremely important**.

Each language should contain **sub-directions**. The source states this is one of
the mechanisms that **prevents the same language from becoming a hidden
template**.

**Editorial**

| ID | Variation |
|---|---|
| EL-01 | Editorial Minimal |
| EL-02 | Image Editorial |
| EL-03 | Typographic Editorial |
| EL-04 | Layered Editorial |
| EL-05 | Architectural Editorial |

**Swiss**

| ID | Variation |
|---|---|
| SS-01 | Clinical Precision |
| SS-02 | Modern Professional |
| SS-03 | Information Rich |
| SS-04 | Minimal Swiss |
| SS-05 | Editorial Swiss |

**Bold**

| ID | Variation |
|---|---|
| BE-01 | Kinetic |
| BE-02 | Typographic |
| BE-03 | Cinematic |
| BE-04 | Graphic |
| BE-05 | Athletic |

**Soft**

| ID | Variation |
|---|---|
| SP-01 | Spa Calm |
| SP-02 | Clinical Soft |
| SP-03 | Organic Luxury |
| SP-04 | Beauty Editorial |
| SP-05 | Human Wellness |

**Architectural**

| ID | Variation |
|---|---|
| AS-01 | Dark Cinema |
| AS-02 | Light Architecture |
| AS-03 | Monolithic |
| AS-04 | Luxury Minimal |
| AS-05 | Structural Editorial |

The source names all 25 variations but does not specify the visual
characteristics of any individual variation. Recorded in §21.

---

## 9. Creative Intensity

Raw §2.18.

Each website gets a **creative intensity target** on a 1–10 scale:

```
1  = conservative
5  = expressive
10 = highly art-directed
```

The source anchors only these three points. Values 2–4 and 6–9 are used in the
examples below but are not individually defined.

### 9.1 Constraints on Creative Intensity

The target is constrained by:

- Business psychology
- Conversion
- Brand maturity
- Content
- Assets
- Industry expectations

### 9.2 Source Examples

Presented by the source as examples ("For example:"), not as a lookup table:

| Business type | Intensity |
|---|---|
| Traditional medical clinic | 4–6 |
| Premium dental | 6–8 |
| Luxury salon | 7–9 |
| Boutique gym | 8–10 |
| Fine dining | 8–10 |

### 9.3 Status of the Model

The source states explicitly:

> This is an AI creative-control mechanism, **not a rigid numerical rule**.

The source does not define how a specific intensity value is computed from the
six constraints, nor how an intensity value changes a composition. Recorded in
§21.

Note that creative intensity (raw §2.18) and the per-language "Creativity" score
in the scoring model (raw §2.3, §4.3 here) are presented as separate constructs.
The source does not state how they relate. Recorded in §21.

---

## 10. Visual Tension

Raw §2.17.

The AI SHOULD intentionally control visual tension.

Tension can come from:

- Scale
- Alignment
- Cropping
- Whitespace
- Contrast
- Overlap
- Typography
- Density

Every language has a **preferred tension range**. The per-language values are in
§5 and consolidated in §6.1.

The AI SHOULD NOT randomly create asymmetry just because it can. It SHOULD create
tension **with purpose**.

The source names a preferred tension range per language in qualitative terms
(Low-medium, Medium-high, High) and separately gives a numeric "Visual tension"
row in §4.3. The source does not reconcile the two representations. Recorded in
§21.

---

## 11. Content Density

### 11.1 Content Density Adaptation

Raw §2.13.

Each language **must respond to the available content**.

Source example:

```
3 services   → large visual modules
20 services  → categorization + interaction
```

rather than twenty identical cards.

The source explicitly calls for this content-driven adaptation.

### 11.2 Per-Language Density Ranges

| Language | Content density |
|---|---|
| Editorial | Low → Medium |
| Swiss | Medium → High |
| Bold | Medium → High (when hierarchy is strong) |
| Soft | Low → Medium |
| Architectural | Low → Medium |

Consequences named by the source when density exceeds a language's range:

- Editorial: too much information should trigger a more structured pattern
- Soft: overloading the page weakens the emotional goal
- Architectural: too much information breaks the architectural feel

Swiss and Bold are described as handling higher density rather than being
degraded by it.

---

## 12. Asset Dependency

### 12.1 Asset-Aware Design

Raw §2.14.

The AI **must evaluate** the following before committing to a design direction:

- Photography quality
- Photography quantity
- Video availability
- Logo quality
- Brand consistency
- People photography
- Facility photography
- Before/after availability

### 12.2 Asset-to-Language Viability Examples

Presented by the source as examples:

| Asset condition | Result |
|---|---|
| Strong photography + video | Architectural / Bold highly viable |
| Strong portraits + refined photography | Editorial highly viable |
| Weak photography | Swiss highly viable |
| Warm people photography | Soft highly viable |

The stated purpose: this prevents the system from choosing a visually beautiful
language that the business does not have the assets to support.

These are viability statements, not prohibitions. The source does not say a
language is forbidden when the matching asset condition is absent.

### 12.3 Per-Language Asset Dependency

| Language | Asset dependency |
|---|---|
| Editorial | High |
| Swiss | Low-medium |
| Bold | High |
| Soft | Medium-high |
| Architectural | Very high (most photography-sensitive) |

Two named fallback/failure behaviors:

- Editorial: when assets are weak, the AI SHOULD shift toward typography-led
  editorial compositions rather than generic stock imagery.
- Architectural: the source warns this direction **can fail** without strong
  professional imagery.

The source does not define fallback behavior for Swiss, Bold, or Soft. Recorded
in §21.

---

## 13. Brand Maturity

Raw §2.15.

The AI **must classify** the existing business brand approximately as:

- Mature
- Developing
- Weak / inconsistent

| Classification | Response |
|---|---|
| **Mature brand** | Amplify existing identity. |
| **Developing brand** | Refine and strengthen. |
| **Weak brand** | Create a restrained system around actual business identity **without inventing an artificial "luxury brand."** |

The source lists brand maturity as one of the constraints on creative intensity
(§9.1) but does not define how each classification shifts an intensity value.
Recorded in §21.

---

## 14. Section-Level Behavior

### 14.1 Per-Language Section Behavior

Per-language section behavior is specified in §5 (§5.1.9, §5.2.9, §5.3.9, §5.4.9,
§5.5.9). Note that the source does not define the same section set for every
language. Sections named per language:

| Section | Editorial | Swiss | Bold | Soft | Architectural |
|---|:--:|:--:|:--:|:--:|:--:|
| Hero | ✓ | ✓ | ✓ | ✓ | ✓ |
| Services | ✓ | ✓ | — | ✓ | ✓ |
| About | ✓ | — | — | ✓ | ✓ |
| Reviews | ✓ | ✓ | ✓ | ✓ | ✓ |
| Gallery | ✓ | — | — | ✓ | ✓ |
| CTA | ✓ | ✓ | ✓ | ✓ | ✓ |
| Trust | — | ✓ | — | — | — |
| Team | — | ✓ | — | — | — |
| Process | — | ✓ | — | — | — |
| Location | — | ✓ | — | — | ✓ |
| Stats | — | — | ✓ | — | — |
| Programs | — | — | ✓ | — | — |
| Transformations | — | — | ✓ | — | — |
| Trainers | — | — | ✓ | — | — |
| Practitioner | — | — | — | ✓ | — |
| Before/after | — | — | — | ✓ | — |

A dash means the source does not name that section for that language. It does not
mean the section is forbidden. The source does not state whether the omissions are
deliberate exclusions or simply unspecified. Recorded in §21.

### 14.2 Section Rhythm as a First-Class Design Concept

Raw §2.16.

Every website should have a **rhythm profile**. The source presents the following
as examples ("Example:").

**Editorial**

```
Quiet → Image → Typography → Silence → Story → Image → CTA
```

**Swiss**

```
Information → Trust → Information → Proof → Information → Action
```

**Bold**

```
Impact → Density → Impact → Movement → Impact → Action
```

**Soft**

```
Calm → Human → Image → Story → Calm → Action
```

**Architectural**

```
Monumental → Void → Structure → Cinema → Void → Monumental
```

The source states this is one of the most important additions over the earlier
Phase 2 draft.

Note: section rhythm (§14.2) and spacing rhythm (per-language, §5.x.6) are
distinct constructs in the source. For Architectural the two sequences are
identical in wording; for the other four they differ. The source does not comment
on this overlap. Recorded in §21.

---

## 15. Compatibility and Cross-Pollination

Raw §2.11 ("Compatibility Rules").

### 15.1 Strong Combinations

- Editorial + Architectural
- Editorial + Soft
- Swiss + Soft
- Swiss + Architectural
- Bold + Architectural
- Soft + Editorial

### 15.2 Caution

- Bold + Swiss
- Bold + Soft
- Architectural + Soft

The source labels these "Caution." It does not prohibit them and does not state
what caution requires in practice. Recorded in §21.

### 15.3 Hard Restriction

**A secondary influence MUST NEVER contradict the business psychology.**

This is the one hard restriction stated in the compatibility section. The source
uses "must never."

Supporting example: the source explicitly warns that **aggressive gym aesthetics
should not be transferred into dental/medical environments**, where they can
increase anxiety rather than reassurance.

### 15.4 Status of the Compatibility Set

The source lists 6 strong and 3 caution pairings out of the possible combinations
of five languages. It is not a complete matrix, and the source does not state
whether combinations it omits are permitted, cautioned, or excluded. Nor does it
state whether the pairings are directional — "Editorial + Soft" and "Soft +
Editorial" both appear in the Strong list, while other pairs appear only once.
Recorded in §21.

### 15.5 Distinguishing the Three Levels

To preserve the source's calibration without strengthening it:

| Level | Source wording | Reading |
|---|---|---|
| Inappropriate combination | "aggressive gym aesthetics should not be transferred into dental/medical environments" | Named as an explicit warning; tied to business psychology |
| Merely less suitable combination | "Caution" (§15.2) | Not prohibited; no defined remedy |
| Prohibited combination | "A secondary influence must never contradict the business psychology" (§15.3) | The only absolute prohibition in this section |

---

## 16. Signature Patterns

Signature patterns are named per language in §5 (§5.1.13, §5.2.13, §5.3.13,
§5.4.13, §5.5.13). Consolidated:

| Language | Signature patterns |
|---|---|
| Editorial | Editorial Split · Oversized Statement · Offset Portrait · Image Overlap · Quiet Quote · Masonry Story |
| Swiss | Structured Split · Service Index · Information Grid · Credential Matrix · Numbered Process · Precision Footer |
| Bold | Typographic Takeover · Kinetic Hero · Mega Stats · Program Rail · Transformation Wall · Marquee |
| Soft | Soft Split · Organic Grid · Treatment Story · Before/After · Floating Portrait · Gentle Testimonial |
| Architectural | Cinematic Hero · Monumental Statement · Structural Grid · Spatial Gallery · Architectural Split · Framed CTA |

The source names six patterns per language but does not specify the structure or
composition of any individual named pattern. Recorded in §21.

The source presents signature patterns as patterns characteristic of a language,
not as required page sections or a fixed template sequence. It states no rule
about them beyond naming them, and none is added here. Read them alongside the
universal anti-template rules (§17.2).

---

## 17. Language-Specific Anti-Patterns

### 17.1 Per-Language Anti-Patterns

| Language | Anti-patterns |
|---|---|
| Editorial | Generic SaaS cards · Neon gradients · Excessive pills · Dense dashboard-style layouts · Aggressive animation |
| Swiss | Random overlaps · Organic blobs everywhere · Excessive parallax · Playful rounded UI · Decorative clutter |
| Bold | Delicate typography · Overly soft palettes · Entire page filled with huge whitespace · Calm wellness-like motion · Timid CTAs |
| Soft | Harsh black · Aggressive red/neon · Heavy borders · Kinetic typography · Hard geometric grids everywhere · Aggressive CTAs |
| Architectural | Cute UI · Excessive rounded cards · Playful illustrations · Dense paragraphs · SaaS-like card grids · Weak photography |

These are stated as anti-patterns for the named language. The source does not
frame them as global prohibitions — for example, kinetic typography is a Soft
anti-pattern while being a Bold motion option, and dense information zones are a
Bold composition option while dense layouts are an Editorial anti-pattern.

### 17.2 Universal Anti-Template Rules

Raw §2.21. **Regardless of language**, the source states DO NOT:

- automatically use a centered hero
- automatically use two hero buttons
- automatically create a 3-card service grid
- round every element
- use generic gradients
- create identical bento cards
- alternate image-left / text-right endlessly
- use excessive shadows
- invent testimonials
- invent statistics
- use meaningless animation
- compress desktop into mobile

The source explicitly identifies these as important AI anti-patterns.

Modal note: the source's heading is "DO NOT," which is preserved as MUST NOT
behavior for the twelve items above. The qualifier "automatically" is retained on
the first three items exactly as written — the source targets automatic default
use, not the existence of these compositions.

### 17.3 Novelty Requirement

Raw §2.20.

Before finalizing a site, the AI should ask:

> **"Does this look like a generic website I've generated before?"**

It should compare its own composition choices against previous projects **where
possible**.

Check:

- Hero composition
- Section sequence
- Grid structure
- Typography treatment
- Image placement
- CTA style
- Card strategy
- Gallery strategy
- Rhythm

If too many are repeated:

> **regenerate the composition, not merely the colors.**

The source calls this one of the strongest safeguards that can be built into the
eventual AI Website Factory.

The source does not define the threshold for "too many," nor the mechanism for
comparing against previous projects. Recorded in §21.

---

## 18. Creativity Hierarchy

Raw §2.19.

The AI **must always prioritize**:

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

But once levels 1–7 are satisfied:

> **The AI should actively search for the most distinctive tasteful composition
> available.**

The source states this is the rule that protects the emphasis on creativity.

Modal note: the ordering itself is stated with "must always prioritize" and is
preserved as a MUST. The search for the most distinctive tasteful composition is
stated with "should" and is preserved as a SHOULD.

---

## 19. Design Language Selection Principles

The source does not present a single consolidated selection algorithm. It
distributes selection-relevant inputs across several sections. The inputs it
names, with their source location:

| Input | Raw section | Nature |
|---|---|---|
| Design language scoring profile | §2.3 | AI guidance, not hard constraint |
| Business psychology / industry association | §2.4.1, §2.5.1, §2.6.1, §2.7.1, §2.8.1 | Named industry associations per language |
| Content volume | §2.13 | Language must respond to available content |
| Asset capability | §2.14 | Must be evaluated before committing to a direction |
| Brand maturity | §2.15 | Must be classified |
| Creative intensity target | §2.18 | Constrained creative-control mechanism |
| Compatibility of secondary influence | §2.11 | Strong / Caution / hard restriction |

### 19.1 Industry-Fit Calibration

Industry associations in the source are stated as fit and suitability, not as
mandates:

- Editorial: associated "particularly for high-end salons, cosmetic dentistry and
  fine dining"
- Swiss: "especially suitable for medical, legal and professional services"
- Bold: "associates this direction strongly with gyms and fitness"
- Soft: for "salons and beauty businesses," outcome and before/after imagery is
  highlighted
- Architectural: no industry named in its own section

Calibration note: these are statements of fit. The source does not say a business
in a named industry must use the associated language, and it does not say a
language is forbidden for an industry it fails to name. The only prohibition the
source states in this area is §15.3.

### 19.2 Ordering of Selection Steps

The source's closing mental model (§20.2) presents an ordered flow. The source
does not state whether that flow is a strict execution order or an illustrative
architecture. Recorded in §21.

---

## 20. Dependencies and Boundaries

### 20.1 What Phase 2 Owns

Phase 2 owns, per the source:

- visual personality
- composition philosophy
- typography personality
- spacing rhythm
- image behavior
- interaction character
- visual tension
- creative range
- section behavior
- storytelling style

Phase 2 does **not** own technical consistency, accessibility, responsive
behavior, structural primitives, or quality constraints — the source assigns
those to the Foundation (§1.1).

Phase 2 does **not** own business identity, customer psychology, content,
imagery, trust signals, or conversion requirements — the source assigns those to
Business Research (§1.1).

The source references the Foundation and Business Research layers only as inputs
and boundaries. It does not reference a pattern library phase, a business
decision engine phase, or an implementation architecture phase by number. No such
references have been added here.

### 20.2 Phase 2 Final Mental Model

Raw §2.22. The source states: "This is the architecture I want us to preserve."

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
DESIGN LANGUAGE SCORE
        │
        ▼
PRIMARY LANGUAGE
        │
        ▼
SECONDARY INFLUENCE
        │
        ▼
CREATIVE INTENSITY
        │
        ▼
CONTENT DENSITY
        │
        ▼
ASSET CAPABILITY
        │
        ▼
SECTION RHYTHM
        │
        ▼
COMPOSITION STRATEGY
        │
        ▼
UNIQUE WEBSITE DESIGN
```

Note: the raw source stores this diagram as HTML box-drawing entities. The
structure above reproduces the same nodes and the same branch/merge around
Psychology / Brand / Assets. No nodes were added or removed.

### 20.3 Phase 2 — V1 Locked Structure

The source's closing block states: "So our official system now becomes:"

```
BLOGSPAGE AI DESIGN SYSTEM V1

PHASE 1 — FOUNDATION
        ↓
PHASE 2 — VISUAL DESIGN LANGUAGES
        │
        ├── DL-01 Editorial Luxury
        ├── DL-02 Swiss / Structured
        ├── DL-03 Bold Energetic
        ├── DL-04 Soft Premium / Wellness
        └── DL-05 Architectural / Sophisticated
        │
        ├── Visual DNA
        ├── Composition Philosophy
        ├── Typography DNA
        ├── Grid Behavior
        ├── Spacing Rhythm
        ├── Image DNA
        ├── Visual Tension
        ├── Creative Intensity
        ├── Content Density
        ├── Asset Dependency
        ├── Brand Maturity
        ├── Section Behavior
        ├── Motion
        ├── Signature Patterns
        ├── Anti-Patterns
        ├── Internal Variations
        └── Compatibility Rules
```

This enumerates 17 attribute categories. Note that **Grid Behavior** appears as a
named category in this locked structure, but the source does not provide a
discrete "Grid Behavior" subsection per language — grid handling is expressed
inside each language's Composition Philosophy and in §6.2. Recorded in §21.

---

## 21. Open Questions / Ambiguities

Recorded, not resolved. Each item is a gap in the source, not a defect introduced
by canonicalization.

**21.1 Scoring model derivation and consumption.** The 10-dimension scoring table
(§4.3) gives values 1–10 per language but does not state how the values were
derived, nor how the AI consumes them beyond "influence rather than mechanically
determine."

**21.2 Creative intensity computation.** §9 defines a 1–10 scale with three
anchors and six constraining factors, but no rule for computing a value, and no
rule for how a value alters a composition.

**21.3 Creativity score vs. creative intensity.** The per-language "Creativity"
score (§4.3) and the per-website creative intensity target (§9) are separate
constructs. Their relationship is not stated.

**21.4 Visual tension: two representations.** Tension is given qualitatively per
language (Low-medium / Medium-high / High) and numerically in §4.3. The two are
not reconciled.

**21.5 Compatibility matrix incomplete.** §15 lists 6 strong and 3 caution
pairings. Combinations not listed are unaddressed. Directionality is also
unclear: Editorial + Soft and Soft + Editorial both appear as strong, while other
pairings appear once only.

**21.6 Meaning of "Caution."** §15.2 labels three pairings as caution without
defining what mitigation, constraint, or review that label requires.

**21.7 Internal variations unspecified.** All 25 sub-directions (§8) are named;
none is defined. Several names also cross language boundaries (for example
EL-05 Architectural Editorial, SS-05 Editorial Swiss, SP-04 Beauty Editorial,
AS-05 Structural Editorial). The source does not state how a named variation
relates to the primary/secondary influence mechanism in §7.

**21.8 Signature patterns unspecified.** 30 patterns are named across the five
languages (§16); none has a defined structure. Some names recur across languages
(Masonry for Editorial and Soft; Architectural Split in Architectural and echoed
by EL-05). Whether recurrences denote the same pattern is not stated.

**21.9 Proportional blend formula.** §7.1 gives one example (70/20/10). Whether
this three-part split is the model, and how proportions are derived for other
combinations, is not defined.

**21.10 Novelty threshold.** §17.3 instructs regeneration when "too many" of nine
checks repeat, without defining the threshold or the cross-project comparison
mechanism.

**21.11 Section set asymmetry.** §14.1 shows that the source names different
section sets per language. Whether unnamed sections are deliberately excluded or
merely unspecified is not stated.

**21.12 Section rhythm vs. spacing rhythm.** These are separate constructs
(§14.2). For Architectural they are worded identically; for the other four they
differ. The overlap is not explained.

**21.13 "Grid Behavior" category has no home.** Listed as an attribute in the V1
Locked Structure (§20.3) but never given its own per-language subsection.

**21.14 Brand maturity has no defined effect.** §13 requires classification and
names a response per class, but does not define how classification changes
intensity, language selection, or composition.

**21.15 Asset fallbacks defined for two languages only.** §12.3 — Editorial has a
stated pivot and Architectural a stated failure mode. Swiss, Bold, and Soft have
neither.

**21.16 Architectural has no named industry.** Four of the five languages carry
named industry associations in their philosophy sections; DL-05 does not.

**21.17 "The research" is unresolvable.** The source cites "the research"
repeatedly without a reference. All such citations are attributed to the source in
this document. No external material was consulted to resolve them.

**21.18 Mental model: order vs. illustration.** §20.2 presents an ordered flow.
Whether it is a strict execution sequence is not stated. Note also that Content
Density and Asset Capability appear after Creative Intensity in the flow, while
§9.1 lists content and assets as constraints *on* creative intensity. The source
does not reconcile this ordering.

**21.19 Unsuitable industries absent.** No language has a stated list of
unsuitable industries. The only negative industry statement is the gym-into-dental
warning in §15.3.

**21.20 Five languages described as "initial."** §4.2 — the source calls these
five the strongest **initial** set. Whether the set is closed for V1 is not
stated.

---

## 22. Summary

Phase 2 defines five visual grammars — Editorial Luxury (DL-01), Swiss /
Structured (DL-02), Bold Energetic (DL-03), Soft Premium / Wellness (DL-04), and
Architectural / Sophisticated (DL-05) — that sit between the global Foundation
and business context.

The governing principle is **Composition over Configuration**: the same primitive
set produces materially different compositions in each language, and a component
SHOULD NOT dictate final appearance.

The five are distinguished most usefully by their relationship to the grid —
break, control, compress and energize, flow through, construct — rather than by
typeface or color, because composition is what gives the system real distinction.

A design language is **not** a template. The source protects this through three
mechanisms: internal variations per language (§8), universal anti-template rules
(§17.2), and the novelty requirement (§17.3).

Language behavior is modulated by content density (§11), asset capability (§12),
brand maturity (§13), section rhythm (§14.2), visual tension (§10), and a creative
intensity target (§9) — the last stated explicitly as a creative-control
mechanism rather than a rigid numerical rule.

A website MAY combine a primary language with a secondary influence, provided the
influence modifies composition without destroying the primary language and — the
one hard restriction — **never contradicts the business psychology**.

Creativity is bounded by an eight-level hierarchy (§18) in which business truth,
customer needs, conversion, usability, accessibility, and brand identity all rank
above design language and creative expression. Once those are satisfied, the AI
should actively search for the most distinctive tasteful composition available.

Twenty open questions are recorded in §21 rather than resolved.
