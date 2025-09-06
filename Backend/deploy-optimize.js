// Deployment optimization script
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment optimization...');

// Remove test files in production
if (process.env.NODE_ENV === 'production') {
  const testFiles = [
    'test-*.js',
    'debug-*.js',
    'testAPI.js'
  ];
  
  testFiles.forEach(pattern => {
    try {
      const files = fs.readdirSync('.').filter(file => 
        file.match(pattern.replace('*', '.*'))
      );
      files.forEach(file => {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
          console.log(`✅ Removed ${file}`);
        }
      });
    } catch (err) {
      console.log(`⚠️ Could not remove ${pattern}:`, err.message);
    }
  });
}

console.log('✅ Deployment optimization completed!');