import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import { useUserProgress } from '../hooks/useUserProgress';
import PlaylistManager from './PlaylistManager';
import ProblemModal from './ProblemModal';
import SideCard from './SideCard';
import SideImages from './SideImages';
import './DSASheet.css';

const API_BASE_URL = import.meta.env.VITE_API_URL + '/api' ;

const DSASheet = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState(new Set([1]));
  const [currentView, setCurrentView] = useState('problems');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [streak, setStreak] = useState(0);
  const [problemOfTheDay, setProblemOfTheDay] = useState(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [dailyProblems, setDailyProblems] = useState([]);
  const { toggleTheme, isDark } = useTheme();
  
  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || '64f8a1b2c3d4e5f6a7b8c9d0';
  };
  
  const userId = getUserId();
  
  const {
    completedProblems,
    starredProblems,
    notes,
    playlists,
    loading: progressLoading,
    toggleComplete,
    toggleStar,
    saveNote,
    deleteNote,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addToPlaylist
  } = useUserProgress(userId);

  useEffect(() => {
    const fetchProblems = async () => {
      // Always load local data first
      const { dsaProblemsData } = await import('../data/problems');
      setProblems(dsaProblemsData);
      setLoading(false);
    };
    
    fetchProblems();
    calculateStreak();
    setProblemOfTheDay(getRandomProblem());
    loadDailyProblems();
    

    const timer = setTimeout(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
      }
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);

  const calculateStreak = () => {
    const today = new Date().toDateString();
    const lastSolved = localStorage.getItem('lastSolved');
    const currentStreak = parseInt(localStorage.getItem('streak') || '0');
    
    if (lastSolved === today) {
      setStreak(currentStreak);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastSolved === yesterday.toDateString()) {
        setStreak(currentStreak);
      } else {
        setStreak(0);
      }
    }
  };

  const getRandomProblem = () => {
    const today = new Date().toDateString();
    const savedPOTD = localStorage.getItem('potd');
    const savedDate = localStorage.getItem('potdDate');
    
    if (savedPOTD && savedDate === today) {
      return JSON.parse(savedPOTD);
    }
    
    const allProblems = problems.flatMap(topic => topic.problems);
    if (allProblems.length === 0) return null;
    
    const randomProblem = allProblems[Math.floor(Math.random() * allProblems.length)];
    localStorage.setItem('potd', JSON.stringify(randomProblem));
    localStorage.setItem('potdDate', today);
    return randomProblem;
  };

  const getUserStartDate = () => {
    return localStorage.getItem('signupDate') || new Date().toISOString();
  };

  const calculateUserDay = () => {
    const userStartDate = new Date(getUserStartDate());
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - userStartDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const loadDailyProblems = async () => {
    try {
      const { getProblemsForDay } = await import('../data/dailyProblems');
      const userDay = calculateUserDay();
      const problems = getProblemsForDay(userDay);
      setDailyProblems(problems);
      setCurrentDay(userDay);
    } catch (error) {
      console.error('Error loading daily problems:', error);
    }
  };

  const getRandomFilteredProblem = () => {
    let filteredProblems = problems.flatMap(topic => topic.problems);
    
    if (difficultyFilter !== 'All') {
      filteredProblems = filteredProblems.filter(p => p.difficulty === difficultyFilter);
    }
    if (companyFilter !== 'All') {
      filteredProblems = filteredProblems.filter(p => p.companies && p.companies.toLowerCase().includes(companyFilter.toLowerCase()));
    }
    
    if (filteredProblems.length === 0) {
      alert('No problems found with current filters');
      return;
    }
    
    const randomProblem = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];
    setSelectedProblem(randomProblem);
    setModalOpen(true);
  };

  const toggleTopic = (topicId) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const getTotalProblems = () => {
    return problems.reduce((total, topic) => total + topic.problems.length, 0);
  };

  const getTotalByDifficulty = (difficulty) => {
    return problems.reduce((total, topic) => 
      total + topic.problems.filter(p => p.difficulty === difficulty).length, 0
    );
  };

  const getCompletedByDifficulty = (difficulty) => {
    return problems.reduce((total, topic) => 
      total + topic.problems.filter(p => p.difficulty === difficulty && completedProblems.has(p.id)).length, 0
    );
  };

  const getCompanyLogos = (companiesString) => {
    if (!companiesString) return [];
    
    const companyMap = {
      'Amazon': { name: 'Amazon', domain: 'amazon.com' },
      'Google': { name: 'Google', domain: 'google.com' },
      'Microsoft': { name: 'Microsoft', domain: 'microsoft.com' },
      'Facebook': { name: 'Facebook', domain: 'facebook.com' },
      'Apple': { name: 'Apple', domain: 'apple.com' },
      'Netflix': { name: 'Netflix', domain: 'netflix.com' },
      'Uber': { name: 'Uber', domain: 'uber.com' },
      'Adobe': { name: 'Adobe', domain: 'adobe.com' },
      'Samsung': { name: 'Samsung', domain: 'samsung.com' },
      'Goldman Sachs': { name: 'Goldman Sachs', domain: 'goldmansachs.com' },
      'Flipkart': { name: 'Flipkart', domain: 'flipkart.com' },
      'Paytm': { name: 'Paytm', domain: 'paytm.com' },
      'Walmart': { name: 'Walmart', domain: 'walmart.com' },
      'Oracle': { name: 'Oracle', domain: 'oracle.com' },
      'IBM': { name: 'IBM', domain: 'ibm.com' },
      'Accolite': { name: 'Accolite', domain: 'accolite.com' },
      'D-E-Shaw': { name: 'D-E-Shaw', domain: 'deshaw.com' },
      'FactSet': { name: 'FactSet', domain: 'factset.com' },
      'Hike': { name: 'Hike', domain: 'hike.in' },
      'MakeMyTrip': { name: 'MakeMyTrip', domain: 'makemytrip.com' },
      'MAQ Software': { name: 'MAQ Software', domain: 'maqsoftware.com' },
      'OYO Rooms': { name: 'OYO', domain: 'oyorooms.com' },
      'Qualcomm': { name: 'Qualcomm', domain: 'qualcomm.com' },
      'Snapdeal': { name: 'Snapdeal', domain: 'snapdeal.com' },
      'VMWare': { name: 'VMware', domain: 'vmware.com' },
      'Zoho': { name: 'Zoho', domain: 'zoho.com' },
      'Intuit': { name: 'Intuit', domain: 'intuit.com' },
      'Cisco': { name: 'Cisco', domain: 'cisco.com' },
      'Morgan Stanley': { name: 'Morgan Stanley', domain: 'morganstanley.com' },
      'Visa': { name: 'Visa', domain: 'visa.com' },
      'Directi': { name: 'Directi', domain: 'directi.com' },
      'Myntra': { name: 'Myntra', domain: 'myntra.com' },
      'Ola Cabs': { name: 'Ola', domain: 'olacabs.com' },
      'PayPal': { name: 'PayPal', domain: 'paypal.com' },
      'Swiggy': { name: 'Swiggy', domain: 'swiggy.com' },
      'Media.net': { name: 'Media.net', domain: 'media.net' },
      'Salesforce': { name: 'Salesforce', domain: 'salesforce.com' },
      'Sapient': { name: 'Sapient', domain: 'sapient.com' },
      'Pubmatic': { name: 'PubMatic', domain: 'pubmatic.com' },
      'Quikr': { name: 'Quikr', domain: 'quikr.com' },
      'Yatra.com': { name: 'Yatra', domain: 'yatra.com' },
      'Belzabar': { name: 'Belzabar', domain: 'belzabar.com' },
      'Brocade': { name: 'Brocade', domain: 'brocade.com' },
      'OATS Systems': { name: 'OATS Systems', domain: 'oatssystems.com' },
      'Synopsys': { name: 'Synopsys', domain: 'synopsys.com' },
      'Lybrate': { name: 'Lybrate', domain: 'lybrate.com' },
      'Mahindra Comviva': { name: 'Mahindra Comviva', domain: 'mahindracomviva.com' },
      'SAP Labs': { name: 'SAP', domain: 'sap.com' },
      'Veritas': { name: 'Veritas', domain: 'veritas.com' },
      'Kritikal Solutions': { name: 'Kritikal Solutions', domain: 'kritikalsolutions.com' },
      'Monotype Solutions': { name: 'Monotype', domain: 'monotype.com' },
      'Epic Systems': { name: 'Epic Systems', domain: 'epic.com' },
      'Citicorp': { name: 'Citigroup', domain: 'citigroup.com' },
      'CouponDunia': { name: 'CouponDunia', domain: 'coupondunia.in' },
      'FreeCharge': { name: 'FreeCharge', domain: 'freecharge.in' },
      'Cadence India': { name: 'Cadence', domain: 'cadence.com' },
      'Expedia': { name: 'Expedia', domain: 'expedia.com' },
      'Linkedin': { name: 'LinkedIn', domain: 'linkedin.com' },
      'InMobi': { name: 'InMobi', domain: 'inmobi.com' },
      'Yahoo': { name: 'Yahoo', domain: 'yahoo.com' },
      'Twitter': { name: 'Twitter', domain: 'twitter.com' },
      'Amdocs': { name: 'Amdocs', domain: 'amdocs.com' },
      'Barclays': { name: 'Barclays', domain: 'barclays.com' },
      'HSBC': { name: 'HSBC', domain: 'hsbc.com' },
      'Josh Technology Group': { name: 'Josh Technology', domain: 'joshtechnologygroup.com' },
      'Sap labs': { name: 'SAP', domain: 'sap.com' },
      'DE Shaw India': { name: 'D. E. Shaw', domain: 'deshaw.com' },
      'Payu': { name: 'PayU', domain: 'payu.in' },
      'Drishti-Soft': { name: 'Drishti-Soft', domain: 'drishti-soft.com' },
      'Trilogy': { name: 'Trilogy', domain: 'trilogy.com' },
      '24*7 Innovation Labs': { name: '24*7 Innovation Labs', domain: '247-inc.com' },
      'Atlassian': { name: 'Atlassian', domain: 'atlassian.com' },
      'MaQ Software': { name: 'MAQ Software', domain: 'maqsoftware.com' },
      'Vmware inc': { name: 'VMware', domain: 'vmware.com' },
      'Times Internet': { name: 'Times Internet', domain: 'timesinternet.in' },
      'Codenation': { name: 'CodeNation', domain: 'codenation.co.in' },
      'Infosys': { name: 'Infosys', domain: 'infosys.com' },
      'Moonfrog Labs': { name: 'Moonfrog Labs', domain: 'moonfrog.com' },
      'Housing.com': { name: 'Housing.com', domain: 'housing.com' },
      'Oxigen Wallet': { name: 'Oxigen Wallet', domain: 'oxigenwallet.com' },
      'BankBazaar': { name: 'BankBazaar', domain: 'bankbazaar.com' },
      'Juniper Networks': { name: 'Juniper Networks', domain: 'juniper.net' },
      'Unisys': { name: 'Unisys', domain: 'unisys.com' },
      'Nearbuy': { name: 'Nearbuy', domain: 'nearbuy.com' },
      'Opera': { name: 'Opera', domain: 'opera.com' },
      'Philips': { name: 'Philips', domain: 'philips.com' },
      'Service Now': { name: 'ServiceNow', domain: 'servicenow.com' },
      'Webarch Club': { name: 'Webarch Club', domain: 'webarchclub.com' },
      'Traveloca': { name: 'Traveloka', domain: 'traveloka.com' },
      'Kuliza': { name: 'Kuliza', domain: 'kuliza.com' },
      'Razorpay': { name: 'Razorpay', domain: 'razorpay.com' },
      'Payload': { name: 'Payload', domain: 'payload.co' },
      'Lenskart': { name: 'Lenskart', domain: 'lenskart.com' },
      'Sharechat': { name: 'ShareChat', domain: 'sharechat.com' },
      'Alibaba': { name: 'Alibaba', domain: 'alibaba.com' },
      'eBay': { name: 'eBay', domain: 'ebay.com' },
      'Paypal': { name: 'PayPal', domain: 'paypal.com' },
      'Maccafe': { name: 'Maccafe', domain: 'maccafe.com' },
      'Nagarro': { name: 'Nagarro', domain: 'nagarro.com' },
      'TCS': { name: 'TCS', domain: 'tcs.com' },
      'EPAM Systems': { name: 'EPAM', domain: 'epam.com' },
      'Streamoid Technologies': { name: 'Streamoid', domain: 'streamoid.com' },
      'Dunzo': { name: 'Dunzo', domain: 'dunzo.com' },
      'Grofers': { name: 'Grofers', domain: 'grofers.com' },
      'Societe Generale': { name: 'Societe Generale', domain: 'societegenerale.com' },
      'Sprinklr': { name: 'Sprinklr', domain: 'sprinklr.com' },
      'GeekyAnts': { name: 'GeekyAnts', domain: 'geekyants.com' },
      'Delhivery': { name: 'Delhivery', domain: 'delhivery.com' },
      'Fidelity International': { name: 'Fidelity', domain: 'fidelity.com' },
      'Siemens': { name: 'Siemens', domain: 'siemens.com' },
      'Arrays Dynamic Programming': { name: 'Arrays DP', domain: 'example.com' }
    };
    
    const companies = companiesString.split(/[+,\s]+/).filter(c => c.trim());
    return companies.slice(0, 6).map(company => {
      const cleanCompany = company.trim().replace(/\s+/g, ' ');
      return companyMap[cleanCompany] || { name: cleanCompany, domain: `${cleanCompany.toLowerCase().replace(/[\s-]+/g, '')}.com` };
    });
  };

  const badge = (count, label, className) => (
    <div className={`badge ${className}`}>
      {count} {label}
    </div>
  );

  if (loading) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{width: '48px', height: '48px', border: '3px solid #e5e7eb', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto'}}></div>
          <p style={{marginTop: '16px', color: '#6b7280'}}>Loading DSA Sheet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`dsa-sheet-container ${isDark ? 'dark' : ''}`}>
      <SideCard />
      <SideImages />
      <div className="dsa-sheet-header">
        <div className="header-content">
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <div className="header-logo-link">
              <img src="/logo.png" alt="DSA Sheet" className="logo" style={{ height: '40px'}} />
            </div>
            <div className="header-nav">
              <button 
                onClick={() => setCurrentView('problems')}
                className={`nav-button    ${currentView === 'problems' ? 'active' : ''}`}
              >
                Problems
              </button>
              <button 
                onClick={() => setCurrentView('playlists')}
                className={`nav-button ${currentView === 'playlists' ? 'active' : ''}`}
              >
                Playlists
              </button>
              <button 
                onClick={() => setCurrentView('starred')}
                className={`nav-button ${currentView === 'starred' ? 'active' : ''}`}
              >
                Starred
              </button>

