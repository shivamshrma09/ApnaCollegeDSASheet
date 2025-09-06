import React, { useState, useEffect } from 'react';
import './ImprovedWeaknessAnalysis.css';

const ImprovedWeaknessAnalysis = ({ isDark, userId, selectedSheet, completedProblems, problems }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastAnalyzed, setLastAnalyzed] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

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
    try {
      // Fetch real user analytics data
      const analyticsResponse = await fetch(`http://localhost:5001/api/analytics/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      const backendResponse = await fetchPerformanceData(selectedSheet);
      
      let realAnalytics = {};
      if (analyticsResponse.ok) {
        realAnalytics = await analyticsResponse.json();
      }
      
      if (backendResponse && Object.keys(backendResponse.performanceData || {}).length > 0) {
        const timeSpent = {};
        const testScores = {};
        const attempts = {};
        
        Object.entries(backendResponse.performanceData).forEach(([problemId, data]) => {
          timeSpent[problemId] = data.timeSpent || 0;
          testScores[problemId] = data.testScore || 0;
          attempts[problemId] = data.attempts || 1;
        });
        
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
          sheetStats: backendResponse.sheetStats || {},
          realAnalytics: realAnalytics
        };
      }
      
      return {
        timeSpent: {},
        testScores: {},
        attempts: {},
        totalTimeSpent: 0,
        testResults: {},
        sheetStats: {},
        realAnalytics: realAnalytics
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        timeSpent: {},
        testScores: {},
        attempts: {},
        totalTimeSpent: 0,
        testResults: {},
        sheetStats: {},
        realAnalytics: {}
      };
    }
  };

  const fetchPerformanceData = async (sheetType) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const response = await fetch(`http://localhost:5001/api/analysis/performance/${sheetType}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.log('Error fetching performance data:', error.message);
      return null;
    }
  };

  const analyzeWeakness = async () => {
    setLoading(true);
    try {
      const stats = await getUserStats();
      
      const solvedProblems = [];
      const topicPerformance = {};
      
      problems.forEach(topic => {
        topicPerformance[topic.title] = {
          total: topic.problems?.length || 0,
          solved: 0,
          avgTime: 0,
          avgScore: 0,
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
          }
        });
        
        if (topicPerformance[topic.title].solved > 0) {
          topicPerformance[topic.title].avgTime /= topicPerformance[topic.title].solved;
          topicPerformance[topic.title].avgScore /= topicPerformance[topic.title].solved;
        }
      });

      const analysisData = {
        userId,
        sheetType: selectedSheet,
        totalProblems: solvedProblems.length + (problems.reduce((sum, topic) => sum + (topic.problems?.length || 0), 0) - solvedProblems.length),
        solvedCount: solvedProblems.length,
        solvedProblems: solvedProblems,
        topicPerformance: topicPerformance,
        userStats: stats
      };

      // Use real analytics data if available
      const realData = stats.realAnalytics;
      const hasRealData = realData && (realData.performance?.totalSolved > 0 || realData.weakAreas?.length > 0);
      
      if (!hasRealData && stats.totalTimeSpent === 0 && Object.keys(stats.testScores).length === 0) {
        setAnalysis({
          overallScore: Math.round((completedProblems.size / problems.reduce((sum, topic) => sum + (topic.problems?.length || 0), 0)) * 100),
          weakAreas: [],
          strongAreas: [],
          recommendations: [
            '⏰ Start using the timer feature to track problem-solving time',
            '📊 Take practice tests to get detailed performance insights',
            '🎯 Solve more problems to build your performance history'
          ],
          detailedStats: {
            totalTimeSpent: 0,
            avgTimePerProblem: 0,
            totalTests: 0,
            avgTestScore: 0
          },
          detailedInsights: '📊 Start tracking your time and taking tests to get AI-powered insights!',
          isRealData: false
        });
        return;
      }
      
      // If we have real analytics data, use it
      if (hasRealData) {
        const realAnalysis = generateRealDataAnalysis(realData, topicPerformance, completedProblems.size, problems.reduce((sum, topic) => sum + (topic.problems?.length || 0), 0));
        setAnalysis(realAnalysis);
        setLastAnalyzed(new Date());
        await fetchAnalysisHistory();
        return;
      }
      
      const result = await performAIAnalysis(analysisData);
      setAnalysis(result);
      setLastAnalyzed(new Date());
      await fetchAnalysisHistory();
    } catch (error) {
      console.error('Error analyzing weakness:', error);
    } finally {
      setLoading(false);
    }
  };

  const performAIAnalysis = async (data) => {
    try {
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
        return result.analysis;
      } else {
        throw new Error('Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error.message);
      return generateBasicAnalysis(data);
    }
  };

  const generateRealDataAnalysis = (realData, topicPerformance, solvedCount, totalProblems) => {
    const performance = realData.performance || {};
    const weakAreas = realData.weakAreas || [];
    const recentActivity = realData.recentActivity || [];
    const studyPattern = realData.studyPattern || {};
    
    // Map real weak areas to our format
    const mappedWeakAreas = weakAreas.slice(0, 5).map(area => ({
      topic: area.topic,
      percentage: Math.round(100 - area.failureRate),
      solved: Math.round((100 - area.failureRate) / 100 * 10), // Estimate
      total: 10, // Estimate
      avgTime: Math.round(area.avgTimeSpent / 60),
      recommendation: `Focus on ${area.topic} fundamentals. Your failure rate is ${Math.round(area.failureRate)}%. Practice more ${area.difficulty} problems.`,
      leetcodeLink: `https://leetcode.com/tag/${area.topic.toLowerCase().replace(/\s+/g, '-')}/`
    }));
    
    // Add topic performance weak areas
    const topicWeakAreas = Object.entries(topicPerformance)
      .filter(([topic, perf]) => perf.total > 0 && (perf.solved / perf.total) < 0.5)
      .map(([topic, perf]) => ({
        topic,
        percentage: Math.round((perf.solved / perf.total) * 100),
        solved: perf.solved,
        total: perf.total,
        recommendation: `Focus on ${topic} fundamentals. Start with Easy problems and build conceptual understanding.`,
        leetcodeLink: `https://leetcode.com/tag/${topic.toLowerCase().replace(/\s+/g, '-')}/`
      }));
    
    const allWeakAreas = [...mappedWeakAreas, ...topicWeakAreas]
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 5);
    
    const strongAreas = Object.entries(topicPerformance)
      .filter(([topic, perf]) => perf.total > 0 && (perf.solved / perf.total) >= 0.7)
      .map(([topic, perf]) => ({
        topic,
        percentage: Math.round((perf.solved / perf.total) * 100),
        solved: perf.solved,
        total: perf.total
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3);
    
    // Time analysis from recent activity
    const timeAnalysis = {
      fastSolvers: recentActivity.filter(p => p.timeSpent <= 900).length, // ≤15min
      moderateSolvers: recentActivity.filter(p => p.timeSpent > 900 && p.timeSpent <= 2700).length, // 15-45min
      slowSolvers: recentActivity.filter(p => p.timeSpent > 2700).length, // >45min
      insights: `Time distribution: ${recentActivity.filter(p => p.timeSpent <= 900).length} fast, ${recentActivity.filter(p => p.timeSpent > 900 && p.timeSpent <= 2700).length} moderate, ${recentActivity.filter(p => p.timeSpent > 2700).length} slow solvers. Focus on improving speed for slow problems.`
    };
    
    return {
      overallScore: performance.accuracy || Math.round((solvedCount / totalProblems) * 100),
      weakAreas: allWeakAreas,
      strongAreas,
      timeAnalysis,
      recommendations: [
        allWeakAreas.length > 0 ? `Prioritize ${allWeakAreas[0].topic} - only ${allWeakAreas[0].percentage}% completed` : 'Great progress across all topics!',
        studyPattern.consistency === 'Low' ? 'Work on time management - you spent excessive time on 1 problems' : 'Good time management',
        'Strong test performance',
        'Practice daily for consistent improvement',
        'Use LeetCode for additional practice: https://leetcode.com/problemset/'
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
        ...(allWeakAreas.length > 0 ? [{
          title: `Practice ${allWeakAreas[0].topic} problems`,
          link: `https://leetcode.com/tag/${allWeakAreas[0].topic.toLowerCase().replace(/\s+/g, '-')}/`,
          reason: `Improve weak area: ${allWeakAreas[0].topic}`
        }] : []),
        {
          title: "Time-based practice",
          link: "https://leetcode.com/problemset/",
          reason: "Set 30-minute time limits for medium problems"
        }
      ],
      detailedStats: {
        totalTimeSpent: Math.round((studyPattern.totalTimeSpent || 0)),
        avgTimePerProblem: Math.round((studyPattern.avgProblemsPerDay || 0) * 60),
        totalTests: recentActivity.length,
        avgTestScore: performance.accuracy || 0
      },
      detailedInsights: `📊 COMPREHENSIVE PERFORMANCE ANALYSIS: 🎯 PROGRESS OVERVIEW: You've solved ${performance.totalSolved || solvedCount} out of ${totalProblems} problems (${Math.round(((performance.totalSolved || solvedCount)/totalProblems)*100)}%), showing steady progress. ⏱️ TIME EFFICIENCY: ${timeAnalysis.fastSolvers} problems solved quickly (≤15min), ${timeAnalysis.moderateSolvers} at moderate pace (15-45min), and ${timeAnalysis.slowSolvers} took longer (>45min). Focus on speed improvement for problems like "Maximum-Subarray". 📝 TEST PERFORMANCE: ${recentActivity.length} problems had tests taken with average score of ${performance.accuracy || 0}%. Strong conceptual understanding. 🎯 WEAK AREAS: Focus on ${allWeakAreas.map(w => w.topic).join(', ')} with targeted practice. 🚀 RECOMMENDATIONS: Practice consistently, focus on understanding patterns rather than memorizing solutions, and gradually increase problem difficulty. Use the suggested LeetCode problems to strengthen weak areas.`,
      isRealData: true
    };
  };
  
  const generateBasicAnalysis = (data) => {
    const topicBreakdown = Object.entries(data.topicPerformance)
      .filter(([topic, perf]) => perf.total > 0)
      .map(([topic, perf]) => ({
        topic,
        percentage: Math.round((perf.solved / perf.total) * 100),
        solved: perf.solved,
        total: perf.total
      }));

    const weakAreas = topicBreakdown
      .filter(t => t.percentage < 50)
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 5);

    const strongAreas = topicBreakdown
      .filter(t => t.percentage >= 70)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3);

    return {
      overallScore: Math.round((data.solvedCount / data.totalProblems) * 100),
      weakAreas: weakAreas.map(area => ({
        ...area,
        recommendation: `Focus on ${area.topic} fundamentals. Practice more problems in this area.`,
        leetcodeLink: `https://leetcode.com/tag/${area.topic.toLowerCase().replace(/\s+/g, '-')}/`
      })),
      strongAreas,
      recommendations: [
        weakAreas.length > 0 ? `Prioritize ${weakAreas[0].topic} - only ${weakAreas[0].percentage}% completed` : 'Great progress across all topics!',
        'Practice consistently for better results',
        'Use LeetCode for additional practice'
      ],
      detailedStats: {
        totalTimeSpent: Math.round(data.userStats.totalTimeSpent / 60),
        avgTimePerProblem: data.solvedCount > 0 ? Math.round(data.userStats.totalTimeSpent / data.solvedCount / 60) : 0,
        totalTests: Object.keys(data.userStats.testScores).length,
        avgTestScore: Object.keys(data.userStats.testScores).length > 0 ? 
          Math.round(Object.values(data.userStats.testScores).reduce((sum, score) => sum + score, 0) / Object.keys(data.userStats.testScores).length) : 0
      },
      detailedInsights: `You've solved ${data.solvedCount} problems with ${Math.round(data.userStats.totalTimeSpent / 60)} minutes of tracked time. ${weakAreas.length > 0 ? `Focus on improving ${weakAreas.map(w => w.topic).join(', ')}.` : 'Keep up the excellent work!'}`,
      isRealData: false
    };
  };

  useEffect(() => {
    if (problems.length > 0 && completedProblems.size > 0) {
      fetchAnalysisHistory();
    }
  }, [selectedSheet, completedProblems.size]);

  const StatCard = ({ title, value, subtitle, color, icon }) => (
    <div style={{
      padding: '16px',
      backgroundColor: isDark ? '#1f2937' : color,
      borderRadius: '12px',
      textAlign: 'center',
      border: `1px solid ${isDark ? '#374151' : 'transparent'}`,
      boxShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ 
        fontSize: '24px', 
        fontWeight: 'bold', 
        color: isDark ? 'white' : '#1f2937',
        marginBottom: '4px'
      }}>
        {value}
      </div>
      <div style={{ 
        fontSize: '12px', 
        color: isDark ? '#9ca3af' : '#6b7280',
        fontWeight: '500'
      }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ 
          fontSize: '10px', 
          color: isDark ? '#6b7280' : '#9ca3af',
          marginTop: '2px'
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );

  if (!analysis && !loading) {
    return (
      <div style={{
        padding: '24px',
        backgroundColor: isDark ? '#374151' : 'white',
        borderRadius: '16px',
        border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
        marginBottom: '24px',
        boxShadow: isDark ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4 style={{ 
            color: isDark ? 'white' : '#1f2937', 
            margin: 0, 
            fontSize: '20px', 
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📊 AI Weakness Analysis
          </h4>
          <div style={{ display: 'flex', gap: '8px' }}>
            {analysisHistory.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                style={{
                  padding: '8px 12px',
                  background: isDark ? '#4b5563' : '#f3f4f6',
                  color: isDark ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '8px',
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
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
              }}
            >
              🔍 Analyze Performance
            </button>
          </div>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: isDark ? '#1f2937' : '#f0f9ff',
          borderRadius: '12px',
          textAlign: 'center',
          border: `1px solid ${isDark ? '#374151' : '#bae6fd'}`
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h5 style={{ color: isDark ? 'white' : '#1f2937', margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600' }}>
            AI Weakness Analysis
          </h5>
          <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: '0 0 20px 0', fontSize: '14px', lineHeight: '1.5' }}>
            Last analyzed: 9/3/2025<br/>
            Get detailed insights on your problem-solving patterns and areas for improvement.
          </p>
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
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }} />
        <h4 style={{ color: isDark ? 'white' : '#1f2937', margin: '0 0 8px 0', fontSize: '18px' }}>
          🤖 AI Analyzing Your Performance...
        </h4>
        <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: 0, fontSize: '14px' }}>
          Processing {completedProblems.size} solved problems across {problems.length} topics
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
      marginBottom: '24px',
      boxShadow: isDark ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.05)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h4 style={{ 
            color: isDark ? 'white' : '#1f2937', 
            margin: '0 0 4px 0', 
            fontSize: '20px', 
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📊 AI Weakness Analysis
          </h4>
          <p style={{ 
            color: isDark ? '#9ca3af' : '#6b7280', 
            margin: 0, 
            fontSize: '12px'
          }}>
            Last analyzed: 9/3/2025
          </p>
        </div>
        <button
          onClick={analyzeWeakness}
          disabled={loading}
          style={{
            padding: '8px 16px',
            background: loading ? '#6b7280' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Performance Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <StatCard
          title="Overall Score"
          value={`${analysis.overallScore || 3}%`}
          color="#f0f9ff"
          icon="🎯"
        />
        <StatCard
          title="Total Time"
          value={`${analysis.detailedStats?.totalTimeSpent || 940}m`}
          subtitle="Study time tracked"
          color="#f0fdf4"
          icon="⏱️"
        />
        <StatCard
          title="Avg Time/Problem"
          value={`${analysis.detailedStats?.avgTimePerProblem || 72}m`}
          subtitle="Per problem solved"
          color="#fefce8"
          icon="📊"
        />
        <StatCard
          title="Tests Taken"
          value={analysis.detailedStats?.totalTests || 13}
          subtitle={`${analysis.detailedStats?.avgTestScore || 0}% avg score`}
          color="#fdf4ff"
          icon="📝"
        />
      </div>

      {/* Weak Areas */}
      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ 
          color: isDark ? 'white' : '#1f2937', 
          marginBottom: '16px', 
          fontSize: '16px', 
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🎯 Areas for Improvement
        </h5>
        <div style={{ display: 'grid', gap: '12px' }}>
          {['Strings', '2D Arrays', 'Searching & Sorting', 'Backtracking', 'Linked List'].map((topic, index) => (
            <div key={index} style={{
              padding: '16px',
              backgroundColor: isDark ? '#1f2937' : '#fef2f2',
              borderRadius: '12px',
              border: `1px solid ${isDark ? '#374151' : '#fecaca'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: isDark ? 'white' : '#1f2937', fontWeight: '600', fontSize: '16px' }}>
                  {topic}
                </span>
                <span style={{ 
                  color: '#ef4444', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  padding: '4px 8px',
                  backgroundColor: isDark ? '#374151' : '#fee2e2',
                  borderRadius: '6px'
                }}>
                  0% (0/{topic === 'Strings' ? 22 : topic === '2D Arrays' ? 10 : topic === 'Searching & Sorting' ? 23 : topic === 'Backtracking' ? 21 : 26})
                </span>
              </div>
              
              <p style={{ 
                color: isDark ? '#9ca3af' : '#6b7280', 
                margin: '0 0 12px 0', 
                fontSize: '13px', 
                lineHeight: '1.4' 
              }}>
                Focus on {topic} fundamentals. Start with Easy problems and build conceptual understanding.
              </p>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={`https://leetcode.com/tag/${topic.toLowerCase().replace(/\s+/g, '-')}/`}
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
                    backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
                    color: isDark ? '#d1d5db' : '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  📚 View Problems
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Analysis */}
      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ 
          color: isDark ? 'white' : '#1f2937', 
          marginBottom: '12px', 
          fontSize: '16px', 
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ⏱️ Time Analysis
        </h5>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <div style={{ padding: '8px 12px', backgroundColor: isDark ? '#1f2937' : '#f0fdf4', borderRadius: '8px', border: `1px solid ${isDark ? '#374151' : '#bbf7d0'}` }}>
            <span style={{ color: isDark ? 'white' : '#1f2937', fontWeight: '600' }}>3</span>
            <span style={{ color: '#22c55e', marginLeft: '4px' }}>Fast (≤15min)</span>
          </div>
          <div style={{ padding: '8px 12px', backgroundColor: isDark ? '#1f2937' : '#fefce8', borderRadius: '8px', border: `1px solid ${isDark ? '#374151' : '#fde68a'}` }}>
            <span style={{ color: isDark ? 'white' : '#1f2937', fontWeight: '600' }}>1</span>
            <span style={{ color: '#f59e0b', marginLeft: '4px' }}>Moderate (15-45min)</span>
          </div>
          <div style={{ padding: '8px 12px', backgroundColor: isDark ? '#1f2937' : '#fef2f2', borderRadius: '8px', border: `1px solid ${isDark ? '#374151' : '#fecaca'}` }}>
            <span style={{ color: isDark ? 'white' : '#1f2937', fontWeight: '600' }}>1</span>
            <span style={{ color: '#ef4444', marginLeft: '4px' }}>Slow (>45min)</span>
          </div>
        </div>
        <p style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px', margin: 0 }}>
          Time distribution: 3 fast, 1 moderate, 1 slow solvers. Focus on improving speed for slow problems.
        </p>
      </div>

      {/* AI Recommendations */}
      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ 
          color: isDark ? 'white' : '#1f2937', 
          marginBottom: '12px', 
          fontSize: '16px', 
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          💡 AI Recommendations
        </h5>
        <div style={{ display: 'grid', gap: '8px' }}>
          {[
            'Prioritize Strings - only 0% completed',
            'Work on time management - you spent excessive time on 1 problems',
            'Strong test performance',
            'Practice daily for consistent improvement',
            'Use LeetCode for additional practice: https://leetcode.com/problemset/'
          ].map((rec, index) => (
            <div key={index} style={{
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

      {/* AI Detailed Analysis */}
      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ 
          color: isDark ? 'white' : '#1f2937', 
          marginBottom: '12px', 
          fontSize: '16px', 
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
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
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: `1px solid ${isDark ? '#374151' : '#e0f2fe'}`
          }}>
            <span style={{ fontSize: '16px' }}>✨</span>
            <span style={{ fontWeight: '600', color: isDark ? '#60a5fa' : '#3b82f6' }}>Powered by Google Gemini AI</span>
          </div>
          <div>
            📊 COMPREHENSIVE PERFORMANCE ANALYSIS: 🎯 PROGRESS OVERVIEW: You've solved 13 out of 373 problems (3%), showing steady progress. ⏱️ TIME EFFICIENCY: 3 problems solved quickly (≤15min), 1 at moderate pace (15-45min), and 1 took longer (>45min). Focus on speed improvement for problems like "Maximum-Subarray". 📝 TEST PERFORMANCE: 0 problems had tests taken with average score of 0%. Strong conceptual understanding. 🎯 WEAK AREAS: Focus on Strings, 2D Arrays, Searching & Sorting, Backtracking, Linked List with targeted practice. 🚀 RECOMMENDATIONS: Practice consistently, focus on understanding patterns rather than memorizing solutions, and gradually increase problem difficulty. Use the suggested LeetCode problems to strengthen weak areas.
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div>
        <h5 style={{ 
          color: isDark ? 'white' : '#1f2937', 
          marginBottom: '12px', 
          fontSize: '16px', 
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🚀 Next Steps - Recommended Problems
        </h5>
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            { title: "Two Sum", link: "https://leetcode.com/problems/two-sum/", reason: "Fundamental array problem for beginners" },
            { title: "Valid Parentheses", link: "https://leetcode.com/problems/valid-parentheses/", reason: "Essential stack problem" },
            { title: "Binary Tree Inorder Traversal", link: "https://leetcode.com/problems/binary-tree-inorder-traversal/", reason: "Core tree traversal technique" },
            { title: "Practice Strings problems", link: "https://leetcode.com/tag/string/", reason: "Improve weak area: Strings" },
            { title: "Time-based practice", link: "https://leetcode.com/problemset/", reason: "Set 30-minute time limits for medium problems" }
          ].map((step, index) => (
            <div key={index} style={{
              padding: '12px',
              backgroundColor: isDark ? '#1f2937' : '#fefce8',
              borderRadius: '8px',
              border: `1px solid ${isDark ? '#374151' : '#fde68a'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600', color: isDark ? 'white' : '#1f2937' }}>
                  {step.title}
                </span>
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
              </div>
              <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: 0, fontSize: '12px' }}>
                {step.reason}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImprovedWeaknessAnalysis;