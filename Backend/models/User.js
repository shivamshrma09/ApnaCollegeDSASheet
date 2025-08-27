const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isGoogleUser: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: ''
  },
  completedProblems: {
    type: [Number],
    default: []
  },
  starredProblems: {
    type: [Number],
    default: []
  },
  notes: {
    type: Map,
    of: String,
    default: new Map()
  },
  playlists: [{
    id: String,
    name: String,
    description: String,
    problems: [Number],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  signupDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  // Skip password hashing for Google users with random passwords
  if (this.isGoogleUser && this.password.length === 8) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);