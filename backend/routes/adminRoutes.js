const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin'); // Path check kar lena ki models folder sahi hai

// Admin Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Check if Admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found!" });
        }

        // 2. Compare Password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        // 3. Generate JWT Token
        const token = jwt.sign(
            { id: admin._id }, 
            process.env.JWT_SECRET || 'secretkey123', 
            { expiresIn: '5d' }
        );

        res.json({ token, message: "Login Successful!" });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

module.exports = router;