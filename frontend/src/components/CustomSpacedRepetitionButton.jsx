import React from 'react';
import { useCustomSpacedRepetition } from '../hooks/useCustomSpacedRepetition';

const CustomSpacedRepetitionButton = ({ problemId, isAdded = false, className = '' }) => {
  const { addProblem, removeProblem, loading } = useCustomSpacedRepetition();

  const handleClick = async (e) => {
    e.stopPropagation();
    if (isAdded) {
      await removeProblem(problemId);
    } else {
      await addProblem(problemId);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
        isAdded 
          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      } ${className}`}
      title={isAdded ? 'Remove from Custom SR' : 'Add to Custom SR'}
    >
      {loading ? '...' : isAdded ? '✓ In SR' : '+ Add SR'}
    </button>
  );
};

export default CustomSpacedRepetitionButton;