require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const testInterviewAI = async () => {
  try {
    console.log('🧪 Testing Interview AI System...');
    
    // Check API key
    const apiKey = process.env.GEMINI_API_INTERVIEW || process.env.GEMINI_API_KEY;
    console.log('🔑 API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'MISSING');
    
    if (!apiKey) {
      console.log('❌ No API key found!');
      return;
    }
    
    // Test data
    const testData = {
      position: 'Frontend Developer',
      companyName: 'Google',
      experience: '2-3 years',
      skills: 'React, JavaScript, Node.js',
      interviewRound: 'Technical Round'
    };
    
    console.log('📝 Test Data:', testData);
    
    // Generate questions using real API
    const prompt = `Generate 5 specific interview questions for ${testData.position} at ${testData.companyName}.
Experience: ${testData.experience}
Skills: ${testData.skills}
Round: ${testData.interviewRound}

Make questions specific to the role and company. Return as JSON array only:
["question1", "question2", "question3", "question4", "question5"]`;

    console.log('🤖 Calling Gemini API...');
    
    // Direct API call
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      console.log('✅ API Response received!');
      console.log('📄 Raw Response:', responseText.substring(0, 200) + '...');
      
      // Extract JSON array
      const jsonMatch = responseText.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        try {
          const questions = JSON.parse(jsonMatch[0]);
          console.log('🎯 Generated Questions:');
          questions.forEach((q, i) => {
            console.log(`${i + 1}. ${q}`);
          });
          console.log('\n✅ REAL AI WORKING! Questions are dynamically generated.');
        } catch (parseError) {
          console.log('❌ JSON parsing failed:', parseError.message);
          console.log('📄 Response text:', responseText);
        }
      } else {
        console.log('❌ No JSON array found in response');
        console.log('📄 Full response:', responseText);
      }
    } else {
      const errorData = await response.json();
      console.log('❌ API Error:', errorData.error?.message || 'Unknown error');
      console.log('📄 Error details:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testInterviewAI();