const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const {
  getUserProgress,
  toggleComplete,
  toggleStar,
  saveNote,
  deleteNote,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addToPlaylist,
  removeFromPlaylist
} = require('../controllers/progressController');

const router = express.Router();

// Get user progress for a sheet
router.get('/:userId', async (req, res) => {
  try {
    const { sheetType = 'apnaCollege' } = req.query;
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      // Return empty progress instead of error for better UX
      return res.json({
        completedProblems: [],
        starredProblems: [],
        notes: {},
        playlists: [],
        streak: 0,
        lastSolved: null
      });
    }
    
    const sheetData = user.sheetProgress?.[sheetType] || {};
    
    // Initialize spaced repetition for existing completed problems if not exists
    if (sheetData.completedProblems && sheetData.completedProblems.length > 0) {
      if (!sheetData.spacedRepetition) sheetData.spacedRepetition = [];
      
      sheetData.completedProblems.forEach(problemId => {
        const existingSpacedRep = sheetData.spacedRepetition.find(sr => sr.problemId === problemId.toString());
        if (!existingSpacedRep) {
          const daysSinceCompleted = Math.floor(Math.random() * 7) + 1; // Random 1-7 days
          sheetData.spacedRepetition.push({
            problemId: problemId.toString(),
            nextReviewDate: new Date(Date.now() + daysSinceCompleted * 24 * 60 * 60 * 1000),
            interval: daysSinceCompleted,
            repetitions: 0,
            easeFactor: 2.5,
            quality: 3,
            lastReviewDate: new Date()
          });
        }
      });
      
      // Save updated data
      if (!user.sheetProgress) user.sheetProgress = {};
      user.sheetProgress[sheetType] = sheetData;
      user.markModified('sheetProgress');
      await user.save();
    }
    
    res.json({
      completedProblems: sheetData.completedProblems || [],
      starredProblems: sheetData.starredProblems || [],
      notes: sheetData.notes || {},
      playlists: sheetData.playlists || [],
      streak: sheetData.streak || 0,
      lastSolved: sheetData.lastSolved || null
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle problem completion
router.post('/:userId/complete/:problemId', async (req, res) => {
  try {
    const { userId, problemId } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.sheetProgress) user.sheetProgress = {};
    
    const sheetData = user.sheetProgress[sheetType] || {
      completedProblems: [],
      starredProblems: [],
      notes: {},
      streak: 0,
      lastSolved: null,
      spacedRepetition: []
    };
    
    const problemIndex = sheetData.completedProblems.indexOf(parseInt(problemId));
    
    if (problemIndex > -1) {
      // Remove from completed
      sheetData.completedProblems.splice(problemIndex, 1);
      
      // Remove from spaced repetition
      if (!sheetData.spacedRepetition) sheetData.spacedRepetition = [];
      sheetData.spacedRepetition = sheetData.spacedRepetition.filter(sr => sr.problemId !== problemId);
    } else {
      // Add to completed
      sheetData.completedProblems.push(parseInt(problemId));
      sheetData.lastSolved = new Date();
      
      // Add to spaced repetition with initial schedule
      if (!sheetData.spacedRepetition) sheetData.spacedRepetition = [];
      const existingSpacedRep = sheetData.spacedRepetition.find(sr => sr.problemId === problemId);
      if (!existingSpacedRep) {
        sheetData.spacedRepetition.push({
          problemId,
          nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          quality: 3,
          lastReviewDate: new Date()
        });
      }
    }
    
    user.sheetProgress[sheetType] = sheetData;
    user.markModified('sheetProgress');
    await user.save();
    
    res.json({ success: true, completedProblems: sheetData.completedProblems });
  } catch (error) {
    console.error('Error toggling problem completion:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle problem star
router.post('/:userId/star/:problemId', async (req, res) => {
  try {
    const { userId, problemId } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.sheetProgress) user.sheetProgress = {};
    
    const sheetData = user.sheetProgress[sheetType] || {
      completedProblems: [],
      starredProblems: [],
      streak: 0,
      lastSolved: null
    };
    
    if (!sheetData.starredProblems) sheetData.starredProblems = [];
    
    const problemIndex = sheetData.starredProblems.indexOf(parseInt(problemId));
    
    if (problemIndex > -1) {
      // Remove from starred
      sheetData.starredProblems.splice(problemIndex, 1);
    } else {
      // Add to starred
      sheetData.starredProblems.push(parseInt(problemId));
    }
    
    user.sheetProgress[sheetType] = sheetData;
    user.markModified('sheetProgress');
    await user.save();
    
    res.json({ success: true, starredProblems: sheetData.starredProblems });
  } catch (error) {
    console.error('Error toggling problem star:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save problem note
router.post('/:userId/note/:problemId', async (req, res) => {
  try {
    const { userId, problemId } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    const { note } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.sheetProgress) user.sheetProgress = {};
    
    const sheetData = user.sheetProgress[sheetType] || {
      completedProblems: [],
      starredProblems: [],
      notes: {},
      playlists: [],
      streak: 0,
      lastSolved: null
    };
    
    if (!sheetData.notes) sheetData.notes = {};
    sheetData.notes[problemId] = note;
    
    user.sheetProgress[sheetType] = sheetData;
    user.markModified('sheetProgress');
    await user.save();
    
    res.json({ success: true, notes: sheetData.notes });
  } catch (error) {
    console.error('Error saving note:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete problem note
router.delete('/:userId/note/:problemId', async (req, res) => {
  try {
    const { userId, problemId } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.sheetProgress) user.sheetProgress = {};
    
    const sheetData = user.sheetProgress[sheetType] || {
      completedProblems: [],
      starredProblems: [],
      notes: {},
      playlists: [],
      streak: 0,
      lastSolved: null
    };
    
    if (sheetData.notes && sheetData.notes[problemId]) {
      delete sheetData.notes[problemId];
    }
    
    user.sheetProgress[sheetType] = sheetData;
    user.markModified('sheetProgress');
    await user.save();
    
    res.json({ success: true, notes: sheetData.notes });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user statistics
router.get('/:userId/stats', async (req, res) => {
  try {
    const { sheetType = 'apnaCollege' } = req.query;
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.json({
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        streak: 0,
        lastSolved: null
      });
    }
    
    const sheetData = user.sheetProgress?.[sheetType] || {};
    
    res.json({
      totalSolved: sheetData.totalSolved || 0,
      easySolved: sheetData.easySolved || 0,
      mediumSolved: sheetData.mediumSolved || 0,
      hardSolved: sheetData.hardSolved || 0,
      streak: sheetData.streak || 0,
      lastSolved: sheetData.lastSolved || null
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create playlist
router.post('/:userId/playlist', async (req, res) => {
  try {
    const { userId } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    const playlistData = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.sheetProgress) user.sheetProgress = {};
    
    const sheetData = user.sheetProgress[sheetType] || {
      completedProblems: [],
      starredProblems: [],
      notes: {},
      playlists: [],
      streak: 0,
      lastSolved: null
    };
    
    if (!sheetData.playlists) sheetData.playlists = [];
    
    const newPlaylist = {
      id: Date.now().toString(),
      name: playlistData.name,
      description: playlistData.description || '',
      problems: [],
      createdAt: new Date(),
      sheetType
    };
    
    sheetData.playlists.push(newPlaylist);
    
    user.sheetProgress[sheetType] = sheetData;
    user.markModified('sheetProgress');
    await user.save();
    
    res.json({ success: true, playlists: sheetData.playlists });
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update playlist
router.put('/:userId/playlist/:playlistId', async (req, res) => {
  try {
    const { userId, playlistId } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    const playlistData = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.sheetProgress) user.sheetProgress = {};
    
    const sheetData = user.sheetProgress[sheetType] || {
      completedProblems: [],
      starredProblems: [],
      notes: {},
      playlists: [],
      streak: 0,
      lastSolved: null
    };
    
    if (!sheetData.playlists) sheetData.playlists = [];
    
    const playlistIndex = sheetData.playlists.findIndex(p => p.id === playlistId);
    if (playlistIndex > -1) {
      sheetData.playlists[playlistIndex] = {
        ...sheetData.playlists[playlistIndex],
        ...playlistData,
        id: playlistId
      };
    }
    
    user.sheetProgress[sheetType] = sheetData;
    user.markModified('sheetProgress');
    await user.save();
    
    res.json({ success: true, playlists: sheetData.playlists });
  } catch (error) {
    console.error('Error updating playlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete playlist
router.delete('/:userId/playlist/:playlistId', async (req, res) => {
  try {
    const { userId, playlistId } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.sheetProgress) user.sheetProgress = {};
    
    const sheetData = user.sheetProgress[sheetType] || {
      completedProblems: [],
      starredProblems: [],
      notes: {},
      playlists: [],
      streak: 0,
      lastSolved: null
    };
    
    if (!sheetData.playlists) sheetData.playlists = [];
    
    sheetData.playlists = sheetData.playlists.filter(p => p.id !== playlistId);
    
    user.sheetProgress[sheetType] = sheetData;
    user.markModified('sheetProgress');
    await user.save();
    
    res.json({ success: true, playlists: sheetData.playlists });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add problem to playlist
router.post('/:userId/playlist/:playlistId/problem/:problemId', async (req, res) => {
  try {
    const { userId, playlistId, problemId } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.sheetProgress) user.sheetProgress = {};
    
    const sheetData = user.sheetProgress[sheetType] || {
      completedProblems: [],
      starredProblems: [],
      notes: {},
      playlists: [],
      streak: 0,
      lastSolved: null
    };
    
    if (!sheetData.playlists) sheetData.playlists = [];
    
    const playlist = sheetData.playlists.find(p => p.id === playlistId);
    if (playlist) {
      if (!playlist.problems) playlist.problems = [];
      if (!playlist.problems.includes(parseInt(problemId))) {
        playlist.problems.push(parseInt(problemId));
      }
    }
    
    user.sheetProgress[sheetType] = sheetData;
    user.markModified('sheetProgress');
    await user.save();
    
    res.json({ success: true, playlists: sheetData.playlists });
  } catch (error) {
    console.error('Error adding to playlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove problem from playlist
router.delete('/:userId/playlist/:playlistId/problem/:problemId', async (req, res) => {
  try {
    const { userId, playlistId, problemId } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.sheetProgress) user.sheetProgress = {};
    
    const sheetData = user.sheetProgress[sheetType] || {
      completedProblems: [],
      starredProblems: [],
      notes: {},
      playlists: [],
      streak: 0,
      lastSolved: null
    };
    
    if (!sheetData.playlists) sheetData.playlists = [];
    
    const playlist = sheetData.playlists.find(p => p.id === playlistId);
    if (playlist && playlist.problems) {
      playlist.problems = playlist.problems.filter(p => p !== parseInt(problemId));
    }
    
    user.sheetProgress[sheetType] = sheetData;
    user.markModified('sheetProgress');
    await user.save();
    
    res.json({ success: true, playlists: sheetData.playlists });
  } catch (error) {
    console.error('Error removing from playlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;