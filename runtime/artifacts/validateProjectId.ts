import * as path from 'path';

/**
 * projectId / path-identity validation for M2.3-A — HIGH-1 fix (independent
 * audit finding: "Project isolation is not enforced on projectId before
 * filesystem path construction").
 *
 * EXACT VALIDATION RULE
 * ---------------------
 *   ^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$
 *
 * A valid projectId is a 1-128 character string that:
 *   - starts with an ASCII alphanumeric (this alone rejects '.', '..',
 *     hidden files like '.foo', absolute POSIX paths like '/etc', and
 *     absolute Windows paths like '\Windows'), and
 *   - contains only ASCII alphanumerics, '.', '_' and '-' (this rejects
 *     path separators '/' and '\', drive letters/colons 'C:\', UNC
 *     prefixes '\\server\share', whitespace, and every other character).
 *
 * Every filesystem path in the M2.3-A persistence layer is constructed from
 * a projectId (ArtifactStore, ManifestManager, ProcessWriteLock). All three
 * call validateProjectId() BEFORE path construction and
 * assertPathInsideWorkspace() on the constructed path, so no traversal or
 * absolute-path escape can reach the filesystem. ProcessWriteLock lock paths
 * use the same validated project identity — the validator is the single
 * source of truth for all of them.
 *
 * Invalid IDs fail CLOSED: the error is thrown before any filesystem side
 * effect (no directory is created, no lock file is touched, nothing is
 * written), including before ProcessWriteLock.acquire's mkdir.
 */

/**
 * A projectId matching this pattern can never escape the workspace: it
 * cannot contain path separators, cannot be '.' or '..', cannot start with
 * a separator or dot (so no absolute paths), and cannot contain a colon
 * (so no Windows drive letters) or whitespace.
 */
export const PROJECT_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

/**
 * Error thrown when a projectId fails validation, or when a constructed
 * path fails workspace-containment (defense in depth).
 */
export class InvalidProjectIdError extends Error {
  public readonly projectId: unknown;

  constructor(projectId: unknown, reason?: string) {
    super(
      reason ??
        `Invalid projectId: ${
          typeof projectId === 'string' ? JSON.stringify(projectId) : String(projectId)
        }. Project ids must match ${PROJECT_ID_PATTERN.source} ` +
        `(1-128 characters, starting with an ASCII alphanumeric; only ` +
        `alphanumerics, '.', '_' and '-' are allowed — no path separators, ` +
        `drive letters, whitespace, or leading dots).`
    );
    this.name = 'InvalidProjectIdError';
    this.projectId = projectId;
  }
}

/**
 * Error thrown when an artifact version number is not a positive safe
 * integer. Version numbers are interpolated into filenames (v{version}.json),
 * so non-integers (NaN, 1.5, Infinity) and non-positive values are rejected
 * before any path is built.
 */
export class InvalidArtifactVersionError extends Error {
  public readonly version: unknown;

  constructor(version: unknown) {
    super(
      `Invalid artifact version: ${String(version)}. Artifact versions must ` +
        `be positive safe integers (>= 1).`
    );
    this.name = 'InvalidArtifactVersionError';
    this.version = version;
  }
}

/**
 * Validate a projectId, throwing InvalidProjectIdError on any violation.
 * Returns the validated string on success.
 */
export function validateProjectId(projectId: unknown): string {
  if (typeof projectId !== 'string' || !PROJECT_ID_PATTERN.test(projectId)) {
    throw new InvalidProjectIdError(projectId);
  }
  return projectId;
}

/**
 * Validate an artifact version number, throwing InvalidArtifactVersionError
 * unless it is a positive safe integer. Returns the validated number.
 */
export function validateArtifactVersion(version: unknown): number {
  if (typeof version !== 'number' || !Number.isSafeInteger(version) || version < 1) {
    throw new InvalidArtifactVersionError(version);
  }
  return version;
}

/**
 * Defense in depth: assert that a fully-constructed path resolves INSIDE
 * the workspace root. Given the projectId regex this can only fire if the
 * workspaceRoot itself is misconfigured, but the persistence layer must not
 * trust that silently (path traversal / absolute-path escape from workspace
 * is the exact risk HIGH-1 closes).
 *
 * Returns the candidate unchanged on success.
 */
export function assertPathInsideWorkspace(candidate: string, workspaceRoot: string): string {
  const resolvedCandidate = path.resolve(candidate);
  const resolvedRoot = path.resolve(workspaceRoot);
  const rootWithSeparator = resolvedRoot.endsWith(path.sep)
    ? resolvedRoot
    : resolvedRoot + path.sep;

  if (resolvedCandidate !== resolvedRoot && !resolvedCandidate.startsWith(rootWithSeparator)) {
    throw new InvalidProjectIdError(
      null,
      `Path containment violation: resolved path ${resolvedCandidate} is outside ` +
        `the workspace root ${resolvedRoot}. Refusing to touch the filesystem.`
    );
  }

  return candidate;
}