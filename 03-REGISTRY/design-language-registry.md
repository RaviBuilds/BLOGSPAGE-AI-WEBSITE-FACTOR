---
document: Blogspage AI Website Factory
layer: Registry
artifact: Design Language Registry
status: draft
version: 0.2.0
authority: factory-global
---

# Design Language Registry

**Purpose:** the single authoritative record of which visual design languages exist, what identifies them, and which per-language values Phase 1 delegates to Phase 2.

**Derived from:** `01-DOCUMENTATION/01-foundation.md` (Phase 1) and `01-DOCUMENTATION/02-visual-design-languages.md` (Phase 2), plus the reconciliation decisions recorded in §7.

**Source document versions.** Recorded per `versioning.md` §3.1 rule 1:

| Source document | Version | Status |
|---|---|---|
| `01-DOCUMENTATION/01-foundation.md` | 1.0.0 | canonical |
| `01-DOCUMENTATION/02-visual-design-languages.md` | 1.0.0 | canonical |

This is derivation metadata. It records which document versions this registry was reconciled from. It confers no authority over those documents, does not version them, and does not alter the precedence set by `source-of-truth.md` §1. A MAJOR change to either document makes this registry stale, per `versioning.md` §3.1 rule 2.

**Scope boundary:** This registry records identity and delegated per-language data. It does not define visual personality — that remains Phase 2's canonical content. Where this registry and a phase document disagree on an identifier, this registry governs; where they disagree on design substance, the phase document governs and the conflict is recorded in §8.

**Registration status:** Registered. This artifact is a recognized factory-global registry under `02-CONTROL-PLANE/source-of-truth.md` §3.1, and a versioned factory-global artifact under `02-CONTROL-PLANE/versioning.md` §3 (`Registries` row) and §3.1. Its authority is confined to the cross-phase concerns it explicitly assigns itself; it does not displace the canonical phase documents on phase-owned subject matter, per `source-of-truth.md` §3.1 rules 2, 3, 4 and 9. The scope boundary above states how that split applies here.

---

## 1. Identifier Set

`DL-01` through `DL-05` are the canonical stable machine identifiers. They are the key any downstream artifact MUST use to refer to a design language.

| Stable ID | Canonical name | Short name | Token slug | V1 status |
|---|---|---|---|---|
| DL-01 | Editorial Luxury | Editorial | `editorial` | LOCKED |
| DL-02 | Swiss / Structured | Swiss | `swiss` | LOCKED |
| DL-03 | Bold Energetic | Bold | `bold` | LOCKED |
| DL-04 | Soft Premium / Wellness | Soft | `soft` | LOCKED |
| DL-05 | Architectural / Sophisticated | Architectural | `architectural` | LOCKED |

**Rules**

1. The stable ID is the machine key. It MUST NOT change once assigned.
2. The canonical name is the human-readable form. It is unchanged from Phase 2 §4.2.
3. The short name is for prose and table headers where the canonical name is too long. It is not a second identifier.
4. The token slug is the only form permitted in token paths, matching Foundation §20's `language/` tier.
5. No downstream artifact may introduce a sixth language, or rename any of these five, without the versioned system change described in §2.

### 1.1 V1 Lock

The five-language set is **LOCKED for V1**.

Locked means the supported set is fixed for V1 and no agent or phase may add, remove, merge, or rename a language during normal operation. It does not mean permanently immutable: changing the supported language set requires an explicit, versioned system change approved at factory level.

**Effect on Foundation §24.1.** Foundation §24.1 records the five languages as "not yet final," pending confirmation that each has a genuinely different composition philosophy rather than merely a different font/colour combination. Phase 2 §6.2 supplies exactly that confirmation by giving each language a distinct relationship to the grid:

| ID | Composition philosophy (Phase 2 §5.x.4) | Relationship to the grid (Phase 2 §6.2) |
|---|---|---|
| DL-01 | Break the grid without destroying it | **Break** the grid |
| DL-02 | The grid is visible; celebrates the grid | **Control** the grid |
| DL-03 | Compress and amplify | **Compress and energize** the grid |
| DL-04 | Flow rather than structure | **Flow through** the grid |
| DL-05 | Build the page like architecture | **Construct** the grid |

Five distinct grid relationships, each tied to a distinct composition philosophy, satisfy the §24.1 gate. The lock in this section is recorded as the resolution of that open question. Foundation §24.1 still reads "not final" in its own text; that text is not amended by this registry, and the discrepancy is recorded in §8.

---

## 2. Changing the Language Set

A change to the supported language set is a system-level change, not a project-level or phase-level one.

