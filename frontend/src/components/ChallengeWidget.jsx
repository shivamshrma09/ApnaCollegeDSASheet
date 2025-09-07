import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CodeEditor from './CodeEditor';

const ChallengeWidget = ({ challenge, onClose }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [answer, setAnswer] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (challenge) {
      // Calculate initial time remaining
      const now = new Date();
      const endTime = new Date(challenge.endTime);
      const remaining = Math.max(0, endTime - now);
      setTimeRemaining(Math.floor(remaining / 1000));

      // Start countdown timer
      const timer = setInterval(() => {
        const now = new Date();
        const endTime = new Date(challenge.endTime);
        const remaining = Math.max(0, endTime - now);
        const seconds = Math.floor(remaining / 1000);
        
        setTimeRemaining(seconds);
        
        if (seconds <= 0) {
          clearInterval(timer);
          if (hasJoined && !isSubmitted) {
            fetchResults();
          }
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [challenge]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const joinChallenge = async () => {
    try {
      await axios.post(`https://plusdsa.onrender.com/api/challenges/${challenge._id}/join`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setHasJoined(true);
      setShowEditor(true);
    } catch (error) {
      console.error('Error joining challenge:', error);
    }
  };

  const submitAnswer = async () => {
    try {
      await axios.post(`https://plusdsa.onrender.com/api/challenges/${challenge._id}/submit`, 
        { answer },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      setIsSubmitted(true);
      setShowEditor(false);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get(`https://plusdsa.onrender.com/api/challenges/${challenge._id}/results`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  if (!challenge) return null;

  const isExpired = timeRemaining <= 0;

  if (showEditor && !isExpired) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#1f2937',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: 0 }}>🎯 {challenge.title}</h3>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>{challenge.description}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: timeRemaining < 60 ? '#ef4444' : '#10b981'
            }}>
              ⏰ {formatTime(timeRemaining)}
            </div>
            <button onClick={() => setShowEditor(false)} style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer'
            }}>✕</button>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <CodeEditor 
            value={answer}
            onChange={setAnswer}
            language="javascript"
            theme="dark"
          />
        </div>
        <div style={{
          padding: '20px',
          backgroundColor: '#1f2937',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button
            onClick={submitAnswer}
            disabled={!answer.trim()}
            style={{
              padding: '12px 30px',
              backgroundColor: answer.trim() ? '#10b981' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: answer.trim() ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Submit Solution
          </button>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        width: '400px',
        maxHeight: '80vh',
        backgroundColor: '#ffffff',
        border: '2px solid #3b82f6',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        zIndex: 1000,
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: 0, color: '#1f2937' }}>🏆 Challenge Results</h3>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer'
          }}>✕</button>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>{results.challenge.title}</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
            Total Participants: {results.results.length}
          </p>
        </div>

        <div>
          <h4 style={{ margin: '0 0 15px 0' }}>📊 Leaderboard</h4>
          {results.results
            .sort((a, b) => (b.aiAnalysis?.score || 0) - (a.aiAnalysis?.score || 0))
            .map((result, index) => (
            <div key={result.user._id} style={{
              padding: '12px',
              backgroundColor: index === 0 ? '#fef3c7' : '#f3f4f6',
              borderRadius: '8px',
              marginBottom: '8px',
              border: index === 0 ? '2px solid #f59e0b' : '1px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontWeight: '600' }}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`} {result.user.name}
                  </span>
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#059669'
                }}>
                  {result.aiAnalysis?.score || 0}/10
                </div>
              </div>
              {result.aiAnalysis?.feedback && (
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  {result.aiAnalysis.feedback.substring(0, 100)}...
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '350px',
      backgroundColor: '#ffffff',
      border: '2px solid #3b82f6',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h3 style={{ margin: 0, color: '#1f2937' }}>🎯 CODING CHALLENGE</h3>
        <button onClick={onClose} style={{
          background: 'none',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer'
        }}>✕</button>
      </div>

      <div style={{
        backgroundColor: isExpired ? '#fee2e2' : '#dbeafe',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '15px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          {isExpired ? 'ENDED' : 'LIVE'}
        </div>
        <div style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: isExpired ? '#dc2626' : '#059669'
        }}>
          ⏰ {isExpired ? 'Time\'s up!' : formatTime(timeRemaining)}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>{challenge.title}</h4>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
          {challenge.description}
        </p>
      </div>

      {!hasJoined && !isExpired && (
        <button
          onClick={joinChallenge}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          ✅ Accept Challenge
        </button>
      )}

      {hasJoined && !isSubmitted && !isExpired && (
        <button
          onClick={() => setShowEditor(true)}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          💻 Open Code Editor
        </button>
      )}

      {isSubmitted && (
        <div style={{
          backgroundColor: '#d1fae5',
          padding: '12px',
          borderRadius: '6px',
          textAlign: 'center',
          color: '#065f46'
        }}>
          ✅ Answer submitted successfully!
        </div>
      )}

      {isExpired && (
        <div>
          <div style={{
            backgroundColor: '#fee2e2',
            padding: '12px',
            borderRadius: '6px',
            textAlign: 'center',
            color: '#991b1b',
            marginBottom: '10px'
          }}>
            ⏰ Challenge has ended
          </div>
          <button
            onClick={fetchResults}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            📊 View Results
          </button>
        </div>
      )}

      <div style={{
        marginTop: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#6b7280'
      }}>
        <span>🔗 View Problem</span>
        <span>👥 {challenge.participants?.length || 0} joined</span>
      </div>
    </div>
  );
};

export default ChallengeWidget;