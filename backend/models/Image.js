// backend/models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  publicId: { type: String }, 
  uploadedBy: { type: String, default: "Admin" },
  likes: [{ type: String }],
  likeCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema);