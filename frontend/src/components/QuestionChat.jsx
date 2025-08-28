import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser, FaHeart, FaQuestion, FaReply } from 'react-icons/fa';
import axios from 'axios';
import io from 'socket.io-client';
import './QuestionChat.css';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://apnacollegedsasheet.onrender.com') + '/api';

const QuestionChat = ({ problem, isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isQuestion, setIsQuestion] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [socket, setSocket] = useState(null);
  const [hasNewReplies, setHasNewReplies] = useState(false);
  const messagesEndRef = useRef(null);
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
    const newSocket = io(import.meta.env.VITE_API_URL || 'https://apnacollegedsasheet.onrender.com');
    
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
      console.error('Error fetching messages:', error);
      // Fallback: Load from localStorage
      const localMessages = JSON.parse(localStorage.getItem(`chat_${problem.id}`) || '[]');
      setMessages(localMessages);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      _id: Date.now().toString(),
      message: newMessage,
      senderName: user.name || 'Anonymous',
      senderId: user.id || 'anonymous',
      isQuestion: isQuestion,
      timestamp: new Date().toISOString(),
      likes: [],
      replies: []
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/question-chat/${problem.id}/send`, {
        ...messageData,
        problemTitle: problem.title,
        problemLink: problem.link
      });
      
      if (response.data.success) {
        setMessages(prev => [...prev, response.data.message]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback: Save to localStorage
      const newMessages = [...messages, messageData];
      setMessages(newMessages);
      localStorage.setItem(`chat_${problem.id}`, JSON.stringify(newMessages));
      
      // Simulate AI response for questions
      if (isQuestion) {
        setTimeout(() => {
          const aiMessage = {
            _id: (Date.now() + 1).toString(),
            message: `🤖 **AI Response:** Great question about "${problem.title}"!\n\nFor this problem, I recommend:\n1️⃣ **Understand the pattern** - Look at the problem constraints\n2️⃣ **Think step by step** - Break it into smaller parts\n3️⃣ **Consider edge cases** - What happens with empty inputs?\n4️⃣ **Optimize** - Can you improve time/space complexity?\n\n💡 **Hint:** Try drawing out examples first!`,
            senderName: 'AI Assistant',
            isAI: true,
            timestamp: new Date().toISOString(),
            likes: [],
            replies: []
          };
          const updatedMessages = [...newMessages, aiMessage];
          setMessages(updatedMessages);
          localStorage.setItem(`chat_${problem.id}`, JSON.stringify(updatedMessages));
        }, 2000);
      }
    }
    
    setNewMessage('');
    setIsQuestion(false);
  };

  const sendReply = async (messageId) => {
    if (!replyText.trim()) return;

    try {
      const replyData = {
        message: replyText,
        senderName: user.name || 'Anonymous',
        senderId: user.id || 'anonymous'
      };

      const response = await axios.post(`${API_BASE_URL}/question-chat/${problem.id}/reply/${messageId}`, replyData);
      
      if (response.data.success) {
        setMessages(prev => prev.map(msg => 
          msg._id === messageId 
            ? { ...msg, replies: [...(msg.replies || []), response.data.reply] }
            : msg
        ));
        setReplyText('');
        setReplyTo(null);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const likeMessage = async (messageId) => {
    try {
      await axios.post(`${API_BASE_URL}/question-chat/${problem.id}/like/${messageId}`, {
        userId: user.id || 'anonymous'
      });
      fetchMessages();
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
          <button className="chat-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="question-chat-messages">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <FaQuestion />
              <p>No questions yet for this problem!</p>
              <p>Ask a question and get help from AI or community members.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.isAI ? 'ai-message' : 'user-message'}`}>
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
                    className="like-btn"
                    onClick={() => likeMessage(msg._id)}
                  >
                    <FaHeart />
                    <span>{msg.likes?.length || 0}</span>
                  </button>
                  
                  {!msg.isAI && (
                    <button 
                      className="reply-btn"
                      onClick={() => setReplyTo(replyTo === msg._id ? null : msg._id)}
                    >
                      <FaReply />
                      Reply
                    </button>
                  )}
                </div>

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
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="question-chat-input">
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
              placeholder={isQuestion ? "Ask your question about this problem..." : "Share your thoughts..."}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="message-input"
            />
            <button onClick={sendMessage} className="send-btn">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionChat;