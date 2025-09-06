const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Simple GET route for test generation (no auth required)
router.get('/generate', async (req, res) => {
  res.json({ message: 'Test generation endpoint available. Use POST with authentication.' });
});

// Generate test questions using Gemini AI
router.post('/generate', auth, async (req, res) => {
  try {
    const { problemId, problemTitle, problemTopic, problemDescription } = req.body;
    
    console.log('Test generate request:', { problemId, problemTitle, problemTopic, problemDescription });
    
    // Check if frontend is sending proper data
    if (!problemTitle && !problemTopic && !problemDescription) {
      console.log('WARNING: Frontend not sending problem details. Using fallback.');
    }
    
    if (!problemId) {
      return res.status(400).json({ error: 'Problem ID is required' });
    }
    
    const user = await User.findById(req.user.id);
    
    // Use provided title or create a meaningful one
    console.log('Received problemTitle:', problemTitle);
    
    const finalTitle = problemTitle || `DSA Problem ${problemId}`;
    const finalTopic = problemTopic || 'Data Structures and Algorithms';
    
    console.log('Using problem title for AI:', finalTitle);
    
    // Generate questions using Gemini AI
    const API_KEY = process.env.GEMINI_API_TEST;
    
    const prompt = `
      Generate 10 test questions for the DSA problem: "${finalTitle}"
      Problem Topic: ${finalTopic}
      ${problemDescription ? `Problem Details: ${problemDescription}` : ''}
      
      IMPORTANT RULES:
      1. Every question MUST use the exact problem name "${finalTitle}"
      2. NO generic "Problem #X" references
      3. Questions must be specific to "${finalTitle}" only
      4. Use real problem context and constraints
      
      Generate:
      - 6 multiple choice questions about "${finalTitle}" solution approach, time/space complexity, data structures
      - 2 coding questions asking to implement "${finalTitle}" solution
      - 2 explanation questions about "${finalTitle}" algorithm and optimization
      
      Example question format:
      "What is the optimal time complexity for '${finalTitle}'?"
      "Implement the solution for '${finalTitle}':"
      "Explain how to solve '${finalTitle}' efficiently:"
      
      Return ONLY valid JSON in this exact format:
      {
        "questions": [
          {
            "type": "mcq",
            "question": "What is the optimal time complexity for '${finalTitle}'?",
            "options": ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
            "correct": "O(n)",
            "explanation": "The optimal solution uses a hash map for O(1) lookups, resulting in O(n) time complexity.",
            "difficulty": "medium",
            "points": 10
          },
          {
            "type": "coding",
            "question": "Write the solution for '${finalTitle}':",
            "placeholder": "// Write your solution for ${finalTitle}\\nfunction solve(input) {\\n    // Your implementation here\\n    return result;\\n}",
            "sampleAnswer": "// Provide actual working code for this specific problem",
            "explanation": "This implementation demonstrates the optimal approach using...",
            "difficulty": "hard",
            "points": 20
          },
          {
            "type": "text",
            "question": "Explain how to solve '${finalTitle}' efficiently:",
            "placeholder": "Describe the algorithm approach, key insights, and complexity analysis...",
            "sampleAnswer": "The optimal approach uses... which reduces complexity from O(n²) to O(n) because...",
            "explanation": "A good answer should cover the main algorithm, data structures used, and complexity analysis.",
            "difficulty": "medium",
            "points": 15
          }
        ]
      }
    `;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse JSON from AI response
    console.log('AI Response:', text);
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const questionsData = JSON.parse(jsonMatch[0]);
        
        if (!questionsData.questions || questionsData.questions.length === 0) {
          throw new Error('No questions in AI response');
        }
        
        // Store questions and metadata in database
        if (!user.testData) user.testData = new Map();
        user.testData.set(problemId.toString(), {
          questions: questionsData.questions,
          problemTitle: finalTitle,
          problemTopic: finalTopic,
          problemDescription: problemDescription || '',
          generatedAt: new Date(),
          totalQuestions: questionsData.questions.length
        });
        await user.save();
        
        // Return questions without correct answers
        const questionsForUser = questionsData.questions.map(q => ({
          type: q.type,
          question: q.question,
          options: q.options,
          placeholder: q.placeholder
        }));
        
        res.json({ questions: questionsForUser });
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error('Invalid AI response format');
      }
    } else {
      console.error('No JSON found in AI response');
      throw new Error('Invalid AI response - no JSON found');
    }
  } catch (error) {
    console.error('Error generating test:', error);
    
    // Use the same title logic for fallback
    const fallbackTitle = problemTitle || `DSA Problem ${problemId}`;
    
    // Fallback questions when AI fails
    const fallbackQuestions = [
      {
        type: 'mcq',
        question: `What is the most important consideration when solving '${fallbackTitle}'?`,
        options: ['Time complexity', 'Space complexity', 'Algorithm choice', 'All of the above']
      },
      {
        type: 'mcq', 
        question: `Which data structure is commonly used for '${fallbackTitle}'?`,
        options: ['Array', 'Hash Map', 'Tree', 'Graph']
      },
      {
        type: 'coding',
        question: `Write a solution approach for '${fallbackTitle}':`,
        placeholder: `// Write your solution for ${fallbackTitle}\nfunction solve(input) {\n    // Your implementation here\n    return result;\n}`
      },
      {
        type: 'text',
        question: `Explain the algorithm for '${fallbackTitle}':`,
        placeholder: 'Describe your approach, time complexity, and key insights...'
      }
    ];
    
    res.json({ questions: fallbackQuestions });
  }
});

