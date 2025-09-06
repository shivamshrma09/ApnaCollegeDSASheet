const cron = require('node-cron');
const contestService = require('./contestService');

class ContestScheduler {
  constructor() {
    this.job = null;
  }

  start() {
    // Update contests every 30 minutes
    this.job = cron.schedule('*/30 * * * *', async () => {
      try {
        console.log('🔄 Updating contests...');
        await contestService.updateContests();
        console.log('✅ Contests updated successfully');
      } catch (error) {
        console.error('❌ Error updating contests:', error);
      }
    });

    // Initial update
    this.updateContests();
    
    console.log('📅 Contest scheduler started - updates every 30 minutes');
  }

  stop() {
    if (this.job) {
      this.job.destroy();
      console.log('🛑 Contest scheduler stopped');
    }
  }

  async updateContests() {
    try {
      await contestService.updateContests();
    } catch (error) {
      console.error('Error in initial contest update:', error);
    }
  }
}

module.exports = new ContestScheduler();