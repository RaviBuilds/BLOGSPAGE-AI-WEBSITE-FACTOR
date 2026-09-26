---
document: Blogspage AI Website Factory
layer: Control Plane
status: draft
version: 0.1.0
---

# Gate Conditions

**Derived from:** `02-CONTROL-PLANE/quality-gates.md` §2–§8, `artifact-contracts.md` §2 and §7, `schema-architecture.md` §3.1 and §5.1, `failure-routing.md` §1 rule 6, and the canonical shapes in `04-SCHEMA/`.

**Scope boundary:** This document records the **contract** for each M2.2 gate condition — what evidence could establish it, whether a canonical decision procedure exists, and what happens when it cannot be established. It adds no gate, no state, no transition, no threshold and no scale, and it resolves no condition by inventing a rule. Where no canonical decision procedure exists, that absence is recorded as a gap.

---

## 1. Why this record exists

`quality-gates.md` states, for each gate, what must be true (§§3–8). M2.2 (`runtime/gates/`) implements those statements as 27 conditions asked through the frozen `ValidationContext.checkCondition(projectId, condition)`, and `runtime/artifacts/ProductionValidationContext.ts` answers them from the persisted artifacts.

A schema is a shape, never a rule: it may make a violation detectable, it does not decide the consequence (`schema-architecture.md` §5.1). Most of the 27 conditions are **judgements about meaning** — "is the business unambiguously identified", "were facts fabricated", "was creative intent preserved" — that no canonical document reduces to a decision procedure over artifact shape. Per `failure-routing.md` §1 rule 6, an unclear question routes to human review rather than being guessed at. The implementation therefore **fails closed**: a condition with no canonical decision procedure raises `ConditionContractUnresolvedError`, which the frozen `GateEvaluator` contains as a blocking check failure.

This document makes that posture explicit and auditable, condition by condition.

---

## 2. The contract as it stands

**27 conditions: 10 resolvable, 17 with no canonical decision procedure.** This is the contract accepted at the M2.3-A freeze and preserved in M2.3-B.

### 2.1 Resolvable conditions (10)

Each is decided by artifact existence, or by re-established artifact integrity plus a field whose presence the canonical schema already guarantees on write.

| Condition | Gate check (`id`) | Canonical source | Blocking | How it is established |
|---|---|---|---|---|
| `business_research_exists` | `research_artifacts_exist` | quality-gates.md §3 | yes | CURRENT artifact present |
| `business_intelligence_exists` | `research_artifacts_exist` | quality-gates.md §3 | yes | CURRENT artifact present |
| `asset_inventory_exists` | `research_artifacts_exist` | quality-gates.md §3 | yes | CURRENT artifact present |
| `brand_profile_exists` | `research_artifacts_exist` | quality-gates.md §3 | yes | CURRENT artifact present |
| `design_blueprint_exists` | `blueprint_exists` | quality-gates.md §5 | yes | CURRENT artifact present |
| `implementation_report_exists` | `implementation_report_exists` | quality-gates.md §6 | yes | CURRENT artifact present |
| `critic_report_exists` | `critic_report_exists` | quality-gates.md §7 | yes | CURRENT artifact present |
| `all_facts_have_provenance` | `research_provenance` | quality-gates.md §3.1; artifact-contracts.md §2 | yes | every fact-bearing artifact exists **and** is proven integral **and** every `factualItem` carries all six provenance columns |
| `critic_verdict_stated` | `critic_verdict_stated` | quality-gates.md §7.1 | yes | CRITIC_REPORT integral **and** carries a non-empty verdict |
| `critic_verdict_ship` | `final_critic_passed` | quality-gates.md §8.1 | yes | CRITIC_REPORT integral **and** verdict === `SHIP` |

**Integrity, not shape alone.** The three content-reading conditions above re-establish integrity first — manifest membership, file read, JSON parse, schema validation, and envelope identity (`projectId` / `artifactType` / `artifactVersion` / `artifactId`) — before trusting any payload value. A missing, corrupt, foreign or tampered artifact fails closed. This is the M2.3-A MEDIUM-2 / BLOCKER-2 discipline and it is unchanged in M2.3-B.

### 2.2 Conditions with no canonical decision procedure (17)

Listed with their disposition in §3. "No canonical decision procedure" means: no canonical document states how the condition is decided from observable state, so answering it would require inventing a rule.

