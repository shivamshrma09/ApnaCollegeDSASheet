# DSA Sheet - Troubleshooting Guide

## 🚨 Common Issues & Solutions

### 1. **Application Not Loading / Blank Screen**

**Possible Causes:**
- Backend server not running
- MongoDB not connected
- Frontend build issues
- CORS errors

**Solutions:**
```bash
# Check if servers are running
# Backend should be on http://localhost:5001
# Frontend should be on http://localhost:5173

# Restart both servers
cd Backend
npm start

# In another terminal
cd frontend
npm run dev
```

### 2. **Login/Signup Not Working**

**Possible Causes:**
- Database connection issues
- JWT token problems
- API endpoint errors

**Solutions:**
```bash
# Check backend logs for errors
# Verify MongoDB is running
# Clear browser storage
localStorage.clear()
```

### 3. **Progress Not Saving**

**Possible Causes:**
- Authentication token expired
- Database write permissions
- API request failures

**Solutions:**
```bash
# Check browser console for errors
# Verify user is logged in
# Check network tab for failed requests
```

### 4. **MongoDB Connection Issues**

**Solutions:**
```bash
# Start MongoDB service
net start MongoDB

# Or if using MongoDB Compass, ensure it's running
# Check if port 27017 is available
netstat -an | findstr :27017
```

### 5. **Port Already in Use**

**Solutions:**
```bash
# Kill processes on ports 5001 and 5173
netstat -ano | findstr :5001
taskkill /PID <PID_NUMBER> /F

netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

## 🔧 Quick Fixes

### Reset Application State
```javascript
// Run in browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Check API Connectivity
```javascript
// Run in browser console
fetch('http://localhost:5001/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### Verify Environment Variables
```bash
# Check Backend/.env file contains:
MONGO_URI=mongodb://localhost:27017/dsa-sheet
MONGODB_URI=mongodb://localhost:27017/dsa-sheet
JWT_SECRET=6e028a98d85a0c5db8dc5bba696f26a3cf3c801380fee7471466886ec9b69be6
PORT=5001
NODE_ENV=development
```

## 🚀 Performance Issues

### Slow Loading
- Clear browser cache
- Check network connection
- Restart servers
- Update dependencies

### Memory Issues
- Close unnecessary browser tabs
- Restart Node.js servers
- Check for memory leaks in console

## 📞 Getting Help

1. Check browser console for errors (F12)
2. Check backend terminal for error logs
3. Verify all services are running
4. Check network connectivity
5. Clear browser data and try again

## 🔄 Complete Reset

If nothing works, try a complete reset:

```bash
# 1. Stop all servers (Ctrl+C)
# 2. Clear all data
rm -rf node_modules
rm -rf frontend/node_modules
rm -rf Backend/node_modules

# 3. Reinstall dependencies
npm install
cd Backend && npm install
cd ../frontend && npm install

# 4. Clear browser data
# 5. Restart servers
```

## ✅ Health Check Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check MongoDB status
mongo --eval "db.adminCommand('ismaster')"

# Test backend API
curl http://localhost:5001/api/health

# Check frontend build
cd frontend && npm run build
```