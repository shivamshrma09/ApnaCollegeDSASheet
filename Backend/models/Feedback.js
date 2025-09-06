const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  feedback: {
    type: String,
    required: true,
    trim: true
  },
  userEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  userName: {
    type: String,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  sheetType: {
    type: String,
    enum: ['apnaCollege', 'loveBabbar', 'striver', 'blind75', 'cp', 'striver79', 'striverSDE', 'unknown'],
    default: 'unknown'
  },
  category: {
    type: String,
    enum: ['bug', 'feature', 'improvement', 'general'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'resolved', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  adminNotes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
feedbackSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
feedbackSchema.index({ userEmail: 1, createdAt: -1 });
feedbackSchema.index({ status: 1, priority: 1 });
feedbackSchema.index({ sheetType: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);