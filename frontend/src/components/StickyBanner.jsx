import React, { useState, useEffect } from 'react';
import './StickyBanner.css';

const StickyBanner = () => {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    // Check if banner was already shown today
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('bannerDate');
    
    if (lastShown !== today) {
      // Reset timer for new day
      localStorage.setItem('bannerDate', today);
      localStorage.setItem('bannerStartTime', Date.now().toString());
      setTimeLeft(24 * 60 * 60);
    } else {
      // Calculate remaining time
      const startTime = parseInt(localStorage.getItem('bannerStartTime') || Date.now().toString());
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, (24 * 60 * 60) - elapsed);
      setTimeLeft(remaining);
      
      // Show solution button if 20+ hours have passed
      if (elapsed >= 20 * 60 * 60) {
        setShowSolution(true);
      }
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = Math.max(0, prev - 1);
        
        // Show solution button when 4 hours or less remaining (20+ hours passed)
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

  const handleSolveClick = () => {
    window.open('https://leetcode.com/problems/two-sum/', '_blank');
  };

  const handleSolutionClick = () => {
    window.open('https://www.youtube.com/watch?v=KLlXCFG5TnA', '_blank');
  };

  return (
    <div className="sticky-banner">
      <div className="banner-content">
        <div className="banner-image">
          <img 
            src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/d45f2a11-73ee-4efb-b5d5-6362a48f3789.png" 
            alt="Daily Challenge"
          />
        </div>
        
        <div className="banner-text">
          <h3>🎯 Daily Coding Challenge</h3>
          <p>Solve today's featured problem and boost your skills!</p>
        </div>
        
        <div className="banner-timer">
          <div className="timer-display">
            <span className="timer-label">Time Left:</span>
            <span className="timer-value">{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        <div className="banner-actions">
          <button className="solve-btn" onClick={handleSolveClick}>
            <span>🚀</span>
            Solve
          </button>
          
          {showSolution && (
            <button className="solution-btn" onClick={handleSolutionClick}>
              <span>📺</span>
              Solution
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StickyBanner;