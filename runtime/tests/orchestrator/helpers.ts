/**
 * Shared test helpers for the M2.4 orchestrator suites.
 *
 * Test files only — never imported by production code. Stubs used here are
 * isolated-unit-scope ONLY: the vertical-slice suite wires the real
 * production components (StateManager, ArtifactRepository,
 * ProductionValidationContext, GateEvaluator) and imports none of the stub
 * contexts.
 *
 * M2.4 Milestone: Orchestrator with research vertical slice.
 * Factory version: 0.2.0
 */

import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as yaml from 'js-yaml';
import { StateManager } from '../../state/StateManager';
import { State as StateEnum } from '../../state/StateMachine';
import { WorkspaceManager } from '../../workspace/WorkspaceManager';
import { ArtifactRepository } from '../../artifacts/ArtifactRepository';
import { ArtifactType } from '../../artifacts/ArtifactTypes';
import { ValidationContext } from '../../gates/ValidationContext';
import { ArtifactType as GateArtifactType } from '../../gates/GateTypes';

let suiteCounter = 0;

/** A fresh, isolated temp workspace root (Windows-safe, per-suite unique). */
export function makeWorkspaceRoot(label: string): string {
  suiteCounter += 1;
  return path.join(
    os.tmpdir(),
    `blogspage-m24-${label}-${process.pid}-${suiteCounter}`
  );
}

export async function removeWorkspaceRoot(root: string): Promise<void> {
  await fs.rm(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}

/**
 * Minimal benchmark-style business input used by the deterministic
 * ResearchWorker tests. Mirrors the shape of
 * 07-TEST-BUSINESSES/benchmark-001-dental/business-input.yaml.
 */
export const TEST_BUSINESS_INPUT_YAML = `
sourceDeclaration:
  type: SYNTHETIC_TEST
  researchability: NONE
businessIdentity:
  name: Test Dental Studio
  industry: Dental Services
  businessType: Cosmetic and General Dentistry
  established: 2016
  tagline: Precision and care
  primaryLocation:
    name: Main Clinic
    city: Testville
    state: TS
  secondaryLocation:
    name: Branch Clinic
    city: Othertown
    state: TS
  marketPositioning: Premium local practice serving professionals and families
contentSummary:
  servicesCount: 3
  teamCount: 2
  testimonialsCount: 4
  locationsCount: 2
  trustSignalsCount: 2
suppliedContent:
  services: ./supplied-content/services.yaml
suppliedBrand:
  brandContext: ./supplied-brand/brand-context.yaml
  logo: ./supplied-brand/logo.svg
`;

/**
 * Bootstrap a project exactly as M1 + the human input stage would leave it:
 * isolated workspace, copied business input, state NEW → RESEARCHING
 * (the orchestrator's first action state).
 */
export async function bootstrapResearchProject(
  workspaceRoot: string,
  projectId: string,
  businessInputYaml: string = TEST_BUSINESS_INPUT_YAML
): Promise<StateManager> {
  const workspaceManager = new WorkspaceManager(workspaceRoot);
  await workspaceManager.createWorkspace(projectId);

  const inputPath = path.join(workspaceManager.getInputPath(projectId), 'business-input.yaml');
  await fs.writeFile(inputPath, businessInputYaml, 'utf-8');

  const stateManager = new StateManager(workspaceRoot);
  await stateManager.initializeProject(projectId, StateEnum.NEW, uuidv4());
  await stateManager.transition({
    projectId,
    txId: uuidv4(),
    from: StateEnum.NEW,
    to: StateEnum.RESEARCHING,
    triggeredBy: 'test:bootstrap'
  });
  return stateManager;
}

/**
 * Stub ValidationContext answering every Research Validation condition
 * positively (except the fabricated-fact probe). UNIT SCOPE ONLY: it makes
 * the frozen gate PASS so the orchestrator's pass branch can be exercised
 * without stubbing the orchestrator itself.
 */
export class AllPassValidationContext implements ValidationContext {
  async hasArtifact(): Promise<boolean> {
    return true;
  }

  async checkCondition(
    _projectId: string,
    condition: string
  ): Promise<boolean> {
    if (condition === 'fabricated_fact_present') {
      return false;
    }
    return true;
  }
}

/**
 * Stub ValidationContext where a fabricated fact is detected. UNIT SCOPE
 * ONLY: artifacts exist, provenance holds, identity is unambiguous — and the
 * fabricated-fact probe reports fabrication PRESENT, so the
 * blocking_fabricated_fact check fails (FACTUAL_INTEGRITY_PROBLEM), which
 * M2.2's FailureRouter routes to RETURN_TO_RESEARCH.
 */
export class FabricatedFactValidationContext implements ValidationContext {
  async hasArtifact(): Promise<boolean> {
    return true;
  }

  async checkCondition(): Promise<boolean> {
    return true;
  }
}

/**
 * Stub ValidationContext where NO artifact exists. UNIT SCOPE ONLY: the
 * required-artifacts check fails with CONTENT_PROBLEM, routed by M2.2 to
 * NEEDS_CONTENT (a dynamic returnTarget exception state).
 */
export class MissingArtifactsValidationContext implements ValidationContext {
  async hasArtifact(): Promise<boolean> {
    return false;
  }

  async checkCondition(): Promise<boolean> {
    return false;
  }
}

/** Schema-valid, fact-free research fixture documents (ProductionWiring style). */
export function researchFixtureDocs(executionId: string): {
  artifactType: ArtifactType;
  document: Record<string, unknown>;
}[] {
  return [
    {
      artifactType: ArtifactType.BUSINESS_RESEARCH,
      document: {
        artifactId: `${executionId}-BR`,
        producer: 'RESEARCH_AGENT',
        businessIdentityAndLocation: [],
        servicesOrOfferings: [],
        contactAndOperatingDetails: [],
        publicReputationSignals: [],
        discoveredAssets: [],
        competitorObservations: [],
        sourceList: [],
        explicitGaps: []
      }
    },
    {
      artifactType: ArtifactType.BUSINESS_INTELLIGENCE,
      document: {
        artifactId: `${executionId}-BI`,
        producer: 'RESEARCH_AGENT',
        audienceUnderstanding: [],
        serviceStructure: [],
        positioningSignals: [],
        seoRelevantBusinessContext: [],
        constraintsFromContentOrAssetReality: []
      }
    },
    {
      artifactType: ArtifactType.ASSET_INVENTORY,
      document: {
        artifactId: `${executionId}-AI`,
        producer: 'RESEARCH_AGENT',
        assets: [],
        aggregateSuitabilityObservations: []
      }
    },
    {
      artifactType: ArtifactType.BRAND_PROFILE,
      document: {
        artifactId: `${executionId}-BP`,
        producer: 'RESEARCH_AGENT',
        existingNameUsageAndNamingConventions: [],
        existingMarksOrLogos: [],
        observedColourAndTypographicUsage: [],
        observedToneOfVoice: [],
        existingBrandInconsistencies: []
      }
    }
  ];
}

/** Persist the full research fixture set through the real M2.3 repository. */
export async function saveResearchFixtureSet(
  repo: ArtifactRepository,
  projectId: string,
  executionId: string
): Promise<void> {
  for (const entry of researchFixtureDocs(executionId)) {
    await repo.saveArtifact(projectId, entry.artifactType, entry.document);
  }
}

export { StateEnum, GateArtifactType, uuidv4 };

/**
 * Parse business-input YAML exactly the way ProjectInputLoader and
 * ProjectInitializer do: load all documents, drop null/comment-only
 * documents, take the last valid one.
 */
export function parseBusinessInputYaml(yamlText: string): unknown {
  const documents = yaml.loadAll(yamlText);
  const valid = (documents ?? []).filter(
    doc => doc !== null && doc !== undefined
  );
  if (valid.length === 0) {
    throw new Error('no valid YAML documents');
  }
  return valid[valid.length - 1];
}

