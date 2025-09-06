import React from 'react';
import { useCustomSpacedRepetition } from './CustomSpacedRepetition';

// Integration component for DSA Sheet
export const SpacedRepetitionIntegration = ({ userId, sheetType = 'apnaCollege' }) => {
  const { addToSpacedRepetition } = useCustomSpacedRepetition(userId, sheetType);

  // Function to add problem to spaced repetition when user completes it
  const handleProblemComplete = async (problemId) => {
    try {
      const success = await addToSpacedRepetition(problemId);
      if (success) {
        // Show success notification
        const notification = document.createElement('div');
        notification.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 14px;
            font-weight: 500;
            animation: slideIn 0.3s ease-out;
          ">
            🧠 Added to Spaced Repetition! Review tomorrow.
          </div>
          <style>
            @keyframes slideIn {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          </style>
        `;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding to spaced repetition:', error);
    }
  };

  // Return the handler function for use in DSA Sheet
  return { handleProblemComplete };
};

// Hook for easy integration
export const useSpacedRepetitionIntegration = (userId, sheetType = 'apnaCollege') => {
  const { addToSpacedRepetition } = useCustomSpacedRepetition(userId, sheetType);

  const addProblemToSpacedRepetition = async (problemId) => {
    try {
      const success = await addToSpacedRepetition(problemId);
      if (success) {
        // Show toast notification
        showSpacedRepetitionToast('🧠 Added to Spaced Repetition! Review tomorrow.');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to spaced repetition:', error);
      showSpacedRepetitionToast('❌ Failed to add to spaced repetition', 'error');
      return false;
    }
  };

  return { addProblemToSpacedRepetition };
};

// Toast notification helper
const showSpacedRepetitionToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #ef4444, #dc2626)';
  
  toast.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 500;
      animation: slideIn 0.3s ease-out;
      max-width: 300px;
    ">
      ${message}
    </div>
    <style>
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    </style>
  `;
  
  document.body.appendChild(toast);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }, 3000);
};

export default SpacedRepetitionIntegration;