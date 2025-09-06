const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/profiles');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Sanitize filename to prevent path traversal
    const sanitizedName = path.basename(file.originalname);
    const ext = path.extname(sanitizedName).toLowerCase();
    cb(null, 'profile-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get user profile
router.get('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload profile photo
router.post('/upload-photo/:userId', auth, csrfProtection, upload.single('profilePhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const photoUrl = `/uploads/profiles/${req.file.filename}`;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { profileAvatar: photoUrl },
      { new: true }
    ).select('-password');
    
    res.json({ 
      message: 'Profile photo updated successfully',
      photoUrl: photoUrl,
      user: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/:userId', auth, csrfProtection, async (req, res) => {
  try {
    const { leetcodeUsername, githubUsername, codeforcesUsername, bio, avatar, name } = req.body;
    
    const updateData = {
      leetcodeUsername: leetcodeUsername || '',
      githubUsername: githubUsername || '',
      codeforcesUsername: codeforcesUsername || '',
      bio: bio || ''
    };
    
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch platform statistics
router.post('/platform-stats', auth, csrfProtection, async (req, res) => {
  try {
    const { leetcode, github, codeforces } = req.body;
    const stats = {};

    // Fetch LeetCode stats (mock implementation)
    if (leetcode) {
      try {
        // This would be a real API call to LeetCode
        stats.leetcode = {
          totalSolved: Math.floor(Math.random() * 1000) + 100,
          easySolved: Math.floor(Math.random() * 300) + 50,
          mediumSolved: Math.floor(Math.random() * 400) + 100,
          hardSolved: Math.floor(Math.random() * 200) + 20,
          ranking: Math.floor(Math.random() * 100000) + 10000,
          acceptanceRate: (Math.random() * 30 + 60).toFixed(1) + '%'
        };
      } catch (error) {
        console.error('LeetCode API error:', error);
      }
    }

    // Fetch GitHub stats (mock implementation)
    if (github) {
      try {
        // This would be a real API call to GitHub
        stats.github = {
          publicRepos: Math.floor(Math.random() * 50) + 10,
          followers: Math.floor(Math.random() * 500) + 20,
          following: Math.floor(Math.random() * 200) + 30,
          contributions: Math.floor(Math.random() * 1000) + 200,
          stars: Math.floor(Math.random() * 100) + 10
        };
      } catch (error) {
        console.error('GitHub API error:', error);
      }
    }

    // Fetch Codeforces stats (mock implementation)
    if (codeforces) {
      try {
        // This would be a real API call to Codeforces
        const ratings = ['newbie', 'pupil', 'specialist', 'expert', 'candidate master', 'master'];
        stats.codeforces = {
          rating: Math.floor(Math.random() * 1000) + 800,
          maxRating: Math.floor(Math.random() * 1200) + 900,
          rank: ratings[Math.floor(Math.random() * ratings.length)],
          contestsParticipated: Math.floor(Math.random() * 100) + 10,
          problemsSolved: Math.floor(Math.random() * 500) + 50
        };
      } catch (error) {
        console.error('Codeforces API error:', error);
      }
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user statistics
router.get('/stats/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate user statistics
    const stats = {
      totalProblems: 373,
      joinedDate: user.createdAt,
      lastActive: user.lastActive,
      totalTimeSpent: user.problemTimers.reduce((total, timer) => total + (timer.timeSpent || 0), 0),
      averageTimePerProblem: 0,
      problemsThisWeek: 0,
      problemsThisMonth: 0
    };

    if (user.problemTimers.length > 0) {
      stats.averageTimePerProblem = Math.round(stats.totalTimeSpent / user.problemTimers.length);
    }

    // Calculate problems solved this week/month
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    stats.problemsThisWeek = user.problemTimers.filter(timer => 
      timer.endTime && new Date(timer.endTime) >= weekAgo
    ).length;

    stats.problemsThisMonth = user.problemTimers.filter(timer => 
      timer.endTime && new Date(timer.endTime) >= monthAgo
    ).length;

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard/global', auth, async (req, res) => {
  try {
    const { sheetType = 'apnaCollege' } = req.query;
    const users = await User.find({})
      .select('name avatar profileAvatar sheetProgress createdAt')
      .limit(50);

    const leaderboard = users.map(user => {
      // Get sheet-specific data
      const sheetData = user.sheetProgress?.[sheetType] || {};
      const solvedCount = (sheetData.completedProblems || []).length;
      const totalSolved = sheetData.totalSolved || solvedCount;
      
      return {
        _id: user._id,
        name: user.name,
        problemsSolved: totalSolved,
        avatar: user.profileAvatar || user.avatar,
        joinedAt: user.createdAt,
        sheetType: sheetType
      };
    })
    .filter(user => user.problemsSolved > 0) // Only include users with solved problems
    .sort((a, b) => b.problemsSolved - a.problemsSolved);
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user rank
router.get('/leaderboard/rank/:userId', auth, async (req, res) => {
  try {
    const { sheetType = 'apnaCollege' } = req.query;
    const userId = req.params.userId;
    
    const users = await User.find({})
      .select('sheetProgress')
      .lean();

    const userScores = users.map(user => {
      const sheetData = user.sheetProgress?.[sheetType] || {};
      return {
        _id: user._id,
        score: (sheetData.completedProblems || []).length
      };
    })
    .filter(user => user.score > 0)
    .sort((a, b) => b.score - a.score);

    const userRank = userScores.findIndex(user => user._id.toString() === userId) + 1;
    const userScore = userScores.find(user => user._id.toString() === userId)?.score || 0;

    res.json({
      rank: userRank || userScores.length + 1,
      totalUsers: userScores.length,
      problemsSolved: userScore,
      sheetType
    });
  } catch (error) {
    console.error('Error fetching user rank:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;