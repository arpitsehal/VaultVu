const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const BudgetCategorySchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  spent: {
    type: Number,
    default: 0
  },
  transactions: [TransactionSchema]
});

// Badge schema for user achievements
const BadgeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  dateEarned: {
    type: Date,
    default: Date.now
  }
});

// Quiz progress schema to track completed levels
const QuizLevelSchema = new Schema({
  levelId: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  score: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date
  }
});

// Add this to your existing UserSchema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  resetPasswordToken: {
    type: String,
    default: undefined
  },
  resetPasswordExpires: {
    type: Date,
    default: undefined
  },
  username: {
    type: String,
    unique: true,
    sparse: true, // Allows null/undefined values to be unique
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
  },
  country: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
  },
  profileComplete: {
    type: Boolean,
    default: false,
  },
  // Quiz and gamification related fields
  coins: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  lastQuizDate: {
    type: Date
  },
  badges: [BadgeSchema],
  quizLevels: [QuizLevelSchema],
  leaderboardRank: {
    type: Number
  },
  budgetCategories: [BudgetCategorySchema]
});

module.exports = mongoose.model('User', userSchema);