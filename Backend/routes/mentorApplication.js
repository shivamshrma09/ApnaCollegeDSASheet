const express = require('express');
const router = express.Router();
const MentorApplication = require('../models/MentorApplication');

// Submit mentor application
router.post('/apply', async (req, res) => {
  try {
    const application = new MentorApplication(req.body);
    await application.save();
    res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;