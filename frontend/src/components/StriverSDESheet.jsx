import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useUserProgress } from '../hooks/useUserProgress';
import striverSDESheetData from '../data/striverSDESheet';
import ProblemModal from './ProblemModal';
import ProblemTimer from './ProblemTimer';
import './DSASheet.css';

const StriverSDESheet = () => {
  const [problems, setProblems] = useState(striverSDESheetData);
  const [expandedTopics, setExpandedTopics] = useState(new Set([1]));
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [randomMode, setRandomMode] = useState(false);
  const [currentRandomProblem, setCurrentRandomProblem] = useState(null);

  const { isDark } = useTheme();
  
  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || '64f8a1b2c3d4e5f6a7b8c9d0';
  };
  
  const userId = getUserId();
  
  const {
    completedProblems,
    starredProblems,
    notes,
    playlists,
    toggleComplete,
    toggleStar,
    saveNote,
    deleteNote,
    addToPlaylist
  } = useUserProgress(userId, 'striverSDE');

  const toggleTopic = (topicId) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const getTotalProblems = () => {
    return problems.reduce((total, topic) => total + (topic.problems?.length || 0), 0);
  };

  const getTotalByDifficulty = (difficulty) => {
    return problems.reduce((total, topic) => 
      total + (topic.problems?.filter(p => p.difficulty === difficulty).length || 0), 0
    );
  };

  const getCompletedByDifficulty = (difficulty) => {
    return problems.reduce((total, topic) => 
      total + (topic.problems?.filter(p => p.difficulty === difficulty && completedProblems.has(p.id)).length || 0), 0
    );
  };

  const getRandomFilteredProblem = () => {
    let filteredProblems = problems.flatMap(topic => topic.problems || []);
    
    if (difficultyFilter !== 'All') {
      filteredProblems = filteredProblems.filter(p => p.difficulty === difficultyFilter);
    }
    if (companyFilter !== 'All') {
      filteredProblems = filteredProblems.filter(p => p.companies && p.companies.toLowerCase().includes(companyFilter.toLowerCase()));
    }
    
    if (filteredProblems.length === 0) {
      alert('No problems found with current filters');
      return;
    }
    
    const randomProblem = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];
    setCurrentRandomProblem(randomProblem);
    setRandomMode(true);
  };

  const getCompanyLogos = (companiesString) => {
    if (!companiesString) return [];
    
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
    
    const companies = companiesString.split(/[+,\s]+/).filter(c => c.trim());
    return companies.slice(0, 6).map(company => {
      const cleanCompany = company.trim().replace(/\s+/g, ' ');
      return companyMap[cleanCompany] || { name: cleanCompany, domain: `${cleanCompany.toLowerCase().replace(/[\s-]+/g, '')}.com` };
    });
  };

  return (
    <div className={`dsa-sheet-container ${isDark ? 'dark' : ''}`}>
      <div className="dsa-sheet-header">
        <div className="header-content">
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <div className="header-logo-link" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <img 
                src={isDark ? "/dark.png" : "/light.png"} 
                alt="Striver SDE Sheet" 
                className="logo" 
                style={{ 
                  height: '45px', 
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <main className="dsa-sheet-main">
        <section className="overview-section">
          <h1 className="main-title">
            <span>Striver SDE Sheet - 191 Problems</span>
          </h1>
          <p style={{fontSize: '16px', color: '#6b7280', marginBottom: '8px'}}>
            Complete collection of 191 most important problems for Software Development Engineer interviews. 
            Curated by Striver for cracking interviews at top tech companies.
          </p>
          
          <div style={{marginBottom: '24px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px'}}>
              <h3 style={{fontSize: '18px', fontWeight: '600'}}>Total Progress</h3>
            </div>
            
            <div style={{marginBottom: '16px'}}>
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
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'white',
              border: `2px solid ${isDark ? ' rgba(255, 255, 255, 0.2)' : '#e5e7eb'}`,
              borderRadius: '8px',
              padding: '0',
              boxShadow: '0 1px 3px rgba(19, 2, 2, 0.1)',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '24px 24px 0'}}>
                <button
                  onClick={() => setRandomMode(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  ← Back to Sheet
                </button>
                <h2 style={{fontSize: '24px', fontWeight: '600', color: isDark ? 'white' : '#030405ff', margin: 0}}>Random Problem</h2>
                <button
                  onClick={getRandomFilteredProblem}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Next Random
                </button>
              </div>

              {currentRandomProblem && (
                <div>
                  <div className="problem-table-header" style={{display: 'grid', gridTemplateColumns: '60px 1fr 100px 100px 100px 100px 100px 80px', gap: '10px', padding: '12px 24px', backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : '#f8f9fa', borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : '#e9ecef'}`, fontSize: '14px', fontWeight: '600', color: isDark ? '#d1d5db' : '#495057', marginBottom: '0'}}>
                    <div>Status</div>
                    <div>Problem</div>
                    <div>TUF Dark</div>
                    <div>Resource (Plus)</div>
                    <div>Resource (Free)</div>
                    <div>Practice</div>
                    <div>Note</div>
                    <div>Difficulty</div>
                  </div>
                  
                  <div className="problem-row" style={{display: 'grid', gridTemplateColumns: '60px 1fr 100px 100px 100px 100px 100px 80px', gap: '12px', padding: '12px 24px', borderBottom: `1px solid ${isDark ? '#4b5563' : '#f1f3f4'}`, alignItems: 'center', fontSize: '14px', backgroundColor: isDark ? '#1f2937' : 'white'}}>
                    <div className="problem-status" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <input
                        type="checkbox"
                        checked={completedProblems.has(currentRandomProblem.id)}
                        onChange={() => toggleComplete(currentRandomProblem.id)}
                        style={{width: '16px', height: '16px', cursor: 'pointer'}}
                      />
                    </div>
                    
                    <div className="problem-info">
                      <div style={{fontWeight: '500', color: completedProblems.has(currentRandomProblem.id) ? '#6b7280' : (isDark ? 'white' : '#1f2937')}}>
                        {currentRandomProblem.title}
                      </div>
                      {currentRandomProblem.companies && (
                        <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px'}}>
                          <span style={{fontSize: '11px', color: '#6b7280'}}>Companies:</span>
                          <div style={{display: 'flex', gap: '4px'}}>
                            {getCompanyLogos(currentRandomProblem.companies).map((company, idx) => (
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
                    
                    <div className="problem-action" style={{textAlign: 'center'}}>
                      {currentRandomProblem.tufDark ? (
                        <a href={currentRandomProblem.tufDark} target="_blank" rel="noopener noreferrer" style={{color: '#ef4444', textDecoration: 'none', fontSize: '12px', padding: '4px 8px', backgroundColor: '#fee2e2', borderRadius: '4px', display: 'inline-block'}}>editorial</a>
                      ) : (
                        <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                      )}
                    </div>
                    
                    <div className="problem-action" style={{textAlign: 'center'}}>
                      {currentRandomProblem.resourcePlus ? (
                        <a href={currentRandomProblem.resourcePlus} target="_blank" rel="noopener noreferrer" style={{color: '#3b82f6', textDecoration: 'none', fontSize: '12px', padding: '4px 8px', backgroundColor: '#dbeafe', borderRadius: '4px', display: 'inline-block'}}>Post Link</a>
                      ) : (
                        <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                      )}
                    </div>
                    
                    <div className="problem-action" style={{textAlign: 'center'}}>
                      {currentRandomProblem.video ? (
                        <a href={currentRandomProblem.video} target="_blank" rel="noopener noreferrer" style={{color: '#ef4444', textDecoration: 'none', fontSize: '12px', padding: '4px 8px', backgroundColor: '#fee2e2', borderRadius: '4px', display: 'inline-block'}}>YouTube Link</a>
                      ) : (
                        <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                      )}
                    </div>
                    
                    <div className="problem-action" style={{textAlign: 'center'}}>
                      {currentRandomProblem.link ? (
                        <a
                          href={currentRandomProblem.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{backgroundColor: '#1f2937', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', textDecoration: 'none', display: 'inline-block'}}
                        >
                          Solve
                        </a>
                      ) : (
                        <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                      )}
                    </div>
                    
                    <div className="problem-action" style={{textAlign: 'center'}}>
                      <button
                        onClick={() => {
                          setSelectedProblem(currentRandomProblem);
                          setModalOpen(true);
                        }}
                        style={{background: notes[currentRandomProblem.id] ? '#fef3c7' : (isDark ? '#374151' : '#f3f4f6'), border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`, cursor: 'pointer', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', color: notes[currentRandomProblem.id] ? '#92400e' : (isDark ? '#d1d5db' : '#6b7280')}}
                      >
                        Note
                      </button>
                    </div>
                    
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
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="topics-list">
            {problems.map(topic => {
              const solvedCount = (topic.problems || []).filter(p => completedProblems.has(p.id)).length;
              const isOpen = expandedTopics.has(topic.id);
              
              let filteredProblems = topic.problems || [];
              if (difficultyFilter !== 'All') {
                filteredProblems = filteredProblems.filter(p => p.difficulty === difficultyFilter);
              }
              if (companyFilter !== 'All') {
                filteredProblems = filteredProblems.filter(p => p.companies && p.companies.toLowerCase().includes(companyFilter.toLowerCase()));
              }
              if (searchQuery) {
                filteredProblems = filteredProblems.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
              }
              
              return (
                <div key={topic.id} className="topic-card">
                  <div
                    className="topic-header"
                    onClick={() => toggleTopic(topic.id)}
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
                        {topic.title}
                      </h2>
                    </div>
                    <div className="topic-progress">
                      <span className="progress-text">
                        {solvedCount}/{(topic.problems || []).length}
                      </span>
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${((topic.problems || []).length > 0 ? (solvedCount / (topic.problems || []).length) * 100 : 0)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="problem-list">
                      <div className="problem-table-header" style={{display: 'grid', gridTemplateColumns: '60px 1fr 100px 100px 100px 100px 100px 80px', gap: '12px', padding: '12px 24px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: '600', color: '#495057'}}>
                        <div>Status</div>
                        <div>Problem</div>
                        <div>TUF Dark</div>
                        <div>Resource (Plus)</div>
                        <div>Resource (Free)</div>
                        <div>Practice</div>
                        <div>Note</div>
                        <div>Difficulty</div>
                      </div>
                      
                      {filteredProblems.map((p) => (
                        <div
                          key={p.id}
                          className="problem-row"
                          style={{display: 'grid', gridTemplateColumns: '60px 1fr 100px 100px 100px 100px 100px 80px', gap: '12px', padding: '12px 24px', borderBottom: '1px solid #f1f3f4', alignItems: 'center', fontSize: '14px'}}
                        >
                          <div className="problem-status" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <input
                              type="checkbox"
                              checked={completedProblems.has(p.id)}
                              onChange={() => toggleComplete(p.id)}
                              style={{width: '16px', height: '16px', cursor: 'pointer'}}
                            />
                          </div>
                          
                          <div className="problem-info">
                            <div style={{fontWeight: '500', color: completedProblems.has(p.id) ? '#6b7280' : '#1f2937'}}>
                              {p.title}
                            </div>
                            {p.companies && (
                              <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px'}}>
                                <span style={{fontSize: '11px', color: '#6b7280'}}>Companies:</span>
                                <div style={{display: 'flex', gap: '4px'}}>
                                  {getCompanyLogos(p.companies).map((company, idx) => (
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
                          
                          <div className="problem-action" style={{textAlign: 'center'}}>
                            {p.tufDark ? (
                              <a href={p.tufDark} target="_blank" rel="noopener noreferrer" style={{color: '#ef4444', textDecoration: 'none', fontSize: '12px', padding: '4px 8px', backgroundColor: '#fee2e2', borderRadius: '4px', display: 'inline-block'}}>editorial</a>
                            ) : (
                              <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                            )}
                          </div>
                          
                          <div className="problem-action" style={{textAlign: 'center'}}>
                            {p.resourcePlus ? (
                              <a href={p.resourcePlus} target="_blank" rel="noopener noreferrer" style={{color: '#3b82f6', textDecoration: 'none', fontSize: '12px', padding: '4px 8px', backgroundColor: '#dbeafe', borderRadius: '4px', display: 'inline-block'}}>Post Link</a>
                            ) : (
                              <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                            )}
                          </div>
                          
                          <div className="problem-action" style={{textAlign: 'center'}}>
                            {p.video ? (
                              <a href={p.video} target="_blank" rel="noopener noreferrer" style={{color: '#ef4444', textDecoration: 'none', fontSize: '12px', padding: '4px 8px', backgroundColor: '#fee2e2', borderRadius: '4px', display: 'inline-block'}}>YouTube Link</a>
                            ) : (
                              <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                            )}
                          </div>
                          
                          <div className="problem-action" style={{textAlign: 'center'}}>
                            {p.link ? (
                              <a
                                href={p.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{backgroundColor: '#1f2937', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', textDecoration: 'none', display: 'inline-block'}}
                              >
                                Solve
                              </a>
                            ) : (
                              <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                            )}
                          </div>
                          
                          <div className="problem-action" style={{textAlign: 'center'}}>
                            <button
                              onClick={() => {
                                setSelectedProblem(p);
                                setModalOpen(true);
                              }}
                              style={{background: notes[p.id] ? '#fef3c7' : '#f3f4f6', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', color: notes[p.id] ? '#92400e' : '#6b7280'}}
                            >
                              Note
                            </button>
                          </div>
                          
                          <div className="problem-difficulty" style={{textAlign: 'center'}}>
                            <span
                              style={{
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '600',
                                backgroundColor: p.difficulty === 'Easy' ? '#d1fae5' : p.difficulty === 'Medium' ? '#fffbeb' : '#fee2e2',
                                color: p.difficulty === 'Easy' ? '#047857' : p.difficulty === 'Medium' ? '#a16207' : '#991b1b'
                              }}
                            >
                              {p.difficulty}
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
        )}
        
        <ProblemModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          problem={selectedProblem}
          userNote={selectedProblem ? notes[selectedProblem.id] : ''}
          onSaveNote={saveNote}
          onDeleteNote={deleteNote}
        />
      </main>
    </div>
  );
};

export default StriverSDESheet;