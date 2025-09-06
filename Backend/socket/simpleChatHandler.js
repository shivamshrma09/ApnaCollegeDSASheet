const jwt = require('jsonwebtoken');
const { sanitizeForLog } = require('../utils/sanitizer');

const handleSimpleChatConnection = (io) => {
  let onlineUsers = 0;
  const userRooms = new Map();

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
    onlineUsers++;
    console.log(`✅ User connected: ${sanitizeForLog(socket.id)}. Online users: ${onlineUsers}`);
    
    // Broadcast online users count
    io.emit('onlineUsersUpdate', onlineUsers);

    // Join problem room
    socket.on('joinProblem', (problemId) => {
      const roomId = `problem_${problemId}`;
      socket.join(roomId);
      userRooms.set(socket.id, roomId);
      console.log(`📍 User ${sanitizeForLog(socket.id)} joined room: ${sanitizeForLog(roomId)}`);
    });

    // Handle new discussion message
    socket.on('newDiscussionMessage', (messageData) => {
      console.log('📤 Broadcasting message:', messageData.text?.substring(0, 50));
      
      // Broadcast to all users in the room
      const roomId = userRooms.get(socket.id) || 'general';
      socket.to(roomId).emit('newDiscussionMessage', messageData);
      
      // Also broadcast to general room
      socket.broadcast.emit('newDiscussionMessage', messageData);
    });

    // Handle room messages
    socket.on('sendMessageToRoom', (data) => {
      const { roomId, message } = data;
      console.log(`📨 Room message to ${sanitizeForLog(roomId)}:`, sanitizeForLog(message.text?.substring(0, 30)));
      
      socket.to(`room_${roomId}`).emit('newDiscussionMessage', message);
    });

    // Join specific room
    socket.on('joinRoom', (roomId) => {
      socket.join(`room_${roomId}`);
      console.log(`🏠 User joined room: ${sanitizeForLog(roomId)}`);
    });

    // Typing indicators
    socket.on('typing', (data) => {
      const roomId = userRooms.get(socket.id) || 'general';
      socket.to(roomId).emit('typing', { userId: socket.id, ...data });
    });

    socket.on('stopTyping', (data) => {
      const roomId = userRooms.get(socket.id) || 'general';
      socket.to(roomId).emit('stopTyping', { userId: socket.id, ...data });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      onlineUsers--;
      userRooms.delete(socket.id);
      console.log(`❌ User disconnected: ${sanitizeForLog(socket.id)}. Online users: ${onlineUsers}`);
      
      // Broadcast updated online users count
      io.emit('onlineUsersUpdate', onlineUsers);
    });
  });
};

module.exports = handleSimpleChatConnection;
