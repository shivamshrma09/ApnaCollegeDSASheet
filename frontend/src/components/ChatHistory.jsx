import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const API_BASE_URL = 'https://plusdsa.onrender.com/api';

const ChatHistory = ({ isOpen, onClose, userId }) => {
  const { isDark } = useTheme();
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchRecentChats();
    }
  }, [isOpen]);

  const fetchRecentChats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/discussion/recent`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setRecentChats(response.data);
    } catch (error) {
      console.error('Error fetching recent chats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 1500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '600px',
        height: '70%',
        backgroundColor: isDark ? '#1f2937' : 'white',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        border: isDark ? '1px solid #374151' : '1px solid #e5e7eb'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
          color: 'white'
        }}>
          <h3 style={{ color: 'white', margin: 0, fontSize: '16px', fontWeight: '600' }}>
            💬 Chat History
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          backgroundColor: isDark ? '#111827' : '#f8fafc'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: isDark ? '#9ca3af' : '#6b7280' }}>
              Loading chat history...
            </div>
          ) : recentChats.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: isDark ? '#9ca3af' : '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💭</div>
              <h3>No Recent Chats</h3>
              <p>Start discussing problems to see your chat history here!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentChats.map((chat, index) => (
                <div key={index} style={{
                  padding: '12px',
                  background: isDark ? '#374151' : 'white',
                  borderRadius: '12px',
                  border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <h4 style={{
                      margin: 0,
                      fontSize: '14px',
                      fontWeight: '600',
                      color: isDark ? '#e5e7eb' : '#1f2937'
                    }}>
                      🔢 Problem #{chat.problemId}
                    </h4>
                    <span style={{
                      fontSize: '11px',
                      color: isDark ? '#9ca3af' : '#6b7280'
                    }}>
                      {new Date(chat.lastMessage).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: '13px',
                    color: isDark ? '#d1d5db' : '#374151',
                    lineHeight: '1.4'
                  }}>
                    {chat.lastMessageContent?.substring(0, 100)}
                    {chat.lastMessageContent?.length > 100 ? '...' : ''}
                  </p>
                  <div style={{
                    marginTop: '8px',
                    fontSize: '11px',
                    color: '#10b981'
                  }}>
                    💬 {chat.messageCount} messages
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;