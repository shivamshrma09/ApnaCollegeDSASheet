# Environment Variables Guide

## ✅ Current Status: PROPERLY CONFIGURED

Your project is now properly configured to use environment variables throughout. Here's a comprehensive guide:

## Backend Environment Variables (.env in Backend directory)

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Database Configuration
MONGO_URI=mongodb://localhost:27017/dsa-sheet
MONGODB_URI=mongodb://localhost:27017/dsa-sheet

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key
GEMINI_API_INTERVIEW=your-gemini-api-key-for-interviews
GEMINI_API_TEST=your-gemini-api-key-for-tests
GEMINI_API_DISCUSSION=your-gemini-api-key-for-discussions

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Google OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Frontend Environment Variables (.env in frontend directory)

```env
# Vite Environment Variables (must start with VITE_)
VITE_PORT=5001
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
VITE_APP_NAME=DSA Sheet - Apna College
VITE_APP_VERSION=1.0.0

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_GEMINI_API_TEST=your-gemini-api-key-for-tests
VITE_GEMINI_API_DISCUSSION=your-gemini-api-key-for-discussions
VITE_GEMINI_API_INTERVIEW=your-gemini-api-key-for-interviews

# API Keys for Failover System (Optional)
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_ANTHROPIC_API_KEY=your-anthropic-api-key
VITE_COHERE_API_KEY=your-cohere-api-key
VITE_TOGETHER_API_KEY=your-together-api-key
```

## Files Using Environment Variables

### ✅ Backend Files (Properly Configured)
- `Backend/server.js` - Uses `process.env.PORT`, `process.env.FRONTEND_URL`, `process.env.MONGODB_URI`, etc.
- `Backend/services/geminiService.js` - Uses `process.env.GEMINI_API_KEY`
- `Backend/routes/test.js` - Uses `process.env.GEMINI_API_TEST`
- `Backend/routes/aiCodeHelp.js` - Uses `process.env.GEMINI_API_KEY`
- All other backend routes and services properly use `process.env.*`

### ✅ Frontend Files (Properly Configured)
- `frontend/src/config/constants.js` - Central configuration using `import.meta.env.*`
- `frontend/src/utils/api.js` - Uses `import.meta.env.VITE_API_URL`
- `frontend/src/components/QuestionChat.jsx` - Uses constants from config
- `frontend/src/components/MockInterviewSystem.jsx` - Uses `import.meta.env.VITE_API_URL`
- `frontend/src/utils/apiFailover.js` - Uses `import.meta.env.VITE_*` variables

## How to Change Backend URL

### For Development:
1. Update `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:YOUR_NEW_PORT/api
   VITE_SOCKET_URL=http://localhost:YOUR_NEW_PORT
   ```

2. Update `Backend/.env`:
   ```env
   PORT=YOUR_NEW_PORT
   FRONTEND_URL=http://localhost:5173
   ```

### For Production:
1. Update `frontend/.env.production`:
   ```env
   VITE_API_URL=https://your-backend-domain.com/api
   VITE_SOCKET_URL=https://your-backend-domain.com
   ```

2. Update `Backend/.env.production`:
   ```env
   PORT=80
   FRONTEND_URL=https://your-frontend-domain.com
   ```

## How to Change Gemini API Keys

### Backend:
Update `Backend/.env`:
```env
GEMINI_API_KEY=your-new-gemini-api-key
GEMINI_API_INTERVIEW=your-new-gemini-api-key-for-interviews
GEMINI_API_TEST=your-new-gemini-api-key-for-tests
GEMINI_API_DISCUSSION=your-new-gemini-api-key-for-discussions
```

### Frontend:
Update `frontend/.env`:
```env
VITE_GEMINI_API_KEY=your-new-gemini-api-key
VITE_GEMINI_API_TEST=your-new-gemini-api-key-for-tests
VITE_GEMINI_API_DISCUSSION=your-new-gemini-api-key-for-discussions
VITE_GEMINI_API_INTERVIEW=your-new-gemini-api-key-for-interviews
```

## Key Benefits

✅ **No Hardcoded URLs**: All URLs are now configurable via environment variables
✅ **Easy Deployment**: Change environment variables without code changes
✅ **Security**: API keys are not exposed in code
✅ **Flexibility**: Different configurations for development, staging, and production
✅ **Centralized Config**: All configuration in one place per environment

## Quick Commands

### Start Development:
```bash
# Backend
cd Backend
npm start

# Frontend  
cd frontend
npm run dev
```

### Build for Production:
```bash
# Frontend
cd frontend
npm run build

# Backend (if using PM2)
cd Backend
pm2 start server.js --name "dsa-backend"
```

## Environment Variable Priority

### Frontend (Vite):
1. `import.meta.env.VITE_*` (Vite variables)
2. Fallback to hardcoded defaults (removed in our fixes)

### Backend (Node.js):
1. `process.env.*` (Environment variables)
2. Fallback to hardcoded defaults where appropriate

## Notes

- **Frontend**: Must use `VITE_` prefix for Vite to expose variables to client
- **Backend**: Can use any variable name with `process.env.*`
- **Security**: Never commit `.env` files to version control
- **Deployment**: Set environment variables in your hosting platform (Vercel, Netlify, Heroku, etc.)

Your project is now fully configured to use environment variables! 🎉