const mongoose = require('mongoose');

const questionChatSchema = new mongoose.Schema({
  problemId: {
    type: Number,
    required: true
  },
  problemTitle: {
    type: String,
    required: true
  },
  problemLink: {
    type: String,
    required: true
  },
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    senderName: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    isAI: {
      type: Boolean,
      default: false
    },
    isQuestion: {
      type: Boolean,
      default: false
    },
    isPrivateAI: {
      type: Boolean,
      default: false
    },
    privateUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    upvotes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    seen: {
      type: Boolean,
      default: false
    },
    taggedUsers: [{
      type: String
    }],
    replies: [{
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      senderName: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  activeUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    lastSeen: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QuestionChat', questionChatSchema);