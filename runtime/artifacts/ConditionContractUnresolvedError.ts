/**
 * Error thrown when a gate condition has no canonically-derivable resolution.
 *
 * M2.3-A scope note:
 * Many condition names checked by M2.2's GateCheckSpec.evaluate() (via
 * ValidationContext.checkCondition) describe a SEMANTIC or QUALITATIVE
 * judgment (e.g. "is the business identity unambiguous", "were facts
 * fabricated", "is composition complete") that cannot be derived from
 * artifact SHAPE alone. Per schema-architecture.md section 5.1, "a schema
 * is a shape, never a rule" — JSON Schema validation on write can guarantee
 * required fields are present and well-formed, but it cannot decide content
 * questions no canonical document defines a decision procedure for.
 *
 * Per failure-routing.md §1 rule 6 ("When root cause is genuinely unclear,
 * route to NEEDS_HUMAN_REVIEW rather than guessing"), ProductionValidationContext
 * does not invent a boolean answer for these conditions. It throws this error
 * instead. GateEvaluator (frozen, M2.2) already catches exceptions thrown from
 * a check's evaluate() function and converts them into a blocking CheckFailure
 * with the error message as the reason (see GateEvaluator.evaluateChecks) —
 * so this integrates with the frozen M2.2 runtime without any modification to it.
 */
export class ConditionContractUnresolvedError extends Error {
  public readonly condition: string;
  public readonly projectId: string;

  constructor(condition: string, projectId: string, reason?: string) {
    const message = reason
      ? `Condition '${condition}' has no canonically-derivable resolution for project ${projectId}: ${reason}`
      : `Condition '${condition}' has no canonically-derivable resolution for project ${projectId}. ` +
        `This condition requires semantic or qualitative judgment that cannot be derived from artifact shape alone.`;

    super(message);
    this.name = 'ConditionContractUnresolvedError';
    this.condition = condition;
    this.projectId = projectId;
  }
}
