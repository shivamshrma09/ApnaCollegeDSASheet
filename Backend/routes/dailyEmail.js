const express = require('express');
const router = express.Router();
const { sendDailyEmail, sendDailyEmailsToAllUsers } = require('../services/dailyEmailService');

// Test route to send daily email to specific user
router.post('/test/:userId', async (req, res) => {
  try {
    await sendDailyEmail(req.params.userId);
    res.json({ success: true, message: 'Daily email sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test route to send daily emails to all users
router.post('/test-all', async (req, res) => {
  try {
    await sendDailyEmailsToAllUsers();
    res.json({ success: true, message: 'Daily emails sent to all users' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;