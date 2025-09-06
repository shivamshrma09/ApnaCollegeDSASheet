const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Create playlist
router.post('/playlist', auth, async (req, res) => {
  try {
    const { name, description, sheetType, userId } = req.body;
    
    const user = await User.findById(userId || req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newPlaylist = {
      id: Date.now().toString(),
      name,
      description,
      sheetType,
      problems: [],
      createdAt: new Date()
    };

    if (!user.playlists) {
      user.playlists = [];
    }
    
    user.playlists.push(newPlaylist);
    await user.save();

    res.json({ success: true, playlist: newPlaylist });
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete playlist
router.delete('/playlist/:playlistId', auth, async (req, res) => {
  try {
    const { playlistId } = req.params;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.playlists = user.playlists.filter(p => p.id !== playlistId);
    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;