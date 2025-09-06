const axios = require('axios');
const mongoose = require('mongoose');

async function testSetup() {
  console.log('🧪 Testing DSA Sheet Setup...\n');
  
  // Test 1: MongoDB Connection
  console.log('1. Testing MongoDB Connection...');
  try {
    await mongoose.connect('mongodb://localhost:27017/dsa-sheet', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connection successful');
    await mongoose.disconnect();
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
  }
  
  // Test 2: Backend API Health
  console.log('\n2. Testing Backend API...');
  try {
    const response = await axios.get('http://localhost:5001/api/health', {
      timeout: 5000
    });
    console.log('✅ Backend API is running:', response.data);
  } catch (error) {
    console.log('❌ Backend API test failed:', error.message);
    console.log('   Make sure to run: cd Backend && npm start');
  }
  
  // Test 3: Frontend Server
  console.log('\n3. Testing Frontend Server...');
  try {
    const response = await axios.get('http://localhost:5173', {
      timeout: 5000
    });
    console.log('✅ Frontend server is running');
  } catch (error) {
    console.log('❌ Frontend server test failed:', error.message);
    console.log('   Make sure to run: cd frontend && npm run dev');
  }
  
  console.log('\n🎉 Setup test completed!');
  console.log('\nNext steps:');
  console.log('1. If MongoDB failed, install and start MongoDB');
  console.log('2. If Backend failed, run: cd Backend && npm start');
  console.log('3. If Frontend failed, run: cd frontend && npm run dev');
  console.log('4. Open http://localhost:5173 in your browser');
}

testSetup().catch(console.error);