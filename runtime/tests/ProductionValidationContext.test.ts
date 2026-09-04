/**
 * ProductionValidationContext tests — M2.3-A.
 *
 * Verifies the M2.2 ValidationContext interface is correctly implemented
 * against real persisted artifacts, and that unresolvable conditions throw
 * ConditionContractUnresolvedError rather than guessing a boolean.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { ArtifactRepository } from '../artifacts/ArtifactRepository';
import {
  ProductionValidationContext,
  collectFactualItems,
  hasCompleteProvenance
} from '../artifacts/ProductionValidationContext';
import { ConditionContractUnresolvedError } from '../artifacts/ConditionContractUnresolvedError';
import { ArtifactStore } from '../artifacts/ArtifactStore';
import { ArtifactType } from '../artifacts/ArtifactTypes';
import { ArtifactType as GateArtifactType } from '../gates/GateTypes';

describe('ProductionValidationContext', () => {
  const testWorkspace = path.join(__dirname, 'test-workspace-validation-context');
  let repo: ArtifactRepository;
  let context: ProductionValidationContext;

  const validBusinessResearch = {
    artifactId: 'art-br-1',
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

  beforeEach(() => {
    repo = new ArtifactRepository(testWorkspace);
    context = new ProductionValidationContext(repo);
  });

  afterEach(async () => {
    await fs.rm(testWorkspace, { recursive: true, force: true });
  });

  test('hasArtifact delegates to the repository and reflects persisted state', async () => {
    expect(await context.hasArtifact('proj-1', GateArtifactType.BUSINESS_RESEARCH)).toBe(false);

    await repo.saveArtifact('proj-1', GateArtifactType.BUSINESS_RESEARCH as any, validBusinessResearch);

    expect(await context.hasArtifact('proj-1', GateArtifactType.BUSINESS_RESEARCH)).toBe(true);
  });

  test('checkCondition resolves *_exists conditions from artifact existence', async () => {
    expect(await context.checkCondition('proj-1', 'business_research_exists')).toBe(false);

    await repo.saveArtifact('proj-1', GateArtifactType.BUSINESS_RESEARCH as any, validBusinessResearch);

    expect(await context.checkCondition('proj-1', 'business_research_exists')).toBe(true);
  });

  test('checkCondition throws ConditionContractUnresolvedError for semantic conditions', async () => {
    await expect(
      context.checkCondition('proj-1', 'business_identity_unambiguous')
    ).rejects.toThrow(ConditionContractUnresolvedError);

    await expect(
      context.checkCondition('proj-1', 'fabricated_fact_present')
    ).rejects.toThrow(ConditionContractUnresolvedError);
  });

  test('critic_verdict_ship reflects the CURRENT critic report verdict', async () => {
    expect(await context.checkCondition('proj-1', 'critic_verdict_ship')).toBe(false);

    await repo.saveArtifact('proj-1', GateArtifactType.CRITIC_REPORT as any, {
      artifactId: 'art-cr-1',
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
        verdict: 'SHIP',
        intentTestResult: { passed: true },
        findings: [],
        accessibilityFindings: [],
        factualIntegrityFindings: []
      }
    });

    expect(await context.checkCondition('proj-1', 'critic_verdict_ship')).toBe(true);
  });

  // ------------------------------------------------------------------------
  // MEDIUM-2: all_facts_have_provenance no longer trusts persisted JSON
  // blindly, and no longer reports missing artifacts as vacuous success.
  // ------------------------------------------------------------------------

  const provenanceItem = {
    fact: 'Business name',
    value: 'Acme Co',
    source: 'Google Business Profile',
    sourceType: 'business_listing',
    confidence: 'high',
    verificationStatus: 'verified'
  };

  const researchWithFacts = {
    artifactId: 'art-br-1',
    producer: 'RESEARCH_AGENT',
    businessIdentityAndLocation: [provenanceItem],
    servicesOrOfferings: [],
    contactAndOperatingDetails: [],
    publicReputationSignals: [],
    discoveredAssets: [],
    competitorObservations: [],
    sourceList: [],
    explicitGaps: []
  };

  const intelligenceDoc = {
    artifactId: 'art-bi-1',
    producer: 'RESEARCH_AGENT',
    audienceUnderstanding: [provenanceItem],
    serviceStructure: [],
    positioningSignals: [],
    seoRelevantBusinessContext: [],
    constraintsFromContentOrAssetReality: []
  };

  const assetInventoryDoc = {
    artifactId: 'art-ai-1',
    producer: 'RESEARCH_AGENT',
    assets: [
      {
        assetIdentity: 'asset-001',
        originAndSource: provenanceItem,
        usageRightsPosition: provenanceItem,
        status: 'discovered',
        suitabilityObservations: []
      }
    ],
    aggregateSuitabilityObservations: []
  };

  const brandProfileDoc = {
    artifactId: 'art-bp-1',
    producer: 'RESEARCH_AGENT',
    existingNameUsageAndNamingConventions: [provenanceItem],
    existingMarksOrLogos: [],
    observedColourAndTypographicUsage: [],
    observedToneOfVoice: [],
    existingBrandInconsistencies: []
  };

  const saveAllFactBearing = async () => {
    await repo.saveArtifact('proj-1', ArtifactType.BUSINESS_RESEARCH, researchWithFacts);
    await repo.saveArtifact('proj-1', ArtifactType.BUSINESS_INTELLIGENCE, intelligenceDoc);
    await repo.saveArtifact('proj-1', ArtifactType.ASSET_INVENTORY, assetInventoryDoc);
    await repo.saveArtifact('proj-1', ArtifactType.BRAND_PROFILE, brandProfileDoc);
  };

  /** Rewrite a persisted CURRENT version file (simulating external modification). */
  const tamperCurrentFile = async (
    type: ArtifactType,
    mutate: (doc: Record<string, unknown>) => Record<string, unknown>
  ) => {
    const store = new ArtifactStore(testWorkspace);
    const filePath = store.getArtifactVersionPath('proj-1', type, 1);
    const raw = await fs.readFile(filePath, 'utf-8');
    await fs.writeFile(filePath, JSON.stringify(mutate(JSON.parse(raw))), 'utf-8');
  };

  test('provenance condition is false while fact-bearing artifacts are missing', async () => {
    await expect(
      context.checkCondition('proj-1', 'all_facts_have_provenance')
    ).resolves.toBe(false);
  });

  test('provenance condition is false until every fact-bearing artifact exists', async () => {
    await repo.saveArtifact('proj-1', ArtifactType.BUSINESS_RESEARCH, researchWithFacts);

    // BI / AI / BP still missing: existence is separately asserted by the
    // frozen M2.2 *_exists conditions; provenance must NOT report vacuous
    // success over facts it cannot inspect.
    await expect(
      context.checkCondition('proj-1', 'all_facts_have_provenance')
    ).resolves.toBe(false);

    await saveAllFactBearing();
    await expect(
      context.checkCondition('proj-1', 'all_facts_have_provenance')
    ).resolves.toBe(true);
  });

  test('provenance condition fails closed on a schema-invalid persisted artifact', async () => {
    await saveAllFactBearing();
    await tamperCurrentFile(ArtifactType.BUSINESS_RESEARCH, () => ({
      artifactId: 'broken'
    }));

    await expect(
      context.checkCondition('proj-1', 'all_facts_have_provenance')
    ).resolves.toBe(false);
  });

  test('provenance condition fails closed on corrupt (unparseable) persisted JSON', async () => {
    await saveAllFactBearing();
    const store = new ArtifactStore(testWorkspace);
    await fs.writeFile(
      store.getArtifactVersionPath('proj-1', ArtifactType.ASSET_INVENTORY, 1),
      'not json at all',
      'utf-8'
    );

    await expect(
      context.checkCondition('proj-1', 'all_facts_have_provenance')
    ).resolves.toBe(false);
  });

  test('provenance condition fails when a schema-valid item lacks provenance', async () => {
    await saveAllFactBearing();

    // value: '' passes the schema (the column is deliberately untyped) but is
    // NOT provenance — the explicit provenance-field evaluation catches it.
    await tamperCurrentFile(ArtifactType.BUSINESS_RESEARCH, doc => ({
      ...doc,
      businessIdentityAndLocation: [{ ...provenanceItem, value: '' }]
    }));

    await expect(
      context.checkCondition('proj-1', 'all_facts_have_provenance')
    ).resolves.toBe(false);
  });

  test('provenance condition fails closed on an identity-tampered artifact', async () => {
    await saveAllFactBearing();
    await tamperCurrentFile(ArtifactType.BRAND_PROFILE, doc => ({
      ...doc,
      projectId: 'proj-OTHER'
    }));

    await expect(
      context.checkCondition('proj-1', 'all_facts_have_provenance')
    ).resolves.toBe(false);
  });
});

