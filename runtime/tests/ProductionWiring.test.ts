/**
 * Production-wiring integration tests -- M2.3-A BLOCKER-5.
 *
 * Wires the REAL production components end to end:
 *
 *   GateEvaluator (frozen M2.2)
 *     over GateRegistry's six canonical gates
 *     over ProductionValidationContext (M2.3-A)
 *       over ArtifactRepository / ArtifactStore / ManifestManager / SchemaValidator
 *
 * MockValidationContext is deliberately NOT imported anywhere in this file.
 * The suite documents the CURRENT architecture rather than fabricating a
 * passing gate: no unresolved M2.2 condition is stubbed, faked, or answered
 * here. Where an unresolved condition throws ConditionContractUnresolvedError,
 * the real GateEvaluator contains it (evaluateChecks converts a check's
 * exception into a blocking CheckFailure carrying the error message) and the
 * gate fails closed -- these tests pin exactly that behavior.
 *
 * CURRENT-ARCHITECTURE FACT pinned by T3: all six gates fail closed under the
 * present condition contract, because every gate has at least one unresolved
 * condition. (Critic Validation in particular has THREE checks, including
 * no_blocking_findings, which is unresolved -- it cannot pass merely because
 * a valid critic report exists.) This is the accepted M2.3-A freeze posture:
 * fail-closed, routed to human review, never guessed.
 */

import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { GateEvaluator } from '../gates/GateEvaluator';
import { getAllGates } from '../gates/GateRegistry';
import { GateName, ArtifactType as GateArtifactType } from '../gates/GateTypes';
import { ProductionValidationContext } from '../artifacts/ProductionValidationContext';
import { ArtifactRepository } from '../artifacts/ArtifactRepository';
import { ArtifactStore } from '../artifacts/ArtifactStore';
import { ManifestManager } from '../artifacts/ManifestManager';
import { SchemaValidator } from '../artifacts/SchemaValidator';

const UNRESOLVED_MARKER = 'no canonically-derivable resolution';

const workspaceRoot = path.join(os.tmpdir(), `blogspage-pw-${process.pid}`);

let repo: ArtifactRepository;
let context: ProductionValidationContext;
let evaluator: GateEvaluator;
let store: ArtifactStore;

/** Fact-free research artifacts: schema-valid, no provenance burden. */
const businessResearchDoc = {
  artifactId: 'pw-br-1',
  producer: 'RESEARCH_AGENT',
  businessIdentityAndLocation: [],
  servicesOrOfferings: [],
  contactAndOperatingDetails: [],
  publicReputationSignals: [],
  discoveredAssets: [],
  competitorObservations: [],
  sourceList: [],
  explicitGaps: []
};

const businessIntelligenceDoc = {
  artifactId: 'pw-bi-1',
  producer: 'RESEARCH_AGENT',
  audienceUnderstanding: [],
  serviceStructure: [],
  positioningSignals: [],
  seoRelevantBusinessContext: [],
  constraintsFromContentOrAssetReality: []
};

const assetInventoryDoc = {
  artifactId: 'pw-ai-1',
  producer: 'RESEARCH_AGENT',
  assets: [],
  aggregateSuitabilityObservations: []
};

const brandProfileDoc = {
  artifactId: 'pw-bp-1',
  producer: 'RESEARCH_AGENT',
  existingNameUsageAndNamingConventions: [],
  existingMarksOrLogos: [],
  observedColourAndTypographicUsage: [],
  observedToneOfVoice: [],
  existingBrandInconsistencies: []
};

const validCriticReport = {
  artifactId: 'pw-cr-1',
  producer: 'INDEPENDENT_CRITIC',
  consumedArtifactVersions: [
    { artifactType: 'RENDERED_RESULT', artifactVersion: 1 },
    { artifactType: 'DESIGN_BLUEPRINT', artifactVersion: 1 }
  ],
  registryVersions: {
    parameterRegistry: '1.0.0',
    designLanguageRegistry: '1.0.0',
    phaseOwnershipMatrix: '1.0.0',
    criticMetricsRegistry: '1.0.0'
  },
  payload: {
    criticIteration: 1,
    verdict: 'REFINE',
    intentTestResult: { passed: true },
    findings: [],
    accessibilityFindings: [],
    factualIntegrityFindings: []
  }
};

async function saveResearchSet(projectId: string): Promise<void> {
  await repo.saveArtifact(projectId, GateArtifactType.BUSINESS_RESEARCH as never, businessResearchDoc);
  await repo.saveArtifact(projectId, GateArtifactType.BUSINESS_INTELLIGENCE as never, businessIntelligenceDoc);
  await repo.saveArtifact(projectId, GateArtifactType.ASSET_INVENTORY as never, assetInventoryDoc);
  await repo.saveArtifact(projectId, GateArtifactType.BRAND_PROFILE as never, brandProfileDoc);
}

function failureReasonsFor(result: { failures: { reason: string }[] }): string[] {
  return result.failures.map(f => f.reason);
}

function unresolvedReasons(result: { failures: { reason: string }[] }): string[] {
  return failureReasonsFor(result).filter(r => r.includes(UNRESOLVED_MARKER));
}

function expectUnresolvedConditionNamed(
  result: { failures: { reason: string }[] },
  condition: string
): void {
  const matched = failureReasonsFor(result).some(
    r => r.includes(UNRESOLVED_MARKER) && r.includes(`'${condition}'`)
  );
  if (!matched) {
    throw new Error(
      `Expected an unresolved-condition failure naming '${condition}'; got: ` +
        JSON.stringify(failureReasonsFor(result))
    );
  }
}

beforeAll(async () => {
  await fs.rm(workspaceRoot, { recursive: true, force: true });
  await fs.mkdir(workspaceRoot, { recursive: true });

  store = new ArtifactStore(workspaceRoot);
  new ManifestManager(workspaceRoot); // constructed for wiring completeness
  repo = new ArtifactRepository(workspaceRoot, new SchemaValidator());
  context = new ProductionValidationContext(repo);
  evaluator = new GateEvaluator(context);
});

afterAll(async () => {
  await fs.rm(workspaceRoot, { recursive: true, force: true });
});

