import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSpinner, FaGoogle } from 'react-icons/fa';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import GoogleSignIn from './GoogleSignIn';
import './Signup.css';

const API_BASE_URL = 'http://localhost:5001/api';


function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '650760834469-56i14787333t7i8lnh7ooo4t98g9a4q9.apps.googleusercontent.com',
          callback: handleGoogleResponse
        });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '650760834469-56i14787333t7i8lnh7ooo4t98g9a4q9.apps.googleusercontent.com',
          callback: handleGoogleResponse
        });
      }
    };
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
      localStorage.setItem('signupDate', new Date().toISOString());
      navigate('/dsa-sheet');
    } catch (err) {
      console.error('Google auth error:', err);
      setError(err.response?.data?.error || 'Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      // Simulate Google signup for demo
      const demoUser = {
        name: 'Demo User',
        email: 'demo@gmail.com',
        id: 'demo123'
      };
      
      const token = 'demo-token-' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('signupDate', new Date().toISOString());
      navigate('/dsa-sheet');
    } catch (error) {
      setError('Google authentication temporarily unavailable. Please use email signup.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Strict validation for real users only
    if (!fullName?.trim() || !email?.trim() || !password || !confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }
    
    // Block fake/demo names
    const fakeName = /^(demo|test|fake|admin|user|sample|example)$/i;
    if (fakeName.test(fullName.trim()) || fullName.trim().length < 3) {
      setError('Please enter your real full name (minimum 3 characters).');
      return;
    }
    
    // Block temporary/fake email domains
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
    
    // Strong password requirements
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError('Password must contain uppercase, lowercase, and numbers.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name: fullName,
        email,
        password
      });
      
      localStorage.setItem('signupDate', new Date().toISOString());
      
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error('Signup error:', err);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 400) {
        setError('Invalid request data. Please check all fields and try again.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Server is currently unavailable. Please try again later.');
      } else {
        setError('Failed to create account. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <div className="signup-logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img
              src={isDark ? "/dark.png" : "/light.png"}
              alt="DSA Sheet - Apna College"
              className="signup-logo"
              style={{
                height: '60px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
          <h1 className="signup-title">
            <span className="signup-title-highlight">DSA</span> Sheet
          </h1>
          <p className="signup-subtitle">Create your account and start your coding journey</p>
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
        
        <div className="signup-form-container">
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="success-message" role="alert">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSignup} className="signup-form">
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-input"
                placeholder="Enter your full name"
                required
              />
            </div>
            
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
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <>
                  <FaSpinner className="loading-spinner" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
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
          </div>

          <p className="signup-link-container">
            Already have an account?{' '}
            <Link to="/login" className="signup-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;