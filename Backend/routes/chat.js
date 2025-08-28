const express = require('express');
const router = express.Router();
const ChatRoom = require('../models/Chat');
const axios = require('axios');

// Get chat messages
router.get('/messages', async (req, res) => {
  try {
    const chatRoom = await ChatRoom.findOne().populate('messages.sender', 'name email');
    if (!chatRoom) {
      const newChatRoom = new ChatRoom({});
      await newChatRoom.save();
      return res.json({ messages: [] });
    }
    
    const messages = chatRoom.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message
router.post('/send', async (req, res) => {
  try {
    const { message, senderName, senderId, isQuestion } = req.body;
    
    let chatRoom = await ChatRoom.findOne();
    if (!chatRoom) {
      chatRoom = new ChatRoom({});
    }

    const newMessage = {
      sender: senderId || '64f8a1b2c3d4e5f6a7b8c9d0',
      senderName: senderName || 'Anonymous',
      message,
      isQuestion: isQuestion || false,
      timestamp: new Date()
    };

    chatRoom.messages.push(newMessage);
    await chatRoom.save();

    // AI Response for questions
    if (isQuestion) {
      setTimeout(async () => {
        try {
          const aiResponse = await generateAIResponse(message);
          const aiMessage = {
            sender: '64f8a1b2c3d4e5f6a7b8c9d1',
            senderName: 'AI Assistant',
            message: aiResponse,
            isAI: true,
            replyTo: newMessage._id,
            timestamp: new Date()
          };
          
          chatRoom.messages.push(aiMessage);
          await chatRoom.save();
          
          // Emit AI response via socket
          req.app.get('io').emit('newMessage', aiMessage);
        } catch (error) {
          console.error('AI response error:', error);
        }
      }, 2000);
    }

    res.json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like message
router.post('/like/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;
    
    const chatRoom = await ChatRoom.findOne();
    const message = chatRoom.messages.id(messageId);
    
    const existingLike = message.likes.find(like => like.user.toString() === userId);
    if (existingLike) {
      message.likes = message.likes.filter(like => like.user.toString() !== userId);
    } else {
      message.likes.push({ user: userId });
    }
    
    await chatRoom.save();
    res.json({ success: true, likes: message.likes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Response Generator
async function generateAIResponse(question) {
  const dsaResponses = {
    'array': 'Arrays are fundamental data structures. Key concepts: indexing, iteration, two-pointer technique, sliding window. Practice problems on sorting, searching, and manipulation.',
    'linked list': 'Linked Lists: Dynamic data structure with nodes. Master traversal, insertion, deletion. Important: reverse, cycle detection, merge operations.',
    'tree': 'Trees: Hierarchical structure. Learn traversals (inorder, preorder, postorder), BST operations, height calculation, and path problems.',
    'graph': 'Graphs: Nodes and edges. Master BFS, DFS, shortest path algorithms (Dijkstra, Floyd-Warshall), and topological sorting.',
    'dynamic programming': 'DP: Break problems into subproblems. Identify overlapping subproblems and optimal substructure. Start with 1D DP, then 2D.',
    'recursion': 'Recursion: Function calling itself. Master base cases, recursive relations. Practice with factorial, fibonacci, tree problems.',
    'sorting': 'Sorting algorithms: Bubble, Selection, Insertion (O(n²)), Merge, Quick, Heap (O(n log n)). Understand time/space complexity.',
    'searching': 'Searching: Linear O(n), Binary O(log n). Binary search works on sorted arrays. Master the template and variations.'
  };

  const questionLower = question.toLowerCase();
  
  for (const [key, response] of Object.entries(dsaResponses)) {
    if (questionLower.includes(key)) {
      return `🤖 **AI Reply:** ${response}\n\n💡 **Tip:** Practice on LeetCode and solve problems step by step. Need more help? Ask specific questions!`;
    }
  }
  
  // Default AI response
  return `🤖 **AI Reply:** Great question! For DSA problems, I recommend:\n\n1️⃣ **Understand the problem** - Read carefully\n2️⃣ **Think of approach** - Brute force first\n3️⃣ **Optimize** - Look for patterns\n4️⃣ **Code & Test** - Write clean code\n\n💬 Ask more specific questions about algorithms, data structures, or coding patterns!`;
}

module.exports = router;