| Change | Requires |
|---|---|
| Add a sixth language | Versioned system change, factory-level approval |
| Remove a language | Versioned system change, factory-level approval |
| Rename a canonical name | Versioned system change; stable ID and token slug unchanged |
| Change a stable ID | Not permitted |
| Change a token slug | Versioned system change; invalidates existing token paths |
| Fill a per-language value currently UNDEFINED | Amendment to this registry plus the owning phase document |

Filling an UNDEFINED value in §5 is not a change to the language set and does not require a versioned system change. It requires only that the value be authored by the owning phase and recorded here.

---

## 3. Legacy Aliases

These forms appear in the current canonical documents. They are recognised as aliases of the IDs above, and are listed so that a reader encountering them can resolve them. New artifacts MUST NOT use them.

| Alias as written | Appears in | Resolves to |
|---|---|---|
| Editorial | Foundation §5.3, §7.2, §8.1, §11.1; Phase 2 §6.1 | DL-01 |
| EDITORIAL | Phase 2 §6.2 | DL-01 |
| Swiss | Foundation §5.3, §7.2, §8.1, §11.1; Phase 2 §6.1 | DL-02 |
| SWISS | Phase 2 §6.2 | DL-02 |
| Bold | Foundation §7.2, §11.1; Phase 2 §6.1 | DL-03 |
| BOLD | Phase 2 §6.2 | DL-03 |
| Soft | Phase 2 §6.1 | DL-04 |
| Soft Premium | Foundation §11.1; Phase 2 §4.2 canonical name | DL-04 |
| SOFT | Phase 2 §6.2 | DL-04 |
| Architectural | Foundation §5.3, §8.1, §11.1; Phase 2 §6.1 | DL-05 |
| ARCHITECTURAL | Phase 2 §6.2 | DL-05 |

### 3.1 The Soft Naming Discrepancy

Foundation §24.1 explicitly records that the source uses `soft` in the token path (§20) and "Soft Premium" in the shape table (§11.1), and states the difference is not resolved there. This registry resolves it: canonical name **Soft Premium / Wellness**, short name **Soft**, token slug `soft`. All three forms are correct in their own register. None is a separate language.

### 3.2 Sub-Variation Prefixes

Phase 2 §8 names 25 sub-variations using prefixes that do not align with the `DL-nn` scheme:

| Prefix range | Language | Count | Alignment |
|---|---|:--:|---|
| `EL-01`…`EL-05` | DL-01 Editorial | 5 | Prefix does not match `DL-01` |
| `SS-01`…`SS-05` | DL-02 Swiss | 5 | Prefix does not match `DL-02` |
| `BE-01`…`BE-05` | DL-03 Bold | 5 | Prefix does not match `DL-03` |
| `SP-01`…`SP-05` | DL-04 Soft | 5 | Prefix does not match `DL-04` |
| `AS-01`…`AS-05` | DL-05 Architectural | 5 | Prefix does not match `DL-05` |

These prefixes are recorded as legacy aliases. Whether sub-variations are renumbered to a `DL-nn.mm` form is **TO BE RESOLVED** and is listed in §8. Phase 2 §8 names all 25 variations but specifies the visual characteristics of none, so the sub-variation layer is not usable by a downstream phase in its current state regardless of the identifier question.

---

## 4. Delegation from Foundation

Foundation §23.2 lists nine concerns that Phase 1 MUST NOT specify and that belong to Phase 2 per language. This is the delegation set this registry tracks.

| # | Delegated concern (Foundation §23.2 wording) | Phase 2 location | Per-language data complete? |
|:--:|---|---|---|
| 1 | Typography personality (font choices per language) | §5.x.5, §6.1 | Yes — all five |
| 2 | Spacing rhythm aggressiveness per language | §5.x.6 | Yes — all five |
| 3 | Corner language and border language defaults | Not assigned per language | Corner: partial (source). Border: **FACTORY-DEFINED V1 DEFAULT — all five** (§5.5) |
| 4 | Grid behavior per language | §5.x.4, §6.2 | Yes — all five |
| 5 | Motion character and default `motionIntensity` | §5.x.10, §4.3, §6.1 | Character: yes (source). `motionIntensity`: **FACTORY-DEFINED V1 DEFAULT — all five** (§5.6) |
| 6 | Image treatment aggressiveness | §5.x.7, §12.3 | Yes — all five |
| 7 | Visual density | §5.x.11, §11.2 | Yes — all five |
| 8 | Container reinterpretation per language | Foundation §5.3 only | **FACTORY-DEFINED V1 DEFAULT — all five** (§5.9); 3 of 5 also have a source-derived value |
| 9 | Navigation visual expression | Not assigned per language | **FACTORY-DEFINED V1 DEFAULT — all five** (§5.10) |

All nine delegations now carry complete per-language data. Items 3, 5, 8 and 9 are complete by **factory-defined V1 default** rather than by source transcription; the other five are complete from the source documents.

