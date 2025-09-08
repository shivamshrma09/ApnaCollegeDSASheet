const http = require('http');

function testEmail() {
  const data = JSON.stringify({
    to: 'shivamsharma27107@gmail.com',
    subject: 'DSA Sheet Test Email',
    html: '<h1>✅ Email Service Working!</h1><p>Your email service is working perfectly.</p>'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/test-email/send',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(responseData);
        console.log('✅ Email test result:', result);
      } catch (e) {
        console.log('Response:', responseData);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Email test failed:', error.message);
  });

  req.write(data);
  req.end();
}

testEmail();