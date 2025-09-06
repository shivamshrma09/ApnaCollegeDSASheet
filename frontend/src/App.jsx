import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { tokenManager } from "./utils/tokenManager";

import { SocketProvider } from "./contexts/SimpleSocketContext";
import ErrorBoundary from "./components/ErrorBoundary";
import SEOHead from "./components/SEOHead";
import Analytics from "./components/Analytics";
import PerformanceOptimizer from "./components/PerformanceOptimizer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import GitHubCallback from "./components/GitHubCallback";
import DSASheet from "./components/DSASheet";
import CompanyWiseDSASheet from "./components/CompanyWiseDSASheet";
import CompanyWishSheet from "./components/CompanyWishSheet";
import CompetitiveDashboard from "./components/CompetitiveDashboard";
import Mentorship from "./components/Mentorship";
import InterviewPage from "./components/InterviewPage";
import CodeEditorPage from "./components/CodeEditorPage";
import RoadmapPage from "./components/RoadmapPage";
import AdminFeedbackDashboard from "./components/AdminFeedbackDashboard";
import TopicSheet from "./components/TopicSheet";
import CustomSpacedRepetition from "./components/CustomSpacedRepetition";



import topicArrays from "./data/topicArrays";
import topicStrings from "./data/topicStrings";
import topicTrees from "./data/topicTrees";
import topicLinkedLists from "./data/topicLinkedLists";
import topicDP from "./data/topicDP";
import topicStacksQueues from "./data/topicStacksQueues";
import topicGraphs from "./data/topicGraphs";
import topicBinarySearch from "./data/topicBinarySearch";
import topicSorting from "./data/topicSorting";
import topicGreedy from "./data/topicGreedy";
import topicBacktracking from "./data/topicBacktracking";
import topicBitManipulation from "./data/topicBitManipulation";
import { useTheme } from "./contexts/ThemeContext";
import "./App.css";

function DSASheetWrapper() {
  const { sheetType } = useParams();
  const [currentSheet, setCurrentSheet] = useState(sheetType || 'apnaCollege');
  const [key, setKey] = useState(0);
  
  const getSheetSEO = (sheet) => {
    const seoData = {
      apnaCollege: {
        title: "Apna College DSA Sheet | 373 Curated Problems for Interview Prep",
        description: "Master coding interviews with Apna College's curated DSA sheet. 373 handpicked problems covering all important topics for placement preparation.",
        keywords: "Apna College DSA, coding interview, placement preparation, DSA problems"
      },
      striverSDE: {
        title: "Striver SDE Sheet | Top Interview Questions for Software Engineers",
        description: "Complete Striver's SDE sheet with most asked interview questions. Perfect for software engineering roles at top companies.",
        keywords: "Striver SDE sheet, software engineer interview, coding questions"
      },
      blind75: {
        title: "Blind 75 LeetCode Problems | Essential Coding Interview Questions",
        description: "Master the famous Blind 75 LeetCode problems. Essential questions asked in FAANG and top tech company interviews.",
        keywords: "Blind 75, LeetCode, FAANG interview, coding problems"
      }
    };
    return seoData[sheet] || seoData.apnaCollege;
  };

  const handleSheetChange = (newSheetType) => {
    console.log('Switching to sheet:', newSheetType);
    

    if (newSheetType.startsWith('topic-')) {
      const topicType = newSheetType.replace('topic-', '');
      window.location.href = `/topic/${topicType}`;
      return;
    }
    
    setCurrentSheet(newSheetType);
    setKey(prev => prev + 1); // Force re-render

    window.history.pushState({}, '', `/sheet/${newSheetType}`);
  };


  useEffect(() => {
    if (sheetType && sheetType !== currentSheet) {
      setCurrentSheet(sheetType);
      setKey(prev => prev + 1);
    }
  }, [sheetType, currentSheet]);

  const seoData = getSheetSEO(currentSheet);
  
  return (
    <>
      <SEOHead 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonical={`https://your-domain.com/sheet/${currentSheet}`}
      />
      <DSASheet key={key} sheetType={currentSheet} onSheetChange={handleSheetChange} />
    </>
  );
}

