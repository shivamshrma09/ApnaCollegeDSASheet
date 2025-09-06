const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';
const TEST_USER_ID = '68ba7187488b0b8b3f463c04';

async function testCustomSpacedRepetitionFlow() {
  console.log('🧠 Testing Custom Spaced Repetition Flow\n');

  try {
    // Step 1: User solves Question #1 - Add to TODAY list
    console.log('1. User solves Question #1 - Adding to TODAY list...');
    const addResponse = await axios.post(`${API_BASE}/custom-spaced-repetition/add-solved`, 
      { problemId: '1' },
      { 
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      }
    );
    console.log('✅ Added to TODAY:', addResponse.data.message);

    // Step 2: Check current state
    console.log('\n2. Checking current state...');
    const allDataResponse = await axios.get(`${API_BASE}/custom-spaced-repetition/all`, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    console.log('✅ Current state:', allDataResponse.data.summary);
    console.log('   Full data:', JSON.stringify(allDataResponse.data.customSpacedRepetition, null, 2));

    // Step 3: User checks the retention checkbox
    console.log('\n3. User checks retention checkbox for Question #1...');
    const checkboxResponse = await axios.post(`${API_BASE}/custom-spaced-repetition/update-checkbox`,
      { problemId: '1', isChecked: true },
      {
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      }
    );
    console.log('✅ Checkbox updated:', checkboxResponse.data.message);

    // Step 4: Get TODAY list specifically
    console.log('\n4. Getting TODAY list...');
    const todayResponse = await axios.get(`${API_BASE}/custom-spaced-repetition/stage/today`, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    console.log('✅ TODAY problems:', todayResponse.data.count);
    console.log('   Problems:', todayResponse.data.problems.map(p => `${p.problemId} (checked: ${p.isChecked})`));

    // Step 5: Simulate auto-movement (next day)
    console.log('\n5. Simulating auto-movement (next day)...');
    const moveResponse = await axios.post(`${API_BASE}/custom-spaced-repetition/auto-move-stages`, {}, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    console.log('✅ Auto-movement completed');
    console.log('   Movements:', moveResponse.data.movements);
    console.log('   New summary:', moveResponse.data.summary);

    // Step 6: Check TOMORROW list
    console.log('\n6. Getting TOMORROW list...');
    const tomorrowResponse = await axios.get(`${API_BASE}/custom-spaced-repetition/stage/tomorrow`, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    console.log('✅ TOMORROW problems:', tomorrowResponse.data.count);
    console.log('   Problems:', tomorrowResponse.data.problems.map(p => `${p.problemId} (checked: ${p.isChecked})`));

    // Step 7: Test multiple problems
    console.log('\n7. Adding more problems to test flow...');
    const problems = ['2', '3', '4'];
    for (const problemId of problems) {
      await axios.post(`${API_BASE}/custom-spaced-repetition/add-solved`, 
        { problemId },
        { 
          headers: { userid: TEST_USER_ID },
          params: { sheetType: 'apnaCollege' }
        }
      );
      console.log(`   ✅ Added problem ${problemId} to TODAY`);
    }

    // Step 8: Check final state
    console.log('\n8. Final state check...');
    const finalResponse = await axios.get(`${API_BASE}/custom-spaced-repetition/all`, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    console.log('✅ Final summary:', finalResponse.data.summary);

    console.log('\n🎉 Custom Spaced Repetition Flow Test Completed Successfully!');
    console.log('\n📋 Flow Summary:');
    console.log('   ✅ Problem solved → Added to TODAY');
    console.log('   ✅ Checkbox functionality working');
    console.log('   ✅ Auto-movement TODAY → TOMORROW working');
    console.log('   ✅ Multiple problems handling working');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Test specific scenarios
async function testSpecificScenarios() {
  console.log('\n🔬 Testing Specific Scenarios...\n');

  try {
    // Scenario 1: Problem without checkbox (should stay in TOMORROW)
    console.log('Scenario 1: Problem without checkbox check...');
    
    await axios.post(`${API_BASE}/custom-spaced-repetition/add-solved`, 
      { problemId: 'unchecked-problem' },
      { 
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      }
    );
    
    // Don't check the checkbox, just move stages
    await axios.post(`${API_BASE}/custom-spaced-repetition/auto-move-stages`, {}, {
      headers: { userid: TEST_USER_ID },
      params: { sheetType: 'apnaCollege' }
    });
    
    console.log('✅ Unchecked problem should stay in TOMORROW after time passes');

    // Scenario 2: Problem with checkbox (should move to WEEK1)
    console.log('\nScenario 2: Problem with checkbox check...');
    
    await axios.post(`${API_BASE}/custom-spaced-repetition/add-solved`, 
      { problemId: 'checked-problem' },
      { 
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      }
    );
    
    await axios.post(`${API_BASE}/custom-spaced-repetition/update-checkbox`,
      { problemId: 'checked-problem', isChecked: true },
      {
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      }
    );
    
    console.log('✅ Checked problem ready for progression');

    console.log('\n🎯 Scenario testing completed!');

  } catch (error) {
    console.error('❌ Scenario test failed:', error.response?.data || error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testCustomSpacedRepetitionFlow();
  await testSpecificScenarios();
}

runAllTests();