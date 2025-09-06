const express = require('express');
const router = express.Router();
const { sendWeeklyEmail } = require('../services/weeklyEmailService');

// Test email endpoint
router.post('/test/:userId', async (req, res) => {
  try {
    await sendWeeklyEmail(req.params.userId);
    res.json({ success: true, message: 'Test email sent successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;