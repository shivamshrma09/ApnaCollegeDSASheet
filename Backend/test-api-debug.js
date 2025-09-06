require('dotenv').config();

async function debugAPI() {
  const apiKey = process.env.GEMINI_API_INTERVIEW;
  
  console.log('🔍 Debugging API Key:', apiKey);
  console.log('🔍 Key length:', apiKey?.length);
  console.log('🔍 Key starts with:', apiKey?.substring(0, 15));
  
  // Try different endpoints
  const endpoints = [
    'gemini-1.5-flash',
    'gemini-pro',
    'gemini-1.5-pro'
  ];
  
  for (const model of endpoints) {
    console.log(`\n🧪 Testing ${model}...`);
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: 'Say "Hello World"' 
            }] 
          }]
        })
      });

      console.log(`📊 ${model} Status:`, response.status);
      
      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        console.log(`✅ ${model} Works! Response:`, text.substring(0, 50));
        break; // Found working model
      } else {
        const error = await response.json();
        console.log(`❌ ${model} Error:`, error.error?.message || 'Unknown error');
      }
      
    } catch (error) {
      console.log(`❌ ${model} Failed:`, error.message);
    }
  }
}

debugAPI();