/**
 * SchemaValidator tests — M2.3-A.
 *
 * Verifies schema location, compilation of all 11 artifact type schemas
 * plus the shared envelope, and validation behavior for representative
 * artifact types (including the one canonical use of the "format"
 * keyword, in rendered-result.schema.json).
 */

import * as fs from 'fs';
import * as path from 'path';
import { SchemaValidator, patchAdditionalPropertiesGaps } from '../artifacts/SchemaValidator';
import { ARTIFACT_SCHEMA_FILES, ArtifactType } from '../artifacts/ArtifactTypes';

describe('SchemaValidator', () => {
  let validator: SchemaValidator;

  beforeAll(() => {
    validator = new SchemaValidator();
    validator.initialize();
  });

  test('locateSchemaRoot finds the real 04-SCHEMA directory', () => {
    const root = SchemaValidator.locateSchemaRoot();
    expect(root.endsWith('04-SCHEMA')).toBe(true);
  });

  test('initialize is idempotent', () => {
    expect(() => validator.initialize()).not.toThrow();
  });

  test('validate throws if called before initialize on a fresh instance', () => {
    const fresh = new SchemaValidator();
    expect(() => fresh.validate(ArtifactType.BUSINESS_RESEARCH, {})).toThrow(
      /initialize/
    );
  });

  test('accepts a valid BUSINESS_RESEARCH document', () => {
    const factualItem = {
      fact: 'Business name',
      value: 'Acme Co',
      source: 'Google Business Profile',
      sourceType: 'business_listing',
      confidence: 'high',
      verificationStatus: 'verified'
    };

    const doc = {
      artifactId: 'art-1',
      artifactType: 'BUSINESS_RESEARCH',
      projectId: 'proj-1',
      producer: 'RESEARCH_AGENT',
      businessIdentityAndLocation: [factualItem],
      servicesOrOfferings: [],
      contactAndOperatingDetails: [],
      publicReputationSignals: [],
      discoveredAssets: [],
      competitorObservations: [],
      sourceList: [],
      explicitGaps: []
    };

    const result = validator.validate(ArtifactType.BUSINESS_RESEARCH, doc);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('rejects a BUSINESS_RESEARCH document missing required payload fields', () => {
    const doc = {
      artifactId: 'art-1',
      artifactType: 'BUSINESS_RESEARCH',
      projectId: 'proj-1',
      producer: 'RESEARCH_AGENT'
      // missing businessIdentityAndLocation, servicesOrOfferings, etc.
    };

    const result = validator.validate(ArtifactType.BUSINESS_RESEARCH, doc);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('rejects a document with wrong artifactType pinned by const', () => {
    const doc = {
      artifactId: 'art-1',
      artifactType: 'CRITIC_REPORT', // wrong for this schema
      projectId: 'proj-1',
      producer: 'RESEARCH_AGENT',
      businessIdentityAndLocation: [],
      servicesOrOfferings: [],
      contactAndOperatingDetails: [],
      publicReputationSignals: [],
      discoveredAssets: [],
      competitorObservations: [],
      sourceList: [],
      explicitGaps: []
    };

    const result = validator.validate(ArtifactType.BUSINESS_RESEARCH, doc);
    expect(result.valid).toBe(false);
  });

  test('enforces the date-time format keyword on RENDERED_RESULT captures', () => {
    const baseDoc = {
      artifactId: 'art-2',
      artifactType: 'RENDERED_RESULT',
      projectId: 'proj-1',
      producer: 'IMPLEMENTATION_ENGINEER',
      consumedArtifactVersions: [
        { artifactType: 'IMPLEMENTATION_REPORT', artifactVersion: 1 }
      ]
    };

    const invalidTimestamp = {
      ...baseDoc,
      captures: [
        { tier: 'desktop', timestamp: 'not-a-date', captureState: {} }
      ]
    };
    const invalidResult = validator.validate(ArtifactType.RENDERED_RESULT, invalidTimestamp);
    expect(invalidResult.valid).toBe(false);

    const validTimestamp = {
      ...baseDoc,
      captures: [
        { tier: 'desktop', timestamp: '2026-09-01T12:00:00Z', captureState: {} }
      ]
    };
    const validResult = validator.validate(ArtifactType.RENDERED_RESULT, validTimestamp);
    expect(validResult.valid).toBe(true);
  });

  // ------------------------------------------------------------------------
  // MEDIUM-1 regression protection: the in-memory additionalProperties shim
  // must be narrow and must not weaken real instance validation.
  // ------------------------------------------------------------------------

  /** Minimal schema-valid RENDERED_RESULT document (per the canonical schema's required set). */
  const renderedResultDoc = (overrides: Record<string, unknown> = {}) => ({
    artifactId: 'art-2',
    artifactType: 'RENDERED_RESULT',
    projectId: 'proj-1',
    producer: 'IMPLEMENTATION_ENGINEER',
    consumedArtifactVersions: [
      { artifactType: 'IMPLEMENTATION_REPORT', artifactVersion: 1 }
    ],
    captures: [{ tier: 'desktop', timestamp: '2026-09-01T12:00:00Z', captureState: {} }],
    ...overrides
  });

  test('shim: initialize never modifies the canonical schema files on disk', () => {
    const root = SchemaValidator.locateSchemaRoot();
    const files = [
      path.join(root, '_common', 'artifact-envelope.schema.json'),
      ...Object.values(ARTIFACT_SCHEMA_FILES).map(f => path.join(root, f))
    ];
    const before = files.map(f => fs.readFileSync(f, 'utf-8'));

    const fresh = new SchemaValidator();
    fresh.initialize();

    const after = files.map(f => fs.readFileSync(f, 'utf-8'));
    expect(after).toEqual(before);
  });

  test('shim: only adds undeclared envelope/sibling names; preserves all constraints', () => {
    const root = SchemaValidator.locateSchemaRoot();
    const original = JSON.parse(
      fs.readFileSync(path.join(root, 'rendered-result.schema.json'), 'utf-8')
    ) as Record<string, unknown>;
    const envelope = JSON.parse(
      fs.readFileSync(path.join(root, '_common', 'artifact-envelope.schema.json'), 'utf-8')
    ) as Record<string, unknown>;

    const patched = JSON.parse(JSON.stringify(original)) as Record<string, unknown>;
    patchAdditionalPropertiesGaps(
      patched,
      Object.keys((envelope['properties'] ?? {}) as Record<string, unknown>)
    );

    const originalBranches = original['allOf'] as Record<string, unknown>[];
    const patchedBranches = patched['allOf'] as Record<string, unknown>[];
    expect(patchedBranches.length).toBe(originalBranches.length);

    const allowedNames = new Set<string>(
      Object.keys((envelope['properties'] ?? {}) as Record<string, unknown>)
    );
    for (const branch of originalBranches) {
      const props = branch['properties'] as Record<string, unknown> | undefined;
      if (props) {
        for (const key of Object.keys(props)) {
          allowedNames.add(key);
        }
      }
    }

    originalBranches.forEach((branch, i) => {
      // additionalProperties:false itself is preserved (never flipped).
      expect(patchedBranches[i]['additionalProperties']).toBe(
        branch['additionalProperties']
      );

      // required arrays are untouched.
      expect(patchedBranches[i]['required'] ?? null).toEqual(branch['required'] ?? null);

      // every pre-existing property definition is untouched.
      const originalProps = (branch['properties'] ?? {}) as Record<string, unknown>;
      const patchedProps = (patchedBranches[i]['properties'] ?? {}) as Record<string, unknown>;
      for (const key of Object.keys(originalProps)) {
        expect(patchedProps[key]).toEqual(originalProps[key]);
      }

      // only additions: every patched property name was already declared
      // somewhere in the composed schema (envelope or a sibling branch).
      if (branch['additionalProperties'] === false) {
        for (const key of Object.keys(patchedProps)) {
          expect(allowedNames.has(key)).toBe(true);
        }
      }
    });
  });

  test('shim: exactly the four known schemas carry additionalProperties:false branches', () => {
    const root = SchemaValidator.locateSchemaRoot();
    const expectedPatched = new Set([
      'rendered-result.schema.json',
      'implementation-report.schema.json',
      'refinement-plan.schema.json',
      'final-report.schema.json'
    ]);

    for (const fileName of Object.values(ARTIFACT_SCHEMA_FILES)) {
      const schema = JSON.parse(fs.readFileSync(path.join(root, fileName), 'utf-8')) as {
        allOf?: Record<string, unknown>[];
      };
      const closedBranches = (schema.allOf ?? []).filter(
        b => b['additionalProperties'] === false
      ).length;

      if (expectedPatched.has(fileName)) {
        expect(closedBranches).toBeGreaterThan(0);
      } else {
        expect(closedBranches).toBe(0);
      }
    }
  });

  test('shim: truly unknown additional properties are still rejected on a patched type', () => {
    const doc = renderedResultDoc({ totallyUnknownField: { nested: true } });
    const result = validator.validate(ArtifactType.RENDERED_RESULT, doc);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.keyword === 'additionalProperties')).toBe(true);
  });

  test('shim: missing required payload fields are still rejected on a patched type', () => {
    const doc = renderedResultDoc();
    delete (doc as Record<string, unknown>)['captures'];
    const result = validator.validate(ArtifactType.RENDERED_RESULT, doc);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.keyword === 'required')).toBe(true);
  });

  test('shim: a wrong artifactType const is still rejected on a patched type', () => {
    const doc = renderedResultDoc({ artifactType: 'BUSINESS_RESEARCH' });
    const result = validator.validate(ArtifactType.RENDERED_RESULT, doc);
    expect(result.valid).toBe(false);
  });

  test('shim: envelope fields are accepted on patched branches (the original gap)', () => {
    // This document is envelope fields + the branch's own required captures —
    // exactly the shape the unpatched schema rejected.
    const result = validator.validate(ArtifactType.RENDERED_RESULT, renderedResultDoc());
    expect(result.valid).toBe(true);
  });
});
