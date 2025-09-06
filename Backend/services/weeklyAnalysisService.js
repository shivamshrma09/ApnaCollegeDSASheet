const nodemailer = require('nodemailer');
const User = require('../models/User');
const UserAnalytics = require('../models/UserAnalytics');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const getWeeklyAnalysis = async (userId) => {
  try {
    const user = await User.findById(userId);
    const analytics = await UserAnalytics.findOne({ userId });
    
    // This week's data
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    let weeklyData = {
      totalProblems: 0,
      easyProblems: 0,
      mediumProblems: 0,
      hardProblems: 0,
      totalTime: 0,
      dailyBreakdown: [0, 0, 0, 0, 0, 0, 0], // Sun to Sat
      topicStats: {},
      accuracy: 0,
      streak: user.goals?.daily?.current || 0,
      weeklyGoal: user.goals?.weekly?.target || 20,
      improvement: ""
    };
    
    if (analytics && analytics.problemAttempts) {
      const weekProblems = analytics.problemAttempts.filter(attempt => 
        attempt.timestamp >= weekStart && 
        attempt.timestamp <= weekEnd &&
        attempt.solved
      );
      
      weeklyData.totalProblems = weekProblems.length;
      weeklyData.totalTime = Math.round(weekProblems.reduce((sum, p) => sum + (p.timeSpent || 0), 0) / 60); // minutes
      
      // Daily breakdown
      weekProblems.forEach(problem => {
        const day = problem.timestamp.getDay();
        weeklyData.dailyBreakdown[day]++;
        
        // Difficulty count
        if (problem.difficulty === 'Easy') weeklyData.easyProblems++;
        else if (problem.difficulty === 'Medium') weeklyData.mediumProblems++;
        else if (problem.difficulty === 'Hard') weeklyData.hardProblems++;
        
        // Topic stats
        const topic = problem.topic || 'General';
        if (!weeklyData.topicStats[topic]) {
          weeklyData.topicStats[topic] = 0;
        }
        weeklyData.topicStats[topic]++;
      });
      
      // Calculate accuracy
      const totalAttempts = analytics.problemAttempts.filter(attempt => 
        attempt.timestamp >= weekStart && attempt.timestamp <= weekEnd
      ).length;
      weeklyData.accuracy = totalAttempts > 0 ? Math.round((weekProblems.length / totalAttempts) * 100) : 0;
    }
    
    // Generate improvement message
    const progress = (weeklyData.totalProblems / weeklyData.weeklyGoal) * 100;
    if (progress >= 100) {
      weeklyData.improvement = "🎉 Excellent! You exceeded your weekly goal!";
    } else if (progress >= 70) {
      weeklyData.improvement = "💪 Great progress! You're almost there!";
    } else if (progress >= 40) {
      weeklyData.improvement = "📈 Good effort! Keep pushing forward!";
    } else {
      weeklyData.improvement = "🚀 Let's aim higher next week!";
    }
    
    return weeklyData;
  } catch (error) {
    console.error('Error getting weekly analysis:', error);
    return null;
  }
};

const generateWeeklyChart = (dailyData) => {
  // Simple ASCII chart
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const maxProblems = Math.max(...dailyData, 1);
  
  let chart = '';
  for (let i = 0; i < days.length; i++) {
    const barLength = Math.round((dailyData[i] / maxProblems) * 20);
    const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength);
    chart += `${days[i]}: ${bar} ${dailyData[i]}\n`;
  }
  
  return chart;
};

const generateWeeklyEmailHTML = (user, weeklyData) => {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  const dateRange = `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
  const chart = generateWeeklyChart(weeklyData.dailyBreakdown);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f9f9f9; }
        .container { max-width: 700px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
        h1 { color: #1f2937; margin-bottom: 10px; }
        h2 { color: #374151; margin-top: 25px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
        .stat-box { background: #f8fafc; padding: 15px; border-radius: 5px; text-align: center; }
        .stat-number { font-size: 24px; font-weight: bold; color: #2563eb; }
        .stat-label { font-size: 12px; color: #6b7280; margin-top: 5px; }
        .chart { background: #f1f5f9; padding: 15px; border-radius: 5px; font-family: monospace; white-space: pre-line; }
        .topic-item { background: #f0f9ff; padding: 8px 12px; margin: 5px 0; border-radius: 4px; display: flex; justify-content: space-between; }
        .progress-bar { background: #e5e7eb; height: 8px; border-radius: 4px; margin: 10px 0; }
        .progress-fill { background: #10b981; height: 100%; border-radius: 4px; }
        .improvement { background: #ecfdf5; padding: 15px; border-radius: 5px; margin: 20px 0; color: #065f46; font-weight: bold; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center; }
        .highlight { color: #2563eb; font-weight: bold; }
        .success { color: #059669; }
        .warning { color: #dc2626; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📊 Weekly Analysis Report</h1>
        <p>Hi <span class="highlight">${user.name}</span>! Here's your coding performance for the week:</p>
        <p><strong>📅 Week:</strong> ${dateRange}</p>
        
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-number">${weeklyData.totalProblems}</div>
            <div class="stat-label">Problems Solved</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">${weeklyData.totalTime}m</div>
            <div class="stat-label">Time Spent</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">${weeklyData.accuracy}%</div>
            <div class="stat-label">Accuracy Rate</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">${weeklyData.streak}</div>
            <div class="stat-label">Current Streak</div>
          </div>
        </div>

        <h2>🎯 Weekly Goal Progress</h2>
        <p>Target: <span class="highlight">${weeklyData.weeklyGoal}</span> problems | Completed: <span class="success">${weeklyData.totalProblems}</span> problems</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${Math.min((weeklyData.totalProblems / weeklyData.weeklyGoal) * 100, 100)}%"></div>
        </div>
        <p>Progress: <span class="${weeklyData.totalProblems >= weeklyData.weeklyGoal ? 'success' : 'warning'}">${Math.round((weeklyData.totalProblems / weeklyData.weeklyGoal) * 100)}%</span></p>

        <h2>📈 Daily Activity Chart</h2>
        <div class="chart">${chart}</div>

        <h2>🏷️ Difficulty Breakdown</h2>
        <div class="topic-item">
          <span>🟢 Easy Problems</span>
          <span class="success">${weeklyData.easyProblems}</span>
        </div>
        <div class="topic-item">
          <span>🟡 Medium Problems</span>
          <span class="highlight">${weeklyData.mediumProblems}</span>
        </div>
        <div class="topic-item">
          <span>🔴 Hard Problems</span>
          <span class="warning">${weeklyData.hardProblems}</span>
        </div>

        <h2>📚 Topic Performance</h2>
        ${Object.entries(weeklyData.topicStats).length > 0 ? 
          Object.entries(weeklyData.topicStats).map(([topic, count]) => `
            <div class="topic-item">
              <span>📖 ${topic}</span>
              <span class="highlight">${count} problems</span>
            </div>
          `).join('') : 
          '<p>No topic data available for this week.</p>'
        }

        <div class="improvement">
          <h3>💡 Weekly Insight</h3>
          <p>${weeklyData.improvement}</p>
          ${weeklyData.totalProblems < weeklyData.weeklyGoal ? 
            `<p>💪 You need ${weeklyData.weeklyGoal - weeklyData.totalProblems} more problems to reach your weekly goal!</p>` :
            '<p>🎉 Congratulations on achieving your weekly goal!</p>'
          }
        </div>

        <h2>🚀 Next Week's Focus</h2>
        <ul>
          <li>🎯 Aim for ${weeklyData.weeklyGoal} problems next week</li>
          <li>⚖️ Balance difficulty levels (30% Easy, 50% Medium, 20% Hard)</li>
          <li>🔄 Review spaced repetition problems regularly</li>
          <li>📈 Maintain consistency with daily practice</li>
          <li>🧠 Focus on weak topics identified this week</li>
        </ul>

        <p style="text-align: center; margin: 25px 0;">
          <a href="http://localhost:3000" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Continue Your Journey! 🚀</a>
        </p>

        <div class="footer">
          <p>Keep coding, keep growing! Your consistency is building something amazing. 💪</p>
          <p><small>DSA Practice Platform | Weekly Analysis Report</small></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const sendWeeklyAnalysisEmail = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.email) return;

    const weeklyData = await getWeeklyAnalysis(userId);
    if (!weeklyData) return;

    const htmlContent = generateWeeklyEmailHTML(user, weeklyData);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `📊 Weekly Analysis: ${weeklyData.totalProblems} Problems Solved This Week!`,
      html: htmlContent
    });

    console.log(`Weekly analysis email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending weekly analysis email:', error);
  }
};

const sendWeeklyAnalysisToAllUsers = async () => {
  try {
    const users = await User.find({ 
      email: { $exists: true, $ne: null },
      emailNotifications: { $ne: false }
    });
    
    console.log(`Sending weekly analysis emails to ${users.length} users...`);
    
    for (const user of users) {
      await sendWeeklyAnalysisEmail(user._id);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    }
    
    console.log(`Weekly analysis emails sent to ${users.length} users`);
  } catch (error) {
    console.error('Error sending weekly analysis emails:', error);
  }
};

module.exports = {
  sendWeeklyAnalysisEmail,
  sendWeeklyAnalysisToAllUsers
};