import * as fs from 'fs';
import * as path from 'path';
import { ArtifactStore } from './ArtifactStore';
import { ManifestManager, TEMP_FILE_PATTERN } from './ManifestManager';
import { SchemaValidator, SchemaValidationResult } from './SchemaValidator';
import { ProcessWriteLock } from './ProcessWriteLock';
import {
  ArtifactDocument,
  ArtifactType,
  ProjectManifest,
  VersionStatus
} from './ArtifactTypes';
import {
  assertPathInsideWorkspace,
  validateArtifactVersion,
  validateProjectId
} from './validateProjectId';
import { ManifestIntegrityError } from './ManifestIntegrityError';
import { logger } from '../logging/Logger';

/**
 * Integrity verdict for a persisted CURRENT artifact, returned by
 * validateCurrentArtifact (MEDIUM-2 fix: the persistence layer re-establishes
 * artifact integrity — parseability, schema validity, envelope identity —
 * before callers answer content-derived conditions such as
 * 'all_facts_have_provenance').
 */
export interface CurrentArtifactIntegrity {
  valid: boolean;
  /** Present when valid === false: the exact reason integrity failed. */
  reason?: string;
  /** Present when valid === true: the validated CURRENT document. */
  document?: ArtifactDocument;
}

/**
 * How reconciliation disposes of one orphan version file (HIGH-2):
 *   - adopt: schema-valid, identity-consistent → complete the crashed commit
 *   - delete: unrecoverable garbage (unparseable / schema-invalid) that was
 *     never committed and never observable through any read path
 *   - fail: ambiguous (schema-valid but identity-contradicting) → fail closed
 *   - skip: vanished before reconciliation could inspect it
 */
type OrphanDisposition =
  | { action: 'adopt'; artifactId: string }
  | { action: 'delete'; reason: string }
  | { action: 'fail'; reason: string }
  | { action: 'skip' };

/**
 * Error thrown when an artifact document fails schema validation.
 *
 * Per schema-architecture.md section 5.1, "a schema is a shape, never a
 * rule: it may make a violation detectable, it does not decide the
 * consequence." ArtifactRepository's consequence for a detected shape
 * violation is refusal to persist — the caller must fix the document.
 */
export class ArtifactValidationError extends Error {
  public readonly artifactType: ArtifactType;
  public readonly validationResult: SchemaValidationResult;

  constructor(artifactType: ArtifactType, result: SchemaValidationResult) {
    const summary = result.errors
      .map(e => `${e.path}: ${e.message}`)
      .join('; ');
    super(`Artifact ${artifactType} failed schema validation: ${summary}`);
    this.name = 'ArtifactValidationError';
    this.artifactType = artifactType;
    this.validationResult = result;
  }
}

/**
 * Public API for artifact persistence — M2.3-A.
 *
 * Composes:
 * - SchemaValidator: validates a document's shape before it is ever
 *   written to disk (schemas are enforced on write, per schema-
 *   architecture.md section 5.1 — a schema does not enforce itself, so
 *   this repository is the enforcement point).
 * - ManifestManager: tracks version numbers and CURRENT/SUPERSEDED status
 *   per artifact type.
 * - ArtifactStore: the actual file read/write.
 * - ProcessWriteLock: serializes read-modify-write sequences (manifest
 *   read -> compute next version -> write artifact file -> write manifest)
 *   against concurrent writers for the same project, mirroring the
 *   concurrency-safety discipline of M2.1's ProjectLock/TransactionLog
 *   without sharing their lock file or log.
 *
 * This class does not implement gates/ValidationContext.ValidationContext
 * itself — ProductionValidationContext does, and depends on this
 * repository as its artifact-existence data source.
 *
 * PROJECT ISOLATION (HIGH-1 fix): every public method validates projectId
 * (and, where taken, the artifact version) BEFORE any filesystem or lock
 * side effect — see validateProjectId.ts. Path construction in ArtifactStore,
 * ManifestManager and ProcessWriteLock validates again at the choke point.
 *
 * CRASH/ORPHAN RECONCILIATION (HIGH-2 fix): saveArtifact runs reconcile()
 * inside the write lock before allocating a version. Reconciliation:
 *   1. removes stale *.tmp-{pid}-{ts} files from interrupted writes;
 *   2. reads the manifest FAIL-CLOSED (malformed → ManifestIntegrityError);
 *   3. verifies every manifest-recorded version file exists (missing → fail
 *      closed — data loss is never papered over);
 *   4. disposes of orphan version files: schema-valid + identity-consistent
 *      orphans are ADOPTED into the manifest (completing the crashed
 *      commit, so version allocation stays correct after restart);
 *      unparseable or schema-invalid orphans are DELETED (never committed,
 *      never observable through any read path); schema-valid orphans whose
 *      envelope identity contradicts their path FAIL CLOSED;
 *   5. re-checks CURRENT invariants (manifest structural validation).
 *
 * READS FAIL CLOSED on structurally invalid manifests and on manifest-
 * recorded versions whose files are missing; unrecorded (orphan) version
 * files are not readable — the manifest is the authoritative record.
 */
export class ArtifactRepository {
  private store: ArtifactStore;
  private manifestManager: ManifestManager;
  private schemaValidator: SchemaValidator;
  private writeLock: ProcessWriteLock;
  private readonly workspaceRoot: string;

  constructor(workspaceRoot: string = './projects', schemaValidator?: SchemaValidator) {
    this.workspaceRoot = workspaceRoot;
    this.store = new ArtifactStore(workspaceRoot);
    this.manifestManager = new ManifestManager(workspaceRoot);
    this.schemaValidator = schemaValidator ?? new SchemaValidator();
    this.schemaValidator.initialize();
    this.writeLock = new ProcessWriteLock(workspaceRoot);
  }

  /**
   * Validate and persist a new version of an artifact.
   *
   * The document MUST already carry its own artifactId, artifactType,
   * projectId and other envelope fields per schema-architecture.md
   * section 2 — this method does not synthesize or mutate envelope fields
   * into the caller's document. It only assigns and injects the next
   * artifactVersion for this artifact type within this project, since that
   * is a persistence-layer concern (the caller cannot know the next
   * version number without asking the manifest).
   *
   * The document is validated against its artifactType's schema BEFORE
   * the version number is computed or anything is written to disk. On
   * validation failure, nothing is persisted and no version number is
   * consumed.
   *
   * @throws ArtifactValidationError if the document fails schema validation
   */
  async saveArtifact(
    projectId: string,
    artifactType: ArtifactType,
    document: ArtifactDocument
  ): Promise<{ version: number; artifactId: string }> {
    // HIGH-1: project isolation is enforced before any lock or filesystem
    // side effect (withLock's acquire() creates directories).
    validateProjectId(projectId);

    return this.writeLock.withLock(projectId, async () => {
      // HIGH-2: reconcile crash/orphan state before allocating a version.
      // Reconciliation cleans stale temp files, fails closed on a malformed
      // or inconsistent manifest, and adopts/deletes orphan version files.
      const manifest = await this.reconcile(projectId);

      const version = this.manifestManager.getNextVersion(manifest, artifactType);

      // Post-reconciliation guard (belt and braces): after reconciliation no
      // unrecorded version file can remain, so the allocated version's file
      // cannot exist. If it does, the allocation invariant is broken and the
      // operation must fail closed rather than overwrite immutable state.
      if (await this.store.versionExists(projectId, artifactType, version)) {
        throw new ManifestIntegrityError(
          projectId,
          `${artifactType} v${version}.json exists on disk even after orphan reconciliation — ` +
            `version allocation invariant breached`
        );
      }

      const documentToValidate: ArtifactDocument = {
        ...document,
        artifactType,
        projectId,
        artifactVersion: version,
        versionStatus: VersionStatus.CURRENT
      };

      const validationResult = this.schemaValidator.validate(artifactType, documentToValidate);

      if (!validationResult.valid) {
        logger.warn('Artifact failed schema validation, not persisted', {
          component: 'ArtifactRepository',
          projectId,
          artifactType,
          errorCount: validationResult.errors.length
        });
        throw new ArtifactValidationError(artifactType, validationResult);
      }

      const artifactId = documentToValidate['artifactId'] as string | undefined;
      if (!artifactId) {
        throw new Error(
          `Document for ${artifactType} must include a non-empty artifactId before persistence`
        );
      }

      await this.store.writeVersion(projectId, artifactType, version, documentToValidate);

      const updatedManifest = this.manifestManager.recordNewVersion(
        manifest,
        artifactType,
        artifactId,
        version
      );
      await this.manifestManager.write(projectId, updatedManifest);

      logger.info('Artifact saved', {
        component: 'ArtifactRepository',
        projectId,
        artifactType,
        version,
        artifactId
      });

      return { version, artifactId };
    });
  }

