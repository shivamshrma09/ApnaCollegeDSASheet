const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Add problem to spaced repetition
router.post('/add', async (req, res) => {
  try {
    const { problemId } = req.body;
    const { sheetType = 'apnaCollege' } = req.query;
    const userId = req.headers.userid || '68ba7187488b0b8b3f463c04';
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.sheetProgress) user.sheetProgress = {};
    
    let sheetData = user.sheetProgress[sheetType] || {
      completedProblems: [],
      starredProblems: [],
      notes: {},
      spacedRepetition: [],
      streak: 0,
      lastSolved: null
    };
    
    if (!sheetData.spacedRepetition) sheetData.spacedRepetition = [];
    
    const existingEntry = sheetData.spacedRepetition.find(sr => sr.problemId === problemId);
    if (existingEntry) {
      return res.status(400).json({ message: 'Problem already in spaced repetition' });
    }
    
    sheetData.spacedRepetition.push({
      problemId,
      nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      quality: 3,
      lastReviewDate: new Date()
    });
    
    user.sheetProgress[sheetType] = sheetData;
    user.markModified('sheetProgress');
    await user.save();
    res.json({ message: 'Problem added to spaced repetition' });
  } catch (error) {
    console.error('Spaced repetition add error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Review problem (update spaced repetition)
router.post('/review', async (req, res) => {
  try {
    const { problemId, quality } = req.body; // quality: 0-5
    const { sheetType = 'apnaCollege' } = req.query;
    const userId = req.headers.userid || '68ba7187488b0b8b3f463c04';
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.sheetProgress) user.sheetProgress = {};
    
    let sheetData = user.sheetProgress[sheetType] || {
      completedProblems: [],
      starredProblems: [],
      notes: {},
      spacedRepetition: [],
      streak: 0,
      lastSolved: null
    };
    
    if (!sheetData.spacedRepetition) sheetData.spacedRepetition = [];
    
    const srEntry = sheetData.spacedRepetition.find(sr => sr.problemId === problemId);
    if (!srEntry) {
      return res.status(404).json({ message: 'Problem not found in spaced repetition' });
    }
    
    // SM-2 Algorithm
    srEntry.quality = quality;
    srEntry.lastReviewDate = new Date();
    
    if (quality >= 3) {
      if (srEntry.repetitions === 0) {
        srEntry.interval = 1;
      } else if (srEntry.repetitions === 1) {
        srEntry.interval = 6;
      } else {
        srEntry.interval = Math.round(srEntry.interval * srEntry.easeFactor);
      }
      srEntry.repetitions++;
    } else {
      srEntry.repetitions = 0;
      srEntry.interval = 1;
    }
    
    srEntry.easeFactor = Math.max(1.3, srEntry.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    srEntry.nextReviewDate = new Date(Date.now() + srEntry.interval * 24 * 60 * 60 * 1000);
    
    user.sheetProgress[sheetType] = sheetData;
    user.markModified('sheetProgress');
    await user.save();
    
    res.json({ 
      message: 'Review recorded', 
      nextReviewDate: srEntry.nextReviewDate,
      nextInterval: srEntry.interval + ' days'
    });
  } catch (error) {
    console.error('Spaced repetition review error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get due problems
router.get('/due', async (req, res) => {
  try {
    const { sheetType = 'apnaCollege' } = req.query;
    const userId = req.headers.userid || '68ba7187488b0b8b3f463c04';
    const user = await User.findById(userId);
    if (!user) {
      return res.json([]);
    }
    
    // Initialize sheet progress if not exists
    if (!user.sheetProgress) {
      user.sheetProgress = {};
    }
    if (!user.sheetProgress[sheetType]) {
      user.sheetProgress[sheetType] = {};
    }
    if (!user.sheetProgress[sheetType].spacedRepetition) {
      user.sheetProgress[sheetType].spacedRepetition = [];
    }
    
    const now = new Date();
    const spacedRepetition = user.sheetProgress[sheetType].spacedRepetition || [];
    
    const dueProblems = spacedRepetition.filter(sr => sr.nextReviewDate <= now);
    res.json(dueProblems);
  } catch (error) {
    console.error('Spaced repetition error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all spaced repetition data
router.get('/all', async (req, res) => {
  try {
    const { sheetType = 'apnaCollege' } = req.query;
    const userId = req.headers.userid || '68ba7187488b0b8b3f463c04';
    const user = await User.findById(userId);
    
    if (!user) {
      return res.json([]);
    }
    
    const sheetData = user.sheetProgress?.[sheetType] || {};
    const spacedRepetition = sheetData.spacedRepetition || [];
    res.json(spacedRepetition);
  } catch (error) {
    console.error('Spaced repetition error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;