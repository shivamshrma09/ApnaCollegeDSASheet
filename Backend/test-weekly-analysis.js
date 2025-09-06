require('dotenv').config();
const mongoose = require('mongoose');
const { sendWeeklyAnalysisToAllUsers } = require('./services/weeklyAnalysisService');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/dsa-sheet')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Test weekly analysis email
const testWeeklyAnalysis = async () => {
  try {
    console.log('🧪 Testing weekly analysis email service...');
    await sendWeeklyAnalysisToAllUsers();
    console.log('✅ Test completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

testWeeklyAnalysis();