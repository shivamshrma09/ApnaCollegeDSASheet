const express = require('express');
const { sendInterviewCompletionEmail } = require('../services/interviewEmailService');
const router = express.Router();

// Test email endpoint
router.post('/test-interview-email', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    const mockAnalysisData = {
      overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
      salaryPrediction: {
        range: '₹12-18 LPA',
        reasoning: 'Based on performance analysis and market standards'
      },
      strengths: ['Clear communication', 'Strong problem-solving approach', 'Good technical knowledge'],
      improvementAreas: ['System design concepts', 'Advanced algorithms'],
      interviewReadiness: 'Good - Ready for technical interviews'
    };
    
    const success = await sendInterviewCompletionEmail(
      email || 'test@example.com',
      name || 'Test User',
      mockAnalysisData
    );
    
    if (success) {
      res.json({ 
        success: true, 
        message: 'Test interview email sent successfully!' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send test email' 
      });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending test email',
      error: error.message 
    });
  }
});

module.exports = router;