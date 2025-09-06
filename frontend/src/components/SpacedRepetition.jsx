import React, { useState } from 'react';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { useTheme } from '../contexts/ThemeContext';

const SpacedRepetition = ({ problems, userId, sheetType = 'apnaCollege' }) => {
  const { isDark } = useTheme();
  const { dueProblems, addToSpacedRepetition, reviewProblem } = useSpacedRepetition(userId, sheetType);
  
  // Log for debugging
  console.log(`🧠 SpacedRepetition component loaded for sheet: ${sheetType}, due problems: ${dueProblems.length}`);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [showReview, setShowReview] = useState(false);

  const allProblems = problems.flatMap(topic => topic.problems);
  
  const getCurrentProblem = () => {
    if (dueProblems.length === 0) return null;
    const problemId = dueProblems[currentReviewIndex]?.problemId;
    return allProblems.find(p => p.id === problemId);
  };

  const handleReview = async (quality) => {
    const problemId = dueProblems[currentReviewIndex]?.problemId;
    await reviewProblem(problemId, quality);
    
    if (currentReviewIndex < dueProblems.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
    } else {
      setShowReview(false);
      setCurrentReviewIndex(0);
    }
  };

  const startReview = () => {
    if (dueProblems.length > 0) {
      setCurrentReviewIndex(0);
      setShowReview(true);
    }
  };

  const currentProblem = getCurrentProblem();

  if (showReview && currentProblem) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: isDark ? '#1f2937' : 'white',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '600px',
          width: '90%',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '8px' }}>
              Review Time! ({currentReviewIndex + 1}/{dueProblems.length})
            </h2>
            <h3 style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '20px' }}>
              {currentProblem.title}
            </h3>
            <span style={{
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              backgroundColor: currentProblem.difficulty === 'Easy' ? '#d1fae5' : 
                             currentProblem.difficulty === 'Medium' ? '#fffbeb' : '#fee2e2',
              color: currentProblem.difficulty === 'Easy' ? '#047857' : 
                     currentProblem.difficulty === 'Medium' ? '#a16207' : '#991b1b'
            }}>
              {currentProblem.difficulty}
            </span>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '16px' }}>
              How well did you remember this problem?
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { quality: 0, label: 'Complete blackout', color: '#dc2626' },
                { quality: 1, label: 'Incorrect', color: '#ea580c' },
                { quality: 2, label: 'Difficult', color: '#d97706' },
                { quality: 3, label: 'Hesitant', color: '#ca8a04' },
                { quality: 4, label: 'Easy', color: '#65a30d' },
                { quality: 5, label: 'Perfect', color: '#16a34a' }
              ].map(({ quality, label, color }) => (
                <button
                  key={quality}
                  onClick={() => handleReview(quality)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: color,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  {quality}: {label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <a
              href={currentProblem.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '10px 20px',
                backgroundColor: '#1f2937',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              Solve Again
            </a>
            <button
              onClick={() => setShowReview(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Skip Review
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 100
    }}>
      {dueProblems.length > 0 && (
        <button
          onClick={startReview}
          style={{
            padding: '12px 20px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🧠 Review ({dueProblems.length})
        </button>
      )}
    </div>
  );
};

export default SpacedRepetition;

// Debug: Log when component is imported
console.log('📝 SpacedRepetition component imported');