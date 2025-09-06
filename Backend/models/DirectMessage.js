const mongoose = require('mongoose');

const directMessageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  text: {
    type: String,
    required: true
  },
  sender: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, default: null }
  },
  receiver: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, default: null }
  },
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
  file: {
    name: String,
    type: String,
    url: String
  }
}, {
  timestamps: true
});

directMessageSchema.index({ conversationId: 1, timestamp: 1 });
directMessageSchema.index({ 'sender.id': 1, 'receiver.id': 1 });

module.exports = mongoose.models.DirectMessage || mongoose.model('DirectMessage', directMessageSchema);