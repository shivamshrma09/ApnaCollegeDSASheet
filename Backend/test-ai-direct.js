require('dotenv').config();

async function testGeminiDirect() {
  const apiKey = process.env.GEMINI_API_INTERVIEW || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ No API key found');
    return;
  }
  
  console.log('🔑 API Key found:', apiKey.substring(0, 10) + '...');
  
  try {
    const prompt = `Generate 3 interview questions for Software Engineer at Google.
Skills: JavaScript, React
Experience: 2-3 years

Return as JSON array:
["question1", "question2", "question3"]`;

    console.log('📤 Sending request...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    console.log('📥 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      console.log('✅ AI Response:');
      console.log(responseText);
      
      // Try to parse JSON
      const jsonMatch = responseText.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        try {
          const questions = JSON.parse(jsonMatch[0]);
          console.log('✅ Parsed questions:', questions);
        } catch (e) {
          console.log('❌ JSON parse error:', e.message);
        }
      } else {
        console.log('❌ No JSON array found');
      }
    } else {
      const errorData = await response.json();
      console.log('❌ API Error:', errorData);
    }
    
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }
}

testGeminiDirect();