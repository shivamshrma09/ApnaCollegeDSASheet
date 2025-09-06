import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import io from 'socket.io-client';

const API_BASE_URL = 'http://localhost:5001/api';

const getAuthHeaders = async () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

const EnhancedProblemDiscussion = ({ isOpen, onClose, problem, userId }) => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [aiEnabled, setAiEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [socket, setSocket] = useState(null);
  const [showRecentChats, setShowRecentChats] = useState(false);
  const [recentChats, setRecentChats] = useState([]);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (isOpen && problem) {
      fetchMessages();
      fetchRecentChats(); // Auto-load recent chats
      
      const token = localStorage.getItem('token');
      const newSocket = io('http://localhost:5001', { auth: { token } });
      setSocket(newSocket);
      
      newSocket.emit('joinProblem', problem.id);
      newSocket.emit('authenticate', { userId: userId });
      
      newSocket.on('newDiscussionMessage', (message) => {
        if (message.isPrivate && message.userId !== userId) return;
        
        setMessages(prev => {
          const messageId = message._id || message.id || `socket-${Date.now()}-${Math.random()}`;
          const exists = prev.some(msg => {
            const existingId = msg._id || msg.id;
            return existingId === messageId || (msg.content === message.content && msg.userId === message.userId);
          });
          if (exists) return prev;
          return [...prev, { ...message, id: messageId }];
        });
      });
      
      return () => newSocket.disconnect();
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

  const fetchRecentChats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/discussion/recent`, await getAuthHeaders());
      setRecentChats(response.data);
    } catch (error) {
      console.error('Error fetching recent chats:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

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

      const newMsg = { ...response.data, id: response.data._id || `user-${Date.now()}-${Math.random()}` };
      setMessages(prev => {
        const exists = prev.some(msg => {
          const existingId = msg._id || msg.id;
          const newId = newMsg._id || newMsg.id;
          return existingId === newId || (msg.content === newMsg.content && msg.userId === newMsg.userId);
        });
        if (exists) return prev;
        return [...prev, newMsg];
      });
      
      setNewMessage('');
      setReplyingTo(null);

      if (aiEnabled && newMessage.trim()) {
        setIsTyping(true);
        setTimeout(async () => {
          try {
            await axios.post(`${API_BASE_URL}/discussion/ai-reply`, {
              problemId: problem.id,
              question: newMessage,
              problemTitle: problem.title
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

  const handleUpvote = async (messageId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/discussion/upvote/${messageId}`, {}, await getAuthHeaders());
      
      setMessages(prev => prev.map(msg => 
        (msg._id || msg.id) === messageId 
          ? { ...msg, upvotes: response.data.upvotes, upvotedBy: response.data.hasUpvoted 
              ? [...(msg.upvotedBy || []), userId] 
              : (msg.upvotedBy || []).filter(id => id !== userId) }
          : msg
      ));
    } catch (error) {
      console.error('Error upvoting message:', error);
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
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 1500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        width: '85%',
        maxWidth: '700px',
        height: '75%',
        backgroundColor: isDark ? '#1f2937' : 'white',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        {/* Enhanced Header */}
        <div style={{
          padding: '16px 24px',
          background: isDark 
            ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
            : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12,3C6.5,3 2,6.58 2,11C2.05,13.15 3.06,15.17 4.75,16.5C4.75,17.1 4.33,18.67 2,21C4.37,20.89 6.64,20 8.47,18.5C9.61,18.83 10.81,19 12,19C17.5,19 22,15.42 22,11C22,6.58 17.5,3 12,3Z"/>
              </svg>
            </div>
            <div>
              <h3 style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: '600'
              }}>
                Discussion
              </h3>
              <p style={{ 
                margin: '2px 0 0 0', 
                fontSize: '13px',
                opacity: 0.85,
                fontWeight: '400'
              }}>
                {problem?.title}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 32px',
          background: isDark 
            ? 'linear-gradient(180deg, #111827 0%, #0f172a 100%)'
            : 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
          {/* Recent Chats Section - Show when no messages */}
          {messages.length === 0 && recentChats.length > 0 && (
            <div style={{
              marginBottom: '24px',
              padding: '20px',
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
              borderRadius: '16px',
              border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'}`
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                color: isDark ? '#e5e7eb' : '#1f2937',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A2,2 0 0,1 14,4C14,6.21 12.79,8.07 11.06,8.85C11.72,10.16 12.97,11.14 14.5,11.5C15.5,11.71 16.5,12.5 16.5,13.5V15.5C16.5,16.33 15.83,17 15,17H9C8.17,17 7.5,16.33 7.5,15.5V13.5C7.5,12.5 8.5,11.71 9.5,11.5C11.03,11.14 12.28,10.16 12.94,8.85C11.21,8.07 10,6.21 10,4A2,2 0 0,1 12,2Z"/>
                </svg>
                Your Recent Discussions
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentChats.slice(0, 3).map((chat, index) => (
                  <div key={index} style={{
                    padding: '12px 16px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`
                  }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: isDark ? '#e5e7eb' : '#1f2937',
                      marginBottom: '4px'
                    }}>
                      Problem #{chat.problemId}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: isDark ? '#9ca3af' : '#6b7280',
                      marginBottom: '4px'
                    }}>
                      {chat.messageCount} messages • {new Date(chat.lastMessage).toLocaleDateString()}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: isDark ? '#d1d5db' : '#374151',
                      opacity: 0.8
                    }}>
                      {chat.lastMessageContent.length > 60 
                        ? chat.lastMessageContent.substring(0, 60) + '...' 
                        : chat.lastMessageContent}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {messages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              color: isDark ? '#9ca3af' : '#6b7280'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                  <path d="M12,3C6.5,3 2,6.58 2,11C2.05,13.15 3.06,15.17 4.75,16.5C4.75,17.1 4.33,18.67 2,21C4.37,20.89 6.64,20 8.47,18.5C9.61,18.83 10.81,19 12,19C17.5,19 22,15.42 22,11C22,6.58 17.5,3 12,3Z"/>
                </svg>
              </div>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                marginBottom: '12px', 
                color: isDark ? '#e5e7eb' : '#1f2937' 
              }}>
                Start the Discussion
              </h3>
              <p style={{ fontSize: '16px', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto' }}>
                Ask questions, share solutions, or get help from AI and the community!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {messages.map((msg, index) => {
                const isOwn = msg.userId === userId;
                const isAI = msg.type === 'ai';
                const uniqueKey = msg._id || msg.id || `msg-${index}-${msg.timestamp || Date.now()}`;
                
                return (
                  <div key={uniqueKey} style={{ 
                    display: 'flex',
                    justifyContent: isOwn ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-end',
                    gap: '12px'
                  }}>
                    {/* Avatar for others */}
                    {!isOwn && (
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: isAI 
                          ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                          : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        color: 'white',
                        fontWeight: '600',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}>
                        {isAI ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                          <path d="M12,2A2,2 0 0,1 14,4C14,6.21 12.79,8.07 11.06,8.85C11.72,10.16 12.97,11.14 14.5,11.5C15.5,11.71 16.5,12.5 16.5,13.5V15.5C16.5,16.33 15.83,17 15,17H9C8.17,17 7.5,16.33 7.5,15.5V13.5C7.5,12.5 8.5,11.71 9.5,11.5C11.03,11.14 12.28,10.16 12.94,8.85C11.21,8.07 10,6.21 10,4A2,2 0 0,1 12,2Z"/>
                        </svg>
                      ) : (msg.userName?.[0]?.toUpperCase() || 'U')}
                      </div>
                    )}
                    
                    {/* Message Bubble */}
                    <div style={{
                      maxWidth: '75%',
                      padding: '16px 20px',
                      borderRadius: isOwn ? '24px 24px 8px 24px' : '24px 24px 24px 8px',
                      background: isOwn
                        ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                        : isAI 
                          ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                          : isDark 
                            ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)'
                            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                      color: (isOwn || isAI) ? 'white' : (isDark ? '#e5e7eb' : '#1f2937'),
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      border: !isOwn && !isAI && !isDark ? '1px solid #e5e7eb' : 'none',
                      position: 'relative'
                    }}>
                      {/* Reply Preview */}
                      {msg.replyTo && (
                        <div style={{
                          padding: '12px',
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          borderRadius: '12px',
                          marginBottom: '12px',
                          borderLeft: '4px solid rgba(255,255,255,0.3)'
                        }}>
                          <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px', fontWeight: '600' }}>
                            Replying to {msg.replyTo.userName}
                          </div>
                          <div style={{ fontSize: '13px', opacity: 0.9 }}>
                            {msg.replyTo.content.length > 60 ? msg.replyTo.content.substring(0, 60) + '...' : msg.replyTo.content}
                          </div>
                        </div>
                      )}
                      
                      {/* Message Header */}
                      {!isOwn && (
                        <div style={{ 
                          fontSize: '13px', 
                          fontWeight: '700', 
                          marginBottom: '8px', 
                          opacity: 0.9,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          {isAI ? 'AI Assistant' : msg.userName}
                          {isAI && (
                            <span style={{
                              background: 'rgba(255,255,255,0.2)',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '10px',
                              fontWeight: '700'
                            }}>
                              AI
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Message Content */}
                      <div style={{ 
                        fontSize: '15px', 
                        lineHeight: '1.6', 
                        wordBreak: 'break-word',
                        fontWeight: '400'
                      }}>
                        {msg.content}
                      </div>
                      
                      {/* Message Actions */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginTop: '12px',
                        paddingTop: '8px',
                        borderTop: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <div style={{ fontSize: '12px', opacity: 0.7, fontWeight: '500' }}>
                          {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpvote(msg._id || msg.id);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              borderRadius: '16px',
                              fontSize: '12px',
                              color: 'inherit',
                              opacity: 0.8,
                              transition: 'all 0.2s',
                              fontWeight: '600'
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"/>
                            </svg>
                            {msg.upvotes || 0}
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setReplyingTo(msg);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              borderRadius: '16px',
                              fontSize: '12px',
                              color: 'inherit',
                              opacity: 0.8,
                              transition: 'all 0.2s',
                              fontWeight: '600'
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M10,9V5L3,12L10,19V14.9C15,14.9 18.5,16.5 21,20C20,15 17,10 10,9Z"/>
                            </svg>
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    color: 'white'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M12,2A2,2 0 0,1 14,4C14,6.21 12.79,8.07 11.06,8.85C11.72,10.16 12.97,11.14 14.5,11.5C15.5,11.71 16.5,12.5 16.5,13.5V15.5C16.5,16.33 15.83,17 15,17H9C8.17,17 7.5,16.33 7.5,15.5V13.5C7.5,12.5 8.5,11.71 9.5,11.5C11.03,11.14 12.28,10.16 12.94,8.85C11.21,8.07 10,6.21 10,4A2,2 0 0,1 12,2Z"/>
                    </svg>
                  </div>
                  <div style={{
                    padding: '16px 20px',
                    borderRadius: '24px 24px 24px 8px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white'
                  }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.8)', animation: 'pulse 1.5s infinite' }}></div>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.8)', animation: 'pulse 1.5s infinite 0.2s' }}></div>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.8)', animation: 'pulse 1.5s infinite 0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Input Area */}
        <div style={{
          padding: '24px 32px',
          borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          background: isDark 
            ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
        }}>
          {/* Reply Preview */}
          {replyingTo && (
            <div style={{
              padding: '16px',
              backgroundColor: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
              borderRadius: '16px',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderLeft: '4px solid #6366f1'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#6366f1', marginBottom: '4px' }}>
                  Replying to {replyingTo.userName}
                </div>
                <div style={{ fontSize: '14px', color: isDark ? '#d1d5db' : '#374151' }}>
                  {replyingTo.content.length > 80 ? replyingTo.content.substring(0, 80) + '...' : replyingTo.content}
                </div>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  color: '#ef4444', 
                  fontSize: '18px',
                  padding: '8px'
                }}
              >
                ✕
              </button>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask your doubt or share your solution..."
                style={{
                  width: '100%',
                  minHeight: '60px',
                  maxHeight: '120px',
                  padding: '16px 20px',
                  border: `2px solid ${isDark ? '#374151' : '#e2e8f0'}`,
                  borderRadius: '20px',
                  backgroundColor: isDark ? '#374151' : 'white',
                  color: isDark ? '#e5e7eb' : '#1f2937',
                  resize: 'vertical',
                  fontSize: '15px',
                  outline: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginTop: '12px' 
              }}>
                {/* AI Toggle */}
                <button
                  onClick={() => setAiEnabled(!aiEnabled)}
                  style={{
                    padding: '8px 16px',
                    background: aiEnabled 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'none',
                    border: `1px solid ${aiEnabled ? '#10b981' : (isDark ? '#374151' : '#d1d5db')}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: aiEnabled ? 'white' : (isDark ? '#9ca3af' : '#6b7280'),
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A2,2 0 0,1 14,4C14,6.21 12.79,8.07 11.06,8.85C11.72,10.16 12.97,11.14 14.5,11.5C15.5,11.71 16.5,12.5 16.5,13.5V15.5C16.5,16.33 15.83,17 15,17H9C8.17,17 7.5,16.33 7.5,15.5V13.5C7.5,12.5 8.5,11.71 9.5,11.5C11.03,11.14 12.28,10.16 12.94,8.85C11.21,8.07 10,6.21 10,4A2,2 0 0,1 12,2Z"/>
                  </svg>
                  AI Help {aiEnabled ? 'ON' : 'OFF'}
                </button>
                
                <button
                  onClick={sendMessage}
                  disabled={loading || !newMessage.trim()}
                  style={{
                    padding: '12px 24px',
                    background: loading || !newMessage.trim() 
                      ? '#9ca3af' 
                      : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    cursor: loading || !newMessage.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '15px',
                    fontWeight: '700',
                    boxShadow: loading || !newMessage.trim() 
                      ? 'none' 
                      : '0 4px 12px rgba(99, 102, 241, 0.4)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{ 
                        width: '16px', 
                        height: '16px', 
                        border: '2px solid rgba(255,255,255,0.3)', 
                        borderTop: '2px solid white', 
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
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>


        
        <style>{`
          @keyframes pulse {
            0%, 70%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            35% {
              opacity: 0.7;
              transform: scale(0.9);
            }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default EnhancedProblemDiscussion;