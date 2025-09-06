const mongoose = require('mongoose');
const User = require('./models/User');

async function populateSpacedRepetition() {
  try {
    await mongoose.connect('mongodb://localhost:27017/dsa-sheet');
    console.log('Connected to MongoDB');
    
    const userId = '68ba7187488b0b8b3f463c04';
    const user = await User.findById(userId);
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User found:', user.name);
    
    // Get apnaCollege sheet data
    const sheetData = user.sheetProgress?.get?.('apnaCollege') || user.sheetProgress?.['apnaCollege'] || {};
    console.log('Completed problems:', sheetData.completedProblems);
    
    if (sheetData.completedProblems && sheetData.completedProblems.length > 0) {
      if (!sheetData.spacedRepetition) sheetData.spacedRepetition = [];
      
      // Clear existing spaced repetition
      sheetData.spacedRepetition = [];
      
      // Add each completed problem to spaced repetition with different intervals
      sheetData.completedProblems.forEach((problemId, index) => {
        const intervals = [0, 1, 3, 7, 14, 30]; // today, tomorrow, 3 days, 1 week, 2 weeks, 1 month
        const intervalDays = intervals[index % intervals.length];
        
        sheetData.spacedRepetition.push({
          problemId: problemId.toString(),
          nextReviewDate: new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000),
          interval: intervalDays || 1,
          repetitions: 0,
          easeFactor: 2.5,
          quality: 3,
          lastReviewDate: new Date()
        });
      });
      
      console.log('Added spaced repetition entries:', sheetData.spacedRepetition.length);
      
      // Save using Object format (MongoDB doesn't save Maps properly)
      if (!user.sheetProgress) user.sheetProgress = {};
      user.sheetProgress['apnaCollege'] = sheetData;
      user.markModified('sheetProgress');
      
      await user.save();
      console.log('✅ Spaced repetition data populated successfully!');
      
      // Verify the data
      const updatedUser = await User.findById(userId);
      const updatedSheetData = updatedUser.sheetProgress?.get?.('apnaCollege') || updatedUser.sheetProgress?.['apnaCollege'] || {};
      console.log('Verification - Spaced repetition count:', updatedSheetData.spacedRepetition?.length || 0);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

populateSpacedRepetition();