import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { logger } from '../logging/Logger';
import { ArtifactDocument, ArtifactType } from './ArtifactTypes';
import { durableWrite } from './durableWrite';
import {
  assertPathInsideWorkspace,
  validateArtifactVersion,
  validateProjectId
} from './validateProjectId';

/**
 * Low-level filesystem read/write for artifact documents.
 *
 * Storage layout, under the project's artifacts directory (matches
 * workspace/WorkspaceManager.ts's existing 'artifacts' subdirectory
 * convention — this class writes INSIDE that directory, it does not
 * redefine where it lives):
 *
 *   projects/{projectId}/artifacts/{artifactType}/v{version}.json
 *   projects/{projectId}/artifacts/manifest.json   (written by ManifestManager)
 *
 * One immutable file per artifact version, matching versioning.md's
 * "artifacts use simple incrementing iteration numbers" model: a version,
 * once written, is never rewritten in place. A new version is a new file.
 *
 * This class performs no schema validation, no version-number computation,
 * and no locking — those are ArtifactRepository's responsibilities. This
 * class only knows how to turn (projectId, artifactType, version) into a
 * path and read/write JSON there.
 *
 * PATH SAFETY (HIGH-1 fix): every path is constructed from a projectId that
 * is validated BEFORE path construction (validateProjectId) and the
 * constructed path is asserted to resolve inside the workspace root
 * (assertPathInsideWorkspace). Path traversal ('..', separators), absolute
 * paths (POSIX, Windows drive-letter, UNC) and every other invalid id fail
 * closed with InvalidProjectIdError before any filesystem side effect.
 * Version numbers are validated as positive safe integers before being
 * interpolated into filenames.
 */
export class ArtifactStore {
  private workspaceRoot: string;

  constructor(workspaceRoot: string = './projects') {
    this.workspaceRoot = workspaceRoot;
  }

  private getArtifactTypeDir(projectId: string, artifactType: ArtifactType): string {
    validateProjectId(projectId);
    const dir = path.join(this.workspaceRoot, projectId, 'artifacts', artifactType);
    return assertPathInsideWorkspace(dir, this.workspaceRoot);
  }

  getArtifactVersionPath(projectId: string, artifactType: ArtifactType, version: number): string {
    validateArtifactVersion(version);
    return path.join(this.getArtifactTypeDir(projectId, artifactType), `v${version}.json`);
  }

  /**
   * Names of the subdirectories under the project's artifacts directory
   * (one per persisted artifact type). Additive helper for
   * ArtifactRepository's crash/orphan reconciliation (HIGH-2); returns an
   * empty array when the project has no artifacts directory yet.
   */
  async listArtifactTypeDirNames(projectId: string): Promise<string[]> {
    validateProjectId(projectId);
    const artifactsDir = path.join(this.workspaceRoot, projectId, 'artifacts');
    assertPathInsideWorkspace(artifactsDir, this.workspaceRoot);

    try {
      const entries = await fs.promises.readdir(artifactsDir, { withFileTypes: true });
      return entries.filter(e => e.isDirectory()).map(e => e.name);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  /**
   * File names inside one artifact type's version directory. Additive
   * helper for reconciliation (HIGH-2); returns an empty array when the
   * directory does not exist.
   */
  async listVersionFileNames(projectId: string, artifactType: ArtifactType): Promise<string[]> {
    const dir = this.getArtifactTypeDir(projectId, artifactType);

    try {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });
      return entries.filter(e => e.isFile()).map(e => e.name);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  /**
   * Write an artifact document for a specific version.
   *
   * Fails if the version file already exists — versions are immutable
   * once written, per versioning.md's incrementing-iteration model. Use a
   * new version number to record a change, never overwrite an existing one.
   *
   * @returns the SHA-256 digest of the committed bytes, to be recorded in
   *   the manifest entry (content-integrity chain, M2.3-A BLOCKER-2 fix).
   * @throws Error if the version file already exists
   */
  async writeVersion(
    projectId: string,
    artifactType: ArtifactType,
    version: number,
    document: ArtifactDocument
  ): Promise<string> {
    const filePath = this.getArtifactVersionPath(projectId, artifactType, version);

    if (fs.existsSync(filePath)) {
      throw new Error(
        `Artifact version already exists and is immutable: ${artifactType} v${version} for project ${projectId}`
      );
    }

    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

    const content = JSON.stringify(document, null, 2);

    // Durable atomic commit (M2.3-A BLOCKER-3): write temp, fsync the file,
    // close, rename, best-effort directory-metadata sync. A crash mid-write
    // never leaves a partially-written version file that a later read would
    // parse as corrupt or incomplete JSON, and a power loss after the commit
    // can no longer lose the bytes to the page cache.
    const contentSha256 = await durableWrite(filePath, content, 'utf-8').then(r => r.sha256);

    logger.info('Artifact version written', {
      component: 'ArtifactStore',
      projectId,
      artifactType,
      version
    });
    return contentSha256;
  }

  /**
   * Compute the SHA-256 digest of a persisted version file's raw bytes.
   *
   * Used by the read path (validateCurrentArtifact) to verify that a
   * manifest-recorded version file was not modified after its commit
   * (content-integrity chain, M2.3-A BLOCKER-2 fix).
   *
   * @throws Error if the version file does not exist
   */
  async getVersionDigest(
    projectId: string,
    artifactType: ArtifactType,
    version: number
  ): Promise<string> {
    const filePath = this.getArtifactVersionPath(projectId, artifactType, version);
    const bytes = await fs.promises.readFile(filePath);
    return crypto.createHash('sha256').update(bytes).digest('hex');
  }

  /**
   * Read a specific artifact version.
   *
   * @throws Error if the version file does not exist
   */
  async readVersion(
    projectId: string,
    artifactType: ArtifactType,
    version: number
  ): Promise<ArtifactDocument> {
    const filePath = this.getArtifactVersionPath(projectId, artifactType, version);

    if (!fs.existsSync(filePath)) {
      throw new Error(
        `Artifact version not found: ${artifactType} v${version} for project ${projectId}`
      );
    }

    const content = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(content) as ArtifactDocument;
  }

  /**
   * Whether a specific artifact version exists on disk.
   */
  async versionExists(
    projectId: string,
    artifactType: ArtifactType,
    version: number
  ): Promise<boolean> {
    return fs.existsSync(this.getArtifactVersionPath(projectId, artifactType, version));
  }
}
