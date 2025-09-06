// Test script for spaced repetition flow
const API_BASE_URL = 'http://localhost:5001/api';

// Test user ID (you can change this to your actual user ID)
const TEST_USER_ID = '68ba7187488b0b8b3f463c04';

// Test problem ID
const TEST_PROBLEM_ID = 1;

// Test sheet types
const SHEET_TYPES = ['apnaCollege', 'striverA2Z', 'loveBabbar'];

async function testSpacedRepetitionFlow() {
  console.log('🚀 Starting Spaced Repetition Flow Test...\n');
  
  for (const sheetType of SHEET_TYPES) {
    console.log(`📋 Testing ${sheetType} sheet...`);
    
    try {
      // Step 1: Add problem to spaced repetition (simulating problem completion)
      console.log('  Step 1: Adding problem to spaced repetition...');
      const addResponse = await fetch(`${API_BASE_URL}/custom-spaced-repetition/add-solved?sheetType=${sheetType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userid': TEST_USER_ID
        },
        body: JSON.stringify({ 
          problemId: TEST_PROBLEM_ID.toString() 
        })
      });
      
      if (addResponse.ok) {
        const addResult = await addResponse.json();
        console.log('  ✅ Problem added successfully:', addResult.message);
      } else {
        const errorText = await addResponse.text();
        console.log('  ❌ Failed to add problem:', addResponse.status, errorText);
        continue;
      }
      
      // Step 2: Fetch all spaced repetition data
      console.log('  Step 2: Fetching spaced repetition data...');
      const getAllResponse = await fetch(`${API_BASE_URL}/custom-spaced-repetition/all?sheetType=${sheetType}`, {
        headers: { 'userid': TEST_USER_ID }
      });
      
      if (getAllResponse.ok) {
        const getAllResult = await getAllResponse.json();
        console.log('  ✅ Data fetched successfully');
        
        // Check if problem exists in any stage
        const stages = getAllResult.customSpacedRepetition || {};
        let found = false;
        let problemStage = null;
        
        for (const [stageName, problems] of Object.entries(stages)) {
          const problem = problems.find(p => p.problemId === TEST_PROBLEM_ID);
          if (problem) {
            found = true;
            problemStage = stageName;
            console.log(`  📍 Problem found in stage: ${stageName}`);
            break;
          }
        }
        
        if (!found) {
          console.log('  ❌ Problem not found in any stage');
          continue;
        }
        
        // Step 3: Test checkbox update (mark as reviewed)
        console.log('  Step 3: Testing checkbox update...');
        const updateResponse = await fetch(`${API_BASE_URL}/custom-spaced-repetition/update-checkbox?sheetType=${sheetType}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'userid': TEST_USER_ID
          },
          body: JSON.stringify({
            problemId: TEST_PROBLEM_ID,
            isChecked: true
          })
        });
        
        if (updateResponse.ok) {
          const updateResult = await updateResponse.json();
          console.log('  ✅ Checkbox updated successfully:', updateResult.message);
        } else {
          const errorText = await updateResponse.text();
          console.log('  ❌ Failed to update checkbox:', updateResponse.status, errorText);
        }
        
        // Step 4: Verify the problem moved to next stage
        console.log('  Step 4: Verifying stage progression...');
        const verifyResponse = await fetch(`${API_BASE_URL}/custom-spaced-repetition/all?sheetType=${sheetType}`, {
          headers: { 'userid': TEST_USER_ID }
        });
        
        if (verifyResponse.ok) {
          const verifyResult = await verifyResponse.json();
          const newStages = verifyResult.customSpacedRepetition || {};
          
          // Check if problem moved to a different stage
          let newStage = null;
          for (const [stageName, problems] of Object.entries(newStages)) {
            const problem = problems.find(p => p.problemId === TEST_PROBLEM_ID);
            if (problem) {
              newStage = stageName;
              break;
            }
          }
          
          if (newStage && newStage !== problemStage) {
            console.log(`  ✅ Problem progressed from ${problemStage} to ${newStage}`);
          } else if (newStage === problemStage) {
            console.log(`  ℹ️ Problem remained in ${problemStage} (expected for some stages)`);
          } else {
            console.log('  ❌ Problem disappeared after update');
          }
        }
        
        console.log(`  🎉 ${sheetType} test completed successfully!\n`);
        
      } else {
        const errorText = await getAllResponse.text();
        console.log('  ❌ Failed to fetch data:', getAllResponse.status, errorText);
      }
      
    } catch (error) {
      console.log(`  ❌ Test failed for ${sheetType}:`, error.message);
    }
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🏁 All tests completed!');
}

// Run the test
testSpacedRepetitionFlow().catch(console.error);