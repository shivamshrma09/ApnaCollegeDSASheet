const mongoose = require('mongoose');

async function directUpdate() {
  try {
    await mongoose.connect('mongodb://localhost:27017/dsa-sheet');
    console.log('Connected to MongoDB');
    
    const userId = '68ba7187488b0b8b3f463c04';
    const completedProblems = [14, 13, 3, 1, 2, 17];
    
    // Create spaced repetition data
    const spacedRepetitionData = completedProblems.map((problemId, index) => {
      const intervals = [0, 1, 3, 7, 14, 30]; // today, tomorrow, 3 days, 1 week, 2 weeks, 1 month
      const intervalDays = intervals[index % intervals.length];
      
      return {
        problemId: problemId.toString(),
        nextReviewDate: new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000),
        interval: intervalDays || 1,
        repetitions: 0,
        easeFactor: 2.5,
        quality: 3,
        lastReviewDate: new Date()
      };
    });
    
    // Direct MongoDB update
    const result = await mongoose.connection.db.collection('users').updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { 
        $set: { 
          'sheetProgress.apnaCollege.spacedRepetition': spacedRepetitionData
        }
      }
    );
    
    console.log('Update result:', result);
    console.log('✅ Spaced repetition data updated directly!');
    
    // Verify
    const user = await mongoose.connection.db.collection('users').findOne(
      { _id: new mongoose.Types.ObjectId(userId) }
    );
    
    console.log('Verification - Spaced repetition count:', 
      user?.sheetProgress?.apnaCollege?.spacedRepetition?.length || 0);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

directUpdate();