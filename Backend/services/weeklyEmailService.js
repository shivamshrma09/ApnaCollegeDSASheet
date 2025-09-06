const nodemailer = require('nodemailer');
const User = require('../models/User');
const UserAnalytics = require('../models/UserAnalytics');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 400 });

const generateWeeklyChart = async (weekData) => {
  try {
    const configuration = {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Problems Solved',
          data: weekData.dailyProblems || [0,0,0,0,0,0,0],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Weekly Progress Chart'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
    
    return await chartJSNodeCanvas.renderToBuffer(configuration);
  } catch (error) {
    console.log('Chart generation failed, using placeholder');
    return Buffer.from('Chart not available');
  }
};

const getWeeklyAnalytics = async (userId) => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  const analytics = await UserAnalytics.findOne({ userId });
  if (!analytics) return null;

  const weeklyAttempts = analytics.problemAttempts.filter(
    attempt => attempt.timestamp >= oneWeekAgo
  );

  const dailyData = Array(7).fill(0).map(() => ({ problems: 0, time: 0 }));
  
  weeklyAttempts.forEach(attempt => {
    const dayIndex = attempt.timestamp.getDay();
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Monday = 0
    dailyData[adjustedIndex].problems += attempt.solved ? 1 : 0;
    dailyData[adjustedIndex].time += attempt.timeSpent / 60; // minutes to hours
  });

  const totalProblems = weeklyAttempts.filter(a => a.solved).length;
  const totalTime = weeklyAttempts.reduce((sum, a) => sum + a.timeSpent, 0);
  const avgAccuracy = weeklyAttempts.length > 0 ? 
    (weeklyAttempts.filter(a => a.solved).length / weeklyAttempts.length) * 100 : 0;

  const topicStats = {};
  weeklyAttempts.forEach(attempt => {
    if (!topicStats[attempt.topic]) {
      topicStats[attempt.topic] = { solved: 0, total: 0 };
    }
    topicStats[attempt.topic].total++;
    if (attempt.solved) topicStats[attempt.topic].solved++;
  });

  return {
    totalProblems,
    totalTime: Math.round(totalTime / 60), // hours
    avgAccuracy: Math.round(avgAccuracy),
    dailyProblems: dailyData.map(d => d.problems),
    dailyTime: dailyData.map(d => Math.round(d.time * 60)), // back to minutes for chart
    topicStats,
    streak: analytics.performance.streak || 0,
    weeklyGoal: 20, // default goal
    improvement: totalProblems > 0 ? 'Great progress this week!' : 'Let\'s get started next week!'
  };
};

const generateEmailHTML = (user, weekData, chartBuffer) => {
  const chartBase64 = chartBuffer.length > 20 ? chartBuffer.toString('base64') : '';
  const progressPercentage = Math.min((weekData.totalProblems / weekData.weeklyGoal) * 100, 100);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
        .stat-card { background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-number { font-size: 24px; font-weight: bold; color: #3b82f6; }
        .stat-label { font-size: 12px; color: #6b7280; margin-top: 5px; }
        .progress-bar { background: #e5e7eb; height: 10px; border-radius: 5px; margin: 10px 0; }
        .progress-fill { background: #10b981; height: 100%; border-radius: 5px; }
        .chart { text-align: center; margin: 20px 0; }
        .topics { margin: 20px 0; }
        .topic-item { display: flex; justify-content: space-between; padding: 10px; background: #f9fafb; margin: 5px 0; border-radius: 5px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 Weekly DSA Report</h1>
          <p>Hey ${user.name}! Here's your coding journey this week</p>
        </div>
        
        <div class="content">
          <div class="stat-grid">
            <div class="stat-card">
              <div class="stat-number">${weekData.totalProblems}</div>
              <div class="stat-label">Problems Solved</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${weekData.totalTime}h</div>
              <div class="stat-label">Time Spent</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${weekData.avgAccuracy}%</div>
              <div class="stat-label">Accuracy</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${weekData.streak}</div>
              <div class="stat-label">Current Streak</div>
            </div>
          </div>

          <h3>🎯 Weekly Goal Progress</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
          </div>
          <p>${weekData.totalProblems}/${weekData.weeklyGoal} problems completed (${Math.round(progressPercentage)}%)</p>

          <div class="chart">
            <h3>📈 Weekly Progress Chart</h3>
            <img src="data:image/png;base64,${chartBase64}" alt="Weekly Progress Chart" style="max-width: 100%; height: auto;">
          </div>

          <div class="topics">
            <h3>📚 Topic-wise Performance</h3>
            ${Object.entries(weekData.topicStats).map(([topic, stats]) => `
              <div class="topic-item">
                <span>${topic}</span>
                <span>${stats.solved}/${stats.total} (${Math.round((stats.solved/stats.total)*100)}%)</span>
              </div>
            `).join('')}
          </div>

          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>🤖 AI Feedback</h3>
            <p>${weekData.improvement}</p>
            ${weekData.totalProblems < 10 ? 
              '<p>💡 <strong>Tip:</strong> Try to solve at least 2-3 problems daily for consistent progress!</p>' :
              '<p>🎉 <strong>Great job!</strong> You\'re maintaining excellent consistency. Keep it up!</p>'
            }
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Continue Learning 🚀</a>
          </div>
        </div>

        <div class="footer">
          <p>Keep coding, keep growing! 💪</p>
          <p style="font-size: 12px;">DSA Practice Platform | Weekly Report</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const sendWeeklyEmail = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.email) return;

    const weekData = await getWeeklyAnalytics(userId);
    if (!weekData) return;

    const chartBuffer = await generateWeeklyChart(weekData);
    const htmlContent = generateEmailHTML(user, weekData, chartBuffer);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `📊 Your Weekly DSA Progress Report - ${weekData.totalProblems} Problems Solved!`,
      html: htmlContent
    });

    console.log(`Weekly email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending weekly email:', error);
  }
};

const sendWeeklyEmailsToAllUsers = async () => {
  try {
    const users = await User.find({ email: { $exists: true, $ne: null } });
    
    for (const user of users) {
      await sendWeeklyEmail(user._id);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    }
    
    console.log(`Weekly emails sent to ${users.length} users`);
  } catch (error) {
    console.error('Error sending weekly emails:', error);
  }
};

module.exports = {
  sendWeeklyEmail,
  sendWeeklyEmailsToAllUsers
};