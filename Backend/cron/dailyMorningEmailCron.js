const cron = require('node-cron');
const { sendDailyMorningEmailsToAllUsers } = require('../services/dailyMorningEmailService');

const setupDailyMorningEmailCron = () => {
  // Run every day at 7:30 AM
  cron.schedule('30 7 * * *', async () => {
    console.log('🌅 Running daily morning email cron job at 7:30 AM...');
    
    try {
      const result = await sendDailyMorningEmailsToAllUsers();
      console.log(`📧 Morning email cron completed: ${result.successCount} sent, ${result.failCount} failed`);
    } catch (error) {
      console.error('❌ Daily morning email cron job failed:', error);
    }
  }, {
    timezone: "Asia/Kolkata" // Indian Standard Time
  });

  console.log('⏰ Daily morning email cron job scheduled (7:30 AM IST)');
};

module.exports = { setupDailyMorningEmailCron };