function TopicSheetWrapper() {
  const { topicType } = useParams();
  
  const getTopicSEO = (topic) => {
    const seoData = {
      arrays: {
        title: "Array Problems | DSA Practice - Data Structures & Algorithms",
        description: "Master array problems with our curated collection. Practice essential array algorithms for coding interviews.",
        keywords: "array problems, array algorithms, DSA arrays, coding interview arrays"
      },
      strings: {
        title: "String Problems | DSA Practice - Data Structures & Algorithms", 
        description: "Practice string manipulation problems. Essential string algorithms for technical interviews.",
        keywords: "string problems, string algorithms, DSA strings, coding interview strings"
      },
      trees: {
        title: "Tree Problems | DSA Practice - Binary Trees & BST",
        description: "Master tree data structures with our comprehensive problem set. Binary trees, BST, and advanced tree algorithms.",
        keywords: "tree problems, binary tree, BST, tree algorithms, DSA trees"
      }
    };
    return seoData[topic] || seoData.arrays;
  };
  
  const getTopicData = (topic) => {
    switch (topic) {
      case 'arrays': return topicArrays;
      case 'strings': return topicStrings;
      case 'trees': return topicTrees;
      case 'linkedlists': return topicLinkedLists;
      case 'dp': return topicDP;
      case 'stacks-queues': return topicStacksQueues;
      case 'graphs': return topicGraphs;
      case 'binary-search': return topicBinarySearch;
      case 'sorting': return topicSorting;
      case 'greedy': return topicGreedy;
      case 'backtracking': return topicBacktracking;
      case 'bit-manipulation': return topicBitManipulation;
      default: return topicArrays;
    }
  };

  const topicData = getTopicData(topicType);
  
  const handleBack = () => {
    window.history.back();
  };

  const seoData = getTopicSEO(topicType);
  
  return (
    <>
      <SEOHead 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonical={`https://your-domain.com/topic/${topicType}`}
      />
      <TopicSheet topicData={topicData} onBack={handleBack} />
    </>
  );
}

function AppContent() {
  const { isDark } = useTheme();
  
  // Check token validity on app load
  useEffect(() => {
    const checkToken = () => {
      if (!tokenManager.isTokenValid()) {
        console.log('🚨 Invalid token detected, redirecting to login');
        // Only redirect if not on public pages
        const publicPaths = ['/login', '/signup', '/'];
        if (!publicPaths.includes(window.location.pathname)) {
          window.location.href = '/login';
        }
      }
    };
    
    checkToken();
    // Check token every 5 minutes (less aggressive)
    const interval = setInterval(checkToken, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div style={{ position: 'relative' }}>
      <Analytics />
      <PerformanceOptimizer />
      <BrowserRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
        <Routes>
          <Route path="/" element={
            <>
              <SEOHead 
                title="DSA Sheet - Apna College | Complete Data Structures & Algorithms Practice Platform"
                description="Master Data Structures & Algorithms with our comprehensive DSA practice platform. 373+ curated problems, progress tracking, mentorship, and interview preparation."
                keywords="DSA, Data Structures, Algorithms, Coding Interview, LeetCode, Programming, Apna College"
                canonical="https://your-domain.com/"
              />
              <DSASheetWrapper />
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/github/callback" element={<GitHubCallback />} />
          <Route path="/dsa-sheet" element={<DSASheetWrapper />} />
          <Route path="/sheet/:sheetType" element={<DSASheetWrapper />} />
          <Route path="/cp-sheet" element={<DSASheetWrapper />} />
          <Route path="/competitive" element={
            <>
              <SEOHead 
                title="Competitive Programming Dashboard | CP Practice & Contests"
                description="Track your competitive programming progress. Practice CP problems, participate in contests, and improve your algorithmic skills."
                keywords="competitive programming, CP practice, coding contests, algorithmic programming"
                canonical="https://your-domain.com/competitive"
              />
              <CompetitiveDashboard />
            </>
          } />
          <Route path="/company/:companyId" element={<CompanyWiseDSASheet onSheetChange={(type) => window.location.href = `/sheet/${type}`} />} />
          <Route path="/company-wish-sheet" element={<CompanyWishSheet />} />
          <Route path="/mentorship" element={
            <>
              <SEOHead 
                title="DSA Mentorship Program | Get Guidance from Industry Experts"
                description="Join our mentorship program and get personalized guidance from industry experts. Accelerate your DSA learning and interview preparation."
                keywords="DSA mentorship, coding mentor, interview preparation, programming guidance"
                canonical="https://your-domain.com/mentorship"
              />
              <Mentorship />
            </>
          } />
          <Route path="/interview" element={
            <>
              <SEOHead 
                title="Mock Interview Practice | AI-Powered Coding Interview Simulator"
                description="Practice coding interviews with our AI-powered mock interview system. Get real-time feedback and improve your interview skills."
                keywords="mock interview, coding interview practice, AI interview, technical interview preparation"
                canonical="https://your-domain.com/interview"
              />
              <InterviewPage />
            </>
          } />
          <Route path="/code-editor" element={<CodeEditorPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/roadmap/:roadmapType" element={<RoadmapPage />} />
          <Route path="/topic/:topicType" element={<TopicSheetWrapper />} />
          <Route path="/custom-spaced-repetition" element={<CustomSpacedRepetition />} />
          <Route path="/admin/feedback" element={<AdminFeedbackDashboard isDark={isDark} />} />
        </Routes>


      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
