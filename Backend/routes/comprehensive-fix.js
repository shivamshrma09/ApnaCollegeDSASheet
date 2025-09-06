const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const csrf = require('csurf');
const router = express.Router();

// CSRF Protection with secure cookie settings
const csrfProtection = csrf({ 
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    domain: process.env.COOKIE_DOMAIN || 'localhost'
  }
});

// Comprehensive fix for all user issues
router.post('/fix-all/:userId', auth, csrfProtection, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Fixing user:', user.name);

    // Fix both sheet types - use existing data only
    ['apnaCollege', 'loveBabbar'].forEach(sheetType => {
      if (user.sheetProgress?.[sheetType]) {
        const sheetData = user.sheetProgress[sheetType];
        
        // Use existing totalSolved, easySolved, etc. if they exist and are correct
        // Only fix if they don't match completedProblems length
        const completedCount = sheetData.completedProblems?.length || 0;
        
        if (sheetData.totalSolved !== completedCount) {
          sheetData.totalSolved = completedCount;
        }
        
        // Only initialize forgetting curve structure if it doesn't exist
        if (!sheetData.forgettingCurve) {
          sheetData.forgettingCurve = {
            today: [],
            day1: [],
            day3: [],
            week1: [],
            week2: [],
            month1: [],
            month3: []
          };
        }
        
        console.log(`Fixed ${sheetType}:`, {
          totalSolved: sheetData.totalSolved,
          easySolved: sheetData.easySolved,
          mediumSolved: sheetData.mediumSolved,
          hardSolved: sheetData.hardSolved
        });
      }
    });

    await user.save();
    
    res.json({ 
      message: 'User data structure fixed',
      user: {
        name: user.name,
        apnaCollege: user.sheetProgress.apnaCollege,
        loveBabbar: user.sheetProgress.loveBabbar
      }
    });
    
  } catch (error) {
    console.error('Error in comprehensive fix:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;