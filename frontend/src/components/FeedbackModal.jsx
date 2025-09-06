import React, { useState } from 'react';
import axios from 'axios';
import Toast from './Toast';

const API_BASE_URL = 'http://localhost:5001/api';

const FeedbackModal = ({ isOpen, onClose, isDark, sheetType }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [category, setCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const handleSubmit = async () => {
    if (!feedbackText.trim()) {
      setToast({ show: true, message: 'Please enter your feedback', type: 'warning' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');
      
      await axios.post(`${API_BASE_URL}/feedback`, {
        feedback: feedbackText,
        userEmail: user.email,
        userName: user.name,
        sheetType,
        category
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setToast({ show: true, message: 'Feedback submitted successfully!', type: 'success' });
      setFeedbackText('');
      setCategory('general');
      setTimeout(onClose, 1500);
    } catch (error) {
      setToast({ show: true, message: 'Failed to submit feedback', type: 'error' });
    }
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '450px',
        backgroundColor: isDark ? '#1e293b' : 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          padding: '20px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2Z"/>
            </svg>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Feedback</h3>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Help us improve</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '6px',
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {/* Category */}
          <div style={{ marginBottom: '16px' }}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `2px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                borderRadius: '8px',
                backgroundColor: isDark ? '#334155' : '#f8fafc',
                color: isDark ? '#e2e8f0' : '#1e293b',
                fontSize: '14px'
              }}
            >
              <option value="general">💭 General Feedback</option>
              <option value="bug">🐛 Bug Report</option>
              <option value="feature">✨ Feature Request</option>
              <option value="improvement">🚀 Improvement</option>
            </select>
          </div>

          {/* Textarea */}
          <div style={{ marginBottom: '20px' }}>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Share your thoughts, report bugs, or suggest improvements..."
              style={{
                width: '100%',
                height: '100px',
                padding: '12px',
                border: `2px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                borderRadius: '8px',
                backgroundColor: isDark ? '#334155' : '#f8fafc',
                color: isDark ? '#e2e8f0' : '#1e293b',
                fontSize: '14px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
            <div style={{
              fontSize: '12px',
              color: isDark ? '#94a3b8' : '#64748b',
              marginTop: '4px',
              textAlign: 'right'
            }}>
              {feedbackText.length}/500
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 16px',
                backgroundColor: isDark ? '#475569' : '#e2e8f0',
                color: isDark ? '#e2e8f0' : '#475569',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !feedbackText.trim()}
              style={{
                padding: '10px 20px',
                background: isSubmitting || !feedbackText.trim() 
                  ? '#94a3b8' 
                  : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isSubmitting || !feedbackText.trim() ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Sending...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                  </svg>
                  Submit
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default FeedbackModal;