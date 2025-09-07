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
      .populate('replyTo')
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/send', async (req, res) => {
  try {
    const { problemId, content, userId, userName, replyTo } = req.body;
    
    if (!problemId || !content || !userId || !userName) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    
    const message = new Discussion({
      problemId: parseInt(problemId),
      content,
      userId,
      userName,
      type: 'user',
      replyTo: replyTo || null
    });
    
    await message.save();
    await message.populate('replyTo');
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const messages = await Discussion.find({})
      .populate('replyTo')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
