const { emailCertificate } = require('./services/certificateService');
require('dotenv').config();

// Test certificate email function
async function testCertificateEmail() {
  try {
    console.log('🚀 Testing certificate email...');
    
    const sheetType = 'apnaCollege';
    
    // Mock user in database for testing
    const User = require('./models/User');
    
    // Find existing user by email
    let testUser = await User.findOne({ email: 'shivamsharma27107@gmail.com' });
    
    if (testUser) {
      // Update existing user with test data
      testUser.sheetProgress = testUser.sheetProgress || {};
      testUser.sheetProgress.apnaCollege = {
        completedProblems: Array.from({length: 300}, (_, i) => i + 1),
        easySolved: 100,
        mediumSolved: 150,
        hardSolved: 50,
        streak: 25
      };
      await testUser.save();
    } else {
      console.log('❌ User not found');
      return;
    }

    
    console.log('✅ Test user created/updated');
    console.log('📧 Sending certificate email...');
    
    const result = await emailCertificate(testUser._id, sheetType);
    
    console.log('🎉 Success:', result.message);
    console.log('📋 Certificate ID:', result.certificateId);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Connect to database and run test
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dsa-sheet')
  .then(() => {
    console.log('📊 Connected to MongoDB');
    return testCertificateEmail();
  })
  .then(() => {
    console.log('✅ Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });