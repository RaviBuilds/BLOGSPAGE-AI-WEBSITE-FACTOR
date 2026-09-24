/**
 * Deterministic Research Worker — the M2.4 research vertical slice worker.
 *
 * Performs the Research Agent's stage-2 domain work for the benchmark
 * vertical slice: it derives the four research artifacts
 * (workflow.md §3.2 outputs; agent-roles.md §3.1 outputs) from the supplied
 * project business input, as DATA. It is deterministic: the same business
 * input and the same ExecutionContext produce the same documents, which is
 * what makes the vertical slice executable and testable end to end.
 *
 * HONESTY BOUNDARY (per the M2.4 plan): this worker does not simulate real
 * web research and does not pretend the full research agent exists. It
 * derives factual items ONLY from what the supplied business input actually
 * states, records everything it cannot establish as unknown, and surfaces
 * what is missing through explicitGaps (artifact-contracts.md §1 rule 5:
 * unavailable information is recorded as unknown, never filled by
 * invention). Every factual item carries the six provenance columns
 * (artifact-contracts.md §2 / Factory Operating System §0.8). No gate
 * condition is faked; unresolved M2.2 conditions remain fail-closed.
 *
 * The worker does NOT persist, does NOT touch the filesystem (it receives
 * the parsed project input in its ExecutionContext), and does NOT know about
 * states, gates or transitions.
 *
 * Provenance modelling note (recorded, not invented): canon fixes the six
 * provenance columns but no confidence scale (04-SCHEMA factualItem
 * $comments). The worker records confidence as 'HUMAN_SUPPLIED' for items
 * taken directly from the human's supplied business input and
 * 'NOT_ESTABLISHED' for unknowns; this is a rendering choice within the
 * canon's open column, not a new canonical scale.
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 * Factory version: 0.2.0
 */

import {
  ArtifactOutput,
  ArtifactType,
  ExecutionContext,
  Worker,
  WorkerOutput
} from '../types';

const INPUT_SOURCE = 'business-input.yaml (supplied project input)';
const SOURCE_TYPE = 'SUPPLIED_PROJECT_INPUT';
const CONFIDENCE_SUPPLIED = 'HUMAN_SUPPLIED';
const CONFIDENCE_UNKNOWN = 'NOT_ESTABLISHED';

type Item = Record<string, unknown>;

/** A fully-provenanced factual item (the shared factualItem shape). */
function factItem(
  fact: string,
  value: string,
  verificationStatus: 'verified' | 'inferred' | 'unknown'
): Item {
  return {
    fact,
    value,
    source: INPUT_SOURCE,
    sourceType: SOURCE_TYPE,
    confidence:
      verificationStatus === 'unknown' ? CONFIDENCE_UNKNOWN : CONFIDENCE_SUPPLIED,
    verificationStatus
  };
}

