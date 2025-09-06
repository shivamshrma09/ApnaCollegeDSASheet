import React from 'react';
import { sanitizeInput } from '../utils/sanitizer';

const MessageList = ({ messages, isDark, getCurrentUser, onUpvote, onDownvote, onReply }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (messages.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        color: isDark ? '#9ca3af' : '#6b7280'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
        <h4 style={{ margin: '0 0 8px 0' }}>Start a conversation</h4>
        <p style={{ fontSize: '14px', margin: 0 }}>
          Share your thoughts with the community
        </p>
      </div>
    );
  }

  return (
    <>
      {messages.map((message, index) => {
        const isOwn = message.user.id === getCurrentUser().id;
        const sanitizedText = sanitizeInput(message.text);
        
        return (
          <div key={`${message.id}-${index}`} style={{
            marginBottom: '16px',
            display: 'flex',
            justifyContent: isOwn ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              maxWidth: '70%',
              background: isOwn ? '#3b82f6' : (isDark ? '#374151' : '#ffffff'),
              color: isOwn ? 'white' : (isDark ? '#ffffff' : '#1f2937'),
              padding: '12px 16px',
              borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {!isOwn && (
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '4px',
                  color: '#25d366'
                }}>
                  {sanitizeInput(message.user.name)}
                </div>
              )}
              <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                {sanitizedText}
              </div>
              <div style={{
                fontSize: '11px',
                marginTop: '4px',
                opacity: 0.7,
                textAlign: 'right'
              }}>
                {formatTime(message.timestamp)}
              </div>
              
              {/* Message Actions */}
              <div style={{
                display: 'flex',
                gap: '6px',
                marginTop: '6px',
                justifyContent: isOwn ? 'flex-end' : 'flex-start',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => onUpvote(message.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    color: isOwn ? 'rgba(255,255,255,0.8)' : (isDark ? '#9ca3af' : '#6b7280'),
                    fontSize: '11px',
                    padding: '2px 4px',
                    borderRadius: '4px'
                  }}
                >
                  ↑ {message.upvotes || 0}
                </button>
                
                <button
                  onClick={() => onDownvote(message.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    color: isOwn ? 'rgba(255,255,255,0.8)' : (isDark ? '#9ca3af' : '#6b7280'),
                    fontSize: '11px',
                    padding: '2px 4px',
                    borderRadius: '4px'
                  }}
                >
                  ↓ {message.downvotes || 0}
                </button>
                
                <button
                  onClick={() => onReply(message)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    color: isOwn ? 'rgba(255,255,255,0.8)' : (isDark ? '#9ca3af' : '#6b7280'),
                    fontSize: '11px',
                    padding: '2px 4px',
                    borderRadius: '4px'
                  }}
                >
                  ↩ Reply
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default MessageList;