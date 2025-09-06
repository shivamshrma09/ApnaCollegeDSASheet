const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/dsa-sheet');
    console.log('Connected to MongoDB');
    
    const users = await User.find({}, { _id: 1, name: 1, email: 1 });
    console.log('\n📋 ALL USERS:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user._id} | Name: ${user.name} | Email: ${user.email}`);
    });
    
    if (users.length > 0) {
      const firstUser = users[0];
      console.log(`\n🔍 Using first user: ${firstUser._id}`);
      
      // Check their sheet progress
      const fullUser = await User.findById(firstUser._id);
      console.log('\n📊 SHEET PROGRESS DATA:');
      
      if (fullUser.sheetProgress) {
        Object.keys(fullUser.sheetProgress).forEach(sheetType => {
          console.log(`\n${sheetType}:`);
          const sheetData = fullUser.sheetProgress[sheetType];
          if (sheetData.customSpacedRepetition) {
            Object.keys(sheetData.customSpacedRepetition).forEach(stage => {
              const count = sheetData.customSpacedRepetition[stage]?.length || 0;
              console.log(`  ${stage}: ${count} problems`);
            });
          } else {
            console.log('  No custom spaced repetition data');
          }
        });
      } else {
        console.log('No sheet progress data');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkUsers();