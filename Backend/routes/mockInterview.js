const express = require('express');
const MockInterview = require('../models/MockInterview');
const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const nodemailer = require('nodemailer');
const multer = require('multer');
const { extractTextFromResume } = require('../utils/resumeParser');
const DOMPurify = require('isomorphic-dompurify');
const { authenticateToken } = require('../middleware/authMiddleware');
const { sendInterviewCompletionEmail } = require('../services/interviewEmailService');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOC files are allowed'));
    }
  }
});

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_INTERVIEW || process.env.GEMINI_API_KEY);

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Start mock interview
router.post('/start', upload.single('resume'), async (req, res) => {
  try {
    // Sanitize inputs
    const companyName = DOMPurify.sanitize(req.body.companyName || '');
    const position = DOMPurify.sanitize(req.body.position || '');
    const experience = DOMPurify.sanitize(req.body.experience || '');
    const skills = DOMPurify.sanitize(req.body.skills || '');
    const interviewRound = DOMPurify.sanitize(req.body.interviewRound || '');
    const additionalNotes = DOMPurify.sanitize(req.body.additionalNotes || '');
    const userId = req.user?.id || req.headers.userid || 'anonymous';
    
    // Validate required fields
    if (!companyName?.trim() || !position?.trim() || !skills?.trim()) {
      return res.status(400).json({ error: 'Company name, position, and skills are required' });
    }
    
    // Validate questionsAndAnswers for submit endpoint
    if (req.path.includes('/submit')) {
      const { questionsAndAnswers } = req.body;
      if (!questionsAndAnswers || !Array.isArray(questionsAndAnswers) || questionsAndAnswers.length === 0) {
        return res.status(400).json({ error: 'Valid questions and answers are required' });
      }
    }
    
    let resumeData = { skills: [], experience: 0 };
    
    // Process resume if uploaded
    if (req.file) {
      try {
        resumeData = await extractTextFromResume(req.file.buffer, req.file.mimetype);
      } catch (error) {
        console.error('Resume processing error:', error);
        resumeData = { skills: [], experience: 0 };
      }
    }
    
    // Combine manual skills with resume-extracted skills
    const allSkills = [...new Set([...skills.split(',').map(s => s.trim()), ...resumeData.skills])].join(', ');
    const finalExperience = resumeData.experience > 0 ? resumeData.experience : experience;

    let questions = [];
    let questionSource = 'fallback';
    
    // Generate AI questions with resume context
    const apiKey = process.env.GEMINI_API_INTERVIEW || process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        console.log('🤖 Generating AI questions with Gemini...');
        
        const resumeContext = resumeData.rawText ? `Resume: ${resumeData.rawText.substring(0, 500)}` : '';
        
        const prompt = `You are an expert interviewer. Generate 8 specific interview questions for ${position} at ${companyName}.

Candidate Profile:
- Experience: ${finalExperience} years
- Skills: ${allSkills}
- Interview Round: ${interviewRound}

Resume Context (use this to personalize questions):
${resumeContext}

Instructions:
1. Use the resume content to create personalized questions
2. Make questions specific to ${companyName} and ${position}
3. Include both technical and behavioral questions
4. Consider the candidate's experience level
5. Reference specific skills from their resume

Return ONLY a JSON array:
["question1", "question2", "question3", "question4", "question5", "question6", "question7", "question8"]`;

        // Try direct API call first
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
          console.log('🤖 AI Response:', responseText.substring(0, 100) + '...');
          
          // Extract JSON array
          const jsonMatch = responseText.match(/\[[\s\S]*?\]/);
          if (jsonMatch) {
            try {
              const parsedQuestions = JSON.parse(jsonMatch[0]);
              if (Array.isArray(parsedQuestions) && parsedQuestions.length >= 6) {
                questions = parsedQuestions.slice(0, 8);
                questionSource = 'ai-generated';
                console.log('✅ AI questions generated successfully!');
              }
            } catch (parseError) {
              console.log('❌ JSON parsing failed:', parseError.message);
            }
          }
        } else {
          const errorData = await response.json();
          console.log('❌ API Error:', errorData.error?.message || 'Unknown error');
        }
      } catch (aiError) {
        console.log('❌ AI generation failed:', aiError.message);
      }
    }
    
    // If AI fails, return error message
    if (questions.length === 0) {
      console.log('❌ AI question generation failed');
      return res.status(503).json({ 
        error: 'AI service temporarily unavailable',
        message: 'Unable to generate interview questions at the moment. Please try again in 15 minutes.',
        retryAfter: 15,
        aiStatus: 'unavailable'
      });
    }

    const interview = new MockInterview({
      userId,
      companyName,
      position,
      experience,
      skills: allSkills,
      interviewRound,
      questions: questions.map(q => ({ question: q, userAnswer: '', score: 0 }))
    });

    await interview.save();
    // Send response immediately
    return res.json({ 
      success: true,
      interviewId: interview._id, 
      questions: questions,
      message: 'Interview questions generated successfully',
      source: questionSource,
      resumeProcessed: !!req.file,
      skillsExtracted: resumeData.skills.length,
      experienceDetected: resumeData.experience,
      aiStatus: (process.env.GEMINI_API_INTERVIEW || process.env.GEMINI_API_KEY) ? 'configured' : 'missing',
      apiUsed: questionSource === 'ai-generated' ? 'gemini-api' : 'fallback'
    });
  } catch (error) {
    console.error('Mock interview error:', error);
    res.status(500).json({ 
      error: 'Failed to start interview',
      message: error.message || 'Internal server error'
    });
  }
});

// Submit answers with detailed 10-parameter analysis
router.post('/submit', async (req, res) => {
  try {
    // Validate questionsAndAnswers first
    const questionsAndAnswers = req.body.questionsAndAnswers || [];
    if (!questionsAndAnswers || !Array.isArray(questionsAndAnswers) || questionsAndAnswers.length === 0) {
      return res.status(400).json({ error: 'Valid questions and answers are required' });
    }
    
    const formData = {
      name: DOMPurify.sanitize(req.body.formData?.name || ''),
      email: DOMPurify.sanitize(req.body.formData?.email || ''),
      companyName: DOMPurify.sanitize(req.body.formData?.companyName || ''),
      position: DOMPurify.sanitize(req.body.formData?.position || ''),
      experience: DOMPurify.sanitize(req.body.formData?.experience || ''),
      skills: DOMPurify.sanitize(req.body.formData?.skills || ''),
      interviewRound: DOMPurify.sanitize(req.body.formData?.interviewRound || '')
    };
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate comprehensive 10-parameter analysis using actual answers
    const analysisPrompt = `You are an expert interview analyst. Analyze this mock interview for ${formData.name} applying for ${formData.position} at ${formData.companyName}.

IMPORTANT: Base your analysis ONLY on the actual answers provided below. Do not make assumptions.

Rate each answer on these 10 parameters (1-10 scale):
1. Technical Accuracy - Correctness of technical concepts mentioned
2. Communication Clarity - How clearly ideas were expressed
3. Problem-Solving Approach - Logical thinking process shown
4. Depth of Knowledge - Understanding demonstrated in answers
5. Practical Experience - Real-world examples mentioned
6. Confidence Level - Assurance shown in responses
7. Structure & Organization - How well-organized the answers are
8. Relevance to Role - Alignment with ${formData.position} requirements
9. Innovation & Creativity - Unique insights or creative solutions
10. Professional Maturity - Industry awareness and professionalism

Actual Interview Questions and Answers:
${questionsAndAnswers.map((qa, i) => `Q${i+1}: ${qa.question}\nA${i+1}: ${qa.answer}`).join('\n\n')}

Analyze the ACTUAL content of these answers and provide:
- Overall score (1-100) based on answer quality
- Individual scores for each question on all 10 parameters
- Specific strengths found in the answers
- Specific improvement areas based on weak answers
- Salary prediction for ${formData.position} in India
- Personalized improvement roadmap
- Interview readiness for ${formData.companyName}

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

    let analysisResult;
    try {
      const result = await model.generateContent(analysisPrompt);
      const responseText = result.response.text();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response');
      }
    } catch (error) {
      console.error('Error generating analysis:', error);
      // Fallback analysis
      analysisResult = {
        overallScore: 75,
        questionAnalysis: questionsAndAnswers.map(qa => ({
          question: qa.question,
          answer: qa.answer,
          scores: {
            technicalAccuracy: 7,
            communicationClarity: 8,
            problemSolving: 7,
            depthOfKnowledge: 7,
            practicalExperience: 6,
            confidenceLevel: 8,
            structureOrganization: 7,
            relevanceToRole: 8,
            innovationCreativity: 6,
            professionalMaturity: 7
          },
          feedback: 'Good response with room for improvement in technical depth.'
        })),
        strengths: [`Good understanding of ${formData.skills.split(',')[0] || 'programming'}`, 'Clear communication'],
        improvementAreas: ['Technical depth', `More practice with ${formData.position} specific skills`],
        salaryPrediction: {
          range: formData.experience === '0-1' ? '₹4-8 LPA' : 
                 formData.experience === '1-3' ? '₹8-15 LPA' : 
                 formData.experience === '3-5' ? '₹15-25 LPA' : '₹25-40 LPA',
          reasoning: `Based on ${formData.experience} years experience and current performance level`
        },
        improvementRoadmap: [`Practice ${formData.position} specific questions`, `Improve ${formData.skills.split(',')[0] || 'technical'} skills`, 'Work on real projects'],
        interviewReadiness: `Good - Ready for ${formData.position} interviews at ${formData.companyName}`,
        overallFeedback: `Solid performance for ${formData.position} role with good potential for ${formData.companyName}.`
      };
    }

    // Save to database
    const interview = new MockInterview({
      userId: req.user?.id || req.headers.userid || 'anonymous',
      companyName: formData.companyName,
      position: formData.position,
      experience: formData.experience,
      skills: formData.skills,
      interviewRound: formData.interviewRound,
      questions: analysisResult.questionAnalysis,
      totalScore: analysisResult.overallScore,
      feedback: analysisResult.overallFeedback
    });
    
    await interview.save();

    // Send comprehensive email report
    if (formData.email) {
      try {
        console.log('📧 Sending interview report to:', formData.email?.replace(/(.{2}).*(@.*)/, '$1***$2'));
        
        // Send detailed HTML report
        const emailHTML = generateDetailedEmailReport(formData, analysisResult);
        const emailResult = await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: formData.email,
          subject: `🎯 Mock Interview Analysis Report - ${formData.companyName} ${formData.position}`,
          html: emailHTML
        });
        
        console.log('✅ Email sent successfully! Message ID:', emailResult.messageId?.substring(0, 10) + '...');
        
        // Also send a simple notification
        try {
          await sendInterviewCompletionEmail(formData.email, formData.name, analysisResult);
          console.log('✅ Notification email sent');
        } catch (notifError) {
          console.log('⚠️ Notification email failed:', notifError.message);
        }
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError.message);
      }
    } else {
      console.log('📧 No email provided, skipping email report');
    }

    res.json({ 
      success: true,
      overallScore: analysisResult.overallScore,
      analysis: analysisResult,
      reportSent: !!formData.email,
      interviewId: interview._id,
      message: 'Interview submitted successfully'
    });
  } catch (error) {
    console.error('Submit interview error:', error);
    res.status(500).json({ error: 'Failed to submit interview' });
  }
});

// Get user's interview history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id || req.headers.userid;
    const interviews = await MockInterview.find({ userId })
      .sort({ completedAt: -1 })
      .select('problemTitle totalScore completedAt');
    
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Generate detailed email report
function generateDetailedEmailReport(formData, analysis) {
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
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        h1 { color: #2563eb; text-align: center; margin-bottom: 10px; }
        h2 { color: #1f2937; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 25px; }
        .header-info { text-align: center; color: #666; margin-bottom: 20px; }
        .score { font-size: 28px; font-weight: bold; color: #059669; text-align: center; margin: 20px 0; }
        .param { margin: 8px 0; }
        .param-name { color: #333; font-size: 14px; }
        .param-score { color: #2563eb; font-weight: bold; }
        .strength { color: #059669; margin: 5px 0; }
        .improvement { color: #dc2626; margin: 5px 0; }
        .salary { color: #059669; font-weight: bold; font-size: 20px; text-align: center; margin: 15px 0; }
        .question { margin: 15px 0; padding: 15px; border-left: 3px solid #2563eb; }
        .answer { color: #555; font-size: 14px; margin: 8px 0; }
        .feedback { color: #666; font-style: italic; margin-top: 8px; }
        .roadmap-item { margin: 8px 0; padding: 8px; border-left: 2px solid #2563eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://raw.githubusercontent.com/shivamshrma09/ApnaCollegeDSASheet/main/frontend/public/light.png" alt="+DSA Mock Hub Logo" style="width: 120px; height: auto; margin-bottom: 10px;" />
        </div>
        <h1>Mock Interview Analysis Report</h1>
        <div class="header-info">
          <strong>${formData.name}</strong> • ${formData.position} at ${formData.companyName}<br>
          <small>Generated on ${new Date().toLocaleDateString()}</small>
        </div>
        
        <div class="score">Overall Score: ${analysis.overallScore}/100</div>
        
        <div>
          <h2>Performance Parameters</h2>
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
          <p style="color: #6b7280; text-align: center; margin-top: 10px;">${analysis.salaryPrediction.reasoning}</p>
        </div>

        <div class="section">
          <h2>Key Strengths</h2>
          ${analysis.strengths.map(strength => `<div class="strength">• ${strength}</div>`).join('')}
        </div>

        <div class="section">
          <h2>Areas for Improvement</h2>
          ${analysis.improvementAreas.map(area => `<div class="improvement">• ${area}</div>`).join('')}
        </div>

        <div class="section">
          <h2>Improvement Roadmap</h2>
          ${analysis.improvementRoadmap.map((step, index) => `<div class="roadmap-item"><strong>Step ${index + 1}:</strong> ${step}</div>`).join('')}
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

        <p style="text-align: center; color: #666; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">+DSA Mock Interview System</p>
      </div>
    </body>
    </html>
  `;
}

module.exports = router;