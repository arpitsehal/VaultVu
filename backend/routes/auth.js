const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Registration
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    // Basic email format validation
    if (!/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ success: false, message: 'Invalid email format' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    res.json({ success: true, message: 'Registration successful. You can now log in.' });
  } catch (err) {
    console.error('Registration error:', err); // Added console.error for debugging
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Complete Profile
router.post('/complete-profile', async (req, res) => {
  try {
    const { email, username, dateOfBirth, country, gender } = req.body;

    // Validate that all required fields are present
    if (!email || !username || !dateOfBirth || !country || !gender) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: email, username, dateOfBirth, country, gender'
      });
    }

    // Check if username is already taken. This uses the unique sparse index we discussed earlier.
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }

    // Find the user by their email and update the profile information
    const user = await User.findOneAndUpdate(
      { email },
      { username, dateOfBirth, country, gender, profileComplete: true },
      { new: true, runValidators: true } // Return the new document and run schema validators
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile completed successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profileComplete: user.profileComplete
      }
    });
  } catch (err) {
    console.error('Profile completion error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login (accepts email OR username)
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password)
      return res.status(400).json({ success: false, message: 'Email/username and password are required' });

    // Find user by email OR username using a Mongoose $or query
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername },
        { username: emailOrUsername }
      ]
    });

    console.log('User found in database:', user); // DEBUGGING: Check if a user was found

    if (!user) {
      console.log('User not found. Returning invalid credentials.');
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log('Password provided:', password); // DEBUGGING: Check the password from the request
    console.log('Hashed password from DB:', user.password); // DEBUGGING: Check the stored hashed password
    console.log('Password match result:', isMatch); // DEBUGGING: Check the result of the comparison

    if (!isMatch)
      return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profileComplete: user.profileComplete
      }
    });
  } catch (err) {
    console.error('Login error:', err); // Added console.error for debugging
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Return user data
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        dateOfBirth: user.dateOfBirth,
        country: user.country,
        gender: user.gender,
        profileComplete: user.profileComplete
      }
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get update data
    const { username, dateOfBirth, country, gender } = req.body;
    
    // Find user by id and update
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { 
        username, 
        dateOfBirth, 
        country, 
        gender,
        profileComplete: true 
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Return updated user data
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        dateOfBirth: user.dateOfBirth,
        country: user.country,
        gender: user.gender,
        profileComplete: user.profileComplete
      }
    });
  } catch (err) {
    console.error('Profile update error:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
