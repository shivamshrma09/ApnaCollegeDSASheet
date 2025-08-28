const Chat = require('../models/Chat');
const rateLimit = require('express-rate-limit');

// Rate limiting for chat messages
const chatRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 messages per minute
  message: 'Too many messages, please slow down'
});

const getChatHistory = async (req, res) => {
  try {
    const { problemId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const messages = await Chat.find({ 
      problemId: parseInt(problemId),
      isActive: true 
    })
    .populate('user', 'name email')
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip);

    res.json({
      messages: messages.reverse(),
      hasMore: messages.length === limit
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

const saveMessage = async (messageData) => {
  try {
    const chat = new Chat(messageData);
    await chat.save();
    
    // Populate user data for real-time broadcast
    await chat.populate('user', 'name email');
    return chat;
  } catch (error) {
    throw new Error('Failed to save message');
  }
};

module.exports = {
  getChatHistory,
  saveMessage,
  chatRateLimit
};