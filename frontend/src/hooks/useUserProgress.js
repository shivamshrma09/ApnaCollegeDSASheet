import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://apnacollegedsasheet.onrender.com') + '/api';

export const useUserProgress = (userId) => {
  const [completedProblems, setCompletedProblems] = useState(new Set());
  const [starredProblems, setStarredProblems] = useState(new Set());
  const [notes, setNotes] = useState({});
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUserProgress();
    }
  }, [userId]);

  const fetchUserProgress = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/progress/${userId}`);
      const { completedProblems, starredProblems, notes, playlists } = response.data;
      
      setCompletedProblems(new Set(completedProblems));
      setStarredProblems(new Set(starredProblems));
      setNotes(notes || {});
      setPlaylists(playlists || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      // Fallback to localStorage when backend is not available
      const localCompleted = JSON.parse(localStorage.getItem('completedProblems') || '[]');
      const localStarred = JSON.parse(localStorage.getItem('starredProblems') || '[]');
      const localNotes = JSON.parse(localStorage.getItem('notes') || '{}');
      const localPlaylists = JSON.parse(localStorage.getItem('playlists') || '[]');
      
      setCompletedProblems(new Set(localCompleted));
      setStarredProblems(new Set(localStarred));
      setNotes(localNotes);
      setPlaylists(localPlaylists);
      setLoading(false);
    }
  };

  const toggleComplete = async (problemId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/progress/${userId}/complete/${problemId}`);
      setCompletedProblems(new Set(response.data.completedProblems));
    } catch (error) {
      // Fallback to localStorage
      const newCompleted = new Set(completedProblems);
      if (newCompleted.has(problemId)) {
        newCompleted.delete(problemId);
      } else {
        newCompleted.add(problemId);
      }
      setCompletedProblems(newCompleted);
      localStorage.setItem('completedProblems', JSON.stringify([...newCompleted]));
    }
  };

  const toggleStar = async (problemId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/progress/${userId}/star/${problemId}`);
      setStarredProblems(new Set(response.data.starredProblems));
    } catch (error) {
      // Fallback to localStorage
      const newStarred = new Set(starredProblems);
      if (newStarred.has(problemId)) {
        newStarred.delete(problemId);
      } else {
        newStarred.add(problemId);
      }
      setStarredProblems(newStarred);
      localStorage.setItem('starredProblems', JSON.stringify([...newStarred]));
    }
  };

  const saveNote = async (problemId, content) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/progress/${userId}/note/${problemId}`, {
        note: content
      });
      setNotes(response.data.notes);
    } catch (error) {
      // Fallback to localStorage
      const newNotes = { ...notes, [problemId]: content };
      setNotes(newNotes);
      localStorage.setItem('notes', JSON.stringify(newNotes));
    }
  };

  const deleteNote = async (problemId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/progress/${userId}/note/${problemId}`);
      setNotes(response.data.notes);
    } catch (error) {
      // Fallback to localStorage
      const newNotes = { ...notes };
      delete newNotes[problemId];
      setNotes(newNotes);
      localStorage.setItem('notes', JSON.stringify(newNotes));
    }
  };

  const createPlaylist = async (playlistData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/progress/${userId}/playlist`, playlistData);
      setPlaylists(response.data.playlists);
    } catch (error) {
      // Fallback to localStorage
      const newPlaylist = {
        id: Date.now(),
        ...playlistData,
        problems: [],
        createdAt: new Date().toISOString()
      };
      const newPlaylists = [...playlists, newPlaylist];
      setPlaylists(newPlaylists);
      localStorage.setItem('playlists', JSON.stringify(newPlaylists));
    }
  };

  const updatePlaylist = async (playlistId, playlistData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/progress/${userId}/playlist/${playlistId}`, playlistData);
      setPlaylists(response.data.playlists);
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  const deletePlaylist = async (playlistId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/progress/${userId}/playlist/${playlistId}`);
      setPlaylists(response.data.playlists);
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const addToPlaylist = async (playlistId, problemId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/progress/${userId}/playlist/${playlistId}/problem/${problemId}`);
      setPlaylists(response.data.playlists);
    } catch (error) {
      console.error('Error adding to playlist:', error);
    }
  };

  return {
    completedProblems,
    starredProblems,
    notes,
    playlists,
    loading,
    toggleComplete,
    toggleStar,
    saveNote,
    deleteNote,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addToPlaylist
  };
};