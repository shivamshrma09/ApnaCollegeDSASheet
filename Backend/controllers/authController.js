const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { sanitizeForLog, validateEmail } = require('../utils/sanitizer');

const client = new OAuth2Client('650760834469-56i14787333t7i8lnh7ooo4t98g9a4q9.apps.googleusercontent.com');

const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Google token is required' });
    }
    
    // Verify Google token
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: token,
        audience: '650760834469-56i14787333t7i8lnh7ooo4t98g9a4q9.apps.googleusercontent.com'
      });
    } catch (verifyError) {
      console.error('Google token verification failed:', verifyError.message);
      return res.status(400).json({ error: 'Invalid Google token' });
    }
    
    const payload = ticket.getPayload();
    const { name, email, picture } = payload;
    
    if (!email || !name) {
      return res.status(400).json({ error: 'Invalid Google account data' });
    }
    
    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Create new user
      user = new User({
        name,
        email: email.toLowerCase(),
        password: Math.random().toString(36).slice(-8) + 'Aa1!', // Random secure password
        googleId: payload.sub,
        avatar: picture || ''
      });
      await user.save();
      console.log('✅ New Google user created:', email);
    } else {
      // Update existing user's info
      if (picture && picture !== user.avatar) {
        user.avatar = picture;
        await user.save();
      }
      console.log('✅ Existing Google user logged in:', email);
    }
    
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Google auth error:', sanitizeForLog(error.message));
    res.status(500).json({ error: 'Google authentication failed' });
  }
};

const quickGoogleAuth = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user
      user = new User({
        name,
        email,
        password: Math.random().toString(36).slice(-8) + 'Aa1!', // Random secure password
        googleId: `google_${Date.now()}`,
        avatar: avatar || ''
      });
      await user.save();
    } else {
      // Update existing user's avatar if provided
      if (avatar) {
        user.avatar = avatar;
        await user.save();
      }
    }
    
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Quick Google auth error:', sanitizeForLog(error.message));
    res.status(500).json({ error: 'Quick Google authentication failed' });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Get profile error:', sanitizeForLog(error.message));
    res.status(500).json({ error: 'Failed to get user profile' });
  }
};

module.exports = {
  googleAuth,
  quickGoogleAuth,
  getUserProfile
};