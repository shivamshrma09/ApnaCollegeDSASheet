import React, { useState, useEffect } from 'react';
import './WeaknessAnalysisSection.css';

const WeaknessAnalysisSection = ({ isDark, userId, selectedSheet, completedProblems, problems }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastAnalyzed, setLastAnalyzed] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [userStats, setUserStats] = useState(null);

  const fetchAnalysisHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:5001/api/analysis/analysis-history/${selectedSheet}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisHistory(data.reports || []);
      }
    } catch (error) {
      console.log('Failed to fetch analysis history:', error.message);
    }
  };

  const getUserStats = async () => {
    const backendResponse = await fetchPerformanceData(selectedSheet);
    
    if (backendResponse && Object.keys(backendResponse.performanceData || {}).length > 0) {
      // Convert backend data format
      const timeSpent = {};
      const testScores = {};
      const attempts = {};
      
      Object.entries(backendResponse.performanceData).forEach(([problemId, data]) => {
        timeSpent[problemId] = data.timeSpent || 0;
        testScores[problemId] = data.testScore || 0;
        attempts[problemId] = data.attempts || 1;
      });
      
      // Add test results data
      if (backendResponse.testResults) {
        Object.entries(backendResponse.testResults).forEach(([testId, result]) => {
          testScores[testId] = result.score || 0;
        });
      }
      
      return {
        timeSpent,
        testScores,
        attempts,
        totalTimeSpent: Object.values(timeSpent).reduce((sum, time) => sum + (time || 0), 0),
        testResults: backendResponse.testResults || {},
        sheetStats: backendResponse.sheetStats || {}
      };
    }
    
    // Return empty data if no real data exists - no dummy data
    return {
      timeSpent: {},
      testScores: {},
      attempts: {},
      totalTimeSpent: 0,
      testResults: {},
      sheetStats: {}
    };
  };
  
  // Removed sample data generation - only real data allowed

  const analyzeWeakness = async () => {
    setLoading(true);
    try {
      const stats = await getUserStats();
      setUserStats(stats);
      
      // Get user's solved problems data with detailed analytics
      const solvedProblems = [];
      const unsolvedProblems = [];
      const topicPerformance = {};
      
      problems.forEach(topic => {
        topicPerformance[topic.title] = {
          total: topic.problems?.length || 0,
          solved: 0,
          avgTime: 0,
          avgScore: 0,
          attempts: 0,
          problems: []
        };
        
        topic.problems?.forEach(problem => {
          const timeSpent = stats.timeSpent[problem.id] || 0;
          const testScore = stats.testScores[problem.id] || 0;
          const attempts = stats.attempts[problem.id] || 0;
          
          const problemData = {
            id: problem.id,
            title: problem.title,
            difficulty: problem.difficulty,
            topic: topic.title,
            companies: problem.companies || '',
            solved: completedProblems.has(problem.id),
            timeSpent: timeSpent,
            testScore: testScore,
            attempts: attempts,
            link: problem.link || '#'
          };
          
          topicPerformance[topic.title].problems.push(problemData);
          
          if (completedProblems.has(problem.id)) {
            solvedProblems.push(problemData);
            topicPerformance[topic.title].solved++;
            topicPerformance[topic.title].avgTime += timeSpent;
            topicPerformance[topic.title].avgScore += testScore;
            topicPerformance[topic.title].attempts += attempts;
          } else {
            unsolvedProblems.push(problemData);
          }
        });
        
        // Calculate averages
        if (topicPerformance[topic.title].solved > 0) {
          topicPerformance[topic.title].avgTime /= topicPerformance[topic.title].solved;
          topicPerformance[topic.title].avgScore /= topicPerformance[topic.title].solved;
        }
      });

      const analysisData = {
        userId,
        sheetType: selectedSheet,
        totalProblems: solvedProblems.length + unsolvedProblems.length,
        solvedCount: solvedProblems.length,
        solvedProblems: solvedProblems,
        topicPerformance: topicPerformance,
        userStats: stats
      };

      // Only proceed if we have real data
      if (stats.totalTimeSpent === 0 && Object.keys(stats.testScores).length === 0) {
        console.log('No real performance data available for analysis');
        setAnalysis({
          overallScore: Math.round((completedProblems.size / problems.reduce((sum, topic) => sum + (topic.problems?.length || 0), 0)) * 100),
          weakAreas: [],
          strongAreas: [],
          recommendations: [
            '⏰ Start using the timer feature to track your problem-solving time',
            '📊 Take practice tests to get detailed performance insights',
            '🎯 Solve more problems to build your performance history',
            '📈 Enable analytics tracking for personalized AI recommendations'
          ],
          nextSteps: [
            'Use the built-in timer when solving problems',
            'Take tests after solving problems to track understanding',
            'Solve at least 10 problems with time tracking for meaningful analysis'
          ],
          detailedStats: {
            totalTimeSpent: 0,
            avgTimePerProblem: 0,
            totalTests: 0,
            avgTestScore: 0
          },
          detailedInsights: '📊 GETTING STARTED: To get personalized AI analysis, start using the timer feature and taking tests after solving problems. This will help track your performance patterns and provide targeted recommendations for improvement.'
        });
        return;
      }
      
      const { sanitizeInput } = await import('../utils/security');
      console.log('Proceeding with analysis using real data:', {
        totalTimeSpent: sanitizeInput(stats.totalTimeSpent.toString()),
        testScoresCount: Object.keys(stats.testScores).length,
        problemsWithTime: Object.keys(stats.timeSpent).length,
        solvedProblemsCount: solvedProblems.length,
        topicCount: Object.keys(topicPerformance).length
      });
      
      // Call enhanced AI analysis with Gemini integration
      const result = await performAIAnalysis(analysisData);
      setAnalysis(result);
      setLastAnalyzed(new Date());
      localStorage.setItem(`lastAnalysis_${selectedSheet}`, new Date().toISOString());
      await fetchAnalysisHistory();
    } catch (error) {
      console.error('Error analyzing weakness:', error);
      const stats = await getUserStats();
      
      if (stats.totalTimeSpent > 0 || Object.keys(stats.testScores).length > 0) {
        setAnalysis(generateEnhancedAnalysis(problems, completedProblems, stats));
      }
    } finally {
      setLoading(false);
    }
  };

  const performAIAnalysis = async (data) => {
    try {
      console.log('Sending analysis request with data:', {
        userStatsKeys: Object.keys(data.userStats),
        totalTimeSpent: data.userStats.totalTimeSpent,
        timeSpentEntries: Object.keys(data.userStats.timeSpent).length,
        testScoresEntries: Object.keys(data.userStats.testScores).length,
        solvedProblemsCount: data.solvedProblems.length,
        topicPerformanceKeys: Object.keys(data.topicPerformance)
      });
      
      await savePerformanceData(data.userStats, data.sheetType);
      
      // Get real AI analysis from Gemini
      const response = await fetch('http://localhost:5001/api/analysis/weakness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Analysis successful:', result);
        return result.analysis;
      } else {
        const errorText = await response.text();
        console.error('Backend analysis failed:', response.status, errorText);
        throw new Error(`Backend analysis failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Analysis error:', error.message);
      return generateEnhancedAnalysis(problems, completedProblems, data.userStats);
    }
  };
  
  const savePerformanceData = async (userStats, sheetType) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const promises = [];
      
      // Save time and test data for each problem
      Object.keys(userStats.timeSpent).forEach(problemId => {
        if (userStats.timeSpent[problemId] > 0) {
          promises.push(
            fetch('http://localhost:5001/api/analysis/save-performance', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                problemId,
                timeSpent: userStats.timeSpent[problemId],
                testScore: userStats.testScores[problemId] || 0,
                attempts: userStats.attempts[problemId] || 1,
                sheetType
              })
            }).catch(err => console.log('Save failed for problem', problemId))
          );
        }
      });
      
      await Promise.allSettled(promises);
    } catch (error) {
      console.log('Backend not available for saving data');
    }
  };
  
  const fetchPerformanceData = async (sheetType) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No auth token available');
        return null;
      }
      
      console.log(`Fetching performance data for sheet: ${sheetType}`);
      const response = await fetch(`http://localhost:5001/api/analysis/performance/${sheetType}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Performance data fetched:', data);
        return data;
      } else {
        console.log('Failed to fetch performance data:', response.status);
        return null;
      }
    } catch (error) {
      console.log('Error fetching performance data:', error.message);
      return null;
    }
  };

  const getTopicBreakdown = (problems, completedProblems) => {
    const breakdown = {};
    problems.forEach(topic => {
      const totalInTopic = topic.problems?.length || 0;
      const solvedInTopic = topic.problems?.filter(p => completedProblems.has(p.id)).length || 0;
      breakdown[topic.title] = {
        total: totalInTopic,
        solved: solvedInTopic,
        percentage: totalInTopic > 0 ? Math.round((solvedInTopic / totalInTopic) * 100) : 0
      };
    });
    return breakdown;
  };

  const getDifficultyBreakdown = (problems, completedProblems) => {
    const breakdown = { Easy: { total: 0, solved: 0 }, Medium: { total: 0, solved: 0 }, Hard: { total: 0, solved: 0 } };
    
    problems.forEach(topic => {
      topic.problems?.forEach(problem => {
        const difficulty = problem.difficulty || 'Medium';
        breakdown[difficulty].total++;
        if (completedProblems.has(problem.id)) {
          breakdown[difficulty].solved++;
        }
      });
    });

    Object.keys(breakdown).forEach(diff => {
      breakdown[diff].percentage = breakdown[diff].total > 0 
        ? Math.round((breakdown[diff].solved / breakdown[diff].total) * 100) 
        : 0;
    });

    return breakdown;
  };

  const generateEnhancedAnalysis = (problems, completedProblems, stats) => {
    const topicBreakdown = getTopicBreakdown(problems, completedProblems);
    const difficultyBreakdown = getDifficultyBreakdown(problems, completedProblems);
    
    // Enhanced analysis with time and test score data
    const topicAnalysis = Object.entries(topicBreakdown).map(([topic, data]) => {
      const topicProblems = [];
      problems.forEach(t => {
        if (t.title === topic) {
          t.problems?.forEach(p => {
            if (completedProblems.has(p.id)) {
              topicProblems.push({
                id: p.id,
                title: p.title,
                timeSpent: stats.timeSpent[p.id] || 0,
                testScore: stats.testScores[p.id] || 0,
                attempts: stats.attempts[p.id] || 1
              });
            }
          });
        }
      });
      
      const avgTime = topicProblems.length > 0 ? 
        topicProblems.reduce((sum, p) => sum + p.timeSpent, 0) / topicProblems.length : 0;
      const avgScore = topicProblems.length > 0 ? 
        topicProblems.reduce((sum, p) => sum + p.testScore, 0) / topicProblems.length : 0;
      
      return {
        topic,
        ...data,
        avgTime: Math.round(avgTime / 60), // Convert to minutes
        avgScore: Math.round(avgScore),
        problems: topicProblems,
        efficiency: avgTime > 0 ? Math.round((avgScore / avgTime) * 100) : 0
      };
    });
    
    // Find weak areas based on multiple factors
    const weakTopics = topicAnalysis
      .filter(data => data.total > 0 && (data.percentage < 30 || data.avgScore < 60))
      .sort((a, b) => {
        const scoreA = a.percentage * 0.6 + a.avgScore * 0.4;
        const scoreB = b.percentage * 0.6 + b.avgScore * 0.4;
        return scoreA - scoreB;
      })
      .slice(0, 5);

    const strongTopics = topicAnalysis
      .filter(data => data.percentage >= 70 && data.avgScore >= 70)
      .sort((a, b) => {
        const scoreA = a.percentage * 0.6 + a.avgScore * 0.4;
        const scoreB = b.percentage * 0.6 + b.avgScore * 0.4;
        return scoreB - scoreA;
      })
      .slice(0, 3);

    // Generate sheet-specific AI-like recommendations
    const recommendations = [];
    const nextSteps = [];
    
    if (weakTopics.length > 0) {
      const weakest = weakTopics[0];
      recommendations.push(`🎯 Prioritize ${weakest.topic} - only ${weakest.percentage}% completed with ${weakest.avgScore}% avg test score`);
      recommendations.push(`⏱️ Spend more time on ${weakest.topic} problems - current avg: ${weakest.avgTime} minutes`);
      nextSteps.push(`Solve 2-3 ${weakest.topic} problems daily, focusing on understanding concepts`);
    }
    
    if (stats.totalTimeSpent < 3600) { // Less than 1 hour total
      recommendations.push('⏰ Increase daily practice time - aim for at least 1-2 hours per day');
    }
    
    const lowScoreTopics = topicAnalysis.filter(t => t.avgScore < 50 && t.solved > 0);
    if (lowScoreTopics.length > 0) {
      recommendations.push(`📚 Review fundamentals for: ${lowScoreTopics.map(t => t.topic).join(', ')}`);
    }
    
    // Sheet-specific recommendations
    if (selectedSheet === 'apnaCollege') {
      recommendations.push('🔗 Practice on LeetCode: https://leetcode.com/problemset/');
      recommendations.push('📹 Watch Apna College YouTube tutorials for weak topics');
    } else if (selectedSheet === 'loveBabbar') {
      recommendations.push('🔗 Practice on LeetCode: https://leetcode.com/problemset/');
      recommendations.push('📚 Follow Love Babbar\'s DSA playlist for detailed explanations');
    } else {
      recommendations.push('🔗 Practice on LeetCode: https://leetcode.com/problemset/');
    }
    
    nextSteps.push('Take practice tests to identify knowledge gaps');
    nextSteps.push('Review solutions and understand different approaches');
    nextSteps.push('Join coding communities for discussion and help');
    
    return {
      overallScore: Math.round((completedProblems.size / problems.reduce((sum, topic) => sum + (topic.problems?.length || 0), 0)) * 100),
      weakAreas: weakTopics.map(data => ({
        topic: data.topic,
        percentage: data.percentage,
        solved: data.solved,
        total: data.total,
        avgTime: data.avgTime,
        avgScore: data.avgScore,
        efficiency: data.efficiency,
        recommendation: generateTopicRecommendation(data),
        leetcodeLink: `https://leetcode.com/tag/${data.topic.toLowerCase().replace(/\s+/g, '-')}/`
      })),
      strongAreas: strongTopics.map(data => ({
        topic: data.topic,
        percentage: data.percentage,
        solved: data.solved,
        total: data.total,
        avgScore: data.avgScore
      })),
      recommendations,
      nextSteps,
      detailedStats: {
        totalTimeSpent: Math.round(stats.totalTimeSpent / 60), // in minutes
        avgTimePerProblem: completedProblems.size > 0 ? Math.round(stats.totalTimeSpent / completedProblems.size / 60) : 0,
        totalTests: Object.keys(stats.testScores).length,
        avgTestScore: Object.keys(stats.testScores).length > 0 ? 
          Math.round(Object.values(stats.testScores).reduce((sum, score) => sum + score, 0) / Object.keys(stats.testScores).length) : 0
      }
    };
  };
  
  const generateTopicRecommendation = (data) => {
    if (data.percentage === 0) {
      return `Start with basic ${data.topic} problems. Begin with Easy difficulty and focus on understanding core concepts.`;
    }
    if (data.avgScore < 50) {
      return `Review ${data.topic} fundamentals. Your test scores suggest conceptual gaps that need attention.`;
    }
    if (data.avgTime > 45) {
      return `Work on ${data.topic} problem-solving speed. Practice more problems to improve efficiency.`;
    }
    return `Continue practicing ${data.topic} problems. Focus on Medium and Hard difficulty levels.`;
  };

  useEffect(() => {
    if (problems.length > 0 && completedProblems.size > 0) {
      fetchAnalysisHistory();
      getUserStats().then(stats => {
        if (stats.totalTimeSpent > 0 || Object.keys(stats.testScores).length > 0) {
          const lastAnalysis = localStorage.getItem(`lastAnalysis_${selectedSheet}`);
          if (!lastAnalysis || (Date.now() - new Date(lastAnalysis).getTime()) > 24 * 60 * 60 * 1000) {
            analyzeWeakness();
          }
        }
      });
    }
  }, [selectedSheet, completedProblems.size]);

  if (!analysis && !loading) {
    return (
      <div style={{
        padding: '24px',
        backgroundColor: isDark ? '#374151' : 'white',
        borderRadius: '16px',
        border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ color: isDark ? 'white' : '#1f2937', margin: 0, fontSize: '18px', fontWeight: '700' }}>
            🤖 AI Performance Analysis
          </h4>
          <div style={{ display: 'flex', gap: '8px' }}>
            {analysisHistory.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                style={{
                  padding: '6px 12px',
                  background: isDark ? '#4b5563' : '#f3f4f6',
                  color: isDark ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                📊 History ({analysisHistory.length})
              </button>
            )}
            <button
              onClick={analyzeWeakness}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🔍 Analyze Performance
            </button>
          </div>
        </div>

        {showHistory && analysisHistory.length > 0 && (
          <div style={{
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: isDark ? '#1f2937' : '#f8fafc',
            borderRadius: '12px',
            border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`
          }}>
            <h5 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '12px', fontSize: '16px' }}>
              📈 Analysis History
            </h5>
            <div style={{ display: 'grid', gap: '8px' }}>
              {analysisHistory.slice(0, 3).map((report, index) => (
                <div key={index} className="history-item" style={{
                  padding: '12px',
                  backgroundColor: isDark ? '#374151' : 'white',
                  borderRadius: '8px',
                  border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ color: isDark ? 'white' : '#1f2937', fontWeight: '600', fontSize: '14px' }}>
                      Score: {report.overallScore}% • {report.problemsAnalyzed} problems
                    </div>
                    <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>
                      {new Date(report.reportDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: isDark ? '#60a5fa' : '#3b82f6' }}>
                    {report.weakAreas?.length || 0} weak areas
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{
          padding: '16px',
          backgroundColor: isDark ? '#1f2937' : '#f8fafc',
          borderRadius: '12px',
          textAlign: 'center',
          border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🤖</div>
          <h5 style={{ color: isDark ? 'white' : '#1f2937', margin: '0 0 8px 0', fontSize: '16px' }}>
            AI-Powered Weakness Analysis
          </h5>
          <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: '0 0 16px 0', fontSize: '14px' }}>
            Solve problems and track your time to get personalized AI insights.
            Analysis requires real performance data from your problem-solving sessions.
          </p>
          <div style={{ fontSize: '12px', color: isDark ? '#60a5fa' : '#3b82f6' }}>
            ✨ Powered by Google Gemini AI
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        padding: '24px',
        backgroundColor: isDark ? '#374151' : 'white',
        borderRadius: '16px',
        border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
        </div>
        <h4 style={{ color: isDark ? 'white' : '#1f2937', margin: '0 0 8px 0' }}>
          🤖 Gemini AI Analyzing Your Performance...
        </h4>
        <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: 0, fontSize: '14px' }}>
          Analyzing {completedProblems.size} solved problems across {problems.length} topics
        </p>
        <p style={{ color: isDark ? '#60a5fa' : '#3b82f6', margin: '8px 0 0 0', fontSize: '12px' }}>
          ✨ Powered by Google Gemini AI for personalized insights
        </p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '24px',
      backgroundColor: isDark ? '#374151' : 'white',
      borderRadius: '16px',
      border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h4 style={{ color: isDark ? 'white' : '#1f2937', margin: 0, fontSize: '18px', fontWeight: '700' }}>
          📊 AI Weakness Analysis
        </h4>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {lastAnalyzed && (
            <span style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280' }}>
              Last analyzed: {lastAnalyzed.toLocaleDateString()}
            </span>
          )}


          <button
            onClick={analyzeWeakness}
            disabled={loading}
            style={{
              padding: '6px 12px',
              background: loading ? '#6b7280' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Analyzing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Performance Stats Grid */}
      <div className="stat-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="stat-card" style={{
          padding: '16px',
          backgroundColor: isDark ? '#1f2937' : '#f0f9ff',
          borderRadius: '12px',
          textAlign: 'center',
          border: `1px solid ${isDark ? '#374151' : 'transparent'}`,
          boxShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: isDark ? 'white' : '#1f2937', marginBottom: '4px' }}>
            {analysis.overallScore}%
          </div>
          <div style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280', fontWeight: '500' }}>
            Overall Score
          </div>
        </div>
        <div className="stat-card" style={{
          padding: '16px',
          backgroundColor: isDark ? '#1f2937' : '#f0fdf4',
          borderRadius: '12px',
          textAlign: 'center',
          border: `1px solid ${isDark ? '#374151' : 'transparent'}`,
          boxShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏱️</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: isDark ? 'white' : '#1f2937', marginBottom: '4px' }}>
            {analysis.detailedStats?.totalTimeSpent || 0}m
          </div>
          <div style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280', fontWeight: '500' }}>
            Total Time
          </div>
        </div>
        <div className="stat-card" style={{
          padding: '16px',
          backgroundColor: isDark ? '#1f2937' : '#fefce8',
          borderRadius: '12px',
          textAlign: 'center',
          border: `1px solid ${isDark ? '#374151' : 'transparent'}`,
          boxShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: isDark ? 'white' : '#1f2937', marginBottom: '4px' }}>
            {analysis.detailedStats?.avgTimePerProblem || 0}m
          </div>
          <div style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280', fontWeight: '500' }}>
            Avg Time/Problem
          </div>
        </div>
        <div className="stat-card" style={{
          padding: '16px',
          backgroundColor: isDark ? '#1f2937' : '#fdf4ff',
          borderRadius: '12px',
          textAlign: 'center',
          border: `1px solid ${isDark ? '#374151' : 'transparent'}`,
          boxShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📝</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: isDark ? 'white' : '#1f2937', marginBottom: '4px' }}>
            {analysis.detailedStats?.totalTests || 0}
          </div>
          <div style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280', fontWeight: '500' }}>
            Tests Taken
          </div>
          <div style={{ fontSize: '10px', color: isDark ? '#6b7280' : '#9ca3af', marginTop: '2px' }}>
            {analysis.detailedStats?.avgTestScore || 0}% avg score
          </div>
        </div>
      </div>



      {/* Weak Areas */}
      {analysis.weakAreas && analysis.weakAreas.length > 0 ? (
        <div style={{ marginBottom: '20px' }}>
          <h5 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
            🎯 Areas for Improvement
          </h5>
          <div style={{ display: 'grid', gap: '12px' }}>
            {analysis.weakAreas.map((area, index) => (
              <div key={index} className="weak-area-card" style={{
                padding: '16px',
                backgroundColor: isDark ? '#1f2937' : '#fef2f2',
                borderRadius: '12px',
                border: `1px solid ${isDark ? '#374151' : '#fecaca'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: isDark ? 'white' : '#1f2937', fontWeight: '600', fontSize: '16px' }}>
                    {area.topic}
                  </span>
                  <span style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600' }}>
                    {area.percentage}% ({area.solved}/{area.total})
                  </span>
                </div>
                
                {/* Performance metrics */}
                {area.avgTime !== undefined && (
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', fontSize: '12px' }}>
                    <span style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                      ⏱️ Avg Time: {area.avgTime}m
                    </span>
                    <span style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                      📊 Avg Score: {area.avgScore}%
                    </span>
                    <span style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                      ⚡ Efficiency: {area.efficiency}
                    </span>
                  </div>
                )}
                
                <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: '0 0 12px 0', fontSize: '13px', lineHeight: '1.4' }}>
                  {area.recommendation}
                </p>
                
                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={area.leetcodeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    🔗 Practice on LeetCode
                  </a>
                  <button
                    style={{
                      padding: '6px 12px',
                      backgroundColor: isDark ? '#374151' : '#e5e7eb',
                      color: isDark ? '#d1d5db' : '#374151',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      // Focus on this topic in the main sheet
                      const topicElement = document.querySelector(`[data-topic="${area.topic}"]`);
                      if (topicElement) {
                        topicElement.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    📚 View Problems
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          padding: '20px',
          backgroundColor: isDark ? '#1f2937' : '#f0fdf4',
          borderRadius: '12px',
          marginBottom: '20px',
          textAlign: 'center',
          border: `1px solid ${isDark ? '#374151' : '#bbf7d0'}`
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎉</div>
          <h5 style={{ color: isDark ? 'white' : '#1f2937', margin: '0 0 8px 0', fontSize: '18px' }}>Excellent Performance!</h5>
          <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: '0 0 16px 0', fontSize: '14px' }}>
            No significant weak areas detected. You're performing well across all topics!
          </p>
          <a
            href="https://leetcode.com/problemset/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px 16px',
              backgroundColor: '#22c55e',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            🚀 Challenge Yourself on LeetCode
          </a>
        </div>
      )}

      {/* Strong Areas */}
      {analysis.strongAreas && analysis.strongAreas.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h5 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
            ✨ Strong Areas
          </h5>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {analysis.strongAreas.map((area, index) => (
              <div key={index} style={{
                padding: '8px 12px',
                backgroundColor: isDark ? '#1f2937' : '#f0fdf4',
                borderRadius: '6px',
                border: `1px solid ${isDark ? '#374151' : '#bbf7d0'}`,
                fontSize: '12px'
              }}>
                <span style={{ color: isDark ? 'white' : '#1f2937', fontWeight: '600' }}>{area.topic}</span>
                <span style={{ color: '#22c55e', marginLeft: '4px' }}>({area.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analysis.recommendations && (
        <div style={{ marginBottom: '20px' }}>
          <h5 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
            💡 AI Recommendations
          </h5>
          <div style={{ display: 'grid', gap: '8px' }}>
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="recommendation-item" style={{
                padding: '12px',
                backgroundColor: isDark ? '#1f2937' : '#eff6ff',
                borderRadius: '8px',
                border: `1px solid ${isDark ? '#374151' : '#bfdbfe'}`,
                fontSize: '14px',
                color: isDark ? '#d1d5db' : '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '16px' }}>•</span>
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time Management Issues */}
      {analysis.timeManagementIssues && analysis.timeManagementIssues.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h5 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
            ⏱️ Time Management Issues
          </h5>
          <div style={{ display: 'grid', gap: '12px' }}>
            {analysis.timeManagementIssues.map((issue, index) => (
              <div key={index} style={{
                padding: '12px',
                backgroundColor: isDark ? '#1f2937' : '#fef3c7',
                borderRadius: '8px',
                border: `1px solid ${isDark ? '#374151' : '#fbbf24'}`
              }}>
                <div style={{ fontWeight: '600', color: isDark ? 'white' : '#1f2937', marginBottom: '4px' }}>
                  "{issue.problemTitle}" - {issue.timeSpent} minutes
                </div>
                <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: 0, fontSize: '13px' }}>
                  {issue.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time Analysis */}
      {analysis.timeAnalysis && (
        <div style={{ marginBottom: '20px' }}>
          <h5 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
            ⏱️ Time Analysis
          </h5>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div style={{
              padding: '12px',
              backgroundColor: isDark ? '#1f2937' : '#f0fdf4',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#22c55e' }}>
                {analysis.timeAnalysis.fastSolvers}
              </div>
              <div style={{ fontSize: '11px', color: isDark ? '#9ca3af' : '#6b7280' }}>Fast (≤15min)</div>
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: isDark ? '#1f2937' : '#fefce8',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>
                {analysis.timeAnalysis.moderateSolvers}
              </div>
              <div style={{ fontSize: '11px', color: isDark ? '#9ca3af' : '#6b7280' }}>Moderate (15-45min)</div>
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: isDark ? '#1f2937' : '#fef2f2',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>
                {analysis.timeAnalysis.slowSolvers}
              </div>
              <div style={{ fontSize: '11px', color: isDark ? '#9ca3af' : '#6b7280' }}>Slow (>45min)</div>
            </div>
          </div>
          {analysis.timeAnalysis.insights && (
            <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: 0, fontSize: '13px', fontStyle: 'italic' }}>
              {analysis.timeAnalysis.insights}
            </p>
          )}
        </div>
      )}

      {/* Test Performance Issues - Only for problems with actual tests */}
      {analysis.testPerformanceIssues && analysis.testPerformanceIssues.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h5 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
            📊 Test Performance Issues (Tests Taken)
          </h5>
          <div style={{ display: 'grid', gap: '12px' }}>
            {analysis.testPerformanceIssues.map((issue, index) => (
              <div key={index} style={{
                padding: '12px',
                backgroundColor: isDark ? '#1f2937' : '#fef2f2',
                borderRadius: '8px',
                border: `1px solid ${isDark ? '#374151' : '#fecaca'}`
              }}>
                <div style={{ fontWeight: '600', color: isDark ? 'white' : '#1f2937', marginBottom: '4px' }}>
                  "{issue.problemTitle}" - {issue.score}% score
                </div>
                <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: 0, fontSize: '13px' }}>
                  {issue.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Detailed Insights */}
      {analysis.detailedInsights && (
        <div style={{ marginBottom: '20px' }}>
          <h5 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
            🤖 AI Detailed Analysis
          </h5>
          <div style={{
            padding: '16px',
            backgroundColor: isDark ? '#1f2937' : '#f0f9ff',
            borderRadius: '12px',
            border: `1px solid ${isDark ? '#374151' : '#bae6fd'}`,
            fontSize: '14px',
            lineHeight: '1.6',
            color: isDark ? '#d1d5db' : '#374151'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '16px' }}>✨</span>
              <span className="ai-badge" style={{ fontWeight: '600', color: isDark ? '#60a5fa' : '#3b82f6' }}>Powered by Google Gemini AI</span>
            </div>
            {analysis.detailedInsights}
          </div>
        </div>
      )}

      {/* Next Steps with LeetCode Links */}
      {analysis.nextSteps && (
        <div>
          <h5 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
            🚀 Next Steps - Recommended Problems
          </h5>
          <div style={{ display: 'grid', gap: '12px' }}>
            {analysis.nextSteps.map((step, index) => (
              <div key={index} style={{
                padding: '12px',
                backgroundColor: isDark ? '#1f2937' : '#fefce8',
                borderRadius: '8px',
                border: `1px solid ${isDark ? '#374151' : '#fde68a'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '600', color: isDark ? 'white' : '#1f2937' }}>
                    {typeof step === 'string' ? step : step.title}
                  </span>
                  {typeof step === 'object' && step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      🔗 Solve
                    </a>
                  )}
                </div>
                {typeof step === 'object' && step.reason && (
                  <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: 0, fontSize: '12px' }}>
                    {step.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeaknessAnalysisSection;