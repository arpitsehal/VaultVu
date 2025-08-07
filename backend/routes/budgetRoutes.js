const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get all budget categories for a user
router.get('/categories', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If user doesn't have budget categories yet, initialize with defaults
    if (!user.budgetCategories || user.budgetCategories.length === 0) {
      user.budgetCategories = [
        { id: 1, name: 'Housing', budget: 15000, spent: 0, transactions: [] },
        { id: 2, name: 'Food', budget: 8000, spent: 0, transactions: [] },
        { id: 3, name: 'Transportation', budget: 5000, spent: 0, transactions: [] },
        { id: 4, name: 'Entertainment', budget: 3000, spent: 0, transactions: [] },
        { id: 5, name: 'Utilities', budget: 4000, spent: 0, transactions: [] },
      ];
      await user.save();
    }

    res.json({ success: true, categories: user.budgetCategories });
  } catch (error) {
    console.error('Error fetching budget categories:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add a new budget category
router.post('/categories', auth, async (req, res) => {
  try {
    const { name, budget } = req.body;
    if (!name || !budget) {
      return res.status(400).json({ success: false, message: 'Name and budget are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Initialize budgetCategories if it doesn't exist
    if (!user.budgetCategories) {
      user.budgetCategories = [];
    }

    // Create a new category with a unique ID
    const newCategoryId = user.budgetCategories.length > 0 
      ? Math.max(...user.budgetCategories.map(c => c.id)) + 1 
      : 1;

    const newCategory = {
      id: newCategoryId,
      name,
      budget: Number(budget),
      spent: 0,
      transactions: []
    };

    user.budgetCategories.push(newCategory);
    await user.save();

    res.json({ success: true, category: newCategory });
  } catch (error) {
    console.error('Error adding budget category:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update a budget category
router.put('/categories/:id', auth, async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const updates = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find the category index
    const categoryIndex = user.budgetCategories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Update the category
    user.budgetCategories[categoryIndex] = {
      ...user.budgetCategories[categoryIndex],
      ...updates
    };

    await user.save();
    res.json({ success: true, category: user.budgetCategories[categoryIndex] });
  } catch (error) {
    console.error('Error updating budget category:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete a budget category
router.delete('/categories/:id', auth, async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Filter out the category to delete
    user.budgetCategories = user.budgetCategories.filter(cat => cat.id !== categoryId);
    await user.save();

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget category:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add a transaction to a category
router.post('/categories/:id/transactions', auth, async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const { description, amount, date } = req.body;

    if (!description || !amount) {
      return res.status(400).json({ success: false, message: 'Description and amount are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find the category
    const categoryIndex = user.budgetCategories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Create a new transaction
    const newTransaction = {
      id: Date.now(),
      description,
      amount: Number(amount),
      date: date || new Date().toISOString()
    };

    // Add the transaction to the category
    if (!user.budgetCategories[categoryIndex].transactions) {
      user.budgetCategories[categoryIndex].transactions = [];
    }
    user.budgetCategories[categoryIndex].transactions.push(newTransaction);

    // Update the spent amount
    user.budgetCategories[categoryIndex].spent += Number(amount);

    await user.save();
    res.json({ 
      success: true, 
      transaction: newTransaction,
      category: user.budgetCategories[categoryIndex]
    });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;