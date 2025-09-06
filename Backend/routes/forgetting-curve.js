const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Helper function to initialize sheet data
const initializeSheetData = async (user, sheetType) => {
  if (!user.sheetProgress) {
    user.sheetProgress = new Map();
  }
  if (!user.sheetProgress.get(sheetType)) {
    user.sheetProgress.set(sheetType, {
      completedProblems: [],
      starredProblems: [],
      notes: new Map(),
      playlists: [],
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      streak: 0,
      forgettingCurve: {
        today: [], day1: [], day3: [], week1: [], week2: [], month1: [], month3: []
      }
    });
    await user.save();
  }
};

// Helper function to update forgetting curve automatically
const updateForgettingCurveLogic = async (user, sheetType = 'apnaCollege') => {
  const now = new Date();
  
  await initializeSheetData(user, sheetType);
  const sheetData = user.sheetProgress.get(sheetType);
  const forgettingCurve = sheetData.forgettingCurve;
  
  // Move problems between lists based on time intervals
  const updates = {
    today: [],
    day1: [],
    day3: [],
    week1: [],
    week2: [],
    month1: [],
    month3: []
  };
  
  // Process today's problems with safety limit
  const todayProblems = (forgettingCurve.today || []).slice(0, 1000); // Limit to 1000 items
  todayProblems.forEach(item => {
    const daysPassed = (now - new Date(item.addedDate)) / (1000 * 60 * 60 * 24);
    if (daysPassed >= 1) {
      updates.day1.push({ problemId: item.problemId, addedDate: item.addedDate });
    } else {
      updates.today.push(item);
    }
  });
  
  // Process day1 problems with safety limit
  const day1Problems = (forgettingCurve.day1 || []).slice(0, 1000); // Limit to 1000 items
  day1Problems.forEach(item => {
    const daysPassed = (now - new Date(item.addedDate)) / (1000 * 60 * 60 * 24);
    if (daysPassed >= 3) {
      updates.day3.push({ problemId: item.problemId, addedDate: item.addedDate });
    } else {
      updates.day1.push(item);
    }
  });
  
  // Process day3 problems
  (forgettingCurve.day3 || []).forEach(item => {
    const daysPassed = (now - new Date(item.addedDate)) / (1000 * 60 * 60 * 24);
    if (daysPassed >= 7) {
      updates.week1.push({ problemId: item.problemId, addedDate: item.addedDate });
    } else {
      updates.day3.push(item);
    }
  });
  
  // Process week1 problems
  (forgettingCurve.week1 || []).forEach(item => {
    const daysPassed = (now - new Date(item.addedDate)) / (1000 * 60 * 60 * 24);
    if (daysPassed >= 14) {
      updates.week2.push({ problemId: item.problemId, addedDate: item.addedDate });
    } else {
      updates.week1.push(item);
    }
  });
  
  // Process week2 problems
  (forgettingCurve.week2 || []).forEach(item => {
    const daysPassed = (now - new Date(item.addedDate)) / (1000 * 60 * 60 * 24);
    if (daysPassed >= 30) {
      updates.month1.push({ problemId: item.problemId, addedDate: item.addedDate });
    } else {
      updates.week2.push(item);
    }
  });
  
  // Process month1 problems
  (forgettingCurve.month1 || []).forEach(item => {
    const daysPassed = (now - new Date(item.addedDate)) / (1000 * 60 * 60 * 24);
    if (daysPassed >= 90) {
      updates.month3.push({ problemId: item.problemId, addedDate: item.addedDate });
    } else {
      updates.month1.push(item);
    }
  });
  
  // Keep month3 problems as they are (final stage)
  updates.month3 = [...updates.month3, ...(forgettingCurve.month3 || [])];
  
  // Update the forgetting curve
  sheetData.forgettingCurve = updates;
  await user.save();
  
  return updates;
};

// Add problem to today's list
router.post('/add', auth, async (req, res) => {
  try {
    const { problemId } = req.body;
    const { sheetType = 'apnaCollege' } = req.query;
    const user = await User.findById(req.user.id);
    
    await initializeSheetData(user, sheetType);
    const sheetData = user.sheetProgress.get(sheetType);
    const forgettingCurve = sheetData.forgettingCurve;
    
    // Check if problem already exists in any list
    const allLists = ['today', 'day1', 'day3', 'week1', 'week2', 'month1', 'month3'];
    const exists = allLists.some(list => 
      forgettingCurve[list] && forgettingCurve[list].some(item => item.problemId === problemId)
    );
    
    if (exists) {
      return res.status(400).json({ message: 'Problem already in forgetting curve' });
    }
    
    // Add to today's list
    forgettingCurve.today.push({ problemId, addedDate: new Date() });
    await user.save();
    
    res.json({ 
      message: 'Problem added to forgetting curve', 
      forgettingCurve: sheetData.forgettingCurve 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update forgetting curve lists (move problems to next stage)
router.post('/update', auth, async (req, res) => {
  try {
    const { sheetType = 'apnaCollege' } = req.query;
    const user = await User.findById(req.user.id);
    
    await initializeSheetData(user, sheetType);
    const updatedCurve = await updateForgettingCurveLogic(user, sheetType);
    
    res.json({ 
      message: 'Forgetting curve updated successfully', 
      forgettingCurve: updatedCurve,
      totalProblems: {
        today: updatedCurve.today.length,
        day1: updatedCurve.day1.length,
        day3: updatedCurve.day3.length,
        week1: updatedCurve.week1.length,
        week2: updatedCurve.week2.length,
        month1: updatedCurve.month1.length,
        month3: updatedCurve.month3.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all forgetting curve data (with auto-update)
router.get('/all', auth, async (req, res) => {
  try {
    const { sheetType = 'apnaCollege' } = req.query;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await initializeSheetData(user, sheetType);
    
    // Auto-update forgetting curve before returning data
    await updateForgettingCurveLogic(user, sheetType);
    
    const sheetData = user.sheetProgress.get(sheetType);
    res.json(sheetData.forgettingCurve);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove problem from forgetting curve
router.delete('/remove/:problemId', auth, async (req, res) => {
  try {
    const { problemId } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    const user = await User.findById(req.user.id);
    
    await initializeSheetData(user, sheetType);
    const sheetData = user.sheetProgress.get(sheetType);
    const forgettingCurve = sheetData.forgettingCurve;
    
    const allLists = ['today', 'day1', 'day3', 'week1', 'week2', 'month1', 'month3'];
    
    let removed = false;
    allLists.forEach(list => {
      if (forgettingCurve[list]) {
        const initialLength = forgettingCurve[list].length;
        forgettingCurve[list] = forgettingCurve[list].filter(item => item.problemId != problemId);
        if (forgettingCurve[list].length < initialLength) {
          removed = true;
        }
      }
    });
    
    if (removed) {
      await user.save();
      res.json({ message: 'Problem removed from forgetting curve', forgettingCurve: sheetData.forgettingCurve });
    } else {
      res.status(404).json({ message: 'Problem not found in forgetting curve' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get problems due for review today
router.get('/due-today', auth, async (req, res) => {
  try {
    const { sheetType = 'apnaCollege' } = req.query;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.json({ dueProblems: [], totalDue: 0 });
    }
    
    await initializeSheetData(user, sheetType);
    
    // Auto-update before getting due problems
    await updateForgettingCurveLogic(user, sheetType);
    
    const now = new Date();
    const dueProblems = [];
    
    // Check all lists for problems that are due for review
    const sheetData = user.sheetProgress.get(sheetType);
    const forgettingCurve = sheetData.forgettingCurve;
    
    // Today's problems are always due
    (forgettingCurve.today || []).forEach(item => {
      dueProblems.push({ ...item, dueType: 'today' });
    });
    
    // Day1 problems (due after 1 day)
    (forgettingCurve.day1 || []).forEach(item => {
      const daysPassed = (now - new Date(item.addedDate)) / (1000 * 60 * 60 * 24);
      if (daysPassed >= 1) {
        dueProblems.push({ ...item, dueType: 'day1' });
      }
    });
    
    // Day3 problems (due after 3 days)
    (forgettingCurve.day3 || []).forEach(item => {
      const daysPassed = (now - new Date(item.addedDate)) / (1000 * 60 * 60 * 24);
      if (daysPassed >= 3) {
        dueProblems.push({ ...item, dueType: 'day3' });
      }
    });
    
    // Continue for other intervals...
    (forgettingCurve.week1 || []).forEach(item => {
      const daysPassed = (now - new Date(item.addedDate)) / (1000 * 60 * 60 * 24);
      if (daysPassed >= 7) {
        dueProblems.push({ ...item, dueType: 'week1' });
      }
    });
    
    (forgettingCurve.week2 || []).forEach(item => {
      const daysPassed = (now - new Date(item.addedDate)) / (1000 * 60 * 60 * 24);
      if (daysPassed >= 14) {
        dueProblems.push({ ...item, dueType: 'week2' });
      }
    });
    
    (forgettingCurve.month1 || []).forEach(item => {
      const daysPassed = (now - new Date(item.addedDate)) / (1000 * 60 * 60 * 24);
      if (daysPassed >= 30) {
        dueProblems.push({ ...item, dueType: 'month1' });
      }
    });
    
    (forgettingCurve.month3 || []).forEach(item => {
      const daysPassed = (now - new Date(item.addedDate)) / (1000 * 60 * 60 * 24);
      if (daysPassed >= 90) {
        dueProblems.push({ ...item, dueType: 'month3' });
      }
    });
    
    res.json({ 
      dueProblems, 
      totalDue: dueProblems.length,
      forgettingCurve: sheetData.forgettingCurve
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;