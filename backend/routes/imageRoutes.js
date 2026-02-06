const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const upload = require('../middleware/multer')

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
            likes: [], // Khali array shuruat mein
            createdAt: new Date()

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
// Get All Images (Default Likes Array Fix)
router.get('/all', async (req, res) => {
    try {
        const images = await mongoose.connection.collection('images').find().toArray();
        const fixedImages = images.map(img => ({
            ...img,
            likes: Array.isArray(img.likes) ? img.likes : [] // Agar array nahi hai toh empty array bana do
        }));
        res.json(fixedImages);
    } catch (err) {
        res.status(500).json({ message: "Error fetching images" });
    }
});
 router.post('/like/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  const image = await mongoose.connection.collection('images').findOne({ _id: new mongoose.Types.ObjectId(id) });

  // Safety: Agar likes pehle se number hai toh array bana do
  let likesArray = Array.isArray(image.likes) ? image.likes : [];

  if (likesArray.includes(userId)) {
    // Unlike logic
    await mongoose.connection.collection('images').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $pull: { likes: userId } }
    );
  } else {
    // Like logic
    await mongoose.connection.collection('images').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $addToSet: { likes: userId } }
    );
  }
  const updatedImage = await mongoose.connection.collection('images').findOne({ _id: new mongoose.Types.ObjectId(id) });
  res.json(updatedImage);
});

// 🗑️ Delete Image Route
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id.length !== 24) {
            return res.status(400).json({ message: "Invalid ID!" });
        }

        const result = await mongoose.connection.collection('images').deleteOne({
            _id: new mongoose.Types.ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Image nahi mili database mein!" });
        }

        res.json({ message: "Image delete ho gayi! ✅" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ message: "Server error during delete" });
    }
});
module.exports = router;