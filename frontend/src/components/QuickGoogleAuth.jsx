import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import axios from 'axios';

const QuickGoogleAuth = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleQuickGoogleAuth = async () => {
    try {
      setLoading(true);
      
      const googleUserData = {
        name: 'Google User',
        email: `user${Date.now()}@gmail.com`
      };

      const API_BASE_URL = 'http://localhost:5001/api';
      
      const response = await axios.post(`${API_BASE_URL}/auth/quick-google`, {
        name: googleUserData.name,
        email: googleUserData.email
      });

      onSuccess(response.data);
    } catch (error) {
      onError(error.response?.data?.error || error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleQuickGoogleAuth}
      disabled={loading}
      className="social-button"
      style={{ gridColumn: '1 / -1', marginBottom: '8px' }}
    >
      <FaGoogle className="social-icon google-icon" />
      {loading ? 'Signing in...' : 'Continue with Google'}
    </button>
  );
};

export default QuickGoogleAuth;