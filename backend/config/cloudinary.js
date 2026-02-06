const cloudinary = require('cloudinary').v2;

// dotenv.config() live server par kabhi-kabhi issue karta hai
// Isliye seedha process.env use karo
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

module.exports = cloudinary;