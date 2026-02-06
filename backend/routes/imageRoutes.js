const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Yahan tumhara Image Model hona chahiye
// const Image = require('../models/Image'); 

// Get All Images
router.get('/all', async (req, res) => {
    try {
        const images = await mongoose.connection.collection('images').find().toArray();
        res.json(images);
    } catch (err) {
        res.status(500).json({ message: "Error fetching images" });
    }
});

// Upload/Post Image (Basic Setup)
router.post('/upload', async (req, res) => {
    // Yahan tumhara image upload logic aayega (Cloudinary etc.)
    res.json({ message: "Upload route working!" });
});

// Delete Image
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await mongoose.connection.collection('images').deleteOne({ _id: new mongoose.Types.ObjectId(id) });
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});

module.exports = router;