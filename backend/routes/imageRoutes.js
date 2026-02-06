const express = require('express');
const router = express.Router();
const Image = require('../models/Image');
const upload = require('../middleware/multer');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Image select karein!" });
        }

        const newImage = new Image({
            title: req.body.title,
            imageUrl: req.file.path,
            publicId: req.file.filename,
            uploadedBy: "Admin"
        });

        await newImage.save();
        res.status(201).json(newImage);
    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET ALL IMAGES (With Sorting: Newest, Oldest, Popular)
router.get('/all', async (req, res) => {
    try {
        const { sort } = req.query;
        let sortQuery = { createdAt: -1 };

        if (sort === 'oldest') {
            sortQuery = { createdAt: 1 };
        } else if (sort === 'popular') {
            sortQuery = { likeCount: -1 };
        }

        const images = await Image.find().sort(sortQuery);
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. GET USER'S LIKED IMAGES
router.get('/liked/:userId', async (req, res) => {
    try {
        const images = await Image.find({ likes: req.params.userId }).sort({ createdAt: -1 });
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. LIKE / UNLIKE IMAGE  Firebase Token

router.post('/like/:id', verifyFirebaseToken, async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        const userId = req.user.uid;
        if (!image) return res.status(404).json({ message: "Image nahi mili!" });

        const index = image.likes.indexOf(userId);

        if (index === -1) {
            image.likes.push(userId);
        } else {
            image.likes.splice(index, 1);
        }

        image.likeCount = image.likes.length;
        await image.save();

        res.status(200).json(image);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//  DELETE IMAGE Admin Only
router.delete('/:id', async (req, res) => {
    try {
        const deletedImage = await Image.findByIdAndDelete(req.params.id);
        if (!deletedImage) {
            return res.status(404).json({ message: "Image nahi mili!" });
        }
        res.status(200).json({ message: "Delete Success!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//  EDIT TITLE Admin Only
router.put('/edit/:id', async (req, res) => {
    try {
        const updatedImage = await Image.findByIdAndUpdate(
            req.params.id,
            { title: req.body.title },
            { new: true }
        );
        res.status(200).json(updatedImage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;