**This does not amend Foundation §23.2.** The delegation of these four concerns to Phase 2 stands as written. The factory defaults fill the gap operationally for V1 without transferring ownership and without claiming Phase 2 authored them. Should Phase 2 later author its own values, the resolution recorded here is superseded for those concerns.

Note on item 8: container reinterpretation is delegated to Phase 2 by Foundation §23.2, but the only per-language container values in either source document appear in **Foundation** §5.3 — the delegating document, not the delegate. That inversion is unchanged by the factory defaults and remains recorded in §8.

---

## 5. Per-Language Delegated Values

Values in this section carry one of two provenance layers, and every value is labelled:

| Layer | Meaning |
|---|---|
| **SOURCE-DERIVED** | Transcribed from Foundation or Phase 2. Not inferred, not adjusted. |
| **FACTORY-DEFINED V1 DEFAULT** | Authored by the factory as a V1 operational decision. Not extracted from any source document. |

**Precedence.** For operational V1 design decisions, **FACTORY-DEFINED V1 DEFAULT > SOURCE-DERIVED TRANSCRIPTION**. For historical and source provenance, the source-derived transcription is preserved and remains authoritative as to what the source says.

A factory-defined value is never a correction to the source. Where the two differ, both are recorded and the divergence is stated explicitly. No source document is amended by this registry.

Four concerns carry factory-defined V1 defaults: border language (§5.5), per-language `motionIntensity` (§5.6), container expression (§5.9) and navigation expression (§5.10). Everything else in §5 is source-derived. Where neither layer supplies a value, the cell reads UNDEFINED / TO BE RESOLVED and no value is inferred to fill it.

### 5.1 Typography Personality

| ID | Phase 2 §5.x.5 | Foundation §8.1 H1 illustration |
|---|---|---|
| DL-01 | Primary high-contrast serif; secondary neutral modern sans | H1 = elegant serif |
| DL-02 | Neo-grotesque sans | H1 = precise grotesque |
| DL-03 | Heavy sans-serif; condensed, heavy, uppercase, tight, oversized | H1 = heavy condensed sans |
| DL-04 | Warm serif / soft geometric sans / low-contrast serif | Not named |
| DL-05 | Wide/extended sans; typography as architectural signage | H1 = wide modern sans |

Foundation §8.1 illustrates the boundary rule ("Foundation says H1 must scale fluidly; Design Language says what H1 looks like") rather than specifying personality. Phase 2 §5.x.5 is authoritative. The two agree wherever both speak.

### 5.2 Spacing Rhythm and Progression

| ID | Rhythm (Phase 2 §5.x.6) | Progression (Foundation §7.2) |
|---|---|---|
| DL-01 | quiet → expansive → intimate → dramatic → expansive | 96 → 160 → 192 |
| DL-02 | consistent · controlled · predictable | 48 → 64 → 80 |
| DL-03 | dense → impact → dense → image → massive type → impact | 32 → 48 → 64 |
| DL-04 | generous → intimate → generous → image → quiet | UNDEFINED / TO BE RESOLVED |
| DL-05 | MONUMENTAL → VOID → STRUCTURE → CINEMATIC → VOID → MONUMENTAL | UNDEFINED / TO BE RESOLVED |

Both progressions draw from the Foundation spacing scale `8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 128 / 160 / 192` (Foundation §7.2). The numeric progressions sit in Foundation while §23.2 delegates "spacing rhythm aggressiveness" to Phase 2 — the same inversion noted for containers. Recorded in §8.

### 5.3 Grid Behavior

| ID | Composition philosophy | Grid relationship | Permitted operations |
|---|---|---|---|
| DL-01 | Break the grid without destroying it | Break | Foundation §6.3: offset left, offset right, overlap, bleed |
| DL-02 | The grid is visible; celebrates it; does not usually break it | Control | As above |
| DL-03 | Compress and amplify | Compress and energize | As above |
| DL-04 | Flow rather than structure | Flow through | As above |
| DL-05 | Build the page like architecture | Construct | As above |

Foundation owns the 12-column base grid, the eight permitted column compositions (§6.2) and the four deliberate grid operations (§6.3). No language may exceed that mechanical vocabulary.

### 5.4 Corner / Shape Language

| ID | Shape default (Foundation §11.1) | Within declared range? |
|---|---|---|
| DL-01 | refined / subtle | Partly — "refined" is not a range member |
| DL-02 | sharp / subtle | Yes |
| DL-03 | sharp / high contrast | Partly — "high contrast" is not a range member |
| DL-04 | softer / organic | Partly — "softer" is not the range member "soft" |
| DL-05 | very sharp | Partly — "very sharp" is not the range member "sharp" |

