// Test utility for spaced repetition system
export const testSpacedRepetitionForSheet = async (sheetType, problemId, userId) => {
  const API_BASE_URL = 'http://localhost:5001/api';
  
  console.log(`🧪 Testing spaced repetition for sheet: ${sheetType}, problem: ${problemId}`);
  
  try {
    // Test 1: Add problem to spaced repetition
    console.log('📝 Step 1: Adding problem to spaced repetition...');
    const addResponse = await fetch(`${API_BASE_URL}/custom-spaced-repetition/add-solved?sheetType=${sheetType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'userid': userId
      },
      body: JSON.stringify({ problemId: problemId.toString() })
    });
    
    if (addResponse.ok) {
      const addResult = await addResponse.json();
      console.log('✅ Successfully added to spaced repetition:', addResult);
    } else {
      console.error('❌ Failed to add to spaced repetition:', addResponse.status);
      return false;
    }
    
    // Test 2: Get all spaced repetition data
    console.log('📊 Step 2: Fetching spaced repetition data...');
    const getAllResponse = await fetch(`${API_BASE_URL}/custom-spaced-repetition/all?sheetType=${sheetType}`, {
      headers: { userid: userId }
    });
    
    if (getAllResponse.ok) {
      const getAllResult = await getAllResponse.json();
      console.log('✅ Spaced repetition data:', getAllResult);
      
      // Check if problem exists in any stage
      const allStages = Object.values(getAllResult.customSpacedRepetition || {});
      let found = false;
      for (const stage of allStages) {
        const problem = stage.find(p => p.problemId === parseInt(problemId));
        if (problem) {
          console.log(`✅ Problem ${problemId} found in spaced repetition for ${sheetType}`);
          found = true;
          break;
        }
      }
      
      if (!found) {
        console.error(`❌ Problem ${problemId} not found in spaced repetition for ${sheetType}`);
        return false;
      }
    } else {
      console.error('❌ Failed to fetch spaced repetition data:', getAllResponse.status);
      return false;
    }
    
    // Test 3: Update checkbox
    console.log('☑️ Step 3: Testing checkbox update...');
    const updateResponse = await fetch(`${API_BASE_URL}/custom-spaced-repetition/update-checkbox?sheetType=${sheetType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'userid': userId
      },
      body: JSON.stringify({
        problemId: parseInt(problemId),
        isChecked: true
      })
    });
    
    if (updateResponse.ok) {
      const updateResult = await updateResponse.json();
      console.log('✅ Successfully updated checkbox:', updateResult);
    } else {
      console.error('❌ Failed to update checkbox:', updateResponse.status);
      return false;
    }
    
    console.log(`🎉 All tests passed for ${sheetType}!`);
    return true;
    
  } catch (error) {
    console.error(`❌ Test failed for ${sheetType}:`, error);
    return false;
  }
};

// Test multiple sheets
export const testAllSheets = async (userId) => {
  const sheets = ['apnaCollege', 'loveBabbar', 'striverA2Z', 'blind75', 'striverSDE'];
  const testProblemId = 1; // Use problem ID 1 for testing
  
  console.log('🚀 Starting comprehensive spaced repetition test...');
  
  for (const sheet of sheets) {
    console.log(`\n📋 Testing sheet: ${sheet}`);
    const success = await testSpacedRepetitionForSheet(sheet, testProblemId, userId);
    
    if (success) {
      console.log(`✅ ${sheet}: PASSED`);
    } else {
      console.log(`❌ ${sheet}: FAILED`);
    }
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🏁 Test completed!');
};

// Add to window for easy testing in console
if (typeof window !== 'undefined') {
  window.testSpacedRepetition = {
    testSheet: testSpacedRepetitionForSheet,
    testAll: testAllSheets
  };
  
  console.log('🔧 Spaced repetition test utilities loaded. Use:');
  console.log('- window.testSpacedRepetition.testSheet(sheetType, problemId, userId)');
  console.log('- window.testSpacedRepetition.testAll(userId)');
}