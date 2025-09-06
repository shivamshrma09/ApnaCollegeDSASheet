const nodemailer = require('nodemailer');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test email configuration
const testEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready');
    return true;
  } catch (error) {
    console.error('❌ Email service error:', error.message);
    return false;
  }
};

// Send interview completion notification
const sendInterviewCompletionEmail = async (userEmail, userName, analysisData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `🎯 Your Mock Interview Analysis is Ready!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #1E90FF 0%, #0066CC 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🎯 Interview Analysis Complete!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your detailed performance report is ready</p>
          </div>
          
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #1f2937;">
              <strong>Hi ${userName},</strong>
            </p>
            
            <p style="color: #6b7280; line-height: 1.6;">
              Thank you for completing your mock interview! We've analyzed your performance across 10 key parameters and generated a comprehensive report with personalized feedback.
            </p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #1E90FF;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0;">📊 Your Performance Snapshot</h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <div style="text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; color: #1E90FF;">${analysisData.overallScore}/100</div>
                  <div style="font-size: 12px; color: #6b7280;">Overall Score</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 16px; font-weight: bold; color: #10b981;">${analysisData.salaryPrediction?.range || '₹8-12 LPA'}</div>
                  <div style="font-size: 12px; color: #6b7280;">Salary Prediction</div>
                </div>
              </div>
            </div>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <h4 style="color: #1f2937; margin: 0 0 10px 0;">✨ Key Highlights:</h4>
              <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
                <li>10-parameter detailed analysis</li>
                <li>Personalized improvement roadmap</li>
                <li>Salary prediction based on performance</li>
                <li>Question-wise feedback and scoring</li>
                <li>Interview readiness assessment</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173" style="background: linear-gradient(135deg, #1E90FF 0%, #0066CC 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                View Full Report 📋
              </a>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>💡 Pro Tip:</strong> The detailed analysis includes specific recommendations for each question. Review them to improve your interview performance!
              </p>
            </div>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
            <p style="margin: 0;">Keep practicing and growing! 🚀</p>
            <p style="margin: 5px 0 0 0;">DSA Sheet - Mock Interview System</p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ Interview analysis email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending interview email:', error);
    return false;
  }
};

module.exports = {
  testEmailConnection,
  sendInterviewCompletionEmail
};