describe('provenance field helpers (MEDIUM-2)', () => {
  test('collectFactualItems finds items at any nesting depth', () => {
    const doc = {
      envelope: { projectId: 'p' },
      payload: {
        lists: [{ fact: 'a', value: 1 }, { notAFact: true }],
        single: { fact: 'b', value: 2, deeper: [{ fact: 'c' }] }
      }
    };

    const items = collectFactualItems(doc);
    expect(items).toHaveLength(3);
    expect(items.map(i => i['fact'])).toEqual(['a', 'b', 'c']);
  });

  test('hasCompleteProvenance requires all six columns, each non-empty', () => {
    const complete = {
      fact: 'f',
      value: 'v',
      source: 's',
      sourceType: 'st',
      confidence: 'c',
      verificationStatus: 'verified'
    };

    expect(hasCompleteProvenance(complete)).toBe(true);
    expect(hasCompleteProvenance({ ...complete, value: 4.8 })).toBe(true); // untyped column

    for (const field of [
      'fact',
      'value',
      'source',
      'sourceType',
      'confidence',
      'verificationStatus'
    ]) {
      expect(hasCompleteProvenance({ ...complete, [field]: '' })).toBe(false);
      expect(hasCompleteProvenance({ ...complete, [field]: null })).toBe(false);
      expect(hasCompleteProvenance({ ...complete, [field]: undefined })).toBe(false);
    }
  });
});
