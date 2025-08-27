const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function testGoogleAuth() {
  try {
    console.log('Testing Google OAuth configuration...');
    console.log('Client ID:', process.env.GOOGLE_CLIENT_ID);
    
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error('GOOGLE_CLIENT_ID not found in environment variables');
    }
    
    console.log('✅ Google OAuth Client initialized successfully');
    console.log('✅ Configuration looks good!');
    
  } catch (error) {
    console.error('❌ Google OAuth configuration error:', error.message);
  }
}

testGoogleAuth();