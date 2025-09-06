const cron = require('node-cron');
const { sendDailyEmailsToAllUsers } = require('../services/dailyEmailService');

const setupDailyEmailCron = () => {
  // Schedule daily emails at 7:30 AM IST (2:00 AM UTC)
  cron.schedule('30 2 * * *', async () => {
    console.log('🌅 Starting daily morning email job at 7:30 AM IST...');
    try {
      await sendDailyEmailsToAllUsers();
      console.log('✅ Daily morning emails completed successfully');
    } catch (error) {
      console.error('❌ Daily email job failed:', error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata"
  });

  console.log('📧 Daily morning email cron job scheduled for 7:30 AM IST');
};

module.exports = { setupDailyEmailCron };