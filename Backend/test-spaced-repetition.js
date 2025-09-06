const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';
const TEST_USER_ID = '68ba7187488b0b8b3f463c04';

// Test data
const testProblems = [
  { id: 'test-problem-1', title: 'Two Sum' },
  { id: 'test-problem-2', title: 'Valid Parentheses' },
  { id: 'test-problem-3', title: 'Merge Two Lists' }
];

class SpacedRepetitionTester {
  constructor() {
    this.results = [];
  }

  async log(message, data = null) {
    console.log(`✓ ${message}`);
    if (data) console.log('  Data:', JSON.stringify(data, null, 2));
    this.results.push({ message, data, timestamp: new Date() });
  }

  async logError(message, error) {
    console.log(`✗ ${message}`);
    console.log('  Error:', error.message);
    this.results.push({ message, error: error.message, timestamp: new Date() });
  }

  // Test 1: Add problems to spaced repetition
  async testAddProblems() {
    console.log('\n=== Test 1: Adding Problems to Spaced Repetition ===');
    
    for (const problem of testProblems) {
      try {
        const response = await axios.post(`${API_BASE}/spaced-repetition/add`, 
          { problemId: problem.id },
          { 
            headers: { userid: TEST_USER_ID },
            params: { sheetType: 'apnaCollege' }
          }
        );
        await this.log(`Added ${problem.title}`, response.data);
      } catch (error) {
        await this.logError(`Failed to add ${problem.title}`, error);
      }
    }
  }

  // Test 2: Get all spaced repetition data
  async testGetAllData() {
    console.log('\n=== Test 2: Getting All Spaced Repetition Data ===');
    
    try {
      const response = await axios.get(`${API_BASE}/spaced-repetition/all`, {
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      });
      await this.log('Retrieved all spaced repetition data', response.data);
      return response.data;
    } catch (error) {
      await this.logError('Failed to get all data', error);
      return [];
    }
  }

  // Test 3: Get due problems
  async testGetDueProblems() {
    console.log('\n=== Test 3: Getting Due Problems ===');
    
    try {
      const response = await axios.get(`${API_BASE}/spaced-repetition/due`, {
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      });
      await this.log('Retrieved due problems', response.data);
      return response.data;
    } catch (error) {
      await this.logError('Failed to get due problems', error);
      return [];
    }
  }

  // Test 4: Review problems with different qualities
  async testReviewProblems(dueProblems) {
    console.log('\n=== Test 4: Reviewing Problems ===');
    
    const qualities = [5, 3, 1]; // Perfect, Hesitant, Incorrect
    
    for (let i = 0; i < Math.min(dueProblems.length, qualities.length); i++) {
      const problem = dueProblems[i];
      const quality = qualities[i];
      
      try {
        const response = await axios.post(`${API_BASE}/spaced-repetition/review`,
          { problemId: problem.problemId, quality },
          {
            headers: { userid: TEST_USER_ID },
            params: { sheetType: 'apnaCollege' }
          }
        );
        await this.log(`Reviewed problem ${problem.problemId} with quality ${quality}`, response.data);
      } catch (error) {
        await this.logError(`Failed to review problem ${problem.problemId}`, error);
      }
    }
  }

  // Test 5: Test SM-2 Algorithm calculations
  async testSM2Algorithm() {
    console.log('\n=== Test 5: Testing SM-2 Algorithm ===');
    
    const testCases = [
      { quality: 5, expectedBehavior: 'Should increase interval significantly' },
      { quality: 3, expectedBehavior: 'Should increase interval moderately' },
      { quality: 1, expectedBehavior: 'Should reset to 1 day interval' }
    ];

    for (const testCase of testCases) {
      try {
        // Add a new problem for testing
        const testProblemId = `sm2-test-${testCase.quality}`;
        await axios.post(`${API_BASE}/spaced-repetition/add`, 
          { problemId: testProblemId },
          { 
            headers: { userid: TEST_USER_ID },
            params: { sheetType: 'apnaCollege' }
          }
        );

        // Review it with specific quality
        const response = await axios.post(`${API_BASE}/spaced-repetition/review`,
          { problemId: testProblemId, quality: testCase.quality },
          {
            headers: { userid: TEST_USER_ID },
            params: { sheetType: 'apnaCollege' }
          }
        );

        await this.log(`SM-2 Test - Quality ${testCase.quality}: ${testCase.expectedBehavior}`, response.data);
      } catch (error) {
        await this.logError(`SM-2 test failed for quality ${testCase.quality}`, error);
      }
    }
  }

  // Test 6: Test forgetting curve
  async testForgettingCurve() {
    console.log('\n=== Test 6: Testing Forgetting Curve ===');
    
    try {
      // Get forgetting curve data
      const response = await axios.get(`${API_BASE}/forgetting-curve/all`, {
        headers: { userid: TEST_USER_ID },
        params: { sheetType: 'apnaCollege' }
      });
      await this.log('Retrieved forgetting curve data', response.data);

      // Test adding to forgetting curve
      const testProblemId = 'forgetting-curve-test';
      const addResponse = await axios.post(`${API_BASE}/forgetting-curve/add`,
        { problemId: testProblemId },
        {
          headers: { userid: TEST_USER_ID },
          params: { sheetType: 'apnaCollege' }
        }
      );
      await this.log('Added problem to forgetting curve', addResponse.data);

    } catch (error) {
      await this.logError('Forgetting curve test failed', error);
    }
  }

  // Test 7: Performance test
  async testPerformance() {
    console.log('\n=== Test 7: Performance Testing ===');
    
    const startTime = Date.now();
    
    try {
      // Add multiple problems quickly
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          axios.post(`${API_BASE}/spaced-repetition/add`, 
            { problemId: `perf-test-${i}` },
            { 
              headers: { userid: TEST_USER_ID },
              params: { sheetType: 'apnaCollege' }
            }
          )
        );
      }
      
      await Promise.all(promises);
      const endTime = Date.now();
      
      await this.log(`Performance test completed in ${endTime - startTime}ms`, {
        problemsAdded: 10,
        timeMs: endTime - startTime,
        avgTimePerProblem: (endTime - startTime) / 10
      });
      
    } catch (error) {
      await this.logError('Performance test failed', error);
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting Spaced Repetition System Tests...\n');
    
    try {
      await this.testAddProblems();
      const allData = await this.testGetAllData();
      const dueProblems = await this.testGetDueProblems();
      await this.testReviewProblems(dueProblems);
      await this.testSM2Algorithm();
      await this.testForgettingCurve();
      await this.testPerformance();
      
      console.log('\n=== Test Summary ===');
      const successCount = this.results.filter(r => !r.error).length;
      const errorCount = this.results.filter(r => r.error).length;
      
      console.log(`✓ Successful tests: ${successCount}`);
      console.log(`✗ Failed tests: ${errorCount}`);
      console.log(`📊 Total tests: ${this.results.length}`);
      
      if (errorCount > 0) {
        console.log('\n❌ Errors found:');
        this.results.filter(r => r.error).forEach(r => {
          console.log(`  - ${r.message}: ${r.error}`);
        });
      }
      
    } catch (error) {
      console.error('Test suite failed:', error);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new SpacedRepetitionTester();
  tester.runAllTests().then(() => {
    console.log('\n🎉 Test suite completed!');
    process.exit(0);
  }).catch(error => {
    console.error('Test suite crashed:', error);
    process.exit(1);
  });
}

module.exports = SpacedRepetitionTester;