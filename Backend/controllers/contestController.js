const contestService = require('../services/contestService');
const platformService = require('../services/platformService');
const Contest = require('../models/Contest');

const getUpcomingContests = async (req, res) => {
  try {
    const { limit = 20, platform } = req.query;
    
    let query = { 
      status: 'upcoming',
      startTime: { $gt: new Date() },
      endTime: { $gt: new Date() }
    };
    
    if (platform && platform !== 'all') {
      query.platform = platform;
    }
    
    let contests = await Contest.find(query)
      .sort({ startTime: 1 })
      .limit(parseInt(limit));
    
    // If no contests found, try refreshing
    if (contests.length === 0) {
      await contestService.updateContests();
      contests = await Contest.find(query)
        .sort({ startTime: 1 })
        .limit(parseInt(limit));
    }
    
    res.json(contests);
  } catch (error) {
    console.error('Error fetching upcoming contests:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getRunningContests = async (req, res) => {
  try {
    await contestService.updateContestStatus();
    const contests = await contestService.getRunningContests();
    res.json(contests);
  } catch (error) {
    console.error('Error fetching running contests:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getPastContests = async (req, res) => {
  try {
    const { limit = 20, platform } = req.query;
    
    let query = { 
      status: 'finished',
      endTime: { $lt: new Date() }
    };
    
    if (platform && platform !== 'all') {
      query.platform = platform;
    }
    
    const contests = await Contest.find(query)
      .sort({ startTime: -1 })
      .limit(parseInt(limit));
    
    res.json(contests);
  } catch (error) {
    console.error('Error fetching past contests:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const refreshContests = async (req, res) => {
  try {
    const contests = await contestService.updateContests();
    res.json({ 
      message: 'Contests updated successfully', 
      count: contests.length 
    });
  } catch (error) {
    console.error('Error refreshing contests:', error);
    res.status(500).json({ error: 'Failed to refresh contests' });
  }
};

const updateUserPlatforms = async (req, res) => {
  try {
    const { userId } = req.params;
    const { leetcode, codeforces, github } = req.body;
    
    const usernames = {};
    if (leetcode) usernames.leetcode = leetcode;
    if (codeforces) usernames.codeforces = codeforces;
    if (github) usernames.github = github;
    
    const profile = await platformService.refreshUserData(userId, usernames);
    
    res.json({
      message: 'Platform data updated successfully',
      profile
    });
  } catch (error) {
    console.error('Error updating user platforms:', error);
    res.status(500).json({ error: 'Failed to update platform data' });
  }
};

module.exports = {
  getUpcomingContests,
  getRunningContests,
  getPastContests,
  refreshContests,
  updateUserPlatforms
};