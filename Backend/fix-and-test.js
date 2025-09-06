const mongoose = require('mongoose');
const User = require('./models/User');

async function fixAndTest() {
  try {
    await mongoose.connect('mongodb://localhost:27017/dsa-sheet');
    console.log('✅ Connected to MongoDB');

    const users = await User.find({}).limit(1);
    if (users.length === 0) {
      console.log('❌ No users found');
      return;
    }

    const user = users[0];
    console.log('🔍 Testing with user:', user.name, user._id);
    
    const problemId = '123';
    const sheetType = 'apnaCollege';

    // Initialize sheetProgress properly
    if (!user.sheetProgress) {
      user.sheetProgress = new Map();
    }

    // Convert Map to Object if needed
    if (user.sheetProgress instanceof Map) {
      const mapData = {};
      for (let [key, value] of user.sheetProgress) {
        mapData[key] = value;
      }
      user.sheetProgress = mapData;
    }

    // Initialize sheet data
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

    // Ensure customSpacedRepetition exists
    if (!user.sheetProgress[sheetType].customSpacedRepetition) {
      user.sheetProgress[sheetType].customSpacedRepetition = {
        today: [],
        tomorrow: [],
        day3: [],
        week1: [],
        week2: [],
        month1: [],
        completed: []
      };
    }

    const customSR = user.sheetProgress[sheetType].customSpacedRepetition;
    
    // Check if problem already exists
    let exists = false;
    const stages = ['today', 'tomorrow', 'day3', 'week1', 'week2', 'month1', 'completed'];
    
    for (const stage of stages) {
      if (customSR[stage] && Array.isArray(customSR[stage])) {
        exists = customSR[stage].some(item => item.problemId === parseInt(problemId));
        if (exists) break;
      }
    }

    if (!exists) {
      // Ensure today array exists
      if (!customSR.today) {
        customSR.today = [];
      }

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
    } else {
      console.log('⚠️ Problem already exists in custom spaced repetition');
    }

    // Display current state
    console.log('\n📋 Current Custom Spaced Repetition State:');
    console.log('TODAY:', customSR.today?.length || 0);
    console.log('TOMORROW:', customSR.tomorrow?.length || 0);
    console.log('DAY3:', customSR.day3?.length || 0);
    console.log('WEEK1:', customSR.week1?.length || 0);
    console.log('WEEK2:', customSR.week2?.length || 0);
    console.log('MONTH1:', customSR.month1?.length || 0);
    console.log('COMPLETED:', customSR.completed?.length || 0);

    console.log('\n🎯 Auto Custom Spaced Repetition System is working!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

fixAndTest();