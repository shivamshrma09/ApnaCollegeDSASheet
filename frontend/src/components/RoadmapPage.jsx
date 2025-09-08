import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Roadmap from './Roadmap';
import Sidebar from './Sidebar';

const RoadmapPage = () => {
  const { roadmapType } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [showRoadmap, setShowRoadmap] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Set up global function for opening roadmaps
    window.openRoadmap = (type) => {
      navigate(`/roadmap/${type}`);
    };

    return () => {
      delete window.openRoadmap;
    };
  }, [navigate]);

  const handleCloseRoadmap = () => {
    setShowRoadmap(false);
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#0f172a' : '#f8fafc',
      position: 'relative'
    }}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 100,
          background: isDark ? '#1f2937' : '#ffffff',
          border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          borderRadius: '12px',
          width: '48px',
          height: '48px',
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.2s',
          display: window.innerWidth >= 768 ? 'none' : 'flex'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = isDark ? '0 6px 16px rgba(0,0,0,0.4)' : '0 6px 16px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)';
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={isDark ? '#e5e7eb' : '#374151'}>
          <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
        </svg>
      </button>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={window.innerWidth < 768}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenProfile={() => console.log('Open profile')}
        onSheetChange={(type) => navigate(`/sheet/${type}`)}
      />

      {/* Main Content */}
      <div style={{
        marginLeft: window.innerWidth >= 768 ? (sidebarCollapsed ? '80px' : '320px') : '0',
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
        padding: '20px'
      }}>
        {/* Header */}
        <div style={{
          background: isDark ? '#1f2937' : '#ffffff',
          borderRadius: '16px',
          padding: '24px 32px',
          marginBottom: '24px',
          boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
          border: isDark ? '1px solid #374151' : '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '32px',
                fontWeight: '700',
                color: isDark ? '#ffffff' : '#111827',
                background: 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Learning Roadmaps
              </h1>
              <p style={{
                margin: '8px 0 0 0',
                fontSize: '16px',
                color: isDark ? '#9ca3af' : '#6b7280',
                lineHeight: '1.5'
              }}>
                Structured learning paths to master different technologies and skills
              </p>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Roadmap Cards */}
        {!showRoadmap && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {[
              { 
                name: 'DSA Developer', 
                path: 'dsa', 
                color: '#1E90FF',
                description: 'Master Data Structures and Algorithms for technical interviews',
                topics: ['Arrays & Strings', 'Trees & Graphs', 'Dynamic Programming', 'Advanced Topics'],
                difficulty: 'Intermediate',
                duration: '3-6 months',
                icon: 'M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,6L12.5,7.5L17,3L22,8L20.5,9.5L17,6L12.5,10.5L11,9M7,14H17V16H7V14Z'
              },
              { 
                name: 'Frontend Developer', 
                path: 'frontend', 
                color: '#10B981',
                description: 'Build modern web applications with React and JavaScript',
                topics: ['HTML/CSS', 'JavaScript ES6+', 'React.js', 'State Management'],
                difficulty: 'Beginner',
                duration: '4-8 months',
                icon: 'M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z'
              },
              { 
                name: 'Backend Developer', 
                path: 'backend', 
                color: '#F59E0B',
                description: 'Create scalable server-side applications and APIs',
                topics: ['Node.js/Python', 'Databases', 'REST APIs', 'Cloud Services'],
                difficulty: 'Intermediate',
                duration: '5-10 months',
                icon: 'M12,7V3H2V21H22V7H12M6,19H4V17H6V19M6,15H4V13H6V15M6,11H4V9H6V11M6,7H4V5H6V7M10,19H8V17H10V19M10,15H8V13H10V15M10,11H8V9H10V11M10,7H8V5H10V7M20,19H12V17H20V19M20,15H12V13H20V15M20,11H12V9H20V11Z'
              },
              { 
                name: 'Full Stack Developer', 
                path: 'fullstack', 
                color: '#06B6D4',
                description: 'Complete web development from frontend to backend',
                topics: ['Frontend Frameworks', 'Backend APIs', 'Databases', 'Deployment'],
                difficulty: 'Advanced',
                duration: '6-12 months',
                icon: 'M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7.27C13.6,7.61 14,8.26 14,9A2,2 0 0,1 12,11A2,2 0 0,1 10,9C10,8.26 10.4,7.61 11,7.27V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M12,15A2,2 0 0,1 14,17C14,17.74 13.6,18.39 13,18.73V20.27C13.6,20.61 14,21.26 14,22A2,2 0 0,1 12,24A2,2 0 0,1 10,22C10,21.26 10.4,20.61 11,20.27V18.73C10.4,18.39 10,17.74 10,17A2,2 0 0,1 12,15Z'
              },
              { 
                name: 'ML Engineer', 
                path: 'ml', 
                color: '#8B5CF6',
                description: 'Machine Learning and AI development expertise',
                topics: ['Mathematics', 'Python/ML', 'Deep Learning', 'MLOps'],
                difficulty: 'Advanced',
                duration: '8-15 months',
                icon: 'M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z'
              },
              { 
                name: 'DevOps Engineer', 
                path: 'devops', 
                color: '#EF4444',
                description: 'Infrastructure automation and deployment pipelines',
                topics: ['Linux/Cloud', 'Docker/K8s', 'CI/CD', 'Monitoring'],
                difficulty: 'Advanced',
                duration: '6-12 months',
                icon: 'M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z'
              },
              { 
                name: 'Mobile Developer', 
                path: 'mobile', 
                color: '#EC4899',
                description: 'iOS and Android mobile application development',
                topics: ['Native Development', 'Cross-Platform', 'App Store', 'Mobile UI/UX'],
                difficulty: 'Intermediate',
                duration: '4-10 months',
                icon: 'M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z'
              },
              { 
                name: 'Cybersecurity', 
                path: 'cybersecurity', 
                color: '#DC2626',
                description: 'Information security and ethical hacking expertise',
                topics: ['Security Fundamentals', 'Penetration Testing', 'Network Security', 'Compliance'],
                difficulty: 'Advanced',
                duration: '6-18 months',
                icon: 'M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V16H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z'
              }
            ].map(({ name, path, color, description, topics, difficulty, duration, icon }) => (
              <div
                key={path}
                onClick={() => {
                  setShowRoadmap(true);
                  navigate(`/roadmap/${path}`);
                }}
                style={{
                  background: isDark ? '#1f2937' : '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: `2px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = isDark ? '0 12px 25px rgba(0,0,0,0.4)' : '0 12px 25px rgba(0,0,0,0.15)';
                  e.target.style.borderColor = color;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)';
                  e.target.style.borderColor = isDark ? '#374151' : '#e5e7eb';
                }}
              >
                {/* Color accent */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`
                }} />

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${color}30`
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill={color}>
                      <path d={icon} />
                    </svg>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{
                      background: difficulty === 'Beginner' ? '#10B981' : difficulty === 'Intermediate' ? '#F59E0B' : '#EF4444',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {difficulty}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '22px',
                  fontWeight: '700',
                  color: isDark ? '#ffffff' : '#111827',
                  lineHeight: '1.3'
                }}>
                  {name}
                </h3>
                
                <p style={{
                  margin: '0 0 20px 0',
                  fontSize: '15px',
                  color: isDark ? '#9ca3af' : '#6b7280',
                  lineHeight: '1.6'
                }}>
                  {description}
                </p>

                {/* Topics */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {topics.map((topic, index) => (
                      <span
                        key={index}
                        style={{
                          background: `${color}15`,
                          color: color,
                          padding: '6px 12px',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: '600',
                          border: `1px solid ${color}30`
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '20px',
                  borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{
                      fontSize: '13px',
                      color: isDark ? '#9ca3af' : '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: '500'
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                      </svg>
                      {duration}
                    </span>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: `${color}20`,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={color}>
                        <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Roadmap Modal */}
        {showRoadmap && roadmapType && (
          <Roadmap
            roadmapType={roadmapType}
            onClose={handleCloseRoadmap}
          />
        )}
      </div>
    </div>
  );
};

export default RoadmapPage;