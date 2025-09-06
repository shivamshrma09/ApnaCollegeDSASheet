const mongoose = require('mongoose');

const roomMessageSchema = new mongoose.Schema({
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

// Create separate collections for each room
const createRoomModel = (roomId) => {
  const collectionName = `room_${roomId}_messages`;
  return mongoose.model(collectionName, roomMessageSchema, collectionName);
};

module.exports = { createRoomModel, roomMessageSchema };