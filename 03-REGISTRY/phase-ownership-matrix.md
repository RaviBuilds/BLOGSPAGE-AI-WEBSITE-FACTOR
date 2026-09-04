---
document: Blogspage AI Website Factory
layer: Registry
artifact: Phase Ownership Matrix
status: draft
version: 0.3.0
authority: factory-global
---

# Phase Ownership Matrix

**Purpose:** the single authoritative record of which phase owns each conceptual concern in the factory, which phases consume it, and what each consuming phase is permitted to do with it.

**Derived from:** `01-DOCUMENTATION/01-foundation.md`, `01-DOCUMENTATION/02-visual-design-languages.md`, `02-CONTROL-PLANE/agent-roles.md`, `02-CONTROL-PLANE/quality-gates.md`, plus the reconciliation decisions recorded in §6.

**Source document versions.** Recorded per `versioning.md` §3.1 rule 1:

| Source document | Version | Status |
|---|---|---|
| `01-DOCUMENTATION/01-foundation.md` | 1.0.0 | canonical |
| `01-DOCUMENTATION/02-visual-design-languages.md` | 1.0.0 | canonical |
| `01-DOCUMENTATION/03-composition-pattern-system.md` | 1.1.0 | canonical |
| `01-DOCUMENTATION/04-ai-creative-direction.md` | 1.0.0 | canonical |
| `01-DOCUMENTATION/05-ai-implementation.md` | 1.0.0 | canonical |
| `01-DOCUMENTATION/06-independent-critic.md` | 1.0.0 | canonical |
| `02-CONTROL-PLANE/agent-roles.md` | 0.2.0 | draft |
| `02-CONTROL-PLANE/quality-gates.md` | 0.2.0 | draft |
| `02-CONTROL-PLANE/artifact-contracts.md` | 0.2.0 | draft |
| `02-CONTROL-PLANE/state-machine.md` | 0.2.0 | draft |
| `02-CONTROL-PLANE/failure-routing.md` | 0.2.0 | draft |

**All six phase documents are now canonical.** Rows 32 and 33 derive from canonical Phase 3 and were re-verified in the C-1..C-9 pass. Rows 34–43 derive from canonical Phases 4, 5 and 6 at the versions recorded above, and were re-verified in the C-10 pass, per the §1.1 obligation. The earlier statement that these rows derived from no canonical document is superseded and was factually wrong at the time this table was last revised. See §6 decision 16.

This is derivation metadata. It records which document versions this matrix was reconciled from. It confers no authority over those documents, does not version them, and does not alter the precedence set by `source-of-truth.md` §1. A MAJOR change to any of them makes this matrix stale, per `versioning.md` §3.1 rule 2.

**Governing principle (decision 12):** every conceptual concern has exactly **one** authoritative owner. Other phases may consume, transform, implement or evaluate it. No phase may silently redefine a concern it does not own.

**Registration status:** Registered. This artifact is a recognized factory-global registry under `02-CONTROL-PLANE/source-of-truth.md` §3.1, and a versioned factory-global artifact under `02-CONTROL-PLANE/versioning.md` §3 (`Registries` row) and §3.1. `source-of-truth.md` §3.1 rule 5 assigns it the resolution of ownership where phase-owned content and registry-owned cross-phase metadata appear together. Its authority is confined to that assignment; it does not displace the canonical phase documents on phase-owned subject matter, per `source-of-truth.md` §3.1 rules 2, 3, 4 and 9. The governing principle above states how that split applies here.

---

## 1. Scope and Reliability

### 1.1 Row Reliability

**No row in this matrix is provisional.** All six phase documents are canonical, at the versions recorded in the source table above.

The provisional mechanism existed because Phases 4, 5 and 6 were unwritten. That condition no longer holds. Rows whose owner is Phase 4, 5 or 6 were resolved against `02-CONTROL-PLANE/agent-roles.md`, `02-CONTROL-PLANE/quality-gates.md` and the raw phase documents; they are now re-verified against the canonical phase documents themselves.

**Re-verification completed.**

| Rows | Owner | Verified against | Result |
|---|---|---|---|
| 32, 33 | Phase 3 | `03-composition-pattern-system.md` 1.1.0 | Confirmed, C-1..C-9 pass |
| 34–36 | Phase 4 | `04-ai-creative-direction.md` 1.0.0 | Confirmed, C-10 pass |
| 39 | Phase 5 | `05-ai-implementation.md` 1.0.0 | Confirmed, C-10 pass |
| 40–43 | Phase 6 | `06-independent-critic.md` 1.0.0 | Confirmed, C-10 pass |

The C-10 pass compared each row's owner, consumers, and consumer role against the canonical text. **No ownership disagreement was found.** Row 43 remains **not operable** — that is a missing-value condition, not an ownership or canonicity condition, and it is unchanged by this pass. See §6 decisions 13, 14 and 16.

Rows 37 and 38 are owned by Business Research, and row 38 jointly by a human approver. Neither is phase-owned, so neither was ever gated on phase canonicity. Their status is Control-Plane derived, per §6 decision 4a.

Where a canonical phase document and this matrix disagree in future, the canonical document governs on phase-owned subject matter, per `source-of-truth.md` §3.1 rules 2, 3, 4 and 9. This matrix is then stale and MUST be corrected.

### 1.2 Role Vocabulary

| Role | Permission | Prohibition |
|---|---|---|
| **Owner** | Defines the concern, its vocabulary, and its rules. Exactly one per row. | — |
| **Consumer** | Reads and acts on the owner's definition. | MUST NOT redefine it. |
| **Transformer** | Converts the concern into another representation. | MUST NOT change its meaning. |
| **Implementer** | Realises the concern in built output. | MUST NOT alter the rule to fit the implementation. |
| **Evaluator** | Checks compliance and reports findings. | MUST NOT change the value or the rule. |

**Escalation rule.** A phase that finds an owned concern inadequate, ambiguous, or in conflict with another concern MUST raise it with the owner. It MUST NOT resolve the conflict locally, and MUST NOT fill an UNDEFINED value on the owner's behalf.

### 1.3 Phase Reference

| Phase | Name | Canonical document | Status |
|---|---|---|---|
| Phase 1 | Foundation | `01-foundation.md` | Canonical |
| Phase 2 | Visual Design Languages | `02-visual-design-languages.md` | Canonical |
| Phase 3 | Composition & Pattern System (composition vocabulary) | `03-composition-pattern-system.md` | Canonical |
| Phase 4 | Creative direction and design blueprint | `04-ai-creative-direction.md` | Canonical |
| Phase 5 | Implementation | `05-ai-implementation.md` | Canonical |
| Phase 6 | Critique and refinement | `06-independent-critic.md` | Canonical |
| BR | Business Research | — | Referenced as an input boundary only |

Phase numbering follows `02-CONTROL-PLANE/agent-roles.md` §2, which maps roles to phases as: Creative Director → Phase 4 (Creative Direction, Design Blueprint); Composition Designer → Phase 3 vocabulary with the Phase 4 decision; Implementation Engineer → Phase 5; Independent Critic and Refinement Engineer → Phase 6.

Two consequences worth stating, because they are easy to get wrong:

1. **The design blueprint is Phase 4, not Phase 3.** `quality-gates.md` §2 confirms this — Blueprint Validation governs `CREATIVE_DIRECTION → BLUEPRINT_READY`, and §7.3 routes findings owned by Phase 4 to `RETURN_TO_BLUEPRINT`.
2. **Composition is split.** Phase 3 owns the composition *vocabulary*; the composition *decision* is made in Phase 4 by the Composition Designer. A vocabulary entry is not a decision.
3. **Phase 3 produces no per-project artifact.** Phase 3 is factory-global: it defines vocabulary, capability and fit for the factory as a whole. The artifact chain is `Phase 3 vocabulary → Composition Designer → Composition Plan → Creative Director → Design Blueprint`. The Composition Plan is the Composition Designer's output and is **Phase 4-owned**, even though it is expressed entirely in Phase 3 vocabulary. Consuming Phase 3 vocabulary does not make the consuming artifact a Phase 3 artifact. See §6 decision 13.

Phase 2 §20.1 references Foundation and Business Research as inputs and boundaries. It does **not** reference a pattern library phase, a business decision engine phase, or an implementation architecture phase by number. The Phase 3–6 numbering above is a working scheme, not a source term.

---

## 2. Foundation-Owned Concerns

Foundation §23.1 states what Phase 1 owns: structural primitives, technical consistency, accessibility, responsive behavior and quality constraints. Phase 2 §20.1 confirms the same boundary from the other side.

### Row 1 — Structural primitives

| Field | Value |
|---|---|
| Owner | Phase 1 |
| Consumers | Phase 2, 3, 5, 6 |
| Role of consumers | Phase 2 consumes; Phase 3 composes with; Phase 5 implements; Phase 6 evaluates |
| Boundary | The structural vocabulary is fixed. A design language expresses a relationship to it and MUST NOT extend it. |

### Row 2 — Grid system

| Field | Value |
|---|---|
| Owner | Phase 1 (§6) |
| Consumers | Phase 2 (grid relationship), Phase 3, 5, 6 |
| Role of consumers | Phase 2 transforms into a per-language relationship; Phase 5 implements; Phase 6 evaluates |
| Boundary | 12 columns, 8 permitted compositions, 4 grid operations. Phase 2 chooses how to relate to the grid, never what the grid is. |

### Row 3 — Spacing scale

| Field | Value |
|---|---|
| Owner | Phase 1 (§7) |
| Consumers | Phase 2 (rhythm), Phase 3, 5 |
| Role of consumers | Phase 2 sequences scale members into a rhythm; Phase 5 implements |
| Boundary | The 12-step scale is closed. Per-language progressions in §7.2 sit in Foundation while §23.2 delegates rhythm to Phase 2 — an ownership inversion recorded in §7. |

### Row 4 — Container system

| Field | Value |
|---|---|
| Owner | Phase 1 (§5.3) |
| Consumers | Phase 2 (reinterpretation), Phase 5 |
| Role of consumers | Phase 2 reinterprets per language; Phase 5 implements |
| Boundary | Four container classes. Widths are approximate and §24.2 records them as unresolved — unchanged. Per-language expression is delegated to Phase 2 by §23.2; all five are now supplied as **factory-defined V1 defaults** (Design Language Registry §5.9), with the three source-derived values from Foundation §5.3 preserved alongside them for provenance. Factory defaults govern expression; Phase 1 retains the mechanics. |

### Row 5 — Typography mechanics

| Field | Value |
|---|---|
| Owner | Phase 1 (§8) |
| Consumers | Phase 2 (personality), Phase 5, 6 |
| Role of consumers | Phase 2 defines appearance; Phase 5 implements; Phase 6 evaluates hierarchy |
| Boundary | Foundation §8.1: "Foundation says H1 must scale fluidly; Design Language says what H1 looks like." Fluid scaling and logical heading order are hard constraints. |

### Row 6 — Colour system mechanics

| Field | Value |
|---|---|
| Owner | Phase 1 |
| Consumers | Phase 2, 5, 6 |
| Role of consumers | Phase 2 expresses palette character; Phase 5 implements; Phase 6 evaluates contrast |
| Boundary | Contrast minimums are accessibility constraints and are absolute. Palette character is Phase 2's, within them. |

### Row 7 — Imagery capability

| Field | Value |
|---|---|
| Owner | Phase 1 (§10.1) |
| Consumers | Phase 2 (image DNA), Phase 3, 5 |
| Role of consumers | Phase 2 selects and prefers; Phase 5 implements |
| Boundary | Six ratios, six treatments. Closed set. Phase 2 states what each language photographs, not what the system can crop. |

### Row 8 — Poor-photography pivot

| Field | Value |
|---|---|
| Owner | Phase 1 (§10.2) |
| Consumers | Phase 2, 3, 5, 6 |
| Role of consumers | All consume; Phase 6 evaluates |
| Boundary | Hard rule. Applies to every language regardless of per-language fallback. Phase 2's per-language fallbacks (2 of 5 defined) sit under it, not beside it. |

### Row 9 — Motion capability and `motionIntensity`

