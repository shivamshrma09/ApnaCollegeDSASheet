const User = require('../models/User');
const UserAnalytics = require('../models/UserAnalytics');
const { sanitizeForLog } = require('../utils/sanitizer');

// Set daily/weekly goals
const setGoals = async (req, res) => {
  try {
    const { dailyTarget, weeklyTarget, interviewDate, targetCompany, focusAreas } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update goals
    if (dailyTarget !== undefined) {
      user.goals.daily.target = dailyTarget;
    }
    if (weeklyTarget !== undefined) {
      user.goals.weekly.target = weeklyTarget;
    }
    if (interviewDate) {
      user.goals.interviewPrep.targetDate = new Date(interviewDate);
      user.goals.interviewPrep.daysRemaining = Math.ceil((new Date(interviewDate) - new Date()) / (1000 * 60 * 60 * 24));
    }
    if (targetCompany) {
      user.goals.interviewPrep.targetCompany = targetCompany;
    }
    if (focusAreas) {
      user.goals.interviewPrep.focusAreas = focusAreas;
    }

    await user.save();

    res.json({
      message: 'Goals updated successfully',
      goals: user.goals
    });
  } catch (error) {
    console.error('Error setting goals:', sanitizeForLog(error.message));
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user goals and progress
const getGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if daily/weekly goals need reset
    const now = new Date();
    const lastDailyReset = new Date(user.goals.daily.lastReset);
    const lastWeeklyReset = new Date(user.goals.weekly.lastReset);

    // Reset daily goal if it's a new day
    if (now.toDateString() !== lastDailyReset.toDateString()) {
      user.goals.daily.current = 0;
      user.goals.daily.lastReset = now;
    }

    // Reset weekly goal if it's a new week
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    if (weekStart > lastWeeklyReset) {
      user.goals.weekly.current = 0;
      user.goals.weekly.lastReset = weekStart;
    }

    await user.save();

    res.json({
      goals: user.goals,
      progress: {
        dailyProgress: (user.goals.daily.current / user.goals.daily.target) * 100,
        weeklyProgress: (user.goals.weekly.current / user.goals.weekly.target) * 100
      }
    });
  } catch (error) {
    console.error('Error getting goals:', sanitizeForLog(error.message));
    res.status(500).json({ message: 'Server error' });
  }
};

// Update goal progress when problem is solved
const updateGoalProgress = async (userId, problemsSolved = 1) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const now = new Date();
    
    // Check if daily goal needs reset
    const lastDailyReset = new Date(user.goals.daily.lastReset);
    if (now.toDateString() !== lastDailyReset.toDateString()) {
      user.goals.daily.current = 0;
      user.goals.daily.lastReset = now;
    }

    // Check if weekly goal needs reset
    const lastWeeklyReset = new Date(user.goals.weekly.lastReset);
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    if (weekStart > lastWeeklyReset) {
      user.goals.weekly.current = 0;
      user.goals.weekly.lastReset = weekStart;
    }

    // Update progress
    user.goals.daily.current += problemsSolved;
    user.goals.weekly.current += problemsSolved;

    await user.save();
    return user.goals;
  } catch (error) {
    console.error('Error updating goal progress:', sanitizeForLog(error.message));
  }
};

