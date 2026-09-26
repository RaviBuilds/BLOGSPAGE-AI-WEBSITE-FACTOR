/**
 * M2.3-B — ConditionResolutionContext: the structural-condition decorator.
 *
 * WHAT IS PROVEN HERE
 * -------------------
 * 1. The ONE condition canon supports a decision procedure for
 *    (`creative_design_intent_statement_present`) is answered from a
 *    re-established-integral CREATIVE_DIRECTION artifact, and fails closed
 *    otherwise.
 * 2. Every OTHER condition is delegated UNCHANGED to the inner context — above
 *    all, a condition with no canonical decision procedure still raises
 *    ConditionContractUnresolvedError. The decorator can never convert an
 *    unresolved condition into a boolean.
 * 3. The decorator is NOT the production context: a plain
 *    ProductionValidationContext still fails closed on the same condition, so
 *    production behaviour is unchanged by this milestone.
 * 4. The declared minimum statement length still matches canon
 *    (04-SCHEMA/creative-direction.schema.json `minLength`).
 *
 * Canonical sources:
 * - 02-CONTROL-PLANE/gate-conditions.md §2–§4
 * - 02-CONTROL-PLANE/quality-gates.md §4.1 row 2
 * - 04-SCHEMA/creative-direction.schema.json
 * - 02-CONTROL-PLANE/schema-architecture.md §5.1 (a schema is a shape, not a rule)
 * - 02-CONTROL-PLANE/failure-routing.md §1 rule 6 (unclear → do not guess)
 *
 * M2.3-B Milestone: Seam 1, gate condition contracts, human approval/resume.
 * Factory version: 0.2.0
 */

import * as fs from 'fs';
import * as path from 'path';
import { ArtifactRepository } from '../../artifacts/ArtifactRepository';
import { ArtifactStore } from '../../artifacts/ArtifactStore';
import { ArtifactType } from '../../artifacts/ArtifactTypes';
import { ArtifactType as GateArtifactType } from '../../gates/GateTypes';
import { ProductionValidationContext } from '../../artifacts/ProductionValidationContext';
import { ConditionContractUnresolvedError } from '../../artifacts/ConditionContractUnresolvedError';
import {
  ConditionResolutionContext,
  MIN_DESIGN_INTENT_STATEMENT_LENGTH,
  RESOLVED_CONDITIONS,
  isResolvedByDecorator
} from '../../orchestrator/coordination/ConditionResolutionContext';
import { makeWorkspaceRoot, removeWorkspaceRoot } from './helpers';

const CONDITION = 'creative_design_intent_statement_present';

/**
 * Mirror of SchemaValidator.locateSchemaRoot()'s upward walk, so the canon
 * drift assertion does not hardcode a directory depth.
 */
function locateRepoDir(name: string): string {
  let dir = __dirname;

  for (let i = 0; i < 10; i++) {
    const candidate = path.join(dir, name);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }

  throw new Error(`Could not locate ${name} directory by walking upward from ${__dirname}`);
}

const MIN_STATEMENT = 'A calm, precise dental studio for anxious patients.';

/**
 * A schema-valid CREATIVE_DIRECTION document: exactly the root `required`
 * payload fields, the four required registry versions, and one consumed
 * artifact version (all per 04-SCHEMA/creative-direction.schema.json).
 * artifactType / projectId / artifactVersion / versionStatus are injected by
 * ArtifactRepository.saveArtifact and are deliberately not set here.
 */
