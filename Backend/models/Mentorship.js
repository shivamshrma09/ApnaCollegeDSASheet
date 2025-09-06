const mongoose = require('mongoose');

const mentorshipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  expertise: [{
    type: String,
    required: true
  }],
  experience: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  price: {
    type: Number,
    required: true
  },
  availability: {
    type: String,
    default: 'Available'
  },
  description: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  sessions: {
    type: Number,
    default: 0
  },
  badge: {
    type: String,
    default: 'Mentor'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['Software Engineering', 'Data Science', 'Product Management', 'Design', 'Career Guidance'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Mentorship', mentorshipSchema);