// Analyze weak areas and generate recommendations
const analyzeWeakAreas = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user analytics
    const analytics = await UserAnalytics.findOne({ userId });
    if (!analytics || !analytics.problemAttempts.length) {
      return res.json({ weakAreas: [], recommendations: [] });
    }

    // Analyze problem attempts to find weak areas
    const topicStats = {};
    
    analytics.problemAttempts.forEach(attempt => {
      const key = `${attempt.topic}_${attempt.difficulty}`;
      if (!topicStats[key]) {
        topicStats[key] = {
          topic: attempt.topic,
          difficulty: attempt.difficulty,
          attempts: 0,
          failures: 0,
          totalTime: 0
        };
      }
      
      topicStats[key].attempts++;
      topicStats[key].totalTime += attempt.timeSpent;
      if (!attempt.solved) {
        topicStats[key].failures++;
      }
    });

    // Identify weak areas (failure rate > 50% or avg time > threshold)
    const weakAreas = [];
    Object.values(topicStats).forEach(stat => {
      const failureRate = (stat.failures / stat.attempts) * 100;
      const avgTime = stat.totalTime / stat.attempts;
      
      if (failureRate > 50 || avgTime > 1800) { // 30 minutes threshold
        weakAreas.push({
          topic: stat.topic,
          difficulty: stat.difficulty,
          failureRate,
          avgTimeSpent: avgTime,
          recommendedProblems: generateRecommendations(stat.topic, stat.difficulty)
        });
      }
    });

    // Update user's weakness analysis
    const user = await User.findById(userId);
    user.weaknessAnalysis.weakTopics = weakAreas;
    await user.save();

    res.json({
      weakAreas,
      recommendations: generateAIRecommendations(weakAreas, user.goals.interviewPrep)
    });
  } catch (error) {
    console.error('Error analyzing weak areas:', sanitizeForLog(error.message));
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate problem recommendations based on weak areas
const generateRecommendations = (topic, difficulty) => {
  // This would ideally connect to LeetCode/GFG APIs
  // For now, returning mock recommendations
  const recommendations = [
    {
      platform: 'leetcode',
      problemId: 'two-sum',
      title: 'Two Sum',
      link: 'https://leetcode.com/problems/two-sum/',
      difficulty: 'Easy'
    },
    {
      platform: 'gfg',
      problemId: 'array-rotation',
      title: 'Array Rotation',
      link: 'https://www.geeksforgeeks.org/array-rotation/',
      difficulty: 'Medium'
    }
  ];
  
  return recommendations.slice(0, 3); // Return top 3 recommendations
};

// Generate AI-powered recommendations
const generateAIRecommendations = (weakAreas, interviewPrep) => {
  const recommendations = [];
  
  // Weakness-based recommendations
  weakAreas.forEach(area => {
    recommendations.push({
      type: 'weakness',
      problems: generateRecommendations(area.topic, area.difficulty),
      reason: `Improve ${area.topic} skills - ${area.failureRate.toFixed(1)}% failure rate`
    });
  });

  // Interview preparation recommendations
  if (interviewPrep.targetDate && interviewPrep.daysRemaining > 0) {
    const dailyTarget = Math.ceil(interviewPrep.daysRemaining / 10); // Adjust based on days remaining
    recommendations.push({
      type: 'interview',
      problems: generateInterviewProblems(interviewPrep.focusAreas, interviewPrep.targetCompany),
      reason: `${interviewPrep.daysRemaining} days until ${interviewPrep.targetCompany} interview`
    });
  }

  return recommendations;
};

// Generate interview-specific problems
const generateInterviewProblems = (focusAreas, company) => {
  // Mock interview problems based on company and focus areas
  return [
    {
      platform: 'leetcode',
      problemId: 'valid-parentheses',
      title: 'Valid Parentheses',
      link: 'https://leetcode.com/problems/valid-parentheses/',
      difficulty: 'Easy',
      reason: 'Common in technical interviews'
    },
    {
      platform: 'leetcode',
      problemId: 'merge-intervals',
      title: 'Merge Intervals',
      link: 'https://leetcode.com/problems/merge-intervals/',
      difficulty: 'Medium',
      reason: `Frequently asked at ${company}`
    }
  ];
};

// Get AI recommendations with Gemini integration
const getAIRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const analytics = await UserAnalytics.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare data for Gemini AI
    const userData = {
      goals: user.goals,
      weakAreas: user.weaknessAnalysis.weakTopics,
      recentActivity: analytics?.problemAttempts.slice(-10) || [],
      performance: analytics?.performance || {}
    };

    // Generate AI recommendations (mock implementation)
    const aiRecommendations = {
      dailyPlan: generateDailyPlan(userData),
      weeklyFocus: generateWeeklyFocus(userData),
      interviewPrep: generateInterviewPlan(userData),
      motivationalMessage: generateMotivationalMessage(userData)
    };

    res.json(aiRecommendations);
  } catch (error) {
    console.error('Error getting AI recommendations:', sanitizeForLog(error.message));
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate daily plan based on user data
const generateDailyPlan = (userData) => {
  const { goals, weakAreas } = userData;
  const remaining = goals.daily.target - goals.daily.current;
  
  return {
    problemsRemaining: Math.max(0, remaining),
    suggestedProblems: weakAreas.slice(0, 3).map(area => ({
      topic: area.topic,
      difficulty: area.difficulty,
      reason: `Focus on ${area.topic} - ${area.failureRate.toFixed(1)}% failure rate`
    })),
    estimatedTime: remaining * 30, // 30 minutes per problem
    priority: remaining > 0 ? 'high' : 'completed'
  };
};

// Generate weekly focus areas
const generateWeeklyFocus = (userData) => {
  const { weakAreas, goals } = userData;
  
  return {
    focusTopics: weakAreas.slice(0, 2).map(area => area.topic),
    targetProblems: goals.weekly.target - goals.weekly.current,
    difficultyDistribution: {
      easy: '30%',
      medium: '50%',
      hard: '20%'
    }
  };
};

// Generate interview preparation plan
const generateInterviewPlan = (userData) => {
  const { goals } = userData;
  const interviewPrep = goals.interviewPrep;
  
  if (!interviewPrep.targetDate) {
    return { message: 'Set interview date to get personalized plan' };
  }
  
  return {
    daysRemaining: interviewPrep.daysRemaining,
    dailyTarget: Math.ceil(interviewPrep.daysRemaining / 5),
    focusAreas: interviewPrep.focusAreas,
    company: interviewPrep.targetCompany,
    urgency: interviewPrep.daysRemaining < 30 ? 'high' : 'medium'
  };
};

// Generate motivational message
const generateMotivationalMessage = (userData) => {
  const { goals } = userData;
  const dailyProgress = (goals.daily.current / goals.daily.target) * 100;
  
  if (dailyProgress >= 100) {
    return "🎉 Great job! You've completed your daily goal. Keep the momentum going!";
  } else if (dailyProgress >= 50) {
    return "💪 You're halfway there! Push through and complete your daily goal.";
  } else {
    return "🚀 Let's get started! Every problem solved is a step closer to your goal.";
  }
};

module.exports = {
  setGoals,
  getGoals,
  updateGoalProgress,
  analyzeWeakAreas,
  getAIRecommendations
};