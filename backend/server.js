require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Make sure this line is present
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const urlCheckRoutes = require('./routes/urlCheck');
const phoneCheckRoutes = require('./routes/phoneCheck');
const messageCheckRoutes = require('./routes/messageCheck');
const voiceCheckRoutes = require('./routes/voiceCheck');
const budgetRoutes = require('./routes/budgetRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// --- MODIFICATION HERE ---
// This line configures CORS to allow requests from *all* origins.
// This is the easiest way to solve the CORS error for now.
// However, for production, it is generally safer to specify
// the exact origins you trust, as shown in the previous example.
const corsOptions = {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*', // Allows multiple origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'VaultVu backend running' });
});

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/url-check', urlCheckRoutes);
app.use('/api/phone-check', phoneCheckRoutes);
app.use('/api/message-check', messageCheckRoutes);
app.use('/api/voice-check', voiceCheckRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}. Accessible via localhost or your network IP.`);
});