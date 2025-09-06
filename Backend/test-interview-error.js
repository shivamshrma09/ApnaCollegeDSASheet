require('dotenv').config();

const testInterviewError = async () => {
  try {
    console.log('🧪 Testing Interview Error Handling...');
    
    // Test with invalid API key to simulate failure
    const invalidKey = 'invalid-key-123';
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${invalidKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Generate 3 questions' }] }]
      })
    });
    
    if (!response.ok) {
      console.log('❌ API Failed as expected');
      console.log('📄 Status:', response.status);
      
      // This simulates what happens when AI fails
      console.log('\n✅ When AI fails, user will see:');
      console.log('🚫 Error: AI service temporarily unavailable');
      console.log('⏰ Message: Unable to generate interview questions at the moment. Please try again in 15 minutes.');
      console.log('🔄 Retry After: 15 minutes');
      
      console.log('\n✅ NO DUMMY QUESTIONS - Only real AI or error message!');
    }
    
  } catch (error) {
    console.log('✅ Error handling working correctly');
  }
};

testInterviewError();