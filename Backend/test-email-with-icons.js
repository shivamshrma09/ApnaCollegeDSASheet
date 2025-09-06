require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmailWithIcons = async () => {
  try {
    console.log('📧 Testing Email with SVG Icons and Logo...');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        h1 { color: #2563eb; text-align: center; margin-bottom: 10px; }
        h2 { color: #1f2937; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 25px; }
        .header-info { text-align: center; color: #666; margin-bottom: 20px; }
        .score { font-size: 28px; font-weight: bold; color: #059669; text-align: center; margin: 20px 0; }
        .param { margin: 8px 0; }
        .param-name { color: #333; font-size: 14px; }
        .param-score { color: #2563eb; font-weight: bold; }
        .strength { color: #059669; margin: 5px 0; }
        .improvement { color: #dc2626; margin: 5px 0; }
        .salary { color: #059669; font-weight: bold; font-size: 20px; text-align: center; margin: 15px 0; }
        .question { margin: 15px 0; padding: 15px; border-left: 3px solid #2563eb; }
        .answer { color: #555; font-size: 14px; margin: 8px 0; }
        .feedback { color: #666; font-style: italic; margin-top: 8px; }
        .roadmap-item { margin: 8px 0; padding: 8px; border-left: 2px solid #2563eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Logo at Top -->
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://raw.githubusercontent.com/shivamshrma09/ApnaCollegeDSASheet/main/frontend/public/light.png" alt="DSA Mock Hub Logo" style="width: 120px; height: auto; margin-bottom: 10px;" />
        </div>
        
        <h1>Mock Interview Analysis Report</h1>
        <div class="header-info">
          <strong>Test User</strong> • Software Engineer at Google<br>
          <small>Generated on ${new Date().toLocaleDateString()}</small>
        </div>
        
        <div class="score">Overall Score: 85/100</div>
        
        <!-- Performance Parameters with SVG Icon -->
        <div>
          <h2><svg width="16" height="16" viewBox="0 0 24 24" fill="#2563eb" style="vertical-align: middle; margin-right: 8px;"><path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z"/></svg>Performance Parameters</h2>
          <div class="param">
            <span class="param-name">Technical Accuracy:</span> 
            <span class="param-score">8/10</span>
          </div>
          <div class="param">
            <span class="param-name">Communication Clarity:</span> 
            <span class="param-score">9/10</span>
          </div>
          <div class="param">
            <span class="param-name">Problem Solving:</span> 
            <span class="param-score">7/10</span>
          </div>
        </div>

        <!-- Salary Prediction with SVG Icon -->
        <div>
          <h2><svg width="16" height="16" viewBox="0 0 24 24" fill="#059669" style="vertical-align: middle; margin-right: 8px;"><path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/></svg>Salary Prediction</h2>
          <div class="salary">₹12-18 LPA</div>
          <p style="color: #666; text-align: center;">Based on 3 years experience and current performance level</p>
        </div>

        <!-- Key Strengths with SVG Icons -->
        <div>
          <h2><svg width="16" height="16" viewBox="0 0 24 24" fill="#059669" style="vertical-align: middle; margin-right: 8px;"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/></svg>Key Strengths</h2>
          <div class="strength"><svg width="12" height="12" viewBox="0 0 24 24" fill="#059669" style="margin-right: 6px;"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>Strong technical knowledge in React and Node.js</div>
          <div class="strength"><svg width="12" height="12" viewBox="0 0 24 24" fill="#059669" style="margin-right: 6px;"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>Clear communication and structured thinking</div>
          <div class="strength"><svg width="12" height="12" viewBox="0 0 24 24" fill="#059669" style="margin-right: 6px;"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>Good understanding of scalability concepts</div>
        </div>

        <!-- Areas for Improvement with SVG Icons -->
        <div>
          <h2><svg width="16" height="16" viewBox="0 0 24 24" fill="#dc2626" style="vertical-align: middle; margin-right: 8px;"><path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1L13.5,2.5L16.17,5.33L10.58,10.92L6.5,6.84L5.08,8.25L10.58,13.75L18.42,5.92L21,9Z"/></svg>Areas for Improvement</h2>
          <div class="improvement"><svg width="12" height="12" viewBox="0 0 24 24" fill="#dc2626" style="margin-right: 6px;"><path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>More depth in system design concepts</div>
          <div class="improvement"><svg width="12" height="12" viewBox="0 0 24 24" fill="#dc2626" style="margin-right: 6px;"><path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>Practice with advanced algorithms</div>
        </div>

        <!-- Improvement Roadmap with SVG Icons -->
        <div>
          <h2><svg width="16" height="16" viewBox="0 0 24 24" fill="#2563eb" style="vertical-align: middle; margin-right: 8px;"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>Improvement Roadmap</h2>
          <div class="roadmap-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="#2563eb" style="margin-right: 6px;"><circle cx="12" cy="12" r="10" fill="#2563eb"/><text x="12" y="16" font-family="Arial" font-size="10" fill="white" text-anchor="middle">1</text></svg><strong>Step 1:</strong> Study system design patterns and microservices</div>
          <div class="roadmap-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="#2563eb" style="margin-right: 6px;"><circle cx="12" cy="12" r="10" fill="#2563eb"/><text x="12" y="16" font-family="Arial" font-size="10" fill="white" text-anchor="middle">2</text></svg><strong>Step 2:</strong> Practice advanced data structures and algorithms</div>
          <div class="roadmap-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="#2563eb" style="margin-right: 6px;"><circle cx="12" cy="12" r="10" fill="#2563eb"/><text x="12" y="16" font-family="Arial" font-size="10" fill="white" text-anchor="middle">3</text></svg><strong>Step 3:</strong> Build more complex full-stack projects</div>
        </div>

        <!-- Question Analysis with SVG Icon -->
        <div>
          <h2><svg width="16" height="16" viewBox="0 0 24 24" fill="#2563eb" style="vertical-align: middle; margin-right: 8px;"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,17A1.5,1.5 0 0,0 13.5,15.5A1.5,1.5 0 0,0 12,14A1.5,1.5 0 0,0 10.5,15.5A1.5,1.5 0 0,0 12,17M12,10.5C12.8,10.5 13.5,9.8 13.5,9C13.5,8.2 12.8,7.5 12,7.5C11.2,7.5 10.5,8.2 10.5,9C10.5,9.8 11.2,10.5 12,10.5Z"/></svg>Question Analysis</h2>
          <div class="question">
            <strong>Q1:</strong> Tell me about your React experience and state management approach.<br>
            <div class="answer">Answer: I have 3 years of experience with React, using hooks and Redux...</div>
            <div style="margin: 10px 0;">
              <span class="param-name">Technical:</span> <span class="param-score">8/10</span> | 
              <span class="param-name">Communication:</span> <span class="param-score">9/10</span>
            </div>
            <div class="feedback">Feedback: Excellent understanding of React concepts with clear examples</div>
          </div>
        </div>

        <!-- Interview Readiness with SVG Icon -->
        <div>
          <h2><svg width="16" height="16" viewBox="0 0 24 24" fill="#2563eb" style="vertical-align: middle; margin-right: 8px;"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/></svg>Interview Readiness</h2>
          <p style="color: #555;">Good - Ready for Software Engineer interviews at Google with some preparation</p>
        </div>

        <!-- Overall Feedback with SVG Icon -->
        <div>
          <h2><svg width="16" height="16" viewBox="0 0 24 24" fill="#2563eb" style="vertical-align: middle; margin-right: 8px;"><path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9Z"/></svg>Overall Feedback</h2>
          <p style="color: #555;">Solid performance for Software Engineer role with good potential for Google. Focus on system design and continue building projects.</p>
        </div>

        <!-- Footer with SVG Icons -->
        <div style="text-align: center; margin-top: 30px; padding: 15px; border-top: 1px solid #ddd;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#2563eb" style="margin-right: 8px; vertical-align: middle;">
            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,17A1.5,1.5 0 0,0 13.5,15.5A1.5,1.5 0 0,0 12,14A1.5,1.5 0 0,0 10.5,15.5A1.5,1.5 0 0,0 12,17M12,10.5C12.8,10.5 13.5,9.8 13.5,9C13.5,8.2 12.8,7.5 12,7.5C11.2,7.5 10.5,8.2 10.5,9C10.5,9.8 11.2,10.5 12,10.5Z"/>
          </svg>
          <span style="color: #666;">DSA Mock Interview System</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#059669" style="margin-left: 8px; vertical-align: middle;">
            <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
          </svg>
        </div>
      </div>
    </body>
    </html>`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'shivamsharma27107@gmail.com',
      subject: '🎯 Email Test - SVG Icons + Logo - DSA Mock Interview',
      html: emailHTML
    });
    
    console.log('✅ Email sent with SVG icons and logo!');
    console.log('📧 Check your email for:');
    console.log('   🖼️  Your light.png logo at top');
    console.log('   📊 Chart icon for Performance Parameters');
    console.log('   💰 Money icon for Salary Prediction');
    console.log('   ✅ Check icons for Strengths');
    console.log('   ⚠️  Warning icons for Improvements');
    console.log('   🗺️  Roadmap icons with numbers');
    console.log('   ❓ Question icon for Analysis');
    console.log('   💬 Chat icon for Feedback');
    console.log('   🎯 Footer icons');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
  }
};

testEmailWithIcons();