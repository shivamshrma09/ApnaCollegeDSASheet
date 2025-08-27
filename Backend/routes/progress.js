const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { calculateProgress } = require('../utils/helpers');

const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      completedProblems: user.completedProblems || [],
      starredProblems: user.starredProblems || [],
      notes: Object.fromEntries(user.notes || new Map()),
      playlists: user.playlists || []
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:userId/complete/:problemId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const problemId = parseInt(req.params.problemId);
    
    if (!user.completedProblems.includes(problemId)) {
      user.completedProblems.push(problemId);
    } else {
      user.completedProblems = user.completedProblems.filter(id => id !== problemId);
    }
    
    await user.save();
    res.json({ completedProblems: user.completedProblems });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:userId/star/:problemId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const problemId = parseInt(req.params.problemId);
    
    if (!user.starredProblems.includes(problemId)) {
      user.starredProblems.push(problemId);
    } else {
      user.starredProblems = user.starredProblems.filter(id => id !== problemId);
    }
    
    await user.save();
    res.json({ starredProblems: user.starredProblems });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:userId/note/:problemId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const problemId = req.params.problemId;
    const { note } = req.body;
    
    user.notes.set(problemId, note);
    await user.save();
    
    res.json({ notes: Object.fromEntries(user.notes) });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:userId/note/:problemId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const problemId = req.params.problemId;
    
    user.notes.delete(problemId);
    await user.save();
    
    res.json({ notes: Object.fromEntries(user.notes) });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:userId/playlist', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const { name, description } = req.body;
    
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      description: description || '',
      problems: [],
      createdAt: new Date()
    };
    
    user.playlists.push(newPlaylist);
    await user.save();
    
    res.json({ playlists: user.playlists });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:userId/playlist/:playlistId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const { name, description } = req.body;
    
    const playlist = user.playlists.id(req.params.playlistId);
    if (playlist) {
      playlist.name = name;
      playlist.description = description || '';
      await user.save();
    }
    
    res.json({ playlists: user.playlists });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:userId/playlist/:playlistId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.playlists = user.playlists.filter(p => p.id !== req.params.playlistId);
    await user.save();
    
    res.json({ playlists: user.playlists });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:userId/playlist/:playlistId/problem/:problemId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const problemId = parseInt(req.params.problemId);
    
    const playlist = user.playlists.find(p => p.id === req.params.playlistId);
    if (playlist && !playlist.problems.includes(problemId)) {
      playlist.problems.push(problemId);
      await user.save();
    }
    
    res.json({ playlists: user.playlists });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:userId/stats', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const totalProblems = 45; // Total problems in DSA sheet
    const completedCount = user.completedProblems.length;
    const starredCount = user.starredProblems.length;
    const notesCount = user.notes.size;
    const playlistsCount = user.playlists.length;
    
    const progress = calculateProgress(user.completedProblems, totalProblems);
    
    // Calculate difficulty-wise progress
    const easyCompleted = user.completedProblems.filter(id => {
      // Easy problems: 1,3,4,11,15,17,19,20,21,30,31,32
      const easyIds = [1,3,4,11,15,17,19,20,21,30,31,32];
      return easyIds.includes(id);
    }).length;
    
    const mediumCompleted = user.completedProblems.filter(id => {
      // Medium problems: 2,5,6,7,9,10,12,13,14,16,18,22,23,24,25,26,27,29,33,34,37,38,39,40,41,42,43,44
      const mediumIds = [2,5,6,7,9,10,12,13,14,16,18,22,23,24,25,26,27,29,33,34,37,38,39,40,41,42,43,44];
      return mediumIds.includes(id);
    }).length;
    
    const hardCompleted = user.completedProblems.filter(id => {
      // Hard problems: 8,28,35,45
      const hardIds = [8,28,35,45];
      return hardIds.includes(id);
    }).length;

    res.json({
      totalProblems,
      completedCount,
      starredCount,
      notesCount,
      playlistsCount,
      progress,
      difficultyStats: {
        easy: { completed: easyCompleted, total: 12 },
        medium: { completed: mediumCompleted, total: 28 },
        hard: { completed: hardCompleted, total: 5 }
      },
      joinDate: user.signupDate
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;