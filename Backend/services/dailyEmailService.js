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

const motivationalQuotes = [
  "Code today, conquer tomorrow! 💪",
  "Every algorithm mastered is a step closer to your dreams! 🚀",
  "Consistency beats perfection. Keep coding! ⚡",
  "Your future self will thank you for today's effort! 🌟",
  "Debug your doubts, compile your confidence! 💻",
  "Small progress daily leads to big results yearly! 📈",
  "The best time to code was yesterday. The second best time is now! ⏰"
];

const getSpacedRepetitionProblems = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.spacedRepetition) return [];

    const today = new Date();
    const dueProblems = user.spacedRepetition
      .filter(item => new Date(item.nextReviewDate) <= today)
      .slice(0, 5)
      .map(item => ({
        problemId: item.problemId,
        nextReviewDate: item.nextReviewDate,
        interval: item.interval,
        repetitions: item.repetitions
      }));

    return dueProblems;
  } catch (error) {
    console.error('Error getting spaced repetition problems:', error);
    return [];
  }
};

const getUserStats = async (userId) => {
  try {
    const user = await User.findById(userId);
    const analytics = await UserAnalytics.findOne({ userId });
    
    // Yesterday's problems solved
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const yesterdayEnd = new Date(yesterday);
    yesterdayEnd.setHours(23, 59, 59, 999);
    
    let yesterdayProblems = 0;
    if (analytics && analytics.problemAttempts) {
      yesterdayProblems = analytics.problemAttempts.filter(attempt => 
        attempt.timestamp >= yesterday && 
        attempt.timestamp <= yesterdayEnd && 
        attempt.solved
      ).length;
    }
    
    // Weekly progress
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    let weeklyProblems = 0;
    if (analytics && analytics.problemAttempts) {
      weeklyProblems = analytics.problemAttempts.filter(attempt => 
        attempt.timestamp >= weekStart && attempt.solved
      ).length;
    }
    
    return {
      dailyGoal: user.goals?.daily?.target || 2,
      weeklyGoal: user.goals?.weekly?.target || 14,
      currentStreak: user.goals?.daily?.current || 0,
      yesterdayProblems,
      weeklyProblems,
      weeklyProgress: Math.round((weeklyProblems / (user.goals?.weekly?.target || 14)) * 100)
    };
  } catch (error) {
    return { 
      dailyGoal: 2, 
      weeklyGoal: 14, 
      currentStreak: 0,
      yesterdayProblems: 0,
      weeklyProblems: 0,
      weeklyProgress: 0
    };
  }
};

const generateDailyEmailHTML = (user, stats, spacedProblems, quote) => {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
        h1 { color: #2563eb; margin-bottom: 10px; }
        h3 { color: #1f2937; margin-top: 25px; margin-bottom: 15px; }
        .stats { background: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .quote { background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; font-style: italic; }
        .spaced-item { background: #f0f9ff; padding: 10px; margin: 8px 0; border-radius: 4px; border-left: 3px solid #3b82f6; }
        .progress { color: #059669; font-weight: bold; }
        .warning { color: #dc2626; font-weight: bold; }
        ul { line-height: 1.6; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🌅 Good Morning, ${user.name}!</h1>
        <p>${today}</p>
        
        <div class="stats">
          <h3>📊 Your Progress</h3>
          <p>📅 <strong>Yesterday:</strong> ${stats.yesterdayProblems} problems solved</p>
          <p>📆 <strong>This Week:</strong> ${stats.weeklyProblems}/${stats.weeklyGoal} problems (${stats.weeklyProgress}%)</p>
          <p>🔥 <strong>Current Streak:</strong> ${stats.currentStreak} days</p>
        </div>

        <div class="quote">
          <p>💡 <strong>Today's Motivation:</strong> "${quote}"</p>
        </div>

        <h3>🎯 Daily Goal</h3>
        <p>🎯 Target: <span class="progress">${stats.dailyGoal} problems</span></p>
        
        ${spacedProblems.length > 0 ? `
        <h3>🔄 Spaced Repetition - Due Today</h3>
        <p>These problems need revision based on your learning schedule:</p>
        ${spacedProblems.map(problem => `
          <div class="spaced-item">
            <strong>📝 Problem ID: ${problem.problemId}</strong><br>
            <small>🔁 Repetition: ${problem.repetitions} | ⏱️ Interval: ${problem.interval} days | 📅 Due: ${new Date(problem.nextReviewDate).toLocaleDateString()}</small>
          </div>
        `).join('')}
        ` : `
        <h3>📚 Today's Focus</h3>
        <p>No spaced repetition problems due today. Focus on new problems!</p>
        `}

        <h3>📋 Today's Plan</h3>
        <ul>
          <li>☕ Warm-up with an easy problem</li>
          <li>🎯 Solve ${stats.dailyGoal} problems to meet your daily goal</li>
          <li>🔄 Complete ${spacedProblems.length} spaced repetition problems</li>
          <li>📝 Review solutions and understand concepts</li>
          <li>📊 Track progress in the app</li>
        </ul>

        <p style="text-align: center; margin: 25px 0;">
          <a href="http://localhost:3000" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Coding Now! 💻</a>
        </p>

        <p class="warning">⏰ Consistency is key! Even 30 minutes daily makes a huge difference.</p>

        <div class="footer">
          <p>Keep coding, keep growing! 💪</p>
          <p><small>DSA Practice Platform | Daily Motivation</small></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const sendDailyEmail = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.email) return;

    const stats = await getUserStats(userId);
    const spacedProblems = await getSpacedRepetitionProblems(userId);
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

    const htmlContent = generateDailyEmailHTML(user, stats, spacedProblems, quote);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `🌅 Good Morning ${user.name}! Your Daily DSA Roadmap is Ready`,
      html: htmlContent
    });

    console.log(`Daily email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending daily email:', error);
  }
};

const sendDailyEmailsToAllUsers = async () => {
  try {
    const users = await User.find({ 
      email: { $exists: true, $ne: null },
      emailNotifications: { $ne: false } // Only send to users who haven't disabled notifications
    });
    
    console.log(`Sending daily emails to ${users.length} users...`);
    
    for (const user of users) {
      await sendDailyEmail(user._id);
      await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 second delay
    }
    
    console.log(`Daily morning emails sent to ${users.length} users`);
  } catch (error) {
    console.error('Error sending daily emails:', error);
  }
};

module.exports = {
  sendDailyEmail,
  sendDailyEmailsToAllUsers
};