const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sanitizeForLog, validateEmail } = require('../utils/sanitizer');

const googleAuth = async (req, res) => {
  try {
    const { token, name, email, avatar } = req.body;
    
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