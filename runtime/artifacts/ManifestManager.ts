import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../logging/Logger';
import {
  ArtifactType,
  ManifestTypeState,
  ManifestVersionEntry,
  ProjectManifest,
  VersionStatus
} from './ArtifactTypes';
import { assertPathInsideWorkspace, validateProjectId } from './validateProjectId';
import { ManifestIntegrityError } from './ManifestIntegrityError';

/**
 * Matches the stale temporary files both persistence writers leave behind
 * if the process crashes between writeFile and rename
 * (`{name}.tmp-{pid}-{timestamp}`). See ArtifactStore.writeVersion and
 * ManifestManager.write. Exported for ArtifactRepository's reconciliation
 * cleanup (HIGH-2).
 */
export const TEMP_FILE_PATTERN = /\.tmp-\d+-\d+$/;

/**
 * Manages the per-project artifact version manifest.
 *
 * Manifest file: projects/{projectId}/artifacts/manifest.json
 *
 * Tracks, per artifact type, every version ever written and which one is
 * CURRENT, per versioning.md section 6.2 rule 1: "exactly one CURRENT per
 * project and artifact type". Mirrors the M2.1 state layer's
 * projection-derived-from-log pattern in spirit (StateStore/ProjectionBuilder)
 * but the manifest here IS the authoritative record for M2.3-A — there is
 * no separate write-ahead log for artifacts in this milestone's scope.
 *
 * Distinct from state/ProjectLock.ts and state/StateStore.ts: those are
 * M2.1 (frozen) and govern project STATE, not artifact persistence. This
 * class is new M2.3-A code and does not modify or depend on the M2.1
 * classes' internals.
 *
 * PATH SAFETY (HIGH-1 fix): the manifest path is constructed from a
 * validated projectId (validateProjectId) and asserted to resolve inside
 * the workspace root (assertPathInsideWorkspace) — see validateProjectId.ts.
 *
 * FAIL CLOSED (HIGH-2 fix): read() no longer trusts manifest.json blindly.
 * An unparseable manifest or one failing structural validation (projectId
 * identity, known artifact-type keys, per-type exactly-one-CURRENT,
 * currentVersion resolving to a CURRENT entry, well-formed version entries)
 * throws ManifestIntegrityError instead of returning unusable data. A
 * MISSING manifest file remains a valid fresh-project state.
 */
export class ManifestManager {
  private workspaceRoot: string;

  constructor(workspaceRoot: string = './projects') {
    this.workspaceRoot = workspaceRoot;
  }

  private getManifestPath(projectId: string): string {
    validateProjectId(projectId);
    const manifestPath = path.join(this.workspaceRoot, projectId, 'artifacts', 'manifest.json');
    return assertPathInsideWorkspace(manifestPath, this.workspaceRoot);
  }

  /**
   * Read the manifest for a project.
   *
   * Returns an empty manifest (no artifact types recorded) if none exists
   * yet — a project with no artifacts persisted is a valid, expected state.
   *
   * FAIL CLOSED (HIGH-2): a manifest that exists but cannot be parsed, or
   * that fails structural validation, throws ManifestIntegrityError rather
   * than returning data whose integrity cannot be established.
   */
  async read(projectId: string): Promise<ProjectManifest> {
    validateProjectId(projectId);
    const manifestPath = this.getManifestPath(projectId);

    if (!fs.existsSync(manifestPath)) {
      return { projectId, artifacts: {} };
    }

    const content = await fs.promises.readFile(manifestPath, 'utf-8');

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch (error) {
      throw new ManifestIntegrityError(
        projectId,
        `manifest.json is not valid JSON (${(error as Error).message})`
      );
    }

    this.validateManifestStructure(parsed, projectId);
    return parsed as ProjectManifest;
  }

  /**
   * Structural validation of a parsed manifest document (HIGH-2).
   *
   * Enforces the invariants the M2.3-A write path guarantees:
   *   - the document is a JSON object whose projectId matches the requested
   *     project (identity check — a foreign manifest must never be served);
   *   - every key of `artifacts` is a known ArtifactType value;
   *   - each type state has well-formed version entries, no duplicates,
   *     exactly one CURRENT (when any exist), and a currentVersion that
   *     resolves to that CURRENT entry.
   *
   * Throws ManifestIntegrityError on the first violation; void on success.
   */
  validateManifestStructure(manifest: unknown, expectedProjectId: string): void {
    // NOTE: the variable (not just the arrow) carries the explicit function
    // type so TypeScript's control-flow analysis honours `fail()` as a
    // never-returning call when narrowing `unknown` fields below.
    const fail: (detail: string) => never = detail => {
      throw new ManifestIntegrityError(expectedProjectId, detail);
    };

    if (typeof manifest !== 'object' || manifest === null || Array.isArray(manifest)) {
      fail('manifest is not a JSON object');
    }

    const m = manifest as Record<string, unknown>;

    if (m.projectId !== expectedProjectId) {
      fail(
        `manifest projectId ${JSON.stringify(m.projectId)} does not match requested ` +
          `project ${JSON.stringify(expectedProjectId)}`
      );
    }

    if (typeof m.artifacts !== 'object' || m.artifacts === null || Array.isArray(m.artifacts)) {
      fail('manifest.artifacts is not an object');
    }

    const validTypeValues = new Set<string>(Object.values(ArtifactType));
    const validStatusValues = new Set<string>(Object.values(VersionStatus));

    for (const [typeKey, stateUnknown] of Object.entries(m.artifacts as Record<string, unknown>)) {
      if (!validTypeValues.has(typeKey)) {
        fail(`manifest.artifacts contains unknown artifact type key ${JSON.stringify(typeKey)}`);
      }

      if (
        typeof stateUnknown !== 'object' ||
        stateUnknown === null ||
        Array.isArray(stateUnknown)
      ) {
        fail(`manifest.artifacts[${typeKey}] is not an object`);
      }

      const state = stateUnknown as Record<string, unknown>;
      const currentVersion = state['currentVersion'];
      const versions = state['versions'];

      if (
        currentVersion !== null &&
        (typeof currentVersion !== 'number' ||
          !Number.isSafeInteger(currentVersion) ||
          currentVersion < 1)
      ) {
        fail(
          `manifest.artifacts[${typeKey}].currentVersion must be null or a positive integer`
        );
      }

      if (!Array.isArray(versions)) {
        fail(`manifest.artifacts[${typeKey}].versions is not an array`);
      }

      const seenVersions = new Set<number>();
      let currentCount = 0;

      for (const entryUnknown of versions as unknown[]) {
        if (
          typeof entryUnknown !== 'object' ||
          entryUnknown === null ||
          Array.isArray(entryUnknown)
        ) {
          fail(`manifest.artifacts[${typeKey}].versions contains a non-object entry`);
        }

        const entry = entryUnknown as Record<string, unknown>;
        const version = entry['version'];
        const status = entry['status'];
        const artifactId = entry['artifactId'];
        const writtenAt = entry['writtenAt'];

        if (typeof version !== 'number' || !Number.isSafeInteger(version) || version < 1) {
          fail(
            `manifest.artifacts[${typeKey}] contains a version entry whose version is not ` +
              `a positive integer: ${JSON.stringify(version)}`
          );
        }

        if (seenVersions.has(version)) {
          fail(`manifest.artifacts[${typeKey}] contains duplicate version ${version}`);
        }
        seenVersions.add(version);

        if (typeof status !== 'string' || !validStatusValues.has(status)) {
          fail(
            `manifest.artifacts[${typeKey}] v${version} has invalid versionStatus ` +
              `${JSON.stringify(status)}`
          );
        }

        if (typeof artifactId !== 'string' || artifactId.length === 0) {
          fail(`manifest.artifacts[${typeKey}] v${version} has an empty or missing artifactId`);
        }

        if (typeof writtenAt !== 'string' || writtenAt.length === 0) {
          fail(`manifest.artifacts[${typeKey}] v${version} has an empty or missing writtenAt`);
        }

        if (status === VersionStatus.CURRENT) {
          currentCount++;
        }
      }

      if (seenVersions.size > 0 && currentCount !== 1) {
        fail(
          `manifest.artifacts[${typeKey}] must record exactly one CURRENT version when any ` +
            `versions exist, found ${currentCount}`
        );
      }

      if (seenVersions.size === 0 && currentVersion !== null) {
        fail(
          `manifest.artifacts[${typeKey}].currentVersion is set but the versions array is empty`
        );
      }

      if (currentVersion !== null) {
        const currentEntry = (versions as Record<string, unknown>[]).find(
          e => e['version'] === currentVersion
        );
        if (!currentEntry) {
          fail(
            `manifest.artifacts[${typeKey}].currentVersion ${currentVersion} has no matching ` +
              `entry in versions`
          );
        } else if (currentEntry['status'] !== VersionStatus.CURRENT) {
          fail(
            `manifest.artifacts[${typeKey}].currentVersion ${currentVersion} points at an ` +
              `entry whose status is ${JSON.stringify(currentEntry['status'])}, not CURRENT`
          );
        }
      }
    }
  }

  /**
   * Write the manifest for a project.
   *
   * Caller is responsible for holding the appropriate write lock
   * (ProcessWriteLock) around read-modify-write sequences; this method
   * performs a single atomic-enough write (write to temp file, then rename)
   * to avoid leaving a half-written manifest.json on crash.
   */
  async write(projectId: string, manifest: ProjectManifest): Promise<void> {
    const manifestPath = this.getManifestPath(projectId);
    const dir = path.dirname(manifestPath);

    await fs.promises.mkdir(dir, { recursive: true });

    const tempPath = `${manifestPath}.tmp-${process.pid}-${Date.now()}`;
    const content = JSON.stringify(manifest, null, 2);

    await fs.promises.writeFile(tempPath, content, 'utf-8');
    await fs.promises.rename(tempPath, manifestPath);

    logger.debug('Manifest written', {
      component: 'ManifestManager',
      projectId,
      artifactTypes: Object.keys(manifest.artifacts)
    });
  }

