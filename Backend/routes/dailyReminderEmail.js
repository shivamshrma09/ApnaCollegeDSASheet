const express = require('express');
const { sendEveningReminder, sendNightReminder, generateEveningReminderHTML, generateNightReminderHTML } = require('../services/dailyReminderEmailService');
const User = require('../models/User');
const router = express.Router();

// Test evening reminder for specific user
router.post('/test-evening/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const success = await sendEveningReminder(user, sheetType);
    
    if (success) {
      res.json({ 
        message: 'Evening reminder email sent successfully',
        email: user.email,
        sheetType 
      });
    } else {
      res.status(500).json({ message: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Test evening reminder error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Test night reminder for specific user
router.post('/test-night/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const success = await sendNightReminder(user, sheetType);
    
    if (success) {
      res.json({ 
        message: 'Night reminder email sent successfully',
        email: user.email,
        sheetType 
      });
    } else {
      res.status(500).json({ message: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Test night reminder error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Preview evening reminder email HTML
router.get('/preview-evening/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const emailHTML = generateEveningReminderHTML(user, require('../services/dailyReminderEmailService').getDailyProgress ? require('../services/dailyReminderEmailService').getDailyProgress(user, sheetType) : {});
    res.send(emailHTML);
  } catch (error) {
    console.error('Preview evening reminder error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Preview night reminder email HTML
router.get('/preview-night/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const emailHTML = generateNightReminderHTML(user, require('../services/dailyReminderEmailService').getDailyProgress ? require('../services/dailyReminderEmailService').getDailyProgress(user, sheetType) : {});
    res.send(emailHTML);
  } catch (error) {
    console.error('Preview night reminder error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;