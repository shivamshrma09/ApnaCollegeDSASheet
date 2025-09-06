const nodemailer = require('nodemailer');
const User = require('../models/User');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ Email credentials missing in environment variables');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const getDailyProgress = (user, sheetType = 'apnaCollege') => {
  const dailyTarget = user.goals?.daily?.target || 3;
  const dailyCurrent = user.goals?.daily?.current || 0;
  const sheetData = user.sheetProgress?.[sheetType] || {};
  const completedProblems = sheetData.completedProblems || [];
  
  // Check if goal completed today (simplified)
  const isGoalCompleted = dailyCurrent >= dailyTarget;
  const remaining = Math.max(0, dailyTarget - dailyCurrent);
  
  return {
    dailyTarget,
    dailyCurrent,
    remaining,
    isGoalCompleted,
    totalSolved: completedProblems.length,
    streak: sheetData.streak || 0
  };
};

const generateEveningReminderHTML = (user, progress) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #2563eb; text-align: center; margin-bottom: 10px; }
        h2 { color: #1f2937; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 25px; }
        .header-info { text-align: center; color: #666; margin-bottom: 20px; }
        .param { margin: 8px 0; }
        .param-name { color: #333; font-size: 14px; }
        .param-score { color: #2563eb; font-weight: bold; }
        .strength { color: #059669; margin: 5px 0; }
        .improvement { color: #dc2626; margin: 5px 0; }
        .section { margin: 15px 0; padding: 15px; border-left: 3px solid #2563eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://raw.githubusercontent.com/shivamshrma09/ApnaCollegeDSASheet/main/frontend/public/light.png" alt="+DSA Logo" style="width: 120px; height: auto; margin-bottom: 10px;" />
        </div>
        <h1>Evening Reminder</h1>
        <div class="header-info">
          <strong>Hi ${user.name}!</strong><br>
          <small>Time to complete your daily goal - ${new Date().toLocaleDateString()}</small>
        </div>
        
        <div class="section">
          <h2>Daily Goal Status</h2>
          <div class="param">
            <span class="param-name">Daily Target:</span> 
            <span class="param-score">${progress.dailyTarget} problems</span>
          </div>
          <div class="param">
            <span class="param-name">Completed Today:</span> 
            <span class="param-score">${progress.dailyCurrent}/${progress.dailyTarget}</span>
          </div>
          ${!progress.isGoalCompleted ? `
          <div class="param">
            <span class="param-name">Remaining:</span> 
            <span class="param-score" style="color: #dc2626;">${progress.remaining} problems</span>
          </div>
          ` : ''}
        </div>

        ${!progress.isGoalCompleted ? `
        <div class="section">
          <h2>Reminder</h2>
          <div class="improvement">• You still have ${progress.remaining} problems left to complete your daily goal!</div>
          <div class="strength">• Just ${progress.remaining} more problems and you'll maintain your streak of ${progress.streak} days!</div>
          <div class="strength">• Evening is a great time to focus and solve problems</div>
          <div class="strength">• Complete your goal before 11 PM to avoid the final reminder</div>
        </div>
        ` : `
        <div class="section">
          <h2>Congratulations!</h2>
          <div class="strength">• Great job! You've already completed your daily goal!</div>
          <div class="strength">• Your streak of ${progress.streak} days is safe!</div>
          <div class="strength">• Keep up the excellent work!</div>
        </div>
        `}

        <div class="section">
          <h2>Quick Stats</h2>
          <div class="param">
            <span class="param-name">Current Streak:</span> 
            <span class="param-score">${progress.streak} days</span>
          </div>
          <div class="param">
            <span class="param-name">Total Problems Solved:</span> 
            <span class="param-score">${progress.totalSolved}</span>
          </div>
        </div>

        <p style="text-align: center; color: #666; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">+DSA</p>
      </div>
    </body>
    </html>
  `;
};

const generateNightReminderHTML = (user, progress) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #dc2626; text-align: center; margin-bottom: 10px; }
        h2 { color: #1f2937; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 25px; }
        .header-info { text-align: center; color: #666; margin-bottom: 20px; }
        .param { margin: 8px 0; }
        .param-name { color: #333; font-size: 14px; }
        .param-score { color: #2563eb; font-weight: bold; }
        .strength { color: #059669; margin: 5px 0; }
        .improvement { color: #dc2626; margin: 5px 0; }
        .section { margin: 15px 0; padding: 15px; border-left: 3px solid #dc2626; }
      </style>
    </head>
    <body>
      <div class="container">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://raw.githubusercontent.com/shivamshrma09/ApnaCollegeDSASheet/main/frontend/public/light.png" alt="+DSA Logo" style="width: 120px; height: auto; margin-bottom: 10px;" />
        </div>
        <h1>Final Reminder</h1>
        <div class="header-info">
          <strong>Hi ${user.name}!</strong><br>
          <small>Last chance to complete today's goal - ${new Date().toLocaleDateString()}</small>
        </div>
        
        <div class="section">
          <h2>Daily Goal Status</h2>
          <div class="param">
            <span class="param-name">Daily Target:</span> 
            <span class="param-score">${progress.dailyTarget} problems</span>
          </div>
          <div class="param">
            <span class="param-name">Completed Today:</span> 
            <span class="param-score">${progress.dailyCurrent}/${progress.dailyTarget}</span>
          </div>
          ${!progress.isGoalCompleted ? `
          <div class="param">
            <span class="param-name">Still Need:</span> 
            <span class="param-score" style="color: #dc2626;">${progress.remaining} problems</span>
          </div>
          ` : ''}
        </div>

        ${!progress.isGoalCompleted ? `
        <div class="section">
          <h2>Urgent Reminder</h2>
          <div class="improvement">• Only ${progress.remaining} problems left to complete your daily goal!</div>
          <div class="improvement">• Don't break your ${progress.streak}-day streak!</div>
          <div class="strength">• Even 1 problem is better than 0 - maintain consistency</div>
          <div class="strength">• Quick solve: Pick an easy problem and get started</div>
          <div class="improvement">• Tomorrow's you will thank today's effort!</div>
        </div>
        ` : `
        <div class="section">
          <h2>Well Done!</h2>
          <div class="strength">• Excellent! You completed your daily goal!</div>
          <div class="strength">• Your ${progress.streak}-day streak is maintained!</div>
          <div class="strength">• Consistency is the key to mastering DSA!</div>
        </div>
        `}

        <div class="section">
          <h2>Progress Summary</h2>
          <div class="param">
            <span class="param-name">Current Streak:</span> 
            <span class="param-score">${progress.streak} days</span>
          </div>
          <div class="param">
            <span class="param-name">Total Problems Solved:</span> 
            <span class="param-score">${progress.totalSolved}</span>
          </div>
          <div class="param">
            <span class="param-name">Goal Completion:</span> 
            <span class="param-score" style="color: ${progress.isGoalCompleted ? '#059669' : '#dc2626'};">
              ${progress.isGoalCompleted ? 'Completed ✅' : 'Incomplete ❌'}
            </span>
          </div>
        </div>

        <p style="text-align: center; color: #666; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">+DSA</p>
      </div>
    </body>
    </html>
  `;
};

const sendEveningReminder = async (user, sheetType = 'apnaCollege') => {
  try {
    const progress = getDailyProgress(user, sheetType);
    
    // Only send if goal not completed
    if (progress.isGoalCompleted) {
      console.log(`✅ ${user.email} - Daily goal already completed, skipping evening reminder`);
      return true;
    }
    
    const emailHTML = generateEveningReminderHTML(user, progress);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `🎯 Evening Reminder - ${progress.remaining} problems left to complete your daily goal!`,
      html: emailHTML
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Evening reminder sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send evening reminder to ${user.email}:`, error);
    return false;
  }
};

const sendNightReminder = async (user, sheetType = 'apnaCollege') => {
  try {
    const progress = getDailyProgress(user, sheetType);
    
    // Send to everyone (completed or not)
    const emailHTML = generateNightReminderHTML(user, progress);
    
    const subject = progress.isGoalCompleted 
      ? `🎉 Daily Goal Completed - Well done ${user.name}!`
      : `⚠️ Final Reminder - ${progress.remaining} problems left! Don't break your streak!`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: subject,
      html: emailHTML
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Night reminder sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send night reminder to ${user.email}:`, error);
    return false;
  }
};

const sendEveningRemindersToAllUsers = async () => {
  try {
    const users = await User.find({});
    console.log(`🌆 Sending evening reminders to ${users.length} users...`);
    
    let successCount = 0;
    let failCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      const progress = getDailyProgress(user);
      if (progress.isGoalCompleted) {
        skippedCount++;
        continue;
      }
      
      const success = await sendEveningReminder(user);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`🎉 Evening reminders completed: ${successCount} sent, ${failCount} failed, ${skippedCount} skipped (goal completed)`);
    return { successCount, failCount, skippedCount };
  } catch (error) {
    console.error('❌ Evening reminder service failed:', error);
    return { successCount: 0, failCount: 0, skippedCount: 0 };
  }
};

const sendNightRemindersToAllUsers = async () => {
  try {
    const users = await User.find({});
    console.log(`🌙 Sending night reminders to ${users.length} users...`);
    
    let successCount = 0;
    let failCount = 0;

    for (const user of users) {
      const success = await sendNightReminder(user);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`🎉 Night reminders completed: ${successCount} sent, ${failCount} failed`);
    return { successCount, failCount };
  } catch (error) {
    console.error('❌ Night reminder service failed:', error);
    return { successCount: 0, failCount: 0 };
  }
};

module.exports = {
  sendEveningReminder,
  sendNightReminder,
  sendEveningRemindersToAllUsers,
  sendNightRemindersToAllUsers,
  generateEveningReminderHTML,
  generateNightReminderHTML
};