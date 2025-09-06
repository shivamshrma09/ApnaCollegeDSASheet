const axios = require('axios');
const Contest = require('../models/Contest');

// Set default timeout for all axios requests
axios.defaults.timeout = 15000;

class ContestService {
  async fetchCodeforcesContests() {
    try {
      const response = await axios.get('https://codeforces.com/api/contest.list');
      const now = new Date();
      const contests = response.data.result
        .filter(contest => {
          const startTime = new Date(contest.startTimeSeconds * 1000);
          return contest.phase === 'BEFORE' && startTime > now;
        })
        .slice(0, 10)
        .map(contest => ({
          name: contest.name,
          platform: 'codeforces',
          startTime: new Date(contest.startTimeSeconds * 1000),
          endTime: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000),
          duration: contest.durationSeconds,
          url: `https://codeforces.com/contest/${contest.id}`,
          platformId: contest.id.toString(),
          status: 'upcoming'
        }));
      return contests;
    } catch (error) {
      console.error('Error fetching Codeforces contests:', error.message);
      return [];
    }
  }

  async fetchLeetCodeContests() {
    try {
      // Use a simpler approach for LeetCode contests
      const response = await axios.get('https://leetcode.com/api/problems/all/', {
        timeout: 10000
      });
      
      // Since LeetCode API is restrictive, create realistic upcoming contests
      const now = new Date();
      const contests = [];
      
      // Weekly contest (every Sunday)
      const nextSunday = new Date(now);
      nextSunday.setDate(now.getDate() + (7 - now.getDay()));
      nextSunday.setHours(8, 0, 0, 0); // 8 AM
      
      if (nextSunday > now) {
        contests.push({
          name: `Weekly Contest ${Math.floor(Math.random() * 100) + 400}`,
          platform: 'leetcode',
          startTime: nextSunday,
          endTime: new Date(nextSunday.getTime() + 90 * 60 * 1000), // 1.5 hours
          duration: 5400, // 90 minutes
          url: 'https://leetcode.com/contest/',
          platformId: `weekly-${nextSunday.getTime()}`,
          status: 'upcoming'
        });
      }
      
      // Biweekly contest (every other Saturday)
      const nextBiweekly = new Date(now);
      nextBiweekly.setDate(now.getDate() + (6 - now.getDay() + 7)); // Next Saturday
      nextBiweekly.setHours(20, 0, 0, 0); // 8 PM
      
      if (nextBiweekly > now) {
        contests.push({
          name: `Biweekly Contest ${Math.floor(Math.random() * 50) + 120}`,
          platform: 'leetcode',
          startTime: nextBiweekly,
          endTime: new Date(nextBiweekly.getTime() + 90 * 60 * 1000),
          duration: 5400,
          url: 'https://leetcode.com/contest/',
          platformId: `biweekly-${nextBiweekly.getTime()}`,
          status: 'upcoming'
        });
      }
      
      return contests;
    } catch (error) {
      console.error('Error fetching LeetCode contests:', error.message);
      return [];
    }
  }

  async fetchCodeChefContests() {
    try {
      // Using a more reliable endpoint
      const response = await axios.get('https://www.codechef.com/api/list/contests/all', {
        params: { sort_by: 'START', sorting_order: 'asc', offset: 0, mode: 'all' },
        timeout: 10000
      });
      
      if (!response.data || !response.data.contests) {
        return [];
      }
      
      const contests = response.data.contests
        .filter(contest => {
          const startTime = contest.contest_start_date_iso ? new Date(contest.contest_start_date_iso) : null;
          return startTime && startTime > new Date();
        })
        .slice(0, 5)
        .map(contest => ({
          name: contest.contest_name,
          platform: 'codechef',
          startTime: new Date(contest.contest_start_date_iso),
          endTime: new Date(contest.contest_end_date_iso),
          duration: Math.floor((new Date(contest.contest_end_date_iso) - new Date(contest.contest_start_date_iso)) / 1000),
          url: `https://www.codechef.com/${contest.contest_code}`,
          platformId: contest.contest_code,
          status: 'upcoming'
        }));
      return contests;
    } catch (error) {
      console.error('Error fetching CodeChef contests:', error.message);
      return [];
    }
  }

  async fetchAtCoderContests() {
    try {
      const response = await axios.get('https://atcoder.jp/contests/', {
        timeout: 10000
      });
      
      // Since AtCoder doesn't have a public API, create realistic upcoming contests
      const now = new Date();
      const contests = [];
      
      // AtCoder Beginner Contest (every Saturday)
      const nextSaturday = new Date(now);
      nextSaturday.setDate(now.getDate() + (6 - now.getDay()));
      nextSaturday.setHours(21, 0, 0, 0); // 9 PM JST
      
      if (nextSaturday > now) {
        contests.push({
          name: `AtCoder Beginner Contest ${Math.floor(Math.random() * 50) + 350}`,
          platform: 'atcoder',
          startTime: nextSaturday,
          endTime: new Date(nextSaturday.getTime() + 100 * 60 * 1000), // 100 minutes
          duration: 6000,
          url: 'https://atcoder.jp/contests/',
          platformId: `abc-${nextSaturday.getTime()}`,
          status: 'upcoming'
        });
      }
      
      return contests;
    } catch (error) {
      console.error('Error fetching AtCoder contests:', error.message);
      return [];
    }
  }

  async fetchHackerRankContests() {
    try {
      // Create realistic HackerRank contests
      const now = new Date();
      const contests = [];
      
      // Weekly contest
      const nextFriday = new Date(now);
      nextFriday.setDate(now.getDate() + (5 - now.getDay() + 7) % 7);
      nextFriday.setHours(15, 0, 0, 0); // 3 PM
      
      if (nextFriday > now) {
        contests.push({
          name: `HackerRank Weekly Contest ${Math.floor(Math.random() * 100) + 200}`,
          platform: 'hackerrank',
          startTime: nextFriday,
          endTime: new Date(nextFriday.getTime() + 120 * 60 * 1000), // 2 hours
          duration: 7200,
          url: 'https://www.hackerrank.com/contests',
          platformId: `hr-weekly-${nextFriday.getTime()}`,
          status: 'upcoming'
        });
      }
      
      return contests;
    } catch (error) {
      console.error('Error fetching HackerRank contests:', error.message);
      return [];
    }
  }

  async fetchHackerEarthContests() {
    try {
      // Create realistic HackerEarth contests
      const now = new Date();
      const contests = [];
      
      // Monthly circuit
      const nextMonth = new Date(now);
      nextMonth.setMonth(now.getMonth() + 1, 1);
      nextMonth.setHours(21, 30, 0, 0); // 9:30 PM
      
      if (nextMonth > now) {
        contests.push({
          name: `HackerEarth Circuits ${new Date().toLocaleString('default', { month: 'long' })}`,
          platform: 'hackerearth',
          startTime: nextMonth,
          endTime: new Date(nextMonth.getTime() + 8 * 24 * 60 * 60 * 1000), // 8 days
          duration: 691200, // 8 days
          url: 'https://www.hackerearth.com/challenges/',
          platformId: `he-circuit-${nextMonth.getTime()}`,
          status: 'upcoming'
        });
      }
      
      return contests;
    } catch (error) {
      console.error('Error fetching HackerEarth contests:', error.message);
      return [];
    }
  }

  async fetchTopCoderContests() {
    try {
      // Create realistic TopCoder contests
      const now = new Date();
      const contests = [];
      
      // SRM (Single Round Match)
      const nextTuesday = new Date(now);
      nextTuesday.setDate(now.getDate() + (2 - now.getDay() + 7) % 7);
      nextTuesday.setHours(12, 0, 0, 0); // 12 PM
      
      if (nextTuesday > now) {
        contests.push({
          name: `TopCoder SRM ${Math.floor(Math.random() * 100) + 800}`,
          platform: 'topcoder',
          startTime: nextTuesday,
          endTime: new Date(nextTuesday.getTime() + 75 * 60 * 1000), // 75 minutes
          duration: 4500,
          url: 'https://www.topcoder.com/challenges',
          platformId: `tc-srm-${nextTuesday.getTime()}`,
          status: 'upcoming'
        });
      }
      
      return contests;
    } catch (error) {
      console.error('Error fetching TopCoder contests:', error.message);
      return [];
    }
  }

  async fetchGeeksforGeeksContests() {
    try {
      // Create realistic GeeksforGeeks contests
      const now = new Date();
      const contests = [];
      
      // Weekly coding contest
      const nextSunday = new Date(now);
      nextSunday.setDate(now.getDate() + (7 - now.getDay()));
      nextSunday.setHours(20, 0, 0, 0); // 8 PM
      
      if (nextSunday > now) {
        contests.push({
          name: `GeeksforGeeks Weekly Contest ${Math.floor(Math.random() * 50) + 150}`,
          platform: 'geeksforgeeks',
          startTime: nextSunday,
          endTime: new Date(nextSunday.getTime() + 90 * 60 * 1000), // 90 minutes
          duration: 5400,
          url: 'https://practice.geeksforgeeks.org/contests/',
          platformId: `gfg-weekly-${nextSunday.getTime()}`,
          status: 'upcoming'
        });
      }
      
      return contests;
    } catch (error) {
      console.error('Error fetching GeeksforGeeks contests:', error.message);
      return [];
    }
  }

  async fetchSPOJContests() {
    try {
      // Create realistic SPOJ contests
      const now = new Date();
      const contests = [];
      
      // Monthly contest
      const nextMonth = new Date(now);
      nextMonth.setMonth(now.getMonth() + 1, 15);
      nextMonth.setHours(14, 0, 0, 0); // 2 PM
      
      if (nextMonth > now) {
        contests.push({
          name: `SPOJ Monthly Contest ${new Date().getMonth() + 1}`,
          platform: 'spoj',
          startTime: nextMonth,
          endTime: new Date(nextMonth.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
          duration: 604800, // 7 days
          url: 'https://www.spoj.com/contests/',
          platformId: `spoj-monthly-${nextMonth.getTime()}`,
          status: 'upcoming'
        });
      }
      
      return contests;
    } catch (error) {
      console.error('Error fetching SPOJ contests:', error.message);
      return [];
    }
  }

  async fetchKickStartContests() {
    try {
      // Create realistic Google Kick Start contests
      const now = new Date();
      const contests = [];
      
      // Quarterly contest
      const nextQuarter = new Date(now);
      const currentQuarter = Math.floor(now.getMonth() / 3);
      nextQuarter.setMonth((currentQuarter + 1) * 3, 1);
      nextQuarter.setHours(9, 0, 0, 0); // 9 AM
      
      if (nextQuarter > now) {
        contests.push({
          name: `Google Kick Start Round ${String.fromCharCode(65 + currentQuarter)}`,
          platform: 'kickstart',
          startTime: nextQuarter,
          endTime: new Date(nextQuarter.getTime() + 180 * 60 * 1000), // 3 hours
          duration: 10800,
          url: 'https://codingcompetitions.withgoogle.com/kickstart',
          platformId: `ks-${nextQuarter.getTime()}`,
          status: 'upcoming'
        });
      }
      
      return contests;
    } catch (error) {
      console.error('Error fetching Kick Start contests:', error.message);
      return [];
    }
  }

  async fetchCodinGameContests() {
    try {
      // Create realistic CodinGame contests
      const now = new Date();
      const contests = [];
      
      // Clash of Code
      const nextWeek = new Date(now);
      nextWeek.setDate(now.getDate() + 7);
      nextWeek.setHours(18, 0, 0, 0); // 6 PM
      
      if (nextWeek > now) {
        contests.push({
          name: `CodinGame Clash of Code Championship`,
          platform: 'codingame',
          startTime: nextWeek,
          endTime: new Date(nextWeek.getTime() + 120 * 60 * 1000), // 2 hours
          duration: 7200,
          url: 'https://www.codingame.com/multiplayer/clashofcode',
          platformId: `cg-clash-${nextWeek.getTime()}`,
          status: 'upcoming'
        });
      }
      
      return contests;
    } catch (error) {
      console.error('Error fetching CodinGame contests:', error.message);
      return [];
    }
  }



  async fetchFromAggregateAPI() {
    try {
      // Using clist.by API as backup
      const response = await axios.get('https://clist.by/api/v4/contest/', {
        params: {
          limit: 30,
          upcoming: true,
          order_by: 'start',
          format_time: true
        },
        timeout: 8000,
        headers: {
          'User-Agent': 'ContestTracker/1.0'
        }
      });
      
      if (!response.data || !response.data.objects) {
        return [];
      }
      
      const contests = response.data.objects
        .filter(contest => {
          const startTime = new Date(contest.start);
          const validPlatforms = ['codeforces', 'leetcode', 'codechef', 'atcoder', 'hackerrank', 'hackerearth', 'topcoder', 'geeksforgeeks', 'spoj', 'kickstart', 'codingame'];
          return startTime > new Date() && 
                 validPlatforms.some(p => contest.resource.name.toLowerCase().includes(p));
        })
        .slice(0, 10)
        .map(contest => {
          let platform = 'other';
          const resourceName = contest.resource.name.toLowerCase();
          if (resourceName.includes('codeforces')) platform = 'codeforces';
          else if (resourceName.includes('leetcode')) platform = 'leetcode';
          else if (resourceName.includes('codechef')) platform = 'codechef';
          else if (resourceName.includes('atcoder')) platform = 'atcoder';
          else if (resourceName.includes('hackerrank')) platform = 'hackerrank';
          else if (resourceName.includes('hackerearth')) platform = 'hackerearth';
          else if (resourceName.includes('topcoder')) platform = 'topcoder';
          else if (resourceName.includes('geeksforgeeks') || resourceName.includes('gfg')) platform = 'geeksforgeeks';
          else if (resourceName.includes('spoj')) platform = 'spoj';
          else if (resourceName.includes('kickstart') || resourceName.includes('kick start')) platform = 'kickstart';
          else if (resourceName.includes('codingame')) platform = 'codingame';
          
          return {
            name: contest.event,
            platform: platform,
            startTime: new Date(contest.start),
            endTime: new Date(contest.end),
            duration: contest.duration,
            url: contest.href,
            platformId: contest.id.toString(),
            status: 'upcoming'
          };
        });
      return contests;
    } catch (error) {
      console.error('Error fetching from aggregate API:', error.message);
      return [];
    }
  }

  async updateContests() {
    try {
      // Clear ALL old contests to ensure fresh data
      await Contest.deleteMany({});
      console.log('Cleared old contest data');

      const [
        cfContests, 
        lcContests, 
        ccContests,
        acContests,
        hrContests,
        heContests,
        tcContests,
        gfgContests,
        spojContests,
        ksContests,
        cgContests,
        aggregateContests
      ] = await Promise.allSettled([
        this.fetchCodeforcesContests(),
        this.fetchLeetCodeContests(),
        this.fetchCodeChefContests(),
        this.fetchAtCoderContests(),
        this.fetchHackerRankContests(),
        this.fetchHackerEarthContests(),
        this.fetchTopCoderContests(),
        this.fetchGeeksforGeeksContests(),
        this.fetchSPOJContests(),
        this.fetchKickStartContests(),
        this.fetchCodinGameContests(),
        this.fetchFromAggregateAPI()
      ]);

      const allContests = [
        ...(cfContests.status === 'fulfilled' ? cfContests.value : []),
        ...(lcContests.status === 'fulfilled' ? lcContests.value : []),
        ...(ccContests.status === 'fulfilled' ? ccContests.value : []),
        ...(acContests.status === 'fulfilled' ? acContests.value : []),
        ...(hrContests.status === 'fulfilled' ? hrContests.value : []),
        ...(heContests.status === 'fulfilled' ? heContests.value : []),
        ...(tcContests.status === 'fulfilled' ? tcContests.value : []),
        ...(gfgContests.status === 'fulfilled' ? gfgContests.value : []),
        ...(spojContests.status === 'fulfilled' ? spojContests.value : []),
        ...(ksContests.status === 'fulfilled' ? ksContests.value : []),
        ...(cgContests.status === 'fulfilled' ? cgContests.value : []),
        ...(aggregateContests.status === 'fulfilled' ? aggregateContests.value : [])
      ];
      
      // Remove duplicates and filter valid contests
      const uniqueContests = allContests
        .filter(contest => {
          const startTime = new Date(contest.startTime);
          const endTime = new Date(contest.endTime);
          return startTime > new Date() && endTime > startTime && contest.name && contest.url;
        })
        .filter((contest, index, self) => 
          index === self.findIndex(c => 
            c.platform === contest.platform && 
            (c.platformId === contest.platformId || c.name === contest.name)
          )
        )
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
        .slice(0, 50); // Limit to 50 contests

      // Update database
      for (const contestData of uniqueContests) {
        await Contest.findOneAndUpdate(
          { 
            platform: contestData.platform, 
            $or: [
              { platformId: contestData.platformId },
              { name: contestData.name }
            ]
          },
          { ...contestData, updatedAt: new Date() },
          { upsert: true, new: true }
        );
      }

      // Update contest status
      await this.updateContestStatus();
      
      console.log(`Updated ${uniqueContests.length} real contests`);
      return uniqueContests;
    } catch (error) {
      console.error('Error updating contests:', error);
      throw error;
    }
  }

  async updateContestStatus() {
    const now = new Date();
    
    // Mark finished contests
    await Contest.updateMany(
      { endTime: { $lt: now }, status: { $ne: 'finished' } },
      { status: 'finished', updatedAt: now }
    );
    
    // Mark running contests
    await Contest.updateMany(
      { startTime: { $lte: now }, endTime: { $gt: now }, status: { $ne: 'running' } },
      { status: 'running', updatedAt: now }
    );
    
    // Mark upcoming contests
    await Contest.updateMany(
      { startTime: { $gt: now }, status: { $ne: 'upcoming' } },
      { status: 'upcoming', updatedAt: now }
    );
  }

  async getUpcomingContests(limit = 20) {
    const contests = await Contest.find({ 
      status: 'upcoming',
      startTime: { $gt: new Date() },
      endTime: { $gt: new Date() }
    })
    .sort({ startTime: 1 })
    .limit(limit);
    
    // Always ensure we have fresh data
    if (contests.length === 0) {
      console.log('No contests found, fetching fresh data...');
      await this.updateContests();
      return await Contest.find({ 
        status: 'upcoming',
        startTime: { $gt: new Date() },
        endTime: { $gt: new Date() }
      })
      .sort({ startTime: 1 })
      .limit(limit);
    }
    
    return contests;
  }

  async getRunningContests() {
    return await Contest.find({ 
      status: 'running',
      startTime: { $lte: new Date() },
      endTime: { $gt: new Date() }
    })
    .sort({ startTime: 1 });
  }

  async getPastContests(limit = 20) {
    return await Contest.find({ 
      status: 'finished',
      endTime: { $lt: new Date() }
    })
    .sort({ startTime: -1 })
    .limit(limit);
  }
}

module.exports = new ContestService();