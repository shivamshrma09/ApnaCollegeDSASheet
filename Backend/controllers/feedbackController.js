const Feedback = require('../models/Feedback');

// Submit feedback
const submitFeedback = async (req, res) => {
  try {
    const { feedback, userEmail, userName, sheetType, category } = req.body;
    
    if (!feedback || !userEmail) {
      return res.status(400).json({ 
        success: false,
        message: 'Feedback and email are required' 
      });
    }
    
    if (feedback.length > 1000) {
      return res.status(400).json({ 
        success: false,
        message: 'Feedback must be less than 1000 characters' 
      });
    }
    
    const newFeedback = new Feedback({
      feedback: feedback.trim(),
      userEmail: userEmail.toLowerCase(),
      userName: userName || 'Anonymous',
      sheetType: sheetType || 'unknown',
      category: category || 'general',
      userId: req.user?.id || null,
      status: 'new',
      priority: category === 'bug' ? 'high' : 'medium'
    });
    
    await newFeedback.save();
    
    console.log('📝 New feedback received:', {
      id: newFeedback._id,
      user: userName || userEmail,
      category: category || 'general',
      feedback: feedback.substring(0, 100) + (feedback.length > 100 ? '...' : ''),
      sheet: sheetType,
      timestamp: new Date().toISOString()
    });
    
    res.json({ 
      success: true, 
      message: 'Thank you for your feedback! We appreciate your input and will review it soon.',
      feedbackId: newFeedback._id,
      category: newFeedback.category,
      status: newFeedback.status
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to submit feedback. Please try again later.' 
    });
  }
};

// Get all feedback (admin only)
const getAllFeedback = async (req, res) => {
  try {
    // Simple admin check
    const user = req.user;
    if (!user || user.email !== 'admin@dsasheet.com') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.' 
      });
    }
    
    const { page = 1, limit = 20, category, status, priority } = req.query;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    
    const feedbacks = await Feedback.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Feedback.countDocuments(filter);
    
    // Get statistics
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          totalFeedbacks: { $sum: 1 },
          newCount: {
            $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] }
          },
          reviewedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'reviewed'] }, 1, 0] }
          },
          resolvedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          closedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] }
          },
          bugCount: {
            $sum: { $cond: [{ $eq: ['$category', 'bug'] }, 1, 0] }
          },
          featureCount: {
            $sum: { $cond: [{ $eq: ['$category', 'feature'] }, 1, 0] }
          },
          generalCount: {
            $sum: { $cond: [{ $eq: ['$category', 'general'] }, 1, 0] }
          },
          improvementCount: {
            $sum: { $cond: [{ $eq: ['$category', 'improvement'] }, 1, 0] }
          }
        }
      }
    ]);
    
    res.json({
      success: true,
      feedbacks,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      stats: stats[0] || { 
        totalFeedbacks: 0, 
        newCount: 0, 
        reviewedCount: 0, 
        resolvedCount: 0, 
        closedCount: 0,
        bugCount: 0,
        featureCount: 0,
        generalCount: 0,
        improvementCount: 0
      }
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching feedback' 
    });
  }
};

// Update feedback status (admin only)
const updateFeedback = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.email !== 'admin@dsasheet.com') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.' 
      });
    }
    
    const { status, priority, adminNotes } = req.body;
    
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        priority, 
        adminNotes,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('userId', 'name email');
    
    if (!feedback) {
      return res.status(404).json({ 
        success: false,
        message: 'Feedback not found' 
      });
    }
    
    console.log('📝 Feedback updated:', {
      id: feedback._id,
      status,
      priority,
      updatedBy: user.email,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: 'Feedback updated successfully',
      feedback
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating feedback' 
    });
  }
};

// Get feedback statistics
const getFeedbackStats = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.email !== 'admin@dsasheet.com') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.' 
      });
    }

    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          totalFeedbacks: { $sum: 1 },
          byCategory: {
            $push: {
              k: '$category',
              v: 1
            }
          },
          byStatus: {
            $push: {
              k: '$status',
              v: 1
            }
          },
          byPriority: {
            $push: {
              k: '$priority',
              v: 1
            }
          },
          bySheet: {
            $push: {
              k: '$sheetType',
              v: 1
            }
          }
        }
      },
      {
        $project: {
          totalFeedbacks: 1,
          byCategory: { $arrayToObject: '$byCategory' },
          byStatus: { $arrayToObject: '$byStatus' },
          byPriority: { $arrayToObject: '$byPriority' },
          bySheet: { $arrayToObject: '$bySheet' }
        }
      }
    ]);

    const recentFeedbacks = await Feedback.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: stats[0] || {
        totalFeedbacks: 0,
        byCategory: {},
        byStatus: {},
        byPriority: {},
        bySheet: {}
      },
      recentFeedbacks
    });
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching stats' 
    });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback,
  updateFeedback,
  getFeedbackStats
};