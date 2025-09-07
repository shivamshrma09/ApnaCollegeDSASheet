import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    newSocket.on('onlineUsersUpdate', (count) => {
      setOnlineUsers(count);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinProblem = (problemId) => {
    if (socket && connected) {
      socket.emit('joinProblem', problemId);
    }
  };

  const sendMessage = (messageData) => {
    if (socket && connected) {
      socket.emit('newDiscussionMessage', messageData);
    }
  };

  const startTyping = (problemId) => {
    if (socket && connected) {
      socket.emit('typing', { problemId });
    }
  };

  const stopTyping = (problemId) => {
    if (socket && connected) {
      socket.emit('stopTyping', { problemId });
    }
  };

  const value = {
    socket,
    connected,
    onlineUsers,
    joinProblem,
    sendMessage,
    startTyping,
    stopTyping
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;