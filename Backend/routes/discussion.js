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
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB limit (recommended)
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
    
    // Validate problemId is a valid number
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
    
    // Validate problemId is a valid number
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
    
    // Emit to all users in the problem room
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

// AI Reply using Gemini API
router.post('/ai-reply', auth, async (req, res) => {
  try {
    const { problemId, question, problemTitle, isPrivate } = req.body;
    const userId = req.user.id;
    
    // Use Gemini API with provided key
    const API_KEY = 'AIzaSyARyEuGB_5kXWcxe8AfqTr50GFd2p8VVtM';
    
    const prompt = `You are a helpful DSA coding assistant. Problem: "${problemTitle}"
User question: "${question}"

Provide a concise, helpful response (max 150 words) focusing on:
- Algorithm hints
- Approach suggestions
- Common pitfalls
- Time/space complexity tips

Be encouraging and educational without giving the complete solution.`;
    
    let aiResponse;
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
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
      
      // Smart fallback responses
      const questionLower = question.toLowerCase();
      const titleLower = problemTitle.toLowerCase();
      
      if (questionLower.includes('hi') || questionLower.includes('hello') || questionLower.length < 10) {
        aiResponse = `Hello! I'm here to help with "${problemTitle}". What specific aspect would you like to discuss?`;
      } else if (titleLower.includes('reverse') && titleLower.includes('array')) {
        if (questionLower.includes('complexity') || questionLower.includes('optimize')) {
          aiResponse = `For reversing an array: Two-pointer approach is O(n) time, O(1) space - most optimal!`;
        } else {
          aiResponse = `Great question about array reversal! Key approaches: 1. Two pointers 2. Built-in method 3. Recursion. Which interests you most?`;
        }
      } else if (questionLower.includes('complexity')) {
        aiResponse = `Time complexity analysis is crucial! For "${problemTitle}": Consider operations, nested loops, and single-pass solutions.`;
      } else {
        const responses = [
          `Interesting question about "${problemTitle}"! Let's break it down step by step.`,
          `Good thinking! Consider the constraints and edge cases for this problem.`,
          `Great question! Have you tried working through a small example first?`
        ];
        aiResponse = responses[Math.floor(Math.random() * responses.length)];
      }
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
