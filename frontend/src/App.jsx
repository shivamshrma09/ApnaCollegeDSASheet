import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { tokenManager } from "./utils/tokenManager";

import { SocketProvider } from "./contexts/SimpleSocketContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Login from "./components/Login";
import Signup from "./components/Signup";
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

  return <DSASheet key={key} sheetType={currentSheet} onSheetChange={handleSheetChange} />;
}

function TopicSheetWrapper() {
  const { topicType } = useParams();
  
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

  return <TopicSheet topicData={topicData} onBack={handleBack} />;
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
    // Check token every 30 minutes (less aggressive)
    const interval = setInterval(checkToken, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div style={{ position: 'relative' }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DSASheetWrapper />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dsa-sheet" element={<DSASheetWrapper />} />
          <Route path="/sheet/:sheetType" element={<DSASheetWrapper />} />
          <Route path="/cp-sheet" element={<DSASheetWrapper />} />
          <Route path="/competitive" element={<CompetitiveDashboard />} />
          <Route path="/company/:companyId" element={<CompanyWiseDSASheet onSheetChange={(type) => window.location.href = `/sheet/${type}`} />} />
          <Route path="/company-wish-sheet" element={<CompanyWishSheet />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/interview" element={<InterviewPage />} />
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
