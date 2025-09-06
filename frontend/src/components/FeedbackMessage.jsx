import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const FeedbackMessage = ({ isDark }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    checkFeedbackMessage();
  }, []);

  const checkFeedbackMessage = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await api.get('/feedback-message/check');

      if (response.data.shouldShow) {
        setShowMessage(true);
        setTimeout(() => setIsVisible(true), 100);
      }
    } catch (error) {
      console.error('Error checking feedback message:', error);
    }
  };

  const handleClose = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.post('/feedback-message/seen', {});
      }
    } catch (error) {
      console.error('Error marking feedback message as seen:', error);
    }

    setIsVisible(false);
    setTimeout(() => setShowMessage(false), 300);
  };

  if (!showMessage) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s ease',
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <div
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #1f2937 0%, #374151 100%)' 
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: isDark ? '2px solid #4b5563' : '2px solid #e2e8f0',
          borderRadius: '16px',
          padding: '20px 24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          maxWidth: '400px',
          width: '90vw',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backdropFilter: 'blur(10px)',
          transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'all 0.3s ease'
        }}
      >
        <div
          style={{
            fontSize: '24px',
            animation: 'pulse 2s infinite'
          }}
        >
          💬
        </div>
        
        <div style={{ flex: 1 }}>
          <h4
            style={{
              margin: '0 0 4px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: isDark ? '#ffffff' : '#1f2937'
            }}
          >
            Your Feedback is Important!
          </h4>
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              color: isDark ? '#d1d5db' : '#6b7280',
              lineHeight: '1.4'
            }}
          >
            Please give us your valuable feedback to help improve the platform.
          </p>
        </div>
        
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: isDark ? '#9ca3af' : '#6b7280',
            padding: '4px',
            borderRadius: '4px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = isDark ? '#374151' : '#f3f4f6';
            e.target.style.color = isDark ? '#ffffff' : '#1f2937';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = isDark ? '#9ca3af' : '#6b7280';
          }}
        >
          ✕
        </button>
      </div>
      
      <style jsx="true">{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default FeedbackMessage;