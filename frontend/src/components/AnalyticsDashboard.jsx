import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAnalytics } from '../hooks/useAnalytics';

const AnalyticsDashboard = ({ userId }) => {
  const { isDark } = useTheme();
  const { analytics, loading } = useAnalytics(userId);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading analytics...</div>
      </div>
    );
  }

  const { performance, weakAreas, studyPattern } = analytics;

  return (
    <div style={{ padding: '20px', display: 'grid', gap: '20px' }}>
      {/* Performance Overview */}
      <div style={{
        backgroundColor: isDark ? '#1f2937' : 'white',
        borderRadius: '12px',
        padding: '20px',
        border: isDark ? '1px solid #374151' : '1px solid #e5e7eb'
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: isDark ? 'white' : '#1f2937' }}>
          📊 Performance Overview
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
              {performance.totalSolved}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Solved</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
              {performance.easySolved}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Easy</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
              {performance.mediumSolved}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Medium</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
              {performance.hardSolved}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Hard</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
              {performance.accuracy}%
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Accuracy</div>
          </div>
        </div>
      </div>

      {/* Weak Areas */}
      <div style={{
        backgroundColor: isDark ? '#1f2937' : 'white',
        borderRadius: '12px',
        padding: '20px',
        border: isDark ? '1px solid #374151' : '1px solid #e5e7eb'
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: isDark ? 'white' : '#1f2937' }}>
          🎯 Areas to Improve
        </h3>
        {weakAreas.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
            Great! No weak areas identified yet. Keep solving problems!
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {weakAreas.slice(0, 3).map((area, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: isDark ? '#374151' : '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #ef4444'
              }}>
                <div>
                  <div style={{ fontWeight: '500', color: isDark ? 'white' : '#1f2937' }}>
                    {area.topic} - {area.difficulty}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Avg time: {Math.round(area.avgTimeSpent / 60)}min
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {Math.round(area.failureRate)}% fail rate
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Study Pattern */}
      <div style={{
        backgroundColor: isDark ? '#1f2937' : 'white',
        borderRadius: '12px',
        padding: '20px',
        border: isDark ? '1px solid #374151' : '1px solid #e5e7eb'
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: isDark ? 'white' : '#1f2937' }}>
          📈 Study Pattern (Last 30 Days)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
              {studyPattern.activeDays}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Active Days</div>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
              {studyPattern.avgProblemsPerDay}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Avg Problems/Day</div>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>
              {studyPattern.totalTimeSpent}h
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Time</div>
          </div>
          <div>
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: studyPattern.consistency === 'High' ? '#10b981' : 
                     studyPattern.consistency === 'Medium' ? '#f59e0b' : '#ef4444'
            }}>
              {studyPattern.consistency}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Consistency</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;