@echo off
echo 🚀 Quick Starting DSA Sheet...

REM Kill any existing processes on ports
echo Cleaning up ports...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5001') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do taskkill /f /pid %%a >nul 2>&1

REM Start minimal backend
echo Starting Backend...
cd Backend
start "Backend" cmd /k "node start-backend.js"
cd ..

REM Wait for backend
timeout /t 3 /nobreak >nul

REM Start frontend
echo Starting Frontend...
cd frontend
start "Frontend" cmd /k "npm run dev"
cd ..

echo ✅ Servers starting...
echo Backend: http://localhost:5001
echo Frontend: http://localhost:5173
pause