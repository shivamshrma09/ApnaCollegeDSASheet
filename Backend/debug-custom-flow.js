const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';
const TEST_USER_ID = '68ba7187488b0b8b3f463c04';

async function debugFlow() {
  console.log('🔍 Debug Custom Spaced Repetition Flow\n');

  try {
    // Step 1: Add problem and immediately check
    console.log('1. Adding problem and checking immediately...');
    
    const testProblemId = `debug-problem-${Date.now()}`;
    const addResponse = await axios.post(`${API_BASE}/custom-spaced-repetition/add-solved`, 
      { problemId: testProblemId },
      { 
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      }
    );
    console.log('✅ Add Response:', JSON.stringify(addResponse.data, null, 2));

    // Step 2: Immediately get all data
    console.log('\n2. Getting all data immediately after add...');
    const allDataResponse = await axios.get(`${API_BASE}/custom-spaced-repetition/all`, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    console.log('✅ All Data Response:', JSON.stringify(allDataResponse.data, null, 2));

    // Step 3: Get TODAY stage specifically
    console.log('\n3. Getting TODAY stage specifically...');
    const todayResponse = await axios.get(`${API_BASE}/custom-spaced-repetition/stage/today`, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    console.log('✅ TODAY Response:', JSON.stringify(todayResponse.data, null, 2));

    // Step 4: Try to update checkbox
    console.log('\n4. Trying to update checkbox...');
    try {
      const checkboxResponse = await axios.post(`${API_BASE}/custom-spaced-repetition/update-checkbox`,
        { problemId: testProblemId, isChecked: true },
        {
          headers: { userid: TEST_USER_ID },
          params: { sheetType: 'apnaCollege' }
        }
      );
      console.log('✅ Checkbox Response:', JSON.stringify(checkboxResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Checkbox Error:', error.response?.data || error.message);
    }

    // Step 5: Check data again after checkbox attempt
    console.log('\n5. Getting all data after checkbox attempt...');
    const finalDataResponse = await axios.get(`${API_BASE}/custom-spaced-repetition/all`, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    console.log('✅ Final Data Response:', JSON.stringify(finalDataResponse.data, null, 2));

  } catch (error) {
    console.error('❌ Debug failed:', error.response?.data || error.message);
  }
}

debugFlow();