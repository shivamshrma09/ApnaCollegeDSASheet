const express = require('express');
const { sendWeeklyReportEmail, generateWeeklyReportHTML } = require('../services/weeklyReportEmailService');
const User = require('../models/User');
const router = express.Router();

// Test weekly report email for specific user
router.post('/test/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const success = await sendWeeklyReportEmail(user, sheetType);
    
    if (success) {
      res.json({ 
        message: 'Weekly report email sent successfully',
        email: user.email,
        sheetType 
      });
    } else {
      res.status(500).json({ message: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Test weekly report error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Preview weekly report email HTML
router.get('/preview/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const emailHTML = generateWeeklyReportHTML(user, sheetType);
    res.send(emailHTML);
  } catch (error) {
    console.error('Preview weekly report error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;