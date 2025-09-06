const mongoose = require('mongoose');

const dmMessageSchema = new mongoose.Schema({
  messageId: { type: String, required: true, unique: true },
  text: { type: String, required: true },
  user: {
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  upvotedBy: [String],
  downvotedBy: [String],
  replies: [String],
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// Create separate collections for each DM pair
const createDMModel = (userId1, userId2) => {
  const dmKey = [userId1, userId2].sort().join('_');
  const collectionName = `dm_${dmKey}_messages`;
  return mongoose.model(collectionName, dmMessageSchema, collectionName);
};

module.exports = { createDMModel, dmMessageSchema };