  /**
   * Read the CURRENT version of an artifact type for a project.
   *
   * @throws Error if no version of this artifact type has ever been saved
   * @throws ManifestIntegrityError if the manifest is structurally invalid
   *   or the CURRENT version's file is missing (fail closed — HIGH-2)
   */
  async getCurrentArtifact(
    projectId: string,
    artifactType: ArtifactType
  ): Promise<ArtifactDocument> {
    validateProjectId(projectId);

    // Read fails closed on a malformed/structurally invalid manifest (HIGH-2).
    const manifest = await this.manifestManager.read(projectId);
    const current = this.manifestManager.getCurrentVersion(manifest, artifactType);

    if (!current) {
      throw new Error(
        `No artifact of type ${artifactType} exists for project ${projectId}`
      );
    }

    // Fail closed when the manifest records a CURRENT version whose file is
    // missing: silently returning other data or a generic "not found" would
    // mask real data loss.
    if (!(await this.store.versionExists(projectId, artifactType, current.version))) {
      throw new ManifestIntegrityError(
        projectId,
        `manifest records ${artifactType} v${current.version} as CURRENT but its version ` +
          `file is missing`
      );
    }

    return this.store.readVersion(projectId, artifactType, current.version);
  }

  /**
   * Read a specific version of an artifact type for a project.
   *
   * Only versions recorded in the manifest are readable: the manifest is the
   * authoritative record (M2.3-A), so unrecorded (orphan) files — which are
   * never observable committed state — are not served.
   *
   * @throws ManifestIntegrityError if the version is not recorded in the
   *   manifest, or the manifest is structurally invalid
   * @throws Error if that version does not exist
   */
  async getArtifactVersion(
    projectId: string,
    artifactType: ArtifactType,
    version: number
  ): Promise<ArtifactDocument> {
    validateProjectId(projectId);
    validateArtifactVersion(version);

    const manifest = await this.manifestManager.read(projectId);
    const state = manifest.artifacts[artifactType];

    if (!state || !state.versions.some(v => v.version === version)) {
      throw new ManifestIntegrityError(
        projectId,
        `${artifactType} v${version} is not recorded in the manifest — unrecorded version ` +
          `files are not readable (the manifest is the authoritative record; run a save to ` +
          `trigger orphan reconciliation)`
      );
    }

    return this.store.readVersion(projectId, artifactType, version);
  }

  /**
   * Whether any version of this artifact type has been saved for the
   * project (regardless of CURRENT/SUPERSEDED/HISTORICAL status).
   */
  async hasArtifact(projectId: string, artifactType: ArtifactType): Promise<boolean> {
    validateProjectId(projectId);

    // Read fails closed on a malformed/structurally invalid manifest (HIGH-2).
    const manifest = await this.manifestManager.read(projectId);
    return this.manifestManager.hasArtifact(manifest, artifactType);
  }

