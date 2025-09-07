import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import UniversalProgressDashboard from './UniversalProgressDashboard';

const API_BASE_URL = 'https://plusdsa.onrender.com/api';

const ProgressOverview = ({ userId, currentSheetType, onSheetChange }) => {
  const [apnaCollegeProgress, setApnaCollegeProgress] = useState({ completedProblems: [], starredProblems: [], notes: {}, playlists: [] });
  const [loveBabbarProgress, setLoveBabbarProgress] = useState({ completedProblems: [], starredProblems: [], notes: {}, playlists: [] });
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchBothSheetsProgress();
  }, [userId]);

  const fetchBothSheetsProgress = async () => {
    try {
      const [apnaResponse, loveBabbarResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/progress/${userId}?sheetType=apnaCollege`),
        axios.get(`${API_BASE_URL}/progress/${userId}?sheetType=loveBabbar`)
      ]);
      
      setApnaCollegeProgress(apnaResponse.data);
      setLoveBabbarProgress(loveBabbarResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching progress:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ fontSize: '16px', color: '#6b7280' }}>Loading progress...</div>
      </div>
    );
  }

  const apnaCollegeCompleted = apnaCollegeProgress.completedProblems.length;
  const loveBabbarCompleted = loveBabbarProgress.completedProblems.length;
  const totalCompleted = apnaCollegeCompleted + loveBabbarCompleted;
  const totalProblems = 373 + 450;

  return (
    <div>
      <UniversalProgressDashboard userId={userId} isDark={isDark} />
    </div>
  );
};

export default ProgressOverview;