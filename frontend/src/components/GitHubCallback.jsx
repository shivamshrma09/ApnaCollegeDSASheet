import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';

const GitHubCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleGitHubCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        if (!code) {
          setError('GitHub authentication failed. No authorization code received.');
          setLoading(false);
          return;
        }

        // Send code to backend for token exchange
        const response = await api.post('/auth/github', {
          code,
          state
        });

        const { token, user } = response.data;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect to DSA sheet
        navigate('/dsa-sheet');
      } catch (err) {
        console.error('GitHub callback error:', err);
        setError(err.response?.data?.error || 'GitHub authentication failed');
        setLoading(false);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleGitHubCallback();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <h2>Completing GitHub Sign-In...</h2>
        <p>Please wait while we authenticate your account.</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '20px',
          maxWidth: '400px'
        }}>
          <h2 style={{ color: '#dc2626', marginBottom: '10px' }}>Authentication Failed</h2>
          <p style={{ color: '#b91c1c', marginBottom: '15px' }}>{error}</p>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Redirecting to login page in a few seconds...
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default GitHubCallback;