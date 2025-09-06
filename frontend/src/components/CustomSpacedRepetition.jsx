import React, { useState } from 'react';
import { useCustomSpacedRepetition } from '../hooks/useCustomSpacedRepetition';

const CustomSpacedRepetition = () => {
  const { problems, loading, error, updateProgress, removeProblem } = useCustomSpacedRepetition();
  const [selectedStage, setSelectedStage] = useState('all');

  const stages = {
    'TODAY': { name: 'Today', color: 'bg-red-100 text-red-800' },
    'TOMORROW': { name: 'Tomorrow', color: 'bg-orange-100 text-orange-800' },
    'DAY3': { name: 'Day 3', color: 'bg-yellow-100 text-yellow-800' },
    'WEEK1': { name: 'Week 1', color: 'bg-blue-100 text-blue-800' },
    'WEEK2': { name: 'Week 2', color: 'bg-indigo-100 text-indigo-800' },
    'MONTH1': { name: 'Month 1', color: 'bg-purple-100 text-purple-800' },
    'COMPLETED': { name: 'Completed', color: 'bg-green-100 text-green-800' }
  };

  const filteredProblems = selectedStage === 'all' 
    ? problems 
    : problems.filter(p => p.stage === selectedStage);

  const dueProblems = problems.filter(p => 
    p.stage !== 'COMPLETED' && new Date(p.nextReviewDate) <= new Date()
  );

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="text-red-600 p-4">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Custom Spaced Repetition</h1>
        <p className="text-gray-600">7-stage system for optimal DSA problem retention</p>
      </div>

      {dueProblems.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-yellow-800 mb-2">
            🔔 {dueProblems.length} Problems Due for Review
          </h2>
          <p className="text-yellow-700 text-sm">
            These problems are ready for your next review session.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedStage('all')}
          className={`px-4 py-2 rounded-lg ${selectedStage === 'all' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All ({problems.length})
        </button>
        {Object.entries(stages).map(([stage, config]) => {
          const count = problems.filter(p => p.stage === stage).length;
          return (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              className={`px-4 py-2 rounded-lg ${selectedStage === stage 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {config.name} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid gap-4">
        {filteredProblems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {selectedStage === 'all' 
              ? 'No problems in spaced repetition yet. Add problems from the problem list!'
              : `No problems in ${stages[selectedStage]?.name} stage.`}
          </div>
        ) : (
          filteredProblems.map((problem) => (
            <div key={problem._id} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{problem.problemId.title}</h3>
                  <p className="text-gray-600 text-sm">{problem.problemId.topic}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${stages[problem.stage]?.color}`}>
                    {stages[problem.stage]?.name}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    problem.problemId.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    problem.problemId.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {problem.problemId.difficulty}
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-3">
                <div>Added: {new Date(problem.dateAdded).toLocaleDateString()}</div>
                <div>Next Review: {new Date(problem.nextReviewDate).toLocaleDateString()}</div>
                <div>Reviews: {problem.reviewCount}</div>
              </div>

              {problem.stage !== 'COMPLETED' && new Date(problem.nextReviewDate) <= new Date() && (
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => updateProgress(problem.problemId._id, true)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    ✓ Understood
                  </button>
                  <button
                    onClick={() => updateProgress(problem.problemId._id, false)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    ✗ Need Review
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center">
                <a
                  href={problem.problemId.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View Problem →
                </a>
                <button
                  onClick={() => removeProblem(problem.problemId._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomSpacedRepetition;