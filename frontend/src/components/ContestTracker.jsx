import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrophyIcon, CalendarIcon, ClockIcon, LinkIcon, TimerIcon, CodeforcesIcon, LeetCodeIcon, CodeChefIcon, AtCoderIcon } from './SVGIcons';

const PlatformBadge = ({ platform }) => {
  const configs = {
    leetcode: { icon: <LeetCodeIcon size={16} />, bg: 'bg-yellow-500', text: 'LeetCode' },
    codeforces: { icon: <CodeforcesIcon size={16} />, bg: 'bg-blue-500', text: 'Codeforces' },
    codechef: { icon: <CodeChefIcon size={16} />, bg: 'bg-orange-600', text: 'CodeChef' },
    atcoder: { icon: <AtCoderIcon size={16} />, bg: 'bg-green-500', text: 'AtCoder' },
    hackerrank: { icon: <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">H</div>, bg: 'bg-purple-500', text: 'HackerRank' },
    hackerearth: { icon: <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">HE</div>, bg: 'bg-red-500', text: 'HackerEarth' },
    topcoder: { icon: <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs">TC</div>, bg: 'bg-indigo-500', text: 'TopCoder' },
    geeksforgeeks: { icon: <div className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">GFG</div>, bg: 'bg-green-600', text: 'GeeksforGeeks' },
    spoj: { icon: <div className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs">S</div>, bg: 'bg-gray-700', text: 'SPOJ' },
    kickstart: { icon: <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-white text-xs">KS</div>, bg: 'bg-red-600', text: 'Kick Start' },
    codingame: { icon: <div className="w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">CG</div>, bg: 'bg-purple-600', text: 'CodinGame' }
  };
  const config = configs[platform] || { icon: <div className="w-4 h-4 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs">{platform.charAt(0).toUpperCase()}</div>, bg: 'bg-gray-500', text: platform.charAt(0).toUpperCase() + platform.slice(1) };
  return (
    <div className="flex items-center gap-2">
      {config.icon}
      <span className={`px-2 py-1 rounded text-xs font-medium text-white ${config.bg}`}>
        {config.text}
      </span>
    </div>
  );
};

const ContestTracker = () => {
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchContests();
  }, [selectedPlatform]);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const [upcomingRes, pastRes] = await Promise.all([
        axios.get(`/api/contests/upcoming?platform=${selectedPlatform}&limit=10`),
        axios.get(`/api/contests/past?platform=${selectedPlatform}&limit=20`)
      ]);
      setUpcomingContests(upcomingRes.data);
      setPastContests(pastRes.data);
    } catch (error) {
      console.error('Error fetching contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric', 
      year: 'numeric'
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours === 0) return `${minutes}:00`;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };





  const getTimeUntilContest = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;
    
    if (diff <= 0) return 'Started';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <TrophyIcon size={24} color="#FFD700" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Upcoming Contests ({activeTab === 'upcoming' ? upcomingContests.length : pastContests.length})
          </h2>
        </div>
        <div className="flex gap-4">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All Platforms</option>
            <option value="codeforces">Codeforces</option>
            <option value="leetcode">LeetCode</option>
            <option value="codechef">CodeChef</option>
            <option value="atcoder">AtCoder</option>
            <option value="hackerrank">HackerRank</option>
            <option value="hackerearth">HackerEarth</option>
            <option value="topcoder">TopCoder</option>
            <option value="geeksforgeeks">GeeksforGeeks</option>
            <option value="spoj">SPOJ</option>
            <option value="kickstart">Google Kick Start</option>
            <option value="codingame">CodinGame</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'upcoming'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <TrophyIcon size={16} />
          Upcoming Contests ({upcomingContests.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'past'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <ClockIcon size={16} />
          Past Contests ({pastContests.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activeTab === 'upcoming' ? (
            upcomingContests.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No upcoming contests found
              </p>
            ) : (
              upcomingContests.map((contest, index) => (
                <div
                  key={`${contest.platform}-${contest.platformId}-${index}`}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="space-y-3 mb-4">
                        <PlatformBadge platform={contest.platform} />
                        <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-medium">
                          <TimerIcon size={16} />
                          <span>Starts in {getTimeUntilContest(contest.startTime)}</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
                        {contest.name}
                      </h3>
                      <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <CalendarIcon size={16} />
                          <span>{formatDateShort(contest.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ClockIcon size={16} />
                          <span>Duration: {formatDuration(contest.duration)}</span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={contest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 hover:shadow-md"
                    >
                      <LinkIcon size={16} />
                      Register
                    </a>
                  </div>
                </div>
              ))
            )
          ) : (
            pastContests.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No past contests found
              </p>
            ) : (
              pastContests.map((contest, index) => {
                const daysAgo = Math.floor((new Date() - new Date(contest.endTime)) / (1000 * 60 * 60 * 24));
                return (
                  <div
                    key={`past-${contest.platform}-${contest.platformId}-${index}`}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="space-y-3 mb-4">
                          <PlatformBadge platform={contest.platform} />
                          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <ClockIcon size={16} />
                            <span>{daysAgo} days ago</span>
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {contest.name}
                        </h3>
                        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <CalendarIcon size={16} />
                            <span>Held on {formatDate(contest.startTime)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ClockIcon size={16} />
                            <span>Duration: {formatDuration(contest.duration)}</span>
                          </div>
                        </div>
                      </div>
                      <a
                        href={contest.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 hover:shadow-md"
                      >
                        <LinkIcon size={16} />
                        Virtual Join
                      </a>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ContestTracker;