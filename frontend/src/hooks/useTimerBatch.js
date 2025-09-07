import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { requestCache } from '../utils/requestCache';
import { requestDebouncer } from '../utils/requestDebouncer';
import { getAuthHeaders } from '../utils/csrfHelper';

const API_BASE_URL = 'https://plusdsa.onrender.com/api';

// Singleton to manage all timers
class TimerManager {
  constructor() {
    this.timers = new Map();
    this.subscribers = new Map();
    this.batchInterval = null;
    this.loadingPromise = null;
  }

  subscribe(problemId, callback) {
    if (!this.subscribers.has(problemId)) {
      this.subscribers.set(problemId, new Set());
    }
    this.subscribers.get(problemId).add(callback);

    // Start batch loading if first subscriber
    if (this.subscribers.size === 1) {
      this.startBatchLoading();
    }

    return () => {
      const subs = this.subscribers.get(problemId);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this.subscribers.delete(problemId);
          this.timers.delete(problemId);
        }
      }

      // Stop batch loading if no subscribers
      if (this.subscribers.size === 0) {
        this.stopBatchLoading();
      }
    };
  }

  async loadTimersBatch() {
    const problemIds = Array.from(this.subscribers.keys());
    if (problemIds.length === 0) return;

    // Use debouncer to prevent rapid successive calls
    return requestDebouncer.debounce('timer-batch', async () => {
      try {
        const cacheKey = `timers-batch-${problemIds.sort().join(',')}`;
        
        const response = await requestCache.get(cacheKey, async () => {
          const headers = await getAuthHeaders();
          return await axios.post(`${API_BASE_URL}/timer/batch`, 
            { problemIds },
            { headers }
          );
        }, 3000); // Reduced cache time

        // Update all timers
        response.data.timers.forEach(timer => {
          this.timers.set(timer.problemId, timer);
          const subscribers = this.subscribers.get(timer.problemId);
          if (subscribers) {
            subscribers.forEach(callback => callback(timer));
          }
        });
      } catch (error) {
        if (error.response?.status !== 429) {
          console.error('Error loading timers batch:', error);
        }
      }
    }, 500);
  }

  startBatchLoading() {
    this.loadTimersBatch();
    this.batchInterval = setInterval(() => {
      this.loadTimersBatch();
    }, 15000); // Increased interval to 15 seconds
  }

  stopBatchLoading() {
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
      this.batchInterval = null;
    }
    requestDebouncer.cancel('timer-batch');
  }

  getTimer(problemId) {
    return this.timers.get(problemId);
  }
}

const timerManager = new TimerManager();

export const useTimerBatch = (problemId) => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!problemId) return;

    const unsubscribe = timerManager.subscribe(problemId, (timerData) => {
      setTimeSpent(timerData.timeSpent || 0);
      setIsActive(timerData.isActive || false);
      if (timerData.isActive && timerData.startTime) {
        setStartTime(new Date(timerData.startTime));
      }
    });

    // Check if timer data already exists
    const existingTimer = timerManager.getTimer(problemId);
    if (existingTimer) {
      setTimeSpent(existingTimer.timeSpent || 0);
      setIsActive(existingTimer.isActive || false);
      if (existingTimer.isActive && existingTimer.startTime) {
        setStartTime(new Date(existingTimer.startTime));
      }
    }

    return unsubscribe;
  }, [problemId]);

  // Update timer every second when active
  useEffect(() => {
    if (isActive && startTime) {
      intervalRef.current = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, startTime]);

  const getRequestHeaders = async () => {
    const headers = await getAuthHeaders();
    return { headers };
  };

  const startTimer = async () => {
    return requestDebouncer.debounce(`start-timer-${problemId}`, async () => {
      try {
        const config = await getRequestHeaders();
        await axios.post(
          `${API_BASE_URL}/timer/start`,
          { problemId },
          config
        );
        
        setIsActive(true);
        setStartTime(new Date());
      } catch (error) {
        if (error.response?.status !== 429) {
          console.error('Error starting timer:', error);
        }
      }
    }, 1000);
  };

  const stopTimer = async () => {
    return requestDebouncer.debounce(`stop-timer-${problemId}`, async () => {
      try {
        const config = await getRequestHeaders();
        await axios.post(
          `${API_BASE_URL}/timer/stop`,
          { problemId },
          config
        );
        
        setIsActive(false);
        setStartTime(null);
        clearInterval(intervalRef.current);
      } catch (error) {
        if (error.response?.status !== 429) {
          console.error('Error stopping timer:', error);
        }
      }
    }, 1000);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeSpent,
    isActive,
    startTimer,
    stopTimer,
    formatTime
  };
};