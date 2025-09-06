import React, { useState, useEffect, useRef } from 'react';

const InterviewSession = ({ formData, questions, isDark, onComplete }) => {
  const [answers, setAnswers] = useState(new Array(questions.length).fill(''));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [webcamPermission, setWebcamPermission] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const hrVideoRef = useRef(null);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setWebcamStream(stream);
      setWebcamPermission(true);
    } catch (error) {
      console.error('Webcam access denied:', error);
      alert('Webcam access is required for the interview. Please allow camera access.');
    }
  };

  const playQuestionWithVideo = async (question) => {
    if (hrVideoRef.current) {
      try {
        hrVideoRef.current.currentTime = 0;
        await hrVideoRef.current.play();
      } catch (error) {
        console.error('Video playback failed:', error);
      }
    }
  };

  const handleUserAnswerChange = (e) => {
    setUserAnswer(e.target.value);
  };

  // Memoize video refs to prevent re-rendering
  const webcamVideoRef = useRef(null);
  
  useEffect(() => {
    if (webcamVideoRef.current && webcamStream && webcamVideoRef.current.srcObject !== webcamStream) {
      webcamVideoRef.current.srcObject = webcamStream;
    }
  }, [webcamStream]);

  const speakQuestion = (question) => {
    if ('speechSynthesis' in window && question && typeof question === 'string') {
      const sanitizedQuestion = question.replace(/[<>"'&]/g, '');
      const utterance = new SpeechSynthesisUtterance(sanitizedQuestion);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Play video when speaking starts
      utterance.onstart = () => {
        if (hrVideoRef.current) {
          hrVideoRef.current.currentTime = 0;
          hrVideoRef.current.play();
        }
      };
      
      // Pause video when speaking ends
      utterance.onend = () => {
        if (hrVideoRef.current) {
          hrVideoRef.current.pause();
        }
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser');
      return;
    }

    if (isRecording) {
      if (recognition) {
        recognition.stop();
      }
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const newRecognition = new SpeechRecognition();
    
    newRecognition.continuous = true;
    newRecognition.interimResults = true;
    newRecognition.lang = 'en-US';

    newRecognition.onstart = () => {
      setIsRecording(true);
    };

    newRecognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setUserAnswer(prev => prev + ' ' + transcript);
    };

    newRecognition.onerror = () => {
      setIsRecording(false);
    };

    newRecognition.onend = () => {
      setIsRecording(false);
    };

    setRecognition(newRecognition);
    newRecognition.start();
  };

  const submitAnswer = () => {
    if (!userAnswer.trim()) return;
    
    setLoading(true);
    const newAnswers = [...answers];
    newAnswers[currentIndex] = userAnswer;
    setAnswers(newAnswers);
    
    setTimeout(() => {
      if (currentIndex >= questions.length - 1) {
        // Complete interview
        const questionsWithAnswers = questions.map((question, index) => ({
          question,
          answer: newAnswers[index] || 'No answer provided'
        }));
        onComplete(questionsWithAnswers);
      } else {
        // Move to next question
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setUserAnswer('');
        playQuestionWithVideo(questions[nextIndex]);
        
        // Speak the next question
        setTimeout(() => {
          speakQuestion(questions[nextIndex]);
        }, 500);
      }
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    // Auto-play first question video and speak it
    if (currentIndex === 0 && hrVideoRef.current && questions.length > 0) {
      setTimeout(() => {
        playQuestionWithVideo(questions[0]);
        speakQuestion(questions[0]);
      }, 1000);
    }
  }, [questions]);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)', background: isDark ? '#0f172a' : '#ffffff' }}>
      {/* Left Panel - Video Section */}
      <div style={{ 
        width: '70%', 
        borderRight: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`, 
        background: isDark ? '#1e293b' : '#ffffff', 
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontWeight: 'bold',
          color: '#1E90FF',
          fontSize: '24px',
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          {formData.companyName} {formData.interviewRound} Mock Interview
        </h1>
        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          marginBottom: '16px',
          color: isDark ? '#94a3b8' : '#6b7280'
        }}>
          powered by DSA Mock Interview Hub
        </p>
        <hr style={{ marginBottom: '16px', borderColor: isDark ? '#334155' : '#e5e7eb' }} />
        
        <div>
          {!webcamPermission && (
            <button
              style={{
                background: '#1E90FF',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                marginBottom: '16px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onClick={startWebcam}
              type="button"
              onMouseEnter={(e) => e.target.style.background = '#0066CC'}
              onMouseLeave={(e) => e.target.style.background = '#1E90FF'}
            >
              Enable Webcam (Interview Video)
            </button>
          )}
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            {/* User Webcam */}
            {webcamPermission && (
              <video
                autoPlay
                playsInline
                muted
                ref={webcamVideoRef}
                style={{
                  width: '50%',
                  borderRadius: '8px',
                  border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                  background: isDark ? '#374151' : '#f9fafb'
                }}
              />
            )}
            
            {/* HR Video */}
            <video
              ref={hrVideoRef}
              src="/video.mp4"
              style={{
                width: webcamPermission ? '50%' : '100%',
                borderRadius: '8px',
                border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                background: isDark ? '#374151' : '#f9fafb'
              }}
              muted
              onLoadedData={() => {
                // Video will be controlled by speech synthesis
              }}
              onTimeUpdate={(e) => {
                const video = e.target;
                if (video.duration && video.currentTime >= video.duration - 0.5) {
                  video.pause();
                  video.currentTime = 0;
                }
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Right Panel - Question & Answer Section */}
      <div style={{
        width: '30%',
        background: isDark ? '#1e293b' : '#ffffff',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontWeight: 'bold',
          color: '#1E90FF',
          fontSize: '20px',
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          Your question will appear here
        </h1>
        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          marginBottom: '16px',
          color: isDark ? '#94a3b8' : '#6b7280'
        }}>
          Analysis report will be sent to your email
        </p>
        <hr style={{ marginBottom: '24px', borderColor: isDark ? '#334155' : '#e5e7eb' }} />
        
        {/* Current Question */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            background: isDark ? 'rgba(30, 144, 255, 0.1)' : 'rgba(30, 144, 255, 0.05)',
            padding: '16px',
            borderRadius: '12px',
            border: `1px solid ${isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(30, 144, 255, 0.1)'}`
          }}>
            <h3 style={{
              fontWeight: '600',
              color: '#1E90FF',
              marginBottom: '8px',
              fontSize: '16px'
            }}>
              Question {currentIndex + 1} of {questions.length}
            </h3>
            <p style={{
              color: isDark ? '#e2e8f0' : '#1f2937',
              fontSize: '14px',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontWeight: '400',
              lineHeight: '1.6',
              letterSpacing: '0.01em'
            }}>
              {questions[currentIndex]}
            </p>
          </div>
        </div>
        
        {/* Answer Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: isDark ? '#e2e8f0' : '#374151',
            marginBottom: '8px'
          }}>
            Your Answer:
          </label>
          <div style={{ position: 'relative' }}>
            <textarea
              value={userAnswer}
              onChange={handleUserAnswerChange}
              style={{
                width: '100%',
                padding: '12px 40px 12px 12px',
                height: '128px',
                border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                borderRadius: '8px',
                background: isDark ? '#374151' : '#ffffff',
                color: isDark ? '#e2e8f0' : '#1f2937',
                fontSize: '16px',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontWeight: '400',
                lineHeight: '1.6',
                letterSpacing: '0.01em',
                resize: 'none',
                outline: 'none'
              }}
              placeholder="Type or speak your answer here..."
              onFocus={(e) => e.target.style.borderColor = '#1E90FF'}
              onBlur={(e) => e.target.style.borderColor = isDark ? '#374151' : '#d1d5db'}
            />
            <button
              onClick={startVoiceRecording}
              style={{
                position: 'absolute',
                right: '8px',
                top: '8px',
                width: '32px',
                height: '32px',
                border: 'none',
                borderRadius: '50%',
                background: isRecording ? '#ef4444' : '#1E90FF',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={isRecording ? 'Stop Recording' : 'Start Voice Input'}
            >
              {isRecording ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="2"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
                </svg>
              )}
            </button>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '12px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                background: isDark ? '#374151' : '#f3f4f6',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                color: '#1E90FF'
              }}>
                {currentIndex + 1}/{questions.length}
              </div>
              <span style={{
                fontSize: '13px',
                fontWeight: '500',
                color: isDark ? '#e2e8f0' : '#374151'
              }}>
                Progress
              </span>
            </div>
            <button
              style={{
                background: (loading || !userAnswer.trim()) ? '#9ca3af' : '#1E90FF',
                color: 'white',
                fontWeight: '600',
                padding: '8px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: (loading || !userAnswer.trim()) ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                opacity: (loading || !userAnswer.trim()) ? 0.5 : 1
              }}
              onClick={submitAnswer}
              disabled={loading || !userAnswer.trim()}
              onMouseEnter={(e) => {
                if (!loading && userAnswer.trim()) {
                  e.target.style.background = '#0066CC';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && userAnswer.trim()) {
                  e.target.style.background = '#1E90FF';
                }
              }}
            >
              {loading
                ? "Processing..."
                : currentIndex >= questions.length - 1
                ? "Finish Interview"
                : "Submit & Next"}
            </button>
          </div>
        </div>
        

      </div>
    </div>
  );
};

export default InterviewSession;