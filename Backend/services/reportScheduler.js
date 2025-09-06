const cron = require('node-cron');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate 4-week cumulative report
const generateWeeklyReport = async (user) => {
  const Progress = require('../models/Progress');
  const now = new Date();
  const fourWeeksAgo = new Date(now.getTime() - (28 * 24 * 60 * 60 * 1000));
  
  const cumulativeWeeks = [];
  
  // Generate cumulative data for each week
  for (let week = 1; week <= 4; week++) {
    const periodStart = new Date(fourWeeksAgo);
    const periodEnd = new Date(fourWeeksAgo);
    periodEnd.setDate(periodEnd.getDate() + (week * 7) - 1);
    
    const progress = await Progress.find({
      userId: user._id,
      date: { $gte: periodStart, $lte: periodEnd }
    });
    
    const totalProblems = progress.reduce((sum, p) => sum + p.problemsSolved, 0);
    
    cumulativeWeeks.push({
      weekLabel: week === 1 ? 'Week 1' : `Week 1-${week}`,
      problems: totalProblems,
      period: `${periodStart.toDateString()} - ${periodEnd.toDateString()}`
    });
  }
  
  return {
    user: user.name,
    email: user.email,
    cumulativeWeeks,
    finalTotal: cumulativeWeeks[3]?.problems || 0,
    reportDate: now.toLocaleDateString()
  };
};

// Send 4-week cumulative report email
const sendWeeklyReport = async (reportData) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1E90FF;">📊 4-Week Cumulative DSA Progress Report</h2>
      <p>Hi ${reportData.user},</p>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>📈 Cumulative Weekly Progress (${reportData.reportDate})</h3>
        
        <h4>📚 Progressive Weekly Totals:</h4>
        ${reportData.cumulativeWeeks.map(week => `
          <div style="margin: 10px 0; padding: 15px; background: white; border-radius: 4px; border-left: 4px solid #1E90FF;">
            <strong>${week.weekLabel}:</strong> ${week.problems} problems total
            <br><small style="color: #666;">${week.period}</small>
          </div>
        `).join('')}
        
        <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h4 style="margin: 0; color: #0277bd;">🎯 Final 4-Week Total: ${reportData.finalTotal} problems</h4>
          <p style="margin: 5px 0 0 0; color: #666;">Progress: ${Math.round((reportData.finalTotal / 373) * 100)}% of DSA Sheet</p>
        </div>
      </div>
      
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4>💪 Keep the Momentum!</h4>
        <p>Your cumulative progress shows consistent growth. Keep solving problems daily!</p>
      </div>
      
      <p>Best regards,<br>DSA Tracker Team</p>
    </div>
  `;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: reportData.email,
    subject: `📊 Your 4-Week Cumulative DSA Progress Report - ${reportData.reportDate}`,
    html: htmlContent
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 4-week cumulative report sent to ${reportData.email}`);
  } catch (error) {
    console.error('Error sending 4-week report:', error);
  }
};

// Schedule weekly reports every Sunday at 11 PM
const scheduleWeeklyReports = () => {
  cron.schedule('0 23 * * 0', async () => {
    console.log('🕚 Running weekly report generation...');
    
    try {
      const users = await User.find({}).select('name email sheetProgress');
      
      for (const user of users) {
        const reportData = await generateWeeklyReport(user);
        await sendWeeklyReport(reportData);
        
        // Small delay between emails
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      console.log(`✅ 4-week cumulative reports sent to ${users.length} users`);
    } catch (error) {
      console.error('Error in weekly report scheduler:', error);
    }
  });
  
  console.log('📅 Weekly report scheduler initialized (Sundays 11 PM)');
};

module.exports = { scheduleWeeklyReports };