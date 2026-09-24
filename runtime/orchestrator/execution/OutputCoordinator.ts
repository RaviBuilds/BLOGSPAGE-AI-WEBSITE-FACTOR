/**
 * Output coordination for M2.4.
 *
 * Validates a worker's returned output against the action's declared output
 * contract BEFORE anything is persisted, and then performs persistence
 * strictly through M2.3's ArtifactRepository — the worker never persists and
 * the orchestrator never touches artifact files.
 *
 * Structural validation here checks the ORCHESTRATION contract only:
 *   - every declared expected output is present, exactly once,
 *   - no undeclared artifact types are smuggled through
 *     (agent-roles.md §1 rule 2 — a role writes only its declared outputs),
 *   - each document carries a caller-side artifactId,
 *   - envelope fields owned by the persistence layer (artifactVersion /
 *     versionStatus) are NOT set by the worker — saveArtifact injects them
 *     (M2.3-A contract),
 *   - if a worker declares projectId / artifactType itself, they must match
 *     the execution context / declared artifact type,
 *   - worker metadata identifies the same execution.
 *
 * Schema validation is NOT duplicated here: M2.3's SchemaValidator enforces
 * the canonical 04-SCHEMA shape on write, and content quality belongs to
 * M2.2's gates. A schema-invalid document therefore surfaces as a
 * persistence failure, not as a re-implemented check.
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 * Factory version: 0.2.0
 */

import { ArtifactRepository } from '../../artifacts/ArtifactRepository';
import { ArtifactType } from '../../artifacts/ArtifactTypes';
import { logger } from '../../logging/Logger';
import {
  ArtifactOutput,
  ExecutionContext,
  FailureType,
  OrchestrationError,
  PersistedArtifact,
  WorkerOutput
} from '../types';

export interface ValidationOutcome {
  valid: boolean;
  errors: string[];
}

/**
 * Envelope fields injected unconditionally by M2.3's saveArtifact; workers
 * must not set them (M2.3 assigns the version and CURRENT status itself).
 * projectId and artifactType are NOT in this list: a worker may declare them
 * declaratively, and OutputCoordinator verifies they MATCH the execution
 * context / declared type (Section F).
 */
const PERSISTENCE_OWNED_FIELDS = ['artifactVersion', 'versionStatus'];

export class OutputCoordinator {
  /**
   * Validate a worker's output structure against the action contract.
   * Pure — performs no persistence and no side effects.
   */
  validateOutput(
    output: WorkerOutput,
    expectedOutputs: ArtifactType[],
    context: ExecutionContext
  ): ValidationOutcome {
    const errors: string[] = [];

    if (!output || !Array.isArray(output.artifacts)) {
      return { valid: false, errors: ['Worker output carries no artifacts array'] };
    }

    const producedTypes = output.artifacts.map(a => a.artifactType);

    for (const expected of expectedOutputs) {
      if (!producedTypes.includes(expected)) {
        errors.push(`Missing expected artifact: ${expected}`);
      }
    }

    for (const produced of producedTypes) {
      if (!expectedOutputs.includes(produced)) {
        errors.push(
          `Undeclared artifact type produced: ${produced} ` +
            `(agent-roles.md §1 rule 2: a role writes only its declared outputs)`
        );
      }
    }

    const seen = new Set<ArtifactType>();
    for (const artifact of output.artifacts) {
      if (seen.has(artifact.artifactType)) {
        errors.push(`Duplicate artifact type produced: ${artifact.artifactType}`);
      }
      seen.add(artifact.artifactType);

      const document = artifact.document ?? {};
      const artifactId = document['artifactId'];
      if (typeof artifactId !== 'string' || artifactId.trim().length === 0) {
        errors.push(
          `Document for ${artifact.artifactType} must carry a non-empty artifactId`
        );
      }

      // Section F: when a worker declares these envelope fields itself,
      // they must MATCH the execution context / declared type. M2.3 remains
      // the injection-and-validation authority on write; this is a mismatch
      // detector, not a duplicate validator.
      const docProjectId = document['projectId'];
      if (docProjectId !== undefined && docProjectId !== context.projectId) {
        errors.push(
          `Document for ${artifact.artifactType} declares projectId ` +
            `'${String(docProjectId)}' but the execution context is ` +
            `'${context.projectId}'`
        );
      }
      const docArtifactType = document['artifactType'];
      if (
        docArtifactType !== undefined &&
        docArtifactType !== artifact.artifactType
      ) {
        errors.push(
          `Document declares artifactType '${String(docArtifactType)}' but it ` +
            `was produced as ${artifact.artifactType}`
        );
      }

      for (const field of PERSISTENCE_OWNED_FIELDS) {
        if (document[field] !== undefined) {
          errors.push(
            `Document for ${artifact.artifactType} must not set '${field}' — ` +
              `it is injected by the persistence layer (M2.3-A)`
          );
        }
      }

      if (!Array.isArray(artifact.consumedInputs)) {
        errors.push(
          `ArtifactOutput for ${artifact.artifactType} must declare consumedInputs ` +
            `(empty array when no artifact inputs were consumed)`
        );
      }
    }

    if (output.metadata?.executionId !== context.executionId) {
      errors.push('Worker metadata executionId does not match the ExecutionContext');
    }
    if (output.metadata?.workerId !== context.workerId) {
      errors.push('Worker metadata workerId does not match the ExecutionContext');
    }
    if (output.metadata?.workerVersion !== context.workerVersion) {
      errors.push('Worker metadata workerVersion does not match the ExecutionContext');
    }

    return { valid: errors.length === 0, errors };
  }


  /**
   * Persist validated artifacts through M2.3, in array order.
   *
   * Each saveArtifact call is individually atomic (version file + manifest
   * under M2.3's write lock). There is deliberately NO cross-artifact
   * transaction: if a later save fails, the earlier saves stand as CURRENT
   * versions and recovery is handled by re-running the action (a re-run
   * persists new versions rather than overwriting immutable ones —
   * versioning.md §6.2 rule 3).
   *
   * @throws OrchestrationError (ARTIFACT_PERSISTENCE_FAILED) wrapping any
   *   M2.3 rejection (schema-invalid document, manifest integrity failure,
   *   I/O error). Fail-closed: the step is abandoned before gate evaluation.
   */
  async persistArtifacts(
    projectId: string,
    artifacts: ArtifactOutput[],
    repository: ArtifactRepository,
    executionId?: string
  ): Promise<PersistedArtifact[]> {
    const persisted: PersistedArtifact[] = [];

    for (const artifact of artifacts) {
      try {
        const result = await repository.saveArtifact(
          projectId,
          artifact.artifactType,
          artifact.document
        );
        persisted.push({
          artifactType: artifact.artifactType,
          version: result.version,
          artifactId: result.artifactId
        });
      } catch (error) {
        logger.error('Artifact persistence failed', {
          component: 'OutputCoordinator',
          projectId,
          artifactType: artifact.artifactType,
          persistedSoFar: persisted.length,
          error: error instanceof Error ? error.message : String(error)
        });
        throw new OrchestrationError(
          FailureType.ARTIFACT_PERSISTENCE_FAILED,
          `Failed to persist ${artifact.artifactType} (after ${persisted.length} ` +
            `successful saves in this step): ${
              error instanceof Error ? error.message : String(error)
            }`,
          projectId,
          executionId,
          error
        );
      }
    }

    return persisted;
  }
}

