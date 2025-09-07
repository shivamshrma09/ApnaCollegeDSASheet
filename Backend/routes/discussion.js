const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth } = require('../middleware/auth');
const Discussion = require('../models/Discussion');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/discussions';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Get messages for a problem
router.get('/:problemId', async (req, res) => {
  try {
    const { problemId } = req.params;
    
    const parsedProblemId = parseInt(problemId);
    if (isNaN(parsedProblemId)) {
      return res.status(400).json({ message: 'Invalid problem ID' });
    }
    
    const messages = await Discussion.find({ 
      problemId: parsedProblemId
    })
      .populate('replyTo')
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
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
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          aiResponse = data.candidates[0].content.parts[0].text;
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        throw new Error(`API Error: ${response.status}`);
      }
    } catch (apiError) {
      console.error('Gemini API error:', apiError);
      aiResponse = `I'm here to help with "${problemTitle}". What specific aspect would you like to discuss?`;
    }
    
    // Validate problemId is a valid number
    const parsedProblemId = parseInt(problemId);
    if (isNaN(parsedProblemId)) {
      return res.status(400).json({ message: 'Invalid problem ID' });
    }
    
    const aiMessage = new Discussion({
      problemId: parsedProblemId,
      content: aiResponse,
      userId: isPrivate ? userId : 'ai', // Use actual user ID for private messages
      userName: 'AI Assistant',
      type: 'ai',
      isPrivate: isPrivate || false
    });
    
    await aiMessage.save();
    
    // Emit to appropriate users
    const io = req.app.get('io');
    if (isPrivate) {
      // Send only to the user who asked the question
      const sockets = await io.in(`problem_${problemId}`).fetchSockets();
      for (const socket of sockets) {
        if (socket.userId === userId) {
          socket.emit('newDiscussionMessage', aiMessage);
        }
      }
    } else {
      // Send to all users in the problem room
      io.to(`problem_${problemId}`).emit('newDiscussionMessage', aiMessage);
    }
    
    res.json(aiMessage);
  } catch (error) {
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
    
    // Emit upvote update
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
