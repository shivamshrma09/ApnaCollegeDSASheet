@echo off
echo Installing certificate dependencies...
cd Backend
npm install puppeteer
echo.
echo Dependencies installed successfully!
echo.
echo Make sure to add these to your .env file:
echo EMAIL_USER=your_gmail@gmail.com
echo EMAIL_PASS=your_app_password
echo.
pause