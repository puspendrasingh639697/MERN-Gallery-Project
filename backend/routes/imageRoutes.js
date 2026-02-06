// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');

// // Yahan tumhara Image Model hona chahiye
// // const Image = require('../models/Image'); 

// // Get All Images
// router.get('/all', async (req, res) => {
//     try {
//         const images = await mongoose.connection.collection('images').find().toArray();
//         res.json(images);
//     } catch (err) {
//         res.status(500).json({ message: "Error fetching images" });
//     }
// });

// // Upload/Post Image (Basic Setup)
// router.post('/upload', async (req, res) => {
//     // Yahan tumhara image upload logic aayega (Cloudinary etc.)
//     res.json({ message: "Upload route working!" });
// });

// // Delete Image
// router.delete('/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         await mongoose.connection.collection('images').deleteOne({ _id: new mongoose.Types.ObjectId(id) });
//         res.json({ message: "Deleted successfully" });
//     } catch (err) {
//         res.status(500).json({ message: "Delete failed" });
//     }
// });

// module.exports = router;




const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const upload = require('../middleware/multer')

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

// Apne file ka sahi path dena

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

// ❤️ Like Image Route
router.post('/like/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Database mein 'likes' count ko 1 se badhao
        const result = await mongoose.connection.collection('images').updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $inc: { likes: 1 } } // Agar likes field nahi hai toh ban jayegi
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Image nahi mili!" });
        }

        res.json({ message: "Like ho gaya! ❤️" });
    } catch (err) {
        console.error("Like Error:", err);
        res.status(500).json({ message: "Like karne mein galti hui" });
    }
});

module.exports = router;