{/* 
              <button 
                onClick={() => setCurrentView('daily')}
                className={`nav-button ${currentView === 'daily' ? 'active' : ''}`}
              >
                Daily Practice
              </button> */}
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <button 
              onClick={toggleTheme}
              style={{
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                backdropFilter: 'blur(10px)'
              }}
            >
              🌙 Dark
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              style={{
                padding: '8px 12px',
                background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <main className="dsa-sheet-main">
        {currentView === 'problems' && (
          <>
            <section className="overview-section">
              <h1 className="main-title">Apna College DSA Sheet - 373 Questions</h1>
              <p style={{fontSize: '16px', color: '#6b7280', marginBottom: '8px'}}>Complete collection of 373 DSA problems across 16 topics. Learn DSA from A to Z for free in a well-organized and structured manner.</p>
              <a href="#" style={{color: '#3b82f6', fontSize: '14px', textDecoration: 'none'}}>Know More</a>
              
              <div style={{backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', padding: '16px', margin: '20px 0', fontSize: '14px', color: '#856404'}}>
                <strong>Note:</strong> You can find LeetCode links for problems available on the internet. However few problems are not there on LeetCode for which you will not find a practice link attached. We cannot use third-party links due to legal constraints.
              </div>
              
              <div style={{marginBottom: '24px'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '12px'}}>Total Progress (373 Questions)</h3>
                <div style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '8px'}}>
                  {completedProblems.size} / {getTotalProblems()}
                </div>
                <div style={{fontSize: '18px', color: '#3b82f6', marginBottom: '16px'}}>
                  {Math.round((completedProblems.size / getTotalProblems()) * 100)}%
                </div>
                <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
                  <div style={{textAlign: 'center'}}>
                    <div style={{color: '#22c55e', fontWeight: 'bold'}}>Easy</div>
                    <div style={{fontSize: '14px'}}>{getCompletedByDifficulty('Easy')} / {getTotalByDifficulty('Easy')} completed</div>
                  </div>
                  <div style={{textAlign: 'center'}}>
                    <div style={{color: '#f59e0b', fontWeight: 'bold'}}>Medium</div>
                    <div style={{fontSize: '14px'}}>{getCompletedByDifficulty('Medium')} / {getTotalByDifficulty('Medium')} completed</div>
                  </div>
                  <div style={{textAlign: 'center'}}>
                    <div style={{color: '#ef4444', fontWeight: 'bold'}}>Hard</div>
                    <div style={{fontSize: '14px'}}>{getCompletedByDifficulty('Hard')} / {getTotalByDifficulty('Hard')} completed</div>
                  </div>
                </div>
              </div>
              
              <div style={{display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center'}}>
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '20px', minWidth: '200px'}}
                />

                <select 
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  style={{padding: '8px 12px', border: '1px solid #cbd1d9ff', borderRadius: '6px', cursor: 'pointer', backgroundColor: 'white'}}
                >
                  <option value="All">All Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <select 
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  style={{padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', backgroundColor: 'white'}}
                >
                  <option value="All">All Companies</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Google">Google</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Apple">Apple</option>
                  <option value="Netflix">Netflix</option>
                  <option value="Uber">Uber</option>
                  <option value="Adobe">Adobe</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Goldman Sachs">Goldman Sachs</option>
                  <option value="Flipkart">Flipkart</option>
                  <option value="Paytm">Paytm</option>
                  <option value="Walmart">Walmart</option>
                  <option value="Oracle">Oracle</option>
                  <option value="IBM">IBM</option>
                </select>

              </div>
            </section>

            <section className="topics-list">
              {problems.map(topic => {
                const solvedCount = topic.problems.filter(p => completedProblems.has(p.id)).length;
                const isOpen = expandedTopics.has(topic.id);
                
                // Filter problems by difficulty, company, and search
                let filteredProblems = topic.problems;
                if (difficultyFilter !== 'All') {
                  filteredProblems = filteredProblems.filter(p => p.difficulty === difficultyFilter);
                }
                if (companyFilter !== 'All') {
                  filteredProblems = filteredProblems.filter(p => p.companies && p.companies.toLowerCase().includes(companyFilter.toLowerCase()));
                }
                if (searchQuery) {
                  filteredProblems = filteredProblems.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
                }
                const sortedProblems = [...filteredProblems].sort((a, b) => {
                  const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
                  return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
                });
                
                return (
                  <div key={topic.id} className="topic-card">
                    <div
                      className="topic-header"
                      onClick={() => toggleTopic(topic.id)}
                    >
                      <div className="topic-title-container">
                        <svg
                          className={`expand-icon ${isOpen ? 'expanded' : ''}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                        </svg>
                        <h2 className="topic-title">
                          Step {topic.id}: {topic.title}
                        </h2>
                      </div>
                      <div className="topic-progress">
                        <span className="progress-text">
                          {solvedCount}/{topic.problems.length}
                        </span>
                        <div className="progress-bar-container">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${(solvedCount / topic.problems.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="problem-list">

                        <div className="problem-table-header" style={{display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 60px 80px 60px 80px', gap: '12px', padding: '12px 24px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: '600', color: '#495057'}}>
                          <div>Status</div>
                          <div>Problem</div>
                          <div>Practice</div>
                          <div>Solution</div>
                          <div>Note</div>
                          <div>Revision</div>
                          <div>Playlist</div>
                          <div>Difficulty</div>
                        </div>
                        
                        {sortedProblems.map((p, idx) => (
                          <div
                            key={p.id}
                            className="problem-row"
                            style={{display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 60px 80px 60px 80px', gap: '12px', padding: '12px 24px', borderBottom: '1px solid #f1f3f4', alignItems: 'center', fontSize: '14px'}}
                          >
                            {/* Status */}
                            <div className="problem-status" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                              <input
                                type="checkbox"
                                checked={completedProblems.has(p.id)}
                                onChange={() => toggleComplete(p.id)}
                                style={{width: '16px', height: '16px', cursor: 'pointer'}}
                              />
                              <button
                                onClick={() => toggleComplete(p.id)}
                                style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px'}}
                              >
                                {completedProblems.has(p.id) ? (
                                  <span style={{color: '#22c55e'}}>✓</span>
                                ) : (
                                  <span style={{color: '#ef4444'}}>○</span>
                                )}
                              </button>
                            </div>
                            
                            {/* Problem */}
                            <div className="problem-info">
                              <div style={{fontWeight: '500', color: completedProblems.has(p.id) ? '#6b7280' : '#1f2937'}}>
                                {p.title}
                              </div>
                              {p.companies && (
                                <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px'}}>
                                  <span style={{fontSize: '11px', color: '#6b7280'}}>Companies:</span>
                                  <div style={{display: 'flex', gap: '4px'}}>
                                    {getCompanyLogos(p.companies).map((company, idx) => (
                                      <img 
                                        key={idx}
                                        src={`https://logo.clearbit.com/${company.domain}`}
                                        alt={company.name}
                                        style={{width: '16px', height: '16px', borderRadius: '2px', objectFit: 'contain'}}
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                        }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                              {p.hint && (
                                <p style={{fontSize: '12px', color: '#2563eb', fontStyle: 'italic', margin: '4px 0 0 0'}}>
                                  💡 {p.hint}
                                </p>
                              )}
                            </div>
                            
                            {/* Practice - Solve Button */}
                            <div className="problem-action" data-label="Practice" style={{textAlign: 'center'}}>
                              <a
                                href={p.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{backgroundColor: '#1f2937', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', textDecoration: 'none', display: 'inline-block'}}
                              >
                                <i className="fas fa-code"></i> Solve
                              </a>
                            </div>
                            
                            {/* Solution - YouTube Link */}
                            <div className="problem-action" data-label="Solution" style={{textAlign: 'center'}}>
                              <a href={p.video} target="_blank" rel="noopener noreferrer" style={{color: '#ef4444', textDecoration: 'none', fontSize: '12px', padding: '4px 8px', backgroundColor: '#fee2e2', borderRadius: '4px', display: 'inline-block'}}><i className="fab fa-youtube"></i> YT</a>
                            </div>
                            
                            {/* Note */}
                            <div className="problem-action" data-label="Note" style={{textAlign: 'center'}}>
                              <button
                                onClick={() => {
                                  setSelectedProblem(p);
                                  setModalOpen(true);
                                }}
                                style={{background: notes[p.id] ? '#fef3c7' : '#f3f4f6', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', color: notes[p.id] ? '#92400e' : '#6b7280'}}
                              >
                                <i className="fas fa-sticky-note"></i> {notes[p.id] ? 'Note' : '+'}
                              </button>
                            </div>
                            
                            {/* Revision - Star */}
                            <div className="problem-action" data-label="Star" style={{textAlign: 'center'}}>
                              <button
                                onClick={() => toggleStar(p.id)}
                                style={{background: starredProblems.has(p.id) ? '#fef3c7' : '#f3f4f6', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', color: starredProblems.has(p.id) ? '#92400e' : '#6b7280'}}
                              >
                                <i className={starredProblems.has(p.id) ? 'fas fa-star' : 'far fa-star'}></i> {starredProblems.has(p.id) ? 'Star' : '+'}
                              </button>
                            </div>
                            
                            {/* Playlist */}
                            <div className="problem-action" data-label="Playlist" style={{textAlign: 'center'}}>
                              <select
                                onChange={(e) => {
                                  if (e.target.value) {
                                    addToPlaylist(e.target.value, p.id);
                                    e.target.value = '';
                                  }
                                }}
                                style={{fontSize: '12px', padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'white'}}
                              >
                                <option value=""><i className="fas fa-list"></i> +</option>
                                {playlists.map(playlist => (
                                  <option key={playlist.id} value={playlist.id}>
                                    {playlist.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            {/* Difficulty */}
                            <div className="problem-difficulty" style={{textAlign: 'center'}}>
                              <span
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  backgroundColor: p.difficulty === 'Easy' ? '#d1fae5' : p.difficulty === 'Medium' ? '#fffbeb' : '#fee2e2',
                                  color: p.difficulty === 'Easy' ? '#047857' : p.difficulty === 'Medium' ? '#a16207' : '#991b1b'
                                }}
                              >
                                {p.difficulty}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          </>
        )}

        {currentView === 'playlists' && (
          <PlaylistManager
            playlists={playlists}
            problems={problems}
            onCreatePlaylist={createPlaylist}
            onUpdatePlaylist={updatePlaylist}
            onDeletePlaylist={deletePlaylist}
            onViewPlaylist={() => {}}
          />
        )}

        {currentView === 'starred' && (
          <section className="tab-section">
            <h2 style={{fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: '#1f2937'}}>Starred Problems</h2>
            {starredProblems.size === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '48px 24px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
                  No starred problems yet
                </h3>
                <p style={{ color: '#6b7280' }}>
                  Star problems to save them for later review
                </p>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                {problems
                  .flatMap(t => t.problems)
                  .filter(p => starredProblems.has(p.id))
                  .map(p => (
                    <div key={p.id} style={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '16px',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}>
                      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                          <h3 style={{fontWeight: '500', color: '#111827', fontSize: '16px'}}>{p.title}</h3>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '600',
                              backgroundColor: p.difficulty === 'Easy' ? '#d1fae5' : p.difficulty === 'Medium' ? '#fffbeb' : '#fee2e2',
                              color: p.difficulty === 'Easy' ? '#047857' : p.difficulty === 'Medium' ? '#a16207' : '#991b1b'
                            }}
                          >
                            {p.difficulty}
                          </span>
                        </div>
                      </div>
                      {p.companies && (
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                          <span style={{fontSize: '12px', color: '#6b7280', fontWeight: '500'}}>Companies:</span>
                          <div style={{display: 'flex', gap: '4px'}}>
                            {getCompanyLogos(p.companies).map((company, idx) => (
                              <img 
                                key={idx}
                                src={`https://logo.clearbit.com/${company.domain}`}
                                alt={company.name}
                                title={company.name}
                                style={{width: '20px', height: '20px', borderRadius: '2px', objectFit: 'contain'}}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: '#1f2937',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          Solve
                        </a>
                        <a
                          href={p.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          Solution
                        </a>
                        <button
                          onClick={() => {
                            setSelectedProblem(p);
                            setModalOpen(true);
                          }}
                          style={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          Note
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        )}

        {currentView === 'notes' && (
          <section className="tab-section">
            <h2 style={{fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: '#1f2937'}}>My Notes</h2>
            {!Object.keys(notes).length ? (
              <div style={{
                textAlign: 'center',
                padding: '48px 24px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
                  No notes yet
                </h3>
                <p style={{ color: '#6b7280' }}>
                  Add notes to problems to remember key insights and solutions
                </p>
              </div>
            ) : (
              <div style={{display: 'grid', gap: '16px'}}>
                {Object.entries(notes).map(([id, content]) => {
                  const p = problems.flatMap(t => t.problems).find(x => x.id === +id);
                  if (!p) return null;
                  return (
                    <div key={id} style={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '20px',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'}}>
                        <div style={{flex: 1}}>
                          <h4 style={{fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: '#1f2937'}}>{p.title}</h4>
                          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <span
                              style={{
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '600',
                                backgroundColor: p.difficulty === 'Easy' ? '#d1fae5' : p.difficulty === 'Medium' ? '#fffbeb' : '#fee2e2',
                                color: p.difficulty === 'Easy' ? '#047857' : p.difficulty === 'Medium' ? '#a16207' : '#991b1b'
                              }}
                            >
                              {p.difficulty}
                            </span>
                            {p.companies && (
                              <div style={{display: 'flex', gap: '4px'}}>
                                {getCompanyLogos(p.companies).slice(0, 3).map((company, idx) => (
                                  <img 
                                    key={idx}
                                    src={`https://logo.clearbit.com/${company.domain}`}
                                    alt={company.name}
                                    title={company.name}
                                    style={{width: '16px', height: '16px', borderRadius: '2px', objectFit: 'contain'}}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div style={{display: 'flex', gap: '8px'}}>
                          <button
                            onClick={() => {
                              setSelectedProblem(p);
                              setModalOpen(true);
                            }}
                            style={{
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteNote(+id)}
                            style={{
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div style={{
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '12px',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        color: '#374151',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {content}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {currentView === 'potd' && (
          <section className="tab-section">
            <h2 style={{fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: '#1f2937'}}>Problem of the Day</h2>
            {problemOfTheDay ? (
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #3b82f6',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
                  <div style={{fontSize: '32px'}}>🎯</div>
                  <h3 style={{fontSize: '20px', fontWeight: '600', color: '#1f2937'}}>{problemOfTheDay.title}</h3>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      backgroundColor: problemOfTheDay.difficulty === 'Easy' ? '#d1fae5' : problemOfTheDay.difficulty === 'Medium' ? '#fffbeb' : '#fee2e2',
                      color: problemOfTheDay.difficulty === 'Easy' ? '#047857' : problemOfTheDay.difficulty === 'Medium' ? '#a16207' : '#991b1b'
                    }}
                  >
                    {problemOfTheDay.difficulty}
                  </span>
                </div>
                
                {problemOfTheDay.companies && (
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px'}}>
                    <span style={{fontSize: '14px', color: '#6b7280', fontWeight: '500'}}>Asked by:</span>
                    <div style={{display: 'flex', gap: '6px'}}>
                      {getCompanyLogos(problemOfTheDay.companies).slice(0, 5).map((company, idx) => (
                        <img 
                          key={idx}
                          src={`https://logo.clearbit.com/${company.domain}`}
                          alt={company.name}
                          title={company.name}
                          style={{width: '24px', height: '24px', borderRadius: '4px', objectFit: 'contain'}}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                  <a
                    href={problemOfTheDay.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#1f2937',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontWeight: '500',
                      fontSize: '14px'
                    }}
                  >
                   Solve Now
                  </a>
                  <a
                    href={problemOfTheDay.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontWeight: '500',
                      fontSize: '14px'
                    }}
                  >
                     Watch Solution
                  </a>
                  <button
                    onClick={() => {
                      setSelectedProblem(problemOfTheDay);
                      setModalOpen(true);
                    }}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '14px'
                    }}
                  >
                    Add Note
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '48px 24px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
                  Loading Problem of the Day...
                </h3>
              </div>
            )}
          </section>
        )}

        {currentView === 'daily' && (
          <section className="tab-section">
            <h2 style={{fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: '#1f2937'}}>Daily Practice - Day {currentDay}</h2>
            
            <div style={{display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center'}}>
              <button 
                onClick={() => {
                  const newDay = Math.max(1, currentDay - 1);
                  setCurrentDay(newDay);
                  const { getProblemsForDay } = require('../data/dailyProblems');
                  setDailyProblems(getProblemsForDay(newDay));
                }}
                style={{padding: '8px 16px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}
                disabled={currentDay <= 1}
              >
                ← Previous Day
              </button>
              <span style={{fontSize: '16px', fontWeight: '500'}}>Day {currentDay} - {currentDay} Problem{currentDay > 1 ? 's' : ''} Available</span>
              <button 
                onClick={() => {
                  const userDay = calculateUserDay();
                  if (currentDay < userDay) {
                    const newDay = currentDay + 1;
                    setCurrentDay(newDay);
                    const { getProblemsForDay } = require('../data/dailyProblems');
                    setDailyProblems(getProblemsForDay(newDay));
                  }
                }}
                style={{padding: '8px 16px', backgroundColor: currentDay >= calculateUserDay() ? '#9ca3af' : '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: currentDay >= calculateUserDay() ? 'not-allowed' : 'pointer'}}
                disabled={currentDay >= calculateUserDay()}
              >
                Next Day →
              </button>
            </div>

            {dailyProblems.length > 0 ? (
              <div style={{display: 'grid', gap: '16px'}}>
                {dailyProblems.slice(0, currentDay).map((problem, index) => (
                  <div key={problem.id} style={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <span style={{fontSize: '18px', fontWeight: '600', color: '#6b7280'}}>Problem {index + 1}</span>
                        <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1f2937'}}>{problem.title}</h3>
                        <span
                          style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: problem.difficulty === 'Easy' ? '#d1fae5' : problem.difficulty === 'Medium' ? '#fffbeb' : '#fee2e2',
                            color: problem.difficulty === 'Easy' ? '#047857' : problem.difficulty === 'Medium' ? '#a16207' : '#991b1b'
                          }}
                        >
                          {problem.difficulty}
                        </span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <button
                          onClick={() => toggleComplete(problem.id)}
                          style={{
                            backgroundColor: completedProblems.has(problem.id) ? '#22c55e' : '#f3f4f6',
                            color: completedProblems.has(problem.id) ? 'white' : '#6b7280',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          {completedProblems.has(problem.id) ? '✓ Done' : '○ Mark'}
                        </button>
                        <button
                          onClick={() => toggleStar(problem.id)}
                          style={{
                            backgroundColor: starredProblems.has(problem.id) ? '#f59e0b' : '#f3f4f6',
                            color: starredProblems.has(problem.id) ? 'white' : '#6b7280',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          {starredProblems.has(problem.id) ? '⭐' : '☆'}
                        </button>
                      </div>
                    </div>
                    
                    {problem.companies && (
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                        <span style={{fontSize: '12px', color: '#6b7280', fontWeight: '500'}}>Companies:</span>
                        <div style={{display: 'flex', gap: '4px'}}>
                          {getCompanyLogos(problem.companies).slice(0, 5).map((company, idx) => (
                            <img 
                              key={idx}
                              src={`https://logo.clearbit.com/${company.domain}`}
                              alt={company.name}
                              title={company.name}
                              style={{width: '20px', height: '20px', borderRadius: '2px', objectFit: 'contain'}}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {problem.hint && (
                      <div style={{
                        backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        marginBottom: '12px'
                      }}>
                        <p style={{fontSize: '12px', color: '#1e40af', margin: 0}}>
                          💡 <strong>Hint:</strong> {problem.hint}
                        </p>
                      </div>
                    )}
                    
                    <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                      <a
                        href={problem.leetcodeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          backgroundColor: '#1f2937',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        🚀 Solve on LeetCode
                      </a>
                      <a
                        href={problem.youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        📺 Watch Solution
                      </a>
                      <button
                        onClick={() => {
                          setSelectedProblem(problem);
                          setModalOpen(true);
                        }}
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        📝 Add Note
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '48px 24px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
                  Loading Daily Problems...
                </h3>
              </div>
            )}
          </section>
        )}
        
        {/* Problem Modal */}
        <ProblemModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          problem={selectedProblem}
          userNote={selectedProblem ? notes[selectedProblem.id] : ''}
          onSaveNote={saveNote}
          onDeleteNote={deleteNote}
        />
      </main>
    </div>
  );
};

export default DSASheet;