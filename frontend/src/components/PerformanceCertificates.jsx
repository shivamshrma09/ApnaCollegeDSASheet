import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

const API_BASE_URL = 'https://plusdsa.onrender.com/api';

const PerformanceCertificates = ({ userId }) => {
  const [certificateData, setCertificateData] = useState({
    apnaCollege: null,
    loveBabbar: null
  });
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    if (userId) {
      fetchCertificateData();
      fetchWeeklyReport();
    }
  }, [userId]);

  const fetchCertificateData = async () => {
    try {
      const [apnaResponse, loveBabbarResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/certificates/eligibility/${userId}/apnaCollege`),
        axios.get(`${API_BASE_URL}/certificates/eligibility/${userId}/loveBabbar`)
      ]);
      
      setCertificateData({
        apnaCollege: apnaResponse.data,
        loveBabbar: loveBabbarResponse.data
      });
    } catch (error) {
      console.error('Error fetching certificate data:', error);
    }
  };

  const fetchWeeklyReport = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/progress/weekly-report/${userId}`);
      setWeeklyReport(response.data);
    } catch (error) {
      console.error('Error fetching weekly report:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async (sheetType) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/certificates/download/${userId}/${sheetType}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DSA_Certificate_${sheetType}.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Error downloading certificate. Please try again.');
    }
  };

  const emailCertificate = async (sheetType) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/certificates/email/${userId}/${sheetType}`);
      alert('🎉 Certificate sent to your email successfully!');
    } catch (error) {
      console.error('Error emailing certificate:', error);
      alert('Error sending certificate email. Please try again.');
    }
  };

  const downloadWeeklyReport = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/progress/weekly-report/${userId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Weekly_Progress_Report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading weekly report:', error);
    }
  };

  const emailWeeklyReport = async () => {
    try {
      await axios.post(`${API_BASE_URL}/progress/weekly-report/${userId}/email`);
      alert('Weekly report sent to your email!');
    } catch (error) {
      console.error('Error emailing weekly report:', error);
      alert('Failed to send email. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        color: isDark ? '#9ca3af' : '#6b7280'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>⏳</div>
          <div>Loading performance data...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '24px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Certificates Section */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '24px' 
        }}>
          <div style={{ fontSize: '32px' }}>🏆</div>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            margin: 0,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Performance Certificates
          </h2>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '24px' 
        }}>
          {/* Striver Blind75 Certificate */}
          <div style={{
            background: isDark 
              ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))'
              : 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(59, 130, 246, 0.08))',
            border: `3px solid ${certificateData.apnaCollege?.eligible ? '#22c55e' : isDark ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.3)'}`,
            borderRadius: '20px',
            padding: '28px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.3)' : '0 20px 40px rgba(139, 92, 246, 0.15)',
            transform: 'translateY(0)',
            transition: 'all 0.3s ease'
          }}>
            {/* Decorative Elements */}
            <div style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '120px',
              height: '120px',
              background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
              borderRadius: '50%',
              opacity: '0.1'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-40px',
              left: '-40px',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
              borderRadius: '50%',
              opacity: '0.08'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Header with Logo */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '20px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)'
                  }}>🎯</div>
                  <div>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: '700', 
                      margin: 0,
                      background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      DSA Certificate
                    </h3>
                    <div style={{
                      fontSize: '12px',
                      color: isDark ? '#9ca3af' : '#6b7280',
                      fontWeight: '500'
                    }}>Striver Blind75</div>
                  </div>
                </div>
                <div style={{
                  padding: '6px 12px',
                  background: certificateData.apnaCollege?.eligible 
                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                    : 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {certificateData.apnaCollege?.eligible ? '🔓 UNLOCKED' : '🔒 LOCKED'}
                </div>
              </div>
              
              {/* Progress Section */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    fontSize: '14px',
                    color: isDark ? '#d1d5db' : '#374151',
                    fontWeight: '600'
                  }}>Progress</span>
                  <span style={{ 
                    fontSize: '24px', 
                    fontWeight: '800',
                    background: certificateData.apnaCollege?.eligible 
                      ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                      : 'linear-gradient(135deg, #ef4444, #dc2626)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {certificateData.apnaCollege?.completionPercentage || '0.0'}%
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: isDark ? '#374151' : '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: `${certificateData.apnaCollege?.completionPercentage || 0}%`,
                    height: '100%',
                    background: certificateData.apnaCollege?.eligible 
                      ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                      : 'linear-gradient(90deg, #ef4444, #dc2626)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
                
                <div style={{ 
                  fontSize: '13px',
                  color: certificateData.apnaCollege?.eligible ? '#22c55e' : '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '500'
                }}>
                  {certificateData.apnaCollege?.eligible ? '🎉' : '⚡'}
                  {certificateData.apnaCollege?.eligible 
                    ? 'Congratulations! Certificate ready to download' 
                    : 'Complete 80% to unlock your certificate'
                  }
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => downloadCertificate('apnaCollege')}
                  disabled={!certificateData.apnaCollege?.eligible}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: certificateData.apnaCollege?.eligible 
                      ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)'
                      : isDark ? '#374151' : '#e5e7eb',
                    color: certificateData.apnaCollege?.eligible ? 'white' : isDark ? '#9ca3af' : '#6b7280',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: certificateData.apnaCollege?.eligible ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>📎</span>
                  Download
                </button>
                <button
                  onClick={() => emailCertificate('apnaCollege')}
                  disabled={!certificateData.apnaCollege?.eligible}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: certificateData.apnaCollege?.eligible 
                      ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                      : isDark ? '#374151' : '#e5e7eb',
                    color: certificateData.apnaCollege?.eligible ? 'white' : isDark ? '#9ca3af' : '#6b7280',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: certificateData.apnaCollege?.eligible ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>📧</span>
                  Email PDF
                </button>
              </div>
            </div>
          </div>

          {/* Love Babbar Certificate */}
          <div style={{
            background: isDark 
              ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(59, 130, 246, 0.15))'
              : 'linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(59, 130, 246, 0.08))',
            border: `3px solid ${certificateData.loveBabbar?.eligible ? '#22c55e' : isDark ? 'rgba(236, 72, 153, 0.4)' : 'rgba(236, 72, 153, 0.3)'}`,
            borderRadius: '20px',
            padding: '28px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.3)' : '0 20px 40px rgba(236, 72, 153, 0.15)',
            transform: 'translateY(0)',
            transition: 'all 0.3s ease'
          }}>
            {/* Decorative Elements */}
            <div style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '120px',
              height: '120px',
              background: 'linear-gradient(45deg, #ec4899, #3b82f6)',
              borderRadius: '50%',
              opacity: '0.1'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-40px',
              left: '-40px',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(45deg, #3b82f6, #ec4899)',
              borderRadius: '50%',
              opacity: '0.08'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Header with Logo */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '20px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #ec4899, #3b82f6)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    boxShadow: '0 8px 20px rgba(236, 72, 153, 0.3)'
                  }}>💻</div>
                  <div>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: '700', 
                      margin: 0,
                      background: 'linear-gradient(135deg, #ec4899, #3b82f6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      DSA Certificate
                    </h3>
                    <div style={{
                      fontSize: '12px',
                      color: isDark ? '#9ca3af' : '#6b7280',
                      fontWeight: '500'
                    }}>Love Babbar Sheet</div>
                  </div>
                </div>
                <div style={{
                  padding: '6px 12px',
                  background: certificateData.loveBabbar?.eligible 
                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                    : 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {certificateData.loveBabbar?.eligible ? '🔓 UNLOCKED' : '🔒 LOCKED'}
                </div>
              </div>
              
              {/* Progress Section */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    fontSize: '14px',
                    color: isDark ? '#d1d5db' : '#374151',
                    fontWeight: '600'
                  }}>Progress</span>
                  <span style={{ 
                    fontSize: '24px', 
                    fontWeight: '800',
                    background: certificateData.loveBabbar?.eligible 
                      ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                      : 'linear-gradient(135deg, #ef4444, #dc2626)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {certificateData.loveBabbar?.completionPercentage || '0.0'}%
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: isDark ? '#374151' : '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: `${certificateData.loveBabbar?.completionPercentage || 0}%`,
                    height: '100%',
                    background: certificateData.loveBabbar?.eligible 
                      ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                      : 'linear-gradient(90deg, #ef4444, #dc2626)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
                
                <div style={{ 
                  fontSize: '13px',
                  color: certificateData.loveBabbar?.eligible ? '#22c55e' : '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '500'
                }}>
                  {certificateData.loveBabbar?.eligible ? '🎉' : '⚡'}
                  {certificateData.loveBabbar?.eligible 
                    ? 'Congratulations! Certificate ready to download' 
                    : 'Complete 80% to unlock your certificate'
                  }
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => downloadCertificate('loveBabbar')}
                  disabled={!certificateData.loveBabbar?.eligible}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: certificateData.loveBabbar?.eligible 
                      ? 'linear-gradient(135deg, #ec4899, #3b82f6)'
                      : isDark ? '#374151' : '#e5e7eb',
                    color: certificateData.loveBabbar?.eligible ? 'white' : isDark ? '#9ca3af' : '#6b7280',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: certificateData.loveBabbar?.eligible ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>📎</span>
                  Download
                </button>
                <button
                  onClick={() => emailCertificate('loveBabbar')}
                  disabled={!certificateData.loveBabbar?.eligible}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: certificateData.loveBabbar?.eligible 
                      ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                      : isDark ? '#374151' : '#e5e7eb',
                    color: certificateData.loveBabbar?.eligible ? 'white' : isDark ? '#9ca3af' : '#6b7280',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: certificateData.loveBabbar?.eligible ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>📧</span>
                  Email PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Report Section */}
      <div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '24px' 
        }}>
          <div style={{ fontSize: '32px' }}>📈</div>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            margin: 0,
            background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Weekly Progress Report
          </h2>
        </div>

        <div style={{
          background: isDark 
            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))'
            : 'linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(59, 130, 246, 0.05))',
          border: `2px solid ${isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'}`,
          borderRadius: '20px',
          padding: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '200px',
            height: '200px',
            background: 'linear-gradient(45deg, #22c55e, #3b82f6)',
            borderRadius: '50%',
            opacity: '0.05'
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Stats Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
              gap: '20px',
              marginBottom: '32px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '36px', 
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {weeklyReport?.stats?.problemsSolved || 15}
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: isDark ? '#9ca3af' : '#6b7280',
                  fontWeight: '500'
                }}>
                  Problems Solved
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '36px', 
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #22c55e, #10b981)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {weeklyReport?.stats?.timeSpent || 12.5}h
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: isDark ? '#9ca3af' : '#6b7280',
                  fontWeight: '500'
                }}>
                  Time Spent
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '36px', 
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {weeklyReport?.stats?.accuracy || 85}%
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: isDark ? '#9ca3af' : '#6b7280',
                  fontWeight: '500'
                }}>
                  Accuracy
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '36px', 
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {weeklyReport?.stats?.currentStreak || 5}
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: isDark ? '#9ca3af' : '#6b7280',
                  fontWeight: '500'
                }}>
                  Day Streak
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              flexWrap: 'wrap',
              marginBottom: '24px'
            }}>
              <button
                onClick={downloadWeeklyReport}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: '1',
                  minWidth: '160px',
                  justifyContent: 'center'
                }}
              >
                <span>📥</span>
                Download Report
              </button>

              <button
                onClick={emailWeeklyReport}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: '1',
                  minWidth: '160px',
                  justifyContent: 'center'
                }}
              >
                <span>📧</span>
                Email Report
              </button>
            </div>

            {/* Report Schedule */}
            <div style={{ 
              fontSize: '14px', 
              color: isDark ? '#9ca3af' : '#6b7280',
              textAlign: 'center',
              padding: '16px',
              background: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.5)',
              borderRadius: '12px'
            }}>
              Last report: 8/23/2025 • Next report: 9/6/2025
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCertificates;