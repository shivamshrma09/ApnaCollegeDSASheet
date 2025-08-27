# DSA Sheet Backend

Backend API for DSA Sheet Application

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create .env file with:
```
MONGODB_URI=mongodb://localhost:27017/dsasheet
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

3. Start server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Problems
- GET /api/problems - Get all problems

### Progress
- GET /api/progress/:userId - Get user progress
- POST /api/progress/:userId/complete/:problemId - Toggle problem completion
- POST /api/progress/:userId/star/:problemId - Toggle problem star
- POST /api/progress/:userId/note/:problemId - Save note
- DELETE /api/progress/:userId/note/:problemId - Delete note