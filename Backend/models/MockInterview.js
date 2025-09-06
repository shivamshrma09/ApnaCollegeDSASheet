const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  skills: {
    type: String,
    required: true
  },
  interviewRound: {
    type: String,
    required: true
  },
  questions: [{
    question: String,
    userAnswer: String,
    score: Number
  }],
  totalScore: {
    type: Number,
    default: 0
  },
  feedback: {
    type: String
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MockInterview', mockInterviewSchema);