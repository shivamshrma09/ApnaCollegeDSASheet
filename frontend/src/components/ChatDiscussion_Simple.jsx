import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const API_BASE_URL = 'https://plusdsa.onrender.com/api';
const SOCKET_URL = 'https://plusdsa.onrender.com';

// SVG Icon Components
const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
  </svg>
);

const EmojiIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M16.5,7.5C17.33,7.5 18,8.17 18,9C18,9.83 17.33,10.5 16.5,10.5C15.67,10.5 15,9.83 15,9C15,8.17 15.67,7.5 16.5,7.5M7.5,7.5C8.33,7.5 9,8.17 9,9C9,9.83 8.33,10.5 7.5,10.5C6.67,10.5 6,9.83 6,9C6,8.17 6.67,7.5 7.5,7.5M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23Z"/>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19,6.41L17.59,5 12,10.59 6.41,5 5,6.41 10.59,12 5,17.59 6.41,19 12,13.41 17.59,19 19,17.59 13.41,12z"/>
  </svg>
);

const CreateGroupIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M21,9V7H19V9H17V11H19V13H21V11H23V9M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
  </svg>
);

const JoinGroupIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z"/>
  </svg>
);

const UpvoteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"/>
  </svg>
);

const DownvoteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
  </svg>
);

const ReplyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10,9V5L3,12L10,19V14.9C15,14.9 18.5,16.5 21,20C20,15 17,10 10,9Z"/>
  </svg>
);

