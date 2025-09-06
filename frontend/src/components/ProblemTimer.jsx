import React from 'react';
import { useTimer } from '../hooks/useTimer';
import { useTheme } from '../contexts/ThemeContext';

const ProblemTimer = ({ problemId }) => {
  const { timeSpent, isActive, startTimer, stopTimer, formatTime } = useTimer(problemId);
  const { isDark } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <button
        onClick={isActive ? stopTimer : startTimer}
        style={{
          background: isActive ? '#ef4444' : (isDark ? '#374151' : 'white'),
          color: isActive ? 'white' : (isDark ? 'white' : '#374151'),
          border: isActive ? 'none' : (isDark ? '1px solid #4b5563' : '1px solid #d1d5db'),
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        title={isActive ? 'Stop Timer' : 'Start Timer'}
      >
        <img 
          src="/timer-svgrepo-com.svg" 
          alt="Timer" 
          style={{
            width: '16px', 
            height: '16px', 
            filter: isActive ? 'brightness(0) invert(1)' : (isDark ? 'brightness(0) invert(1)' : 'none')
          }} 
        />
      </button>
      {timeSpent > 0 && (
        <div style={{
          fontSize: '10px',
          fontWeight: '500',
          color: isActive ? '#ef4444' : '#6b7280',
          textAlign: 'center'
        }}>
          {formatTime(timeSpent)}
        </div>
      )}
    </div>
  );
};

export default ProblemTimer;