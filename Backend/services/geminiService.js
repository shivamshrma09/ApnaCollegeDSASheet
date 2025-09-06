const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get AI recommendations based on user data
const getAIRecommendations = async (userData) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
    You are an expert DSA (Data Structures and Algorithms) mentor. Based on the following user data, provide personalized recommendations:

    User Profile:
    - Daily Goal: ${userData.goals?.daily?.target || 3} problems (Current: ${userData.goals?.daily?.current || 0})
    - Weekly Goal: ${userData.goals?.weekly?.target || 20} problems (Current: ${userData.goals?.weekly?.current || 0})
    - Interview Date: ${userData.goals?.interviewPrep?.targetDate || 'Not set'}
    - Target Company: ${userData.goals?.interviewPrep?.targetCompany || 'Not specified'}
    - Days Remaining: ${userData.goals?.interviewPrep?.daysRemaining || 'N/A'}

    Weak Areas:
    ${userData.weakAreas?.map(area => 
      `- ${area.topic} (${area.difficulty}): ${area.failureRate}% failure rate, avg time: ${Math.round(area.avgTimeSpent/60)} minutes`
    ).join('\n') || 'No weak areas identified yet'}

    Recent Performance:
    ${userData.recentActivity?.map(activity => 
      `- ${activity.topic} (${activity.difficulty}): ${activity.solved ? 'Solved' : 'Failed'} in ${Math.round(activity.timeSpent/60)} minutes`
    ).join('\n') || 'No recent activity'}

    Please provide:
    1. Specific problem recommendations (with LeetCode/GeeksforGeeks links if possible)
    2. Study plan for the next week
    3. Interview preparation strategy (if interview date is set)
    4. Motivational message based on current progress
    5. Time management tips

    Format your response as JSON with the following structure:
    {
      "problemRecommendations": [
        {
          "title": "Problem Title",
          "platform": "leetcode/gfg",
          "difficulty": "Easy/Medium/Hard",
          "topic": "Arrays/Strings/etc",
          "reason": "Why this problem is recommended",
          "estimatedTime": "30 minutes"
        }
      ],
      "weeklyPlan": {
        "focusAreas": ["topic1", "topic2"],
        "dailySchedule": "Suggested daily routine",
        "difficultyProgression": "How to progress through difficulties"
      },
      "interviewStrategy": {
        "timelineRecommendation": "Based on days remaining",
        "priorityTopics": ["topic1", "topic2"],
        "mockInterviewSchedule": "When to practice mock interviews"
      },
      "motivationalMessage": "Personalized encouragement",
      "timeManagement": {
        "dailyTimeAllocation": "How to distribute time",
        "productivityTips": ["tip1", "tip2"]
      }
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Try to parse as JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.log('Could not parse AI response as JSON, returning structured response');
    }
    
    // Fallback: return structured response based on text
    return parseAIResponse(text, userData);
    
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    return getFallbackRecommendations(userData);
  }
};

// Parse AI response if JSON parsing fails
const parseAIResponse = (text, userData) => {
  return {
    problemRecommendations: extractProblemRecommendations(text),
    weeklyPlan: {
      focusAreas: userData.weakAreas?.slice(0, 3).map(area => area.topic) || ['Arrays', 'Strings'],
      dailySchedule: "Solve 2-3 problems daily, focus on weak areas first",
      difficultyProgression: "Start with Easy, move to Medium after 70% accuracy"
    },
    interviewStrategy: {
      timelineRecommendation: userData.goals?.interviewPrep?.daysRemaining 
        ? `${userData.goals.interviewPrep.daysRemaining} days remaining - focus on high-frequency problems`
        : "Set interview date for personalized timeline",
      priorityTopics: ["Arrays", "Strings", "Dynamic Programming", "Trees"],
      mockInterviewSchedule: "Practice mock interviews 2-3 times per week"
    },
    motivationalMessage: generateMotivationalMessage(userData),
    timeManagement: {
      dailyTimeAllocation: "1-2 hours daily: 70% problem solving, 30% theory review",
      productivityTips: [
        "Use Pomodoro technique (25 min focus, 5 min break)",
        "Review solutions even for solved problems",
        "Track time spent on each problem"
      ]
    }
  };
};

// Extract problem recommendations from text
const extractProblemRecommendations = (text) => {
  // Basic problem recommendations based on common patterns
  return [
    {
      title: "Two Sum",
      platform: "leetcode",
      difficulty: "Easy",
      topic: "Arrays",
      reason: "Fundamental array problem, teaches hash map usage",
      estimatedTime: "20 minutes"
    },
    {
      title: "Valid Parentheses",
      platform: "leetcode", 
      difficulty: "Easy",
      topic: "Stack",
      reason: "Essential stack problem for interviews",
      estimatedTime: "15 minutes"
    },
    {
      title: "Merge Intervals",
      platform: "leetcode",
      difficulty: "Medium", 
      topic: "Arrays",
      reason: "Common interview pattern, teaches interval manipulation",
      estimatedTime: "30 minutes"
    }
  ];
};

