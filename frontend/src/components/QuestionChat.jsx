import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser, FaHeart, FaQuestion, FaReply } from 'react-icons/fa';
import axios from 'axios';
import io from 'socket.io-client';
import './QuestionChat.css';

import { API_BASE_URL, SOCKET_URL } from '../config/constants';

const QuestionChat = ({ problem, isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isQuestion, setIsQuestion] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [socket, setSocket] = useState(null);
  const [hasNewReplies, setHasNewReplies] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [upvotedMessages, setUpvotedMessages] = useState(new Set());
  const [taggedUser, setTaggedUser] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (isOpen && problem) {
      fetchMessages();
      initSocket();
    }
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [isOpen, problem]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initSocket = () => {
    const newSocket = io(SOCKET_URL);
    
    newSocket.on(`problemChat_${problem.id}`, (data) => {
      if (data.type === 'newMessage') {
        setMessages(prev => [...prev, data.message]);
      } else if (data.type === 'newReply') {
        setMessages(prev => prev.map(msg => 
          msg._id === data.messageId 
            ? { ...msg, replies: [...(msg.replies || []), data.reply] }
            : msg
        ));
        setHasNewReplies(true);
      }
    });

    setSocket(newSocket);
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/question-chat/${problem.id}`);
      setMessages(response.data.messages || []);
      setHasNewReplies(response.data.hasNewReplies || false);
    } catch (error) {
      console.error('Failed to load messages. Please check your connection.');
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;

    const formData = new FormData();
    formData.append('message', newMessage);
    formData.append('senderName', user.name || 'Anonymous');
    formData.append('senderId', user.id || 'anonymous');
    formData.append('isQuestion', false);
    formData.append('problemTitle', problem.title);
    formData.append('problemLink', problem.link);
    
    console.log('Sending message with isQuestion:', isQuestion);
    console.log('FormData isQuestion value:', formData.get('isQuestion'));
    
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/question-chat/${problem.id}/send`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setMessages(prev => [...prev, response.data.message]);
      }
    } catch (error) {
      console.error('Failed to send message. Please try again.');
      alert('Failed to send message. Please check your connection and try again.');
    }
    
    setNewMessage('');
    // Don't reset isQuestion - let user control it
    setSelectedFiles([]);
  };

  const sendReply = async (messageId) => {
    if (!replyText.trim()) return;

    const replyData = {
      sender: user.id || 'anonymous',
      senderName: user.name || 'Anonymous',
      message: replyText,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/question-chat/${problem.id}/reply/${messageId}`, replyData);
      
      if (response.data.success) {
        setMessages(prev => prev.map(msg => 
          msg._id === messageId 
            ? { ...msg, replies: [...(msg.replies || []), response.data.reply] }
            : msg
        ));
      }
    } catch (error) {
      console.error('Failed to send reply. Please try again.');
      alert('Failed to send reply. Please check your connection and try again.');
    }
    
    setReplyText('');
    setReplyTo(null);
  };

  const upvoteMessage = async (messageId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/question-chat/${problem.id}/upvote/${messageId}`, {
        userId: user.id || 'anonymous'
      });
      
      if (response.data.success) {
        setUpvotedMessages(prev => {
          const newSet = new Set(prev);
          if (newSet.has(messageId)) {
            newSet.delete(messageId);
          } else {
            newSet.add(messageId);
          }
          return newSet;
        });
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to upvote message.');
    }
  };

  const replyToUser = (message) => {
    setTaggedUser(message.senderName);
    setReplyTo(message._id);
    setReplyText(`@${message.senderName} `);
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

  if (!isOpen) return null;

  return (
    <div className="question-chat-overlay" onClick={onClose}>
      <div className="question-chat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="question-chat-header">
          <div className="chat-problem-info">
            <FaComments />
            <div>
              <h3>{problem.title}</h3>
              <p>Ask questions & get help from AI and community</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="clear-chat-btn" onClick={() => {
              if (window.confirm('Clear all messages? This cannot be undone.')) {
                setMessages([]);
              }
            }}>
              🗑️ Clear
            </button>
            <button className="chat-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="question-chat-messages">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <FaQuestion />
              <p>No messages yet for this problem!</p>
              <p>Be the first to ask a question or share your thoughts.</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const currentUserId = user.id || 'anonymous';
              const isCurrentUser = msg.senderId === currentUserId;
              const messageClass = msg.isAI ? 'ai-message' : (isCurrentUser ? 'user-message' : 'other-user-message');
              
              return (
              <div key={index} className={`chat-message ${messageClass}`}>
                <div className="message-header">
                  <div className="sender-info">
                    {msg.isAI ? <FaRobot className="sender-icon ai" /> : <FaUser className="sender-icon user" />}
                    <span className="sender-name">{msg.senderName}</span>
                    {msg.isQuestion && <FaQuestion className="question-badge" />}
                  </div>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
                
                <div className="message-content">
                  {msg.message}
                  {msg.files && msg.files.length > 0 && (
                    <div className="message-files">
                      {msg.files.map((file, idx) => (
                        file.type?.startsWith('image/') ? (
                          <img 
                            key={idx}
                            src={file.url}
                            alt="Shared image"
                            className="message-image"
                            onClick={() => window.open(file.url, '_blank')}
                          />
                        ) : (
                          <div key={idx} className="message-file">
                            <span>📎</span>
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                              {file.name}
                            </a>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>

                {/* Replies */}
                {msg.replies && msg.replies.length > 0 && (
                  <div className="message-replies">
                    <div className="replies-header">
                      <FaReply /> {msg.replies.length} {msg.replies.length === 1 ? 'Reply' : 'Replies'}
                    </div>
                    {msg.replies.map((reply, idx) => (
                      <div key={idx} className="reply-item">
                        <div className="reply-header">
                          <FaUser className="reply-icon" />
                          <span className="reply-sender">{reply.senderName}</span>
                          <span className="reply-time">{formatTime(reply.timestamp)}</span>
                        </div>
                        <div className="reply-content">{reply.message}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="message-actions">
                  <button 
                    className={`action-btn upvote-btn ${upvotedMessages.has(msg._id) ? 'upvoted' : ''}`}
                    onClick={() => upvoteMessage(msg._id)}
                  >
                    ▲ {msg.upvotes?.length || 0}
                  </button>
                  
                  <button 
                    className="action-btn reply-btn"
                    onClick={() => replyToUser(msg)}
                  >
                    <FaReply /> Reply
                  </button>
                  
                  {isCurrentUser && (
                    <div className={`seen-indicator ${msg.seen ? 'seen' : ''}`}>
                      {msg.seen ? '✓✓ Seen' : '✓ Sent'}
                    </div>
                  )}
                </div>
                
                {msg.message.includes('@') && (
                  <div className="message-tag">
                    {msg.message.match(/@\w+/g)?.map(tag => tag).join(' ')}
                  </div>
                )}

                {/* Reply Input */}
                {replyTo === msg._id && (
                  <div className="reply-input">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      onKeyPress={(e) => e.key === 'Enter' && sendReply(msg._id)}
                    />
                    <button onClick={() => sendReply(msg._id)}>
                      <FaPaperPlane />
                    </button>
                  </div>
                )}
              </div>
            );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="question-chat-input">

          {selectedFiles.length > 0 && (
            <div className="file-preview">
              {selectedFiles.map((file, index) => (
                <div key={index} className="file-preview-item">
                  {file.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(file)} alt="Preview" className="image-preview" />
                  ) : (
                    <span>📎 {file.name}</span>
                  )}
                  <button onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))} className="file-preview-remove">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="input-row">
            <div className="file-upload-container">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={(e) => setSelectedFiles(prev => [...prev, ...Array.from(e.target.files)])}
                className="file-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="file-upload-btn"
              >
                📎
              </button>
            </div>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share your thoughts..."
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              className="message-input"
              rows={1}
            />
            <button onClick={sendMessage} className="send-btn" disabled={!newMessage.trim() && selectedFiles.length === 0}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionChat;