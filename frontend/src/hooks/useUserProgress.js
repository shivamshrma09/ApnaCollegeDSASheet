import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

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
      setLoading(false);
    }
  };

  const toggleComplete = async (problemId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/progress/${userId}/complete/${problemId}`);
      setCompletedProblems(new Set(response.data.completedProblems));
      
      if (!completedProblems.has(problemId)) {
        const today = new Date().toDateString();
        localStorage.setItem('lastSolved', today);
        const currentStreak = parseInt(localStorage.getItem('streak') || '0');
        const newStreak = currentStreak + 1;
        localStorage.setItem('streak', newStreak.toString());
        setStreak(newStreak);
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const toggleStar = async (problemId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/progress/${userId}/star/${problemId}`);
      setStarredProblems(new Set(response.data.starredProblems));
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  const saveNote = async (problemId, content) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/progress/${userId}/note/${problemId}`, {
        note: content
      });
      setNotes(response.data.notes);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const deleteNote = async (problemId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/progress/${userId}/note/${problemId}`);
      setNotes(response.data.notes);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const createPlaylist = async (playlistData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/progress/${userId}/playlist`, playlistData);
      setPlaylists(response.data.playlists);
    } catch (error) {
      console.error('Error creating playlist:', error);
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