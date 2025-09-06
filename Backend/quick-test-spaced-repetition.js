// Quick Manual Test for Spaced Repetition
const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';
const TEST_USER_ID = '68ba7187488b0b8b3f463c04';

async function quickTest() {
  console.log('🧠 Quick Spaced Repetition Test\n');

  try {
    // 1. Add a problem
    console.log('1. Adding test problem...');
    const addResponse = await axios.post(`${API_BASE}/spaced-repetition/add`, 
      { problemId: 'quick-test-problem' },
      { 
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      }
    );
    console.log('✓ Problem added:', addResponse.data.message);

    // 2. Get due problems
    console.log('\n2. Getting due problems...');
    const dueResponse = await axios.get(`${API_BASE}/spaced-repetition/due`, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    console.log('✓ Due problems:', dueResponse.data.length);

    // 3. Review the problem
    if (dueResponse.data.length > 0) {
      console.log('\n3. Reviewing first problem with quality 4...');
      const reviewResponse = await axios.post(`${API_BASE}/spaced-repetition/review`,
        { problemId: dueResponse.data[0].problemId, quality: 4 },
        {
          headers: { userid: TEST_USER_ID },
          params: { sheetType: 'apnaCollege' }
        }
      );
      console.log('✓ Review completed:', reviewResponse.data.message);
      console.log('  Next review:', reviewResponse.data.nextReviewDate);
      console.log('  Interval:', reviewResponse.data.nextInterval);
    }

    // 4. Get all data
    console.log('\n4. Getting all spaced repetition data...');
    const allResponse = await axios.get(`${API_BASE}/spaced-repetition/all`, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    console.log('✓ Total problems in system:', allResponse.data.length);

    console.log('\n🎉 Quick test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

quickTest();