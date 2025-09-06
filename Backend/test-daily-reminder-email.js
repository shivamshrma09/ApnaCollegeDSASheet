require('dotenv').config();
const { sendEveningReminder, sendNightReminder } = require('./services/dailyReminderEmailService');
const User = require('./models/User');

const testDailyReminderEmails = async () => {
  try {
    console.log('🎯 Testing Daily Reminder Email System...\n');

    // Find a test user
    const user = await User.findOne().limit(1);
    if (!user) {
      console.log('❌ No users found in database');
      return;
    }

    console.log(`📧 Testing with user: ${user.name} (${user.email})`);
    
    // Test evening reminder
    console.log('\n🌆 Testing Evening Reminder (5 PM)...');
    const eveningSuccess = await sendEveningReminder(user);
    
    if (eveningSuccess) {
      console.log('✅ Evening reminder sent successfully!');
    } else {
      console.log('❌ Failed to send evening reminder');
    }

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test night reminder
    console.log('\n🌙 Testing Night Reminder (11 PM)...');
    const nightSuccess = await sendNightReminder(user);
    
    if (nightSuccess) {
      console.log('✅ Night reminder sent successfully!');
    } else {
      console.log('❌ Failed to send night reminder');
    }

    console.log('\n🎉 Test completed!');
    console.log('\n📋 Preview URLs:');
    console.log('Evening: http://localhost:5001/api/daily-reminder-email/preview-evening/' + user._id);
    console.log('Night: http://localhost:5001/api/daily-reminder-email/preview-night/' + user._id);
    console.log('\n🧪 Test APIs:');
    console.log('Evening: http://localhost:5001/api/daily-reminder-email/test-evening/' + user._id);
    console.log('Night: http://localhost:5001/api/daily-reminder-email/test-night/' + user._id);

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
    testDailyReminderEmails();
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });