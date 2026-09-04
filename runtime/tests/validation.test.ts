import { InputValidator } from '../workspace/InputValidator';

/**
 * Input validation tests.
 * 
 * M1: Basic validation only.
 * M3: Will add full schema validation tests.
 */
describe('InputValidator', () => {
  let validator: InputValidator;

  beforeAll(() => {
    validator = new InputValidator();
  });

  test('should pass validation for complete input', () => {
    const input = {
      sourceDeclaration: {
        type: 'SYNTHETIC_TEST',
        primaryMethod: 'client-interview'
      },
      businessIdentity: {
        name: 'Test Business',
        industry: 'Professional Services',
        businessType: 'Test Type'
      }
    };

    const result = validator.validate(input);
    
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should fail validation for missing sourceDeclaration', () => {
    const input = {
      businessIdentity: {
        name: 'Test Business',
        industry: 'Professional Services'
      }
    };

    const result = validator.validate(input);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('sourceDeclaration is required');
  });

  test('should fail validation for missing businessIdentity', () => {
    const input = {
      sourceDeclaration: {
        type: 'SYNTHETIC_TEST'
      }
    };

    const result = validator.validate(input);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('businessIdentity is required');
  });

  test('should fail validation for missing businessIdentity.name', () => {
    const input = {
      sourceDeclaration: {
        type: 'SYNTHETIC_TEST'
      },
      businessIdentity: {
        industry: 'Professional Services'
      }
    };

    const result = validator.validate(input);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('businessIdentity.name is required');
  });

  test('should fail validation for empty businessIdentity.name', () => {
    const input = {
      sourceDeclaration: {
        type: 'SYNTHETIC_TEST'
      },
      businessIdentity: {
        name: '   ',
        industry: 'Professional Services'
      }
    };

    const result = validator.validate(input);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('businessIdentity.name cannot be empty');
  });

  test('should fail validation for missing businessIdentity.industry', () => {
    const input = {
      sourceDeclaration: {
        type: 'SYNTHETIC_TEST'
      },
      businessIdentity: {
        name: 'Test Business'
      }
    };

    const result = validator.validate(input);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('businessIdentity.industry is required');
  });

  test('should collect multiple validation errors', () => {
    const input = {};

    const result = validator.validate(input);
    
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });

  test('should handle null businessIdentity', () => {
    const input = {
      sourceDeclaration: { type: 'SYNTHETIC_TEST' },
      businessIdentity: null
    };

    const result = validator.validate(input);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('businessIdentity is required');
  });

  test('should handle undefined businessIdentity.name', () => {
    const input = {
      sourceDeclaration: { type: 'SYNTHETIC_TEST' },
      businessIdentity: {
        industry: 'Test Industry',
        name: undefined
      }
    };

    const result = validator.validate(input);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('businessIdentity.name is required');
  });

  test('should handle non-string businessIdentity.name', () => {
    const input = {
      sourceDeclaration: { type: 'SYNTHETIC_TEST' },
      businessIdentity: {
        name: 123,
        industry: 'Test Industry'
      }
    };

    const result = validator.validate(input);
    
    // Should pass type check (validator doesn't enforce types in M1, just presence)
    expect(result.valid).toBe(true);
  });

  test('should fail validation for whitespace-only businessIdentity.name', () => {
    const input = {
      sourceDeclaration: { type: 'SYNTHETIC_TEST' },
      businessIdentity: {
        name: '   ',
        industry: 'Test Industry'
      }
    };

    const result = validator.validate(input);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('businessIdentity.name cannot be empty');
  });

  test('should fail validation for empty string businessIdentity.name', () => {
    const input = {
      sourceDeclaration: { type: 'SYNTHETIC_TEST' },
      businessIdentity: {
        name: '',
        industry: 'Test Industry'
      }
    };

    const result = validator.validate(input);
    
    expect(result.valid).toBe(false);
    // Empty string triggers !input.businessIdentity.name check first
    expect(result.errors).toContain('businessIdentity.name is required');
  });
});
