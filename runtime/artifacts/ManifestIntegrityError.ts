/**
 * Error thrown when the artifact manifest for a project is malformed,
 * structurally invalid, or inconsistent with the version files it
 * references — M2.3-A HIGH-2 fix (independent audit finding: crash/orphan
 * state is not reconciled and does not fail closed).
 *
 * POLICY: the manifest IS the authoritative record for M2.3-A artifact
 * persistence (ManifestManager header). Whenever persisted state cannot be
 * proven consistent with it — unparseable manifest JSON, structural
 * violations (not exactly one CURRENT per type, currentVersion without a
 * matching entry, unknown artifact-type keys, projectId mismatch), recorded
 * versions whose files are missing, or orphan version files whose content
 * contradicts their own path identity — every affected operation fails
 * closed with this error rather than guessing, silently repairing, or
 * serving data that cannot be proven correct.
 *
 * This mirrors the codebase's established fail-closed precedent for
 * corrupted authoritative records (M2.1's TransactionLog FATAL on invalid
 * record structure).
 */
export class ManifestIntegrityError extends Error {
  public readonly projectId: string;

  /** Human-readable description of the exact integrity violation. */
  public readonly detail: string;

  constructor(projectId: string, detail: string) {
    super(
      `Manifest integrity violation for project ${projectId}: ${detail}. ` +
        `Failing closed: the manifest is the authoritative record for artifact ` +
        `persistence, and the inconsistency must be resolved before artifact ` +
        `operations can proceed.`
    );
    this.name = 'ManifestIntegrityError';
    this.projectId = projectId;
    this.detail = detail;
  }
}