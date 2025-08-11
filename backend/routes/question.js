// ./routes/question.js
const express = require('express');

module.exports = (quizConnection) => {
    const router = express.Router();
    
    // Create your Question model using the quiz connection
    const Question = quizConnection.model('Question', {
        question_text: String,
        category: String,
        difficulty: String,
        options: [String],
        correct_answer: String,
        tags: [String],
        created_at: { type: Date, default: Date.now }
    });
    
    // Your routes
    router.get('/', async (req, res) => {
        try {
            const questions = await Question.find();
            res.json(questions);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
    
    router.post('/', async (req, res) => {
        try {
            const question = new Question(req.body);
            await question.save();
            res.status(201).json(question);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });
    
    return router; // Return the router!
};