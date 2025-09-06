const cron = require('node-cron');
const { sendEveningRemindersToAllUsers, sendNightRemindersToAllUsers } = require('../services/dailyReminderEmailService');

const setupDailyReminderCron = () => {
  // Evening reminder at 5:00 PM IST
  cron.schedule('0 17 * * *', async () => {
    console.log('🌆 Running evening reminder cron job at 5:00 PM...');
    
    try {
      const result = await sendEveningRemindersToAllUsers();
      console.log(`📧 Evening reminder cron completed: ${result.successCount} sent, ${result.failCount} failed, ${result.skippedCount} skipped`);
    } catch (error) {
      console.error('❌ Evening reminder cron job failed:', error);
    }
  }, {
    timezone: "Asia/Kolkata"
  });

  // Night reminder at 11:00 PM IST
  cron.schedule('0 23 * * *', async () => {
    console.log('🌙 Running night reminder cron job at 11:00 PM...');
    
    try {
      const result = await sendNightRemindersToAllUsers();
      console.log(`📧 Night reminder cron completed: ${result.successCount} sent, ${result.failCount} failed`);
    } catch (error) {
      console.error('❌ Night reminder cron job failed:', error);
    }
  }, {
    timezone: "Asia/Kolkata"
  });

  console.log('⏰ Daily reminder cron jobs scheduled:');
  console.log('   - Evening reminders: 5:00 PM IST (incomplete goals only)');
  console.log('   - Night reminders: 11:00 PM IST (all users)');
};

module.exports = { setupDailyReminderCron };