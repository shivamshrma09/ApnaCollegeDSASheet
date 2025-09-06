const mongoose = require('mongoose');
const User = require('./models/User');

// Test script for auto custom spaced repetition
async function testAutoCustomSR() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/dsa-sheet');
    console.log('✅ Connected to MongoDB');

    const userId = '68ba7187488b0b8b3f463c04';
    const problemId = '123';
    const sheetType = 'apnaCollege';

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:', user.name);

    // Initialize custom spaced repetition if not exists
    if (!user.sheetProgress) {
      user.sheetProgress = {};
    }
    
    if (!user.sheetProgress[sheetType]) {
      user.sheetProgress[sheetType] = {
        completedProblems: [],
        starredProblems: [],
        notes: {},
        customSpacedRepetition: {
          today: [],
          tomorrow: [],
          day3: [],
          week1: [],
          week2: [],
          month1: [],
          completed: []
        }
      };
    }

    // Add problem to TODAY list
    const customSR = user.sheetProgress[sheetType].customSpacedRepetition;
    
    // Check if problem already exists
    const exists = Object.values(customSR).some(stage => 
      stage.some(item => item.problemId === parseInt(problemId))
    );

    if (exists) {
      console.log('⚠️ Problem already exists in custom spaced repetition');
    } else {
      customSR.today.push({
        problemId: parseInt(problemId),
        addedDate: new Date(),
        stageAddedDate: new Date(),
        isChecked: false,
        stage: 'today'
      });

      user.markModified('sheetProgress');
      await user.save();
      
      console.log('✅ Problem added to TODAY list successfully');
      console.log('📊 Current TODAY count:', customSR.today.length);
    }

    // Display current state
    console.log('\n📋 Current Custom Spaced Repetition State:');
    console.log('TODAY:', customSR.today.length);
    console.log('TOMORROW:', customSR.tomorrow.length);
    console.log('DAY3:', customSR.day3.length);
    console.log('WEEK1:', customSR.week1.length);
    console.log('WEEK2:', customSR.week2.length);
    console.log('MONTH1:', customSR.month1.length);
    console.log('COMPLETED:', customSR.completed.length);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

testAutoCustomSR();