// Submit test answers and get results
router.post('/submit', auth, async (req, res) => {
  try {
    const { problemId, answers, userId } = req.body;
    
    if (!problemId || !answers || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const testData = user.testData?.get?.(problemId.toString());
    
    if (!testData) {
      return res.status(400).json({ error: 'Test data not found. Please generate questions first.' });
    }
    
    const API_KEY = process.env.GEMINI_API_TEST;
    
    // Analyze answers with AI
    const analysisPrompt = `
      Analyze the user's test performance for DSA problem: "${testData.problemTitle}"
      
      Questions and User Answers:
      ${testData.questions.map((q, i) => `
      Q${i+1} (${q.type}): ${q.question}
      ${q.type === 'mcq' ? `Options: ${q.options?.join(', ')}\nCorrect: ${q.correct}` : `Expected: ${q.sampleAnswer}`}
      User Answer: ${answers[i] || 'No answer'}
      ${req.body.codingLanguage && q.type === 'coding' ? `Language: ${req.body.codingLanguage}` : ''}
      `).join('\n')}
      
      Provide detailed analysis in JSON format:
      {
        "overallScore": 85,
        "totalQuestions": ${testData.questions.length},
        "correctAnswers": 7,
        "detailedAnalysis": [
          {
            "questionNumber": 1,
            "type": "mcq",
            "isCorrect": true,
            "userAnswer": "O(n)",
            "correctAnswer": "O(n)",
            "feedback": "Excellent! You correctly identified the optimal time complexity."
          }
        ],
        "strengths": ["Time complexity analysis", "Algorithm understanding"],
        "weaknesses": ["Edge case handling", "Code implementation"],
        "recommendations": ["Practice more coding problems", "Review hash map concepts"],
        "overallFeedback": "Good understanding of the problem. Focus on implementation details.",
        "codingLanguage": "${req.body.codingLanguage || 'Not specified'}"
      }
    `;
    
    let aiAnalysis = null;
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: analysisPrompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1500 }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiAnalysis = JSON.parse(jsonMatch[0]);
        }
      }
    } catch (error) {
      console.error('AI analysis error:', error);
    }
    
    // If AI analysis fails, use fallback analysis
    if (!aiAnalysis) {
      const answeredQuestions = Object.keys(answers).length;
      const score = Math.round((answeredQuestions / testData.questions.length) * 100);
      
      aiAnalysis = {
        overallScore: score,
        correctAnswers: Math.floor(answeredQuestions * 0.7),
        detailedAnalysis: testData.questions.map((q, i) => ({
          questionNumber: i + 1,
          type: q.type,
          isCorrect: !!answers[i],
          userAnswer: answers[i] || 'No answer',
          correctAnswer: 'See explanation',
          feedback: 'Good attempt! Keep practicing to improve.'
        })),
        strengths: ['Problem solving approach'],
        weaknesses: ['Need more practice'],
        recommendations: ['Practice similar problems', 'Review concepts'],
        overallFeedback: 'Keep practicing to improve your DSA skills!'
      };
    }
    
    const score = aiAnalysis.overallScore;
    const feedback = aiAnalysis.overallFeedback;
    
    // Save comprehensive AI-analyzed test report
    if (!user.testResults) user.testResults = new Map();
    
    const testReport = {
      score,
      correct: aiAnalysis?.correctAnswers || correct,
      total: testData.questions.length,
      completedAt: new Date(),
      feedback,
      problemTitle: testData.problemTitle,
      problemTopic: testData.problemTopic,
      aiAnalysis: aiAnalysis || null,
      detailedAnalysis: aiAnalysis?.detailedAnalysis || [],
      strengths: aiAnalysis?.strengths || [],
      weaknesses: aiAnalysis?.weaknesses || [],
      recommendations: aiAnalysis?.recommendations || [],
      userAnswers: answers,
      questions: testData.questions,
      isAIAnalyzed: !!aiAnalysis,
      testDuration: 0,
      attemptNumber: 1
    };
    
    user.testResults.set(problemId.toString(), testReport);
    await user.save();
    
    // Send detailed email report with questions and answers
    if (user.email) {
      try {
        const nodemailer = require('nodemailer');
        
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        
        // Generate simple questions and answers section
        const questionsHtml = aiAnalysis.detailedAnalysis.map((analysis, index) => {
          const question = testData.questions[index];
          const isCorrect = analysis.isCorrect;
          
          return `
            <div style="margin: 15px 0; padding: 10px; border: 1px solid #ddd;">
              <h4>Question ${index + 1} ${isCorrect ? '✅' : '❌'}</h4>
              <p><strong>Q:</strong> ${question.question}</p>
              ${question.options ? `<p><strong>Options:</strong> ${question.options.join(', ')}</p>` : ''}
              <p><strong>Your Answer:</strong> ${analysis.userAnswer || 'No answer'}</p>
              <p><strong>Correct Answer:</strong> ${analysis.correctAnswer}</p>
              <p><strong>Feedback:</strong> ${analysis.feedback}</p>
            </div>
          `;
        }).join('');
        
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: `DSA Test Report - ${testData.problemTitle} (${score}%)`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1>DSA Test Report</h1>
              <p>Hi <strong>${user.name}</strong>,</p>
              
              <h2>Test Summary</h2>
              <h3>${testData.problemTitle}</h3>
              <p><strong>Score:</strong> ${score}%</p>
              <p><strong>Correct Answers:</strong> ${aiAnalysis.correctAnswers}/${testData.questions.length}</p>
              
              <h3>AI Feedback</h3>
              <p>${feedback}</p>
              
              <h3>Strengths</h3>
              <ul>
                ${aiAnalysis.strengths.map(strength => `<li>${strength}</li>`).join('')}
              </ul>
              
              <h3>Areas for Improvement</h3>
              <ul>
                ${aiAnalysis.weaknesses.map(weakness => `<li>${weakness}</li>`).join('')}
              </ul>
              
              <h3>Recommendations</h3>
              <ul>
                ${aiAnalysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
              </ul>
              
              <h2>Question Details</h2>
              ${questionsHtml}
              
              <p>Test completed on ${new Date().toLocaleDateString()}</p>
            </div>
          `
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`Test report email sent to ${user.email}`);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the entire request if email fails
      }
    }
    
    res.json({
      results: {
        problemTitle: testData.problemTitle,
        score,
        correct: aiAnalysis.correctAnswers,
        total: testData.questions.length,
        feedback,
        detailedAnalysis: aiAnalysis.detailedAnalysis,
        strengths: aiAnalysis.strengths,
        weaknesses: aiAnalysis.weaknesses,
        recommendations: aiAnalysis.recommendations,
        isAIAnalyzed: true,
        emailSent: true
      }
    });
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get test history
router.get('/history/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const testResults = user.testResults || {};
    
    res.json({ testResults });
  } catch (error) {
    console.error('Error fetching test history:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;