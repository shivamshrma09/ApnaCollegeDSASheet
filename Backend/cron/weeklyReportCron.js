const cron = require('node-cron');
const { sendWeeklyReportsToAllUsers } = require('../services/weeklyReportEmailService');

const setupWeeklyReportCron = () => {
  // Run every Sunday at 11:30 PM
  cron.schedule('30 23 * * 0', async () => {
    console.log('📊 Running weekly report email cron job at 11:30 PM...');
    
    try {
      const result = await sendWeeklyReportsToAllUsers();
      console.log(`📧 Weekly report cron completed: ${result.successCount} sent, ${result.failCount} failed`);
    } catch (error) {
      console.error('❌ Weekly report cron job failed:', error);
    }
  }, {
    timezone: "Asia/Kolkata" // Indian Standard Time
  });

  console.log('⏰ Weekly report cron job scheduled (Sunday 11:30 PM IST)');
};

module.exports = { setupWeeklyReportCron };