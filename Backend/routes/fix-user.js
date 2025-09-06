const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Fix user data endpoint
router.post('/fix-stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fix Apna College stats
    if (user.sheetProgress?.apnaCollege) {
      const apnaData = user.sheetProgress.apnaCollege;
      const completedCount = apnaData.completedProblems?.length || 0;
      
      apnaData.totalSolved = completedCount;
      apnaData.easySolved = Math.ceil(completedCount * 0.7);
      apnaData.mediumSolved = Math.floor(completedCount * 0.25);
      apnaData.hardSolved = Math.floor(completedCount * 0.05);
      apnaData.streak = apnaData.streak || 1;
      
      // Initialize forgetting curve
      if (!apnaData.forgettingCurve) {
        apnaData.forgettingCurve = {
          today: [],
          day1: [],
          day3: [],
          week1: [],
          week2: [],
          month1: [],
          month3: []
        };
      }
      
      // Add problems to forgetting curve
      if (apnaData.completedProblems && apnaData.completedProblems.length > 0) {
        apnaData.forgettingCurve.today = [];
        apnaData.completedProblems.slice(0, 3).forEach(problemId => {
          apnaData.forgettingCurve.today.push({ problemId, addedDate: new Date() });
        });
      }
    }

    // Fix Love Babbar stats
    if (user.sheetProgress?.loveBabbar) {
      const loveBabbarData = user.sheetProgress.loveBabbar;
      const completedCount = loveBabbarData.completedProblems?.length || 0;
      
      loveBabbarData.totalSolved = completedCount;
      loveBabbarData.easySolved = Math.ceil(completedCount * 0.7);
      loveBabbarData.mediumSolved = Math.floor(completedCount * 0.25);
      loveBabbarData.hardSolved = Math.floor(completedCount * 0.05);
      loveBabbarData.streak = loveBabbarData.streak || 1;
      
      // Initialize forgetting curve
      if (!loveBabbarData.forgettingCurve) {
        loveBabbarData.forgettingCurve = {
          today: [],
          day1: [],
          day3: [],
          week1: [],
          week2: [],
          month1: [],
          month3: []
        };
      }
      
      // Add problems to forgetting curve
      if (loveBabbarData.completedProblems && loveBabbarData.completedProblems.length > 0) {
        loveBabbarData.forgettingCurve.today = [];
        loveBabbarData.completedProblems.slice(0, 3).forEach(problemId => {
          loveBabbarData.forgettingCurve.today.push({ problemId, addedDate: new Date() });
        });
      }
    }

    await user.save();
    
    res.json({ 
      message: 'User stats fixed successfully',
      apnaCollege: user.sheetProgress.apnaCollege,
      loveBabbar: user.sheetProgress.loveBabbar
    });
    
  } catch (error) {
    console.error('Error fixing user stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;