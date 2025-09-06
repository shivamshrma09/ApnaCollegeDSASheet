
const mongoose = require('mongoose');

const discussionMessageSchema = new mongoose.Schema({
  problemId: {
    type: Number,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['user', 'ai'],
    default: 'user'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  fileUrl: {
    type: String
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiscussionMessage'
  },
  upvotes: {
    type: Number,
    default: 0
  },
  upvotedBy: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes for better performance
discussionMessageSchema.index({ problemId: 1, createdAt: 1 });
discussionMessageSchema.index({ userId: 1, createdAt: -1 });
discussionMessageSchema.index({ problemId: 1, isPrivate: 1, userId: 1 });

module.exports = mongoose.model('DiscussionMessage', discussionMessageSchema);