**Failure behaviour (all 17, unchanged):** `ProductionValidationContext.checkCondition` raises `ConditionContractUnresolvedError`. The frozen `GateEvaluator.evaluateChecks` contains it as a **blocking** `CheckFailure` whose reason carries the unresolved marker, so the gate fails closed and the run never proceeds on a guessed answer.

---

## 3. The 17 conditions with no canonical decision procedure

| # | Condition | Gate check | Canonical source | Blocking | Disposition |
|---|---|---|---|---|---|
| 1 | `business_identity_unambiguous` | `research_business_identified` | quality-gates.md §3.1 | no | semantic |
| 2 | `fabricated_fact_present` | `blocking_fabricated_fact` | quality-gates.md §3.3 | yes | semantic |
| 3 | `creative_design_intent_statement_present` | `creative_design_intent_statement_present` | quality-gates.md §4.1; artifact-contracts.md §5.10, §6 inv. 7 | yes | **structural — resolved in M2.3-B** |
| 4 | `creative_intent_precedes_selection` | `creative_intent_precedes_selection` | quality-gates.md §4.1 | yes | semantic |
| 5 | `creative_input_versions_recorded` | `creative_input_versions_recorded` | quality-gates.md §4.1; artifact-contracts.md §7 | no | **partial — not resolved** |
| 6 | `creative_decisions_traceable` | `creative_decisions_traceable` | quality-gates.md §4.1 | yes | semantic |
| 7 | `creative_no_facts_outside_intelligence` | `creative_no_facts_outside_intelligence` | quality-gates.md §4.1 | yes | semantic |
| 8 | `creative_verified_facts_unaltered` | `creative_verified_facts_unaltered` | quality-gates.md §4.1 | yes | semantic |
| 9 | `creative_asset_inventory_respected` | `creative_asset_inventory_respected` | quality-gates.md §4.1; §4.3 | yes | semantic |
| 10 | `creative_direction_business_specific` | `creative_direction_business_specific` | quality-gates.md §4.1 | yes | semantic |
| 11 | `creative_industry_heuristic_only` | `creative_industry_heuristic_only` | quality-gates.md §4.1 | no | semantic |
| 12 | `composition_complete` | `blueprint_complete` | quality-gates.md §5.1 | no | semantic |
| 13 | `creative_intent_preserved` | `blueprint_intent_preserved` | quality-gates.md §5.1 | no | semantic |
| 14 | `build_success` | `implementation_build_success` | quality-gates.md §6.1 | yes | runtime state |
| 15 | `blueprint_requirements_honored` | `implementation_blueprint_faithful` | quality-gates.md §6.1 | no | semantic |
| 16 | `no_blocking_findings` | `critic_no_blockers` | quality-gates.md §7.2 | yes | semantic |
| 17 | `no_unresolved_factual_issues` | `final_no_unresolved_integrity` | quality-gates.md §8.2 | yes | semantic |

### 3.1 The resolved condition (3) — `creative_design_intent_statement_present`

| Aspect | Contract |
|---|---|
| Canonical statement | "The Design Intent Statement is present and authored in the Creative Direction artifact" (quality-gates.md §4.1 row 2; authoritatively authored there per artifact-contracts.md §5.10 and §6 invariant 7) |
| Evidence source | The CREATIVE_DIRECTION artifact, re-established integral via `ArtifactRepository.validateCurrentArtifact` (manifest membership, file read, JSON parse, schema validation, envelope identity) |
| Decision procedure | `true` iff the artifact is integral **and** its validated document carries `designIntentStatement` as a string of length ≥ 10 |
| Why this is canon-backed, not invented | `04-SCHEMA/creative-direction.schema.json` declares `designIntentStatement` as `{"type":"string","minLength":10}` and lists it in the artifact's root `required` array. The field name and its minimum length are fixed by canon, not chosen here, so a schema-valid Creative Direction artifact necessarily satisfies the condition |
| Failure behaviour | Integrity invalid, or the field absent/short ⇒ `false` (fail closed). It never answers `true` from artifact existence alone |
| Implementation | `runtime/orchestrator/coordination/ConditionResolutionContext.ts` — a `ValidationContext` **decorator** that answers only this condition and **delegates every other condition, including all unresolved ones, unchanged** to the inner context. `ProductionValidationContext` and `runtime/gates/` are untouched |
| Wiring | **Not wired into production** in M2.3-B. It is proven in isolation by `runtime/tests/orchestrator/ConditionResolutionContext.test.ts`, so production condition behaviour is unchanged this milestone |

