require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5000"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Simple rate limiting for AI requests
const aiRequestTracker = new Map();
const AI_RATE_LIMIT = 2; // requests per minute (reduced)
const AI_WINDOW = 60000; // 1 minute
let globalRequestCount = 0;
let globalWindowStart = Date.now();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000', 'http://127.0.0.1:5173'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'userid', 'X-CSRF-Token'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/dsa-sheet', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Import routes
const mockInterviewRoutes = require('./routes/mockInterview');
const authRoutes = require('./routes/auth');
const sheetsRoutes = require('./routes/sheets');
const progressRoutes = require('./routes/progress');
const spacedRepetitionRoutes = require('./routes/spaced-repetition');
const customSpacedRepetitionRoutes = require('./routes/custom-spaced-repetition');
const { setupSpacedRepetitionCron } = require('./cron/spacedRepetitionCron');
const { setupDailyEmailCron } = require('./cron/dailyEmailCron');
const { setupWeeklyAnalysisCron } = require('./cron/weeklyAnalysisCron');
const { setupDailyMorningEmailCron } = require('./cron/dailyMorningEmailCron');
const { setupWeeklyReportCron } = require('./cron/weeklyReportCron');
const { setupDailyReminderCron } = require('./cron/dailyReminderCron');
const feedbackMessageRoutes = require('./routes/feedbackMessage');
const leaderboardRoutes = require('./routes/leaderboard');

const chatRoutes = require('./routes/chat');
const testRoutes = require('./routes/test');
const goalsRoutes = require('./routes/goals');
const mentorshipRoutes = require('./routes/mentorship');
const feedbackRoutes = require('./routes/feedback');
const dailyEmailRoutes = require('./routes/dailyEmail');
const dailyMorningEmailRoutes = require('./routes/dailyMorningEmail');
const weeklyReportEmailRoutes = require('./routes/weeklyReportEmail');
const dailyReminderEmailRoutes = require('./routes/dailyReminderEmail');


// Basic Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Simple test route for frontend compatibility
app.get('/api/test/generate', (req, res) => {
  res.json({ 
    message: 'Test generation requires authentication. Please login first.',
    requiresAuth: true 
  });
});

// CSRF Token route
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: 'dummy-token' });
});

// Timer routes
app.post('/api/timer/stop', (req, res) => {
  res.json({ success: true });
});



// Missing routes for frontend compatibility - Direct routes without /api prefix
app.use('/leaderboard', leaderboardRoutes);
app.use('/auth', authRoutes);
app.use('/progress', progressRoutes);
app.use('/custom-spaced-repetition', customSpacedRepetitionRoutes);

// Routes
console.log('📋 Registering routes...');
try {
  app.use('/api/mock-interview', mockInterviewRoutes);
  console.log('✅ Mock interview routes registered');
} catch (e) { console.error('❌ Mock interview routes failed:', e.message); }

try {
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes registered');
} catch (e) { console.error('❌ Auth routes failed:', e.message); }

try {
  app.use('/api/sheets', sheetsRoutes);
  console.log('✅ Sheets routes registered');
} catch (e) { console.error('❌ Sheets routes failed:', e.message); }

try {
  app.use('/api/progress', progressRoutes);
  console.log('✅ Progress routes registered');
} catch (e) { console.error('❌ Progress routes failed:', e.message); }

try {
  app.use('/api/spaced-repetition', spacedRepetitionRoutes);
  console.log('✅ Spaced repetition routes registered');
} catch (e) { console.error('❌ Spaced repetition routes failed:', e.message); }

try {
  app.use('/api/custom-spaced-repetition', customSpacedRepetitionRoutes);
  console.log('✅ Custom spaced repetition routes registered');
} catch (e) { console.error('❌ Custom spaced repetition routes failed:', e.message); }

try {
  app.use('/api/feedback-message', feedbackMessageRoutes);
  console.log('✅ Feedback message routes registered');
} catch (e) { console.error('❌ Feedback message routes failed:', e.message); }



try {
  app.use('/api/chat', chatRoutes);
  console.log('✅ Chat routes registered');
} catch (e) { console.error('❌ Chat routes failed:', e.message); }

try {
  app.use('/api/test', testRoutes);
  console.log('✅ Test routes registered');
} catch (e) { console.error('❌ Test routes failed:', e.message); }

try {
  app.use('/api/goals', goalsRoutes);
  console.log('✅ Goals routes registered');
} catch (e) { console.error('❌ Goals routes failed:', e.message); }

try {
  app.use('/api/leaderboard', leaderboardRoutes);
  console.log('✅ Leaderboard routes registered');
} catch (e) { console.error('❌ Leaderboard routes failed:', e.message); }

try {
  app.use('/api/mentorship', mentorshipRoutes);
  console.log('✅ Mentorship routes registered');
} catch (e) { console.error('❌ Mentorship routes failed:', e.message); }

try {
  app.use('/api/feedback', feedbackRoutes);
  console.log('✅ Feedback routes registered');
} catch (e) { console.error('❌ Feedback routes failed:', e.message); }

try {
  app.use('/api/daily-email', dailyEmailRoutes);
  console.log('✅ Daily email routes registered');
} catch (e) { console.error('❌ Daily email routes failed:', e.message); }

try {
  app.use('/api/daily-morning-email', dailyMorningEmailRoutes);
  console.log('✅ Daily morning email routes registered');
} catch (e) { console.error('❌ Daily morning email routes failed:', e.message); }

try {
  app.use('/api/weekly-report-email', weeklyReportEmailRoutes);
  console.log('✅ Weekly report email routes registered');
} catch (e) { console.error('❌ Weekly report email routes failed:', e.message); }

try {
  app.use('/api/daily-reminder-email', dailyReminderEmailRoutes);
  console.log('✅ Daily reminder email routes registered');
} catch (e) { console.error('❌ Daily reminder email routes failed:', e.message); }



// Discussion Routes
app.post('/api/discussion/send', async (req, res) => {
  try {
    const { problemId, content, userId, userName } = req.body;
    
    const message = {
      _id: new Date().getTime().toString(),
      problemId,
      content,
      userId,
      userName,
      createdAt: new Date(),
      upvotes: 0,
      type: 'user'
    };

    // Emit to all clients in the problem room
    io.to(`problem_${problemId}`).emit('newDiscussionMessage', message);
    
    res.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.post('/api/discussion/ai-reply', async (req, res) => {
  const { problemId, question, problemTitle } = req.body;
  
  // Global rate limiting check
  const now = Date.now();
  
  // Reset global counter every minute
  if (now - globalWindowStart > AI_WINDOW) {
    globalRequestCount = 0;
    globalWindowStart = now;
  }
  
  // Check global limit (max 10 requests per minute across all users)
  if (globalRequestCount >= 10) {
    const fallbackMessage = {
      _id: new Date().getTime().toString() + '_ai',
      problemId,
      content: "AI service is temporarily busy. Please try again in a minute.",
      userId: 'ai_assistant',
      userName: 'AI Assistant',
      createdAt: new Date(),
      upvotes: 0,
      type: 'ai'
    };
    io.to(`problem_${problemId}`).emit('newDiscussionMessage', fallbackMessage);
    return res.json(fallbackMessage);
  }
  
  // Per-user rate limiting
  const clientId = req.ip || 'unknown';
  const clientRequests = aiRequestTracker.get(clientId) || [];
  const recentRequests = clientRequests.filter(time => now - time < AI_WINDOW);
  
  if (recentRequests.length >= AI_RATE_LIMIT) {
    const fallbackMessage = {
      _id: new Date().getTime().toString() + '_ai',
      problemId,
      content: "Please wait before asking another question.",
      userId: 'ai_assistant',
      userName: 'AI Assistant',
      createdAt: new Date(),
      upvotes: 0,
      type: 'ai'
    };
    io.to(`problem_${problemId}`).emit('newDiscussionMessage', fallbackMessage);
    return res.json(fallbackMessage);
  }
  
  // Update counters
  globalRequestCount++;
  recentRequests.push(now);
  aiRequestTracker.set(clientId, recentRequests);
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are an AI assistant helping with DSA problems. 
    Problem: ${problemTitle}
    User Question: ${question}
    
    Provide a helpful, concise response about the algorithm, approach, or solution. 
    Keep it under 200 words and focus on practical advice.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiReply = response.text();
    
    const aiMessage = {
      _id: new Date().getTime().toString() + '_ai',
      problemId,
      content: aiReply,
      userId: 'ai_assistant',
      userName: 'AI Assistant',
      createdAt: new Date(),
      upvotes: 0,
      type: 'ai'
    };

    // Emit AI response to all clients
    io.to(`problem_${problemId}`).emit('newDiscussionMessage', aiMessage);
    
    res.json(aiMessage);
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Fallback response
    const fallbackMessage = {
      _id: new Date().getTime().toString() + '_ai',
      problemId,
      content: "Think about the time complexity. Can you optimize your solution further?",
      userId: 'ai_assistant',
      userName: 'AI Assistant',
      createdAt: new Date(),
      upvotes: 0,
      type: 'ai'
    };
    
    io.to(`problem_${problemId}`).emit('newDiscussionMessage', fallbackMessage);
    res.json(fallbackMessage);
  }
});

app.get('/api/discussion/:problemId', (req, res) => {
  // Return empty array for now - you can implement database storage later
  res.json([]);
});

app.post('/api/discussion/upvote/:messageId', (req, res) => {
  // Simple upvote response
  res.json({ upvotes: 1, hasUpvoted: true });
});

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);
  
  socket.on('joinProblem', (problemId) => {
    socket.join(`problem_${problemId}`);
    console.log(`User ${socket.id} joined problem ${problemId}`);
  });
  
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
  
  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', socket.id, 'Reason:', reason);
  });
});

// Make io available globally for other modules
app.set('io', io);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

const PORT = process.env.PORT || 5000;

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(50));
  console.log(`🚀 DSA Sheet Backend Server Started`);
  console.log('='.repeat(50));
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`📡 Socket.IO: Ready`);
  console.log(`💾 MongoDB: ${process.env.MONGO_URI ? 'Connected' : 'Default'}`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? '✅ OK' : '❌ MISSING'}`);
  console.log(`🤖 Gemini AI: ${process.env.GEMINI_API_KEY ? '✅ OK' : '❌ Missing'}`);
  
  // Setup cron jobs
  setupSpacedRepetitionCron();
  setupDailyEmailCron();
  setupWeeklyAnalysisCron();
  setupDailyMorningEmailCron();
  setupWeeklyReportCron();
  setupDailyReminderCron();
  
  console.log('='.repeat(50));
  console.log('Available endpoints:');
  console.log('- GET  /api/health');
  console.log('- POST /api/auth/simple-register');
  console.log('- POST /api/auth/simple-login');
  console.log('- GET  /api/auth/me');
  console.log('- GET  /api/sheets/user/:userId/all-progress');
  console.log('- Custom Spaced Repetition APIs available');
  console.log('='.repeat(50) + '\n');
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
  }
});