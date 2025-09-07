import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import io from 'socket.io-client';
// import { getAuthHeaders } from '../utils/csrfToken'; // File removed

// Simple replacement function
const getAuthHeaders = async () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://plusdsa.onrender.com/api';

const ProblemDiscussion = ({ isOpen, onClose, problem, userId }) => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  // AI functionality removed
  const [aiEnabled] = useState(false);
  const [aiMode] = useState(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (isOpen && problem) {
      fetchMessages();
      
      // Initialize socket connection with authentication
      const token = localStorage.getItem('token');
      const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'https://plusdsa.onrender.com', {
        auth: { token }
      });
      setSocket(newSocket);
      
      // Join problem room and authenticate
      newSocket.emit('joinProblem', problem.id);
      newSocket.emit('authenticate', { userId: userId });
      
      // Listen for new messages
      newSocket.on('newDiscussionMessage', (message) => {
        // Skip private messages that don't belong to current user
        if (message.isPrivate && message.userId !== userId) {
          return;
        }
        
        setMessages(prev => {
          const messageId = message._id || message.id || `socket-${Date.now()}-${Math.random()}`;
          const exists = prev.some(msg => {
            const existingId = msg._id || msg.id;
            return existingId === messageId || (msg.content === message.content && msg.userId === message.userId && Math.abs(new Date(msg.createdAt || msg.timestamp) - new Date(message.createdAt || message.timestamp)) < 1000);
          });
          if (exists) return prev;
          return [...prev, { ...message, id: messageId }];
        });
      });
      
      // Listen for typing indicators
      newSocket.on('typing', (data) => {
        if (data.userId !== userId) {
          setIsTyping(true);
        }
      });
      
      newSocket.on('stopTyping', (data) => {
        if (data.userId !== userId) {
          setIsTyping(false);
        }
      });
      
      // Listen for upvote updates
      newSocket.on('messageUpvoted', (data) => {
        setMessages(prev => prev.map(msg => 
          (msg._id || msg.id) === data.messageId 
            ? { ...msg, upvotes: data.upvotes }
            : msg
        ));
      });
      
      // Listen for online users
      newSocket.on('onlineUsers', (users) => {
        setOnlineUsers(users.filter(u => u.userId !== userId));
      });
      
      // User joined/left notifications
      newSocket.on('userJoined', (userData) => {
        if (userData.userId !== userId) {
          setOnlineUsers(prev => [...prev.filter(u => u.userId !== userData.userId), userData]);
        }
      });
      
      newSocket.on('userLeft', (userData) => {
        setOnlineUsers(prev => prev.filter(u => u.userId !== userData.userId));
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
      const token = localStorage.getItem('token');
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
      const token = localStorage.getItem('token');
      
      // Create message object instead of FormData for better compatibility
      const messageData = {
        problemId: problem.id,
        content: newMessage,
        userId: userId,
        userName: user.name || 'Anonymous',
        replyTo: replyingTo?._id || null,
        isPrivate: aiMode && aiEnabled // Mark user message as private if AI mode is on
      };

      const response = await axios.post(`${API_BASE_URL}/discussion/send`, messageData, await getAuthHeaders());

      // Add message with unique ID - avoid duplicates
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
      setSelectedFile(null);
      setReplyingTo(null);

      // AI auto-response disabled - users can manually ask AI if needed
      // if (aiEnabled && newMessage.trim()) {
      //   setIsTyping(true);
      //   setTimeout(async () => {
      //     try {
      //       await axios.post(`${API_BASE_URL}/discussion/ai-reply`, {
      //         problemId: problem.id,
      //         question: newMessage,
      //         problemTitle: problem.title,
      //         isPrivate: aiMode
      //       }, await getAuthHeaders());
      //     } catch (error) {
      //       console.error('Error getting AI response:', error);
      //     } finally {
      //       setIsTyping(false);
      //     }
      //   }, 1000);
      // }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      setSelectedFile(file);
    } else {
      console.error('File size should be less than 5MB');
      // Show error in UI instead of alert
      setNewMessage(prev => prev + '\n[Error: File size should be less than 5MB]');
    }
  };

  const handleUpvote = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/discussion/upvote/${messageId}`, {}, await getAuthHeaders());
      
      // Update local state
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
          <div style={{ flex: 1 }}>
            <h3 style={{ 
              color: 'white', 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: '600' 
            }}>
              💬 Discussion: {problem?.title}
            </h3>
            <p style={{ 
              color: 'rgba(255,255,255,0.9)', 
              margin: '2px 0 0 0', 
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Ask doubts, share solutions, get help from the community
              <button
                onClick={() => setShowUserList(!showUserList)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  color: 'white',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}
              >
                👥 {onlineUsers.length + 1} online
              </button>
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
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
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
          backgroundColor: isDark ? '#111827' : '#f8fafc',
          position: 'relative'
        }}>
          {/* Online Users Panel */}
          {showUserList && (
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: isDark ? '#1f2937' : 'white',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '12px',
              padding: '12px',
              zIndex: 100,
              minWidth: '200px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: isDark ? '#e5e7eb' : '#1f2937' }}>
                👥 Online Users ({onlineUsers.length + 1})
              </div>
              <div style={{ fontSize: '11px', color: '#10b981', marginBottom: '4px' }}>
                🔵 You
              </div>
              {onlineUsers.map((user, index) => (
                <div key={index} style={{ fontSize: '11px', color: isDark ? '#d1d5db' : '#6b7280', marginBottom: '4px' }}>
                  🔵 {user.userName || 'Anonymous'}
                </div>
              ))}
            </div>
          )}
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
                background: 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 4px 12px rgba(30, 144, 255, 0.3)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M12,3C6.5,3 2,6.58 2,11C2.05,13.15 3.06,15.17 4.75,16.5C4.75,17.1 4.33,18.67 2,21C4.37,20.89 6.64,20 8.47,18.5C9.61,18.83 10.81,19 12,19C17.5,19 22,15.42 22,11C22,6.58 17.5,3 12,3Z"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px', color: isDark ? '#e5e7eb' : '#1f2937' }}>💬 Start the Discussion</h3>
              <p style={{ fontSize: '13px' }}>Ask doubts, share solutions, and chat with the community! 🚀</p>
              <div style={{ marginTop: '20px', fontSize: '12px', opacity: 0.8 }}>
                <p>💡 Tips: Use @username to mention someone</p>
                <p>💬 Connect with other students and share knowledge</p>
              </div>
            </div>
          ) : (
            messages.filter(msg => msg.type !== 'ai').map((msg, index) => {
              const isOwn = msg.userId === userId;
              
              // Skip private messages that don't belong to current user
              if (msg.isPrivate && msg.userId !== userId) {
                return null;
              }
              const uniqueKey = msg._id || msg.id || `msg-${index}-${msg.timestamp || Date.now()}`;
              
              return (
                <div key={uniqueKey} style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '12px',
                  marginBottom: '16px',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  background: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(248, 250, 252, 0.8)',
                  border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(248, 250, 252, 1)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(248, 250, 252, 0.8)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  {/* Avatar - only show for others, not own messages */}
                  {!isOwn && (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isAI ? '#10b981' : '#6366f1',
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
                  <div 
                    style={{
                      maxWidth: isOwn ? '85%' : '75%',
                      padding: '12px 16px',
                      borderRadius: '16px',
                      background: isOwn
                        ? 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)'
                        : (isDark ? '#374151' : 'white'),
                      color: isOwn
                        ? 'white'
                        : (isDark ? '#e5e7eb' : '#1f2937'),
                      boxShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.1)',
                      border: isDark ? `1px solid ${isOwn ? 'transparent' : '#4b5563'}` : 'none',
                      position: 'relative',
                      cursor: 'pointer',
                      marginLeft: isOwn ? 'auto' : '0',
                      marginRight: isOwn ? '0' : 'auto'
                    }}
                    onClick={() => setReplyingTo(msg)}
                  >
                    {/* Reply Preview */}
                    {msg.replyTo && (
                      <div style={{
                        padding: '8px',
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        borderLeft: '3px solid #8b5cf6'
                      }}>
                        <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '2px' }}>
                          Replying to {msg.replyTo.userName}
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.9 }}>
                          {msg.replyTo.content.length > 50 ? msg.replyTo.content.substring(0, 50) + '...' : msg.replyTo.content}
                        </div>
                      </div>
                    )}
                    
                    {/* Message Header */}
                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
                      {isOwn ? 'You' : `👤 ${msg.userName}`}
                      {/* Online indicator for other users */}
                      {!isOwn && (
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#10b981',
                          animation: 'pulse 2s infinite'
                        }} title="Online" />
                      )}
                    </div>
                    
                    {/* Message Content */}
                    <div style={{ fontSize: '14px', lineHeight: '1.4', wordBreak: 'break-word' }}>
                      {msg.content}
                    </div>
                    
                    {/* File Attachment */}
                    {msg.fileUrl && (
                      <div style={{ marginTop: '8px', padding: '8px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                        <a 
                          href={msg.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: 'inherit', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          📎 <span>View Attachment</span>
                        </a>
                      </div>
                    )}
                    
                    {/* Message Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <div style={{ fontSize: '11px', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>📅 {new Date(msg.createdAt || msg.timestamp).toLocaleDateString()}</span>
                        <span>🕒 {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      
                      {/* Upvote Button */}
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
                          gap: '4px',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          color: (msg.upvotedBy && msg.upvotedBy.includes(userId)) ? '#ef4444' : 'inherit',
                          opacity: 0.7,
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = '1'}
                        onMouseLeave={(e) => e.target.style.opacity = '0.7'}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"/>
                        </svg>
                        <span>{msg.upvotes || 0}</span>
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
                          gap: '3px',
                          padding: '4px 6px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          color: 'inherit',
                          opacity: 0.7,
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = '1'}
                        onMouseLeave={(e) => e.target.style.opacity = '0.7'}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M10,9V5L3,12L10,19V14.9C15,14.9 18.5,16.5 21,20C20,15 17,10 10,9Z"/>
                        </svg>
                        Reply
                      </button>
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
          {/* Reply Preview */}
          {replyingTo && (
            <div style={{
              padding: '12px',
              backgroundColor: isDark ? '#374151' : '#e5e7eb',
              borderRadius: '8px',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderLeft: '3px solid #8b5cf6'
            }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: isDark ? '#a78bfa' : '#8b5cf6' }}>
                  Replying to {replyingTo.userName}
                </div>
                <div style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#374151', marginTop: '2px' }}>
                  {replyingTo.content.length > 60 ? replyingTo.content.substring(0, 60) + '...' : replyingTo.content}
                </div>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '16px' }}
              >
                ✕
              </button>
            </div>
          )}
          {selectedFile && (
            <div style={{
              padding: '8px 12px',
              backgroundColor: isDark ? '#374151' : '#e5e7eb',
              borderRadius: '8px',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '14px', color: isDark ? '#d1d5db' : '#374151' }}>
                📎 {selectedFile.name}
              </span>
              <button
                onClick={() => setSelectedFile(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
              >
                ✕
              </button>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <textarea
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  // Emit typing indicator
                  if (socket && e.target.value.trim()) {
                    socket.emit('typing', { problemId: problem.id, userId, userName: user.name });
                  } else if (socket) {
                    socket.emit('stopTyping', { problemId: problem.id, userId });
                  }
                }}
                placeholder="Ask your doubt or share your solution... (Use @username to mention someone)"
                style={{
                  width: '100%',
                  minHeight: '80px',
                  maxHeight: '140px',
                  padding: '16px',
                  border: `2px solid ${isDark ? '#4b5563' : '#e2e8f0'}`,
                  borderRadius: '16px',
                  backgroundColor: isDark ? '#374151' : 'white',
                  color: isDark ? '#e5e7eb' : '#1f2937',
                  resize: 'vertical',
                  fontSize: '14px',
                  outline: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1E90FF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(30, 144, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark ? '#4b5563' : '#e2e8f0';
                  e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      background: isDark ? '#4b5563' : '#f3f4f6',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px',
                      cursor: 'pointer',
                      color: isDark ? '#d1d5db' : '#6b7280',
                      fontSize: '16px',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    }}
                  >
                    📎
                  </button>
                </div>
                
                <button
                  onClick={sendMessage}
                  disabled={loading || (!newMessage.trim() && !selectedFile)}
                  style={{
                    padding: '10px 20px',
                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: loading ? 'none' : '0 2px 8px rgba(30, 144, 255, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-1px)')}
                  onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
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
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProblemDiscussion;