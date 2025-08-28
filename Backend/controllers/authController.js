const jwt = require('jsonwebtoken');
const User = require('../models/User');

const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    // In a real implementation, you would verify the Google token here
    // For now, we'll create a simple response
    
    const demoUser = {
      name: 'Google User',
      email: 'user@gmail.com',
      googleId: 'google123'
    };
    
    const jwtToken = jwt.sign({ userId: 'demo123' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token: jwtToken,
      user: {
        id: 'demo123',
        name: demoUser.name,
        email: demoUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Google authentication failed' });
  }
};

const quickGoogleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const jwtToken = jwt.sign({ userId: 'quick123' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token: jwtToken,
      user: {
        id: 'quick123',
        name,
        email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Quick Google authentication failed' });
  }
};

module.exports = {
  googleAuth,
  quickGoogleAuth
};