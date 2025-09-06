const express = require('express');
const router = express.Router();
const {
  getChatRooms,
  getMessages,
  sendMessage,
  createGroup,
  createOrGetDM,
  getUsers,
  upvoteMessage,
  getUnreadCount
} = require('../controllers/chatController');

// Get all chat rooms
router.get('/rooms', getChatRooms);

// Get messages for a chat room
router.get('/rooms/:chatId/messages', getMessages);

// Send message
router.post('/messages', sendMessage);

// Create group
router.post('/groups', createGroup);

// Create or get DM
router.post('/dm', createOrGetDM);

// Get users for DM
router.get('/users', getUsers);

// Upvote message
router.post('/messages/:messageId/upvote', upvoteMessage);

// Get unread count
router.get('/unread', getUnreadCount);

module.exports = router;