/**
 * Basic input validator for M1.
 * 
 * Validates:
 * - Required fields present
 * - Business name not empty
 * 
 * M3: Will add full schema validation with ajv
 */
export class InputValidator {
  /**
   * Validate business input.
   * 
   * M1: Basic validation only.
   * Checks for required fields based on canonical benchmark structure.
   * 
   * Expected structure (from benchmark-001-dental):
   * - sourceDeclaration (object)
   * - businessIdentity.name (string)
   * - businessIdentity.industry (string)
   */
  validate(input: any): ValidationResult {
    const errors: string[] = [];

    // Check sourceDeclaration
    if (!input.sourceDeclaration) {
      errors.push('sourceDeclaration is required');
    }

    // Check businessIdentity
    if (!input.businessIdentity) {
      errors.push('businessIdentity is required');
    } else {
      // Check businessIdentity.name
      if (!input.businessIdentity.name) {
        errors.push('businessIdentity.name is required');
      } else if (typeof input.businessIdentity.name === 'string' && input.businessIdentity.name.trim().length === 0) {
        errors.push('businessIdentity.name cannot be empty');
      }

      // Check businessIdentity.industry
      if (!input.businessIdentity.industry) {
        errors.push('businessIdentity.industry is required');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

/**
 * Validation result.
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
