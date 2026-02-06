const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const upload = require('../middleware/multerCloudinary'); // Apne file ka sahi path dena

// 🚀 Image Upload Route (Fix)
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File nahi mili!" });
        }

        // Ye object Database mein jayega
        const newImage = {
            title: req.body.title || "Untitled",
            imageUrl: req.file.path,    // Cloudinary ka link
            public_id: req.file.filename, // Image delete karne ke liye ID
            uploadedAt: new Date()
        };

        // Images collection mein insert karo
        await mongoose.connection.collection('images').insertOne(newImage);

        res.json({ message: "Image Live ho gayi! ✅", data: newImage });
    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
router.get('/all', async (req, res) => {
    try {
        const images = await mongoose.connection.collection('images').find().toArray();
        res.json(images);
    } catch (err) {
        res.status(500).json({ message: "Error fetching images" });
    }
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