| Field | Value |
|---|---|
| Owner | Phase 1 (§12) |
| Consumers | Phase 2, 5, 6 |
| Role of consumers | Phase 2 selects character within the budget; Phase 5 implements; Phase 6 evaluates |
| Boundary | `motionIntensity` 0–3 is Foundation's and its business-type values are unamended. Per-language values are delegated to Phase 2 by §23.2 and are now supplied as **factory-defined V1 defaults** — DL-01 1, DL-02 0, DL-03 3, DL-04 1, DL-05 2 (Design Language Registry §5.6). Which governs when business type and design language disagree is UNDEFINED. Phase 2's 1–10 `motionExpression` remains a separate parameter and MUST NOT be substituted for it or converted into it. |

### Row 10 — Accessibility

| Field | Value |
|---|---|
| Owner | Phase 1 (§16) |
| Consumers | Phase 5 (implements), Phase 6 (evaluates) |
| Role of consumers | Implement and verify only |
| Boundary | **Absolute.** No design language, creative intensity, business type or aesthetic goal may weaken any accessibility parameter. There is no creative exemption. Phase 2 §20.1 confirms accessibility is not Phase 2's. |

### Row 11 — Responsive behavior

| Field | Value |
|---|---|
| Owner | Phase 1 |
| Consumers | Phase 3, 5, 6 |
| Role of consumers | Phase 3 composes for; Phase 5 implements; Phase 6 evaluates |
| Boundary | Includes the prohibition on compressing desktop into mobile, which Phase 2 §17.2 transcribes but does not own — it is structural and language-independent. |

### Row 12 — Navigation function

| Field | Value |
|---|---|
| Owner | Phase 1 (§17) |
| Consumers | Phase 2 (expression), Phase 5, 6 |
| Role of consumers | Phase 2 chooses expression; Phase 5 implements; Phase 6 evaluates access |
| Boundary | Foundation §17: "Foundation defines functionality. Design Language defines expression." Brand, primary links and primary CTA MUST be accessible. Seven implementation types, closed set. Per-language expression is delegated to Phase 2 by §23.2 and all five are now supplied as **factory-defined V1 defaults** (Design Language Registry §5.10). Those are expression descriptors; which of the seven implementation types each resolves to is UNDEFINED. The defaults remove no required element and extend no capability set. |

### Row 13 — Universal anti-patterns

| Field | Value |
|---|---|
| Owner | Phase 1 |
| Consumers | Phase 3, 5; Phase 6 evaluates |
| Role of consumers | Comply and verify |
| Boundary | Per decision 7 the 12 universal anti-template rules are Foundation's because they are structural and language-independent. Phase 2 §17.2 transcribes them, but that copy is a **non-normative reference** carrying no independent normative force — it is scoped, not deleted. A language-specific anti-pattern MUST NOT be promoted into this set. The qualifier "automatically" is retained on the first three rules exactly as written. |

### Row 14 — Creative Budget

| Field | Value |
|---|---|
| Owner | Phase 1 (§18.3) |
| Consumers | Phase 2, 4, 5, 6 |
| Role of consumers | Phase 4 consumes it as context; Phase 6 evaluates against it |
| Boundary | The creative latitude appropriate to the business and its category, derived from business context. Per decision 4 it is **not a ceiling** on `creativeIntensity` (Row 24) — the two are related but not numerically constrained, so differing values across the source tables are not a conflict. See Parameter Registry §2.3. |

### Row 15 — Content integrity

| Field | Value |
|---|---|
| Owner | Phase 1 |
| Consumers | Phase 3, 5; Phase 6 evaluates |
| Role of consumers | Comply and verify |
| Boundary | Testimonials and statistics MUST NOT be invented. Transcribed in Phase 2 §17.2 but content-integrity rather than visual, so language-independent. Business truth itself is Business Research's. |

---

## 3. Phase 2-Owned Concerns

Phase 2 §20.1 states what Phase 2 owns: visual personality, composition philosophy, typography personality, spacing rhythm, image behavior, interaction character, visual tension, creative range, section behavior, storytelling style.

### Row 16 — The design language set

| Field | Value |
|---|---|
| Owner | Phase 2 (§4.2) |
| Consumers | All phases |
| Role of consumers | Reference by stable ID `DL-01`…`DL-05` |
| Boundary | LOCKED for V1. Adding, removing, merging or renaming a language requires an explicit versioned system change. See Design Language Registry §1.1, §2. |

### Row 17 — Visual personality

| Field | Value |
|---|---|
| Owner | Phase 2 (§5.x.1–3) |
| Consumers | Phase 3, 5, 6 |
| Role of consumers | Phase 3 composes; Phase 5 implements; Phase 6 evaluates coherence |
| Boundary | The core of Phase 2's authority. No other phase may restate or adjust a language's personality. |

### Row 18 — Composition philosophy and grid relationship

| Field | Value |
|---|---|
| Owner | Phase 2 (§5.x.4, §6.2) |
| Consumers | Phase 3, 5, 6 |
| Role of consumers | Phase 3 composes within it; Phase 5 implements; Phase 6 evaluates |
| Boundary | Five distinct grid relationships — Break, Control, Compress-and-energize, Flow-through, Construct. Expressed strictly within Foundation's grid mechanics (Row 2). |

### Row 19 — Typography personality

| Field | Value |
|---|---|
| Owner | Phase 2 (§5.x.5) |
| Consumers | Phase 5, 6 |
| Role of consumers | Phase 5 implements; Phase 6 evaluates |
| Boundary | Font character and treatment. Constrained by Foundation's scaling and hierarchy mechanics (Row 5). Complete for all five languages. |

### Row 20 — Spacing rhythm

| Field | Value |
|---|---|
| Owner | Phase 2 (§5.x.6) |
| Consumers | Phase 3, 5 |
| Role of consumers | Phase 3 sequences; Phase 5 implements |
| Boundary | Ordinal rhythm sequences drawn from Foundation's spacing scale. Distinct from section rhythm (Row 26). The numeric progressions in Foundation §7.2 are incomplete — DL-04 and DL-05 UNDEFINED. |

### Row 21 — Image behavior and DNA