describe('production wiring: real GateEvaluator over ProductionValidationContext over ArtifactRepository', () => {
  test('T1: Research Validation against an empty project must not pass, and the refusal is routed (fail-closed)', async () => {
    const gate = getAllGates().find(g => g.gate === GateName.RESEARCH_VALIDATION)!;
    const result = await evaluator.evaluateGate('pw-t1', GateName.RESEARCH_VALIDATION, gate.sourceState);

    expect(result.passed).toBe(false);
    expect(result.gate).toBe(GateName.RESEARCH_VALIDATION);
    expect(result.recommendedRoute).toBeDefined();

    // Missing artifacts AND unresolved conditions both appear as blocking
    // failures with root causes (quality-gates.md section 1 rule 3).
    const reasons = failureReasonsFor(result);
    expect(reasons.some(r => r.includes('BUSINESS_RESEARCH'))).toBe(true);
    expect(unresolvedReasons(result).length).toBeGreaterThan(0);
    expectUnresolvedConditionNamed(result, 'business_identity_unambiguous');
  });

  test('T2: with all four valid research artifacts, Research Validation STILL must not pass (unresolved conditions are never stubbed)', async () => {
    const projectId = 'pw-t2';
    await saveResearchSet(projectId);

    const gate = getAllGates().find(g => g.gate === GateName.RESEARCH_VALIDATION)!;
    const result = await evaluator.evaluateGate(projectId, GateName.RESEARCH_VALIDATION, gate.sourceState);

    expect(result.passed).toBe(false);

    // The artifact-existence checks now pass: no failure may cite a missing
    // research artifact anymore.
    const reasons = failureReasonsFor(result);
    expect(reasons.some(r => r.includes('BUSINESS_RESEARCH'))).toBe(false);

    // The gate fails ONLY because unresolved semantic conditions refuse to
    // answer -- named individually, fail-closed, routed to human review.
    expect(unresolvedReasons(result).length).toBeGreaterThan(0);
    expectUnresolvedConditionNamed(result, 'business_identity_unambiguous');
    expectUnresolvedConditionNamed(result, 'fabricated_fact_present');
  });

  test('T3: table-driven -- ALL SIX gates fail closed under the current condition contract, each naming its unresolved conditions', async () => {
    const projectId = 'pw-t3';
    await saveResearchSet(projectId);
    await repo.saveArtifact(projectId, GateArtifactType.CRITIC_REPORT as never, validCriticReport);

    // Expected unresolved condition(s) per gate, from the frozen M2.2 gate
    // registry and the 10/17 condition contract. Critic Validation is
    // documented as CANNOT PASS despite a fully valid critic report,
    // because its third check (no_blocking_findings) is unresolved. This
    // pins actual current behavior; fabricating a pass would require
    // implementing an unresolved condition, which the remediation forbids.
    const expectations: { gate: GateName; unresolved: string[] }[] = [
      { gate: GateName.RESEARCH_VALIDATION, unresolved: ['business_identity_unambiguous', 'fabricated_fact_present'] },
      { gate: GateName.CREATIVE_DIRECTION_VALIDATION, unresolved: ['creative_design_intent_statement_present'] },
      { gate: GateName.BLUEPRINT_VALIDATION, unresolved: ['composition_complete', 'creative_intent_preserved'] },
      { gate: GateName.IMPLEMENTATION_VALIDATION, unresolved: ['build_success', 'blueprint_requirements_honored'] },
      { gate: GateName.CRITIC_VALIDATION, unresolved: ['no_blocking_findings'] },
      { gate: GateName.FINAL_APPROVAL, unresolved: ['no_unresolved_factual_issues'] }
    ];

    for (const expectation of expectations) {
      const gate = getAllGates().find(g => g.gate === expectation.gate)!;
      const result = await evaluator.evaluateGate(projectId, expectation.gate, gate.sourceState);

      expect(result.passed).toBe(false);
      expect(unresolvedReasons(result).length).toBeGreaterThan(0);
      for (const condition of expectation.unresolved) {
        expectUnresolvedConditionNamed(result, condition);
      }
    }
  });

  test('T4: tampering the on-disk critic verdict to SHIP cannot produce a delivery-passing Final Approval', async () => {
    const projectId = 'pw-t4';
    await repo.saveArtifact(projectId, GateArtifactType.CRITIC_REPORT as never, validCriticReport);

    // Sanity: an unmodified REFINE verdict does not support delivery.
    expect(await context.checkCondition(projectId, 'critic_verdict_ship')).toBe(false);

    // Tamper the persisted bytes: REFINE becomes SHIP, manifest untouched.
    const filePath = store.getArtifactVersionPath(projectId, 'CRITIC_REPORT' as never, 1);
    const onDisk = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    onDisk.payload.verdict = 'SHIP';
    await fs.writeFile(filePath, JSON.stringify(onDisk, null, 2), 'utf-8');

    // The content-integrity chain (commit-time SHA-256) rejects the file:
    // the condition fails closed and the Final Approval gate cannot pass.
    expect(await context.checkCondition(projectId, 'critic_verdict_ship')).toBe(false);

    const gate = getAllGates().find(g => g.gate === GateName.FINAL_APPROVAL)!;
    const result = await evaluator.evaluateGate(projectId, GateName.FINAL_APPROVAL, gate.sourceState);
    expect(result.passed).toBe(false);
  });

  test('T5: deleting a manifest-recorded CURRENT version file fails the gate closed (no crash, no false pass)', async () => {
    const projectId = 'pw-t5';
    await saveResearchSet(projectId);

    // Delete the persisted CURRENT BUSINESS_RESEARCH behind the manifest's back.
    const filePath = store.getArtifactVersionPath(projectId, 'BUSINESS_RESEARCH' as never, 1);
    await fs.unlink(filePath);

    const gate = getAllGates().find(g => g.gate === GateName.RESEARCH_VALIDATION)!;
    const result = await evaluator.evaluateGate(projectId, GateName.RESEARCH_VALIDATION, gate.sourceState);

    // Fail closed: nothing throws out of the evaluation and the gate does
    // not pass.
    expect(result.passed).toBe(false);

    // CURRENT-BEHAVIOR DOCUMENTATION (pinned, not endorsed): hasArtifact is
    // manifest-based and does NOT stat the file, so the *_exists existence
    // condition still answers true for the deleted artifact. The divergence
    // is caught by every content-reading condition: the provenance check
    // routes through validateCurrentArtifact, which fails closed on the
    // missing version file. Read-path reconciliation/diagnosis remains an
    // M2.3-B item per the approved plan; no current gate can false-pass on
    // this scenario because every gate has at least one content-reading or
    // unresolved condition.
    expect(await context.checkCondition(projectId, 'business_research_exists')).toBe(true);
    expect(await context.checkCondition(projectId, 'all_facts_have_provenance')).toBe(false);

    const reasons = failureReasonsFor(result);
    expect(reasons.some(r => r.toLowerCase().includes('provenance'))).toBe(true);
  });

  test('T6: ConditionContractUnresolvedError is contained by the frozen GateEvaluator -- returned as a routed failure, never an escape', async () => {
    const projectId = 'pw-t6';
    await saveResearchSet(projectId);

    // If this contract ever breaks, evaluateGate REJECTS (the exception
    // escapes) and this test fails -- that is the frozen-M2.2 containment
    // defect signal; per the remediation plan, report it, do not patch
    // GateEvaluator preemptively.
    for (const gate of getAllGates()) {
      const result = await evaluator.evaluateGate(projectId, gate.gate, gate.sourceState);
      expect(result.passed).toBe(false);
      expect(unresolvedReasons(result).length).toBeGreaterThan(0);
      const unresolvedFailure = result.failures.find(f => f.reason.includes(UNRESOLVED_MARKER))!;
      expect(unresolvedFailure.blocking).toBe(true);
      expect(result.recommendedRoute).toBeDefined();
    }
  });
});