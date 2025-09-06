import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useUserProgress } from '../hooks/useUserProgress';
import { companyWiseQuestions } from '../data/companyWiseQuestions';
import ProblemModal from './ProblemModal';
import ProblemTimer from './ProblemTimer';

import ChatWidget from './ChatWidget';
import ProblemDiscussion from './ProblemDiscussion';
import Sidebar from './Sidebar';
import UserProfile from './UserProfile';
import PlaylistManager from './PlaylistManager';
import PlaylistSheet from './PlaylistSheet';
import Header from './Header';
import './DSASheet.css';

const CompanyWiseDSASheet = ({ onSheetChange }) => {
  const { companyId } = useParams();
  const { isDark, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');
  const [frequencyFilter, setFrequencyFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [discussionOpen, setDiscussionOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentView, setCurrentView] = useState('problems');
  const [playlistSheetOpen, setPlaylistSheetOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [randomMode, setRandomMode] = useState(false);
  const [currentRandomProblem, setCurrentRandomProblem] = useState(null);

  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || '64f8a1b2c3d4e5f6a7b8c9d0';
  };

  const userId = getUserId();
  const company = companyWiseQuestions[companyId];

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
  } = useUserProgress(userId, `company_${companyId}`);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    
    const autoCollapseTimer = setTimeout(() => {
      if (!isMobile) {
        setSidebarCollapsed(true);
      }
    }, 10000);
    
    setLoading(false);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(autoCollapseTimer);
    };
  }, [isMobile]);

  if (loading) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{width: '48px', height: '48px', border: '3px solid #e5e7eb', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto'}}></div>
          <p style={{marginTop: '16px', color: '#6b7280'}}>Loading Company Sheet...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb'}}>
        <div style={{textAlign: 'center'}}>
          <h2 style={{color: '#ef4444', marginBottom: '16px'}}>Company Not Found</h2>
          <p style={{color: '#6b7280'}}>The requested company sheet does not exist.</p>
        </div>
      </div>
    );
  }

  // Filter questions
  let filteredQuestions = company.questions;
  if (difficultyFilter !== 'All') {
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficultyFilter);
  }
  if (topicFilter !== 'All') {
    filteredQuestions = filteredQuestions.filter(q => q.topic === topicFilter);
  }
  if (frequencyFilter !== 'All') {
    filteredQuestions = filteredQuestions.filter(q => q.frequency === frequencyFilter);
  }
  if (searchQuery) {
    filteredQuestions = filteredQuestions.filter(q => 
      q.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
  });

  const getTotalByDifficulty = (difficulty) => {
    return company.questions.filter(q => q.difficulty === difficulty).length;
  };

  const getCompletedByDifficulty = (difficulty) => {
    return company.questions.filter(q => q.difficulty === difficulty && completedProblems.has(q.id)).length;
  };

  const getUniqueTopics = () => {
    return [...new Set(company.questions.map(q => q.topic))].sort();
  };

  const getUniqueFrequencies = () => {
    return [...new Set(company.questions.map(q => q.frequency))].sort();
  };

  const getRandomFilteredProblem = () => {
    let filteredProblems = company.questions;
    
    if (difficultyFilter !== 'All') {
      filteredProblems = filteredProblems.filter(p => p.difficulty === difficultyFilter);
    }
    if (topicFilter !== 'All') {
      filteredProblems = filteredProblems.filter(p => p.topic === topicFilter);
    }
    if (frequencyFilter !== 'All') {
      filteredProblems = filteredProblems.filter(p => p.frequency === frequencyFilter);
    }
    
    if (filteredProblems.length === 0) {
      alert('No problems found with current filters');
      return;
    }
    
    const randomProblem = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];
    setCurrentRandomProblem(randomProblem);
    setRandomMode(true);
  };

  const getNextRandomProblem = () => {
    getRandomFilteredProblem();
  };

  const exitRandomMode = () => {
    setRandomMode(false);
    setCurrentRandomProblem(null);
  };

  return (
    <div className={`dsa-sheet-container ${isDark ? 'dark' : ''}`} style={{ marginLeft: isMobile ? 0 : (sidebarCollapsed ? '20px' : '320px') }}>

      
      {/* Header Component */}
      <Header 
        currentSheet={`company_${companyId}`}
        onSheetChange={onSheetChange}
        isMobile={isMobile}
        onSidebarOpen={() => setSidebarOpen(true)}
        onCodeEditor={() => {}}
        onChat={() => {}}
        showChat={false}
        customTitle={company ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            marginLeft: '12px'
          }}>
            <div style={{width: '20px', height: '20px', display: 'flex', alignItems: 'center'}}>
              <img 
                src={company.logo} 
                alt={`${company.name} logo`} 
                style={{width: '20px', height: '20px', objectFit: 'contain'}}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
              <span 
                style={{fontSize: '20px', display: 'none'}}
              >
                {company.emoji || company.name.charAt(0)}
              </span>
            </div>
            <span style={{color: 'white', fontWeight: '600'}}>{company.name}</span>
          </div>
        ) : null}
      />

      <main className="dsa-sheet-main">
        <section className="overview-section">
          <h1 className="main-title" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div style={{width: '24px', height: '24px', display: 'flex', alignItems: 'center'}}>
              <img 
                src={company.logo} 
                alt={`${company.name} logo`} 
                style={{width: '24px', height: '24px', objectFit: 'contain'}}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
              <span 
                style={{fontSize: '24px', display: 'none'}}
              >
                {company.emoji || company.name.charAt(0)}
              </span>
            </div>
            <span>{company.name} DSA Questions - {company.questions.length} Problems</span>
          </h1>
          <p style={{fontSize: '16px', color: '#6b7280', marginBottom: '8px'}}>
            Complete collection of {company.questions.length} DSA problems frequently asked by {company.name}. 
            Practice company-specific questions to ace your interview.
          </p>
          <a href="#" style={{color: '#3b82f6', fontSize: '14px', textDecoration: 'none'}}>Know More</a>
          
          <div style={{backgroundColor: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '8px', padding: '16px', margin: '20px 0', fontSize: '14px', color: '#92400e'}}>
            <strong>Complete Learning Platform:</strong> Each problem includes practice links, detailed articles, video solutions, and company tags. Start solving problems to track your progress and master data structures and algorithms step by step.
          </div>
          
          <div style={{marginBottom: '24px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px'}}>
              <h3 style={{fontSize: '18px', fontWeight: '600'}}>Overview & Progress</h3>
            </div>
            
            <div style={{marginBottom: '16px'}}>
              <h4 style={{fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: isDark ? 'white' : '#1f2937'}}>
                {company.name} Questions ({company.questions.length} Problems)
              </h4>
              <div style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', marginTop: '12px'}}>
                {completedProblems.size} / {company.questions.length}
              </div>
              <div style={{fontSize: '18px', color: company.color, marginBottom: '16px'}}>
                {Math.round((completedProblems.size / company.questions.length) * 100)}%
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
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              style={{padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', backgroundColor: 'white'}}
            >
              <option value="All">All Topics</option>
              {getUniqueTopics().map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>

            <select 
              value={frequencyFilter}
              onChange={(e) => setFrequencyFilter(e.target.value)}
              style={{padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', backgroundColor: 'white'}}
            >
              <option value="All">All Frequency</option>
              {getUniqueFrequencies().map(freq => (
                <option key={freq} value={freq}>{freq}</option>
              ))}
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

        {randomMode ? (
          <section className="random-problem-section">
            <div style={{
              backgroundColor: isDark ? '#1f2937' : 'white',
              border: `2px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
              borderRadius: '8px',
              padding: '0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '24px 24px 0 24px'}}>
                <button
                  onClick={exitRandomMode}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: isDark ? '#374151' : '#6b7280',
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
                  ← Back to Sheet
                </button>
                <h2 style={{fontSize: '24px', fontWeight: '600', color: isDark ? 'white' : '#030405ff', margin: 0}}>Random Problem</h2>
                <button
                  onClick={getNextRandomProblem}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: isDark ? '#10b981' : '#10b981',
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
                  Next Random
                </button>
              </div>

              {currentRandomProblem && (
                <div>
                  <div className="problem-table-header" style={{display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 60px 80px 60px 80px 80px 80px 80px 80px', gap: '12px', padding: '12px 24px', backgroundColor: isDark ? 'rgba(77, 6, 6, 0.1)' : '#f8f9fa', borderBottom: `1px solid ${isDark ? '#4b5563' : '#e9ecef'}`, fontSize: '14px', fontWeight: '600', color: isDark ? '#d1d5db' : '#495057'}}>
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
                    <div>Difficulty</div>
                    <div>Frequency</div>
                  </div>
                  
                  <div className="problem-row" style={{display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 60px 80px 60px 80px 80px 80px 80px 80px', gap: '12px', padding: '12px 24px', borderBottom: `1px solid ${isDark ? '#4b5563' : '#f1f3f4'}`, alignItems: 'center', fontSize: '14px', backgroundColor: isDark ? '#4b5563' : 'white'}}>
                    {/* Status */}
                    <div className="problem-status" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                      <input
                        type="checkbox"
                        checked={completedProblems.has(currentRandomProblem.id)}
                        onChange={() => toggleComplete(currentRandomProblem.id)}
                        style={{width: '16px', height: '16px', cursor: 'pointer'}}
                      />
                      <button
                        onClick={() => toggleComplete(currentRandomProblem.id)}
                        style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px'}}
                      >
                        {completedProblems.has(currentRandomProblem.id) ? (
                          <span style={{color: '#22c55e'}}>✓</span>
                        ) : (
                          <span style={{color: '#ef4444'}}>○</span>
                        )}
                      </button>
                    </div>
                    
                    {/* Problem */}
                    <div className="problem-info">
                      <div style={{fontWeight: '500', color: completedProblems.has(currentRandomProblem.id) ? '#6b7280' : (isDark ? 'white' : '#1f2937')}}>
                        {currentRandomProblem.title}
                      </div>
                      <div style={{fontSize: '12px', color: '#6b7280', marginTop: '2px'}}>
                        Topic: {currentRandomProblem.topic}
                      </div>
                    </div>
                    
                    {/* Practice */}
                    <div className="problem-action" style={{textAlign: 'center'}}>
                      <a
                        href={currentRandomProblem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{backgroundColor: 'rgba(19, 2, 2, 0.1)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', textDecoration: 'none', display: 'inline-block'}}
                      >
                        <i className="fas fa-code"></i> Solve
                      </a>
                    </div>
                    
                    {/* Solution */}
                    <div className="problem-action" style={{textAlign: 'center'}}>
                      <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                    </div>
                    
                    {/* Note */}
                    <div className="problem-action" style={{textAlign: 'center'}}>
                      <button
                        onClick={() => {
                          setSelectedProblem(currentRandomProblem);
                          setModalOpen(true);
                        }}
                        style={{background: notes[currentRandomProblem.id] ? '#fef3c7' : (isDark ? '#374151' : '#f3f4f6'), border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`, cursor: 'pointer', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', color: notes[currentRandomProblem.id] ? '#92400e' : (isDark ? '#d1d5db' : '#6b7280')}}
                      >
                        <i className="fas fa-sticky-note"></i> {notes[currentRandomProblem.id] ? 'Note' : '+'}
                      </button>
                    </div>
                    
                    {/* Revision */}
                    <div className="problem-action" style={{textAlign: 'center'}}>
                      <button
                        onClick={() => toggleStar(currentRandomProblem.id)}
                        style={{background: starredProblems.has(currentRandomProblem.id) ? '#fef3c7' : (isDark ? '#374151' : '#f3f4f6'), border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`, cursor: 'pointer', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', color: starredProblems.has(currentRandomProblem.id) ? '#92400e' : (isDark ? '#d1d5db' : '#6b7280')}}
                      >
                        <i className={starredProblems.has(currentRandomProblem.id) ? 'fas fa-star' : 'far fa-star'}></i> {starredProblems.has(currentRandomProblem.id) ? 'Star' : '+'}
                      </button>
                    </div>
                    
                    {/* Playlist */}
                    <div className="problem-action" style={{textAlign: 'center'}}>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            addToPlaylist(e.target.value, currentRandomProblem.id);
                            e.target.value = '';
                          }
                        }}
                        style={{fontSize: '12px', padding: '4px 8px', border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`, borderRadius: '4px', cursor: 'pointer', backgroundColor: isDark ? '#374151' : 'white', color: isDark ? '#d1d5db' : 'inherit'}}
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
                      <ProblemTimer problemId={currentRandomProblem.id} />
                    </div>
                    
                    {/* Articles */}
                    <div className="problem-action" style={{textAlign: 'center'}}>
                      <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                    </div>
                    
                    {/* Chat */}
                    <div className="problem-action" style={{textAlign: 'center'}}>
                      <button
                        onClick={() => {
                          setSelectedProblem(currentRandomProblem);
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
                    
                    {/* Difficulty */}
                    <div className="problem-difficulty" style={{textAlign: 'center'}}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: currentRandomProblem.difficulty === 'Easy' ? '#d1fae5' : currentRandomProblem.difficulty === 'Medium' ? '#fffbeb' : '#fee2e2',
                          color: currentRandomProblem.difficulty === 'Easy' ? '#047857' : currentRandomProblem.difficulty === 'Medium' ? '#a16207' : '#991b1b'
                        }}
                      >
                        {currentRandomProblem.difficulty}
                      </span>
                    </div>

                    {/* Frequency */}
                    <div className="problem-frequency" style={{textAlign: 'center'}}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: currentRandomProblem.frequency === 'Very High' ? '#fee2e2' : currentRandomProblem.frequency === 'High' ? '#fffbeb' : currentRandomProblem.frequency === 'Medium' ? '#f0f9ff' : '#f3f4f6',
                          color: currentRandomProblem.frequency === 'Very High' ? '#991b1b' : currentRandomProblem.frequency === 'High' ? '#a16207' : currentRandomProblem.frequency === 'Medium' ? '#0369a1' : '#6b7280'
                        }}
                      >
                        {currentRandomProblem.frequency}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : (
        <section className="topics-list">
          <div className="topic-card">
            <div className="problem-list">
              <div className="problem-table-header" style={{display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 60px 80px 60px 80px 80px 80px 80px 80px', gap: '12px', padding: '12px 24px', backgroundColor: isDark ? 'rgba(77, 6, 6, 0.1)' : '#f8f9fa', borderBottom: `1px solid ${isDark ? '#4b5563' : '#e9ecef'}`, fontSize: '14px', fontWeight: '600', color: isDark ? '#d1d5db' : '#495057'}}>
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
                <div>Difficulty</div>
                <div>Frequency</div>
              </div>
              
              {sortedQuestions.map((problem, idx) => (
                <div
                  key={problem.id}
                  className="problem-row"
                  style={{display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 60px 80px 60px 80px 80px 80px 80px 80px', gap: '12px', padding: '12px 24px', borderBottom: `1px solid ${isDark ? '#4b5563' : '#f1f3f4'}`, alignItems: 'center', fontSize: '14px', backgroundColor: isDark ? 'rgba(19, 2, 2, 0.1)' : 'white'}}
                >
                  {/* Status */}
                  <div className="problem-status" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                    <input
                      type="checkbox"
                      checked={completedProblems.has(problem.id)}
                      onChange={() => toggleComplete(problem.id)}
                      style={{width: '16px', height: '16px', cursor: 'pointer'}}
                    />
                    <button
                      onClick={() => toggleComplete(problem.id)}
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
                    <div style={{fontWeight: '500', color: completedProblems.has(problem.id) ? '#6b7280' : (isDark ? 'white' : '#1f2937')}}>
                      {problem.title}
                    </div>
                    <div style={{fontSize: '12px', color: '#6b7280', marginTop: '2px'}}>
                      Topic: {problem.topic}
                    </div>
                  </div>
                  
                  {/* Practice */}
                  <div className="problem-action" style={{textAlign: 'center'}}>
                    <a
                      href={problem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{backgroundColor: '#1f2937', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', textDecoration: 'none', display: 'inline-block'}}
                    >
                      <i className="fas fa-code"></i> Solve
                    </a>
                  </div>
                  
                  {/* Solution */}
                  <div className="problem-action" style={{textAlign: 'center'}}>
                    <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                  </div>
                  
                  {/* Note */}
                  <div className="problem-action" style={{textAlign: 'center'}}>
                    <button
                      onClick={() => {
                        setSelectedProblem(problem);
                        setModalOpen(true);
                      }}
                      style={{background: notes[problem.id] ? '#fef3c7' : (isDark ? '#374151' : '#f3f4f6'), border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`, cursor: 'pointer', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', color: notes[problem.id] ? '#92400e' : (isDark ? '#d1d5db' : '#6b7280')}}
                    >
                      <i className="fas fa-sticky-note"></i> {notes[problem.id] ? 'Note' : '+'}
                    </button>
                  </div>
                  
                  {/* Revision */}
                  <div className="problem-action" style={{textAlign: 'center'}}>
                    <button
                      onClick={() => toggleStar(problem.id)}
                      style={{background: starredProblems.has(problem.id) ? '#fef3c7' : (isDark ? '#374151' : '#f3f4f6'), border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`, cursor: 'pointer', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', color: starredProblems.has(problem.id) ? '#92400e' : (isDark ? '#d1d5db' : '#6b7280')}}
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
                      style={{fontSize: '12px', padding: '4px 8px', border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`, borderRadius: '4px', cursor: 'pointer', backgroundColor: isDark ? '#374151' : 'white', color: isDark ? '#d1d5db' : 'inherit'}}
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
                    <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                  </div>
                  
                  {/* Chat */}
                  <div className="problem-action" style={{textAlign: 'center'}}>
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

                  {/* Frequency */}
                  <div className="problem-frequency" style={{textAlign: 'center'}}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: problem.frequency === 'Very High' ? '#fee2e2' : problem.frequency === 'High' ? '#fffbeb' : problem.frequency === 'Medium' ? '#f0f9ff' : '#f3f4f6',
                        color: problem.frequency === 'Very High' ? '#991b1b' : problem.frequency === 'High' ? '#a16207' : problem.frequency === 'Medium' ? '#0369a1' : '#6b7280'
                      }}
                    >
                      {problem.frequency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

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
          onOpenProfile={() => setProfileOpen(true)}
          onSheetChange={onSheetChange}
        />
        
        {/* User Profile */}
        <UserProfile
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
          userId={userId}
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
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isDark ? '#60a5fa' : '#3b82f6'}>
              <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" style={{ transform: 'rotate(180deg)' }}/>
            </svg>
          </button>
        )}
      </main>
    </div>
  );
};

export default CompanyWiseDSASheet;