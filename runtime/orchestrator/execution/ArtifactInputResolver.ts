/**
 * Artifact input resolution for M2.4.
 *
 * Resolves each declared action input to the EXACT CURRENT version recorded
 * by M2.3's manifest (versioning.md §6.2 rule 4 — consumers resolve to
 * CURRENT; superseded versions are never valid input). Resolution happens at
 * orchestration time and the resolved versions are frozen into the
 * ExecutionContext — a worker never asks "give me whatever is latest".
 *
 * All reads go through M2.3's ArtifactRepository. This module performs no
 * filesystem access of its own.
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 * Factory version: 0.2.0
 */

import { ArtifactRepository } from '../../artifacts/ArtifactRepository';
import { ArtifactType } from '../../artifacts/ArtifactTypes';
import { logger } from '../../logging/Logger';
import {
  MissingInputArtifactError,
  ResolvedArtifact
} from '../types';

export class ArtifactInputResolver {
  constructor(private readonly repository: ArtifactRepository) {}

  /**
   * Resolve the CURRENT version of every required input artifact.
   *
   * @throws MissingInputArtifactError when a required input does not exist
   *   (fail-closed — the step is not dispatched with partial inputs)
   * @throws ManifestIntegrityError (from M2.3) when the manifest or the
   *   CURRENT version file is corrupt — propagated as-is, fail-closed
   */
  async resolveInputs(
    projectId: string,
    requiredInputs: ArtifactType[],
    executionId?: string
  ): Promise<ResolvedArtifact[]> {
    const resolved: ResolvedArtifact[] = [];

    for (const artifactType of requiredInputs) {
      const exists = await this.repository.hasArtifact(projectId, artifactType);
      if (!exists) {
        logger.error('Required input artifact missing', {
          component: 'ArtifactInputResolver',
          projectId,
          artifactType,
          outcome: 'failure'
        });
        throw new MissingInputArtifactError(projectId, artifactType, executionId);
      }

      // getCurrentArtifact fails closed on a manifest-recorded CURRENT whose
      // file is missing, so the resolved document is integrity-checked by M2.3.
      const document = await this.repository.getCurrentArtifact(projectId, artifactType);

      const version = document['artifactVersion'];
      const artifactId = document['artifactId'];
      if (typeof version !== 'number' || typeof artifactId !== 'string' || !artifactId) {
        throw new MissingInputArtifactError(projectId, artifactType, executionId);
      }

      resolved.push({ artifactType, version, artifactId, document });
    }

    return resolved;
  }
}
