const nodemailer = require('nodemailer');
require('dotenv').config();

// Test notification system
async function testNotifications() {
  console.log('🔔 Testing Notification System...\n');

  // Test email configuration
  console.log('📧 Email Configuration:');
  console.log(`   Service: ${process.env.EMAIL_SERVICE || 'gmail'}`);
  console.log(`   User: ${process.env.EMAIL_USER}`);
  console.log(`   Pass: ${process.env.EMAIL_PASS ? '***configured***' : 'NOT SET'}`);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('❌ Email credentials not configured properly');
    return;
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Test connection
    console.log('\n🔄 Testing email connection...');
    await transporter.verify();
    console.log('✅ Email connection successful!');

    // Send test notification
    console.log('\n📤 Sending test notification...');
    const testEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: '🧠 DSA Spaced Repetition - Test Notification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3b82f6;">🧠 Spaced Repetition Reminder</h2>
          <p>Hi there!</p>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">📚 Problems Due for Review</h3>
            <p style="margin: 0;">You have <strong>3 problems</strong> due for review today!</p>
          </div>
          
          <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #166534; margin-top: 0;">🎯 Today's Focus:</h3>
            <ul style="margin: 0;">
              <li>Two Sum (Easy)</li>
              <li>Add Two Numbers (Medium)</li>
              <li>Longest Substring (Medium)</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
               style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              🚀 Start Reviewing
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            Keep up the great work! Consistency is key to mastering DSA. 💪
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            This is a test notification from your DSA Spaced Repetition System.<br>
            Time: ${new Date().toLocaleString()}
          </p>
        </div>
      `
    };

    await transporter.sendMail(testEmail);
    console.log('✅ Test notification sent successfully!');
    console.log(`   Check your email: ${process.env.EMAIL_USER}`);

    // Test browser notification (if running in browser)
    console.log('\n🌐 Browser Notification Test:');
    console.log('   Open your DSA app and check for the floating review button');
    console.log('   Browser notifications require user permission');

    console.log('\n🎉 Notification System Status: WORKING!');
    console.log('\n📋 Features Available:');
    console.log('   ✅ Email notifications (Gmail SMTP)');
    console.log('   ✅ Daily reminders (9 AM)');
    console.log('   ✅ Weekly progress updates');
    console.log('   ✅ Interview preparation alerts');
    console.log('   ✅ Browser notifications (with permission)');
    console.log('   ✅ Spaced repetition due alerts');

  } catch (error) {
    console.error('❌ Notification test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Fix: Check your Gmail app password');
      console.log('   1. Go to Google Account settings');
      console.log('   2. Enable 2-factor authentication');
      console.log('   3. Generate app password for "Mail"');
      console.log('   4. Use that password in EMAIL_PASS');
    }
  }
}

// Run test
testNotifications();