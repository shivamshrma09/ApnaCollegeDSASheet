import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from "react-router-dom";


const Sidebar = ({ isOpen, onClose, isMobile, collapsed, onToggleCollapse, onOpenProfile, onSheetChange }) => {
  const { isDark } = useTheme();
  const [expandedSections, setExpandedSections] = useState({});
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
const navigate = useNavigate();
 
  useEffect(() => {
    // Just use localStorage user data, no API call needed
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (localUser.id || localUser._id) {
      setUser(localUser);
    }
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const companies = [
    { name: 'Amazon', id: 'amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Google', id: 'google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Microsoft', id: 'microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
    { name: 'Meta (Facebook)', id: 'facebook', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' },
    { name: 'Apple', id: 'apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { name: 'Netflix', id: 'netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
    { name: 'Uber', id: 'uber', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png' },
    { name: 'Adobe', id: 'adobe', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg' },
    { name: 'Twitter', id: 'twitter', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg' },
    { name: 'Oracle', id: 'oracle', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg' },
    { name: 'Visa', id: 'visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg' },
    { name: 'VMware', id: 'vmware', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Vmware.svg' },
    { name: 'Walmart Labs', id: 'walmartlabs', logo: '/wlamart.png' }
  ];

  return (
    <>
      {isMobile && isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 999,
            backdropFilter: 'blur(4px)'
          }}
          onClick={onClose}
        />
      )}

      <div style={{
        position: 'fixed',
        top: 0,
        left: isMobile ? (isOpen ? 0 : '-320px') : 0,
        width: isMobile ? '320px' : (collapsed ? '80px' : '320px'),
        height: '100vh',
        background: isDark ? '#000000' : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: isDark ? '4px 0 20px rgba(0,0,0,0.5)' : '4px 0 20px rgba(0,0,0,0.15)',
        transition: isMobile ? 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: isMobile ? 1000 : 200,
        overflowY: 'auto',
        overflowX: 'hidden',
        border: isDark ? '1px solid #374151' : '1px solid #e2e8f0'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 20px',
          borderBottom: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: isDark ? 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)' : 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm5-18v4h3V3h-3z"/>
            </svg>
            {!collapsed && <h2 style={{ color: 'white', margin: 0, fontSize: '20px', fontWeight: '600' }}>Dashboard</h2>}
          </div>
          {isMobile ? (
            <button
              onClick={onClose}
              style={{
                background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isDark ? '#9ca3af' : '#6b7280'}>
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          ) : (
            <button
              onClick={onToggleCollapse}
              style={{
                background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isDark ? '#9ca3af' : '#6b7280'} style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/>
              </svg>
            </button>
          )}
        </div>

        {/* DSA Sheets Section */}
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
              alignItems: 'center',
              transition: 'all 0.2s',
              borderRadius: '0'
            }}
            onMouseEnter={(e) => e.target.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isDark ? 'white' : '#1E90FF'}>
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              {!collapsed && 'DSA Sheets'}
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isDark ? '#9ca3af' : '#6b7280'} style={{ transform: expandedSections.dsaSheets ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
            </svg>
          </button>
          
          {expandedSections.dsaSheets && !collapsed && (
            <div style={{ paddingLeft: '52px', paddingRight: '20px', paddingBottom: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {[
                { name: 'Striver A2Z Sheet', icon: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6Z', type: 'striverA2Z' },
                { name: 'Striver 79 Sheet', icon: 'M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z', type: 'striver79' },
                { name: 'Striver SDE Sheet', icon: 'M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z', type: 'striverSDE' },
                { name: 'Striver Blind 75', icon: 'M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7H15L13.5,7.5C13.1,7.4 12.6,7.5 12.1,7.8L10.5,9H3V11H9L10.5,9.5C10.9,9.6 11.4,9.5 11.9,9.2L13.5,7.5H21M7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13Z', type: 'striverBlind75' },
                { name: 'Apna College Sheet', icon: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,6V8H13V6H11M11,10V18H13V10H11Z', type: 'apnaCollege' },
                { name: 'Love Babbar Sheet', icon: 'M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z', type: 'loveBabbar' },
                { name: 'Blind 75 Sheet', icon: 'M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7H15L13.5,7.5C13.1,7.4 12.6,7.5 12.1,7.8L10.5,9H3V11H9L10.5,9.5C10.9,9.6 11.4,9.5 11.9,9.2L13.5,7.5H21M7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13Z', type: 'blind75' },
                { name: 'NeetCode 150', icon: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,6V8H13V6H11M11,10V18H13V10H11Z', type: 'neetcode150' },
                { name: 'LeetCode Top 150', icon: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,6V8H13V6H11M11,10V18H13V10H11Z', type: 'leetcodeTop150' },
                { name: 'Vision Sheet', icon: 'M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z', type: 'vision' }
              ].map(({ name, icon, type }) => (
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
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: isDark ? '#d1d5db' : '#4b5563',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRadius: '8px',
                    margin: '2px 0',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(30, 144, 255, 0.1)';
                    e.target.style.color = isDark ? '#1E90FF' : '#1E90FF';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                    e.target.style.color = isDark ? '#d1d5db' : '#4b5563';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d={icon} />
                  </svg>
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CP Sheets Section */}
        <div style={{ padding: '8px 0' }}>
          <button
            onClick={() => toggleSection('cpSheets')}
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
              alignItems: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isDark ? 'white' : '#1E90FF'}>
                <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"/>
              </svg>
              {!collapsed && 'CP Sheets'}
            </div>
            {!collapsed && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isDark ? '#9ca3af' : '#6b7280'} style={{ transform: expandedSections.cpSheets ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
              </svg>
            )}
          </button>
          
          {expandedSections.cpSheets && !collapsed && (
            <div style={{ paddingLeft: '52px', paddingRight: '20px', paddingBottom: '8px' }}>
              {[
                { name: 'Striver CP Sheet', icon: 'M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z', type: 'striverCP' },
                { name: 'Vision CP Sheet', icon: 'M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z', type: 'visionCP' },
                { name: 'CP 31 Sheet', icon: 'M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z', type: 'cp31' }
              ].map(({ name, icon, type }) => (
                <button
                  key={type}
                  onClick={() => {
                    if (onSheetChange) {
                      onSheetChange(type);
                    }
                    onClose();
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: isDark ? '#d1d5db' : '#4b5563',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRadius: '8px',
                    margin: '2px 0',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(30, 144, 255, 0.1)';
                    e.target.style.color = isDark ? '#1E90FF' : '#1E90FF';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                    e.target.style.color = isDark ? '#d1d5db' : '#4b5563';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d={icon} />
                  </svg>
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* System Design & Interview Sheets */}
        <div style={{ padding: '8px 0' }}>
          <button
            onClick={() => toggleSection('systemSheets')}
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
              alignItems: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isDark ? 'white' : '#1E90FF'}>
                <path d="M12,7V3H2V21H22V7H12M6,19H4V17H6V19M6,15H4V13H6V15M6,11H4V9H6V11M6,7H4V5H6V7M10,19H8V17H10V19M10,15H8V13H10V15M10,11H8V9H10V11M10,7H8V5H10V7M20,19H12V17H20V19M20,15H12V13H20V15M20,11H12V9H20V11Z"/>
              </svg>
              {!collapsed && 'System & Interview'}
            </div>
            {!collapsed && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isDark ? '#9ca3af' : '#6b7280'} style={{ transform: expandedSections.systemSheets ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
              </svg>
            )}
          </button>
          
          {expandedSections.systemSheets && !collapsed && (
            <div style={{ paddingLeft: '52px', paddingRight: '20px', paddingBottom: '8px' }}>
              {[
                { name: 'System Design Sheet', icon: 'M12,7V3H2V21H22V7H12M6,19H4V17H6V19M6,15H4V13H6V15M6,11H4V9H6V11M6,7H4V5H6V7M10,19H8V17H10V19M10,15H8V13H10V15M10,11H8V9H10V11M10,7H8V5H10V7M20,19H12V17H20V19M20,15H12V13H20V15M20,11H12V9H20V11Z', type: 'systemDesign' },
                { name: 'Challenge Questions', icon: 'M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z', type: 'challengeQuestions' }
              ].map(({ name, icon, type }) => (
                <button
                  key={type}
                  onClick={() => {
                    if (onSheetChange) {
                      onSheetChange(type);
                    }
                    onClose();
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: isDark ? '#d1d5db' : '#4b5563',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRadius: '8px',
                    margin: '2px 0',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(30, 144, 255, 0.1)';
                    e.target.style.color = isDark ? '#1E90FF' : '#1E90FF';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                    e.target.style.color = isDark ? '#d1d5db' : '#4b5563';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d={icon}/>
                  </svg>
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Topic-wise Section */}
        <div style={{ padding: '8px 0' }}>
          <button
            onClick={() => toggleSection('topics')}
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
              alignItems: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isDark ? 'white' : '#1E90FF'}>
                <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19M17,12H15V17H13V12H11L14,9L17,12Z"/>
              </svg>
              {!collapsed && 'Topic-wise Practice'}
            </div>
            {!collapsed && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isDark ? '#9ca3af' : '#6b7280'} style={{ transform: expandedSections.topics ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
              </svg>
            )}
          </button>
          
          {expandedSections.topics && !collapsed && (
            <div style={{ paddingLeft: '52px', paddingRight: '20px', maxHeight: '280px', overflowY: 'auto', paddingBottom: '8px' }}>
              {[
                { name: 'Arrays', icon: 'M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M4,6V18H11V6H4M13,6V18H20V6H13Z', topic: 'arrays' },
                { name: 'Strings', icon: 'M12.5,8C13.3,8 14,8.7 14,9.5C14,10.3 13.3,11 12.5,11C11.7,11 11,10.3 11,9.5C11,8.7 11.7,8 12.5,8M12.5,2C17,2 20.5,5.5 20.5,10C20.5,12.3 19.4,14.4 17.6,15.7L16.2,14.3C17.5,13.4 18.5,11.8 18.5,10C18.5,6.7 15.8,4 12.5,4C9.2,4 6.5,6.7 6.5,10C6.5,11.8 7.5,13.4 8.8,14.3L7.4,15.7C5.6,14.4 4.5,12.3 4.5,10C4.5,5.5 8,2 12.5,2Z', topic: 'strings' },
                { name: 'Linked Lists', icon: 'M3,7A2,2 0 0,1 5,5A2,2 0 0,1 7,7A2,2 0 0,1 5,9A2,2 0 0,1 3,7M3,17A2,2 0 0,1 5,15A2,2 0 0,1 7,17A2,2 0 0,1 5,19A2,2 0 0,1 3,17M17,7A2,2 0 0,1 19,5A2,2 0 0,1 21,7A2,2 0 0,1 19,9A2,2 0 0,1 17,7M17,17A2,2 0 0,1 19,15A2,2 0 0,1 21,17A2,2 0 0,1 19,19A2,2 0 0,1 17,17M8,7H16V9H8V7M8,17H16V19H8V17Z', topic: 'linkedlists' },
                { name: 'Stacks & Queues', icon: 'M2,3H8V5H4V19H8V21H2V3M22,3V21H16V19H20V5H16V3H22M9,10H15V12H9V10M9,6H15V8H9V6M9,14H15V16H9V14M9,18H15V20H9V18Z', topic: 'stacks-queues' },
                { name: 'Trees', icon: 'M11,1L6,7H9V16H13V7H16L11,1M12,18A2,2 0 0,1 14,20A2,2 0 0,1 12,22A2,2 0 0,1 10,20A2,2 0 0,1 12,18Z', topic: 'trees' },
                { name: 'Graphs', icon: 'M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M7,9A1,1 0 0,1 8,10A1,1 0 0,1 7,11A1,1 0 0,1 6,10A1,1 0 0,1 7,9M17,9A1,1 0 0,1 18,10A1,1 0 0,1 17,11A1,1 0 0,1 16,10A1,1 0 0,1 17,9M12,13A1,1 0 0,1 13,14A1,1 0 0,1 12,15A1,1 0 0,1 11,14A1,1 0 0,1 12,13M7,17A1,1 0 0,1 8,18A1,1 0 0,1 7,19A1,1 0 0,1 6,18A1,1 0 0,1 7,17M17,17A1,1 0 0,1 18,18A1,1 0 0,1 17,19A1,1 0 0,1 16,18A1,1 0 0,1 17,17Z', topic: 'graphs' },
                { name: 'Dynamic Programming', icon: 'M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,6L12.5,7.5L17,3L22,8L20.5,9.5L17,6L12.5,10.5L11,9M7,14H17V16H7V14Z', topic: 'dp' },
                { name: 'Binary Search', icon: 'M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z', topic: 'binary-search' },
                { name: 'Sorting', icon: 'M18,21L14,17H17V7H14L18,3L22,7H19V17H22M2,19V17H12V19H2M2,13V11H9V13H2M2,7V5H6V7H2Z', topic: 'sorting' },
                { name: 'Greedy', icon: 'M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z', topic: 'greedy' },
                { name: 'Backtracking', icon: 'M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M13,6L17.5,10.5L13,15V12H8V9H13V6Z', topic: 'backtracking' },
                { name: 'Bit Manipulation', icon: 'M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,6H13V9H16V11H13V14H11V11H8V9H11V6Z', topic: 'bit-manipulation' }
              ].map(({ name, icon, topic }) => (
                <button
                  key={topic}
                  onClick={() => {
                    if (onSheetChange) {
                      onSheetChange(`topic-${topic}`);
                    }
                    onClose();
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: isDark ? '#d1d5db' : '#4b5563',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRadius: '8px',
                    margin: '2px 0',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(30, 144, 255, 0.1)';
                    e.target.style.color = isDark ? '#1E90FF' : '#1E90FF';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                    e.target.style.color = isDark ? '#d1d5db' : '#4b5563';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d={icon} />
                  </svg>
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Company Sheets Section */}
        <div style={{ padding: '8px 0' }}>
          <button
            onClick={() => toggleSection('companies')}
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
              alignItems: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isDark ? 'white' : '#1E90FF'}>
                <path d="M12,7V3H2V21H22V7H12M6,19H4V17H6V19M6,15H4V13H6V15M6,11H4V9H6V11M6,7H4V5H6V7M10,19H8V17H10V19M10,15H8V13H10V15M10,11H8V9H10V11M10,7H8V5H10V7M20,19H12V17H20V19M20,15H12V13H20V15M20,11H12V9H20V11Z"/>
              </svg>
              {!collapsed && 'Company Sheets'}
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isDark ? '#9ca3af' : '#6b7280'} style={{ transform: expandedSections.companies ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
            </svg>
          </button>
          
          {expandedSections.companies && !collapsed && (
            <div style={{ paddingLeft: '52px', paddingRight: '20px', maxHeight: '280px', overflowY: 'auto', paddingBottom: '8px' }}>
              {companies.map(company => (
                <button
                  key={company.id}
                  onClick={() => {
                    window.location.href = `/company/${company.id}`;
                    onClose();
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: isDark ? '#d1d5db' : '#4b5563',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRadius: '8px',
                    margin: '2px 0',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(30, 144, 255, 0.1)';
                    e.target.style.color = isDark ? '#1E90FF' : '#1E90FF';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                    e.target.style.color = isDark ? '#d1d5db' : '#4b5563';
                  }}
                >
                  <img 
                    src={company.logo} 
                    alt={company.name} 
                    style={{ width: '20px', height: '20px', objectFit: 'contain' }} 
                  />
                  {company.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Code Editor Section */}
        <div style={{ padding: '8px 0' }}>
          <button
            onClick={() => {
              navigate('/code-editor');
              onClose();
            }}
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
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)';
              e.target.style.color = isDark ? '#1E90FF' : '#1E90FF';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none';
              e.target.style.color = isDark ? 'white' : '#374151';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isDark ? 'white' : '#1E90FF'}>
              <path d="M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6Z"/>
            </svg>
            {!collapsed && 'Code Editor'}
          </button>
        </div>

        {/* Mock Interview Section */}
        <div style={{ padding: '8px 0' }}>
          <button
            onClick={() => {
              navigate('/interview');
              onClose();
            }}
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
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)';
              e.target.style.color = isDark ? '#1E90FF' : '#1E90FF';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none';
              e.target.style.color = isDark ? 'white' : '#374151';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isDark ? 'white' : '#1E90FF'}>
              <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M21,9V7H15L13.5,7.5C13.1,7.4 12.6,7.5 12.1,7.8L10.5,9H3V11H9L10.5,9.5C10.9,9.6 11.4,9.5 11.9,9.2L13.5,7.5H21M7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13Z"/>
            </svg>
            {!collapsed && 'Mock Interview'}
          </button>
        </div>

        {/* Concept Notes Section */}
        <div style={{ padding: '8px 0' }}>
          <button
            onClick={() => toggleSection('conceptNotes')}
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
              alignItems: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isDark ? 'white' : '#1E90FF'}>
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              {!collapsed && 'Concept Notes'}
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isDark ? '#9ca3af' : '#6b7280'} style={{ transform: expandedSections.conceptNotes ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
            </svg>
          </button>
          
          {expandedSections.conceptNotes && !collapsed && (
            <div style={{ paddingLeft: '52px', paddingRight: '20px', paddingBottom: '8px' }}>
              {[
                { name: 'Arrays', topic: 'Arrays' },
                { name: 'Strings', topic: 'Strings' },
                { name: 'Trees', topic: 'Trees' },
                { name: 'Graphs', topic: 'Graphs' },
                { name: 'Dynamic Programming', topic: 'DP' },
                { name: 'Linked Lists', topic: 'LinkedLists' },
                { name: 'C++ Programming', topic: 'CPP' },
                { name: 'C++ Syntax & STL', topic: 'CPP_SYNTAX' }
              ].map(({ name, topic }) => (
                <button
                  key={topic}
                  onClick={() => {
                    console.log('Opening concept notes for:', topic);
                    if (window.openConceptNotes) {
                      window.openConceptNotes(topic);
                    } else {
                      console.log('openConceptNotes function not found');
                    }
                    onClose();
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: isDark ? '#d1d5db' : '#4b5563',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRadius: '8px',
                    margin: '2px 0',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(30, 144, 255, 0.1)';
                    e.target.style.color = isDark ? '#1E90FF' : '#1E90FF';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                    e.target.style.color = isDark ? '#d1d5db' : '#4b5563';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Spaced Repetition Section */}
    


        {/* Mentorship Section */}
        <div style={{ padding: '8px 0' }}>
          <button
           onClick={() => {
  toggleSection('mentorship');
  navigate("/mentorship");
}}
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
              alignItems: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isDark ? 'white' : '#1E90FF'}>
                <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M21,9V7H15L13.5,7.5C13.1,7.4 12.6,7.5 12.1,7.8L10.5,9H3V11H9L10.5,9.5C10.9,9.6 11.4,9.5 11.9,9.2L13.5,7.5H21M7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13Z"/>
              </svg>
              {!collapsed && 'Find Mentors'}
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isDark ? '#9ca3af' : '#6b7280'} style={{ transform: expandedSections.mentorship ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
            </svg>
          </button>
          
          {expandedSections.mentorship && !collapsed && (
            <div style={{ paddingLeft: '52px', paddingRight: '20px', paddingBottom: '8px' }}>

            </div>
          )}
        </div>

        {/* Profile Section */}
        <div style={{ padding: '8px 0' }}>
          <button
            onClick={() => {
              console.log('👤 Opening profile for user:', user);
              onOpenProfile();
              if (isMobile) onClose();
            }}
            style={{
              width: '100%',
              padding: '16px 20px',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              color: isDark ? '#e5e7eb' : '#374151',
              fontSize: '15px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)';
              e.target.style.color = isDark ? '#1E90FF' : '#1E90FF';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none';
              e.target.style.color = isDark ? '#e5e7eb' : '#374151';
            }}
          >
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name || 'User'}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(255,255,255,0.2)'
                }}
              />
            ) : (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isDark ? 'linear-gradient(135deg, #1E90FF 0%, #1f2937 100%)' : 'linear-gradient(135deg, #1E90FF 0%, #60a5fa 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '14px'
              }}>
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            )}
            {!collapsed && (
              <div>
                <div style={{ fontWeight: '500', fontSize: '14px' }}>
                  {user.name || 'User Profile'}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>
                  View & Edit Profile
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Logout */}
        <div style={{ padding: '20px', marginTop: 'auto' }}>
          <button
            onClick={() => {
              console.log('🚪 Logging out user...');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              // Clear all sheet-specific data
              localStorage.removeItem('apnaCollege_completedProblems');
              localStorage.removeItem('apnaCollege_starredProblems');
              localStorage.removeItem('apnaCollege_notes');
              localStorage.removeItem('apnaCollege_playlists');
              localStorage.removeItem('loveBabbar_completedProblems');
              localStorage.removeItem('loveBabbar_starredProblems');
              localStorage.removeItem('loveBabbar_notes');
              localStorage.removeItem('loveBabbar_playlists');
              window.location.href = '/login';
            }}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
