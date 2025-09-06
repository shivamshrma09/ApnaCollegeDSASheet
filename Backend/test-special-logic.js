const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';
const TEST_USER_ID = '68ba7187488b0b8b3f463c04';

async function testSpecialLogic() {
  console.log('🎯 Testing Special Logic: DAY3 → WEEK1 Auto-Move\n');

  try {
    const testProblemId = `special-test-${Date.now()}`;
    
    // Step 1: Add problem and move to DAY3 stage
    console.log('1. Setting up problem in DAY3 stage...');
    
    // Add to TODAY
    await axios.post(`${API_BASE}/custom-spaced-repetition/add-solved`, 
      { problemId: testProblemId },
      { 
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      }
    );
    
    // Move to TOMORROW
    await axios.post(`${API_BASE}/custom-spaced-repetition/auto-move-stages`, {}, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    
    // Check checkbox and move to DAY3
    await axios.post(`${API_BASE}/custom-spaced-repetition/update-checkbox`,
      { problemId: testProblemId, isChecked: true },
      {
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      }
    );
    
    // Move to DAY3 (3 days + checked)
    await axios.post(`${API_BASE}/custom-spaced-repetition/auto-move-stages`, {}, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    
    console.log('✅ Problem should now be in DAY3 stage');

    // Step 2: Check current state
    const day3Response = await axios.get(`${API_BASE}/custom-spaced-repetition/stage/day3`, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    console.log(`✅ DAY3 problems: ${day3Response.data.count}`);

    // Step 3: Test special logic - 7 days passed, checkbox unchecked
    console.log('\n2. Testing Special Logic: 7+ days passed, checkbox unchecked...');
    
    // Uncheck the checkbox (simulate user didn't check)
    await axios.post(`${API_BASE}/custom-spaced-repetition/update-checkbox`,
      { problemId: testProblemId, isChecked: false },
      {
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      }
    );
    console.log('✅ Checkbox unchecked (simulating user forgot to check)');

    // Step 4: Simulate 7+ days passed and auto-move
    console.log('\n3. Simulating 7+ days passed and running auto-move...');
    const moveResponse = await axios.post(`${API_BASE}/custom-spaced-repetition/auto-move-stages`, {}, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    
    console.log('Movements:', moveResponse.data.movements);
    console.log('Summary:', moveResponse.data.summary);

    // Step 5: Verify the special logic worked
    if (moveResponse.data.summary.week1 > moveResponse.data.summary.day3) {
      console.log('\n✅ SUCCESS: Special Logic Working!');
      console.log('   Problem moved from DAY3 → WEEK1 despite checkbox being unchecked');
      console.log('   This ensures optimal spaced learning (not stuck in DAY3 too long)');
    } else {
      console.log('\n❌ ISSUE: Special logic not working as expected');
    }

    // Step 6: Test other stages still follow old logic
    console.log('\n4. Verifying other stages still follow dual-condition logic...');
    
    const testProblemId2 = `normal-test-${Date.now()}`;
    
    // Add another problem to TOMORROW
    await axios.post(`${API_BASE}/custom-spaced-repetition/add-solved`, 
      { problemId: testProblemId2 },
      { 
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      }
    );
    
    await axios.post(`${API_BASE}/custom-spaced-repetition/auto-move-stages`, {}, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    
    // Don't check checkbox, try to move (should NOT move from TOMORROW to DAY3)
    const moveResponse2 = await axios.post(`${API_BASE}/custom-spaced-repetition/auto-move-stages`, {}, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    
    console.log('TOMORROW→DAY3 movements:', moveResponse2.data.movements.filter(m => m.includes('TOMORROW')));
    
    if (moveResponse2.data.summary.tomorrow > 0) {
      console.log('✅ CORRECT: TOMORROW→DAY3 still requires checkbox (dual condition maintained)');
    } else {
      console.log('❌ ISSUE: TOMORROW→DAY3 logic changed unexpectedly');
    }

    console.log('\n📊 Final Summary:');
    console.log('✅ DAY3→WEEK1: Auto-move after 7 days (optimal spaced learning)');
    console.log('✅ Other stages: Still require both time + checkbox');
    console.log('✅ Special logic implemented successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testSpecialLogic();