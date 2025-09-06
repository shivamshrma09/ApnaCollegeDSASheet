import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Header = ({ 
  currentSheet, 
  onSheetChange, 
  isMobile, 
  onSidebarOpen, 
  onCodeEditor, 
  onChat, 
  showChat 
}) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <div className="dsa-sheet-header">
      <div className="header-content">
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          {isMobile && (
            <button
              onClick={onSidebarOpen}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                color: 'white',
                fontSize: '16px',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
              </svg>
            </button>
          )}
          <div className="header-logo-link" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
            <img 
              src={isDark ? "/dark.png" : "/light.png"} 
              alt="DSA Sheet - Apna College" 
              className="logo" 
              style={{ 
                height: isDark ? '45px' : '38px', 
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
          <div className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* DSA Sheets Dropdown */}
            <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}
              onMouseLeave={() => {
                setTimeout(() => {
                  const dropdown = document.querySelector('.dropdown-content');
                  if (dropdown && !dropdown.matches(':hover')) {
                    dropdown.style.display = 'none';
                  }
                }, 300);
              }}>
              <button 
                className="dropdown-btn"
                style={{
                  backgroundColor: ['apnaCollege', 'striverA2Z', 'loveBabbar', 'blind75', 'striverBlind75', 'striver79', 'striverSDE'].includes(currentSheet) 
                    ? (isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(30, 144, 255, 0.1)') 
                    : 'transparent',
                  border: 'none',
                  color: ['apnaCollege', 'striverA2Z', 'loveBabbar', 'blind75', 'striverBlind75', 'striver79', 'striverSDE'].includes(currentSheet)
                         ? '#1E90FF'
                         : isDark 
                           ? 'white' 
                           : '#1E90FF',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onMouseEnter={(e) => {
                  const dropdown = e.target.nextElementSibling;
                  if (dropdown) dropdown.style.display = 'block';
                  e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(30, 144, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = ['apnaCollege', 'striverA2Z', 'loveBabbar', 'blind75', 'striverBlind75', 'striver79', 'striverSDE'].includes(currentSheet) 
                    ? (isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(30, 144, 255, 0.1)') 
                    : 'transparent';
                }}
              >
                DSA Sheets
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7,10L12,15L17,10H7Z"/>
                </svg>
              </button>
              <div 
                className="dropdown-content"
                style={{
                  display: 'none',
                  position: 'absolute',
                  backgroundColor: isDark ? '#1f2937' : 'white',
                  minWidth: '240px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  borderRadius: '12px',
                  border: isDark ? '1px solid #374151' : '1px solid #e2e8f0',
                  top: '100%',
                  left: '0',
                  marginTop: '8px',
                  padding: '8px 0'
                }}
                onMouseEnter={(e) => {
                  e.target.style.display = 'block';
                }}
                onMouseLeave={(e) => {
                  e.target.style.display = 'none';
                }}
              >
                <button onClick={() => onSheetChange('apnaCollege')} style={{
                  color: isDark ? 'white' : '#1f2937',
                  padding: '12px 16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '8px',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = isDark ? '#4b5563' : '#f3f4f6';
                  e.target.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateX(0)';
                }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/>
                  </svg>
                  Apna College (373 Problems)
                </button>
                <button onClick={() => onSheetChange('striverA2Z')} style={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  padding: '10px 16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '8px',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9,5V9H15V5M9,19H15V15H9M9,14H15V10H9M4,9V5H8V9M4,19H8V15H4M4,14H8V10H4M20,5V9H16V5M20,19H16V15H20M20,14H16V10H20Z"/>
                  </svg>
                  Striver A2Z (455 Problems)
                </button>
                <button onClick={() => onSheetChange('loveBabbar')} style={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  padding: '10px 16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '8px',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
                  </svg>
                  Love Babbar (450 Problems)
                </button>
                <button onClick={() => onSheetChange('blind75')} style={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  padding: '10px 16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '8px',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2L13.09,8.26L22,9L14,14L17,23L12,18L7,23L10,14L2,9L10.91,8.26L12,2Z"/>
                  </svg>
                  Blind 75 (75 Problems)
                </button>
                <button onClick={() => onSheetChange('striverBlind75')} style={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  padding: '10px 16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '8px',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2L13.09,8.26L22,9L14,14L17,23L12,18L7,23L10,14L2,9L10.91,8.26L12,2Z"/>
                  </svg>
                  Striver Blind 75 (75 Problems)
                </button>
                <button onClick={() => onSheetChange('striver79')} style={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  padding: '10px 16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '8px',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2L13.09,8.26L22,9L14,14L17,23L12,18L7,23L10,14L2,9L10.91,8.26L12,2Z"/>
                  </svg>
                  Striver 79 (79 Problems)
                </button>
                <button onClick={() => onSheetChange('striverSDE')} style={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  padding: '10px 16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '8px',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/>
                  </svg>
                  SDE Sheet (191 Problems)
                </button>
                <button onClick={() => onSheetChange('vision')} style={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  padding: '10px 16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '8px',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                  </svg>
                  VISION Sheet (100 Problems)
                </button>
                <button onClick={() => onSheetChange('neetcode150')} style={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  padding: '10px 16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '8px',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z"/>
                  </svg>
                  NeetCode 150 (150 Problems)
                </button>
                <button onClick={() => onSheetChange('leetcodeTop150')} style={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  padding: '10px 16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '8px',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z"/>
                  </svg>
                  LeetCode Top 150 (150 Problems)
                </button>
              </div>
            </div>

            {/* CP Dropdown */}
            <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
              <button 
                className="dropdown-btn"
                style={{
                  backgroundColor: (currentSheet === 'striverCP' || currentSheet === 'cp31' || currentSheet === 'visionCP') 
                    ? (isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(30, 144, 255, 0.1)') 
                    : 'transparent',
                  border: 'none',
                  color: (currentSheet === 'striverCP' || currentSheet === 'cp31' || currentSheet === 'visionCP')
                         ? '#1E90FF'
                         : isDark 
                           ? 'white' 
                           : '#1E90FF',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onMouseEnter={(e) => {
                  const dropdown = e.target.nextElementSibling;
                  if (dropdown) dropdown.style.display = 'block';
                  e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(30, 144, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = (currentSheet === 'striverCP' || currentSheet === 'cp31' || currentSheet === 'visionCP') 
                    ? (isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(30, 144, 255, 0.1)') 
                    : 'transparent';
                }}
              >
                CP
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7,10L12,15L17,10H7Z"/>
                </svg>
              </button>
              <div 
                className="dropdown-content"
                style={{
                  display: 'none',
                  position: 'absolute',
                  backgroundColor: isDark ? '#1f2937' : 'white',
                  minWidth: '240px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  borderRadius: '12px',
                  border: isDark ? '1px solid #374151' : '1px solid #e2e8f0',
                  top: '100%',
                  left: '0',
                  marginTop: '8px',
                  padding: '8px 0'
                }}
                onMouseEnter={(e) => {
                  e.target.style.display = 'block';
                }}
                onMouseLeave={(e) => {
                  e.target.style.display = 'none';
                }}
              >
                <button onClick={() => onSheetChange('striverCP')} style={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  padding: '10px 16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '8px',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z"/>
                  </svg>
                  Striver CP Sheet (298 Problems)
                </button>
                <button onClick={() => onSheetChange('cp31')} style={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  padding: '10px 16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '8px',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z"/>
                  </svg>
                  CP-31 Sheet (372 Problems)
                </button>
                <button onClick={() => onSheetChange('visionCP')} style={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  padding: '10px 16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '8px',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                  </svg>
                  VISION CP Sheet (135 Problems)
                </button>
              </div>
            </div>

            {/* Company Wise Sheet Dropdown */}
            <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
              <button 
                className="dropdown-btn"
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: isDark ? 'white' : '#1E90FF',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onMouseEnter={(e) => {
                  const dropdown = e.target.nextElementSibling;
                  if (dropdown) dropdown.style.display = 'block';
                  e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(30, 144, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                Company Wise
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7,10L12,15L17,10H7Z"/>
                </svg>
              </button>
              <div 
                className="dropdown-content"
                style={{
                  display: 'none',
                  position: 'absolute',
                  backgroundColor: isDark ? '#1f2937' : 'white',
                  minWidth: '240px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  borderRadius: '12px',
                  border: isDark ? '1px solid #374151' : '1px solid #e2e8f0',
                  top: '100%',
                  left: '0',
                  marginTop: '8px',
                  padding: '8px 0'
                }}
                onMouseEnter={(e) => {
                  e.target.style.display = 'block';
                }}
                onMouseLeave={(e) => {
                  e.target.style.display = 'none';
                }}
              >
                <button onClick={() => window.location.href = '/company/amazon'} style={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  padding: '10px 16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '8px',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z"/>
                  </svg>
                  Amazon
                </button>
                <button onClick={() => window.location.href = '/company/google'} style={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  padding: '10px 16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '8px',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z"/>
                  </svg>
                  Google
                </button>
                <button onClick={() => window.location.href = '/company/microsoft'} style={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  padding: '10px 16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '8px',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z"/>
                  </svg>
                  Microsoft
                </button>
                <button onClick={() => window.location.href = '/company/facebook'} style={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  padding: '10px 16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '8px',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z"/>
                  </svg>
                  Facebook
                </button>
                <button onClick={() => window.location.href = '/company-wish-sheet'} style={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  padding: '10px 16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '8px',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M9,17H7V10H9V17M13,17H11V7H13V17M17,17H15V13H17V17Z"/>
                  </svg>
                  All Companies
                </button>
              </div>
            </div>

            {/* System Design Dropdown */}
            <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
              <button 
                className="dropdown-btn"
                style={{
                  backgroundColor: currentSheet === 'systemDesign' 
                    ? (isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(30, 144, 255, 0.1)') 
                    : 'transparent',
                  border: 'none',
                  color: currentSheet === 'systemDesign'
                         ? '#1E90FF'
                         : isDark 
                           ? 'white' 
                           : '#1E90FF',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onMouseEnter={(e) => {
                  const dropdown = e.target.nextElementSibling;
                  if (dropdown) dropdown.style.display = 'block';
                  e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(30, 144, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = currentSheet === 'systemDesign' 
                    ? (isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(30, 144, 255, 0.1)') 
                    : 'transparent';
                }}
              >
                System Design
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7,10L12,15L17,10H7Z"/>
                </svg>
              </button>
              <div 
                className="dropdown-content"
                style={{
                  display: 'none',
                  position: 'absolute',
                  backgroundColor: isDark ? '#1f2937' : 'white',
                  minWidth: '240px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  borderRadius: '12px',
                  border: isDark ? '1px solid #374151' : '1px solid #e2e8f0',
                  top: '100%',
                  left: '0',
                  marginTop: '8px',
                  padding: '8px 0'
                }}
                onMouseEnter={(e) => {
                  e.target.style.display = 'block';
                }}
                onMouseLeave={(e) => {
                  e.target.style.display = 'none';
                }}
              >
                <button onClick={() => onSheetChange('systemDesign')} style={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  padding: '10px 16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '8px',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#374151' : '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z"/>
                  </svg>
                  System Design Roadmap (70 Topics)
                </button>
              </div>
            </div>
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <button 
            onClick={onCodeEditor}
            style={{
              padding: '10px 14px',
              background: 'transparent',
              color: isDark ? 'white' : '#1E90FF',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(30, 144, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z"/>
            </svg>
            Code
          </button>

          <button 
            onClick={onChat}
            style={{
              padding: '10px 14px',
              background: showChat ? (isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(30, 144, 255, 0.1)') : 'transparent',
              color: showChat ? '#1E90FF' : (isDark ? 'white' : '#1E90FF'),
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!showChat) {
                e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(30, 144, 255, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!showChat) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,3C6.5,3 2,6.58 2,11C2.05,13.15 3.06,15.17 4.75,16.5C4.75,17.1 4.33,18.67 2,21C4.37,20.89 6.64,20 8.47,18.5C9.61,18.83 10.81,19 12,19C17.5,19 22,15.42 22,11C22,6.58 17.5,3 12,3Z"/>
            </svg>
            Chat
          </button>
          <button 
            onClick={toggleTheme}
            style={{
              padding: '10px 14px',
              background: 'transparent',
              color: isDark ? 'white' : '#1E90FF',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(30, 144, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            {isDark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.4 6.35,17.41C9.37,20.43 14,20.54 17.33,17.97Z"/>
              </svg>
            )}
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;