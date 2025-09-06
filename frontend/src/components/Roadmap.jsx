import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { roadmapData } from '../data/roadmapData';

const Roadmap = ({ roadmapType = 'dsa', onClose }) => {
  const { isDark } = useTheme();
  const [selectedSection, setSelectedSection] = useState(null);
  const [completedItems, setCompletedItems] = useState({});
  
  const roadmap = roadmapData[roadmapType];

  useEffect(() => {
    const saved = localStorage.getItem(`roadmap_${roadmapType}_progress`);
    if (saved) {
      setCompletedItems(JSON.parse(saved));
    }
  }, [roadmapType]);

  const toggleItemComplete = (sectionId, itemName) => {
    const key = `${sectionId}_${itemName}`;
    const newCompleted = {
      ...completedItems,
      [key]: !completedItems[key]
    };
    setCompletedItems(newCompleted);
    localStorage.setItem(`roadmap_${roadmapType}_progress`, JSON.stringify(newCompleted));
  };

  const getSectionProgress = (section) => {
    const completed = section.items.filter(item => 
      completedItems[`${section.id}_${item.name}`]
    ).length;
    return Math.round((completed / section.items.length) * 100);
  };

  const getOverallProgress = () => {
    const totalItems = roadmap.sections.reduce((sum, section) => sum + section.items.length, 0);
    const completedCount = Object.values(completedItems).filter(Boolean).length;
    return Math.round((completedCount / totalItems) * 100);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.6)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backdropFilter: 'blur(12px)'
    }}>
      <div style={{
        background: isDark ? '#1f2937' : '#ffffff',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '1200px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: isDark ? '0 10px 25px rgba(0,0,0,0.3)' : '0 10px 25px rgba(0,0,0,0.1)',
        border: isDark ? '1px solid #374151' : '1px solid #e5e7eb'
      }}>
        {/* Header */}
        <div style={{
          background: '#1E90FF',
          padding: '20px 24px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
              {roadmap.title}
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
              {roadmap.description}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {getOverallProgress()}% Complete
              </span>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '8px',
                height: '8px',
                width: '200px',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: 'white',
                  height: '100%',
                  width: `${getOverallProgress()}%`,
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '40px',
          maxHeight: 'calc(95vh - 180px)',
          overflowY: 'auto'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            position: 'relative'
          }}>
            {/* Timeline Line */}
            <div style={{
              position: 'absolute',
              left: '30px',
              top: '40px',
              bottom: '40px',
              width: '2px',
              background: '#1E90FF',
              borderRadius: '1px'
            }} />
          {roadmap.sections.map((section, index) => {
            const progress = getSectionProgress(section);
            const isCompleted = progress === 100;
            const isInProgress = progress > 0 && progress < 100;
            
            return (
              <div key={section.id} style={{
                position: 'relative',
                marginBottom: '32px',
                paddingLeft: '80px'
              }}>
                {/* Timeline Node */}
                <div style={{
                  position: 'absolute',
                  left: '20px',
                  top: '20px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: isCompleted ? '#1E90FF' : isInProgress ? '#1E90FF' : (isDark ? '#374151' : '#e5e7eb'),
                  border: `3px solid ${isDark ? '#1f2937' : '#ffffff'}`,
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isCompleted && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                  {isInProgress && !isCompleted && (
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'white'
                    }} />
                  )}
                </div>

                {/* Card */}
                <div style={{
                  background: isDark ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = isDark ? '0 8px 25px rgba(0,0,0,0.4)' : '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)';
                }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{
                        margin: 0,
                        fontSize: '20px',
                        fontWeight: '700',
                        color: isDark ? '#ffffff' : '#111827',
                        marginBottom: '4px'
                      }}>
                        {section.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          background: section.status === 'required' ? '#1E90FF' : '#6b7280',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: '500',
                          textTransform: 'uppercase'
                        }}>
                          {section.status}
                        </span>
                        <span style={{
                          fontSize: '13px',
                          color: isDark ? '#9ca3af' : '#6b7280'
                        }}>
                          {section.items.length} topics
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: isCompleted ? '#1E90FF' : isInProgress ? '#1E90FF' : (isDark ? '#6b7280' : '#9ca3af')
                      }}>
                        {progress}%
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: isDark ? '#6b7280' : '#9ca3af',
                        textTransform: 'uppercase',
                        fontWeight: '600'
                      }}>
                        Complete
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{
                    background: isDark ? '#374151' : '#f3f4f6',
                    borderRadius: '8px',
                    height: '8px',
                    overflow: 'hidden',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      background: '#1E90FF',
                      height: '100%',
                      width: `${progress}%`,
                      borderRadius: '8px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  {/* Expand Button */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: '#1E90FF',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    View Details
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ 
                      transform: selectedSection === section.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}>
                      <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Section Items */}
                {selectedSection === section.id && (
                  <div style={{ 
                    marginTop: '16px',
                    padding: '20px',
                    background: isDark ? '#374151' : '#f8fafc',
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '12px'
                    }}>
                      {section.items.map((item, itemIndex) => {
                        const isItemCompleted = completedItems[`${section.id}_${item.name}`];
                        return (
                          <div
                            key={item.name}
                            onClick={() => toggleItemComplete(section.id, item.name)}
                            style={{
                              background: isDark ? '#1f2937' : '#ffffff',
                              border: `1px solid ${isItemCompleted ? '#1E90FF' : (isDark ? '#374151' : '#e5e7eb')}`,
                              borderRadius: '12px',
                              padding: '16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px',
                              transition: 'all 0.2s ease',
                              opacity: isItemCompleted ? 0.8 : 1
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#1E90FF';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = isItemCompleted ? '#1E90FF' : (isDark ? '#374151' : '#e5e7eb');
                            }}
                          >
                            <div style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: isItemCompleted ? '#1E90FF' : 'transparent',
                              border: `2px solid ${isItemCompleted ? '#1E90FF' : (isDark ? '#6b7280' : '#d1d5db')}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: '2px'
                            }}>
                              {isItemCompleted && (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{
                                fontWeight: '600',
                                color: isDark ? '#ffffff' : '#111827',
                                fontSize: '14px',
                                marginBottom: '6px',
                                textDecoration: isItemCompleted ? 'line-through' : 'none',
                                opacity: isItemCompleted ? 0.7 : 1
                              }}>
                                {item.name}
                              </div>
                              <div style={{
                                fontSize: '12px',
                                color: isDark ? '#9ca3af' : '#6b7280',
                                lineHeight: '1.5',
                                opacity: isItemCompleted ? 0.6 : 1
                              }}>
                                {item.description}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;