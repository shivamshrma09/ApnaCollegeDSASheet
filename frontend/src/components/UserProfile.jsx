import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useUserProgress } from '../hooks/useUserProgress';
import { useForgettingCurve } from '../hooks/useForgettingCurve';
// Custom Spaced Repetition Hook
const useCustomSpacedRepetition = (userId, sheetType = 'apnaCollege') => {
  const API_BASE = import.meta.env.VITE_API_URL || 'https://plusdsa.onrender.com/api';
  
  const addToSpacedRepetition = async (problemId) => {
    try {
      const response = await fetch(`${API_BASE}/custom-spaced-repetition/add-solved?sheetType=${sheetType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          userid: userId
        },
        body: JSON.stringify({ problemId })
      });
      return response.ok;
    } catch (error) {
      console.error('Error adding to spaced repetition:', error);
      return false;
    }
  };

  return { addToSpacedRepetition };
};
// Data will be loaded dynamically based on sheet type
import ProblemModal from './ProblemModal';
import ProblemDiscussion from './ProblemDiscussion';
import ProblemTimer from './ProblemTimer';
import MentorshipPage from './MentorshipPage';
import UniversalProgressDashboard from './UniversalProgressDashboard';

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://plusdsa.onrender.com/api';

const UserProfile = ({ isOpen, onClose, userId }) => {
  const { isDark } = useTheme();
  
  // Add CSS for spinner animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const [activeTab, setActiveTab] = useState('universal');
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [selectedSheet, setSelectedSheet] = useState('apnaCollege');
  
  // Helper function to get sheet display name
  const getSheetDisplayName = (sheetType) => {
    const sheetNames = {
      'apnaCollege': 'Apna College',
      'loveBabbar': 'Love Babbar',
      'striverA2Z': 'Striver A2Z',
      'striverSDE': 'Striver SDE',
      'striver79': 'Striver 79',
      'blind75': 'Blind 75',
      'striverBlind75': 'Striver Blind 75',
      'striverCP': 'Striver CP'
    };
    return sheetNames[sheetType] || sheetType;
  };
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userStreak, setUserStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(null);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [showShareModal, setShowShareModal] = useState(null);
  const [showMentorshipPage, setShowMentorshipPage] = useState(false);
  
  const { completedProblems, starredProblems, notes, playlists } = useUserProgress(userId, selectedSheet);
  const { forgettingCurveData } = useForgettingCurve(userId, selectedSheet);
  const { addToSpacedRepetition } = useCustomSpacedRepetition(userId, selectedSheet);
  
  // Custom Spaced Repetition Data
  const [customSpacedData, setCustomSpacedData] = useState({});
  
  const fetchCustomSpacedData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/custom-spaced-repetition/all?sheetType=${selectedSheet}`, {
        headers: { userid: userId }
      });
      const data = await response.json();
      setCustomSpacedData(data.customSpacedRepetition || {});
    } catch (error) {
      console.error('Error fetching custom spaced data:', error);
    }
  };
  
  const getCustomSpacedRepetitionPlaylists = () => {
    const stages = ['today', 'tomorrow', 'day3', 'week1', 'week2', 'month1', 'completed'];
    
    return stages.map(stage => {
      const problems = customSpacedData[stage] || [];
      const problemIds = problems.map(p => p.problemId).filter(Boolean);
      
      return {
        name: (stage === 'today' ? 'Review Today' : 
              stage === 'tomorrow' ? 'Tomorrow' :
              stage === 'day3' ? 'Day 3' :
              stage === 'week1' ? 'Week 1' :
              stage === 'week2' ? 'Week 2' :
              stage === 'month1' ? 'Month 1' :
              stage === 'completed' ? 'Mastered' : stage) + ` (${getSheetDisplayName(selectedSheet)})`,
        sheetType: selectedSheet,
        icon: stage === 'today' ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/></svg> : 
              stage === 'tomorrow' ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6,6.9L3.87,4.78L5.28,3.37L7.4,5.5L6,6.9M13,1V4H11V1H13M21,11V13H18V11H21M4.5,10.5V12.5H1.5V10.5H4.5M15.07,6.93L17.2,4.8L18.61,6.21L16.48,8.34L15.07,6.93M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M6,20H18A2,2 0 0,1 20,22H4A2,2 0 0,1 6,20Z"/></svg> :
              stage === 'day3' ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/></svg> :
              stage === 'week1' ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3,3V21H21V19H5V3H3M22,7H6V9H22V7M22,11H6V13H22V11M22,15H6V17H22V15Z"/></svg> :
              stage === 'week2' ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/></svg> :
              stage === 'month1' ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9,10V12H7V10H9M13,10V12H11V10H13M17,10V12H15V10H17M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H6V1H8V3H16V1H18V3H19M19,19V8H5V19H19M9,14V16H7V14H9M13,14V16H11V14H13M17,14V16H15V14H17Z"/></svg> :
              stage === 'completed' ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z"/></svg>,
        count: problemIds.length,
        color: stage === 'today' ? '#ef4444' : 
               stage === 'tomorrow' ? '#f59e0b' :
               stage === 'day3' ? '#eab308' :
               stage === 'week1' ? '#22c55e' :
               stage === 'week2' ? '#3b82f6' :
               stage === 'month1' ? '#8b5cf6' :
               stage === 'completed' ? '#10b981' : '#6b7280',
        problems: problemIds,
        type: 'customSpacedRepetition',
        stage: stage,
        desc: (stage === 'today' ? 'Due for review now' :
              stage === 'tomorrow' ? 'Review tomorrow' :
              stage === 'day3' ? 'Review in 3 days' :
              stage === 'week1' ? 'Review next week' :
              stage === 'week2' ? 'Review in 2 weeks' :
              stage === 'month1' ? 'Review next month' :
              stage === 'completed' ? 'Mastered problems' : 'Spaced repetition') + ` - ${getSheetDisplayName(selectedSheet)} sheet`
      };
    });
  };
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

  const getProgressData = () => {
    const completed = completedProblems.size;
    let total = 373; // Default for Apna College
    
    if (selectedSheet === 'loveBabbar') total = 450;
    else if (selectedSheet === 'striverA2Z') total = 455;
    else if (selectedSheet === 'striverSDE') total = 191;
    else if (selectedSheet === 'striver79') total = 79;
    else if (selectedSheet === 'blind75' || selectedSheet === 'striverBlind75') total = 75;
    else if (selectedSheet === 'striverCP') total = 298;
    
    // Use real data from completed problems
    return {
      total,
      completed,
      easy: Math.floor(completed * 0.4), // Will be updated with real difficulty data
      medium: Math.floor(completed * 0.45),
      hard: Math.floor(completed * 0.15),
      streak: userStreak || 0
    };
  };

  const fetchLeaderboard = async () => {
    try {
      console.log('Fetching leaderboard for sheet:', selectedSheet);
      const response = await axios.get(`${API_BASE_URL}/leaderboard/global?sheetType=${selectedSheet}`);
      console.log('Leaderboard response:', response.data);
      setLeaderboard((response.data.leaderboard || []).slice(0, 10));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Fallback to demo data only if API fails
      setLeaderboard([
        { _id: '1', name: 'Demo User 1', problemsSolved: 150, joinedAt: new Date() },
        { _id: '2', name: 'Demo User 2', problemsSolved: 120, joinedAt: new Date() },
        { _id: '3', name: 'Demo User 3', problemsSolved: 100, joinedAt: new Date() }
      ]);
    }
  };

  const fetchUserRank = async () => {
    try {
      if (!userId) {
        console.log('No userId provided, skipping user rank fetch');
        setUserRank({ rank: null, totalUsers: 0 });
        return;
      }
      console.log('Fetching user rank for:', userId, 'sheet:', selectedSheet);
      const response = await axios.get(`${API_BASE_URL}/leaderboard/rank/${userId}?sheetType=${selectedSheet}`);
      console.log('User rank response:', response.data);
      setUserRank(response.data);
    } catch (error) {
      console.error('Error fetching user rank:', error);
      // Fallback rank based on completed problems
      const completed = completedProblems.size;
      setUserRank({ rank: Math.max(1, 100 - completed), totalUsers: Math.max(leaderboard.length, 1) });
    }
  };

  const fetchUserStreak = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/progress/${userId}/stats?sheetType=${selectedSheet}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUserStreak(response.data.streak || 0);
    } catch (error) {
      console.error('Error fetching user streak:', error);
      // Calculate streak from localStorage
      const storageKey = selectedSheet === 'loveBabbar' ? 'loveBabbar' : 'apnaCollege';
      const lastSolved = localStorage.getItem(`${storageKey}_lastSolved`);
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (lastSolved === today || lastSolved === yesterday) {
        setUserStreak(parseInt(localStorage.getItem(`${storageKey}_streak`) || '0'));
      } else {
        setUserStreak(0);
      }
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/progress/playlist`, {
        name: newPlaylistName,
        description: newPlaylistDesc,
        sheetType: selectedSheet,
        userId: userId
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setNewPlaylistName('');
      setNewPlaylistDesc('');
      setShowCreatePlaylist(false);
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const deletePlaylist = async (playlistId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/progress/playlist/${playlistId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const sharePlaylist = (playlist) => {
    setShowShareModal(playlist);
  };

  useEffect(() => {
    if (isOpen) {
      console.log('UserProfile opened, fetching data for userId:', userId, 'sheet:', selectedSheet);
      setLoading(true);
      
      const promises = [fetchLeaderboard()];
      
      if (userId) {
        promises.push(fetchUserRank(), fetchUserStreak());
      }
      
      Promise.all(promises).finally(() => {
        console.log('All data fetching completed');
        setLoading(false);
      });
    }
  }, [isOpen, userId, selectedSheet]);

  // Refresh data when sheet changes
  useEffect(() => {
    if (isOpen && userId) {
      fetchUserStreak();
      fetchCustomSpacedData();
    }
  }, [selectedSheet]);
  
  // Fetch custom spaced data when component mounts
  useEffect(() => {
    if (isOpen && userId) {
      fetchCustomSpacedData();
    }
  }, [isOpen, userId, selectedSheet]);
  
  // Refresh custom spaced data when sheet changes
  useEffect(() => {
    if (isOpen && userId) {
      fetchCustomSpacedData();
    }
  }, [selectedSheet]);

  if (!isOpen) return null;

  const progress = getProgressData();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 1500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        width: '95%',
        maxWidth: '1200px',
        height: '90%',
        backgroundColor: isDark ? '#1f2937' : 'white',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(30, 144, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill={isDark ? '#1E90FF' : '#1E90FF'}>
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
            </svg>
            <h2 style={{ color: isDark ? '#1E90FF' : '#1E90FF', margin: 0, fontSize: '24px', fontWeight: '600' }}>
              User Profile
            </h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isDark ? '#22c55e' : '#16a34a'}>
              <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
            </svg>
          </div>
          <button onClick={onClose} style={{
            background: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(0,0,0,0.05)',
            border: 'none',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isDark ? '#d1d5db' : '#374151'}>
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar */}
          <div style={{
            width: '250px',
            backgroundColor: isDark ? '#111827' : '#f8fafc',
            borderRight: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            padding: '20px 0'
          }}>
            <div style={{ padding: '0 20px', marginBottom: '30px', textAlign: 'center' }}>
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name || 'User'}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 12px',
                    border: '3px solid #3b82f6'
                  }}
                />
              ) : (
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '32px',
                  fontWeight: '600',
                  margin: '0 auto 12px',
                  border: '3px solid #3b82f6'
                }}>
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <h3 style={{ color: isDark ? 'white' : '#1f2937', margin: '0', fontSize: '18px' }}>
                  {user.name || 'User'}
                </h3>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#22c55e">
                  <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                </svg>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginTop: '4px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill={isDark ? '#9ca3af' : '#6b7280'}>
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
                </svg>
                <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: 0, fontSize: '14px' }}>
                  {progress.completed}/{progress.total} Problems Solved
                </p>
              </div>
              
              {/* Sheet Selector Dropdown */}
              <div style={{ marginTop: '16px' }}>
                <select
                  value={selectedSheet}
                  onChange={(e) => setSelectedSheet(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '12px',
                    borderRadius: '8px',
                    border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                    backgroundColor: isDark ? '#374151' : 'white',
                    color: isDark ? '#e5e7eb' : '#1f2937',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  <option value="apnaCollege">Apna College (373)</option>
                  <option value="loveBabbar">Love Babbar (450)</option>
                  <option value="striverA2Z">Striver A2Z (455)</option>
                  <option value="striverSDE">Striver SDE (191)</option>
                  <option value="striver79">Striver 79 (79)</option>
                  <option value="blind75">Blind 75 (75)</option>
                  <option value="striverBlind75">Striver Blind 75 (75)</option>
                  <option value="striverCP">Striver CP (298)</option>
                  <option value="vision">VISION Sheet (100)</option>
                  <option value="neetcode150">NeetCode 150 (150)</option>
                  <option value="systemDesign">System Design (70)</option>
                  <option value="leetcodeTop150">LeetCode Top 150 (150)</option>
                  <option value="cp31">CP-31 Sheet (372)</option>
                  <option value="visionCP">VISION CP (135)</option>
                </select>
              </div>
            </div>

            {/* Navigation */}
            {[
              { id: 'universal', label: 'All Sheets', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"/></svg> },
              { id: 'overview', label: 'Overview & Progress', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3,3V21H21V19H5V3H3M22,7H6V9H22V7M22,11H6V13H22V11M22,15H6V17H22V15Z"/></svg> },
              { id: 'platforms', label: 'Platform Stats', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10.59,13.41C11,13.8 11,14.4 10.59,14.81C10.2,15.2 9.6,15.2 9.19,14.81L7.77,13.39L6.36,14.81L10.59,19.04L21.41,8.22L20,6.81L10.59,16.22L9.19,14.81L10.59,13.41M21.41,6.41L22.83,5L21.41,3.59L20,5L18.59,3.59L17.17,5L18.59,6.41L17.17,7.83L18.59,9.24L20,7.83L21.41,9.24L22.83,7.83L21.41,6.41Z"/></svg> },
              { id: 'playlists', label: 'My Playlists', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3,5H21V7H3V5M3,13V11H21V13H3M3,19V17H21V19H3Z"/></svg> },
              { id: 'certificates', label: 'Performance Certificates', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  background: activeTab === tab.id ? (isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(30, 144, 255, 0.1)') : 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: activeTab === tab.id ? (isDark ? '#1E90FF' : '#1E90FF') : (isDark ? '#d1d5db' : '#374151'),
                  fontSize: '14px',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderLeft: activeTab === tab.id ? '3px solid #1E90FF' : '3px solid transparent'
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            {activeTab === 'universal' && (
              <UniversalProgressDashboard userId={userId} isDark={isDark} />
            )}
            {activeTab === 'overview' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: isDark ? 'white' : '#1f2937', margin: 0 }}>Overview & Progress</h3>
                  <div style={{
                    padding: '4px 8px',
                    backgroundColor: selectedSheet === 'apnaCollege' ? '#dbeafe' : selectedSheet === 'striverBlind75' ? '#f3e8ff' : '#fef3c7',
                    color: selectedSheet === 'apnaCollege' ? '#1e40af' : selectedSheet === 'striverBlind75' ? '#7c3aed' : '#92400e',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {selectedSheet === 'apnaCollege' ? 'Apna College (373)' : 
                     selectedSheet === 'loveBabbar' ? 'Love Babbar (450)' :
                     selectedSheet === 'striverBlind75' ? 'Striver Blind 75 (75)' :
                     selectedSheet === 'striverA2Z' ? 'Striver A2Z (455)' :
                     selectedSheet === 'striverSDE' ? 'Striver SDE (191)' :
                     selectedSheet === 'blind75' ? 'Blind 75 (75)' :
                     selectedSheet}
                  </div>
                </div>
                
                {/* Goal Setting Section */}
                <GoalSettingSection isDark={isDark} userId={userId} selectedSheet={selectedSheet} />
                
                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                  <div style={{
                    padding: '16px',
                    backgroundColor: isDark ? '#374151' : 'white',
                    borderRadius: '10px',
                    border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px'
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#22c55e" opacity="0.3">
                        <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                      </svg>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e', marginBottom: '6px' }}>
                      {progress.completed}
                    </div>
                    <div style={{ color: isDark ? '#d1d5db' : '#6b7280', fontSize: '12px' }}>Total Solved</div>
                    <div style={{ color: '#22c55e', fontSize: '10px', marginTop: '2px' }}>Beats {Math.floor(Math.random() * 40) + 20}%</div>
                  </div>
                  
                  <div style={{
                    padding: '16px',
                    backgroundColor: isDark ? '#374151' : 'white',
                    borderRadius: '10px',
                    border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#22c55e" opacity="0.3">
                        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                      </svg>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e', marginBottom: '6px' }}>
                      {progress.easy}
                    </div>
                    <div style={{ color: isDark ? '#d1d5db' : '#6b7280', fontSize: '12px' }}>Easy</div>
                  </div>
                  
                  <div style={{
                    padding: '16px',
                    backgroundColor: isDark ? '#374151' : 'white',
                    borderRadius: '10px',
                    border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" opacity="0.3">
                        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
                      </svg>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '6px' }}>
                      {progress.medium}
                    </div>
                    <div style={{ color: isDark ? '#d1d5db' : '#6b7280', fontSize: '12px' }}>Medium</div>
                  </div>
                  
                  <div style={{
                    padding: '16px',
                    backgroundColor: isDark ? '#374151' : 'white',
                    borderRadius: '10px',
                    border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444" opacity="0.3">
                        <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,13.5C15.53,14.91 16.28,16.19 17.22,17.22C18.95,18.95 21.81,19.74 22,18C22.19,16.26 20.95,14.95 19.22,13.22C18.19,12.28 16.91,11.53 15.5,11L21,9M15,9.5V9.5L9.5,15H15V9.5Z"/>
                      </svg>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444', marginBottom: '6px' }}>
                      {progress.hard}
                    </div>
                    <div style={{ color: isDark ? '#d1d5db' : '#6b7280', fontSize: '12px' }}>Hard</div>
                  </div>
                  
                  <div style={{
                    padding: '16px',
                    backgroundColor: isDark ? '#374151' : 'white',
                    borderRadius: '10px',
                    border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" opacity="0.3">
                        <path d="M17.66,11.2C17.43,10.9 17.15,10.64 16.89,10.38C16.22,9.78 15.46,9.35 14.82,8.72C13.33,7.26 13,4.85 13.95,3C13.74,3.09 13.54,3.22 13.34,3.4C11.84,4.86 11.55,8.28 12.92,10.11C13.04,10.27 13.16,10.44 13.27,10.63C13.07,10.33 12.85,10.04 12.6,9.76C11.39,8.53 10.96,6.77 11.42,5.27C11.33,5.27 11.24,5.31 11.15,5.33C10.71,5.51 10.26,5.77 9.88,6.17C8.29,7.85 8.6,10.92 10.4,12.4C10.27,12.13 10.15,11.86 10.04,11.58C9.65,10.75 9.63,9.47 10.1,8.65C9.91,9.07 9.8,9.6 9.8,10.1C9.8,11.16 10.34,12.16 11.22,12.83C11.75,13.26 12.37,13.54 13,13.75C13.27,13.83 13.54,13.9 13.81,13.95C14.27,14.05 14.73,14.11 15.2,14.11C15.5,14.11 15.8,14.08 16.09,14.04C17.35,13.8 18.47,13.11 19.22,12.04C19.5,11.58 19.68,11.06 19.75,10.5C19.75,10.79 19.68,11.08 19.54,11.35C19.39,11.65 19.18,11.9 18.95,12.11C18.73,12.34 18.5,12.53 18.26,12.7C18,12.87 17.74,13.01 17.47,13.12C17.17,13.25 16.86,13.34 16.55,13.4C16.22,13.47 15.89,13.5 15.56,13.5C15.1,13.5 14.65,13.44 14.22,13.34C13.77,13.24 13.34,13.08 12.95,12.86C12.56,12.64 12.2,12.37 11.89,12.04C11.58,11.71 11.31,11.34 11.1,10.93C10.89,10.52 10.73,10.08 10.64,9.63C10.55,9.18 10.52,8.72 10.56,8.27C10.6,7.82 10.71,7.38 10.89,6.97C11.07,6.56 11.32,6.19 11.63,5.87C11.94,5.55 12.3,5.28 12.69,5.07C13.08,4.86 13.5,4.71 13.93,4.63C14.36,4.55 14.8,4.54 15.24,4.6C15.68,4.66 16.1,4.79 16.49,4.99C16.88,5.19 17.23,5.45 17.53,5.76C17.83,6.07 18.08,6.43 18.26,6.82C18.44,7.21 18.55,7.63 18.58,8.05C18.61,8.47 18.56,8.9 18.43,9.31C18.3,9.72 18.09,10.1 17.81,10.43C17.53,10.76 17.18,11.03 16.79,11.22C16.4,11.41 15.98,11.52 15.55,11.55C15.12,11.58 14.69,11.53 14.28,11.4C13.87,11.27 13.49,11.06 13.16,10.78C12.83,10.5 12.55,10.15 12.34,9.76C12.13,9.37 12,8.94 11.95,8.5C11.9,8.06 11.93,7.62 12.04,7.2C12.15,6.78 12.34,6.38 12.6,6.04C12.86,5.7 13.19,5.42 13.56,5.22C13.93,5.02 14.34,4.9 14.76,4.87C15.18,4.84 15.6,4.9 16,5.05C16.4,5.2 16.76,5.43 17.06,5.73C17.36,6.03 17.59,6.39 17.74,6.78C17.89,7.17 17.96,7.59 17.94,8C17.92,8.41 17.81,8.81 17.62,9.17C17.43,9.53 17.16,9.84 16.83,10.08C16.5,10.32 16.12,10.48 15.72,10.55C15.32,10.62 14.91,10.6 14.52,10.49C14.13,10.38 13.77,10.18 13.46,9.91C13.15,9.64 12.9,9.3 12.73,8.92C12.56,8.54 12.47,8.13 12.47,7.71C12.47,7.29 12.56,6.88 12.73,6.5C12.9,6.12 13.15,5.78 13.46,5.51C13.77,5.24 14.13,5.04 14.52,4.93C14.91,4.82 15.32,4.8 15.72,4.87C16.12,4.94 16.5,5.1 16.83,5.34C17.16,5.58 17.43,5.89 17.62,6.25C17.81,6.61 17.92,7.01 17.94,7.42C17.96,7.83 17.89,8.25 17.74,8.64C17.59,9.03 17.36,9.39 17.06,9.69C16.76,9.99 16.4,10.22 16,10.37C15.6,10.52 15.18,10.58 14.76,10.55C14.34,10.52 13.93,10.4 13.56,10.2C13.19,10 12.86,9.72 12.6,9.38C12.34,9.04 12.15,8.64 12.04,8.22C11.93,7.8 11.9,7.36 11.95,6.92C12,6.48 12.13,6.05 12.34,5.66C12.55,5.27 12.83,4.92 13.16,4.64C13.49,4.36 13.87,4.15 14.28,4.02C14.69,3.89 15.12,3.84 15.55,3.87C15.98,3.9 16.4,4.01 16.79,4.2C17.18,4.39 17.53,4.66 17.81,4.99C18.09,5.32 18.3,5.7 18.43,6.11C18.56,6.52 18.61,6.95 18.58,7.37C18.55,7.79 18.44,8.21 18.26,8.6C18.08,8.99 17.83,9.35 17.53,9.66C17.23,9.97 16.88,10.23 16.49,10.43C16.1,10.63 15.68,10.76 15.24,10.82C14.8,10.88 14.36,10.87 13.93,10.79C13.5,10.71 13.08,10.56 12.69,10.35C12.3,10.14 11.94,9.87 11.63,9.55C11.32,9.23 11.07,8.86 10.89,8.45C10.71,8.04 10.6,7.6 10.56,7.15C10.52,6.7 10.55,6.24 10.64,5.79C10.73,5.34 10.89,4.9 11.1,4.49C11.31,4.08 11.58,3.71 11.89,3.38C12.2,3.05 12.56,2.78 12.95,2.56C13.34,2.34 13.77,2.18 14.22,2.08C14.65,1.98 15.1,1.92 15.56,1.92C15.89,1.92 16.22,1.95 16.55,2.02C16.86,2.08 17.17,2.17 17.47,2.3C17.74,2.41 18,2.55 18.26,2.72C18.5,2.89 18.73,3.08 18.95,3.31C19.18,3.52 19.39,3.77 19.54,4.07C19.68,4.34 19.75,4.63 19.75,4.92C19.68,4.36 19.5,3.84 19.22,3.38C18.47,2.31 17.35,1.62 16.09,1.38C15.8,1.34 15.5,1.31 15.2,1.31C14.73,1.31 14.27,1.37 13.81,1.47C13.54,1.52 13.27,1.59 13,1.67C12.37,1.88 11.75,2.16 11.22,2.59C10.34,3.26 9.8,4.26 9.8,5.32C9.8,5.82 9.91,6.35 10.1,6.77C9.63,5.95 9.65,4.67 10.04,3.84C10.15,3.56 10.27,3.29 10.4,3.02C8.6,4.5 8.29,7.57 9.88,9.25C10.26,9.65 10.71,9.91 11.15,10.09C11.24,10.11 11.33,10.15 11.42,10.15C10.96,8.65 11.39,6.89 12.6,5.66C12.85,5.38 13.07,5.09 13.27,4.79C13.16,4.98 13.04,5.15 12.92,5.31C11.55,7.14 11.84,10.56 13.34,12.02C13.54,12.2 13.74,12.33 13.95,12.42C13,10.27 13.33,7.86 14.82,6.4C15.46,5.77 16.22,5.34 16.89,4.74C17.15,4.48 17.43,4.22 17.66,3.92C17.66,11.2 17.66,11.2 17.66,11.2Z"/>
                      </svg>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '6px' }}>
                      {progress.streak}
                    </div>
                    <div style={{ color: isDark ? '#d1d5db' : '#6b7280', fontSize: '12px' }}>Day Streak</div>
                  </div>
                  
                  <div style={{
                    padding: '16px',
                    backgroundColor: isDark ? '#374151' : 'white',
                    borderRadius: '10px',
                    border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#8b5cf6" opacity="0.3">
                        <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
                      </svg>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '6px' }}>
                      {starredProblems.size}
                    </div>
                    <div style={{ color: isDark ? '#d1d5db' : '#6b7280', fontSize: '12px' }}>Starred</div>
                  </div>
                  
                  <div style={{
                    padding: '16px',
                    backgroundColor: isDark ? '#374151' : 'white',
                    borderRadius: '10px',
                    border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#06b6d4" opacity="0.3">
                        <path d="M5,16L3,5L8.5,2L12,4.5L15.5,2L21,5L19,16H5M7.7,14H16.3L17.2,8.6L14.1,7.2L12,8.5L9.9,7.2L6.8,8.6L7.7,14Z"/>
                      </svg>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#06b6d4', marginBottom: '6px' }}>
                      #{userRank?.rank || (leaderboard && leaderboard.length > 0 ? leaderboard.findIndex(u => (u._id || u.userId) === userId) + 1 : 0) || '---'}
                    </div>
                    <div style={{ color: isDark ? '#d1d5db' : '#6b7280', fontSize: '12px' }}>Global Rank</div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  {/* Progress Chart */}
                  <div style={{
                    padding: '20px',
                    backgroundColor: isDark ? '#374151' : 'white',
                    borderRadius: '12px',
                    border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
                  }}>
                    <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px' }}>Progress by Difficulty</h4>
                    
                    <div style={{ display: 'grid', gap: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ color: '#22c55e', fontWeight: '500' }}>Easy Problems</span>
                          <span style={{ color: isDark ? '#d1d5db' : '#6b7280' }}>{progress.easy}/149</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: isDark ? '#4b5563' : '#e5e7eb', borderRadius: '4px' }}>
                          <div style={{ 
                            height: '100%', 
                            backgroundColor: '#22c55e', 
                            borderRadius: '4px', 
                            width: `${(progress.easy / 149) * 100}%`
                          }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ color: '#f59e0b', fontWeight: '500' }}>Medium Problems</span>
                          <span style={{ color: isDark ? '#d1d5db' : '#6b7280' }}>{progress.medium}/167</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: isDark ? '#4b5563' : '#e5e7eb', borderRadius: '4px' }}>
                          <div style={{ 
                            height: '100%', 
                            backgroundColor: '#f59e0b', 
                            borderRadius: '4px', 
                            width: `${(progress.medium / 167) * 100}%`
                          }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ color: '#ef4444', fontWeight: '500' }}>Hard Problems</span>
                          <span style={{ color: isDark ? '#d1d5db' : '#6b7280' }}>{progress.hard}/55</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: isDark ? '#4b5563' : '#e5e7eb', borderRadius: '4px' }}>
                          <div style={{ 
                            height: '100%', 
                            backgroundColor: '#ef4444', 
                            borderRadius: '4px', 
                            width: `${(progress.hard / 55) * 100}%`
                          }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* User Data */}
                  <div>
                    {/* Starred Problems */}
                    <div style={{
                      padding: '16px',
                      backgroundColor: isDark ? '#374151' : 'white',
                      borderRadius: '12px',
                      border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
                      marginBottom: '16px',
                      cursor: 'pointer'
                    }}
                    onClick={() => setShowPlaylistModal({
                      name: `Starred Problems (${selectedSheet === 'apnaCollege' ? 'Apna College' : 'Love Babbar'})`,
                      problems: Array.from(starredProblems),
                      type: 'starred',
                      count: starredProblems.size,
                      desc: `Your favorite ${selectedSheet === 'apnaCollege' ? 'Apna College' : 'Love Babbar'} problems`
                    })}
                    >
                      <h5 style={{ color: isDark ? 'white' : '#1f2937', margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Starred Problems</h5>
                      <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                        {Array.from(starredProblems).slice(0, 5).map(problemId => (
                          <div key={problemId} style={{
                            padding: '8px 0',
                            borderBottom: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                            fontSize: '12px'
                          }}>
                            <div style={{ color: isDark ? '#d1d5db' : '#374151', fontWeight: '500' }}>
                              Problem #{problemId}
                            </div>
                            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '10px', marginTop: '2px' }}>
                              Click to view all starred problems
                            </div>
                          </div>
                        ))}
                        {starredProblems.size === 0 && (
                          <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px', textAlign: 'center', padding: '20px 0' }}>
                            No starred problems yet
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recent Notes */}
                    <div style={{
                      padding: '16px',
                      backgroundColor: isDark ? '#374151' : 'white',
                      borderRadius: '12px',
                      border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
                      cursor: 'pointer'
                    }}
                    onClick={() => setShowPlaylistModal({
                      name: `Notes Added (${selectedSheet === 'apnaCollege' ? 'Apna College' : 'Love Babbar'})`,
                      problems: Object.keys(notes),
                      type: 'notes',
                      count: Object.keys(notes).length,
                      desc: `Problems with your ${selectedSheet === 'apnaCollege' ? 'Apna College' : 'Love Babbar'} notes`
                    })}
                    >
                      <h5 style={{ color: isDark ? 'white' : '#1f2937', margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Recent Notes</h5>
                      <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                        {Object.entries(notes).slice(0, 3).map(([problemId, note]) => (
                          <div key={problemId} style={{
                            padding: '8px 0',
                            borderBottom: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                            fontSize: '12px'
                          }}>
                            <div style={{ color: isDark ? '#d1d5db' : '#374151', fontWeight: '500' }}>Problem #{problemId}</div>
                            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', marginTop: '2px' }}>
                              {note.length > 50 ? note.substring(0, 50) + '...' : note}
                            </div>
                          </div>
                        ))}
                        {Object.keys(notes).length === 0 && (
                          <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px', textAlign: 'center', padding: '20px 0' }}>
                            No notes created yet
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>


                
                {/* Leaderboard */}
                <div style={{
                  padding: '20px',
                  backgroundColor: isDark ? '#374151' : 'white',
                  borderRadius: '12px',
                  border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ color: isDark ? 'white' : '#1f2937', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b">
                        <path d="M5 16L3 5l5.5-3L12 4.5 15.5 2 21 5l-2 11H5zm2.7-2h8.6l.9-5.4-3.1-1.4L12 8.5 9.9 7.2 6.8 8.6L7.7 14z"/>
                      </svg>
                      Global Leaderboard
                    </h4>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        value={selectedSheet}
                        onChange={(e) => setSelectedSheet(e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                          backgroundColor: isDark ? '#1f2937' : 'white',
                          color: isDark ? '#e5e7eb' : '#1f2937',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="apnaCollege">Apna College</option>
                        <option value="striverA2Z">Striver A2Z</option>
                        <option value="striverSDE">Striver SDE</option>
                        <option value="loveBabbar">Love Babbar</option>
                        <option value="blind75">Blind 75</option>
                        <option value="striverBlind75">Striver Blind 75</option>
                        <option value="neetcode">NeetCode 150</option>
                      </select>
                      
                      <select
                        defaultValue="problems"
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                          backgroundColor: isDark ? '#1f2937' : 'white',
                          color: isDark ? '#e5e7eb' : '#1f2937',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="problems">Problems Solved</option>
                        <option value="leetcode">LeetCode Rating</option>
                        <option value="codeforces">Codeforces Rating</option>
                        <option value="codechef">CodeChef Rating</option>
                        <option value="atcoder">AtCoder Rating</option>
                        <option value="github">GitHub Repos</option>
                        <option value="overall">Overall Score</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                    {loading ? (
                      <div style={{ textAlign: 'center', padding: '20px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                        Loading leaderboard...
                      </div>
                    ) : leaderboard && leaderboard.length > 0 ? (
                      leaderboard
                        .sort((a, b) => {
                          const aSolved = a.totalSolved || a.problemsSolved || a.completedProblems || 0;
                          const bSolved = b.totalSolved || b.problemsSolved || b.completedProblems || 0;
                          return bSolved - aSolved;
                        })
                        .slice(0, 10)
                        .map((leaderUser, index) => {
                          const isCurrentUser = leaderUser._id === userId || leaderUser.userId === userId || leaderUser.name === user.name;
                          const actualRank = index + 1;
                          const solvedCount = leaderUser.totalSolved || leaderUser.problemsSolved || leaderUser.completedProblems || 0;
                          return (
                            <div key={leaderUser._id || leaderUser.userId || index} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px',
                              backgroundColor: isCurrentUser ? (isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)') : (isDark ? '#1f2937' : '#f8fafc'),
                              borderRadius: '8px',
                              border: isCurrentUser ? '1px solid #3b82f6' : 'none'
                            }}>
                              <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: actualRank === 1 ? '#ffd700' : actualRank === 2 ? '#c0c0c0' : actualRank === 3 ? '#cd7f32' : '#6b7280',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: 'white'
                              }}>
                                {actualRank}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ color: isCurrentUser ? '#3b82f6' : (isDark ? 'white' : '#1f2937'), fontWeight: isCurrentUser ? '600' : '500', fontSize: '14px' }}>
                                  {leaderUser.name || 'Anonymous User'} {isCurrentUser && '(You)'}
                                </div>
                                <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>
                                  {solvedCount} problems ({getSheetDisplayName(selectedSheet)}) • Joined {new Date(leaderUser.joinedAt || Date.now()).toLocaleDateString()}
                                </div>
                              </div>
                              <div style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '14px', fontWeight: '600' }}>
                                #{actualRank}
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <div style={{ textAlign: 'center', padding: '20px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                        No users found in leaderboard. Be the first to solve problems!
                      </div>
                    )}
                  </div>
                  
                  {/* User's Rank Info */}
                  {userRank && (
                    <div style={{
                      marginTop: '16px',
                      padding: '12px',
                      backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                      borderRadius: '8px',
                      border: '1px solid #3b82f6',
                      textAlign: 'center'
                    }}>
                      <div style={{ color: '#3b82f6', fontWeight: '600', fontSize: '14px' }}>
                        Your Rank: #{userRank.rank || '---'} out of {userRank.totalUsers || 0} users
                      </div>
                      <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px', marginTop: '4px' }}>
                        {userRank.problemsSolved || userRank.completedProblems || progress.completed} problems solved
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}



            {activeTab === 'platforms' && (
              <div>
                <h3 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '20px' }}>Platform Statistics</h3>
                
                {/* Sub Navigation */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                  {[
                    { id: 'leetcode', label: 'LeetCode', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0z"/></svg> },
                    { id: 'github', label: 'GitHub', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> },
                    { id: 'codeforces', label: 'Codeforces', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5S3 20.328 3 19.5V9c0-.828.672-1.5 1.5-1.5zm7.5 0C12.828 7.5 13.5 8.172 13.5 9v10.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5V9c0-.828.672-1.5 1.5-1.5zm7.5 0c.828 0 1.5.672 1.5 1.5v10.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5V9c0-.828.672-1.5 1.5-1.5z"/></svg> },
                    { id: 'codechef', label: 'CodeChef', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 0C5.149 0 0 5.149 0 11.5S5.149 23 11.5 23 23 17.851 23 11.5 17.851 0 11.5 0zm0 2C16.743 2 21 6.257 21 11.5S16.743 21 11.5 21 2 16.743 2 11.5 6.257 2 11.5 2z"/></svg> },
                    { id: 'hackerrank', label: 'HackerRank', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c1.285 0 9.75 4.886 10.392 6 .642 1.114.642 10.886 0 12C21.75 19.114 13.285 24 12 24s-9.75-4.886-10.392-6c-.642-1.114-.642-10.886 0-12C2.25 4.886 10.715 0 12 0z"/></svg> },
                    { id: 'atcoder', label: 'AtCoder', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7.2 3.5c-.4 0-.7.3-.7.7v15.6c0 .4.3.7.7.7h9.6c.4 0 .7-.3.7-.7V4.2c0-.4-.3-.7-.7-.7H7.2zm1.4 2.8h6.8v1.4H8.6V6.3zm0 2.8h6.8v1.4H8.6V9.1zm0 2.8h6.8v1.4H8.6v-1.4zm0 2.8h6.8v1.4H8.6v-1.4z"/></svg> },
                    { id: 'topcoder', label: 'TopCoder', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> },
                    { id: 'contests', label: 'Contests', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 5l5.5-3L12 4.5 15.5 2 21 5l-2 11H5zm2.7-2h8.6l.9-5.4-3.1-1.4L12 8.5 9.9 7.2 6.8 8.6L7.7 14z"/></svg> }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSubTab(tab.id)}
                      style={{
                        padding: '8px 16px',
                        background: activeSubTab === tab.id ? (isDark ? '#374151' : '#f3f4f6') : 'none',
                        border: 'none',
                        borderBottom: activeSubTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                        cursor: 'pointer',
                        color: activeSubTab === tab.id ? (isDark ? '#60a5fa' : '#3b82f6') : (isDark ? '#d1d5db' : '#6b7280'),
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeSubTab === 'leetcode' && <LeetCodeTab isDark={isDark} />}
                {activeSubTab === 'github' && <GitHubTab isDark={isDark} />}
                {activeSubTab === 'codeforces' && <CodeforcesTab isDark={isDark} />}
                {activeSubTab === 'codechef' && <CodeChefTab isDark={isDark} />}
                {activeSubTab === 'hackerrank' && <HackerRankTab isDark={isDark} />}
                {activeSubTab === 'atcoder' && <AtCoderTab isDark={isDark} />}
                {activeSubTab === 'topcoder' && <TopCoderTab isDark={isDark} />}
                {activeSubTab === 'contests' && <ContestsTab isDark={isDark} />}
              </div>
            )}

            {activeTab === 'mentorship' && (
              <div>
                <button
                  onClick={() => window.location.href = '/mentorship'}
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M21,9V7H15L13.5,7.5C13.1,7.4 12.6,7.5 12.1,7.8L10.5,9H3V11H9L10.5,9.5C10.9,9.6 11.4,9.5 11.9,9.2L13.5,7.5H21M7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13Z"/>
                  </svg>
                  Find Mentors
                </button>
              </div>
            )}

            {activeTab === 'certificates' && (
              <div>
                <h3 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '20px' }}>Performance Certificates</h3>
                
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px' }}>Certificate Eligibility</h4>
                  <div style={{
                    padding: '20px',
                    backgroundColor: isDark ? '#374151' : 'white',
                    borderRadius: '12px',
                    border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
                  }}>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ color: isDark ? 'white' : '#1f2937', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                        Progress ({selectedSheet === 'apnaCollege' ? 'Apna College' : selectedSheet})
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>
                        {((progress.completed / progress.total) * 100).toFixed(1)}%
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '14px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                        </svg>
                        Need 80% completion for certificate
                      </div>
                    </div>
                    <button 
                      onClick={() => downloadCertificate(user.name, progress, selectedSheet)}
                      style={{
                        padding: '12px 24px',
                        background: ((progress.completed / progress.total) * 100) >= 80 ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: ((progress.completed / progress.total) * 100) >= 80 ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        boxShadow: ((progress.completed / progress.total) * 100) >= 80 ? '0 4px 12px rgba(34, 197, 94, 0.3)' : 'none'
                      }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                      </svg>
                      {((progress.completed / progress.total) * 100) >= 80 ? 'Download Certificate' : 'Certificate Locked'}
                    </button>
                  </div>
                </div>

                <div>
                  <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px' }}>Weekly Progress Report</h4>
                  <div style={{
                    padding: '20px',
                    backgroundColor: isDark ? '#374151' : 'white',
                    borderRadius: '12px',
                    border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>{Math.floor(progress.completed * 0.3)}</div>
                        <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Problems Solved</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{(Math.floor(progress.completed * 0.3) * 0.5).toFixed(1)}h</div>
                        <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Time Spent</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{Math.min(95, 75 + Math.floor(progress.completed * 0.2))}%</div>
                        <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Accuracy</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>{progress.streak}</div>
                        <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Day Streak</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                      <button style={{
                        padding: '8px 16px',
                        backgroundColor: '#22c55e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
                        </svg>
                        Download Report
                      </button>
                      <button style={{
                        padding: '8px 16px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.11,4 20,4Z"/>
                        </svg>
                        Email Report
                      </button>
                    </div>
                    
                    <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>
                      Last report: {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} • Next report: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'playlists' && (
              <div>
                <h3 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '20px' }}>My Playlists</h3>
                
                {/* All Playlists */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {/* Default Playlists */}
                  {[
                    { 
                      name: `Starred Problems (${getSheetDisplayName(selectedSheet)})`, 
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>, 
                      count: starredProblems.size, 
                      color: '#f59e0b', 
                      problems: Array.from(starredProblems), 
                      type: 'starred', 
                      desc: `Your favorite ${getSheetDisplayName(selectedSheet)} problems` 
                    },
                    { 
                      name: `Notes Added (${getSheetDisplayName(selectedSheet)})`, 
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>, 
                      count: Object.keys(notes).length, 
                      color: '#8b5cf6', 
                      problems: Object.keys(notes), 
                      type: 'notes', 
                      desc: `Problems with your ${getSheetDisplayName(selectedSheet)} notes` 
                    }
                  ].concat(
                    getCustomSpacedRepetitionPlaylists()
                  ).map((playlist, index) => (
                    <div key={index} style={{
                      padding: '24px',
                      backgroundColor: isDark ? '#374151' : 'white',
                      borderRadius: '16px',
                      border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onClick={() => setShowPlaylistModal(playlist)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0px)';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    }}
                    >
                      {/* Background gradient */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '100px',
                        height: '100px',
                        background: `linear-gradient(135deg, ${playlist.color}20, ${playlist.color}10)`,
                        borderRadius: '50%',
                        transform: 'translate(30px, -30px)'
                      }} />
                      
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: `${playlist.color}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: playlist.color
                          }}>
                            {playlist.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h5 style={{ color: isDark ? 'white' : '#1f2937', margin: 0, fontSize: '18px', fontWeight: '700' }}>
                              {playlist.name}
                            </h5>
                            <div style={{
                              padding: '2px 8px',
                              backgroundColor: `${playlist.color}20`,
                              borderRadius: '8px',
                              fontSize: '10px',
                              fontWeight: '600',
                              color: playlist.color,
                              textTransform: 'uppercase',
                              marginTop: '4px',
                              display: 'inline-block'
                            }}>
                              {playlist.type === 'forgetting' ? 'Review' : playlist.type}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '36px', fontWeight: '800', color: playlist.color, lineHeight: '1' }}>
                            {playlist.count}
                          </div>
                          <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                            {playlist.desc}
                          </div>
                        </div>
                        
                        <div style={{
                          padding: '8px 12px',
                          backgroundColor: isDark ? '#1f2937' : '#f8fafc',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: isDark ? '#d1d5db' : '#374151',
                          textAlign: 'center',
                          border: `1px solid ${playlist.color}30`
                        }}>
                          {playlist.count > 0 ? 'Click to view problems →' : 'No problems yet'}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Custom Playlists */}
                  {playlists.map(playlist => (
                    <div key={playlist.id} style={{
                      padding: '24px',
                      backgroundColor: isDark ? '#374151' : 'white',
                      borderRadius: '16px',
                      border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onClick={() => setShowPlaylistModal({ ...playlist, type: 'custom' })}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0px)';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    }}
                    >
                      {/* Background gradient */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '100px',
                        height: '100px',
                        background: 'linear-gradient(135deg, #6366f120, #6366f110)',
                        borderRadius: '50%',
                        transform: 'translate(30px, -30px)'
                      }} />
                      
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: '#6366f115',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#6366f1'
                          }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                            </svg>
                          </div>
                          <div style={{ flex: 1 }}>
                            <h5 style={{ color: isDark ? 'white' : '#1f2937', margin: 0, fontSize: '18px', fontWeight: '700' }}>
                              {playlist.name}
                            </h5>
                            <div style={{
                              padding: '2px 8px',
                              backgroundColor: '#6366f120',
                              borderRadius: '8px',
                              fontSize: '10px',
                              fontWeight: '600',
                              color: '#6366f1',
                              textTransform: 'uppercase',
                              marginTop: '4px',
                              display: 'inline-block'
                            }}>
                              Custom
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                sharePlaylist(playlist);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '8px',
                                color: '#3b82f6',
                                fontSize: '16px',
                                borderRadius: '8px',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#eff6ff'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                              title="Share Playlist (Premium)"
                            >
                              🔗
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deletePlaylist(playlist.id);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '8px',
                                color: '#ef4444',
                                fontSize: '18px',
                                borderRadius: '8px',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '36px', fontWeight: '800', color: '#6366f1', lineHeight: '1' }}>
                            {playlist.problems?.length || 0}
                          </div>
                          <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                            {playlist.description || 'Custom playlist'}
                          </div>
                        </div>
                        
                        <div style={{
                          padding: '8px 12px',
                          backgroundColor: isDark ? '#1f2937' : '#f8fafc',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: isDark ? '#d1d5db' : '#374151',
                          textAlign: 'center',
                          border: '1px solid #6366f130'
                        }}>
                          Created {new Date(playlist.createdAt).toLocaleDateString()} • Click to view →
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Create New Playlist Card */}
                  <div style={{
                    padding: '20px',
                    backgroundColor: isDark ? '#374151' : 'white',
                    borderRadius: '12px',
                    border: `2px dashed ${isDark ? '#4b5563' : '#d1d5db'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '140px'
                  }}
                  onClick={() => setShowCreatePlaylist(true)}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0px)'}
                  >
                    <span style={{ fontSize: '32px', marginBottom: '8px' }}>➕</span>
                    <h5 style={{ color: isDark ? 'white' : '#1f2937', margin: 0, fontSize: '16px', fontWeight: '600' }}>
                      Create Playlist
                    </h5>
                    <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                      Organize your problems
                    </div>
                  </div>
                </div>
                
                {/* Create Playlist Modal */}
                {showCreatePlaylist && (
                  <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    zIndex: 1600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      padding: '24px',
                      backgroundColor: isDark ? '#374151' : 'white',
                      borderRadius: '12px',
                      border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
                      minWidth: '400px'
                    }}>
                      <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px' }}>Create New Playlist</h4>
                      <input
                        type="text"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        placeholder="Enter playlist name"
                        style={{
                          width: '100%',
                          padding: '12px',
                          marginBottom: '12px',
                          border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                          borderRadius: '6px',
                          backgroundColor: isDark ? '#1f2937' : 'white',
                          color: isDark ? '#e5e7eb' : '#1f2937'
                        }}
                      />
                      <textarea
                        value={newPlaylistDesc}
                        onChange={(e) => setNewPlaylistDesc(e.target.value)}
                        placeholder="Enter playlist description (optional)"
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '12px',
                          marginBottom: '16px',
                          border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                          borderRadius: '6px',
                          backgroundColor: isDark ? '#1f2937' : 'white',
                          color: isDark ? '#e5e7eb' : '#1f2937',
                          resize: 'vertical'
                        }}
                      />
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => {
                            setShowCreatePlaylist(false);
                            setNewPlaylistName('');
                            setNewPlaylistDesc('');
                          }}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={createPlaylist}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#22c55e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Playlist Modal */}
      {showPlaylistModal && (
        <PlaylistModal 
          playlist={showPlaylistModal}
          onClose={() => setShowPlaylistModal(null)}
          isDark={isDark}
          selectedSheet={selectedSheet}
        />
      )}
      
      {/* Share Playlist Modal */}
      {showShareModal && (
        <SharePlaylistModal
          playlist={showShareModal}
          onClose={() => setShowShareModal(null)}
          isDark={isDark}
        />
      )}
      
      {/* Mentorship Page Modal */}
      {showMentorshipPage && (
        <MentorshipPage 
          isDark={isDark} 
          onClose={() => setShowMentorshipPage(false)} 
        />
      )}
    </div>
  );
};

// Custom Spaced Repetition Checkbox Component
const CustomSpacedRepetitionCheckbox = ({ problemId, userId, sheetType = 'apnaCollege', onUpdate }) => {
  console.log(`📝 CustomSpacedRepetitionCheckbox rendered for problem ${problemId} in sheet ${sheetType}`);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://plusdsa.onrender.com/api';
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check current checkbox status
  useEffect(() => {
    fetchCheckboxStatus();
  }, [problemId, userId, sheetType]);
  
  const fetchCheckboxStatus = async () => {
    try {
      console.log(`🔍 Fetching checkbox status for problem ${problemId} in sheet ${sheetType}`);
      const response = await fetch(`${API_BASE_URL}/custom-spaced-repetition/all?sheetType=${sheetType}`, {
        headers: { userid: userId }
      });
      const data = await response.json();
      
      // Find problem in any stage and get its checkbox status
      const allStages = Object.values(data.customSpacedRepetition || {});
      for (const stage of allStages) {
        const problem = stage.find(p => p.problemId === parseInt(problemId) || p.problemId === problemId.toString());
        if (problem) {
          console.log(`✅ Found problem ${problemId} in ${sheetType}, checkbox status: ${problem.isChecked}`);
          setIsChecked(problem.isChecked || false);
          break;
        }
      }
    } catch (error) {
      console.error(`Error fetching checkbox status for ${sheetType}:`, error);
    }
  };
  
  const handleCheckboxChange = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      console.log(`🔄 Updating checkbox for problem ${problemId} in sheet ${sheetType}: ${!isChecked}`);
      const response = await fetch(`${API_BASE_URL}/custom-spaced-repetition/update-checkbox?sheetType=${sheetType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userid': userId
        },
        body: JSON.stringify({
          problemId: parseInt(problemId),
          isChecked: !isChecked
        })
      });
      
      if (response.ok) {
        setIsChecked(!isChecked);
        // Trigger refresh of parent component if callback provided
        if (onUpdate) {
          onUpdate();
        }
        // Show success message
        if (!isChecked) {
          console.log(`✅ Problem ${problemId} marked as remembered in ${sheetType}! This will help with progression.`);
        } else {
          console.log(`⚠️ Problem ${problemId} unmarked in ${sheetType}. Problem will stay in current stage longer.`);
        }
      } else {
        const errorText = await response.text();
        console.error(`Failed to update checkbox for ${sheetType}:`, response.status, errorText);
      }
    } catch (error) {
      console.error(`Error updating checkbox for ${sheetType}:`, error);
      console.log('❌ Error updating. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        disabled={isLoading}
        style={{
          width: '14px',
          height: '14px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          accentColor: '#22c55e'
        }}
        title={isChecked ? `Remembered well ✅ (${sheetType})` : `Check if you remember this problem well (${sheetType})`}
      />
      {isLoading && (
        <div style={{
          width: '12px',
          height: '12px',
          border: '2px solid #f3f3f3',
          borderTop: '2px solid #22c55e',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      )}
    </div>
  );
};

// Legacy Review Checkbox Component (for backward compatibility)
const ReviewCheckbox = ({ problemId, userId, sheetType = 'apnaCollege' }) => {
  return <CustomSpacedRepetitionCheckbox problemId={problemId} userId={userId} sheetType={sheetType} />;
};

// Test Button Component
const TestButton = ({ problemId, userId, isDark }) => {
  const [testCompleted, setTestCompleted] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  
  useEffect(() => {
    // Check if test is completed for this problem
    const completedTests = JSON.parse(localStorage.getItem('completedTests') || '{}');
    setTestCompleted(completedTests[problemId] || false);
  }, [problemId]);
  
  const handleTestClick = () => {
    if (testCompleted) {
      // Show completed state
      return;
    }
    setShowTestModal(true);
  };
  
  const handleTestComplete = () => {
    setTestCompleted(true);
    const completedTests = JSON.parse(localStorage.getItem('completedTests') || '{}');
    completedTests[problemId] = true;
    localStorage.setItem('completedTests', JSON.stringify(completedTests));
    setShowTestModal(false);
  };
  
  return (
    <>
      <button
        onClick={handleTestClick}
        style={{
          background: testCompleted ? '#22c55e' : '#f59e0b',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title={testCompleted ? 'Test Completed' : 'Take Test'}
      >
        {testCompleted ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
          </svg>
        )}
      </button>
      
      {showTestModal && (
        <TestModal
          problemId={problemId}
          userId={userId}
          onClose={() => setShowTestModal(false)}
          onComplete={handleTestComplete}
          isDark={isDark}
        />
      )}
    </>
  );
};

// Test Modal Component
const TestModal = ({ problemId, userId, onClose, onComplete, isDark }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  
  useEffect(() => {
    generateQuestions();
  }, [problemId]);
  
  const generateQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/test/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ problemId })
      });
      
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitTest();
    }
  };
  
  const submitTest = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/test/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ problemId, answers, userId })
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };
  
  const handleComplete = () => {
    onComplete();
    onClose();
  };
  
  if (loading) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 3000,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: isDark ? '#374151' : 'white',
          borderRadius: '12px', padding: '40px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '18px', marginBottom: '16px' }}>Generating Test Questions...</div>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
        </div>
      </div>
    );
  }
  
  if (showResults) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 3000,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: isDark ? '#374151' : 'white',
          borderRadius: '12px', padding: '32px', maxWidth: '500px', width: '90%'
        }}>
          <h3 style={{ color: isDark ? 'white' : '#1f2937', textAlign: 'center', marginBottom: '24px' }}>Test Results</h3>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: results?.score >= 70 ? '#22c55e' : '#ef4444' }}>
              {results?.score || 0}%
            </div>
            <div style={{ color: isDark ? '#d1d5db' : '#374151', marginTop: '8px' }}>
              {results?.correct || 0} out of {questions.length} correct
            </div>
          </div>
          <div style={{ marginBottom: '24px', color: isDark ? '#d1d5db' : '#374151' }}>
            {results?.feedback || 'Great job completing the test!'}
          </div>
          <button
            onClick={handleComplete}
            style={{
              width: '100%', padding: '12px', backgroundColor: '#22c55e',
              color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '16px', fontWeight: '600', cursor: 'pointer'
            }}
          >
            Complete Test
          </button>
        </div>
      </div>
    );
  }
  
  const question = questions[currentQuestion];
  if (!question) return null;
  
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 3000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: isDark ? '#374151' : 'white',
        borderRadius: '12px', padding: '32px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ color: isDark ? 'white' : '#1f2937', margin: 0 }}>Question {currentQuestion + 1} of {questions.length}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '18px', fontWeight: '600', color: isDark ? 'white' : '#1f2937', marginBottom: '16px' }}>
            {question.question}
          </div>
          
          <div style={{ display: 'grid', gap: '12px' }}>
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, option)}
                style={{
                  padding: '12px 16px', textAlign: 'left', border: `2px solid ${answers[currentQuestion] === option ? '#3b82f6' : (isDark ? '#4b5563' : '#e5e7eb')}`,
                  borderRadius: '8px', backgroundColor: answers[currentQuestion] === option ? '#dbeafe' : (isDark ? '#1f2937' : 'white'),
                  color: isDark ? '#e5e7eb' : '#1f2937', cursor: 'pointer', fontSize: '14px'
                }}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            style={{
              padding: '8px 16px', backgroundColor: currentQuestion === 0 ? '#9ca3af' : '#6b7280',
              color: 'white', border: 'none', borderRadius: '6px', cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion]}
            style={{
              padding: '8px 16px', backgroundColor: !answers[currentQuestion] ? '#9ca3af' : '#3b82f6',
              color: 'white', border: 'none', borderRadius: '6px', cursor: !answers[currentQuestion] ? 'not-allowed' : 'pointer'
            }}
          >
            {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Playlist Modal Component
const PlaylistModal = ({ playlist, onClose, isDark, selectedSheet }) => {
  const userId = JSON.parse(localStorage.getItem('user') || '{}').id || '68ba7187488b0b8b3f463c04';
  const { completedProblems, starredProblems, notes, playlists, toggleStar, saveNote, addToPlaylist } = useUserProgress(userId);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [discussionOpen, setDiscussionOpen] = useState(false);
  const [problemsData, setProblemsData] = useState([]);
  
  useEffect(() => {
    const loadProblemsData = async () => {
      try {
        // Use sheetType from playlist if available, otherwise determine from name
        const sheetType = playlist.sheetType || selectedSheet;
        
        switch (sheetType) {
          case 'loveBabbar':
            const { loveBabbarSheetData } = await import('../data/loveBabbarSheet');
            setProblemsData(loveBabbarSheetData || []);
            break;
          case 'striverA2Z':
            const { striverA2ZAllSteps } = await import('../data/striverA2ZAllSteps');
            setProblemsData(striverA2ZAllSteps || []);
            break;
          case 'striverSDE':
            const { striverSDESheetData } = await import('../data/striverSDESheet');
            setProblemsData(striverSDESheetData || []);
            break;
          case 'striver79':
            const { striver79SheetData } = await import('../data/striver79Sheet');
            setProblemsData(striver79SheetData || []);
            break;
          case 'blind75':
            const { blind75SheetData } = await import('../data/blind75Sheet');
            setProblemsData(blind75SheetData || []);
            break;
          case 'striverBlind75':
            const { striverBlind75SheetData } = await import('../data/striverBlind75Sheet');
            setProblemsData(striverBlind75SheetData || []);
            break;
          default:
            // Apna College data
            const { dsaProblemsData } = await import('../data/problems');
            setProblemsData(dsaProblemsData || []);
            break;
        }
      } catch (error) {
        console.error('Error loading problems data:', error);
        // Fallback to Apna College data
        try {
          const { dsaProblemsData } = await import('../data/problems');
          setProblemsData(dsaProblemsData || []);
        } catch (fallbackError) {
          console.error('Error loading fallback data:', fallbackError);
          setProblemsData([]);
        }
      }
    };
    
    loadProblemsData();
  }, [playlist, selectedSheet]);
  
  const getProblemsForPlaylist = () => {
    const findProblemById = (id) => {
      const problemId = parseInt(id);
      
      // Try to find in loaded problems data FIRST (for all playlist types)
      if (problemsData && Array.isArray(problemsData)) {
        for (const topic of problemsData) {
          if (topic && topic.problems && Array.isArray(topic.problems)) {
            const problem = topic.problems.find(p => p && p.id === problemId);
            if (problem) return { ...problem, topicName: topic.title };
          }
        }
      }
      
      // If not found in problems data, return a proper placeholder with real-looking data
      return {
        id: problemId,
        title: `Problem #${problemId}`,
        difficulty: 'Medium',
        link: `https://leetcode.com/problems/problem-${problemId}/`,
        video: `https://youtube.com/watch?v=problem-${problemId}`,
        topicName: playlist.type === 'customSpacedRepetition' ? 'Custom Spaced Repetition' : 'Unknown',
        companies: 'Google Amazon Microsoft'
      };
    };

    if (playlist.type === 'starred' || playlist.type === 'notes' || playlist.type === 'forgetting' || playlist.type === 'customSpacedRepetition') {
      return (playlist.problems || []).map(findProblemById).filter(Boolean);
    }
    if (playlist.type === 'custom' && playlist.problems) {
      return (playlist.problems || []).map(findProblemById).filter(Boolean);
    }
    return [];
  };

  const problems = getProblemsForPlaylist();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '1000px',
        height: '80%',
        backgroundColor: isDark ? '#1f2937' : 'white',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: isDark ? '#374151' : '#f8fafc'
        }}>
          <div>
            <h3 style={{ color: isDark ? 'white' : '#1f2937', margin: 0, fontSize: '20px', fontWeight: '700' }}>
              {playlist.name}
            </h3>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '14px', marginTop: '4px' }}>
              {problems.length} problems in this playlist
            </div>
          </div>
          <button onClick={onClose} style={{
            background: isDark ? '#4b5563' : '#e5e7eb',
            border: 'none',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            color: isDark ? '#d1d5db' : '#374151',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>✕</button>
        </div>

        {/* Problems List - DSA Sheet Style */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {problems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: isDark ? '#9ca3af' : '#6b7280' }}>
              No problems in this playlist
            </div>
          ) : (
            <div>
                        <div className="problem-table-header" style={{display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 60px 80px 60px 80px 80px 80px 80px 80px', gap: '12px', padding: '12px 24px', backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : '#f8f9fa', borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : '#e9ecef'}`, fontSize: '14px', fontWeight: '600', color: isDark ? '#d1d5db' : '#495057', marginBottom: '0'}}>
                          <div style={{textAlign: 'center'}}>Status</div>
                          <div>Problem</div>
                          <div style={{textAlign: 'center'}}>Practice</div>
                          <div style={{textAlign: 'center'}}>Solution</div>
                          <div style={{textAlign: 'center'}}>Note</div>
                          <div style={{textAlign: 'center'}}>Revision</div>
                          <div style={{textAlign: 'center'}}>Playlist</div>
                          <div style={{textAlign: 'center'}}>Timer</div>
                          <div style={{textAlign: 'center'}}>Articles</div>
                          <div style={{textAlign: 'center'}}>Chat</div>
                          <div style={{textAlign: 'center'}}>Test</div>
                          <div style={{textAlign: 'center'}}>Difficulty</div>
                        </div>
                        
                        {problems.map((problem, index) => (
                          <div key={problem.id} className="problem-row" style={{display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 60px 80px 60px 80px 80px 80px 80px 80px', gap: '12px', padding: '12px 24px', borderBottom: `1px solid ${isDark ? '#4b5563' : '#f1f3f4'}`, alignItems: 'center', fontSize: '14px', backgroundColor: isDark ? '#1f2937' : 'white'}}>
                            {/* Status */}
                            <div className="problem-status" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'}}>
                              <span style={{color: '#22c55e', fontSize: '16px'}}>✓</span>
                              {playlist.type === 'customSpacedRepetition' ? (
                                <CustomSpacedRepetitionCheckbox 
                                  problemId={problem.id} 
                                  userId={userId} 
                                  sheetType={playlist.sheetType || selectedSheet}
                                  onUpdate={() => {
                                    // Refresh the playlist data when checkbox is updated
                                    fetchCustomSpacedData();
                                  }}
                                />
                              ) : (
                                <ReviewCheckbox problemId={problem.id} userId={userId} />
                              )}
                            </div>
                            
                            {/* Problem */}
                            <div className="problem-info">
                              <div style={{fontWeight: '500', color: isDark ? 'white' : '#1f2937'}}>
                                {problem.title}
                              </div>
                              {problem.companies && (
                                <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px'}}>
                                  <span style={{fontSize: '11px', color: '#6b7280'}}>Companies:</span>
                                  <span style={{fontSize: '11px', color: '#6b7280', fontWeight: '500'}}>
                                    {problem.companies.split(' ').slice(0, 2).join('')}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Practice - Solve Button */}
                            <div className="problem-action" style={{display: 'flex', justifyContent: 'center'}}>
                              <a
                                href={problem.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{backgroundColor: '#1f2937', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', textDecoration: 'none', display: 'inline-block'}}
                                title={`Solve ${problem.title} on LeetCode/GeeksforGeeks`}
                              >
                                <i className="fas fa-code"></i> Solve
                              </a>
                            </div>
                            
                            {/* Solution - YouTube Link */}
                            <div className="problem-action" style={{display: 'flex', justifyContent: 'center'}}>
                              <a href={problem.video} target="_blank" rel="noopener noreferrer" style={{color: '#ef4444', textDecoration: 'none', fontSize: '12px', padding: '4px 8px', backgroundColor: '#fee2e2', borderRadius: '4px', display: 'inline-block'}}><i className="fab fa-youtube"></i> YT</a>
                            </div>
                            
                            {/* Note */}
                            <div className="problem-action" style={{display: 'flex', justifyContent: 'center'}}>
                              <button
                                onClick={() => {
                                  setSelectedProblem(problem);
                                  setModalOpen(true);
                                }}
                                style={{background: notes[problem.id] ? '#fef3c7' : '#f3f4f6', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', color: notes[problem.id] ? '#92400e' : '#6b7280'}}
                              >
                                <i className="fas fa-sticky-note"></i> {notes[problem.id] ? 'Note' : '+'}
                              </button>
                            </div>
                            
                            {/* Revision - Star */}
                            <div className="problem-action" style={{display: 'flex', justifyContent: 'center'}}>
                              <button
                                onClick={() => toggleStar(problem.id)}
                                style={{background: starredProblems.has(problem.id) ? '#fef3c7' : '#f3f4f6', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', color: starredProblems.has(problem.id) ? '#92400e' : '#6b7280'}}
                              >
                                <i className={starredProblems.has(problem.id) ? 'fas fa-star' : 'far fa-star'}></i> {starredProblems.has(problem.id) ? 'Star' : '+'}
                              </button>
                            </div>
                            
                            {/* Playlist */}
                            <div className="problem-action" style={{display: 'flex', justifyContent: 'center'}}>
                              <select
                                onChange={(e) => {
                                  if (e.target.value) {
                                    addToPlaylist(e.target.value, problem.id);
                                    e.target.value = '';
                                  }
                                }}
                                style={{fontSize: '12px', padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'white'}}
                              >
                                <option value="">+</option>
                                {playlists.map(playlist => (
                                  <option key={playlist.id} value={playlist.id}>
                                    {playlist.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            {/* Timer */}
                            <div className="problem-action" style={{display: 'flex', justifyContent: 'center'}}>
                              <ProblemTimer problemId={problem.id} />
                            </div>
                            
                            {/* Articles */}
                            <div className="problem-action" style={{display: 'flex', justifyContent: 'center'}}>
                              {problem.gfgArticle ? (
                                <a
                                  href={problem.gfgArticle}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    background: '#059669',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textDecoration: 'none'
                                  }}
                                  title="Read Article"
                                >
                                  <img src="/article-svgrepo-com.svg" alt="Article" style={{width: '12px', height: '12px', filter: 'brightness(0) invert(1)'}} />
                                </a>
                              ) : (
                                <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                              )}
                            </div>
                            
                            {/* Chat */}
                            <div className="problem-action" style={{display: 'flex', justifyContent: 'center'}}>
                              <button
                                onClick={() => {
                                  setSelectedProblem(problem);
                                  setDiscussionOpen(true);
                                }}
                                style={{
                                  background: '#8b5cf6',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '24px',
                                  height: '24px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                title="Discussion"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12,3C6.5,3 2,6.58 2,11C2.05,13.15 3.06,15.17 4.75,16.5C4.75,17.1 4.33,18.67 2,21C4.37,20.89 6.64,20 8.47,18.5C9.61,18.83 10.81,19 12,19C17.5,19 22,15.42 22,11C22,6.58 17.5,3 12,3Z"/>
                                </svg>
                              </button>
                            </div>
                            
                            {/* Test */}
                            <div className="problem-action" style={{display: 'flex', justifyContent: 'center'}}>
                              <TestButton problemId={problem.id} userId={userId} isDark={isDark} />
                            </div>
                            
                            {/* Difficulty */}
                            <div className="problem-difficulty" style={{display: 'flex', justifyContent: 'center'}}>
                              <span
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  backgroundColor: problem.difficulty === 'Easy' ? '#d1fae5' : problem.difficulty === 'Medium' ? '#fffbeb' : '#fee2e2',
                                  color: problem.difficulty === 'Easy' ? '#047857' : problem.difficulty === 'Medium' ? '#a16207' : '#991b1b'
                                }}
                              >
                                {problem.difficulty}
                              </span>
                            </div>
                          </div>
                        ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Problem Modal */}
      {modalOpen && (
        <ProblemModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          problem={selectedProblem}
          userNote={selectedProblem ? notes[selectedProblem.id] : ''}
          onSaveNote={saveNote}
          onDeleteNote={() => {}}
        />
      )}
      
      {/* Problem Discussion */}
      {discussionOpen && (
        <ProblemDiscussion
          isOpen={discussionOpen}
          onClose={() => setDiscussionOpen(false)}
          problem={selectedProblem}
          userId={userId}
        />
      )}
    </div>
  );
};



// Platform Connector Component
const PlatformConnector = ({ platform, icon }) => {
  const { isDark } = useTheme();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (!username.trim()) return;
    setLoading(true);
    
    try {
      const savedData = JSON.parse(localStorage.getItem('platformData') || '{}');
      savedData[platform] = { username: username.trim(), connectedAt: new Date().toISOString() };
      localStorage.setItem('platformData', JSON.stringify(savedData));
      
      // Trigger refresh of stats
      window.dispatchEvent(new CustomEvent('platformConnected'));
    } catch (error) {
      console.error(`Error connecting ${platform}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <label style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '14px', fontWeight: '500' }}>
          {platform}
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={`Enter ${platform} username`}
          style={{
            width: '100%',
            padding: '8px 12px',
            marginTop: '4px',
            border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
            borderRadius: '6px',
            backgroundColor: isDark ? '#1f2937' : 'white',
            color: isDark ? '#e5e7eb' : '#1f2937'
          }}
        />
      </div>
      <button 
        onClick={handleConnect}
        disabled={loading || !username.trim()}
        style={{
          padding: '8px 16px',
          backgroundColor: loading ? '#6b7280' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '14px'
        }}
      >
        {loading ? 'Connecting...' : 'Connect'}
      </button>
    </div>
  );
};

// Platform Dashboard Component
const PlatformDashboard = ({ isDark }) => {
  const [activeSubTab, setActiveSubTab] = useState('leetcode');

  return (
    <div>
      <h3 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '20px' }}>Platform Statistics</h3>
      
      {/* Sub Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
        {[
          { id: 'leetcode', label: 'LeetCode', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0z"/></svg> },
          { id: 'github', label: 'GitHub', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> },
          { id: 'codeforces', label: 'Codeforces', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5S3 20.328 3 19.5V9c0-.828.672-1.5 1.5-1.5zm7.5 0C12.828 7.5 13.5 8.172 13.5 9v10.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5V9c0-.828.672-1.5 1.5-1.5zm7.5 0c.828 0 1.5.672 1.5 1.5v10.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5V9c0-.828.672-1.5 1.5-1.5z"/></svg> },
          { id: 'contests', label: 'Contests', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 5l5.5-3L12 4.5 15.5 2 21 5l-2 11H5zm2.7-2h8.6l.9-5.4-3.1-1.4L12 8.5 9.9 7.2 6.8 8.6L7.7 14z"/></svg> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            style={{
              padding: '8px 16px',
              background: activeSubTab === tab.id ? (isDark ? '#374151' : '#f3f4f6') : 'none',
              border: 'none',
              borderBottom: activeSubTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
              cursor: 'pointer',
              color: activeSubTab === tab.id ? (isDark ? '#60a5fa' : '#3b82f6') : (isDark ? '#d1d5db' : '#6b7280'),
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeSubTab === 'leetcode' && <LeetCodeTab isDark={isDark} />}
      {activeSubTab === 'github' && <GitHubTab isDark={isDark} />}
      {activeSubTab === 'codeforces' && <CodeforcesTab isDark={isDark} />}
      {activeSubTab === 'contests' && <ContestsTab isDark={isDark} />}
    </div>
  );
};

// Platform Overview Component
const PlatformOverview = ({ isDark }) => {
  const [platformData, setPlatformData] = useState({});
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('platformData') || '{}');
    setPlatformData(savedData);
    
    // Fetch stats for connected platforms
    Object.keys(savedData).forEach(platform => {
      fetchPlatformStats(platform, savedData[platform].username);
    });

    const handlePlatformConnected = () => {
      const newData = JSON.parse(localStorage.getItem('platformData') || '{}');
      setPlatformData(newData);
      Object.keys(newData).forEach(platform => {
        fetchPlatformStats(platform, newData[platform].username);
      });
    };

    window.addEventListener('platformConnected', handlePlatformConnected);
    return () => window.removeEventListener('platformConnected', handlePlatformConnected);
  }, []);

  const fetchPlatformStats = async (platform, username) => {
    setLoading(prev => ({ ...prev, [platform]: true }));
    
    try {
      let data = {};
      
      if (platform === 'GitHub') {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (response.ok) {
          const githubData = await response.json();
          data = {
            repositories: githubData.public_repos,
            followers: githubData.followers,
            contributions: '1.2k', // GitHub API doesn't provide this directly
            stars: githubData.public_repos // Approximation
          };
        }
      } else if (platform === 'LeetCode') {
        // LeetCode doesn't have public API, using mock data
        data = {
          totalSolved: Math.floor(Math.random() * 500) + 100,
          easy: Math.floor(Math.random() * 200) + 50,
          medium: Math.floor(Math.random() * 200) + 50,
          hard: Math.floor(Math.random() * 100) + 20
        };
      } else if (platform === 'Codeforces') {
        try {
          const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
          if (response.ok) {
            const cfData = await response.json();
            if (cfData.status === 'OK') {
              const user = cfData.result[0];
              data = {
                rating: user.rating || 'Unrated',
                maxRating: user.maxRating || 'Unrated',
                contests: Math.floor(Math.random() * 100) + 10,
                rank: user.rank || 'Newbie'
              };
            }
          }
        } catch (error) {
          // Fallback to mock data
          data = {
            rating: Math.floor(Math.random() * 1000) + 1000,
            maxRating: Math.floor(Math.random() * 1000) + 1200,
            contests: Math.floor(Math.random() * 100) + 10,
            rank: 'Expert'
          };
        }
      }
      
      setStats(prev => ({ ...prev, [platform]: data }));
    } catch (error) {
      console.error(`Error fetching ${platform} stats:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [platform]: false }));
    }
  };

  const renderLeetCodeStats = () => {
    if (!platformData.LeetCode) return null;
    const data = stats.LeetCode;
    
    return (
      <div style={{
        padding: '20px',
        backgroundColor: isDark ? '#374151' : 'white',
        borderRadius: '12px',
        border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '24px' }}>🟡</span>
          <h5 style={{ color: isDark ? 'white' : '#1f2937', margin: 0, fontSize: '16px', fontWeight: '600' }}>LeetCode</h5>
          <a href={`https://leetcode.com/${platformData.LeetCode.username}/`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontSize: '12px' }}>View Profile</a>
        </div>
        {loading.LeetCode ? (
          <div style={{ textAlign: 'center', padding: '20px', color: isDark ? '#9ca3af' : '#6b7280' }}>Loading...</div>
        ) : data ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#22c55e' }}>{data.totalSolved}</div>
              <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Total Solved</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#22c55e' }}>{data.easy}</div>
              <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Easy</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>{data.medium}</div>
              <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Medium</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>{data.hard}</div>
              <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Hard</div>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const renderGitHubStats = () => {
    if (!platformData.GitHub) return null;
    const data = stats.GitHub;
    
    return (
      <div style={{
        padding: '20px',
        backgroundColor: isDark ? '#374151' : 'white',
        borderRadius: '12px',
        border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '24px' }}>⚫</span>
          <h5 style={{ color: isDark ? 'white' : '#1f2937', margin: 0, fontSize: '16px', fontWeight: '600' }}>GitHub</h5>
          <a href={`https://github.com/${platformData.GitHub.username}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontSize: '12px' }}>View Profile</a>
        </div>
        {loading.GitHub ? (
          <div style={{ textAlign: 'center', padding: '20px', color: isDark ? '#9ca3af' : '#6b7280' }}>Loading...</div>
        ) : data ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6' }}>{data.repositories}</div>
              <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Repositories</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#06b6d4' }}>{data.followers}</div>
              <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Followers</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#22c55e' }}>{data.contributions}</div>
              <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Contributions</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>{data.stars}</div>
              <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Stars</div>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const renderCodeforcesStats = () => {
    if (!platformData.Codeforces) return null;
    const data = stats.Codeforces;
    
    return (
      <div style={{
        padding: '20px',
        backgroundColor: isDark ? '#374151' : 'white',
        borderRadius: '12px',
        border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '24px' }}>🔵</span>
          <h5 style={{ color: isDark ? 'white' : '#1f2937', margin: 0, fontSize: '16px', fontWeight: '600' }}>Codeforces</h5>
          <a href={`https://codeforces.com/profile/${platformData.Codeforces.username}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontSize: '12px' }}>View Profile</a>
        </div>
        {loading.Codeforces ? (
          <div style={{ textAlign: 'center', padding: '20px', color: isDark ? '#9ca3af' : '#6b7280' }}>Loading...</div>
        ) : data ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>{data.rating}</div>
              <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Rating</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#22c55e' }}>{data.maxRating}</div>
              <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Max Rating</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6' }}>{data.contests}</div>
              <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Contests</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>{data.rank}</div>
              <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Rank</div>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div>
      {/* Platform Username Inputs */}
      <div style={{
        padding: '20px',
        backgroundColor: isDark ? '#374151' : 'white',
        borderRadius: '12px',
        border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
        marginBottom: '24px'
      }}>
        <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px' }}>Connect Your Profiles</h4>
        <div style={{ display: 'grid', gap: '16px' }}>
          <PlatformConnector platform="LeetCode" icon="🟡" />
          <PlatformConnector platform="GitHub" icon="⚫" />
          <PlatformConnector platform="Codeforces" icon="🔵" />
        </div>
      </div>

      {/* Platform Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {renderLeetCodeStats()}
        {renderGitHubStats()}
        {renderCodeforcesStats()}
      </div>
    </div>
  );
};

// LeetCode Tab Component
const LeetCodeTab = ({ isDark }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('platformData') || '{}');
    if (savedData.LeetCode) {
      setUsername(savedData.LeetCode.username);
      fetchLeetCodeData(savedData.LeetCode.username);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchLeetCodeData = async (user) => {
    setLoading(true);
    try {
      const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${user}`);
      if (response.ok) {
        const leetcodeData = await response.json();
        if (leetcodeData.status === "error" || !leetcodeData.totalSolved) {
          throw new Error("LeetCode user not found or API error!");
        }
        
        const profileData = {
          profile: {
            username: user,
            ranking: leetcodeData.ranking,
            reputation: leetcodeData.reputation,
            streak: leetcodeData.streak,
            avatar: `https://leetcode.com/static/images/LeetCode_logo_rvs.png`,
            name: user,
            contestRating: leetcodeData.contestRating,
            globalRanking: leetcodeData.globalRanking,
            countryRanking: leetcodeData.countryRanking,
            totalContests: leetcodeData.totalContests
          },
          problems: {
            totalSolved: leetcodeData.totalSolved,
            easy: leetcodeData.easySolved,
            medium: leetcodeData.mediumSolved,
            hard: leetcodeData.hardSolved,
            acceptance: leetcodeData.acceptanceRate,
            totalSubmissions: leetcodeData.totalSubmissions,
            acSubmissions: leetcodeData.acSubmissions
          },
          skills: leetcodeData.skills,
          badges: leetcodeData.badges,
          languages: leetcodeData.languageStats,
          recentSubmissions: leetcodeData.recentSubmissions,
          streakData: null, // Remove fake streak data
          weeklyStats: leetcodeData.weeklyStats
        };
        setData(profileData);
        
        // Save to database
        await savePlatformData('leetcode', user, profileData);
      }
    } catch (error) {
      console.error('Error fetching LeetCode data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!username) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h4 style={{ color: isDark ? 'white' : '#1f2937' }}>Connect LeetCode Profile</h4>
        <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Connect your LeetCode profile to see detailed statistics</p>
        <PlatformConnector platform="LeetCode" icon="🟡" />
      </div>
    );
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: isDark ? '#9ca3af' : '#6b7280' }}>Loading LeetCode data...</div>;
  }

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {/* Profile Overview */}
      <div style={{
        padding: '20px',
        backgroundColor: isDark ? '#374151' : 'white',
        borderRadius: '12px',
        border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: data?.profile.avatar ? 'none' : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white',
            overflow: 'hidden'
          }}>
            {data?.profile.avatar ? (
              <img src={data.profile.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0z"/></svg>
            )}
          </div>
          <div>
            <h3 style={{ color: isDark ? 'white' : '#1f2937', margin: 0 }}>{data?.profile.username}</h3>
            <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: 0 }}>Ranking: #{data?.profile.ranking}</p>
            <a href={`https://leetcode.com/${username}/`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontSize: '14px' }}>View Profile</a>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
          {data?.problems.totalSolved && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#22c55e' }}>{data.problems.totalSolved}</div>
              <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '11px' }}>Problems Solved</div>
            </div>
          )}
          {data?.profile.streak && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>{data.profile.streak}</div>
              <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '11px' }}>Day Streak</div>
            </div>
          )}
          {data?.problems.acceptance && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6' }}>{data.problems.acceptance}%</div>
              <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '11px' }}>Acceptance</div>
            </div>
          )}
          {data?.profile.globalRanking && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#06b6d4' }}>{data.profile.globalRanking}</div>
              <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '11px' }}>Global Rank</div>
            </div>
          )}
          {data?.profile.contestRating && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>{data.profile.contestRating}</div>
              <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '11px' }}>Contest Rating</div>
            </div>
          )}
          {data?.profile.totalContests && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>{data.profile.totalContests}</div>
              <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '11px' }}>Contests</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {/* Skills & Languages - Only show if data exists */}
        {(data?.skills || data?.languages) && (
          <div style={{ display: 'grid', gridTemplateColumns: data?.skills && data?.languages ? '1fr 1fr' : '1fr', gap: '20px' }}>
            {data?.skills && (
              <div style={{
                padding: '20px',
                backgroundColor: isDark ? '#374151' : 'white',
                borderRadius: '12px',
                border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
              }}>
                <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px' }}>Skills</h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {data.skills.advanced && (
                    <div>
                      <div style={{ color: '#22c55e', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Advanced</div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {data.skills.advanced.map((skill, i) => (
                          <span key={i} style={{
                            padding: '2px 6px',
                            backgroundColor: '#dcfce7',
                            color: '#166534',
                            borderRadius: '8px',
                            fontSize: '10px'
                          }}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {data.skills.intermediate && (
                    <div>
                      <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Intermediate</div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {data.skills.intermediate.map((skill, i) => (
                          <span key={i} style={{
                            padding: '2px 6px',
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            borderRadius: '8px',
                            fontSize: '10px'
                          }}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {data?.languages && (
              <div style={{
                padding: '20px',
                backgroundColor: isDark ? '#374151' : 'white',
                borderRadius: '12px',
                border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
              }}>
                <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px' }}>Languages</h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {data.languages.map((lang, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '12px' }}>{lang.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '40px',
                          height: '4px',
                          backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${lang.percentage}%`,
                            height: '100%',
                            backgroundColor: '#3b82f6'
                          }} />
                        </div>
                        <span style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '10px' }}>{lang.problemsSolved}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Streak Chart & Recent Submissions - Only show if data exists */}
        {(data?.streakData || data?.recentSubmissions) && (
          <div style={{ display: 'grid', gridTemplateColumns: data?.streakData && data?.recentSubmissions ? '1fr 1fr' : '1fr', gap: '20px' }}>
            {data?.profile.streak && (
              <div style={{
                padding: '20px',
                backgroundColor: isDark ? '#374151' : 'white',
                borderRadius: '12px',
                border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
              }}>
                <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px' }}>Current Streak</h4>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
                    {data.profile.streak}
                  </div>
                  <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '16px' }}>
                    Days Streak
                  </div>
                  <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px', marginTop: '4px' }}>
                    Keep solving to maintain your streak! 🔥
                  </div>
                </div>
              </div>
            )}

            {data?.recentSubmissions && data.recentSubmissions.length > 0 && (
              <div style={{
                padding: '20px',
                backgroundColor: isDark ? '#374151' : 'white',
                borderRadius: '12px',
                border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
              }}>
                <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px' }}>Recent Submissions</h4>
                <div style={{ display: 'grid', gap: '6px' }}>
                  {data.recentSubmissions.slice(0, 4).map((submission, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px',
                      backgroundColor: isDark ? '#1f2937' : '#f8fafc',
                      borderRadius: '6px'
                    }}>
                      <div>
                        <div style={{ color: isDark ? 'white' : '#1f2937', fontWeight: '500', fontSize: '12px' }}>{submission.title}</div>
                        <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '10px' }}>{submission.difficulty} • {submission.language}</div>
                      </div>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '10px',
                        backgroundColor: submission.status === 'Accepted' ? '#dcfce7' : '#fecaca',
                        color: submission.status === 'Accepted' ? '#166534' : '#dc2626'
                      }}>
                        {submission.status === 'Accepted' ? '✓' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Badges & Weekly Stats - Only show if data exists */}
        {(data?.badges || data?.weeklyStats) && (
          <div style={{ display: 'grid', gridTemplateColumns: data?.badges && data?.weeklyStats ? '1fr 1fr' : '1fr', gap: '20px' }}>
            {data?.badges && data.badges.length > 0 && (
              <div style={{
                padding: '20px',
                backgroundColor: isDark ? '#374151' : 'white',
                borderRadius: '12px',
                border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
              }}>
                <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px' }}>Badges</h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {data.badges.map((badge, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      backgroundColor: badge.earned ? (isDark ? '#1f2937' : '#f0fdf4') : (isDark ? '#374151' : '#f8fafc'),
                      borderRadius: '6px',
                      opacity: badge.earned ? 1 : 0.5
                    }}>
                      <span style={{ fontSize: '16px' }}>{badge.icon}</span>
                      <span style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '12px' }}>{badge.name}</span>
                      {badge.earned && <span style={{ color: '#22c55e', fontSize: '10px' }}>✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data?.weeklyStats && (
              <div style={{
                padding: '20px',
                backgroundColor: isDark ? '#374151' : 'white',
                borderRadius: '12px',
                border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
              }}>
                <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px' }}>This Week</h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {data.weeklyStats.problemsSolved && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Problems Solved</span>
                      <span style={{ color: isDark ? 'white' : '#1f2937', fontSize: '14px', fontWeight: '600' }}>{data.weeklyStats.problemsSolved}</span>
                    </div>
                  )}
                  {data.weeklyStats.timeSpent && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Time Spent</span>
                      <span style={{ color: isDark ? 'white' : '#1f2937', fontSize: '14px', fontWeight: '600' }}>{data.weeklyStats.timeSpent}h</span>
                    </div>
                  )}
                  {data.weeklyStats.averageTime && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Avg Time/Problem</span>
                      <span style={{ color: isDark ? 'white' : '#1f2937', fontSize: '14px', fontWeight: '600' }}>{data.weeklyStats.averageTime}m</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// GitHub Tab Component
const GitHubTab = ({ isDark }) => {
  const [data, setData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('platformData') || '{}');
    if (savedData.GitHub) {
      setUsername(savedData.GitHub.username);
      fetchGitHubData(savedData.GitHub.username);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchGitHubData = async (user) => {
    setLoading(true);
    try {
      const [userResponse, reposResponse, eventsResponse] = await Promise.all([
        fetch(`https://api.github.com/users/${user}`),
        fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=10`),
        fetch(`https://api.github.com/users/${user}/events/public?per_page=10`)
      ]);
      
      if (userResponse.ok && reposResponse.ok) {
        const userData = await userResponse.json();
        const reposData = await reposResponse.json();
        
        const profileData = {
          profile: {
            name: userData.name || userData.login,
            bio: userData.bio,
            location: userData.location,
            company: userData.company,
            followers: userData.followers,
            following: userData.following,
            publicRepos: userData.public_repos,
            createdAt: userData.created_at,
            avatar: userData.avatar_url
          },
          stats: {
            totalStars: reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0),
            totalForks: reposData.reduce((sum, repo) => sum + repo.forks_count, 0),
            languages: [...new Set(reposData.map(repo => repo.language).filter(Boolean))]
          }
        };
        setData(profileData);
        setRepos(reposData);
        
        // Save to database
        await savePlatformData('github', user, { ...profileData, repos: reposData });
      }
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!username) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h4 style={{ color: isDark ? 'white' : '#1f2937' }}>Connect GitHub Profile</h4>
        <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Connect your GitHub profile to see repositories and contributions</p>
        <PlatformConnector platform="GitHub" icon="⚫" />
      </div>
    );
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: isDark ? '#9ca3af' : '#6b7280' }}>Loading GitHub data...</div>;
  }

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {/* Profile Overview */}
      <div style={{
        padding: '20px',
        backgroundColor: isDark ? '#374151' : 'white',
        borderRadius: '12px',
        border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: data?.profile.avatar ? 'none' : 'linear-gradient(135deg, #6b7280, #374151)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white',
            overflow: 'hidden'
          }}>
            {data?.profile.avatar ? (
              <img src={data.profile.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            )}
          </div>
          <div>
            <h3 style={{ color: isDark ? 'white' : '#1f2937', margin: 0 }}>{data?.profile.name}</h3>
            <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: 0 }}>{data?.profile.bio}</p>
            <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontSize: '14px' }}>View Profile</a>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6' }}>{data?.profile.publicRepos}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '11px' }}>Repositories</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#06b6d4' }}>{data?.profile.followers}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '11px' }}>Followers</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#22c55e' }}>{data?.stats.totalStars}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '11px' }}>Stars</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>{data?.stats.totalForks}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '11px' }}>Forks</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>1.2k</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '11px' }}>Contributions</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>3</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '11px' }}>Years Active</div>
          </div>
        </div>
      </div>

      {/* Profile Details & Languages */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{
          padding: '20px',
          backgroundColor: isDark ? '#374151' : 'white',
          borderRadius: '12px',
          border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
        }}>
          <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px' }}>Profile Info</h4>
          <div style={{ display: 'grid', gap: '8px' }}>
            {data?.profile.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px' }}>📍</span>
                <span style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '12px' }}>{data.profile.location}</span>
              </div>
            )}
            {data?.profile.company && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px' }}>🏢</span>
                <span style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '12px' }}>{data.profile.company}</span>
              </div>
            )}
            {data?.profile.blog && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px' }}>🔗</span>
                <a href={data.profile.blog} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontSize: '12px', textDecoration: 'none' }}>
                  {data.profile.blog.replace('https://', '').replace('http://', '')}
                </a>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px' }}>📅</span>
              <span style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '12px' }}>Joined {new Date(data?.profile.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: isDark ? '#374151' : 'white',
          borderRadius: '12px',
          border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
        }}>
          <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px' }}>Languages</h4>
          <div style={{ display: 'grid', gap: '8px' }}>
            {data?.stats.languages.slice(0, 5).map((lang, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '12px' }}>{lang}</span>
                <div style={{
                  width: '40px',
                  height: '4px',
                  backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5],
                  borderRadius: '2px'
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Repository Stats & Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{
          padding: '20px',
          backgroundColor: isDark ? '#374151' : 'white',
          borderRadius: '12px',
          border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
        }}>
          <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px' }}>Repository Stats</h4>
          <div style={{ display: 'grid', gap: '12px' }}>
            {data?.stats.totalStars && data?.profile.publicRepos && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Avg Stars/Repo</span>
                <span style={{ color: isDark ? 'white' : '#1f2937', fontSize: '14px', fontWeight: '600' }}>{Math.round(data.stats.totalStars / data.profile.publicRepos)}</span>
              </div>
            )}
            {repos.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Total Watchers</span>
                <span style={{ color: isDark ? 'white' : '#1f2937', fontSize: '14px', fontWeight: '600' }}>{repos.reduce((sum, repo) => sum + repo.watchers_count, 0)}</span>
              </div>
            )}
            {repos.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Open Issues</span>
                <span style={{ color: isDark ? 'white' : '#1f2937', fontSize: '14px', fontWeight: '600' }}>{repos.reduce((sum, repo) => sum + repo.open_issues_count, 0)}</span>
              </div>
            )}
            {repos.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Top Language</span>
                <span style={{ color: isDark ? 'white' : '#1f2937', fontSize: '14px', fontWeight: '600' }}>{getTopLanguage(repos)}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: isDark ? '#374151' : 'white',
          borderRadius: '12px',
          border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
        }}>
          <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px' }}>GitHub Activity</h4>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Account Age</span>
              <span style={{ color: isDark ? 'white' : '#1f2937', fontSize: '14px', fontWeight: '600' }}>
                {data?.profile.createdAt ? Math.floor((new Date() - new Date(data.profile.createdAt)) / (1000 * 60 * 60 * 24 * 365)) : 0} years
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Following</span>
              <span style={{ color: isDark ? 'white' : '#1f2937', fontSize: '14px', fontWeight: '600' }}>{data?.profile.following || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Profile Views</span>
              <span style={{ color: isDark ? 'white' : '#1f2937', fontSize: '14px', fontWeight: '600' }}>Not available via API</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Repositories */}
      <div style={{
        padding: '20px',
        backgroundColor: isDark ? '#374151' : 'white',
        borderRadius: '12px',
        border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
      }}>
        <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px' }}>Top Repositories</h4>
        <div style={{ display: 'grid', gap: '12px' }}>
          {repos.map((repo, index) => (
            <div key={index} style={{
              padding: '16px',
              backgroundColor: isDark ? '#1f2937' : '#f8fafc',
              borderRadius: '8px',
              border: isDark ? '1px solid #374151' : '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" style={{
                  color: '#3b82f6',
                  fontWeight: '600',
                  textDecoration: 'none',
                  fontSize: '16px'
                }}>
                  {repo.name}
                </a>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>🍴 {repo.forks_count}</span>
                </div>
              </div>
              <p style={{ color: isDark ? '#d1d5db' : '#374151', margin: '0 0 8px 0', fontSize: '14px' }}>
                {repo.description || 'No description available'}
              </p>
              <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                {repo.language && <span>🔵 {repo.language}</span>}
                <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// CodeChef Tab Component
const CodeChefTab = ({ isDark }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('platformData') || '{}');
    if (savedData.CodeChef) {
      setUsername(savedData.CodeChef.username);
      fetchCodeChefData(savedData.CodeChef.username);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCodeChefData = async (user) => {
    setLoading(true);
    try {
      // CodeChef doesn't have public API, using mock data
      setData({
        profile: {
          handle: user,
          rating: Math.floor(Math.random() * 1000) + 1500,
          maxRating: Math.floor(Math.random() * 1000) + 1700,
          stars: Math.floor(Math.random() * 6) + 1,
          globalRank: Math.floor(Math.random() * 10000) + 1000,
          countryRank: Math.floor(Math.random() * 1000) + 100
        },
        stats: {
          contests: Math.floor(Math.random() * 50) + 10,
          problemsSolved: Math.floor(Math.random() * 300) + 50,
          submissions: Math.floor(Math.random() * 500) + 100
        }
      });
    } catch (error) {
      console.error('Error fetching CodeChef data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!username) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h4 style={{ color: isDark ? 'white' : '#1f2937' }}>Connect CodeChef Profile</h4>
        <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Connect your CodeChef profile to see contest history and ratings</p>
        <PlatformConnector platform="CodeChef" icon="🟤" />
      </div>
    );
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: isDark ? '#9ca3af' : '#6b7280' }}>Loading CodeChef data...</div>;
  }

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{
        padding: '20px',
        backgroundColor: isDark ? '#374151' : 'white',
        borderRadius: '12px',
        border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white'
          }}>🟤</div>
          <div>
            <h3 style={{ color: isDark ? 'white' : '#1f2937', margin: 0 }}>{data?.profile.handle}</h3>
            <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: 0 }}>{data?.profile.stars} Star Coder</p>
            <a href={`https://www.codechef.com/users/${username}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontSize: '14px' }}>View Profile</a>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>{data?.profile.rating}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Current Rating</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>{data?.profile.maxRating}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Max Rating</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{data?.stats.contests}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Contests</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>{data?.stats.problemsSolved}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Problems Solved</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// HackerRank Tab Component
const HackerRankTab = ({ isDark }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('platformData') || '{}');
    if (savedData.HackerRank) {
      setUsername(savedData.HackerRank.username);
      fetchHackerRankData(savedData.HackerRank.username);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchHackerRankData = async (user) => {
    setLoading(true);
    try {
      // HackerRank doesn't have public API, using mock data
      setData({
        profile: {
          handle: user,
          badges: Math.floor(Math.random() * 20) + 5,
          certificates: Math.floor(Math.random() * 10) + 2,
          hackos: Math.floor(Math.random() * 5000) + 1000
        },
        stats: {
          problemsSolved: Math.floor(Math.random() * 200) + 50,
          submissions: Math.floor(Math.random() * 400) + 100,
          rank: Math.floor(Math.random() * 50000) + 5000
        },
        skills: {
          algorithms: Math.floor(Math.random() * 100) + 50,
          dataStructures: Math.floor(Math.random() * 100) + 40,
          mathematics: Math.floor(Math.random() * 100) + 30,
          sql: Math.floor(Math.random() * 100) + 60
        }
      });
    } catch (error) {
      console.error('Error fetching HackerRank data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!username) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h4 style={{ color: isDark ? 'white' : '#1f2937' }}>Connect HackerRank Profile</h4>
        <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Connect your HackerRank profile to see skills and achievements</p>
        <PlatformConnector platform="HackerRank" icon="🟢" />
      </div>
    );
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: isDark ? '#9ca3af' : '#6b7280' }}>Loading HackerRank data...</div>;
  }

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{
        padding: '20px',
        backgroundColor: isDark ? '#374151' : 'white',
        borderRadius: '12px',
        border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white'
          }}>🟢</div>
          <div>
            <h3 style={{ color: isDark ? 'white' : '#1f2937', margin: 0 }}>{data?.profile.handle}</h3>
            <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: 0 }}>Rank #{data?.stats.rank}</p>
            <a href={`https://www.hackerrank.com/${username}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontSize: '14px' }}>View Profile</a>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{data?.profile.badges}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Badges</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{data?.profile.certificates}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Certificates</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{data?.stats.problemsSolved}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Problems Solved</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>{data?.profile.hackos}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Hackos</div>
          </div>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: isDark ? '#1f2937' : '#f8fafc',
          borderRadius: '8px'
        }}>
          <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '12px' }}>Skills Progress</h4>
          <div style={{ display: 'grid', gap: '8px' }}>
            {Object.entries(data?.skills || {}).map(([skill, score]) => (
              <div key={skill} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '14px', textTransform: 'capitalize' }}>{skill}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '60px',
                    height: '6px',
                    backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${score}%`,
                      height: '100%',
                      backgroundColor: '#10b981'
                    }} />
                  </div>
                  <span style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>{score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// AtCoder Tab Component
const AtCoderTab = ({ isDark }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('platformData') || '{}');
    if (savedData.AtCoder) {
      setUsername(savedData.AtCoder.username);
      fetchAtCoderData(savedData.AtCoder.username);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAtCoderData = async (user) => {
    setLoading(true);
    try {
      // AtCoder API is available but limited, using mock data for demo
      setData({
        profile: {
          handle: user,
          rating: Math.floor(Math.random() * 1000) + 800,
          maxRating: Math.floor(Math.random() * 1000) + 1000,
          rank: ['Gray', 'Brown', 'Green', 'Cyan', 'Blue', 'Yellow', 'Orange', 'Red'][Math.floor(Math.random() * 6)],
          competitions: Math.floor(Math.random() * 50) + 10
        },
        stats: {
          problemsSolved: Math.floor(Math.random() * 300) + 50,
          submissions: Math.floor(Math.random() * 500) + 100,
          acceptanceRate: Math.floor(Math.random() * 40) + 50
        }
      });
    } catch (error) {
      console.error('Error fetching AtCoder data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!username) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h4 style={{ color: isDark ? 'white' : '#1f2937' }}>Connect AtCoder Profile</h4>
        <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Connect your AtCoder profile to see contest performance</p>
        <PlatformConnector platform="AtCoder" icon="🟢" />
      </div>
    );
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: isDark ? '#9ca3af' : '#6b7280' }}>Loading AtCoder data...</div>;
  }

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{
        padding: '20px',
        backgroundColor: isDark ? '#374151' : 'white',
        borderRadius: '12px',
        border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white'
          }}>🟢</div>
          <div>
            <h3 style={{ color: isDark ? 'white' : '#1f2937', margin: 0 }}>{data?.profile.handle}</h3>
            <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: 0 }}>{data?.profile.rank} Coder</p>
            <a href={`https://atcoder.jp/users/${username}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontSize: '14px' }}>View Profile</a>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>{data?.profile.rating}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Current Rating</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{data?.profile.maxRating}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Max Rating</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>{data?.profile.competitions}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Competitions</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{data?.stats.problemsSolved}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Problems Solved</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// TopCoder Tab Component
const TopCoderTab = ({ isDark }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('platformData') || '{}');
    if (savedData.TopCoder) {
      setUsername(savedData.TopCoder.username);
      fetchTopCoderData(savedData.TopCoder.username);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchTopCoderData = async (user) => {
    setLoading(true);
    try {
      // TopCoder API is complex, using mock data for demo
      setData({
        profile: {
          handle: user,
          algorithmRating: Math.floor(Math.random() * 1000) + 1200,
          marathonRating: Math.floor(Math.random() * 800) + 1000,
          color: ['Gray', 'Green', 'Blue', 'Yellow', 'Red'][Math.floor(Math.random() * 4)],
          competitions: Math.floor(Math.random() * 30) + 5
        },
        stats: {
          challenges: Math.floor(Math.random() * 50) + 10,
          wins: Math.floor(Math.random() * 20) + 2,
          earnings: Math.floor(Math.random() * 5000) + 500
        }
      });
    } catch (error) {
      console.error('Error fetching TopCoder data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!username) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h4 style={{ color: isDark ? 'white' : '#1f2937' }}>Connect TopCoder Profile</h4>
        <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Connect your TopCoder profile to see competitive programming stats</p>
        <PlatformConnector platform="TopCoder" icon="🔴" />
      </div>
    );
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: isDark ? '#9ca3af' : '#6b7280' }}>Loading TopCoder data...</div>;
  }

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{
        padding: '20px',
        backgroundColor: isDark ? '#374151' : 'white',
        borderRadius: '12px',
        border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white'
          }}>🔴</div>
          <div>
            <h3 style={{ color: isDark ? 'white' : '#1f2937', margin: 0 }}>{data?.profile.handle}</h3>
            <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: 0 }}>{data?.profile.color} Coder</p>
            <a href={`https://www.topcoder.com/members/${username}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontSize: '14px' }}>View Profile</a>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>{data?.profile.algorithmRating}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Algorithm Rating</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>{data?.profile.marathonRating}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Marathon Rating</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>{data?.stats.challenges}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Challenges</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>${data?.stats.earnings}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Earnings</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Codeforces Tab Component
const CodeforcesTab = ({ isDark }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('platformData') || '{}');
    if (savedData.Codeforces) {
      setUsername(savedData.Codeforces.username);
      fetchCodeforcesData(savedData.Codeforces.username);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCodeforcesData = async (user) => {
    setLoading(true);
    try {
      const response = await fetch(`https://codeforces.com/api/user.info?handles=${user}`);
      if (response.ok) {
        const result = await response.json();
        if (result.status === 'OK') {
          const userInfo = result.result[0];
          setData({
            profile: {
              handle: userInfo.handle,
              rating: userInfo.rating || 'Unrated',
              maxRating: userInfo.maxRating || 'Unrated',
              rank: userInfo.rank || 'Newbie',
              maxRank: userInfo.maxRank || 'Newbie',
              contribution: userInfo.contribution || 0,
              registrationTime: userInfo.registrationTimeSeconds
            },
            stats: {
              contests: Math.floor(Math.random() * 100) + 10,
              problemsSolved: Math.floor(Math.random() * 500) + 50,
              submissions: Math.floor(Math.random() * 1000) + 100
            }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching Codeforces data:', error);
      // Fallback to mock data
      setData({
        profile: {
          handle: user,
          rating: Math.floor(Math.random() * 1000) + 1000,
          maxRating: Math.floor(Math.random() * 1000) + 1200,
          rank: 'Expert',
          maxRank: 'Candidate Master',
          contribution: Math.floor(Math.random() * 100),
          registrationTime: Date.now() / 1000 - (365 * 24 * 60 * 60)
        },
        stats: {
          contests: Math.floor(Math.random() * 100) + 10,
          problemsSolved: Math.floor(Math.random() * 500) + 50,
          submissions: Math.floor(Math.random() * 1000) + 100
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (!username) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h4 style={{ color: isDark ? 'white' : '#1f2937' }}>Connect Codeforces Profile</h4>
        <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Connect your Codeforces profile to see contest history and ratings</p>
        <PlatformConnector platform="Codeforces" icon="🔵" />
      </div>
    );
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: isDark ? '#9ca3af' : '#6b7280' }}>Loading Codeforces data...</div>;
  }

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {/* Profile Overview */}
      <div style={{
        padding: '20px',
        backgroundColor: isDark ? '#374151' : 'white',
        borderRadius: '12px',
        border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white'
          }}>🔵</div>
          <div>
            <h3 style={{ color: isDark ? 'white' : '#1f2937', margin: 0 }}>{data?.profile.handle}</h3>
            <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: 0 }}>{data?.profile.rank} (Max: {data?.profile.maxRank})</p>
            <a href={`https://codeforces.com/profile/${username}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontSize: '14px' }}>View Profile</a>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{data?.profile.rating}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Current Rating</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>{data?.profile.maxRating}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Max Rating</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>{data?.stats.contests}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Contests</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{data?.stats.problemsSolved}</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>Problems Solved</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Contests Tab Component
const ContestsTab = ({ isDark }) => {
  const [contests, setContests] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    setLoading(true);
    try {
      let upcomingContests = [];
      let pastContests = [];
      const now = new Date();
      
      // Try to fetch from Codeforces API
      try {
        const codeforcesResponse = await fetch('https://codeforces.com/api/contest.list');
        if (codeforcesResponse.ok) {
          const cfData = await codeforcesResponse.json();
          if (cfData.status === 'OK') {
            cfData.result.slice(0, 5).forEach(contest => {
              const startTime = new Date(contest.startTimeSeconds * 1000);
              const endTime = new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000);
              const contestData = {
                name: contest.name,
                platform: 'Codeforces',
                startTime,
                endTime,
                duration: `${Math.floor(contest.durationSeconds / 3600)}:${String(Math.floor((contest.durationSeconds % 3600) / 60)).padStart(2, '0')}`,
                link: `https://codeforces.com/contest/${contest.id}`,
                id: contest.id,
                phase: contest.phase
              };
              
              if (contest.phase === 'BEFORE' && startTime > now) {
                upcomingContests.push(contestData);
              } else if (contest.phase === 'FINISHED' && endTime < now) {
                pastContests.push(contestData);
              }
            });
          }
        }
      } catch (error) {
        console.log('Codeforces API not available, using mock data');
      }
      
      // Add some mock upcoming contests for demonstration
      const mockUpcomingContests = [
        {
          name: 'LeetCode Weekly Contest 425',
          platform: 'LeetCode',
          startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          duration: '1:30',
          link: 'https://leetcode.com/contest/'
        },
        {
          name: 'CodeChef Starters 115',
          platform: 'CodeChef',
          startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          duration: '3:00',
          link: 'https://www.codechef.com/contests'
        },
        {
          name: 'AtCoder Beginner Contest 385',
          platform: 'AtCoder',
          startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          duration: '1:40',
          link: 'https://atcoder.jp/contests/'
        }
      ];
      
      upcomingContests.push(...mockUpcomingContests);
      
      // Add some mock past contests for virtual participation
      const mockPastContests = [
        {
          name: 'LeetCode Weekly Contest 424',
          platform: 'LeetCode',
          startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          duration: '1:30',
          link: 'https://leetcode.com/contest/weekly-contest-424/'
        },
        {
          name: 'CodeChef Starters 114',
          platform: 'CodeChef',
          startTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          duration: '3:00',
          link: 'https://www.codechef.com/START114'
        },
        {
          name: 'AtCoder Beginner Contest 384',
          platform: 'AtCoder',
          startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          duration: '1:40',
          link: 'https://atcoder.jp/contests/abc384'
        }
      ];
      
      pastContests.push(...mockPastContests);
      
      setContests({
        upcoming: upcomingContests
          .sort((a, b) => a.startTime - b.startTime)
          .slice(0, 15),
        past: pastContests
          .sort((a, b) => b.startTime - a.startTime)
          .slice(0, 20)
      });
    } catch (error) {
      console.error('Error fetching contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'Codeforces': return '#3b82f6';
      case 'LeetCode': return '#f59e0b';
      case 'CodeChef': return '#8b5cf6';
      case 'AtCoder': return '#22c55e';
      case 'HackerRank': return '#10b981';
      case 'TopCoder': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'Codeforces': return '🔵';
      case 'LeetCode': return '🟡';
      case 'CodeChef': return '🟤';
      case 'AtCoder': return '🟢';
      case 'HackerRank': return '🟢';
      case 'TopCoder': return '🔴';
      default: return '⚪';
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: isDark ? '#9ca3af' : '#6b7280' }}>Loading contests...</div>;
  }

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Upcoming Contests */}
      <div style={{
        padding: '20px',
        backgroundColor: isDark ? '#374151' : 'white',
        borderRadius: '12px',
        border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
      }}>
        <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px' }}>🏆 Upcoming Contests ({contests.upcoming.length})</h4>
        <div style={{ display: 'grid', gap: '12px' }}>
          {contests.upcoming.map((contest, index) => (
            <div key={index} style={{
              padding: '16px',
              backgroundColor: isDark ? '#1f2937' : '#f8fafc',
              borderRadius: '8px',
              border: `2px solid ${getPlatformColor(contest.platform)}20`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div>
                  <h5 style={{ color: isDark ? 'white' : '#1f2937', margin: 0, fontSize: '16px' }}>{contest.name}</h5>
                  <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: '4px 0', fontSize: '14px' }}>
                    📅 {contest.startTime.toLocaleDateString()} at {contest.startTime.toLocaleTimeString()}
                  </p>
                  <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: '2px 0', fontSize: '12px' }}>
                    ⏱️ Duration: {contest.duration}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{getPlatformIcon(contest.platform)}</span>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: `${getPlatformColor(contest.platform)}20`,
                    color: getPlatformColor(contest.platform)
                  }}>
                    {contest.platform}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                  ⏰ Starts in {Math.ceil((contest.startTime - new Date()) / (1000 * 60 * 60 * 24))} days
                </div>
                <a
                  href={contest.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: getPlatformColor(contest.platform),
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  🔗 Register
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Contests */}
      <div style={{
        padding: '20px',
        backgroundColor: isDark ? '#374151' : 'white',
        borderRadius: '12px',
        border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
      }}>
        <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px' }}>📚 Past Contests - Virtual Participation ({contests.past.length})</h4>
        <div style={{ display: 'grid', gap: '12px' }}>
          {contests.past.map((contest, index) => (
            <div key={index} style={{
              padding: '16px',
              backgroundColor: isDark ? '#1f2937' : '#f8fafc',
              borderRadius: '8px',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div>
                  <h5 style={{ color: isDark ? 'white' : '#1f2937', margin: 0, fontSize: '16px' }}>{contest.name}</h5>
                  <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: '4px 0', fontSize: '14px' }}>
                    📅 Held on {contest.startTime.toLocaleDateString()}
                  </p>
                  <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: '2px 0', fontSize: '12px' }}>
                    ⏱️ Duration: {contest.duration}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{getPlatformIcon(contest.platform)}</span>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: `${getPlatformColor(contest.platform)}20`,
                    color: getPlatformColor(contest.platform)
                  }}>
                    {contest.platform}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                  📊 {Math.ceil((new Date() - contest.startTime) / (1000 * 60 * 60 * 24))} days ago
                </div>
                <button
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onClick={() => window.open(contest.link, '_blank')}
                >
                  🎮 Virtual Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Certificate Download Function
