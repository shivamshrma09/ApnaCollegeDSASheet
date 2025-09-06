import { useState, useCallback } from 'react';
import APIFailoverManager from '../utils/apiFailover';

export const useAPIFailover = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAPI, setCurrentAPI] = useState('primary');

  const makeFailoverRequest = useCallback(async (endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await APIFailoverManager.makeRequest(endpoint, options);
      setCurrentAPI('primary'); // Reset to primary if successful
      return response;
    } catch (err) {
      setError(err.message);
      setCurrentAPI('fallback');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateInterviewQuestion = useCallback(async (problemData) => {
    try {
      const question = await APIFailoverManager.generateInterviewQuestion(problemData);
      return question;
    } catch (err) {
      setError('Failed to generate question, using fallback');
      return APIFailoverManager.getLocalFallbackQuestion(problemData);
    }
  }, []);

  return {
    makeFailoverRequest,
    generateInterviewQuestion,
    isLoading,
    error,
    currentAPI
  };
};