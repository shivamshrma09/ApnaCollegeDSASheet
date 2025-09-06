const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  platforms: {
    leetcode: {
      username: String,
      rating: { type: Number, default: 0 },
      problemsSolved: { type: Number, default: 0 },
      contestRating: { type: Number, default: 0 },
      globalRanking: { type: Number, default: 0 },
      lastUpdated: Date
    },
    codeforces: {
      username: String,
      rating: { type: Number, default: 0 },
      maxRating: { type: Number, default: 0 },
      rank: String,
      maxRank: String,
      contestsParticipated: { type: Number, default: 0 },
      lastUpdated: Date
    },
    codechef: {
      username: String,
      rating: { type: Number, default: 0 },
      stars: String,
      globalRanking: { type: Number, default: 0 },
      lastUpdated: Date
    },
    github: {
      username: String,
      repositories: { type: Number, default: 0 },
      followers: { type: Number, default: 0 },
      contributions: { type: Number, default: 0 },
      lastUpdated: Date
    }
  },
  overallRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProfile', userProfileSchema);