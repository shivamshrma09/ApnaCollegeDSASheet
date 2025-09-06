const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Custom Spaced Repetition Stages
const STAGES = {
  TODAY: 'today',
  TOMORROW: 'tomorrow',
  DAY3: 'day3', 
  WEEK1: 'week1',
  WEEK2: 'week2',
  MONTH1: 'month1',
  COMPLETED: 'completed'
};

// Stage progression rules (in days)
const STAGE_INTERVALS = {
  [STAGES.TODAY]: 1,      // Move to tomorrow after 1 day
  [STAGES.TOMORROW]: 3,   // Move to day3 after 3 days (if checked)
  [STAGES.DAY3]: 7,       // Move to week1 after 7 days (if checked)
  [STAGES.WEEK1]: 14,     // Move to week2 after 14 days (if checked)
  [STAGES.WEEK2]: 30,     // Move to month1 after 30 days (if checked)
  [STAGES.MONTH1]: 90     // Move to completed after 90 days (if checked)
};

// Initialize user's custom spaced repetition data
const initializeCustomSR = (user, sheetType) => {
  // Handle both Map and Object formats
  if (!user.sheetProgress) {
    user.sheetProgress = {};
  }
  
  // Convert Map to Object if needed
  if (user.sheetProgress instanceof Map) {
    const mapData = {};
    for (let [key, value] of user.sheetProgress) {
      mapData[key] = value;
    }
    user.sheetProgress = mapData;
  }
  
  if (!user.sheetProgress[sheetType]) {
    user.sheetProgress[sheetType] = {
      completedProblems: [],
      starredProblems: [],
      notes: {},
      customSpacedRepetition: {
        [STAGES.TODAY]: [],
        [STAGES.TOMORROW]: [],
        [STAGES.DAY3]: [],
        [STAGES.WEEK1]: [],
        [STAGES.WEEK2]: [],
        [STAGES.MONTH1]: [],
        [STAGES.COMPLETED]: []
      }
    };
  }
  
  if (!user.sheetProgress[sheetType].customSpacedRepetition) {
    user.sheetProgress[sheetType].customSpacedRepetition = {
      [STAGES.TODAY]: [],
      [STAGES.TOMORROW]: [],
      [STAGES.DAY3]: [],
      [STAGES.WEEK1]: [],
      [STAGES.WEEK2]: [],
      [STAGES.MONTH1]: [],
      [STAGES.COMPLETED]: []
    };
  }
  
  return user.sheetProgress[sheetType];
};

// Add problem to TODAY list when user solves it
router.post('/add-solved', async (req, res) => {
  try {
    const { problemId } = req.body;
    const { sheetType = 'apnaCollege' } = req.query;
    const userId = req.headers.userid || '68ba7187488b0b8b3f463c04';
    
    if (!problemId) {
      return res.status(400).json({ message: 'Problem ID is required' });
    }
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const sheetData = initializeCustomSR(user, sheetType);
    const customSR = sheetData.customSpacedRepetition;
    
    // Check if problem already exists in any stage
    const allStages = Object.values(STAGES);
    const exists = allStages.some(stage => 
      customSR[stage]?.some(item => item.problemId === parseInt(problemId))
    );
    
    if (exists) {
      return res.json({ 
        message: 'Problem already in spaced repetition system',
        stage: 'existing',
        customSpacedRepetition: customSR
      });
    }
    
    // Add to TODAY list
    customSR[STAGES.TODAY].push({
      problemId: parseInt(problemId),
      addedDate: new Date(), // Original solve date
      stageAddedDate: new Date(), // Date when added to current stage
      isChecked: false, // User hasn't checked the retention checkbox yet
      stage: STAGES.TODAY
    });
    
    // Mark as modified for MongoDB
    user.markModified('sheetProgress');
    await user.save();
    
    console.log(`Added problem ${problemId} to TODAY list. Current TODAY count:`, customSR[STAGES.TODAY].length);
    
    res.json({ 
      message: 'Problem added to Today list',
      stage: STAGES.TODAY,
      customSpacedRepetition: customSR
    });
  } catch (error) {
    console.error('Error in custom-spaced-repetition add-solved:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update checkbox status for a problem
router.post('/update-checkbox', async (req, res) => {
  try {
    const { problemId, isChecked } = req.body;
    const { sheetType = 'apnaCollege' } = req.query;
    const userId = req.headers.userid || '68ba7187488b0b8b3f463c04';
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const sheetData = initializeCustomSR(user, sheetType);
    const customSR = sheetData.customSpacedRepetition;
    
    // Find problem in any stage and update checkbox
    let updated = false;
    let foundStage = null;
    
    Object.keys(customSR).forEach(stage => {
      if (customSR[stage] && Array.isArray(customSR[stage])) {
        const problemIndex = customSR[stage].findIndex(item => item.problemId === parseInt(problemId) || item.problemId === problemId.toString());
        if (problemIndex !== -1) {
          customSR[stage][problemIndex].isChecked = isChecked;
          customSR[stage][problemIndex].lastCheckedDate = new Date();
          updated = true;
          foundStage = stage;
          console.log(`Updated checkbox for problem ${problemId} in stage ${stage} to ${isChecked}`);
        }
      }
    });
    
    if (!updated) {
      console.log(`Problem ${problemId} not found. Available problems:`, 
        Object.keys(customSR).map(stage => `${stage}: ${customSR[stage]?.map(p => p.problemId) || []}`));
      return res.status(404).json({ message: 'Problem not found in spaced repetition system' });
    }
    
    // Mark as modified for MongoDB
    user.markModified('sheetProgress');
    await user.save();
    
    res.json({ 
      message: `Checkbox ${isChecked ? 'checked' : 'unchecked'} for problem ${problemId}`,
      customSpacedRepetition: customSR
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Auto-move problems between stages (run daily via cron job)
router.post('/auto-move-stages', async (req, res) => {
  const { simulateTime = false } = req.body; // Test mode to simulate time
  try {
    const { sheetType = 'apnaCollege' } = req.query;
    const userId = req.headers.userid || '68ba7187488b0b8b3f463c04';
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const sheetData = initializeCustomSR(user, sheetType);
    const customSR = sheetData.customSpacedRepetition;
    const now = new Date();
    
    const movements = [];
    
    // TODAY → TOMORROW (automatic after 1 day)
    const todayProblems = [...customSR[STAGES.TODAY]];
    customSR[STAGES.TODAY] = customSR[STAGES.TODAY].filter(item => {
      const daysPassed = (now - new Date(item.addedDate)) / (1000 * 60 * 60 * 24);
      const shouldMove = simulateTime ? true : daysPassed >= 1; // Test mode: always move
      
      if (shouldMove) {
        item.stage = STAGES.TOMORROW;
        item.movedDate = now;
        item.stageAddedDate = now; // Date when added to this stage
        item.isChecked = false; // Reset checkbox when moving to new stage
        customSR[STAGES.TOMORROW].push(item);
        movements.push(`${item.problemId}: TODAY → TOMORROW ${simulateTime ? '(simulated)' : '(1 day passed)'}`);
        return false;
      }
      return true;
    });
    
    // TOMORROW → DAY3 (only if BOTH: 3 days completed AND checkbox checked)
    customSR[STAGES.TOMORROW] = customSR[STAGES.TOMORROW].filter(item => {
      const daysPassed = (now - new Date(item.stageAddedDate || item.addedDate)) / (1000 * 60 * 60 * 24);
      const timeCondition = simulateTime ? true : daysPassed >= 3; // Test mode: always pass time
      
      if (timeCondition && item.isChecked) {
        // Both conditions met: time passed AND checkbox checked
        item.stage = STAGES.DAY3;
        item.movedDate = now;
        item.stageAddedDate = now; // Date when added to DAY3 stage
        item.isChecked = false; // Reset checkbox when moving to new stage
        customSR[STAGES.DAY3].push(item);
        movements.push(`${item.problemId}: TOMORROW → DAY3 ${simulateTime ? '(simulated)' : '(3 days + checked)'}`);
        return false;
      }
      // Stay in TOMORROW if either condition not met
      return true;
    });
    
    // DAY3 → WEEK1 (Special Logic: Auto-move after 7 days for optimal spaced learning)
    customSR[STAGES.DAY3] = customSR[STAGES.DAY3].filter(item => {
      const daysPassed = (now - new Date(item.stageAddedDate || item.addedDate)) / (1000 * 60 * 60 * 24);
      
      const timeCondition = simulateTime ? true : daysPassed >= 7; // Test mode: always pass time
      
      if (timeCondition) {
        // Special case: If 7+ days passed, move regardless of checkbox status
        // This ensures optimal spaced learning (don't keep in DAY3 too long)
        item.stage = STAGES.WEEK1;
        item.movedDate = now;
        item.stageAddedDate = now; // Date when added to WEEK1 stage
        item.isChecked = false; // Reset checkbox when moving to new stage
        customSR[STAGES.WEEK1].push(item);
        
        if (item.isChecked) {
          movements.push(`${item.problemId}: DAY3 → WEEK1 (7 days + checked)`);
        } else {
          movements.push(`${item.problemId}: DAY3 → WEEK1 (7 days auto-move for optimal learning)`);
        }
        return false;
      }
      
      // Stay in DAY3 if less than 7 days
      return true;
    });
    
    // WEEK1 → WEEK2 (only if BOTH: 14 days completed AND checkbox checked)
    customSR[STAGES.WEEK1] = customSR[STAGES.WEEK1].filter(item => {
      const daysPassed = (now - new Date(item.stageAddedDate || item.addedDate)) / (1000 * 60 * 60 * 24);
      if (daysPassed >= 14 && item.isChecked) {
        // Both conditions met: time passed AND checkbox checked
        item.stage = STAGES.WEEK2;
        item.movedDate = now;
        item.stageAddedDate = now; // Date when added to WEEK2 stage
        item.isChecked = false; // Reset checkbox when moving to new stage
        customSR[STAGES.WEEK2].push(item);
        movements.push(`${item.problemId}: WEEK1 → WEEK2 (14 days + checked)`);
        return false;
      }
      // Stay in WEEK1 if either condition not met
      return true;
    });
    
    // WEEK2 → MONTH1 (only if BOTH: 30 days completed AND checkbox checked)
    customSR[STAGES.WEEK2] = customSR[STAGES.WEEK2].filter(item => {
      const daysPassed = (now - new Date(item.stageAddedDate || item.addedDate)) / (1000 * 60 * 60 * 24);
      if (daysPassed >= 30 && item.isChecked) {
        // Both conditions met: time passed AND checkbox checked
        item.stage = STAGES.MONTH1;
        item.movedDate = now;
        item.stageAddedDate = now; // Date when added to MONTH1 stage
        item.isChecked = false; // Reset checkbox when moving to new stage
        customSR[STAGES.MONTH1].push(item);
        movements.push(`${item.problemId}: WEEK2 → MONTH1 (30 days + checked)`);
        return false;
      }
      // Stay in WEEK2 if either condition not met
      return true;
    });
    
    // MONTH1 → COMPLETED (only if BOTH: 90 days completed AND checkbox checked)
    customSR[STAGES.MONTH1] = customSR[STAGES.MONTH1].filter(item => {
      const daysPassed = (now - new Date(item.stageAddedDate || item.addedDate)) / (1000 * 60 * 60 * 24);
      if (daysPassed >= 90 && item.isChecked) {
        // Both conditions met: time passed AND checkbox checked
        item.stage = STAGES.COMPLETED;
        item.movedDate = now;
        item.stageAddedDate = now; // Date when added to COMPLETED stage
        item.completedDate = now; // Final completion date
        customSR[STAGES.COMPLETED].push(item);
        movements.push(`${item.problemId}: MONTH1 → COMPLETED (90 days + checked)`);
        return false;
      }
      // Stay in MONTH1 if either condition not met
      return true;
    });
    
    user.markModified('sheetProgress');
    await user.save();
    
    res.json({
      message: 'Auto-movement completed',
      movements,
      customSpacedRepetition: customSR,
      summary: {
        today: customSR[STAGES.TODAY].length,
        tomorrow: customSR[STAGES.TOMORROW].length,
        day3: customSR[STAGES.DAY3].length,
        week1: customSR[STAGES.WEEK1].length,
        week2: customSR[STAGES.WEEK2].length,
        month1: customSR[STAGES.MONTH1].length,
        completed: customSR[STAGES.COMPLETED].length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all custom spaced repetition data
router.get('/all', async (req, res) => {
  try {
    const { sheetType = 'apnaCollege' } = req.query;
    const userId = req.headers.userid || '68ba7187488b0b8b3f463c04';
    
    const user = await User.findById(userId);
    if (!user) return res.json({ customSpacedRepetition: {} });
    
    const sheetData = initializeCustomSR(user, sheetType);
    
    res.json({
      customSpacedRepetition: sheetData.customSpacedRepetition,
      summary: {
        today: sheetData.customSpacedRepetition[STAGES.TODAY].length,
        tomorrow: sheetData.customSpacedRepetition[STAGES.TOMORROW].length,
        day3: sheetData.customSpacedRepetition[STAGES.DAY3].length,
        week1: sheetData.customSpacedRepetition[STAGES.WEEK1].length,
        week2: sheetData.customSpacedRepetition[STAGES.WEEK2].length,
        month1: sheetData.customSpacedRepetition[STAGES.MONTH1].length,
        completed: sheetData.customSpacedRepetition[STAGES.COMPLETED].length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get problems by stage
router.get('/stage/:stageName', async (req, res) => {
  try {
    const { stageName } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    const userId = req.headers.userid || '68ba7187488b0b8b3f463c04';
    
    if (!Object.values(STAGES).includes(stageName)) {
      return res.status(400).json({ message: 'Invalid stage name' });
    }
    
    const user = await User.findById(userId);
    if (!user) return res.json({ problems: [] });
    
    const sheetData = initializeCustomSR(user, sheetType);
    const problems = sheetData.customSpacedRepetition[stageName] || [];
    
    res.json({
      stage: stageName,
      problems,
      count: problems.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;