Foundation §11.1 declares the shape range as `sharp / subtle / soft / rounded / organic`, then names per-language defaults using terms outside that range. This is a source-level inconsistency inside a single Foundation section. Recorded in §8. Per decision 10 the authoritative per-language values belong here once the vocabulary is reconciled; until then the Foundation §11.1 wording is transcribed unchanged.

### 5.5 Border Language

| ID | Border default |
|---|---|
| DL-01 | UNDEFINED / TO BE RESOLVED |
| DL-02 | UNDEFINED / TO BE RESOLVED |
| DL-03 | UNDEFINED / TO BE RESOLVED |
| DL-04 | UNDEFINED / TO BE RESOLVED |
| DL-05 | UNDEFINED / TO BE RESOLVED |

**FACTORY-DEFINED V1 DEFAULTS**

| ID | FACTORY-DEFINED V1 DEFAULT | SOURCE-DERIVED — Foundation / Phase 2 |
|---|---|---|
| DL-01 | Minimal / selective | Not present in the source |
| DL-02 | Structural / visible | Not present in the source |
| DL-03 | Graphic / strong | Not present in the source |
| DL-04 | Soft / restrained | Not present in the source |
| DL-05 | Thin / architectural | Not present in the source |

**Provenance.** These five values are factory-authored V1 operational decisions.
They were **not** extracted from Foundation, from Phase 2, or from any raw source.
Foundation §23.2 delegates "border language defaults" to Phase 2 and Phase 2
assigns no per-language border value, so there is no source-derived layer to
preserve for any of the five.

**Precedence.** For operational V1 design decisions the factory-defined value
governs. No source transcription is displaced, because none exists.

**What the source does say, and why it is not a default.** The only border
statements available are negative and sit inside anti-pattern lists — "Heavy
borders" is a DL-04 anti-pattern (§17.1) — plus Foundation §11.2's global
preference for structural borders before heavy shadows. Neither is a per-language
default, and neither was used to derive the values above. Foundation §11.2's
elevation preference continues to apply to every language and is unamended.

### 5.6 Motion

| ID | Qualitative band (§5.x.10) | `motionExpression` 1–10 (§4.3) | `motionIntensity` 0–3 — FACTORY-DEFINED V1 DEFAULT |
|---|---|:--:|:--:|
| DL-01 | Low to moderate | 4 | 1 |
| DL-02 | Minimal | 2 | 0 |
| DL-03 | High | 9 | 3 |
| DL-04 | Low | 3 | 1 |
| DL-05 | Moderate-high | 7 | 2 |

**Provenance of the `motionIntensity` column.** These five values are
factory-authored V1 operational decisions, labelled **FACTORY-DEFINED V1
DEFAULT**. They were **not** extracted from Foundation §12.3, from Phase 2, or
from any raw source, and they were **not** derived from the `motionExpression`
column. No source-derived per-language layer exists to preserve.

**No mapping is created.** The adjacency of the 1–10 and 0–3 columns in the table
above is presentational only. It does not define, imply or license a conversion
between them in either direction. Decision 5 stands unchanged.

Three separate representations of motion exist across the two documents. Per decision 5 they are **not** mapped to one another:

- The qualitative band is Phase 2's per-language motion character.
- `motionExpression` (1–10) is Phase 2's numeric creative/style parameter, from the §4.3 scoring model. It MUST NOT be renamed `motionIntensity`.
- `motionIntensity` (0–3) is the Foundation parameter from §12.3.

Foundation §23.2 delegates "default `motionIntensity`" per language to Phase 2, but Foundation §12.3 keys the 0–3 scale to **business type** (Dental 1, Luxury Salon 1–2, Restaurant 2, Gym 2–3), not to design language, and Phase 2 never states a 0–3 value. Deriving one from the 1–10 column is forbidden by decision 5. The per-language 0–3 values above are therefore supplied as factory-defined V1 defaults rather than transcribed, and they are consumable in that capacity.

Foundation §12.3's business-type values remain Foundation's and are unamended. Where a business-type value and a per-language default both apply to one project, this registry does not state which is selected — that selection rule is **UNDEFINED / TO BE RESOLVED** and is recorded in §8.

### 5.7 Image Treatment and Asset Dependency

| ID | Image DNA (§5.x.7) | Asset dependency (§12.3) | Named fallback |
|---|---|---|---|
| DL-01 | Portraits, close-up details, architecture, environmental, lifestyle, premium service; expressive cropping permitted | High | Shift to typography-led editorial composition rather than generic stock |
| DL-02 | Literal and trustworthy; real doctors, facility, equipment, team, location; avoid heavy filters; true-colour, well-lit | Low-medium | Not specified |
| DL-03 | Action, athletes, trainers, movement, equipment, transformation, energetic group scenes; video valuable | High | Not specified |
| DL-04 | Human-centred; real people, treatment environments, relaxed portraits, natural light, tactile close-ups; outcome and before/after for salons | Medium-high | Not specified |
| DL-05 | Architecture, interiors, dramatic portraits, cinematic environmental, high-end facilities, controlled lighting | Very high — most photography-sensitive | Not specified; source warns the direction **can fail** without strong professional imagery |