  /**
   * Validate the persisted CURRENT artifact of one type WITHOUT trusting the
   * persisted JSON blindly (MEDIUM-2 fix).
   *
   * Establishes, in order:
   *   1. the manifest is structurally valid (read fails closed) and records
   *      a CURRENT version for the type;
   *   2. the CURRENT version file exists;
   *   3. the file parses as JSON;
   *   4. the document passes its canonical 04-SCHEMA schema;
   *   5. the envelope identity is intact: projectId, artifactType,
   *      artifactVersion and artifactId all match the manifest record and
   *      the requested project (an externally modified/tampered file whose
   *      content still parses is caught here).
   *
   * Never throws for corrupt content — corruption is an integrity verdict
   * ({ valid: false, reason }), so gate conditions can fail closed without
   * crashing gate evaluation. Invalid project identity still throws (HIGH-1).
   */
  async validateCurrentArtifact(
    projectId: string,
    artifactType: ArtifactType
  ): Promise<CurrentArtifactIntegrity> {
    validateProjectId(projectId);

    const manifest = await this.manifestManager.read(projectId);
    const current = this.manifestManager.getCurrentVersion(manifest, artifactType);

    if (!current) {
      return {
        valid: false,
        reason: `no CURRENT ${artifactType} version is recorded in the manifest`
      };
    }

    if (!(await this.store.versionExists(projectId, artifactType, current.version))) {
      return {
        valid: false,
        reason: `manifest records ${artifactType} v${current.version} as CURRENT but its ` +
          `version file is missing`
      };
    }

    let document: ArtifactDocument;
    try {
      document = await this.store.readVersion(projectId, artifactType, current.version);
    } catch (error) {
      return {
        valid: false,
        reason: `persisted ${artifactType} v${current.version} is unreadable or not valid ` +
          `JSON (${(error as Error).message})`
      };
    }

    const validationResult = this.schemaValidator.validate(artifactType, document);
    if (!validationResult.valid) {
      const summary = validationResult.errors.map(e => `${e.path}: ${e.message}`).join('; ');
      return {
        valid: false,
        reason: `persisted ${artifactType} v${current.version} fails schema validation: ` +
          `${summary}`
      };
    }

    const docProjectId = document['projectId'];
    const docArtifactType = document['artifactType'];
    const docArtifactVersion = document['artifactVersion'];
    const docArtifactId = document['artifactId'];

    if (docProjectId !== projectId) {
      return {
        valid: false,
        reason: `persisted document's projectId ${JSON.stringify(docProjectId)} does not ` +
          `match project ${JSON.stringify(projectId)} — the artifact is foreign or tampered`
      };
    }

    if (docArtifactType !== artifactType) {
      return {
        valid: false,
        reason: `persisted document's artifactType ${JSON.stringify(docArtifactType)} does ` +
          `not match the manifest record ${JSON.stringify(artifactType)}`
      };
    }

    if (docArtifactVersion !== current.version) {
      return {
        valid: false,
        reason: `persisted document's artifactVersion ${JSON.stringify(docArtifactVersion)} ` +
          `does not match the manifest's CURRENT version ${current.version}`
      };
    }

    if (typeof docArtifactId !== 'string' || docArtifactId !== current.artifactId) {
      return {
        valid: false,
        reason: `persisted document's artifactId ${JSON.stringify(docArtifactId)} does not ` +
          `match the manifest record ${JSON.stringify(current.artifactId)}`
      };
    }

    return { valid: true, document };
  }

