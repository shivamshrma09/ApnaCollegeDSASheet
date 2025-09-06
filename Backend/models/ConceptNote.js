const mongoose = require('mongoose');

const conceptNoteSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  tags: [String],
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  timeComplexity: String,
  spaceComplexity: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ConceptNote', conceptNoteSchema);