@echo off
echo 🏆 Testing Certificate Email System...
echo.
echo Make sure you have:
echo 1. EMAIL_USER and EMAIL_PASS in your .env file
echo 2. MongoDB running
echo 3. Changed email in test script to your email
echo.
pause
echo.
cd Backend
node test-certificate-email.js
echo.
pause