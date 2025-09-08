const nodemailer = require('nodemailer');
const User = require('../models/User');
const cron = require('node-cron');

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send morning motivation email (7:30 AM)
const sendMorningMotivation = async (user) => {
  try {
    const transporter = createTransporter();
    
    const motivationalQuotes = [
      "Success is the sum of small efforts repeated day in and day out. 💪",
      "The expert in anything was once a beginner. Keep going! 🚀",
      "Every problem you solve makes you stronger. 🧠",
      "Consistency beats perfection. Start your DSA journey today! ⭐",
      "Great things never come from comfort zones. Challenge yourself! 🔥",
      "Your only limit is your mind. Push beyond it! 🌟",
      "Dream big, code bigger! Today is your day to shine. ✨",
      "Every expert was once a beginner. Every pro was once an amateur. 🎯",
      "The best time to plant a tree was 20 years ago. The second best time is now! 🌱",
      "Code with passion, solve with purpose! 💻"
    ];
    
    const todayQuote = motivationalQuotes[new Date().getDay() % motivationalQuotes.length];
    
    // Calculate remaining problems
    const dailyTarget = user.goals?.daily?.target || 3;
    const dailyCurrent = user.goals?.daily?.current || 0;
    const dailyRemaining = Math.max(0, dailyTarget - dailyCurrent);
    
    const weeklyTarget = user.goals?.weekly?.target || 20;
    const weeklyCurrent = user.goals?.weekly?.current || 0;
    const weeklyRemaining = Math.max(0, weeklyTarget - weeklyCurrent);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: '🌅 Good Morning! Ready for DSA Practice?',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">🌅 Good Morning, ${user.name}!</h2>
          <p>"${todayQuote}"</p>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">🎯 Today's Goal</h3>
            <p>Target: <strong>${dailyTarget} problems</strong> | Completed: <strong>${dailyCurrent}</strong> | Remaining: <strong>${dailyRemaining}</strong></p>
          </div>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">📊 Weekly Progress</h3>
            <p>Target: <strong>${weeklyTarget} problems</strong> | Completed: <strong>${weeklyCurrent}</strong> | Remaining: <strong>${weeklyRemaining}</strong></p>
            <div style="background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
              <div style="background: #22c55e; height: 100%; width: ${Math.min(100, (weeklyCurrent / weeklyTarget) * 100)}%;"></div>
            </div>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #6b7280;">${Math.round((weeklyCurrent / weeklyTarget) * 100)}% Complete</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://plusdsa-app.netlify.app" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              🚀 Open DSA Sheet
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            Keep up the great work! Consistency is key to mastering DSA.
          </p>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Visit: <a href="https://plusdsa-app.netlify.app" style="color: #3b82f6;">https://plusdsa-app.netlify.app</a>
          </p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Morning motivation sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending morning motivation:', error);
  }
};

// Send 5 PM reminder if daily target not completed
const send5PMReminder = async (user) => {
  try {
    const transporter = createTransporter();
    
    const remaining = (user.goals?.daily?.target || 3) - (user.goals?.daily?.current || 0);
    if (remaining <= 0) return; // Goal already completed
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: '⏰ 5 PM Reminder - Complete Your Daily DSA Goal!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">⏰ Evening Reminder</h2>
          <p>Hi ${user.name},</p>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">🎯 Daily Goal Status</h3>
            <p style="margin: 0; color: #a16207;">You still have <strong>${remaining} problems</strong> remaining to complete today's goal!</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://plusdsa-app.netlify.app" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              🚀 Complete Goal Now
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            Don't let the day end without progress! You've got this! 💪
          </p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`5 PM reminder sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending 5 PM reminder:', error);
  }
};

// Send 10 PM final reminder if daily target not completed
const send10PMReminder = async (user) => {
  try {
    const transporter = createTransporter();
    
    const remaining = (user.goals?.daily?.target || 3) - (user.goals?.daily?.current || 0);
    if (remaining <= 0) return; // Goal already completed
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: '🌙 Final Reminder - Don\'t Miss Your Daily Goal!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">🌙 Final Reminder</h2>
          <p>Hi ${user.name},</p>
          
          <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #dc2626; margin-top: 0;">⚠️ Daily Goal Incomplete</h3>
            <p style="margin: 0; color: #991b1b;">Only <strong>${remaining} problems</strong> left to complete today's goal!</p>
            <p style="margin: 5px 0 0 0; color: #991b1b; font-size: 14px;">Don't break your streak! 🔥</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://plusdsa-app.netlify.app" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              🔥 Finish Strong
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            Consistency is key! Even 1 problem counts. Keep going! 🚀
          </p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`10 PM reminder sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending 10 PM reminder:', error);
  }
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
      subject: '📊 Weekly Progress & Upcoming Contests',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">📊 Weekly Progress Update</h2>
          <p>Hi ${user.name},</p>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">This Week's Progress</h3>
            <p><strong>${user.goals?.weekly?.current || 0}/${user.goals?.weekly?.target || 20} problems</strong> (${weeklyProgress.toFixed(1)}% complete)</p>
            <div style="background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
              <div style="background: #3b82f6; height: 100%; width: ${weeklyProgress}%;"></div>
            </div>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">🏆 Upcoming Contests</h3>
            <ul style="margin: 0; color: #a16207;">
              <li><strong>LeetCode Weekly Contest</strong> - Sunday 8:00 AM</li>
              <li><strong>CodeChef Starters</strong> - Wednesday 8:00 PM</li>
              <li><strong>Codeforces Round</strong> - Check schedule</li>
              <li><strong>AtCoder Beginner Contest</strong> - Saturday 5:00 PM</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://plusdsa-app.netlify.app" style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              🚀 Start New Week
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            New week, new opportunities! Keep coding and stay consistent. 💪
          </p>
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

// Schedule morning motivation email (runs every day at 7:30 AM)
const scheduleMorningEmail = () => {
  cron.schedule('30 7 * * *', async () => {
    try {
      const users = await User.find({
        'notifications.email': true,
        'notifications.dailyReminder': true
      });
      
      for (const user of users) {
        await sendMorningMotivation(user);
      }
    } catch (error) {
      console.error('Error in morning email cron job:', error);
    }
  });
};

// Schedule 5 PM reminder (runs every day at 5 PM)
const schedule5PMReminder = () => {
  cron.schedule('0 17 * * *', async () => {
    try {
      const users = await User.find({
        'notifications.email': true,
        'notifications.dailyReminder': true
      });
      
      for (const user of users) {
        // Fetch fresh user data to check latest progress
        const freshUser = await User.findById(user._id);
        const remaining = (freshUser.goals?.daily?.target || 3) - (freshUser.goals?.daily?.current || 0);
        
        if (remaining > 0) {
          console.log(`5 PM: User ${freshUser.name} has ${remaining} problems remaining`);
          await send5PMReminder(freshUser);
        } else {
          console.log(`5 PM: User ${freshUser.name} already completed daily goal - skipping reminder`);
        }
      }
    } catch (error) {
      console.error('Error in 5 PM reminder cron job:', error);
    }
  });
};

// Schedule 10 PM reminder (runs every day at 10 PM)
const schedule10PMReminder = () => {
  cron.schedule('0 22 * * *', async () => {
    try {
      const users = await User.find({
        'notifications.email': true,
        'notifications.dailyReminder': true
      });
      
      for (const user of users) {
        // Fetch fresh user data to check latest progress
        const freshUser = await User.findById(user._id);
        const remaining = (freshUser.goals?.daily?.target || 3) - (freshUser.goals?.daily?.current || 0);
        
        if (remaining > 0) {
          console.log(`10 PM: User ${freshUser.name} has ${remaining} problems remaining`);
          await send10PMReminder(freshUser);
        } else {
          console.log(`10 PM: User ${freshUser.name} already completed daily goal - skipping reminder`);
        }
      }
    } catch (error) {
      console.error('Error in 10 PM reminder cron job:', error);
    }
  });
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

// Schedule weekly reminders (runs every Sunday at 11:30 PM)
const scheduleWeeklyReminders = () => {
  cron.schedule('30 23 * * 0', async () => {
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
  scheduleMorningEmail();        // 7:30 AM - Morning motivation
  scheduleDailyReminders();      // 9:00 AM - Daily goal reminder
  schedule5PMReminder();         // 5:00 PM - Evening reminder
  schedule10PMReminder();        // 10:00 PM - Final reminder
  scheduleWeeklyReminders();     // Sunday 11:30 PM - Weekly progress
  scheduleInterviewAlerts();     // 8:00 AM - Interview alerts
  console.log('All notification services initialized:');
  console.log('  - Morning motivation: 7:30 AM daily');
  console.log('  - Daily reminders: 9:00 AM daily');
  console.log('  - Evening reminders: 5:00 PM daily (if incomplete)');
  console.log('  - Final reminders: 10:00 PM daily (if incomplete)');
  console.log('  - Weekly progress: Sunday 11:30 PM');
  console.log('  - Interview alerts: 8:00 AM daily');
};

module.exports = {
  sendMorningMotivation,
  send5PMReminder,
  send10PMReminder,
  sendDailyReminder,
  sendWeeklyReminder,
  sendInterviewAlert,
  initializeScheduledJobs
};