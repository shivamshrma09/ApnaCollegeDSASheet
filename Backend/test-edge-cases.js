// Test Edge Cases and Error Scenarios
const http = require('http');

const makeRequest = (options, data) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body
          });
        }
      });
    });
    
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
};

const testEdgeCases = async () => {
  console.log('🧪 Testing Edge Cases and Error Scenarios...\n');

  const baseOptions = {
    hostname: 'localhost',
    port: 5001,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'userid': 'test-user'
    }
  };

  try {
    // Test 1: Empty data
    console.log('📝 Test 1: Empty Data...');
    const emptyResult = await makeRequest({
      ...baseOptions,
      path: '/api/mock-interview/start'
    }, {});
    
    console.log(`Status: ${emptyResult.status} ${emptyResult.status === 400 ? '✅' : '❌'}`);

    // Test 2: Missing required fields
    console.log('\n📝 Test 2: Missing Required Fields...');
    const missingResult = await makeRequest({
      ...baseOptions,
      path: '/api/mock-interview/start'
    }, {
      name: 'Test User'
      // Missing other required fields
    });
    
    console.log(`Status: ${missingResult.status} ${missingResult.status === 400 ? '✅' : '❌'}`);

    // Test 3: Invalid email format
    console.log('\n📝 Test 3: Valid Data (Should Work)...');
    const validData = {
      name: 'Test User',
      email: 'test@example.com',
      companyName: 'Google',
      position: 'Software Engineer',
      experience: '2-3',
      skills: 'JavaScript, React',
      interviewRound: 'Technical'
    };
    
    const validResult = await makeRequest({
      ...baseOptions,
      path: '/api/mock-interview/start'
    }, validData);
    
    console.log(`Status: ${validResult.status} ${validResult.status === 200 ? '✅' : '❌'}`);

    // Test 4: Submit without questions
    console.log('\n📝 Test 4: Submit Without Questions...');
    const submitResult = await makeRequest({
      ...baseOptions,
      path: '/api/mock-interview/submit'
    }, {
      formData: validData,
      questionsAndAnswers: []
    });
    
    console.log(`Status: ${submitResult.status} ${submitResult.status === 400 ? '✅' : '❌'}`);

    // Test 5: Large input test
    console.log('\n📝 Test 5: Large Input Test...');
    const largeData = {
      ...validData,
      skills: 'A'.repeat(1000), // Very long skills string
      additionalNotes: 'B'.repeat(2000) // Very long notes
    };
    
    const largeResult = await makeRequest({
      ...baseOptions,
      path: '/api/mock-interview/start'
    }, largeData);
    
    console.log(`Status: ${largeResult.status} ${largeResult.status === 200 ? '✅' : '❌'}`);

    // Test 6: Special characters test
    console.log('\n📝 Test 6: Special Characters Test...');
    const specialData = {
      ...validData,
      name: 'Test <script>alert("xss")</script> User',
      companyName: 'Google & Associates',
      skills: 'JavaScript, React, Node.js & Express'
    };
    
    const specialResult = await makeRequest({
      ...baseOptions,
      path: '/api/mock-interview/start'
    }, specialData);
    
    console.log(`Status: ${specialResult.status} ${specialResult.status === 200 ? '✅' : '❌'}`);

    console.log('\n🎉 Edge Case Testing Completed!');
    
    // Summary
    console.log('\n📋 Edge Case Test Summary:');
    console.log(`${emptyResult.status === 400 ? '✅' : '❌'} Empty Data Validation`);
    console.log(`${missingResult.status === 400 ? '✅' : '❌'} Missing Fields Validation`);
    console.log(`${validResult.status === 200 ? '✅' : '❌'} Valid Data Processing`);
    console.log(`${submitResult.status === 400 ? '✅' : '❌'} Submit Validation`);
    console.log(`${largeResult.status === 200 ? '✅' : '❌'} Large Input Handling`);
    console.log(`${specialResult.status === 200 ? '✅' : '❌'} Special Characters Handling`);

  } catch (error) {
    console.error('❌ Edge Case Test Failed:', error.message);
  }
};

// Run edge case tests
testEdgeCases();