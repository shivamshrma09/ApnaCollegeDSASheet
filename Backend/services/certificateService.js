const User = require('../models/User');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;

// Generate certificate data
const generateCertificate = async (userId, sheetType) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const sheetData = user.sheetProgress?.[sheetType];
    if (!sheetData) {
      throw new Error('Sheet progress not found');
    }

    const totalProblems = sheetType === 'apnaCollege' ? 373 : 450;
    const completedProblems = sheetData.completedProblems?.length || 0;
    const completionPercentage = (completedProblems / totalProblems) * 100;

    // Check eligibility (80% completion required)
    if (completionPercentage < 80) {
      throw new Error(`Insufficient completion. Required: 80%, Current: ${completionPercentage.toFixed(1)}%`);
    }

    const certificateData = {
      userId,
      userName: user.name,
      userEmail: user.email,
      sheetType,
      sheetName: sheetType === 'apnaCollege' ? 'Apna College DSA Sheet' : 'Love Babbar DSA Sheet',
      totalProblems,
      completedProblems,
      completionPercentage: completionPercentage.toFixed(1),
      easySolved: sheetData.easySolved || 0,
      mediumSolved: sheetData.mediumSolved || 0,
      hardSolved: sheetData.hardSolved || 0,
      streak: sheetData.streak || 0,
      issuedDate: new Date().toLocaleDateString(),
      certificateId: `DSA-${sheetType.toUpperCase()}-${userId.toString().slice(-6)}-${Date.now().toString().slice(-6)}`
    };

    return certificateData;
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw error;
  }
};

// Generate certificate HTML
const generateCertificateHTML = (certificateData) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DSA Certificate - ${certificateData.userName}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');
            
            body {
                margin: 0;
                padding: 20px;
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .certificate {
                width: 800px;
                height: 600px;
                background: white;
                border: 12px solid #3b82f6;
                border-radius: 20px;
                padding: 40px;
                box-sizing: border-box;
                position: relative;
                box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            }
            
            .certificate::before {
                content: '';
                position: absolute;
                top: 20px;
                left: 20px;
                right: 20px;
                bottom: 20px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
            }
            
            .header {
                text-align: center;
                margin-bottom: 30px;
                position: relative;
                z-index: 1;
            }
            
            .title {
                font-family: 'Playfair Display', serif;
                font-size: 42px;
                font-weight: 700;
                color: #1f2937;
                margin: 0;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            }
            
            .subtitle {
                font-size: 18px;
                color: #6b7280;
                margin: 10px 0 0 0;
                font-weight: 500;
            }
            
            .content {
                text-align: center;
                position: relative;
                z-index: 1;
            }
            
            .awarded-to {
                font-size: 20px;
                color: #374151;
                margin-bottom: 15px;
            }
            
            .recipient-name {
                font-family: 'Playfair Display', serif;
                font-size: 36px;
                font-weight: 700;
                color: #1f2937;
                margin: 0 0 25px 0;
                text-decoration: underline;
                text-decoration-color: #3b82f6;
                text-underline-offset: 8px;
            }
            
            .achievement {
                font-size: 18px;
                color: #374151;
                line-height: 1.6;
                margin-bottom: 25px;
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
            }
            
            .stats {
                display: flex;
                justify-content: center;
                gap: 40px;
                margin: 25px 0;
                flex-wrap: wrap;
            }
            
            .stat {
                text-align: center;
            }
            
            .stat-number {
                font-size: 24px;
                font-weight: 700;
                color: #3b82f6;
                display: block;
            }
            
            .stat-label {
                font-size: 12px;
                color: #6b7280;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .footer {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                margin-top: 40px;
                position: relative;
                z-index: 1;
            }
            
            .signature {
                text-align: center;
                flex: 1;
            }
            
            .signature-line {
                width: 150px;
                height: 1px;
                background: #374151;
                margin: 0 auto 8px auto;
            }
            
            .signature-text {
                font-size: 14px;
                color: #6b7280;
                font-weight: 500;
            }
            
            .date-issued {
                text-align: center;
                flex: 1;
            }
            
            .date-label {
                font-size: 12px;
                color: #6b7280;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .date-value {
                font-size: 16px;
                color: #374151;
                font-weight: 600;
                margin-top: 4px;
            }
            
            .certificate-id {
                position: absolute;
                bottom: 15px;
                right: 25px;
                font-size: 10px;
                color: #9ca3af;
                font-family: monospace;
            }
            
            .watermark {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 120px;
                color: rgba(59, 130, 246, 0.05);
                font-weight: 900;
                z-index: 0;
                pointer-events: none;
            }
            
            @media print {
                body {
                    background: white;
                    padding: 0;
                }
                .certificate {
                    box-shadow: none;
                }
            }
        </style>
    </head>
    <body>
        <div class="certificate">
            <div class="watermark">DSA</div>
            
            <div class="header">
                <h1 class="title">🏆 CERTIFICATE OF ACHIEVEMENT</h1>
                <p class="subtitle">Data Structures & Algorithms Mastery</p>
            </div>
            
            <div class="content">
                <p class="awarded-to">This is to certify that</p>
                <h2 class="recipient-name">${certificateData.userName}</h2>
                
                <p class="achievement">
                    has successfully completed <strong>${certificateData.completedProblems}</strong> problems 
                    from the <strong>${certificateData.sheetName}</strong><br>
                    achieving <strong>${certificateData.completionPercentage}%</strong> completion 
                    and demonstrating exceptional problem-solving skills
                </p>
                
                <div class="stats">
                    <div class="stat">
                        <span class="stat-number">${certificateData.completedProblems}</span>
                        <span class="stat-label">Problems Solved</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${certificateData.completionPercentage}%</span>
                        <span class="stat-label">Completion Rate</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${certificateData.streak}</span>
                        <span class="stat-label">Max Streak</span>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <div class="signature">
                    <div class="signature-line"></div>
                    <p class="signature-text">Apna College</p>
                </div>
                
                <div class="date-issued">
                    <p class="date-label">Date Issued</p>
                    <p class="date-value">${certificateData.issuedDate}</p>
                </div>
                
                <div class="signature">
                    <div class="signature-line"></div>
                    <p class="signature-text">Authorized Signature</p>
                </div>
            </div>
            
            <div class="certificate-id">Certificate ID: ${certificateData.certificateId}</div>
        </div>
    </body>
    </html>
  `;
};

// Check certificate eligibility
const checkCertificateEligibility = async (userId, sheetType) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { eligible: false, reason: 'User not found' };
    }

    const sheetData = user.sheetProgress?.[sheetType];
    if (!sheetData) {
      return { eligible: false, reason: 'No progress found for this sheet' };
    }

    const totalProblems = sheetType === 'apnaCollege' ? 373 : 450;
    const completedProblems = sheetData.completedProblems?.length || 0;
    const completionPercentage = (completedProblems / totalProblems) * 100;

    if (completionPercentage >= 80) {
      return {
        eligible: true,
        completionPercentage: completionPercentage.toFixed(1),
        completedProblems,
        totalProblems
      };
    } else {
      return {
        eligible: false,
        reason: `Need 80% completion. Current: ${completionPercentage.toFixed(1)}%`,
        completionPercentage: completionPercentage.toFixed(1),
        completedProblems,
        totalProblems,
        required: Math.ceil(totalProblems * 0.8) - completedProblems
      };
    }
  } catch (error) {
    console.error('Error checking certificate eligibility:', error);
    return { eligible: false, reason: 'Error checking eligibility' };
  }
};

// Email certificate as PDF
const emailCertificate = async (userId, sheetType) => {
  try {
    const certificateData = await generateCertificate(userId, sheetType);
    const certificateHTML = generateCertificateHTML(certificateData);
    
    // Generate PDF using puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(certificateHTML, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
    });
    
    await browser.close();
    
    // Setup email transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: certificateData.userEmail,
      subject: `🏆 Your DSA Certificate - ${certificateData.sheetName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3b82f6; margin: 0;">🎉 Congratulations ${certificateData.userName}!</h1>
            <p style="color: #6b7280; font-size: 16px;">Your DSA Certificate is ready!</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 15px; color: white; text-align: center; margin-bottom: 20px;">
            <h2 style="margin: 0 0 10px 0;">Certificate Achievement</h2>
            <p style="margin: 0; font-size: 18px;">${certificateData.sheetName}</p>
            <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold;">${certificateData.completionPercentage}% Completed</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #374151; margin: 0 0 15px 0;">Your Achievement Stats:</h3>
            <div style="display: flex; justify-content: space-around; text-align: center;">
              <div>
                <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${certificateData.completedProblems}</div>
                <div style="color: #6b7280; font-size: 12px;">Problems Solved</div>
              </div>
              <div>
                <div style="font-size: 24px; font-weight: bold; color: #22c55e;">${certificateData.completionPercentage}%</div>
                <div style="color: #6b7280; font-size: 12px;">Completion Rate</div>
              </div>
              <div>
                <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${certificateData.streak}</div>
                <div style="color: #6b7280; font-size: 12px;">Max Streak</div>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #374151; margin-bottom: 15px;">Your certificate is attached as a PDF. You can also view it online anytime!</p>
            <p style="color: #6b7280; font-size: 14px;">Certificate ID: ${certificateData.certificateId}</p>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">Keep coding and keep growing! 🚀</p>
            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">- Team Apna College</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `DSA_Certificate_${certificateData.sheetName.replace(/\s+/g, '_')}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };
    
    await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      message: 'Certificate sent successfully to your email!',
      certificateId: certificateData.certificateId
    };
    
  } catch (error) {
    console.error('Error emailing certificate:', error);
    throw new Error('Failed to send certificate email');
  }
};

module.exports = {
  generateCertificate,
  generateCertificateHTML,
  checkCertificateEligibility,
  emailCertificate
};