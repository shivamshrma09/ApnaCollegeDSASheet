const express = require('express');
const multer = require('multer');
const path = require('path');
const csrf = require('csurf');
const router = express.Router();

// CSRF Protection
const csrfProtection = csrf({ cookie: true });
const QuestionChat = require('../models/QuestionChat');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed'));
    }
  }
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_DISCUSSION || 'AIzaSyCl-Zlu-zV3GpRaOReOa7FcW7iabxc2wnM');

// Get chat for specific problem
router.get('/:problemId', async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.query.userId;
    
    let chat = await QuestionChat.findOne({ problemId: parseInt(problemId) })
      .populate('messages.sender', 'name email')
      .populate('messages.replies.sender', 'name email');
    
    if (!chat) {
      return res.json({ messages: [], hasNewReplies: false });
    }
    
    // Filter messages: hide all AI messages
    const filteredMessages = chat.messages.filter(msg => {
      // Hide all AI messages
      return !msg.isAI;
    });
    
    res.json({ 
      messages: filteredMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
      hasNewReplies: filteredMessages.some(msg => msg.replies.length > 0)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message to problem chat
router.post('/:problemId/send', csrfProtection, upload.array('files', 5), async (req, res) => {
  try {
    const { problemId } = req.params;
    const { message, senderName, senderId, isQuestion, problemTitle, problemLink } = req.body;
    
    console.log('Received isQuestion:', isQuestion, 'Type:', typeof isQuestion);
    console.log('Full request body:', req.body);
    
    let chat = await QuestionChat.findOne({ problemId: parseInt(problemId) });
    
    if (!chat) {
      chat = new QuestionChat({
        problemId: parseInt(problemId),
        problemTitle: problemTitle || 'DSA Problem',
        problemLink: problemLink || '',
        messages: []
      });
    }

    const newMessage = {
      sender: senderId || '64f8a1b2c3d4e5f6a7b8c9d0',
      senderName: senderName || 'Anonymous',
      message,
      isQuestion: isQuestion === 'true' || isQuestion === true,
      upvotes: [],
      seen: false,
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    await chat.save();

    // AI functionality removed - community discussion only

    // Emit new message
    req.app.get('io').emit(`problemChat_${problemId}`, {
      type: 'newMessage',
      message: newMessage
    });

    res.json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reply to a message
router.post('/:problemId/reply/:messageId', csrfProtection, async (req, res) => {
  try {
    const { problemId, messageId } = req.params;
    const { message, senderName, senderId } = req.body;
    
    const chat = await QuestionChat.findOne({ problemId: parseInt(problemId) });
    const targetMessage = chat.messages.id(messageId);
    
    const reply = {
      sender: senderId || '64f8a1b2c3d4e5f6a7b8c9d0',
      senderName: senderName || 'Anonymous',
      message,
      timestamp: new Date()
    };
    
    targetMessage.replies.push(reply);
    await chat.save();
    
    // Emit reply notification
    req.app.get('io').emit(`problemChat_${problemId}`, {
      type: 'newReply',
      messageId,
      reply
    });
    
    res.json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upvote message
router.post('/:problemId/upvote/:messageId', csrfProtection, async (req, res) => {
  try {
    const { problemId, messageId } = req.params;
    const { userId } = req.body;
    
    const chat = await QuestionChat.findOne({ problemId: parseInt(problemId) });
    const message = chat.messages.id(messageId);
    
    if (!message.upvotes) message.upvotes = [];
    
    const existingUpvote = message.upvotes.find(upvote => upvote.user.toString() === userId);
    if (existingUpvote) {
      message.upvotes = message.upvotes.filter(upvote => upvote.user.toString() !== userId);
    } else {
      message.upvotes.push({ user: userId });
    }
    
    await chat.save();
    res.json({ success: true, upvotes: message.upvotes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark message as seen
router.post('/:problemId/seen/:messageId', csrfProtection, async (req, res) => {
  try {
    const { problemId, messageId } = req.params;
    
    const chat = await QuestionChat.findOne({ problemId: parseInt(problemId) });
    const message = chat.messages.id(messageId);
    
    message.seen = true;
    await chat.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Gemini AI Response Generator
async function generateGeminiResponse(userQuestion, problemTitle, problemLink) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
You are an expert DSA (Data Structures and Algorithms) tutor helping students with coding problems.

Problem Context:
- Problem Title: ${problemTitle}
- Problem Link: ${problemLink}
- Student Question: ${userQuestion}

Please provide a helpful, educational response that:
1. Addresses the student's specific question
2. Explains the concept clearly with examples
3. Suggests the optimal approach/algorithm
4. Provides time and space complexity analysis
5. Gives hints without revealing the complete solution
6. Encourages learning and problem-solving

Keep the response concise but comprehensive. Use emojis to make it engaging.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return `🤖 **AI Tutor Response:**\n\n${text}\n\n💡 **Need more help?** Feel free to ask follow-up questions or request clarification on any concept!`;
  } catch (error) {
    console.error('Gemini API error:', error);
    return `🤖 **AI Tutor Response:**\n\nI'm having trouble connecting to my knowledge base right now. However, I can suggest:\n\n1️⃣ **Break down the problem** - Understand input/output\n2️⃣ **Think of similar problems** - What patterns do you recognize?\n3️⃣ **Start with brute force** - Then optimize\n4️⃣ **Draw examples** - Visualize the solution\n\n💬 Try asking your question again, or our community members can help!`;
  }
}

module.exports = router;