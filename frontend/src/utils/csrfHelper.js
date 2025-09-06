// CSRF Token Helper
let csrfToken = null;
let tokenPromise = null;

export const getCSRFToken = async () => {
  if (csrfToken) return csrfToken;
  if (tokenPromise) return tokenPromise;
  
  tokenPromise = fetchCSRFToken();
  try {
    csrfToken = await tokenPromise;
    return csrfToken;
  } finally {
    tokenPromise = null;
  }
};

const fetchCSRFToken = async () => {
  try {
    const response = await fetch('http://localhost:5001/api/csrf-token', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.csrfToken;
    }
  } catch (error) {
    // Silently fail for now
  }
  
  return null;
};

export const getAuthHeaders = async () => {
  const token = localStorage.getItem('token');
  const csrfToken = await getCSRFToken();
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  
  // Add CSRF token if available
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }
  
  return headers;
};

export const resetCSRFToken = () => {
  csrfToken = null;
  tokenPromise = null;
};