### 3.2 The partial condition (5) — `creative_input_versions_recorded`

| Aspect | Contract |
|---|---|
| Canonical statement | "The exact versions of every consumed input are recorded" (quality-gates.md §4.1 row 3; input version recording per artifact-contracts.md §7) |
| What is structurally provable | `04-SCHEMA/creative-direction.schema.json` requires `consumedArtifactVersions` with `minItems: 1`, and each entry requires `artifactType` + `artifactVersion` (envelope). A schema-valid artifact therefore provably records **at least one** exact consumed version |
| Why that is NOT enough | The canonical statement is "**every** consumed input". Establishing completeness requires knowing the consumed set independently of the artifact that claims it. In the `CREATIVE_DIRECTION` state M2.4 registers no action and declares no `requiredInputs`, so nothing canonical or registered names the expected consumed set. Proving non-vacuity while asserting completeness would claim more than the evidence supports |
| Disposition | **Not resolved.** Fails closed as in §2.2. Resolving it needs a canonical statement of which inputs a Creative Direction artifact must record, or a registered action whose `requiredInputs` fixes that set |

### 3.3 Why the remaining dispositions cannot be resolved from shape

- **semantic (13 conditions).** Each is a judgement about meaning, not presence: whether an identification is *unambiguous* (1); whether a claim is *fabricated* rather than sourced (2); whether intent *precedes* selection — an authoring order no artifact records (4); whether a decision is *traceable* to intelligence or stated rationale (6); whether a claim lies *outside* business intelligence (7); whether a verified fact was *altered* (8); whether a direction *respects* asset reality (9); whether it is *business-specific* rather than carried over (10); whether industry was used as *heuristic only* (11); whether composition is *complete* (12); whether creative intent was *preserved* across artifacts (13); whether blueprint requirements were *honored* (15); whether findings are *blocking* (16); whether factual issues are *unresolved* (17).
- **`composition_complete` (12), specifically.** quality-gates.md §5.1 asks for "structure, layout, interactions, and responsive behavior defined". `04-SCHEMA/design-blueprint.schema.json` models the Composition Plan's `sections` as an array of **bare strings** (`"items": { "type": "string" }`, `minItems: 1`) and records no layout, interaction or responsive fields anywhere. The schema therefore cannot detect the §5.1 violation and no canonical decision procedure exists, so it stays unresolved. An earlier expectation that this condition might be schema-derivable was checked against the schema and rejected.
- **runtime state (14).** `build_success` is not a property of any artifact. No canonical artifact records a build result, and M2.4 registers no implementation action or build executor. It can only be decided by a build that actually runs, which does not exist in this milestone.

---

## 4. Policy

1. **Fail closed, never guess.** A condition with no canonical decision procedure must not be answered `true` or `false` by inference. It raises `ConditionContractUnresolvedError` and the gate fails closed (`failure-routing.md` §1 rule 6).
2. **A structural answer must be canon-backed.** A condition may be answered structurally only when a canonical schema makes the fact undetectable-if-absent, and only after artifact integrity is re-established. Re-checking a schema-guaranteed field is permitted; inventing a threshold, scale or mapping is not.
3. **Partial evidence is not evidence.** If canonical data proves a weaker statement than the condition asserts (as in §3.2), the condition stays unresolved.
4. **Adding a resolution is a contract change.** It changes the resolved/unresolved counts and can change a gate verdict. It must be recorded in the milestone document with the canonical basis quoted, and must not be wired into production silently.
5. **No resolution may relax a gate.** Resolving a condition may only make a gate *harder* to pass in the `false` direction. Nothing here permits a gate to pass that previously failed closed, unless the resolved condition is genuinely established.

---

## 5. M2.3-B outcome

| Measure | Before M2.3-B | After M2.3-B |
|---|---|---|
| Conditions in the contract | 27 | 27 |
| Resolvable | 10 | 10 |
| With no canonical decision procedure | 17 | 17 |
| Structural resolutions implemented | 0 | 1 (`creative_design_intent_statement_present`, decorator, **unwired**) |
| Production condition behaviour | fail closed | **unchanged (fail closed)** |

M2.3-B **formalizes** the 17 contracts (this document) and implements the single one canon supports, in isolation. It deliberately does **not** resolve the other 16 — semantic, runtime-state and partial — because doing so would require inventing rules no canonical document states. All six gates therefore continue to fail closed in production, exactly as pinned by `runtime/tests/ProductionWiring.test.ts`.