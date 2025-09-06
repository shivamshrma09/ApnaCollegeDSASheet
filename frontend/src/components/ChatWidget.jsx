import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser, FaHeart, FaQuestion, FaUsers, FaReply, FaTrophy } from 'react-icons/fa';
import axios from 'axios';
import io from 'socket.io-client';
import MockInterview from './MockInterview';
import ChallengeWidget from './ChallengeWidget';
import { getRandomQuestion } from '../data/challengeQuestions';
// import './ChatWidget.css'; // CSS file removed

const API_BASE_URL = 'http://localhost:5001/api';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chats');
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [replyTo, setReplyTo] = useState(null);
  const [socket, setSocket] = useState(null);
  const [showMockInterview, setShowMockInterview] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [challengeForm, setChallengeForm] = useState({ title: '', description: '', duration: 1 });
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (isOpen) {
      fetchChatRooms();
      fetchUsers();
      fetchUnreadCount();
      initSocket();
    }
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initSocket = () => {
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:5001', {
      auth: {
        token: token
      }
    });
    
    newSocket.on('newMessage', (message) => {
      if (selectedChat && message.chatId === selectedChat._id) {
        setMessages(prev => [...prev, message]);
      }
      fetchUnreadCount();
    });

    newSocket.on('messageUpdated', (message) => {
      setMessages(prev => prev.map(m => m._id === message._id ? message : m));
    });

    newSocket.on('newChallenge', (challenge) => {
      setActiveChallenge(challenge);
    });

    setSocket(newSocket);
  };

  const fetchChatRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/chat/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const messages = response.data.messages || [];
      
      // Create a default chat room
      const defaultRoom = {
        _id: 'general',
        name: 'General Chat',
        type: 'group',
        unreadCount: 0
      };
      setChatRooms([defaultRoom]);
      setSelectedChat(defaultRoom);
      setMessages(messages);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat-system/users`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat-system/unread`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setUnreadCount(response.data.totalUnread);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat-system/rooms/${chatId}/messages`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setMessages(response.data);
      
      if (socket) {
        socket.emit('joinRoom', chatId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const messageData = {
        message: newMessage,
        senderName: user.name || 'Anonymous',
        senderId: user.id || 'anonymous'
      };

      const response = await axios.post(`${API_BASE_URL}/chat/send`, messageData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setMessages(prev => [...prev, response.data.message]);
        setNewMessage('');
        setReplyTo(null);
        
        if (socket) {
          socket.emit('newMessage', response.data.message);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const createDM = async (userId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat-system/dm`, 
        { userId },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );

      const dmRoom = response.data;
      setSelectedChat(dmRoom);
      setActiveTab('chats');
      fetchMessages(dmRoom._id);
      fetchChatRooms();
    } catch (error) {
      console.error('Error creating DM:', error);
    }
  };

  const upvoteMessage = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/chat/like/${messageId}`, {
        userId: user.id || 'anonymous'
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Refresh messages to show updated likes
      const response = await axios.get(`${API_BASE_URL}/chat/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error upvoting message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const createChallenge = async () => {
    try {
      const randomQuestion = getRandomQuestion();
      const challengeData = {
        title: randomQuestion.title,
        description: randomQuestion.description,
        duration: challengeForm.duration
      };
      
      const response = await axios.post('http://localhost:5001/api/challenges', challengeData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      setActiveChallenge(response.data);
      setShowCreateChallenge(false);
      setChallengeForm({ title: '', description: '', duration: 1 });
    } catch (error) {
      console.error('Error creating challenge:', error);
    }
  };

  return (
    <>
      {showMockInterview && (
        <MockInterview 
          isDark={false} 
          onClose={() => setShowMockInterview(false)} 
        />
      )}
      
      {activeChallenge && (
        <ChallengeWidget 
          challenge={activeChallenge}
          onClose={() => setActiveChallenge(null)}
        />
      )}
      
      {/* Chat Toggle Button */}
      <div className={`chat-toggle ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
        <FaComments />
        {unreadCount > 0 && <span className="chat-badge">{unreadCount}</span>}
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div className="chat-widget">
          <div className="chat-header">
            <div className="chat-title">
              <FaComments />
              <span>Chat System</span>
              {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
            </div>
            <button className="chat-close" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>

          {/* Tabs */}
          <div className="chat-tabs">
            <button 
              className={`tab ${activeTab === 'chats' ? 'active' : ''}`}
              onClick={() => setActiveTab('chats')}
            >
              Chats
            </button>
            <button 
              className={`tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <FaUsers /> Users
            </button>
            <button 
              className={`tab ${activeTab === 'challenge' ? 'active' : ''}`}
              onClick={() => setActiveTab('challenge')}
            >
              <FaTrophy /> Challenge
            </button>
          </div>

          {activeTab === 'chats' ? (
            <div className="chat-content">
              {!selectedChat ? (
                <div className="chat-list">
                  {chatRooms.map(room => (
                    <div
                      key={room._id}
                      className="chat-room-item"
                      onClick={() => {
                        setSelectedChat(room);
                        fetchMessages(room._id);
                      }}
                    >
                      <div className="room-avatar">
                        {room.type === 'group' ? '👥' : '💬'}
                      </div>
                      <div className="room-info">
                        <div className="room-name">{room.name}</div>
                        {room.unreadCount > 0 && (
                          <span className="unread-count">{room.unreadCount}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {chatRooms.length === 0 && (
                    <div className="welcome-message">
                      <FaComments />
                      <p>No chats yet</p>
                      <p>Go to Users tab to start a conversation</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="chat-messages">
                  <div className="chat-header-selected">
                    <button onClick={() => setSelectedChat(null)}>←</button>
                    <span>{selectedChat.name}</span>
                  </div>
                  <div className="messages-container">
                    {messages.map((msg) => (
                      <div key={msg._id} className="message">
                        <div className="message-header">
                          <span className="sender-name">{msg.senderName}</span>
                          <span className="message-time">{formatTime(msg.timestamp)}</span>
                        </div>
                        <div className="message-content">{msg.message}</div>
                        <div className="message-actions">
                          <button onClick={() => upvoteMessage(msg._id)}>
                            <FaHeart /> {msg.likes?.length || 0}
                          </button>
                          <button onClick={() => setReplyTo(msg)}>
                            <FaReply /> Reply
                          </button>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'users' ? (
            <div className="users-list">
              {users.map(user => (
                <div
                  key={user._id}
                  className="user-item"
                  onClick={() => createDM(user._id)}
                >
                  <div className="user-avatar">👤</div>
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="challenge-section" style={{ padding: '20px' }}>
              <h3>🎯 Coding Challenges</h3>
              
              {!showCreateChallenge ? (
                <button 
                  onClick={() => setShowCreateChallenge(true)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginBottom: '15px'
                  }}
                >
                  🎯 Create Random Challenge
                </button>
              ) : (
                <div style={{ marginBottom: '15px' }}>
                  <div style={{
                    padding: '15px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    border: '1px solid #0ea5e9'
                  }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#0c4a6e' }}>🎲 Random Challenge</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#075985' }}>
                      A random coding problem will be selected automatically
                    </p>
                  </div>
                  <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={challengeForm.duration}
                    onChange={(e) => setChallengeForm({...challengeForm, duration: parseInt(e.target.value) || 1})}
                    min="1"
                    max="60"
                    style={{
                      width: '100%',
                      padding: '12px',
                      marginBottom: '15px',
                      border: '2px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '16px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={createChallenge}
                      style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}
                    >
                      🚀 Start Challenge
                    </button>
                    <button 
                      onClick={() => setShowCreateChallenge(false)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              {activeChallenge && (
                <div style={{
                  padding: '15px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  marginBottom: '15px'
                }}>
                  <h4 style={{ margin: '0 0 8px 0' }}>Active Challenge</h4>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{activeChallenge.title}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                    {activeChallenge.participants?.length || 0} participants
                  </p>
                </div>
              )}
            </div>
          )}

          {selectedChat && (
            <div className="chat-input">
              {replyTo && (
                <div className="reply-preview">
                  Replying to: {replyTo.content.substring(0, 30)}...
                  <button onClick={() => setReplyTo(null)}>✕</button>
                </div>
              )}
              <div className="input-row">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="message-input"
                />
                <button onClick={sendMessage} className="send-btn">
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;