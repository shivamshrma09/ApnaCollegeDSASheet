import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5001/api';

export const useForgettingCurve = (userId, sheetType = 'apnaCollege') => {
  const [forgettingCurveData, setForgettingCurveData] = useState({
    today: [],
    day1: [],
    day3: [],
    week1: [],
    week2: [],
    month1: [],
    month3: []
  });

  const categorizeByDate = (spacedRepetitionData) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const day3 = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    const week1 = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const week2 = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    const month1 = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const month3 = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);

    const categorized = {
      today: [],
      day1: [],
      day3: [],
      week1: [],
      week2: [],
      month1: [],
      month3: []
    };

    spacedRepetitionData.forEach(item => {
      const reviewDate = new Date(item.nextReviewDate);
      const reviewDay = new Date(reviewDate.getFullYear(), reviewDate.getMonth(), reviewDate.getDate());
      
      if (reviewDay.getTime() <= today.getTime()) {
        categorized.today.push(item.problemId);
      } else if (reviewDay.getTime() === tomorrow.getTime()) {
        categorized.day1.push(item.problemId);
      } else if (reviewDay.getTime() <= day3.getTime()) {
        categorized.day3.push(item.problemId);
      } else if (reviewDay.getTime() <= week1.getTime()) {
        categorized.week1.push(item.problemId);
      } else if (reviewDay.getTime() <= week2.getTime()) {
        categorized.week2.push(item.problemId);
      } else if (reviewDay.getTime() <= month1.getTime()) {
        categorized.month1.push(item.problemId);
      } else if (reviewDay.getTime() <= month3.getTime()) {
        categorized.month3.push(item.problemId);
      }
    });

    return categorized;
  };

  const fetchSpacedRepetitionData = async () => {
    try {
      if (!userId) return;
      
      const response = await fetch(`${API_BASE_URL}/spaced-repetition/all?sheetType=${sheetType}`, {
        headers: {
          'userid': userId
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const categorized = categorizeByDate(data);
        setForgettingCurveData(categorized);
      }
    } catch (error) {
      console.error('Error fetching spaced repetition data:', error);
      // Fallback to localStorage
      const storageKey = `forgettingCurve_${userId}_${sheetType}`;
      const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
      setForgettingCurveData({
        today: data.today || [],
        day1: data.day1 || [],
        day3: data.day3 || [],
        week1: data.week1 || [],
        week2: data.week2 || [],
        month1: data.month1 || [],
        month3: data.month3 || []
      });
    }
  };

  const addToForgettingCurve = async (problemId) => {
    try {
      if (!userId) return false;
      
      // Use new custom spaced repetition API
      const response = await fetch(`${API_BASE_URL}/custom-spaced-repetition/add-solved?sheetType=${sheetType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userid': userId
        },
        body: JSON.stringify({ problemId })
      });
      
      if (response.ok) {
        // Refresh data after adding
        await fetchSpacedRepetitionData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to forgetting curve:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchSpacedRepetitionData();
  }, [userId, sheetType]);

  return {
    forgettingCurveData,
    addToForgettingCurve,
    refreshData: fetchSpacedRepetitionData
  };
};