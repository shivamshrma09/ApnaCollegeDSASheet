const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  correctAnswers: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  answers: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  results: [{
    question: String,
    userAnswer: mongoose.Schema.Types.Mixed,
    correctAnswer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    explanation: String,
    options: [String]
  }],
  completedAt: {
    type: Date,
    default: Date.now
  },
  timeTaken: {
    type: Number, // in seconds
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
testResultSchema.index({ userId: 1, problemId: 1 });
testResultSchema.index({ completedAt: -1 });
testResultSchema.index({ score: -1 });

module.exports = mongoose.model('TestResult', testResultSchema);