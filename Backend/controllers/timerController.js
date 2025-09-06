const User = require('../models/User');

// Start timer for a problem
const startTimer = async (req, res) => {
  try {
    const { problemId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Stop any active timer first
    const activeTimer = user.problemTimers.find(timer => timer.isActive);
    if (activeTimer) {
      activeTimer.isActive = false;
      activeTimer.endTime = new Date();
      activeTimer.timeSpent += Math.floor((activeTimer.endTime - activeTimer.startTime) / 1000);
    }

    // Find existing timer for this problem or create new one
    let timer = user.problemTimers.find(t => t.problemId === problemId);
    if (!timer) {
      timer = {
        problemId,
        timeSpent: 0,
        startTime: new Date(),
        isActive: true
      };
      user.problemTimers.push(timer);
    } else {
      timer.startTime = new Date();
      timer.isActive = true;
    }

    await user.save();
    res.json({ message: 'Timer started', timer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Stop timer for a problem
const stopTimer = async (req, res) => {
  try {
    const { problemId } = req.body;
    const userId = req.user.id;

    if (!problemId) {
      return res.status(400).json({ message: 'Problem ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.problemTimers) {
      user.problemTimers = [];
    }

    const timer = user.problemTimers.find(t => t.problemId === problemId && t.isActive);
    if (!timer) {
      // Stop any active timer if no specific timer found
      const activeTimer = user.problemTimers.find(t => t.isActive);
      if (activeTimer) {
        activeTimer.isActive = false;
        activeTimer.endTime = new Date();
        activeTimer.timeSpent += Math.floor((activeTimer.endTime - activeTimer.startTime) / 1000);
        await user.save();
        return res.json({ message: 'Active timer stopped', timer: activeTimer });
      }
      return res.status(404).json({ message: 'No active timer found' });
    }

    timer.isActive = false;
    timer.endTime = new Date();
    timer.timeSpent += Math.floor((timer.endTime - timer.startTime) / 1000);

    await user.save();
    res.json({ message: 'Timer stopped', timer });
  } catch (error) {
    console.error('Stop timer error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get timer data for a problem
const getTimer = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const timer = user.problemTimers.find(t => t.problemId === parseInt(problemId));
    res.json({ timer: timer || null });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all timers for user
const getAllTimers = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ timers: user.problemTimers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get multiple timers in batch
const getTimersBatch = async (req, res) => {
  try {
    const { problemIds } = req.body;
    const userId = req.user.id;

    if (!problemIds || !Array.isArray(problemIds)) {
      return res.status(400).json({ message: 'Problem IDs array is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter timers for requested problem IDs
    const requestedTimers = problemIds.map(problemId => {
      const timer = user.problemTimers.find(t => t.problemId === parseInt(problemId));
      return {
        problemId: parseInt(problemId),
        timeSpent: timer ? timer.timeSpent : 0,
        isActive: timer ? timer.isActive : false,
        startTime: timer ? timer.startTime : null
      };
    });

    res.json({ timers: requestedTimers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  startTimer,
  stopTimer,
  getTimer,
  getAllTimers,
  getTimersBatch
};