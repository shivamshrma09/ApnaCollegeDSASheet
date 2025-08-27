import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSpinner, FaGoogle, FaLinkedin } from 'react-icons/fa';
import axios from 'axios';
import GoogleSignIn from './GoogleSignIn';
import QuickGoogleAuth from './QuickGoogleAuth';
import './Login.css';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://apnacollegedsasheet.onrender.com') + '/api';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '650760834469-56i14787333t7i8lnh7ooo4t98g9a4q9.apps.googleusercontent.com';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
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
      
      const result = await axios.post(`${API_BASE_URL}/auth/google`, {
        token: response.credential
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
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      navigate('/dsa-sheet');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img
            src="/logo.png"
            alt="Logo"
            className="login-logo"
          />
          <h1 className="login-title">
            <span className="login-title-highlight">DSA</span> Sheet
          </h1>
          <p className="login-subtitle">Sign in to continue</p>
          <button 
            onClick={() => {
              document.body.classList.toggle('dark');
              localStorage.setItem('darkMode', document.body.classList.contains('dark'));
            }}
            className="dark-mode-toggle"
          >
            🌙
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

          <div className="divider-container">
            <div className="divider-line">
              <div className="divider-border" />
            </div>
            <div className="divider-text-container">
              <span className="divider-text">
                Or continue with
              </span>
            </div>
          </div>

          <div className="social-buttons">
            <div className="google-signin-wrapper">
              <GoogleSignIn 
                onSuccess={handleGoogleResponse}
                onError={(error) => setError('Google authentication failed: ' + error)}
              />
            </div>
            <button
              onClick={() => alert('LinkedIn login')}
              className="social-button"
            >
              <FaLinkedin className="social-icon linkedin-icon" />
              LinkedIn
            </button>
          </div>

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