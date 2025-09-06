import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { sanitizeForLog } from '../utils/sanitizer';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || `http://localhost:${import.meta.env.VITE_PORT || 5001}`;

export const useSocket = (currentRoom, isDMMode, selectedDMUser, getCurrentUser) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(1);
  const [typingUsers, setTypingUsers] = useState([]);
  const timeoutRefs = useRef(new Map());

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });
    
    newSocket.on('connect', () => {
      console.log('Socket connected:', sanitizeForLog(newSocket.id));
      const roomId = isDMMode && selectedDMUser 
        ? `dm_${getCurrentUser().id}_${selectedDMUser.id}` 
        : currentRoom;
      
      newSocket.emit('join_room', { roomId, user: getCurrentUser() });
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error');
    });

    newSocket.on('user_typing', (data) => {
      if (data.user !== getCurrentUser().name) {
        setTypingUsers(prev => [...prev.filter(u => u !== data.user), data.user]);
        
        // Clear existing timeout
        if (timeoutRefs.current.has(data.user)) {
          clearTimeout(timeoutRefs.current.get(data.user));
        }
        
        // Set new timeout
        const timeoutId = setTimeout(() => {
          setTypingUsers(prev => prev.filter(u => u !== data.user));
          timeoutRefs.current.delete(data.user);
        }, 3000);
        
        timeoutRefs.current.set(data.user, timeoutId);
      }
    });

    newSocket.on('users_online', (count) => {
      setOnlineUsers(count);
    });

    setSocket(newSocket);

    return () => {
      // Clear all timeouts
      timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutRefs.current.clear();
      
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [currentRoom, isDMMode, selectedDMUser]);

  return { socket, onlineUsers, typingUsers };
};