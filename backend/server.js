// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const adminRoutes = require('./routes/adminRoutes'); 
// const imageRoutes = require('./routes/imageRoutes');

// const app = express();

// app.use(cors({
//   origin: ['http://localhost:5173', 'http://localhost:3000'], 
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));
// app.use(express.json());

// // Routes
// app.use('/api/admin', adminRoutes); 
// app.use('/api/images', imageRoutes);

// // Edit Title API
// app.put("/api/images/edit/:id", async (req, res) => {
//   try {
//     const { title } = req.body;
//     const { id } = req.params;

//     const updatedImage = await mongoose.connection.collection('images').findOneAndUpdate(
//       { _id: new mongoose.Types.ObjectId(id) },
//       { $set: { title: title } },
//       { returnDocument: 'after' }
//     );

//     if (!updatedImage) {
//       return res.status(404).json({ message: "Image nahi mili" });
//     }

//     res.json({ message: "Update Success!", data: updatedImage });
//   } catch (err) {
//     console.error("Backend Edit Error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });


// mongoose.connect(process.env.MONGO_URI)
// .then(() => console.log("MongoDB connected! ✅"))
// .catch(err => console.log(err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();

const adminRoutes = require('./routes/adminRoutes'); 
const imageRoutes = require('./routes/imageRoutes');


app.use(express.json());

// --- CORS FIX START ---
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://mern-gallery-project-aapz.vercel.app' // Tera naya Vercel link
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// --- CORS FIX END ---



// Routes
app.use('/api/admin', adminRoutes); 
app.use('/api/images', imageRoutes);

// Edit Title API
app.put("/api/images/edit/:id", async (req, res) => {
  try {
    const { title } = req.body;
    const { id } = req.params;

    // Direct collection use karne ki jagah Model use karna better hota hai, 
    // par abhi ke liye tera logic fix kar diya hai
    const updatedImage = await mongoose.connection.collection('images').findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { title: title } },
      { returnDocument: 'after' }
    );

    if (!updatedImage) {
      return res.status(404).json({ message: "Image nahi mili" });
    }

    res.json({ message: "Update Success!", data: updatedImage });
  } catch (err) {
    console.error("Backend Edit Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected! ✅"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



