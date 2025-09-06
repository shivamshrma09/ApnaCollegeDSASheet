require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const nodemailer = require('nodemailer');

const testGeminiAnalysis = async () => {
  try {
    console.log('🧪 Testing Real Gemini Analysis...');
    
    // Test data - real interview Q&A
    const testData = {
      name: 'Test User',
      email: 'shivamsharma27107@gmail.com', // Your email
      companyName: 'Google',
      position: 'Software Engineer',
      experience: '2-3 years',
      skills: 'JavaScript, React, Node.js'
    };
    
    const questionsAndAnswers = [
      {
        question: 'Tell me about your experience with React and how you handle state management.',
        answer: 'I have 2 years of experience with React. I use useState for simple state and Redux for complex applications. I also work with useEffect for side effects and have built several e-commerce applications using React with proper component architecture.'
      },
      {
        question: 'How would you optimize a slow-performing web application?',
        answer: 'I would start by identifying bottlenecks using browser dev tools. Then optimize images, implement lazy loading, use code splitting, minimize bundle size, and optimize database queries. I would also implement caching strategies and use CDN for static assets.'
      },
      {
        question: 'Describe a challenging project you worked on and how you solved it.',
        answer: 'I worked on a real-time chat application that had scaling issues. The main challenge was handling concurrent users. I implemented WebSocket connections with Socket.io, used Redis for session management, and implemented horizontal scaling with load balancers. This reduced response time by 60%.'
      }
    ];
    
    console.log('📝 Test Interview Data:');
    console.log('Candidate:', testData.name);
    console.log('Position:', testData.position, 'at', testData.companyName);
    console.log('Questions:', questionsAndAnswers.length);
    
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_INTERVIEW);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Real analysis prompt
    const analysisPrompt = `You are an expert interview analyst. Analyze this mock interview for ${testData.name} applying for ${testData.position} at ${testData.companyName}.

IMPORTANT: Base your analysis ONLY on the actual answers provided below. Do not make assumptions.

Rate each answer on these 10 parameters (1-10 scale):
1. Technical Accuracy - Correctness of technical concepts mentioned
2. Communication Clarity - How clearly ideas were expressed
3. Problem-Solving Approach - Logical thinking process shown
4. Depth of Knowledge - Understanding demonstrated in answers
5. Practical Experience - Real-world examples mentioned
6. Confidence Level - Assurance shown in responses
7. Structure & Organization - How well-organized the answers are
8. Relevance to Role - Alignment with ${testData.position} requirements
9. Innovation & Creativity - Unique insights or creative solutions
10. Professional Maturity - Industry awareness and professionalism

Actual Interview Questions and Answers:
${questionsAndAnswers.map((qa, i) => `Q${i+1}: ${qa.question}\nA${i+1}: ${qa.answer}`).join('\n\n')}

Analyze the ACTUAL content of these answers and provide:
- Overall score (1-100) based on answer quality
- Individual scores for each question on all 10 parameters
- Specific strengths found in the answers
- Specific improvement areas based on weak answers
- Salary prediction for ${testData.position} in India
- Personalized improvement roadmap
- Interview readiness for ${testData.companyName}

Return ONLY valid JSON:
{
  "overallScore": number,
  "questionAnalysis": [{
    "question": string,
    "answer": string,
    "scores": {
      "technicalAccuracy": number,
      "communicationClarity": number,
      "problemSolving": number,
      "depthOfKnowledge": number,
      "practicalExperience": number,
      "confidenceLevel": number,
      "structureOrganization": number,
      "relevanceToRole": number,
      "innovationCreativity": number,
      "professionalMaturity": number
    },
    "feedback": string
  }],
  "strengths": [string],
  "improvementAreas": [string],
  "salaryPrediction": {
    "range": string,
    "reasoning": string
  },
  "improvementRoadmap": [string],
  "interviewReadiness": string,
  "overallFeedback": string
}`;

    console.log('🤖 Calling Gemini for analysis...');
    
    // Get real AI analysis
    const result = await model.generateContent(analysisPrompt);
    const responseText = result.response.text();
    
    console.log('✅ Gemini response received!');
    console.log('📄 Raw response length:', responseText.length);
    
    // Parse JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const analysisResult = JSON.parse(jsonMatch[0]);
    console.log('✅ Analysis parsed successfully!');
    console.log('📊 Overall Score:', analysisResult.overallScore);
    console.log('💰 Salary Prediction:', analysisResult.salaryPrediction?.range);
    
    // Send email report
    console.log('📧 Sending email report...');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Generate email HTML
    const emailHTML = generateEmailReport(testData, analysisResult);
    
    const emailResult = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: testData.email,
      subject: `🎯 Real Gemini Analysis Test - ${testData.companyName} ${testData.position}`,
      html: emailHTML
    });
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', emailResult.messageId);
    console.log('📬 Sent to:', testData.email);
    
    console.log('\n🎉 GEMINI ANALYSIS TEST COMPLETED!');
    console.log('✅ Real AI analysis working');
    console.log('✅ Email report sent');
    console.log('✅ Check your email for detailed report');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.message.includes('JSON')) {
      console.log('📄 This might be a parsing issue, but Gemini is responding');
    }
  }
};

