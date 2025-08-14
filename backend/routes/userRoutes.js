const express = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const router = express.Router();

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  })
);

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { name, email, password, username, dateOfBirth, gender } = req.body; // Add new fields

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      username, // Include username
      dateOfBirth, // Include dateOfBirth
      gender, // Include gender
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username, // Include username in response
        dateOfBirth: user.dateOfBirth, // Include dateOfBirth in response
        gender: user.gender, // Include gender in response
        token: generateToken(user._id),
        coins: user.coins, // Include coins in response
        quizLevels: user.quizLevels, // Include quizLevels in response
        levelsUnlocked: user.levelsUnlocked, // Include levelsUnlocked in response  
        quizProgress: user.quizProgress, // Include quizProgress in response
        




      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  })
);

// @desc    Get quiz levels for a user
// @route   GET /api/users/quiz-levels
// @access  Private
router.get(
  '/quiz-levels',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
      res.json({
        quizLevels: user.quizLevels || [],
        coins: user.coins || 0
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  })
);

// @desc    Unlock a quiz level
// @route   POST /api/users/quiz-levels/unlock
// @access  Private
router.post(
  '/quiz-levels/unlock',
  asyncHandler(async (req, res) => {
    const { levelId, cost } = req.body;
    
    if (!levelId) {
      res.status(400);
      throw new Error('Level ID is required');
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Check if user has enough coins
    if (user.coins < cost) {
      res.status(400);
      throw new Error('Not enough coins to unlock this level');
    }

    // Check if level already exists in user's quizLevels
    const levelExists = user.quizLevels.find(level => level.levelId === levelId);
    
    if (levelExists) {
      res.status(400);
      throw new Error('Level already unlocked');
    }

    // Deduct coins and add level to user's quizLevels
    user.coins -= cost;
    user.quizLevels.push({
      levelId,
      completed: false,
      score: 0
    });

    await user.save();

    res.json({
      success: true,
      quizLevels: user.quizLevels,
      coins: user.coins
    });
  })
);

// @desc    Submit quiz level completion
// @route   POST /api/users/quiz-levels/complete
// @access  Private
router.post(
  '/quiz-levels/complete',
  asyncHandler(async (req, res) => {
    const { levelId, score } = req.body;
    
    if (!levelId || score === undefined) {
      res.status(400);
      throw new Error('Level ID and score are required');
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Find the level in user's quizLevels
    const levelIndex = user.quizLevels.findIndex(level => level.levelId === levelId);
    
    if (levelIndex === -1) {
      res.status(400);
      throw new Error('Level not found or not unlocked');
    }

    // Update level completion status
    user.quizLevels[levelIndex].completed = true;
    user.quizLevels[levelIndex].score = score;
    user.quizLevels[levelIndex].completedAt = new Date();

    // Award coins based on score (1 coin per correct answer)
    const coinsEarned = score;
    user.coins += coinsEarned;
    
    // Update user's total points
    user.points += score;

    await user.save();

    res.json({
      success: true,
      quizLevels: user.quizLevels,
      coins: user.coins,
      coinsEarned
    });
  })
);

module.exports = router;