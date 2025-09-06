const jwt = require('jsonwebtoken');
const { sanitizeForLog } = require('../utils/sanitizer');

const chatHandler = (io) => {
  const activeUsers = new Map();
  const roomUsers = new Map();
  const problemRooms = new Map(); // Track users in problem discussions

  // Socket authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log('🔗 User connected:', sanitizeForLog(socket.id));

    // Handle user joining
    socket.on('join_room', (data) => {
      const { roomId, user } = data;
      console.log(`👤 User ${sanitizeForLog(user?.name || socket.id)} joining room: ${sanitizeForLog(roomId)}`);
      
      socket.join(roomId);
      activeUsers.set(socket.id, { ...user, roomId });
      
      // Update room user count
      if (!roomUsers.has(roomId)) {
        roomUsers.set(roomId, new Set());
      }
      roomUsers.get(roomId).add(socket.id);
      
      // Broadcast user count to room
      const userCount = roomUsers.get(roomId).size;
      io.to(roomId).emit('users_online', userCount);
    });
    
    // Handle joining problem discussion
    socket.on('joinProblem', (problemId) => {
      const roomName = `problem_${problemId}`;
      socket.join(roomName);
      
      // Store user info for this problem
      if (!problemRooms.has(roomName)) {
        problemRooms.set(roomName, new Map());
      }
      
      const user = activeUsers.get(socket.id) || { userId: socket.userId };
      problemRooms.get(roomName).set(socket.id, {
        userId: socket.userId,
        userName: user.name || 'Anonymous',
        joinedAt: new Date()
      });
      
      // Broadcast updated online users list
      const onlineUsers = Array.from(problemRooms.get(roomName).values());
      io.to(roomName).emit('onlineUsers', onlineUsers);
      
      // Notify others that user joined
      socket.to(roomName).emit('userJoined', {
        userId: socket.userId,
        userName: user.name || 'Anonymous'
      });
      
      console.log(`💬 User ${socket.userId} joined problem discussion: ${problemId}`);
    });
    
    // Handle authentication for socket
    socket.on('authenticate', (data) => {
      const { userId } = data;
      socket.userId = userId;
      
      // Update active users
      const existingUser = activeUsers.get(socket.id) || {};
      activeUsers.set(socket.id, { ...existingUser, userId });
    });

    // Handle sending messages
    socket.on('send_message', (data) => {
      const { roomId, targetRoom, ...message } = data;
      const room = targetRoom || roomId;
      
      console.log(`📤 Broadcasting message to room ${room}:`, message.text?.substring(0, 50));
      
      // Broadcast to all users in the room except sender
      socket.to(room).emit('message_received', message);
    });

    // Handle typing in discussions
    socket.on('typing', (data) => {
      const { problemId, userId, userName } = data;
      const roomName = `problem_${problemId}`;
      socket.to(roomName).emit('typing', { userId, userName });
    });
    
    socket.on('stopTyping', (data) => {
      const { problemId, userId } = data;
      const roomName = `problem_${problemId}`;
      socket.to(roomName).emit('stopTyping', { userId });
    });
    
    // Handle typing in general rooms
    socket.on('typing_room', (data) => {
      const { roomId, user } = data;
      socket.to(roomId).emit('user_typing', { user });
    });

    // Handle voting
    socket.on('vote_message', (data) => {
      const { roomId, messageId, type, userId } = data;
      console.log(`📊 Broadcasting vote: ${type} on message ${messageId} by user ${userId}`);
      socket.to(roomId).emit('message_voted', { messageId, type, userId });
    });

    // Handle challenge events
    socket.on('join_challenge', (data) => {
      const { challengeId } = data;
      socket.join(`challenge_${challengeId}`);
      console.log(`🎯 User joined challenge: ${challengeId}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
      
      const userData = activeUsers.get(socket.id);
      
      // Handle general room disconnect
      if (userData && userData.roomId) {
        const roomId = userData.roomId;
        const roomUserSet = roomUsers.get(roomId);
        
        if (roomUserSet) {
          roomUserSet.delete(socket.id);
          const userCount = roomUserSet.size;
          io.to(roomId).emit('users_online', userCount);
        }
      }
      
      // Handle problem discussion disconnect
      for (const [roomName, users] of problemRooms.entries()) {
        if (users.has(socket.id)) {
          const userInfo = users.get(socket.id);
          users.delete(socket.id);
          
          // Broadcast updated online users list
          const onlineUsers = Array.from(users.values());
          io.to(roomName).emit('onlineUsers', onlineUsers);
          
          // Notify others that user left
          socket.to(roomName).emit('userLeft', {
            userId: userInfo.userId,
            userName: userInfo.userName
          });
          
          // Clean up empty rooms
          if (users.size === 0) {
            problemRooms.delete(roomName);
          }
          
          break;
        }
      }
      
      activeUsers.delete(socket.id);
    });
  });
};

module.exports = chatHandler;