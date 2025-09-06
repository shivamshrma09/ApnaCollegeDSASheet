DSA Sheet - Apna College 373

A comprehensive Data Structures and Algorithms practice platform built with React and Node.js.

Features:

Problem Tracking: Track your DSA problem-solving progress
User Authentication: Secure login/signup with Google OAuth
Progress Dashboard: Visual progress tracking and statistics
Daily Problems: Get daily problem recommendations
Responsive Design: Works on all devices

Tech Stack:

Frontend:
React 18
Vite
Tailwind CSS
Context API for state management

Backend:
Node.js
Express.js
MongoDB with Mongoose
JWT Authentication
Google OAuth 2.0
Bcrypt for password hashing

Getting Started:

Prerequisites:
Node.js (v16 or higher)
MongoDB
Google OAuth credentials

Installation:

1. Clone the repository
```bash
# Clone the project from GitHub
git clone https://github.com/shivamshrma09/ApnaCollegeDSASheet.git

# Navigate to project directory
cd ApnaCollegeDSASheet
```

2. Install dependencies
```bash
# Install root dependencies (if any)
npm install

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Environment Setup

**Backend Environment (.env in Backend directory):**
```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/dsa-sheet
# or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dsa-sheet

# JWT Secret Key
JWT_SECRET=your-super-secret-jwt-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Frontend Environment (.env in frontend directory):**
```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Google OAuth Client ID (same as backend)
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# App Configuration
VITE_APP_NAME=DSA Sheet - Apna College
VITE_APP_VERSION=1.0.0
```

**How to get Google OAuth credentials:**
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select existing one
- Enable Google+ API
- Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
- Add authorized redirect URIs:
  - `http://localhost:3000` (for frontend)
  - `http://localhost:5000/auth/google/callback` (for backend)

4. Database Setup
```bash
# Option 1: Local MongoDB
# Install MongoDB locally and start the service
# MongoDB will run on mongodb://localhost:27017

# Option 2: MongoDB Atlas (Recommended)
# 1. Create account at https://www.mongodb.com/atlas
# 2. Create a new cluster
# 3. Get connection string and add to MONGO_URI in .env
```

5. Start the application
```bash
# Terminal 1: Start Backend Server
cd Backend
npm start
# Backend will run on http://localhost:5000

# Terminal 2: Start Frontend Development Server
cd frontend
npm run dev
# Frontend will run on http://localhost:3000
```

**Verification Steps:**
- Backend: Visit `http://localhost:5000/api/health` (should return server status)
- Frontend: Visit `http://localhost:3000` (should load the application)
- Database: Check MongoDB connection in backend console logs

Project Structure:

Backend/ - Node.js backend
  controllers/ - Route controllers
  models/ - MongoDB models
  routes/ - API routes
  middleware/ - Custom middleware
  config/ - Database configuration
frontend/ - React frontend
  src/
    components/
    contexts/
    data/
    hooks/
  public/
README.md

Contributing:

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

License:

This project is open source and available under the MIT License.