Foundation §10.1 owns the ratio and treatment capability set (`1:1`, `4:5`, `3:4`, `4:3`, `16:9`, `21:9`; portrait, landscape, full bleed, masked, cropped, object-positioned). Foundation §10.2's poor-photography pivot is a hard rule and applies to every language regardless of the fallbacks above.

Fallback behaviour for DL-02, DL-03 and DL-04 is **UNDEFINED / TO BE RESOLVED**, already recorded in Phase 2 §21.

Asset-to-language viability (§12.2) is stated by the source as examples, not prohibitions: strong photography + video favours DL-05/DL-03; strong portraits favour DL-01; weak photography favours DL-02; warm people photography favours DL-04. No language is forbidden when its matching asset condition is absent.

### 5.8 Content Density

| ID | Density range (§11.2) | Consequence of exceeding it |
|---|---|---|
| DL-01 | Low → Medium | Too much information should trigger a more structured pattern |
| DL-02 | Medium → High | None — handles higher density rather than being degraded by it |
| DL-03 | Medium → High (when hierarchy is strong) | None — handles higher density when hierarchy is strong |
| DL-04 | Low → Medium | Overloading the page weakens the emotional goal |
| DL-05 | Low → Medium | Too much information breaks the architectural feel |

### 5.9 Container Reinterpretation

This section carries **two provenance layers**. They are not alternatives to each
other and neither replaces the other.

**Precedence**

| Purpose | Governing layer |
|---|---|
| Operational V1 design decisions | **FACTORY-DEFINED V1 DEFAULT** |
| Historical / source provenance | **SOURCE-DERIVED TRANSCRIPTION** |

A consumer selecting a container expression for a V1 build MUST use the
factory-defined value. The source-derived column exists so that the origin of the
earlier wording remains traceable; it is never the operative value and is never
deleted.

| ID | FACTORY-DEFINED V1 DEFAULT | SOURCE-DERIVED — Foundation §5.3 | Divergence |
|---|---|---|---|
| DL-01 | Asymmetric / occasional bleed | Asymmetric wide composition | Yes — the factory value adds occasional bleed; the source names no bleed behaviour |
| DL-02 | Controlled / contained | Tight controlled container | Yes — wording differs; "tight" is not carried into the factory value |
| DL-03 | Flexible / occasional bleed | Not present in the source | No source value exists to diverge from |
| DL-04 | Fluid / soft containment | Not present in the source | No source value exists to diverge from |
| DL-05 | Wide / edge-oriented | Edge-to-edge | Yes — "edge-oriented" is weaker than the source's absolute "edge-to-edge" |

**Provenance of the factory-defined column.** These five values are
factory-authored V1 operational decisions. They were **not** extracted from
Foundation §5.3, from Phase 2, or from any raw source. Two of the five (DL-03,
DL-04) fill delegations that no source document ever filled.

**On the three divergences.** Where the factory-defined value differs from the
source-derived value, both are preserved. The difference is an intentional V1
operational decision, **not** a correction to the source and not a claim that the
source wording is wrong. Foundation §5.3 is unamended by this registry.

**Foundation's mechanical authority is unaffected.** Foundation §5.3 owns the four
container classes — Standard content 70–80rem, Wide content 85–95rem, Cinematic
content 100rem+, Full bleed 100vw — and states they are "not hard visual numbers
at this version," becoming tokens each language MAY reinterpret. Foundation §24.2
records the widths themselves as unresolved; that remains UNDEFINED and is not
touched here. The factory defaults above govern expression, not mechanics.

### 5.10 Navigation Visual Expression

**FACTORY-DEFINED V1 DEFAULTS**

| ID | FACTORY-DEFINED V1 DEFAULT | SOURCE-DERIVED — Foundation / Phase 2 |
|---|---|---|
| DL-01 | Minimal / refined | Not present in the source |
| DL-02 | Structured / precise | Not present in the source |
| DL-03 | Strong / graphic | Not present in the source |
| DL-04 | Subtle / floating | Not present in the source |
| DL-05 | Minimal / cinematic | Not present in the source |

**Provenance.** These five values are factory-authored V1 operational decisions.
They were **not** extracted from Foundation §17, from Phase 2, or from any raw
source. Foundation §23.2 delegates navigation visual expression to Phase 2 and
Phase 2 assigns no navigation treatment to any language, so there is no
source-derived layer to preserve for any of the five.

