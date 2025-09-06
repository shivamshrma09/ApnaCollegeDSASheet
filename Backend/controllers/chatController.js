const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');
const User = require('../models/User');

// Get all chat rooms for user
const getChatRooms = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const chatRooms = await ChatRoom.find({
      'participants.user': userId
    })
    .populate('lastMessage')
    .populate('participants.user', 'name email avatar')
    .sort({ lastActivity: -1 });

    // Calculate unread counts
    const roomsWithUnread = await Promise.all(chatRooms.map(async (room) => {
      const participant = room.participants.find(p => p.user._id.toString() === userId.toString());
      const unreadCount = await Message.countDocuments({
        chatId: room._id.toString(),
        createdAt: { $gt: participant.lastSeen },
        sender: { $ne: userId }
      });

      return {
        ...room.toObject(),
        unreadCount
      };
    }));

    res.json(roomsWithUnread);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get messages for a chat room
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user._id;

    const messages = await Message.find({
      chatId,
      deleted: false
    })
    .populate('sender', 'name email avatar')
    .populate('replyTo')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    // Mark messages as read
    await ChatRoom.updateOne(
      { _id: chatId, 'participants.user': userId },
      { 
        $set: { 
          'participants.$.lastSeen': new Date(),
          'participants.$.unreadCount': 0
        }
      }
    );

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const { chatId, content, replyTo } = req.body;
    const userId = req.user._id;

    const message = new Message({
      content,
      sender: userId,
      chatType: 'group',
      chatId,
      replyTo
    });

    await message.save();
    await message.populate('sender', 'name email avatar');

    // Update chat room last activity
    await ChatRoom.updateOne(
      { _id: chatId },
      { 
        lastMessage: message._id,
        lastActivity: new Date()
      }
    );

    // Increment unread count for other participants
    await ChatRoom.updateMany(
      { 
        _id: chatId,
        'participants.user': { $ne: userId }
      },
      { 
        $inc: { 'participants.$.unreadCount': 1 }
      }
    );

    // Emit to socket
    const io = req.app.get('io');
    io.to(chatId).emit('newMessage', message);

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create group chat
const createGroup = async (req, res) => {
  try {
    const { name, description, participants } = req.body;
    const userId = req.user._id;

    const chatRoom = new ChatRoom({
      name,
      description,
      type: 'group',
      creator: userId,
      participants: [
        { user: userId, role: 'admin' },
        ...participants.map(p => ({ user: p, role: 'member' }))
      ]
    });

    await chatRoom.save();
    await chatRoom.populate('participants.user', 'name email avatar');

    res.json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create or get DM
const createOrGetDM = async (req, res) => {
  try {
    const { userId: targetUserId } = req.body;
    const currentUserId = req.user._id;

    // Check if DM already exists
    let dmRoom = await ChatRoom.findOne({
      type: 'dm',
      $and: [
        { 'participants.user': currentUserId },
        { 'participants.user': targetUserId }
      ]
    }).populate('participants.user', 'name email avatar');

    if (!dmRoom) {
      // Create new DM
      const targetUser = await User.findById(targetUserId);
      
      dmRoom = new ChatRoom({
        name: `${req.user.name} & ${targetUser.name}`,
        type: 'dm',
        creator: currentUserId,
        participants: [
          { user: currentUserId, role: 'member' },
          { user: targetUserId, role: 'member' }
        ],
        isPrivate: true
      });

      await dmRoom.save();
      await dmRoom.populate('participants.user', 'name email avatar');
    }

    res.json(dmRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users for DM
const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id }
    }).select('name email avatar').limit(50);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upvote message
const upvoteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    
    // Check if already upvoted
    const existingUpvote = message.upvotes.find(u => u.user.toString() === userId.toString());
    const existingDownvote = message.downvotes.find(d => d.user.toString() === userId.toString());

    if (existingUpvote) {
      // Remove upvote
      message.upvotes = message.upvotes.filter(u => u.user.toString() !== userId.toString());
    } else {
      // Add upvote and remove downvote if exists
      if (existingDownvote) {
        message.downvotes = message.downvotes.filter(d => d.user.toString() !== userId.toString());
      }
      message.upvotes.push({ user: userId });
    }

    await message.save();

    // Emit to socket
    const io = req.app.get('io');
    io.to(message.chatId).emit('messageUpdated', message);

    res.json({ 
      upvotes: message.upvotes.length,
      downvotes: message.downvotes.length,
      userVote: existingUpvote ? null : 'up'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const chatRooms = await ChatRoom.find({
      'participants.user': userId
    });

    let totalUnread = 0;
    for (let room of chatRooms) {
      const participant = room.participants.find(p => p.user.toString() === userId.toString());
      const unreadCount = await Message.countDocuments({
        chatId: room._id.toString(),
        createdAt: { $gt: participant.lastSeen },
        sender: { $ne: userId }
      });
      totalUnread += unreadCount;
    }

    res.json({ totalUnread });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Save message function for socket handler
const saveMessage = async (messageData) => {
  try {
    const Discussion = require('../models/Discussion');
    const savedMessage = await Discussion.create(messageData);
    return savedMessage;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

module.exports = {
  getChatRooms,
  getMessages,
  sendMessage,
  createGroup,
  createOrGetDM,
  getUsers,
  upvoteMessage,
  getUnreadCount,
  saveMessage
};