const cron = require('node-cron');
const User = require('../models/User');

// Daily auto-movement for custom spaced repetition
const setupSpacedRepetitionCron = () => {
  // Run every day at 12:01 AM
  cron.schedule('1 0 * * *', async () => {
    console.log('🕛 Running daily spaced repetition auto-movement...');
    
    try {
      // Get all users who have custom spaced repetition data
      const users = await User.find({
        'sheetProgress': { $exists: true }
      });

      let totalMovements = 0;
      let processedUsers = 0;

      for (const user of users) {
        try {
          let userMovements = 0;
          
          // Process each sheet type for the user
          if (user.sheetProgress) {
            const sheetTypes = Object.keys(user.sheetProgress);
            
            for (const sheetType of sheetTypes) {
              const sheetData = user.sheetProgress[sheetType];
              
              if (sheetData && sheetData.customSpacedRepetition) {
                const customSR = sheetData.customSpacedRepetition;
                const now = new Date();
                
                // TODAY → TOMORROW (automatic after 1 day)
                if (customSR.today && customSR.today.length > 0) {
                  customSR.today = customSR.today.filter(item => {
                    const daysPassed = (now - new Date(item.addedDate)) / (1000 * 60 * 60 * 24);
                    if (daysPassed >= 1) {
                      item.stage = 'tomorrow';
                      item.movedDate = now;
                      item.stageAddedDate = now;
                      item.isChecked = false;
                      
                      if (!customSR.tomorrow) customSR.tomorrow = [];
                      customSR.tomorrow.push(item);
                      userMovements++;
                      return false;
                    }
                    return true;
                  });
                }
                
                // TOMORROW → DAY3 (only if checked after 3 days)
                if (customSR.tomorrow && customSR.tomorrow.length > 0) {
                  customSR.tomorrow = customSR.tomorrow.filter(item => {
                    const daysPassed = (now - new Date(item.stageAddedDate || item.addedDate)) / (1000 * 60 * 60 * 24);
                    if (daysPassed >= 3 && item.isChecked) {
                      item.stage = 'day3';
                      item.movedDate = now;
                      item.stageAddedDate = now;
                      item.isChecked = false;
                      
                      if (!customSR.day3) customSR.day3 = [];
                      customSR.day3.push(item);
                      userMovements++;
                      return false;
                    }
                    return true;
                  });
                }
                
                // DAY3 → WEEK1 (auto-move after 7 days)
                if (customSR.day3 && customSR.day3.length > 0) {
                  customSR.day3 = customSR.day3.filter(item => {
                    const daysPassed = (now - new Date(item.stageAddedDate || item.addedDate)) / (1000 * 60 * 60 * 24);
                    if (daysPassed >= 7) {
                      item.stage = 'week1';
                      item.movedDate = now;
                      item.stageAddedDate = now;
                      item.isChecked = false;
                      
                      if (!customSR.week1) customSR.week1 = [];
                      customSR.week1.push(item);
                      userMovements++;
                      return false;
                    }
                    return true;
                  });
                }
                
                // WEEK1 → WEEK2 (only if checked after 14 days)
                if (customSR.week1 && customSR.week1.length > 0) {
                  customSR.week1 = customSR.week1.filter(item => {
                    const daysPassed = (now - new Date(item.stageAddedDate || item.addedDate)) / (1000 * 60 * 60 * 24);
                    if (daysPassed >= 14 && item.isChecked) {
                      item.stage = 'week2';
                      item.movedDate = now;
                      item.stageAddedDate = now;
                      item.isChecked = false;
                      
                      if (!customSR.week2) customSR.week2 = [];
                      customSR.week2.push(item);
                      userMovements++;
                      return false;
                    }
                    return true;
                  });
                }
                
                // WEEK2 → MONTH1 (only if checked after 30 days)
                if (customSR.week2 && customSR.week2.length > 0) {
                  customSR.week2 = customSR.week2.filter(item => {
                    const daysPassed = (now - new Date(item.stageAddedDate || item.addedDate)) / (1000 * 60 * 60 * 24);
                    if (daysPassed >= 30 && item.isChecked) {
                      item.stage = 'month1';
                      item.movedDate = now;
                      item.stageAddedDate = now;
                      item.isChecked = false;
                      
                      if (!customSR.month1) customSR.month1 = [];
                      customSR.month1.push(item);
                      userMovements++;
                      return false;
                    }
                    return true;
                  });
                }
                
                // MONTH1 → COMPLETED (only if checked after 90 days)
                if (customSR.month1 && customSR.month1.length > 0) {
                  customSR.month1 = customSR.month1.filter(item => {
                    const daysPassed = (now - new Date(item.stageAddedDate || item.addedDate)) / (1000 * 60 * 60 * 24);
                    if (daysPassed >= 90 && item.isChecked) {
                      item.stage = 'completed';
                      item.movedDate = now;
                      item.stageAddedDate = now;
                      item.completedDate = now;
                      
                      if (!customSR.completed) customSR.completed = [];
                      customSR.completed.push(item);
                      userMovements++;
                      return false;
                    }
                    return true;
                  });
                }
              }
            }
          }
          
          // Save user if there were movements
          if (userMovements > 0) {
            user.markModified('sheetProgress');
            await user.save();
            totalMovements += userMovements;
            processedUsers++;
          }
          
        } catch (userError) {
          console.error(`❌ Error processing user ${user._id}:`, userError.message);
        }
      }
      
      console.log(`🎉 Spaced repetition cron completed: ${totalMovements} movements, ${processedUsers} users processed`);
      
    } catch (error) {
      console.error('❌ Spaced repetition cron job failed:', error);
    }
  });

  console.log('⏰ Spaced repetition cron job scheduled (daily at 12:01 AM)');
};

module.exports = { setupSpacedRepetitionCron };