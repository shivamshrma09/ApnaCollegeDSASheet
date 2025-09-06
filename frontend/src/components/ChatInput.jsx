import React, { useCallback } from 'react';
import { sanitizeInput } from '../utils/sanitizer';

const ChatInput = ({ 
  newMessage, 
  setNewMessage, 
  onSendMessage, 
  onTyping, 
  isDark,
  showEmojiPicker,
  setShowEmojiPicker 
}) => {
  const handleSend = useCallback(() => {
    if (newMessage.trim()) {
      onSendMessage();
    }
  }, [newMessage, onSendMessage]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  }, [handleSend]);

  const handleInputChange = useCallback((e) => {
    const sanitized = sanitizeInput(e.target.value);
    setNewMessage(sanitized);
    onTyping();
  }, [setNewMessage, onTyping]);

  return (
    <div style={{
      padding: '16px',
      borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
      background: isDark ? '#1f2937' : '#ffffff'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        background: isDark ? '#374151' : '#f3f4f6',
        borderRadius: '24px',
        padding: '8px 16px'
      }}>
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isDark ? '#9ca3af' : '#6b7280',
            padding: '4px'
          }}
        >
          😊
        </button>
        
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            color: isDark ? '#ffffff' : '#1f2937',
            fontSize: '14px',
            outline: 'none',
            padding: '8px 0'
          }}
        />
        
        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          style={{
            background: newMessage.trim() ? '#3b82f6' : (isDark ? '#4b5563' : '#d1d5db'),
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default ChatInput;