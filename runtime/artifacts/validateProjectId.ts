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
 *   PLUS the Windows-identity hardening rules (in order, all enforced):
 *
 *   1. Safe-character pattern (above): 1-128 characters, starting with an
 *      ASCII alphanumeric, containing only ASCII alphanumerics, '.', '_' and
 *      '-'. This alone rejects path separators '/' and '\', drive letters
 *      'C:\', UNC prefixes '\\server\share', whitespace, and every other
 *      character, as well as '.', '..', hidden files like '.foo', absolute
 *      POSIX paths like '/etc' and absolute Windows paths like '\Windows'.
 *
 *   2. Lowercase-only: the submitted id must already be lowercase. NTFS and
 *      FAT are case-insensitive, so 'Foo' and 'foo' would collide into ONE
 *      directory carrying TWO distinct project identities. The factory
 *      NEVER silently transforms a submitted identity (reject, don't
 *      rewrite — failure-routing.md rule: never guess); 'MyProject' is
 *      rejected with an explanation to resubmit as 'myproject'. This also
 *      makes the accepted set collision-free on case-SENSITIVE filesystems,
 *      so behavior is identical on Windows and POSIX.
 *
 *   3. No trailing dot: Windows path resolution strips trailing dots, so
 *      'abc.' and 'abc...' would resolve to the same directory as 'abc'.
 *      Rejected outright rather than normalized.
 *
 *   4. No Windows reserved device names: the segment before the first dot
 *      may not be CON, PRN, AUX, NUL, COM1..COM9, LPT1..LPT9, CONIN$ or
 *      CONOUT$. Windows treats these as devices regardless of extension
 *      ('NUL.json' is reserved too); mkdir would fail with an obscure errno
 *      on Windows while SUCCEEDING on POSIX, so they are rejected for
 *      portability and error quality.
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
 * Windows reserved device names. The segment of the projectId before the
 * first dot may not be one of these: Windows treats them as devices even
 * with an extension ('NUL.json', 'CON.txt'), so a directory named with one
 * would fail with an obscure errno on Windows while succeeding on POSIX.
 * Checked against the UPPERCASED segment because 'nul' is reserved too.
 */
export const WINDOWS_RESERVED_DEVICE_NAMES: ReadonlySet<string> = new Set([
  'CON',
  'PRN',
  'AUX',
  'NUL',
  'COM1',
  'COM2',
  'COM3',
  'COM4',
  'COM5',
  'COM6',
  'COM7',
  'COM8',
  'COM9',
  'LPT1',
  'LPT2',
  'LPT3',
  'LPT4',
  'LPT5',
  'LPT6',
  'LPT7',
  'LPT8',
  'LPT9',
  'CONIN$',
  'CONOUT$'
]);

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
        }. Project ids must be lowercase and match ${PROJECT_ID_PATTERN.source} ` +
        `(1-128 characters, starting with an ASCII alphanumeric; only ` +
        `lowercase alphanumerics, '.', '_' and '-' are allowed — no path separators, ` +
        `drive letters, whitespace, or leading dots). Uppercase letters, ` +
        `trailing dots and Windows reserved device names (CON, NUL, COM1…) ` +
        `are rejected because Windows filesystems are case-insensitive and ` +
        `strip trailing dots, which would silently collide distinct project ` +
        `identities. The submitted identity is never transformed.`
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

  // Windows-identity hardening. All checks fire BEFORE any filesystem side
  // effect; nothing here transforms the submitted identity — ambiguity is
  // rejected, never rewritten.
  if (projectId !== projectId.toLowerCase()) {
    throw new InvalidProjectIdError(
      projectId,
      `Invalid projectId ${JSON.stringify(projectId)}: uppercase letters are ` +
        `not accepted. Windows filesystems are case-insensitive, so 'Foo' and ` +
        `'foo' would silently collide into the same directory. Resubmit the id ` +
        `in lowercase (e.g. 'myproject'); the submitted identity is never ` +
        `transformed.`
    );
  }

  if (projectId.endsWith('.')) {
    throw new InvalidProjectIdError(
      projectId,
      `Invalid projectId ${JSON.stringify(projectId)}: trailing dots are not ` +
        `accepted. Windows path resolution strips trailing dots, so 'abc.' ` +
        `would silently collide with 'abc'.`
    );
  }

  const firstSegment = projectId.split('.')[0].toUpperCase();
  if (WINDOWS_RESERVED_DEVICE_NAMES.has(firstSegment)) {
    throw new InvalidProjectIdError(
      projectId,
      `Invalid projectId ${JSON.stringify(projectId)}: '${firstSegment}' is a ` +
        `Windows reserved device name (reserved even with an extension, e.g. ` +
        `'NUL.json') and is rejected so project directories behave identically ` +
        `on Windows and POSIX.`
    );
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