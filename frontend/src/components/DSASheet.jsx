import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';
import { useUserProgress } from '../hooks/useUserProgress';
import PlaylistManager from './PlaylistManager';
import PlaylistSheet from './PlaylistSheet';
import ProblemModal from './ProblemModal';
import ProblemTimer from './ProblemTimer';
import ProblemDiscussion from './ProblemDiscussion';
import EnhancedProblemDiscussion from './EnhancedProblemDiscussion';

import ChatWidget from './ChatWidget';
import SpacedRepetition from './SpacedRepetition';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { useForgettingCurve } from '../hooks/useForgettingCurve';
import Sidebar from './Sidebar';
import UserProfile from './UserProfile';
import ConceptNotes from './ConceptNotes';
import CodeEditorModal from './CodeEditorModal';
import MockInterviewSystem from './MockInterviewSystem';
import RichTextDisplay from './RichTextDisplay';
import UniversalSheetManager from './UniversalSheetManager';
import RealDataDashboard from './RealDataDashboard';

import ChatDiscussion from './ChatDiscussion';
import FloatingFeedbackButton from './FloatingFeedbackButton';
import CompareModal from './CompareModal';
import FeedbackMessage from './FeedbackMessage';
import Header from './Header';
import './DSASheet.css';

// Import test utilities for debugging

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';



// Removed getMockData function - now using real data from problems.js

