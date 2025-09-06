require('dotenv').config();

const testInterviewAPI = async () => {
  try {
    console.log('🧪 Testing Interview API with updated key...');
    
    // Use interview API key
    const apiKey = process.env.GEMINI_API_INTERVIEW;
    console.log('🔑 Interview API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'MISSING');
    
    const prompt = `Generate 3 interview questions for Backend Developer at Amazon. Return as JSON array: ["q1", "q2", "q3"]`;
    
    console.log('🤖 Calling Gemini API...');
    
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
      
      console.log('✅ SUCCESS! Interview API working!');
      console.log('📄 Response:', responseText);
      
      const jsonMatch = responseText.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0]);
        console.log('\n🎯 INTERVIEW QUESTIONS GENERATED:');
        questions.forEach((q, i) => {
          console.log(`${i + 1}. ${q}`);
        });
        console.log('\n✅ INTERVIEW API WORKING WITH REAL AI!');
      }
    } else {
      const errorData = await response.json();
      console.log('❌ API Error:', errorData.error?.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testInterviewAPI();