| Field | Value |
|---|---|
| Owner | Phase 2 (§5.x.7, §12) |
| Consumers | Phase 3, 4, 5 |
| Role of consumers | Phase 4 assesses asset fit; Phase 5 implements |
| Boundary | What each language photographs and how aggressively it treats imagery. Foundation's poor-photography pivot (Row 8) overrides. Per-language fallback defined for 2 of 5. |

### Row 22 — Interaction character

| Field | Value |
|---|---|
| Owner | Phase 2 (§5.x.10) |
| Consumers | Phase 3, 5 |
| Role of consumers | Phase 5 implements within Foundation's motion budget |
| Boundary | Qualitative motion character per language. Constrained by `prefersReducedMotion`, which can lower effective motion but never raise it. Three motion representations exist and are **not mapped** — the qualitative character is not a restatement of `motionIntensity` (Row 9) and no consumer may convert between them in either direction. |

### Row 23 — Visual tension

| Field | Value |
|---|---|
| Owner | Phase 2 (§5.x.8, §4.3) |
| Consumers | Phase 3, 4, 6 |
| Role of consumers | Phase 4 selects; Phase 6 evaluates |
| Boundary | Two representations — qualitative band and 1–10 score. Phase 2 §10 records they are unreconciled. No consumer may invent a mapping. |

### Row 24 — Creative Intensity

| Field | Value |
|---|---|
| Owner | Phase 2 (§9) |
| Consumers | Phase 3, 4, 5, 6 |
| Role of consumers | Phase 4 selects a value; Phase 6 evaluates against it |
| Boundary | The strength with which the selected design language is expressed. Per decision 4 it is **not** bounded by Foundation's Creative Budget (Row 14) — the two are related but not numerically constrained, and no comparison, cap or derivation between them exists. Informed by business type, customer expectation, trust requirement, conversion sensitivity and brand maturity. The brand-maturity effect is UNDEFINED. |

### Row 25 — Creativity hierarchy

| Field | Value |
|---|---|
| Owner | Phase 2 (§18) |
| Consumers | All phases |
| Role of consumers | Comply |
| Boundary | The 8-level ordering is a MUST and is a **satisfaction sequence, not a trade-off ranking**. Levels 1–5 — business truth, customer needs, conversion, usability, accessibility — are **gates** that MUST each be satisfied; levels 6–8 are where judgement lives. Accessibility's position at level 5 is not a licence to trade it against conversion or usability: it remains absolute and non-overridable per Row 10 and decision 6. The Phase 2 §18 text is unamended. |

### Row 26 — Section rhythm and section behavior

| Field | Value |
|---|---|
| Owner | Phase 2 (§14.1, §14.2) |
| Consumers | Phase 3, 5 |
| Role of consumers | Phase 3 supplies section vocabulary (Row 32); Phase 4 fixes the concrete sequence (Row 34); Phase 5 implements |
| Boundary | Per decision 8, Phase 2 owns the **rhythm profile and per-language section behavior**; the **concrete sequence** is decided downstream (Row 34). A rhythm profile is not a template. A dash in the §14.1 table means unnamed, not forbidden. |
| Three-layer split | Rhythm divides across three phases and this row owns only the middle term. **Phase 2** owns the per-language rhythm profile (§14.2, this row). **Phase 3** owns rhythm as a composition concept and the rhythm token vocabulary (`03-composition-pattern-system.md` §17). **Phase 4** owns the concrete per-project rhythm sequence (Row 34). Phase 3 §17 reproduces the per-language profiles as a **reference** to Phase 2 §14.2, not as a redefinition; where the wording differs, **Phase 2 §14.2 governs**. This resolves `design-language-registry.md` §8 item 17 and Phase 3 §36 item 3. |
| Distinct from spacing rhythm | Section rhythm (this row) and spacing rhythm (Row 20) are two separate constructs that happen to share near-identical wording for DL-05. Section rhythm is an ordered sequence of section-level moments; spacing rhythm is an ordinal density characteristic drawn from Foundation's spacing scale. Neither derives from the other and no mapping is defined. |

### Row 27 — Signature patterns

| Field | Value |
|---|---|
| Owner | Phase 2 (§16) |
| Consumers | Phase 3 |
| Role of consumers | Phase 3 may compose with them |
| Boundary | Characteristic of a language, not required sections or a fixed template sequence. All 30 pattern structures are UNDEFINED, so the row is not consumable yet. |

### Row 28 — Language-specific anti-patterns

| Field | Value |
|---|---|
| Owner | Phase 2 (§17.1) |
| Consumers | Phase 3, 5; Phase 6 evaluates |
| Role of consumers | Avoid and verify |
| Boundary | Per decision 7, language-scoped only. MUST NOT be promoted to a universal prohibition — kinetic typography is a DL-04 anti-pattern and a DL-03 motion option at once. |

### Row 29 — Novelty requirement

| Field | Value |
|---|---|
| Owner | Phase 2 (§17.3) |
| Consumers | Phase 3; Phase 6 evaluates |
| Role of consumers | Phase 3 applies it while composing; Phase 6 performs the check |
| Boundary | Per decision 8, Phase 2 owns the **requirement and the 9-item checklist**; Phase 6 owns **evaluation and the threshold**. Stated as "should." The remedy is to regenerate the composition, not merely the colors. |

### Row 30 — Compatibility and cross-pollination

| Field | Value |
|---|---|
| Owner | Phase 2 (§15) |
| Consumers | Phase 4 |
| Role of consumers | Phase 4 selects a primary and secondary within these rules |
| Boundary | Strong / Caution labels are preferences. §15.3 is the one hard restriction: a secondary influence MUST NEVER contradict the business psychology. What "Caution" requires, and proportions beyond the single 70/20/10 example, are UNDEFINED. |

### Row 31 — Scoring profile

| Field | Value |
|---|---|
| Owner | Phase 2 (§4.3) |
| Consumers | Phase 4 |
| Role of consumers | Phase 4 uses as guidance |
| Boundary | Explicitly **AI guidance, not hard constraints**. Phase 2 §19 states there is no consolidated selection algorithm. Phase 4 MUST NOT treat these scores as a deterministic selector. |

---

## 4. Phase 3 to 6 Owned Concerns

**Every row in this section is confirmed.** Rows 32 and 33 were confirmed against canonical Phase 3 in the C-1..C-9 pass; rows 34–43 were re-verified against canonical Phases 4, 5 and 6 in the C-10 pass, per §1.1. The section was previously titled "Provisional Rows" because Phases 4–6 were unwritten; that condition no longer holds and the provisional mechanism is retired.

Two rows in this section are not phase-owned. Rows 37 and 38 are owned by Business Research, row 38 jointly with a human approver, and both are **Control-Plane derived** per §6 decisions 4a and 16. Row 43 is confirmed as owned but remains **not operable**, which is a missing-value condition rather than an ownership one.

### Row 32 — Section vocabulary

| Field | Value |
|---|---|
| Owner | Phase 3 — **confirmed** against `03-composition-pattern-system.md` 1.1.0 |
| Consumers | Phase 4, 5, 6 |
| Role of consumers | Phase 4 selects from it; Phase 5 implements; Phase 6 evaluates |
| Boundary | Phase 3 owns the composition *vocabulary* — the named set of sections and compositions available. It does **not** make the selection; that is Phase 4 (`agent-roles.md` §2, Composition Designer). Phase 2 §14.1 names sections per language but does not constitute a vocabulary. |
| Verification | Confirmed by canonical Phase 3 §2.1, §10, §15 and §35.1. Phase 3 §35.4 independently disclaims the per-business selection. The business-specific examples in Phase 3 §15.2, §32 and §33.1 are marked non-normative and do not extend this row into Phase 4 territory. |

### Row 33 — Composition vocabulary and pattern library

| Field | Value |
|---|---|
| Owner | Phase 3 — **confirmed** against `03-composition-pattern-system.md` 1.1.0 |
| Consumers | Phase 4, 5 |
| Role of consumers | Phase 4 composes with it; Phase 5 implements |
| Boundary | Phase 2 §20.1 states the source does not reference a pattern library phase by number, so this row was originally inferred from `agent-roles.md` alone. Canonical Phase 3 now supplies the vocabulary directly (§9–§13). Phase 2's 30 signature patterns (Row 27) still have no defined structure. |
| Verification | Confirmed by canonical Phase 3 §2.1 and §35.1. **The pattern library itself is empty:** Phase 3 §14 records that 0 of the ~87 targeted patterns are specified, with 14 family prefixes and 8 illustrative pattern IDs only. This row's vocabulary is therefore owned and defined, but not yet populated. See §7 issue 5 and issue 9. |

### Row 34 — Design blueprint and concrete section sequence

| Field | Value |
|---|---|
| Owner | Phase 4 — **confirmed** |
| Consumers | Phase 5, 6 |
| Role of consumers | Phase 5 implements as specified; Phase 6 critiques against it |
| Boundary | The Creative Director owns the blueprint (`agent-roles.md` §2, §3.3). Phase 5 MUST NOT silently alter a blueprint decision; disagreement routes to `RETURN_TO_BLUEPRINT`. The concrete section sequence is fixed here, drawing on Phase 2's rhythm profile (Row 26) and Phase 3's vocabulary (Row 32). |
| Artifact chain | Two distinct Phase 4-owned artifacts sit on this row's path. The **Composition Plan** is produced by the Composition Designer from Phase 3 vocabulary; the **Design Blueprint** is produced by the Creative Director and embeds it. Both are Phase 4-owned. The Composition Plan being written wholly in Phase 3 vocabulary does not make it a Phase 3 artifact. See §1.3 consequence 3 and §6 decision 13. |
| Verification | Canonical Phase 3 §33 presents a blueprint example. That example is an illustrative **Phase 4 Composition Plan instance**, reframed as such in the C-1..C-9 pass, and is a proper subset of the blueprint contract in `artifact-contracts.md` §5.5. It does not contest this row. The prior direct conflict between Phase 3 §33 and this row is **resolved**. |

### Row 35 — Design language selection

| Field | Value |
|---|---|
| Owner | Phase 4 — **confirmed** |
| Consumers | Phase 5, 6 |
| Role of consumers | Phase 5 implements; Phase 6 evaluates fit |
| Boundary | Phase 4 selects `primaryLanguage` and `secondaryInfluence` from Phase 2's locked set, honouring Phase 2's compatibility rules (Row 30) and §15.3's hard restriction. It MUST NOT invent a language or alter one. `agent-roles.md` §4: only the Creative Director makes binding design decisions. |

### Row 36 — Creative direction and design intent

| Field | Value |
|---|---|
| Owner | Phase 4 — **confirmed** |
| Consumers | Phase 5, 6 |
| Role of consumers | Phase 5 preserves intent; Phase 6 tests the result against it |
| Boundary | `quality-gates.md` §7.1 requires the critic to record an intent test against the design intent statement, which makes that statement a required Phase 4 output. Phase 5 must preserve creative intent, not merely structural correctness (`agent-roles.md` §3.4). |

### Row 37 — Business truth and verified facts

| Field | Value |
|---|---|
| Owner | Business Research — **Control-Plane derived** |
| Consumers | All phases |
| Role of consumers | Consume only |
| Boundary | `agent-roles.md` §4: only the Research Agent establishes facts; all other roles consume them. Every item is classified verified, inferred or unknown. Fabricated facts fail every gate at which they are detected (`quality-gates.md` §9). Phase 2 §20.1 confirms business identity, content, imagery and trust signals are not Phase 2's. |

### Row 38 — Asset approval status

| Field | Value |
|---|---|
| Owner | Business Research plus human approval — **Control-Plane derived** |
| Consumers | Phase 4, 5 |
| Role of consumers | Phase 4 assesses capability; Phase 5 uses approved assets only |
| Boundary | Discovered assets are recorded as discovered, awaiting human approval. Phase 5 MUST NOT use discovered, pending or rejected assets. This is distinct from Phase 2's asset *capability* assessment (Row 21), which judges fit rather than permission. |

### Row 39 — Implementation

| Field | Value |
|---|---|
| Owner | Phase 5 — **confirmed** |
| Consumers | Phase 6 |
| Role of consumers | Phase 6 critiques the rendered result |
| Boundary | Build the site so the blueprint's decisions survive implementation. MUST NOT silently alter, simplify or substitute a blueprint decision, invent content, or declare completion on the basis of a successful build. MUST NOT critique or approve its own output. |

### Row 40 — Visual QA and rendered-result critique

| Field | Value |
|---|---|
| Owner | Phase 6 — **confirmed** |
| Consumers | Phase 4 (on regression), Phase 5 (on correction) |
| Role of consumers | Act on findings within their own authority |
| Boundary | The Independent Critic evaluates the **rendered result**, not source-code intent. A successful build is not evidence of quality. The critic MUST NOT modify implementation, blueprint or research, and MUST NOT approve delivery — that authority is human. |

### Row 41 — Critic findings and root-cause attribution

| Field | Value |
|---|---|
| Owner | Phase 6 — **confirmed** |
| Consumers | Control Plane routing, Phase 4, Phase 5 |
| Role of consumers | Route and remediate per `failure-routing.md` |
| Boundary | Every finding MUST carry a description, severity, root cause and owning phase. Assigning an upstream root cause to implementation in order to avoid regression is a blocking condition (`quality-gates.md` §7.2). Only the Independent Critic may confirm a finding is resolved. |

### Row 42 — Refinement

| Field | Value |
|---|---|
| Owner | Phase 6 — **confirmed** |
| Consumers | Phase 6 critique loop |
| Role of consumers | Re-evaluation returns to CRITIQUING |
| Boundary | The Refinement Engineer addresses **only** findings assigned to refinement, MUST NOT close its own findings, MUST NOT advance to APPROVED, and MUST NOT alter the blueprint — blueprint change routes to `RETURN_TO_BLUEPRINT`. |

### Row 43 — Novelty evaluation

| Field | Value |
|---|---|
| Owner | Phase 6 — **confirmed, not operable** |
| Consumers | Phase 4 (on regeneration) |
| Role of consumers | Regenerate composition when the check fails |
| Boundary | Per decision 8, Phase 6 owns **evaluation and the threshold**; Phase 2 owns the requirement and the 9-item checklist (Row 29). Both `noveltyThreshold` and `noveltyComparison` are UNDEFINED, so the check is **not operable** as it stands. |

### Row 44 — Quality gates and state transitions

| Field | Value |
|---|---|
| Owner | Control Plane |
| Consumers | All phases |
| Role of consumers | Submit artifacts; no phase evaluates its own gate |
| Boundary | `quality-gates.md` §9: no gate is owned by the role that produced the artifact under review; build success alone satisfies no gate; no gate may be waived. Gates diagnose, they do not repair. |

### Row 45 — Final delivery approval

| Field | Value |
|---|---|
| Owner | Human approver |
| Consumers | — |
| Role of consumers | — |
| Boundary | `quality-gates.md` §8, §9 and `agent-roles.md` §4: only a human may approve delivery. The AI provides a recommendation only. No agent may advance a project to APPROVED or DELIVERED. |

---

## 5. Summary Index

45 rows, all confirmed. Rows 1–33 confirmed in the C-1..C-9 pass; rows 34–43 re-verified in the C-10 pass per §1.1. Rows 37 and 38 are Control-Plane derived rather than phase-owned. Row 43 is confirmed but not operable.

| Row | Concern | Owner | Status |
|:--:|---|---|---|
| 1 | Structural primitives | Phase 1 | Canonical |
| 2 | Grid system | Phase 1 | Canonical |
| 3 | Spacing scale | Phase 1 | Canonical |
| 4 | Container system | Phase 1 | Canonical |
| 5 | Typography mechanics | Phase 1 | Canonical |
| 6 | Colour system mechanics | Phase 1 | Canonical |
| 7 | Imagery capability | Phase 1 | Canonical |
| 8 | Poor-photography pivot | Phase 1 | Canonical |
| 9 | Motion capability, `motionIntensity` | Phase 1 | Canonical |
| 10 | Accessibility | Phase 1 | Canonical — absolute |
| 11 | Responsive behavior | Phase 1 | Canonical |
| 12 | Navigation function | Phase 1 | Canonical |
| 13 | Universal anti-patterns | Phase 1 | Canonical |
| 14 | Creative Budget | Phase 1 | Canonical |
| 15 | Content integrity | Phase 1 | Canonical |
| 16 | The design language set | Phase 2 | Canonical — LOCKED |
| 17 | Visual personality | Phase 2 | Canonical |
| 18 | Composition philosophy, grid relationship | Phase 2 | Canonical |
| 19 | Typography personality | Phase 2 | Canonical |
| 20 | Spacing rhythm | Phase 2 | Canonical |
| 21 | Image behavior and DNA | Phase 2 | Canonical |
| 22 | Interaction character | Phase 2 | Canonical |
| 23 | Visual tension | Phase 2 | Canonical |
| 24 | Creative Intensity | Phase 2 | Canonical |
| 25 | Creativity hierarchy | Phase 2 | Canonical |
| 26 | Section rhythm and section behavior | Phase 2 | Canonical |
| 27 | Signature patterns | Phase 2 | Canonical — structures UNDEFINED |
| 28 | Language-specific anti-patterns | Phase 2 | Canonical |
| 29 | Novelty requirement | Phase 2 | Canonical |
| 30 | Compatibility and cross-pollination | Phase 2 | Canonical |
| 31 | Scoring profile | Phase 2 | Canonical |
| 32 | Section vocabulary | Phase 3 | Confirmed |
| 33 | Composition vocabulary, pattern library | Phase 3 | Confirmed |
| 34 | Design blueprint, concrete section sequence | Phase 4 | Confirmed |
| 35 | Design language selection | Phase 4 | Confirmed |
| 36 | Creative direction and Design Intent Statement | Phase 4 | Confirmed |
| 37 | Business truth and verified facts | Business Research | Control-Plane derived |
| 38 | Asset approval status | Business Research + human | Control-Plane derived |
| 39 | Implementation | Phase 5 | Confirmed |
| 40 | Visual QA, rendered-result critique | Phase 6 | Confirmed |
| 41 | Critic findings, root-cause attribution | Phase 6 | Confirmed |
| 42 | Refinement | Phase 6 | Confirmed |
| 43 | Novelty evaluation | Phase 6 | Confirmed — not operable |
| 44 | Quality gates, state transitions | Control Plane | Canonical (Control Plane) |
| 45 | Final delivery approval | Human approver | Canonical (Control Plane) |

Every row has exactly one owner. No concern appears twice as owned.

---

## 6. Governing Decisions

| # | Decision |
|:--:|---|
| 1 | Registries live in `03-REGISTRY/` as factory-global authority artifacts |
| 4 | Creative Budget (Phase 1, Row 14) and Creative Intensity (Phase 2, Row 24) are separate concerns, **related but not numerically constrained** — neither bounds the other |
| 4a | Factory-defined V1 defaults govern operational V1 decisions where a delegation was never filled; source-derived transcriptions are preserved for provenance and are never deleted |
| 5 | `motionIntensity` is Phase 1's (Row 9); Phase 2's motion values are separate and unmapped (Row 22) |
| 6 | Accessibility is absolute and non-overridable (Row 10). The creativity hierarchy (Row 25) is a satisfaction sequence in which levels 1–5 are gates, so accessibility's position at level 5 never licenses failing a minimum |
| 7 | Universal anti-patterns are Phase 1's (Row 13); language-specific are Phase 2's (Row 28); Phase 6 evaluates both |
| 8 | Novelty requirement is Phase 2's (Row 29); evaluation and threshold are Phase 6's (Row 43). **Section rhythm splits three ways:** the per-language rhythm profile is Phase 2's (Row 26); rhythm as a composition concept and its token vocabulary are Phase 3's (`03-composition-pattern-system.md` §17); the concrete per-project sequence is decided in the blueprint (Row 34). Section rhythm (Row 26) and spacing rhythm (Row 20) remain two distinct constructs with no mapping |
| 9 | Navigation function and types are Phase 1's (Row 12); visual expression is Phase 2's |
| 10 | Corner, border and container: Phase 1 owns range and mechanics (Rows 4, 5); Phase 2 owns per-language defaults |
| 11 | Phase 1 owns capabilities and ranges; Phase 2 owns preferences within them |
| 12 | **One authoritative owner per concern.** Consumers may consume, transform, implement or evaluate. They MUST NOT silently redefine. |
| 13 | **Phase 3 is factory-global and emits no per-project artifact.** The chain is `Phase 3 vocabulary → Composition Designer → Composition Plan → Creative Director → Design Blueprint`. The Composition Plan and the Design Blueprint are both **Phase 4-owned**. An artifact expressed in a phase's vocabulary belongs to the phase that *decided* its contents, not the phase that *supplied the words*. |
| 14 | **Vocabulary vs decision test.** A statement is Phase 3 vocabulary if it holds for the factory as a whole, independent of any business. It is a Phase 4 decision if it selects, ranks or assigns for one business. Where a Phase 3 document contains a business-specific illustration, that illustration is non-normative and does not transfer the decision right. |
| 15 | **Capability, fit and value are three distinct statement kinds.** A *capability* statement says a construct exists and what it can do. A *fit* statement says how well a construct suits a condition. A *value* statement assigns a concrete value for one project. Phases 1–3 may issue capability and fit statements. **Only Phase 4 issues value statements.** |
| 16 | **C-10 canonicity reconciliation.** All six phase documents are canonical. Rows 34–43 were re-verified against canonical Phases 4, 5 and 6 and are **confirmed**; no ownership disagreement was found. The provisional mechanism is retired: no row in this matrix is provisional. Rows 37 and 38 are not phase-owned and are recorded as Control-Plane derived, per decision 4a. Row 43 remains not operable, which is a missing-value condition and not an ownership condition. |
| 17 | **Canonical phase documents are frozen at their recorded versions.** Where a Control-Plane construct and a canonical phase document use different names for the same thing, the reconciliation is absorbed in the Control Plane and in this registry by explicit mapping. The canonical document is not edited. Two such mappings exist: `RETURN_TO_IMPLEMENTATION` in Phase 6, which is a non-state mapping to REFINING per `state-machine.md`; and `REBUILD`, which is a critic recommendation and never a state, per `failure-routing.md` §3.1. |
| 18 | **The Design Intent Statement is authored exactly once**, in the Creative Direction artifact, `artifact-contracts.md` §5.10. Row 36 owns it. The Design Blueprint consumes it by reference and does not re-author it. The Composition Plan is a component of the blueprint record with no independent version, status or gate, per `artifact-contracts.md` §5.11 and decision 13. |
| 19 | **Ownership of a correction follows the owning phase, not the state in which it occurs.** A Phase 5-owned defect found after rendering is actioned inside REFINING and corrected by the Implementation Engineer. Row 42 covers the coordination of refinement, not the ownership of every correction performed during it. See `agent-roles.md` §4 invariant 7. |

---

## 7. Unresolved Ownership Issues

