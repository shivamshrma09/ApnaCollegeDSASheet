const validator = require('validator');

const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return String(input);
  }
  
  // Remove potential XSS and injection attempts
  return validator.escape(input.trim());
};

const sanitizeForLog = (input) => {
  if (typeof input !== 'string') {
    input = String(input);
  }
  
  // Remove newlines and control characters to prevent log injection
  return input.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '').substring(0, 1000);
};

const sanitizeObject = (obj) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

module.exports = { sanitizeInput, sanitizeForLog, sanitizeObject };