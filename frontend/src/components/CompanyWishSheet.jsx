import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { companyList } from '../data/companyWiseQuestions';
import Header from './Header';

import Sidebar from './Sidebar';
// import './CompanyWishSheet.css'; // CSS file removed

const CompanyWishSheet = ({ onSheetChange }) => {
  const { isDark } = useTheme();
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userCompany, setUserCompany] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleCompanyToggle = (companyId) => {
    if (selectedCompanies.includes(companyId)) {
      setSelectedCompanies(selectedCompanies.filter(id => id !== companyId));
    } else {
      setSelectedCompanies([...selectedCompanies, companyId]);
    }
  };

  const filteredCompanies = companyList.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Smart filtering based on user input
    if (userCompany || userRole) {
      const companyMatch = userCompany ? 
        company.name.toLowerCase().includes(userCompany.toLowerCase()) ||
        company.industry.toLowerCase().includes(userCompany.toLowerCase()) : true;
      
      const roleMatch = userRole ?
        company.description.toLowerCase().includes(userRole.toLowerCase()) ||
        company.industry.toLowerCase().includes(userRole.toLowerCase()) : true;
      
      return matchesSearch && (companyMatch || roleMatch);
    }
    
    return matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#28a745';
      case 'Medium': return '#ffc107';
      case 'Hard': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className={`dsa-sheet-container ${isDark ? 'dark' : ''}`} style={{ marginLeft: isMobile ? 0 : (sidebarCollapsed ? '20px' : '320px') }}>

      
      {/* Header Component */}
      <Header 
        currentSheet="companyWish"
        onSheetChange={onSheetChange}
        isMobile={isMobile}
        onSidebarOpen={() => setSidebarOpen(true)}
        onCodeEditor={() => {}}
        onChat={() => {}}
        showChat={false}
      />
      
      <div className="company-wish-sheet">
      <div className="wish-sheet-header">
        <h1>🌟 Company Wish Sheet</h1>
        <p>Explore and select your dream companies for DSA preparation</p>
        
        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search companies by name or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginLeft: '12px'
            }}
          >
            🎯 Smart Filter
          </button>
        </div>
        
        {showFilters && (
          <div style={{
            padding: '20px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            marginTop: '16px'
          }}>
            <h4 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>🎯 Personalized Company Filter</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Your Current/Target Company</label>
                <input
                  type="text"
                  placeholder="e.g., Google, Microsoft, Startup"
                  value={userCompany}
                  onChange={(e) => setUserCompany(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Your Role/Interest</label>
                <input
                  type="text"
                  placeholder="e.g., SDE, Data Scientist, PM"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                />
              </div>
            </div>
            
            {(userCompany || userRole) && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: isDark ? '#1e3a8a' : '#dbeafe',
                borderRadius: '6px',
                fontSize: '14px',
                color: isDark ? '#bfdbfe' : '#1e40af'
              }}>
                🎯 Showing companies similar to <strong>{userCompany}</strong> for <strong>{userRole}</strong> roles
              </div>
            )}
          </div>
        )}

        {selectedCompanies.length > 0 && (
          <div className="selected-summary">
            <h3>Selected Companies ({selectedCompanies.length})</h3>
            <div className="selected-chips">
              {selectedCompanies.map(companyId => {
                const company = companyList.find(c => c.id === companyId);
                return (
                  <div key={companyId} className="selected-chip">
                    <div className="chip-logo">
                      {company.logo.startsWith('http') ? (
                        <img src={company.logo} alt={company.name} className="chip-logo-img" />
                      ) : (
                        <span className="chip-logo-emoji">{company.emoji}</span>
                      )}
                    </div>
                    <span>{company.name}</span>
                    <button 
                      className="remove-chip"
                      onClick={() => handleCompanyToggle(companyId)}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="companies-grid">
        {filteredCompanies.map(company => (
          <div 
            key={company.id} 
            className={`company-card ${selectedCompanies.includes(company.id) ? 'selected' : ''}`}
            onClick={() => handleCompanyToggle(company.id)}
          >
            <div className="card-header">
              <div className="company-logo">
                {company.logo.startsWith('http') ? (
                  <img 
                    src={company.logo} 
                    alt={company.name} 
                    className="logo-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="logo-fallback" 
                  style={{ display: company.logo.startsWith('http') ? 'none' : 'flex' }}
                >
                  <span className="logo-emoji">{company.emoji}</span>
                </div>
              </div>
              
              {selectedCompanies.includes(company.id) && (
                <div className="selected-badge">
                  <span>✓</span>
                </div>
              )}
            </div>

            <div className="card-content">
              <h3 className="company-name">{company.name}</h3>
              <p className="company-industry">{company.industry}</p>
              
              <div className="company-details">
                <div className="detail-item">
                  <span className="detail-label">Founded:</span>
                  <span className="detail-value">{company.founded}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">HQ:</span>
                  <span className="detail-value">{company.headquarters}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Questions:</span>
                  <span className="detail-value questions-count">{company.totalQuestions}</span>
                </div>
              </div>

              <p className="company-description">{company.description}</p>
            </div>

            <div className="card-footer">
              <button 
                className={`wish-button ${selectedCompanies.includes(company.id) ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCompanyToggle(company.id);
                }}
              >
                {selectedCompanies.includes(company.id) ? (
                  <>
                    <span>✓</span> Added to Wishlist
                  </>
                ) : (
                  <>
                    <span>+</span> Add to Wishlist
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="no-results">
          <h3>No companies found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      )}
      </div>
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={isMobile ? sidebarOpen : true} 
        onClose={() => setSidebarOpen(false)} 
        isMobile={isMobile}
        collapsed={!isMobile && sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenProfile={() => setProfileOpen(true)}
        onSheetChange={onSheetChange}
      />
      
      {/* Floating Expand Button */}
      {!isMobile && sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          style={{
            position: 'fixed',
            top: '20px',
            left: '90px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: isDark ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
            border: isDark ? '2px solid #4b5563' : '2px solid #e2e8f0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isDark ? '#60a5fa' : '#3b82f6'}>
            <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" style={{ transform: 'rotate(180deg)' }}/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default CompanyWishSheet;