const User = require('../models/User');
const mongoose = require('mongoose');

// Initialize all sheet types for existing users
const initializeAllSheets = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dsa-sheet');
    
    const sheetTypes = [
      'apnaCollege',
      'loveBabbar', 
      'striverA2Z',
      'striverSDE',
      'striver79',
      'blind75',
      'striverCP'
    ];

    const users = await User.find({});
    console.log(`Found ${users.length} users to initialize`);

    for (const user of users) {
      let updated = false;
      
      if (!user.sheetProgress) {
        user.sheetProgress = new Map();
        updated = true;
      }

      for (const sheetType of sheetTypes) {
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
          updated = true;
          console.log(`✅ Initialized ${sheetType} for user ${user.name}`);
        }
      }

      if (updated) {
        await user.save();
      }
    }

    console.log('🎉 All users initialized with all sheet types!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

initializeAllSheets();