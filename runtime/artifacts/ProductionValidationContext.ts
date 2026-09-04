import { ArtifactType as GateArtifactType } from '../gates/GateTypes';
import { ValidationContext } from '../gates/ValidationContext';
import { ArtifactRepository } from './ArtifactRepository';
import { ArtifactType } from './ArtifactTypes';
import { ConditionContractUnresolvedError } from './ConditionContractUnresolvedError';
import { logger } from '../logging/Logger';

/**
 * Maps gates/GateTypes.ArtifactType (M2.2, frozen, 10 members) to this
 * milestone's artifacts/ArtifactTypes.ArtifactType (11 members, superset).
 *
 * String values are identical for every shared member (verified against
 * both enum declarations this session), so this is a safe, total mapping
 * for every value ValidationContext.hasArtifact() can ever be called with
 * — GateArtifactType has no member ArtifactType lacks.
 */
function toRepositoryArtifactType(type: GateArtifactType): ArtifactType {
  return type as unknown as ArtifactType;
}

/**
 * The fact-bearing artifact types: the research artifacts whose canonical
 * schemas carry per-item provenance (definitions named factualItem /
 * truthClassifiedItem in 04-SCHEMA/, each requiring the six provenance
 * columns fact/value/source/sourceType/confidence/verificationStatus per
 * artifact-contracts.md section 2 / Factory Operating System section 0.8).
 */
const FACT_BEARING_ARTIFACT_TYPES: ArtifactType[] = [
  ArtifactType.BUSINESS_RESEARCH,
  ArtifactType.BUSINESS_INTELLIGENCE,
  ArtifactType.ASSET_INVENTORY,
  ArtifactType.BRAND_PROFILE
];

/**
 * The six provenance columns of artifact-contracts.md section 2. A
 * factualItem missing any of these does NOT have provenance.
 */
const REQUIRED_PROVENANCE_FIELDS = [
  'fact',
  'value',
  'source',
  'sourceType',
  'confidence',
  'verificationStatus'
] as const;

/**
 * Collect every factualItem-like object from a document: any object
 * carrying a 'fact' property. The discriminator is safe because the
 * fact-bearing schemas use 'fact' only in their provenance-carrying item
 * definitions (factualItem / truthClassifiedItem), and the shared envelope
 * defines no 'fact' property.
 *
 * Exported for direct unit testing.
 */
export function collectFactualItems(
  value: unknown,
  out: Record<string, unknown>[] = []
): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectFactualItems(item, out);
    }
    return out;
  }

  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>;
    if ('fact' in obj) {
      out.push(obj);
    }
    for (const child of Object.values(obj)) {
      collectFactualItems(child, out);
    }
  }

  return out;
}

/**
 * Whether one factualItem carries all six provenance columns, each present
 * and non-empty. `value` and `confidence` are deliberately untyped in the
 * canonical schemas, so presence (non-null, non-empty-string) is the
 * strongest check available without inventing a canonical type — which no
 * canonical document states.
 *
 * Exported for direct unit testing.
 */
export function hasCompleteProvenance(item: Record<string, unknown>): boolean {
  return REQUIRED_PROVENANCE_FIELDS.every(field => {
    const v = item[field];
    return v !== undefined && v !== null && !(typeof v === 'string' && v.trim().length === 0);
  });
}

/**
 * Production implementation of gates/ValidationContext.ValidationContext,
 * backed by ArtifactRepository (M2.3-A).
 *
 * IMPLEMENTS THE M2.2 INTERFACE WITHOUT MODIFYING IT: gates/ValidationContext.ts
 * says implementation is "deferred to future milestone" — this class is that
 * deferred implementation, arriving via composition (constructor injection
 * of ArtifactRepository) rather than any change to gates/ or state/.
 *
 * checkCondition SCOPE: Many condition names GateEvaluator asks about (via
 * the 27 GateCheckSpec.evaluate() calls across gates/checks/*.ts) describe
 * semantic or qualitative judgments — e.g. "is the business identity
 * unambiguous", "were facts fabricated", "was creative intent preserved" —
 * that cannot be derived from artifact SHAPE alone, and no canonical
 * document (04-SCHEMA/*, quality-gates.md) states a decision procedure for
 * them. Per schema-architecture.md section 5.1 ("a schema is a shape,
 * never a rule") and failure-routing.md section 1 rule 6 ("when root cause
 * is genuinely unclear, route to NEEDS_HUMAN_REVIEW rather than guessing"),
 * this class does not invent an answer for those conditions. It throws
 * ConditionContractUnresolvedError, which GateEvaluator (frozen) already
 * converts into a blocking CheckFailure carrying the error's message as the
 * failure reason — see GateEvaluator.evaluateChecks's try/catch. No change
 * to GateEvaluator was needed or made.
 *
 * A smaller set of conditions IS mechanically derivable purely from
 * persisted artifact existence or from fields whose presence and shape the
 * schema itself already guarantees on write (enforced by
 * ArtifactRepository.saveArtifact, which validates before persisting) —
 * those are answered directly below, grouped and commented by category.
 */
export class ProductionValidationContext implements ValidationContext {
  constructor(private repository: ArtifactRepository) {}

  async hasArtifact(projectId: string, type: GateArtifactType): Promise<boolean> {
    return this.repository.hasArtifact(projectId, toRepositoryArtifactType(type));
  }

  async checkCondition(
    projectId: string,
    condition: string,
    _params?: Record<string, unknown>
  ): Promise<boolean> {
    switch (condition) {
      // --- Category A: direct artifact existence -------------------------
      case 'business_research_exists':
        return this.hasArtifact(projectId, GateArtifactType.BUSINESS_RESEARCH);
      case 'business_intelligence_exists':
        return this.hasArtifact(projectId, GateArtifactType.BUSINESS_INTELLIGENCE);
      case 'asset_inventory_exists':
        return this.hasArtifact(projectId, GateArtifactType.ASSET_INVENTORY);
      case 'brand_profile_exists':
        return this.hasArtifact(projectId, GateArtifactType.BRAND_PROFILE);
      case 'design_blueprint_exists':
        return this.hasArtifact(projectId, GateArtifactType.DESIGN_BLUEPRINT);
      case 'implementation_report_exists':
        return this.hasArtifact(projectId, GateArtifactType.IMPLEMENTATION_REPORT);
      case 'critic_report_exists':
        return this.hasArtifact(projectId, GateArtifactType.CRITIC_REPORT);

      // --- Category B: mechanically derivable from persisted artifact
      // state, WITH integrity established first (MEDIUM-2 fix) -----------
      case 'all_facts_have_provenance': {
        // MEDIUM-2 FIX — this condition no longer trusts the write-time
        // guarantee (or the persisted JSON) blindly, and no longer answers
        // vacuous truth for missing artifacts:
        //
        //   1. A MISSING fact-bearing artifact is NOT success. Existence is
        //      separately asserted by the frozen M2.2 *_exists conditions
        //      (research_artifacts_exist checks all four), so no information
        //      is lost — but provenance cannot be claimed over facts that
        //      cannot be inspected.
        //   2. Every persisted CURRENT fact-bearing artifact must be
        //      re-established as integral before it is trusted: parseable
        //      JSON, schema-valid against its canonical 04-SCHEMA schema,
        //      and envelope-identity-consistent (projectId / artifactType /
        //      artifactVersion / artifactId match the manifest record).
        //      Corrupt or tampered files FAIL CLOSED (condition = false).
        //   3. Every factualItem must carry all six provenance columns;
        //      missing provenance => false.
        //
        // The condition returns true only when every fact-bearing artifact
        // exists, is proven integral, and every factual item carries full
        // provenance.
        for (const artifactType of FACT_BEARING_ARTIFACT_TYPES) {
          if (!(await this.repository.hasArtifact(projectId, artifactType))) {
            logger.warn('Provenance condition fails: fact-bearing artifact missing', {
              component: 'ProductionValidationContext',
              projectId,
              artifactType
            });
            return false;
          }

          const integrity = await this.repository.validateCurrentArtifact(
            projectId,
            artifactType
          );

          if (!integrity.valid) {
            logger.warn(
              'Provenance condition fails: persisted artifact failed integrity/schema ' +
                'validation',
              {
                component: 'ProductionValidationContext',
                projectId,
                artifactType,
                reason: integrity.reason
              }
            );
            return false;
          }

          const factualItems = collectFactualItems(integrity.document);
          for (const item of factualItems) {
            if (!hasCompleteProvenance(item)) {
              logger.warn(
                'Provenance condition fails: factualItem missing one or more provenance ' +
                  'fields',
                {
                  component: 'ProductionValidationContext',
                  projectId,
                  artifactType,
                  fact: item['fact']
                }
              );
              return false;
            }
          }
        }

        return true;
      }

      case 'critic_verdict_stated': {
        // M2.3-A BLOCKER-2 fix: this condition previously answered true from
        // artifact EXISTENCE alone, asserting a schema guarantee it never
        // checked. It now establishes full current-artifact integrity first —
        // manifest membership, file read, JSON parse, schema validation and
        // envelope identity (projectId, artifactType, artifactVersion,
        // artifactId) — and only then requires the VALIDATED payload to
        // actually contain a verdict. Any missing/corrupt/foreign/tampered
        // artifact fails closed (integrity invalid ⇒ condition false).
        const integrity = await this.repository.validateCurrentArtifact(
          projectId,
          ArtifactType.CRITIC_REPORT
        );
        if (!integrity.valid || !integrity.document) {
          return false;
        }
        const payload = integrity.document['payload'] as Record<string, unknown> | undefined;
        return typeof payload?.['verdict'] === 'string' && payload['verdict'].length > 0;
      }

      case 'critic_verdict_ship': {
        // M2.3-A BLOCKER-2 fix: this condition previously read the payload via
        // getCurrentArtifact, which establishes manifest membership and file
        // existence ONLY — no schema validation and no envelope identity
        // checks — so a tampered CRITIC_REPORT file with
        // payload.verdict = "SHIP" (manifest untouched) passed and could feed
        // Final Approval. It now trusts the payload only AFTER
        // validateCurrentArtifact has re-established integrity end to end,
        // and returns true only for verdict === 'SHIP'. Any
        // missing/corrupt/foreign/tampered artifact fails closed.
        const integrity = await this.repository.validateCurrentArtifact(
          projectId,
          ArtifactType.CRITIC_REPORT
        );
        if (!integrity.valid || !integrity.document) {
          return false;
        }
        const payload = integrity.document['payload'] as Record<string, unknown> | undefined;
        return payload?.['verdict'] === 'SHIP';
      }

      // --- Category C: semantic/qualitative judgment, no canonical
      // decision procedure exists — refuse to guess ------------------------
      default:
        throw new ConditionContractUnresolvedError(condition, projectId);
    }
  }
}
