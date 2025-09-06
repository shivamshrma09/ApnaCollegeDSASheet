import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../utils/api';
// import { requestCache } from '../utils/requestCache'; // File removed
// import { requestDebouncer } from '../utils/requestDebouncer'; // File removed

export const useUserProgress = (userId, sheetType = 'apnaCollege') => {
  const [completedProblems, setCompletedProblems] = useState(new Set());
  const [starredProblems, setStarredProblems] = useState(new Set());
  const [notes, setNotes] = useState({});
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);
  const lastFetchRef = useRef('');

  const fetchUserProgress = useCallback(async () => {
    if (fetchingRef.current) return;
    
    fetchingRef.current = true;
    
    try {
      console.log(`🔄 Fresh fetch for ${sheetType}`);
      
      const response = await api.get(`/progress/${userId}?sheetType=${sheetType}`);
    
      const { completedProblems, starredProblems, notes, playlists } = response.data;
      console.log(`📊 ${sheetType} data:`, { completed: completedProblems?.length, starred: starredProblems?.length });
      
      setCompletedProblems(new Set(completedProblems || []));
      setStarredProblems(new Set(starredProblems || []));
      setNotes(notes || {});
      setPlaylists(playlists || []);
      setLoading(false);
    } catch (error) {
      console.error(`❌ Error fetching ${sheetType}:`, error.message);
      setLoading(false);
    } finally {
      fetchingRef.current = false;
    }
  }, [userId, sheetType]);

  useEffect(() => {
    if (userId && sheetType) {
      console.log(`🔄 Loading ${sheetType} data...`);
      setLoading(true);
      setCompletedProblems(new Set());
      setStarredProblems(new Set());
      setNotes({});
      setPlaylists([]);
      fetchingRef.current = false;
      
      setTimeout(() => fetchUserProgress(), 50);
    }
  }, [userId, sheetType, fetchUserProgress]);

  const toggleComplete = async (problemId) => {
    console.log(`✅ ONLY toggling ${problemId} in ${sheetType}`);
    try {
      const response = await api.post(`/progress/${userId}/complete/${problemId}?sheetType=${sheetType}`, {});
      
      const serverCompleted = response.data.completedProblems || [];
      console.log(`📊 Server returned ${serverCompleted.length} completed for ${sheetType}`);
      setCompletedProblems(new Set(serverCompleted));
      
    } catch (error) {
      console.error(`❌ Error in ${sheetType}:`, error.message);
    }
  };

  const toggleStar = async (problemId) => {
    console.log(`⭐ ONLY starring ${problemId} in ${sheetType}`);
    try {
      const response = await api.post(`/progress/${userId}/star/${problemId}?sheetType=${sheetType}`, {});
      
      const serverStarred = response.data.starredProblems || [];
      console.log(`📊 Server returned ${serverStarred.length} starred for ${sheetType}`);
      setStarredProblems(new Set(serverStarred));
      
    } catch (error) {
      console.error(`❌ Error starring in ${sheetType}:`, error.message);
    }
  };

  const saveNote = async (problemId, content) => {
    try {
      const response = await api.post(`/progress/${userId}/note/${problemId}?sheetType=${sheetType}`, {
        note: content
      });
      setNotes(response.data.notes);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const deleteNote = async (problemId) => {
    try {
      const response = await api.delete(`/progress/${userId}/note/${problemId}?sheetType=${sheetType}`);
      setNotes(response.data.notes);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const createPlaylist = async (playlistData) => {
    try {
      const response = await api.post(`/progress/${userId}/playlist?sheetType=${sheetType}`, 
        {...playlistData, sheetType}
      );
      setPlaylists(response.data.playlists);
    } catch (error) {
      console.error('Error creating playlist:', error.message?.substring(0, 100));
    }
  };

  const updatePlaylist = async (playlistId, playlistData) => {
    try {
      const response = await api.put(`/progress/${userId}/playlist/${playlistId}?sheetType=${sheetType}`, 
        playlistData
      );
      setPlaylists(response.data.playlists);
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  const deletePlaylist = async (playlistId) => {
    try {
      const response = await api.delete(`/progress/${userId}/playlist/${playlistId}?sheetType=${sheetType}`);
      setPlaylists(response.data.playlists);
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const addToPlaylist = async (playlistId, problemId) => {
    try {
      const response = await api.post(`/progress/${userId}/playlist/${playlistId}/problem/${problemId}?sheetType=${sheetType}`, {});
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