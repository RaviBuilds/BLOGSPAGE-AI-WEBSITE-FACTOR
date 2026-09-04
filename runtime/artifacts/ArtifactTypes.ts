/**
 * Artifact persistence types for M2.3-A.
 *
 * Canonical source: 04-SCHEMA/_common/artifact-envelope.schema.json
 * definitions.artifactType enum — "closed set of exactly eleven peer
 * artifacts" per artifact-contracts.md section 5.
 *
 * This is a SUPERSET of gates/GateTypes.ArtifactType (M2.2, frozen), which
 * has 10 members and omits FINAL_REPORT. FINAL_REPORT is a real, schema-
 * defined artifact type (04-SCHEMA/final-report.schema.json) produced by the
 * Control Plane and consumed by the human approver at Gate 3
 * (quality-gates.md section 8) — it is persisted here even though M2.2's
 * ValidationContext.hasArtifact() cannot be called with it, because that
 * frozen interface's parameter type is gates/GateTypes.ArtifactType.
 *
 * String values are IDENTICAL to gates/GateTypes.ArtifactType for the 10
 * shared members, so a GateTypes.ArtifactType value is always a valid
 * ArtifactType value (structural/string compatibility, not a TS subtype
 * relationship since these are distinct enum declarations).
 */
export enum ArtifactType {
  BUSINESS_RESEARCH = 'BUSINESS_RESEARCH',
  BUSINESS_INTELLIGENCE = 'BUSINESS_INTELLIGENCE',
  ASSET_INVENTORY = 'ASSET_INVENTORY',
  BRAND_PROFILE = 'BRAND_PROFILE',
  DESIGN_BLUEPRINT = 'DESIGN_BLUEPRINT',
  IMPLEMENTATION_REPORT = 'IMPLEMENTATION_REPORT',
  CRITIC_REPORT = 'CRITIC_REPORT',
  REFINEMENT_PLAN = 'REFINEMENT_PLAN',
  FINAL_REPORT = 'FINAL_REPORT',
  CREATIVE_DIRECTION = 'CREATIVE_DIRECTION',
  RENDERED_RESULT = 'RENDERED_RESULT'
}

/**
 * Maps each artifact type to its schema file, relative to 04-SCHEMA/.
 *
 * File names per 04-SCHEMA/ directory listing (11 type schemas, verified
 * this session). The shared envelope (_common/artifact-envelope.schema.json)
 * is registered separately by SchemaValidator, not listed here.
 */
export const ARTIFACT_SCHEMA_FILES: Record<ArtifactType, string> = {
  [ArtifactType.BUSINESS_RESEARCH]: 'business-research.schema.json',
  [ArtifactType.BUSINESS_INTELLIGENCE]: 'business-intelligence.schema.json',
  [ArtifactType.ASSET_INVENTORY]: 'asset-inventory.schema.json',
  [ArtifactType.BRAND_PROFILE]: 'brand-profile.schema.json',
  [ArtifactType.DESIGN_BLUEPRINT]: 'design-blueprint.schema.json',
  [ArtifactType.IMPLEMENTATION_REPORT]: 'implementation-report.schema.json',
  [ArtifactType.CRITIC_REPORT]: 'critic-report.schema.json',
  [ArtifactType.REFINEMENT_PLAN]: 'refinement-plan.schema.json',
  [ArtifactType.FINAL_REPORT]: 'final-report.schema.json',
  [ArtifactType.CREATIVE_DIRECTION]: 'creative-direction.schema.json',
  [ArtifactType.RENDERED_RESULT]: 'rendered-result.schema.json'
};

/**
 * Version status per versioning.md section 6.2.
 *
 * "These are artifact version statuses and NOT project states" — mirrors
 * the envelope's definitions.versionStatus enum exactly.
 */
export enum VersionStatus {
  CURRENT = 'CURRENT',
  SUPERSEDED = 'SUPERSEDED',
  HISTORICAL = 'HISTORICAL'
}

/**
 * A stored artifact document: the caller-supplied envelope + payload fields,
 * exactly as validated against the artifact's schema. Persistence adds no
 * fields the schema does not already define — artifactId, artifactType,
 * projectId, artifactVersion and versionStatus are expected to already be
 * present in the document passed to ArtifactRepository.saveArtifact, per
 * the envelope contract (schema-architecture.md section 2).
 */
export type ArtifactDocument = Record<string, unknown>;

/**
 * One entry in a project's per-type version manifest.
 */
export interface ManifestVersionEntry {
  version: number;
  status: VersionStatus;
  artifactId: string;
  writtenAt: string;
  /**
   * SHA-256 of the persisted version file's bytes, recorded at commit time
   * (M2.3-A BLOCKER-2 remediation: content-integrity chain). Optional for
   * compatibility with manifests written before this field existed —
   * validateCurrentArtifact verifies the digest only when it is present,
   * and skips the check for legacy entries. New commits always record it;
   * orphan adoption records it for the adopted file.
   */
  contentSha256?: string;
}

/**
 * Per-artifact-type manifest state.
 */
export interface ManifestTypeState {
  currentVersion: number | null;
  versions: ManifestVersionEntry[];
}

/**
 * Full manifest for a project: one ManifestTypeState per artifact type that
 * has at least one persisted version.
 */
export interface ProjectManifest {
  projectId: string;
  artifacts: Partial<Record<ArtifactType, ManifestTypeState>>;
}