function creativeDirectionDoc(
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    artifactId: 'cd-1',
    producer: 'CREATIVE_DIRECTOR',
    designIntentStatement: MIN_STATEMENT,
    creativeRationale: 'Precision and calm reduce patient anxiety.',
    positioningRead: {
      businessDNA: 'Clinical precision with a human manner',
      customerPsychology: 'Anxious patients seeking reassurance',
      valueProposition: 'Careful, unhurried treatment',
      positioningStatement: 'The calm, precise choice'
    },
    brandPersonality: {
      innovative: 5,
      luxurious: 4,
      playful: 3,
      sophisticated: 6,
      bold: 4,
      warm: 7,
      trustworthy: 9,
      energetic: 4
    },
    brandMaturity: 'Developing',
    assetCapability: {
      imageCapability: 6,
      videoCapability: 2,
      peopleCapability: 5,
      environmentCapability: 4
    },
    designLanguage: { primaryLanguage: 'DL-04' },
    parameters: { creativeIntensity: 5, visualTension: 4, contentDensity: 'Medium' },
    registryVersions: {
      parameterRegistry: '1.0.0',
      designLanguageRegistry: '1.0.0',
      phaseOwnershipMatrix: '1.0.0',
      criticMetricsRegistry: '1.0.0'
    },
    consumedArtifactVersions: [
      { artifactType: 'BUSINESS_INTELLIGENCE', artifactVersion: 1 }
    ],
    ...overrides
  };
}

