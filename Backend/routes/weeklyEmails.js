const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { triggerWeeklyEmails, sendWeeklyEmail } = require('../services/emailScheduler');

// Manual trigger for all users (admin only)
router.post('/trigger-all', auth, async (req, res) => {
  try {
    await triggerWeeklyEmails();
    res.json({ message: 'Weekly emails triggered for all users' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send weekly email to specific user
router.post('/send/:userId', auth, async (req, res) => {
  try {
    await sendWeeklyEmail(req.params.userId);
    res.json({ message: 'Weekly email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;