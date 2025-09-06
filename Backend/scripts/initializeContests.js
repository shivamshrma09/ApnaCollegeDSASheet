const mongoose = require('mongoose');
const dotenv = require('dotenv');
const contestService = require('../services/contestService');

dotenv.config();

const initializeContests = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Update contests
    console.log('🔄 Fetching real contests from APIs...');
    const contests = await contestService.updateContests();
    
    console.log(`✅ Successfully fetched ${contests.length} real contests`);
    console.log('📊 Contest platforms:', [...new Set(contests.map(c => c.platform))]);
    
    // Display upcoming contests
    const upcoming = await contestService.getUpcomingContests(10);
    console.log('\n🏆 Upcoming Contests:');
    upcoming.forEach(contest => {
      console.log(`  ${contest.platform.toUpperCase()}: ${contest.name}`);
      console.log(`    Start: ${contest.startTime.toLocaleString()}`);
      console.log(`    Duration: ${Math.floor(contest.duration / 3600)}h ${Math.floor((contest.duration % 3600) / 60)}m`);
      console.log(`    URL: ${contest.url}\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing contests:', error);
    process.exit(1);
  }
};

initializeContests();