const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Basic middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date() });
});

// Basic routes to prevent errors
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: 'dummy-token' });
});

app.get('/api/feedback-message/check', (req, res) => {
  res.json({ hasMessage: false });
});

app.get('/api/spaced-repetition/due', (req, res) => {
  res.json({ dueProblems: [] });
});

app.get('/api/spaced-repetition/all', (req, res) => {
  res.json({ problems: [] });
});

app.get('/api/sheets/user/:userId/all-progress', (req, res) => {
  res.json({ allProgress: {} });
});

app.get('/api/goals', (req, res) => {
  res.json({ goals: {} });
});

app.get('/api/progress/:userId/stats', (req, res) => {
  res.json({ stats: {} });
});

app.get('/api/leaderboard/global', (req, res) => {
  res.json({ leaderboard: [] });
});

app.get('/api/leaderboard/rank/:userId', (req, res) => {
  res.json({ rank: null, score: 0 });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/dsa-sheet')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err.message));

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});