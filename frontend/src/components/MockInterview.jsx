import React, { useState } from 'react';
import api from '../utils/api';

const MockInterview = ({ isDark, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    problemTitle: '',
    userCode: '',
    approach: 'optimal',
    companyName: '',
    position: '',
    experience: '1-3',
    skills: ''
  });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const startInterview = async () => {
    try {
      setLoading(true);
      const response = await api.post('/mock-interview/start', formData, {
        headers: { userid: localStorage.getItem('userId') }
      });
      setQuestions(response.data.questions);
      setAnswers(new Array(response.data.questions.length).fill(''));
      setStep(2);
    } catch (error) {
      alert('Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const submitInterview = async () => {
    try {
      setLoading(true);
      const questionsAndAnswers = questions.map((question, index) => ({
        question: question,
        answer: answers[index] || 'No answer provided'
      }));
      
      // Get user data from localStorage or prompt
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userEmail = userData.email || prompt('Enter your email for the report:');
      const userName = userData.name || prompt('Enter your name:');
      
      const response = await api.post('/mock-interview/submit', {
        formData: {
          name: userName,
          email: userEmail,
          companyName: formData.companyName || 'Tech Company',
          position: formData.position || 'Software Engineer',
          experience: formData.experience || '1-3',
          skills: formData.skills || 'Programming',
          interviewRound: 'Technical Round 1'
        },
        questionsAndAnswers: questionsAndAnswers
      }, {
        headers: { userid: localStorage.getItem('userId') }
      });
      setResult(response.data);
      setStep(3);
    } catch (error) {
      alert('Failed to submit interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '800px',
        height: '80%',
        backgroundColor: isDark ? '#1f2937' : 'white',
        borderRadius: '16px',
        padding: '24px',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: isDark ? 'white' : '#1f2937', margin: 0 }}>Mock Interview</h2>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: isDark ? 'white' : '#1f2937'
          }}>×</button>
        </div>

        {step === 1 && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: isDark ? 'white' : '#1f2937' }}>
                Problem Title
              </label>
              <input
                type="text"
                value={formData.problemTitle}
                onChange={(e) => setFormData({...formData, problemTitle: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  backgroundColor: isDark ? '#374151' : 'white',
                  color: isDark ? 'white' : '#1f2937'
                }}
                placeholder="Enter the problem you solved"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: isDark ? 'white' : '#1f2937' }}>
                Your Code
              </label>
              <textarea
                value={formData.userCode}
                onChange={(e) => setFormData({...formData, userCode: e.target.value})}
                style={{
                  width: '100%',
                  height: '200px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  backgroundColor: isDark ? '#374151' : 'white',
                  color: isDark ? 'white' : '#1f2937',
                  fontFamily: 'monospace'
                }}
                placeholder="Paste your code here..."
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: isDark ? 'white' : '#1f2937' }}>
                Company Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  backgroundColor: isDark ? '#374151' : 'white',
                  color: isDark ? 'white' : '#1f2937'
                }}
                placeholder="e.g., Google, Amazon, Microsoft"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: isDark ? 'white' : '#1f2937' }}>
                Position
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  backgroundColor: isDark ? '#374151' : 'white',
                  color: isDark ? 'white' : '#1f2937'
                }}
                placeholder="e.g., Software Engineer, Data Scientist"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: isDark ? 'white' : '#1f2937' }}>
                Skills
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  backgroundColor: isDark ? '#374151' : 'white',
                  color: isDark ? 'white' : '#1f2937'
                }}
                placeholder="e.g., JavaScript, React, Node.js"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: isDark ? 'white' : '#1f2937' }}>
                Experience Level
              </label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  backgroundColor: isDark ? '#374151' : 'white',
                  color: isDark ? 'white' : '#1f2937'
                }}
              >
                <option value="0-1">0-1 years (Fresher)</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>

            <button
              onClick={startInterview}
              disabled={loading || !formData.problemTitle || !formData.userCode}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              {loading ? 'Starting Interview...' : 'Start Mock Interview'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ color: isDark ? 'white' : '#1f2937' }}>
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: isDark ? 'white' : '#1f2937' }}>
                {questions[currentQuestion]}
              </h3>
              <textarea
                value={answers[currentQuestion]}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[currentQuestion] = e.target.value;
                  setAnswers(newAnswers);
                }}
                style={{
                  width: '100%',
                  height: '150px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  backgroundColor: isDark ? '#374151' : 'white',
                  color: isDark ? 'white' : '#1f2937'
                }}
                placeholder="Type your answer here..."
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {currentQuestion > 0 && (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Previous
                </button>
              )}
              
              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={submitInterview}
                  disabled={loading}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  {loading ? 'Submitting...' : 'Submit Interview'}
                </button>
              )}
            </div>
          </div>
        )}

        {step === 3 && result && (
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: isDark ? 'white' : '#1f2937' }}>Interview Complete!</h3>
            <div style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              color: '#10b981',
              marginBottom: '16px' 
            }}>
              {result.score}/80
            </div>
            <p style={{ color: isDark ? '#d1d5db' : '#6b7280', marginBottom: '16px' }}>
              Report sent to your email!
            </p>
            <div style={{
              backgroundColor: isDark ? '#374151' : '#f9fafb',
              padding: '16px',
              borderRadius: '8px',
              textAlign: 'left',
              marginBottom: '24px'
            }}>
              <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '8px' }}>Feedback:</h4>
              <p style={{ color: isDark ? '#d1d5db' : '#6b7280', lineHeight: '1.5' }}>
                {result.feedback}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;