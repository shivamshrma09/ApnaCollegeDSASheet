const express = require('express');
const { getAllSheetTypes, SHEET_TYPES } = require('../utils/sheetTypes');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get all available sheet types
router.get('/types', (req, res) => {
  const sheetTypes = [
    { id: 'apnaCollege', name: 'Apna College DSA Sheet', totalProblems: 373 },
    { id: 'loveBabbar', name: 'Love Babbar DSA Sheet', totalProblems: 450 },
    { id: 'striverSDE', name: 'Striver SDE Sheet', totalProblems: 191 },
    { id: 'striverSDEComplete', name: 'Striver SDE Sheet Complete', totalProblems: 191 },
    { id: 'striverA2Z', name: 'Striver A2Z DSA Sheet', totalProblems: 455 },
    { id: 'striver79', name: 'Striver 79 Sheet', totalProblems: 79 },
    { id: 'blind75', name: 'Blind 75', totalProblems: 75 },
    { id: 'striverBlind75', name: 'Striver Blind 75', totalProblems: 75 },
    { id: 'striverComplete', name: 'Striver Complete Sheet', totalProblems: 455 },
    { id: 'striverMaster', name: 'Striver Master Sheet', totalProblems: 455 },
    { id: 'striverCP', name: 'Striver CP Sheet', totalProblems: 200 },
    { id: 'striverArrays', name: 'Striver Arrays', totalProblems: 50 },
    { id: 'striverBinarySearch', name: 'Striver Binary Search', totalProblems: 30 },
    { id: 'companyWise', name: 'Company Wise Questions', totalProblems: 500 },
    { id: 'vision', name: 'VISION Sheet', totalProblems: 100 },
    { id: 'neetcode150', name: 'NeetCode 150', totalProblems: 150 },
    { id: 'systemDesign', name: 'System Design Roadmap', totalProblems: 70 },
    { id: 'leetcodeTop150', name: 'LeetCode Top Interview 150', totalProblems: 150 },
    { id: 'cp31', name: 'CP-31 Sheet', totalProblems: 372 }
  ];
  
  res.json({ sheetTypes });
});

// Get user's progress across all sheets
router.get('/user/:userId/all-progress', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.sheetProgress) {
      user.sheetProgress = {};
      user.markModified('sheetProgress');
      await user.save();
    }

    const allProgress = {};
    
    // Convert object for response
    for (const [sheetType, data] of Object.entries(user.sheetProgress)) {
      allProgress[sheetType] = {
        completedProblems: data.completedProblems || [],
        starredProblems: data.starredProblems || [],
        totalSolved: data.totalSolved || 0,
        easySolved: data.easySolved || 0,
        mediumSolved: data.mediumSolved || 0,
        hardSolved: data.hardSolved || 0,
        streak: data.streak || 0,
        lastSolvedDate: data.lastSolvedDate,
        notesCount: data.notes ? Object.keys(data.notes).length : 0,
        playlistsCount: data.playlists ? data.playlists.length : 0
      };
    }

    res.json({ allProgress });
  } catch (error) {
    console.error('Error getting all progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Initialize a new sheet for user
router.post('/user/:userId/initialize/:sheetType', auth, async (req, res) => {
  try {
    const { userId, sheetType } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.sheetProgress) {
      user.sheetProgress = {};
    }

    if (!user.sheetProgress[sheetType]) {
      user.sheetProgress[sheetType] = {
        completedProblems: [],
        starredProblems: [],
        notes: {},
        playlists: [],
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        streak: 0,
        forgettingCurve: {
          today: [], day1: [], day3: [], week1: [], week2: [], month1: [], month3: []
        }
      };
      
      user.markModified('sheetProgress');
      await user.save();
      
      res.json({ 
        message: `Sheet ${sheetType} initialized successfully`,
        sheetData: user.sheetProgress[sheetType]
      });
    } else {
      res.json({ 
        message: `Sheet ${sheetType} already exists`,
        sheetData: user.sheetProgress[sheetType]
      });
    }
  } catch (error) {
    console.error('Error initializing sheet:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;