import React, { useState, useEffect } from 'react';

const GoalSettingSection = ({ isDark, userId, selectedSheet }) => {
  const [goals, setGoals] = useState({
    daily: { target: 3, completed: 0 },
    weekly: { target: 20, completed: 0 }
  });

  useEffect(() => {
    // Load goals from localStorage
    const savedGoals = localStorage.getItem(`goals_${userId}_${selectedSheet}`);
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, [userId, selectedSheet]);

  const updateGoal = (type, target) => {
    const newGoals = {
      ...goals,
      [type]: { ...goals[type], target: parseInt(target) }
    };
    setGoals(newGoals);
    localStorage.setItem(`goals_${userId}_${selectedSheet}`, JSON.stringify(newGoals));
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: isDark ? '#374151' : 'white',
      borderRadius: '12px',
      border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
      marginBottom: '24px'
    }}>
      <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px' }}>Goals & Progress</h4>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '14px', fontWeight: '500' }}>Daily Goal</span>
            <input
              type="number"
              value={goals.daily.target}
              onChange={(e) => updateGoal('daily', e.target.value)}
              style={{
                width: '60px',
                padding: '4px 8px',
                border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                borderRadius: '4px',
                backgroundColor: isDark ? '#1f2937' : 'white',
                color: isDark ? '#e5e7eb' : '#1f2937',
                fontSize: '12px'
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '14px', color: isDark ? '#9ca3af' : '#6b7280' }}>
              {goals.daily.completed}/{goals.daily.target}
            </span>
            <span style={{ fontSize: '14px', color: '#3b82f6', fontWeight: '600' }}>
              {Math.round((goals.daily.completed / goals.daily.target) * 100)}% complete
            </span>
          </div>
          <div style={{ height: '8px', backgroundColor: isDark ? '#4b5563' : '#e5e7eb', borderRadius: '4px' }}>
            <div style={{
              height: '100%',
              backgroundColor: '#3b82f6',
              borderRadius: '4px',
              width: `${Math.min(100, (goals.daily.completed / goals.daily.target) * 100)}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '14px', fontWeight: '500' }}>Weekly Goal</span>
            <input
              type="number"
              value={goals.weekly.target}
              onChange={(e) => updateGoal('weekly', e.target.value)}
              style={{
                width: '60px',
                padding: '4px 8px',
                border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                borderRadius: '4px',
                backgroundColor: isDark ? '#1f2937' : 'white',
                color: isDark ? '#e5e7eb' : '#1f2937',
                fontSize: '12px'
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '14px', color: isDark ? '#9ca3af' : '#6b7280' }}>
              {goals.weekly.completed}/{goals.weekly.target}
            </span>
            <span style={{ fontSize: '14px', color: '#22c55e', fontWeight: '600' }}>
              {Math.round((goals.weekly.completed / goals.weekly.target) * 100)}% complete
            </span>
          </div>
          <div style={{ height: '8px', backgroundColor: isDark ? '#4b5563' : '#e5e7eb', borderRadius: '4px' }}>
            <div style={{
              height: '100%',
              backgroundColor: '#22c55e',
              borderRadius: '4px',
              width: `${Math.min(100, (goals.weekly.completed / goals.weekly.target) * 100)}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalSettingSection;