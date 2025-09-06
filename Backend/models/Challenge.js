const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    answer: {
      type: String,
      default: ''
    },
    submittedAt: Date,
    aiAnalysis: {
      score: Number,
      feedback: String,
      strengths: [String],
      improvements: [String],
      analyzedAt: Date
    }
  }],
  duration: {
    type: Number, // in minutes
    required: true,
    default: 30
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  isSubmissionOpen: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-set endTime based on startTime and duration
challengeSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('startTime') || this.isModified('duration')) {
    // Ensure startTime is set if not provided
    if (!this.startTime) {
      this.startTime = new Date();
    }
    // Calculate endTime by adding duration in minutes to startTime
    this.endTime = new Date(this.startTime.getTime() + (this.duration * 60 * 1000));
  }
  next();
});

// Auto-close submissions when time expires
challengeSchema.methods.checkAndCloseSubmissions = function() {
  if (new Date() > this.endTime && this.isSubmissionOpen) {
    this.isSubmissionOpen = false;
    this.status = 'completed';
    return this.save();
  }
  return Promise.resolve(this);
};

module.exports = mongoose.model('Challenge', challengeSchema);