const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin'); 

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json("Admin not found!");

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json("Invalid credentials!");

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '5 days' });
        res.json({ token });
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;