import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import MockInterviewSystem from './MockInterviewSystem';

const InterviewPage = () => {
  const { isDark } = useTheme();
  const [showMockInterview, setShowMockInterview] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#000000' : '#ffffff'
    }}>
      {/* Header */}
      <div style={{
        background: isDark ? '#1a1a1a' : '#ffffff',
        borderBottom: `1px solid ${isDark ? '#333333' : '#e2e8f0'}`,
        padding: '20px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#1e90ff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M21,9V7H15L13.5,7.5C13.1,7.4 12.6,7.5 12.1,7.8L10.5,9H3V11H9L10.5,9.5C10.9,9.6 11.4,9.5 11.9,9.2L13.5,7.5H21M7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13Z"/>
                </svg>
              </div>
              <img 
                src={isDark ? '/dark.png' : '/light.png'} 
                alt="DSA Sheet" 
                style={{ height: '40px', width: 'auto' }} 
              />
            </div>
          </div>
          <button
            onClick={() => setShowMockInterview(true)}
            style={{
              background: '#1e90ff',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: isDark ? 'none' : '0 2px 8px rgba(30, 144, 255, 0.2)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#0066CC';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#1e90ff';
            }}
          >
            Start Interview
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          padding: '80px 0',
          background: isDark 
            ? 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
          marginBottom: '80px'
        }}>
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '60px'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(30, 144, 255, 0.05)',
                padding: '8px 16px',
                borderRadius: '50px',
                marginBottom: '24px',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(30, 144, 255, 0.1)'}`
              }}>
                <span style={{
                  fontSize: '14px',
                  color: '#1E90FF',
                  fontWeight: '500'
                }}>🚀 AI-Powered Interview Practice</span>
              </div>
              
              <h1 style={{
                fontSize: '56px',
                fontWeight: '800',
                color: '#000000',
                marginBottom: '16px',
                lineHeight: '1.1',
                letterSpacing: '-0.02em'
              }}>
                DSA Mock Interview <span style={{ color: '#1e90ff' }}>Hub</span>
              </h1>
              <p style={{
                fontSize: '20px',
                color: isDark ? '#cccccc' : '#64748b',
                marginBottom: '32px',
                lineHeight: '1.6',
                maxWidth: '600px'
              }}>
                Practice your technical interviews with AI-powered questions tailored to your experience and target companies.
              </p>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setShowMockInterview(true)}
                  style={{
                    background: '#1e90ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: isDark ? 'none' : '0 4px 12px rgba(30, 144, 255, 0.2)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#0066CC';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#1e90ff';
                  }}
                >
                  Start Mock Interview
                </button>
              </div>
              
              {/* Pro Tip */}
              <div style={{
                background: isDark 
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(16, 185, 129, 0.02))',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(34, 197, 94, 0.1)'}`,
                borderRadius: '12px',
                padding: '16px 20px',
                marginTop: '24px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                maxWidth: '500px'
              }}>
                <div style={{
                  fontSize: '20px',
                  flexShrink: 0
                }}>💡</div>
                <div>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#22c55e',
                    marginRight: '8px'
                  }}>
                    Pro Tip:
                  </span>
                  <span style={{
                    fontSize: '14px',
                    color: isDark ? '#cccccc' : '#64748b',
                    lineHeight: '1.4'
                  }}>
                    Upload your resume for more personalized questions based on your actual experience and skills.
                  </span>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <img src="/mockkk2.png" alt="DSA Mock Interview" style={{ 
                width: '100%', 
                maxWidth: '400px', 
                height: 'auto', 
                objectFit: 'contain',
                filter: isDark ? 'brightness(0.9)' : 'none'
              }} />
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: isDark ? 'white' : '#1f2937',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Why Choose Our Mock Interview Hub?
          </h2>
          <p style={{
            fontSize: '18px',
            color: isDark ? '#cccccc' : '#64748b',
            textAlign: 'center',
            marginBottom: '48px',
            maxWidth: '600px',
            margin: '0 auto 48px auto'
          }}>
            Experience AI-powered interview practice that adapts to your skills and career goals
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                title: 'AI-Powered Questions',
                desc: 'Personalized questions based on your resume and target company.',
                icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="#1e90ff"><path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M21,9V7H15L13.5,7.5C13.1,7.4 12.6,7.5 12.1,7.8L10.5,9H3V11H9L10.5,9.5C10.9,9.6 11.4,9.5 11.9,9.2L13.5,7.5H21M7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13Z"/></svg>
              },
              {
                title: '10-Parameter Analysis',
                desc: 'Each answer analyzed on 10 key parameters with detailed scoring.',
                icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="#1e90ff"><path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z"/></svg>
              },
              {
                title: 'Performance Tracking',
                desc: 'Track interview history, trends, and company-wise statistics.',
                icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="#1e90ff"><path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/></svg>
              },
              {
                title: 'Salary Prediction',
                desc: 'AI-powered salary estimation based on your performance.',
                icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="#1e90ff"><path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/></svg>
              }
            ].map((feature, index) => (
              <div key={index} style={{
                padding: '24px',
                background: isDark ? '#2a2a2a' : 'white',
                border: `1px solid ${isDark ? '#444444' : '#e5e7eb'}`,
                borderRadius: '12px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = isDark ? 'none' : '0 8px 25px rgba(30, 144, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ marginBottom: '16px' }}>{feature.icon}</div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: isDark ? 'white' : '#1f2937',
                  marginBottom: '12px'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: isDark ? '#cccccc' : '#6b7280',
                  lineHeight: '1.6'
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* How It Works */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: isDark ? 'white' : '#1f2937',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            How It Works
          </h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0px',
            flexWrap: 'wrap'
          }}>
            {[
              {
                step: '1',
                title: 'Upload Resume',
                desc: 'Upload your resume for personalized questions based on your experience.'
              },
              {
                step: '2',
                title: 'Choose Company',
                desc: 'Select your target company and role for tailored interview questions.'
              },
              {
                step: '3',
                title: 'Take Interview',
                desc: 'Answer AI-generated questions in a realistic interview environment.'
              },
              {
                step: '4',
                title: 'Get Analysis',
                desc: 'Receive detailed feedback and performance analysis via email.'
              }
            ].map((step, index) => (
              <React.Fragment key={index}>
                <div style={{
                  padding: '24px',
                  background: isDark ? '#2a2a2a' : 'white',
                  border: `1px solid ${isDark ? '#444444' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  textAlign: 'center',
                  position: 'relative',
                  minWidth: '200px',
                  maxWidth: '250px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#1e90ff',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '700',
                    margin: '0 auto 16px auto'
                  }}>
                    {step.step}
                  </div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: isDark ? 'white' : '#1f2937',
                    marginBottom: '8px'
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: isDark ? '#cccccc' : '#6b7280',
                    lineHeight: '1.4'
                  }}>
                    {step.desc}
                  </p>
                </div>
                {index < 3 && (
                  <div style={{
                    width: '60px',
                    height: '2px',
                    background: `linear-gradient(90deg, transparent 0%, #1e90ff 50%, transparent 100%)`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '2px',
                      background: '#1e90ff',
                      position: 'absolute',
                      animation: 'flowLine 2s ease-in-out infinite'
                    }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Company Logos */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: isDark ? 'white' : '#1f2937',
            marginBottom: '32px'
          }}>Practice for top companies</h2>
          
          <div style={{
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {[
              { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
              { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
              { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
              { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
              { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' },
              { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
              { name: 'Tesla', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg' }
            ].map((company, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 24px',
                background: isDark ? '#2a2a2a' : 'white',
                border: `1px solid ${isDark ? '#444444' : '#e5e7eb'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '140px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <img 
                  src={company.logo} 
                  alt={company.name} 
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    objectFit: 'contain',
                    filter: isDark && company.name === 'Apple' ? 'invert(1)' : 'none'
                  }} 
                />
                <span style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: isDark ? '#e0e0e0' : '#374151'
                }}>
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {showMockInterview && (
        <MockInterviewSystem 
          onClose={() => setShowMockInterview(false)}
          isDark={isDark}
        />
      )}

      <style>
        {`
          @keyframes flowLine {
            0% { transform: translateX(-20px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(60px); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default InterviewPage;