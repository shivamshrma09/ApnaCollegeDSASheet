import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SpacedRepetitionAnalytics = ({ userId, sheetType = 'apnaCollege' }) => {
  const { isDark } = useTheme();
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || 'https://plusdsa.onrender.com/api';

  useEffect(() => {
    fetchAnalytics();
  }, [userId, sheetType]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE}/custom-spaced-repetition/all?sheetType=${sheetType}`, {
        headers: { userid: userId }
      });
      const data = await response.json();
      
      const summary = data.summary || {};
      const customSR = data.customSpacedRepetition || {};
      
      // Calculate analytics
      const totalProblems = Object.values(summary).reduce((a, b) => a + b, 0);
      const completedProblems = summary.completed || 0;
      const activeProblems = totalProblems - completedProblems;
      
      // Calculate retention rate
      const checkedProblems = Object.values(customSR).flat().filter(p => p.isChecked).length;
      const retentionRate = activeProblems > 0 ? Math.round((checkedProblems / activeProblems) * 100) : 0;
      
      // Calculate average time per stage
      const stageDistribution = Object.entries(summary).map(([stage, count]) => ({
        stage: stage.charAt(0).toUpperCase() + stage.slice(1),
        count,
        percentage: totalProblems > 0 ? Math.round((count / totalProblems) * 100) : 0
      }));

      setAnalytics({
        totalProblems,
        completedProblems,
        activeProblems,
        retentionRate,
        stageDistribution,
        summary
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          📊 Spaced Repetition Analytics
        </h2>
        <button
          onClick={fetchAnalytics}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="text-2xl font-bold text-blue-500">{analytics.totalProblems}</div>
          <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total Problems</div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="text-2xl font-bold text-green-500">{analytics.completedProblems}</div>
          <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Mastered</div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="text-2xl font-bold text-orange-500">{analytics.activeProblems}</div>
          <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>In Progress</div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="text-2xl font-bold text-purple-500">{analytics.retentionRate}%</div>
          <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Retention Rate</div>
        </div>
      </div>

      {/* Stage Distribution */}
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Stage Distribution
        </h3>
        
        <div className="space-y-3">
          {analytics.stageDistribution?.map((stage, index) => (
            <div key={stage.stage} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full`} style={{
                  backgroundColor: ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#10b981'][index] || '#6b7280'
                }}></div>
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {stage.stage}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full"
                    style={{
                      width: `${stage.percentage}%`,
                      backgroundColor: ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#10b981'][index] || '#6b7280'
                    }}
                  ></div>
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stage.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-blue-900' : 'bg-blue-50'} border-l-4 border-blue-500`}>
        <h4 className={`font-semibold ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>💡 Insights</h4>
        <div className={`mt-2 text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
          {analytics.retentionRate >= 80 && (
            <p>🎉 Excellent retention rate! You're doing great with spaced repetition.</p>
          )}
          {analytics.retentionRate >= 60 && analytics.retentionRate < 80 && (
            <p>👍 Good retention rate. Try to review problems more consistently.</p>
          )}
          {analytics.retentionRate < 60 && (
            <p>📚 Consider reviewing problems more regularly to improve retention.</p>
          )}
          
          {analytics.summary?.today > 5 && (
            <p className="mt-1">⏰ You have {analytics.summary.today} problems due today. Great time to review!</p>
          )}
          
          {analytics.completedProblems > 0 && (
            <p className="mt-1">🏆 You've mastered {analytics.completedProblems} problems! Keep up the momentum.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpacedRepetitionAnalytics;