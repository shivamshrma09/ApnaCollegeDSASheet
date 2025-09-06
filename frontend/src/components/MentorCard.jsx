import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const MentorCard = ({ isDark }) => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError('Failed to load mentors');
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
        padding: '24px',
        backgroundColor: isDark ? '#371f26ff' : 'white',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
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
        padding: '24px',
        backgroundColor: isDark ? '#371f26ff' : 'white',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
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
      padding: '24px',
      backgroundColor: isDark ? '#371f26ff' : 'white',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <h1 style={{
            color: isDark ? 'white' : '#1f2937',
            fontSize: '32px',
            fontWeight: '800',
            margin: '0 0 8px 0'
          }}>
            Top Mentors
          </h1>
          <p style={{
            color: isDark ? '#9ca3af' : '#6b7280',
            fontSize: '16px',
            margin: 0
          }}>
            In search of excellence? Explore the highest-rated mentors as recognized by the learner community.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {mentors.map(mentor => {
            const avatar = generateAvatar(mentor.name);
            const availabilityStatus = getAvailabilityStatus(mentor.availability);
            
            return (
            <div key={mentor._id} style={{
              padding: '16px',
              backgroundColor: isDark ? '#374151' : 'white',
              borderRadius: '12px',
              border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer',
              position: 'relative'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
            >
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}>
                <div style={{
                  padding: '4px 8px',
                  backgroundColor: availabilityStatus === 'Available' ? '#dcfce7' : '#fef3c7',
                  color: availabilityStatus === 'Available' ? '#166534' : '#92400e',
                  borderRadius: '8px',
                  fontSize: '10px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="12"/>
                  </svg>
                  {availabilityStatus}
                </div>
                <div style={{
                  padding: '2px 6px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '6px',
                  fontSize: '9px',
                  fontWeight: '600'
                }}>
                  Mentor
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: avatar.backgroundColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  border: '2px solid #8b5cf6'
                }}>
                  {avatar.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    color: isDark ? 'white' : '#0f172a',
                    margin: '0 0 2px 0',
                    fontSize: '16px',
                    fontWeight: '700'
                  }}>
                    {mentor.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b">
                      <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
                    </svg>
                    <span style={{
                      color: isDark ? '#f59e0b' : '#d97706',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {mentor.rating}
                    </span>
                    <span style={{ 
                      color: isDark ? '#9ca3af' : '#6b7280', 
                      fontSize: '10px', 
                      marginLeft: '2px'
                    }}>
                      ({mentor.experience})
                    </span>
                  </div>
                  <p style={{
                    color: isDark ? '#94a3b8' : '#64748b',
                    margin: 0,
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {mentor.title}
                  </p>
                  {mentor.expertise && mentor.expertise.length > 0 && (
                    <div style={{ display: 'flex', gap: '3px', marginTop: '6px', flexWrap: 'wrap' }}>
                      {mentor.expertise.slice(0, 3).map((skill, index) => (
                        <span key={index} style={{
                          padding: '1px 4px',
                          backgroundColor: isDark ? '#374151' : '#f3f4f6',
                          color: isDark ? '#d1d5db' : '#374151',
                          borderRadius: '3px',
                          fontSize: '9px',
                          fontWeight: '500'
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <p style={{
                color: isDark ? '#d1d5db' : '#374151',
                fontSize: '11px',
                lineHeight: '1.3',
                marginBottom: '12px',
                minHeight: '30px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {mentor.description}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                padding: '8px',
                backgroundColor: isDark ? '#1f2937' : '#f8fafc',
                borderRadius: '6px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', fontWeight: '600', color: '#8b5cf6' }}>
                    📅 {mentor.experience}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: isDark ? 'white' : '#0f172a' }}>
                    ₹{mentor.price}
                  </div>
                  <div style={{ fontSize: '7px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                    per session
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert('Coming Soon! Mentor booking system under development.')}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: availabilityStatus === 'Available'
                    ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                    : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: availabilityStatus === 'Available' ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M21,9V7H15L13.5,7.5C13.1,7.4 12.6,7.5 12.1,7.8L10.5,9H3V11H9L10.5,9.5C10.9,9.6 11.4,9.5 11.9,9.2L13.5,7.5H21M7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13Z"/>
                </svg>
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
        `}
      </style>
    </div>
  );
};

export default MentorCard;