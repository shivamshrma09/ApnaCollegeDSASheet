import React from 'react';

const ProblemLinks = ({ problem, isDark = false }) => {
  const linkStyle = {
    padding: '4px 8px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s ease'
  };

  const practiceStyle = {
    ...linkStyle,
    backgroundColor: isDark ? '#1f2937' : '#1f2937',
    color: 'white',
    border: 'none'
  };

  const youtubeStyle = {
    ...linkStyle,
    backgroundColor: '#ef4444',
    color: 'white'
  };

  const gfgStyle = {
    ...linkStyle,
    backgroundColor: isDark ? '#374151' : 'white',
    color: isDark ? 'white' : '#374151',
    border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db'
  };

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {/* Practice Link (LeetCode or other) */}
      {problem.leetcode && (
        <a
          href={problem.leetcode}
          target="_blank"
          rel="noopener noreferrer"
          style={practiceStyle}
          title="Practice on LeetCode"
        >
          <i className="fas fa-code"></i>
          Solve
        </a>
      )}
      
      {/* YouTube Solution */}
      {problem.youtube && (
        <a
          href={problem.youtube}
          target="_blank"
          rel="noopener noreferrer"
          style={youtubeStyle}
          title="Watch YouTube Solution"
        >
          <i className="fab fa-youtube"></i>
          YT
        </a>
      )}
      
      {/* GeeksforGeeks Article */}
      {problem.gfg && (
        <a
          href={problem.gfg}
          target="_blank"
          rel="noopener noreferrer"
          style={gfgStyle}
          title="Read GFG Article"
        >
          <img 
            src="/article-svgrepo-com.svg" 
            alt="Article" 
            style={{
              width: '14px', 
              height: '14px', 
              filter: isDark ? 'brightness(0) invert(1)' : 'none'
            }} 
          />
          GFG
        </a>
      )}
    </div>
  );
};

export default ProblemLinks;