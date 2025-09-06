import React, { useState, useEffect } from 'react';
import ContestTracker from './ContestTracker';
// import PlatformConnector from './PlatformConnector'; // Component removed
import ProgressOverview from './ProgressOverview';

const CompetitiveDashboard = ({ userId, currentSheetType, onSheetChange }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'contests', label: '🏆 Contests', icon: '🏆' },
    { id: 'connect', label: '🔗 Connect', icon: '🔗' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🚀 Competitive Programming Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track contests, compare rankings, and monitor your progress across platforms
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white border-b-2 border-blue-500'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <ProgressOverview 
                userId={userId} 
                currentSheetType={currentSheetType} 
                onSheetChange={onSheetChange} 
              />
              
              <div className="max-w-4xl mx-auto">
                <ContestTracker />
              </div>
            </div>
          )}

          {activeTab === 'contests' && (
            <div className="max-w-4xl mx-auto">
              <ContestTracker />
            </div>
          )}



          {activeTab === 'connect' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Platform Connection</h3>
                <p className="text-gray-600 dark:text-gray-300">Feature coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompetitiveDashboard;