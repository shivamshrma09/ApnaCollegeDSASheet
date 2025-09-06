import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const UniversalSheetManager = ({ currentSheet, onSheetChange, userProgress }) => {
  const { isDark } = useTheme();
  const [showAllSheets, setShowAllSheets] = useState(false);

  const sheetConfigs = [
    {
      id: 'apnaCollege',
      name: 'Apna College DSA Sheet',
      description: 'Complete collection of 373 DSA problems across 16 topics',
      totalProblems: 373,
      difficulty: 'Beginner to Advanced',
      color: '#3b82f6',
      icon: '🎓'
    },
    {
      id: 'striverA2Z',
      name: 'Striver A2Z DSA Course',
      description: 'Learn DSA from A to Z with 455 problems across 18 steps',
      totalProblems: 455,
      difficulty: 'Beginner to Advanced',
      color: '#10b981',
      icon: '📚'
    },
    {
      id: 'loveBabbar',
      name: 'Love Babbar DSA Sheet',
      description: 'Master DSA with Love Babbar\'s curated 450 problems',
      totalProblems: 450,
      difficulty: 'Intermediate to Advanced',
      color: '#f59e0b',
      icon: '❤️'
    },
    {
      id: 'blind75',
      name: 'Blind 75 LeetCode',
      description: 'Essential 75 problems for coding interviews',
      totalProblems: 75,
      difficulty: 'Interview Focused',
      color: '#ef4444',
      icon: '🎯'
    },
    {
      id: 'striver79',
      name: 'Striver 79 Last Moment',
      description: 'Top 79 problems for last-moment interview prep',
      totalProblems: 79,
      difficulty: 'Advanced',
      color: '#8b5cf6',
      icon: '⚡'
    },
    {
      id: 'striverSDE',
      name: 'Striver SDE Sheet',
      description: 'Complete SDE interview preparation with 191 problems',
      totalProblems: 191,
      difficulty: 'Interview Focused',
      color: '#06b6d4',
      icon: '💼'
    },
    {
      id: 'striverCP',
      name: 'Striver CP Sheet',
      description: 'Master Competitive Programming with 298 problems',
      totalProblems: 298,
      difficulty: 'Advanced',
      color: '#f97316',
      icon: '🏆'
    },
    {
      id: 'visionCP',
      name: 'VISION CP Sheet',
      description: 'Best curated CP problems from CP31 & other platforms',
      totalProblems: 135,
      difficulty: 'Rating Based (800-2000+)',
      color: '#ec4899',
      icon: '🚀'
    },
    {
      id: 'cp31',
      name: 'CP-31 Sheet',
      description: 'Rating-based competitive programming problems',
      totalProblems: 372,
      difficulty: 'Rating 800-1900',
      color: '#14b8a6',
      icon: '⭐'
    },
    {
      id: 'systemDesign',
      name: 'System Design Roadmap',
      description: 'Complete system design roadmap for SDEs with 70 topics',
      totalProblems: 70,
      difficulty: 'Interview Focused',
      color: '#8b5cf6',
      icon: '🏗️'
    },
    {
      id: 'neetcode150',
      name: 'NeetCode 150',
      description: 'Complete collection of 150 most popular coding interview problems',
      totalProblems: 150,
      difficulty: 'Interview Focused',
      color: '#f59e0b',
      icon: '🎯'
    },
    {
      id: 'leetcodeTop150',
      name: 'LeetCode Top 150',
      description: 'The most frequently asked interview questions curated by LeetCode',
      totalProblems: 150,
      difficulty: 'Interview Focused',
      color: '#ef4444',
      icon: '💼'
    },
    {
      id: 'striverBlind75',
      name: 'Striver Blind 75',
      description: 'Striver\'s curated Blind 75 problems with detailed solutions',
      totalProblems: 75,
      difficulty: 'Interview Focused',
      color: '#8b5cf6',
      icon: '⭐'
    },
    {
      id: 'vision',
      name: 'VISION Sheet',
      description: 'Curated collection of 100 best problems from 1500+ questions',
      totalProblems: 100,
      difficulty: 'Interview Focused',
      color: '#06b6d4',
      icon: '👁️'
    }
  ];

  const getCurrentSheetConfig = () => {
    return sheetConfigs.find(sheet => sheet.id === currentSheet) || sheetConfigs[0];
  };

  const getSheetProgress = (sheetId) => {
    if (!userProgress || !userProgress[sheetId]) {
      return { completed: 0, total: sheetConfigs.find(s => s.id === sheetId)?.totalProblems || 0 };
    }
    const progress = userProgress[sheetId];
    const total = sheetConfigs.find(s => s.id === sheetId)?.totalProblems || 0;
    return { 
      completed: progress.totalSolved || 0, 
      total,
      percentage: total > 0 ? Math.round((progress.totalSolved || 0) / total * 100) : 0
    };
  };

  const currentConfig = getCurrentSheetConfig();

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      maxWidth: showAllSheets ? '400px' : '300px',
      transition: 'all 0.3s ease'
    }}>
      {/* Current Sheet Display */}
      <div
        onClick={() => setShowAllSheets(!showAllSheets)}
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: `2px solid ${currentConfig.color}`,
          borderRadius: '12px',
          padding: '16px',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '24px' }}>{currentConfig.icon}</span>
          <div style={{ flex: 1 }}>
            <h3 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '600',
              color: isDark ? 'white' : '#1f2937'
            }}>
              {currentConfig.name}
            </h3>
            <p style={{
              margin: 0,
              fontSize: '12px',
              color: isDark ? '#9ca3af' : '#6b7280'
            }}>
              {currentConfig.totalProblems} Problems
            </p>
          </div>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill={isDark ? '#9ca3af' : '#6b7280'}
            style={{
              transform: showAllSheets ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}
          >
            <path d="M7,10L12,15L17,10H7Z"/>
          </svg>
        </div>
        
        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '6px',
          backgroundColor: isDark ? '#374151' : '#e5e7eb',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${getSheetProgress(currentSheet).percentage || 0}%`,
            height: '100%',
            backgroundColor: currentConfig.color,
            borderRadius: '3px',
            transition: 'width 0.3s ease'
          }} />
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '8px'
        }}>
          <span style={{
            fontSize: '12px',
            color: isDark ? '#d1d5db' : '#4b5563',
            fontWeight: '500'
          }}>
            {getSheetProgress(currentSheet).completed} / {getSheetProgress(currentSheet).total}
          </span>
          <span style={{
            fontSize: '12px',
            color: currentConfig.color,
            fontWeight: '600'
          }}>
            {getSheetProgress(currentSheet).percentage || 0}%
          </span>
        </div>
      </div>

      {/* All Sheets Grid */}
      {showAllSheets && (
        <div style={{
          marginTop: '12px',
          background: isDark 
            ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          <h4 style={{
            margin: '0 0 16px 0',
            fontSize: '14px',
            fontWeight: '600',
            color: isDark ? 'white' : '#1f2937',
            textAlign: 'center'
          }}>
            Switch Sheet
          </h4>
          
          <div style={{ display: 'grid', gap: '8px' }}>
            {sheetConfigs.map(sheet => {
              const progress = getSheetProgress(sheet.id);
              const isActive = sheet.id === currentSheet;
              
              return (
                <div
                  key={sheet.id}
                  onClick={() => {
                    onSheetChange(sheet.id);
                    setShowAllSheets(false);
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: isActive 
                      ? `2px solid ${sheet.color}` 
                      : isDark ? '1px solid #374151' : '1px solid #e5e7eb',
                    background: isActive 
                      ? `${sheet.color}15` 
                      : isDark ? '#374151' : '#f8fafc',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.background = isDark ? '#4b5563' : '#f1f5f9';
                      e.target.style.transform = 'translateX(4px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.background = isDark ? '#374151' : '#f8fafc';
                      e.target.style.transform = 'translateX(0)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '16px' }}>{sheet.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: isActive ? sheet.color : (isDark ? 'white' : '#1f2937'),
                        marginBottom: '2px'
                      }}>
                        {sheet.name}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: isDark ? '#9ca3af' : '#6b7280'
                      }}>
                        {sheet.totalProblems} Problems • {sheet.difficulty}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: sheet.color
                    }}>
                      {progress.percentage}%
                    </div>
                  </div>
                  
                  {/* Mini Progress Bar */}
                  <div style={{
                    width: '100%',
                    height: '3px',
                    backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${progress.percentage}%`,
                      height: '100%',
                      backgroundColor: sheet.color,
                      borderRadius: '2px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalSheetManager;