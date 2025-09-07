import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://plusdsa.onrender.com/api';

export const useAnalytics = (userId) => {
  const [analytics, setAnalytics] = useState({
    performance: { totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0, accuracy: 0 },
    weakAreas: [],
    recentActivity: [],
    studyPattern: { activeDays: 0, avgProblemsPerDay: 0, consistency: 'Low' }
  });
  const [loading, setLoading] = useState(true);

  // Track problem attempt
  const trackAttempt = async (problemData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      await axios.post(`${API_BASE_URL}/analytics/${userId}/track`, problemData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Refresh analytics after tracking
      fetchAnalytics();
    } catch (error) {
      console.error('Error tracking attempt:', error);
    }
  };

  // Fetch user analytics
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.get(`${API_BASE_URL}/analytics/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set interview goals
  const setInterviewGoals = async (goals) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.post(`${API_BASE_URL}/analytics/${userId}/interview-goals`, goals, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error setting goals:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAnalytics();
    }
  }, [userId]);

  return {
    analytics,
    loading,
    trackAttempt,
    setInterviewGoals,
    refreshAnalytics: fetchAnalytics
  };
};