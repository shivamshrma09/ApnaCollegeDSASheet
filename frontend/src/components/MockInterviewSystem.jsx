import React, { useState } from 'react';
import InterviewForm from './InterviewForm';
import InterviewSession from './InterviewSession';
// import { useAPIFailover } from '../hooks/useAPIFailover';

const MockInterviewSystem = ({ isDark, onClose }) => {
  const [step, setStep] = useState('landing');
  const [formData, setFormData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  // const { makeFailoverRequest, generateInterviewQuestion, isLoading: apiLoading, error: apiError, currentAPI } = useAPIFailover();

  const tryFailoverAPIs = async (formData, resumeText) => {
    // Only use Gemini API - no other APIs needed
    return null;
  };

  const extractResumeText = async (file) => {
    try {
      if (file.type === 'application/pdf') {
        const { extractPDFText } = await import('../utils/pdfExtractor');
        return await extractPDFText(file);
      } else {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsText(file);
        });
      }
    } catch (error) {
      console.error('Resume extraction error:', error);
      return 'Failed to extract resume content';
    }
  };

  const generateQuestionsWithGemini = async (formData) => {
    const skillsList = formData.skills.split(',').map(s => s.trim());
    const primarySkill = skillsList[0] || 'programming';
    
    // Fallback questions
    const fallbackQuestions = [
      `Tell me about your experience with ${primarySkill} and how you've used it in projects.`,
      `How would you approach solving a complex technical problem at ${formData.companyName}?`,
      `Describe a challenging project you've worked on. What was your role and how did you overcome obstacles?`,
      `What interests you about the ${formData.position} role at ${formData.companyName}? Why this company?`,
      `Walk me through your problem-solving process when debugging code.`,
      `How do you stay updated with the latest technologies in your field?`,
      `What are your career goals for the next 2-3 years?`,
      `Do you have any questions about ${formData.companyName} or this role?`
    ];

    try {
      console.log('🚀 Sending request to backend with resume...');
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('companyName', formData.companyName);
      formDataToSend.append('position', formData.position);
      formDataToSend.append('experience', formData.experience);
      formDataToSend.append('skills', formData.skills);
      formDataToSend.append('interviewRound', formData.interviewRound);
      formDataToSend.append('additionalNotes', formData.additionalNotes || '');
      
      // Add resume file if present
      if (formData.resume) {
        formDataToSend.append('resume', formData.resume);
        console.log('📄 Resume file attached:', formData.resume.name);
      }
      
      const backendResponse = await fetch(`${import.meta.env.VITE_API_URL || `http://localhost:${import.meta.env.VITE_PORT || 5001}/api`}/mock-interview/start`, {
        method: 'POST',
        headers: {
          'userid': 'anonymous'
        },
        body: formDataToSend
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        console.log('✅ Backend response:', data);
        
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          console.log(`🎯 Generated ${data.questions.length} questions (${data.source})`);
          if (data.resumeProcessed) {
            console.log(`📄 Resume processed: ${data.skillsExtracted} skills, ${data.experienceDetected} years exp`);
          }
          return data.questions;
        }
      } else {
        const errorData = await backendResponse.json();
        console.error('❌ Backend error:', errorData);
        throw new Error(errorData.message || 'Failed to generate questions');
      }
    } catch (error) {
      console.error('❌ Request failed:', error.message);
      throw error;
    }
    
    throw new Error('No questions generated');
  };

  const handleFormSubmit = async (submittedData) => {
    setLoading(true);
    setFormData(submittedData);
    
    try {
      if (!submittedData.name || !submittedData.email || !submittedData.companyName || !submittedData.position) {
        throw new Error('Please fill in all required fields');
      }
      
      const generatedQuestions = await generateQuestionsWithGemini(submittedData);
      setQuestions(generatedQuestions);
      setStep('session');
    } catch (error) {
      console.error('Form submission error');
      alert('Unable to generate questions. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateEmailReport = async (answers) => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key not configured');
      }
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate a comprehensive interview analysis report for ${encodeURIComponent(formData.name)} who interviewed for ${encodeURIComponent(formData.position)} at ${encodeURIComponent(formData.companyName)}.
              
              Analyze each answer on these 10 parameters (Score 1-10 each):
              1. Technical Accuracy - Correctness of technical concepts
              2. Communication Clarity - How clearly ideas were expressed  
              3. Problem-Solving Approach - Logical thinking process
              4. Depth of Knowledge - Understanding of subject matter
              5. Practical Experience - Real-world application examples
              6. Confidence Level - Assurance in responses
              7. Structure & Organization - Well-organized answers
              8. Relevance to Role - Alignment with job requirements
              9. Innovation & Creativity - Unique insights or solutions
              10. Professional Maturity - Industry awareness and professionalism
              
              Questions and Answers:
              ${answers.map((item, index) => `Q${index + 1}: ${encodeURIComponent(item.question)}\nA${index + 1}: ${encodeURIComponent(item.answer)}`).join('\n\n')}
              
              Provide:
              - Overall Performance Score (1-100)
              - Detailed analysis for each question with 10-parameter scoring
              - Strengths and improvement areas
              - Salary prediction based on performance
              - Personalized improvement roadmap
              - PDF report summary
              
              Format as a professional email report with clear sections.`
            }]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          return data.candidates[0].content.parts[0].text;
        }
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
    
    throw new Error('Unable to generate analysis report. Please try again later.');
  };

  const handleInterviewComplete = async (answers) => {
    setLoading(true);
    
    try {
      console.log('📧 Submitting interview for email analysis...');
      
      // Send to backend for analysis and email
      const response = await fetch(`${import.meta.env.VITE_API_URL || `http://localhost:${import.meta.env.VITE_PORT || 5001}/api`}/mock-interview/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'userid': localStorage.getItem('userId') || 'anonymous'
        },
        body: JSON.stringify({
          formData: formData,
          questionsAndAnswers: answers
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Interview submitted successfully');
        console.log('📧 Email report status:', result.reportSent ? 'Sent' : 'Failed');
        
        setResult({
          score: result.overallScore,
          analysis: result.analysis,
          reportSent: result.reportSent,
          totalQuestions: questions.length,
          emailStatus: result.reportSent
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit interview');
      }
      
      setStep('result');
    } catch (error) {
      console.error('❌ Error processing interview:', error);
      alert(`Failed to process interview: ${error.message}. Please try again.`);
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
          backgroundColor: isDark ? '#1e293b' : 'white',
          padding: '40px',
          borderRadius: '16px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          maxWidth: '400px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #1E90FF',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <h3 style={{ 
            color: isDark ? 'white' : '#1f2937', 
            fontSize: '18px', 
            margin: '0 0 8px 0',
            fontWeight: '600'
          }}>
            {step === 'form' ? 'Generating Questions' : 'Processing Interview'}
          </h3>
          <p style={{ 
            color: isDark ? '#94a3b8' : '#6b7280', 
            fontSize: '14px', 
            margin: 0,
            lineHeight: '1.4'
          }}>
            {step === 'form' 
              ? 'Generating personalized interview questions...' 
              : 'Analyzing your responses and generating detailed feedback...'}
          </p>
          <div style={{
            marginTop: '16px',
            padding: '8px 16px',
            backgroundColor: isDark ? 'rgba(30, 144, 255, 0.1)' : 'rgba(30, 144, 255, 0.05)',
            borderRadius: '20px',
            fontSize: '12px',
            color: '#1E90FF'
          }}>
            This should take just a few seconds
          </div>
        </div>
      </div>
    );
  }

  if (step === 'landing') {
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
        justifyContent: 'center',
        padding: '16px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1000px',
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              zIndex: 10
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>

          <div style={{ display: 'flex', minHeight: '600px' }}>
            {/* Left Content */}
            <div style={{ flex: 1, padding: '60px 40px' }}>
              <h1 style={{
                fontSize: '42px',
                fontWeight: '600',
                color: isDark ? 'white' : '#0f172a',
                marginBottom: '16px',
                lineHeight: '1.1'
              }}>
                Mock Interview
                <span style={{
                  background: 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'block'
                }}>
                  Hub
                </span>
              </h1>
              <p style={{
                fontSize: '16px',
                color: isDark ? '#94a3b8' : '#64748b',
                marginBottom: '32px',
                lineHeight: '1.6'
              }}>
                Practice your technical interviews with AI-powered questions tailored to your experience and target companies.
              </p>

              {/* Feature Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                marginBottom: '32px'
              }}>
                <div style={{
                  padding: '20px',
                  background: isDark ? '#1e293b' : '#f8fafc',
                  border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '12px'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1E90FF" style={{ marginBottom: '8px' }}>
                    <path d="M12,2A2,2 0 0,1 14,4C14,6.21 12.79,8.07 11.06,8.85C11.72,10.16 12.97,11.14 14.5,11.5C15.5,11.71 16.5,12.5 16.5,13.5V15.5C16.5,16.33 15.83,17 15,17H9C8.17,17 7.5,16.33 7.5,15.5V13.5C7.5,12.5 8.5,11.71 9.5,11.5C11.03,11.14 12.28,10.16 12.94,8.85C11.21,8.07 10,6.21 10,4A2,2 0 0,1 12,2M12,4A1,1 0 0,0 11,5A1,1 0 0,0 12,6A1,1 0 0,0 13,5A1,1 0 0,0 12,4Z"/>
                  </svg>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: isDark ? 'white' : '#1f2937',
                    marginBottom: '4px'
                  }}>
                    AI-Powered Questions
                  </h3>
                  <p style={{
                    fontSize: '12px',
                    color: isDark ? '#9ca3af' : '#6b7280',
                    lineHeight: '1.4',
                    margin: 0
                  }}>
                    Personalized questions based on your resume and target company.
                  </p>
                </div>

                <div style={{
                  padding: '20px',
                  background: isDark ? '#1e293b' : '#f8fafc',
                  border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '12px'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1E90FF" style={{ marginBottom: '8px' }}>
                    <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z"/>
                  </svg>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: isDark ? 'white' : '#1f2937',
                    marginBottom: '4px'
                  }}>
                    10-Parameter Analysis
                  </h3>
                  <p style={{
                    fontSize: '12px',
                    color: isDark ? '#9ca3af' : '#6b7280',
                    lineHeight: '1.4',
                    margin: 0
                  }}>
                    Each answer analyzed on 10 key parameters with detailed scoring.
                  </p>
                </div>

                <div style={{
                  padding: '20px',
                  background: isDark ? '#1e293b' : '#f8fafc',
                  border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '12px'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1E90FF" style={{ marginBottom: '8px' }}>
                    <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/>
                  </svg>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: isDark ? 'white' : '#1f2937',
                    marginBottom: '4px'
                  }}>
                    Performance Tracking
                  </h3>
                  <p style={{
                    fontSize: '12px',
                    color: isDark ? '#9ca3af' : '#6b7280',
                    lineHeight: '1.4',
                    margin: 0
                  }}>
                    Track interview history, trends, and company-wise statistics.
                  </p>
                </div>

                <div style={{
                  padding: '20px',
                  background: isDark ? '#1e293b' : '#f8fafc',
                  border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '12px'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1E90FF" style={{ marginBottom: '8px' }}>
                    <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
                  </svg>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: isDark ? 'white' : '#1f2937',
                    marginBottom: '4px'
                  }}>
                    Salary Prediction
                  </h3>
                  <p style={{
                    fontSize: '12px',
                    color: isDark ? '#9ca3af' : '#6b7280',
                    lineHeight: '1.4',
                    margin: 0
                  }}>
                    AI-powered salary estimation based on your performance.
                  </p>
                </div>
              </div>

              {/* Pro Tip */}
              <div style={{
                background: isDark 
                  ? 'linear-gradient(135deg, rgba(30, 144, 255, 0.1), rgba(0, 102, 204, 0.05))'
                  : 'linear-gradient(135deg, rgba(30, 144, 255, 0.05), rgba(0, 102, 204, 0.02))',
                border: `1px solid ${isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(30, 144, 255, 0.1)'}`,
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1E90FF">
                  <path d="M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,11.05 8.23,12.81 10,13.58V16H14V13.58C15.77,12.81 17,11.05 17,9A5,5 0 0,0 12,4Z"/>
                </svg>
                <div>
                  <h4 style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: isDark ? 'white' : '#1f2937',
                    marginBottom: '2px'
                  }}>
                    Pro Tip:
                  </h4>
                  <p style={{
                    fontSize: '11px',
                    color: isDark ? '#94a3b8' : '#64748b',
                    margin: 0,
                    lineHeight: '1.3'
                  }}>
                    Upload your resume for more personalized questions based on your actual experience and skills.
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => setStep('form')}
                style={{
                  background: 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 28px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(30, 144, 255, 0.3)',
                  transition: 'all 0.2s ease',
                  marginBottom: '16px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(30, 144, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(30, 144, 255, 0.3)';
                }}
              >
                Start Mock Interview
              </button>

              {/* Industry Tags */}
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {['FAANG', 'Startup', 'Product', 'Service'].map((industry) => (
                  <span key={industry} style={{
                    padding: '4px 8px',
                    background: isDark ? '#1e293b' : '#f1f5f9',
                    color: isDark ? '#94a3b8' : '#64748b',
                    borderRadius: '16px',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}>
                    {industry}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Right Image */}
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '40px'
            }}>
              <img src="/mockkk2.png" alt="Mock Interview" style={{ 
                width: '100%', 
                maxWidth: '400px', 
                height: 'auto', 
                objectFit: 'contain',
                filter: isDark ? 'brightness(0.9)' : 'none'
              }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <InterviewForm
        isDark={isDark}
        onClose={onClose}
        onSubmit={handleFormSubmit}
      />
    );
  }

  if (step === 'session') {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000
      }}>
        <InterviewSession
          formData={formData}
          questions={questions}
          isDark={isDark}
          onComplete={handleInterviewComplete}
          currentQuestionIndex={0}
        />
      </div>
    );
  }

  if (step === 'result') {
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
        justifyContent: 'center',
        padding: '16px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '600px',
          backgroundColor: isDark ? '#1f2937' : 'white',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
            </svg>
          </div>
          
          <h2 style={{
            fontSize: '28px',
            fontWeight: '500',
            color: isDark ? 'white' : '#1f2937',
            marginBottom: '8px'
          }}>
            Interview Complete!
          </h2>
          
          <div style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: result.score >= 80 ? '#10b981' : result.score >= 60 ? '#f59e0b' : '#ef4444',
            marginBottom: '16px'
          }}>
            {result.score}/100
          </div>
          
          <p style={{
            fontSize: '16px',
            color: isDark ? '#9ca3af' : '#6b7280',
            marginBottom: '24px'
          }}>
            {result.emailStatus ? (
              <>
                ✅ Your comprehensive 10-parameter analysis report has been sent to <strong style={{ color: '#1E90FF' }}>{formData?.email}</strong>.
              </>
            ) : (
              <>
                ⚠️ Report generation completed. Please check your email or contact support if you don't receive it.
              </>
            )}
          </p>
          
          {result.analysis && (
            <div style={{
              backgroundColor: isDark ? '#374151' : '#f8fafc',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '12px' }}>Quick Summary:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '12px', background: isDark ? '#1f2937' : 'white', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: isDark ? '#9ca3af' : '#6b7280' }}>Salary Prediction</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981' }}>
                    {result.analysis.salaryPrediction?.range}
                  </div>
                </div>
                <div style={{ padding: '12px', background: isDark ? '#1f2937' : 'white', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: isDark ? '#9ca3af' : '#6b7280' }}>Interview Readiness</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1E90FF' }}>
                    {result.analysis.interviewReadiness?.split(' - ')[0]}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '14px', color: isDark ? '#d1d5db' : '#6b7280', lineHeight: '1.5' }}>
                <strong>Top Strengths:</strong> {result.analysis.strengths?.slice(0, 2).join(', ')}
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => {
                setStep('form');
                setFormData(null);
                setQuestions([]);
                setResult(null);
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: isDark ? '#374151' : '#f3f4f6',
                color: isDark ? '#d1d5db' : '#374151',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Take Another Interview
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(30, 144, 255, 0.3)'
              }}
            >
              Close
            </button>
          </div>
        </div>
        
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return null;
};

export default MockInterviewSystem;