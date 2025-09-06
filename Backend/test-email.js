require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Sample analysis data
const formData = {
  name: "Test User",
  position: "Software Engineer", 
  companyName: "Google"
};

const analysis = {
  overallScore: 78,
  questionAnalysis: [
    {
      question: "Explain React hooks and their benefits",
      answer: "React hooks are functions that allow you to use state and lifecycle methods in functional components. They make code more reusable and easier to test.",
      scores: {
        technicalAccuracy: 8,
        communicationClarity: 7,
        problemSolving: 7,
        depthOfKnowledge: 8,
        practicalExperience: 6,
        confidenceLevel: 8,
        structureOrganization: 7,
        relevanceToRole: 9,
        innovationCreativity: 6,
        professionalMaturity: 7
      },
      feedback: "Good understanding of React hooks with clear explanation. Could improve with more practical examples."
    },
    {
      question: "How would you optimize a slow React application?",
      answer: "I would use React.memo for component memoization, useMemo and useCallback for expensive calculations, implement code splitting with lazy loading, and use React DevTools to identify performance bottlenecks.",
      scores: {
        technicalAccuracy: 9,
        communicationClarity: 8,
        problemSolving: 8,
        depthOfKnowledge: 8,
        practicalExperience: 7,
        confidenceLevel: 8,
        structureOrganization: 8,
        relevanceToRole: 9,
        innovationCreativity: 7,
        professionalMaturity: 8
      },
      feedback: "Excellent technical knowledge and practical approach to performance optimization."
    }
  ],
  strengths: ["Strong React knowledge", "Good problem-solving approach", "Clear communication"],
  improvementAreas: ["More practical examples", "System design concepts"],
  salaryPrediction: {
    range: "₹12-18 LPA",
    reasoning: "Based on strong technical skills and 2-3 years experience level"
  },
  improvementRoadmap: ["Practice system design questions", "Work on more React projects", "Learn advanced performance optimization"],
  interviewReadiness: "Good - Ready for mid-level Software Engineer interviews at Google",
  overallFeedback: "Strong technical foundation with good communication skills. Focus on practical examples and system design for senior roles."
};

// Generate email HTML
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

const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; }
    h1 { color: #1E90FF; text-align: center; }
    h2 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
    h3 { color: #555; }
    .score { font-size: 24px; font-weight: bold; color: #1E90FF; text-align: center; }
    .section { margin: 20px 0; }
    .param { margin: 10px 0; }
    .param-name { color: #666; font-size: 14px; }
    .param-score { color: #1E90FF; font-weight: bold; }
    .strength { color: #059669; }
    .improvement { color: #dc2626; }
    .salary { color: #059669; font-weight: bold; font-size: 18px; text-align: center; }
    .question { margin: 15px 0; padding: 10px; background: #f9f9f9; }
    .answer { color: #666; font-size: 14px; }
    .feedback { color: #555; font-style: italic; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Mock Interview Report</h1>
    <p style="text-align: center; color: #666;">${formData.name} • ${formData.position} at ${formData.companyName}</p>
    
    <div class="score">Overall Score: ${analysis.overallScore}/100</div>
    
    <div class="section">
      <h2>Parameter Scores</h2>
      ${Object.entries(avgScores).map(([param, score]) => `
        <div class="param">
          <span class="param-name">${parameterNames[param]}:</span> 
          <span class="param-score">${score}/10</span>
        </div>
      `).join('')}
    </div>

    <div class="section">
      <h2>Salary Prediction</h2>
      <div class="salary">${analysis.salaryPrediction.range}</div>
      <p style="color: #666;">${analysis.salaryPrediction.reasoning}</p>
    </div>

    <div class="section">
      <h2>Strengths</h2>
      ${analysis.strengths.map(strength => `<div class="strength">• ${strength}</div>`).join('')}
    </div>

    <div class="section">
      <h2>Areas for Improvement</h2>
      ${analysis.improvementAreas.map(area => `<div class="improvement">• ${area}</div>`).join('')}
    </div>

    <div class="section">
      <h2>Improvement Roadmap</h2>
      ${analysis.improvementRoadmap.map((step, index) => `<div><strong>${index + 1}.</strong> ${step}</div>`).join('')}
    </div>

    <div class="section">
      <h2>Question Analysis</h2>
      ${analysis.questionAnalysis.map((qa, index) => `
        <div class="question">
          <strong>Q${index + 1}:</strong> ${qa.question}<br>
          <div class="answer">Answer: ${qa.answer}</div>
          <div style="margin: 10px 0;">
            <span class="param-name">Technical:</span> <span class="param-score">${qa.scores.technicalAccuracy}/10</span> | 
            <span class="param-name">Communication:</span> <span class="param-score">${qa.scores.communicationClarity}/10</span> | 
            <span class="param-name">Problem Solving:</span> <span class="param-score">${qa.scores.problemSolving}/10</span><br>
            <span class="param-name">Knowledge:</span> <span class="param-score">${qa.scores.depthOfKnowledge}/10</span> | 
            <span class="param-name">Experience:</span> <span class="param-score">${qa.scores.practicalExperience}/10</span> | 
            <span class="param-name">Confidence:</span> <span class="param-score">${qa.scores.confidenceLevel}/10</span><br>
            <span class="param-name">Structure:</span> <span class="param-score">${qa.scores.structureOrganization}/10</span> | 
            <span class="param-name">Relevance:</span> <span class="param-score">${qa.scores.relevanceToRole}/10</span> | 
            <span class="param-name">Innovation:</span> <span class="param-score">${qa.scores.innovationCreativity}/10</span> | 
            <span class="param-name">Maturity:</span> <span class="param-score">${qa.scores.professionalMaturity}/10</span>
          </div>
          <div class="feedback">Feedback: ${qa.feedback}</div>
        </div>
      `).join('')}
    </div>

    <div class="section">
      <h2>Interview Readiness</h2>
      <p style="color: #555;">${analysis.interviewReadiness}</p>
    </div>

    <div class="section">
      <h2>Overall Feedback</h2>
      <p style="color: #555;">${analysis.overallFeedback}</p>
    </div>

    <p style="text-align: center; color: #666; margin-top: 30px;">DSA Mock Interview System</p>
  </div>
</body>
</html>
`;

async function sendTestEmail() {
  try {
    console.log('📧 Sending test email...');
    
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'shivamsharma27107@gmail.com', // Your email
      subject: '🎯 Test Mock Interview Report - Minimal Design',
      html: emailHTML
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
    
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

sendTestEmail();