/**
 * Input Validation Utilities
 */

/**
 * Validate that a required field is present and non-empty
 */
export function validateRequired(fieldName, value) {
  if (value === undefined || value === null || value === '') {
    throw new Error(`${fieldName} is required`);
  }
}

/**
 * Validate email format
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error(`Invalid email format: ${email}`);
  }
}

/**
 * Validate that a value is one of the allowed values
 */
export function validateEnum(fieldName, value, allowedValues) {
  if (!allowedValues.includes(value)) {
    throw new Error(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
  }
}

/**
 * Validate string length
 */
export function validateLength(fieldName, value, { min, max }) {
  if (min !== undefined && value.length < min) {
    throw new Error(`${fieldName} must be at least ${min} characters`);
  }
  if (max !== undefined && value.length > max) {
    throw new Error(`${fieldName} must be at most ${max} characters`);
  }
}

/**
 * Validate that a value matches a pattern
 */
export function validatePattern(fieldName, value, pattern, message) {
  if (!pattern.test(value)) {
    throw new Error(message || `${fieldName} has invalid format`);
  }
}
