const User = require('../models/User');

const getUserProgress = async (req, res) => {
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
};

const toggleComplete = async (req, res) => {
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
};

const toggleStar = async (req, res) => {
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
};

const saveNote = async (req, res) => {
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
};

const deleteNote = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const problemId = req.params.problemId;
    
    user.notes.delete(problemId);
    await user.save();
    
    res.json({ notes: Object.fromEntries(user.notes) });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getUserProgress,
  toggleComplete,
  toggleStar,
  saveNote,
  deleteNote
};