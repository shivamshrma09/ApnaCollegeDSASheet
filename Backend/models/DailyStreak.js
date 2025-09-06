const mongoose = require('mongoose');

const dailyStreakSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastSolvedDate: {
    type: Date,
    default: null
  },
  totalProblemsSolved: {
    type: Number,
    default: 0
  },
  solvedProblems: [{
    problemId: String,
    title: String,
    difficulty: String,
    solvedDate: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Update streak when problem is solved
dailyStreakSchema.methods.updateStreak = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastSolved = this.lastSolvedDate ? new Date(this.lastSolvedDate) : null;
  
  if (lastSolved) {
    lastSolved.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today - lastSolved) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Consecutive day
      this.currentStreak += 1;
    } else if (daysDiff > 1) {
      // Streak broken
      this.currentStreak = 1;
    }
    // If daysDiff === 0, same day - don't change streak
  } else {
    // First problem
    this.currentStreak = 1;
  }
  
  // Update longest streak
  if (this.currentStreak > this.longestStreak) {
    this.longestStreak = this.currentStreak;
  }
  
  this.lastSolvedDate = new Date();
  this.totalProblemsSolved += 1;
};

module.exports = mongoose.model('DailyStreak', dailyStreakSchema);