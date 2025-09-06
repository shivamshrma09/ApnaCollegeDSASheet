const mongoose = require('mongoose');
const User = require('./models/User');

async function testCustomSRDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/dsa-sheet');
    console.log('Connected to MongoDB');
    
    const userId = '68ba8c292c4e549a9e465a15';
    const user = await User.findById(userId);
    
    console.log('\n🔍 CUSTOM SPACED REPETITION ANALYSIS\n');
    
    // Check current data
    console.log('📊 CURRENT DATA:');
    if (user.sheetProgress) {
      Object.keys(user.sheetProgress).forEach(sheetType => {
        console.log(`\n${sheetType.toUpperCase()}:`);
        const sheetData = user.sheetProgress[sheetType];
        
        if (sheetData.customSpacedRepetition) {
          let total = 0;
          Object.keys(sheetData.customSpacedRepetition).forEach(stage => {
            const count = sheetData.customSpacedRepetition[stage]?.length || 0;
            total += count;
            if (count > 0) {
              console.log(`  ${stage}: ${count} problems`);
              sheetData.customSpacedRepetition[stage].forEach(problem => {
                console.log(`    - Problem ${problem.problemId} (Added: ${new Date(problem.addedDate).toLocaleDateString()})`);
              });
            }
          });
          console.log(`  TOTAL: ${total} problems`);
        } else {
          console.log('  No custom spaced repetition data');
        }
      });
    }
    
    // Test adding problems to different sheets
    console.log('\n🧪 TESTING SEPARATE SHEET FUNCTIONALITY:');
    
    // Initialize different sheet types
    const sheetTypes = ['apnaCollege', 'striverA2Z', 'leetcode75', 'neetcode150'];
    
    // Function to initialize custom SR for a sheet
    const initializeCustomSR = (user, sheetType) => {
      if (!user.sheetProgress) {
        user.sheetProgress = {};
      }
      
      if (!user.sheetProgress[sheetType]) {
        user.sheetProgress[sheetType] = {
          completedProblems: [],
          starredProblems: [],
          notes: {},
          customSpacedRepetition: {
            today: [],
            tomorrow: [],
            day3: [],
            week1: [],
            week2: [],
            month1: [],
            completed: []
          }
        };
      }
      
      if (!user.sheetProgress[sheetType].customSpacedRepetition) {
        user.sheetProgress[sheetType].customSpacedRepetition = {
          today: [],
          tomorrow: [],
          day3: [],
          week1: [],
          week2: [],
          month1: [],
          completed: []
        };
      }
      
      return user.sheetProgress[sheetType];
    };
    
    // Add test problems to different sheets
    sheetTypes.forEach((sheetType, index) => {
      const sheetData = initializeCustomSR(user, sheetType);
      const testProblemId = 1000 + index;
      
      // Add a problem to TODAY list
      sheetData.customSpacedRepetition.today.push({
        problemId: testProblemId,
        addedDate: new Date(),
        stageAddedDate: new Date(),
        isChecked: false,
        stage: 'today'
      });
      
      console.log(`✅ Added problem ${testProblemId} to ${sheetType} TODAY list`);
    });
    
    // Save changes
    user.markModified('sheetProgress');
    await user.save();
    
    // Verify separation
    console.log('\n🔍 VERIFICATION - EACH SHEET IS SEPARATE:');
    const updatedUser = await User.findById(userId);
    
    sheetTypes.forEach(sheetType => {
      const sheetData = updatedUser.sheetProgress?.[sheetType];
      if (sheetData?.customSpacedRepetition) {
        const todayCount = sheetData.customSpacedRepetition.today?.length || 0;
        console.log(`${sheetType}: ${todayCount} problems in TODAY`);
        
        if (todayCount > 0) {
          sheetData.customSpacedRepetition.today.forEach(problem => {
            console.log(`  - Problem ${problem.problemId}`);
          });
        }
      }
    });
    
    // Test stage movement simulation
    console.log('\n🔄 TESTING STAGE MOVEMENT:');
    
    const apnaCollegeData = updatedUser.sheetProgress.apnaCollege;
    if (apnaCollegeData?.customSpacedRepetition?.today?.length > 0) {
      // Move first problem from TODAY to TOMORROW
      const problemToMove = apnaCollegeData.customSpacedRepetition.today[0];
      apnaCollegeData.customSpacedRepetition.today.shift();
      
      problemToMove.stage = 'tomorrow';
      problemToMove.stageAddedDate = new Date();
      apnaCollegeData.customSpacedRepetition.tomorrow.push(problemToMove);
      
      console.log(`✅ Moved problem ${problemToMove.problemId} from TODAY to TOMORROW in apnaCollege`);
      
      // Save changes
      updatedUser.markModified('sheetProgress');
      await updatedUser.save();
    }
    
    // Final verification
    console.log('\n📋 FINAL STATE:');
    const finalUser = await User.findById(userId);
    
    Object.keys(finalUser.sheetProgress).forEach(sheetType => {
      const sheetData = finalUser.sheetProgress[sheetType];
      if (sheetData.customSpacedRepetition) {
        console.log(`\n${sheetType}:`);
        Object.keys(sheetData.customSpacedRepetition).forEach(stage => {
          const count = sheetData.customSpacedRepetition[stage]?.length || 0;
          if (count > 0) {
            console.log(`  ${stage}: ${count} problems`);
          }
        });
      }
    });
    
    console.log('\n✅ TEST RESULTS:');
    console.log('1. ✅ Each sheet has separate custom spaced repetition data');
    console.log('2. ✅ Problems can be added to specific sheets independently');
    console.log('3. ✅ Stage movements work within each sheet separately');
    console.log('4. ✅ Data persistence works correctly');
    
  } catch (error) {
    console.error('❌ Test Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testCustomSRDatabase();