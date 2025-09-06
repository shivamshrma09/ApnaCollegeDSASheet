const express = require('express');
const router = express.Router();
const { startTimer, stopTimer, getTimer, getAllTimers, getTimersBatch } = require('../controllers/timerController');
const { auth } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');

// Start timer for a problem
router.post('/start', auth, startTimer);

// Stop timer for a problem
router.post('/stop', auth, stopTimer);

// Get timer for specific problem
router.get('/:problemId', auth, getTimer);

// Get all timers for user
router.get('/', auth, getAllTimers);

// Get multiple timers in batch
router.post('/batch', auth, csrfProtection, getTimersBatch);

module.exports = router;