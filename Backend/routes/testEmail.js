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

// Test email endpoint
router.post('/send', async (req, res) => {
  try {
    const { to, subject, html, testResults } = req.body;
    
    if (!to || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to, subject'
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: html || `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">🎯 Test Email from DSA Sheet</h2>
          <p>This is a test email from your DSA Sheet application.</p>
          ${testResults ? `
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>📊 Test Results</h3>
              <p><strong>Score:</strong> ${testResults.score}%</p>
              <p><strong>Correct Answers:</strong> ${testResults.correctAnswers}/${testResults.totalQuestions}</p>
            </div>
          ` : ''}
          <div style="background: #2563eb; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3>🚀 DSA Sheet - Apna College</h3>
            <p>Keep learning and practicing!</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    res.json({
      success: true,
      message: 'Email sent successfully'
    });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
});

module.exports = router;