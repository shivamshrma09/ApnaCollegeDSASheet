const express = require('express');
const Discussion = require('../models/Discussion');
const router = express.Router();

// Get messages for a problem
router.get('/:problemId', async (req, res) => {
  try {
    const { problemId } = req.params;
    const parsedProblemId = parseInt(problemId);
    if (isNaN(parsedProblemId)) {
      return res.status(400).json({ message: 'Invalid problem ID' });
    }
    
    const messages = await Discussion.find({ problemId: parsedProblemId })
      .populate('replyTo')
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a message
router.post('/send', async (req, res) => {
  try {
    const { problemId, content, userId, userName, replyTo } = req.body;
    
    if (!problemId || !content || !userId || !userName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const parsedProblemId = parseInt(problemId);
    if (isNaN(parsedProblemId)) {
      return res.status(400).json({ message: 'Invalid problem ID' });
    }
    
    const message = new Discussion({
      problemId: parsedProblemId,
      content,
      userId,
      userName,
      type: 'user',
      replyTo: replyTo || null
    });
    
    await message.save();
    
    if (replyTo) {
      await message.populate('replyTo');
    }
    
    try {
      const io = req.app.get('io');
      if (io) {
        io.to(`problem_${problemId}`).emit('newDiscussionMessage', message);
      }
    } catch (socketError) {
      console.error('Socket error:', socketError);
    }
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent chat history
router.get('/recent', async (req, res) => {
  res.json([]);
});

module.exports = router;
    }
    
    const message = new Discussion({
      problemId: parsedProblemId,
      content,
      userId,
      userName,
      type: 'user',
      replyTo: replyTo || null
    });
    
    await message.save();
    
    if (replyTo) {
      await message.populate('replyTo');
    }
    
    try {
      const io = req.app.get('io');
      if (io) {
        io.to(`problem_${problemId}`).emit('newDiscussionMessage', message);
      }
    } catch (socketError) {
      console.error('Socket emission error:', socketError);
    }
    
    res.json(message);
  } catch (error) {
    console.error('Discussion send error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Upvote a message
router.post('/upvote/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;
    
    const message = await Discussion.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    const hasUpvoted = message.upvotedBy.includes(userId);
    
    if (hasUpvoted) {
      message.upvotes -= 1;
      message.upvotedBy = message.upvotedBy.filter(id => id !== userId);
    } else {
      message.upvotes += 1;
      message.upvotedBy.push(userId);
    }
    
    await message.save();
    
    const io = req.app.get('io');
    io.to(`problem_${message.problemId}`).emit('messageUpvoted', {
      messageId,
      upvotes: message.upvotes,
      hasUpvoted: !hasUpvoted
    });
    
    res.json({ upvotes: message.upvotes, hasUpvoted: !hasUpvoted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent chat history
router.get('/recent', async (req, res) => {
  res.json([]);
});

// Serve uploaded files
router.use('/uploads', express.static('uploads'));

module.exports = router;
