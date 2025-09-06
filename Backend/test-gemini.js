const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  try {
    console.log('🤖 Testing Gemini API...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyAGg8HDIIPISSXsJYKcIEOFuIwkpCMH_hA');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Generate exactly 3 interview questions for Software Engineer at Google.
Return only JSON array:
["Question 1", "Question 2", "Question 3"]`;

    console.log('📝 Sending prompt...');
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    console.log('✅ Raw Response:');
    console.log(responseText);
    
    // Try to parse
    const cleanResponse = responseText.replace(/```json|```/g, '').trim();
    const jsonMatch = cleanResponse.match(/\[[\s\S]*\]/);
    
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ Parsed Questions:', parsed);
      } catch (e) {
        console.log('❌ Parse Error:', e.message);
      }
    } else {
      console.log('❌ No JSON array found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGemini();