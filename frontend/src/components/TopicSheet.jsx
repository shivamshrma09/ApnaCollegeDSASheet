import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useUserProgress } from '../hooks/useUserProgress';
import ProblemModal from './ProblemModal';
import ProblemTimer from './ProblemTimer';
import ProblemDiscussion from './ProblemDiscussion';
import PlaylistManager from './PlaylistManager';
import Sidebar from './Sidebar';

import './DSASheet.css';

const TopicSheet = ({ topicData, onBack }) => {
  const { isDark, toggleTheme } = useTheme();
  const [expandedSections, setExpandedSections] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [discussionOpen, setDiscussionOpen] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || '64f8a1b2c3d4e5f6a7b8c9d0';
  };
  
  const userId = getUserId();
  const sheetType = `topic-${topicData.id}`;
  
  const {
    completedProblems,
    starredProblems,
    notes,
    playlists,
    toggleComplete,
    toggleStar,
    saveNote,
    deleteNote,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addToPlaylist
  } = useUserProgress(userId, sheetType);

  useEffect(() => {
    // Expand all sections by default
    const sections = {};
    topicData.sections.forEach((_, index) => {
      sections[index] = true;
    });
    setExpandedSections(sections);
  }, [topicData.id]);

  const handleToggleComplete = async (problemId) => {
    await toggleComplete(problemId);
  };

  const getTotalProblems = () => {
    return topicData.sections.reduce((total, section) => total + section.problems.length, 0);
  };

  const getTotalByDifficulty = (difficulty) => {
    return topicData.sections.reduce((total, section) => 
      total + section.problems.filter(p => p.difficulty === difficulty).length, 0
    );
  };

  const getCompletedByDifficulty = (difficulty) => {
    return topicData.sections.reduce((total, section) => 
      total + section.problems.filter(p => p.difficulty === difficulty && completedProblems.has(p.id)).length, 0
    );
  };

  const getRandomFilteredProblem = () => {
    let filteredProblems = topicData.sections.flatMap(section => section.problems);
    
    if (difficultyFilter !== 'All') {
      filteredProblems = filteredProblems.filter(p => p.difficulty === difficultyFilter);
    }
    if (companyFilter !== 'All') {
      filteredProblems = filteredProblems.filter(p => p.companies && p.companies.includes(companyFilter));
    }
    if (searchQuery) {
      filteredProblems = filteredProblems.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    if (filteredProblems.length === 0) {
      alert('No problems found with current filters');
      return;
    }
    
    const randomProblem = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];
    setSelectedProblem(randomProblem);
    setModalOpen(true);
  };

  const getCompanyLogos = (companiesArray) => {
    if (!companiesArray) return [];
    
    const companyMap = {
      'Amazon': { name: 'Amazon', domain: 'amazon.com' },
      'Google': { name: 'Google', domain: 'google.com' },
      'Microsoft': { name: 'Microsoft', domain: 'microsoft.com' },
      'Facebook': { name: 'Facebook', domain: 'facebook.com' },
      'Apple': { name: 'Apple', domain: 'apple.com' },
      'Netflix': { name: 'Netflix', domain: 'netflix.com' },
      'Uber': { name: 'Uber', domain: 'uber.com' },
      'Adobe': { name: 'Adobe', domain: 'adobe.com' }
    };
    
    return companiesArray.slice(0, 6).map(company => 
      companyMap[company] || { name: company, domain: `${company.toLowerCase()}.com` }
    );
  };

  // Filter problems
  const getFilteredSections = () => {
    return topicData.sections.map(section => {
      let filteredProblems = section.problems;
      
      if (difficultyFilter !== 'All') {
        filteredProblems = filteredProblems.filter(p => p.difficulty === difficultyFilter);
      }
      if (companyFilter !== 'All') {
        filteredProblems = filteredProblems.filter(p => p.companies && p.companies.includes(companyFilter));
      }
      if (searchQuery) {
        filteredProblems = filteredProblems.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      
      return { ...section, problems: filteredProblems };
    }).filter(section => section.problems.length > 0);
  };

  const toggleSection = (sectionIndex) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex]
    }));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#22c55e';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };



  return (
    <div className={`dsa-sheet-container ${isDark ? 'dark' : ''}`} style={{ 
      marginLeft: isMobile ? 0 : (sidebarCollapsed ? '20px' : '320px')
    }}>

      
      {/* Header - Complete Copy from DSASheet */}
      <div className="dsa-sheet-header">
        <div className="header-content">
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '16px',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
                </svg>
              </button>
            )}
            <div className="header-logo-link" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={onBack}>
              <img 
                src={isDark ? "/dark.png" : "/light.png"} 
                alt="DSA Sheet - Apna College" 
                className="logo" 
                style={{ 
                  height: isDark ? '45px' : '38px', 
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* All dropdowns from Header.jsx */}
              <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}
                onMouseLeave={() => {
                  setTimeout(() => {
                    const dropdown = document.querySelector('.dropdown-content');
                    if (dropdown && !dropdown.matches(':hover')) {
                      dropdown.style.display = 'none';
                    }
                  }, 300);
                }}>
                <button 
                  className="dropdown-btn"
                  style={{
                    backgroundColor: 'rgba(30, 144, 255, 0.2)',
                    border: 'none',
                    color: '#1E90FF',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onMouseEnter={(e) => {
                    const dropdown = e.target.nextElementSibling;
                    if (dropdown) dropdown.style.display = 'block';
                    e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(30, 144, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(30, 144, 255, 0.2)';
                  }}
                >
                  DSA Sheets
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7,10L12,15L17,10H7Z"/>
                  </svg>
                </button>
                <div 
                  className="dropdown-content"
                  style={{
                    display: 'none',
                    position: 'absolute',
                    backgroundColor: isDark ? '#1f2937' : 'white',
                    minWidth: '240px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    borderRadius: '12px',
                    border: isDark ? '1px solid #374151' : '1px solid #e2e8f0',
                    top: '100%',
                    left: '0',
                    marginTop: '8px',
                    padding: '8px 0'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.display = 'block';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.display = 'none';
                  }}
                >
                  <button onClick={() => window.location.href = '/sheet/apnaCollege'} style={{
                    color: isDark ? 'white' : '#1f2937',
                    padding: '12px 16px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderRadius: '8px',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = isDark ? '#4b5563' : '#f3f4f6';
                    e.target.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                  }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/>
                    </svg>
                    Apna College (373 Problems)
                  </button>
                  <button onClick={() => window.location.href = '/sheet/striverA2Z'} style={{
                    color: isDark ? '#e5e7eb' : '#374151',
                    padding: '10px 16px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderRadius: '8px',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9,5V9H15V5M9,19H15V15H9M9,14H15V10H9M4,9V5H8V9M4,19H8V15H4M4,14H8V10H4M20,5V9H16V5M20,19H16V15H20M20,14H16V10H20Z"/>
                    </svg>
                    Striver A2Z (455 Problems)
                  </button>
                  <button onClick={() => window.location.href = '/sheet/loveBabbar'} style={{
                    color: isDark ? '#e5e7eb' : '#374151',
                    padding: '10px 16px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderRadius: '8px',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
                    </svg>
                    Love Babbar (450 Problems)
                  </button>
                  <button onClick={() => window.location.href = '/sheet/blind75'} style={{
                    color: isDark ? '#e5e7eb' : '#374151',
                    padding: '10px 16px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderRadius: '8px',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,2L13.09,8.26L22,9L14,14L17,23L12,18L7,23L10,14L2,9L10.91,8.26L12,2Z"/>
                    </svg>
                    Blind 75 (75 Problems)
                  </button>
                </div>
              </div>

              {/* CP Dropdown */}
              <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
                <button 
                  className="dropdown-btn"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: isDark ? 'white' : '#1E90FF',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onMouseEnter={(e) => {
                    const dropdown = e.target.nextElementSibling;
                    if (dropdown) dropdown.style.display = 'block';
                    e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(30, 144, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  CP
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7,10L12,15L17,10H7Z"/>
                  </svg>
                </button>
                <div 
                  className="dropdown-content"
                  style={{
                    display: 'none',
                    position: 'absolute',
                    backgroundColor: isDark ? '#1f2937' : 'white',
                    minWidth: '240px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    borderRadius: '12px',
                    border: isDark ? '1px solid #374151' : '1px solid #e2e8f0',
                    top: '100%',
                    left: '0',
                    marginTop: '8px',
                    padding: '8px 0'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.display = 'block';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.display = 'none';
                  }}
                >
                  <button onClick={() => window.location.href = '/sheet/striverCP'} style={{
                    color: isDark ? '#e5e7eb' : '#374151',
                    padding: '10px 16px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderRadius: '8px',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z"/>
                    </svg>
                    Striver CP Sheet (298 Problems)
                  </button>
                </div>
              </div>

              {/* Company Wise Dropdown */}
              <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
                <button 
                  className="dropdown-btn"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: isDark ? 'white' : '#1E90FF',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onMouseEnter={(e) => {
                    const dropdown = e.target.nextElementSibling;
                    if (dropdown) dropdown.style.display = 'block';
                    e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(30, 144, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  Company Wise
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7,10L12,15L17,10H7Z"/>
                  </svg>
                </button>
                <div 
                  className="dropdown-content"
                  style={{
                    display: 'none',
                    position: 'absolute',
                    backgroundColor: isDark ? '#1f2937' : 'white',
                    minWidth: '240px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    borderRadius: '12px',
                    border: isDark ? '1px solid #374151' : '1px solid #e2e8f0',
                    top: '100%',
                    left: '0',
                    marginTop: '8px',
                    padding: '8px 0'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.display = 'block';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.display = 'none';
                  }}
                >
                  <button onClick={() => window.location.href = '/company/amazon'} style={{
                    color: isDark ? '#e5e7eb' : '#374151',
                    padding: '10px 16px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderRadius: '8px',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z"/>
                    </svg>
                    Amazon
                  </button>
                  <button onClick={() => window.location.href = '/company-wish-sheet'} style={{
                    color: isDark ? '#e5e7eb' : '#374151',
                    padding: '10px 16px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderRadius: '8px',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M9,17H7V10H9V17M13,17H11V7H13V17M17,17H15V13H17V17Z"/>
                    </svg>
                    All Companies
                  </button>
                </div>
              </div>

              {/* System Design Dropdown */}
              <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
                <button 
                  className="dropdown-btn"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: isDark ? 'white' : '#1E90FF',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onMouseEnter={(e) => {
                    const dropdown = e.target.nextElementSibling;
                    if (dropdown) dropdown.style.display = 'block';
                    e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(30, 144, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  System Design
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7,10L12,15L17,10H7Z"/>
                  </svg>
                </button>
                <div 
                  className="dropdown-content"
                  style={{
                    display: 'none',
                    position: 'absolute',
                    backgroundColor: isDark ? '#1f2937' : 'white',
                    minWidth: '240px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    borderRadius: '12px',
                    border: isDark ? '1px solid #374151' : '1px solid #e2e8f0',
                    top: '100%',
                    left: '0',
                    marginTop: '8px',
                    padding: '8px 0'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.display = 'block';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.display = 'none';
                  }}
                >
                  <button onClick={() => window.location.href = '/sheet/systemDesign'} style={{
                    color: isDark ? '#e5e7eb' : '#374151',
                    padding: '10px 16px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderRadius: '8px',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z"/>
                    </svg>
                    System Design Roadmap (70 Topics)
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <button 
              onClick={() => console.log('Code Editor')}
              style={{
                padding: '10px 14px',
                background: 'transparent',
                color: isDark ? 'white' : '#1E90FF',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(30, 144, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z"/>
              </svg>
              Code
            </button>

            <button 
              onClick={() => console.log('Chat')}
              style={{
                padding: '10px 14px',
                background: 'transparent',
                color: isDark ? 'white' : '#1E90FF',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(30, 144, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,3C6.5,3 2,6.58 2,11C2.05,13.15 3.06,15.17 4.75,16.5C4.75,17.1 4.33,18.67 2,21C4.37,20.89 6.64,20 8.47,18.5C9.61,18.83 10.81,19 12,19C17.5,19 22,15.42 22,11C22,6.58 17.5,3 12,3Z"/>
              </svg>
              Chat
            </button>
            <button 
              onClick={toggleTheme}
              style={{
                padding: '10px 14px',
                background: 'transparent',
                color: isDark ? 'white' : '#1E90FF',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(30, 144, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              {isDark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.4 6.35,17.41C9.37,20.43 14,20.54 17.33,17.97Z"/>
                </svg>
              )}
              {isDark ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
      </div>

      <main className="dsa-sheet-main">
        <section className="overview-section">
          <h1 className="main-title">
            <span>{topicData.title}</span>
          </h1>
          <p style={{fontSize: '16px', color: '#6b7280', marginBottom: '8px'}}>{topicData.description}</p>
          
          <div style={{backgroundColor: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '8px', padding: '16px', margin: '20px 0', fontSize: '14px', color: '#92400e'}}>
            <strong>Complete Learning Platform:</strong> Each problem includes practice links, detailed articles, video solutions, and company tags. Start solving problems to track your progress and master data structures and algorithms step by step.
          </div>
          
          <div style={{marginBottom: '24px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px'}}>
              <h3 style={{fontSize: '18px', fontWeight: '600'}}>Overview & Progress</h3>
            </div>
            
            <div style={{marginBottom: '16px'}}>
              <h4 style={{fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: isDark ? 'white' : '#1f2937'}}>
                {topicData.title} ({getTotalProblems()} Problems)
              </h4>
            <div style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', marginTop: '12px'}}>
              {completedProblems.size} / {getTotalProblems()}
            </div>
            <div style={{fontSize: '18px', color: '#3b82f6', marginBottom: '16px'}}>
              {Math.round((completedProblems.size / getTotalProblems()) * 100)}%
            </div>
            <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
              <div style={{textAlign: 'center'}}>
                <div style={{color: '#22c55e', fontWeight: 'bold'}}>Easy</div>
                <div style={{fontSize: '14px'}}>{getCompletedByDifficulty('Easy')} / {getTotalByDifficulty('Easy')} completed</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{color: '#f59e0b', fontWeight: 'bold'}}>Medium</div>
                <div style={{fontSize: '14px'}}>{getCompletedByDifficulty('Medium')} / {getTotalByDifficulty('Medium')} completed</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{color: '#ef4444', fontWeight: 'bold'}}>Hard</div>
                <div style={{fontSize: '14px'}}>{getCompletedByDifficulty('Hard')} / {getTotalByDifficulty('Hard')} completed</div>
              </div>
            </div>
            </div>
          </div>
          
          <div style={{display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center'}}>
            <input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '20px', minWidth: '200px'}}
            />

            <select 
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              style={{padding: '8px 12px', border: '1px solid #cbd1d9ff', borderRadius: '6px', cursor: 'pointer', backgroundColor: 'white'}}
            >
              <option value="All">All Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select 
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              style={{padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', backgroundColor: 'white'}}
            >
              <option value="All">All Companies</option>
              <option value="Amazon">Amazon</option>
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Facebook">Facebook</option>
              <option value="Apple">Apple</option>
              <option value="Netflix">Netflix</option>
              <option value="Uber">Uber</option>
              <option value="Adobe">Adobe</option>
            </select>

            <button
              onClick={getRandomFilteredProblem}
              style={{
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <img src="/random.svg" alt="Random" style={{width: '16px', height: '16px', filter: 'brightness(0) invert(1)'}} />
              Pick Random
            </button>
          </div>
        </section>

        <section className="topics-list">
          {getFilteredSections().map((section, sectionIndex) => {
            const solvedCount = section.problems.filter(p => completedProblems.has(p.id)).length;
            const isOpen = expandedSections[sectionIndex];
            
            return (
              <div key={sectionIndex} className="topic-card">
                <div
                  className="topic-header"
                  onClick={() => toggleSection(sectionIndex)}
                >
                  <div className="topic-title-container">
                    <svg
                      className={`expand-icon ${isOpen ? 'expanded' : ''}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                    </svg>
                    <h2 className="topic-title">
                      {section.title}
                    </h2>
                  </div>
                  <div className="topic-progress">
                    <span className="progress-text">
                      {solvedCount}/{section.problems.length}
                    </span>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${(section.problems.length > 0 ? (solvedCount / section.problems.length) * 100 : 0)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <div className="problem-list">
                    <div className="problem-table-header" style={{display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 60px 80px 60px 80px 80px 80px 80px 80px', gap: '12px', padding: '12px 24px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: '600', color: '#495057'}}>
                      <div>Status</div>
                      <div>Problem</div>
                      <div>Practice</div>
                      <div>Solution</div>
                      <div>Note</div>
                      <div>Revision</div>
                      <div>Playlist</div>
                      <div>Timer</div>
                      <div>Articles</div>
                      <div>Chat</div>
                      <div>Test</div>
                      <div>Difficulty</div>
                    </div>
                    
                    {section.problems.map((problem) => (
                      <div
                        key={problem.id}
                        className="problem-row"
                        data-problem-id={problem.id}
                        style={{display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 60px 80px 60px 80px 80px 80px 80px 80px', gap: '12px', padding: '12px 24px', borderBottom: '1px solid #f1f3f4', alignItems: 'center', fontSize: '14px', transition: 'background-color 0.3s ease'}}
                      >
                        {/* Status */}
                        <div className="problem-status" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                          <input
                            type="checkbox"
                            checked={completedProblems.has(problem.id)}
                            onChange={() => handleToggleComplete(problem.id)}
                            style={{width: '16px', height: '16px', cursor: 'pointer'}}
                          />
                          <button
                            onClick={() => handleToggleComplete(problem.id)}
                            style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px'}}
                          >
                            {completedProblems.has(problem.id) ? (
                              <span style={{color: '#22c55e'}}>✓</span>
                            ) : (
                              <span style={{color: '#ef4444'}}>○</span>
                            )}
                          </button>
                        </div>

                        
                        {/* Problem */}
                        <div className="problem-info">
                          <div style={{fontWeight: '500', color: completedProblems.has(problem.id) ? '#6b7280' : '#1f2937'}}>
                            {problem.title}
                          </div>
                          {problem.companies && (
                            <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px'}}>
                              <span style={{fontSize: '11px', color: '#6b7280'}}>Companies:</span>
                              <div style={{display: 'flex', gap: '4px'}}>
                                {getCompanyLogos(problem.companies).map((company, idx) => (
                                  <img 
                                    key={idx}
                                    src={`https://logo.clearbit.com/${company.domain}`}
                                    alt={company.name}
                                    style={{width: '16px', height: '16px', borderRadius: '2px', objectFit: 'contain'}}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Practice */}
                        <div className="problem-action" style={{textAlign: 'center'}}>
                          {problem.leetcode ? (
                            <a
                              href={problem.leetcode}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{backgroundColor: '#1f2937', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', textDecoration: 'none', display: 'inline-block'}}
                            >
                              <i className="fas fa-code"></i> Solve
                            </a>
                          ) : (
                            <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                          )}
                        </div>
                        
                        {/* Solution */}
                        <div className="problem-action" style={{textAlign: 'center'}}>
                          {problem.youtube ? (
                            <a href={problem.youtube} target="_blank" rel="noopener noreferrer" style={{color: '#ef4444', textDecoration: 'none', fontSize: '12px', padding: '4px 8px', backgroundColor: '#fee2e2', borderRadius: '4px', display: 'inline-block'}}><i className="fab fa-youtube"></i> YT</a>
                          ) : (
                            <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                          )}
                        </div>
                        
                        {/* Note */}
                        <div className="problem-action" style={{textAlign: 'center'}}>
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
                        
                        {/* Revision */}
                        <div className="problem-action" style={{textAlign: 'center'}}>
                          <button
                            onClick={() => toggleStar(problem.id)}
                            style={{background: starredProblems.has(problem.id) ? '#fef3c7' : '#f3f4f6', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', color: starredProblems.has(problem.id) ? '#92400e' : '#6b7280'}}
                          >
                            <i className={starredProblems.has(problem.id) ? 'fas fa-star' : 'far fa-star'}></i> {starredProblems.has(problem.id) ? 'Star' : '+'}
                          </button>
                        </div>
                        
                        {/* Playlist */}
                        <div className="problem-action" style={{textAlign: 'center'}}>
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
                        <div className="problem-action" style={{textAlign: 'center'}}>
                          <ProblemTimer problemId={problem.id} />
                        </div>
                        
                        {/* Articles */}
                        <div className="problem-action" style={{textAlign: 'center'}}>
                          {problem.gfg ? (
                            <a
                              href={problem.gfg}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                background: '#f3f4f6',
                                color: '#374151',
                                border: '1px solid #d1d5db',
                                borderRadius: '50%',
                                width: '28px',
                                height: '28px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textDecoration: 'none'
                              }}
                              title="GFG Article"
                            >
                              <img src="/article-svgrepo-com.svg" alt="Article" style={{width: '16px', height: '16px'}} />
                            </a>
                          ) : (
                            <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                          )}
                        </div>
                        
                        {/* Chat */}
                        <div className="problem-action" style={{textAlign: 'center'}}>
                          <button
                            onClick={() => {
                              setSelectedProblem(problem);
                              setDiscussionOpen(true);
                            }}
                            style={{
                              background: '#f3f4f6',
                              color: '#374151',
                              border: '1px solid #d1d5db',
                              borderRadius: '50%',
                              width: '28px',
                              height: '28px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Discussion"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12,3C6.5,3 2,6.58 2,11C2.05,13.15 3.06,15.17 4.75,16.5C4.75,17.1 4.33,18.67 2,21C4.37,20.89 6.64,20 8.47,18.5C9.61,18.83 10.81,19 12,19C17.5,19 22,15.42 22,11C22,6.58 17.5,3 12,3Z"/>
                            </svg>
                          </button>
                        </div>
                        
                        {/* Test */}
                        <div className="problem-action" style={{textAlign: 'center'}}>
                          <TestButton problemId={problem.id} userId={userId} isDark={isDark} problems={[{id: 1, problems: topicData.sections.flatMap(s => s.problems)}]} />
                        </div>
                        
                        {/* Difficulty */}
                        <div className="problem-difficulty" style={{textAlign: 'center'}}>
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
            );
          })}
        </section>
      </main>
      
      {/* Problem Modal */}
      <ProblemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        problem={selectedProblem}
        userNote={selectedProblem ? notes[selectedProblem.id] : ''}
        onSaveNote={saveNote}
        onDeleteNote={deleteNote}
      />
      
      {/* Problem Discussion */}
      <ProblemDiscussion
        isOpen={discussionOpen}
        onClose={() => setDiscussionOpen(false)}
        problem={selectedProblem}
        userId={userId}
      />
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={isMobile ? sidebarOpen : true} 
        onClose={() => setSidebarOpen(false)} 
        isMobile={isMobile}
        collapsed={!isMobile && sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenProfile={() => {}}
        onSheetChange={(type) => {
          if (type.startsWith('topic-')) {
            const topicType = type.replace('topic-', '');
            window.location.href = `/topic/${topicType}`;
          } else {
            window.location.href = `/sheet/${type}`;
          }
        }}
      />
      
      {/* Floating Expand Button */}
      {!isMobile && sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          style={{
            position: 'fixed',
            top: '20px',
            left: '90px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: isDark ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
            border: isDark ? '2px solid #4b5563' : '2px solid #e2e8f0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isDark ? '#60a5fa' : '#3b82f6'}>
            <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" style={{ transform: 'rotate(180deg)' }}/>
          </svg>
        </button>
      )}
    </div>
  );
};

// Test Button Component (same as DSASheet)
const TestButton = ({ problemId, userId, isDark, problems }) => {
  const [testCompleted, setTestCompleted] = useState(false);
  
  useEffect(() => {
    const completedTests = JSON.parse(localStorage.getItem('completedTests') || '{}');
    setTestCompleted(completedTests[problemId] || false);
  }, [problemId]);
  
  return (
    <button
      onClick={() => console.log('Test feature for topic sheets')}
      style={{
        background: testCompleted ? '#22c55e' : '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '28px',
        height: '28px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
      title={testCompleted ? 'Test Completed' : 'Take Test'}
    >
      {testCompleted ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
        </svg>
      )}
    </button>
  );
};

export default TopicSheet;