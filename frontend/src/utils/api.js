import axios from 'axios';

const API_BASE_URL = 'https://plusdsa.onrender.com/api';
const API_URL = API_BASE_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// CSRF token management
let csrfToken = null;

const getCSRFToken = async () => {
  if (!csrfToken) {
    try {
      const response = await api.get('/csrf-token');
      csrfToken = response.data.csrfToken;
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
    }
  }
  return csrfToken;
};

// Request interceptor to add auth token and CSRF token
api.interceptors.request.use(
  async (config) => {
    // Add authorization header
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Skip auth check for login/register/public endpoints
    const publicEndpoints = ['/auth/login', '/auth/register', '/auth/google', '/csrf-token'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    // Add CSRF protection for state-changing requests (except public endpoints)
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase()) && !isPublicEndpoint) {
      const csrf = await getCSRFToken();
      if (csrf) {
        config.headers['X-CSRF-Token'] = csrf;
      }
      
      // Ensure user is authenticated for protected operations
      if (!token) {
        throw new Error('Authentication required for this operation');
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('🚨 401 Unauthorized - Token expired or invalid');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    if (error.response?.status === 403 && error.response?.data?.error?.includes('CSRF')) {
      csrfToken = null; // Reset CSRF token
    }
    return Promise.reject(error);
  }
);

export default api;