const DSASheet = ({ sheetType = 'apnaCollege', onSheetChange }) => {

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState(new Set([1]));
  const [currentView, setCurrentView] = useState('problems');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [randomMode, setRandomMode] = useState(false);
  const [currentRandomProblem, setCurrentRandomProblem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [discussionOpen, setDiscussionOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [playlistSheetOpen, setPlaylistSheetOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const [showConceptNotes, setShowConceptNotes] = useState(false);
  const [selectedConceptTopic, setSelectedConceptTopic] = useState(null);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showMockInterview, setShowMockInterview] = useState(false);

  const [showChat, setShowChat] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    
    // Auto-collapse sidebar after 30 seconds on desktop
    const autoCollapseTimer = setTimeout(() => {
      if (!isMobile) {
        setSidebarCollapsed(true);
      }
    }, 30000);
    
    // Add global function for sidebar to trigger mock interview
    window.openMockInterview = () => {
      setShowMockInterview(true);
    };
    
    // Add global function for sidebar to trigger concept notes
    window.openConceptNotes = (topic) => {
      console.log('openConceptNotes called with topic:', topic);
      setSelectedConceptTopic(topic);
      setShowConceptNotes(true);
    };
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(autoCollapseTimer);
      delete window.openMockInterview;
      delete window.openConceptNotes;
    };
  }, [isMobile]);
  const { toggleTheme, isDark } = useTheme();
  
  const getUserId = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr || userStr === 'undefined') return '64f8a1b2c3d4e5f6a7b8c9d0';
      const user = JSON.parse(userStr);
      return user.id || '64f8a1b2c3d4e5f6a7b8c9d0';
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return '64f8a1b2c3d4e5f6a7b8c9d0';
    }
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
  } = useUserProgress(userId, sheetType);
  
  const [allProgress, setAllProgress] = useState({});
  
  useEffect(() => {
    const fetchAllProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/sheets/user/${userId}/all-progress`);
        setAllProgress(response.data.allProgress || {});
      } catch (error) {
        console.error('Error fetching all progress:', error);
      }
    };
    
    if (userId) {
      fetchAllProgress();
    }
  }, [userId, sheetType]);
  
  console.log('🔍 DSASheet using sheetType:', sheetType, 'for userId:', userId);


  const { addToSpacedRepetition, allSpacedProblems } = useSpacedRepetition(userId, sheetType);
  
  // Log current sheet type for debugging
  console.log(`🔍 DSASheet current sheetType: ${sheetType}`);
  
  // Add test function to window for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.currentSheetType = sheetType;
      window.currentUserId = userId;
      console.log('🔧 Debug info: window.currentSheetType and window.currentUserId set');
      console.log('🧪 Quick test: window.testSpacedRepetition.testSheet(window.currentSheetType, 1, window.currentUserId)');
    }
  }, [sheetType, userId]);
  const { addToForgettingCurve, forgettingCurveData } = useForgettingCurve(userId, sheetType);




  const handleToggleComplete = async (problemId) => {
    console.log(`🔄 Toggling complete for problem ${problemId} in sheet ${sheetType}`);
    
    if (!completedProblems.has(problemId)) {
      try {
        // Stop timer
        if (window.stopTimerForProblem && window.stopTimerForProblem[problemId]) {
          await window.stopTimerForProblem[problemId]();
        } else {
          await api.post('/timer/stop', { problemId });
        }
        
        // Add to forgetting curve
        await addToForgettingCurve(problemId);
        
        // Auto-add to custom spaced repetition
        try {
          const userStr = localStorage.getItem('user');
          const userId = (userStr && userStr !== 'undefined' ? JSON.parse(userStr).id : null) || '68ba7187488b0b8b3f463c04';
          console.log(`🔄 Adding problem ${problemId} to custom spaced repetition for sheet: ${sheetType}`);
          
          const response = await fetch(`http://localhost:5001/api/custom-spaced-repetition/add-solved?sheetType=${sheetType}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'userid': userId
            },
            body: JSON.stringify({ 
              problemId: problemId.toString()
            })
          });
          
          if (response.ok) {
            const result = await response.json();
            console.log(`✅ Problem ${problemId} auto-added to custom spaced repetition for ${sheetType}:`, result);
          } else {
            const errorText = await response.text();
            console.error(`Failed to add to custom spaced repetition for ${sheetType}:`, response.status, errorText);
          }
        } catch (error) {
          console.error(`Error adding to custom spaced repetition for ${sheetType}:`, error);
        }
      } catch (error) {
        console.error('Error in completion process:', error);
      }
    }
    
    await toggleComplete(problemId);
    console.log(`✅ Problem ${problemId} toggled in ${sheetType}`);
  };

  useEffect(() => {
    const fetchProblems = async () => {
      console.log(`📁 Loading problems for sheet: ${sheetType}`);
      setLoading(true);
      try {
        // Load real data for all sheet types
        let sheetData;
        switch (sheetType) {
          case 'apnaCollege':
            const { dsaProblemsData } = await import('../data/problems');
            sheetData = dsaProblemsData;
            break;
          case 'loveBabbar':
            try {
              const { loveBabbarSheetData } = await import('../data/loveBabbarSheet');
              sheetData = loveBabbarSheetData;
            } catch (error) {
              console.error('Error loading Love Babbar sheet:', error);
              // Fallback to Apna College data if Love Babbar sheet fails
              const { dsaProblemsData: fallbackData1 } = await import('../data/problems');
              sheetData = fallbackData1;
            }
            break;
          case 'striverA2Z':
            const { striverA2ZAllSteps } = await import('../data/striverA2ZAllSteps');
            sheetData = striverA2ZAllSteps;
            break;
          case 'blind75':
            try {
              const { blind75SheetData } = await import('../data/blind75Sheet');
              sheetData = blind75SheetData;
            } catch (error) {
              console.error('Error loading Blind 75 sheet:', error);
              // Fallback to Apna College data if Blind 75 sheet fails
              const { dsaProblemsData: fallbackData2 } = await import('../data/problems');
              sheetData = fallbackData2;
            }
            break;
          case 'striverBlind75':
            const { striverBlind75SheetData } = await import('../data/striverBlind75Sheet');
            sheetData = striverBlind75SheetData;
            break;
          case 'striver79':
            const { striver79SheetData } = await import('../data/striver79Sheet');
            sheetData = striver79SheetData;
            break;
          case 'striverSDE':
            const { striverSDESheetData } = await import('../data/striverSDESheet');
            sheetData = striverSDESheetData;
            break;
          case 'striverCP':
            const { striverCPSheetData } = await import('../data/striverCPSheet');
            sheetData = striverCPSheetData;
            break;
          case 'neetcode150':
            const { neetcode150 } = await import('../data/neetcode150');
            sheetData = neetcode150;
            break;
          case 'leetcodeTop150':
            const { leetcodeTop150 } = await import('../data/leetcodeTop150');
            sheetData = leetcodeTop150;
            break;
          case 'systemDesign':
            const { systemDesignSheet } = await import('../data/systemDesignSheet');
            sheetData = systemDesignSheet;
            break;
          case 'cp31':
            const { cp31Sheet } = await import('../data/cp31Sheet');
            sheetData = cp31Sheet;
            break;
          case 'visionCP':
            const { visionCPSheet } = await import('../data/visionCPSheet');
            sheetData = visionCPSheet;
            break;
          case 'vision':
            const { visionSheet } = await import('../data/visionSheet');
            sheetData = visionSheet;
            break;
          default:
            // Default to Apna College data instead of mock data
            const { dsaProblemsData: defaultData } = await import('../data/problems');
            sheetData = defaultData;
        }
        // Ensure sheetData is always an array
        if (!sheetData || !Array.isArray(sheetData)) {
          console.warn(`⚠️ Invalid data for ${sheetType}, using empty array`);
          sheetData = [];
        }
        
        // Transform data structure for Striver sheets that have sections
        const transformedData = sheetData.map(topic => {
          if (topic && topic.sections && Array.isArray(topic.sections)) {
            // Flatten sections into problems for Striver sheets
            const allProblems = topic.sections.flatMap(section => section.problems || []);
            return {
              ...topic,
              problems: allProblems
            };
          }
          return topic;
        });
        
        setProblems(transformedData);
        
        if (transformedData.length > 0) {
          const totalProblems = transformedData.reduce((total, topic) => total + (topic.problems || []).length, 0);
          console.log(`✅ ${transformedData.length} topics loaded for ${sheetType} with ${totalProblems} problems`);
        } else {
          console.log(`⚠️ No data loaded for ${sheetType}`);
        }
        
        // Problems loaded successfully
        console.log(`✅ Problems loaded for ${sheetType}`);
      } catch (error) {
        console.error('Error loading problems data:', error);
        setProblems([]);
      }
      setLoading(false);
    };
    
    fetchProblems();

    
    const timer = setTimeout(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
      }
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [sheetType]);
  
  // Log when progress data changes
  useEffect(() => {
    console.log(`📊 Progress updated for ${sheetType}:`, {
      completed: completedProblems.size,
      starred: starredProblems.size,
      notes: Object.keys(notes).length,
      playlists: playlists.length
    });
  }, [completedProblems, starredProblems, notes, playlists, sheetType]);







  const getRandomFilteredProblem = () => {
    if (!problems || !Array.isArray(problems)) {
      alert('No problems available');
      return;
    }
    let filteredProblems = problems.flatMap(topic => (topic && topic.problems && Array.isArray(topic.problems)) ? topic.problems.filter(p => p && typeof p === 'object') : []);
    
    if (difficultyFilter !== 'All') {
      filteredProblems = filteredProblems.filter(p => p && p.difficulty === difficultyFilter);
    }
    if (companyFilter !== 'All') {
      filteredProblems = filteredProblems.filter(p => p && p.companies && typeof p.companies === 'string' && p.companies.toLowerCase().includes(companyFilter.toLowerCase()));
    }
    
    if (filteredProblems.length === 0) {
      alert('No problems found with current filters');
      return;
    }
    
    const randomProblem = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];
    setCurrentRandomProblem(randomProblem);
    setRandomMode(true);
  };

  const getNextRandomProblem = () => {
    getRandomFilteredProblem();
  };

  const exitRandomMode = () => {
    setRandomMode(false);
    setCurrentRandomProblem(null);
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
    if (!problems || !Array.isArray(problems)) return 0;
    return problems.reduce((total, topic) => {
      if (!topic || !topic.problems || !Array.isArray(topic.problems)) return total;
      return total + topic.problems.filter(p => p && typeof p === 'object' && p.id).length;
    }, 0);
  };

  const getTotalByDifficulty = (difficulty) => {
    if (!problems || !Array.isArray(problems)) return 0;
    return problems.reduce((total, topic) => {
      if (!topic || !topic.problems || !Array.isArray(topic.problems)) return total;
      return total + topic.problems.filter(p => p && typeof p === 'object' && p.difficulty === difficulty).length;
    }, 0);
  };

  const getCompletedByDifficulty = (difficulty) => {
    if (!problems || !Array.isArray(problems)) return 0;
    return problems.reduce((total, topic) => {
      if (!topic || !topic.problems || !Array.isArray(topic.problems)) return total;
      return total + topic.problems.filter(p => p && typeof p === 'object' && p.difficulty === difficulty && p.id && completedProblems.has(p.id)).length;
    }, 0);
  };

  const getCompanyLogos = (companiesString) => {
    if (!companiesString || typeof companiesString !== 'string') return [];
    
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
    
    try {
      // Add additional safety checks
      if (!companiesString || companiesString.trim() === '') {
        return [];
      }
      
      const companies = companiesString.split(/[+,\s]+/).filter(c => c && c.trim());
      if (!companies || companies.length === 0) {
        return [];
      }
      
      return companies.slice(0, 6).map(company => {
        if (!company || typeof company !== 'string') {
          return { name: 'Unknown', domain: 'example.com' };
        }
        
        const cleanCompany = company.trim().replace(/\s+/g, ' ');
        if (!cleanCompany) {
          return { name: 'Unknown', domain: 'example.com' };
        }
        
        const companyData = companyMap[cleanCompany];
        if (companyData) {
          return companyData;
        }
        
        // Fallback for unknown companies with additional safety
        const safeDomain = cleanCompany.toLowerCase().replace(/[^a-z0-9]/g, '') || 'example';
        return { name: cleanCompany, domain: `${safeDomain}.com` };
      }).filter(Boolean); // Remove any null/undefined entries
    } catch (error) {
      console.error('Error processing companies:', error);
      return [];
    }
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
    <>
      <div className={`dsa-sheet-container ${isDark ? 'dark' : ''}`} style={{ 
        marginLeft: isMobile ? 0 : (sidebarCollapsed ? '20px' : '320px'),
        marginRight: showChat ? '400px' : '0',
        transition: 'margin-right 0.3s ease'
      }}>
        {/* Feedback Message */}
        <FeedbackMessage isDark={isDark} />

        
        {/* Header - Same as TopicSheet */}
        <div className="dsa-sheet-header">
          <div className="header-content">
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
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
              <div className="header-logo-link" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
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
                      backgroundColor: 'rgba(30, 144, 255, 0.2)',
                      border: 'none',
                      color: '#1E90FF',
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
                      e.target.style.backgroundColor = 'rgba(30, 144, 255, 0.2)';
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
                    <div style={{ padding: '8px 16px', fontSize: '12px', fontWeight: '700', color: isDark ? '#9ca3af' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Popular Sheets</div>
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
                    
                    <div style={{ height: '1px', backgroundColor: isDark ? '#4b5563' : '#e5e7eb', margin: '8px 0' }}></div>
                    <div style={{ padding: '8px 16px', fontSize: '12px', fontWeight: '700', color: isDark ? '#9ca3af' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Striver Sheets</div>
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
                        <path d="M20,8H4V6H20M20,18H4V12H20M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
                      </svg>
                      Striver SDE Sheet (191 Problems)
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
                        <path d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                      </svg>
                      Striver 79 Last Moment (79 Problems)
                    </button>
                    
                    <div style={{ height: '1px', backgroundColor: isDark ? '#4b5563' : '#e5e7eb', margin: '8px 0' }}></div>
                    <div style={{ padding: '8px 16px', fontSize: '12px', fontWeight: '700', color: isDark ? '#9ca3af' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Interview Prep</div>
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
                        <path d="M9,5V9H15V5M9,19H15V15H9M9,14H15V10H9M4,9V5H8V9M4,19H8V15H4M4,14H8V10H4M20,5V9H16V5M20,19H16V15H20M20,14H16V10H20Z"/>
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
                        <path d="M20,8H4V6H20M20,18H4V12H20M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
                      </svg>
                      LeetCode Top 150 (150 Problems)
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
                        <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                      </svg>
                      VISION Sheet (100 Problems)
                    </button>
                    
                    <div style={{ height: '1px', backgroundColor: isDark ? '#4b5563' : '#e5e7eb', margin: '8px 0' }}></div>
                    <div style={{ padding: '8px 16px', fontSize: '12px', fontWeight: '700', color: isDark ? '#9ca3af' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>All Sheets</div>
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
                      System Design (70 Topics)
                    </button>
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
                      Striver CP (298 Problems)
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
                        <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M9,17H7V10H9V17M13,17H11V7H13V17M17,17H15V13H17V17Z"/>
                      </svg>
                      CP-31 (372 Problems)
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
                        <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                      </svg>
                      VISION CP (135 Problems)
                    </button>
                  </div>
                </div>

                {/* CP Dropdown */}
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
                        <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M9,17H7V10H9V17M13,17H11V7H13V17M17,17H15V13H17V17Z"/>
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
                        <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                      </svg>
                      VISION CP Sheet (135 Problems)
                    </button>
                  </div>
                </div>

                {/* Company Wise Dropdown */}
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
                onClick={() => setShowCodeEditor(true)}
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
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z"/>
                </svg>
                Code
              </button>

              <button 
                onClick={() => setShowChat(!showChat)}
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
      <main className="dsa-sheet-main">
        {currentView === 'problems' && (
          <>
            <section className="overview-section">
              <h1 className="main-title">
                {sheetType === 'loveBabbar' ? (
                  <span> Love Babbar DSA Sheet - 450 Questions</span>
                ) : sheetType === 'striverA2Z' ? (
                  <span>Striver A2Z DSA Course - 455 Questions</span>
                ) : sheetType === 'blind75' ? (
                  <span>Blind 75 LeetCode - 75 Questions</span>
                ) : sheetType === 'striverBlind75' ? (
                  <span>Striver Blind 75 - 75 Questions</span>
                ) : sheetType === 'striverCP' ? (
                  <span>Striver CP Sheet - 298 Questions</span>
                ) : sheetType === 'striver79' ? (
                  <span>Striver's 79 Last Moment DSA Sheet - 79 Questions</span>
                ) : sheetType === 'striverSDE' ? (
                  <span>Striver SDE Sheet - 191 Questions</span>
                ) : sheetType === 'vision' ? (
                  <span>VISION Sheet - 100 Questions</span>
                ) : sheetType === 'neetcode150' ? (
                  <span>NeetCode 150 - 150 Questions</span>
                ) : sheetType === 'systemDesign' ? (
                  <span>System Design Roadmap - 70 Topics</span>
                ) : sheetType === 'leetcodeTop150' ? (
                  <span>LeetCode Top Interview 150 - 150 Questions</span>
                ) : sheetType === 'cp31' ? (
                  <span>CP-31 Sheet - 372 Problems</span>
                ) : sheetType === 'visionCP' ? (
                  <span>VISION CP Sheet - 135 Problems</span>
                ) : (
                  <span>Apna College DSA Sheet - 373 Questions</span>
                )}
              </h1>
              <p style={{fontSize: '16px', color: '#6b7280', marginBottom: '8px'}}>{sheetType === 'loveBabbar' ? 'Complete collection of 450 DSA problems across all important topics. Master DSA with Love Babbar\'s curated problem set.' : sheetType === 'striverA2Z' ? 'This course is made for people who want to learn DSA from A to Z for free in a well-organized and structured manner. Complete collection of 455 problems across 18 steps.' : sheetType === 'blind75' ? 'Curated list of 75 essential LeetCode problems. Perfect for coding interview preparation at top tech companies like Google, Amazon, Microsoft, and Facebook.' : sheetType === 'striverBlind75' ? 'Striver\'s curated Blind 75 problems with detailed video solutions. 75 most frequent asked LeetCode questions organized by days for systematic preparation.' : sheetType === 'striverCP' ? 'Master Competitive Programming with Striver\'s curated collection of 298 problems across 19 topics. From implementation to advanced algorithms.' : sheetType === 'striver79' ? 'Handpicked top 79 coding interview questions from different topics of DSA. These are the most asked questions in interviews at Google, Amazon, Microsoft, Facebook, etc. Perfect for last-moment preparation.' : sheetType === 'striverSDE' ? 'Complete collection of 191 most important problems for Software Development Engineer interviews. Curated by Striver for cracking interviews at top tech companies.' : sheetType === 'vision' ? 'Curated collection of 100 best problems handpicked from 1500+ questions across all major sheets. Perfect blend of fundamental concepts and interview essentials.' : sheetType === 'neetcode150' ? 'Complete collection of 150 most popular coding interview problems. Organized by topics with video solutions. Perfect for systematic interview preparation at top tech companies.' : sheetType === 'systemDesign' ? 'Complete system design roadmap with 70 topics covering basics to advanced concepts. Perfect for software engineers preparing for system design interviews at top tech companies.' : sheetType === 'leetcodeTop150' ? 'The most frequently asked interview questions curated by LeetCode. 150 essential problems covering all major topics for coding interview preparation at top tech companies.' : sheetType === 'cp31' ? 'Rating-based competitive programming problems from 800 to 1900. 372 carefully selected Codeforces problems organized by difficulty for systematic CP improvement.' : sheetType === 'visionCP' ? 'Best curated competitive programming problems from CP31, AtCoder, CodeChef, SPOJ and other top platforms. 135+ handpicked problems with topic tags, multiple platforms, and essential CP topics for systematic improvement.' : 'Complete collection of 373 DSA problems across 16 topics. Learn DSA from A to Z for free in a well-organized and structured manner.'}</p>
              <a href="#" style={{color: '#3b82f6', fontSize: '14px', textDecoration: 'none'}}>Know More</a>
              
              {sheetType === 'striver79' ? (
                <div style={{backgroundColor: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '8px', padding: '16px', margin: '20px 0', fontSize: '14px', color: '#92400e'}}>
                  <strong>Disclaimer:</strong> The questions are hard, so we expect you to be well-versed with DSA. If you aren't, please try A2Z-Sheet or SDE-Sheet first.
                </div>
              ) : (
                <div style={{backgroundColor: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '8px', padding: '16px', margin: '20px 0', fontSize: '14px', color: '#92400e'}}>
                  <strong>Complete Learning Platform:</strong> Each problem includes practice links, detailed articles, video solutions, and company tags. Start solving problems to track your progress and master data structures and algorithms step by step.
                </div>
              )}
              
              {/* Overview & Progress - Same as TopicSheet */}
              <div style={{marginBottom: '24px'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px'}}>
                  <h3 style={{fontSize: '18px', fontWeight: '600'}}>Overview & Progress</h3>
                </div>
                
                <div style={{marginBottom: '16px'}}>
                  <h4 style={{fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: isDark ? 'white' : '#1f2937'}}>
                    {sheetType === 'loveBabbar' ? 'Love Babbar DSA Sheet' : sheetType === 'striverA2Z' ? 'Striver A2Z DSA Course' : sheetType === 'blind75' ? 'Blind 75 LeetCode' : sheetType === 'striverBlind75' ? 'Striver Blind 75' : sheetType === 'striverCP' ? 'Striver CP Sheet' : sheetType === 'striver79' ? 'Striver 79 Last Moment DSA Sheet' : sheetType === 'striverSDE' ? 'Striver SDE Sheet' : sheetType === 'vision' ? 'VISION Sheet' : sheetType === 'neetcode150' ? 'NeetCode 150' : sheetType === 'systemDesign' ? 'System Design Roadmap' : sheetType === 'leetcodeTop150' ? 'LeetCode Top Interview 150' : sheetType === 'cp31' ? 'CP-31 Sheet' : sheetType === 'visionCP' ? 'VISION CP Sheet' : 'Apna College DSA Sheet'} ({getTotalProblems()} Problems)
                  </h4>
                  <div style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', marginTop: '12px'}}>
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
                
                <div style={{display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap', alignItems: 'center'}}>
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

                <button
                  onClick={getRandomFilteredProblem}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <img src="/random.svg" alt="Random" style={{width: '16px', height: '16px', filter: 'brightness(0) invert(1)'}} />
                  Pick Random
                </button>
                </div>
              </div>
              

            </section>





            {randomMode ? (
              <section className="random-problem-section">
                <div style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'white',
                  border: `2px solid ${isDark ? ' rgba(255, 255, 255, 0.2)' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  padding: '0',
                  boxShadow: '0 1px 3px rgba(19, 2, 2, 0.1)',
                  maxWidth: '1200px',
                  margin: '0 auto'
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
                    <button
                      onClick={exitRandomMode}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      ← Back to Sheet
                    </button>
                    <h2 style={{fontSize: '24px', fontWeight: '600', color: isDark ? 'white' : '#030405ff', margin: 0}}>Random Problem</h2>
                    <button
                      onClick={getNextRandomProblem}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      Next Random
                    </button>
                  </div>

                  {currentRandomProblem && (
                    <div>
                      <div className="problem-table-header" style={{display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 60px 80px 60px 80px 80px 80px 80px', gap: '10px', padding: '12px 24px', backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : '#f8f9fa', borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : '#e9ecef'}`, fontSize: '14px', fontWeight: '600', color: isDark ? '#d1d5db' : '#495057', marginBottom: '0'}}>
                        <div>Status</div>
                        <div>Problem</div>
                        <div>Practice</div>
                        <div>Solution</div>
                        <div>Note</div>
                        <div>Revision</div>
                        <div>Playlist</div>
                        <div>Timer</div>
                        <div>Articles</div>
                        <div>Chat</div>
                        <div>Difficulty</div>
                      </div>
                      
                      <div className="problem-row" style={{display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 60px 80px 60px 80px 80px 80px 80px', gap: '12px', padding: '12px 24px', borderBottom: `1px solid ${isDark ? '#4b5563' : '#f1f3f4'}`, alignItems: 'center', fontSize: '14px', backgroundColor: isDark ? '#1f2937' : 'white'}}>
                        {/* Status */}
                        <div className="problem-status" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                          <input
                            type="checkbox"
                            checked={completedProblems.has(currentRandomProblem.id)}
                            onChange={() => handleToggleComplete(currentRandomProblem.id)}
                            style={{width: '16px', height: '16px', cursor: 'pointer'}}
                          />
                          <button
                            onClick={() => handleToggleComplete(currentRandomProblem.id)}
                            style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px'}}
                          >
                            {completedProblems.has(currentRandomProblem.id) ? (
                              <span style={{color: '#22c55e'}}>✓</span>
                            ) : (
                              <span style={{color: '#ef4444'}}>○</span>
                            )}
                          </button>
                        </div>
                        
                        {/* Problem */}
                        <div className="problem-info">
                          <div style={{fontWeight: '500', color: completedProblems.has(currentRandomProblem.id) ? '#6b7280' : (isDark ? 'white' : '#1f2937')}}>
                            {currentRandomProblem.title}
                          </div>
                          {currentRandomProblem.companies && (
                            <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px'}}>
                              <span style={{fontSize: '11px', color: '#6b7280'}}>Companies:</span>
                              <div style={{display: 'flex', gap: '4px'}}>
                                {getCompanyLogos(currentRandomProblem.companies).map((company, idx) => (
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
                          {currentRandomProblem.hint && (
                            <p style={{fontSize: '12px', color: '#2563eb', fontStyle: 'italic', margin: '4px 0 0 0'}}>
                              💡 {currentRandomProblem.hint}
                            </p>
                          )}
                        </div>
                        
                        {/* Practice */}
                        <div className="problem-action" style={{textAlign: 'center'}}>
                          {(currentRandomProblem.link || currentRandomProblem.leetcode || currentRandomProblem.practiceLink) ? (
                            <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
                              <a
                                href={currentRandomProblem.link || currentRandomProblem.leetcode || currentRandomProblem.practiceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{backgroundColor: '#000000', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', textDecoration: 'none', display: 'inline-block'}}
                              >
                                <i className="fas fa-code"></i> Solve
                              </a>
                            </div>
                          ) : (
                            <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                          )}
                        </div>
                        
                        {/* Solution */}
                        <div className="problem-action" style={{textAlign: 'center'}}>
                          {(currentRandomProblem.video || currentRandomProblem.youtube) ? (
                            <a href={currentRandomProblem.video || currentRandomProblem.youtube} target="_blank" rel="noopener noreferrer" style={{color: '#ef4444', textDecoration: 'none', fontSize: '12px', padding: '4px 8px', backgroundColor: '#fee2e2', borderRadius: '4px', display: 'inline-block'}}><i className="fab fa-youtube"></i> YT</a>
                          ) : (
                            <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                          )}
                        </div>
                        
                        {/* Note */}
                        <div className="problem-action" style={{textAlign: 'center'}}>
                          <button
                            onClick={() => {
                              setSelectedProblem(currentRandomProblem);
                              setModalOpen(true);
                            }}
                            style={{background: notes[currentRandomProblem.id] ? '#fef3c7' : (isDark ? '#374151' : '#f3f4f6'), border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`, cursor: 'pointer', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', color: notes[currentRandomProblem.id] ? '#92400e' : (isDark ? '#d1d5db' : '#6b7280')}}
                          >
                            <i className="fas fa-sticky-note"></i> {notes[currentRandomProblem.id] ? 'Note' : '+'}
                          </button>
                        </div>
                        
                        {/* Revision */}
                        <div className="problem-action" style={{textAlign: 'center'}}>
                          <button
                            onClick={() => toggleStar(currentRandomProblem.id)}
                            style={{background: starredProblems.has(currentRandomProblem.id) ? '#fef3c7' : (isDark ? '#374151' : '#f3f4f6'), border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`, cursor: 'pointer', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', color: starredProblems.has(currentRandomProblem.id) ? '#92400e' : (isDark ? '#d1d5db' : '#6b7280')}}
                          >
                            <i className={starredProblems.has(currentRandomProblem.id) ? 'fas fa-star' : 'far fa-star'}></i> {starredProblems.has(currentRandomProblem.id) ? 'Star' : '+'}
                          </button>
                        </div>
                        
                        {/* Playlist */}
                        <div className="problem-action" style={{textAlign: 'center'}}>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                addToPlaylist(e.target.value, currentRandomProblem.id);
                                e.target.value = '';
                              }
                            }}
                            style={{fontSize: '12px', padding: '4px 8px', border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`, borderRadius: '4px', cursor: 'pointer', backgroundColor: isDark ? '#374151' : 'white', color: isDark ? '#d1d5db' : 'inherit'}}
                          >
                            <option value="">+</option>
                            {playlists.map(playlist => (
                              <option key={playlist.id} value={playlist.id}>
                                {playlist.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        {/* Timer */}
                        <div className="problem-action" style={{textAlign: 'center'}}>
                          <ProblemTimer problemId={currentRandomProblem.id} />
                        </div>
                        
                        {/* Articles */}
                        <div className="problem-action" style={{textAlign: 'center'}}>
                          <div style={{display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center'}}>
                            {(currentRandomProblem.gfg || currentRandomProblem.gfgArticle) && (
                              <a
                                href={currentRandomProblem.gfg || currentRandomProblem.gfgArticle}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  background: isDark ? '#374151' : 'white',
                                  color: isDark ? 'white' : '#374151',
                                  border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db',
                                  borderRadius: '50%',
                                  width: '28px',
                                  height: '28px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  textDecoration: 'none'
                                }}
                                title="GFG Article"
                              >
                                <img src="/article-svgrepo-com.svg" alt="Article" style={{width: '16px', height: '16px', filter: isDark ? 'brightness(0) invert(1)' : 'none'}} />
                              </a>
                            )}
                            {currentRandomProblem.tufArticle && (
                              <a
                                href={currentRandomProblem.tufArticle}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  background: '#1E90FF',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '28px',
                                  height: '28px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  textDecoration: 'none',
                                  fontSize: '10px',
                                  fontWeight: 'bold'
                                }}
                                title="TUF Article"
                              >
                                TUF
                              </a>
                            )}
                            {!(currentRandomProblem.gfg || currentRandomProblem.gfgArticle || currentRandomProblem.tufArticle) && (
                              <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Chat */}
                        <div className="problem-action" style={{textAlign: 'center'}}>
                          <button
                            onClick={() => {
                              setSelectedProblem(currentRandomProblem);
                              setDiscussionOpen(true);
                            }}
                            style={{
                              background: isDark ? '#374151' : 'white',
                              color: isDark ? 'white' : '#374151',
                              border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db',
                              borderRadius: '50%',
                              width: '28px',
                              height: '28px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Discussion"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12,3C6.5,3 2,6.58 2,11C2.05,13.15 3.06,15.17 4.75,16.5C4.75,17.1 4.33,18.67 2,21C4.37,20.89 6.64,20 8.47,18.5C9.61,18.83 10.81,19 12,19C17.5,19 22,15.42 22,11C22,6.58 17.5,3 12,3Z"/>
                            </svg>
                          </button>
                        </div>
                        
                        {/* Difficulty */}
                        <div className="problem-difficulty" style={{textAlign: 'center'}}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '600',
                              backgroundColor: currentRandomProblem.difficulty === 'Easy' ? '#d1fae5' : currentRandomProblem.difficulty === 'Medium' ? '#fffbeb' : '#fee2e2',
                              color: currentRandomProblem.difficulty === 'Easy' ? '#047857' : currentRandomProblem.difficulty === 'Medium' ? '#a16207' : '#991b1b'
                            }}
                          >
                            {currentRandomProblem.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            ) : (
            <section className="topics-list">
              {!problems || problems.length === 0 ? (
                <div style={{textAlign: 'center', padding: '50px', fontSize: '18px', color: '#666'}}>
                  {loading ? 'Loading problems...' : `No problems found for ${sheetType === 'loveBabbar' ? 'Love Babbar' : 'Apna College'} sheet`}
                </div>
              ) : (
                problems.map((topic, topicIndex) => {
                if (!topic || typeof topic !== 'object') return null;
                const solvedCount = (topic.problems || []).filter(p => p && p.id && completedProblems.has(p.id)).length;
                const uniqueTopicId = `${topic.id || topicIndex}_${topicIndex}`;
                const isOpen = expandedTopics.has(topic.id);
                
                // Filter problems by difficulty, company, and search
                let filteredProblems = (topic.problems || []).filter(p => p && typeof p === 'object');
                if (difficultyFilter !== 'All') {
                  filteredProblems = filteredProblems.filter(p => p && p.difficulty === difficultyFilter);
                }
                if (companyFilter !== 'All') {
                  filteredProblems = filteredProblems.filter(p => p && p.companies && typeof p.companies === 'string' && p.companies.toLowerCase().includes(companyFilter.toLowerCase()));
                }
                if (searchQuery) {
                  filteredProblems = filteredProblems.filter(p => p && p.title && typeof p.title === 'string' && p.title.toLowerCase().includes(searchQuery.toLowerCase()));
                }
                const sortedProblems = [...filteredProblems].sort((a, b) => {
                  const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
                  const aDifficulty = (a && a.difficulty) ? difficultyOrder[a.difficulty] || 2 : 2;
                  const bDifficulty = (b && b.difficulty) ? difficultyOrder[b.difficulty] || 2 : 2;
                  return aDifficulty - bDifficulty;
                });
                
                return (
                  <div key={uniqueTopicId} className="topic-card">
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
                          {solvedCount}/{(topic.problems || []).length}
                        </span>
                        <div className="progress-bar-container">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${((topic.problems || []).length > 0 ? (solvedCount / (topic.problems || []).length) * 100 : 0)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="problem-list">

                        <div className="problem-table-header" style={{display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 60px 80px 60px 80px 80px 80px 80px', gap: '12px', padding: '12px 24px', backgroundColor: isDark ? '#374151' : '#f8f9fa', borderBottom: `1px solid ${isDark ? '#4b5563' : '#e9ecef'}`, fontSize: '14px', fontWeight: '600', color: isDark ? '#d1d5db' : '#495057'}}>
                          <div>Status</div>
                          <div>Problem</div>
                          <div>Practice</div>
                          <div>Solution</div>
                          <div>Note</div>
                          <div>Revision</div>
                          <div>Playlist</div>
                          <div>Timer</div>
                          <div>Articles</div>
                          <div>Chat</div>
                          <div>Difficulty</div>
                        </div>
                        
                        {sortedProblems.map((p, idx) => (
                          <div
                            key={p.id}
                            className="problem-row"
                            style={{display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 60px 80px 60px 80px 80px 80px 80px 80px', gap: '12px', padding: '12px 24px', borderBottom: `1px solid ${isDark ? '#4b5563' : '#f1f3f4'}`, alignItems: 'center', fontSize: '14px', backgroundColor: isDark ? '#1f2937' : 'white'}}
                          >
                            {/* Status */}
                            <div className="problem-status" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                              <input
                                type="checkbox"
                                checked={completedProblems.has(p.id)}
                                onChange={(e) => {
                                  e.preventDefault();
                                  const completedTests = JSON.parse(localStorage.getItem('completedTests') || '{}');
                                  if (!completedTests[p.id]) {
                                    // Open test modal if test not completed
                                    const testButton = document.querySelector(`[data-problem-id="${p.id}"]`);
                                    if (testButton) testButton.click();
                                    return;
                                  }
                                  handleToggleComplete(p.id);
                                }}
                                style={{width: '16px', height: '16px', cursor: 'pointer'}}
                              />
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleToggleComplete(p.id);
                                }}
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
                              <div style={{fontWeight: '500', color: completedProblems.has(p.id) ? '#6b7280' : (isDark ? 'white' : '#1f2937')}}>
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
                              {sheetType === 'systemDesign' ? (
                                <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                              ) : (p.link || p.leetcode || p.leetcodeLink || p.practice || p.practiceLink || p.gfgLink) ? (
                                <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
                                  <a
                                    href={p.link || p.leetcode || p.leetcodeLink || p.practice || p.practiceLink || p.gfgLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{backgroundColor: '#000000', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', textDecoration: 'none', display: 'inline-block'}}
                                  >
                                    <i className="fas fa-code"></i> Solve
                                  </a>
                                </div>
                              ) : (
                                <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                              )}
                            </div>
                            
                            {/* Solution - YouTube Link */}
                            <div className="problem-action" data-label="Solution" style={{textAlign: 'center'}}>
                              {(p.video || p.youtube || p.youtubeLink) ? (
                                <a href={p.video || p.youtube || p.youtubeLink} target="_blank" rel="noopener noreferrer" style={{color: '#ef4444', textDecoration: 'none', fontSize: '12px', padding: '4px 8px', backgroundColor: '#fee2e2', borderRadius: '4px', display: 'inline-block'}}><i className="fab fa-youtube"></i> YT</a>
                              ) : (
                                <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                              )}
                            </div>
                            
                            {/* Note */}
                            <div className="problem-action" data-label="Note" style={{textAlign: 'center'}}>
                              <button
                                onClick={() => {
                                  setSelectedProblem(p);
                                  setModalOpen(true);
                                }}
                                style={{background: notes[p.id] ? '#fef3c7' : (isDark ? '#374151' : '#f3f4f6'), border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`, cursor: 'pointer', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', color: notes[p.id] ? '#92400e' : (isDark ? '#d1d5db' : '#6b7280')}}
                              >
                                <i className="fas fa-sticky-note"></i> {notes[p.id] ? 'Note' : '+'}
                              </button>
                            </div>
                            
                            {/* Revision - Star */}
                            <div className="problem-action" data-label="Star" style={{textAlign: 'center'}}>
                              <button
                                onClick={async (e) => {
                                  e.preventDefault();
                                  console.log(`⭐ Toggling star for problem ${p.id} in sheet ${sheetType}`);
                                  await toggleStar(p.id);
                                }}
                                style={{background: starredProblems.has(p.id) ? '#fef3c7' : (isDark ? '#374151' : '#f3f4f6'), border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`, cursor: 'pointer', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', color: starredProblems.has(p.id) ? '#92400e' : (isDark ? '#d1d5db' : '#6b7280')}}
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
                                style={{fontSize: '12px', padding: '4px 8px', border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`, borderRadius: '4px', cursor: 'pointer', backgroundColor: isDark ? '#374151' : 'white', color: isDark ? '#d1d5db' : 'inherit'}}
                              >
                                <option value="">+</option>
                                {playlists.map(playlist => (
                                  <option key={playlist.id} value={playlist.id}>
                                    {playlist.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            {/* Timer */}
                            <div className="problem-action" data-label="Timer" style={{textAlign: 'center'}}>
                              <ProblemTimer problemId={p.id} />
                            </div>
                            
                            {/* Articles */}
                            <div className="problem-action" data-label="Articles" style={{textAlign: 'center'}}>
                              <div style={{display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center'}}>
                                {(p.gfgArticle || p.gfg || p.gfgLink) && (
                                  <a
                                    href={p.gfgArticle || p.gfg || p.gfgLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      background: isDark ? '#374151' : 'white',
                                      color: isDark ? 'white' : '#374151',
                                      border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db',
                                      borderRadius: '50%',
                                      width: '28px',
                                      height: '28px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      textDecoration: 'none'
                                    }}
                                    title="GFG Article"
                                  >
                                    <img src="/article-svgrepo-com.svg" alt="Article" style={{width: '16px', height: '16px', filter: isDark ? 'brightness(0) invert(1)' : 'none'}} />
                                  </a>
                                )}

                                {!(p.gfgArticle || p.gfg || p.gfgLink) && (
                                  <span style={{color: '#9ca3af', fontSize: '12px'}}>-</span>
                                )}
                              </div>
                            </div>
                            
                            {/* Chat */}
                            <div className="problem-action" data-label="Chat" style={{textAlign: 'center'}}>
                              <button
                                onClick={() => {
                                  setSelectedProblem(p);
                                  setDiscussionOpen(true);
                                }}
                                style={{
                                  background: isDark ? '#374151' : 'white',
                                  color: isDark ? 'white' : '#374151',
                                  border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db',
                                  borderRadius: '50%',
                                  width: '28px',
                                  height: '28px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                title="Discussion"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12,3C6.5,3 2,6.58 2,11C2.05,13.15 3.06,15.17 4.75,16.5C4.75,17.1 4.33,18.67 2,21C4.37,20.89 6.64,20 8.47,18.5C9.61,18.83 10.81,19 12,19C17.5,19 22,15.42 22,11C22,6.58 17.5,3 12,3Z"/>
                                </svg>
                              </button>
                            </div>
                            
                            {/* Test */}
                            <div className="problem-action" data-label="Test" style={{textAlign: 'center'}}>
                              <div data-problem-id={p.id}>
                                <TestButton problemId={p.id} userId={userId} isDark={isDark} problems={problems} />
                              </div>
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
              })
              )}
            </section>
            )}
          </>
        )}

        {currentView === 'playlists' && (
          <PlaylistManager
            playlists={playlists}
            problems={problems}
            onCreatePlaylist={createPlaylist}
            onUpdatePlaylist={updatePlaylist}
            onDeletePlaylist={deletePlaylist}
            onViewPlaylist={(playlist) => {
              setSelectedPlaylist(playlist);
              setPlaylistSheetOpen(true);
            }}
          />
        )}

        {currentView === 'starred' && (
          <section className="tab-section">
            <h2 style={{fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: '#1f2937'}}>Starred Problems ({sheetType === 'loveBabbar' ? 'Love Babbar' : sheetType === 'striver' ? 'Striver A2Z' : sheetType === 'blind75' ? 'Blind 75' : sheetType === 'cp' ? 'CP Sheet' : sheetType === 'striver79' ? 'Striver 79' : sheetType === 'striverSDE' ? 'SDE Sheet' : 'Apna College'})</h2>
            {loading || problems.length === 0 ? (
              <div style={{textAlign: 'center', padding: '48px 24px'}}>
                <div style={{fontSize: '16px', color: '#6b7280'}}>Loading problems...</div>
              </div>
            ) : starredProblems.size === 0 ? (
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
                  Star problems to save them for later review in {sheetType === 'loveBabbar' ? 'Love Babbar' : sheetType === 'striver' ? 'Striver A2Z' : sheetType === 'blind75' ? 'Blind 75' : sheetType === 'cp' ? 'CP' : sheetType === 'striver79' ? 'Striver 79' : sheetType === 'striverSDE' ? 'SDE' : 'Apna College'} sheet
                </p>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                {problems.flatMap(t => t.problems || []).filter(p => starredProblems.has(p.id)).map(p => (
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
                        padding: '12px'
                      }}>
                        <RichTextDisplay content={content} />
                      </div>
                    </div>
                  );
                })}
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
        
        {/* Enhanced Problem Discussion */}
        <EnhancedProblemDiscussion
          isOpen={discussionOpen}
          onClose={() => setDiscussionOpen(false)}
          problem={selectedProblem}
          userId={userId}
        />
        
        {/* Spaced Repetition */}
        <SpacedRepetition problems={problems} userId={userId} sheetType={sheetType} />
        
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
        
        {/* User Profile */}
        <UserProfile
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
          userId={userId}
        />
        
        {/* Playlist Sheet */}
        {playlistSheetOpen && selectedPlaylist && (
          <PlaylistSheet
            isOpen={true}
            onClose={() => {
              setPlaylistSheetOpen(false);
              setSelectedPlaylist(null);
            }}
            playlist={selectedPlaylist}
            userId={userId}
            completedProblems={completedProblems}
            starredProblems={starredProblems}
            sheetType={sheetType}
          />
        )}
        
        {/* Concept Notes */}
        {showConceptNotes && (
          <ConceptNotes 
            isDark={isDark} 
            selectedTopic={selectedConceptTopic}
            onClose={() => {
              console.log('Closing concept notes');
              setShowConceptNotes(false);
              setSelectedConceptTopic(null);
            }} 
          />
        )}
        
        {/* Code Editor */}
        {showCodeEditor && (
          <CodeEditorModal 
            isDark={isDark} 
            onClose={() => setShowCodeEditor(false)} 
          />
        )}
        
        {/* Mock Interview System */}
        {showMockInterview && (
          <MockInterviewSystem 
            isDark={isDark} 
            onClose={() => setShowMockInterview(false)} 
          />
        )}
        
        {/* Chat Discussion */}
        <ChatDiscussion 
          isDark={isDark} 
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          problemId={selectedProblem?.id || 'general'}
        />
        
        {/* Chat Widget - Only show if not using ChatDiscussion */}
        {!showChat && <ChatWidget />}
        
        {/* Floating Feedback Button */}
        <FloatingFeedbackButton />
        
        {/* Compare Modal */}
        {showCompareModal && (
          <CompareModal
            isOpen={showCompareModal}
            onClose={() => setShowCompareModal(false)}
            isDark={isDark}
          />
        )}
        
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
      </main>
      </div>
    </>
  );
};

// Test Button Component
const TestButton = ({ problemId, userId, isDark, problems }) => {
  const [testCompleted, setTestCompleted] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showReport, setShowReport] = useState(false);
  
  useEffect(() => {
    try {
      const completedTestsStr = localStorage.getItem('completedTests');
      if (!completedTestsStr || completedTestsStr === 'undefined') {
        setTestCompleted(false);
        return;
      }
      const completedTests = JSON.parse(completedTestsStr);
      setTestCompleted(completedTests[problemId] || false);
    } catch (error) {
      console.error('Error parsing completedTests:', error);
      setTestCompleted(false);
    }
  }, [problemId]);
  
  const handleTestClick = () => {
    if (testCompleted) {
      setShowReport(true);
      setShowTestModal(true);
    } else {
      setShowTestModal(true);
    }
  };
  
  const handleTestComplete = (testResults) => {
    setTestCompleted(true);
    try {
      const completedTestsStr = localStorage.getItem('completedTests');
      const completedTests = completedTestsStr && completedTestsStr !== 'undefined' ? JSON.parse(completedTestsStr) : {};
      completedTests[problemId] = true;
      localStorage.setItem('completedTests', JSON.stringify(completedTests));
      
      // Save test results to localStorage
      const testResultsStr = localStorage.getItem('testResults');
      const allTestResults = testResultsStr && testResultsStr !== 'undefined' ? JSON.parse(testResultsStr) : {};
      allTestResults[problemId] = {
        ...testResults,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem('testResults', JSON.stringify(allTestResults));
    } catch (error) {
      console.error('Error saving test results:', error);
    }
    
    setShowTestModal(false);
  };
  
  return (
    <>
      <button
        onClick={handleTestClick}
        style={{
          background: testCompleted ? '#22c55e' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        title={testCompleted ? 'Test Completed' : 'Take Test'}
      >
        {testCompleted ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
          </svg>
        )}
      </button>
      
      {showTestModal && (
        <TestModal
          problemId={problemId}
          userId={userId}
          onClose={() => setShowTestModal(false)}
          onComplete={handleTestComplete}
          isDark={isDark}
          problems={problems}
        />
      )}
    </>
  );
};

// Test Modal Component
const TestModal = ({ problemId, userId, onClose, onComplete, isDark, problems }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [problemInfo, setProblemInfo] = useState({ title: `Problem #${problemId}`, difficulty: 'Medium' });
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [testStarted, setTestStarted] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());
  const [showReview, setShowReview] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [showReport, setShowReport] = useState(false);
  
  useEffect(() => {
    // Get problem info from current problems data
    const allProblems = problems?.flatMap(topic => topic.problems || []) || [];
    const problem = allProblems.find(p => p.id === problemId);
    if (problem) {
      setProblemInfo({ title: problem.title, difficulty: problem.difficulty });
    }
    generateQuestions();
  }, [problemId]);
  
  // Timer effect
  useEffect(() => {
    if (testStarted && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      submitTest(); // Auto-submit when time runs out
    }
  }, [testStarted, timeLeft, showResults]);
  
  const generateQuestions = async () => {
    try {
      setLoading(true);
      
      // Get problem details from problems data
      const allProblems = problems?.flatMap(topic => topic.problems || []) || [];
      const problem = allProblems.find(p => p.id === problemId);
      
      const requestData = {
        problemId,
        problemTitle: problem?.title || `Problem #${problemId}`,
        problemTopic: problem?.topic || 'Data Structures and Algorithms',
        problemDescription: problem?.description || problem?.hint || ''
      };
      
      console.log('Sending test request:', requestData);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/test/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestData)
      });
      
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
        setTestStarted(true); // Start timer when questions load
      }
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitTest();
    }
  };
  
  const toggleBookmark = (questionIndex) => {
    const newBookmarks = new Set(bookmarkedQuestions);
    if (newBookmarks.has(questionIndex)) {
      newBookmarks.delete(questionIndex);
    } else {
      newBookmarks.add(questionIndex);
    }
    setBookmarkedQuestions(newBookmarks);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const startTest = () => {
    setShowStartScreen(false);
    setTestStarted(true);
  };
  
  const handleRetakeTest = () => {
    setTestCompleted(false);
    try {
      const completedTestsStr = localStorage.getItem('completedTests');
      const completedTests = completedTestsStr && completedTestsStr !== 'undefined' ? JSON.parse(completedTestsStr) : {};
      delete completedTests[problemId];
      localStorage.setItem('completedTests', JSON.stringify(completedTests));
    } catch (error) {
      console.error('Error updating completedTests:', error);
    }
    setShowReport(false);
    setShowStartScreen(true);
    setShowTestModal(true);
  };
  
  const submitTest = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/test/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          problemId, 
          answers, 
          userId,
          questions, // ✅ Send REAL questions from Gemini
          problemTitle: problemInfo.title // ✅ Send problem title
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setShowResults(true);
      } else {
        console.error('Test submission failed:', response.status);
      }
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };
  
  if (loading) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 3000,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: isDark ? '#1f2937' : 'white',
          borderRadius: '16px', padding: '48px', textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)', maxWidth: '400px', width: '90%'
        }}>
          <img 
            src={isDark ? "/dark.png" : "/light.png"} 
            alt="DSA Sheet" 
            style={{ height: '40px', width: 'auto', marginBottom: '24px' }}
          />
          <h3 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '8px', fontSize: '20px' }}>AI Test Generator</h3>
          <p style={{ color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '24px', fontSize: '14px' }}>
            Generating personalized questions for {problemInfo.title}
          </p>
          <div style={{ 
            width: '48px', height: '48px', 
            border: `4px solid ${isDark ? '#374151' : '#e5e7eb'}`, 
            borderTop: '4px solid #3b82f6', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite', 
            margin: '0 auto' 
          }} />
        </div>
      </div>
    );
  }
  
  if (showResults) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 3000,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: isDark ? '#1f2937' : 'white',
          borderRadius: '16px', padding: '40px', maxWidth: '500px', width: '90%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img 
              src={isDark ? "/dark.png" : "/light.png"} 
              alt="DSA Sheet" 
              style={{ height: '40px', width: 'auto', marginBottom: '16px' }}
            />
            <h3 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '8px', fontSize: '24px' }}>Test Complete!</h3>
            <p style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '14px' }}>{problemInfo.title}</p>
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ 
              fontSize: '64px', fontWeight: 'bold', 
              color: results?.score >= 70 ? '#22c55e' : results?.score >= 50 ? '#f59e0b' : '#ef4444',
              marginBottom: '8px'
            }}>
              {results?.score || 0}%
            </div>
            <div style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '18px', marginBottom: '16px' }}>
              {results?.correct || 0} out of {questions.length} correct
            </div>
            <div style={{
              padding: '12px 20px',
              backgroundColor: results?.score >= 70 ? '#dcfce7' : results?.score >= 50 ? '#fef3c7' : '#fee2e2',
              color: results?.score >= 70 ? '#166534' : results?.score >= 50 ? '#92400e' : '#991b1b',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {results?.score >= 70 ? '🎉 Excellent!' : results?.score >= 50 ? '👍 Good Job!' : '💪 Keep Practicing!'}
            </div>
          </div>
          
          <div style={{ 
            marginBottom: '24px', 
            color: isDark ? '#d1d5db' : '#374151',
            backgroundColor: isDark ? '#374151' : '#f8fafc',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            {results?.feedback || 'Great job completing the test!'}
          </div>
          
          <button
            onClick={() => { onComplete(results); onClose(); }}
            style={{
              width: '100%', padding: '14px', 
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '16px', fontWeight: '600', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
            }}
          >
            ✓ Complete Test
          </button>
        </div>
      </div>
    );
  }
  
  if (showReport && testCompleted) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 3000,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: isDark ? '#1f2937' : 'white',
          borderRadius: '16px', padding: '40px', maxWidth: '500px', width: '90%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)', textAlign: 'center'
        }}>
          <img 
            src={isDark ? "/dark.png" : "/light.png"} 
            alt="DSA Sheet" 
            style={{ height: '40px', width: 'auto', marginBottom: '24px' }}
          />
          <h3 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px', fontSize: '24px' }}>Test Report</h3>
          <p style={{ color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '24px' }}>{problemInfo.title}</p>
          
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#22c55e', marginBottom: '8px' }}>✓</div>
            <div style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '18px' }}>Test Completed Successfully</div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={handleRetakeTest}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white', border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer'
              }}
            >
              Take Test Again
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '12px 24px',
                backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
                color: isDark ? '#d1d5db' : '#374151',
                border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (showStartScreen) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 3000,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: isDark ? '#1f2937' : 'white',
          borderRadius: '16px', padding: '48px', maxWidth: '500px', width: '90%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)', textAlign: 'center'
        }}>
          <img 
            src={isDark ? "/dark.png" : "/light.png"} 
            alt="DSA Sheet" 
            style={{ height: '40px', width: 'auto', marginBottom: '24px' }}
          />
          <h3 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '8px', fontSize: '24px' }}>AI Knowledge Test</h3>
          <p style={{ color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '32px', fontSize: '16px' }}>
            {problemInfo.title} • {problemInfo.difficulty}
          </p>
          
          <div style={{ marginBottom: '32px', textAlign: 'left' }}>
            <h4 style={{ color: isDark ? 'white' : '#1f2937', marginBottom: '16px', fontSize: '18px' }}>Test Details:</h4>
            <ul style={{ color: isDark ? '#d1d5db' : '#374151', fontSize: '14px', lineHeight: '1.6' }}>
              <li>10 comprehensive questions</li>
              <li>10 minutes time limit</li>
              <li>Mixed question types (MCQ, Coding, Text)</li>
              <li>Instant AI-powered feedback</li>
            </ul>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={startTest}
              style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: 'white', border: 'none', borderRadius: '8px',
                fontSize: '16px', fontWeight: '600', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
              }}
            >
              🚀 Start Test
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '14px 28px',
                backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
                color: isDark ? '#d1d5db' : '#374151',
                border: 'none', borderRadius: '8px',
                fontSize: '16px', fontWeight: '600', cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const question = questions[currentQuestion];
  if (!question) return null;
  
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 3000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: isDark ? '#1f2937' : 'white',
        borderRadius: '16px', padding: '0', maxWidth: '700px', width: '95%', maxHeight: '85vh', 
        overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: isDark ? '#374151' : '#e5e7eb',
          background: isDark ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <img 
              src={isDark ? "/dark.png" : "/light.png"} 
              alt="DSA Sheet" 
              style={{ height: '32px', width: 'auto' }}
            />
            <button 
              onClick={onClose} 
              style={{ 
                background: isDark ? '#4b5563' : '#f3f4f6', 
                border: 'none', 
                borderRadius: '50%',
                width: '32px', height: '32px',
                fontSize: '16px', cursor: 'pointer',
                color: isDark ? '#d1d5db' : '#374151'
              }}
            >
              ✕
            </button>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: isDark ? 'white' : '#1f2937', margin: 0, fontSize: '20px', fontWeight: '700' }}>
                AI Knowledge Test
              </h3>
              <p style={{ color: isDark ? '#9ca3af' : '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>
                {problemInfo.title} • {problemInfo.difficulty}
              </p>
            </div>
            <div style={{
              padding: '8px 16px',
              backgroundColor: isDark ? '#4b5563' : '#e2e8f0',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              color: isDark ? '#e5e7eb' : '#374151'
            }}>
              {currentQuestion + 1} / {questions.length}
            </div>
            <div style={{
              padding: '8px 16px',
              backgroundColor: timeLeft < 60 ? '#ef4444' : '#3b82f6',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              color: 'white'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}>
                <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12C2,6.5 6.47,2 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
              </svg>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div style={{ padding: '0 32px' }}>
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: isDark ? '#374151' : '#e5e7eb',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
        
        {/* Question Content */}
        <div style={{ padding: '32px' }}>
        
          <div style={{ marginBottom: '32px' }}>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              color: isDark ? 'white' : '#1f2937', 
              marginBottom: '24px',
              lineHeight: '1.4'
            }}>
              {question.question}
            </div>
            
            {(question.type === 'mcq' || !question.type) && question.options ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                {question.options?.map((option, index) => {
                  const isSelected = answers[currentQuestion] === option;
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQuestion, option)}
                      style={{
                        padding: '16px 20px', 
                        textAlign: 'left', 
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderColor: isSelected ? '#3b82f6' : (isDark ? '#4b5563' : '#e5e7eb'),
                        borderRadius: '12px', 
                        backgroundColor: isSelected 
                          ? (isDark ? '#1e40af' : '#dbeafe') 
                          : (isDark ? '#374151' : 'white'),
                        color: isSelected 
                          ? 'white' 
                          : (isDark ? '#e5e7eb' : '#1f2937'), 
                        cursor: 'pointer', 
                        fontSize: '16px',
                        fontWeight: isSelected ? '600' : '400',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                      }}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? 'white' : (isDark ? '#4b5563' : '#e5e7eb'),
                        color: isSelected ? '#3b82f6' : (isDark ? '#9ca3af' : '#6b7280'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '700',
                        flexShrink: 0
                      }}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span style={{ flex: 1 }}>{option}</span>
                    </button>
                  );
                })}
              </div>
            ) : (question.type === 'coding' || !question.options) ? (
              <div>
                <textarea
                  value={answers[currentQuestion] || ''}
                  onChange={(e) => handleAnswerSelect(currentQuestion, e.target.value)}
                  placeholder={question.placeholder || 'Write your code here...'}
                  style={{
                    width: '100%',
                    minHeight: '200px',
                    padding: '16px',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: answers[currentQuestion] ? '#3b82f6' : (isDark ? '#4b5563' : '#e5e7eb'),
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#1f2937' : '#f8fafc',
                    color: isDark ? '#e5e7eb' : '#1f2937',
                    fontSize: '14px',
                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = answers[currentQuestion] ? '#3b82f6' : (isDark ? '#4b5563' : '#e5e7eb');
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  backgroundColor: isDark ? '#374151' : '#f0f9ff',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: isDark ? '#9ca3af' : '#0369a1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                  </svg>
                  Write the key algorithm or approach for solving this problem
                </div>
              </div>
            ) : (
              <div>
                <textarea
                  value={answers[currentQuestion] || ''}
                  onChange={(e) => handleAnswerSelect(currentQuestion, e.target.value)}
                  placeholder={question.placeholder || 'Explain your approach in detail...'}
                  style={{
                    width: '100%',
                    minHeight: '150px',
                    padding: '16px',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: answers[currentQuestion] ? '#3b82f6' : (isDark ? '#4b5563' : '#e5e7eb'),
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#1f2937' : 'white',
                    color: isDark ? '#e5e7eb' : '#1f2937',
                    fontSize: '16px',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                    lineHeight: '1.5'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = answers[currentQuestion] ? '#3b82f6' : (isDark ? '#4b5563' : '#e5e7eb');
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  backgroundColor: isDark ? '#374151' : '#f0f9ff',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: isDark ? '#9ca3af' : '#0369a1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                  Provide a detailed explanation with examples if needed
                </div>
              </div>
            )}
          </div>
          
          {/* Question Actions */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: isDark ? '#374151' : '#f8fafc',
            borderRadius: '8px'
          }}>
            <button
              onClick={() => toggleBookmark(currentQuestion)}
              style={{
                padding: '8px 12px',
                backgroundColor: bookmarkedQuestions.has(currentQuestion) ? '#3b82f6' : (isDark ? '#4b5563' : '#e5e7eb'),
                color: bookmarkedQuestions.has(currentQuestion) ? 'white' : (isDark ? '#d1d5db' : '#374151'),
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z"/>
              </svg>
              {bookmarkedQuestions.has(currentQuestion) ? 'Bookmarked' : 'Bookmark'}
            </button>
            
            <div style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280', textAlign: 'center' }}>
              {question.difficulty && `Difficulty: ${question.difficulty}`} • {question.points || 10} points
            </div>
            
            <button
              onClick={() => setShowReview(!showReview)}
              style={{
                padding: '8px 12px',
                backgroundColor: showReview ? '#3b82f6' : (isDark ? '#4b5563' : '#e5e7eb'),
                color: showReview ? 'white' : (isDark ? '#d1d5db' : '#374151'),
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M9,17H7V10H9V17M13,17H11V7H13V17M17,17H15V13H17V17Z"/>
              </svg>
              Review ({Object.keys(answers).length}/{questions.length})
            </button>
          </div>
          
          {/* Review Panel */}
          {showReview && (
            <div style={{
              marginBottom: '16px',
              padding: '16px',
              backgroundColor: isDark ? '#374151' : '#f8fafc',
              borderRadius: '8px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: isDark ? 'white' : '#1f2937' }}>Question Overview</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gap: '8px' }}>
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => { setCurrentQuestion(index); setShowReview(false); }}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: answers[index] 
                        ? '#22c55e' 
                        : (index === currentQuestion ? '#3b82f6' : (isDark ? '#4b5563' : '#e5e7eb')),
                      color: (answers[index] || index === currentQuestion) ? 'white' : (isDark ? '#d1d5db' : '#374151'),
                      position: 'relative'
                    }}
                  >
                    {index + 1}
                    {bookmarkedQuestions.has(index) && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#3b82f6" style={{ position: 'absolute', top: '-2px', right: '-2px' }}>
                        <path d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Navigation */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            paddingTop: '24px',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: isDark ? '#374151' : '#e5e7eb'
          }}>
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              style={{
                padding: '12px 24px', 
                backgroundColor: currentQuestion === 0 ? '#9ca3af' : (isDark ? '#4b5563' : '#6b7280'),
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ← Previous
            </button>
            
            <div style={{ 
              color: isDark ? '#9ca3af' : '#6b7280', 
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Question {currentQuestion + 1} of {questions.length}
            </div>
            
            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion] || (answers[currentQuestion] && answers[currentQuestion].toString().trim() === '')}
              style={{
                padding: '12px 24px', 
                background: (!answers[currentQuestion] || answers[currentQuestion].toString().trim() === '') 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: (!answers[currentQuestion] || answers[currentQuestion].toString().trim() === '') ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: (!answers[currentQuestion] || answers[currentQuestion].toString().trim() === '') ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
            >
              {currentQuestion === questions.length - 1 ? '✓ Submit Test' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSASheet;
