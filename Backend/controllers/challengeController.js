const Challenge = require('../models/Challenge');
const { analyzeChallengeAnswer } = require('../services/geminiService');

// Create new challenge
const createChallenge = async (req, res) => {
  try {
    const { title, description, duration } = req.body;
    const creator = req.user._id;
    const now = new Date();

    const challenge = new Challenge({
      title,
      description,
      creator,
      duration: duration || 1, // Default 1 minute for testing
      startTime: now
    });

    await challenge.save();
    await challenge.populate('creator', 'name email');

    // Calculate time remaining for immediate response
    const timeRemaining = Math.max(0, challenge.endTime - now);

    // Emit to all connected users with timer info
    const io = req.app.get('io');
    io.emit('newChallenge', {
      ...challenge.toObject(),
      timeRemaining: Math.floor(timeRemaining / 1000), // in seconds
      isExpired: timeRemaining <= 0
    });

    res.status(201).json({
      ...challenge.toObject(),
      timeRemaining: Math.floor(timeRemaining / 1000),
      isExpired: timeRemaining <= 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get active challenges
const getActiveChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({
      status: 'active',
      endTime: { $gt: new Date() }
    })
    .populate('creator', 'name email')
    .populate('participants.user', 'name email')
    .sort({ createdAt: -1 });

    // Update submission status for expired challenges
    for (let challenge of challenges) {
      await challenge.checkAndCloseSubmissions();
    }

    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Join challenge
const joinChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user._id;

    const challenge = await Challenge.findById(challengeId);
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Check if challenge is still active
    if (new Date() > challenge.endTime) {
      return res.status(400).json({ error: 'Challenge has ended' });
    }

    // Check if user already joined
    const existingParticipant = challenge.participants.find(
      p => p.user.toString() === userId.toString()
    );

    if (existingParticipant) {
      return res.status(400).json({ error: 'Already joined this challenge' });
    }

    challenge.participants.push({
      user: userId,
      joinedAt: new Date()
    });

    await challenge.save();
    await challenge.populate('participants.user', 'name email');

    // Emit to challenge room
    const io = req.app.get('io');
    io.to(`challenge_${challengeId}`).emit('userJoined', {
      challengeId,
      user: req.user,
      participantCount: challenge.participants.length
    });

    res.json({ message: 'Successfully joined challenge', challenge });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit answer
const submitAnswer = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { answer } = req.body;
    const userId = req.user._id;

    const challenge = await Challenge.findById(challengeId);
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Check if submissions are still open
    if (!challenge.isSubmissionOpen || new Date() > challenge.endTime) {
      return res.status(400).json({ error: 'Submission time has ended' });
    }

    // Find participant
    const participantIndex = challenge.participants.findIndex(
      p => p.user.toString() === userId.toString()
    );

    if (participantIndex === -1) {
      return res.status(400).json({ error: 'You must join the challenge first' });
    }

    // Update participant's answer
    challenge.participants[participantIndex].answer = answer;
    challenge.participants[participantIndex].submittedAt = new Date();

    await challenge.save();

    // Start AI analysis in background
    analyzeAnswerAsync(challengeId, userId, answer, challenge.title, challenge.description);

    res.json({ message: 'Answer submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get challenge details with timer
const getChallengeDetails = async (req, res) => {
  try {
    const { challengeId } = req.params;
    
    const challenge = await Challenge.findById(challengeId)
      .populate('creator', 'name email')
      .populate('participants.user', 'name email');

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Update submission status
    await challenge.checkAndCloseSubmissions();

    const now = new Date();
    const timeRemaining = Math.max(0, challenge.endTime - now);

    res.json({
      ...challenge.toObject(),
      timeRemaining: Math.floor(timeRemaining / 1000), // in seconds
      isExpired: timeRemaining <= 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get challenge results with AI analysis
const getChallengeResults = async (req, res) => {
  try {
    const { challengeId } = req.params;
    
    const challenge = await Challenge.findById(challengeId)
      .populate('creator', 'name email')
      .populate('participants.user', 'name email');

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Allow results viewing if challenge is completed OR time has expired
    const now = new Date();
    if (challenge.status !== 'completed' && now <= challenge.endTime) {
      return res.status(400).json({ error: 'Challenge is still active' });
    }
    
    // Auto-complete challenge if time expired
    if (now > challenge.endTime && challenge.status === 'active') {
      challenge.status = 'completed';
      challenge.isSubmissionOpen = false;
      await challenge.save();
    }

    // Filter participants who submitted answers
    const submittedAnswers = challenge.participants.filter(p => p.answer && p.submittedAt);

    res.json({
      challenge: {
        title: challenge.title,
        description: challenge.description,
        creator: challenge.creator,
        duration: challenge.duration,
        endTime: challenge.endTime
      },
      results: submittedAnswers.map(p => ({
        user: p.user,
        answer: p.answer,
        submittedAt: p.submittedAt,
        aiAnalysis: p.aiAnalysis
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Background AI analysis function
const analyzeAnswerAsync = async (challengeId, userId, answer, challengeTitle, challengeDescription) => {
  try {
    const analysis = await analyzeChallengeAnswer(answer, challengeTitle, challengeDescription);
    
    // Generate score out of 10 based on analysis
    let score = 5; // Default score
    if (analysis.feedback) {
      // Simple scoring logic based on feedback keywords
      const positiveWords = ['good', 'correct', 'efficient', 'optimal', 'excellent', 'perfect'];
      const negativeWords = ['wrong', 'incorrect', 'inefficient', 'error', 'bug', 'issue'];
      
      const feedback = analysis.feedback.toLowerCase();
      const positiveCount = positiveWords.filter(word => feedback.includes(word)).length;
      const negativeCount = negativeWords.filter(word => feedback.includes(word)).length;
      
      score = Math.max(1, Math.min(10, 5 + positiveCount * 2 - negativeCount * 1.5));
    }
    
    await Challenge.updateOne(
      { 
        _id: challengeId,
        'participants.user': userId 
      },
      {
        $set: {
          'participants.$.aiAnalysis': {
            ...analysis,
            score: Math.round(score),
            analyzedAt: new Date()
          }
        }
      }
    );

    // Emit analysis complete event
    const io = require('../server').io;
    if (io) {
      io.to(`challenge_${challengeId}`).emit('analysisComplete', {
        challengeId,
        userId,
        analysis: { ...analysis, score: Math.round(score) }
      });
    }
  } catch (error) {
    console.error('Error in AI analysis:', error);
    // Set default analysis if AI fails
    await Challenge.updateOne(
      { 
        _id: challengeId,
        'participants.user': userId 
      },
      {
        $set: {
          'participants.$.aiAnalysis': {
            score: 5,
            feedback: 'Code submitted successfully. Analysis pending.',
            strengths: ['Code submission completed'],
            improvements: ['Detailed analysis will be available soon'],
            analyzedAt: new Date()
          }
        }
      }
    );
  }
};

module.exports = {
  createChallenge,
  getActiveChallenges,
  joinChallenge,
  submitAnswer,
  getChallengeDetails,
  getChallengeResults
};