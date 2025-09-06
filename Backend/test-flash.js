require('dotenv').config();

async function testFlash() {
  const apiKey = process.env.GEMINI_API_INTERVIEW;
  
  console.log('🔑 Testing Flash model with key:', apiKey?.substring(0, 10) + '...');
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Generate 3 interview questions for Software Engineer at Google. Return as JSON array: ["q1", "q2", "q3"]' }] }]
      })
    });

    console.log('📥 Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      console.log('✅ Response:', text);
    } else {
      const error = await response.json();
      console.log('❌ Error:', error);
    }
    
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }
}

testFlash();