  /**
   * Reconcile crash/orphan state for a project before a version is allocated
   * (HIGH-2 fix). Caller MUST hold the per-project write lock.
   *
   * Returns the (possibly adopted-and-rewritten) manifest for continued use
   * by the caller inside the same lock scope.
   */
  private async reconcile(projectId: string): Promise<ProjectManifest> {
    // 1. Stale temporary files from interrupted writes are never valid.
    await this.cleanupTempFiles(projectId);

    // 2. Read the manifest — fails closed on malformed/structurally invalid
    //    state. A missing manifest file is a valid fresh-project state and
    //    yields an empty manifest.
    let manifest = await this.manifestManager.read(projectId);

    // 3. Missing-version behavior: every manifest-recorded version must have
    //    its file. Fail closed — never paper over data loss by dropping the
    //    manifest entry, and never serve a manifest proven incomplete.
    for (const [typeKey, state] of Object.entries(manifest.artifacts)) {
      const artifactType = typeKey as ArtifactType;
      for (const entry of state.versions) {
        if (!(await this.store.versionExists(projectId, artifactType, entry.version))) {
          throw new ManifestIntegrityError(
            projectId,
            `manifest records ${artifactType} v${entry.version} but its version file is missing`
          );
        }
      }
    }

    // 4. Orphan version files: a version file with no manifest entry — the
    //    exact state a crash between the version-file write and the manifest
    //    write leaves behind. Valid orphans are ADOPTED (completing the
    //    crashed commit so version allocation stays correct after restart),
    //    garbage orphans are DELETED, identity-contradicting orphans FAIL
    //    CLOSED.
    let manifestChanged = false;

    for (const dirName of await this.store.listArtifactTypeDirNames(projectId)) {
      if (!(Object.values(ArtifactType) as string[]).includes(dirName)) {
        // Not an artifact-type directory created by this persistence layer;
        // leave foreign directories untouched.
        continue;
      }

      const artifactType = dirName as ArtifactType;
      const recordedVersions = new Set(
        (manifest.artifacts[artifactType]?.versions ?? []).map(v => v.version)
      );

      const orphanVersions: number[] = [];

      for (const fileName of await this.store.listVersionFileNames(projectId, artifactType)) {
        const match = /^v(\d+)\.json$/.exec(fileName);
        if (!match) {
          // Not a version file (foreign filename): not orphan state this
          // layer created; left untouched.
          continue;
        }

        const fileVersion = Number(match[1]);
        if (!Number.isSafeInteger(fileVersion) || fileVersion < 1) {
          await this.deleteOrphanFile(projectId, artifactType, fileName, fileVersion,
            'version number is not a positive integer — file was never written by this ' +
            'persistence layer');
          continue;
        }

        if (!recordedVersions.has(fileVersion)) {
          orphanVersions.push(fileVersion);
        }
      }

      // Ascending order so the highest adopted version lands as CURRENT.
      orphanVersions.sort((a, b) => a - b);

      for (const fileVersion of orphanVersions) {
        const disposition = await this.classifyOrphan(projectId, artifactType, fileVersion);

        switch (disposition.action) {
          case 'skip':
            break;

          case 'delete':
            await this.deleteOrphanFile(
              projectId,
              artifactType,
              `v${fileVersion}.json`,
              fileVersion,
              disposition.reason
            );
            break;

          case 'fail':
            throw new ManifestIntegrityError(projectId, disposition.reason);

          case 'adopt': {
            const filePath = this.store.getArtifactVersionPath(
              projectId,
              artifactType,
              fileVersion
            );
            const stats = await fs.promises.stat(filePath);
            manifest = this.manifestManager.adoptVersion(
              manifest,
              artifactType,
              disposition.artifactId,
              fileVersion,
              stats.mtime.toISOString()
            );
            manifestChanged = true;

            logger.warn(
              'Adopting orphaned artifact version left by a crashed save; manifest updated',
              {
                component: 'ArtifactRepository',
                projectId,
                artifactType,
                version: fileVersion,
                artifactId: disposition.artifactId
              }
            );
            break;
          }
        }
      }
    }

    if (manifestChanged) {
      await this.manifestManager.write(projectId, manifest);
      logger.info('Manifest updated during crash/orphan reconciliation', {
        component: 'ArtifactRepository',
        projectId
      });
    }

    // CURRENT invariants are revalidated implicitly: the returned manifest
    // passed structural validation (exactly one CURRENT per type,
    // currentVersion resolving to a CURRENT entry, well-formed entries), and
    // step 3 proved every recorded version's file exists.
    return manifest;
  }