const generateEmailReport = (formData, analysis) => {
  const avgScores = analysis.questionAnalysis.reduce((acc, qa) => {
    Object.keys(qa.scores).forEach(param => {
      acc[param] = (acc[param] || 0) + qa.scores[param];
    });
    return acc;
  }, {});
  
  Object.keys(avgScores).forEach(param => {
    avgScores[param] = Math.round(avgScores[param] / analysis.questionAnalysis.length);
  });

  const parameterNames = {
    technicalAccuracy: 'Technical Accuracy',
    communicationClarity: 'Communication Clarity',
    problemSolving: 'Problem Solving',
    depthOfKnowledge: 'Depth of Knowledge',
    practicalExperience: 'Practical Experience',
    confidenceLevel: 'Confidence Level',
    structureOrganization: 'Structure & Organization',
    relevanceToRole: 'Relevance to Role',
    innovationCreativity: 'Innovation & Creativity',
    professionalMaturity: 'Professional Maturity'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f8fafc; line-height: 1.6; }
        .container { max-width: 700px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h1 { color: #2563eb; text-align: center; margin-bottom: 10px; font-size: 28px; }
        h2 { color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 30px; }
        .header-info { text-align: center; color: #6b7280; margin-bottom: 30px; font-size: 16px; }
        .score { font-size: 32px; font-weight: bold; color: #059669; text-align: center; background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .param-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 15px 0; }
        .param { background: #f8fafc; padding: 12px; border-radius: 6px; }
        .param-name { color: #374151; font-size: 14px; font-weight: 500; }
        .param-score { color: #2563eb; font-weight: bold; float: right; }
        .strength { color: #059669; margin: 8px 0; padding: 8px; background: #f0fdf4; border-radius: 4px; }
        .improvement { color: #dc2626; margin: 8px 0; padding: 8px; background: #fef2f2; border-radius: 4px; }
        .salary { color: #059669; font-weight: bold; font-size: 24px; text-align: center; background: #f0fdf4; padding: 15px; border-radius: 8px; }
        .question { margin: 20px 0; padding: 20px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #3b82f6; }
        .answer { color: #4b5563; font-size: 14px; margin: 10px 0; padding: 10px; background: white; border-radius: 4px; }
        .feedback { color: #6b7280; font-style: italic; margin-top: 10px; }
        .roadmap-item { background: #eff6ff; padding: 12px; margin: 8px 0; border-radius: 6px; border-left: 3px solid #3b82f6; }
        .test-badge { background: #fbbf24; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎯 Real Gemini AI Analysis Report <span class="test-badge">TEST</span></h1>
        <div class="header-info">
          <strong>${formData.name}</strong> • ${formData.position} at ${formData.companyName}<br>
          <small>Generated on ${new Date().toLocaleDateString()} using Real Gemini AI</small>
        </div>
        
        <div class="score">Overall Score: ${analysis.overallScore}/100</div>
        
        <div class="section">
          <h2>📊 Performance Parameters</h2>
          <div class="param-grid">
            ${Object.entries(avgScores).map(([param, score]) => `
              <div class="param">
                <span class="param-name">${parameterNames[param]}</span>
                <span class="param-score">${score}/10</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="section">
          <h2>💰 Salary Prediction</h2>
          <div class="salary">${analysis.salaryPrediction.range}</div>
          <p style="color: #6b7280; text-align: center; margin-top: 10px;">${analysis.salaryPrediction.reasoning}</p>
        </div>

        <div class="section">
          <h2>✅ Key Strengths</h2>
          ${analysis.strengths.map(strength => `<div class="strength">✓ ${strength}</div>`).join('')}
        </div>

        <div class="section">
          <h2>📝 Areas for Improvement</h2>
          ${analysis.improvementAreas.map(area => `<div class="improvement">→ ${area}</div>`).join('')}
        </div>

        <div class="section">
          <h2>🚀 Improvement Roadmap</h2>
          ${analysis.improvementRoadmap.map((step, index) => `<div class="roadmap-item"><strong>Step ${index + 1}:</strong> ${step}</div>`).join('')}
        </div>

        <div class="section">
          <h2>📋 Question Analysis</h2>
          ${analysis.questionAnalysis.map((qa, index) => `
            <div class="question">
              <strong>Q${index + 1}:</strong> ${qa.question}<br>
              <div class="answer">Answer: ${qa.answer}</div>
              <div style="margin: 10px 0; font-size: 12px;">
                <span style="color: #374151;">Technical:</span> <span style="color: #2563eb; font-weight: bold;">${qa.scores.technicalAccuracy}/10</span> | 
                <span style="color: #374151;">Communication:</span> <span style="color: #2563eb; font-weight: bold;">${qa.scores.communicationClarity}/10</span> | 
                <span style="color: #374151;">Problem Solving:</span> <span style="color: #2563eb; font-weight: bold;">${qa.scores.problemSolving}/10</span>
              </div>
              <div class="feedback">Feedback: ${qa.feedback}</div>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h2>🎯 Interview Readiness</h2>
          <p style="color: #555;">${analysis.interviewReadiness}</p>
        </div>

        <div class="section">
          <h2>📄 Overall Feedback</h2>
          <p style="color: #555;">${analysis.overallFeedback}</p>
        </div>

        <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; color: #1f2937; font-weight: bold;">✅ This report was generated using Real Gemini AI Analysis</p>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 12px;">DSA Mock Interview System - Powered by Google Gemini</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

testGeminiAnalysis();