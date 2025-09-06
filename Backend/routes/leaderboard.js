const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get global leaderboard
router.get('/global', async (req, res) => {
  try {
    const { sheetType = 'apnaCollege' } = req.query;
    
    const users = await User.find({}).select('name email sheetProgress createdAt');
    
    const leaderboard = users.map(user => {
      const progress = user.sheetProgress?.get?.(sheetType) || user.sheetProgress?.[sheetType] || {};
      const completedCount = progress.completedProblems?.length || 0;
      
      return {
        _id: user._id,
        userId: user._id,
        name: user.name,
        email: user.email,
        completedProblems: completedCount,
        totalSolved: completedCount,
        problemsSolved: completedCount,
        score: completedCount,
        streak: progress.streak || 0,
        joinedAt: user.createdAt || new Date()
      };
    }).filter(user => user.completedProblems >= 0) // Show all users
      .sort((a, b) => {
        if (b.completedProblems !== a.completedProblems) {
          return b.completedProblems - a.completedProblems;
        }
        return b.streak - a.streak;
      })
      .slice(0, 10); // Top 10 users

    res.json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user rank
router.get('/rank/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    
    const users = await User.find({}).select('sheetProgress');
    
    const userScores = users.map(user => {
      const progress = user.sheetProgress?.get?.(sheetType) || user.sheetProgress?.[sheetType] || {};
      const completedCount = progress.completedProblems?.length || 0;
      
      return {
        userId: user._id.toString(),
        score: completedCount,
        completedProblems: completedCount,
        problemsSolved: completedCount,
        streak: progress.streak || 0
      };
    }).sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.streak - a.streak;
    });

    const userRank = userScores.findIndex(user => user.userId === userId) + 1;
    const userStats = userScores.find(user => user.userId === userId);

    res.json({ 
      rank: userRank || null,
      score: userStats?.score || 0,
      completedProblems: userStats?.completedProblems || 0,
      problemsSolved: userStats?.problemsSolved || 0,
      totalUsers: userScores.filter(u => u.score > 0).length
    });
  } catch (error) {
    console.error('Error fetching user rank:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;