import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const MobileMenu = ({ isOpen, onClose, onSheetChange }) => {
  const { isDark } = useTheme();
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
        }}
        onClick={onClose}
      />
      
      {/* Mobile Menu */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '280px',
        height: '100vh',
        backgroundColor: isDark ? '#111111' : '#ffffff',
        borderRight: `1px solid ${isDark ? '#333333' : '#e5e7eb'}`,
        zIndex: 1000,
        overflowY: 'auto',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px',
          borderBottom: `1px solid ${isDark ? '#333333' : '#e5e7eb'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            margin: 0,
            color: isDark ? '#ffffff' : '#111111',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            PlusDSA Menu
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: isDark ? '#ffffff' : '#111111',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        {/* DSA Sheets */}
        <div style={{ padding: '8px 0' }}>
          <button
            onClick={() => toggleSection('dsaSheets')}
            style={{
              width: '100%',
              padding: '16px 20px',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              color: isDark ? 'white' : '#374151',
              fontSize: '15px',
              fontWeight: '500',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>📚 DSA Sheets</span>
            <span style={{ 
              transform: expandedSections.dsaSheets ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}>
              ▼
            </span>
          </button>
          
          {expandedSections.dsaSheets && (
            <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
              {[
                { name: 'Apna College Sheet', type: 'apnaCollege' },
                { name: 'Striver A2Z Sheet', type: 'striverA2Z' },
                { name: 'Striver SDE Sheet', type: 'striverSDE' },
                { name: 'Blind 75 Sheet', type: 'blind75' },
                { name: 'Love Babbar Sheet', type: 'loveBabbar' },
                { name: 'NeetCode 150', type: 'neetcode150' },
                { name: 'LeetCode Top 150', type: 'leetcodeTop150' }
              ].map(({ name, type }) => (
                <button
                  key={name}
                  onClick={() => {
                    if (onSheetChange) {
                      onSheetChange(type);
                    }
                    onClose();
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: isDark ? '#d1d5db' : '#4b5563',
                    fontSize: '14px',
                    borderRadius: '8px',
                    margin: '2px 0'
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${isDark ? '#333333' : '#e5e7eb'}` }}>
          <h3 style={{ 
            margin: '0 0 12px 0', 
            color: isDark ? '#ffffff' : '#111111',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Quick Actions
          </h3>
          
          {[
            { name: '🏠 Dashboard', action: () => window.location.href = '/dsa-sheet' },
            { name: '🎯 Practice', action: () => window.location.href = '/practice' },
            { name: '📊 Progress', action: () => window.location.href = '/progress' },
            { name: '👨‍🏫 Mentorship', action: () => window.location.href = '/mentorship' },
            { name: '🚀 Interview Prep', action: () => window.location.href = '/interview' }
          ].map(({ name, action }) => (
            <button
              key={name}
              onClick={() => {
                action();
                onClose();
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                color: isDark ? '#d1d5db' : '#4b5563',
                fontSize: '14px',
                borderRadius: '8px',
                margin: '4px 0'
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;