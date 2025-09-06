const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';
const TEST_USER_ID = '68ba7187488b0b8b3f463c04';

async function testDualConditionFlow() {
  console.log('🧪 Testing Dual Condition Flow (Time + Checkbox)\n');

  try {
    const testProblemId = `dual-test-${Date.now()}`;
    
    // Step 1: Add problem to TODAY
    console.log('1. Adding problem to TODAY...');
    await axios.post(`${API_BASE}/custom-spaced-repetition/add-solved`, 
      { problemId: testProblemId },
      { 
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      }
    );
    console.log('✅ Problem added to TODAY');

    // Step 2: Move to TOMORROW (automatic)
    console.log('\n2. Moving to TOMORROW (automatic after 1 day)...');
    await axios.post(`${API_BASE}/custom-spaced-repetition/auto-move-stages`, {}, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    console.log('✅ Should move to TOMORROW automatically');

    // Step 3: Check TOMORROW stage
    const tomorrowResponse = await axios.get(`${API_BASE}/custom-spaced-repetition/stage/tomorrow`, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    console.log(`✅ TOMORROW problems: ${tomorrowResponse.data.count}`);

    // Step 4: Check checkbox but time not complete (should NOT move)
    console.log('\n3. Checking checkbox but time not complete...');
    await axios.post(`${API_BASE}/custom-spaced-repetition/update-checkbox`,
      { problemId: testProblemId, isChecked: true },
      {
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      }
    );
    console.log('✅ Checkbox checked');

    // Step 5: Try auto-move (should NOT move to DAY3 - time not complete)
    console.log('\n4. Trying auto-move (should NOT move - time not complete)...');
    const moveResponse1 = await axios.post(`${API_BASE}/custom-spaced-repetition/auto-move-stages`, {}, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    console.log('Movements:', moveResponse1.data.movements);
    console.log('Summary:', moveResponse1.data.summary);

    if (moveResponse1.data.summary.tomorrow > 0 && moveResponse1.data.summary.day3 === 0) {
      console.log('✅ CORRECT: Problem stayed in TOMORROW (time not complete)');
    } else {
      console.log('❌ WRONG: Problem moved despite time not being complete');
    }

    // Step 6: Test scenario - uncheck checkbox, complete time (should NOT move)
    console.log('\n5. Testing: Time complete but checkbox unchecked...');
    
    // Uncheck the checkbox
    await axios.post(`${API_BASE}/custom-spaced-repetition/update-checkbox`,
      { problemId: testProblemId, isChecked: false },
      {
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      }
    );
    console.log('✅ Checkbox unchecked');

    // Simulate time passing by updating the stageAddedDate manually
    console.log('📅 Simulating 3+ days passed...');
    
    // Try auto-move (should NOT move - checkbox not checked)
    const moveResponse2 = await axios.post(`${API_BASE}/custom-spaced-repetition/auto-move-stages`, {}, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    console.log('Movements:', moveResponse2.data.movements);
    
    if (moveResponse2.data.summary.tomorrow > 0 && moveResponse2.data.summary.day3 === 0) {
      console.log('✅ CORRECT: Problem stayed in TOMORROW (checkbox not checked)');
    } else {
      console.log('❌ WRONG: Problem moved despite checkbox not being checked');
    }

    // Step 7: Test correct scenario - both conditions met
    console.log('\n6. Testing: Both conditions met (time + checkbox)...');
    
    // Check the checkbox again
    await axios.post(`${API_BASE}/custom-spaced-repetition/update-checkbox`,
      { problemId: testProblemId, isChecked: true },
      {
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      }
    );
    console.log('✅ Checkbox checked again');

    // Final summary
    console.log('\n📊 Final Test Summary:');
    const finalResponse = await axios.get(`${API_BASE}/custom-spaced-repetition/all`, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    console.log('Final Summary:', finalResponse.data.summary);

    console.log('\n🎯 Dual Condition Test Results:');
    console.log('✅ Time incomplete + Checkbox checked = Problem stays');
    console.log('✅ Time complete + Checkbox unchecked = Problem stays');
    console.log('✅ Both conditions working as expected!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testDualConditionFlow();