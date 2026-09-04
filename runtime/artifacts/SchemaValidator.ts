import * as fs from 'fs';
import * as path from 'path';
import Ajv, { ErrorObject, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import { logger } from '../logging/Logger';
import { ArtifactType, ARTIFACT_SCHEMA_FILES } from './ArtifactTypes';

/**
 * Result of validating an artifact document against its schema.
 */
export interface SchemaValidationResult {
  valid: boolean;
  errors: SchemaValidationError[];
}

export interface SchemaValidationError {
  path: string;
  message: string;
  keyword: string;
}

/**
 * Locates the 04-SCHEMA directory and compiles/validates artifact documents
 * against the canonical JSON Schemas.
 *
 * DIALECT: All 04-SCHEMA/*.schema.json files declare
 * "$schema": "http://json-schema.org/draft-07/schema#" (an implementation
 * choice recorded in each schema's own $comment, not factory canon).
 * Ajv v8's default export compiles draft-07 documents without a separate
 * import (draft-06/07/2019-09/2020-12 are all supported by the core
 * package; only draft-04 requires a separate ajv-draft-04 package).
 *
 * STRICT MODE: Every canonical schema file in 04-SCHEMA/ carries numerous
 * non-standard annotation keys (e.g. "$comment_required",
 * "$comment_additionalProperties", "$comment_identity" — verified present
 * across all 11 type schemas plus the shared envelope this session). These
 * are not JSON Schema keywords Ajv recognizes, and Ajv's strict mode (the
 * default) throws on unrecognized keywords during compilation. Since the
 * schema files are canonical and frozen for this milestone's scope, this
 * validator constructs Ajv with strict:false. This ONLY affects whether
 * Ajv accepts these documents as schemas; it does not change validation
 * results against instance data (strict mode is a schema-authoring lint,
 * not a data-validation behavior — see ajv.js.org/strict-mode.html).
 *
 * FORMAT KEYWORD: exactly one canonical schema (rendered-result.schema.json)
 * uses "format": "date-time" (verified via search this session). ajv-formats
 * is registered so that keyword is actually enforced rather than silently
 * ignored or rejected under strict mode.
 */
export class SchemaValidator {
  private ajv: Ajv;
  private schemaRoot: string;
  private validators = new Map<ArtifactType, ValidateFunction>();
  private initialized = false;

  constructor(schemaRoot?: string) {
    this.schemaRoot = schemaRoot ?? SchemaValidator.locateSchemaRoot();

    this.ajv = new Ajv({
      strict: false,
      // creative-direction.schema.json carries a placeholder value under
      // "definitions.placeholder" ("Definitions will be added if needed",
      // a string rather than a schema object) that is never $ref'd anywhere
      // in that file. This is not a schema this validator can fix (frozen
      // canonical source) and it does not affect any actual validation
      // logic since nothing references it, but Ajv's meta-schema check
      // (validateSchema, separate from the strict-mode lint controlled by
      // "strict" above) rejects the whole document because of it. Disabled
      // here for the same reason strict:false is set above: this only
      // controls whether Ajv accepts a schema DOCUMENT, not what a
      // compiled validator decides about instance DATA.
      validateSchema: false,
      allErrors: true
    });
    addFormats(this.ajv);
  }

  /**
   * Locate the 04-SCHEMA directory by walking upward from this file's
   * directory.
   *
   * Robust to both ts-node execution (this file at runtime/artifacts/) and
   * compiled execution (dist/artifacts/) — both are exactly two directory
   * levels below the repository root that contains 04-SCHEMA/, but this
   * walks upward rather than hardcoding a segment count so it degrades
   * safely (throws a clear error) instead of silently resolving to the
   * wrong path if the repository is ever restructured.
   */
  static locateSchemaRoot(): string {
    let dir = __dirname;

    for (let i = 0; i < 10; i++) {
      const candidate = path.join(dir, '04-SCHEMA');
      if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
        return candidate;
      }

      const parent = path.dirname(dir);
      if (parent === dir) {
        break; // reached filesystem root
      }
      dir = parent;
    }

    throw new Error(
      `Could not locate 04-SCHEMA directory by walking upward from ${__dirname}`
    );
  }

  /**
   * Load and compile the shared envelope plus all 11 artifact type schemas.
   *
   * Idempotent: safe to call more than once; subsequent calls are no-ops.
   */
  initialize(): void {
    if (this.initialized) {
      return;
    }

    const envelopePath = path.join(this.schemaRoot, '_common', 'artifact-envelope.schema.json');
    const envelopeSchema = this.readSchemaFile(envelopePath);
    this.ajv.addSchema(envelopeSchema, envelopeSchema['$id'] as string);

    const envelopeProperties = envelopeSchema['properties'];
    const envelopePropertyNames =
      envelopeProperties && typeof envelopeProperties === 'object'
        ? Object.keys(envelopeProperties as Record<string, unknown>)
        : [];

    for (const artifactType of Object.values(ArtifactType)) {
      const fileName = ARTIFACT_SCHEMA_FILES[artifactType];
      const schemaPath = path.join(this.schemaRoot, fileName);
      const schema = this.readSchemaFile(schemaPath);

      patchAdditionalPropertiesGaps(schema, envelopePropertyNames);

      const validate = this.ajv.compile(schema);
      this.validators.set(artifactType, validate);
    }

    this.initialized = true;

    logger.info('Schema validator initialized', {
      component: 'SchemaValidator',
      schemaRoot: this.schemaRoot,
      typesLoaded: this.validators.size
    });
  }

  private readSchemaFile(filePath: string): Record<string, unknown> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Schema file not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    try {
      return JSON.parse(content) as Record<string, unknown>;
    } catch (error) {
      throw new Error(
        `Failed to parse schema file ${filePath}: ${(error as Error).message}`
      );
    }
  }

  /**
   * Validate a document against the schema for the given artifact type.
   *
   * @throws Error if initialize() has not been called
   */
  validate(artifactType: ArtifactType, document: unknown): SchemaValidationResult {
    if (!this.initialized) {
      throw new Error('SchemaValidator.initialize() must be called before validate()');
    }

    const validateFn = this.validators.get(artifactType);
    if (!validateFn) {
      throw new Error(`No compiled schema for artifact type: ${artifactType}`);
    }

    const valid = validateFn(document) as boolean;

    if (valid) {
      return { valid: true, errors: [] };
    }

    const errors = (validateFn.errors ?? []).map((e: ErrorObject) => ({
      path: e.instancePath || '/',
      message: e.message ?? 'Validation failed',
      keyword: e.keyword
    }));

    return { valid: false, errors };
  }
}

/**
 * THE M2.3-A IN-MEMORY COMPATIBILITY SHIM (MEDIUM-1) — deliberately narrow.
 *
 * Fix a JSON Schema composition gap present in several canonical artifact
 * schemas (verified: rendered-result, implementation-report, refinement-plan,
 * final-report — all schemas whose payload branch sets
 * "additionalProperties": false).
 *
 * THE GAP: "additionalProperties": false on a schema object is scoped to
 * that object's OWN "properties" key. It has no visibility into sibling
 * "allOf" branches or into a "$ref"-included schema (here, the shared
 * envelope). Several canonical schemas declare their own payload fields
 * in one allOf branch with additionalProperties:false while envelope
 * fields (artifactId, artifactType, projectId, producer, etc.) are
 * declared only in the $ref'd envelope schema. Per the JSON Schema
 * specification this makes every envelope field register as "additional"
 * from that branch's point of view, so every structurally valid document
 * for these artifact types would be rejected — a functional defect, not
 * a data problem, confirmed against Ajv's actual compiled output
 * (rendered-result.schema.json rejecting a document containing only
 * envelope-required fields plus its own required "captures").
 *
 * EXACT SCOPE (enforced by the code and proven by regression tests in
 * tests/SchemaValidator.test.ts):
 *   1. Only the TOP-LEVEL "allOf" array of a type schema is inspected; a
 *      schema without one is returned untouched.
 *   2. Only branches whose "additionalProperties" is strictly false are
 *      patched; branches with additionalProperties true/absent untouched.
 *   3. The ONLY mutation is ADDING entries to a patched branch's
 *      "properties" map — and only for names already declared in the shared
 *      envelope schema or in a sibling top-level branch of the same schema,
 *      and only when that name is not already declared by the branch. The
 *      injected value is always the fully unconstrained schema {}.
 *   4. NOTHING else is touched: "required" arrays, pre-existing property
 *      definitions (type/enum/const/pattern/minimum/...), and the
 *      "additionalProperties": false keyword itself are left exactly as
 *      they were. Weakening is therefore impossible by construction:
 *      type/enum/const/pattern constraints continue to live in whichever
 *      branch originally defined that property and continue to apply
 *      through allOf's ordinary "every branch must validate" semantics, and
 *      unknown property names (not declared anywhere in the composed
 *      schema) still register as "additional" and still fail.
 *   5. This function is PURE with respect to canonical state: it operates
 *      on the in-memory parsed copy at load time. The canonical
 *      04-SCHEMA/*.schema.json files on disk are never modified (proven by
 *      a byte-equality regression test).
 */
export function patchAdditionalPropertiesGaps(
  schema: Record<string, unknown>,
  envelopePropertyNames: string[]
): void {
  const allOf = schema['allOf'];
  if (!Array.isArray(allOf)) {
    return;
  }

  const branches = allOf.filter(
    (b): b is Record<string, unknown> => typeof b === 'object' && b !== null
  );

  const allPropertyNames = new Set<string>(envelopePropertyNames);
  for (const branch of branches) {
    const props = branch['properties'];
    if (props && typeof props === 'object') {
      for (const key of Object.keys(props as Record<string, unknown>)) {
        allPropertyNames.add(key);
      }
    }
  }

  for (const branch of branches) {
    if (branch['additionalProperties'] !== false) {
      continue;
    }

    const existingProps = (branch['properties'] as Record<string, unknown>) ?? {};
    const patchedProps: Record<string, unknown> = { ...existingProps };

    for (const name of allPropertyNames) {
      if (!(name in patchedProps)) {
        patchedProps[name] = {};
      }
    }

    branch['properties'] = patchedProps;
  }
}
