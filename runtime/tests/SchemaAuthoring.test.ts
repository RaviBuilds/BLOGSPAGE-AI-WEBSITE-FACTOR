/**
 * Schema authoring guard -- M2.3-A BLOCKER-4.
 *
 * The runtime SchemaValidator compiles the canonical 04-SCHEMA files with
 * Ajv strict:false and validateSchema:false, because one canonical schema
 * (creative-direction.schema.json) carries a non-schema placeholder under
 * "definitions.placeholder" that Ajv's meta-schema rejects -- and canonical
 * schemas are NOT editable at the implementation layer (schema-architecture
 * decision 1: a schema/canon divergence is a factory-level defect routed to
 * NEEDS_HUMAN_REVIEW, not patched locally).
 *
 * Runtime instance validation is NOT weakened by those flags: they govern
 * whether Ajv accepts a schema DOCUMENT, not what a compiled validator
 * decides about instance DATA. But with validateSchema:false, an authoring
 * mistake in ANY canonical schema -- a misspelled keyword, an unknown
 * construct, an unresolved ref -- is accepted silently, compiles to a
 * validator that enforces nothing, and produces FALSE PASSES on every
 * condition that depends on schema validation.
 *
 * This test is the narrowest mitigation (authoring-time, not runtime): it
 * compiles every 04-SCHEMA schema file with a SEPARATE Ajv instance
 * configured strict:true / validateSchema:true / allErrors:true, and
 * asserts that each file either compiles cleanly or fails ONLY with a
 * violation on the explicit allow-list below. Any NEW violation fails.
 *
 * The runtime SchemaValidator configuration is deliberately left untouched.
 */

import * as fs from 'fs';
import * as path from 'path';
import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';

/** One explicitly tolerated, documented canonical schema authoring defect. */
interface AuthoringDefect {
  file: string;
  messageMatches: string;
  reason: string;
}

const AUTHORING_DEFECT_ALLOW_LIST: AuthoringDefect[] = [
  {
    file: '04-SCHEMA/creative-direction.schema.json',
    messageMatches: 'definitions/placeholder',
    reason:
      'definitions.placeholder is the string "Definitions will be added if needed" ' +
      'rather than a schema object, and is never $ref-ed anywhere, so it affects ' +
      'no instance validation. Editing the canonical file is a factory-level ' +
      'decision, so the runtime validator disables document-level checking and ' +
      'THIS test pins the defect instead of letting it multiply silently.'
  },
  // strictTypes family: these canonical schemas place properties/required/
  // minItems in an allOf arm without a sibling "type" keyword. This does NOT
  // weaken instance validation here (the referenced envelope arm of the same
  // allOf enforces type "object"), but it is strict-mode authoring debt that
  // belongs to the factory layer, not the implementation layer. Each entry
  // pins the EXACT JSON pointer, so a NEW strictTypes violation at any other
  // pointer still fails this test.
  {
    file: '04-SCHEMA/asset-inventory.schema.json',
    messageMatches: '#/allOf/1',
    reason: 'strictTypes: properties without sibling type "object" in the allOf payload arm.'
  },
  {
    file: '04-SCHEMA/brand-profile.schema.json',
    messageMatches: '#/allOf/1',
    reason: 'strictTypes: properties without sibling type "object" in the allOf payload arm.'
  },
  {
    file: '04-SCHEMA/business-intelligence.schema.json',
    messageMatches: '#/allOf/1',
    reason: 'strictTypes: properties without sibling type "object" in the allOf payload arm.'
  },
  {
    file: '04-SCHEMA/business-research.schema.json',
    messageMatches: '#/allOf/1',
    reason: 'strictTypes: properties without sibling type "object" in the allOf payload arm.'
  },
  {
    file: '04-SCHEMA/critic-report.schema.json',
    messageMatches: '#/allOf/1',
    reason: 'strictTypes: required without sibling type "object" in the allOf payload arm.'
  },
  {
    file: '04-SCHEMA/design-blueprint.schema.json',
    messageMatches: '#/allOf/2/properties/registryVersions',
    reason: 'strictTypes: required without sibling type "object" under registryVersions.'
  },
  {
    file: '04-SCHEMA/final-report.schema.json',
    messageMatches: '#/allOf/1',
    reason: 'strictTypes: required without sibling type "object" in the allOf payload arm.'
  },
  {
    file: '04-SCHEMA/implementation-report.schema.json',
    messageMatches: '#/allOf/2/properties/registryVersions',
    reason: 'strictTypes: required without sibling type "object" under registryVersions.'
  },
  {
    file: '04-SCHEMA/refinement-plan.schema.json',
    messageMatches: '#/allOf/1',
    reason: 'strictTypes: required without sibling type "object" in the allOf payload arm.'
  },
  {
    file: '04-SCHEMA/rendered-result.schema.json',
    messageMatches: '#/allOf/2/properties/consumedArtifactVersions',
    reason: 'strictTypes: minItems without sibling type "array" under consumedArtifactVersions.'
  }
];

function findSchemaRoot(): string {
  let dir = __dirname;
  for (let i = 0; i < 10; i++) {
    const candidate = path.join(dir, '04-SCHEMA');
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error('Could not locate 04-SCHEMA directory by walking upward from ' + __dirname);
}

function enumerateSchemaFiles(root: string): string[] {
  const results: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith('.schema.json')) {
        results.push(full);
      }
    }
  };
  walk(root);
  return results.sort();
}

/**
 * Remove the documented "$comment..." annotation keys from an in-memory
 * schema copy. The canonical schemas cite factory canon in keys such as
 * "$comment_required" -- pure documentation with no validation semantics
 * (Ajv refuses to register custom keywords with a "$" prefix, since "$" is
 * reserved, so in-place registration is not possible and the keys must go).
 *
 * Deleting them from the in-memory copy changes NOTHING about what the
 * compiled validator enforces. Every OTHER unknown keyword -- a misspelled
 * "required", "additionalProperties", or a typo'd "$commment" that no longer
 * matches this prefix -- remains a strict-mode ERROR. That is exactly the
 * mistake class this guard exists to catch: an unknown validation keyword
 * compiles to a validator that silently enforces nothing.
 */
function stripCommentAnnotationKeys(node: unknown): void {
  if (Array.isArray(node)) {
    for (const item of node) stripCommentAnnotationKeys(item);
    return;
  }
  if (node !== null && typeof node === 'object') {
    for (const key of Object.keys(node)) {
      if (key.startsWith('$comment')) {
        delete (node as Record<string, unknown>)[key];
      } else {
        stripCommentAnnotationKeys((node as Record<string, unknown>)[key]);
      }
    }
  }
}

function compileStrict(
  schemaPath: string,
  schemaRoot: string
): { ok: true } | { ok: false; errors: string[] } {
  const ajv = new Ajv({
    strict: true,
    validateSchema: true,
    allErrors: true
  });
  addFormats(ajv);

  const envelopePath = path.join(schemaRoot, '_common', 'artifact-envelope.schema.json');
  const envelope = JSON.parse(fs.readFileSync(envelopePath, 'utf-8'));
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));

  // Drop the documented "$comment*" annotation convention from the in-memory
  // copies (see above); $id and all validation-relevant keys are preserved.
  stripCommentAnnotationKeys(envelope);
  stripCommentAnnotationKeys(schema);

  // Pre-load the shared envelope under its $id so relative $refs resolve,
  // mirroring the runtime SchemaValidator's loading order. When compiling the
  // envelope itself, skip the pre-load: registering it twice under the same
  // $id is an Ajv duplicate-id error, not a schema defect.
  const isEnvelopeFile = path.resolve(schemaPath) === path.resolve(envelopePath);
  if (!isEnvelopeFile) {
    ajv.addSchema(envelope, envelope['$id'] as string);
  }

  try {
    ajv.compile(schema);
    return { ok: true };
  } catch (error) {
    const err = error as Error & { errors?: ErrorObject[] };
    if (Array.isArray(err.errors) && err.errors.length > 0) {
      return {
        ok: false,
        errors: err.errors.map(e => `${e.instancePath || '/'}: ${e.message} (${e.keyword})`)
      };
    }
    return { ok: false, errors: [err.message] };
  }
}

describe('canonical schema authoring guard (M2.3-A BLOCKER-4)', () => {
  const schemaRoot = findSchemaRoot();
  const schemaFiles = enumerateSchemaFiles(schemaRoot);

  test('04-SCHEMA contains the expected schema population', () => {
    // 11 artifact type schemas + the shared envelope. A new file is a
    // factory-level change and must be added here deliberately.
    expect(schemaFiles.length).toBe(12);
  });

  test('every canonical schema compiles under strict Ajv or fails ONLY with an allow-listed authoring defect', () => {
    const unexplained: { file: string; errors: string[] }[] = [];
    const allowListedSeen: AuthoringDefect[] = [];

    for (const filePath of schemaFiles) {
      // Repo-root-relative POSIX path, independent of process.cwd(): the
      // allow-list keys on '04-SCHEMA/<file>', and jest runs from runtime/.
      const relative =
        '04-SCHEMA/' + path.relative(schemaRoot, filePath).split(path.sep).join('/');
      const result = compileStrict(filePath, schemaRoot);
      if (result.ok) {
        for (const entry of AUTHORING_DEFECT_ALLOW_LIST.filter(a => a.file === relative)) {
          throw new Error(
            'Allow-listed authoring defect in ' + relative + ' no longer reproduces. ' +
              'Remove the stale allow-list entry. Original reason: ' + entry.reason
          );
        }
        continue;
      }

      const combined = result.errors.join('\n');
      for (const entry of AUTHORING_DEFECT_ALLOW_LIST.filter(a => a.file === relative)) {
        if (combined.includes(entry.messageMatches)) {
          allowListedSeen.push(entry);
        }
      }

      const remaining = result.errors.filter(
        e =>
          !AUTHORING_DEFECT_ALLOW_LIST.some(
            a => a.file === relative && e.includes(a.messageMatches)
          )
      );
      if (remaining.length > 0) {
        unexplained.push({ file: relative, errors: remaining });
      }
    }

    // Every allow-list entry must have actually matched a live violation;
    // none may silently stop applying.
    expect(allowListedSeen.length).toBe(AUTHORING_DEFECT_ALLOW_LIST.length);

    if (unexplained.length > 0) {
      const detail = unexplained
        .map(u => u.file + ':\n  ' + u.errors.join('\n  '))
        .join('\n');
      throw new Error(
        'New canonical schema authoring violation(s) detected. Canonical ' +
          'schemas are not edited at the implementation layer: raise a ' +
          'factory-level defect. If a violation is genuinely tolerated, add ' +
          'a precise, reasoned allow-list entry.\n\n' + detail
      );
    }
  });

  test('the runtime SchemaValidator still accepts every canonical schema document', () => {
    // Guard against "fixing" the authoring problem by breaking runtime
    // loading: the runtime instance (strict:false, validateSchema:false)
    // must keep compiling all schemas.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { SchemaValidator } = require('../artifacts/SchemaValidator');
    const validator = new SchemaValidator(schemaRoot);
    expect(() => validator.initialize()).not.toThrow();
  });
});