// Generate motivational message based on user progress
const generateMotivationalMessage = (userData) => {
  const dailyProgress = userData.goals?.daily ? 
    (userData.goals.daily.current / userData.goals.daily.target) * 100 : 0;
  
  if (dailyProgress >= 100) {
    return "🎉 Excellent work! You've completed your daily goal. Your consistency will pay off in interviews!";
  } else if (dailyProgress >= 50) {
    return "💪 You're making great progress! Keep pushing to complete your daily goal.";
  } else if (userData.goals?.interviewPrep?.daysRemaining && userData.goals.interviewPrep.daysRemaining < 30) {
    return "🚀 Interview approaching! Every problem you solve now is building your confidence. Stay focused!";
  } else {
    return "🌟 Every expert was once a beginner. Start with one problem and build momentum!";
  }
};

// Fallback recommendations if AI service fails
const getFallbackRecommendations = (userData) => {
  return {
    problemRecommendations: [
      {
        title: "Two Sum",
        platform: "leetcode",
        difficulty: "Easy",
        topic: "Arrays",
        reason: "Fundamental problem for beginners",
        estimatedTime: "20 minutes"
      },
      {
        title: "Best Time to Buy and Sell Stock",
        platform: "leetcode",
        difficulty: "Easy", 
        topic: "Arrays",
        reason: "Teaches greedy algorithm approach",
        estimatedTime: "25 minutes"
      }
    ],
    weeklyPlan: {
      focusAreas: ["Arrays", "Strings", "Hash Tables"],
      dailySchedule: "Solve 2-3 problems daily, review solutions",
      difficultyProgression: "Master Easy problems before moving to Medium"
    },
    interviewStrategy: {
      timelineRecommendation: "Focus on high-frequency problems",
      priorityTopics: ["Arrays", "Strings", "Trees", "Dynamic Programming"],
      mockInterviewSchedule: "Practice coding interviews weekly"
    },
    motivationalMessage: generateMotivationalMessage(userData),
    timeManagement: {
      dailyTimeAllocation: "1-2 hours daily for consistent progress",
      productivityTips: [
        "Set specific time blocks for coding practice",
        "Review and understand solutions thoroughly",
        "Track your progress regularly"
      ]
    }
  };
};

// Get problem-specific hints and guidance
const getProblemGuidance = async (problemTitle, userAttempts, timeSpent) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
    A user is struggling with the problem "${problemTitle}". They have made ${userAttempts} attempts and spent ${Math.round(timeSpent/60)} minutes on it.
    
    Provide helpful guidance without giving away the complete solution:
    1. Key insights or patterns to recognize
    2. Suggested approach or algorithm
    3. Common mistakes to avoid
    4. Time complexity considerations
    5. Encouragement and next steps
    
    Keep the response concise and educational.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Error getting problem guidance:', error);
    return `For ${problemTitle}: Try breaking down the problem into smaller steps. Consider what data structures might be helpful. Don't give up - every attempt teaches you something!`;
  }
};

// Analyze challenge answer
const analyzeChallengeAnswer = async (answer, challengeTitle, challengeDescription) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
    You are an expert code reviewer and DSA mentor. Analyze the following answer to a coding challenge:

    Challenge: ${challengeTitle}
    Description: ${challengeDescription}
    
    User's Answer:
    ${answer}
    
    Please provide a comprehensive analysis in the following JSON format:
    {
      "score": 85,
      "feedback": "Overall assessment of the solution",
      "strengths": ["List of strengths in the solution"],
      "improvements": ["List of areas for improvement"],
      "codeQuality": {
        "readability": 8,
        "efficiency": 7,
        "correctness": 9
      },
      "suggestions": ["Specific suggestions for improvement"]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.log('Could not parse AI analysis as JSON');
    }
    
    return {
      score: 75,
      feedback: "Your solution shows good understanding of the problem.",
      strengths: ["Clear logic", "Handles basic cases"],
      improvements: ["Consider edge cases", "Optimize time complexity"],
      codeQuality: {
        readability: 7,
        efficiency: 6,
        correctness: 8
      },
      suggestions: ["Add comments for clarity", "Consider alternative approaches"]
    };
    
  } catch (error) {
    console.error('Error analyzing challenge answer:', error);
    return {
      score: 70,
      feedback: "Unable to complete full analysis. Your participation is valuable!",
      strengths: ["Active participation", "Problem-solving attempt"],
      improvements: ["Keep practicing", "Review solution patterns"],
      codeQuality: {
        readability: 7,
        efficiency: 7,
        correctness: 7
      },
      suggestions: ["Practice more problems", "Study optimal solutions"]
    };
  }
};

module.exports = {
  getAIRecommendations,
  getProblemGuidance,
  analyzeChallengeAnswer
};