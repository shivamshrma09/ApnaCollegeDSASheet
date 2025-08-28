const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/database');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://apnacollegedsasheet-373-2ya1.vercel.app'
    ],
    methods: ['GET', 'POST']
  }
});

// Make io accessible to routes
app.set('io', io);

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://apnacollege-dsasheet373.vercel.app',
      'https://apnacollegedsasheet-373-2ya1.vercel.app'
    ];
    
    // Allow all Vercel deployments
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

// Handle preflight requests
app.options('*', cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/problems', require('./routes/problems'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/question-chat', require('./routes/questionChat'));

// Socket.io connection handling
let onlineUsers = 0;

io.on('connection', (socket) => {
  onlineUsers++;
  console.log(`User connected. Online users: ${onlineUsers}`);
  
  // Broadcast user count
  io.emit('userCount', onlineUsers);
  
  socket.on('newMessage', (message) => {
    socket.broadcast.emit('newMessage', message);
  });
  
  socket.on('disconnect', () => {
    onlineUsers--;
    console.log(`User disconnected. Online users: ${onlineUsers}`);
    io.emit('userCount', onlineUsers);
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});