| # | Issue | Nature | Affects |
|:--:|---|---|---|
| 1 | ~~Rows 34–43 have no canonical document~~ | **RESOLVED** in the C-10 pass. All six phase documents are canonical. Rows 34–43 were re-verified against canonical Phases 4, 5 and 6 and confirmed, with no ownership disagreement found. Formalised as §6 decision 16. | Rows 34–43 |
| 2 | Delegation inversion — spacing progressions, container expressions | Source-derived per-language values sit in Foundation while §23.2 delegates them to Phase 2 | Rows 3, 4 |
| 3 | `motionIntensity` selection when business type and design language disagree | Row 9 now carries per-language factory defaults; Foundation §12.3 carries business-type values; which governs is unstated | Rows 9, 22 |
| 4 | `navigationExpression` → implementation type resolution | Row 12 now carries per-language expression descriptors; which of the seven Foundation types each resolves to is unstated | Row 12 |
| 5 | Row 27 not consumable | All 30 signature pattern structures UNDEFINED | Rows 27, 33 |
| 6 | Row 43 not operable | `noveltyThreshold` and `noveltyComparison` UNDEFINED | Row 43 |
| 7 | ~~Phase 3 vs Phase 4 composition boundary~~ | **RESOLVED** in the C-1..C-9 pass. The boundary is stated explicitly in canonical Phase 3 §35 and formalised as §6 decisions 13, 14 and 15. No longer inferred from `agent-roles.md` §2's terse wording. | Rows 32, 33, 34 |
| 8 | Business Research carries no phase number | Referenced as a boundary in Phase 2 §20.1 and as a role in `agent-roles.md`, but never numbered. **Narrowed:** rows 37 and 38 are recorded as Control-Plane derived per §6 decisions 4a and 16. The absence of a phase number remains, and is now the whole of this issue. | Rows 37, 38 |
| 9 | Pattern library is empty | Row 33's vocabulary is owned and defined, but 0 of ~87 patterns are specified (Phase 3 §14). Phase 4 has a vocabulary to compose with and no patterns to compose from. Distinct from issue 5, which concerns Phase 2's signature patterns. | Rows 33, 34 |
| 10 | Pattern-level fit vs project-level value scope | Phase 3 §12 applies registry parameter names to individual patterns while the registry scopes them per project or per language. The C-1..C-9 pass established the fit-vs-value rule (§6 decision 15) and Phase 3 now expresses pattern metadata as fit. The concrete aggregation from pattern fit to project value remains UNDEFINED and is assigned to Phase 4. | Rows 32, 33, 34 |
| 11 | Breakpoint values are undefined | Tablet, mobile and desktop are named as required compositions and required captures, but no canonical document states a breakpoint boundary. `artifact-contracts.md` §8 item 2 records the same gap. | Rows 34, 39, 40 |
| 12 | No tablet-specific evaluation criteria | Phase 6 states no tablet-specific criteria, though tablet is a required composition and a required capture. `artifact-contracts.md` §8 item 3 records the same gap. | Rows 40, 41 |
| 13 | `criticIteration` is factory-defined, not source-derived | The counter, its increment point and its reset condition are defined in `state-machine.md` §6 as factory-defined V1. No canonical phase document states them, and no numeric maximum exists. | Rows 40, 41, 42 |

**No substantive conflict remains.** Issue 1 is resolved: all six phase documents are canonical and rows 34–43 are re-verified. Issue 8 is narrowed to the absence of a phase number for Business Research. Issue 2 is a documentation inconsistency to be fixed in the owning document, not here. Issues 3 and 4 are gaps the factory-defined V1 defaults expose rather than create. Issues 9 and 10 are consequences of Phase 3 defining a vocabulary it has not yet populated; both interact and neither is resolved here. Issues 11, 12 and 13 are newly recorded by the C-10 pass. They are **missing values and missing criteria, not conflicts**: no canonical document contradicts another on them. None is filled by invention here.

**Resolved in this pass.**

| Previously | Resolution |
|---|---|
| Creative Budget vs Creative Intensity numeric conflict | Not a conflict. Rows 14 and 24 are related but not numerically constrained, so differing source values are not a violation and no precedence decision is needed. |
| Accessibility at hierarchy level 5 vs absolute status | Not two competing readings. Row 25 is a satisfaction sequence whose levels 1–5 are gates; level 5 never licenses failing an accessibility minimum. Row 10 stands absolute. |
| Four of nine Foundation §23.2 delegations unfilled | All four — `motionIntensity`, `navigationExpression`, `borderLanguage`, `containerExpression` — now carry complete per-language values as factory-defined V1 defaults. Foundation §23.2's delegation is unamended. |
| This registry not registered in the Control Plane | Registered. `source-of-truth.md` §3.1 recognizes the registry layer at authority level 3 and `versioning.md` §3 and §3.1 version it. Authority is confined to explicitly assigned cross-phase concerns, per `source-of-truth.md` §3.1 rules 3 and 4. |
| Phase 3 vs Phase 4 composition boundary inferred, not stated (issue 7) | Resolved by the C-1..C-9 reconciliation pass. Canonical Phase 3 §35 now states the boundary explicitly, with an adjudication test. Recorded as §6 decisions 13, 14 and 15. Rows 32 and 33 re-verified and confirmed; Row 34 gains the artifact chain. |
| Phase 3 §33 vs Row 34 — Design Blueprint ownership | Not a conflict once framed correctly. Phase 3 §33's example is an illustrative **Phase 4 Composition Plan** instance and a proper subset of the blueprint contract in `artifact-contracts.md` §5.5. Phase 3 emits vocabulary, not a blueprint. No Control Plane change was required. |
| Rows 34–43 recorded as provisional while Phases 4–6 were canonical (issue 1) | Resolved by the C-10 pass. The provisional marking was stale, not wrong in substance: re-verification against canonical Phases 4, 5 and 6 confirmed every row and found **no ownership disagreement**. The provisional mechanism is retired. Recorded as §6 decision 16. |
| Rows 37 and 38 marked provisional though not phase-owned | Corrected. Neither is phase-owned, so neither was ever gated on phase canonicity. Both are now recorded as **Control-Plane derived**, per §6 decisions 4a and 16. |
| `RETURN_TO_IMPLEMENTATION` in Phase 6 is not a state | Absorbed by mapping, not by editing the canonical document. It is declared a non-state that maps to REFINING in `state-machine.md`. Phase 6 stays frozen at 1.0.0. Recorded as §6 decision 17. |
| `REBUILD` treated as though it were a state | Fixed as recommendation-only in `failure-routing.md` §3.1, alongside SHIP, REFINE and RETURN_TO_PHASE_4. Phase 6 stays frozen at 1.0.0. Recorded as §6 decision 17. |
| Design Intent Statement authored in two places | Resolved. Authored exactly once, in the Creative Direction artifact (`artifact-contracts.md` §5.10). The blueprint consumes it by reference. Recorded as §6 decision 18. |
| Composition Plan's artifact status ambiguous | Resolved. It is a component of the blueprint record with no independent version, status or gate (`artifact-contracts.md` §5.11). It is not a peer artifact. Recorded as §6 decisions 13 and 18. |
| Phase 5-owned post-render defects had no route | Resolved. They are actioned inside REFINING, corrected by the Implementation Engineer, coordinated by the Refinement Engineer. Ownership follows the owning phase, not the state. Recorded as §6 decision 19. |
