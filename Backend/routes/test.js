const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const nodemailer = require('nodemailer');
const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_TEST);
console.log('🔑 Gemini API Key configured:', process.env.GEMINI_API_TEST ? 'YES' : 'NO');

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test generation endpoint with AI
router.post('/generate', async (req, res) => {
  try {
    const { problemId, problemTitle, problemTopic } = req.body;
    
    if (!process.env.GEMINI_API_TEST) {
      return res.status(500).json({
        success: false,
        message: 'AI service not configured'
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Generate 8 questions about the problem: "${problemTitle || 'DSA Problem'}" in topic: ${problemTopic || 'Data Structures and Algorithms'}.

6 Multiple Choice Questions (MCQ) and 2 Text Answer Questions.

Return ONLY a JSON array with this exact structure:
[{
  "type": "mcq",
  "question": "What is the optimal time complexity for this problem?",
  "options": ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
  "correctAnswer": 1,
  "explanation": "The optimal solution requires O(n log n) time complexity."
},
{
  "type": "text",
  "question": "Explain the main approach to solve this problem in 2-3 sentences:",
  "correctAnswer": "Use sorting and two pointers technique",
  "explanation": "The key approach involves sorting the array first, then using two pointers to find the solution efficiently."
}]`;

    console.log('🤖 Generating questions for:', problemTitle);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('✅ Gemini response length:', text.length);
    
    // Extract JSON from response
    let questions;
    try {
      const cleanText = text.replace(/```json\n?|```\n?/g, '').trim();
      const jsonMatch = cleanText.match(/\[.*\]/s);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
        console.log('✅ Parsed', questions.length, 'real questions from Gemini');
      } else {
        throw new Error('No JSON found');
      }
    } catch (parseError) {
      console.log('❌ Parsing failed, using fallback');
      throw parseError;
    }

    // Add IDs to questions
    questions = questions.map((q, i) => ({ ...q, id: i + 1 }));

    res.json({
      success: true,
      questions,
      message: 'Real AI questions generated successfully'
    });
  } catch (error) {
    console.error('❌ Gemini failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate questions'
    });
  }
});

// Test submission endpoint
router.post('/submit', async (req, res) => {
  try {
    const { problemId, answers, userId, questions, problemTitle } = req.body;
    
    if (!answers || !questions) {
      return res.status(400).json({
        success: false,
        message: 'Missing answers or questions'
      });
    }
    
    console.log('📊 Processing test submission with', questions.length, 'real questions');
    
    // Get user email
    const User = require('../models/User');
    let userEmail = null;
    try {
      const user = await User.findById(userId);
      userEmail = user?.email;
    } catch (err) {
      console.log('Could not fetch user email:', err.message);
    }
    
    // Calculate score using REAL questions (MCQ + Text)
    let correctAnswers = 0;
    const results = questions.map((question, index) => {
      const userAnswer = answers[index];
      let isCorrect = false;
      
      if (question.type === 'mcq') {
        isCorrect = userAnswer === question.correctAnswer;
      } else if (question.type === 'text') {
        // Text answer scoring - check if answer contains key terms
        const answer = (userAnswer || '').toLowerCase();
        const correctTerms = (question.correctAnswer || '').toLowerCase();
        const keyWords = correctTerms.split(' ').filter(word => word.length > 3);
        isCorrect = answer.length > 10 && keyWords.some(word => answer.includes(word));
      }
      
      if (isCorrect) correctAnswers++;
      
      return {
        question: question.question,
        userAnswer: userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
        options: question.options,
        type: question.type
      };
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    console.log('✅ Real score calculated:', score + '%', `(${correctAnswers}/${questions.length})`);
    
    // Generate AI analysis of performance
    let aiAnalysis = '';
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const analysisPrompt = `Analyze this test performance:

Score: ${score}% (${correctAnswers}/${questions.length} correct)

Questions and answers:
${results.map((r, i) => `Q${i+1}: ${r.question}\nUser answered: ${r.options?.[r.userAnswer] || 'No answer'}\nCorrect: ${r.isCorrect ? 'YES' : 'NO'}`).join('\n\n')}

Provide a personalized 2-3 sentence analysis of strengths, weaknesses, and specific improvement suggestions.`;
      
      const analysisResult = await model.generateContent(analysisPrompt);
      const analysisResponse = await analysisResult.response;
      aiAnalysis = analysisResponse.text().trim();
      console.log('🤖 AI analysis generated');
    } catch (analysisError) {
      console.log('❌ AI analysis failed:', analysisError.message);
      aiAnalysis = score >= 70 ? 'Excellent work! You have a strong understanding of the concepts.' : score >= 50 ? 'Good job! Review the incorrect answers to improve further.' : 'Keep practicing! Focus on understanding the core concepts.';
    }
    
    // Save to database
    try {
      const TestResult = require('../models/TestResult');
      const testResult = new TestResult({
        userId,
        problemId,
        score,
        correctAnswers,
        totalQuestions: questions.length,
        answers,
        results,
        aiAnalysis,
        completedAt: new Date()
      });
      await testResult.save();
    } catch (dbError) {
      console.error('Failed to save test result:', dbError);
    }
    
    // Send email with real data
    if (userEmail && process.env.EMAIL_USER) {
      try {
        const emailHtml = `
<html>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
        
        <h2 style="text-align: center; color: #333; margin-bottom: 20px;">🎯 DSA Test Results</h2>
        <p style="text-align: center; color: #666; margin-bottom: 30px;">${problemTitle || `Problem #${problemId}`}</p>
        
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 48px; font-weight: bold; color: ${score >= 70 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'}; margin-bottom: 10px;">${score}%</div>
            <div style="color: #666;">${correctAnswers}/${questions.length} correct • ${score >= 70 ? 'Excellent!' : score >= 50 ? 'Good Job!' : 'Keep Practicing!'}</div>
        </div>
        
        <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 10px 0; color: #333;">🤖 AI Analysis</h3>
            <p style="margin: 0; color: #555; line-height: 1.5;">${aiAnalysis}</p>
        </div>
        
        <h3 style="color: #333; margin-bottom: 20px;">📋 Questions & Answers</h3>
        
        ${results.map((result, i) => `
            <div style="margin-bottom: 25px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 6px; background: #fafafa;">
                <h4 style="margin: 0 0 15px 0; color: #333;">Q${i + 1}: ${result.question}</h4>
                
                ${result.type === 'mcq' && result.options ? `
                    ${result.options.map((option, idx) => `
                        <div style="margin: 5px 0; padding: 8px; border-radius: 4px; ${idx === result.userAnswer ? (result.isCorrect ? 'background: #dcfce7; border: 1px solid #22c55e;' : 'background: #fee2e2; border: 1px solid #ef4444;') : (idx === result.correctAnswer ? 'background: #dcfce7; border: 1px solid #22c55e;' : 'background: white; border: 1px solid #d1d5db;')}">
                            ${String.fromCharCode(65 + idx)}. ${option}
                            ${idx === result.userAnswer ? ' ← Your Choice' : ''}
                            ${idx === result.correctAnswer ? ' ← Correct' : ''}
                        </div>
                    `).join('')}
                ` : ''}
                
                ${result.type === 'text' ? `
                    <div style="margin: 10px 0;">
                        <strong>Your Answer:</strong><br>
                        <div style="padding: 10px; background: ${result.isCorrect ? '#dcfce7' : '#fee2e2'}; border-radius: 4px; margin: 5px 0;">${result.userAnswer || 'No answer'}</div>
                        <strong>Expected:</strong><br>
                        <div style="padding: 10px; background: #dcfce7; border-radius: 4px; margin: 5px 0;">${result.correctAnswer}</div>
                    </div>
                ` : ''}
                
                <div style="margin-top: 10px; font-weight: bold; color: ${result.isCorrect ? '#22c55e' : '#ef4444'};">
                    ${result.isCorrect ? '✅ CORRECT' : '❌ INCORRECT'}
                </div>
                
                ${result.explanation ? `<div style="margin-top: 10px; padding: 10px; background: #e0f2fe; border-radius: 4px; color: #0369a1; font-size: 14px;"><strong>💡 Explanation:</strong> ${result.explanation}</div>` : ''}
            </div>
        `).join('')}
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666;">
            DSA Sheet - Apna College<br>
            Keep practicing to improve your skills!
        </div>
    </div>
</body>
</html>`;

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: userEmail,
          subject: `🎯 Real AI Test Results: ${score}% Score | Problem #${problemId} | DSA Sheet`,
          html: emailHtml
        });
        
        console.log('📧 Real test results emailed to:', userEmail);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    }

    res.json({
      success: true,
      score,
      correct: correctAnswers,
      totalQuestions: questions.length,
      results,
      feedback: aiAnalysis,
      message: 'Real test completed with AI analysis'
    });
  } catch (error) {
    console.error('Test submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit test'
    });
  }
});

module.exports = router;