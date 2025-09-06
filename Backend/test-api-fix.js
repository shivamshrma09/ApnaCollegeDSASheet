const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';
const TEST_USER_ID = '68bae51f3c214db99da97a5b';
const TEST_PROBLEM_ID = 1;

async function testAPIs() {
  console.log('🧪 Testing API fixes...\n');

  try {
    // Test 1: Custom Spaced Repetition - Add Solved
    console.log('1️⃣ Testing custom-spaced-repetition/add-solved...');
    const srResponse = await axios.post(
      `${API_BASE}/custom-spaced-repetition/add-solved?sheetType=apnaCollege`,
      { problemId: TEST_PROBLEM_ID },
      { headers: { userid: TEST_USER_ID } }
    );
    console.log('✅ Custom SR add-solved:', srResponse.status, srResponse.data.message);

    // Test 2: Progress - Toggle Complete
    console.log('\n2️⃣ Testing progress complete toggle...');
    const progressResponse = await axios.post(
      `${API_BASE}/progress/${TEST_USER_ID}/complete/${TEST_PROBLEM_ID}?sheetType=apnaCollege`,
      {}
    );
    console.log('✅ Progress toggle:', progressResponse.status, 'Completed count:', progressResponse.data.completedProblems?.length);

    // Test 3: Progress - Toggle Star
    console.log('\n3️⃣ Testing progress star toggle...');
    const starResponse = await axios.post(
      `${API_BASE}/progress/${TEST_USER_ID}/star/${TEST_PROBLEM_ID}?sheetType=apnaCollege`,
      {}
    );
    console.log('✅ Star toggle:', starResponse.status, 'Starred count:', starResponse.data.starredProblems?.length);

    // Test 4: Get Progress
    console.log('\n4️⃣ Testing get progress...');
    const getResponse = await axios.get(
      `${API_BASE}/progress/${TEST_USER_ID}?sheetType=apnaCollege`
    );
    console.log('✅ Get progress:', getResponse.status, 'Data keys:', Object.keys(getResponse.data));

    console.log('\n🎉 All API tests passed! The fixes are working.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.status, error.response?.data || error.message);
  }
}

// Run tests
testAPIs();