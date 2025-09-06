const User = require('../models/User');
const UserAnalytics = require('../models/UserAnalytics');
const { updateGoalProgress } = require('./goalsController');
const { sanitizeForLog } = require('../utils/sanitizer');

const initializeSheetData = async (user, sheetType) => {
  if (!user.sheetProgress) {
    user.sheetProgress = {};
  }
  if (!user.sheetProgress[sheetType]) {
    user.sheetProgress[sheetType] = {
      completedProblems: [],
      starredProblems: [],
      notes: {},
      playlists: [],
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      streak: 0,
      forgettingCurve: {
        today: [], day1: [], day3: [], week1: [], week2: [], month1: [], month3: []
      }
    };
    user.markModified('sheetProgress');
    await user.save();
    console.log('⚙️ Initialized sheetType:', sheetType);
  }
};

const getUserProgress = async (req, res) => {
  try {
    console.log('📈 Backend: Getting progress for userId:', sanitizeForLog(req.params.userId), 'sheetType:', sanitizeForLog(req.query.sheetType));
    
    const user = await User.findById(req.params.userId);
    const { sheetType = req.body.sheetType || 'apnaCollege' } = req.query;
    
    if (!user) {
      console.log('❌ User not found:', req.params.userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('👤 User found, sheetProgress:', user.sheetProgress);

    await initializeSheetData(user, sheetType);

    const sheetData = user.sheetProgress[sheetType];
    console.log('📁 Sheet data for', sheetType, ':', sheetData);
    
    const response = {
      completedProblems: sheetData.completedProblems || [],
      starredProblems: sheetData.starredProblems || [],
      notes: sheetData.notes || {},
      playlists: sheetData.playlists || []
    };
    
    console.log('📤 Sending response for', sheetType, ':', response);
    console.log('⭐ Starred problems being sent:', response.starredProblems);
    res.json(response);
  } catch (error) {
    console.error('❌ Backend error getting progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const toggleComplete = async (req, res) => {
  try {
    console.log(`🔄 Backend: Toggle complete - User: ${req.params.userId}, Problem: ${req.params.problemId}, Sheet: ${req.query.sheetType}`);
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      console.log(`❌ User not found: ${req.params.userId}`);
      return res.status(404).json({ error: 'User not found' });
    }
    
    const problemId = parseInt(req.params.problemId);
    const { sheetType = 'apnaCollege', difficulty } = req.query;
    
    console.log(`📊 Processing for sheet: ${sheetType}`);
    
    await initializeSheetData(user, sheetType);
    
    const sheetData = user.sheetProgress[sheetType];
    if (!sheetData.completedProblems) sheetData.completedProblems = [];
    
    const wasCompleted = sheetData.completedProblems.includes(problemId);
    console.log(`🔍 Problem ${problemId} was ${wasCompleted ? 'completed' : 'not completed'} in ${sheetType}`);
    
    if (!wasCompleted) {
      sheetData.completedProblems.push(problemId);
      sheetData.totalSolved = (sheetData.totalSolved || 0) + 1;
      
      const problemDifficulty = difficulty || 'Easy';
      if (problemDifficulty === 'Easy') sheetData.easySolved = (sheetData.easySolved || 0) + 1;
      else if (problemDifficulty === 'Medium') sheetData.mediumSolved = (sheetData.mediumSolved || 0) + 1;
      else if (problemDifficulty === 'Hard') sheetData.hardSolved = (sheetData.hardSolved || 0) + 1;
      
      console.log(`✅ Added problem ${problemId} to ${sheetType} - Total: ${sheetData.totalSolved}`);
      
      await updateGoalProgress(req.params.userId, 1);
      await trackProblemAttempt(req.params.userId, problemId, problemDifficulty, true);
      
      if (!sheetData.forgettingCurve) {
        sheetData.forgettingCurve = {
          today: [], day1: [], day3: [], week1: [], week2: [], month1: [], month3: []
        };
      }
      
      const allLists = ['today', 'day1', 'day3', 'week1', 'week2', 'month1', 'month3'];
      const existsInFC = allLists.some(list => 
        sheetData.forgettingCurve[list] && sheetData.forgettingCurve[list].some(item => item.problemId === problemId)
      );
      
      if (!existsInFC) {
        sheetData.forgettingCurve.today.push({ 
          problemId, 
          addedDate: new Date(),
          completedDate: new Date()
        });
      }
      
      const today = new Date().toDateString();
      const lastSolved = sheetData.lastSolvedDate ? new Date(sheetData.lastSolvedDate).toDateString() : null;
      
      if (lastSolved === today) {
        // Same day, don't change streak
      } else if (lastSolved === new Date(Date.now() - 86400000).toDateString()) {
        sheetData.streak = (sheetData.streak || 0) + 1;
      } else {
        sheetData.streak = 1;
      }
      
      sheetData.lastSolvedDate = new Date();
    } else {
      sheetData.completedProblems = sheetData.completedProblems.filter(id => id !== problemId);
      sheetData.totalSolved = Math.max(0, (sheetData.totalSolved || 0) - 1);
      
      const problemDifficulty = difficulty || 'Easy';
      if (problemDifficulty === 'Easy') sheetData.easySolved = Math.max(0, (sheetData.easySolved || 0) - 1);
      else if (problemDifficulty === 'Medium') sheetData.mediumSolved = Math.max(0, (sheetData.mediumSolved || 0) - 1);
      else if (problemDifficulty === 'Hard') sheetData.hardSolved = Math.max(0, (sheetData.hardSolved || 0) - 1);
      
      console.log(`❌ Removed problem ${problemId} from ${sheetType} - Total: ${sheetData.totalSolved}`);
      
      if (sheetData.forgettingCurve) {
        const allLists = ['today', 'day1', 'day3', 'week1', 'week2', 'month1', 'month3'];
        allLists.forEach(list => {
          if (sheetData.forgettingCurve[list]) {
            sheetData.forgettingCurve[list] = sheetData.forgettingCurve[list].filter(item => item.problemId !== problemId);
          }
        });
      }
    }
    
    user.sheetProgress[sheetType] = sheetData;
    user.markModified('sheetProgress');
    await user.save();
    console.log(`💾 Saved to database - ${sheetType} completed problems: ${sheetData.completedProblems.length}`);
    
    res.json({ 
      completedProblems: sheetData.completedProblems,
      totalSolved: sheetData.totalSolved,
      easySolved: sheetData.easySolved,
      mediumSolved: sheetData.mediumSolved,
      hardSolved: sheetData.hardSolved,
      streak: sheetData.streak
    });
  } catch (error) {
    console.error(`❌ Error in toggleComplete:`, error);
    res.status(500).json({ error: 'Server error' });
  }
};

const toggleStar = async (req, res) => {
  try {
    console.log('⭐ Backend: Toggling star for userId:', req.params.userId, 'problemId:', req.params.problemId, 'sheetType:', req.query.sheetType);
    
    const user = await User.findById(req.params.userId);
    const problemId = parseInt(req.params.problemId);
    const { sheetType = req.body.sheetType || 'apnaCollege' } = req.query;
    
    console.log('🔧 Using sheetType for star:', sheetType);
    
    await initializeSheetData(user, sheetType);
    
    const sheetData = user.sheetProgress[sheetType];
    if (!sheetData.starredProblems) sheetData.starredProblems = [];
    
    console.log('📁 Current starred problems for', sheetType, ':', sheetData.starredProblems);
    
    if (!sheetData.starredProblems.includes(problemId)) {
      sheetData.starredProblems.push(problemId);
      console.log('⭐ Added to starred:', problemId);
    } else {
      sheetData.starredProblems = sheetData.starredProblems.filter(id => id !== problemId);
      console.log('❌ Removed from starred:', problemId);
    }
    
    user.sheetProgress[sheetType] = sheetData;
    user.markModified('sheetProgress');
    await user.save();
    console.log('✅ Star saved, returning:', sheetData.starredProblems);
    res.json({ starredProblems: sheetData.starredProblems });
  } catch (error) {
    console.error('❌ Backend error toggling star:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const saveNote = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const problemId = req.params.problemId;
    const { note } = req.body;
    const { sheetType = req.body.sheetType || 'apnaCollege' } = req.query;
    
    await initializeSheetData(user, sheetType);
    
    const sheetData = user.sheetProgress[sheetType];
    if (!sheetData.notes) sheetData.notes = {};
    
    sheetData.notes[problemId] = note;
    user.sheetProgress[sheetType] = sheetData;
    user.markModified('sheetProgress');
    await user.save();
    
    res.json({ notes: sheetData.notes });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteNote = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const problemId = req.params.problemId;
    const { sheetType = req.body.sheetType || 'apnaCollege' } = req.query;
    
    await initializeSheetData(user, sheetType);
    
    const sheetData = user.sheetProgress[sheetType];
    if (!sheetData.notes) sheetData.notes = {};
    
    delete sheetData.notes[problemId];
    user.sheetProgress[sheetType] = sheetData;
    user.markModified('sheetProgress');
    await user.save();
    
    res.json({ notes: sheetData.notes });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createPlaylist = async (req, res) => {
  try {
    const userId = req.params.userId || req.body.userId;
    const { sheetType = req.body.sheetType || 'apnaCollege' } = req.query;
    const { name, description } = req.body;
    
    console.log('🎵 Backend: Creating playlist for userId:', userId, 'sheetType:', sheetType);
    console.log('📝 Request body:', req.body);
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    await initializeSheetData(user, sheetType);
    
    const sheetData = user.sheetProgress[sheetType];
    if (!sheetData.playlists) sheetData.playlists = [];
    
    const newPlaylist = {
      id: Date.now().toString(),
      name: name || 'Untitled Playlist',
      description: description || '',
      problems: [],
      createdAt: new Date()
    };
    
    sheetData.playlists.push(newPlaylist);
    user.sheetProgress[sheetType] = sheetData;
    user.markModified('sheetProgress');
    await user.save();
    
    console.log('✅ Playlist created successfully');
    res.json({ playlists: sheetData.playlists });
  } catch (error) {
    console.error('❌ Backend error creating playlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updatePlaylist = async (req, res) => {
  try {
    const userId = req.params.userId || req.body.userId;
    const { sheetType = req.body.sheetType || 'apnaCollege' } = req.query;
    const { name, description } = req.body;
    const playlistId = req.params.playlistId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await initializeSheetData(user, sheetType);
    
    const sheetData = user.sheetProgress[sheetType];
    if (!sheetData.playlists) sheetData.playlists = [];
    
    const playlist = sheetData.playlists.find(p => p.id === playlistId);
    if (playlist) {
      playlist.name = name;
      playlist.description = description || '';
      user.sheetProgress[sheetType] = sheetData;
      user.markModified('sheetProgress');
      await user.save();
    }
    
    res.json({ playlists: sheetData.playlists });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const userId = req.params.userId || req.body.userId;
    const { sheetType = req.body.sheetType || 'apnaCollege' } = req.query;
    const playlistId = req.params.playlistId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await initializeSheetData(user, sheetType);
    
    const sheetData = user.sheetProgress[sheetType];
    if (!sheetData.playlists) sheetData.playlists = [];
    
    sheetData.playlists = sheetData.playlists.filter(p => p.id !== playlistId);
    user.sheetProgress[sheetType] = sheetData;
    user.markModified('sheetProgress');
    await user.save();
    
    res.json({ playlists: sheetData.playlists });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const addToPlaylist = async (req, res) => {
  try {
    const userId = req.params.userId || req.body.userId;
    const { sheetType = req.body.sheetType || 'apnaCollege' } = req.query;
    const playlistId = req.params.playlistId;
    const problemId = parseInt(req.params.problemId);
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await initializeSheetData(user, sheetType);
    
    const sheetData = user.sheetProgress[sheetType];
    if (!sheetData.playlists) sheetData.playlists = [];
    
    const playlist = sheetData.playlists.find(p => p.id === playlistId);
    if (playlist) {
      if (!playlist.problems.includes(problemId)) {
        playlist.problems.push(problemId);
        user.sheetProgress[sheetType] = sheetData;
        user.markModified('sheetProgress');
        await user.save();
      }
    }
    
    res.json({ playlists: sheetData.playlists });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const removeFromPlaylist = async (req, res) => {
  try {
    const userId = req.params.userId || req.body.userId;
    const { sheetType = req.body.sheetType || 'apnaCollege' } = req.query;
    const playlistId = req.params.playlistId;
    const problemId = parseInt(req.params.problemId);
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await initializeSheetData(user, sheetType);
    
    const sheetData = user.sheetProgress[sheetType];
    if (!sheetData.playlists) sheetData.playlists = [];
    
    const playlist = sheetData.playlists.find(p => p.id === playlistId);
    if (playlist) {
      playlist.problems = playlist.problems.filter(id => id !== problemId);
      user.sheetProgress[sheetType] = sheetData;
      user.markModified('sheetProgress');
      await user.save();
    }
    
    res.json({ playlists: sheetData.playlists });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const trackProblemAttempt = async (userId, problemId, difficulty, solved, timeSpent = 0) => {
  try {
    let analytics = await UserAnalytics.findOne({ userId });
    
    if (!analytics) {
      analytics = new UserAnalytics({ 
        userId,
        problemAttempts: [],
        weakAreas: [],
        studySession: [],
        interviewPrep: {},
        performance: {
          totalSolved: 0,
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          avgSolveTime: 0,
          accuracy: 0,
          streak: 0
        }
      });
    }
    
    analytics.problemAttempts.push({
      problemId,
      attempts: 1,
      timeSpent,
      solved,
      difficulty,
      topic: 'General',
      companies: '',
      timestamp: new Date()
    });
    
    if (solved) {
      analytics.performance.totalSolved += 1;
      if (difficulty === 'Easy') analytics.performance.easySolved += 1;
      else if (difficulty === 'Medium') analytics.performance.mediumSolved += 1;
      else if (difficulty === 'Hard') analytics.performance.hardSolved += 1;
    }
    
    const totalAttempts = analytics.problemAttempts.length;
    const solvedCount = analytics.problemAttempts.filter(attempt => attempt.solved).length;
    analytics.performance.accuracy = (solvedCount / totalAttempts) * 100;
    
    analytics.performance.lastActive = new Date();
    
    await analytics.save();
    console.log(`📊 Analytics updated for user ${sanitizeForLog(userId)}`);
  } catch (error) {
    console.error('Error tracking problem attempt:', error);
  }
};

module.exports = {
  getUserProgress,
  toggleComplete,
  toggleStar,
  saveNote,
  deleteNote,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addToPlaylist,
  removeFromPlaylist,
  trackProblemAttempt
};