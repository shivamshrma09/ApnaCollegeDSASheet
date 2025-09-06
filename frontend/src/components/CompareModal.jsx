import React, { useState, useEffect } from 'react';

const CompareModal = ({ isOpen, onClose, isDark }) => {
  const [selectedSheets, setSelectedSheets] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);

  const availableSheets = [
    { id: 'apnaCollege', name: 'Apna College DSA Sheet', problems: 373, difficulty: 'Beginner to Advanced' },
    { id: 'striverA2Z', name: 'Striver A2Z DSA Course', problems: 455, difficulty: 'Beginner to Advanced' },
    { id: 'loveBabbar', name: 'Love Babbar DSA Sheet', problems: 450, difficulty: 'Intermediate to Advanced' },
    { id: 'blind75', name: 'Blind 75 LeetCode', problems: 75, difficulty: 'Intermediate to Advanced' },
    { id: 'striverBlind75', name: 'Striver Blind 75', problems: 75, difficulty: 'Intermediate to Advanced' },
    { id: 'striver79', name: 'Striver 79 Last Moment', problems: 79, difficulty: 'Advanced' },
    { id: 'striverSDE', name: 'Striver SDE Sheet', problems: 191, difficulty: 'Intermediate to Advanced' },
    { id: 'neetcode150', name: 'NeetCode 150', problems: 150, difficulty: 'Intermediate to Advanced' },
    { id: 'leetcodeTop150', name: 'LeetCode Top 150', problems: 150, difficulty: 'Intermediate to Advanced' }
  ];

  const handleSheetToggle = (sheetId) => {
    setSelectedSheets(prev => {
      if (prev.includes(sheetId)) {
        return prev.filter(id => id !== sheetId);
      } else if (prev.length < 3) {
        return [...prev, sheetId];
      }
      return prev;
    });
  };

  const generateComparison = async () => {
    if (selectedSheets.length < 2) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const sheets = selectedSheets.map(id => availableSheets.find(sheet => sheet.id === id));
      
      const getSheetDetails = (sheet) => {
        const sheetDetailsMap = {
          'apnaCollege': {
            strength: 'Perfect for beginners with structured learning path',
            focus: 'Comprehensive coverage of all DSA topics',
            interviewPrep: '⭐⭐⭐⭐ - Excellent for building strong fundamentals',
            companies: 'Google, Amazon, Microsoft, Facebook',
            timeToComplete: '12-16 weeks',
            difficulty: 'Beginner to Advanced progression',
            communityFeedback: {
              discord: 'Students love the beginner-friendly approach. Many report getting their first tech job after completing this sheet.',
              youtube: 'Creators praise its systematic structure. Best sheet for college students according to reviews.',
              pros: ['Great for beginners', 'Well-structured topics', 'Good for campus placements'],
              cons: ['Some problems are outdated', 'Less focus on advanced patterns']
            }
          },
          'striverA2Z': {
            strength: 'Most comprehensive with 18-step structured approach',
            focus: 'Complete A-Z DSA mastery with video explanations',
            interviewPrep: '⭐⭐⭐⭐⭐ - Industry standard for interview prep',
            companies: 'All top tech companies (FAANG+)',
            timeToComplete: '16-20 weeks',
            difficulty: 'Beginner to Expert level',
            communityFeedback: {
              discord: 'Most recommended sheet in coding communities. "Striver bhaiya saved my career" is a common phrase.',
              youtube: 'Tech YouTubers call it the "Bible of DSA". Millions of views on solution videos.',
              pros: ['Most comprehensive', 'Excellent video explanations', 'Industry standard'],
              cons: ['Can be overwhelming', 'Time-consuming', 'Some find it too detailed']
            }
          },
          'loveBabbar': {
            strength: 'Curated by industry expert with practical approach',
            focus: 'Real interview questions from top companies',
            interviewPrep: '⭐⭐⭐⭐⭐ - Directly from interview experiences',
            companies: 'Amazon, Google, Microsoft, Adobe',
            timeToComplete: '14-18 weeks',
            difficulty: 'Intermediate to Advanced',
            communityFeedback: {
              discord: 'Highly respected for real interview questions. "Love Babbar bhaiya knows what companies actually ask."',
              youtube: 'Students share success stories after completing this sheet. High placement success rate.',
              pros: ['Real interview questions', 'Practical approach', 'High success rate'],
              cons: ['Can be challenging for beginners', 'Less structured than others']
            }
          },
          'blind75': {
            strength: 'Essential problems for quick interview preparation',
            focus: 'Core patterns that appear in 80% of interviews',
            interviewPrep: '⭐⭐⭐⭐⭐ - Perfect for last-minute prep',
            companies: 'Facebook, Google, Amazon, Microsoft',
            timeToComplete: '4-6 weeks',
            difficulty: 'Intermediate to Advanced',
            communityFeedback: {
              discord: 'The go-to sheet for FAANG prep. "Cracked Google with just Blind 75" stories are common.',
              youtube: 'Most discussed sheet for quick interview prep. Countless success stories and walkthroughs.',
              pros: ['Quick results', 'FAANG focused', 'Pattern-based learning'],
              cons: ['Limited coverage', 'Not for beginners', 'Can miss some topics']
            }
          },
          'striverBlind75': {
            strength: 'Blind 75 with detailed video solutions',
            focus: 'Pattern-based learning with explanations',
            interviewPrep: '⭐⭐⭐⭐⭐ - Best for understanding concepts',
            companies: 'FAANG companies',
            timeToComplete: '5-7 weeks',
            difficulty: 'Intermediate to Advanced',
            communityFeedback: {
              discord: 'Perfect blend of Blind 75 efficiency with Striver quality. "Best of both worlds" feedback.',
              youtube: 'Students prefer this over original Blind 75 due to better explanations and video solutions.',
              pros: ['Video explanations', 'Pattern focused', 'Quality content'],
              cons: ['Still limited scope', 'Requires basic DSA knowledge']
            }
          },
          'striver79': {
            strength: 'Last-moment preparation for experienced candidates',
            focus: 'Advanced problems for senior roles',
            interviewPrep: '⭐⭐⭐⭐⭐ - For experienced developers',
            companies: 'Google, Amazon, Microsoft (Senior roles)',
            timeToComplete: '3-4 weeks',
            difficulty: 'Advanced to Expert',
            communityFeedback: {
              discord: 'Experienced devs swear by this for senior role prep. "Tough but worth it for L5+ positions."',
              youtube: 'Less discussed due to advanced nature, but those who complete it report excellent interview performance.',
              pros: ['Senior role focused', 'Advanced problems', 'Quick completion'],
              cons: ['Very challenging', 'Not for beginners', 'Requires strong foundation']
            }
          },
          'striverSDE': {
            strength: 'Specifically designed for SDE interviews',
            focus: 'Most asked SDE interview questions',
            interviewPrep: '⭐⭐⭐⭐⭐ - Tailored for SDE roles',
            companies: 'All major tech companies',
            timeToComplete: '8-10 weeks',
            difficulty: 'Intermediate to Advanced',
            communityFeedback: {
              discord: 'SDE aspirants highly recommend this. "Got SDE-1 at Amazon after completing this sheet."',
              youtube: 'Popular among college students targeting SDE roles. Many placement success stories.',
              pros: ['SDE role specific', 'Balanced difficulty', 'Good success rate'],
              cons: ['Overlaps with other sheets', 'Some outdated problems']
            }
          },
          'neetcode150': {
            strength: 'Popular problems with video explanations',
            focus: 'LeetCode patterns with clear solutions',
            interviewPrep: '⭐⭐⭐⭐ - Great for pattern recognition',
            companies: 'Tech startups to FAANG',
            timeToComplete: '8-12 weeks',
            difficulty: 'Intermediate to Advanced',
            communityFeedback: {
              discord: 'Western community favorite. "NeetCode explanations are crystal clear" is common feedback.',
              youtube: 'Huge following on YouTube. Students love the visual explanations and clean code.',
              pros: ['Excellent video quality', 'Clear explanations', 'Pattern focused'],
              cons: ['Less popular in India', 'Some advanced topics missing']
            }
          },
          'leetcodeTop150': {
            strength: 'Official LeetCode curated list',
            focus: 'Most frequently asked interview questions',
            interviewPrep: '⭐⭐⭐⭐ - Industry standard problems',
            companies: 'All companies using LeetCode',
            timeToComplete: '8-12 weeks',
            difficulty: 'Intermediate to Advanced',
            communityFeedback: {
              discord: 'Trusted for its official status. "If LeetCode says these are important, they must be."',
              youtube: 'Frequently referenced by tech YouTubers. Considered the baseline for interview prep.',
              pros: ['Official LeetCode list', 'Frequently updated', 'Industry standard'],
              cons: ['Less community support', 'No video explanations', 'Can feel impersonal']
            }
          }
        };
        return sheetDetailsMap[sheet.id] || sheetDetailsMap['apnaCollege'];
      };
      
      const getAIRecommendation = (sheets) => {
        if (sheets.some(s => s.id === 'blind75') && sheets.some(s => s.problems > 300)) {
          return "🎯 Perfect combination! Start with Blind 75 for core patterns, then move to the comprehensive sheet for complete mastery. This approach gives you both quick wins and deep knowledge.";
        }
        if (sheets.every(s => s.problems < 200)) {
          return "⚡ Focused approach! These sheets complement each other perfectly for targeted interview preparation. You'll master essential patterns without overwhelming yourself.";
        }
        if (sheets.some(s => s.id === 'striverA2Z')) {
          return "🚀 Comprehensive mastery path! Striver A2Z provides the foundation, while other sheets add specialized focus. This combination ensures both breadth and depth.";
        }
        return "📈 Strategic selection! These sheets provide excellent coverage of different aspects. Start with the smaller sheet to build confidence, then tackle the comprehensive ones.";
      };
      
      const recommendedOrder = sheets.sort((a, b) => a.problems - b.problems);
      
      setComparisonData({
        sheets: sheets.map(sheet => ({ ...sheet, details: getSheetDetails(sheet) })),
        aiInsights: {
          recommendation: getAIRecommendation(sheets),
          recommendedOrder: recommendedOrder.map(s => s.name),
          timeline: `Total estimated time: ${sheets.reduce((sum, s) => sum + parseInt(getSheetDetails(s).timeToComplete.split('-')[1]), 0)} weeks for complete mastery`
        }
      });
    } catch (error) {
      console.error('Error generating comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        backgroundColor: isDark ? '#1e293b' : 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
          padding: '24px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19M17,17H15V10H17V17M13,17H11V7H13V17M9,17H7V13H9V17Z"/>
            </svg>
            <div>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>AI Sheet Comparison</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
                Compare DSA sheets with AI-powered insights
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '24px', maxHeight: 'calc(90vh - 120px)', overflowY: 'auto' }}>
          {!comparisonData ? (
            <>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ 
                  color: isDark ? 'white' : '#1f2937', 
                  marginBottom: '8px',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  Select DSA Sheets to Compare (2-3 sheets)
                </h3>
                <p style={{ 
                  color: isDark ? '#9ca3af' : '#6b7280', 
                  fontSize: '14px',
                  margin: 0
                }}>
                  Choose the sheets you want to compare and get AI-powered recommendations
                </p>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '16px',
                marginBottom: '24px'
              }}>
                {availableSheets.map(sheet => (
                  <div
                    key={sheet.id}
                    onClick={() => handleSheetToggle(sheet.id)}
                    style={{
                      padding: '16px',
                      border: `2px solid ${selectedSheets.includes(sheet.id) ? '#1E90FF' : (isDark ? '#374151' : '#e5e7eb')}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      backgroundColor: selectedSheets.includes(sheet.id) 
                        ? (isDark ? 'rgba(30, 144, 255, 0.1)' : 'rgba(30, 144, 255, 0.05)')
                        : (isDark ? '#374151' : '#f8fafc'),
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    {selectedSheets.includes(sheet.id) && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#1E90FF',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px'
                      }}>
                        ✓
                      </div>
                    )}
                    <h4 style={{ 
                      color: isDark ? 'white' : '#1f2937',
                      margin: '0 0 8px 0',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>
                      {sheet.name}
                    </h4>
                    <div style={{ 
                      color: isDark ? '#d1d5db' : '#4b5563',
                      fontSize: '14px',
                      marginBottom: '8px'
                    }}>
                      {sheet.problems} Problems • {sheet.difficulty}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button
                  onClick={generateComparison}
                  disabled={selectedSheets.length < 2 || loading}
                  style={{
                    padding: '14px 28px',
                    background: selectedSheets.length >= 2 && !loading
                      ? 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)'
                      : '#9ca3af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: selectedSheets.length >= 2 && !loading ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: selectedSheets.length >= 2 && !loading ? '0 4px 12px rgba(30, 144, 255, 0.3)' : 'none'
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Generating AI Insights...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                      </svg>
                      Compare with AI ({selectedSheets.length}/3)
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div>
              <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <h3 style={{ 
                  color: isDark ? 'white' : '#1f2937',
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '8px'
                }}>
                  🤖 AI Comparison Results
                </h3>
                <p style={{ 
                  color: isDark ? '#9ca3af' : '#6b7280',
                  fontSize: '14px',
                  margin: 0
                }}>
                  Personalized insights based on your selected sheets
                </p>
              </div>

              {/* AI Recommendation */}
              <div style={{
                padding: '20px',
                backgroundColor: isDark ? '#0f172a' : '#f0f9ff',
                border: `2px solid ${isDark ? '#1e40af' : '#3b82f6'}`,
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <h4 style={{ 
                  color: isDark ? '#60a5fa' : '#1e40af',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                  </svg>
                  AI Recommendation
                </h4>
                <p style={{ 
                  color: isDark ? '#e2e8f0' : '#1e40af',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {comparisonData.aiInsights.recommendation}
                </p>
              </div>

              {/* Detailed Sheet Analysis */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  color: isDark ? 'white' : '#1f2937',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '16px'
                }}>
                  📊 Detailed Sheet Analysis
                </h4>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {comparisonData.sheets.map((sheet) => (
                    <div
                      key={sheet.id}
                      style={{
                        padding: '20px',
                        backgroundColor: isDark ? '#374151' : '#f8fafc',
                        borderRadius: '12px',
                        border: `2px solid ${isDark ? '#4b5563' : '#e5e7eb'}`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <h5 style={{ 
                          color: isDark ? 'white' : '#1f2937',
                          fontSize: '16px',
                          fontWeight: '700',
                          margin: 0
                        }}>
                          {sheet.name}
                        </h5>
                        <div style={{
                          padding: '4px 8px',
                          backgroundColor: isDark ? '#1e293b' : '#dbeafe',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: isDark ? '#60a5fa' : '#1e40af'
                        }}>
                          {sheet.problems} Problems
                        </div>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '4px' }}>🎯 Focus Area</div>
                          <div style={{ fontSize: '13px', color: isDark ? '#e5e7eb' : '#374151', fontWeight: '500' }}>{sheet.details.focus}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '4px' }}>⏱️ Time to Complete</div>
                          <div style={{ fontSize: '13px', color: isDark ? '#e5e7eb' : '#374151', fontWeight: '500' }}>{sheet.details.timeToComplete}</div>
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '4px' }}>🏢 Target Companies</div>
                        <div style={{ fontSize: '13px', color: isDark ? '#e5e7eb' : '#374151', fontWeight: '500' }}>{sheet.details.companies}</div>
                      </div>
                      
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '4px' }}>📈 Interview Preparation Rating</div>
                        <div style={{ fontSize: '13px', color: isDark ? '#e5e7eb' : '#374151', fontWeight: '500' }}>{sheet.details.interviewPrep}</div>
                      </div>
                      
                      <div style={{
                        padding: '12px',
                        backgroundColor: isDark ? '#1e293b' : '#e0f2fe',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: isDark ? '#60a5fa' : '#0277bd',
                        fontWeight: '500',
                        marginBottom: '12px'
                      }}>
                        💡 {sheet.details.strength}
                      </div>
                      
                      {/* Community Insights */}
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '8px', fontWeight: '600' }}>🌐 Community Insights</div>
                        
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          <div style={{
                            flex: 1,
                            padding: '8px',
                            backgroundColor: isDark ? '#312e81' : '#f0f9ff',
                            borderRadius: '6px',
                            border: `1px solid ${isDark ? '#4338ca' : '#0ea5e9'}`
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill={isDark ? '#60a5fa' : '#0ea5e9'}>
                                <path d="M22,24L16.75,19L17.38,21H4.5A2.5,2.5 0 0,1 2,18.5V3.5A2.5,2.5 0 0,1 4.5,1H19.5A2.5,2.5 0 0,1 22,3.5V24M12,6.8C9.32,6.8 7.44,7.95 7.44,7.95C8.47,7.03 10.27,6.5 10.27,6.5L10.1,6.33C8.41,6.36 6.88,7.53 6.88,7.53C5.16,11.12 5.27,14.22 5.27,14.22C6.67,16.03 8.75,15.9 8.75,15.9L9.46,15C8.21,14.73 7.42,13.62 7.42,13.62C7.42,13.62 9.3,14.9 12,14.9C14.7,14.9 16.58,13.62 16.58,13.62C16.58,13.62 15.79,14.73 14.54,15L15.25,15.9C15.25,15.9 17.33,16.03 18.73,14.22C18.73,14.22 18.84,11.12 17.12,7.53C17.12,7.53 15.59,6.36 13.9,6.33L13.73,6.5C13.73,6.5 15.53,7.03 16.56,7.95C16.56,7.95 14.68,6.8 12,6.8Z"/>
                              </svg>
                              <span style={{ fontSize: '10px', fontWeight: '600', color: isDark ? '#60a5fa' : '#0ea5e9' }}>Discord</span>
                            </div>
                            <div style={{ fontSize: '10px', color: isDark ? '#cbd5e1' : '#334155', lineHeight: '1.3' }}>
                              {sheet.details.communityFeedback.discord}
                            </div>
                          </div>
                          
                          <div style={{
                            flex: 1,
                            padding: '8px',
                            backgroundColor: isDark ? '#7c2d12' : '#fef2f2',
                            borderRadius: '6px',
                            border: `1px solid ${isDark ? '#dc2626' : '#ef4444'}`
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill={isDark ? '#f87171' : '#ef4444'}>
                                <path d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z"/>
                              </svg>
                              <span style={{ fontSize: '10px', fontWeight: '600', color: isDark ? '#f87171' : '#ef4444' }}>YouTube</span>
                            </div>
                            <div style={{ fontSize: '10px', color: isDark ? '#fecaca' : '#7f1d1d', lineHeight: '1.3' }}>
                              {sheet.details.communityFeedback.youtube}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '10px', color: '#22c55e', fontWeight: '600', marginBottom: '4px' }}>✅ Pros</div>
                            {sheet.details.communityFeedback.pros.map((pro, idx) => (
                              <div key={idx} style={{ fontSize: '9px', color: isDark ? '#bbf7d0' : '#166534', marginBottom: '2px' }}>• {pro}</div>
                            ))}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: '600', marginBottom: '4px' }}>❌ Cons</div>
                            {sheet.details.communityFeedback.cons.map((con, idx) => (
                              <div key={idx} style={{ fontSize: '9px', color: isDark ? '#fca5a5' : '#991b1b', marginBottom: '2px' }}>• {con}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* AI Recommended Study Order */}
              <div style={{
                padding: '16px',
                backgroundColor: isDark ? '#065f46' : '#ecfdf5',
                border: `2px solid ${isDark ? '#10b981' : '#22c55e'}`,
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <h4 style={{ 
                  color: isDark ? '#34d399' : '#047857',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🤖 AI Recommended Study Order
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {comparisonData.aiInsights.recommendedOrder.map((sheetName, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 12px',
                      backgroundColor: isDark ? 'rgba(52, 211, 153, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                      borderRadius: '6px'
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: isDark ? '#34d399' : '#22c55e',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}>
                        {index + 1}
                      </div>
                      <span style={{ 
                        color: isDark ? '#a7f3d0' : '#047857',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {sheetName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div style={{
                padding: '20px',
                backgroundColor: isDark ? '#1e1b4b' : '#f0f9ff',
                border: `2px solid ${isDark ? '#3b82f6' : '#60a5fa'}`,
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <h4 style={{ 
                  color: isDark ? '#60a5fa' : '#1e40af',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12C2,6.5 6.47,2 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                  </svg>
                  📅 Complete Study Timeline
                </h4>
                <p style={{ 
                  color: isDark ? '#bfdbfe' : '#1e40af',
                  fontSize: '14px',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  {comparisonData.aiInsights.timeline}
                </p>
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  backgroundColor: isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(30, 64, 175, 0.1)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: isDark ? '#93c5fd' : '#1e40af'
                }}>
                  💡 Pro tip: Consistency is key! Solve 3-5 problems daily rather than cramming.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button
                  onClick={() => setComparisonData(null)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
                    color: isDark ? '#d1d5db' : '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Compare Again
                </button>
                <button
                  onClick={onClose}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                  }}
                >
                  Start Learning
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompareModal;