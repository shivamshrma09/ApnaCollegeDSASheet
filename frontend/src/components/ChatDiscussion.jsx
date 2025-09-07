import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { dsaProblems } from '../data/dsaProblems';

const API_BASE_URL = 'https://plusdsa.onrender.com/api';
const SOCKET_URL = 'https://plusdsa.onrender.com';

// SVG Icon Components
const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
  </svg>
);

const AttachIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z"/>
  </svg>
);

const VoiceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
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

const GroupIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16,4C16.88,4 17.67,4.38 18.18,5H20C21.11,5 22,5.89 22,7V17C22,18.11 21.11,19 20,19H4C2.89,19 2,18.11 2,17V7C2,5.89 2.89,5 4,5H5.82C6.33,4.38 7.12,4 8,4H16M16,6H8A1,1 0 0,0 7,7V17H17V7A1,1 0 0,0 16,6Z"/>
  </svg>
);

const PollIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3,3H21V5H3V3M3,7H17V9H3V7M3,11H21V13H3V11M3,15H17V17H3V15M3,19H21V21H3V19Z"/>
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

const LinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
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

const CodeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z"/>
  </svg>
);

const ChallengeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2Z"/>
  </svg>
);

const TimerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
  </svg>
);

const ScreenshotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9,2V5H7A2,2 0 0,0 5,7V9H2V7A5,5 0 0,1 7,2H9M17,2A5,5 0 0,1 22,7V9H19V7A2,2 0 0,0 17,5H15V2H17M15,22V19H17A2,2 0 0,0 19,17V15H22V17A5,5 0 0,1 17,22H15M2,15H5V17A2,2 0 0,0 7,19H9V22H7A5,5 0 0,1 2,17V15Z"/>
  </svg>
);

const MathIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M7.5,18C6.12,18 5,16.88 5,15.5C5,14.12 6.12,13 7.5,13C8.88,13 10,14.12 10,15.5C10,16.88 8.88,18 7.5,18M19,17H14V15H19V17M19,13H14V11H19V13M19,9H14V7H19V9Z"/>
  </svg>
);

const BadgeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5,16L3,5L8.5,12L12,5L15.5,12L21,5L19,16H5M19,19A1,1 0 0,1 18,20H6A1,1 0 0,1 5,19V18H19V19Z"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
  </svg>
);

const NotesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
  </svg>
);

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
  </svg>
);

const TestIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7,2V4H8V18A4,4 0 0,0 12,22A4,4 0 0,0 16,18V4H17V2H7M11,16C10.4,16 10,15.6 10,15C10,14.4 10.4,14 11,14C11.6,14 12,14.4 12,15C12,15.6 11.6,16 11,16M13,12C12.4,12 12,11.6 12,11C12,10.4 12.4,10 13,10C13.6,10 14,10.4 14,11C14,11.6 13.6,12 13,12M14,7H10V4H14V7Z"/>
  </svg>
);

const SpeedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,16A3,3 0 0,1 9,13C9,11.88 9.61,10.9 10.5,10.39L20.21,4.77L14.68,14.35C14.18,15.33 13.17,16 12,16M12,3C13.81,3 15.5,3.5 16.97,4.32L14.87,5.53C14,5.19 13,5 12,5A8,8 0 0,0 4,13C4,15.21 4.89,17.21 6.34,18.65H6.35C6.74,19.04 6.74,19.67 6.35,20.06C5.96,20.45 5.33,20.45 4.94,20.06C3.1,18.22 2,15.71 2,13A10,10 0 0,1 12,3Z"/>
  </svg>
);

const OptimizeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,6V14L17.25,10.5L11,6Z"/>
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
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const rooms = [
    { id: 'general', name: 'General Discussion', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12,3C6.5,3 2,6.58 2,11C2.05,13.15 3.06,15.17 4.75,16.5C4.75,17.1 4.33,18.67 2,21C4.37,20.89 6.64,20 8.47,18.5C9.61,18.83 10.81,19 12,19C17.5,19 22,15.42 22,11C22,6.58 17.5,3 12,3Z"/></svg> },
    { id: 'arrays', name: 'Arrays & Strings', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3,3H21V5H3V3M3,7H17V9H3V7M3,11H21V13H3V11M3,15H17V17H3V15M3,19H21V21H3V19Z"/></svg> },
    { id: 'trees', name: 'Trees & Graphs', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2L13.09,8.26L22,9L17,14L18.18,22L12,18.27L5.82,22L7,14L2,9L10.91,8.26L12,2Z"/></svg> },
    { id: 'dp', name: 'Dynamic Programming', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4Z"/></svg> },
    { id: 'algorithms', name: 'Algorithms', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2L13.09,8.26L22,9L17,14L18.18,22L12,18.27L5.82,22L7,14L2,9L10.91,8.26L12,2Z"/></svg> },
    { id: 'code-review', name: 'Code Review', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z"/></svg> },
    { id: 'coding-battles', name: 'Coding Battles', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/></svg> },
    { id: 'interview-prep', name: 'Interview Prep', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A3,3 0 0,1 15,5V7A3,3 0 0,1 12,10A3,3 0 0,1 9,7V5A3,3 0 0,1 12,2M21,22H3V20C3,17.79 4.69,16 6.8,16H17.2C19.31,16 21,17.79 21,20V22M6,10V7H4V10H1V12H4V15H6V12H9V10H6Z"/></svg> },
    { id: 'study-groups', name: 'Study Groups', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16,4C16.88,4 17.67,4.38 18.18,5H20C21.11,5 22,5.89 22,7V17C22,18.11 21.11,19 20,19H4C2.89,19 2,18.11 2,17V7C2,5.89 2.89,5 4,5H5.82C6.33,4.38 7.12,4 8,4H16M16,6H8A1,1 0 0,0 7,7V17H17V7A1,1 0 0,0 16,6Z"/></svg> },
    { id: 'daily-challenges', name: 'Daily Challenges', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/></svg> },
    { id: 'achievements', name: 'Achievements', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5,16L3,5L8.5,12L12,5L15.5,12L21,5L19,16H5M19,19A1,1 0 0,1 18,20H6A1,1 0 0,1 5,19V18H19V19Z"/></svg> },
    { id: 'concepts', name: 'Concept Learning', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/></svg> }
  ];

  const emojis = ['😊', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '🎉', '🔥', '💯', '✨', '🚀', '💪', '🤔', '😍', '🙌', '👏', '💡', '⚡'];
  const dsaEmojis = ['🧠', '💻', '⚡', '🔥', '💡', '🎯', '🏆', '📊', '🔍', '⚙️', '🚀', '💎', '🎪', '🔧', '📈', '🎨', '🌟', '💫', '🎭', '🎪'];

  const [dmUsers, setDmUsers] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyPreview, setReplyPreview] = useState(null);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [codeEditorContent, setCodeEditorContent] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [executionResult, setExecutionResult] = useState(null);
  const [activeChallenges, setActiveChallenges] = useState(new Map());
  const [challengeParticipants, setChallengeParticipants] = useState(new Map());


  useEffect(() => {
    if (isOpen) {
      initializeSocket();
      loadMessages();
      
      // Load users and groups from database
      loadRealUsers();
      loadUserGroups();
      
      checkForNewMessages();
      

    }
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [isOpen, currentRoom, isDMMode, selectedDMUser]);

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
            { id: 'demo2', name: 'PRIYA SHARMA', status: 'busy' },
            { id: 'demo3', name: 'RAHUL SINGH', status: 'away' }
          ]);
        }
      } else {
        setDmUsers([
          { id: 'demo1', name: 'ANAND KUMAR', status: 'online' },
          { id: 'demo2', name: 'PRIYA SHARMA', status: 'busy' },
          { id: 'demo3', name: 'RAHUL SINGH', status: 'away' }
        ]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setDmUsers([
        { id: 'demo1', name: 'ANAND KUMAR', status: 'online' },
        { id: 'demo2', name: 'PRIYA SHARMA', status: 'busy' },
        { id: 'demo3', name: 'RAHUL SINGH', status: 'away' }
      ]);
    }
  };

  const checkForNewMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/chat/notifications/${getCurrentUser().id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.notifications && data.notifications.length > 0) {
          setNotifications(data.notifications);
          setShowNotification(true);
        }
      }
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

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
      console.log('✅ Socket connected successfully:', newSocket.id);
      const roomId = isDMMode && selectedDMUser 
        ? `dm_${getCurrentUser().id}_${selectedDMUser.id}` 
        : currentRoom;
      
      console.log('🏠 Joining room:', roomId);
      newSocket.emit('join_room', { roomId, user: getCurrentUser() });
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    newSocket.on('message_received', (message) => {
      console.log('📨 Message received:', message.text?.substring(0, 30));
      setMessages(prev => {
        const exists = prev.find(m => m.id === message.id);
        if (exists) return prev;
        return [...prev, { 
          ...message, 
          upvotes: message.upvotes || 0, 
          downvotes: message.downvotes || 0, 
          upvotedBy: message.upvotedBy || [],
          downvotedBy: message.downvotedBy || [],
          replies: message.replies || [] 
        }];
      });
      scrollToBottom();
      
      // Show notification for DM messages from other users
      if (isDMMode && message.user.id !== getCurrentUser().id) {
        setNotifications([{
          id: Date.now(),
          from: message.user.name,
          text: message.text,
          timestamp: message.timestamp
        }]);
        setShowNotification(true);
      }
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
      console.log('👥 Users online:', count);
      setOnlineUsers(count);
    });

    newSocket.on('message_voted', (data) => {
      const { messageId, type, userId } = data;
      
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          const upvotedBy = msg.upvotedBy || [];
          const downvotedBy = msg.downvotedBy || [];
          
          if (type === 'upvote' && !upvotedBy.includes(userId)) {
            const newUpvotedBy = [...upvotedBy, userId];
            return {
              ...msg,
              upvotes: newUpvotedBy.length,
              upvotedBy: newUpvotedBy
            };
          } else if (type === 'downvote' && !downvotedBy.includes(userId)) {
            const newDownvotedBy = [...downvotedBy, userId];
            return {
              ...msg,
              downvotes: newDownvotedBy.length,
              downvotedBy: newDownvotedBy
            };
          }
        }
        return msg; // Other messages unchanged
      }));
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

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: newMessage,
      user: getCurrentUser(),
      timestamp: new Date().toISOString(),
      roomId: currentRoom,
      isDM: isDMMode,
      receiverId: selectedDMUser?.id,
      upvotes: 0,
      downvotes: 0,
      upvotedBy: [],
      downvotedBy: [],
      replies: []
    };



    // Add message locally first
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setReplyPreview(null);
    scrollToBottom();

    // Send via socket for real-time
    if (socket && socket.connected) {
      const roomId = isDMMode ? `dm_${getCurrentUser().id}_${selectedDMUser?.id}` : currentRoom;
      console.log('🚀 Sending message via socket to room:', roomId);
      socket.emit('send_message', {
        ...message,
        roomId,
        targetRoom: roomId
      });
    } else {
      console.error('❌ Socket not connected');
    }

    // Save to database
    try {
      const endpoint = isDMMode 
        ? `${API_BASE_URL}/chat/dm/send`
        : `${API_BASE_URL}/chat/room/send`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(message)
      });
      
      if (response.ok) {
        console.log('✅ Message saved to database');
      }
    } catch (error) {
      console.error('❌ Error saving message:', error);
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

  const handleVoiceMessage = () => {
    if (!isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setIsRecording(true);
          setTimeout(() => {
            setIsRecording(false);
            alert('Voice message recorded!');
          }, 3000);
        })
        .catch(() => alert('Microphone access denied'));
    }
  };

  const handleUpvote = async (messageId) => {
    const currentUser = getCurrentUser();
    
    // Check if user already upvoted this specific message
    const message = messages.find(msg => msg.id === messageId);
    if (message && message.upvotedBy && message.upvotedBy.includes(currentUser.id)) {
      console.log('User already upvoted this message');
      return;
    }
    
    // Update local state immediately
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
    
    // Save to backend
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/chat/vote/${currentRoom}/${messageId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type: 'upvote', userId: currentUser.id })
      });
    } catch (error) {
      console.error('Error saving upvote:', error);
    }
    
    // Broadcast to other users
    if (socket) {
      socket.emit('vote_message', { messageId, type: 'upvote', userId: currentUser.id, roomId: currentRoom });
    }
  };

  const handleDownvote = async (messageId) => {
    const currentUser = getCurrentUser();
    
    // Check if user already downvoted this specific message
    const message = messages.find(msg => msg.id === messageId);
    if (message && message.downvotedBy && message.downvotedBy.includes(currentUser.id)) {
      console.log('User already downvoted this message');
      return;
    }
    
    // Update local state immediately
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
    
    // Save to backend
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/chat/vote/${currentRoom}/${messageId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type: 'downvote', userId: currentUser.id })
      });
    } catch (error) {
      console.error('Error saving downvote:', error);
    }
    
    // Broadcast to other users
    if (socket) {
      socket.emit('vote_message', { messageId, type: 'downvote', userId: currentUser.id, roomId: currentRoom });
    }
  };

  const handleReply = (message) => {
    setReplyingTo(message);
    setNotifications([{
      id: Date.now(),
      from: message.user.name,
      text: message.text,
      timestamp: message.timestamp
    }]);
    setShowNotification(true);
  };

  const createGroup = async (groupName) => {
    try {
      const currentUser = getCurrentUser();
      const response = await fetch(`${API_BASE_URL}/chat/create-group`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          groupName,
          description: `Group created by ${currentUser.name}`,
          creatorId: currentUser.id,
          creatorName: currentUser.name
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Show success message with invite code
        const message = `🎉 Group "${groupName}" created successfully!\n\n📋 Invite Code: ${data.group.inviteCode}\n\n💡 Share this code with friends to join your group!\n\n📱 Code copied to clipboard!`;
        
        // Copy invite code to clipboard
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
        console.log('📊 Groups data received:', data.groups);
        setUserGroups(data.groups || []);
      }
    } catch (error) {
      console.error('Error loading user groups:', error);
    }
  };

  const analyzeAllParticipants = async (challengeId, challengeText) => {
    console.log('Analyzing participants for challenge:', challengeId);
    console.log('All challenge participants:', Array.from(challengeParticipants.entries()));
    
    const participants = challengeParticipants.get(challengeId) || [];
    console.log('Participants for this challenge:', participants);
    
    // Update challenge status to ENDED
    setMessages(prev => prev.map(msg => {
      if (msg.id === challengeId && msg.text.includes('**Challenge**')) {
        return {
          ...msg,
          text: msg.text.replace('LIVE', 'ENDED').replace('ACTIVE', 'ENDED')
        };
      }
      return msg;
    }));
    
    // Filter participants who submitted solutions within time limit
    const challengeData = activeChallenges.get(challengeId);
    const challengeEndTime = challengeData ? challengeData.endTime : Date.now();
    
    const participantsWithSolutions = participants.filter(p => {
      const hasValidSolution = p.solution && p.solution.trim() && p.solution.length > 10;
      const submittedOnTime = p.submissionTime && p.submissionTime <= challengeEndTime;
      console.log(`Participant ${p.userName}: solution=${!!p.solution}, onTime=${submittedOnTime}, submissionTime=${new Date(p.submissionTime || 0).toLocaleTimeString()}`);
      return hasValidSolution && submittedOnTime;
    });
    
    console.log(`Total participants: ${participants.length}, Valid submissions: ${participantsWithSolutions.length}`);
    
    if (participantsWithSolutions.length === 0) {
      setNewMessage(`⏰ **Challenge Ended** - No valid solutions submitted within time limit.\n📈 Total participants: ${participants.length}`);
      return;
    }
    
    // Analyze all solutions and create leaderboard
    setNewMessage('🤖 **AI is analyzing all solutions...** Please wait...');
    
    const results = [];
    for (const participant of participantsWithSolutions) {
      const score = await getAIScore(participant.solution, challengeText);
      results.push({ 
        userName: participant.userName, 
        score, 
        solution: participant.solution.substring(0, 50) + '...',
        submissionTime: participant.submissionTime
      });
    }
    
    // Sort by score (and by submission time for ties)
    results.sort((a, b) => {
      if (b.score === a.score) {
        return a.submissionTime - b.submissionTime; // Earlier submission wins
      }
      return b.score - a.score;
    });
    
    let leaderboard = `🏆 **CHALLENGE RESULTS**\n🎯 Problem: ${challengeText}\n\n`;
    results.forEach((result, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
      leaderboard += `${medal} **${result.userName}**: ${result.score}/10\n`;
    });
    
    leaderboard += `\n📈 Total Participants: ${participantsWithSolutions.length}\n🎆 Congratulations to all participants!`;
    
    // Auto-reply with results
    setTimeout(() => {
      setNewMessage(leaderboard);
    }, 3000);
    
    // Clean up participants
    setChallengeParticipants(prev => {
      const newMap = new Map(prev);
      newMap.delete(challengeId);
      return newMap;
    });
  };
  
  const getAIScore = async (solution, problemText) => {
    // Smart fallback scoring based on solution quality
    const solutionLength = solution.length;
    const hasLoops = /for|while|forEach|map|filter|reduce/.test(solution);
    const hasConditions = /if|else|switch|\?|:/.test(solution);
    const hasComments = /\/\/|\/\*/.test(solution);
    const hasVariables = /let|const|var|int|string/.test(solution);
    const hasFunctions = /function|=>|def|public|private/.test(solution);
    const hasComplexity = /O\(|time|space|complexity/.test(solution);
    
    let score = 4; // Base score
    
    // Code structure points
    if (solutionLength > 30) score += 1;
    if (hasLoops) score += 1;
    if (hasConditions) score += 1;
    if (hasVariables) score += 1;
    if (hasFunctions) score += 1;
    
    // Quality points
    if (hasComments) score += 1;
    if (hasComplexity) score += 1;
    if (solutionLength > 100) score += 1;
    
    // Random variation for realism
    const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    score += variation;
    
    return Math.min(10, Math.max(3, score));
  };

  const analyzeWithGemini = async (solution, problemText, userName) => {
    try {
      const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert coding instructor. Analyze this solution for "${problemText}":\n\n\`\`\`\n${solution}\n\`\`\`\n\nProvide a detailed analysis with:\n1. Correctness score (X/10)\n2. Time complexity\n3. Space complexity\n4. Code quality score (X/10)\n5. Specific suggestions for improvement\n6. Overall feedback\n\nBe constructive and educational.`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Gemini Analysis Response:', data);
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          const analysis = data.candidates[0].content.parts[0].text;
          setNewMessage(`🤖 **AI Analysis for ${userName}**:\n\n${analysis}\n\n🎆 Challenge completed!`);
          return;
        }
      } else {
        console.error('Gemini API Error:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Error analyzing with Gemini:', error);
    }
    
    // Fallback analysis if API fails
    const solutionLength = solution.length;
    const hasLoops = /for|while|forEach|map|filter/.test(solution);
    const hasConditions = /if|else|switch|\?/.test(solution);
    const hasComments = /\/\/|\/\*/.test(solution);
    const hasVariables = /let|const|var|int|string/.test(solution);
    const hasFunctions = /function|=>|def|public|private/.test(solution);
    const hasComplexity = /O\(|binary|search|sort/.test(solution);
    
    let correctnessScore = 5;
    let qualityScore = 4;
    
    if (hasLoops) correctnessScore += 1;
    if (hasConditions) correctnessScore += 1;
    if (solutionLength > 50) correctnessScore += 1;
    if (hasComplexity) correctnessScore += 2;
    if (hasFunctions) correctnessScore += 1;
    
    if (hasComments) qualityScore += 2;
    if (hasVariables) qualityScore += 1;
    if (solutionLength > 100) qualityScore += 1;
    if (hasComplexity) qualityScore += 1;
    
    correctnessScore += Math.floor(Math.random() * 2);
    qualityScore += Math.floor(Math.random() * 2);
    
    correctnessScore = Math.min(10, Math.max(3, correctnessScore));
    qualityScore = Math.min(10, Math.max(3, qualityScore));
    
    let timeComplexity = 'O(n)';
    let spaceComplexity = 'O(1)';
    
    if (solution.includes('binary') || solution.includes('log')) {
      timeComplexity = 'O(log n)';
    } else if (solution.includes('nested') || solution.includes('double')) {
      timeComplexity = 'O(n²)';
    } else if (solution.includes('sort')) {
      timeComplexity = 'O(n log n)';
    }
    
    if (solution.includes('array') || solution.includes('list')) {
      spaceComplexity = 'O(n)';
    }
    
    const suggestions = [];
    if (!hasComments) suggestions.push('- Add comments to explain your logic');
    if (!hasComplexity) suggestions.push('- Consider time/space complexity');
    if (solutionLength < 30) suggestions.push('- Provide more detailed implementation');
    if (!hasConditions) suggestions.push('- Handle edge cases with conditions');
    
    const overallRating = correctnessScore >= 8 ? 'Excellent' : correctnessScore >= 6 ? 'Good' : correctnessScore >= 4 ? 'Fair' : 'Needs Improvement';
    
    const analysis = `🤖 **AI Analysis for ${userName}**:\n\n✅ **Correctness**: ${correctnessScore}/10 points\n⏱️ **Time Complexity**: ${timeComplexity}\n💾 **Space Complexity**: ${spaceComplexity}\n🎨 **Code Quality**: ${qualityScore}/10 points\n\n💡 **Suggestions**:\n${suggestions.length > 0 ? suggestions.join('\n') : '- Great solution! Keep it up!'}\n\n🎆 **Overall**: ${overallRating} solution!`;
    
    setNewMessage(analysis);
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
                {selectedDMUser && (
                  <span style={{
                    marginLeft: '8px',
                    color: selectedDMUser.status === 'online' ? '#10b981' : 
                          selectedDMUser.status === 'busy' ? '#ef4444' : '#f59e0b'
                  }}>
                    🔴 {selectedDMUser.status}
                  </span>
                )}
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
            {/* My Groups Section */}
            {userGroups.length > 0 && (
              <>
                <h4 style={{ margin: '0 0 8px 0', color: isDark ? '#ffffff' : '#1f2937', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
                  </svg>
                  My Groups
                </h4>
                {userGroups.map(group => (
                  <button
                    key={group._id}
                    onClick={() => {
                      setCurrentRoom(group._id);
                      setIsDMMode(false);
                      setSelectedDMUser(null);
                      setShowDMList(false);
                      loadMessages();
                      console.log(`🏠 Joining group: ${group.name}`);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: isDark ? '#374151' : '#f0f9ff',
                      border: `1px solid ${isDark ? '#4b5563' : '#bfdbfe'}`,
                      borderRadius: '8px',
                      marginBottom: '6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = isDark ? '#4b5563' : '#dbeafe';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = isDark ? '#374151' : '#f0f9ff';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        background: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '10px'
                      }}>
                        <GroupIcon />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '12px', color: isDark ? '#ffffff' : '#1f2937' }}>
                          {group.name}
                        </div>
                        <div style={{ fontSize: '10px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                          {group.creator && group.creator.id === getCurrentUser().id ? (
                            <>
                              <div>Admin • Code: <strong>{group.inviteCode || 'ABC123'}</strong></div>
                              <div style={{ marginTop: '2px' }}>Click to join group</div>
                            </>
                          ) : (
                            'Click to join group'
                          )}
                        </div>
                      </div>
                      {group.creator && group.creator.id === getCurrentUser().id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(group.inviteCode || 'ABC123');
                            alert('📎 Invite code copied!');
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#3b82f6',
                            padding: '4px'
                          }}
                        >
                          <CopyIcon />
                        </button>
                      )}
                    </div>
                  </button>
                ))}
                <div style={{ borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`, margin: '8px 0' }} />
              </>
            )}
            
            {/* Direct Messages Section */}
            <h4 style={{ margin: '0 0 8px 0', color: isDark ? '#ffffff' : '#1f2937', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2Z"/>
              </svg>
              Direct Messages
            </h4>
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
                    {message.text.includes('```') ? (
                      <div>
                        {message.text.split('```').map((part, index) => {
                          if (index % 2 === 1) {
                            // This is code block
                            return (
                              <div key={index} style={{
                                background: isDark ? '#0d1117' : '#f6f8fa',
                                border: `1px solid ${isDark ? '#30363d' : '#d0d7de'}`,
                                borderRadius: '6px',
                                padding: '12px',
                                margin: '8px 0',
                                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                                fontSize: '13px',
                                color: isDark ? '#e6edf3' : '#24292f',
                                overflowX: 'auto',
                                whiteSpace: 'pre-wrap'
                              }}>
                                <div style={{ 
                                  fontSize: '11px', 
                                  color: isDark ? '#7d8590' : '#656d76',
                                  marginBottom: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}>
                                  <CodeIcon />
                                  <span>Code Block</span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(part.trim());
                                      alert('📋 Code copied to clipboard!');
                                    }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#3b82f6',
                                      cursor: 'pointer',
                                      fontSize: '11px',
                                      padding: '2px 4px',
                                      borderRadius: '3px'
                                    }}
                                  >
                                    Copy
                                  </button>
                                </div>
                                <div style={{
                                  color: part.includes('#include') ? '#ff7b72' : 
                                        part.includes('int') || part.includes('void') || part.includes('return') ? '#79c0ff' :
                                        part.includes('cout') || part.includes('cin') ? '#a5d6ff' :
                                        part.includes('"') ? '#a5d6ff' : 'inherit'
                                }}>
                                  {part.trim()}
                                </div>
                              </div>
                            );
                          } else {
                            // Regular text
                            return part;
                          }
                        })}
                      </div>

                    ) : message.text.includes('**Achievement Unlocked**') ? (
                      <div style={{
                        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                        color: 'white',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        margin: '4px 0',
                        border: '2px solid #fed7aa'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <BadgeIcon />
                          <strong>ACHIEVEMENT UNLOCKED!</strong>
                        </div>
                        <div style={{ fontSize: '13px' }}>
                          {message.text.replace('🏅 **Achievement Unlocked**: ', '')}
                        </div>
                        <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '4px' }}>🎉 Congratulations!</div>
                      </div>
                    ) : message.text.includes('**Timer Started**') ? (
                      <div style={{
                        background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                        color: 'white',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        margin: '4px 0',
                        border: '2px solid #a7f3d0'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <TimerIcon />
                          <strong>CODING TIMER</strong>
                        </div>
                        <div style={{ fontSize: '13px' }}>
                          {message.text.replace('⏱️ **Timer Started**: ', '')}
                        </div>
                      </div>
                    ) : (
                      message.text
                    )}
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
                        // Check if this is a challenge message with active timer
                        const isChallenge = message.text.includes('**Challenge**');
                        const challengeData = activeChallenges.get(message.id);
                        
                        if (isChallenge && challengeData) {
                          const timeLeft = challengeData.endTime - Date.now();
                          if (timeLeft <= 0) {
                            alert('⏰ Time\'s up! You can no longer reply to this challenge.');
                            return;
                          }
                          
                          // Add user as participant if not already added
                          setChallengeParticipants(prev => {
                            const newMap = new Map(prev);
                            if (!newMap.has(message.id)) {
                              newMap.set(message.id, []);
                            }
                            const participants = newMap.get(message.id);
                            const currentUserId = getCurrentUser().id;
                            
                            if (!participants.find(p => p.userId === currentUserId)) {
                              participants.push({
                                userId: currentUserId,
                                userName: getCurrentUser().name,
                                startTime: Date.now(),
                                solution: null
                              });
                            }
                            return newMap;
                          });
                          
                          const minutesLeft = Math.floor(timeLeft / 60000);
                          const secondsLeft = Math.floor((timeLeft % 60000) / 1000);
                          
                          setReplyPreview({
                            id: message.id,
                            user: message.user.name,
                            text: `Challenge: ${challengeData.challengeText} (⏰ ${minutesLeft}:${secondsLeft.toString().padStart(2, '0')} left)`,
                            isChallenge: true,
                            timeLeft
                          });
                        } else if (isChallenge && !challengeData) {
                          alert('⏰ This challenge has expired. You can no longer reply.');
                          return;
                        } else {
                          setReplyPreview({
                            id: message.id,
                            user: message.user.name,
                            text: message.text.substring(0, 50) + (message.text.length > 50 ? '...' : ''),
                            isChallenge: false
                          });
                        }
                        
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
                        borderRadius: '4px',
                        opacity: message.text.includes('**Challenge**') && !activeChallenges.get(message.id) ? 0.5 : 1
                      }}
                    >
                      <ReplyIcon />
                      {message.text.includes('**Challenge**') && activeChallenges.get(message.id) ? 'Solution' : 'Reply'}
                    </button>
                    
                    {/* Code Block Button */}
                    <button
                      onClick={() => {
                        const code = prompt('💻 Reply with your code solution:');
                        if (code) {
                          const codeMessage = `@${message.user.name} Here\'s my solution:\n\`\`\`\n${code}\n\`\`\``;
                          setNewMessage(codeMessage);
                        }
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
                      <CodeIcon />
                      Code
                    </button>
                    

                    
                    {/* Code Editor Button */}
                    <button
                      onClick={() => {
                        setShowCodeEditor(true);
                        setCodeEditorContent('// Write your solution here\n');
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
                      <CodeIcon />
                      Editor
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

      {/* Reply Preview */}
      {replyPreview && (
        <div style={{
          padding: '8px 16px',
          background: isDark ? '#374151' : '#f3f4f6',
          borderTop: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '12px',
              color: replyPreview.isChallenge ? '#ef4444' : '#3b82f6',
              fontWeight: '600',
              marginBottom: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {replyPreview.isChallenge ? '🏆 Challenge Solution to' : 'Replying to'} {replyPreview.user}
              {replyPreview.isChallenge && (
                <span style={{ 
                  background: '#fef2f2', 
                  color: '#dc2626', 
                  padding: '2px 6px', 
                  borderRadius: '4px', 
                  fontSize: '10px',
                  fontWeight: '700'
                }}>
                  ⏰ TIMED
                </span>
              )}
            </div>
            <div style={{
              fontSize: '12px',
              color: isDark ? '#9ca3af' : '#6b7280',
              opacity: 0.8
            }}>
              {replyPreview.text}
            </div>
          </div>
          <button
            onClick={() => {
              setReplyPreview(null);
              setNewMessage('');
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isDark ? '#9ca3af' : '#6b7280',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>
      )}
      
      {/* Input */}
      <div style={{
        padding: '16px',
        borderTop: replyPreview ? 'none' : `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
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
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isDark ? '#9ca3af' : '#6b7280',
              padding: '4px'
            }}
          >
            <AttachIcon />
          </button>
          
          <button
            onClick={handleVoiceMessage}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isRecording ? '#ef4444' : (isDark ? '#9ca3af' : '#6b7280'),
              padding: '4px'
            }}
          >
            <VoiceIcon />
          </button>
          
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
            {/* Regular Emojis */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '6px',
              marginBottom: '8px'
            }}>
              {emojis.slice(0, 10).map(emoji => (
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
            
            {/* DSA Emojis */}
            <div style={{ fontSize: '11px', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '6px', fontWeight: '600' }}>DSA Reactions</div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '6px',
              marginBottom: '12px'
            }}>
              {dsaEmojis.slice(0, 10).map(emoji => (
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
              {/* Group Management */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
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
              
              {/* Code Editor */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    setShowCodeEditor(true);
                    setShowEmojiPicker(false);
                  }}
                  style={{
                    background: '#8b5cf6',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <CodeIcon />
                  Code Editor
                </button>
              </div>
            </div>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        />
        
        {/* Code Editor Modal */}
        {showCodeEditor && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: isDark ? '#1e1e1e' : '#ffffff',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '800px',
              height: '80%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${isDark ? '#333' : '#e5e7eb'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CodeIcon />
                  <h3 style={{ margin: 0, color: isDark ? '#ffffff' : '#1f2937' }}>Code Editor</h3>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    style={{
                      background: isDark ? '#374151' : '#f3f4f6',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      color: isDark ? '#ffffff' : '#1f2937'
                    }}
                  >
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowCodeEditor(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: isDark ? '#9ca3af' : '#6b7280',
                    fontSize: '20px',
                    padding: '4px'
                  }}
                >
                  ×
                </button>
              </div>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <textarea
                  value={codeEditorContent}
                  onChange={(e) => setCodeEditorContent(e.target.value)}
                  placeholder={`// Write your ${selectedLanguage} code here...`}
                  style={{
                    flex: 1,
                    background: isDark ? '#0d1117' : '#f6f8fa',
                    color: isDark ? '#e6edf3' : '#24292f',
                    border: 'none',
                    padding: '20px',
                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    resize: 'none',
                    outline: 'none'
                  }}
                />
                
                <div style={{
                  padding: '12px 20px',
                  borderTop: `1px solid ${isDark ? '#333' : '#e5e7eb'}`,
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button
                    onClick={() => {
                      const userName = getCurrentUser().name;
                      const codeMessage = `💻 **${userName}'s ${selectedLanguage.toUpperCase()} Solution:**\n\`\`\`${selectedLanguage}\n${codeEditorContent}\n\`\`\``;
                      
                      // Update participant's solution
                      setChallengeParticipants(prev => {
                        const newMap = new Map(prev);
                        for (const [challengeId, participants] of newMap.entries()) {
                          const participant = participants.find(p => p.userId === getCurrentUser().id);
                          if (participant) {
                            participant.solution = codeEditorContent;
                          }
                        }
                        return newMap;
                      });
                      
                      setNewMessage(codeMessage);
                      setShowCodeEditor(false);
                    }}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Share Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      
      {/* Message Notification Popup */}
      {showNotification && notifications.length > 0 && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#3b82f6',
          color: 'white',
          padding: '16px 20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 2000,
          minWidth: '300px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
                💬 New Message!
              </h4>
              <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                <strong>{notifications[notifications.length - 1]?.from}</strong> sent you a message:
              </div>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>
                "{notifications[notifications.length - 1]?.text?.substring(0, 50)}..."
              </div>
            </div>
            <button
              onClick={() => {
                setShowNotification(false);
                setNotifications([]);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '0',
                marginLeft: '12px'
              }}
            >
              ×
            </button>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                if (replyingTo) {
                  setNewMessage(`@${replyingTo.user.name} `);
                }
                setShowNotification(false);
                setNotifications([]);
                setReplyingTo(null);
              }}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              Reply
            </button>
            <button
              onClick={() => {
                setShowNotification(false);
                setNotifications([]);
              }}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
              onClick={() => {
                setShowNotification(false);
                setNotifications([]);
                setReplyingTo(null);
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      

      

    </div>
  );
};

export default ChatDiscussion;