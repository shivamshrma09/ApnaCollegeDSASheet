const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Mock interview email endpoint
router.post('/send', async (req, res) => {
  try {
    const { to, interviewResults, userProfile } = req.body;
    
    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">🎤 Mock Interview Results</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>📊 Interview Performance</h3>
          ${interviewResults ? `
            <p><strong>Overall Score:</strong> ${interviewResults.score || 'N/A'}/100</p>
            <p><strong>Technical Skills:</strong> ${interviewResults.technicalScore || 'N/A'}/10</p>
            <p><strong>Communication:</strong> ${interviewResults.communicationScore || 'N/A'}/10</p>
            <p><strong>Problem Solving:</strong> ${interviewResults.problemSolvingScore || 'N/A'}/10</p>
            <p><strong>Duration:</strong> ${interviewResults.duration || 'N/A'} minutes</p>
          ` : '<p>Interview completed successfully!</p>'}
        </div>

        ${interviewResults?.feedback ? `
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>💡 AI Feedback</h3>
            <p>${interviewResults.feedback}</p>
          </div>
        ` : ''}

        ${interviewResults?.recommendations ? `
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>🎯 Recommendations</h3>
            <ul>
              ${interviewResults.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div style="background: #2563eb; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3>🚀 Keep Practicing!</h3>
          <p>Continue improving with DSA Sheet - Apna College</p>
          <p>Schedule your next mock interview to track progress!</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: '🎤 Mock Interview Results - DSA Sheet',
      html: emailHtml
    });
    
    res.json({
      success: true,
      message: 'Interview results email sent successfully'
    });
  } catch (error) {
    console.error('Interview email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send interview results email',
      error: error.message
    });
  }
});

module.exports = router;