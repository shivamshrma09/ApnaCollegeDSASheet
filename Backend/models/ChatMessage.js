const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
    unique: true
  },
  text: {
    type: String,
    required: true
  },
  user: {
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  roomId: {
    type: String,
    required: true
  },
  isDM: {
    type: Boolean,
    default: false
  },
  receiverId: {
    type: String,
    default: null
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  replies: [{
    type: String
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
chatMessageSchema.index({ roomId: 1, timestamp: 1 });
chatMessageSchema.index({ 'user.id': 1, receiverId: 1, timestamp: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);