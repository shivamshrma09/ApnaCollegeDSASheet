const nodemailer = require('nodemailer');
require('dotenv').config();

const testEmail = async () => {
  try {
    console.log('🔍 Testing email configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set ✅' : 'Not Set ❌');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection verified!');

    const testMail = {
      from: process.env.EMAIL_USER,
      to: 'shivamsharma27107@gmail.com',
      subject: '🎯 Test Email - DSA Mock Interview System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1E90FF; text-align: center;">✅ Email Test Successful!</h2>
          <p>Your DSA Mock Interview email system is working properly.</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Status:</strong> Email configuration is working ✅</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This is a test email from your DSA Mock Interview System.</p>
        </div>
      `
    };

    const result = await transporter.sendMail(testMail);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📬 Check your inbox at: shivamsharma27107@gmail.com');
    return true;
  } catch (error) {
    console.log('❌ Email test failed:');
    console.log('Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('🔑 Authentication failed - Check your email credentials');
    } else if (error.code === 'ENOTFOUND') {
      console.log('🌐 Network error - Check your internet connection');
    }
    return false;
  }
};

testEmail();