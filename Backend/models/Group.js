const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  creator: {
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  members: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now }
  }],
  inviteCode: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);