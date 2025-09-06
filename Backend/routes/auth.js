const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { validateUserInput, validateLoginInput } = require('../utils/validation');
const { googleAuth, quickGoogleAuth, getUserProfile } = require('../controllers/authController');
const { sanitizeForLog } = require('../utils/sanitizer');

const router = express.Router();

router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    console.log('📝 Register request received:', sanitizeForLog(JSON.stringify(req.body)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', sanitizeForLog(JSON.stringify(errors.array())));
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, email, password } = req.body;

    // Skip enhanced validation for now to avoid conflicts
    // const validation = validateUserInput(name, email, password);
    // if (!validation.isValid) {
    //   return res.status(400).json({ error: validation.errors[0] });
    // }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Register error:', sanitizeForLog(error.message));
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    console.log('🔐 Login request received:', sanitizeForLog(JSON.stringify(req.body)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Login validation errors:', sanitizeForLog(JSON.stringify(errors.array())));
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    // Skip enhanced validation for now
    // const validation = validateLoginInput(email, password);
    // if (!validation.isValid) {
    //   return res.status(400).json({ error: validation.errors[0] });
    // }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    console.log('🔍 User found:', user ? 'Yes' : 'No');
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    console.log('🔑 Password match:', isMatch ? 'Yes' : 'No');
    if (!isMatch) {
      console.log('❌ Password mismatch for user:', user.email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('✅ Login successful for user:', user.email);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Login error:', sanitizeForLog(error.message));
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/google', googleAuth);
router.post('/quick-google', quickGoogleAuth);
router.post('/github', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'GitHub authorization code is required' });
    }
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID || 'Ov23liJ2EJqT6I1U83AK',
        client_secret: process.env.GITHUB_CLIENT_SECRET || 'your-github-client-secret',
        code
      })
    });
    
    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      return res.status(400).json({ error: 'GitHub token exchange failed' });
    }
    
    // Get user data from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${tokenData.access_token}`,
        'User-Agent': 'PlusDSA-App'
      }
    });
    
    const userData = await userResponse.json();
    
    if (!userData.id) {
      return res.status(400).json({ error: 'Failed to get GitHub user data' });
    }
    
    // Get user email if not public
    let email = userData.email;
    if (!email) {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `token ${tokenData.access_token}`,
          'User-Agent': 'PlusDSA-App'
        }
      });
      const emails = await emailResponse.json();
      const primaryEmail = emails.find(e => e.primary);
      email = primaryEmail ? primaryEmail.email : null;
    }
    
    if (!email) {
      return res.status(400).json({ error: 'GitHub account must have a public email' });
    }
    
    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Create new user
      user = new User({
        name: userData.name || userData.login,
        email: email.toLowerCase(),
        password: Math.random().toString(36).slice(-8) + 'Aa1!',
        githubId: userData.id.toString(),
        avatar: userData.avatar_url || ''
      });
      await user.save();
      console.log('✅ New GitHub user created:', email);
    } else {
      // Update existing user
      if (userData.avatar_url && userData.avatar_url !== user.avatar) {
        user.avatar = userData.avatar_url;
        await user.save();
      }
      console.log('✅ Existing GitHub user logged in:', email);
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('GitHub auth error:', error.message);
    res.status(500).json({ error: 'GitHub authentication failed' });
  }
});

router.get('/me', auth, getUserProfile);

// Test route for auth
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes working', timestamp: new Date() });
});

// Simple register without validation (for testing)
router.post('/simple-register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = new User({ name, email: email.toLowerCase(), password });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Simple register error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Simple login without validation (for testing)
router.post('/simple-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Simple login error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get all users for chat
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find({}, 'name email _id').lean();
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', sanitizeForLog(error.message));
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;