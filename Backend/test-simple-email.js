require('dotenv').config();
const nodemailer = require('nodemailer');

const testSimpleEmail = async () => {
  try {
    console.log('📧 Testing Simple Email Design...');
    
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
        <!-- Your Logo -->
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://raw.githubusercontent.com/shivamshrma09/ApnaCollegeDSASheet/main/frontend/public/light.png" alt="+DSA Mock Hub Logo" style="width: 120px; height: auto; margin-bottom: 10px;" />
        </div>
        
        <h1>Mock Interview Analysis Report</h1>
        <div class="header-info">
          <strong>Test User</strong> • Software Engineer at Google<br>
          <small>Generated on ${new Date().toLocaleDateString()}</small>
        </div>
        
        <div class="score">Overall Score: 85/100</div>
        
        <!-- Performance Parameters -->
        <div>
          <h2>Performance Parameters</h2>
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
          <div class="param">
            <span class="param-name">Depth of Knowledge:</span> 
            <span class="param-score">8/10</span>
          </div>
          <div class="param">
            <span class="param-name">Practical Experience:</span> 
            <span class="param-score">7/10</span>
          </div>
        </div>

        <!-- Salary Prediction -->
        <div>
          <h2>Salary Prediction</h2>
          <div class="salary">₹12-18 LPA</div>
          <p style="color: #666; text-align: center;">Based on 3 years experience and current performance level</p>
        </div>

        <!-- Key Strengths -->
        <div>
          <h2>Key Strengths</h2>
          <div class="strength">• Strong technical knowledge in React and Node.js</div>
          <div class="strength">• Clear communication and structured thinking</div>
          <div class="strength">• Good understanding of scalability concepts</div>
          <div class="strength">• Practical project experience with real-world applications</div>
        </div>

        <!-- Areas for Improvement -->
        <div>
          <h2>Areas for Improvement</h2>
          <div class="improvement">• More depth in system design concepts</div>
          <div class="improvement">• Practice with advanced algorithms and data structures</div>
          <div class="improvement">• Better understanding of microservices architecture</div>
        </div>

        <!-- Improvement Roadmap -->
        <div>
          <h2>Improvement Roadmap</h2>
          <div class="roadmap-item"><strong>Step 1:</strong> Study system design patterns and microservices architecture</div>
          <div class="roadmap-item"><strong>Step 2:</strong> Practice advanced data structures and algorithms on LeetCode</div>
          <div class="roadmap-item"><strong>Step 3:</strong> Build more complex full-stack projects with scalability in mind</div>
          <div class="roadmap-item"><strong>Step 4:</strong> Learn about distributed systems and database optimization</div>
        </div>

        <!-- Question Analysis -->
        <div>
          <h2>Question Analysis</h2>
          <div class="question">
            <strong>Q1:</strong> Tell me about your React experience and state management approach.<br>
            <div class="answer">Answer: I have 3 years of experience with React, using hooks and Redux for state management. I built an e-commerce platform with complex state interactions...</div>
            <div style="margin: 10px 0;">
              <span class="param-name">Technical:</span> <span class="param-score">8/10</span> | 
              <span class="param-name">Communication:</span> <span class="param-score">9/10</span> | 
              <span class="param-name">Problem Solving:</span> <span class="param-score">7/10</span>
            </div>
            <div class="feedback">Feedback: Excellent understanding of React concepts with clear practical examples</div>
          </div>
          
          <div class="question">
            <strong>Q2:</strong> How would you handle scalability challenges in a high-traffic application?<br>
            <div class="answer">Answer: I would implement load balancing, use caching strategies like Redis, optimize database queries, and consider microservices architecture for better scaling...</div>
            <div style="margin: 10px 0;">
              <span class="param-name">Technical:</span> <span class="param-score">7/10</span> | 
              <span class="param-name">Communication:</span> <span class="param-score">8/10</span> | 
              <span class="param-name">Problem Solving:</span> <span class="param-score">8/10</span>
            </div>
            <div class="feedback">Feedback: Good understanding of scalability concepts, could benefit from more specific implementation details</div>
          </div>
        </div>

        <!-- Interview Readiness -->
        <div>
          <h2>Interview Readiness</h2>
          <p style="color: #555;">Good - Ready for Software Engineer interviews at Google with focused preparation on system design concepts</p>
        </div>

        <!-- Overall Feedback -->
        <div>
          <h2>Overall Feedback</h2>
          <p style="color: #555;">Solid performance for Software Engineer role with good potential for Google. Strong technical foundation with clear communication skills. Focus on system design and continue building complex projects to reach the next level.</p>
        </div>

        <!-- Footer -->
        <p style="text-align: center; color: #666; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">+DSA Mock Interview System</p>
      </div>
    </body>
    </html>`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'shivamsharma27107@gmail.com',
      subject: '🎯 Simple Design Test - +DSA Mock Interview Report',
      html: emailHTML
    });
    
    console.log('✅ Simple email sent successfully!');
    console.log('📧 Email features:');
    console.log('   🖼️  Your light.png logo at top');
    console.log('   📝 Clean text-only design');
    console.log('   🚫 No SVG icons (removed for compatibility)');
    console.log('   🚫 No emojis (clean professional look)');
    console.log('   🏷️  +DSA branding in footer');
    console.log('   🎨 Simple bullet points (•)');
    console.log('   📊 Color-coded sections');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
  }
};

testSimpleEmail();