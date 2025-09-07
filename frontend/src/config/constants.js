// Configuration constants
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://plusdsa.onrender.com/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://plusdsa.onrender.com';

// Gemini API Keys from environment variables
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
export const GEMINI_API_TEST = import.meta.env.VITE_GEMINI_API_TEST;
export const GEMINI_API_DISCUSSION = import.meta.env.VITE_GEMINI_API_DISCUSSION;
export const GEMINI_API_INTERVIEW = import.meta.env.VITE_GEMINI_API_INTERVIEW;

export const ROOMS = [
  { id: 'general', name: 'General Discussion' },
  { id: 'arrays', name: 'Arrays & Strings' },
  { id: 'trees', name: 'Trees & Graphs' },
  { id: 'dp', name: 'Dynamic Programming' },
  { id: 'algorithms', name: 'Algorithms' },
  { id: 'code-review', name: 'Code Review' },
  { id: 'coding-battles', name: 'Coding Battles' },
  { id: 'interview-prep', name: 'Interview Prep' },
  { id: 'study-groups', name: 'Study Groups' },
  { id: 'daily-challenges', name: 'Daily Challenges' },
  { id: 'achievements', name: 'Achievements' },
  { id: 'concepts', name: 'Concept Learning' }
];

export const EMOJIS = ['😊', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '🎉', '🔥', '💯', '✨', '🚀', '💪', '🤔', '😍', '🙌', '👏', '💡', '⚡'];

export const DSA_EMOJIS = ['🧠', '💻', '⚡', '🔥', '💡', '🎯', '🏆', '📊', '🔍', '⚙️', '🚀', '💎', '🎪', '🔧', '📈', '🎨', '🌟', '💫', '🎭', '🎪'];