const User = require('../models/User');
const UserAnalytics = require('../models/UserAnalytics');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

// Generate weekly report data
const generateWeeklyReport = async (userId) => {
  try {
    const user = await User.findById(userId);
    const analytics = await UserAnalytics.findOne({ userId });
    
    if (!user || !analytics) {
      return null;
    }

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // Get problems solved in the last week
    const weeklyAttempts = analytics.problemAttempts.filter(
      attempt => new Date(attempt.timestamp) >= oneWeekAgo
    );
    
    const solvedProblems = weeklyAttempts.filter(attempt => attempt.solved);
    const totalTimeSpent = weeklyAttempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
    const accuracy = weeklyAttempts.length > 0 ? (solvedProblems.length / weeklyAttempts.length) * 100 : 0;
    
    // Identify weak and strong areas
    const topicStats = {};
    weeklyAttempts.forEach(attempt => {
      if (!topicStats[attempt.topic]) {
        topicStats[attempt.topic] = { attempts: 0, solved: 0 };
      }
      topicStats[attempt.topic].attempts++;
      if (attempt.solved) topicStats[attempt.topic].solved++;
    });
    
    const weakAreas = Object.entries(topicStats)
      .filter(([topic, stats]) => stats.attempts >= 2 && (stats.solved / stats.attempts) < 0.6)
      .map(([topic]) => topic)
      .slice(0, 3);
    
    const strongAreas = Object.entries(topicStats)
      .filter(([topic, stats]) => stats.attempts >= 2 && (stats.solved / stats.attempts) >= 0.8)
      .map(([topic]) => topic)
      .slice(0, 3);
    
    // Calculate streak
    const currentStreak = user.sheetProgress?.apnaCollege?.streak || 0;
    
    return {
      userId,
      userName: user.name,
      userEmail: user.email,
      weekPeriod: {
        start: oneWeekAgo.toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
      },
      stats: {
        problemsSolved: solvedProblems.length,
        totalAttempts: weeklyAttempts.length,
        timeSpent: Math.round(totalTimeSpent / 3600 * 10) / 10, // Convert to hours
        accuracy: Math.round(accuracy),
        currentStreak
      },
      analysis: {
        weakAreas: weakAreas.length > 0 ? weakAreas : ['No weak areas identified'],
        strongAreas: strongAreas.length > 0 ? strongAreas : ['Keep practicing to identify strengths'],
        recommendations: generateRecommendations(weakAreas, solvedProblems.length)
      },
      generatedAt: new Date()
    };
  } catch (error) {
    console.error('Error generating weekly report:', error);
    return null;
  }
};

// Generate recommendations based on performance
const generateRecommendations = (weakAreas, problemsSolved) => {
  const recommendations = [];
  
  if (problemsSolved < 5) {
    recommendations.push('Try to solve at least 1 problem daily to build consistency');
  }
  
  if (weakAreas.length > 0) {
    recommendations.push(`Focus on improving: ${weakAreas.join(', ')}`);
  }
  
  if (problemsSolved >= 10) {
    recommendations.push('Great progress! Consider attempting harder problems');
  }
  
  recommendations.push('Review solutions of problems you found difficult');
  recommendations.push('Practice mock interviews to test your skills');
  
  return recommendations;
};

// Send weekly report via email
const sendWeeklyReportEmail = async (reportData) => {
  try {
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3b82f6; margin: 0;">📊 Weekly DSA Progress Report</h1>
          <p style="color: #6b7280; margin: 5px 0;">
            ${reportData.weekPeriod.start} to ${reportData.weekPeriod.end}
          </p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin-top: 0;">📈 Performance Summary</h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            <div style="text-align: center; padding: 15px; background: white; border-radius: 8px;">
              <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${reportData.stats.problemsSolved}</div>
              <div style="color: #6b7280; font-size: 14px;">Problems Solved</div>
            </div>
            <div style="text-align: center; padding: 15px; background: white; border-radius: 8px;">
              <div style="font-size: 24px; font-weight: bold; color: #22c55e;">${reportData.stats.timeSpent}h</div>
              <div style="color: #6b7280; font-size: 14px;">Time Spent</div>
            </div>
            <div style="text-align: center; padding: 15px; background: white; border-radius: 8px;">
              <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${reportData.stats.accuracy}%</div>
              <div style="color: #6b7280; font-size: 14px;">Accuracy</div>
            </div>
            <div style="text-align: center; padding: 15px; background: white; border-radius: 8px;">
              <div style="font-size: 24px; font-weight: bold; color: #ef4444;">${reportData.stats.currentStreak}</div>
              <div style="color: #6b7280; font-size: 14px;">Day Streak</div>
            </div>
          </div>
        </div>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h3 style="color: #166534; margin-top: 0;">💪 Strong Areas</h3>
          <ul style="color: #374151; margin: 0; padding-left: 20px;">
            ${reportData.analysis.strongAreas.map(area => `<li>${area}</li>`).join('')}
          </ul>
        </div>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h3 style="color: #dc2626; margin-top: 0;">🎯 Areas to Improve</h3>
          <ul style="color: #374151; margin: 0; padding-left: 20px;">
            ${reportData.analysis.weakAreas.map(area => `<li>${area}</li>`).join('')}
          </ul>
        </div>
        
        <div style="background: #eff6ff; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h3 style="color: #1d4ed8; margin-top: 0;">💡 Recommendations</h3>
          <ul style="color: #374151; margin: 0; padding-left: 20px;">
            ${reportData.analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL}" style="
            background: #3b82f6; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 8px; 
            display: inline-block;
            font-weight: 600;
          ">
            Continue Learning 🚀
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
          <p>Keep up the great work! Consistency is the key to success in DSA.</p>
          <p>Generated on ${new Date(reportData.generatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    `;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reportData.userEmail,
      subject: `📊 Your Weekly DSA Progress Report - ${reportData.stats.problemsSolved} Problems Solved!`,
      html: htmlContent
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Weekly report sent to ${reportData.userEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending weekly report email:', error);
    return false;
  }
};

// Schedule weekly reports (every Monday at 9 AM)
const scheduleWeeklyReports = () => {
  cron.schedule('0 9 * * 1', async () => {
    try {
      console.log('Starting weekly report generation...');
      
      // Get all users who want weekly reports
      const users = await User.find({
        'notifications.email': true,
        'notifications.weeklyGoalReminder': true
      });
      
      for (const user of users) {
        const reportData = await generateWeeklyReport(user._id);
        if (reportData) {
          await sendWeeklyReportEmail(reportData);
          
          // Save report to user's profile for download
          if (!user.weeklyReports) user.weeklyReports = [];
          user.weeklyReports.push({
            reportData,
            generatedAt: new Date()
          });
          
          // Keep only last 4 reports
          if (user.weeklyReports.length > 4) {
            user.weeklyReports = user.weeklyReports.slice(-4);
          }
          
          await user.save();
        }
      }
      
      console.log('Weekly reports generation completed');
    } catch (error) {
      console.error('Error in weekly reports cron job:', error);
    }
  });
};

// Get user's weekly report data
const getUserWeeklyReport = async (userId) => {
  try {
    const reportData = await generateWeeklyReport(userId);
    return reportData;
  } catch (error) {
    console.error('Error getting user weekly report:', error);
    return null;
  }
};

module.exports = {
  generateWeeklyReport,
  sendWeeklyReportEmail,
  scheduleWeeklyReports,
  getUserWeeklyReport
};