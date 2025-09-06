const jwt = require('jsonwebtoken');
const User = require('../models/User');

const socketAuth = async (socket, next) => {
  try {
    // Try to get token from auth or query
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    
    if (!token) {
      console.log('No token provided for socket connection');
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('User not found for token:', decoded.userId);
      return next(new Error('User not found'));
    }

    socket.userId = user._id;
    socket.username = user.name;
    socket.user = user;
    console.log('Socket authenticated for user:', user.name);
    next();
  } catch (error) {
    console.error('Socket authentication error:', error.message);
    next(new Error('Authentication error: ' + error.message));
  }
};

module.exports = socketAuth;