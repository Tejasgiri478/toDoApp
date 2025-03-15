import { AppError } from './errorHandler.js';

/**
 * Middleware for validating request data
 * @param {Object} schema - Validation schema object with body, query, params properties
 * @returns {Function} Express middleware function
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const validationErrors = {};
    
    // Validate request body if schema.body exists
    if (schema.body) {
      const { error } = validateData(req.body, schema.body);
      if (error) validationErrors.body = formatErrors(error);
    }
    
    // Validate request query parameters if schema.query exists
    if (schema.query) {
      const { error } = validateData(req.query, schema.query);
      if (error) validationErrors.query = formatErrors(error);
    }
    
    // Validate request path parameters if schema.params exists
    if (schema.params) {
      const { error } = validateData(req.params, schema.params);
      if (error) validationErrors.params = formatErrors(error);
    }
    
    // If there are validation errors, return a 400 Bad Request response
    if (Object.keys(validationErrors).length > 0) {
      return next(new AppError('Validation error', 400, validationErrors));
    }
    
    // If validation passes, proceed to the next middleware
    next();
  };
};

/**
 * Simple validation function
 * This is a placeholder for a more robust validation library like Joi or Yup
 * @param {Object} data - Data to validate
 * @param {Object} schema - Schema to validate against
 * @returns {Object} Validation result
 */
const validateData = (data, schema) => {
  const errors = [];
  
  // Check required fields
  if (schema.required) {
    for (const field of schema.required) {
      if (data[field] === undefined) {
        errors.push({ field, message: `${field} is required` });
      }
    }
  }
  
  // Check field types and constraints
  if (schema.properties) {
    for (const [field, rules] of Object.entries(schema.properties)) {
      if (data[field] !== undefined) {
        // Type validation
        if (rules.type && !validateType(data[field], rules.type)) {
          errors.push({ field, message: `${field} must be a ${rules.type}` });
        }
        
        // String length validation
        if (rules.type === 'string') {
          if (rules.minLength && data[field].length < rules.minLength) {
            errors.push({ field, message: `${field} must be at least ${rules.minLength} characters` });
          }
          if (rules.maxLength && data[field].length > rules.maxLength) {
            errors.push({ field, message: `${field} must be at most ${rules.maxLength} characters` });
          }
        }
        
        // Number range validation
        if (rules.type === 'number') {
          if (rules.minimum !== undefined && data[field] < rules.minimum) {
            errors.push({ field, message: `${field} must be at least ${rules.minimum}` });
          }
          if (rules.maximum !== undefined && data[field] > rules.maximum) {
            errors.push({ field, message: `${field} must be at most ${rules.maximum}` });
          }
        }
        
        // Pattern validation
        if (rules.pattern && !new RegExp(rules.pattern).test(data[field])) {
          errors.push({ field, message: rules.patternMessage || `${field} has invalid format` });
        }
      }
    }
  }
  
  return errors.length > 0 ? { error: errors } : { value: data };
};

/**
 * Validate data type
 * @param {any} value - Value to validate
 * @param {string} type - Expected type
 * @returns {boolean} Whether the value matches the expected type
 */
const validateType = (value, type) => {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && !isNaN(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'object':
      return typeof value === 'object' && value !== null && !Array.isArray(value);
    case 'array':
      return Array.isArray(value);
    default:
      return true;
  }
};

/**
 * Format validation errors
 * @param {Array} errors - Array of error objects
 * @returns {Object} Formatted errors
 */
const formatErrors = (errors) => {
  const formattedErrors = {};
  
  for (const error of errors) {
    formattedErrors[error.field] = error.message;
  }
  
  return formattedErrors;
}; 