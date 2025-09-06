const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API connection...');
    const response = await axios.get('http://localhost:5000/api/mentorship');
    console.log(`✅ API working! Found ${response.data.length} mentors`);
    
    // Show first mentor as example
    if (response.data.length > 0) {
      const mentor = response.data[0];
      console.log(`\n📋 Sample mentor:`);
      console.log(`Name: ${mentor.name}`);
      console.log(`Company: ${mentor.company}`);
      console.log(`Category: ${mentor.category}`);
      console.log(`Price: ₹${mentor.price}`);
    }
  } catch (error) {
    console.log('❌ API Error:', error.message);
    console.log('\n🔧 Solutions:');
    console.log('1. Make sure backend server is running: npm start');
    console.log('2. Check if MongoDB is connected');
    console.log('3. Verify port 5000 is not blocked');
  }
}

testAPI();