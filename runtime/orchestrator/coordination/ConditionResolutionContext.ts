/**
 * Condition resolution decorator for M2.3-B.
 *
 * WHAT THIS IS
 * ------------
 * A `ValidationContext` DECORATOR, not a replacement. It answers only the small
 * set of M2.2 gate conditions that a canonical document actually supports a
 * decision procedure for, and DELEGATES every other call — including every
 * unresolved condition — unchanged to the inner context.
 *
 * WHY IT EXISTS
 * -------------
 * `02-CONTROL-PLANE/gate-conditions.md` records, for each of the 27 gate
 * conditions, what could establish it and whether a canonical decision
 * procedure exists. 17 of the 27 have none: they are judgements about meaning
 * ("is the business unambiguously identified", "were facts fabricated") that no
 * canonical document reduces to a decision procedure over artifact shape. Per
 * `failure-routing.md` §1 rule 6 an unclear question routes to human review
 * rather than being guessed at, so those conditions must keep raising
 * `ConditionContractUnresolvedError` and the gate must keep failing closed.
 *
 * This decorator therefore resolves ONLY conditions whose deciding fact is
 * fixed by a canonical schema; everything else passes straight through.
 *
 * FROZEN BOUNDARY
 * ---------------
 * `runtime/artifacts/ProductionValidationContext.ts`, `runtime/gates/*` and
 * `runtime/state/*` are untouched. Resolution arrives purely by composition —
 * the pattern already established by `ProductionValidationContext` implementing
 * `gates/ValidationContext.ts`'s "deferred to future milestone" interface.
 *
 * NOT WIRED INTO PRODUCTION
 * -------------------------
 * Nothing in M2.3-B constructs this class outside its tests. Production gate
 * evaluation continues to use `ProductionValidationContext` directly, so
 * production condition behaviour — and the all-six-gates-fail-closed fact
 * pinned by `runtime/tests/ProductionWiring.test.ts` — is unchanged.
 *
 * M2.3-B Milestone: Seam 1, gate condition contracts, human approval/resume.
 * Factory version: 0.2.0
 */

import { ArtifactType as GateArtifactType } from '../../gates/GateTypes';
import { ValidationContext } from '../../gates/ValidationContext';
import { ArtifactRepository } from '../../artifacts/ArtifactRepository';
import { ArtifactType } from '../../artifacts/ArtifactTypes';
import { logger } from '../../logging/Logger';

/**
 * The minimum length canon fixes for the Design Intent Statement.
 *
 * Source: `04-SCHEMA/creative-direction.schema.json` declares
 * `designIntentStatement` as `{"type": "string", "minLength": 10}` and lists it
 * in the artifact's root `required` array. This number is READ FROM CANON, not
 * chosen here — changing it without changing the schema would make this
 * decorator disagree with the artifact contract.
 */
export const MIN_DESIGN_INTENT_STATEMENT_LENGTH = 10;

/**
 * The conditions this decorator resolves. Every other condition — resolved or
 * unresolved — is delegated to the inner context untouched.
 *
 * Exactly one entry, and it is expected to stay small: each entry is a claim
 * that a canonical document supports a decision procedure. Adding an entry is a
 * contract change (gate-conditions.md §4 rule 4).
 */
export const RESOLVED_CONDITIONS: readonly string[] = [
  'creative_design_intent_statement_present'
];

/**
 * Guard for callers that want to be explicit about which conditions this
 * decorator claims to resolve. Kept next to RESOLVED_CONDITIONS so the two
 * cannot drift; a condition outside this set is always the inner context's.
 */
export function isResolvedByDecorator(condition: string): boolean {
  return RESOLVED_CONDITIONS.includes(condition);
}

export class ConditionResolutionContext implements ValidationContext {
  constructor(
    private readonly inner: ValidationContext,
    private readonly repository: ArtifactRepository
  ) {}

  /** Delegated unchanged: this decorator adds no artifact-existence rule. */
  async hasArtifact(projectId: string, type: GateArtifactType): Promise<boolean> {
    return this.inner.hasArtifact(projectId, type);
  }

  async checkCondition(
    projectId: string,
    condition: string,
    params?: Record<string, unknown>
  ): Promise<boolean> {
    switch (condition) {
      case 'creative_design_intent_statement_present':
        return this.designIntentStatementPresent(projectId);

      default:
        // Not this decorator's business. The inner context's own behaviour
        // applies — including raising ConditionContractUnresolvedError for a
        // condition with no canonical decision procedure. That is the point:
        // this class must never turn an unresolved condition into a boolean.
        return this.inner.checkCondition(projectId, condition, params);
    }
  }

  /**
   * `creative_design_intent_statement_present` (quality-gates.md §4.1 row 2,
   * with artifact-contracts.md §5.10 and §6 invariant 7).
   *
   * CANONICAL BASIS: the Design Intent Statement is authored in the Creative
   * Direction artifact, and `04-SCHEMA/creative-direction.schema.json` requires
   * `designIntentStatement` as a string of at least 10 characters. A schema-valid
   * Creative Direction artifact therefore necessarily carries it, so the
   * condition is decidable structurally.
   *
   * FAIL CLOSED: integrity is re-established first (manifest membership, file
   * read, JSON parse, schema validation, envelope identity). A missing, corrupt,
   * foreign or tampered artifact yields false — never a vacuous true.
   *
   * NO INVENTED RULE: the length test mirrors the schema's own `minLength`
   * exactly. A whitespace-only value satisfies the schema and is accepted here;
   * rejecting it would be a NEW rule with no canonical support, so it is
   * deliberately not added (gate-conditions.md §4 rules 2 and 5).
   */
  private async designIntentStatementPresent(projectId: string): Promise<boolean> {
    const integrity = await this.repository.validateCurrentArtifact(
      projectId,
      ArtifactType.CREATIVE_DIRECTION
    );

    if (!integrity.valid || !integrity.document) {
      logger.warn(
        'Design Intent Statement condition fails: Creative Direction artifact ' +
          'failed integrity/schema validation',
        {
          component: 'ConditionResolutionContext',
          projectId,
          condition: 'creative_design_intent_statement_present',
          reason: integrity.reason
        }
      );
      return false;
    }

    const statement = integrity.document['designIntentStatement'];
    if (
      typeof statement !== 'string' ||
      statement.length < MIN_DESIGN_INTENT_STATEMENT_LENGTH
    ) {
      logger.warn(
        'Design Intent Statement condition fails: statement absent or below the ' +
          'canonical minimum length',
        {
          component: 'ConditionResolutionContext',
          projectId,
          condition: 'creative_design_intent_statement_present',
          minLength: MIN_DESIGN_INTENT_STATEMENT_LENGTH,
          actualType: typeof statement
        }
      );
      return false;
    }

    return true;
  }
}