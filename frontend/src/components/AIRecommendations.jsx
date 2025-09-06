import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const AIRecommendations = ({ userId, completedProblems, problems, onClose }) => {
  const { isDark } = useTheme();
  const [recommendations, setRecommendations] = useState([]);
  const [weakAreas, setWeakAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    analyzeUserPerformance();
  }, []);

  const analyzeUserPerformance = () => {
    setLoading(true);
    
    // Analyze user's weak areas based on completion patterns
    const topicAnalysis = analyzeTopicPerformance();
    const difficultyAnalysis = analyzeDifficultyPerformance();
    const companyAnalysis = analyzeCompanyPerformance();
    
    const weakTopics = identifyWeakAreas(topicAnalysis);
    const recommendedProblems = generateRecommendations(weakTopics, difficultyAnalysis);
    
    setWeakAreas(weakTopics);
    setRecommendations(recommendedProblems);
    setAnalysisData({
      topics: topicAnalysis,
      difficulty: difficultyAnalysis,
      companies: companyAnalysis,
      totalSolved: completedProblems.size,
      accuracy: calculateAccuracy()
    });
    
    setLoading(false);
  };

  const analyzeTopicPerformance = () => {
    const topicStats = {};
    
    problems.forEach(topic => {
      const totalProblems = topic.problems.length;
      const solvedProblems = topic.problems.filter(p => completedProblems.has(p.id)).length;
      const completionRate = totalProblems > 0 ? (solvedProblems / totalProblems) * 100 : 0;
      
      topicStats[topic.title] = {
        total: totalProblems,
        solved: solvedProblems,
        completionRate,
        difficulty: calculateTopicDifficulty(topic.problems),
        priority: calculateTopicPriority(topic.title, completionRate)
      };
    });
    
    return topicStats;
  };

  const analyzeDifficultyPerformance = () => {
    const difficultyStats = { Easy: 0, Medium: 0, Hard: 0 };
    const difficultyTotal = { Easy: 0, Medium: 0, Hard: 0 };
    
    problems.forEach(topic => {
      topic.problems.forEach(problem => {
        difficultyTotal[problem.difficulty]++;
        if (completedProblems.has(problem.id)) {
          difficultyStats[problem.difficulty]++;
        }
      });
    });
    
    return {
      Easy: { solved: difficultyStats.Easy, total: difficultyTotal.Easy, rate: (difficultyStats.Easy / difficultyTotal.Easy) * 100 },
      Medium: { solved: difficultyStats.Medium, total: difficultyTotal.Medium, rate: (difficultyStats.Medium / difficultyTotal.Medium) * 100 },
      Hard: { solved: difficultyStats.Hard, total: difficultyTotal.Hard, rate: (difficultyStats.Hard / difficultyTotal.Hard) * 100 }
    };
  };

  const analyzeCompanyPerformance = () => {
    const companyStats = {};
    const topCompanies = ['Amazon', 'Google', 'Microsoft', 'Meta', 'Apple'];
    
    topCompanies.forEach(company => {
      let total = 0;
      let solved = 0;
      
      problems.forEach(topic => {
        topic.problems.forEach(problem => {
          if (problem.companies && problem.companies.includes(company)) {
            total++;
            if (completedProblems.has(problem.id)) {
              solved++;
            }
          }
        });
      });
      
      if (total > 0) {
        companyStats[company] = {
          total,
          solved,
          rate: (solved / total) * 100
        };
      }
    });
    
    return companyStats;
  };

  const calculateTopicDifficulty = (problems) => {
    const diffCount = { Easy: 0, Medium: 0, Hard: 0 };
    problems.forEach(p => diffCount[p.difficulty]++);
    
    if (diffCount.Hard > diffCount.Medium) return 'Hard';
    if (diffCount.Medium > diffCount.Easy) return 'Medium';
    return 'Easy';
  };

  const calculateTopicPriority = (topicName, completionRate) => {
    const importantTopics = ['Arrays', 'Strings', 'LinkedList', 'Binary Trees', 'Dynamic Programming'];
    const isImportant = importantTopics.includes(topicName);
    
    if (completionRate < 30 && isImportant) return 'High';
    if (completionRate < 50) return 'Medium';
    return 'Low';
  };

  const identifyWeakAreas = (topicAnalysis) => {
    return Object.entries(topicAnalysis)
      .filter(([topic, stats]) => stats.completionRate < 60)
      .sort((a, b) => a[1].completionRate - b[1].completionRate)
      .slice(0, 5)
      .map(([topic, stats]) => ({
        topic,
        completionRate: stats.completionRate,
        priority: stats.priority,
        solved: stats.solved,
        total: stats.total
      }));
  };

  const generateRecommendations = (weakTopics, difficultyAnalysis) => {
    const recommendations = [];
    
    weakTopics.forEach(weakArea => {
      const topicProblems = problems.find(t => t.title === weakArea.topic)?.problems || [];
      const unsolvedProblems = topicProblems.filter(p => !completedProblems.has(p.id));
      
      // Recommend based on user's difficulty comfort level
      const userLevel = getUserLevel(difficultyAnalysis);
      const filteredProblems = filterProblemsByLevel(unsolvedProblems, userLevel);
      
      // Take top 3 problems from each weak area
      const topProblems = filteredProblems.slice(0, 3);
      
      recommendations.push({
        category: weakArea.topic,
        reason: `Only ${Math.round(weakArea.completionRate)}% completed`,
        priority: weakArea.priority,
        problems: topProblems
      });
    });
    
    return recommendations.slice(0, 4); // Top 4 categories
  };

  const getUserLevel = (difficultyAnalysis) => {
    const easyRate = difficultyAnalysis.Easy.rate || 0;
    const mediumRate = difficultyAnalysis.Medium.rate || 0;
    
    if (easyRate < 70) return 'beginner';
    if (mediumRate < 50) return 'intermediate';
    return 'advanced';
  };

  const filterProblemsByLevel = (problems, level) => {
    const levelMap = {
      beginner: ['Easy'],
      intermediate: ['Easy', 'Medium'],
      advanced: ['Medium', 'Hard']
    };
    
    return problems.filter(p => levelMap[level].includes(p.difficulty));
  };

  const calculateAccuracy = () => {
    // Simulate accuracy based on completion patterns
    const totalAttempted = completedProblems.size * 1.3; // Assume 30% more attempts than completions
    return Math.round((completedProblems.size / totalAttempted) * 100);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#22c55e';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 1600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: isDark ? '#1f2937' : 'white',
          padding: '40px',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '18px', marginBottom: '16px' }}>🤖 AI Analyzing Your Performance...</div>
          <div style={{ color: '#6b7280' }}>This may take a few seconds</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 1600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '1000px',
        maxHeight: '90%',
        backgroundColor: isDark ? '#1f2937' : 'white',
        borderRadius: '16px',
        padding: '24px',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: isDark ? '#a78bfa' : '#6366f1', margin: 0, fontSize: '24px' }}>
            🤖 AI Performance Analysis
          </h2>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: isDark ? '#9ca3af' : '#6b7280'
          }}>×</button>
        </div>

        {/* Performance Overview */}
        <div style={{
          backgroundColor: isDark ? '#374151' : '#f8fafc',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '2px solid #3b82f6'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#3b82f6' }}>📊 Your Performance Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                {analysisData?.totalSolved || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Problems Solved</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                {analysisData?.accuracy || 0}%
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Accuracy Rate</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                {weakAreas.length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Weak Areas</div>
            </div>
          </div>
        </div>

        {/* Weak Areas Analysis */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: isDark ? '#e5e7eb' : '#1f2937' }}>
            🎯 Areas Needing Attention
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {weakAreas.map((area, index) => (
              <div key={index} style={{
                backgroundColor: isDark ? '#374151' : '#f9fafb',
                padding: '16px',
                borderRadius: '8px',
                border: `2px solid ${getPriorityColor(area.priority)}20`,
                borderLeft: `4px solid ${getPriorityColor(area.priority)}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{area.topic}</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {area.solved}/{area.total} completed ({Math.round(area.completionRate)}%)
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: getPriorityColor(area.priority),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {area.priority} Priority
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div>
          <h3 style={{ marginBottom: '16px', color: isDark ? '#e5e7eb' : '#1f2937' }}>
            🚀 Personalized Recommendations
          </h3>
          <div style={{ display: 'grid', gap: '20px' }}>
            {recommendations.map((rec, index) => (
              <div key={index} style={{
                backgroundColor: isDark ? '#374151' : '#f9fafb',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, color: '#3b82f6' }}>{rec.category}</h4>
                    <span style={{
                      backgroundColor: getPriorityColor(rec.priority),
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}>
                      {rec.priority}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>
                    💡 {rec.reason}
                  </div>
                </div>
                
                <div style={{ display: 'grid', gap: '12px' }}>
                  {rec.problems.map((problem, pIndex) => (
                    <div key={pIndex} style={{
                      backgroundColor: isDark ? '#1f2937' : 'white',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: '500', marginBottom: '4px' }}>{problem.title}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {problem.companies && `Companies: ${problem.companies}`}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          backgroundColor: `${getDifficultyColor(problem.difficulty)}20`,
                          color: getDifficultyColor(problem.difficulty),
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {problem.difficulty}
                        </span>
                        <button style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}>
                          Solve Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Start Recommended Practice 🎯
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;