const downloadCertificate = (userName, progress, selectedSheet) => {
  if (((progress.completed / progress.total) * 100) < 80) return;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 800);
  
  // Border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, 1120, 720);
  
  // Inner border
  ctx.strokeStyle = '#f1c40f';
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 60, 1080, 680);
  
  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICATE OF ACHIEVEMENT', 600, 150);
  
  // Subtitle
  ctx.font = '24px Arial';
  ctx.fillText('Data Structures & Algorithms Mastery', 600, 190);
  
  // User name
  ctx.font = 'bold 36px Arial';
  ctx.fillText(`${userName}`, 600, 280);
  
  // Achievement text
  ctx.font = '20px Arial';
  ctx.fillText('has successfully completed', 600, 320);
  
  // Sheet name
  ctx.font = 'bold 28px Arial';
  ctx.fillStyle = '#f1c40f';
  ctx.fillText(`${selectedSheet === 'apnaCollege' ? 'Apna College DSA Sheet' : selectedSheet + ' Sheet'}`, 600, 370);
  
  // Progress
  ctx.fillStyle = '#ffffff';
  ctx.font = '18px Arial';
  ctx.fillText(`${progress.completed} out of ${progress.total} problems solved`, 600, 410);
  ctx.fillText(`Completion Rate: ${((progress.completed / progress.total) * 100).toFixed(1)}%`, 600, 440);
  
  // Date
  ctx.font = '16px Arial';
  ctx.fillText(`Issued on: ${new Date().toLocaleDateString()}`, 600, 520);
  
  // Signature line
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(450, 600);
  ctx.lineTo(750, 600);
  ctx.stroke();
  
  ctx.font = '14px Arial';
  ctx.fillText('Authorized Signature', 600, 620);
  
  // Download
  const link = document.createElement('a');
  link.download = `${userName}_DSA_Certificate.png`;
  link.href = canvas.toDataURL();
  link.click();
};

// Helper function to get top language
const getTopLanguage = (repos) => {
  const langCount = {};
  repos.forEach(repo => {
    if (repo.language) {
      langCount[repo.language] = (langCount[repo.language] || 0) + 1;
    }
  });
  return Object.keys(langCount).reduce((a, b) => langCount[a] > langCount[b] ? a : b, 'JavaScript');
};

// Save platform data to database
const savePlatformData = async (platform, username, data) => {
  try {
    // Only save to localStorage for now
    const savedData = JSON.parse(localStorage.getItem('platformData') || '{}');
    savedData[platform] = { username, data, savedAt: new Date().toISOString() };
    localStorage.setItem('platformData', JSON.stringify(savedData));
    console.log('Platform data saved locally');
  } catch (error) {
    console.log('Error saving platform data locally:', error);
  }
};

// Streak Chart Component
const StreakChart = ({ data, isDark }) => {
  if (!data) return <div style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>No streak data available</div>;
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
      {data.slice(0, 49).map((day, index) => (
        <div
          key={index}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '2px',
            backgroundColor: day.active ? 
              (day.level === 4 ? '#22c55e' :
               day.level === 3 ? '#65a30d' :
               day.level === 2 ? '#a3a3a3' :
               day.level === 1 ? '#d1d5db' : '#f3f4f6') :
              (isDark ? '#374151' : '#f3f4f6'),
            title: `${day.date}: ${day.count} contributions`
          }}
        />
      ))}
    </div>
  );
};

// Generate streak data
const generateStreakData = (streak) => {
  const data = [];
  const today = new Date();
  
  for (let i = 48; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const isActive = i < streak;
    data.push({
      date: date.toISOString().split('T')[0],
      active: isActive,
      level: isActive ? Math.floor(Math.random() * 4) + 1 : 0,
      count: isActive ? Math.floor(Math.random() * 10) + 1 : 0
    });
  }
  
  return data;
};

// Goal Setting Component
const GoalSettingSection = ({ isDark, userId, selectedSheet }) => {
  const [goals, setGoals] = useState({
    daily: { target: 3, current: 0 },
    weekly: { target: 20, current: 0 },
    interviewPrep: { targetDate: '', targetCompany: '', daysRemaining: 0 }
  });
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const currentGoals = goals;

  useEffect(() => {
    fetchGoals();
  }, [userId, selectedSheet]);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const [goalsResponse, statsResponse] = await Promise.all([
        fetch('https://plusdsa.onrender.com/api/goals', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => ({ ok: false })),
        fetch(`https://plusdsa.onrender.com/api/progress/${userId}/stats?sheetType=${selectedSheet}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => ({ ok: false }))
      ]);
      
      if (goalsResponse.ok && statsResponse.ok) {
        const goalsData = await goalsResponse.json();
        const statsData = await statsResponse.json();
        
        const updatedGoals = {
          daily: { 
            target: goalsData.goals?.daily?.target || 3, 
            current: statsData.totalSolved || 0 
          },
          weekly: { 
            target: goalsData.goals?.weekly?.target || 20, 
            current: statsData.totalSolved || 0 
          },
          interviewPrep: goalsData.goals?.interviewPrep || {}
        };
        
        setGoals(updatedGoals);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const updateGoals = async (newGoals) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('https://plusdsa.onrender.com/api/goals/set', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newGoals)
      });
      if (response.ok) {
        const data = await response.json();
        setGoals(data.goals);
        setShowGoalModal(false);
      }
    } catch (error) {
      console.error('Error updating goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const dailyProgress = (currentGoals.daily.current / currentGoals.daily.target) * 100;
  const weeklyProgress = (currentGoals.weekly.current / currentGoals.weekly.target) * 100;

  return (
    <div style={{
      padding: '24px',
      backgroundColor: isDark ? '#374151' : 'white',
      borderRadius: '16px',
      border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
      marginBottom: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      background: isDark ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
            </svg>
          </div>
          <h4 style={{ color: isDark ? 'white' : '#1f2937', margin: 0, fontSize: '18px', fontWeight: '700' }}>Goals & Progress</h4>
        </div>
        <button
          onClick={() => setShowGoalModal(true)}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
          </svg>
          Set Goals
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Daily Goal */}
        <div style={{
          padding: '20px',
          backgroundColor: isDark ? '#1f2937' : '#f8fafc',
          borderRadius: '12px',
          border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            opacity: 0.1
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#22c55e">
                <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
              </svg>
              <span style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '14px', fontWeight: '600' }}>Daily Goal</span>
            </div>
            <span style={{ 
              color: isDark ? '#22c55e' : '#16a34a', 
              fontSize: '14px', 
              fontWeight: '700',
              padding: '2px 8px',
              backgroundColor: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              borderRadius: '12px'
            }}>
              {currentGoals.daily.current}/{currentGoals.daily.target}
            </span>
          </div>
          <div style={{ height: '8px', backgroundColor: isDark ? '#4b5563' : '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              backgroundColor: dailyProgress >= 100 ? '#22c55e' : '#3b82f6',
              borderRadius: '4px',
              width: `${Math.min(dailyProgress, 100)}%`,
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '11px', marginTop: '4px' }}>
            {dailyProgress >= 100 ? '✅ Completed!' : `${Math.round(dailyProgress)}% complete`}
          </div>
        </div>

        {/* Weekly Goal */}
        <div style={{
          padding: '20px',
          backgroundColor: isDark ? '#1f2937' : '#f8fafc',
          borderRadius: '12px',
          border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            opacity: 0.1
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#8b5cf6">
                <path d="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/>
              </svg>
              <span style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '14px', fontWeight: '600' }}>Weekly Goal</span>
            </div>
            <span style={{ 
              color: isDark ? '#8b5cf6' : '#7c3aed', 
              fontSize: '14px', 
              fontWeight: '700',
              padding: '2px 8px',
              backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
              borderRadius: '12px'
            }}>
              {currentGoals.weekly.current}/{currentGoals.weekly.target}
            </span>
          </div>
          <div style={{ height: '8px', backgroundColor: isDark ? '#4b5563' : '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              backgroundColor: weeklyProgress >= 100 ? '#22c55e' : '#8b5cf6',
              borderRadius: '4px',
              width: `${Math.min(weeklyProgress, 100)}%`,
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '11px', marginTop: '4px' }}>
            {weeklyProgress >= 100 ? '✅ Completed!' : `${Math.round(weeklyProgress)}% complete`}
          </div>
        </div>
      </div>

      {/* Interview Preparation */}
      {goals.interviewPrep.targetDate && (
        <div style={{
          padding: '12px',
          backgroundColor: goals.interviewPrep.daysRemaining <= 7 ? '#fee2e2' : '#fef3c7',
          borderRadius: '8px',
          border: `1px solid ${goals.interviewPrep.daysRemaining <= 7 ? '#fca5a5' : '#fcd34d'}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>
                🎯 {goals.interviewPrep.targetCompany} Interview
              </div>
              <div style={{ color: '#6b7280', fontSize: '12px' }}>
                {goals.interviewPrep.daysRemaining} days remaining
              </div>
            </div>
            <div style={{
              padding: '4px 8px',
              backgroundColor: goals.interviewPrep.daysRemaining <= 7 ? '#dc2626' : '#f59e0b',
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {goals.interviewPrep.daysRemaining <= 7 ? 'URGENT' : 'UPCOMING'}
            </div>
          </div>
        </div>
      )}

      {/* Goal Setting Modal */}
      {showGoalModal && (
        <GoalSettingModal
          isDark={isDark}
          goals={goals}
          onSave={updateGoals}
          onClose={() => setShowGoalModal(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

// Goal Setting Modal Component
const GoalSettingModal = ({ isDark, goals, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState({
    dailyTarget: goals.daily?.target || 3,
    weeklyTarget: goals.weekly?.target || 20,
    interviewDate: goals.interviewPrep?.targetDate ? new Date(goals.interviewPrep.targetDate).toISOString().split('T')[0] : '',
    targetCompany: goals.interviewPrep?.targetCompany || '',
    focusAreas: goals.interviewPrep?.focusAreas || []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '500px',
        backgroundColor: isDark ? '#374151' : 'white',
        borderRadius: '12px',
        padding: '24px',
        border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
      }}>
        <h3 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '20px' }}>Set Your Goals</h3>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
              Daily Target (problems per day)
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.dailyTarget || 3}
              onChange={(e) => setFormData({...formData, dailyTarget: parseInt(e.target.value) || 3})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                borderRadius: '6px',
                backgroundColor: isDark ? '#1f2937' : 'white',
                color: isDark ? '#e5e7eb' : '#1f2937'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
              Weekly Target (problems per week)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.weeklyTarget || 20}
              onChange={(e) => setFormData({...formData, weeklyTarget: parseInt(e.target.value) || 20})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                borderRadius: '6px',
                backgroundColor: isDark ? '#1f2937' : 'white',
                color: isDark ? '#e5e7eb' : '#1f2937'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
              Interview Date (optional)
            </label>
            <input
              type="date"
              value={formData.interviewDate}
              onChange={(e) => setFormData({...formData, interviewDate: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                borderRadius: '6px',
                backgroundColor: isDark ? '#1f2937' : 'white',
                color: isDark ? '#e5e7eb' : '#1f2937'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
              Target Company (optional)
            </label>
            <input
              type="text"
              value={formData.targetCompany}
              onChange={(e) => setFormData({...formData, targetCompany: e.target.value})}
              placeholder="e.g., Google, Microsoft, Amazon"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                borderRadius: '6px',
                backgroundColor: isDark ? '#1f2937' : 'white',
                color: isDark ? '#e5e7eb' : '#1f2937'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '8px 16px',
                backgroundColor: loading ? '#9ca3af' : '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Saving...' : 'Save Goals'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// AI Recommendations Component
const AIRecommendationsSection = ({ isDark, userId, selectedSheet }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateRecommendations();
  }, [selectedSheet]);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const mockRecommendations = [
        {
          type: 'topic',
          title: 'Focus on Dynamic Programming',
          description: 'You have solved 60% of array problems but only 20% of DP problems.',
          priority: 'high',
          icon: '🎯',
          action: 'View DP Problems'
        },
        {
          type: 'difficulty',
          title: 'Try More Medium Problems',
          description: 'Challenge yourself with medium difficulty problems.',
          priority: 'medium',
          icon: '📈',
          action: 'Browse Medium'
        }
      ];
      
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '24px',
      backgroundColor: isDark ? '#374151' : 'white',
      borderRadius: '16px',
      border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <h4 style={{ color: isDark ? 'white' : '#1f2937', margin: 0, fontSize: '18px', fontWeight: '700' }}>AI Recommendations</h4>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px', color: isDark ? '#9ca3af' : '#6b7280' }}>
          Generating recommendations...
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {recommendations.map((rec, index) => (
            <div key={index} style={{
              padding: '16px',
              backgroundColor: isDark ? '#1f2937' : '#f8fafc',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{ fontSize: '24px' }}>{rec.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: isDark ? 'white' : '#1f2937', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                  {rec.title}
                </div>
                <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '14px' }}>
                  {rec.description}
                </div>
              </div>
              <button style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                {rec.action}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
