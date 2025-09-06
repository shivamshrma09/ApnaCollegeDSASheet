const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/dsa-sheet');
    console.log('✅ Connected to MongoDB');

    const users = await User.find({}).limit(5);
    console.log('📋 Found users:', users.length);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user._id}, Name: ${user.name || 'No name'}, Email: ${user.email || 'No email'}`);
    });

    if (users.length > 0) {
      const firstUser = users[0];
      console.log('\n🔍 Using first user for testing:', firstUser._id);
      
      // Test with first user
      const userId = firstUser._id.toString();
      const problemId = '123';
      const sheetType = 'apnaCollege';

      // Initialize custom spaced repetition if not exists
      if (!firstUser.sheetProgress) {
        firstUser.sheetProgress = {};
      }
      
      if (!firstUser.sheetProgress[sheetType]) {
        firstUser.sheetProgress[sheetType] = {
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
      const customSR = firstUser.sheetProgress[sheetType].customSpacedRepetition;
      
      // Check if problem already exists
      const exists = Object.values(customSR).some(stage => 
        stage.some(item => item.problemId === parseInt(problemId))
      );

      if (!exists) {
        customSR.today.push({
          problemId: parseInt(problemId),
          addedDate: new Date(),
          stageAddedDate: new Date(),
          isChecked: false,
          stage: 'today'
        });

        firstUser.markModified('sheetProgress');
        await firstUser.save();
        
        console.log('✅ Problem added to TODAY list successfully');
      } else {
        console.log('⚠️ Problem already exists in custom spaced repetition');
      }

      console.log('📊 Current TODAY count:', customSR.today.length);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

checkUsers();