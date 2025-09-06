require('dotenv').config();
const { sendWeeklyReportEmail, sendWeeklyReportsToAllUsers, generateWeeklyReportHTML } = require('./services/weeklyReportEmailService');
const User = require('./models/User');

const testWeeklyReportEmail = async () => {
  try {
    console.log('📊 Testing Weekly Report Email System...\n');

    // Send to all users
    console.log('📧 Sending weekly reports to all users...');
    const result = await sendWeeklyReportsToAllUsers();
    
    console.log(`\n🎉 Test completed!`);
    console.log(`✅ Emails sent: ${result.successCount}`);
    console.log(`❌ Emails failed: ${result.failCount}`);
    
    // Also test with first user for preview
    const user = await User.findOne().limit(1);
    if (user) {
      console.log('\n📋 Weekly Report Preview URL: http://localhost:5001/api/weekly-report-email/preview/' + user._id);
      console.log('🧪 Test API: http://localhost:5001/api/weekly-report-email/test/' + user._id);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
};

// Connect to database first
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/dsa-sheet')
  .then(() => {
    console.log('✅ MongoDB Connected');
    testWeeklyReportEmail();
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });