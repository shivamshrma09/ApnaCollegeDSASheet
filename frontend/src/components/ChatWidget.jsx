import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser, FaHeart, FaQuestion } from 'react-icons/fa';
import axios from 'axios';
import io from 'socket.io-client';
import './ChatWidget.css';

const API_BASE_URL = 'http://localhost:5001/api';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isQuestion, setIsQuestion] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(12);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
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
    const newSocket = io('http://localhost:5001');
    
    newSocket.on('newMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('userCount', (count) => {
      setOnlineUsers(count);
    });

    setSocket(newSocket);
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/messages`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        message: newMessage,
        senderName: user.name || 'Anonymous',
        senderId: user.id || 'anonymous',
        isQuestion: isQuestion
      };

      const response = await axios.post(`${API_BASE_URL}/chat/send`, messageData);
      
      if (response.data.success) {
        setMessages(prev => [...prev, response.data.message]);
        setNewMessage('');
        setIsQuestion(false);
        
        if (socket) {
          socket.emit('newMessage', response.data.message);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const likeMessage = async (messageId) => {
    try {
      await axios.post(`${API_BASE_URL}/chat/like/${messageId}`, {
        userId: user.id || 'anonymous'
      });
      fetchMessages(); // Refresh to get updated likes
    } catch (error) {
      console.error('Error liking message:', error);
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

  return (
    <>
      {/* Chat Toggle Button */}
      <div className={`chat-toggle ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
        <FaComments />
        <span className="chat-badge">{onlineUsers}</span>
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div className="chat-widget">
          <div className="chat-header">
            <div className="chat-title">
              <FaComments />
              <span>DSA Community Chat</span>
              <div className="online-indicator">
                <span className="online-dot"></span>
                {onlineUsers} online
              </div>
            </div>
            <button className="chat-close" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <FaRobot />
                <p>Welcome to DSA Community Chat!</p>
                <p>Ask questions, share solutions, and connect with developers.</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`message ${msg.isAI ? 'ai-message' : 'user-message'}`}>
                  <div className="message-header">
                    <div className="sender-info">
                      {msg.isAI ? <FaRobot className="sender-icon ai" /> : <FaUser className="sender-icon user" />}
                      <span className="sender-name">{msg.senderName}</span>
                      {msg.isQuestion && <FaQuestion className="question-icon" />}
                    </div>
                    <span className="message-time">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div className="message-content">
                    {msg.message}
                  </div>
                  <div className="message-actions">
                    <button 
                      className="like-btn"
                      onClick={() => likeMessage(msg._id)}
                    >
                      <FaHeart />
                      <span>{msg.likes?.length || 0}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <div className="input-options">
              <label className="question-toggle">
                <input
                  type="checkbox"
                  checked={isQuestion}
                  onChange={(e) => setIsQuestion(e.target.checked)}
                />
                <FaQuestion />
                <span>Ask Question (AI will respond)</span>
              </label>
            </div>
            <div className="input-row">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isQuestion ? "Ask your DSA question..." : "Type a message..."}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="message-input"
              />
              <button onClick={sendMessage} className="send-btn">
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;