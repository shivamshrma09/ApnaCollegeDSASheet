import React, { useState, useEffect } from 'react';
import { conceptNotesData } from '../data/conceptNotesData';

const ConceptNotes = ({ isDark, selectedTopic, onClose }) => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('ConceptNotes useEffect - selectedTopic:', selectedTopic);
    if (selectedTopic && conceptNotesData[selectedTopic]) {
      console.log('Setting selected note for topic:', selectedTopic);
      setSelectedNote(conceptNotesData[selectedTopic]);
    } else {
      console.log('No data found for topic:', selectedTopic);
    }
  }, [selectedTopic]);

  const topics = Object.keys(conceptNotesData);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        width: '95%',
        maxWidth: '1400px',
        height: '90%',
        backgroundColor: isDark ? '#1f2937' : 'white',
        borderRadius: '20px',
        display: 'flex',
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        animation: 'slideUp 0.4s ease-out'
      }}>
        {/* Sidebar */}
        <div style={{
          width: '300px',
          backgroundColor: isDark ? '#374151' : '#f9fafb',
          padding: '24px',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ color: isDark ? 'white' : '#1f2937', margin: 0 }}>Concept Notes</h3>
            <button onClick={onClose} style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: isDark ? 'white' : '#1f2937'
            }}>×</button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{
                width: '30px',
                height: '30px',
                border: '3px solid #ccc',
                borderTop: '3px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }}></div>
            </div>
          ) : (
            topics.map(topic => (
              <div
                key={topic}
                onClick={() => setSelectedNote(conceptNotesData[topic])}
                style={{
                  padding: '12px',
                  backgroundColor: selectedNote?.title === conceptNotesData[topic].title 
                    ? (isDark ? '#1E90FF' : 'rgba(30, 144, 255, 0.1)') 
                    : 'transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  transition: 'all 0.2s',
                  border: selectedNote?.title === conceptNotesData[topic].title 
                    ? `2px solid #1E90FF` 
                    : `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`
                }}
                onMouseEnter={(e) => {
                  if (selectedNote?.title !== conceptNotesData[topic].title) {
                    e.target.style.backgroundColor = isDark ? 'rgba(30, 144, 255, 0.1)' : 'rgba(30, 144, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedNote?.title !== conceptNotesData[topic].title) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ 
                  color: selectedNote?.title === conceptNotesData[topic].title 
                    ? (isDark ? 'white' : '#1E90FF')
                    : (isDark ? 'white' : '#1f2937'),
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                  {topic === 'DP' ? 'Dynamic Programming' : topic === 'LinkedLists' ? 'Linked Lists' : topic}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: isDark ? '#9ca3af' : '#6b7280',
                  marginTop: '4px'
                }}>
                  {conceptNotesData[topic].title}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto'
        }}>
          {selectedNote ? (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ 
                  color: isDark ? 'white' : '#1f2937',
                  marginBottom: '16px',
                  fontSize: '28px',
                  fontWeight: '700'
                }}>
                  {selectedNote.title}
                </h1>
              </div>

              <div style={{
                backgroundColor: isDark ? '#374151' : '#f9fafb',
                padding: '32px',
                borderRadius: '16px',
                marginBottom: '32px',
                border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div 
                  style={{
                    color: isDark ? '#e5e7eb' : '#374151',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    lineHeight: '1.8',
                    margin: 0,
                    fontSize: '16px'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: selectedNote.content
                      .replace(/## (.*?)\n/g, `<h2 style="color: #1E90FF; font-size: 22px; font-weight: 700; margin: 24px 0 16px 0; border-bottom: 2px solid #1E90FF; padding-bottom: 8px;">$1</h2>`)
                      .replace(/### (.*?)\n/g, `<h3 style="color: ${isDark ? '#60a5fa' : '#2563eb'}; font-size: 18px; font-weight: 600; margin: 20px 0 12px 0;">$1</h3>`)
                      .replace(/#### (.*?)\n/g, `<h4 style="color: ${isDark ? '#9ca3af' : '#4b5563'}; font-size: 16px; font-weight: 600; margin: 16px 0 8px 0;">$1</h4>`)
                      .replace(/\*\*(.*?)\*\*/g, `<strong style="color: #1E90FF; font-weight: 600;">$1</strong>`)
                      .replace(/\`\`\`([\s\S]*?)\`\`\`/g, `<pre style="background: ${isDark ? '#1f2937' : '#f8fafc'}; border: 1px solid ${isDark ? '#374151' : '#e2e8f0'}; border-radius: 8px; padding: 16px; margin: 16px 0; overflow-x: auto; font-family: 'Monaco', 'Menlo', monospace; font-size: 14px; color: ${isDark ? '#10b981' : '#059669'};"><code>$1</code></pre>`)
                      .replace(/\`(.*?)\`/g, `<code style="background: ${isDark ? '#4b5563' : '#f1f5f9'}; color: ${isDark ? '#10b981' : '#059669'}; padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', monospace; font-size: 13px;">$1</code>`)
                      .replace(/- \*\*(.*?)\*\*: (.*?)\n/g, `<div style="margin: 8px 0; padding-left: 16px;"><strong style="color: #1E90FF;">• $1:</strong> $2</div>`)
                      .replace(/- (.*?)\n/g, `<div style="margin: 6px 0; padding-left: 16px; color: ${isDark ? '#d1d5db' : '#4b5563'};">• $1</div>`)
                      .replace(/\n\n/g, '<br><br>')
                      .replace(/\n/g, '<br>')
                  }}
                />
              </div>

              {selectedNote.examples && selectedNote.examples.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ 
                    color: isDark ? 'white' : '#1f2937', 
                    marginBottom: '16px',
                    fontSize: '20px',
                    fontWeight: '600'
                  }}>
                    Examples
                  </h3>
                  {selectedNote.examples.map((example, index) => (
                    <div key={index} style={{
                      backgroundColor: isDark ? '#1f2937' : 'white',
                      padding: '20px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ marginBottom: '12px' }}>
                        <strong style={{ color: '#1E90FF', fontSize: '14px' }}>Input: </strong>
                        <code style={{ 
                          backgroundColor: isDark ? '#374151' : '#f3f4f6',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          color: isDark ? '#10b981' : '#059669',
                          fontSize: '13px',
                          fontFamily: 'Monaco, monospace'
                        }}>
                          {example.input}
                        </code>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <strong style={{ color: '#1E90FF', fontSize: '14px' }}>Output: </strong>
                        <code style={{ 
                          backgroundColor: isDark ? '#374151' : '#f3f4f6',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          color: isDark ? '#10b981' : '#059669',
                          fontSize: '13px',
                          fontFamily: 'Monaco, monospace'
                        }}>
                          {example.output}
                        </code>
                      </div>
                      <div>
                        <strong style={{ color: '#1E90FF', fontSize: '14px' }}>Explanation: </strong>
                        <span style={{ 
                          color: isDark ? '#d1d5db' : '#6b7280',
                          fontSize: '14px',
                          lineHeight: '1.5'
                        }}>
                          {example.explanation}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <div style={{
                  backgroundColor: isDark ? '#1f2937' : 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <h4 style={{ 
                    color: '#1E90FF', 
                    marginBottom: '12px',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    Time Complexity
                  </h4>
                  <code style={{ 
                    color: isDark ? '#10b981' : '#059669',
                    fontSize: '14px',
                    fontFamily: 'Monaco, monospace'
                  }}>
                    {selectedNote.timeComplexity}
                  </code>
                </div>
                <div style={{
                  backgroundColor: isDark ? '#1f2937' : 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <h4 style={{ 
                    color: '#1E90FF', 
                    marginBottom: '12px',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    Space Complexity
                  </h4>
                  <code style={{ 
                    color: isDark ? '#10b981' : '#059669',
                    fontSize: '14px',
                    fontFamily: 'Monaco, monospace'
                  }}>
                    {selectedNote.spaceComplexity}
                  </code>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center'
            }}>
              <div>
                <svg width="64" height="64" viewBox="0 0 24 24" fill={isDark ? '#6b7280' : '#9ca3af'} style={{ marginBottom: '16px' }}>
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                <p style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '18px' }}>
                  Select a data structure from the sidebar to view detailed theory and examples
                </p>
                <p style={{ color: isDark ? '#6b7280' : '#9ca3af', fontSize: '14px', marginTop: '8px' }}>
                  Selected Topic: {selectedTopic || 'None'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default ConceptNotes;