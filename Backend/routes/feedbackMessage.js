const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const feedbackController = require('../controllers/feedbackMessageController');

// Check if user should see feedback message
router.get('/check', feedbackController.checkFeedbackMessage);

// Mark feedback message as seen
router.post('/seen', feedbackController.markFeedbackMessageSeen);

module.exports = router;