  /**
   * Record a new version for an artifact type.
   *
   * The new version is always recorded as CURRENT. If a prior CURRENT
   * version exists for this artifact type, it is transitioned to
   * SUPERSEDED, per versioning.md section 6.2 rule 1 (exactly one CURRENT
   * per project and artifact type). HISTORICAL is not assigned here: per
   * section 6.2, HISTORICAL applies to versions "retained as part of a
   * delivered record" — a delivery-time transition outside this milestone's
   * scope, not a write-time transition.
   *
   * Returns the updated manifest. Does not persist it — call write()
   * separately, inside the same lock scope as the artifact file write.
   */
  recordNewVersion(
    manifest: ProjectManifest,
    artifactType: ArtifactType,
    artifactId: string,
    version: number
  ): ProjectManifest {
    const existing: ManifestTypeState = manifest.artifacts[artifactType] ?? {
      currentVersion: null,
      versions: []
    };

    const updatedVersions: ManifestVersionEntry[] = existing.versions.map(v =>
      v.status === VersionStatus.CURRENT ? { ...v, status: VersionStatus.SUPERSEDED } : v
    );

    const newEntry: ManifestVersionEntry = {
      version,
      status: VersionStatus.CURRENT,
      artifactId,
      writtenAt: new Date().toISOString()
    };

    updatedVersions.push(newEntry);

    return {
      ...manifest,
      artifacts: {
        ...manifest.artifacts,
        [artifactType]: {
          currentVersion: version,
          versions: updatedVersions
        }
      }
    };
  }

  /**
   * Adopt an orphaned version file into the manifest (HIGH-2 reconciliation).
   *
   * An orphan is a version file that exists on disk but has no manifest
   * entry — the state a crash between the version-file write and the
   * manifest write leaves behind. Adoption COMPLETES the crashed commit:
   * the adopted entry becomes CURRENT if it is the highest version recorded
   * for the type (superseding the prior CURRENT, exactly like
   * recordNewVersion); if a higher version is already recorded, the adopted
   * entry is recorded as SUPERSEDED so the exactly-one-CURRENT invariant is
   * preserved. The version allocation chain therefore remains correct after
   * a restart: getNextVersion accounts for adopted orphans.
   *
   * Does not persist — the caller writes the manifest inside the same lock.
   */
  adoptVersion(
    manifest: ProjectManifest,
    artifactType: ArtifactType,
    artifactId: string,
    version: number,
    writtenAt: string
  ): ProjectManifest {
    const existing: ManifestTypeState = manifest.artifacts[artifactType] ?? {
      currentVersion: null,
      versions: []
    };

    const maxExisting = existing.versions.reduce((max, v) => Math.max(max, v.version), 0);
    const adoptedStatus =
      version > maxExisting ? VersionStatus.CURRENT : VersionStatus.SUPERSEDED;

    const versions: ManifestVersionEntry[] = existing.versions.map(v =>
      adoptedStatus === VersionStatus.CURRENT && v.status === VersionStatus.CURRENT
        ? { ...v, status: VersionStatus.SUPERSEDED }
        : v
    );

    versions.push({
      version,
      status: adoptedStatus,
      artifactId,
      writtenAt
    });

    return {
      ...manifest,
      artifacts: {
        ...manifest.artifacts,
        [artifactType]: {
          currentVersion:
            adoptedStatus === VersionStatus.CURRENT ? version : existing.currentVersion,
          versions
        }
      }
    };
  }

  /**
   * Compute the next version number for an artifact type.
   *
   * Project artifacts use simple incrementing iteration numbers starting
   * at 1, per versioning.md section 4 / envelope definitions.
   * projectArtifactVersion ("minimum": 1).
   */
  getNextVersion(manifest: ProjectManifest, artifactType: ArtifactType): number {
    const state = manifest.artifacts[artifactType];
    if (!state || state.versions.length === 0) {
      return 1;
    }
    return Math.max(...state.versions.map(v => v.version)) + 1;
  }

  /**
   * Get the CURRENT version entry for an artifact type, or null if none
   * has ever been written.
   */
  getCurrentVersion(
    manifest: ProjectManifest,
    artifactType: ArtifactType
  ): ManifestVersionEntry | null {
    const state = manifest.artifacts[artifactType];
    if (!state || state.currentVersion === null) {
      return null;
    }
    return state.versions.find(v => v.version === state.currentVersion) ?? null;
  }

  /**
   * Whether any version of this artifact type has ever been written for
   * the project.
   */
  hasArtifact(manifest: ProjectManifest, artifactType: ArtifactType): boolean {
    const state = manifest.artifacts[artifactType];
    return !!state && state.currentVersion !== null;
  }
}
