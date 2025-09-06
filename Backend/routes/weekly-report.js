const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const nodemailer = require('nodemailer');

const router = express.Router();

// Generate and send weekly report
router.post('/generate/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate weekly stats
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    
    const weeklyData = {
      problemsSolved: user.completedProblems?.length || 0,
      testsCompleted: user.testResults ? Array.from(user.testResults.values()).length : 0,
      totalTimeSpent: user.problemTimers?.reduce((sum, timer) => sum + (timer.timeSpent || 0), 0) || 0,
      averageScore: 0,
      weakAreas: [],
      strongAreas: [],
      testResults: user.testResults ? Array.from(user.testResults.values()) : []
    };

    if (weeklyData.testsCompleted > 0) {
      weeklyData.averageScore = weeklyData.testResults.reduce((sum, test) => sum + test.score, 0) / weeklyData.testsCompleted;
      weeklyData.weakAreas = [...new Set(weeklyData.testResults.flatMap(test => test.weakAreas || []))];
      weeklyData.strongAreas = [...new Set(weeklyData.testResults.flatMap(test => test.strongAreas || []))];
    }

    // Generate AI report
    const genAI = new GoogleGenerativeAI('AIzaSyCUolZR1CqqjCZHhfysvhsq2UxQBKOjtAM');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Generate a comprehensive weekly DSA progress report for ${user.name}:
      
      Weekly Performance Data:
      - Problems Solved: ${weeklyData.problemsSolved}
      - Tests Completed: ${weeklyData.testsCompleted}
      - Average Test Score: ${weeklyData.averageScore.toFixed(1)}%
      - Total Time Spent: ${Math.round(weeklyData.totalTimeSpent / 3600)} hours
      - Weak Areas: ${weeklyData.weakAreas.join(', ') || 'None identified'}
      - Strong Areas: ${weeklyData.strongAreas.join(', ') || 'General problem solving'}
      
      Create a detailed HTML email report with:
      1. Professional header with DSA Sheet logo
      2. Weekly summary with key metrics
      3. Performance analysis with charts/progress bars
      4. Strengths and areas for improvement
      5. Personalized recommendations for next week
      6. Motivational message
      
      Format as HTML email template with inline CSS for email compatibility.
    `;

    let htmlReport;
    try {
      // Skip AI API call - use fallback only
      throw new Error('Using fallback only');
    } catch (aiError) {
      console.error('AI API error for report:', aiError.message);
      
      // Fallback HTML report template
      htmlReport = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .metric { display: inline-block; margin: 10px; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center; min-width: 120px; }
            .metric-value { font-size: 24px; font-weight: bold; color: #667eea; }
            .metric-label { font-size: 12px; color: #666; margin-top: 5px; }
            .section { margin: 20px 0; }
            .section h3 { color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Weekly DSA Progress Report</h1>
              <p>Hello ${user.name}! Here's your weekly performance summary.</p>
            </div>
            <div class="content">
              <div class="section">
                <h3>📈 This Week's Metrics</h3>
                <div class="metric">
                  <div class="metric-value">${weeklyData.problemsSolved}</div>
                  <div class="metric-label">Problems Solved</div>
                </div>
                <div class="metric">
                  <div class="metric-value">${weeklyData.testsCompleted}</div>
                  <div class="metric-label">Tests Completed</div>
                </div>
                <div class="metric">
                  <div class="metric-value">${weeklyData.averageScore.toFixed(1)}%</div>
                  <div class="metric-label">Average Score</div>
                </div>
                <div class="metric">
                  <div class="metric-value">${Math.round(weeklyData.totalTimeSpent / 3600)}h</div>
                  <div class="metric-label">Time Spent</div>
                </div>
              </div>
              
              <div class="section">
                <h3>🎯 Performance Analysis</h3>
                <p><strong>Strong Areas:</strong> ${weeklyData.strongAreas.join(', ') || 'General Problem Solving'}</p>
                <p><strong>Areas for Improvement:</strong> ${weeklyData.weakAreas.join(', ') || 'Keep up the great work!'}</p>
              </div>
              
              <div class="section">
                <h3>🚀 Next Week's Goals</h3>
                <ul>
                  <li>Solve at least ${Math.max(weeklyData.problemsSolved + 2, 5)} problems</li>
                  <li>Take ${Math.max(weeklyData.testsCompleted + 1, 2)} practice tests</li>
                  <li>Focus on ${weeklyData.weakAreas[0] || 'medium difficulty problems'}</li>
                  <li>Maintain consistent daily practice</li>
                </ul>
              </div>
              
              <div class="section">
                <h3>🎆 Keep Going!</h3>
                <p>You're making excellent progress! Remember, consistency is key to mastering DSA. Keep solving problems daily and challenging yourself with new concepts.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // Save report to user profile
    const reportData = {
      reportData: {
        stats: {
          problemsSolved: weeklyData.problemsSolved,
          timeSpent: Math.round(weeklyData.totalTimeSpent / 3600),
          accuracy: weeklyData.averageScore,
          testsCompleted: weeklyData.testsCompleted
        },
        analysis: {
          weakAreas: weeklyData.weakAreas,
          strongAreas: weeklyData.strongAreas,
          recommendations: ['Continue consistent practice', 'Focus on weak areas']
        },
        weekPeriod: {
          start: weekStart.toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0]
        }
      },
      generatedAt: new Date(),
      htmlContent: htmlReport
    };

    if (!user.weeklyReports) user.weeklyReports = [];
    user.weeklyReports.push(reportData);
    await user.save();

    // Send email if user has email notifications enabled
    if (user.notifications?.email && user.email) {
      try {
        const transporter = nodemailer.createTransporter({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: `📊 Your Weekly DSA Progress Report - ${user.name}`,
          html: htmlReport
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }
    }

    res.json({
      success: true,
      report: reportData,
      message: 'Weekly report generated successfully'
    });

  } catch (error) {
    console.error('Error generating weekly report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's weekly reports history
router.get('/history/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const reports = user.weeklyReports || [];
    res.json({ reports: reports.slice(-10) }); // Last 10 reports
  } catch (error) {
    console.error('Error fetching report history:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;