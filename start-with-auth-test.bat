@echo off
echo Starting DSA Sheet Application with Google Auth Test...
echo.

echo Testing Google Auth Configuration...
cd Backend
node test-google-auth.js
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "npm run dev"
timeout /t 3

echo Starting Frontend...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting...
echo ✅ Backend: http://localhost:5001
echo ✅ Frontend: http://localhost:5173
echo.
echo Google Auth should now work properly!
pause