/** Records a supplied value as verified, or the absence of it as unknown. */
function suppliedOrUnknown(fact: string, raw: unknown): Item {
  if (raw !== undefined && raw !== null && String(raw).trim().length > 0) {
    return factItem(fact, String(raw), 'verified');
  }
  return factItem(fact, 'unknown', 'unknown');
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

export class ResearchWorker implements Worker {
  readonly workerId = 'ResearchWorker';
  readonly version = '0.1.0';

  async execute(context: ExecutionContext): Promise<WorkerOutput> {
    const startedAt = Date.now();

    if (context.projectInput === undefined || context.projectInput === null) {
      throw new Error(
        `${this.workerId} requires the parsed project business input in its ExecutionContext`
      );
    }

    const input = asRecord(context.projectInput);

    const artifacts: ArtifactOutput[] = [
      {
        artifactType: ArtifactType.BUSINESS_RESEARCH,
        document: this.buildBusinessResearch(context, input),
        // Bootstrap stage: research consumes the registered project input
        // (M1-owned, not an artifact), so no artifact versions were consumed.
        consumedInputs: []
      },
      {
        artifactType: ArtifactType.BUSINESS_INTELLIGENCE,
        document: this.buildBusinessIntelligence(context, input),
        consumedInputs: []
      },
      {
        artifactType: ArtifactType.ASSET_INVENTORY,
        document: this.buildAssetInventory(context, input),
        consumedInputs: []
      },
      {
        artifactType: ArtifactType.BRAND_PROFILE,
        document: this.buildBrandProfile(context, input),
        consumedInputs: []
      }
    ];

    return {
      artifacts,
      metadata: {
        executionId: context.executionId,
        workerId: this.workerId,
        workerVersion: this.version,
        executedAt: new Date().toISOString(),
        executionDurationMs: Date.now() - startedAt
      },
      warnings: []
    };
  }

  /**
   * Business Research (artifact-contracts.md §5.1): record what can be found
   * and sourced about the business, drawn only from the supplied input.
   */
  private buildBusinessResearch(
    context: ExecutionContext,
    input: Record<string, unknown>
  ): Record<string, unknown> {
    const identity = asRecord(input['businessIdentity']);
    const primary = asRecord(identity['primaryLocation']);
    const secondary = asRecord(identity['secondaryLocation']);
    const summary = asRecord(input['contentSummary']);
    const suppliedContent = asRecord(input['suppliedContent']);
    const suppliedBrand = asRecord(input['suppliedBrand']);

    const businessIdentityAndLocation = [
      suppliedOrUnknown('Business name', identity['name']),
      suppliedOrUnknown('Industry', identity['industry']),
      suppliedOrUnknown('Business type', identity['businessType']),
      suppliedOrUnknown('Established', identity['established']),
      suppliedOrUnknown('Tagline', identity['tagline']),
      suppliedOrUnknown('Primary location name', primary['name']),
      suppliedOrUnknown('Secondary location name', secondary['name'])
    ];

    const servicesOrOfferings: Item[] = [];
    if (summary['servicesCount'] !== undefined) {
      servicesOrOfferings.push(
        factItem(
          'Services recorded in supplied content',
          String(summary['servicesCount']),
          'verified'
        )
      );
    }
    if (suppliedContent['services'] !== undefined) {
      servicesOrOfferings.push(
        factItem(
          'Supplied services content referenced by project input',
          String(suppliedContent['services']),
          'verified'
        )
      );
    }
    if (servicesOrOfferings.length === 0) {
      servicesOrOfferings.push(factItem('Services or offerings', 'unknown', 'unknown'));
    }

    const contactAndOperatingDetails = [
      suppliedOrUnknown('Primary location city', primary['city']),
      suppliedOrUnknown('Primary location state', primary['state']),
      suppliedOrUnknown('Secondary location city', secondary['city']),
      suppliedOrUnknown('Secondary location state', secondary['state'])
    ];

    const publicReputationSignals: Item[] = [];
    if (summary['testimonialsCount'] !== undefined) {
      publicReputationSignals.push(
        factItem(
          'Testimonials recorded in supplied content',
          String(summary['testimonialsCount']),
          'verified'
        )
      );
    }
    if (summary['trustSignalsCount'] !== undefined) {
      publicReputationSignals.push(
        factItem(
          'Trust signals recorded in supplied content',
          String(summary['trustSignalsCount']),
          'verified'
        )
      );
    }

    const discoveredAssets: Item[] = [];
    if (suppliedBrand['logo'] !== undefined) {
      discoveredAssets.push(
        factItem(
          'Supplied brand logo asset discovered',
          String(suppliedBrand['logo']),
          'verified'
        )
      );
    }

    return {
      artifactId: `${context.executionId}-BUSINESS_RESEARCH`,
      producer: 'RESEARCH_AGENT',
      businessIdentityAndLocation,
      servicesOrOfferings,
      contactAndOperatingDetails,
      publicReputationSignals,
      discoveredAssets,
      // The supplied input states no competitor information; the absence is
      // recorded as a gap rather than invented (artifact-contracts.md §1 rule 5).
      competitorObservations: [],
      sourceList: [
        {
          source: INPUT_SOURCE,
          whatItEstablished: [
            'Business identity and location facts as stated by the business',
            'Supplied content summary counts',
            'Supplied brand asset references'
          ],
          whatItDidNotEstablish: [
            'External reputation signals',
            'Competitor information',
            'Direct contact details (telephone, email, operating hours)',
            'Per-item supplied-content details (referenced files are not present in the workspace input)'
          ]
        }
      ],
      explicitGaps: [
        'No competitor information is present in the supplied project input',
        'Direct contact details (telephone, email, operating hours) are not present in business-input.yaml',
        'Supplied-content files (services, team, testimonials, locations, trust signals) are referenced but not copied into the project workspace input; per-item details remain unknown rather than invented'
      ]
    };
  }

  /**
   * Business Intelligence (artifact-contracts.md §5.2): truth-classified
   * package for creative use. Classification is limited to what the supplied
   * input supports; everything else is recorded as unknown.
   */
  private buildBusinessIntelligence(
    context: ExecutionContext,
    input: Record<string, unknown>
  ): Record<string, unknown> {
    const identity = asRecord(input['businessIdentity']);
    const primary = asRecord(identity['primaryLocation']);
    const secondary = asRecord(identity['secondaryLocation']);
    const summary = asRecord(input['contentSummary']);
    const declaration = asRecord(input['sourceDeclaration']);

    const audienceUnderstanding = [
      suppliedOrUnknown(
        'Audience as characterised by the supplied market positioning',
        identity['marketPositioning']
      )
    ];

    const serviceStructure = [
      suppliedOrUnknown(
        'Service structure size per supplied content summary',
        summary['servicesCount']
      )
    ];

    const positioningSignals: Item[] = [
      suppliedOrUnknown('Positioning signal from supplied tagline', identity['tagline']),
      suppliedOrUnknown(
        'Positioning signal from supplied market positioning',
        identity['marketPositioning']
      )
    ];

    const seoRelevantBusinessContext: Item[] = [
      suppliedOrUnknown('Industry context for search relevance', identity['industry']),
      suppliedOrUnknown('Primary location city context', primary['city']),
      suppliedOrUnknown('Secondary location city context', secondary['city'])
    ];

    const constraintsFromContentOrAssetReality: Item[] = [
      suppliedOrUnknown('Source researchability declared by project input', declaration['researchability'])
    ];
    if (declaration['type'] === 'SYNTHETIC_TEST') {
      constraintsFromContentOrAssetReality.push(
        factItem(
          'All business facts are synthetic test elements; verification is limited to the supplied input',
          'SUPPLIED_INPUT_ONLY',
          'verified'
        )
      );
    }

    return {
      artifactId: `${context.executionId}-BUSINESS_INTELLIGENCE`,
      producer: 'RESEARCH_AGENT',
      audienceUnderstanding,
      serviceStructure,
      positioningSignals,
      seoRelevantBusinessContext,
      constraintsFromContentOrAssetReality
    };
  }

  /**
   * Asset Inventory (artifact-contracts.md §5.3): candidate assets with
   * status. Discovered assets are recorded as DISCOVERED only — approval is
   * a human decision (artifact-contracts.md §3 rule 2).
   */
  private buildAssetInventory(
    context: ExecutionContext,
    input: Record<string, unknown>
  ): Record<string, unknown> {
    const suppliedBrand = asRecord(input['suppliedBrand']);
    const logo = suppliedBrand['logo'];

    const assets: Record<string, unknown>[] = [];
    if (logo !== undefined && String(logo).trim().length > 0) {
      const identity = String(logo).split('/').pop() ?? String(logo);
      assets.push({
        assetIdentity: identity,
        originAndSource: factItem(
          'Origin of supplied brand asset',
          String(logo),
          'verified'
        ),
        usageRightsPosition: factItem(
          'Usage-rights position of supplied brand asset',
          'unknown',
          'unknown'
        ),
        status: 'discovered',
        suitabilityObservations: []
      });
    }

    return {
      artifactId: `${context.executionId}-ASSET_INVENTORY`,
      producer: 'RESEARCH_AGENT',
      assets,
      aggregateSuitabilityObservations: [
        factItem('Candidate asset set size', String(assets.length), 'verified'),
        factItem(
          'Asset scarcity constraint',
          assets.length === 0
            ? 'No candidate assets discovered from the supplied project input'
            : 'Usage-rights positions are not established in the workspace input; assets remain unapproved pending human review',
          'unknown'
        )
      ]
    };
  }

  /**
   * Brand Profile (artifact-contracts.md §5.4): observed brand reality as
   * fact, observation only, no creative recommendation.
   */
  private buildBrandProfile(
    context: ExecutionContext,
    input: Record<string, unknown>
  ): Record<string, unknown> {
    const identity = asRecord(input['businessIdentity']);
    const suppliedBrand = asRecord(input['suppliedBrand']);

    const existingNameUsageAndNamingConventions = [
      suppliedOrUnknown('Existing business name as supplied', identity['name'])
    ];

    const existingMarksOrLogos: Item[] = [];
    if (suppliedBrand['logo'] !== undefined) {
      existingMarksOrLogos.push(
        factItem('Existing supplied mark or logo', String(suppliedBrand['logo']), 'verified')
      );
    }

    const observedColourAndTypographicUsage = [
      // The brand context file is referenced by the input but is not present
      // in the workspace input, so the observation is recorded as unknown.
      factItem('Observed brand colour and typographic usage', 'unknown', 'unknown')
    ];

    const hasTagline =
      identity['tagline'] !== undefined && String(identity['tagline']).trim().length > 0;

    const observedToneOfVoice: Item[] = [
      hasTagline
        ? {
            ...factItem(
              'Observed tone-of-voice signal inferred from the supplied tagline',
              String(identity['tagline']),
              'inferred'
            )
          }
        : factItem('Observed tone-of-voice signal', 'unknown', 'unknown')
    ];

    return {
      artifactId: `${context.executionId}-BRAND_PROFILE`,
      producer: 'RESEARCH_AGENT',
      existingNameUsageAndNamingConventions,
      existingMarksOrLogos,
      observedColourAndTypographicUsage,
      observedToneOfVoice,
      existingBrandInconsistencies: []
    };
  }
}
