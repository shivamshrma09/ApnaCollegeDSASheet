const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  googleId: {
    type: String,
    sparse: true
  },
  avatar: {
    type: String,
    default: ''
  },
  problemTimers: [{
    problemId: { type: Number, required: true },
    timeSpent: { type: Number, default: 0 }, // in seconds
    startTime: { type: Date },
    endTime: { type: Date },
    isActive: { type: Boolean, default: false }
  }],
  leetcodeUsername: { type: String, default: '' },
  githubUsername: { type: String, default: '' },
  codeforcesUsername: { type: String, default: '' },
  bio: { type: String, default: '' },
  profileAvatar: { type: String, default: '' },
  // Legacy fields for backward compatibility
  completedProblems: [{ type: Number }],
  starredProblems: [{ type: Number }],
  notes: { type: Map, of: String, default: new Map() },
  playlists: [{
    id: String,
    name: String,
    description: String,
    problems: [Number],
    createdAt: { type: Date, default: Date.now }
  }],
  // Dynamic sheet-specific progress tracking for all sheets
  sheetProgress: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  spacedRepetition: [{
    problemId: Number,
    interval: { type: Number, default: 1 },
    repetitions: { type: Number, default: 0 },
    easeFactor: { type: Number, default: 2.5 },
    quality: { type: Number, default: 0 },
    nextReviewDate: Date,
    lastReviewDate: Date
  }],
  forgettingCurve: {
    today: [{ problemId: Number, addedDate: { type: Date, default: Date.now } }],
    day1: [{ problemId: Number, addedDate: Date }],
    day3: [{ problemId: Number, addedDate: Date }],
    week1: [{ problemId: Number, addedDate: Date }],
    week2: [{ problemId: Number, addedDate: Date }],
    month1: [{ problemId: Number, addedDate: Date }],
    month3: [{ problemId: Number, addedDate: Date }]
  },
  // Goal Setting & Tracking
  goals: {
    daily: {
      target: { type: Number, default: 3 },
      current: { type: Number, default: 0 },
      lastReset: { type: Date, default: Date.now }
    },
    weekly: {
      target: { type: Number, default: 20 },
      current: { type: Number, default: 0 },
      lastReset: { type: Date, default: Date.now }
    },
    interviewPrep: {
      targetDate: Date,
      daysRemaining: Number,
      dailyTarget: Number,
      focusAreas: [String],
      targetCompany: String
    }
  },
  
  // Weakness Tracking & AI Recommendations
  weaknessAnalysis: {
    weakTopics: [{
      topic: String,
      difficulty: String,
      failureRate: Number,
      avgTimeSpent: Number,
      recommendedProblems: [{
        platform: String, // 'leetcode' or 'gfg'
        problemId: String,
        title: String,
        link: String,
        difficulty: String
      }],
      lastUpdated: { type: Date, default: Date.now }
    }],
    aiRecommendations: [{
      type: String, // 'weakness', 'interview', 'daily'
      problems: [{
        platform: String,
        problemId: String,
        title: String,
        link: String,
        difficulty: String,
        reason: String
      }],
      generatedAt: { type: Date, default: Date.now }
    }]
  },
  
  // Notification Settings
  notifications: {
    email: { type: Boolean, default: true },
    dailyReminder: { type: Boolean, default: true },
    weeklyGoalReminder: { type: Boolean, default: true },
    reminderTime: { type: String, default: '09:00' }
  },
  
  // Weekly Reports Storage
  weeklyReports: [{
    reportData: {
      stats: {
        problemsSolved: Number,
        timeSpent: Number,
        accuracy: Number,
        currentStreak: Number
      },
      analysis: {
        weakAreas: [String],
        strongAreas: [String],
        recommendations: [String]
      },
      weekPeriod: {
        start: String,
        end: String
      }
    },
    generatedAt: { type: Date, default: Date.now }
  }],
  
  // Performance Data for AI Analysis
  performanceData: {
    type: Map,
    of: {
      type: Map,
      of: {
        timeSpent: { type: Number, default: 0 }, // in seconds
        testScore: { type: Number, default: 0 }, // percentage
        attempts: { type: Number, default: 1 },
        lastAttempt: { type: Date, default: Date.now }
      }
    },
    default: new Map()
  },
  
  // Test System
  testData: {
    type: Map,
    of: {
      questions: Array,
      generatedAt: Date
    },
    default: new Map()
  },
  testResults: {
    type: Map,
    of: {
      score: Number,
      correct: Number,
      total: Number,
      completedAt: Date,
      feedback: String
    },
    default: new Map()
  },
  
  // Premium Features
  premium: {
    isActive: { type: Boolean, default: false },
    expiresAt: Date,
    features: [String] // ['playlist_sharing', 'advanced_analytics', 'priority_support']
  },
  
  // Feedback message tracking
  feedbackMessage: {
    lastShownDate: { type: Date }
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);