const express = require('express');
const ConceptNote = require('../models/ConceptNote');

const router = express.Router();

// Get all concept notes
router.get('/', async (req, res) => {
  try {
    const { topic } = req.query;
    const filter = topic ? { topic } : {};
    const notes = await ConceptNote.find(filter).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch concept notes' });
  }
});

// Get concept note by ID
router.get('/:id', async (req, res) => {
  try {
    const note = await ConceptNote.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

module.exports = router;