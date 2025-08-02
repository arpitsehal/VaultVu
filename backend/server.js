require('dotenv').config(); // Add this line at the very top
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ success: true, message: 'VaultVu backend running' });
});

app.use('/api/auth', authRoutes);

mongoose.connect('mongodb+srv://VaultVu:VaultVu123@cluster0.9nbpoby.mongodb.net/VaultVu?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