**Precedence.** For operational V1 design decisions the factory-defined value
governs. No source transcription is displaced, because none exists.

**Foundation's functional authority is unaffected.** Foundation §17 requires
navigation to provide access to brand, primary destination links and primary CTA,
lists seven possible implementations (minimal, transparent, floating, sticky, edge,
compact, overlay), and states "Foundation defines functionality. Design Language
defines expression." The defaults above are expression only. They do not remove any
required element, and they do not extend the seven-member implementation set.

**Relationship to the seven implementation types.** The values above are expression
descriptors, not selections from the §17 list. Which of the seven implementation
types each expression resolves to is **UNDEFINED / TO BE RESOLVED** and is recorded
in §8. No such mapping is asserted here.

### 5.11 Visual Tension

| ID | Qualitative (§5.x.8) | Numeric (§4.3) |
|---|---|:--:|
| DL-01 | Medium-high | 8 |
| DL-02 | Low-medium | 4 |
| DL-03 | High | 9 |
| DL-04 | Low-medium | 3 |
| DL-05 | High | 8 |

Phase 2 §10 explicitly records that the source does not reconcile the qualitative and numeric representations. DL-02 and DL-04 share the band "Low-medium" but differ numerically (4 vs 3); DL-03 and DL-05 share "High" but sit at 9 and 8. No mapping is invented here.

### 5.12 Scoring Profile

Phase 2 §4.3, transcribed. **Not hard constraints — AI guidance.** The source does not state how the values are derived or consumed.

| Dimension | DL-01 | DL-02 | DL-03 | DL-04 | DL-05 |
|---|:--:|:--:|:--:|:--:|:--:|
| Creativity | 9 | 6 | 10 | 7 | 9 |
| Visual tension | 8 | 4 | 9 | 3 | 8 |
| Whitespace | 9 | 6 | 4 | 9 | 8 |
| Typography drama | 9 | 6 | 10 | 6 | 8 |
| Image dependence | 8 | 5 | 9 | 8 | 10 |
| Motion (`motionExpression`) | 4 | 2 | 9 | 3 | 7 |
| Structural rigidity | 3 | 10 | 5 | 4 | 8 |
| Information density | 4 | 9 | 8 | 4 | 5 |
| Shape softness | 5 | 2 | 2 | 9 | 1 |
| Visual restraint | 8 | 9 | 3 | 8 | 9 |

### 5.13 Industry Association and Suitability

| ID | Named association | Unsuitable industries |
|---|---|---|
| DL-01 | High-end salons, cosmetic dentistry, fine dining | UNDEFINED / TO BE RESOLVED |
| DL-02 | Medical, legal, professional services | UNDEFINED / TO BE RESOLVED |
| DL-03 | Gyms and fitness | UNDEFINED — partial pointer to §15.3 only |
| DL-04 | Salons and beauty (outcome / before-after imagery) | UNDEFINED / TO BE RESOLVED |
| DL-05 | Not named in its own section | UNDEFINED / TO BE RESOLVED |

Per Phase 2 §19.1 these are statements of fit, not mandates. A business in a named industry is not required to use the associated language, and a language is not forbidden for an industry it fails to name. The single hard restriction is §15.3: a secondary influence MUST NEVER contradict the business psychology.

DL-03's §5.3.15 points to the §15.3 warning against transferring aggressive gym aesthetics into dental/medical environments. That is a cross-pollination restriction, not an unsuitable-industry list. The distinction is preserved rather than collapsed.

### 5.14 Language-Specific Anti-Patterns

Per decision 7, Phase 2 owns these. Transcribed from §17.1. All 25 entries below are **SOURCE-DERIVED** and are preserved in full.

**Scope.** Every entry in this table is language-scoped. Phase 2 §17.2 additionally transcribes Foundation's 12 universal anti-template rules; those are **Foundation-owned** and are not restated normatively here. Where Phase 2 §17.2 reproduces them, that reproduction is a non-normative reference — the authoritative statement of a universal anti-pattern is Foundation's.

| ID | Language-specific anti-patterns |
|---|---|
| DL-01 | Generic SaaS cards · Neon gradients · Excessive pills · Dense dashboard-style layouts · Aggressive animation |
| DL-02 | Random overlaps · Organic blobs everywhere · Excessive parallax · Playful rounded UI · Decorative clutter |
| DL-03 | Delicate typography · Overly soft palettes · Entire page filled with huge whitespace · Calm wellness-like motion · Timid CTAs |
| DL-04 | Harsh black · Aggressive red/neon · Heavy borders · Kinetic typography · Hard geometric grids everywhere · Aggressive CTAs |
| DL-05 | Cute UI · Excessive rounded cards · Playful illustrations · Dense paragraphs · SaaS-like card grids · Weak photography |

