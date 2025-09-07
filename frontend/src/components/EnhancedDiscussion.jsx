import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import io from 'socket.io-client';
import { getAuthHeaders } from '../utils/csrfToken';

const API_BASE_URL = 'https://plusdsa.onrender.com/api';

const EnhancedDiscussion = ({ isOpen, onClose, problem, userId }) => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiMode, setAiMode] = useState(false); // AI private mode
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (isOpen && problem) {
      fetchMessages();
      
      const token = localStorage.getItem('token');
      const newSocket = io('https://plusdsa.onrender.com', {
        auth: { token }
      });
      setSocket(newSocket);
      
      newSocket.emit('joinProblem', problem.id);
      
      newSocket.on('newDiscussionMessage', (message) => {
        // Filter private AI messages
        if (message.type === 'ai' && message.isPrivate && message.userId !== userId) {
          return;
        }
        
        setMessages(prev => {
          const messageId = message._id || message.id || message.timestamp;
          const exists = prev.some(msg => {
            const existingId = msg._id || msg.id || msg.timestamp;
            return existingId === messageId;
          });
          if (exists) return prev;
          return [...prev, { ...message, id: messageId }];
        });
      });
      
      return () => {
        newSocket.disconnect();
      };
    }
  }, [isOpen, problem, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/discussion/${problem.id}`, await getAuthHeaders());
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    try {
      setLoading(true);
      
      const messageData = {
        problemId: problem.id,
        content: newMessage,
        userId: userId,
        userName: user.name || 'Anonymous',
        replyTo: replyingTo?._id || null
      };

      const response = await axios.post(`${API_BASE_URL}/discussion/send`, messageData, await getAuthHeaders());

      const newMsg = { ...response.data, id: response.data._id || Date.now() };
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      setSelectedFile(null);
      setReplyingTo(null);

      // Get AI response if enabled
      if (aiEnabled && newMessage.trim()) {
        setIsTyping(true);
        setTimeout(async () => {
          try {
            await axios.post(`${API_BASE_URL}/discussion/ai-reply`, {
              problemId: problem.id,
              question: newMessage,
              problemTitle: problem.title,
              isPrivate: aiMode
            }, await getAuthHeaders());
          } catch (error) {
            console.error('Error getting AI response:', error);
          } finally {
            setIsTyping(false);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
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
        maxWidth: '800px',
        height: '80%',
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
          <div>
            <h3 style={{ 
              color: 'white', 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: '600' 
            }}>
              Discussion: {problem?.title}
            </h3>
            <p style={{ 
              color: 'rgba(255,255,255,0.9)', 
              margin: '2px 0 0 0', 
              fontSize: '12px' 
            }}>
              {aiMode ? '🔒 AI Private Mode - Your chat is secure' : 'Ask doubts, share solutions, get help from AI and community'}
            </p>
          </div>
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
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          backgroundColor: isDark ? '#111827' : '#f8fafc'
        }}>
          {messages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: isDark ? '#9ca3af' : '#6b7280'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: aiMode 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: aiMode 
                  ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                  : '0 4px 12px rgba(30, 144, 255, 0.3)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  {aiMode ? (
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.4 16,11.9 16,12.5V16.5C16,17.1 15.6,17.5 15,17.5H9C8.4,17.5 8,17.1 8,16.5V12.5C8,11.9 8.4,11.4 9,11.5V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,9.2 10.2,10V11.5H13.8V10C13.8,9.2 12.8,8.2 12,8.2Z"/>
                  ) : (
                    <path d="M12,3C6.5,3 2,6.58 2,11C2.05,13.15 3.06,15.17 4.75,16.5C4.75,17.1 4.33,18.67 2,21C4.37,20.89 6.64,20 8.47,18.5C9.61,18.83 10.81,19 12,19C17.5,19 22,15.42 22,11C22,6.58 17.5,3 12,3Z"/>
                  )}
                </svg>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px', color: isDark ? '#e5e7eb' : '#1f2937' }}>
                {aiMode ? 'Private AI Chat Ready' : 'Start the Discussion'}
              </h3>
              <p style={{ fontSize: '13px' }}>
                {aiMode 
                  ? '🔒 Your AI conversations are private and secure. Only you can see them.'
                  : 'Ask questions, share solutions, or get help from AI and the community!'
                }
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isOwn = msg.userId === userId;
              const isAI = msg.type === 'ai';
              const isPrivateAI = isAI && msg.isPrivate && msg.userId === userId;
              const uniqueKey = msg._id || msg.id || `msg-${index}-${Date.now()}`;
              
              // Skip private AI messages that don't belong to current user
              if (isAI && msg.isPrivate && msg.userId !== userId) {
                return null;
              }
              
              return (
                <div key={uniqueKey} style={{ 
                  display: 'flex', 
                  alignItems: 'flex-end', 
                  gap: '8px',
                  flexDirection: isOwn ? 'row-reverse' : 'row',
                  justifyContent: isOwn ? 'flex-end' : 'flex-start',
                  marginBottom: '12px',
                  width: '100%',
                  opacity: isPrivateAI ? 0.95 : 1,
                  background: isPrivateAI ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))' : 'transparent',
                  borderRadius: isPrivateAI ? '12px' : '0',
                  padding: isPrivateAI ? '8px' : '0',
                  border: isPrivateAI ? '1px solid rgba(16, 185, 129, 0.2)' : 'none'
                }}>
                  {/* Avatar */}
                  {!isOwn && (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isAI ? (isPrivateAI ? '#10b981' : '#10b981') : '#6366f1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      flexShrink: 0
                    }}>
                      {isAI ? '🤖' : (msg.userName?.[0]?.toUpperCase() || 'U')}
                    </div>
                  )}
                  
                  {/* Message Bubble */}
                  <div style={{
                    maxWidth: isOwn ? '85%' : '75%',
                    padding: '12px 16px',
                    borderRadius: isOwn ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                    background: isOwn
                      ? 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)'
                      : isAI 
                        ? (isPrivateAI ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)')
                        : (isDark ? '#374151' : 'white'),
                    color: (isOwn || isAI) ? 'white' : (isDark ? '#e5e7eb' : '#1f2937'),
                    boxShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.1)',
                    border: isDark ? `1px solid ${isOwn ? 'transparent' : '#4b5563'}` : 'none',
                    position: 'relative'
                  }}>
                    {/* Message Header */}
                    {!isOwn && (
                      <div style={{ 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        marginBottom: '4px', 
                        opacity: 0.9,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {isAI ? 'AI Assistant' : msg.userName}
                        {isPrivateAI && (
                          <span style={{
                            background: 'rgba(255,255,255,0.2)',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            fontSize: '10px',
                            fontWeight: '700'
                          }}>
                            PRIVATE
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Message Content */}
                    <div style={{ fontSize: '14px', lineHeight: '1.4', wordBreak: 'break-word' }}>
                      {msg.content}
                    </div>
                    
                    {/* Message Time */}
                    <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>
                      {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: 'white'
              }}>🤖</div>
              <div style={{
                padding: '12px 16px',
                borderRadius: '20px 20px 20px 6px',
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
                border: isDark ? '1px solid #4b5563' : 'none'
              }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulse 1.5s infinite' }}></div>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulse 1.5s infinite 0.2s' }}></div>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulse 1.5s infinite 0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: '20px',
          borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          background: isDark ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={aiMode ? "🔒 Private AI chat - Ask your question..." : "Ask your doubt or share your solution..."}
                style={{
                  width: '100%',
                  minHeight: '80px',
                  maxHeight: '140px',
                  padding: '16px',
                  border: `2px solid ${aiMode ? '#10b981' : (isDark ? '#4b5563' : '#e2e8f0')}`,
                  borderRadius: '16px',
                  backgroundColor: isDark ? '#374151' : 'white',
                  color: isDark ? '#e5e7eb' : '#1f2937',
                  resize: 'vertical',
                  fontSize: '14px',
                  outline: 'none',
                  boxShadow: aiMode ? '0 0 0 3px rgba(16, 185, 129, 0.1)' : '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

                  <button
                    onClick={() => {
                      setAiMode(!aiMode);
                      if (!aiMode) {
                        setShowPrivacyNotice(true);
                        setTimeout(() => setShowPrivacyNotice(false), 3000);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      padding: '6px 10px',
                      borderRadius: '16px',
                      background: aiMode 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                        : (isDark ? '#4b5563' : '#e5e7eb'),
                      color: aiMode ? 'white' : (isDark ? '#d1d5db' : '#6b7280'),
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontWeight: '500'
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.4 16,11.9 16,12.5V16.5C16,17.1 15.6,17.5 15,17.5H9C8.4,17.5 8,17.1 8,16.5V12.5C8,11.9 8.4,11.4 9,11.5V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,9.2 10.2,10V11.5H13.8V10C13.8,9.2 12.8,8.2 12,8.2Z"/>
                    </svg>
                    AI Mode {aiMode ? 'ON' : 'OFF'}
                  </button>
                </div>
                
                <button
                  onClick={sendMessage}
                  disabled={loading || (!newMessage.trim() && !selectedFile)}
                  style={{
                    padding: '10px 20px',
                    background: loading ? '#9ca3af' : (aiMode ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)'),
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: loading ? 'none' : (aiMode ? '0 2px 8px rgba(16, 185, 129, 0.3)' : '0 2px 8px rgba(30, 144, 255, 0.3)'),
                    transition: 'all 0.2s ease'
                  }}
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Privacy Notice */}
        {showPrivacyNotice && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
            zIndex: 2000,
            maxWidth: '350px',
            animation: 'slideInRight 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.4 16,11.9 16,12.5V16.5C16,17.1 15.6,17.5 15,17.5H9C8.4,17.5 8,17.1 8,16.5V12.5C8,11.9 8.4,11.4 9,11.5V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,9.2 10.2,10V11.5H13.8V10C13.8,9.2 12.8,8.2 12,8.2Z"/>
              </svg>
              <strong>AI Mode Activated</strong>
            </div>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
              🔒 Your chat with AI is private and secure. Other users cannot see your AI conversations.
            </p>
          </div>
        )}
        
        <style>{`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default EnhancedDiscussion;