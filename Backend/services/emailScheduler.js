const cron = require('node-cron');
const { sendWeeklyEmailsToAllUsers, sendWeeklyEmail } = require('./weeklyEmailService');

// Schedule weekly emails every Sunday at 11 PM
const scheduleWeeklyEmails = () => {
  // Cron format: second minute hour day month dayOfWeek
  // 0 0 23 * * 0 = Every Sunday at 11:00 PM
  cron.schedule('0 0 23 * * 0', async () => {
    console.log('🕚 Starting weekly email dispatch at 11 PM Sunday...');
    await sendWeeklyEmailsToAllUsers();
    console.log('✅ Weekly email dispatch completed');
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata" // IST timezone
  });

  console.log('📅 Weekly email scheduler initialized (Sundays 11 PM IST)');
};

// Manual trigger for testing
const triggerWeeklyEmails = async () => {
  console.log('🔄 Manually triggering weekly emails...');
  await sendWeeklyEmailsToAllUsers();
};

module.exports = {
  scheduleWeeklyEmails,
  triggerWeeklyEmails,
  sendWeeklyEmail
};