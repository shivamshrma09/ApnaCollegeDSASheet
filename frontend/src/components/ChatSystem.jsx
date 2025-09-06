import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const ChatSystem = ({ isDark, onClose }) => {
  const [activeTab, setActiveTab] = useState('chats');
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [replyTo, setReplyTo] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5001';
    socketRef.current = io(serverUrl);
    
    fetchChatRooms();
    fetchUsers();
    fetchUnreadCount();

    // Socket listeners
    socketRef.current.on('newMessage', (message) => {
      if (selectedChat && message.chatId === selectedChat._id) {
        setMessages(prev => [...prev, message]);
      }
      fetchUnreadCount();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatRooms = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/chat-system/rooms', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setChatRooms(data);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/chat-system/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/chat-system/unread', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUnreadCount(data.totalUnread);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/chat-system/rooms/${chatId}/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setMessages(data);
      
      // Join socket room
      socketRef.current.emit('joinRoom', chatId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const response = await fetch('http://localhost:5001/api/chat-system/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          chatId: selectedChat._id,
          content: newMessage,
          replyTo: replyTo?._id
        })
      });

      if (response.ok) {
        setNewMessage('');
        setReplyTo(null);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const createDM = async (userId) => {
    try {
      const response = await fetch('http://localhost:5001/api/chat-system/dm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId })
      });

      const dmRoom = await response.json();
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
      await fetch(`http://localhost:5001/api/chat-system/messages/${messageId}/upvote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.error('Error upvoting message:', error);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '95%',
        height: '90%',
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderRadius: '12px',
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Sidebar */}
        <div style={{
          width: '300px',
          borderRight: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px',
            borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
              color: isDark ? '#ffffff' : '#1f2937'
            }}>
              Chat System
              {unreadCount > 0 && (
                <span style={{
                  marginLeft: '8px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '12px'
                }}>
                  {unreadCount}
                </span>
              )}
            </h2>
            <button onClick={onClose} style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: isDark ? '#9ca3af' : '#6b7280'
            }}>
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
          }}>
            {['chats', 'users'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  backgroundColor: activeTab === tab 
                    ? (isDark ? '#374151' : '#f3f4f6') 
                    : 'transparent',
                  color: isDark ? '#ffffff' : '#1f2937',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {activeTab === 'chats' ? (
              <div>
                {chatRooms.map(room => (
                  <div
                    key={room._id}
                    onClick={() => {
                      setSelectedChat(room);
                      fetchMessages(room._id);
                    }}
                    style={{
                      padding: '12px 16px',
                      borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                      cursor: 'pointer',
                      backgroundColor: selectedChat?._id === room._id 
                        ? (isDark ? '#374151' : '#f3f4f6') 
                        : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px'
                    }}>
                      {room.type === 'group' ? '👥' : '💬'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: '500',
                        color: isDark ? '#ffffff' : '#1f2937'
                      }}>
                        {room.name}
                      </div>
                      {room.unreadCount > 0 && (
                        <span style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          borderRadius: '50%',
                          padding: '2px 6px',
                          fontSize: '12px'
                        }}>
                          {room.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {users.map(user => (
                  <div
                    key={user._id}
                    onClick={() => createDM(user._id)}
                    style={{
                      padding: '12px 16px',
                      borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px'
                    }}>
                      👤
                    </div>
                    <div>
                      <div style={{
                        fontWeight: '500',
                        color: isDark ? '#ffffff' : '#1f2937'
                      }}>
                        {user.name}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: isDark ? '#9ca3af' : '#6b7280'
                      }}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div style={{
                padding: '16px',
                borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                backgroundColor: isDark ? '#374151' : '#f9fafb'
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '600',
                  color: isDark ? '#ffffff' : '#1f2937'
                }}>
                  {selectedChat.name}
                </h3>
              </div>

              {/* Messages */}
              <div style={{
                flex: 1,
                padding: '16px',
                overflow: 'auto',
                backgroundColor: isDark ? '#1f2937' : '#ffffff'
              }}>
                {messages.map(message => (
                  <div key={message._id} style={{
                    marginBottom: '16px',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#374151' : '#f3f4f6'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <span style={{
                        fontWeight: '500',
                        color: isDark ? '#60a5fa' : '#3b82f6'
                      }}>
                        {message.sender.name}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: isDark ? '#9ca3af' : '#6b7280'
                      }}>
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                    <div style={{
                      color: isDark ? '#ffffff' : '#1f2937',
                      marginBottom: '8px'
                    }}>
                      {message.content}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <button
                        onClick={() => upvoteMessage(message._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: isDark ? '#9ca3af' : '#6b7280'
                        }}
                      >
                        👍 {message.upvotes?.length || 0}
                      </button>
                      <button
                        onClick={() => setReplyTo(message)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: isDark ? '#9ca3af' : '#6b7280'
                        }}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div style={{
                padding: '16px',
                borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
              }}>
                {replyTo && (
                  <div style={{
                    padding: '8px',
                    backgroundColor: isDark ? '#374151' : '#f3f4f6',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    fontSize: '12px'
                  }}>
                    Replying to: {replyTo.content.substring(0, 50)}...
                    <button
                      onClick={() => setReplyTo(null)}
                      style={{
                        marginLeft: '8px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                      borderRadius: '6px',
                      backgroundColor: isDark ? '#374151' : '#ffffff',
                      color: isDark ? '#ffffff' : '#1f2937'
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDark ? '#9ca3af' : '#6b7280'
            }}>
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;