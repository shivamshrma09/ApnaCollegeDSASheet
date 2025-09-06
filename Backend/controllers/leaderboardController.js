const User = require('../models/User');

// Get global leaderboard
const getGlobalLeaderboard = async (req, res) => {
  try {
    const { sheetType = 'apnaCollege' } = req.query;
    console.log(`Fetching leaderboard for sheet: ${sheetType}`);
    
    // Get all users with their progress for the specified sheet
    const users = await User.find({}, 'name email sheetProgress createdAt').lean();
    console.log(`Found ${users.length} total users`);
    
    const leaderboard = users
      .map(user => {
        const sheetData = user.sheetProgress?.get?.(sheetType) || user.sheetProgress?.[sheetType] || {};
        const completedCount = sheetData.completedProblems?.length || 0;
        
        return {
          _id: user._id,
          userId: user._id, // Add userId alias
          name: user.name || 'Anonymous User',
          email: user.email,
          completedProblems: completedCount,
          totalSolved: completedCount, // Add alias for frontend compatibility
          problemsSolved: completedCount, // Add another alias
          streak: sheetData.streak || 0,
          lastSolved: sheetData.lastSolved || null,
          joinedAt: user.createdAt || new Date()
        };
      })
      .filter(user => user.completedProblems >= 0) // Show all users, even with 0 progress
      .sort((a, b) => {
        // Sort by completed problems (descending), then by streak (descending)
        if (b.completedProblems !== a.completedProblems) {
          return b.completedProblems - a.completedProblems;
        }
        return b.streak - a.streak;
      })
      .slice(0, 10); // Top 10 users for leaderboard
    
    console.log(`Returning ${leaderboard.length} users in leaderboard`);
    console.log('Top user:', leaderboard[0]);
    
    res.json({ leaderboard }); // Wrap in object for frontend compatibility
  } catch (error) {
    console.error('Error fetching global leaderboard:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user rank
const getUserRank = async (req, res) => {
  try {
    const { userId } = req.params;
    const { sheetType = 'apnaCollege' } = req.query;
    console.log(`Fetching rank for user: ${userId}, sheet: ${sheetType}`);
    
    // Get all users with their progress for ranking
    const users = await User.find({}, 'name email sheetProgress').lean();
    
    const leaderboard = users
      .map(user => {
        const sheetData = user.sheetProgress?.get?.(sheetType) || user.sheetProgress?.[sheetType] || {};
        const completedCount = sheetData.completedProblems?.length || 0;
        
        return {
          _id: user._id.toString(),
          completedProblems: completedCount,
          problemsSolved: completedCount, // Add alias
          streak: sheetData.streak || 0
        };
      })
      .sort((a, b) => {
        if (b.completedProblems !== a.completedProblems) {
          return b.completedProblems - a.completedProblems;
        }
        return b.streak - a.streak;
      });
    
    // Find user's rank
    const userRank = leaderboard.findIndex(user => user._id === userId) + 1;
    const userStats = leaderboard.find(user => user._id === userId);
    const totalUsersWithProgress = leaderboard.filter(u => u.completedProblems > 0).length;
    
    console.log(`User rank: ${userRank}, Total users with progress: ${totalUsersWithProgress}`);
    
    res.json({
      rank: userRank > 0 ? userRank : null,
      totalUsers: Math.max(totalUsersWithProgress, 1), // At least 1 to avoid division by zero
      completedProblems: userStats?.completedProblems || 0,
      problemsSolved: userStats?.completedProblems || 0, // Add alias
      streak: userStats?.streak || 0
    });
  } catch (error) {
    console.error('Error fetching user rank:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getGlobalLeaderboard,
  getUserRank
};