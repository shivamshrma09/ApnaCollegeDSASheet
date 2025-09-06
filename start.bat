@echo off
echo Starting DSA Sheet Application...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if MongoDB is running
echo Checking MongoDB connection...
timeout /t 2 /nobreak >nul

REM Start Backend
echo Starting Backend Server...
cd Backend
start "Backend Server" cmd /k "npm start"
cd ..

REM Wait a moment for backend to start
timeout /t 5 /nobreak >nul

REM Start Frontend
echo Starting Frontend Development Server...
cd frontend
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo DSA Sheet Application is starting...
echo ========================================
echo Backend: http://localhost:5001
echo Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to exit...
pause >nul