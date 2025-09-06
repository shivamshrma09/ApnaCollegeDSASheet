const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  problemId: {
    type: Number,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  userId: {
    type: String,
    required: true,
    index: true
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
  upvotes: {
    type: Number,
    default: 0
  },
  upvotedBy: [{
    type: String
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discussion',
    default: null
  },
  isPrivate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better performance
discussionSchema.index({ problemId: 1, createdAt: 1 });
discussionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Discussion', discussionSchema);