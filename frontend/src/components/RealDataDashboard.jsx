import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

const API_BASE_URL = 'http://localhost:5001/api';

const RealDataDashboard = ({ userId, currentSheetType }) => {
  const [userProgress, setUserProgress] = useState({});
  const [userGoals, setUserGoals] = useState({ daily: { target: 3, current: 0 }, weekly: { target: 20, current: 0 } });
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchUserData();
  }, [userId, currentSheetType]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch user progress for current sheet
      const progressResponse = await axios.get(
        `${API_BASE_URL}/progress/${userId}?sheetType=${currentSheetType}`,
        { headers }
      );
      setUserProgress(progressResponse.data);

      // Fetch user goals
      try {
        const goalsResponse = await axios.get(`${API_BASE_URL}/goals/${userId}`, { headers });
        setUserGoals(goalsResponse.data.goals || userGoals);
      } catch (error) {
        console.log('Goals not found, using defaults');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const getSheetName = (sheetType) => {
    const sheetNames = {
      'apnaCollege': 'Apna College (373)',
      'loveBabbar': 'Love Babbar (450)',
      'striverA2Z': 'Striver A2Z (455)',
      'striverSDE': 'Striver SDE (191)',
      'striver79': 'Striver 79 (79)',
      'blind75': 'Blind 75 (75)',
      'striverBlind75': 'Striver Blind 75 (75)',
      'striverCP': 'Striver CP (298)',
      'vision': 'VISION (100)',
      'neetcode150': 'NeetCode 150 (150)',
      'systemDesign': 'System Design (70)',
      'leetcodeTop150': 'LeetCode Top 150 (150)',
      'cp31': 'CP-31 (372)',
      'visionCP': 'VISION CP (135)'
    };
    return sheetNames[sheetType] || 'DSA Sheet';
  };

  const getTotalProblems = (sheetType) => {
    const totals = {
      'apnaCollege': 373,
      'loveBabbar': 450,
      'striverA2Z': 455,
      'striverSDE': 191,
      'striver79': 79,
      'blind75': 75,
      'striverBlind75': 75,
      'striverCP': 298,
      'vision': 100,
      'neetcode150': 150,
      'systemDesign': 70,
      'leetcodeTop150': 150,
      'cp31': 372,
      'visionCP': 135
    };
    return totals[sheetType] || 100;
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        backgroundColor: isDark ? '#1f2937' : '#f9fafb',
        borderRadius: '12px'
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

  const completedCount = userProgress.completedProblems?.length || 0;
  const totalProblems = getTotalProblems(currentSheetType);
  const completionPercentage = Math.round((completedCount / totalProblems) * 100);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
      marginBottom: '24px'
    }}>
      {/* Overview & Progress */}
      <div style={{
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'white',
        border: '2px solid #10b981',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ fontSize: '28px' }}>📊</div>
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: isDark ? 'white' : '#1f2937' }}>
              Overview & Progress
            </h4>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{getSheetName(currentSheetType)}</p>
          </div>
        </div>
        
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
          {completedCount} / {totalProblems}
        </div>
        <div style={{ fontSize: '18px', color: '#3b82f6', marginBottom: '16px' }}>
          {completionPercentage}% Complete
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <div style={{ textAlign: 'center', padding: '8px', backgroundColor: isDark ? '#374151' : '#f0fdf4', borderRadius: '8px' }}>
            <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '16px' }}>Easy</div>
            <div style={{ fontSize: '14px', color: isDark ? '#d1d5db' : '#374151' }}>
              {userProgress.easySolved || 0}
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px', backgroundColor: isDark ? '#374151' : '#fffbeb', borderRadius: '8px' }}>
            <div style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '16px' }}>Medium</div>
            <div style={{ fontSize: '14px', color: isDark ? '#d1d5db' : '#374151' }}>
              {userProgress.mediumSolved || 0}
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px', backgroundColor: isDark ? '#374151' : '#fef2f2', borderRadius: '8px' }}>
            <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '16px' }}>Hard</div>
            <div style={{ fontSize: '14px', color: isDark ? '#d1d5db' : '#374151' }}>
              {userProgress.hardSolved || 0}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            ⭐ {userProgress.starredProblems?.length || 0} starred • 📝 {Object.keys(userProgress.notes || {}).length} notes
          </div>
          {userProgress.streak > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              backgroundColor: '#fef3c7',
              borderRadius: '12px'
            }}>
              <span style={{ fontSize: '12px' }}>🔥</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#92400e' }}>
                {userProgress.streak} day streak
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Goals & Progress */}
      <div style={{
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'white',
        border: '2px solid #3b82f6',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ fontSize: '28px' }}>🎯</div>
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: isDark ? 'white' : '#1f2937' }}>
              Goals & Progress
            </h4>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Set Goals</p>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: isDark ? 'white' : '#1f2937' }}>Daily Goal</span>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              {userGoals.daily.current}/{userGoals.daily.target}
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: isDark ? '#374151' : '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.min((userGoals.daily.current / userGoals.daily.target) * 100, 100)}%`,
              height: '100%',
              backgroundColor: userGoals.daily.current >= userGoals.daily.target ? '#22c55e' : '#3b82f6',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          {userGoals.daily.current >= userGoals.daily.target && (
            <div style={{ fontSize: '12px', color: '#22c55e', marginTop: '4px', fontWeight: '600' }}>
              ✅ Completed!
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: isDark ? 'white' : '#1f2937' }}>Weekly Goal</span>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              {userGoals.weekly.current}/{userGoals.weekly.target}
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: isDark ? '#374151' : '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.min((userGoals.weekly.current / userGoals.weekly.target) * 100, 100)}%`,
              height: '100%',
              backgroundColor: userGoals.weekly.current >= userGoals.weekly.target ? '#22c55e' : '#f59e0b',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            {Math.round((userGoals.weekly.current / userGoals.weekly.target) * 100)}% complete
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
          <div style={{ textAlign: 'center', padding: '12px', backgroundColor: isDark ? '#374151' : '#f8fafc', borderRadius: '8px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
              {completedCount}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Solved</div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default RealDataDashboard;