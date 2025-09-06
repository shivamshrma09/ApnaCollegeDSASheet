// Test Interview Process using built-in modules
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

const testInterviewProcess = async () => {
  console.log('🧪 Testing Complete Interview Process...\n');
  
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    companyName: 'Google',
    position: 'Software Engineer',
    experience: '2-3',
    skills: 'JavaScript, React, Node.js',
    interviewRound: 'Technical Round 1'
  };

  try {
    // Step 1: Test Interview Start
    console.log('📝 Step 1: Starting Interview...');
    const startOptions = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/mock-interview/start',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'userid': 'test-user'
      }
    };

    const startResult = await makeRequest(startOptions, testData);
    
    if (startResult.status !== 200) {
      throw new Error(`Start failed: ${startResult.status}`);
    }

    console.log('✅ Interview started successfully');
    console.log(`📋 Generated ${startResult.data.questions?.length || 0} questions`);
    
    if (!startResult.data.questions || startResult.data.questions.length === 0) {
      throw new Error('No questions generated');
    }

    // Step 2: Simulate Interview Answers
    console.log('\n💬 Step 2: Simulating Interview Answers...');
    const questionsAndAnswers = startResult.data.questions.map((question, index) => ({
      question: question,
      answer: `This is a sample answer for question ${index + 1}. I have experience with ${testData.skills} and have worked on similar projects.`
    }));

    // Step 3: Test Interview Submission
    console.log('\n📤 Step 3: Submitting Interview...');
    const submitOptions = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/mock-interview/submit',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'userid': 'test-user'
      }
    };

    const submitData = {
      formData: testData,
      questionsAndAnswers: questionsAndAnswers
    };

    const submitResult = await makeRequest(submitOptions, submitData);
    
    if (submitResult.status !== 200) {
      throw new Error(`Submit failed: ${submitResult.status} - ${JSON.stringify(submitResult.data)}`);
    }

    console.log('✅ Interview submitted successfully');
    console.log(`📊 Overall Score: ${submitResult.data.overallScore}/100`);
    console.log(`📧 Email Report: ${submitResult.data.reportSent ? 'Sent' : 'Failed'}`);

    // Step 4: Performance Test
    console.log('\n⚡ Step 4: Performance Test...');
    const startTime = Date.now();
    
    await makeRequest(startOptions, testData);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`⏱️ Response Time: ${responseTime}ms`);
    if (responseTime < 5000) {
      console.log('✅ Performance: Good');
    } else {
      console.log('⚠️ Performance: Needs optimization');
    }

    console.log('\n🎉 All Tests Completed Successfully!');
    
    // Test Results Summary
    console.log('\n📋 Test Summary:');
    console.log(`✅ Interview Start: Working`);
    console.log(`✅ Question Generation: ${startResult.data.questions.length} questions`);
    console.log(`✅ Interview Submission: Working`);
    console.log(`✅ Analysis Generation: Score ${submitResult.data.overallScore}`);
    console.log(`${submitResult.data.reportSent ? '✅' : '⚠️'} Email System: ${submitResult.data.reportSent ? 'Working' : 'Needs attention'}`);
    console.log(`✅ Performance: ${responseTime}ms`);
    
    return true;

  } catch (error) {
    console.error('❌ Test Failed:', error.message);
    console.log('\n🔧 Possible Issues:');
    console.log('- Backend server not running on port 5001');
    console.log('- Database connection issues');
    console.log('- Email configuration problems');
    console.log('- API endpoint errors');
    return false;
  }
};

// Run tests
testInterviewProcess();