  /**
   * Decide what happens to one orphan version file. Never mutates state.
   *
   *   - skip:   the file vanished between listing and reading (benign)
   *   - delete: unparseable JSON or schema-invalid content — garbage that
   *             was never committed and never observable via any read path
   *   - fail:   schema-valid but envelope identity contradicts the path —
   *             ambiguous (possibly real data); neither adopt nor delete
   *   - adopt:  schema-valid and identity-consistent — complete the commit
   */
  private async classifyOrphan(
    projectId: string,
    artifactType: ArtifactType,
    fileVersion: number
  ): Promise<OrphanDisposition> {
    const filePath = this.store.getArtifactVersionPath(projectId, artifactType, fileVersion);

    let content: string;
    try {
      content = await fs.promises.readFile(filePath, 'utf-8');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return { action: 'skip' };
      }
      throw error;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch (error) {
      return {
        action: 'delete',
        reason: `orphan version file is not valid JSON (${(error as Error).message})`
      };
    }

    const validationResult = this.schemaValidator.validate(artifactType, parsed);
    if (!validationResult.valid) {
      return {
        action: 'delete',
        reason: `orphan version file fails its ${artifactType} schema ` +
          `(${validationResult.errors.length} validation errors)`
      };
    }

    const document = parsed as Record<string, unknown>;
    const identityMismatch =
      document['projectId'] !== projectId ||
      document['artifactType'] !== artifactType ||
      document['artifactVersion'] !== fileVersion ||
      typeof document['artifactId'] !== 'string' ||
      (document['artifactId'] as string).length === 0;

    if (identityMismatch) {
      return {
        action: 'fail',
        reason: `orphan ${artifactType} v${fileVersion}.json is schema-valid but its envelope ` +
          `identity (projectId/artifactType/artifactVersion/artifactId) contradicts its ` +
          `path — the file is foreign or tampered and will not be adopted or deleted ` +
          `automatically`
      };
    }

    return { action: 'adopt', artifactId: document['artifactId'] as string };
  }

  /**
   * Delete one orphan version file, with a warn log recording why.
   */
  private async deleteOrphanFile(
    projectId: string,
    artifactType: ArtifactType,
    fileName: string,
    fileVersion: number,
    reason: string
  ): Promise<void> {
    // The path is built from a validated enum artifactType and a ^v\d+.json$
    // filename, with containment asserted — same rules as every path.
    const filePath = path.join(
      this.workspaceRoot,
      projectId,
      'artifacts',
      artifactType,
      fileName
    );
    assertPathInsideWorkspace(filePath, this.workspaceRoot);

    try {
      await fs.promises.unlink(filePath);
      logger.warn('Deleted orphaned/unrecoverable artifact version file', {
        component: 'ArtifactRepository',
        projectId,
        artifactType,
        version: fileVersion,
        file: fileName,
        reason
      });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * Remove stale temporary files ({name}.tmp-{pid}-{timestamp}) left behind
   * when a crash interrupts a write-temp-then-rename sequence. Both writers
   * (ArtifactStore.writeVersion, ManifestManager.write) use that suffix, so
   * the artifacts root (manifest temp files) and each artifact-type directory
   * (version temp files) are swept. Caller holds the write lock.
   */
  private async cleanupTempFiles(projectId: string): Promise<void> {
    const artifactsDir = path.join(this.workspaceRoot, projectId, 'artifacts');
    assertPathInsideWorkspace(artifactsDir, this.workspaceRoot);

    const removeMatching = async (dir: string): Promise<void> => {
      let entries: fs.Dirent[];
      try {
        entries = await fs.promises.readdir(dir, { withFileTypes: true });
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          return;
        }
        throw error;
      }

      for (const entry of entries) {
        if (entry.isFile() && TEMP_FILE_PATTERN.test(entry.name)) {
          const tempPath = path.join(dir, entry.name);
          try {
            await fs.promises.unlink(tempPath);
            logger.warn('Removed stale temporary file from an interrupted write', {
              component: 'ArtifactRepository',
              projectId,
              file: tempPath
            });
          } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
              throw error;
            }
          }
        }
      }
    };

    await removeMatching(artifactsDir);
    for (const dirName of await this.store.listArtifactTypeDirNames(projectId)) {
      await removeMatching(path.join(artifactsDir, dirName));
    }
  }
}
