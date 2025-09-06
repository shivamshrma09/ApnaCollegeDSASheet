require('dotenv').config();
const mongoose = require('mongoose');
const { sendDailyEmailsToAllUsers } = require('./services/dailyEmailService');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/dsa-sheet')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Test daily email
const testDailyEmail = async () => {
  try {
    console.log('🧪 Testing daily email service...');
    await sendDailyEmailsToAllUsers();
    console.log('✅ Test completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

testDailyEmail();