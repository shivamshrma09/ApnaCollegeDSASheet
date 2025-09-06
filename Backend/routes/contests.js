const express = require('express');
const router = express.Router();
const contestController = require('../controllers/contestController');
const { auth } = require('../middleware/auth');

// Get upcoming contests
router.get('/upcoming', contestController.getUpcomingContests);

// Get running contests
router.get('/running', contestController.getRunningContests);

// Get past contests
router.get('/past', contestController.getPastContests);

// Refresh contests (admin only)
router.post('/refresh', auth, contestController.refreshContests);

// Update user platform data
router.put('/user/:userId/platforms', auth, contestController.updateUserPlatforms);

module.exports = router;