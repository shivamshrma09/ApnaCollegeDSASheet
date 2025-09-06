const express = require('express');
const router = express.Router();
const Mentorship = require('../models/Mentorship');
const mongoose = require('mongoose');

// Waiting List Schema
const waitingListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  domain: { type: String },
  mentorId: { type: String },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' }
});

const WaitingList = mongoose.model('WaitingList', waitingListSchema);

// Get all mentors (no auth required)
router.get('/', async (req, res) => {
  try {
    const mentors = await Mentorship.find({ isActive: true });
    res.json(mentors);
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get mentor by ID
router.get('/:id', async (req, res) => {
  try {
    const mentor = await Mentorship.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new mentor
router.post('/', async (req, res) => {
  try {
    const mentor = new Mentorship(req.body);
    const savedMentor = await mentor.save();
    res.status(201).json(savedMentor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add to waiting list (no auth required)
router.post('/waiting-list', async (req, res) => {
  try {
    const { name, email, phone, domain, mentorId } = req.body;
    
    const waitingListEntry = new WaitingList({
      name,
      email,
      phone,
      domain,
      mentorId
    });
    
    await waitingListEntry.save();
    
    res.status(201).json({ 
      message: 'Successfully added to waiting list',
      success: true 
    });
  } catch (error) {
    console.error('Error adding to waiting list:', error);
    res.status(400).json({ 
      message: 'Error adding to waiting list',
      error: error.message 
    });
  }
});

// Get waiting list entries
router.get('/waiting-list', async (req, res) => {
  try {
    const entries = await WaitingList.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;