const ChatDiscussion = ({ isDark, isOpen, onClose, problemId = 'general' }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentRoom, setCurrentRoom] = useState('general');
  const [isDMMode, setIsDMMode] = useState(false);
  const [selectedDMUser, setSelectedDMUser] = useState(null);
  const [showRoomSelector, setShowRoomSelector] = useState(false);
  const [showDMList, setShowDMList] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(1);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  const rooms = [
    { id: 'general', name: 'General Discussion', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12,3C6.5,3 2,6.58 2,11C2.05,13.15 3.06,15.17 4.75,16.5C4.75,17.1 4.33,18.67 2,21C4.37,20.89 6.64,20 8.47,18.5C9.61,18.83 10.81,19 12,19C17.5,19 22,15.42 22,11C22,6.58 17.5,3 12,3Z"/></svg> },
    { id: 'arrays', name: 'Arrays & Strings', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3,3H21V5H3V3M3,7H17V9H3V7M3,11H21V13H3V11M3,15H17V17H3V15M3,19H21V21H3V19Z"/></svg> },
    { id: 'trees', name: 'Trees & Graphs', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2L13.09,8.26L22,9L17,14L18.18,22L12,18.27L5.82,22L7,14L2,9L10.91,8.26L12,2Z"/></svg> }
  ];

  const emojis = ['😊', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '🎉', '🔥'];
  const [dmUsers, setDmUsers] = useState([]);
  const [userGroups, setUserGroups] = useState([]);

  useEffect(() => {
    if (isOpen) {
      initializeSocket();
      loadMessages();
      loadRealUsers();
      loadUserGroups();
    }
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [isOpen, currentRoom, isDMMode, selectedDMUser]);

  const initializeSocket = () => {
    const token = localStorage.getItem('token');
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
      auth: {
        token: token
      }
    });
    
    newSocket.on('connect', () => {
      const roomId = isDMMode && selectedDMUser 
        ? `dm_${getCurrentUser().id}_${selectedDMUser.id}` 
        : currentRoom;
      
      newSocket.emit('join_room', { roomId, user: getCurrentUser() });
    });

    newSocket.on('message_received', (message) => {
      setMessages(prev => {
        const exists = prev.find(m => m.id === message.id);
        if (exists) return prev;
        return [...prev, { 
          ...message, 
          upvotes: message.upvotes || 0, 
          downvotes: message.downvotes || 0, 
          upvotedBy: message.upvotedBy || [],
          downvotedBy: message.downvotedBy || []
        }];
      });
      scrollToBottom();
    });

    newSocket.on('user_typing', (data) => {
      if (data.user !== getCurrentUser().name) {
        setTypingUsers(prev => [...prev.filter(u => u !== data.user), data.user]);
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(u => u !== data.user));
        }, 3000);
      }
    });

    newSocket.on('users_online', (count) => {
      setOnlineUsers(count);
    });

    setSocket(newSocket);
  };

  const getCurrentUser = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
      id: user.id || 'anonymous',
      name: user.name || 'Anonymous User'
    };
  };

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = isDMMode && selectedDMUser 
        ? `${API_BASE_URL}/chat/dm/${getCurrentUser().id}/${selectedDMUser.id}`
        : `${API_BASE_URL}/chat/room/${currentRoom}`;
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadRealUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const currentUserId = getCurrentUser().id;
        const users = data.users || [];
        const otherUsers = users.filter(user => {
          const userId = user._id || user.id;
          return userId !== currentUserId;
        });
        
        if (otherUsers.length > 0) {
          const formattedUsers = otherUsers.map(user => ({
            id: user._id || user.id,
            name: user.name || user.username || 'Unknown User',
            email: user.email,
            status: ['online', 'busy', 'away'][Math.floor(Math.random() * 3)]
          }));
          setDmUsers(formattedUsers);
        } else {
          setDmUsers([
            { id: 'demo1', name: 'ANAND KUMAR', status: 'online' },
            { id: 'demo2', name: 'PRIYA SHARMA', status: 'busy' }
          ]);
        }
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setDmUsers([
        { id: 'demo1', name: 'ANAND KUMAR', status: 'online' },
        { id: 'demo2', name: 'PRIYA SHARMA', status: 'busy' }
      ]);
    }
  };

  const loadUserGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      const currentUser = getCurrentUser();
      const response = await fetch(`${API_BASE_URL}/chat/user-groups/${currentUser.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserGroups(data.groups || []);
      }
    } catch (error) {
      console.error('Error loading user groups:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    // Check authorization
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to send messages');
      return;
    }

    try {
      const { sanitizeInput, addCSRFHeaders } = await import('../utils/security');
      const sanitizedMessage = sanitizeInput(newMessage);

      const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: sanitizedMessage,
        user: getCurrentUser(),
        timestamp: new Date().toISOString(),
        roomId: currentRoom,
        isDM: isDMMode,
        receiverId: selectedDMUser?.id,
        upvotes: 0,
        downvotes: 0,
        upvotedBy: [],
        downvotedBy: []
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      scrollToBottom();

      if (socket && socket.connected) {
        const roomId = isDMMode ? `dm_${getCurrentUser().id}_${selectedDMUser?.id}` : currentRoom;
        socket.emit('send_message', {
          ...message,
          roomId,
          targetRoom: roomId
        });
      }

      const endpoint = isDMMode 
        ? `${API_BASE_URL}/chat/dm/send`
        : `${API_BASE_URL}/chat/room/send`;
      
      await fetch(endpoint, {
        method: 'POST',
        headers: addCSRFHeaders({
          'Authorization': `Bearer ${token}`
        }),
        body: JSON.stringify(message)
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleTyping = () => {
    if (socket) {
      const roomId = isDMMode ? `dm_${getCurrentUser().id}_${selectedDMUser?.id}` : currentRoom;
      socket.emit('typing', { roomId, user: getCurrentUser().name });
    }
  };

  const switchToRoom = (roomId) => {
    setCurrentRoom(roomId);
    setIsDMMode(false);
    setSelectedDMUser(null);
    setShowRoomSelector(false);
    setMessages([]);
  };

  const switchToDM = (user) => {
    setSelectedDMUser(user);
    setIsDMMode(true);
    setCurrentRoom('dm');
    setShowDMList(false);
    setMessages([]);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleUpvote = async (messageId) => {
    const currentUser = getCurrentUser();
    const message = messages.find(msg => msg.id === messageId);
    if (message && message.upvotedBy && message.upvotedBy.includes(currentUser.id)) {
      return;
    }
    
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const upvotedBy = msg.upvotedBy || [];
        const newUpvotedBy = [...upvotedBy, currentUser.id];
        
        return {
          ...msg,
          upvotes: newUpvotedBy.length,
          upvotedBy: newUpvotedBy
        };
      }
      return msg;
    }));
    
    if (socket) {
      socket.emit('vote_message', { messageId, type: 'upvote', userId: currentUser.id, roomId: currentRoom });
    }
  };

  const handleDownvote = async (messageId) => {
    const currentUser = getCurrentUser();
    const message = messages.find(msg => msg.id === messageId);
    if (message && message.downvotedBy && message.downvotedBy.includes(currentUser.id)) {
      return;
    }
    
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const downvotedBy = msg.downvotedBy || [];
        const newDownvotedBy = [...downvotedBy, currentUser.id];
        
        return {
          ...msg,
          downvotes: newDownvotedBy.length,
          downvotedBy: newDownvotedBy
        };
      }
      return msg;
    }));
    
    if (socket) {
      socket.emit('vote_message', { messageId, type: 'downvote', userId: currentUser.id, roomId: currentRoom });
    }
  };

  const createGroup = async (groupName) => {
    try {
      const { sanitizeInput, addCSRFHeaders, isAuthorized } = await import('../utils/security');
      
      if (!isAuthorized()) {
        alert('Please login to create groups');
        return;
      }

      const currentUser = getCurrentUser();
      const sanitizedGroupName = sanitizeInput(groupName);
      
      const response = await fetch(`${API_BASE_URL}/chat/create-group`, {
        method: 'POST',
        headers: addCSRFHeaders({
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }),
        body: JSON.stringify({
          groupName: sanitizedGroupName,
          description: `Group created by ${sanitizeInput(currentUser.name)}`,
          creatorId: currentUser.id,
          creatorName: sanitizeInput(currentUser.name)
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const message = `🎉 Group "${groupName}" created successfully!\n\n📋 Invite Code: ${data.group.inviteCode}\n\n💡 Share this code with friends to join your group!\n\n📱 Code copied to clipboard!`;
        navigator.clipboard.writeText(data.group.inviteCode);
        alert(message);
        setCurrentRoom(data.group.id);
        loadMessages();
      }
    } catch (error) {
      console.error('Error creating group:', error);
      alert('❌ Failed to create group');
    }
  };

  const joinGroup = async (inviteCode) => {
    try {
      const currentUser = getCurrentUser();
      const response = await fetch(`${API_BASE_URL}/chat/join-group/${inviteCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: currentUser.name
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`🎉 Successfully joined "${data.groupName}"!`);
        setCurrentRoom(data.groupId);
        loadMessages();
      } else {
        const error = await response.json();
        alert(`❌ ${error.error}`);
      }
    } catch (error) {
      console.error('Error joining group:', error);
      alert('❌ Failed to join group');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '400px',
      height: '100vh',
      background: isDark ? '#1f2937' : '#ffffff',
      borderLeft: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        background: isDark ? '#374151' : '#f8fafc'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setShowRoomSelector(!showRoomSelector)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#3b82f6',
                border: 'none',
                cursor: 'pointer',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {rooms.find(r => r.id === currentRoom)?.icon || <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12,3C6.5,3 2,6.58 2,11C2.05,13.15 3.06,15.17 4.75,16.5C4.75,17.1 4.33,18.67 2,21C4.37,20.89 6.64,20 8.47,18.5C9.61,18.83 10.81,19 12,19C17.5,19 22,15.42 22,11C22,6.58 17.5,3 12,3Z"/></svg>}
            </button>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                color: isDark ? '#ffffff' : '#1f2937'
              }}>
                {isDMMode && selectedDMUser 
                  ? `${selectedDMUser.name}` 
                  : rooms.find(r => r.id === currentRoom)?.name || 'Chat'
                }
              </h3>
              <div style={{
                fontSize: '12px',
                color: isDark ? '#9ca3af' : '#6b7280'
              }}>
                {onlineUsers} online
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShowDMList(!showDMList)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isDark ? '#9ca3af' : '#6b7280',
                padding: '4px'
              }}
            >
              <UserIcon />
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isDark ? '#9ca3af' : '#6b7280',
                padding: '4px'
              }}
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Room Selector */}
        {showRoomSelector && (
          <div style={{
            position: 'absolute',
            top: '70px',
            left: '16px',
            background: isDark ? '#1f2937' : '#ffffff',
            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1001,
            minWidth: '200px'
          }}>
            {rooms.map(room => (
              <button
                key={room.id}
                onClick={() => switchToRoom(room.id)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: currentRoom === room.id ? (isDark ? '#374151' : '#f3f4f6') : 'none',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: isDark ? '#ffffff' : '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>{room.icon}</span>
                <span>{room.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* DM List */}
        {showDMList && (
          <div style={{
            position: 'absolute',
            top: '70px',
            right: '16px',
            background: isDark ? '#1f2937' : '#ffffff',
            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            borderRadius: '12px',
            padding: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1001,
            minWidth: '280px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: isDark ? '#ffffff' : '#1f2937', fontSize: '14px' }}>Direct Messages</h4>
            {dmUsers.map(user => (
              <button
                key={user.id}
                onClick={() => switchToDM(user)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  background: 'none',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: isDark ? '#ffffff' : '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  {user.name[0]}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '12px' }}>{user.name}</div>
                  <div style={{ fontSize: '10px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                    🟢 {user.status}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        background: isDark ? '#111827' : '#f9fafb'
      }}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: isDark ? '#9ca3af' : '#6b7280'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <h4 style={{ margin: '0 0 8px 0' }}>Start a conversation</h4>
            <p style={{ fontSize: '14px', margin: 0 }}>
              {isDMMode ? `Send a message to ${selectedDMUser?.name}` : 'Share your thoughts with the community'}
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwn = message.user.id === getCurrentUser().id;
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
                      {message.user.name}
                    </div>
                  )}
                  <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                    {message.text}
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
                      onClick={() => handleUpvote(message.id)}
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
                      <UpvoteIcon />
                      {message.upvotes || 0}
                    </button>
                    
                    <button
                      onClick={() => handleDownvote(message.id)}
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
                      <DownvoteIcon />
                      {message.downvotes || 0}
                    </button>
                    
                    <button
                      onClick={() => {
                        setNewMessage(`@${message.user.name} `);
                      }}
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
                      <ReplyIcon />
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div style={{
            padding: '8px 16px',
            fontSize: '12px',
            color: isDark ? '#9ca3af' : '#6b7280',
            fontStyle: 'italic'
          }}>
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
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
            <EmojiIcon />
          </button>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
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
            onClick={sendMessage}
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
            <SendIcon />
          </button>
        </div>
        
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div style={{
            position: 'absolute',
            bottom: '80px',
            left: '16px',
            background: isDark ? '#1f2937' : '#ffffff',
            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '200px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '6px',
              marginBottom: '12px'
            }}>
              {emojis.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => {
                    setNewMessage(prev => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    padding: '6px',
                    borderRadius: '4px'
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
            
            <div style={{ borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`, paddingTop: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <button
                  onClick={() => {
                    const groupName = prompt('🏠 Enter group name:');
                    if (groupName && groupName.trim()) {
                      createGroup(groupName.trim());
                      loadUserGroups();
                    }
                    setShowEmojiPicker(false);
                  }}
                  style={{
                    background: '#3b82f6',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'white',
                    padding: '8px 6px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <CreateGroupIcon />
                  Create
                </button>
                
                <button
                  onClick={() => {
                    const inviteCode = prompt('🔑 Enter invite code:');
                    if (inviteCode && inviteCode.trim()) {
                      joinGroup(inviteCode.trim().toUpperCase());
                      loadUserGroups();
                    }
                    setShowEmojiPicker(false);
                  }}
                  style={{
                    background: '#10b981',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'white',
                    padding: '8px 6px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <JoinGroupIcon />
                  Join
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDiscussion;