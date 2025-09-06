const mongoose = require('mongoose');

const userAnalyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Problem solving patterns
  problemAttempts: [{
    problemId: Number,
    attempts: Number,
    timeSpent: Number, // in seconds
    solved: Boolean,
    difficulty: String,
    topic: String,
    companies: String,
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Weak areas identification
  weakAreas: [{
    topic: String,
    difficulty: String,
    failureRate: Number, // percentage
    avgTimeSpent: Number,
    lastUpdated: { type: Date, default: Date.now }
  }],
  
  // Study patterns
  studySession: [{
    startTime: Date,
    endTime: Date,
    problemsSolved: Number,
    topicsStudied: [String],
    avgAccuracy: Number
  }],
  
  // Interview preparation data
  interviewPrep: {
    targetCompany: String,
    interviewDate: Date,
    dailyGoal: Number,
    currentStreak: Number,
    totalDaysActive: Number,
    preferredDifficulty: String,
    focusAreas: [String]
  },
  
  // Performance metrics
  performance: {
    totalSolved: { type: Number, default: 0 },
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
    avgSolveTime: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
  },
  
  // AI Analysis Reports
  analysisReports: [{
    sheetType: String,
    reportDate: { type: Date, default: Date.now },
    overallScore: Number,
    totalTimeSpent: Number, // in minutes
    avgTimePerProblem: Number,
    totalTests: Number,
    avgTestScore: Number,
    weakAreas: [{
      topic: String,
      percentage: Number,
      solved: Number,
      total: Number,
      avgTime: Number,
      avgScore: Number,
      recommendation: String
    }],
    strongAreas: [{
      topic: String,
      percentage: Number,
      solved: Number,
      total: Number
    }],
    timeAnalysis: {
      fastSolvers: Number,
      moderateSolvers: Number,
      slowSolvers: Number,
      insights: String
    },
    recommendations: [String],
    nextSteps: [{
      title: String,
      link: String,
      reason: String
    }],
    detailedInsights: String,
    problemsAnalyzed: Number,
    dataQuality: {
      hasTimeData: Boolean,
      hasTestData: Boolean,
      completionRate: Number
    }
  }],
  
  // Learning patterns and insights
  learningPatterns: {
    bestPerformanceTime: String, // morning, afternoon, evening
    averageSessionLength: Number, // in minutes
    preferredDifficulty: String,
    consistencyScore: Number, // 0-100
    improvementRate: Number, // problems per week
    lastAnalysisDate: Date
  },
  

}, {
  timestamps: true
});

// Indexes for better query performance
userAnalyticsSchema.index({ userId: 1 });
userAnalyticsSchema.index({ 'problemAttempts.timestamp': -1 });
userAnalyticsSchema.index({ 'weakAreas.topic': 1 });
userAnalyticsSchema.index({ 'analysisReports.reportDate': -1 });

module.exports = mongoose.model('UserAnalytics', userAnalyticsSchema);