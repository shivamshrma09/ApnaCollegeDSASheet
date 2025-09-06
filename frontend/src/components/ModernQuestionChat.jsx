import React, { useState, useEffect, useRef } from 'react';
import './ModernQuestionChat.css';

const ModernQuestionChat = ({ isOpen, onClose, questionId, questionTitle }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [username, setUsername] = useState('');
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(['AI Assistant', 'John Doe', 'Sarah Smith', 'Mike Johnson']);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [pendingReplies, setPendingReplies] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const savedUsername = localStorage.getItem('username') || 'Anonymous';
      setUsername(savedUsername);
      loadMessages();
    }
  }, [isOpen, questionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || `http://localhost:${import.meta.env.VITE_PORT || 5001}/api`}/question-chat/${questionId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(Array.isArray(data.messages) ? data.messages : []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const messageText = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || `http://localhost:${import.meta.env.VITE_PORT || 5001}/api`}/question-chat/${questionId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          senderName: username,
          senderId: localStorage.getItem('userId') || '64f8a1b2c3d4e5f6a7b8c9d0',
          isQuestion: isAIEnabled,
          problemTitle: questionTitle
        })
      });

      if (response.ok) {
        const newMessage = {
          _id: Date.now().toString(),
          senderName: username,
          message: messageText,
          timestamp: new Date().toISOString(),
          isAI: false
        };
        
        // Add user message immediately
        setMessages(prev => [...prev, newMessage]);
        
        // If AI mode is ON, AI will respond + users can also reply
        if (isAIEnabled) {
          // AI Response (simulated)
          setTimeout(() => {
            const aiResponse = {
              _id: (Date.now() + 1).toString(),
              senderName: 'AI Assistant',
              message: `🤖 Great question! For this DSA problem, I'd suggest starting with understanding the problem constraints and then thinking about the optimal approach. What specific part are you struggling with?`,
              timestamp: new Date().toISOString(),
              isAI: true
            };
            setMessages(prev => [...prev, aiResponse]);
          }, 2000);
          
          // Other users can also reply
          simulateUserReply(newMessage);
        } else {
          // Only users mode - simulate user replies
          simulateUserReply(newMessage);
        }
        
        setTimeout(() => {
          loadMessages();
          setIsTyping(false);
        }, 500);
      } else {
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInputValue('');
    setIsTyping(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    setInputValue(value);
    setCursorPosition(cursorPos);
    
    // Check for @ mentions
    const textBeforeCursor = value.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      if (!textAfterAt.includes(' ')) {
        setMentionQuery(textAfterAt);
        setShowMentions(true);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (userName) => {
    const textBeforeCursor = inputValue.substring(0, cursorPosition);
    const textAfterCursor = inputValue.substring(cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    const newText = textBeforeCursor.substring(0, lastAtIndex) + `@${userName} ` + textAfterCursor;
    setInputValue(newText);
    setShowMentions(false);
    textareaRef.current?.focus();
  };

  const addMentionButton = () => {
    setInputValue(prev => prev + '@');
    setShowMentions(true);
    textareaRef.current?.focus();
  };

  const filteredUsers = onlineUsers.filter(user => 
    user.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  // Check for replies to current user
  useEffect(() => {
    const userReplies = messages.filter(msg => 
      msg.message.includes(`@${username}`) && msg.senderName !== username
    );
    
    if (userReplies.length > 0) {
      const newReplies = userReplies.filter(reply => 
        !pendingReplies.some(pending => pending._id === reply._id)
      );
      
      if (newReplies.length > 0) {
        setPendingReplies(prev => [...prev, ...newReplies]);
        setNotifications(prev => [...prev, ...newReplies.map(reply => ({
          id: reply._id,
          sender: reply.senderName,
          message: reply.message,
          timestamp: reply.timestamp
        }))]);
      }
    }
  }, [messages, username]);

  const clearNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const simulateUserReply = (originalMessage) => {
    // Simulate other users replying
    const otherUsers = ['John Doe', 'Sarah Smith', 'Mike Johnson'];
    const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
    
    setTimeout(() => {
      const replyMessage = {
        _id: Date.now().toString(),
        senderName: randomUser,
        message: `@${originalMessage.senderName} I think you should try using a different approach for this problem.`,
        timestamp: new Date().toISOString(),
        isAI: false
      };
      
      setMessages(prev => [...prev, replyMessage]);
    }, Math.random() * 3000 + 2000); // Random delay 2-5 seconds
  };

  if (!isOpen) return null;

  return (
    <div className="chat-overlay">
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="chat-icon">
              <span style={{fontSize: '20px'}}>🤖</span>
            </div>
            <div>
              <h3 className="chat-title">AI Assistant</h3>
              <p className="chat-subtitle">{questionTitle}</p>
            </div>
          </div>
          <div className="chat-header-actions">
            <button className="header-btn" onClick={handleReset} title="Clear Chat">
              <span style={{fontSize: '16px'}}>🔄</span>
            </button>
            <button className="header-btn" onClick={onClose}>
              <span style={{fontSize: '18px'}}>✕</span>
            </button>
          </div>
        </div>

        {/* Reply Notifications */}
        {notifications.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            border: '1px solid #f59e0b',
            borderRadius: '12px',
            margin: '12px 16px',
            padding: '12px',
            fontSize: '12px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span style={{ fontWeight: '600', color: '#92400e' }}>
                🔔 {notifications.length} New Replies
              </span>
              <button
                onClick={() => setNotifications([])}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#92400e',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ✕
              </button>
            </div>
            {notifications.slice(0, 3).map((notification, index) => (
              <div key={notification.id} style={{
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '8px',
                padding: '8px',
                marginBottom: index < 2 ? '4px' : '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>
                    {notification.sender}
                  </span>
                  <span style={{ color: '#6b7280', marginLeft: '4px' }}>
                    replied to you
                  </span>
                </div>
                <button
                  onClick={() => clearNotification(notification.id)}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    cursor: 'pointer'
                  }}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <span style={{fontSize: '32px', color: 'white'}}>🤖</span>
              </div>
              <h3 className="empty-title">AI Assistant Ready</h3>
              <p className="empty-description">
                Ask me anything about this DSA problem! I can help with:
              </p>
              <div className="feature-list">
                <div className="feature-item">
                  <span className="feature-dot dot-blue"></span>
                  Algorithm approaches and explanations
                </div>
                <div className="feature-item">
                  <span className="feature-dot dot-purple"></span>
                  Code optimization and debugging
                </div>
                <div className="feature-item">
                  <span className="feature-dot dot-green"></span>
                  Time & space complexity analysis
                </div>
              </div>
            </div>
          ) : (
            <div className="messages-container">
              {(Array.isArray(messages) ? messages : []).map((message, index) => {
                const isAI = message.isAI || message.senderName === 'AI Assistant';
                
                const isCurrentUser = message.senderName === username;
                const isOtherUser = !isAI && !isCurrentUser;
                
                return (
                  <div key={message.id || message._id || index} className={`message-wrapper ${isCurrentUser ? 'current-user' : isAI ? 'ai-message' : 'other-user'}`}>
                    <div className={`message-container ${isCurrentUser ? 'right-align' : 'left-align'}`}>
                      {/* Avatar - only show for others */}
                      {!isCurrentUser && (
                        <div className={`message-avatar ${isAI ? 'avatar-ai' : 'avatar-other'}`}>
                          <span style={{fontSize: '14px'}}>
                            {isAI ? '🤖' : '👤'}
                          </span>
                        </div>
                      )}
                      
                      <div className="message-content">
                        {/* Sender name for others */}
                        {!isCurrentUser && (
                          <div className="sender-name">
                            {message.senderName || message.username}
                          </div>
                        )}
                        
                        <div className={`message-bubble ${isCurrentUser ? 'bubble-current' : isAI ? 'bubble-ai' : 'bubble-other'}`}>
                          {message.isStreaming && (!message.message || message.message === '') ? (
                            <div className="typing-indicator">
                              <div className="typing-dots">
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                              </div>
                              <span style={{fontSize: '12px', color: '#667eea'}}>AI is thinking...</span>
                            </div>
                          ) : (
                            <div style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>
                              {message.message}
                            </div>
                          )}
                          
                          {/* Message time */}
                          <div className={`message-time ${isCurrentUser ? 'time-current' : 'time-other'}`}>
                            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            {isCurrentUser && (
                              <span className="message-status">✓✓</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Reply button for others' messages */}
                        {!isCurrentUser && (
                          <button
                            className="reply-btn"
                            onClick={() => {
                              const replyText = `@${message.senderName} `;
                              setInputValue(replyText);
                              textareaRef.current?.focus();
                            }}
                          >
                            ↩️ Reply
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-area">

          
          <form className="input-form" onSubmit={handleSubmit}>
            {/* Main Input Row - Textarea + Send Button */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '12px',
              marginBottom: '12px'
            }}>
              {/* Textarea Container */}
              <div style={{
                flex: 1,
                position: 'relative'
              }}>
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder={isAIEnabled ? "🤖 AI मोड: अपना सवाल पूछें..." : "💬 Type a message..."}
                  disabled={isTyping}
                  rows={1}
                  maxLength={1000}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                    if (e.key === 'Escape') {
                      setShowMentions(false);
                    }
                  }}
                  style={{
                    width: '100%',
                    minHeight: '40px',
                    maxHeight: '40px',
                    padding: '16px 20px',
                    border: `2px solid ${isAIEnabled ? '#25d366' : '#128c7e'}`,
                    borderRadius: '16px',
                    fontSize: '15px',
                    resize: 'vertical',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit',
                    background: isAIEnabled ? 'rgba(3, 82, 252, 0.02)' : 'rgba(16, 185, 129, 0.02)',
                    boxShadow: `0 0 0 3px ${isAIEnabled ? 'rgba(3, 82, 252, 0.1)' : 'rgba(16, 185, 129, 0.1)'}`,
                    lineHeight: '1.5'
                  }}
                />
                
                {/* Mention Dropdown */}
                {showMentions && (
                  <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '16px',
                    right: '16px',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      borderBottom: '1px solid #f3f4f6'
                    }}>
                      Mention someone:
                    </div>
                    {filteredUsers.map((user, index) => (
                      <div
                        key={index}
                        onClick={() => insertMention(user)}
                        style={{
                          padding: '10px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '14px',
                          borderBottom: index < filteredUsers.length - 1 ? '1px solid #f3f4f6' : 'none',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#f8fafc'}
                        onMouseOut={(e) => e.target.style.background = 'transparent'}
                      >
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: user === 'AI Assistant' ? 'linear-gradient(135deg, #0352fc, #0d4bdb)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px'
                        }}>
                          {user === 'AI Assistant' ? '🤖' : '👤'}
                        </div>
                        <span style={{ fontWeight: '500' }}>{user}</span>
                        {user === 'AI Assistant' && (
                          <span style={{
                            background: '#0352fc',
                            color: 'white',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '600'
                          }}>
                            AI
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                />
                
                {/* Character Counter */}
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '16px',
                  fontSize: '11px',
                  color: inputValue.length > 800 ? '#ef4444' : '#9ca3af',
                  background: 'rgba(255, 255, 255, 0.95)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontWeight: '500',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  {inputValue.length}/1000
                </div>
              </div>
              
              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                style={{
                  background: isTyping ? '#9ca3af' : 'linear-gradient(135deg, #25d366, #128c7e)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isTyping || !inputValue.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '22px',
                  transition: 'all 0.2s ease',
                  boxShadow: isTyping ? 'none' : '0 6px 20px rgba(37, 211, 102, 0.4)',
                  flexShrink: 0,
                  alignSelf: 'stretch'
                }}
                onMouseOver={(e) => {
                  if (!isTyping && inputValue.trim()) {
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isTyping && inputValue.trim()) {
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                {isTyping ? (
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                ) : (
                  '➤'
                )}
              </button>
            </div>
            
            {/* Bottom Row - Files + Toggle */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px'
            }}>
              {/* Left Side - File Upload + @ Mention */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={(e) => setSelectedFiles(prev => [...prev, ...Array.from(e.target.files)])}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'white',
                    fontWeight: '600',
                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  📎 Files
                </button>
                
                {/* @ Mention Button */}
                <button
                  type="button"
                  onClick={addMentionButton}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'white',
                    fontWeight: '600',
                    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  @ Mention
                </button>
              </div>
              
              {/* Right Side - Toggle Switch */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f8fafc',
                padding: '6px 10px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0'
              }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#6b7280'
                }}>
                  Mode:
                </span>
                
                {/* Toggle Switch */}
                <div style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '50px',
                  height: '24px'
                }}>
                  <input
                    type="checkbox"
                    checked={isAIEnabled}
                    onChange={(e) => setIsAIEnabled(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <div
                    onClick={() => setIsAIEnabled(!isAIEnabled)}
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: isAIEnabled ? 'linear-gradient(135deg, #25d366, #128c7e)' : '#cbd5e1',
                      borderRadius: '24px',
                      transition: 'all 0.3s ease',
                      boxShadow: isAIEnabled ? '0 0 8px rgba(37, 211, 102, 0.3)' : 'none'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      height: '18px',
                      width: '18px',
                      left: isAIEnabled ? '29px' : '3px',
                      bottom: '3px',
                      background: 'white',
                      borderRadius: '50%',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px'
                    }}>
                      {isAIEnabled ? '🤖' : '👥'}
                    </div>
                  </div>
                </div>
                
                <span style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: isAIEnabled ? '#25d366' : '#128c7e'
                }}>
                  {isAIEnabled ? 'AI ऑन' : 'यूजर ऑनली'}
                </span>
              </div>
            </div>
            
            {/* File Preview */}
            {selectedFiles.length > 0 && (
              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '8px',
                flexWrap: 'wrap'
              }}>
                {selectedFiles.map((file, index) => (
                  <div key={index} style={{
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    📎 {file.name}
                    <button
                      type="button"
                      onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        fontSize: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Online Users Notification */}
            <div style={{
              marginTop: '12px',
              padding: '8px 12px',
              background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              fontSize: '11px',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#22c55e',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }} />
                <span style={{ fontWeight: '600' }}>
                  {Math.floor(Math.random() * 5) + 2} users online
                </span>
              </div>
              <span style={{ fontSize: '10px', opacity: 0.8 }}>
                🔔 All users will be notified
              </span>
            </div>
            
            {/* Add CSS animations */}
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
              @keyframes bounce {
                0%, 80%, 100% {
                  transform: scale(0);
                }
                40% {
                  transform: scale(1);
                }
              }
            `}</style>
          </form>
          
          <div className="chat-footer">
            <p className="footer-text">AI can make mistakes. Verify important information.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernQuestionChat;