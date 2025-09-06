const express = require('express');
const { auth } = require('../middleware/auth');
const { createRoomModel } = require('../models/RoomMessage');
const { createDMModel } = require('../models/DMMessage');
const Group = require('../models/Group');
const { sanitizeInput, sanitizeForLog } = require('../utils/sanitizer');
const router = express.Router();

// Generate random invite code
const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Get room messages
router.get('/room/:roomId', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    console.log(`📥 Fetching messages for room: ${sanitizeForLog(roomId)}`);
    
    const RoomModel = createRoomModel(roomId);
    const messages = await RoomModel.find({}).sort({ timestamp: 1 }).lean();
    
    console.log(`📨 Found ${messages.length} messages for room ${roomId}`);
    res.json({ messages });
  } catch (error) {
    console.error('Error fetching room messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send room message
router.post('/room/send', auth, async (req, res) => {
  try {
    const messageData = req.body;
    const { roomId } = messageData;
    
    console.log(`💾 Saving message to room: ${roomId}`);
    
    const RoomModel = createRoomModel(roomId);
    const message = new RoomModel({
      messageId: messageData.id.toString(),
      text: messageData.text,
      user: messageData.user,
      upvotes: messageData.upvotes || 0,
      downvotes: messageData.downvotes || 0,
      upvotedBy: messageData.upvotedBy || [],
      downvotedBy: messageData.downvotedBy || [],
      replies: messageData.replies || [],
      timestamp: new Date(messageData.timestamp)
    });
    
    await message.save();
    console.log(`✅ Message saved to room ${roomId}`);
    res.json({ success: true, message: messageData });
  } catch (error) {
    console.error('Error sending room message:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get DM messages
router.get('/dm/:userId1/:userId2', auth, async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    console.log(`📥 Fetching DM messages between ${userId1} and ${userId2}`);
    
    const DMModel = createDMModel(userId1, userId2);
    const messages = await DMModel.find({}).sort({ timestamp: 1 }).lean();
    
    console.log(`📨 Found ${messages.length} DM messages`);
    res.json({ messages });
  } catch (error) {
    console.error('Error fetching DM messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send DM message
router.post('/dm/send', auth, async (req, res) => {
  try {
    const messageData = req.body;
    const { user, receiverId } = messageData;
    
    console.log(`💾 Saving DM message from ${user.id} to ${receiverId}`);
    
    const DMModel = createDMModel(user.id, receiverId);
    const message = new DMModel({
      messageId: messageData.id.toString(),
      text: messageData.text,
      user: messageData.user,
      upvotes: messageData.upvotes || 0,
      downvotes: messageData.downvotes || 0,
      upvotedBy: messageData.upvotedBy || [],
      downvotedBy: messageData.downvotedBy || [],
      replies: messageData.replies || [],
      timestamp: new Date(messageData.timestamp)
    });
    
    await message.save();
    console.log(`✅ DM message saved`);
    res.json({ success: true, message: messageData });
  } catch (error) {
    console.error('Error sending DM message:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create group
router.post('/create-group', auth, async (req, res) => {
  try {
    const { groupName, description, creatorId, creatorName } = req.body;
    
    const inviteCode = generateInviteCode();
    
    const group = new Group({
      name: groupName,
      description: description || '',
      creator: { id: creatorId, name: creatorName },
      members: [{ id: creatorId, name: creatorName }],
      inviteCode
    });
    
    await group.save();
    
    res.json({
      success: true,
      group: {
        id: group._id,
        name: group.name,
        inviteCode: group.inviteCode
      },
      inviteLink: `${process.env.FRONTEND_URL}/join-group/${inviteCode}`
    });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Join group
router.post('/join-group/:inviteCode', auth, async (req, res) => {
  try {
    const { inviteCode } = req.params;
    const { userId, userName } = req.body;
    
    const group = await Group.findOne({ inviteCode, isActive: true });
    if (!group) {
      return res.status(404).json({ error: 'Group not found or inactive' });
    }
    
    // Check if user already in group
    const isMember = group.members.some(member => member.id === userId);
    if (isMember) {
      return res.status(400).json({ error: 'Already a member of this group' });
    }
    
    // Add user to group
    group.members.push({ id: userId, name: userName });
    await group.save();
    
    res.json({
      success: true,
      groupId: group._id,
      groupName: group.name,
      memberCount: group.members.length
    });
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user groups
router.get('/user-groups/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const groups = await Group.find({
      'members.id': userId,
      isActive: true
    }).select('name _id creator inviteCode members createdAt').lean();
    
    res.json({ groups });
  } catch (error) {
    console.error('Error fetching user groups:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update message vote
router.post('/vote/:roomId/:messageId', auth, async (req, res) => {
  try {
    const { roomId, messageId } = req.params;
    const { type, userId } = req.body;
    
    const RoomModel = createRoomModel(roomId);
    const message = await RoomModel.findOne({ messageId });
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    if (type === 'upvote') {
      if (!message.upvotedBy.includes(userId)) {
        message.upvotedBy.push(userId);
        message.upvotes = message.upvotedBy.length;
      }
    } else if (type === 'downvote') {
      if (!message.downvotedBy.includes(userId)) {
        message.downvotedBy.push(userId);
        message.downvotes = message.downvotedBy.length;
      }
    }
    
    await message.save();
    res.json({ success: true, message });
  } catch (error) {
    console.error('Error updating vote:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get notifications
router.get('/notifications/:userId', auth, async (req, res) => {
  try {
    res.json({ notifications: [] });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;