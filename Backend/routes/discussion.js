const express = require('express');
const Discussion = require('../models/Discussion');
const router = express.Router();

router.get('/:problemId', async (req, res) => {
  try {
    const problemId = parseInt(req.params.problemId);
    if (isNaN(problemId)) {
      return res.status(400).json({ message: 'Invalid problem ID' });
    }
    
    const messages = await Discussion.find({ problemId })
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/send', async (req, res) => {
  try {
    const { problemId, content, userId, userName } = req.body;
    
    if (!problemId || !content || !userId || !userName) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    
    const message = new Discussion({
      problemId: parseInt(problemId),
      content,
      userId,
      userName,
      type: 'user'
    });
    
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/recent', async (req, res) => {
  res.json([]);
});

module.exports = router;
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
