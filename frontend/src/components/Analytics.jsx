import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics tracking
const Analytics = () => {
  let location;
  try {
    location = useLocation();
  } catch (error) {
    // Fallback if not in Router context
    location = { pathname: window.location.pathname, search: window.location.search };
  }

  useEffect(() => {
    // Track page views
    if (typeof gtag !== 'undefined') {
      gtag('config', 'G-271KG7PXFC', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  // Track custom events
  const trackEvent = (action, category, label, value) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  // Track problem completion
  const trackProblemCompletion = (problemName, difficulty, timeTaken) => {
    trackEvent('problem_completed', 'DSA_Practice', problemName, timeTaken);
  };

  // Track sheet progress
  const trackSheetProgress = (sheetType, completionPercentage) => {
    trackEvent('sheet_progress', 'Progress_Tracking', sheetType, completionPercentage);
  };

  // Track user engagement
  const trackUserEngagement = (action, details) => {
    trackEvent(action, 'User_Engagement', details);
  };

  return null;
};

// Export tracking functions for use in other components
export const analytics = {
  trackProblemCompletion: (problemName, difficulty, timeTaken) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'problem_completed', {
        event_category: 'DSA_Practice',
        event_label: problemName,
        custom_parameters: {
          difficulty: difficulty,
          time_taken: timeTaken
        }
      });
    }
  },
  
  trackSheetProgress: (sheetType, completionPercentage) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'sheet_progress', {
        event_category: 'Progress_Tracking',
        event_label: sheetType,
        value: completionPercentage
      });
    }
  },
  
  trackFeatureUsage: (feature, action) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'feature_usage', {
        event_category: 'Feature_Interaction',
        event_label: feature,
        custom_parameters: {
          action: action
        }
      });
    }
  }
};

export default Analytics;