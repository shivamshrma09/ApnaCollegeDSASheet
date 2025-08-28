const express = require('express');
const router = express.Router();
const QuestionChat = require('../models/QuestionChat');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-gemini-api-key');

// Get chat for specific problem
router.get('/:problemId', async (req, res) => {
  try {
    const { problemId } = req.params;
    
    let chat = await QuestionChat.findOne({ problemId: parseInt(problemId) })
      .populate('messages.sender', 'name email')
      .populate('messages.replies.sender', 'name email');
    
    if (!chat) {
      return res.json({ messages: [], hasNewReplies: false });
    }
    
    res.json({ 
      messages: chat.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
      hasNewReplies: chat.messages.some(msg => msg.replies.length > 0)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message to problem chat
router.post('/:problemId/send', async (req, res) => {
  try {
    const { problemId } = req.params;
    const { message, senderName, senderId, isQuestion, problemTitle, problemLink } = req.body;
    
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
      isQuestion: isQuestion || false,
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    await chat.save();

    // Generate AI response ONLY if checkbox is checked
    if (isQuestion === true || isQuestion === 'true') {
      setTimeout(async () => {
        try {
          const aiResponse = await generateGeminiResponse(message, problemTitle, problemLink);
          const aiMessage = {
            sender: '64f8a1b2c3d4e5f6a7b8c9d1',
            senderName: 'AI Assistant',
            message: aiResponse,
            isAI: true,
            replyTo: newMessage._id,
            timestamp: new Date()
          };
          
          chat.messages.push(aiMessage);
          await chat.save();
          
          req.app.get('io').emit(`problemChat_${problemId}`, {
            type: 'newMessage',
            message: aiMessage
          });
        } catch (error) {
          console.error('AI failed:', error);
          const errorMessage = {
            sender: '64f8a1b2c3d4e5f6a7b8c9d1',
            senderName: 'System',
            message: 'AI is currently unavailable. Please try again later.',
            isAI: false,
            timestamp: new Date()
          };
          
          chat.messages.push(errorMessage);
          await chat.save();
          
          req.app.get('io').emit(`problemChat_${problemId}`, {
            type: 'newMessage',
            message: errorMessage
          });
        }
      }, 3000);
    }

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
router.post('/:problemId/reply/:messageId', async (req, res) => {
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

// Like message
router.post('/:problemId/like/:messageId', async (req, res) => {
  try {
    const { problemId, messageId } = req.params;
    const { userId } = req.body;
    
    const chat = await QuestionChat.findOne({ problemId: parseInt(problemId) });
    const message = chat.messages.id(messageId);
    
    const existingLike = message.likes.find(like => like.user.toString() === userId);
    if (existingLike) {
      message.likes = message.likes.filter(like => like.user.toString() !== userId);
    } else {
      message.likes.push({ user: userId });
    }
    
    await chat.save();
    res.json({ success: true, likes: message.likes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Gemini AI Response Generator
async function generateGeminiResponse(userQuestion, problemTitle, problemLink) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
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