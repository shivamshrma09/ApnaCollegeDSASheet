const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';
const TEST_USER_ID = '68ba7187488b0b8b3f463c04';

async function debugStageMovement() {
  console.log('🔍 Debug Stage Movement Flow\n');

  try {
    const testProblemId = `debug-stage-${Date.now()}`;
    
    // Step 1: Add problem
    console.log('1. Adding problem...');
    const addResponse = await axios.post(`${API_BASE}/custom-spaced-repetition/add-solved`, 
      { problemId: testProblemId },
      { 
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      }
    );
    console.log('Add Response:', addResponse.data.message);
    console.log('TODAY count:', addResponse.data.customSpacedRepetition.today.length);

    // Step 2: Check all data
    console.log('\n2. Checking all data after add...');
    const allData1 = await axios.get(`${API_BASE}/custom-spaced-repetition/all`, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    console.log('Summary after add:', allData1.data.summary);

    // Step 3: Try auto-move (TODAY → TOMORROW)
    console.log('\n3. Trying auto-move (TODAY → TOMORROW)...');
    const moveResponse1 = await axios.post(`${API_BASE}/custom-spaced-repetition/auto-move-stages`, 
      { simulateTime: true }, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    console.log('Movements:', moveResponse1.data.movements);
    console.log('Summary after move:', moveResponse1.data.summary);

    // Step 4: Check TOMORROW stage specifically
    console.log('\n4. Checking TOMORROW stage...');
    const tomorrowData = await axios.get(`${API_BASE}/custom-spaced-repetition/stage/tomorrow`, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    console.log('TOMORROW problems:', tomorrowData.data.problems);

    // Step 5: Check checkbox and try move to DAY3
    if (tomorrowData.data.count > 0) {
      console.log('\n5. Checking checkbox for TOMORROW → DAY3...');
      await axios.post(`${API_BASE}/custom-spaced-repetition/update-checkbox`,
        { problemId: testProblemId, isChecked: true },
        {
          headers: { userid: TEST_USER_ID },
          params: { sheetType: 'apnaCollege' }
        }
      );
      console.log('✅ Checkbox checked');

      // Try move to DAY3
      console.log('\n6. Trying move TOMORROW → DAY3...');
      const moveResponse2 = await axios.post(`${API_BASE}/custom-spaced-repetition/auto-move-stages`, 
        { simulateTime: true }, {
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      });
      console.log('Movements:', moveResponse2.data.movements);
      console.log('Summary after DAY3 move:', moveResponse2.data.summary);

      // Check DAY3 stage
      const day3Data = await axios.get(`${API_BASE}/custom-spaced-repetition/stage/day3`, {
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      });
      console.log('DAY3 problems:', day3Data.data.problems);
    }

    console.log('\n📊 Debug Complete - Check where the flow is breaking!');

  } catch (error) {
    console.error('❌ Debug failed:', error.response?.data || error.message);
  }
}

debugStageMovement();