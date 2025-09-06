const mongoose = require('mongoose');
const User = require('./models/User');

// Test all custom spaced repetition conditions
async function testAllCustomSR() {
  try {
    await mongoose.connect('mongodb://localhost:27017/dsa-sheet');
    console.log('Connected to MongoDB');
    
    const userId = '68ba8c292c4e549a9e465a15';
    const user = await User.findById(userId);
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('\n🔍 TESTING CUSTOM SPACED REPETITION FOR ALL SHEETS\n');
    
    // Test different sheet types
    const sheetTypes = ['apnaCollege', 'striver', 'leetcode75', 'neetcode150'];
    
    for (const sheetType of sheetTypes) {
      console.log(`\n📋 SHEET: ${sheetType.toUpperCase()}`);
      console.log('='.repeat(50));
      
      // Check if sheet has separate custom SR data
      const sheetData = user.sheetProgress?.[sheetType];
      
      if (!sheetData) {
        console.log(`❌ No data found for ${sheetType}`);
        continue;
      }
      
      const customSR = sheetData.customSpacedRepetition;
      
      if (!customSR) {
        console.log(`❌ No custom spaced repetition data for ${sheetType}`);
        continue;
      }
      
      // Check all stages
      const stages = ['today', 'tomorrow', 'day3', 'week1', 'week2', 'month1', 'completed'];
      let totalProblems = 0;
      
      console.log('📊 STAGE COUNTS:');
      stages.forEach(stage => {
        const count = customSR[stage]?.length || 0;
        totalProblems += count;
        console.log(`  ${stage.toUpperCase()}: ${count} problems`);
        
        // Show problem details if any exist
        if (count > 0) {
          customSR[stage].forEach((problem, index) => {
            console.log(`    ${index + 1}. Problem ${problem.problemId} - Added: ${new Date(problem.addedDate).toLocaleDateString()} - Checked: ${problem.isChecked || false}`);
          });
        }
      });
      
      console.log(`\n📈 TOTAL PROBLEMS IN CUSTOM SR: ${totalProblems}`);
      
      // Test API endpoints for this sheet
      console.log('\n🧪 TESTING API CONDITIONS:');
      
      // Test 1: Add new problem
      console.log('  1. Testing add-solved endpoint...');
      const testProblemId = Math.floor(Math.random() * 1000) + 100;
      
      try {
        const response = await fetch(`http://localhost:5000/api/custom-spaced-repetition/add-solved?sheetType=${sheetType}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'userid': userId
          },
          body: JSON.stringify({ problemId: testProblemId })
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`    ✅ Added problem ${testProblemId} to ${sheetType} TODAY list`);
        } else {
          console.log(`    ❌ Failed to add problem to ${sheetType}`);
        }
      } catch (error) {
        console.log(`    ❌ API Error for ${sheetType}:`, error.message);
      }
      
      // Test 2: Check checkbox update
      if (customSR.today?.length > 0) {
        const firstProblem = customSR.today[0];
        console.log(`  2. Testing checkbox update for problem ${firstProblem.problemId}...`);
        
        try {
          const response = await fetch(`http://localhost:5000/api/custom-spaced-repetition/update-checkbox?sheetType=${sheetType}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'userid': userId
            },
            body: JSON.stringify({ 
              problemId: firstProblem.problemId, 
              isChecked: true 
            })
          });
          
          if (response.ok) {
            console.log(`    ✅ Updated checkbox for problem ${firstProblem.problemId} in ${sheetType}`);
          } else {
            console.log(`    ❌ Failed to update checkbox in ${sheetType}`);
          }
        } catch (error) {
          console.log(`    ❌ Checkbox API Error for ${sheetType}:`, error.message);
        }
      }
      
      // Test 3: Auto-move stages (simulation)
      console.log('  3. Testing auto-move stages...');
      try {
        const response = await fetch(`http://localhost:5000/api/custom-spaced-repetition/auto-move-stages?sheetType=${sheetType}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'userid': userId
          },
          body: JSON.stringify({ simulateTime: true })
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`    ✅ Auto-move completed for ${sheetType}`);
          if (result.movements?.length > 0) {
            console.log('    📋 Movements:');
            result.movements.forEach(movement => {
              console.log(`      - ${movement}`);
            });
          } else {
            console.log('    📋 No movements occurred');
          }
        } else {
          console.log(`    ❌ Failed auto-move for ${sheetType}`);
        }
      } catch (error) {
        console.log(`    ❌ Auto-move API Error for ${sheetType}:`, error.message);
      }
    }
    
    // Final verification - check if sheets are separate
    console.log('\n🔍 VERIFICATION: ARE SHEETS SEPARATE?');
    console.log('='.repeat(50));
    
    const updatedUser = await User.findById(userId);
    
    sheetTypes.forEach(sheetType => {
      const sheetData = updatedUser.sheetProgress?.[sheetType];
      if (sheetData?.customSpacedRepetition) {
        const totalCount = Object.values(sheetData.customSpacedRepetition)
          .reduce((sum, stage) => sum + (stage?.length || 0), 0);
        console.log(`${sheetType}: ${totalCount} total problems in custom SR`);
      } else {
        console.log(`${sheetType}: No custom SR data`);
      }
    });
    
    console.log('\n✅ TEST COMPLETED');
    
  } catch (error) {
    console.error('❌ Test Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the test
testAllCustomSR();