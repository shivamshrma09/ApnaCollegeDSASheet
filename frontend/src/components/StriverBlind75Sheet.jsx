import React, { useState, useEffect } from 'react';
import { striverBlind75SheetData } from '../data/striverBlind75Sheet';
import ProblemModal from './ProblemModal';
import './DSASheet.css';

const StriverBlind75Sheet = () => {
  const [completedProblems, setCompletedProblems] = useState([]);
  const [starredProblems, setStarredProblems] = useState([]);
  const [notes, setNotes] = useState({});
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      loadUserProgress(JSON.parse(userData)._id);
    }
  }, []);

  const loadUserProgress = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/progress/${userId}/striverBlind75`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCompletedProblems(data.completedProblems || []);
        setStarredProblems(data.starredProblems || []);
        setNotes(data.notes || {});
        calculateProgress(data.completedProblems || []);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const calculateProgress = (completed) => {
    const allProblems = striverBlind75SheetData.flatMap(day => day.problems);
    const completedDetails = allProblems.filter(p => completed.includes(p.id));
    
    setProgress({
      totalSolved: completed.length,
      easySolved: completedDetails.filter(p => p.difficulty === 'Easy').length,
      mediumSolved: completedDetails.filter(p => p.difficulty === 'Medium').length,
      hardSolved: completedDetails.filter(p => p.difficulty === 'Hard').length
    });
  };

  const toggleProblemStatus = async (problemId) => {
    if (!user) return;

    const isCompleted = completedProblems.includes(problemId);
    const newCompleted = isCompleted 
      ? completedProblems.filter(id => id !== problemId)
      : [...completedProblems, problemId];

    setCompletedProblems(newCompleted);
    calculateProgress(newCompleted);

    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/progress/${user._id}/striverBlind75/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ problemId })
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const toggleStar = async (problemId) => {
    if (!user) return;

    const isStarred = starredProblems.includes(problemId);
    const newStarred = isStarred
      ? starredProblems.filter(id => id !== problemId)
      : [...starredProblems, problemId];

    setStarredProblems(newStarred);

    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/progress/${user._id}/striverBlind75/star`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ problemId })
      });
    } catch (error) {
      console.error('Error updating star:', error);
    }
  };

  const openProblemModal = (problem) => {
    setSelectedProblem(problem);
    setIsModalOpen(true);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#00b894';
      case 'Medium': return '#fdcb6e';
      case 'Hard': return '#e17055';
      default: return '#74b9ff';
    }
  };

  const totalProblems = striverBlind75SheetData.reduce((sum, day) => sum + day.totalProblems, 0);
  const progressPercentage = ((progress.totalSolved / totalProblems) * 100).toFixed(1);

  return (
    <div className="dsa-sheet-container">
      <div className="sheet-header">
        <h1>Striver Blind 75 LeetCode Problems</h1>
        <p>Detailed Video Solutions - 75 most frequent asked problems</p>
        
        <div className="progress-overview">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="progress-stats">
            <span className="total-progress">{progress.totalSolved} / {totalProblems}</span>
            <span className="percentage">{progressPercentage}%</span>
          </div>
        </div>

        <div className="difficulty-stats">
          <div className="stat-item easy">
            <span className="count">{progress.easySolved}</span>
            <span className="label">Easy</span>
          </div>
          <div className="stat-item medium">
            <span className="count">{progress.mediumSolved}</span>
            <span className="label">Medium</span>
          </div>
          <div className="stat-item hard">
            <span className="count">{progress.hardSolved}</span>
            <span className="label">Hard</span>
          </div>
        </div>
      </div>

      <div className="sheet-content">
        {striverBlind75SheetData.map((day) => (
          <div key={day.id} className="topic-section">
            <div className="topic-header">
              <h2>{day.title}</h2>
              <span className="problem-count">
                {day.problems.filter(p => completedProblems.includes(p.id)).length} / {day.totalProblems}
              </span>
            </div>

            <div className="problems-table">
              <div className="table-header">
                <div className="col-status">Status</div>
                <div className="col-problem">Problem</div>
                <div className="col-difficulty">Difficulty</div>
                <div className="col-actions">Actions</div>
              </div>

              {day.problems.map((problem) => (
                <div key={problem.id} className="problem-row">
                  <div className="col-status">
                    <input
                      type="checkbox"
                      checked={completedProblems.includes(problem.id)}
                      onChange={() => toggleProblemStatus(problem.id)}
                      className="status-checkbox"
                    />
                  </div>

                  <div className="col-problem">
                    <span 
                      className={`problem-title ${completedProblems.includes(problem.id) ? 'completed' : ''}`}
                      onClick={() => openProblemModal(problem)}
                    >
                      {problem.title}
                    </span>
                    {problem.companies && (
                      <div className="companies">
                        {problem.companies.split('+').map((company, idx) => (
                          <span key={idx} className="company-tag">{company}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="col-difficulty">
                    <span 
                      className="difficulty-badge"
                      style={{ backgroundColor: getDifficultyColor(problem.difficulty) }}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  <div className="col-actions">
                    <button
                      className={`star-btn ${starredProblems.includes(problem.id) ? 'starred' : ''}`}
                      onClick={() => toggleStar(problem.id)}
                    >
                      ⭐
                    </button>
                    
                    {problem.link && (
                      <a href={problem.link} target="_blank" rel="noopener noreferrer" className="link-btn">
                        LC
                      </a>
                    )}
                    
                    {problem.gfg && (
                      <a href={problem.gfg} target="_blank" rel="noopener noreferrer" className="link-btn gfg">
                        GFG
                      </a>
                    )}
                    
                    {problem.video && (
                      <a href={problem.video} target="_blank" rel="noopener noreferrer" className="link-btn video">
                        📹
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedProblem && (
        <ProblemModal
          problem={selectedProblem}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          notes={notes}
          setNotes={setNotes}
          userId={user?._id}
          sheetType="striverBlind75"
        />
      )}
    </div>
  );
};

export default StriverBlind75Sheet;