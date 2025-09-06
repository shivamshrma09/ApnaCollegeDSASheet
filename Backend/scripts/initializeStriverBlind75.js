const mongoose = require('mongoose');
const User = require('../models/User');

const initializeStriverBlind75 = async () => {
  try {
    console.log('🚀 Initializing Striver Blind 75 sheet for all users...');
    
    const users = await User.find({});
    console.log(`👥 Found ${users.length} users`);
    
    let updatedCount = 0;
    
    for (const user of users) {
      if (!user.sheetProgress) {
        user.sheetProgress = new Map();
      }
      
      if (!user.sheetProgress.get('striverBlind75')) {
        user.sheetProgress.set('striverBlind75', {
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
        updatedCount++;
        console.log(`✅ Initialized Striver Blind 75 for user: ${user.email}`);
      }
    }
    
    console.log(`🎉 Successfully initialized Striver Blind 75 for ${updatedCount} users`);
  } catch (error) {
    console.error('❌ Error initializing Striver Blind 75:', error);
  }
};

// Run if called directly
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dsa-sheet')
    .then(() => {
      console.log('📦 Connected to MongoDB');
      return initializeStriverBlind75();
    })
    .then(() => {
      console.log('✨ Initialization complete');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { initializeStriverBlind75 };