const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');
const {
  submitFeedback,
  getAllFeedback,
  updateFeedback,
  getFeedbackStats
} = require('../controllers/feedbackController');

// @route   POST /api/feedback
// @desc    Submit user feedback
// @access  Public (no auth required)
router.post('/', submitFeedback);

// @route   GET /api/feedback
// @desc    Get all feedback (admin only)
// @access  Private
router.get('/', auth, getAllFeedback);

// @route   PUT /api/feedback/:id
// @desc    Update feedback status (admin only)
// @access  Private
router.put('/:id', auth, updateFeedback);

// @route   GET /api/feedback/stats
// @desc    Get feedback statistics (admin only)
// @access  Private
router.get('/stats', auth, getFeedbackStats);

module.exports = router;