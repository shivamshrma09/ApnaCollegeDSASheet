const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Rate limiting and caching
const apiCallCache = new Map();
const lastApiCall = new Map();
const API_COOLDOWN = 300000; // 5 minute cooldown between API calls per user

// Get AI recommendations based on user performance
router.get('/recommendations/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Collect user performance data
    const testResults = user.testResults || new Map();
    const completedProblems = user.completedProblems || [];
    const problemTimers = user.problemTimers || [];
    
    // Calculate performance metrics
    const totalTests = Array.from(testResults.values()).length;
    const avgScore = totalTests > 0 
      ? Array.from(testResults.values()).reduce((sum, test) => sum + test.score, 0) / totalTests 
      : 0;
    
    const totalTime = problemTimers.reduce((sum, timer) => sum + (timer.timeSpent || 0), 0);
    const avgTimePerProblem = problemTimers.length > 0 ? totalTime / problemTimers.length : 0;

    // Check rate limiting
    const userId = req.params.userId;
    const now = Date.now();
    const lastCall = lastApiCall.get(`rec_${userId}`) || 0;
    
    if (now - lastCall < API_COOLDOWN) {
      const cached = apiCallCache.get(`rec_${userId}`);
      if (cached) {
        return res.json(cached);
      }
      throw new Error('Rate limited');
    }
    
    // Skip AI API call - use fallback only
    throw new Error('Using fallback only');

    const prompt = `
      Analyze this user's DSA performance and provide personalized recommendations:
      
      User Performance Data:
      - Total Problems Solved: ${completedProblems.length}
      - Total Tests Taken: ${totalTests}
      - Average Test Score: ${avgScore.toFixed(1)}%
      - Average Time Per Problem: ${Math.round(avgTimePerProblem / 60)} minutes
      - Test Results: ${JSON.stringify(Array.from(testResults.values()).slice(-5))}
      
      Provide recommendations in JSON format:
      {
        "dailyGoalStatus": "completed" or "pending",
        "motivation": "Encouraging message based on performance",
        "recommendations": [
          {
            "type": "practice",
            "title": "Focus Area",
            "description": "Specific recommendation",
            "difficulty": "easy/medium/hard"
          }
        ],
        "nextSteps": "What to do next",
        "strengths": ["Strong areas"],
        "improvements": ["Areas to improve"]
      }
      
      Be encouraging and specific based on their actual performance data.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse AI response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const recommendations = JSON.parse(jsonMatch[0]);
      apiCallCache.set(`rec_${userId}`, recommendations);
      res.json(recommendations);
    } else {
      // Fallback recommendations
      res.json({
        dailyGoalStatus: completedProblems.length >= 3 ? "completed" : "pending",
        motivation: "🎉 Keep up the great work! Every problem solved makes you stronger.",
        recommendations: [
          {
            type: "practice",
            title: "Arrays & Hashing",
            description: "Practice fundamental array problems to build strong foundation",
            difficulty: "easy"
          }
        ],
        nextSteps: "Continue solving problems consistently",
        strengths: ["Problem Solving"],
        improvements: ["Time Management"]
      });
    }
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get weakness analysis
router.get('/weakness-analysis/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const testResults = user.testResults || new Map();
    const testData = Array.from(testResults.values());

    if (testData.length === 0) {
      return res.json({
        status: "no_data",
        message: "No test data available for analysis",
        weakAreas: [],
        strongAreas: [],
        recommendations: []
      });
    }
    
    // Check rate limiting for weakness analysis
    const userId = req.params.userId;
    const now = Date.now();
    const lastCall = lastApiCall.get(`weak_${userId}`) || 0;
    
    if (now - lastCall < API_COOLDOWN) {
      const cached = apiCallCache.get(`weak_${userId}`);
      if (cached) {
        return res.json(cached);
      }
      throw new Error('Rate limited');
    }
    
    // Skip AI API call - use fallback only
    throw new Error('Using fallback only');

    // Analyze weak areas from test results
    const allWeakAreas = testData.flatMap(test => test.weakAreas || []);
    const allStrongAreas = testData.flatMap(test => test.strongAreas || []);
    
    const weaknessCount = {};
    allWeakAreas.forEach(area => {
      weaknessCount[area] = (weaknessCount[area] || 0) + 1;
    });

    const genAI = new GoogleGenerativeAI('AIzaSyCUolZR1CqqjCZHhfysvhsq2UxQBKOjtAM');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Analyze user's weakness patterns from test data:
      
      Weak Areas: ${JSON.stringify(weaknessCount)}
      Strong Areas: ${JSON.stringify(allStrongAreas)}
      Test Performance: ${JSON.stringify(testData.map(t => ({ score: t.score, topic: t.problemTopic })))}
      
      Provide analysis in JSON format:
      {
        "status": "analysis_complete",
        "message": "Analysis summary",
        "weakAreas": [
          {
            "topic": "Topic name",
            "frequency": 3,
            "severity": "high/medium/low",
            "recommendation": "Specific advice"
          }
        ],
        "strongAreas": ["Strong topics"],
        "overallPerformance": "excellent/good/needs_improvement",
        "focusRecommendations": ["What to focus on"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      
      apiCallCache.set(`weak_${userId}`, analysis);
      
      // Save analysis to user profile
      user.weaknessAnalysis = {
        ...user.weaknessAnalysis,
        lastAnalysis: analysis,
        analyzedAt: new Date()
      };
      await user.save();
      
      res.json(analysis);
    } else {
      res.json({
        status: "analysis_complete",
        message: "Great Job! No Major Weak Areas Found",
        weakAreas: [],
        strongAreas: allStrongAreas,
        overallPerformance: "good",
        focusRecommendations: ["Continue practicing consistently"]
      });
    }
  } catch (error) {
    console.error('Error analyzing weaknesses:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;