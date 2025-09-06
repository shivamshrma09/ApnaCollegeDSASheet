const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { 
  generateCertificate, 
  generateCertificateHTML, 
  checkCertificateEligibility,
  emailCertificate
} = require('../services/certificateService');
const { getUserWeeklyReport } = require('../services/weeklyReportService');

// @route   GET /api/certificates/eligibility/:userId/:sheetType
// @desc    Check certificate eligibility
// @access  Public (for now)
router.get('/eligibility/:userId/:sheetType', async (req, res) => {
  try {
    const { userId, sheetType } = req.params;
    
    if (!['apnaCollege', 'loveBabbar'].includes(sheetType)) {
      return res.status(400).json({ message: 'Invalid sheet type' });
    }
    
    const eligibility = await checkCertificateEligibility(userId, sheetType);
    res.json(eligibility);
  } catch (error) {
    console.error('Error checking certificate eligibility:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/certificates/download/:userId/:sheetType
// @desc    Download certificate
// @access  Public (for now)
router.get('/download/:userId/:sheetType', async (req, res) => {
  try {
    const { userId, sheetType } = req.params;
    
    if (!['apnaCollege', 'loveBabbar'].includes(sheetType)) {
      return res.status(400).json({ message: 'Invalid sheet type' });
    }
    
    const certificateData = await generateCertificate(userId, sheetType);
    const certificateHTML = generateCertificateHTML(certificateData);
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="DSA_Certificate_${sheetType}.html"`);
    res.send(certificateHTML);
  } catch (error) {
    console.error('Error downloading certificate:', error);
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/certificates/generate
// @desc    Generate certificate
// @access  Private
router.post('/generate', auth, async (req, res) => {
  try {
    const { sheetType } = req.body;
    const userId = req.user.id;
    
    if (!['apnaCollege', 'loveBabbar'].includes(sheetType)) {
      return res.status(400).json({ message: 'Invalid sheet type' });
    }
    
    const certificateData = await generateCertificate(userId, sheetType);
    const certificateHTML = generateCertificateHTML(certificateData);
    
    res.json({
      success: true,
      certificateData,
      certificateHTML
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/certificates/email/:userId/:sheetType
// @desc    Email certificate as PDF
// @access  Public (for now)
router.post('/email/:userId/:sheetType', async (req, res) => {
  try {
    const { userId, sheetType } = req.params;
    
    if (!['apnaCollege', 'loveBabbar'].includes(sheetType)) {
      return res.status(400).json({ message: 'Invalid sheet type' });
    }
    
    const result = await emailCertificate(userId, sheetType);
    res.json(result);
  } catch (error) {
    console.error('Error emailing certificate:', error);
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/certificates/weekly-report
// @desc    Get weekly report
// @access  Private
router.get('/weekly-report', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const reportData = await getUserWeeklyReport(userId);
    
    if (!reportData) {
      return res.status(404).json({ message: 'No report data available' });
    }
    
    res.json(reportData);
  } catch (error) {
    console.error('Error getting weekly report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;