import React, { useState, useEffect } from 'react';
import './SideCard.css';

const SideCard = () => {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('sideCardDate');
    
    if (lastShown !== today) {
      localStorage.setItem('sideCardDate', today);
      localStorage.setItem('sideCardStartTime', Date.now().toString());
      setTimeLeft(24 * 60 * 60);
    } else {
      const startTime = parseInt(localStorage.getItem('sideCardStartTime') || Date.now().toString());
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, (24 * 60 * 60) - elapsed);
      setTimeLeft(remaining);
      
      if (elapsed >= 20 * 60 * 60) {
        setShowSolution(true);
      }
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = Math.max(0, prev - 1);
        if (newTime <= 4 * 60 * 60) {
          setShowSolution(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="side-card">
      <div className="side-card-image">
        <img 
          src="https://repository-images.githubusercontent.com/769514979/b43a7c16-7d76-4237-987f-3a1be226aaa4" 
          alt="Challenge"
        />
      </div>
      
      <div className="side-card-content">
        <h4>Daily Challenge</h4>
        <p>Solve & Learn</p>
        
        <div className="side-timer">
          {formatTime(timeLeft)}
        </div>
        
        <div className="side-actions">
          <button 
            className="side-solve-btn"
            onClick={() => window.open('https://leetcode.com/problems/two-sum/', '_blank')}
          >
            Solve
          </button>
          
          {showSolution && (
            <button 
              className="side-solution-btn"
              onClick={() => window.open('https://www.youtube.com/watch?v=KLlXCFG5TnA', '_blank')}
            >
              Solution
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideCard;