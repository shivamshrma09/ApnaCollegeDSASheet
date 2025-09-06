const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user goals
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);
    const goals = user.goals || {
      apnaCollege: { daily: { target: 3, current: 0 }, weekly: { target: 20, current: 0 } },
      loveBabbar: { daily: { target: 3, current: 0 }, weekly: { target: 20, current: 0 } }
    };
    
    res.json({ goals });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Set user goals - simplified
router.post('/set', auth, async (req, res) => {
  try {
    const { dailyTarget, weeklyTarget } = req.body;
    const userId = req.user._id || req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Initialize goals if not exists
    if (!user.goals) {
      user.goals = {
        daily: { target: 3, current: 0, lastReset: new Date() },
        weekly: { target: 20, current: 0, lastReset: new Date() }
      };
    }
    
    // Update goals
    if (dailyTarget) user.goals.daily.target = parseInt(dailyTarget);
    if (weeklyTarget) user.goals.weekly.target = parseInt(weeklyTarget);
    
    await user.save();
    
    res.json({ 
      success: true,
      message: 'Goals updated successfully',
      goals: user.goals 
    });
  } catch (error) {
    console.error('Error setting goals:', error);
    res.status(500).json({ error: error.message });
  }
});



// Get AI recommendations
router.get('/ai-recommendations', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);
    const goals = user.goals || {};
    const sheetProgress = user.sheetProgress || {};
    
    // Analyze user's problem-solving patterns
    let totalSolved = 0;
    let timeSpentData = [];
    let weakAreas = [];
    
    Object.keys(sheetProgress).forEach(sheet => {
      const data = sheetProgress[sheet] || {};
      totalSolved += data.completedProblems?.length || 0;
      
      // Simulate time analysis (replace with real data)
      if (data.completedProblems?.length > 0) {
        timeSpentData.push({
          sheet,
          avgTime: Math.random() * 60 + 30, // 30-90 minutes
          difficulty: Math.random() > 0.5 ? 'Medium' : 'Hard'
        });
      }
    });
    
    // Generate AI-powered recommendations using Gemini
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    
    let aiMessage = '';
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `
        User Profile Analysis:
        - Total Problems Solved: ${totalSolved}
        - Daily Goal: ${goals.daily?.target || 3} problems
        - Current Progress: ${goals.daily?.current || 0} problems today
        - Weekly Goal: ${goals.weekly?.target || 20} problems
        
        Provide a personalized motivational message in 1-2 sentences. Be encouraging and specific to their progress level.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      aiMessage = response.text();
      console.log('✅ AI recommendation generated successfully');
    } catch (aiError) {
      console.error('AI API error:', aiError.message);
      aiMessage = goals.daily?.current >= goals.daily?.target 
        ? '🎉 Excellent work! You\'ve completed your daily goal. Consider tackling some medium-difficulty problems to challenge yourself further.'
        : `💪 You\'re ${Math.round((goals.daily?.current || 0) / (goals.daily?.target || 3) * 100)}% towards your daily goal. Focus on consistency - even 30 minutes of practice daily makes a huge difference!`;
    }
    
    const recommendations = {
      dailyPlan: {
        problemsRemaining: Math.max(0, (goals.daily?.target || 3) - (goals.daily?.current || 0)),
        estimatedTime: Math.max(0, (goals.daily?.target || 3) - (goals.daily?.current || 0)) * 30
      },
      motivationalMessage: aiMessage,
      suggestions: [
        totalSolved < 50 ? 'Focus on Array and String problems first' : 'Try advanced topics like Dynamic Programming',
        'Practice for 1-2 hours daily for consistent progress',
        'Review solved problems weekly to strengthen concepts'
      ]
    };
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching AI recommendations:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get real weakness analysis from user data
router.get('/weak-areas', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);
    
    if (!user.problemTimers || user.problemTimers.length === 0) {
      return res.json({ weakAreas: [] });
    }
    
    // Analyze problem-solving patterns
    const topicAnalysis = {};
    
    user.problemTimers.forEach(timer => {
      const timeSpent = timer.timeSpent || 0;
      const problemId = timer.problemId;
      
      // Map problem ID to topic
      let topic = 'Arrays';
      let difficulty = 'Medium';
      
      if (problemId >= 1 && problemId <= 50) {
        topic = 'Arrays'; difficulty = 'Easy';
      } else if (problemId >= 51 && problemId <= 100) {
        topic = 'Dynamic Programming'; difficulty = 'Medium';
      } else if (problemId >= 101 && problemId <= 150) {
        topic = 'Graph Algorithms'; difficulty = 'Hard';
      } else if (problemId >= 151 && problemId <= 200) {
        topic = 'Trees'; difficulty = 'Medium';
      }
      
      if (!topicAnalysis[topic]) {
        topicAnalysis[topic] = {
          topic, difficulty, totalTime: 0, attempts: 0, struggles: 0
        };
      }
      
      topicAnalysis[topic].totalTime += timeSpent;
      topicAnalysis[topic].attempts++;
      
      // Struggle if time > 30 minutes
      if (timeSpent > 1800) {
        topicAnalysis[topic].struggles++;
      }
    });
    
    // Calculate weak areas
    const weakAreas = [];
    Object.values(topicAnalysis).forEach(analysis => {
      if (analysis.attempts >= 2) {
        const failureRate = (analysis.struggles / analysis.attempts) * 100;
        const avgTime = analysis.totalTime / analysis.attempts;
        
        if (failureRate > 40 || avgTime > 1500) {
          weakAreas.push({
            topic: analysis.topic,
            difficulty: analysis.difficulty,
            failureRate: Math.round(failureRate * 10) / 10,
            avgTimeSpent: Math.round(avgTime),
            recommendedProblems: getRecommendations(analysis.topic)
          });
        }
      }
    });
    
    weakAreas.sort((a, b) => b.failureRate - a.failureRate);
    res.json({ weakAreas: weakAreas.slice(0, 5) });
  } catch (error) {
    console.error('Error analyzing weak areas:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const getRecommendations = (topic) => {
  const recs = {
    'Dynamic Programming': [
      { title: 'Longest Common Subsequence', link: 'https://leetcode.com/problems/longest-common-subsequence/', platform: 'leetcode' },
      { title: 'Coin Change', link: 'https://leetcode.com/problems/coin-change/', platform: 'leetcode' }
    ],
    'Graph Algorithms': [
      { title: 'Course Schedule II', link: 'https://leetcode.com/problems/course-schedule-ii/', platform: 'leetcode' },
      { title: 'Word Ladder', link: 'https://leetcode.com/problems/word-ladder/', platform: 'leetcode' }
    ],
    'Arrays': [
      { title: 'Two Sum', link: 'https://leetcode.com/problems/two-sum/', platform: 'leetcode' },
      { title: 'Maximum Subarray', link: 'https://leetcode.com/problems/maximum-subarray/', platform: 'leetcode' }
    ]
  };
  return recs[topic] || [];
};

module.exports = router;