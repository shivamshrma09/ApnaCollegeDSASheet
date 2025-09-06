const cron = require('node-cron');
const { sendWeeklyAnalysisToAllUsers } = require('../services/weeklyAnalysisService');

const setupWeeklyAnalysisCron = () => {
  // Schedule weekly analysis emails every Sunday at 11:30 PM IST (6:00 PM UTC)
  cron.schedule('30 18 * * 0', async () => {
    console.log('📊 Starting weekly analysis email job at 11:30 PM IST...');
    try {
      await sendWeeklyAnalysisToAllUsers();
      console.log('✅ Weekly analysis emails completed successfully');
    } catch (error) {
      console.error('❌ Weekly analysis email job failed:', error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata"
  });

  console.log('📧 Weekly analysis email cron job scheduled for every Sunday 11:30 PM IST');
};

module.exports = { setupWeeklyAnalysisCron };