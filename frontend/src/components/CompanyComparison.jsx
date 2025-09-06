import React, { useState } from 'react';
import { companyList, getCompanyStats } from '../data/companyWiseQuestions';
import './CompanyComparison.css';

const CompanyComparison = () => {
  const [selectedCompanies, setSelectedCompanies] = useState(['amazon', 'google']);
  const [showComparison, setShowComparison] = useState(false);
  const companyStats = getCompanyStats();

  const handleCompanySelect = (companyId) => {
    if (selectedCompanies.includes(companyId)) {
      setSelectedCompanies(selectedCompanies.filter(id => id !== companyId));
    } else if (selectedCompanies.length < 4) {
      setSelectedCompanies([...selectedCompanies, companyId]);
    }
  };

  const getCompanyData = (companyId) => {
    const company = companyList.find(c => c.id === companyId);
    const stats = companyStats.find(s => s.id === companyId);
    return { ...company, ...stats };
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#28a745';
      case 'Medium': return '#ffc107';
      case 'Hard': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="company-comparison">
      <div className="comparison-header">
        <h2>🔍 Company Comparison</h2>
        <p>Compare DSA question patterns across different companies</p>
        <button 
          className="toggle-comparison-btn"
          onClick={() => setShowComparison(!showComparison)}
        >
          {showComparison ? 'Hide Comparison' : 'Show Comparison'}
        </button>
      </div>

      {showComparison && (
        <>
          <div className="company-selector">
            <h3>Select Companies to Compare (Max 4)</h3>
            <div className="company-chips">
              {companyList.map(company => (
                <div
                  key={company.id}
                  className={`company-chip ${selectedCompanies.includes(company.id) ? 'selected' : ''}`}
                  onClick={() => handleCompanySelect(company.id)}
                  style={{ borderColor: selectedCompanies.includes(company.id) ? company.color : '#e9ecef' }}
                >
                  <div className="chip-logo">
                    <img 
                      src={company.logo} 
                      alt={`${company.name} logo`} 
                      className="chip-logo-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'inline';
                      }}
                    />
                    <span 
                      className="chip-logo-emoji" 
                      style={{ display: 'none' }}
                    >
                      {company.emoji || company.name.charAt(0)}
                    </span>
                  </div>
                  <span>{company.name}</span>
                  {selectedCompanies.includes(company.id) && (
                    <span className="selected-indicator">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {selectedCompanies.length >= 2 && (
            <div className="comparison-table">
              <div className="table-header">
                <div className="metric-column">Metrics</div>
                {selectedCompanies.map(companyId => {
                  const company = getCompanyData(companyId);
                  return (
                    <div key={companyId} className="company-column">
                      <div className="company-header">
                        <div className="company-logo-small">
                          <img 
                            src={company.logo} 
                            alt={`${company.name} logo`} 
                            className="logo-small-img"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'inline';
                            }}
                          />
                          <span 
                            className="logo-small-emoji"
                            style={{ display: 'none' }}
                          >
                            {company.emoji || company.name.charAt(0)}
                          </span>
                        </div>
                        <span>{company.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="table-body">
                <div className="table-row">
                  <div className="metric-cell">Total Questions</div>
                  {selectedCompanies.map(companyId => {
                    const company = getCompanyData(companyId);
                    return (
                      <div key={companyId} className="data-cell">
                        <span className="metric-value">{company.totalQuestions}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="table-row">
                  <div className="metric-cell">Most Common Topic</div>
                  {selectedCompanies.map(companyId => {
                    const company = getCompanyData(companyId);
                    return (
                      <div key={companyId} className="data-cell">
                        <span className="topic-badge">{company.mostCommonTopic}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="table-row">
                  <div className="metric-cell">Easy Questions</div>
                  {selectedCompanies.map(companyId => {
                    const company = getCompanyData(companyId);
                    return (
                      <div key={companyId} className="data-cell">
                        <span className="difficulty-count" style={{ color: getDifficultyColor('Easy') }}>
                          {company.difficultyCount.Easy}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="table-row">
                  <div className="metric-cell">Medium Questions</div>
                  {selectedCompanies.map(companyId => {
                    const company = getCompanyData(companyId);
                    return (
                      <div key={companyId} className="data-cell">
                        <span className="difficulty-count" style={{ color: getDifficultyColor('Medium') }}>
                          {company.difficultyCount.Medium}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="table-row">
                  <div className="metric-cell">Hard Questions</div>
                  {selectedCompanies.map(companyId => {
                    const company = getCompanyData(companyId);
                    return (
                      <div key={companyId} className="data-cell">
                        <span className="difficulty-count" style={{ color: getDifficultyColor('Hard') }}>
                          {company.difficultyCount.Hard}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="table-row">
                  <div className="metric-cell">High Priority Questions</div>
                  {selectedCompanies.map(companyId => {
                    const company = getCompanyData(companyId);
                    const highPriority = company.frequencyCount['Very High'] + company.frequencyCount['High'];
                    return (
                      <div key={companyId} className="data-cell">
                        <span className="priority-count">{highPriority}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="table-row">
                  <div className="metric-cell">Founded</div>
                  {selectedCompanies.map(companyId => {
                    const company = getCompanyData(companyId);
                    return (
                      <div key={companyId} className="data-cell">
                        <span className="founded-year">{company.founded}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="table-row">
                  <div className="metric-cell">Industry</div>
                  {selectedCompanies.map(companyId => {
                    const company = getCompanyData(companyId);
                    return (
                      <div key={companyId} className="data-cell">
                        <span className="industry-tag">{company.industry}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompanyComparison;