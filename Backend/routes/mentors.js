const express = require('express');
const Mentor = require('../models/Mentor');
const { auth } = require('../middleware/auth');
const { sanitizeForLog } = require('../utils/sanitizer');

const router = express.Router();

// Get all active mentors
router.get('/', auth, async (req, res) => {
  try {
    const mentors = await Mentor.find({ isActive: true })
      .select('-__v')
      .sort({ rating: -1, sessions: -1 });
    
    res.json(mentors);
  } catch (error) {
    console.error('Error fetching mentors:', sanitizeForLog(error.message));
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
});

// Get mentor by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor || !mentor.isActive) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    res.json(mentor);
  } catch (error) {
    console.error('Error fetching mentor:', sanitizeForLog(error.message));
    res.status(500).json({ error: 'Failed to fetch mentor' });
  }
});

module.exports = router;