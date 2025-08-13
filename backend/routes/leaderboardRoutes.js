const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const asyncHandler = require('express-async-handler');

// @desc    Get leaderboard scores
// @route   GET /api/leaderboard/scores
// @access  Public
router.get('/scores', asyncHandler(async (req, res) => {
  try {
    // Get top 10 users by points
    const topUsers = await User.find({}, 'username points badges')
      .sort({ points: -1 })
      .limit(10);

    // Format the leaderboard data
    const leaderboard = topUsers.map((user, index) => ({
      username: user.username || `User${user._id.toString().slice(-4)}`,
      score: user.points,
      rank: index + 1,
      badges: user.badges?.map(badge => badge.icon) || []
    }));

    // If user is authenticated, get their rank
    let userRank = null;
    if (req.user) {
      const user = await User.findById(req.user.id);
      if (user) {
        // Count how many users have more points
        const higherRankedUsers = await User.countDocuments({ points: { $gt: user.points } });
        userRank = {
          username: user.username || `User${user._id.toString().slice(-4)}`,
          score: user.points,
          rank: higherRankedUsers + 1,
          badges: user.badges?.map(badge => badge.icon) || []
        };
      }
    }

    res.json({ leaderboard, userRank });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
}));

// @desc    Submit score to leaderboard
// @route   POST /api/leaderboard/scores
// @access  Private
router.post('/scores', auth, asyncHandler(async (req, res) => {
  const { score, quizType } = req.body;
  
  if (score === undefined) {
    res.status(400);
    throw new Error('Score is required');
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Update user's points
    user.points += score;
    
    // Check if we should award any badges
    if (user.points >= 1000 && !user.badges.some(badge => badge.name === 'Security Expert')) {
      user.badges.push({
        name: 'Security Expert',
        description: 'Earned 1000+ points in security quizzes',
        icon: '🏆'
      });
    } else if (user.points >= 500 && !user.badges.some(badge => badge.name === 'Security Pro')) {
      user.badges.push({
        name: 'Security Pro',
        description: 'Earned 500+ points in security quizzes',
        icon: '🔰'
      });
    } else if (user.points >= 100 && !user.badges.some(badge => badge.name === 'Security Novice')) {
      user.badges.push({
        name: 'Security Novice',
        description: 'Earned 100+ points in security quizzes',
        icon: '🛡️'
      });
    }

    await user.save();

    // Count how many users have more points to determine rank
    const higherRankedUsers = await User.countDocuments({ points: { $gt: user.points } });
    const userRank = higherRankedUsers + 1;

    res.json({
      success: true,
      points: user.points,
      rank: userRank,
      badges: user.badges
    });
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ message: 'Server error' });
  }
}));

module.exports = router;