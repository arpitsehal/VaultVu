require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
// const fraudDetectionRoutes = require('./routes/fraudDetection'); // Comment out or remove this line
const connectDB = require('./config/db'); // Add this line to import connectDB

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB(); // Call the connectDB function here

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ success: true, message: 'VaultVu backend running' });
});

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// Remove the hardcoded mongoose.connect block
// mongoose.connect('mongodb+srv://VaultVu:VaultVu123@cluster0.9nbpoby.mongodb.net/VaultVu?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     // Listen on all available network interfaces
//     app.listen(PORT, '0.0.0.0', () => {
//       console.log(`Server running on port ${PORT}. Accessible via localhost or your network IP.`);
//     });
//   })
//   .catch((err) => {
//     console.error('MongoDB connection error:', err);
//   });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}. Accessible via localhost or your network IP.`);
});

