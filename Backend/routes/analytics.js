const express = require('express');
const { trackProblemAttempt, getUserAnalytics, setInterviewGoals } = require('../controllers/analyticsController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Track problem attempt
router.post('/:userId/track', auth, trackProblemAttempt);

// Get user analytics
router.get('/:userId', auth, getUserAnalytics);

// Set interview preparation goals
router.post('/:userId/interview-goals', auth, setInterviewGoals);

module.exports = router;