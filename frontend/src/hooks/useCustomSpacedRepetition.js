import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useCustomSpacedRepetition = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProblems = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/custom-spaced-repetition/problems`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProblems(response.data.problems || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch problems');
    } finally {
      setLoading(false);
    }
  };

  const addProblem = async (problemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/custom-spaced-repetition/add`, 
        { problemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProblems();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add problem');
    }
  };

  const updateProgress = async (problemId, understood) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/custom-spaced-repetition/update`, 
        { problemId, understood },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProblems();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update progress');
    }
  };

  const removeProblem = async (problemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/custom-spaced-repetition/remove/${problemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProblems();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove problem');
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  return {
    problems,
    loading,
    error,
    fetchProblems,
    addProblem,
    updateProgress,
    removeProblem
  };
};