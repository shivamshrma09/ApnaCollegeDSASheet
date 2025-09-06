import { useState, useEffect } from 'react';
import api from '../utils/api';
// import { requestCache } from '../utils/requestCache'; // File removed
// import { getAuthHeaders } from '../utils/csrfToken'; // File removed

// Simple replacement functions
const requestCache = {
  get: async (key, fetchFn, ttl) => {
    return await fetchFn();
  }
};

export const useSpacedRepetition = (userId, sheetType = 'apnaCollege') => {
  const [dueProblems, setDueProblems] = useState([]);
  const [allSpacedProblems, setAllSpacedProblems] = useState([]);
  const [loading, setLoading] = useState(true);



  const fetchDueProblems = async () => {
    try {
      const cacheKey = `spaced-due-${sheetType}`;
      const response = await requestCache.get(cacheKey, async () => {
        return await api.get(`/spaced-repetition/due?sheetType=${sheetType}`);
      }, 15000); // Cache for 15 seconds
      setDueProblems(response.data);
    } catch (error) {
      console.error('Error fetching due problems:', error);
      const localData = JSON.parse(localStorage.getItem(`${sheetType}_spacedRepetition`) || '[]');
      setDueProblems(localData.filter(p => new Date(p.nextReview) <= new Date()));
    }
  };

  const fetchAllSpacedProblems = async () => {
    try {
      const cacheKey = `spaced-all-${sheetType}`;
      const response = await requestCache.get(cacheKey, async () => {
        return await api.get(`/spaced-repetition/all?sheetType=${sheetType}`);
      }, 30000); // Cache for 30 seconds
      setAllSpacedProblems(response.data);
    } catch (error) {
      console.error('Error fetching spaced problems:', error);
      const localData = JSON.parse(localStorage.getItem(`${sheetType}_spacedRepetition`) || '[]');
      setAllSpacedProblems(localData);
    }
  };

  const addToSpacedRepetition = async (problemId) => {
    try {
      await api.post(`/spaced-repetition/add?sheetType=${sheetType}`, { problemId });
      await fetchAllSpacedProblems();
      return true;
    } catch (error) {
      console.error('Error adding to spaced repetition:', error);
      const localData = JSON.parse(localStorage.getItem(`${sheetType}_spacedRepetition`) || '[]');
      localData.push({ problemId, addedAt: new Date().toISOString(), nextReview: new Date(Date.now() + 24*60*60*1000).toISOString() });
      localStorage.setItem(`${sheetType}_spacedRepetition`, JSON.stringify(localData));
      return false;
    }
  };

  const reviewProblem = async (problemId, quality) => {
    try {
      const response = await api.post(`/spaced-repetition/review?sheetType=${sheetType}`, 
        { problemId, quality }
      );
      await fetchDueProblems();
      await fetchAllSpacedProblems();
      return response.data;
    } catch (error) {
      console.error('Error reviewing problem:', error);
      return null;
    }
  };

  useEffect(() => {
    if (userId) {
      Promise.all([fetchDueProblems(), fetchAllSpacedProblems()]).finally(() => {
        setLoading(false);
      });
    }
  }, [userId, sheetType]);

  return {
    dueProblems,
    allSpacedProblems,
    loading,
    addToSpacedRepetition,
    reviewProblem,
    fetchDueProblems,
    fetchAllSpacedProblems
  };
};