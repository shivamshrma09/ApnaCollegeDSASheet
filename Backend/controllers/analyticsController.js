const UserAnalytics = require('../models/UserAnalytics');

// Track problem attempt
const trackProblemAttempt = async (req, res) => {
  try {
    const { userId } = req.params;
    const { problemId, timeSpent, solved, difficulty, topic, companies } = req.body;
    
    let analytics = await UserAnalytics.findOne({ userId });
    if (!analytics) {
      analytics = new UserAnalytics({ userId, problemAttempts: [], weakAreas: [], studySession: [] });
    }
    
    // Add problem attempt
    const existingAttempt = analytics.problemAttempts.find(p => p.problemId === problemId);
    if (existingAttempt) {
      existingAttempt.attempts += 1;
      existingAttempt.timeSpent += timeSpent;
      existingAttempt.solved = solved;
      existingAttempt.timestamp = new Date();
    } else {
      analytics.problemAttempts.push({
        problemId,
        attempts: 1,
        timeSpent,
        solved,
        difficulty,
        topic,
        companies,
        timestamp: new Date()
      });
    }
    
    // Update performance metrics
    if (solved) {
      analytics.performance.totalSolved += 1;
      if (difficulty === 'Easy') analytics.performance.easySolved += 1;
      else if (difficulty === 'Medium') analytics.performance.mediumSolved += 1;
      else if (difficulty === 'Hard') analytics.performance.hardSolved += 1;
    }
    
    // Update weak areas
    await updateWeakAreas(analytics, topic, difficulty, solved, timeSpent);
    
    analytics.performance.lastActive = new Date();
    await analytics.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track attempt' });
  }
};

// Update weak areas based on performance
const updateWeakAreas = async (analytics, topic, difficulty, solved, timeSpent) => {
  const weakArea = analytics.weakAreas.find(w => w.topic === topic && w.difficulty === difficulty);
  
  if (weakArea) {
    const attempts = analytics.problemAttempts.filter(p => p.topic === topic && p.difficulty === difficulty);
    const failures = attempts.filter(p => !p.solved).length;
    weakArea.failureRate = (failures / attempts.length) * 100;
    weakArea.avgTimeSpent = attempts.reduce((sum, p) => sum + p.timeSpent, 0) / attempts.length;
    weakArea.lastUpdated = new Date();
  } else if (!solved || timeSpent > 1800) { // 30 minutes threshold
    analytics.weakAreas.push({
      topic,
      difficulty,
      failureRate: solved ? 0 : 100,
      avgTimeSpent: timeSpent,
      lastUpdated: new Date()
    });
  }
};

// Get user analytics
const getUserAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;
    const analytics = await UserAnalytics.findOne({ userId });
    
    if (!analytics) {
      return res.json({
        performance: { totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 },
        weakAreas: [],
        recentActivity: []
      });
    }
    
    // Get recent activity (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentActivity = analytics.problemAttempts
      .filter(p => p.timestamp >= weekAgo)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20);
    
    // Calculate accuracy
    const totalAttempts = analytics.problemAttempts.length;
    const solvedCount = analytics.problemAttempts.filter(p => p.solved).length;
    const accuracy = totalAttempts > 0 ? (solvedCount / totalAttempts) * 100 : 0;
    
    res.json({
      performance: {
        ...analytics.performance.toObject(),
        accuracy: Math.round(accuracy)
      },
      weakAreas: analytics.weakAreas.sort((a, b) => b.failureRate - a.failureRate).slice(0, 5),
      recentActivity,
      studyPattern: getStudyPattern(analytics.problemAttempts)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get analytics' });
  }
};

// Analyze study patterns
const getStudyPattern = (attempts) => {
  const last30Days = attempts.filter(p => 
    p.timestamp >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  
  const dailyActivity = {};
  last30Days.forEach(attempt => {
    const date = attempt.timestamp.toDateString();
    if (!dailyActivity[date]) {
      dailyActivity[date] = { problems: 0, timeSpent: 0 };
    }
    dailyActivity[date].problems += 1;
    dailyActivity[date].timeSpent += attempt.timeSpent;
  });
  
  const activeDays = Object.keys(dailyActivity).length;
  const avgProblemsPerDay = activeDays > 0 ? 
    Object.values(dailyActivity).reduce((sum, day) => sum + day.problems, 0) / activeDays : 0;
  
  return {
    activeDays,
    avgProblemsPerDay: Math.round(avgProblemsPerDay * 10) / 10,
    totalTimeSpent: Math.round(last30Days.reduce((sum, p) => sum + p.timeSpent, 0) / 3600), // hours
    consistency: activeDays >= 20 ? 'High' : activeDays >= 10 ? 'Medium' : 'Low'
  };
};

// Set interview preparation goals
const setInterviewGoals = async (req, res) => {
  try {
    const { userId } = req.params;
    const { targetCompany, interviewDate, dailyGoal, focusAreas } = req.body;
    
    let analytics = await UserAnalytics.findOne({ userId });
    if (!analytics) {
      analytics = new UserAnalytics({ userId });
    }
    
    analytics.interviewPrep = {
      targetCompany,
      interviewDate: new Date(interviewDate),
      dailyGoal,
      currentStreak: 0,
      totalDaysActive: 0,
      focusAreas: focusAreas || []
    };
    
    await analytics.save();
    res.json({ success: true, interviewPrep: analytics.interviewPrep });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set goals' });
  }
};

module.exports = {
  trackProblemAttempt,
  getUserAnalytics,
  setInterviewGoals
};