import React, { useState } from 'react';

const MentorshipSidebar = ({ isDark }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mentors] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      company: 'Google',
      experience: '5+ years',
      expertise: ['System Design', 'Algorithms', 'Interview Prep'],
      rating: 4.9,
      sessions: 150,
      price: 2999,
      availability: 'Available',
      nextSlot: 'Today 6:00 PM'
    },
    {
      id: 2,
      name: 'Priya Singh',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      company: 'Microsoft',
      experience: '4+ years',
      expertise: ['Data Structures', 'Dynamic Programming', 'Coding'],
      rating: 4.8,
      sessions: 120,
      price: 2499,
      availability: 'Busy',
      nextSlot: 'Tomorrow 10:00 AM'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      company: 'Amazon',
      experience: '6+ years',
      expertise: ['System Design', 'Scalability', 'Leadership'],
      rating: 4.9,
      sessions: 200,
      price: 3499,
      availability: 'Available',
      nextSlot: 'Today 8:00 PM'
    }
  ]);

  return (
    <div style={{
      position: 'fixed',
      right: isExpanded ? 0 : '-380px',
      top: 0,
      width: '400px',
      height: '100vh',
      backgroundColor: isDark ? '#1f2937' : 'white',
      boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
      transition: 'right 0.3s ease',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      border: isDark ? '1px solid #374151' : '1px solid #e5e7eb'
    }}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          position: 'absolute',
          left: '-50px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '50px',
          height: '100px',
          backgroundColor: '#3b82f6',
          border: 'none',
          borderRadius: '8px 0 0 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '4px',
          color: 'white',
          fontSize: '12px',
          fontWeight: '600'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M21,9V7H15L13.5,7.5C13.1,7.4 12.6,7.5 12.1,7.8L10.5,9H3V11H9L10.5,9.5C10.9,9.6 11.4,9.5 11.9,9.2L13.5,7.5H21M7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13Z"/>
        </svg>
        <span>MENTOR</span>
      </button>

      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M21,9V7H15L13.5,7.5C13.1,7.4 12.6,7.5 12.1,7.8L10.5,9H3V11H9L10.5,9.5C10.9,9.6 11.4,9.5 11.9,9.2L13.5,7.5H21M7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13Z"/>
          </svg>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Find Your Mentor</h2>
        </div>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
          Get 1-on-1 guidance from industry experts
        </p>
      </div>

      {/* Stats Banner */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: isDark ? '#374151' : '#f8fafc',
        borderBottom: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: '700', color: '#3b82f6', fontSize: '16px' }}>500+</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Mentors</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: '700', color: '#22c55e', fontSize: '16px' }}>4.8★</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Rating</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: '700', color: '#f59e0b', fontSize: '16px' }}>10k+</div>
            <div style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Sessions</div>
          </div>
        </div>
      </div>

      {/* Mentors List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {mentors.map(mentor => (
          <div key={mentor.id} style={{
            padding: '16px',
            backgroundColor: isDark ? '#374151' : 'white',
            borderRadius: '12px',
            border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
            marginBottom: '12px',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <img
                src={mentor.avatar}
                alt={mentor.name}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #3b82f6'
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h4 style={{ color: isDark ? 'white' : '#1f2937', margin: '0 0 2px 0', fontSize: '14px', fontWeight: '600' }}>
                      {mentor.name}
                    </h4>
                    <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: 0, fontSize: '12px' }}>
                      {mentor.experience} at {mentor.company}
                    </p>
                  </div>
                  <div style={{
                    padding: '2px 6px',
                    backgroundColor: mentor.availability === 'Available' ? '#dcfce7' : '#fef3c7',
                    color: mentor.availability === 'Available' ? '#166534' : '#92400e',
                    borderRadius: '8px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    {mentor.availability}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', flexWrap: 'wrap' }}>
              {mentor.expertise.slice(0, 2).map((skill, index) => (
                <span key={index} style={{
                  padding: '2px 6px',
                  backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
                  color: isDark ? '#d1d5db' : '#374151',
                  borderRadius: '8px',
                  fontSize: '10px'
                }}>
                  {skill}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                <span style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '2px', verticalAlign: 'middle' }}>
                    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
                  </svg>
                  {mentor.rating}
                </span>
                <span style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>{mentor.sessions} sessions</span>
              </div>
              <span style={{ color: isDark ? 'white' : '#1f2937', fontSize: '14px', fontWeight: '700' }}>₹{mentor.price}</span>
            </div>

            <div style={{ fontSize: '11px', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '8px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
              </svg>
              Next available: {mentor.nextSlot}
            </div>

            <button
              onClick={() => alert('Coming Soon! Payment integration under development.')}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: mentor.availability === 'Available' ? '#3b82f6' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: mentor.availability === 'Available' ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
              </svg>
              {mentor.availability === 'Available' ? 'Book Session' : 'Not Available'}
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        backgroundColor: isDark ? '#374151' : '#f8fafc'
      }}>
        <button style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#22c55e',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M21,9V7H15L13.5,7.5C13.1,7.4 12.6,7.5 12.1,7.8L10.5,9H3V11H9L10.5,9.5C10.9,9.6 11.4,9.5 11.9,9.2L13.5,7.5H21M7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13Z"/>
          </svg>
          Become a Mentor
        </button>
      </div>
    </div>
  );
};

export default MentorshipSidebar;