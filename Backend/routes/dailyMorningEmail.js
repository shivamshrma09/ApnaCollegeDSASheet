const express = require('express');
const { sendDailyMorningEmail, generateDailyEmailHTML } = require('../services/dailyMorningEmailService');
const User = require('../models/User');
const router = express.Router();

// Test daily morning email for specific user
router.post('/test/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const success = await sendDailyMorningEmail(user, sheetType);
    
    if (success) {
      res.json({ 
        message: 'Daily morning email sent successfully',
        email: user.email,
        sheetType 
      });
    } else {
      res.status(500).json({ message: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Test daily email error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Preview daily morning email HTML
router.get('/preview/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const emailHTML = generateDailyEmailHTML(user, sheetType);
    res.send(emailHTML);
  } catch (error) {
    console.error('Preview daily email error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update user notification preferences
router.put('/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { dailyReminder, reminderTime } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.notifications) {
      user.notifications = {};
    }

    if (typeof dailyReminder === 'boolean') {
      user.notifications.dailyReminder = dailyReminder;
    }
    
    if (reminderTime) {
      user.notifications.reminderTime = reminderTime;
    }

    await user.save();
    
    res.json({ 
      message: 'Notification preferences updated',
      notifications: user.notifications 
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;