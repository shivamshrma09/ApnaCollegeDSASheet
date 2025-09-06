import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSpinner, FaGoogle, FaLinkedin } from 'react-icons/fa';
import api from '../utils/api';
import GoogleSignIn from './GoogleSignIn';
import { useTheme } from '../contexts/ThemeContext';
import './Login.css';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || null;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // Skip Google OAuth if disabled
    if (!GOOGLE_CLIENT_ID) return;
    
    const loadGoogleScript = () => {
      if (window.google) {
        initializeGoogle();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    };

    const initializeGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });
      }
    };

    loadGoogleScript();
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);
      setError('');
      
      const result = await api.post('/auth/google', {
        token: response.credential,
        name: response.name,
        email: response.email,
        avatar: response.avatar
      });
      
      const { token, user } = result.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dsa-sheet');
    } catch (err) {
      console.error('Google auth error:', err);
      setError(err.response?.data?.error || 'Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    try {
      if (window.google) {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback to renderButton if prompt fails
            const buttonDiv = document.getElementById('google-signin-button');
            if (buttonDiv) {
              window.google.accounts.id.renderButton(buttonDiv, {
                theme: 'outline',
                size: 'large',
                width: '100%'
              });
            }
          }
        });
      } else {
        setError('Google Sign-In not loaded. Please refresh the page.');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError('Google authentication failed. Please try again.');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email?.trim() || !password) {
      setError('Email and password are required');
      return;
    }
    
    // Block fake email domains
    const fakeEmailDomains = [
      'tempmail.org', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
      'temp-mail.org', 'throwaway.email', 'example.com', 'test.com', 'fake.com'
    ];
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (fakeEmailDomains.includes(emailDomain)) {
      setError('Please use a valid email address from a real email provider.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      console.log('🚀 Attempting login for:', email);
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      console.log('✅ Login response received:', response.data);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('✅ Login successful, navigating to DSA sheet');
      window.location.href = '/dsa-sheet';
    } catch (err) {
      console.error('❌ Login error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Invalid email or password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img
              src={isDark ? "/dark.png" : "/light.png"}
              alt="DSA Sheet - Apna College"
              className="login-logo"
              style={{
                height: '60px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
          <h1 className="login-title">
            <span className="login-title-highlight">DSA</span> Sheet
          </h1>
          <p className="login-subtitle">Sign in to continue your coding journey</p>
          <button 
            onClick={toggleTheme}
            className="dark-mode-toggle"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              transition: 'background-color 0.2s ease'
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
        
        <div className="login-form-container">
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={submitHandler} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
            
            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox"
                />
                <span className="checkbox-label">Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <>
                  <FaSpinner className="loading-spinner" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>





          <p className="signup-link-container">
            Don't have an account?{' '}
            <Link to="/signup" className="signup-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}