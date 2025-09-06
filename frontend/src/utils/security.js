// Security utilities for input sanitization and CSRF protection
import DOMPurify from 'dompurify';

// Sanitize user input to prevent XSS and injection attacks
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

// Sanitize HTML content while preserving safe tags
export const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  });
};

// Generate CSRF token
export const generateCSRFToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Get CSRF token from localStorage or generate new one
export const getCSRFToken = () => {
  let token = localStorage.getItem('csrf_token');
  if (!token) {
    token = generateCSRFToken();
    localStorage.setItem('csrf_token', token);
  }
  return token;
};

// Add CSRF token to request headers
export const addCSRFHeaders = (headers = {}) => {
  return {
    ...headers,
    'X-CSRF-Token': getCSRFToken(),
    'Content-Type': 'application/json'
  };
};

// Validate authorization token
export const isAuthorized = () => {
  const token = localStorage.getItem('token');
  return token && token.length > 0;
};