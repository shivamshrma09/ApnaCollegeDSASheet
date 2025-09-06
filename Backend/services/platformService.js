const axios = require('axios');
const UserProfile = require('../models/UserProfile');

class PlatformService {
  async fetchLeetCodeData(username) {
    try {
      const query = `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              ranking
              userAvatar
              realName
              aboutMe
              school
              websites
              countryName
              company
              jobTitle
              skillTags
              postViewCount
              postViewCountDiff
              reputation
              reputationDiff
            }
            submitStats {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
              totalSubmissionNum {
                difficulty
                count
                submissions
              }
            }
            badges {
              id
              displayName
              icon
              creationDate
            }
          }
          userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
            totalParticipants
            topPercentage
          }
        }
      `;

      const response = await axios.post('https://leetcode.com/graphql/', {
        query,
        variables: { username }
      });

      const data = response.data.data;
      if (!data.matchedUser) return null;

      const totalSolved = data.matchedUser.submitStats.acSubmissionNum
        .find(item => item.difficulty === 'All')?.count || 0;

      return {
        username,
        rating: data.userContestRanking?.rating || 0,
        problemsSolved: totalSolved,
        contestRating: data.userContestRanking?.rating || 0,
        globalRanking: data.userContestRanking?.globalRanking || 0,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error(`Error fetching LeetCode data for ${username}:`, error.message);
      return null;
    }
  }

  async fetchCodeforcesData(username) {
    try {
      const [userResponse, ratingResponse] = await Promise.all([
        axios.get(`https://codeforces.com/api/user.info?handles=${username}`),
        axios.get(`https://codeforces.com/api/user.rating?handle=${username}`)
      ]);

      const user = userResponse.data.result[0];
      const ratings = ratingResponse.data.result;

      return {
        username,
        rating: user.rating || 0,
        maxRating: user.maxRating || 0,
        rank: user.rank || 'unrated',
        maxRank: user.maxRank || 'unrated',
        contestsParticipated: ratings.length,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error(`Error fetching Codeforces data for ${username}:`, error.message);
      return null;
    }
  }

  async fetchGitHubData(username) {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`);
      const user = response.data;

      return {
        username,
        repositories: user.public_repos || 0,
        followers: user.followers || 0,
        contributions: 0, // GitHub API doesn't provide this directly
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error(`Error fetching GitHub data for ${username}:`, error.message);
      return null;
    }
  }

  async updateUserProfile(userId, platformData) {
    try {
      const updateData = {
        userId,
        updatedAt: new Date()
      };

      // Update platform data
      Object.keys(platformData).forEach(platform => {
        if (platformData[platform]) {
          updateData[`platforms.${platform}`] = platformData[platform];
        }
      });

      // Calculate overall rating
      const ratings = [];
      if (platformData.leetcode?.rating) ratings.push(platformData.leetcode.rating);
      if (platformData.codeforces?.rating) ratings.push(platformData.codeforces.rating);
      
      updateData.overallRating = ratings.length > 0 
        ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length)
        : 0;

      return await UserProfile.findOneAndUpdate(
        { userId },
        updateData,
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async refreshUserData(userId, usernames) {
    try {
      const platformData = {};

      if (usernames.leetcode) {
        platformData.leetcode = await this.fetchLeetCodeData(usernames.leetcode);
      }
      
      if (usernames.codeforces) {
        platformData.codeforces = await this.fetchCodeforcesData(usernames.codeforces);
      }
      
      if (usernames.github) {
        platformData.github = await this.fetchGitHubData(usernames.github);
      }

      return await this.updateUserProfile(userId, platformData);
    } catch (error) {
      console.error('Error refreshing user data:', error);
      throw error;
    }
  }
}

module.exports = new PlatformService();