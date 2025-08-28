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
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
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