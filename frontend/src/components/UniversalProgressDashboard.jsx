import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

const API_BASE_URL = 'https://plusdsa.onrender.com/api';

const UniversalProgressDashboard = ({ userId: propUserId, isDark }) => {
  const [allProgress, setAllProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSheet, setSelectedSheet] = useState('all');

  // Get userId from props or localStorage
  const getUserId = () => {
    if (propUserId) return propUserId;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || user._id || null;
  };

  const userId = getUserId();

  const sheetConfigs = [
    { id: 'apnaCollege', name: 'Apna College', total: 373, color: '#3b82f6', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/>
      </svg>
    ) },
    { id: 'loveBabbar', name: 'Love Babbar', total: 450, color: '#f59e0b', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
      </svg>
    ) },
    { id: 'striverA2Z', name: 'Striver A2Z', total: 455, color: '#10b981', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9,5V9H15V5M9,19H15V15H9M9,14H15V10H9M4,9V5H8V9M4,19H8V15H4M4,14H8V10H4M20,5V9H16V5M20,19H16V15H20M20,14H16V10H20Z"/>
      </svg>
    ) },
    { id: 'striverSDE', name: 'SDE Sheet', total: 191, color: '#06b6d4', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20,6H2V4H20V6M20,20V8H2V20H20M4,10H18V18H4V10Z"/>
      </svg>
    ) },
    { id: 'striver79', name: 'Striver 79', total: 79, color: '#8b5cf6', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2L13.09,8.26L22,9L14,14L17,23L12,18L7,23L10,14L2,9L10.91,8.26L12,2Z"/>
      </svg>
    ) },
    { id: 'blind75', name: 'Blind 75', total: 75, color: '#ef4444', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2L13.09,8.26L22,9L14,14L17,23L12,18L7,23L10,14L2,9L10.91,8.26L12,2Z"/>
      </svg>
    ) },
    { id: 'striverBlind75', name: 'Striver Blind 75', total: 75, color: '#ec4899', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2L13.09,8.26L22,9L14,14L17,23L12,18L7,23L10,14L2,9L10.91,8.26L12,2Z"/>
      </svg>
    ) },
    { id: 'striverCP', name: 'Striver CP', total: 298, color: '#f97316', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z"/>
      </svg>
    ) },
    { id: 'vision', name: 'VISION Sheet', total: 100, color: '#22c55e', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
      </svg>
    ) },
    { id: 'neetcode150', name: 'NeetCode 150', total: 150, color: '#7c3aed', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z"/>
      </svg>
    ) },
    { id: 'systemDesign', name: 'System Design', total: 70, color: '#0ea5e9', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17,12V3A1,1 0 0,0 16,2H3A1,1 0 0,0 2,3V12A1,1 0 0,0 3,13H16A1,1 0 0,0 17,12M4,4H15V11H4V4M20,6V10H18V6H20M20,12V16H18V12H20M20,18V22H18V18H20M16,19V21H8V19H16M16,17V15H8V17H16Z"/>
      </svg>
    ) },
    { id: 'leetcodeTop150', name: 'LeetCode Top 150', total: 150, color: '#f59e0b', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0z"/>
      </svg>
    ) },
    { id: 'cp31', name: 'CP-31 Sheet', total: 372, color: '#dc2626', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5S3 20.328 3 19.5V9c0-.828.672-1.5 1.5-1.5zm7.5 0C12.828 7.5 13.5 8.172 13.5 9v10.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5V9c0-.828.672-1.5 1.5-1.5zm7.5 0c.828 0 1.5.672 1.5 1.5v10.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5V9c0-.828.672-1.5 1.5-1.5z"/>
      </svg>
    ) },
    { id: 'visionCP', name: 'VISION CP', total: 135, color: '#059669', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
      </svg>
    ) }
  ];

  useEffect(() => {
    if (userId) {
      fetchAllProgress();
    } else {
      console.warn('No userId found for UniversalProgressDashboard');
      setLoading(false);
    }
  }, [userId]);

  const fetchAllProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching progress for userId:', userId);
      const response = await axios.get(
        `${API_BASE_URL}/sheets/user/${userId}/all-progress`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Progress response:', response.data);
      setAllProgress(response.data.allProgress || {});
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSheetStats = (sheetId) => {
    const progress = allProgress[sheetId];
    const config = sheetConfigs.find(s => s.id === sheetId);
    
    if (!progress || !config) {
      return {
        completed: 0,
        total: config?.total || 0,
        percentage: 0,
        easy: 0,
        medium: 0,
        hard: 0,
        streak: 0
      };
    }

    const completed = progress.completedProblems?.length || progress.totalSolved || 0;
    
    return {
      completed,
      total: config.total,
      percentage: Math.round((completed / config.total) * 100),
      easy: progress.easySolved || 0,
      medium: progress.mediumSolved || 0,
      hard: progress.hardSolved || 0,
      streak: progress.streak || 0
    };
  };

  const getTotalStats = () => {
    let totalCompleted = 0;
    let totalProblems = 0;
    let totalEasy = 0;
    let totalMedium = 0;
    let totalHard = 0;

    sheetConfigs.forEach(config => {
      const stats = getSheetStats(config.id);
      totalCompleted += stats.completed;
      totalProblems += stats.total;
      totalEasy += stats.easy;
      totalMedium += stats.medium;
      totalHard += stats.hard;
    });

    return {
      completed: totalCompleted,
      total: totalProblems,
      percentage: Math.round((totalCompleted / totalProblems) * 100),
      easy: totalEasy,
      medium: totalMedium,
      hard: totalHard
    };
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  const totalStats = getTotalStats();

  return (
    <div style={{
      background: isDark 
        ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '16px',
      padding: '24px',
      border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: isDark ? 'white' : '#1f2937',
          marginBottom: '8px'
        }}>
          Universal Progress Dashboard
        </h2>
        <p style={{
          color: isDark ? '#9ca3af' : '#6b7280',
          fontSize: '14px'
        }}>
          Track your progress across all DSA sheets
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setSelectedSheet('all')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            background: selectedSheet === 'all' 
              ? '#3b82f6' 
              : isDark ? '#374151' : '#f1f5f9',
            color: selectedSheet === 'all' 
              ? 'white' 
              : isDark ? '#d1d5db' : '#4b5563',
            transition: 'all 0.2s ease'
          }}
        >
          All Sheets
        </button>
        {sheetConfigs.map(config => (
          <button
            key={config.id}
            onClick={() => setSelectedSheet(config.id)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              background: selectedSheet === config.id 
                ? config.color 
                : isDark ? '#374151' : '#f1f5f9',
              color: selectedSheet === config.id 
                ? 'white' 
                : isDark ? '#d1d5db' : '#4b5563',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>{config.icon}</div>
            {config.name}
          </button>
        ))}
      </div>

      {/* Overall Stats */}
      {selectedSheet === 'all' && (
        <div style={{
          background: isDark ? '#374151' : '#f8fafc',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          border: isDark ? '1px solid #4b5563' : '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: isDark ? 'white' : '#1f2937',
            marginBottom: '16px'
          }}>
            Overall Progress
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#3b82f6',
                marginBottom: '4px'
              }}>
                {totalStats.completed}
              </div>
              <div style={{
                fontSize: '12px',
                color: isDark ? '#9ca3af' : '#6b7280'
              }}>
                Total Solved
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#10b981',
                marginBottom: '4px'
              }}>
                {totalStats.percentage}%
              </div>
              <div style={{
                fontSize: '12px',
                color: isDark ? '#9ca3af' : '#6b7280'
              }}>
                Completion
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#22c55e',
                marginBottom: '4px'
              }}>
                {totalStats.easy}
              </div>
              <div style={{
                fontSize: '12px',
                color: isDark ? '#9ca3af' : '#6b7280'
              }}>
                Easy
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#f59e0b',
                marginBottom: '4px'
              }}>
                {totalStats.medium}
              </div>
              <div style={{
                fontSize: '12px',
                color: isDark ? '#9ca3af' : '#6b7280'
              }}>
                Medium
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#ef4444',
                marginBottom: '4px'
              }}>
                {totalStats.hard}
              </div>
              <div style={{
                fontSize: '12px',
                color: isDark ? '#9ca3af' : '#6b7280'
              }}>
                Hard
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sheet-wise Progress */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {(selectedSheet === 'all' ? sheetConfigs : sheetConfigs.filter(s => s.id === selectedSheet))
          .map(config => {
            const stats = getSheetStats(config.id);
            
            return (
              <div
                key={config.id}
                style={{
                  background: isDark ? '#374151' : 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  border: `2px solid ${config.color}20`,
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: config.color, display: 'flex', alignItems: 'center' }}>{config.icon}</div>
                    <div>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: isDark ? 'white' : '#1f2937',
                        margin: 0
                      }}>
                        {config.name}
                      </h4>
                      <p style={{
                        fontSize: '12px',
                        color: isDark ? '#9ca3af' : '#6b7280',
                        margin: 0
                      }}>
                        {config.total} Problems
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: config.color
                    }}>
                      {stats.percentage}%
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: isDark ? '#9ca3af' : '#6b7280'
                    }}>
                      {stats.completed} / {stats.total}
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: `${stats.percentage}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${config.color} 0%, ${config.color}80 100%)`,
                    borderRadius: '4px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
                
                {/* Difficulty Breakdown */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#22c55e'
                      }}>
                        {stats.easy}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: isDark ? '#9ca3af' : '#6b7280'
                      }}>
                        Easy
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#f59e0b'
                      }}>
                        {stats.medium}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: isDark ? '#9ca3af' : '#6b7280'
                      }}>
                        Medium
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#ef4444'
                      }}>
                        {stats.hard}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: isDark ? '#9ca3af' : '#6b7280'
                      }}>
                        Hard
                      </div>
                    </div>
                  </div>
                  
                  {stats.streak > 0 && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      backgroundColor: `${config.color}20`,
                      borderRadius: '6px'
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#f97316' }}>
                        <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.28 2.67-.2 3.73-.74 1.67-2.23 2.72-4.01 2.72z"/>
                      </svg>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: config.color
                      }}>
                        {stats.streak} day streak
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default UniversalProgressDashboard;