// Input validation and sanitization utilities
import { ValidationError } from './errors';

export interface ValidationRules {
  [key: string]: {
    required?: boolean;
    type?: 'string' | 'number' | 'email' | 'phone' | 'url' | 'date' | 'boolean';
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
    message?: string;
  };
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\d\s\-\+\(\)]+$/;
const urlRegex = /^https?:\/\/.+/;

export const validate = (data: Record<string, any>, rules: ValidationRules): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];

    // Check required
    if (rule.required && (value === null || value === undefined || value === '')) {
      errors[field] = rule.message || `${field} is required`;
      continue;
    }

    if (value === null || value === undefined || value === '') {
      continue; // Skip further validation if not required and empty
    }

    // Type validation
    if (rule.type) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;

      if (rule.type === 'email' && !emailRegex.test(String(value))) {
        errors[field] = rule.message || `${field} must be a valid email`;
        continue;
      }

      if (rule.type === 'phone' && !phoneRegex.test(String(value))) {
        errors[field] = rule.message || `${field} must be a valid phone number`;
        continue;
      }

      if (rule.type === 'url' && !urlRegex.test(String(value))) {
        errors[field] = rule.message || `${field} must be a valid URL`;
        continue;
      }

      if (rule.type === 'date') {
        try {
          new Date(value).toISOString();
        } catch {
          errors[field] = rule.message || `${field} must be a valid date`;
          continue;
        }
      }

      if (
        rule.type !== 'email' &&
        rule.type !== 'phone' &&
        rule.type !== 'url' &&
        rule.type !== 'date' &&
        actualType !== rule.type
      ) {
        errors[field] = rule.message || `${field} must be of type ${rule.type}`;
        continue;
      }
    }

    // Length validation
    if (rule.minLength && String(value).length < rule.minLength) {
      errors[field] = rule.message || `${field} must be at least ${rule.minLength} characters`;
      continue;
    }

    if (rule.maxLength && String(value).length > rule.maxLength) {
      errors[field] = rule.message || `${field} must not exceed ${rule.maxLength} characters`;
      continue;
    }

    // Numeric validation
    if (rule.min !== undefined && Number(value) < rule.min) {
      errors[field] = rule.message || `${field} must be at least ${rule.min}`;
      continue;
    }

    if (rule.max !== undefined && Number(value) > rule.max) {
      errors[field] = rule.message || `${field} must not exceed ${rule.max}`;
      continue;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(String(value))) {
      errors[field] = rule.message || `${field} format is invalid`;
      continue;
    }

    // Custom validation
    if (rule.custom) {
      const customResult = rule.custom(value);
      if (customResult !== true) {
        errors[field] = typeof customResult === 'string' ? customResult : (rule.message || `${field} is invalid`);
      }
    }
  }

  return errors;
};

export const validateAndThrow = (data: Record<string, any>, rules: ValidationRules): void => {
  const errors = validate(data, rules);
  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Validation failed', errors);
  }
};

// Sanitization utilities
export const sanitize = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const sanitizeObject = (obj: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitize(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((v) => (typeof v === 'string' ? sanitize(v) : v));
    } else if (value !== null && typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

export const trimString = (value: any): any => {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (Array.isArray(value)) {
    return value.map((v) => trimString(v));
  }
  if (value !== null && typeof value === 'object') {
    const trimmed: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      trimmed[k] = trimString(v);
    }
    return trimmed;
  }
  return value;
};
