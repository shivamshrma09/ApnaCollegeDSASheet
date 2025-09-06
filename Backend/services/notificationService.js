const nodemailer = require('nodemailer');
const User = require('../models/User');
const cron = require('node-cron');

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send daily goal reminder
const sendDailyReminder = async (user) => {
  try {
    const transporter = createTransporter();
    
    const remaining = user.goals.daily.target - user.goals.daily.current;
    if (remaining <= 0) return; // Goal already completed
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: '🎯 Daily DSA Goal Reminder',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Daily Goal Reminder</h2>
          <p>Hi ${user.name},</p>
          <p>You have <strong>${remaining} problems</strong> remaining to complete your daily goal of ${user.goals.daily.target} problems.</p>
          
          ${user.weaknessAnalysis.weakTopics.length > 0 ? `
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Suggested Focus Areas:</h3>
            <ul>
              ${user.weaknessAnalysis.weakTopics.slice(0, 3).map(area => 
                `<li>${area.topic} (${area.difficulty}) - ${area.failureRate.toFixed(1)}% failure rate</li>`
              ).join('')}
            </ul>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Start Solving Problems
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            Keep up the great work! Consistency is key to mastering DSA.
          </p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Daily reminder sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending daily reminder:', error);
  }
};

// Send weekly goal reminder
const sendWeeklyReminder = async (user) => {
  try {
    const transporter = createTransporter();
    
    const weeklyProgress = (user.goals.weekly.current / user.goals.weekly.target) * 100;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: '📊 Weekly DSA Progress Update',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">Weekly Progress Update</h2>
          <p>Hi ${user.name},</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">This Week's Progress</h3>
            <div style="background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden;">
              <div style="background: #3b82f6; height: 100%; width: ${weeklyProgress}%; transition: width 0.3s ease;"></div>
            </div>
            <p style="margin: 10px 0 0 0;">
              <strong>${user.goals.weekly.current}/${user.goals.weekly.target} problems</strong> 
              (${weeklyProgress.toFixed(1)}% complete)
            </p>
          </div>
          
          ${user.goals.interviewPrep.targetDate ? `
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">🎯 Interview Preparation</h3>
            <p style="margin: 0;">
              <strong>${user.goals.interviewPrep.daysRemaining} days</strong> until your 
              ${user.goals.interviewPrep.targetCompany} interview!
            </p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}" style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Continue Learning
            </a>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Weekly reminder sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending weekly reminder:', error);
  }
};

// Send interview preparation alert
const sendInterviewAlert = async (user) => {
  try {
    const transporter = createTransporter();
    const daysRemaining = user.goals.interviewPrep.daysRemaining;
    
    if (daysRemaining <= 0) return;
    
    let urgency = '';
    let color = '#3b82f6';
    
    if (daysRemaining <= 7) {
      urgency = 'URGENT: ';
      color = '#ef4444';
    } else if (daysRemaining <= 14) {
      urgency = 'Important: ';
      color = '#f59e0b';
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `${urgency}Interview in ${daysRemaining} days!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: ${color};">${urgency}Interview Preparation Alert</h2>
          <p>Hi ${user.name},</p>
          
          <div style="background: #fee2e2; border-left: 4px solid ${color}; padding: 20px; margin: 20px 0;">
            <h3 style="color: #991b1b; margin-top: 0;">
              ${daysRemaining} days until your ${user.goals.interviewPrep.targetCompany} interview!
            </h3>
            <p style="margin: 0;">
              Recommended daily target: <strong>${Math.ceil(daysRemaining / 5)} problems</strong>
            </p>
          </div>
          
          ${user.goals.interviewPrep.focusAreas.length > 0 ? `
          <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #166534; margin-top: 0;">Focus Areas:</h3>
            <ul style="margin: 0;">
              ${user.goals.interviewPrep.focusAreas.map(area => `<li>${area}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}" style="background: ${color}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Start Preparing Now
            </a>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Interview alert sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending interview alert:', error);
  }
};

// Schedule daily reminders (runs every day at 9 AM)
const scheduleDailyReminders = () => {
  cron.schedule('0 9 * * *', async () => {
    try {
      const users = await User.find({
        'notifications.email': true,
        'notifications.dailyReminder': true
      });
      
      for (const user of users) {
        // Check if user hasn't completed daily goal
        const now = new Date();
        const lastReset = new Date(user.goals.daily.lastReset);
        
        // Reset daily goal if it's a new day
        if (now.toDateString() !== lastReset.toDateString()) {
          user.goals.daily.current = 0;
          user.goals.daily.lastReset = now;
          await user.save();
        }
        
        if (user.goals.daily.current < user.goals.daily.target) {
          await sendDailyReminder(user);
        }
      }
    } catch (error) {
      console.error('Error in daily reminder cron job:', error);
    }
  });
};

// Schedule weekly reminders (runs every Monday at 9 AM)
const scheduleWeeklyReminders = () => {
  cron.schedule('0 9 * * 1', async () => {
    try {
      const users = await User.find({
        'notifications.email': true,
        'notifications.weeklyGoalReminder': true
      });
      
      for (const user of users) {
        await sendWeeklyReminder(user);
      }
    } catch (error) {
      console.error('Error in weekly reminder cron job:', error);
    }
  });
};

// Schedule interview alerts (runs daily at 8 AM)
const scheduleInterviewAlerts = () => {
  cron.schedule('0 8 * * *', async () => {
    try {
      const users = await User.find({
        'notifications.email': true,
        'goals.interviewPrep.targetDate': { $exists: true, $ne: null }
      });
      
      for (const user of users) {
        // Update days remaining
        const daysRemaining = Math.ceil((new Date(user.goals.interviewPrep.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
        user.goals.interviewPrep.daysRemaining = daysRemaining;
        await user.save();
        
        // Send alert for upcoming interviews
        if (daysRemaining > 0 && daysRemaining <= 30) {
          await sendInterviewAlert(user);
        }
      }
    } catch (error) {
      console.error('Error in interview alert cron job:', error);
    }
  });
};

// Initialize all scheduled jobs
const initializeScheduledJobs = () => {
  scheduleDailyReminders();
  scheduleWeeklyReminders();
  scheduleInterviewAlerts();
  console.log('Notification services initialized');
};

module.exports = {
  sendDailyReminder,
  sendWeeklyReminder,
  sendInterviewAlert,
  initializeScheduledJobs
};