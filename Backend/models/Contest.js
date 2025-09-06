const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  platform: { type: String, required: true, enum: ['codeforces', 'leetcode', 'codechef', 'atcoder', 'hackerrank'], lowercase: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true, min: 0 }, // in seconds
  url: { type: String, required: true, trim: true },
  status: { type: String, enum: ['upcoming', 'running', 'finished'], default: 'upcoming' },
  platformId: { type: String, required: true, trim: true }, // platform specific contest ID
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Compound indexes for better query performance
contestSchema.index({ status: 1, startTime: 1 });
contestSchema.index({ platform: 1, status: 1 });
contestSchema.index({ platformId: 1, platform: 1 }, { unique: true });
contestSchema.index({ endTime: 1 });

// Validation
contestSchema.pre('save', function(next) {
  if (this.endTime <= this.startTime) {
    next(new Error('End time must be after start time'));
  }
  next();
});

// Virtual for time until contest starts
contestSchema.virtual('timeUntilStart').get(function() {
  const now = new Date();
  const diff = this.startTime - now;
  return diff > 0 ? diff : 0;
});

// Virtual for formatted duration
contestSchema.virtual('formattedDuration').get(function() {
  const hours = Math.floor(this.duration / 3600);
  const minutes = Math.floor((this.duration % 3600) / 60);
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
});

module.exports = mongoose.model('Contest', contestSchema);