const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/k4_assignment");
        
        const existingAdmin = await Admin.findOne({ email: "admin@test.com" });
        if (existingAdmin) {
            process.exit();
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);
        const newAdmin = new Admin({
            email: "admin@test.com",
            password: hashedPassword
        });

        await newAdmin.save();
        process.exit();
    } catch (err) {
        console.error("Error creating admin:", err);
        process.exit(1);
    }
};

createAdmin();