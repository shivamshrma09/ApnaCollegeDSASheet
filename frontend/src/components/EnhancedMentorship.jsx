import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const API_BASE_URL = 'https://plusdsa.onrender.com/api';

const EnhancedMentorship = () => {
  const { isDark } = useTheme();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWaitingList, setShowWaitingList] = useState(false);
  const [waitingListData, setWaitingListData] = useState({
    name: '',
    email: '',
    phone: '',
    mentorId: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/mentors`);
      setMentors(response.data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      // Fallback data
      setMentors([
        {
          _id: '1',
          name: 'Rahul Sharma',
          title: 'Senior Software Engineer at Google',
          description: 'Expert in Data Structures, Algorithms, and System Design. Helped 500+ students crack FAANG interviews.',
          rating: 4.9,
          experience: '5+ years',
          price: 2999,
          availability: 'Mon-Fri 7-9 PM',
          expertise: ['DSA', 'System Design', 'Java', 'Python'],
          sessions: 150,
          isActive: true
        },
        {
          _id: '2',
          name: 'Priya Singh',
          title: 'Software Engineer at Microsoft',
          description: 'Specialized in Frontend Development and Problem Solving. Passionate about teaching and mentoring.',
          rating: 4.8,
          experience: '4+ years',
          price: 2499,
          availability: 'Weekends 10-6 PM',
          expertise: ['React', 'JavaScript', 'DSA', 'Web Dev'],
          sessions: 120,
          isActive: true
        },
        {
          _id: '3',
          name: 'Arjun Patel',
          title: 'Tech Lead at Amazon',
          description: 'Full-stack developer with expertise in scalable systems. Mentor for competitive programming.',
          rating: 4.9,
          experience: '6+ years',
          price: 3499,
          availability: 'Mon-Wed 8-10 PM',
          expertise: ['System Design', 'AWS', 'Node.js', 'DSA'],
          sessions: 200,
          isActive: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleWaitingListSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/mentorship/waiting-list`, waitingListData);
      setShowSuccess(true);
      setWaitingListData({ name: '', email: '', phone: '', mentorId: '' });
      setTimeout(() => {
        setShowWaitingList(false);
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting waiting list:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const openWaitingList = (mentorId) => {
    setWaitingListData({ ...waitingListData, mentorId });
    setShowWaitingList(true);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: isDark ? '#0f172a' : '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #8b5cf6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        marginBottom: '40px'
      }}>
        <div style={{
          background: isDark 
            ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
            : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)'
          }} />
          
          <h1 style={{
            color: 'white',
            fontSize: '48px',
            fontWeight: '900',
            margin: '0 0 16px 0',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
          }}>
            🚀 Premium Mentorship
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '20px',
            margin: '0 0 24px 0',
            maxWidth: '600px',
            margin: '0 auto 24px auto'
          }}>
            Get personalized guidance from industry experts at top tech companies. 
            Accelerate your coding journey with 1-on-1 mentorship.
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap',
            marginTop: '30px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'white' }}>500+</div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>Students Mentored</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'white' }}>95%</div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>Success Rate</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'white' }}>4.9⭐</div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '30px'
      }}>
        {mentors.map(mentor => (
          <div key={mentor._id} style={{
            background: isDark 
              ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '20px',
            padding: '30px',
            border: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
            boxShadow: isDark 
              ? '0 20px 40px rgba(0, 0, 0, 0.3)'
              : '0 20px 40px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = isDark 
              ? '0 30px 60px rgba(0, 0, 0, 0.4)'
              : '0 30px 60px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = isDark 
              ? '0 20px 40px rgba(0, 0, 0, 0.3)'
              : '0 20px 40px rgba(0, 0, 0, 0.1)';
          }}
          >
            {/* Background Pattern */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              opacity: 0.05
            }} />

            {/* Status Badge */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '6px 12px',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'white',
                animation: 'pulse 2s infinite'
              }} />
              Available
            </div>

            {/* Mentor Avatar & Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '32px',
                fontWeight: '800',
                border: '4px solid rgba(139, 92, 246, 0.2)'
              }}>
                {mentor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 style={{
                  color: isDark ? 'white' : '#0f172a',
                  fontSize: '24px',
                  fontWeight: '800',
                  margin: '0 0 8px 0'
                }}>
                  {mentor.name}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px'
                }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{
                        color: i < Math.floor(mentor.rating) ? '#fbbf24' : '#d1d5db',
                        fontSize: '16px'
                      }}>★</span>
                    ))}
                  </div>
                  <span style={{
                    color: isDark ? '#fbbf24' : '#d97706',
                    fontSize: '16px',
                    fontWeight: '700'
                  }}>
                    {mentor.rating}
                  </span>
                  <span style={{
                    color: isDark ? '#94a3b8' : '#64748b',
                    fontSize: '14px'
                  }}>
                    ({mentor.sessions} sessions)
                  </span>
                </div>
                <p style={{
                  color: isDark ? '#94a3b8' : '#64748b',
                  fontSize: '14px',
                  fontWeight: '600',
                  margin: 0
                }}>
                  {mentor.title}
                </p>
              </div>
            </div>

            {/* Description */}
            <p style={{
              color: isDark ? '#cbd5e1' : '#475569',
              fontSize: '15px',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              {mentor.description}
            </p>

            {/* Expertise Tags */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '20px'
            }}>
              {mentor.expertise?.map((skill, index) => (
                <span key={index} style={{
                  padding: '6px 12px',
                  background: isDark 
                    ? 'rgba(139, 92, 246, 0.2)'
                    : 'rgba(139, 92, 246, 0.1)',
                  color: '#8b5cf6',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: '1px solid rgba(139, 92, 246, 0.3)'
                }}>
                  {skill}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              background: isDark 
                ? 'rgba(139, 92, 246, 0.1)'
                : 'rgba(139, 92, 246, 0.05)',
              borderRadius: '12px',
              marginBottom: '20px',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#8b5cf6'
                }}>
                  ₹{mentor.price}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: isDark ? '#94a3b8' : '#64748b'
                }}>
                  Per Session
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: isDark ? 'white' : '#0f172a'
                }}>
                  {mentor.availability}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: isDark ? '#94a3b8' : '#64748b'
                }}>
                  Available
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => openWaitingList(mentor._id)}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 30px rgba(139, 92, 246, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.4)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,6L12.5,7.5L17,3L22,8L20.5,9.5L17,6L12.5,10.5L11,9M7,14H17V16H7V14Z"/>
              </svg>
              Book Session - Join Waiting List
            </button>
          </div>
        ))}
      </div>

      {/* Waiting List Modal */}
      {showWaitingList && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            background: isDark 
              ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '20px',
            padding: '40px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)',
            border: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowWaitingList(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ef4444'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
              </svg>
            </button>

            {showSuccess ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
                  </svg>
                </div>
                <h3 style={{
                  color: isDark ? 'white' : '#0f172a',
                  fontSize: '24px',
                  fontWeight: '800',
                  marginBottom: '16px'
                }}>
                  You're in the Waiting List! 🎉
                </h3>
                <p style={{
                  color: isDark ? '#94a3b8' : '#64748b',
                  fontSize: '16px',
                  lineHeight: '1.6'
                }}>
                  Thank you for your interest! Our team will contact you soon with available slots and next steps.
                </p>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <h3 style={{
                    color: isDark ? 'white' : '#0f172a',
                    fontSize: '28px',
                    fontWeight: '800',
                    marginBottom: '8px'
                  }}>
                    Join Waiting List
                  </h3>
                  <p style={{
                    color: isDark ? '#94a3b8' : '#64748b',
                    fontSize: '16px'
                  }}>
                    Fill out the form below and we'll contact you soon!
                  </p>
                </div>

                <form onSubmit={handleWaitingListSubmit}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      color: isDark ? '#e2e8f0' : '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={waitingListData.name}
                      onChange={(e) => setWaitingListData({...waitingListData, name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: isDark ? '1px solid #475569' : '1px solid #d1d5db',
                        background: isDark ? '#374151' : 'white',
                        color: isDark ? 'white' : '#374151',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#8b5cf6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = isDark ? '#475569' : '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      color: isDark ? '#e2e8f0' : '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={waitingListData.email}
                      onChange={(e) => setWaitingListData({...waitingListData, email: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: isDark ? '1px solid #475569' : '1px solid #d1d5db',
                        background: isDark ? '#374151' : 'white',
                        color: isDark ? 'white' : '#374151',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#8b5cf6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = isDark ? '#475569' : '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                    <label style={{
                      display: 'block',
                      color: isDark ? '#e2e8f0' : '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={waitingListData.phone}
                      onChange={(e) => setWaitingListData({...waitingListData, phone: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: isDark ? '1px solid #475569' : '1px solid #d1d5db',
                        background: isDark ? '#374151' : 'white',
                        color: isDark ? 'white' : '#374151',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#8b5cf6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = isDark ? '#475569' : '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitLoading}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: submitLoading 
                        ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                        : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: submitLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: submitLoading ? 'none' : '0 8px 20px rgba(139, 92, 246, 0.4)'
                    }}
                  >
                    {submitLoading ? (
                      <>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
                        </svg>
                        Join Waiting List
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

export default EnhancedMentorship;