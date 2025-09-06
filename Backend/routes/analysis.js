const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');
const UserAnalytics = require('../models/UserAnalytics');
const { auth } = require('../middleware/auth');

const genAI = new GoogleGenerativeAI('AIzaSyCdkLttbQG-leRvHX7d7ZcV22-2QQk1VuU');

// Rate limiting for Gemini API
let lastApiCall = 0;
const API_COOLDOWN = 60000; // 1 minute
const analysisCache = new Map();

// Save user performance data
router.post('/save-performance', auth, async (req, res) => {
  try {
    const { problemId, timeSpent, testScore, attempts, sheetType } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.performanceData) user.performanceData = {};
    if (!user.performanceData[sheetType]) user.performanceData[sheetType] = {};
    
    user.performanceData[sheetType][problemId] = {
      timeSpent: timeSpent || 0,
      testScore: testScore || 0,
      attempts: attempts || 1,
      lastAttempt: new Date()
    };

    await user.save();
    res.json({ message: 'Performance data saved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get comprehensive user performance data
router.get('/performance/:sheetType', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const sheetType = req.params.sheetType;
    const sheetData = user.sheetProgress?.get(sheetType) || {};
    const performanceData = user.performanceData?.get(sheetType) || {};
    const problemTimers = user.problemTimers || [];
    const testResults = user.testResults || {};
    
    // Get completed problems for this sheet
    const completedProblems = sheetData.completedProblems || [];
    
    // Build comprehensive performance data
    const detailedPerformance = {};
    
    completedProblems.forEach(problemId => {
      // Get timer data
      const timerData = problemTimers.find(t => t.problemId === problemId);
      
      // Get performance data
      const perfData = performanceData[problemId] || {};
      
      detailedPerformance[problemId] = {
        timeSpent: timerData?.timeSpent || perfData.timeSpent || 0,
        testScore: perfData.testScore || 0,
        attempts: perfData.attempts || 1,
        lastAttempt: perfData.lastAttempt || timerData?.endTime || new Date()
      };
    });
    
    // Get test results data
    const testScores = {};
    Object.entries(testResults).forEach(([testId, result]) => {
      if (result.score !== undefined) {
        testScores[testId] = {
          score: result.score,
          correct: result.correct,
          total: result.total,
          completedAt: result.completedAt,
          feedback: result.feedback
        };
      }
    });
    
    res.json({ 
      performanceData: detailedPerformance,
      testResults: testScores,
      sheetStats: {
        totalSolved: sheetData.totalSolved || 0,
        easySolved: sheetData.easySolved || 0,
        mediumSolved: sheetData.mediumSolved || 0,
        hardSolved: sheetData.hardSolved || 0,
        streak: sheetData.streak || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save analysis report to database  
router.post('/save-analysis', auth, async (req, res) => {
  try {
    const { analysisData, sheetType } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Save to user analytics
    let analytics = await UserAnalytics.findOne({ userId: req.user.id });
    if (!analytics) {
      analytics = new UserAnalytics({ userId: req.user.id });
    }

    // Add analysis report
    analytics.analysisReports.push({
      sheetType,
      reportDate: new Date(),
      overallScore: analysisData.overallScore,
      totalTimeSpent: analysisData.detailedStats?.totalTimeSpent || 0,
      avgTimePerProblem: analysisData.detailedStats?.avgTimePerProblem || 0,
      totalTests: analysisData.detailedStats?.totalTests || 0,
      avgTestScore: analysisData.detailedStats?.avgTestScore || 0,
      weakAreas: analysisData.weakAreas || [],
      strongAreas: analysisData.strongAreas || [],
      timeAnalysis: analysisData.timeAnalysis || {},
      recommendations: analysisData.recommendations || [],
      nextSteps: analysisData.nextSteps || [],
      detailedInsights: analysisData.detailedInsights || '',
      problemsAnalyzed: analysisData.problemsAnalyzed || 0,
      dataQuality: analysisData.dataQuality || {}
    });

    // Keep only last 10 reports
    if (analytics.analysisReports.length > 10) {
      analytics.analysisReports = analytics.analysisReports.slice(-10);
    }

    await analytics.save();
    res.json({ message: 'Analysis saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get analysis history
router.get('/analysis-history/:sheetType', auth, async (req, res) => {
  try {
    const analytics = await UserAnalytics.findOne({ userId: req.user.id });
    if (!analytics) {
      return res.json({ reports: [] });
    }

    const reports = analytics.analysisReports
      .filter(report => report.sheetType === req.params.sheetType)
      .sort((a, b) => b.reportDate - a.reportDate)
      .slice(0, 5); // Last 5 reports

    res.json({ reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// AI Weakness Analysis with Gemini
router.post('/weakness', auth, async (req, res) => {
  try {
    console.log('Received weakness analysis request:', {
      bodyKeys: Object.keys(req.body),
      userStatsKeys: req.body.userStats ? Object.keys(req.body.userStats) : 'undefined',
      totalTimeSpent: req.body.userStats?.totalTimeSpent,
      timeSpentKeys: req.body.userStats?.timeSpent ? Object.keys(req.body.userStats.timeSpent).length : 0
    });
    
    const { 
      solvedProblems, 
      topicPerformance, 
      userStats, 
      sheetType,
      totalProblems,
      solvedCount 
    } = req.body;

    // Validate required fields
    if (!userStats) {
      console.log('Missing userStats in request');
      return res.status(400).json({ 
        message: 'Missing user statistics data' 
      });
    }

    if (!solvedProblems || !Array.isArray(solvedProblems)) {
      console.log('Missing or invalid solvedProblems in request');
      return res.status(400).json({ 
        message: 'Missing solved problems data' 
      });
    }

    if (!topicPerformance || typeof topicPerformance !== 'object') {
      console.log('Missing or invalid topicPerformance in request');
      return res.status(400).json({ 
        message: 'Missing topic performance data' 
      });
    }

    // Only use real user data - no dummy data
    let analysisData = userStats;
    
    // Check if we have sufficient real data for analysis - be more flexible
    const hasTimeData = userStats.totalTimeSpent && userStats.totalTimeSpent > 0;
    const hasTestData = userStats.testScores && Object.keys(userStats.testScores).length > 0;
    const hasTimeSpentData = userStats.timeSpent && Object.keys(userStats.timeSpent).length > 0;
    
    if (!hasTimeData && !hasTestData && !hasTimeSpentData) {
      console.log('Insufficient performance data:', {
        totalTimeSpent: userStats.totalTimeSpent,
        timeSpentEntries: Object.keys(userStats.timeSpent || {}).length,
        testScoresEntries: Object.keys(userStats.testScores || {}).length,
        hasTimeData,
        hasTestData,
        hasTimeSpentData
      });
      
      // Instead of returning error, provide a basic analysis
      const basicAnalysis = generateEnhancedFallbackAnalysis(
        topicPerformance || {}, 
        solvedCount || 0, 
        totalProblems || 0,
        {
          timeSpent: {},
          testScores: {},
          attempts: {},
          totalTimeSpent: 0
        },
        [], [], [], [], {}
      );
      
      basicAnalysis.detailedInsights = '📊 BASIC ANALYSIS: Start using the timer feature and taking tests to get detailed AI-powered insights. Current analysis is based on completion progress only.';
      
      return res.json({ analysis: basicAnalysis });
    }

    // Build detailed problem analysis - handle missing data gracefully
    const problemAnalysis = (solvedProblems || []).map(p => {
      const timeSpent = (analysisData.timeSpent && analysisData.timeSpent[p.id]) || 0;
      const testScore = (analysisData.testScores && analysisData.testScores[p.id]) || 0;
      const attempts = (analysisData.attempts && analysisData.attempts[p.id]) || 1;
      
      return {
        id: p.id,
        title: p.title || `Problem ${p.id}`,
        difficulty: p.difficulty || 'Medium',
        topic: p.topic || 'General',
        timeSpent: Math.round(timeSpent / 60), // in minutes
        testScore: testScore,
        attempts: attempts,
        hasTest: testScore > 0, // Only problems with actual test scores
        efficiency: timeSpent > 0 ? Math.round((testScore / (timeSpent / 60)) * 10) : 0
      };
    });
    
    // Filter problems that actually had tests taken
    const testedProblems = problemAnalysis.filter(p => p.hasTest);
    
    // Find problems with excessive time
    const slowProblems = problemAnalysis.filter(p => p.timeSpent > 45).sort((a, b) => b.timeSpent - a.timeSpent);
    
    // Only analyze test performance for problems where tests were actually taken
    const lowScoreProblems = testedProblems.filter(p => p.testScore < 60).sort((a, b) => a.testScore - b.testScore);
    
    // Time-based analysis
    const timeAnalysis = {
      fastSolvers: problemAnalysis.filter(p => p.timeSpent > 0 && p.timeSpent <= 15).length,
      moderateSolvers: problemAnalysis.filter(p => p.timeSpent > 15 && p.timeSpent <= 45).length,
      slowSolvers: problemAnalysis.filter(p => p.timeSpent > 45).length,
      avgTimePerDifficulty: {
        Easy: Math.round(problemAnalysis.filter(p => p.difficulty === 'Easy' && p.timeSpent > 0).reduce((sum, p) => sum + p.timeSpent, 0) / Math.max(1, problemAnalysis.filter(p => p.difficulty === 'Easy' && p.timeSpent > 0).length)),
        Medium: Math.round(problemAnalysis.filter(p => p.difficulty === 'Medium' && p.timeSpent > 0).reduce((sum, p) => sum + p.timeSpent, 0) / Math.max(1, problemAnalysis.filter(p => p.difficulty === 'Medium' && p.timeSpent > 0).length)),
        Hard: Math.round(problemAnalysis.filter(p => p.difficulty === 'Hard' && p.timeSpent > 0).reduce((sum, p) => sum + p.timeSpent, 0) / Math.max(1, problemAnalysis.filter(p => p.difficulty === 'Hard' && p.timeSpent > 0).length))
      }
    };
    
    console.log('Problem Analysis:', problemAnalysis.slice(0, 5));
    console.log('Tested Problems:', testedProblems.length);
    console.log('Slow Problems:', slowProblems.slice(0, 3));
    console.log('Low Score Problems (with tests):', lowScoreProblems.slice(0, 3));
    console.log('Time Analysis:', timeAnalysis);
    
    // Check cache first
    const cacheKey = `${req.user.id}_${sheetType}_${solvedCount}`;
    if (analysisCache.has(cacheKey)) {
      const cachedResult = analysisCache.get(cacheKey);
      if (Date.now() - cachedResult.timestamp < 3600000) { // 1 hour cache
        console.log('Using cached analysis');
        return res.json({ analysis: cachedResult.data });
      }
    }
    
    // Check rate limit
    const now = Date.now();
    if (now - lastApiCall < API_COOLDOWN) {
      console.log('Rate limit hit, using fallback analysis');
      const fallbackAnalysis = generateEnhancedFallbackAnalysis(topicPerformance, solvedCount, totalProblems, analysisData, problemAnalysis, slowProblems, lowScoreProblems, testedProblems, timeAnalysis);
      return res.json({ analysis: fallbackAnalysis });
    }
    
    const prompt = `
Analyze this DSA student's performance data and provide detailed insights:

STUDENT PERFORMANCE OVERVIEW:
- Sheet: ${sheetType}
- Problems Solved: ${solvedCount}/${totalProblems} (${Math.round((solvedCount/totalProblems)*100)}%)
- Total Study Time: ${Math.round(analysisData.totalTimeSpent/60)} minutes
- Average Time per Problem: ${solvedCount > 0 ? Math.round(analysisData.totalTimeSpent/solvedCount/60) : 0} minutes
- Problems with Tests Taken: ${testedProblems.length}
- Average Test Score: ${testedProblems.length > 0 ? Math.round(testedProblems.reduce((sum, p) => sum + p.testScore, 0) / testedProblems.length) : 0}%

TIME ANALYSIS:
- Fast Solvers (≤15 min): ${timeAnalysis.fastSolvers} problems
- Moderate Solvers (15-45 min): ${timeAnalysis.moderateSolvers} problems  
- Slow Solvers (>45 min): ${timeAnalysis.slowSolvers} problems
- Avg Time by Difficulty: Easy: ${timeAnalysis.avgTimePerDifficulty.Easy}min, Medium: ${timeAnalysis.avgTimePerDifficulty.Medium}min, Hard: ${timeAnalysis.avgTimePerDifficulty.Hard}min

TOPIC-WISE PERFORMANCE:
${Object.entries(topicPerformance).map(([topic, data]) => 
  `${topic}: ${data.solved}/${data.total} (${Math.round((data.solved/data.total)*100)}%)`
).join('\n')}

PROBLEMS WITH EXCESSIVE TIME (>45 minutes):
${slowProblems.slice(0, 5).map(p => 
  `"${p.title}" (${p.difficulty}): ${p.timeSpent}min, Topic: ${p.topic}`
).join('\n')}

TEST PERFORMANCE ISSUES (Problems with tests taken and score <60%):
${lowScoreProblems.slice(0, 5).map(p => 
  `"${p.title}" (${p.difficulty}): Score: ${p.testScore}%, Time: ${p.timeSpent}min, Topic: ${p.topic}`
).join('\n')}

Please provide a JSON response with:
1. overallScore (0-100)
2. weakAreas (array with topic, percentage, recommendation, leetcodeLink)
3. strongAreas (array with topic, percentage)
4. timeAnalysis (object with fastSolvers, moderateSolvers, slowSolvers, avgTimeByDifficulty, insights)
5. testPerformanceIssues (array with problemTitle, score, suggestion - ONLY for problems where tests were actually taken)
6. recommendations (array of specific actionable advice)
7. nextSteps (array with specific LeetCode problem titles and links to solve for improvement)
8. detailedInsights (comprehensive paragraph analyzing all patterns, time efficiency, test performance, and improvement strategies)

For nextSteps, provide specific LeetCode problem names and links based on weak areas identified.
For testPerformanceIssues, only include problems where the user actually took tests and scored poorly.
`;

    try {
      lastApiCall = now;
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let analysisText = response.text();

      // Clean and parse JSON response
      analysisText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      let analysis;
      try {
        analysis = JSON.parse(analysisText);
      } catch (parseError) {
        // Fallback if JSON parsing fails
        analysis = generateEnhancedFallbackAnalysis(topicPerformance, solvedCount, totalProblems, analysisData, problemAnalysis, slowProblems, lowScoreProblems, testedProblems, timeAnalysis);
      }
      
      // Cache the result
      analysisCache.set(cacheKey, {
        data: analysis,
        timestamp: now
      });
      
    } catch (apiError) {
      console.log('Gemini API failed, using enhanced fallback:', apiError.message);
      analysis = generateEnhancedFallbackAnalysis(topicPerformance, solvedCount, totalProblems, analysisData, problemAnalysis, slowProblems, lowScoreProblems, testedProblems, timeAnalysis);
    }

    // Add detailed stats - handle missing data
    analysis.detailedStats = {
      totalTimeSpent: Math.round((analysisData.totalTimeSpent || 0) / 60),
      avgTimePerProblem: solvedCount > 0 ? Math.round((analysisData.totalTimeSpent || 0) / solvedCount / 60) : 0,
      totalTests: Object.keys(analysisData.testScores || {}).length,
      avgTestScore: Object.keys(analysisData.testScores || {}).length > 0 ? 
        Math.round(Object.values(analysisData.testScores || {}).reduce((sum, score) => sum + score, 0) / Object.keys(analysisData.testScores || {}).length) : 0
    };

    try {
      let analytics = await UserAnalytics.findOne({ userId: req.user.id });
      if (!analytics) {
        analytics = new UserAnalytics({ userId: req.user.id });
      }
      analytics.analysisReports.push({
        sheetType,
        overallScore: analysis.overallScore,
        totalTimeSpent: analysis.detailedStats?.totalTimeSpent || 0,
        avgTimePerProblem: analysis.detailedStats?.avgTimePerProblem || 0,
        totalTests: analysis.detailedStats?.totalTests || 0,
        avgTestScore: analysis.detailedStats?.avgTestScore || 0,
        weakAreas: analysis.weakAreas || [],
        strongAreas: analysis.strongAreas || [],
        recommendations: analysis.recommendations || [],
        detailedInsights: analysis.detailedInsights || '',
        problemsAnalyzed: solvedCount
      });
      if (analytics.analysisReports.length > 10) {
        analytics.analysisReports = analytics.analysisReports.slice(-10);
      }
      await analytics.save();
    } catch (saveError) {
      console.log('Failed to save analysis:', saveError.message);
    }

    console.log('Analysis completed successfully');
    res.json({ analysis });
  } catch (error) {
    console.error('Analysis Error:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Request body structure:', {
      hasUserStats: !!req.body.userStats,
      hasTopicPerformance: !!req.body.topicPerformance,
      hasSolvedProblems: !!req.body.solvedProblems,
      userStatsStructure: req.body.userStats ? Object.keys(req.body.userStats) : 'undefined'
    });
    
    if (req.body.userStats && (req.body.userStats.totalTimeSpent > 0 || Object.keys(req.body.userStats.testScores || {}).length > 0)) {
      const fallbackAnalysis = generateEnhancedFallbackAnalysis(
        req.body.topicPerformance || {}, 
        req.body.solvedCount || 0, 
        req.body.totalProblems || 0,
        req.body.userStats,
        [], [], [], [], {}
      );
      res.json({ analysis: fallbackAnalysis });
    } else {
      res.status(400).json({ 
        message: 'Analysis failed: ' + error.message
      });
    }
  }
});

// Removed dummy data generation - only real data allowed

function generateEnhancedFallbackAnalysis(topicPerformance, solvedCount, totalProblems, userStats, problemAnalysis = [], slowProblems = [], lowScoreProblems = [], testedProblems = [], timeAnalysis = {}) {
  // Handle missing or invalid data
  topicPerformance = topicPerformance || {};
  solvedCount = solvedCount || 0;
  totalProblems = totalProblems || 1; // Avoid division by zero
  userStats = userStats || { timeSpent: {}, testScores: {}, totalTimeSpent: 0 };
  
  const weakTopics = Object.entries(topicPerformance)
    .filter(([topic, data]) => data && data.total > 0 && (data.solved / data.total) < 0.3)
    .sort((a, b) => (a[1].solved / a[1].total) - (b[1].solved / b[1].total))
    .slice(0, 5);

  const strongTopics = Object.entries(topicPerformance)
    .filter(([topic, data]) => data && data.total > 0 && (data.solved / data.total) >= 0.7)
    .sort((a, b) => (b[1].solved / b[1].total) - (a[1].solved / a[1].total))
    .slice(0, 3);

  return {
    overallScore: Math.round((solvedCount / totalProblems) * 100),
    weakAreas: weakTopics.map(([topic, data]) => ({
      topic,
      percentage: Math.round((data.solved / data.total) * 100),
      solved: data.solved,
      total: data.total,
      recommendation: `Focus on ${topic} fundamentals. Start with Easy problems and build conceptual understanding.`,
      leetcodeLink: `https://leetcode.com/tag/${topic.toLowerCase().replace(/\s+/g, '-')}/`
    })),
    strongAreas: strongTopics.map(([topic, data]) => ({
      topic,
      percentage: Math.round((data.solved / data.total) * 100),
      solved: data.solved,
      total: data.total
    })),
    timeAnalysis: {
      fastSolvers: timeAnalysis.fastSolvers || 0,
      moderateSolvers: timeAnalysis.moderateSolvers || 0,
      slowSolvers: timeAnalysis.slowSolvers || 0,
      avgTimeByDifficulty: timeAnalysis.avgTimePerDifficulty || { Easy: 0, Medium: 0, Hard: 0 },
      insights: `Time distribution: ${timeAnalysis.fastSolvers || 0} fast, ${timeAnalysis.moderateSolvers || 0} moderate, ${timeAnalysis.slowSolvers || 0} slow solvers. ${slowProblems.length > 0 ? 'Focus on improving speed for slow problems.' : 'Good time management overall.'}`
    },
    testPerformanceIssues: testedProblems.filter(p => p.testScore < 60).slice(0, 3).map(p => ({
      problemTitle: p.title || `Problem ${p.id}`,
      score: p.testScore,
      suggestion: `Low test score (${p.testScore}%) indicates conceptual gaps in ${p.topic}. Review fundamentals and practice similar problems.`
    })),
    recommendations: [
      weakTopics.length > 0 ? `Prioritize ${weakTopics[0][0]} - only ${Math.round((weakTopics[0][1].solved / weakTopics[0][1].total) * 100)}% completed` : "Great progress! Keep solving consistently",
      slowProblems.length > 0 ? `Work on time management - you spent excessive time on ${slowProblems.length} problems` : "Good time management overall",
      lowScoreProblems.length > 0 ? `Review concepts for problems with low test scores` : "Strong test performance",
      "Practice daily for consistent improvement",
      "Use LeetCode for additional practice: https://leetcode.com/problemset/"
    ],
    nextSteps: [
      {
        title: "Two Sum",
        link: "https://leetcode.com/problems/two-sum/",
        reason: "Fundamental array problem for beginners"
      },
      {
        title: "Valid Parentheses",
        link: "https://leetcode.com/problems/valid-parentheses/",
        reason: "Essential stack problem"
      },
      {
        title: "Binary Tree Inorder Traversal",
        link: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
        reason: "Core tree traversal technique"
      },
      ...(weakTopics.length > 0 ? [{
        title: `Practice ${weakTopics[0][0]} problems`,
        link: `https://leetcode.com/tag/${weakTopics[0][0].toLowerCase().replace(/\s+/g, '-')}/`,
        reason: `Improve weak area: ${weakTopics[0][0]}`
      }] : []),
      ...(slowProblems.length > 0 ? [{
        title: "Time-based practice",
        link: "https://leetcode.com/problemset/",
        reason: "Set 30-minute time limits for medium problems"
      }] : [])
    ],
    detailedStats: {
      totalTimeSpent: Math.round((userStats.totalTimeSpent || 0) / 60),
      avgTimePerProblem: solvedCount > 0 ? Math.round((userStats.totalTimeSpent || 0) / solvedCount / 60) : 0,
      totalTests: Object.keys(userStats.testScores || {}).length,
      avgTestScore: Object.keys(userStats.testScores || {}).length > 0 ? 
        Math.round(Object.values(userStats.testScores || {}).reduce((sum, score) => sum + score, 0) / Object.keys(userStats.testScores || {}).length) : 0
    },
    detailedInsights: `📊 COMPREHENSIVE PERFORMANCE ANALYSIS:\n\n🎯 PROGRESS OVERVIEW: You've solved ${solvedCount} out of ${totalProblems} problems (${Math.round((solvedCount/totalProblems)*100)}%), showing ${solvedCount > totalProblems * 0.5 ? 'excellent' : solvedCount > totalProblems * 0.3 ? 'good' : 'steady'} progress.\n\n⏱️ TIME EFFICIENCY: ${timeAnalysis.fastSolvers || 0} problems solved quickly (≤15min), ${timeAnalysis.moderateSolvers || 0} at moderate pace (15-45min), and ${timeAnalysis.slowSolvers || 0} took longer (>45min). ${slowProblems.length > 0 ? `Focus on speed improvement for problems like "${slowProblems[0]?.title || 'slow problems'}".` : 'Good time management overall.'}\n\n📝 TEST PERFORMANCE: ${testedProblems.length} problems had tests taken with average score of ${testedProblems.length > 0 ? Math.round(testedProblems.reduce((sum, p) => sum + p.testScore, 0) / testedProblems.length) : 0}%. ${testedProblems.filter(p => p.testScore < 60).length > 0 ? `${testedProblems.filter(p => p.testScore < 60).length} problems need concept review.` : 'Strong conceptual understanding.'}\n\n🎯 WEAK AREAS: ${weakTopics.length > 0 ? `Focus on ${weakTopics.map(([topic]) => topic).join(', ')} with targeted practice.` : 'No significant weak areas identified.'}\n\n🚀 RECOMMENDATIONS: Practice consistently, focus on understanding patterns rather than memorizing solutions, and gradually increase problem difficulty. Use the suggested LeetCode problems to strengthen weak areas.`
  };
}

module.exports = router;