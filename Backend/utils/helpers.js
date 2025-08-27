const calculateProgress = (completedProblems, totalProblems) => {
  if (totalProblems === 0) return 0;
  return Math.round((completedProblems.length / totalProblems) * 100);
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return '#00b894';
    case 'medium':
      return '#fdcb6e';
    case 'hard':
      return '#e17055';
    default:
      return '#74b9ff';
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const generateRandomId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

module.exports = {
  calculateProgress,
  getDifficultyColor,
  formatDate,
  validateEmail,
  generateRandomId
};