describe('ConditionResolutionContext (M2.3-B decorator)', () => {
  const projectId = 'cond-proj';
  let workspaceRoot: string;
  let repo: ArtifactRepository;
  let production: ProductionValidationContext;
  let decorated: ConditionResolutionContext;

  beforeEach(async () => {
    workspaceRoot = makeWorkspaceRoot('condres');
    await fs.promises.mkdir(path.join(workspaceRoot, projectId), { recursive: true });
    repo = new ArtifactRepository(workspaceRoot);
    production = new ProductionValidationContext(repo);
    decorated = new ConditionResolutionContext(production, repo);
  });

  afterEach(async () => {
    await removeWorkspaceRoot(workspaceRoot);
  });

  describe('the one canon-backed condition is resolved', () => {
    it('answers true for a schema-valid, integral Creative Direction artifact', async () => {
      await repo.saveArtifact(projectId, ArtifactType.CREATIVE_DIRECTION, creativeDirectionDoc());

      await expect(decorated.checkCondition(projectId, CONDITION)).resolves.toBe(true);
    });

    it('fails closed when no Creative Direction artifact exists', async () => {
      // Existence is NOT treated as success, and absence is never a vacuous true.
      await expect(decorated.checkCondition(projectId, CONDITION)).resolves.toBe(false);
    });

    it('fails closed when the persisted artifact was tampered after commit', async () => {
      await repo.saveArtifact(projectId, ArtifactType.CREATIVE_DIRECTION, creativeDirectionDoc());

      // Sanity: the untouched artifact satisfies the condition.
      await expect(decorated.checkCondition(projectId, CONDITION)).resolves.toBe(true);

      // Tamper the bytes on disk; the manifest and its commit-time SHA-256 are
      // untouched, so only the integrity chain can catch this.
      const store = new ArtifactStore(workspaceRoot);
      const versionPath = store.getArtifactVersionPath(
        projectId,
        ArtifactType.CREATIVE_DIRECTION,
        1
      );
      const onDisk = JSON.parse(fs.readFileSync(versionPath, 'utf-8')) as Record<string, unknown>;
      onDisk['designIntentStatement'] = 'A completely different statement.';
      fs.writeFileSync(versionPath, JSON.stringify(onDisk, null, 2));

      await expect(decorated.checkCondition(projectId, CONDITION)).resolves.toBe(false);
    });

    it('is structurally guaranteed: a short statement cannot even be persisted', async () => {
      // The schema, not this decorator, is what makes the condition decidable:
      // designIntentStatement is root-required with minLength 10, so a document
      // that would violate the condition is rejected on write.
      await expect(
        repo.saveArtifact(
          projectId,
          ArtifactType.CREATIVE_DIRECTION,
          creativeDirectionDoc({ designIntentStatement: 'too short' })
        )
      ).rejects.toThrow(/failed schema validation/);

      // Nothing was persisted, so the condition fails closed.
      await expect(decorated.checkCondition(projectId, CONDITION)).resolves.toBe(false);
    });
  });

  describe('everything else is delegated unchanged', () => {
    /** Records what it was asked, and returns a fixed sentinel. */
    class RecordingStubContext {
      readonly asked: { condition: string; params?: Record<string, unknown> }[] = [];
      constructor(private readonly answer: boolean) {}
      async hasArtifact(): Promise<boolean> {
        return this.answer;
      }
      async checkCondition(
        _projectId: string,
        condition: string,
        params?: Record<string, unknown>
      ): Promise<boolean> {
        this.asked.push({ condition, params });
        return this.answer;
      }
    }

    it('passes other conditions through with their params intact', async () => {
      const stub = new RecordingStubContext(true);
      const ctx = new ConditionResolutionContext(stub, repo);
      const params = { some: 'param' };

      await expect(ctx.checkCondition(projectId, 'build_success', params)).resolves.toBe(true);

      expect(stub.asked).toEqual([{ condition: 'build_success', params }]);
    });

    it('propagates a false answer from the inner context unchanged', async () => {
      const stub = new RecordingStubContext(false);
      const ctx = new ConditionResolutionContext(stub, repo);

      await expect(ctx.checkCondition(projectId, 'no_blocking_findings')).resolves.toBe(false);
    });

    it('delegates hasArtifact unchanged', async () => {
      const stub = new RecordingStubContext(true);
      const ctx = new ConditionResolutionContext(stub, repo);

      await expect(
        ctx.hasArtifact(projectId, GateArtifactType.CREATIVE_DIRECTION)
      ).resolves.toBe(true);
    });

    it('never turns an unresolved condition into a boolean', async () => {
      // Wrapped around the REAL production context: every one of these has no
      // canonical decision procedure (gate-conditions.md §3), so it must still
      // raise ConditionContractUnresolvedError rather than be guessed at.
      await repo.saveArtifact(projectId, ArtifactType.CREATIVE_DIRECTION, creativeDirectionDoc());

      const unresolved = [
        'business_identity_unambiguous',
        'fabricated_fact_present',
        'creative_intent_precedes_selection',
        'creative_input_versions_recorded',
        'creative_decisions_traceable',
        'creative_no_facts_outside_intelligence',
        'creative_verified_facts_unaltered',
        'creative_asset_inventory_respected',
        'creative_direction_business_specific',
        'creative_industry_heuristic_only',
        'composition_complete',
        'creative_intent_preserved',
        'build_success',
        'blueprint_requirements_honored',
        'no_blocking_findings',
        'no_unresolved_factual_issues'
      ];

      for (const condition of unresolved) {
        await expect(decorated.checkCondition(projectId, condition)).rejects.toThrow(
          ConditionContractUnresolvedError
        );
      }
    });
  });

  describe('declared resolution set and canon agreement', () => {
    it('declares exactly the one condition it resolves', () => {
      expect(RESOLVED_CONDITIONS).toEqual([CONDITION]);
      expect(isResolvedByDecorator(CONDITION)).toBe(true);
      expect(isResolvedByDecorator('build_success')).toBe(false);
      expect(isResolvedByDecorator('composition_complete')).toBe(false);
    });

    it('mirrors the canonical minLength rather than inventing one', () => {
      const schemaPath = path.join(locateRepoDir('04-SCHEMA'), 'creative-direction.schema.json');
      const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8')) as {
        allOf: { properties?: Record<string, { minLength?: number }>; required?: string[] }[];
      };

      const branch = schema.allOf.find(b => b.properties?.['designIntentStatement']);
      expect(branch).toBeDefined();
      expect(branch!.properties!['designIntentStatement'].minLength).toBe(
        MIN_DESIGN_INTENT_STATEMENT_LENGTH
      );
      expect(branch!.required).toContain('designIntentStatement');
    });
  });

  describe('the decorator is not production wiring', () => {
    it('leaves ProductionValidationContext failing closed on the same condition', async () => {
      await repo.saveArtifact(projectId, ArtifactType.CREATIVE_DIRECTION, creativeDirectionDoc());

      // The artifact is integral and schema-valid, yet the production context
      // still refuses to guess: the resolution exists only behind the decorator,
      // and nothing in M2.3-B wires it in. Production behaviour is unchanged.
      await expect(production.checkCondition(projectId, CONDITION)).rejects.toThrow(
        ConditionContractUnresolvedError
      );
    });
  });
});