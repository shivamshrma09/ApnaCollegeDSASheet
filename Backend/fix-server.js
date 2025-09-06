const { exec } = require('child_process');
const fs = require('fs');

console.log('🔧 Fixing Backend Server...\n');

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('❌ .env file not found!');
  process.exit(1);
}

// Check MongoDB
exec('mongod --version', (error) => {
  if (error) {
    console.log('⚠️ MongoDB not found in PATH');
  } else {
    console.log('✅ MongoDB available');
  }
});

// Check Node modules
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  exec('npm install', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ npm install failed:', error);
      return;
    }
    console.log('✅ Dependencies installed');
    startServer();
  });
} else {
  console.log('✅ Dependencies already installed');
  startServer();
}

function startServer() {
  console.log('\n🚀 Starting server...');
  const server = exec('npm start');
  
  server.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  server.stderr.on('data', (data) => {
    console.error(data.toString());
  });
}