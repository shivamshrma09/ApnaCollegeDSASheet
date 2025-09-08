import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const MentorshipPage = ({ isDark, onClose }) => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const trendingDomains = [
    'Software Engineering', 'Data Science', 'Product Management', 'UI/UX Design',
    'DevOps', 'Machine Learning', 'Blockchain', 'Mobile Development',
    'System Design', 'Career Guidance', 'Interview Preparation'
  ];

  const topCompanies = [
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' },
    { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
    { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' }
  ];

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/mentors');
      setMentors(response.data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      // Use mock data when API fails
      const mockMentors = [
        {
          _id: '1',
          name: 'Rahul Sharma',
          title: 'Senior Software Engineer at Google',
          expertise: ['React', 'Node.js', 'System Design'],
          description: 'Experienced full-stack developer with 8+ years at Google. Specialized in scalable web applications and mentoring junior developers.',
          rating: '4.9',
          experience: '8+ years',
          price: '2500',
          company: 'Google'
        },
        {
          _id: '2', 
          name: 'Priya Patel',
          title: 'Data Scientist at Microsoft',
          expertise: ['Python', 'Machine Learning', 'AI'],
          description: 'ML expert with 6 years at Microsoft. Helps professionals transition into data science and AI roles.',
          rating: '4.8',
          experience: '6+ years', 
          price: '2000',
          company: 'Microsoft'
        },
        {
          _id: '3',
          name: 'Amit Kumar',
          title: 'Product Manager at Amazon',
          expertise: ['Product Strategy', 'Analytics', 'Leadership'],
          description: 'Senior PM at Amazon with 10+ years experience. Expert in product strategy and team leadership.',
          rating: '4.9',
          experience: '10+ years',
          price: '3000', 
          company: 'Amazon'
        },
        {
          _id: '4',
          name: 'Sneha Gupta',
          title: 'UX Designer at Meta',
          expertise: ['UI/UX', 'Figma', 'Design Systems'],
          description: 'Lead designer at Meta with expertise in user experience and design systems for mobile apps.',
          rating: '4.7',
          experience: '7+ years',
          price: '2200',
          company: 'Meta'
        },
        {
          _id: '5',
          name: 'Vikash Singh',
          title: 'DevOps Engineer at Netflix',
          expertise: ['AWS', 'Docker', 'Kubernetes'],
          description: 'DevOps expert at Netflix specializing in cloud infrastructure and container orchestration.',
          rating: '4.8',
          experience: '9+ years',
          price: '2800',
          company: 'Netflix'
        },
        {
          _id: '6',
          name: 'Ananya Reddy',
          title: 'iOS Developer at Apple',
          expertise: ['Swift', 'iOS', 'Mobile Development'],
          description: 'Senior iOS developer at Apple with expertise in Swift and mobile app architecture.',
          rating: '4.9',
          experience: '8+ years',
          price: '3200',
          company: 'Apple'
        }
      ];
      setMentors(mockMentors);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityStatus = (availability) => {
    if (availability.toLowerCase().includes('available') || availability.includes('Mon') || availability.includes('Tue') || availability.includes('Wed') || availability.includes('Thu') || availability.includes('Fri') || availability.includes('Sat') || availability.includes('Sun')) {
      return 'Available';
    }
    return 'Busy';
  };

  const generateAvatar = (name) => {
    const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const colorIndex = name.length % colors.length;
    return {
      initials,
      backgroundColor: colors[colorIndex]
    };
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 1500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{
          backgroundColor: isDark ? '#1f2937' : 'white',
          padding: '40px',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #3b82f6',
            borderRadius: '50%',
            borderTop: '3px solid transparent',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: isDark ? 'white' : '#374151', margin: 0 }}>Loading mentors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 1500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{
          backgroundColor: isDark ? '#1f2937' : 'white',
          padding: '40px',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#ef4444" style={{ marginBottom: '16px' }}>
            <path d="M12,2L13.09,8.26L22,9L17,14L18.18,22L12,19L5.82,22L7,14L2,9L10.91,8.26L12,2Z"/>
          </svg>
          <p style={{ color: isDark ? 'white' : '#374151', margin: '0 0 16px 0' }}>{error}</p>
          <button onClick={fetchMentors} style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 1500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        width: '95%',
        maxWidth: '1400px',
        height: '90%',
        backgroundColor: isDark ? '#1f2937' : 'white',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '32px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2, flex: 1 }}>
            <h1 style={{ color: 'white', margin: 0, fontSize: '36px', fontWeight: '900', marginBottom: '8px' }}>
              Learn from the Best in Tech
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '18px', fontWeight: '500' }}>
              Get 1-on-1 mentorship from industry experts at top tech companies. Accelerate your career with personalized guidance.
            </p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              <button style={{
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}>
                Find Your Mentor
              </button>
              <button style={{
                padding: '12px 24px',
                background: 'transparent',
                border: '2px solid rgba(255,255,255,0.5)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer'
              }}>
                Become a Mentor
              </button>
            </div>
          </div>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <img src="/mentor.png" alt="Mentor" style={{ width: '200px', height: '200px', objectFit: 'contain' }} />
          </div>
          <button onClick={onClose} style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '12px',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            zIndex: 3
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>

        {/* Trending Domains */}
        <div style={{
          padding: '24px',
          borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          backgroundColor: isDark ? '#1f2937' : '#f8fafc'
        }}>
          <h3 style={{ color: isDark ? 'white' : '#1f2937', margin: '0 0 16px 0', fontSize: '20px', fontWeight: '700' }}>
            🔥 Trending Domains
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {trendingDomains.map((domain, index) => (
              <span key={index} style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                {domain}
              </span>
            ))}
          </div>
        </div>

        {/* Top Companies */}
        <div style={{
          padding: '24px',
          borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          backgroundColor: isDark ? '#374151' : 'white'
        }}>
          <h3 style={{ color: isDark ? 'white' : '#1f2937', margin: '0 0 16px 0', fontSize: '20px', fontWeight: '700' }}>
            🏢 Mentors from Top Companies
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            {topCompanies.map((company, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                borderRadius: '12px',
                border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <img src={company.logo} alt={company.name} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                <span style={{ color: isDark ? 'white' : '#374151', fontSize: '14px', fontWeight: '600' }}>
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{
          padding: '24px',
          borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          backgroundColor: isDark ? '#1f2937' : '#f8fafc'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
              <h4 style={{ color: isDark ? 'white' : '#1f2937', margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700' }}>
                Personalized Guidance
              </h4>
              <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: 0, fontSize: '14px' }}>
                Get tailored advice based on your career goals and current skill level.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💼</div>
              <h4 style={{ color: isDark ? 'white' : '#1f2937', margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700' }}>
                Industry Experts
              </h4>
              <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: 0, fontSize: '14px' }}>
                Learn from professionals working at top tech companies worldwide.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📈</div>
              <h4 style={{ color: isDark ? 'white' : '#1f2937', margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700' }}>
                Career Growth
              </h4>
              <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: 0, fontSize: '14px' }}>
                Accelerate your career with proven strategies and insider knowledge.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🤝</div>
              <h4 style={{ color: isDark ? 'white' : '#1f2937', margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700' }}>
                1-on-1 Sessions
              </h4>
              <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: 0, fontSize: '14px' }}>
                Direct interaction with mentors for focused learning and networking.
              </p>
            </div>
          </div>
        </div>

        {/* Expert Mentors Section */}
        <div style={{
          padding: '24px',
          borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          backgroundColor: isDark ? '#374151' : 'white'
        }}>
          <h3 style={{ color: isDark ? 'white' : '#1f2937', margin: '0 0 8px 0', fontSize: '24px', fontWeight: '800' }}>
            👨‍💻 Expert Mentors
          </h3>
          <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: '0 0 20px 0', fontSize: '16px' }}>
            Connect with industry professionals from top tech companies
          </p>
        </div>

        {/* Mentors Grid */}
        <div style={{ 
          flex: 1, 
          padding: '16px', 
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {mentors.map(mentor => {
            const avatar = generateAvatar(mentor.name);
            
            return (
            <div key={mentor._id} style={{
              padding: '16px',
              backgroundColor: isDark ? '#374151' : 'white',
              borderRadius: '8px',
              border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: avatar.backgroundColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  {avatar.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    color: isDark ? 'white' : '#1f2937', 
                    margin: '0 0 4px 0', 
                    fontSize: '16px', 
                    fontWeight: '600'
                  }}>
                    {mentor.name}
                  </h4>
                  <p style={{ 
                    color: isDark ? '#9ca3af' : '#6b7280', 
                    margin: 0, 
                    fontSize: '14px'
                  }}>
                    {mentor.title}
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '4px'
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b">
                    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
                  </svg>
                  <span style={{ color: '#92400e', fontSize: '12px', fontWeight: '600' }}>
                    {mentor.rating}
                  </span>
                </div>
              </div>

              {/* Skills */}
              {mentor.expertise && mentor.expertise.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {mentor.expertise.slice(0, 3).map((skill, index) => (
                      <span key={index} style={{
                        padding: '4px 8px',
                        backgroundColor: isDark ? '#4b5563' : '#f3f4f6',
                        color: isDark ? '#d1d5db' : '#374151',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <p style={{ 
                color: isDark ? '#d1d5db' : '#6b7280', 
                fontSize: '14px', 
                lineHeight: '1.4',
                marginBottom: '12px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {mentor.description}
              </p>

              {/* Stats */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '12px',
                padding: '8px 0',
                borderTop: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={isDark ? '#9ca3af' : '#6b7280'}>
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                  </svg>
                  <span style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                    {mentor.experience}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={isDark ? '#9ca3af' : '#6b7280'}>
                    <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
                  </svg>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: isDark ? 'white' : '#1f2937' }}>
                    ₹{mentor.price}
                  </span>
                  <span style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                    /session
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => alert('Coming Soon! Mentor booking system under development.')}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#3b82f6';
                }}
              >
                View Profile
              </button>
            </div>
            );
          })}
        </div>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
    </div>
  );
};

export default MentorshipPage;