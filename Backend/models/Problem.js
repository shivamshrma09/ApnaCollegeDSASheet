const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  companies: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    required: true
  },
  video: {
    type: String,
    required: true
  },
  hint: {
    type: String,
    default: ''
  },
  topicId: {
    type: Number,
    required: true
  },
  topicTitle: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Problem', problemSchema);