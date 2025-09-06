// Utility functions for sanitizing user input to prevent security vulnerabilities

/**
 * Sanitizes user input for logging to prevent log injection attacks
 * @param {string} input - User input to sanitize
 * @returns {string} - Sanitized input safe for logging
 */
export const sanitizeForLogging = (input) => {
  if (typeof input !== 'string') {
    return String(input);
  }
  
  // Remove or escape potentially dangerous characters
  return input
    .replace(/[\r\n]/g, '') // Remove line breaks
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '') // Remove control characters
    .replace(/[<>]/g, '') // Remove HTML brackets
    .substring(0, 200); // Limit length
};

/**
 * Sanitizes user input for general use
 * @param {string} input - User input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return String(input);
  }
  
  return input
    .replace(/[<>]/g, '') // Remove HTML brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Encodes user input for safe display
 * @param {string} input - User input to encode
 * @returns {string} - Encoded input
 */
export const encodeForDisplay = (input) => {
  if (typeof input !== 'string') {
    return String(input);
  }
  
  return encodeURIComponent(input);
};