These are language-scoped, not global. Phase 2 §17.1 notes the deliberate consequence: kinetic typography is a DL-04 anti-pattern while being a DL-03 motion option; dense information zones are a DL-03 composition option while dense layouts are a DL-01 anti-pattern. A language-specific anti-pattern MUST NOT be promoted to a universal prohibition. Universal anti-patterns belong to Foundation.

### 5.15 Signature Patterns and Sub-Variations

| ID | Signature patterns (§16) | Sub-variations (§8) |
|---|---|---|
| DL-01 | Editorial Split · Oversized Statement · Offset Portrait · Image Overlap · Quiet Quote · Masonry Story | EL-01 Editorial Minimal · EL-02 Image Editorial · EL-03 Typographic Editorial · EL-04 Layered Editorial · EL-05 Architectural Editorial |
| DL-02 | Structured Split · Service Index · Information Grid · Credential Matrix · Numbered Process · Precision Footer | SS-01 Clinical Precision · SS-02 Modern Professional · SS-03 Information Rich · SS-04 Minimal Swiss · SS-05 Editorial Swiss |
| DL-03 | Typographic Takeover · Kinetic Hero · Mega Stats · Program Rail · Transformation Wall · Marquee | BE-01 Kinetic · BE-02 Typographic · BE-03 Cinematic · BE-04 Graphic · BE-05 Athletic |
| DL-04 | Soft Split · Organic Grid · Treatment Story · Before/After · Floating Portrait · Gentle Testimonial | SP-01 Spa Calm · SP-02 Clinical Soft · SP-03 Organic Luxury · SP-04 Beauty Editorial · SP-05 Human Wellness |
| DL-05 | Cinematic Hero · Monumental Statement · Structural Grid · Spatial Gallery · Architectural Split · Framed CTA | AS-01 Dark Cinema · AS-02 Light Architecture · AS-03 Monolithic · AS-04 Luxury Minimal · AS-05 Structural Editorial |

The structure and composition of all 30 signature patterns are **UNDEFINED / TO BE RESOLVED**, as are the visual characteristics of all 25 sub-variations. Both are already recorded in Phase 2 §21. Signature patterns are characteristic of a language, not required sections or a fixed template sequence.

### 5.16 Section Rhythm Profile

Phase 2 §14.2, given by the source as examples.

| ID | Rhythm profile |
|---|---|
| DL-01 | Quiet → Image → Typography → Silence → Story → Image → CTA |
| DL-02 | Information → Trust → Information → Proof → Information → Action |
| DL-03 | Impact → Density → Impact → Movement → Impact → Action |
| DL-04 | Calm → Human → Image → Story → Calm → Action |
| DL-05 | Monumental → Void → Structure → Cinema → Void → Monumental |

Section rhythm (§14.2) and spacing rhythm (§5.x.6, reproduced in §5.2 above) are distinct constructs. For DL-05 the two sequences are identical in wording; for the other four they differ. Phase 2 §21 records that the source does not comment on this overlap.

---

## 6. Combination Rules

| Combination | Status (Phase 2 §15) |
|---|---|
| DL-01 + DL-05 | Strong |
| DL-01 + DL-04 | Strong |
| DL-02 + DL-04 | Strong |
| DL-02 + DL-05 | Strong |
| DL-03 + DL-05 | Strong |
| DL-04 + DL-01 | Strong |
| DL-03 + DL-02 | Caution |
| DL-03 + DL-04 | Caution |
| DL-05 + DL-04 | Caution |

A website MAY use `Primary Language + Secondary Influence`. The secondary influence SHOULD modify composition without destroying the primary language.

**Hard restriction (§15.3):** a secondary influence MUST NEVER contradict the business psychology.

What "Caution" requires in practice is **UNDEFINED / TO BE RESOLVED** — the source labels these combinations without prohibiting them or stating what care they demand. Phase 2 §15 lists both `DL-01 + DL-04` and `DL-04 + DL-01` as Strong, which suggests order carries meaning somewhere in the model, but the source does not say how. Not resolved here.

Influence proportions: the source gives one worked example only — 70% Editorial / 20% Architectural / 10% business expression — and explicitly presents it as an example, not a formula. Proportions for all other combinations, and whether the three-part split is fixed, are **UNDEFINED / TO BE RESOLVED**.

---

## 7. Governing Decisions

This registry implements the following recorded reconciliation decisions.

