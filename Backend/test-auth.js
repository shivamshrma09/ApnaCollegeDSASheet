const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testAuth() {
  console.log('🧪 Testing Auth System...\n');
  
  try {
    // Test server health
    console.log('1. Testing server health...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is running:', health.data);
    
    // Test auth routes
    console.log('\n2. Testing auth routes...');
    const authTest = await axios.get(`${BASE_URL}/auth/test`);
    console.log('✅ Auth routes working:', authTest.data);
    
    // Test simple register
    console.log('\n3. Testing simple register...');
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    try {
      const register = await axios.post(`${BASE_URL}/auth/simple-register`, testUser);
      console.log('✅ Registration successful:', register.data);
      
      // Test simple login
      console.log('\n4. Testing simple login...');
      const login = await axios.post(`${BASE_URL}/auth/simple-login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ Login successful:', login.data);
      
    } catch (regError) {
      if (regError.response?.data?.error === 'User already exists') {
        console.log('ℹ️ User already exists, testing login...');
        
        const login = await axios.post(`${BASE_URL}/auth/simple-login`, {
          email: testUser.email,
          password: testUser.password
        });
        console.log('✅ Login successful:', login.data);
      } else {
        throw regError;
      }
    }
    
    console.log('\n🎉 All auth tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests
testAuth();