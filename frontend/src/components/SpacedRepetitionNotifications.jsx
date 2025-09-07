import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SpacedRepetitionNotifications = ({ userId, sheetType = 'apnaCollege' }) => {
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    dailyReminder: true,
    reviewReminder: true,
    progressUpdates: true,
    reminderTime: '09:00'
  });

  const API_BASE = import.meta.env.VITE_API_URL || 'https://plusdsa.onrender.com/api';

  useEffect(() => {
    checkForNotifications();
    loadNotificationSettings();
  }, [userId, sheetType]);

  const checkForNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE}/custom-spaced-repetition/all?sheetType=${sheetType}`, {
        headers: { userid: userId }
      });
      const data = await response.json();
      
      const summary = data.summary || {};
      const newNotifications = [];

      // Check for due problems
      if (summary.today > 0) {
        newNotifications.push({
          id: 'due-today',
          type: 'review',
          title: 'Problems Due for Review',
          message: `You have ${summary.today} problems due for review today!`,
          action: 'Review Now',
          priority: 'high',
          timestamp: new Date()
        });
      }

      // Check for tomorrow's problems
      if (summary.tomorrow > 5) {
        newNotifications.push({
          id: 'tomorrow-reminder',
          type: 'reminder',
          title: 'Tomorrow\'s Review',
          message: `${summary.tomorrow} problems will be due tomorrow. Get ready!`,
          action: 'View Tomorrow',
          priority: 'medium',
          timestamp: new Date()
        });
      }

      // Check for stuck problems (in same stage for too long)
      const customSR = data.customSpacedRepetition || {};
      let stuckCount = 0;
      
      Object.entries(customSR).forEach(([stage, problems]) => {
        if (stage !== 'today' && stage !== 'completed') {
          problems.forEach(problem => {
            const daysSinceAdded = (new Date() - new Date(problem.stageAddedDate || problem.addedDate)) / (1000 * 60 * 60 * 24);
            const expectedDays = {
              tomorrow: 3,
              day3: 7,
              week1: 14,
              week2: 30,
              month1: 90
            };
            
            if (daysSinceAdded > expectedDays[stage] * 1.5 && !problem.isChecked) {
              stuckCount++;
            }
          });
        }
      });

      if (stuckCount > 0) {
        newNotifications.push({
          id: 'stuck-problems',
          type: 'warning',
          title: 'Problems Need Attention',
          message: `${stuckCount} problems have been in the same stage for a while. Consider reviewing them.`,
          action: 'Check Problems',
          priority: 'medium',
          timestamp: new Date()
        });
      }

      // Motivational notifications
      if (summary.completed > 0 && summary.completed % 10 === 0) {
        newNotifications.push({
          id: 'milestone',
          type: 'success',
          title: 'Milestone Achieved! 🎉',
          message: `Congratulations! You've mastered ${summary.completed} problems!`,
          action: 'View Progress',
          priority: 'low',
          timestamp: new Date()
        });
      }

      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  const loadNotificationSettings = () => {
    const saved = localStorage.getItem(`sr-notifications-${userId}`);
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveNotificationSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem(`sr-notifications-${userId}`, JSON.stringify(newSettings));
  };

  const dismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'review': return '📚';
      case 'reminder': return '⏰';
      case 'warning': return '⚠️';
      case 'success': return '🎉';
      default: return '📢';
    }
  };

  const getNotificationColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Schedule daily notifications
        scheduleNotifications();
      }
    }
  };

  const scheduleNotifications = () => {
    if (settings.dailyReminder) {
      // This would typically be handled by a service worker
      // For now, we'll just show browser notifications when the app is open
      const now = new Date();
      const [hours, minutes] = settings.reminderTime.split(':');
      const reminderTime = new Date();
      reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      if (reminderTime > now) {
        const timeUntilReminder = reminderTime - now;
        setTimeout(() => {
          if (notifications.some(n => n.type === 'review')) {
            new Notification('DSA Spaced Repetition', {
              body: 'You have problems due for review today!',
              icon: '/favicon.ico'
            });
          }
        }, timeUntilReminder);
      }
    }
  };

  return (
    <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🔔 Notifications & Reminders
        </h2>
        <button
          onClick={requestNotificationPermission}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Enable Notifications
        </button>
      </div>

      {/* Active Notifications */}
      {notifications.length > 0 && (
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Active Notifications
          </h3>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border-l-4 ${
                  isDark ? 'bg-gray-700' : getNotificationColor(notification.priority)
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    <div>
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {notification.title}
                      </h4>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-3 mt-2">
                        <button className="text-blue-500 text-sm hover:underline">
                          {notification.action}
                        </button>
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {notification.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    className={`text-gray-400 hover:text-gray-600 ${isDark ? 'hover:text-gray-200' : ''}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notification Settings */}
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Notification Settings
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Daily Review Reminders
            </label>
            <input
              type="checkbox"
              checked={settings.dailyReminder}
              onChange={(e) => saveNotificationSettings({
                ...settings,
                dailyReminder: e.target.checked
              })}
              className="rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Review Due Notifications
            </label>
            <input
              type="checkbox"
              checked={settings.reviewReminder}
              onChange={(e) => saveNotificationSettings({
                ...settings,
                reviewReminder: e.target.checked
              })}
              className="rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Progress Updates
            </label>
            <input
              type="checkbox"
              checked={settings.progressUpdates}
              onChange={(e) => saveNotificationSettings({
                ...settings,
                progressUpdates: e.target.checked
              })}
              className="rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Reminder Time
            </label>
            <input
              type="time"
              value={settings.reminderTime}
              onChange={(e) => saveNotificationSettings({
                ...settings,
                reminderTime: e.target.value
              })}
              className={`px-2 py-1 rounded text-sm ${
                isDark ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
              }`}
            />
          </div>
        </div>
      </div>

      {notifications.length === 0 && (
        <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="text-4xl mb-2">🔕</div>
          <div>No notifications right now. Keep up the good work!</div>
        </div>
      )}
    </div>
  );
};

export default SpacedRepetitionNotifications;