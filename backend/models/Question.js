const express = require('express');

// We export a function that returns the router
module.exports = (Question) => {
    const router = express.Router();

    // GET: Fetch random questions for the quiz
    router.get('/', async (req, res) => {
        try {
            console.log('Attempting to fetch quiz questions from database...');
            
            const questions = await Question.aggregate([{ $sample: { size: 5 } }]);
            
            console.log('Questions fetched:', questions);

            res.json(questions);
        } catch (err) {
            console.error('Error fetching quiz questions:', err);
            res.status(500).json({ success: false, error: err.message });
        }
    });

    return router;
};