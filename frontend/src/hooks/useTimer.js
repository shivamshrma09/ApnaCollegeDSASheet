import { useState, useEffect, useRef } from 'react';

export const useTimer = (problemId) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Save time to localStorage
      const storageKey = `timer_${problemId}`;
      localStorage.setItem(storageKey, time.toString());
    }
  };

  const resetTimer = () => {
    setTime(0);
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Load saved time
    const storageKey = `timer_${problemId}`;
    const savedTime = localStorage.getItem(storageKey);
    if (savedTime) {
      setTime(parseInt(savedTime) || 0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [problemId]);

  return {
    time,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    formatTime: () => formatTime(time)
  };
};