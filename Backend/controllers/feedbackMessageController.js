const User = require('../models/User');

// Check if user should see feedback message today
const checkFeedbackMessage = async (req, res) => {
  try {
    const userId = req.headers.userid || '68ba7187488b0b8b3f463c04';
    const user = await User.findById(userId);
    
    if (!user) {
      return res.json({ shouldShow: false });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastShownDate = user.feedbackMessage?.lastShownDate;
    
    // Check if message should be shown today
    let shouldShow = true;
    
    if (lastShownDate) {
      const lastShown = new Date(lastShownDate);
      lastShown.setHours(0, 0, 0, 0);
      
      // If message was already shown today, don't show again
      if (lastShown.getTime() === today.getTime()) {
        shouldShow = false;
      }
    }
    
    res.json({ shouldShow });
  } catch (error) {
    console.error('Check feedback message error:', error);
    res.status(500).json({ error: 'Failed to check feedback message status' });
  }
};

// Mark feedback message as seen for today
const markFeedbackMessageSeen = async (req, res) => {
  try {
    const userId = req.headers.userid || '68ba7187488b0b8b3f463c04';
    const today = new Date();
    
    await User.findByIdAndUpdate(userId, {
      'feedbackMessage.lastShownDate': today
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Mark feedback message seen error:', error);
    res.status(500).json({ error: 'Failed to mark feedback message as seen' });
  }
};

module.exports = {
  checkFeedbackMessage,
  markFeedbackMessageSeen
};