| # | Decision |
|:--:|---|
| 1 | Registries live in `03-REGISTRY/` as factory-global authority artifacts |
| 2 | `DL-01`…`DL-05` are the canonical stable IDs; canonical human-readable names unchanged |
| 3 | The five-language V1 set is LOCKED; changes require an explicit versioned system change |
| 4 | Factory-defined V1 defaults are authoritative for operational V1 design decisions; source-derived transcriptions are preserved for provenance. Where the two differ, both are recorded and the divergence stated. A factory default is never a correction to the source |
| 5 | Foundation owns `motionIntensity` 0–3; Phase 2's 1–10 value is `motionExpression`; no mapping between them |
| 7 | Foundation owns universal anti-patterns; Phase 2 owns language-specific anti-patterns; Phase 6 evaluates both |
| 10 | Foundation owns capabilities and ranges; Phase 2 owns language-specific preferences and defaults; this registry holds the authoritative per-language values where they are data-like |
| 12 | Every conceptual concern has one authoritative owner; other phases may consume, transform, implement or evaluate but MUST NOT silently redefine authority |

---

## 8. Unresolved Items

| # | Item | Nature | Blocks |
|:--:|---|---|---|
| 1 | Spacing progression — DL-04, DL-05 | Partial; 3 of 5 present | Phase 5 |
| 2 | Unsuitable industries — all five | Phase 2 §5.x.15 leaves five gaps | Phase 4 |
| 3 | Poor-asset fallback — DL-02, DL-03, DL-04 | Named for DL-01 and DL-05 only | Phase 4 |
| 4 | `motionIntensity` selection when business type and design language disagree | §5.6 supplies per-language defaults; Foundation §12.3 supplies business-type values; which governs is unstated | Phases 4, 5 |
| 5 | `motionIntensity` level semantics | What 0, 1, 2 and 3 each permit is unstated in Foundation §12.3 | Phase 5 |
| 6 | Navigation expression → §17 implementation type | §5.10 supplies expression descriptors; which of the seven Foundation types each resolves to is unstated | Phase 5 |
| 7 | Shape vocabulary mismatch in Foundation §11.1 | Per-language defaults use terms outside the section's own declared range | Token authoring |
| 8 | Sub-variation identifier scheme | `EL-`/`SS-`/`BE-`/`SP-`/`AS-` do not align with `DL-nn` | Any use of sub-variations |
| 9 | 25 sub-variation characteristics | Named, never specified | Any use of sub-variations |
| 10 | 30 signature pattern structures | Named, never specified | Phase 3 |
| 11 | Influence proportions beyond the single 70/20/10 example | One example, no formula | Phase 4 |
| 12 | What "Caution" requires for the three cautioned combinations | Labelled, never defined | Phase 4 |
| 13 | Qualitative vs numeric visual tension | Two unreconciled representations, per Phase 2 §10 | Phase 4 |
| 14 | Foundation §24.1 still reads "not final" | §1.1 here locks the set; Foundation text unamended | Documentation consistency |
| 15 | Delegation inversion: containers (§5.3) and spacing progressions (§7.2) | Per-language values sit in Foundation while §23.2 delegates them to Phase 2 | Ownership clarity |
| 16 | Container widths not fixed | Foundation §24.2 records them as approximate | Token authoring |
| 17 | ~~Section rhythm vs spacing rhythm overlap~~ | **RESOLVED.** Two distinct constructs that share near-identical wording for DL-05, not one duplicated construct. Section rhythm is an ordered sequence of section-level moments (§14.2, matrix Row 26); spacing rhythm is an ordinal density characteristic drawn from Foundation's spacing scale (§7.2, matrix Row 20). Neither derives from the other and no mapping is defined. Rhythm ownership additionally splits three ways — see matrix Row 26 and `parameter-registry.md` §8 decision 8. | — |

Items 1 through 3 are unfilled or partial delegations — missing data. Items 4, 5 and 6 are gaps that the factory-defined V1 defaults expose rather than create: supplying a value raises the question of how it is selected and what it means concretely, and neither is answered by any source document. Items 7, 14, 15 and 16 are inconsistencies inside the canonical documents, resolved by amending those documents rather than by this registry. Item 17 is resolved: it was a misreading of two distinct constructs as one.

Item 10 remains open and is now sharper. Phase 3 is canonical (`03-composition-pattern-system.md` 1.1.0) and defines the composition and pattern vocabulary, but specifies **none** of the ~87 composition patterns it targets and cannot consume Phase 2's 30 unspecified signature pattern structures. Both pattern layers are therefore named and unpopulated. See `phase-ownership-matrix.md` §7 issues 5 and 9.

**Resolved by the factory-defined V1 defaults in §5.** Per-language `motionIntensity` (§5.6), navigation expression (§5.10), border language (§5.5) and container expression (§5.9) were previously listed here as unfilled delegations. All four now carry complete per-language values for all five languages. They are resolved operationally for V1 by factory authorship, not by source transcription, and Foundation §23.2's delegation of them to Phase 2 is unamended.
