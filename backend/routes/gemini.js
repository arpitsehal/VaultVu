const express = require('express');
const axios = require('axios');

const router = express.Router();

// POST /api/gemini/chat
router.post('/chat', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });
    }

    const { message, history } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    const model = req.query.model || 'gemini-1.5-flash-latest';

    // Construct contents with optional simple text history
    const contents = [];
    if (Array.isArray(history)) {
      history.forEach((h) => {
        if (!h || !h.role || !h.text) return;
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: String(h.text).slice(0, 8000) }],
        });
      });
    }
    contents.push({ role: 'user', parts: [{ text: message.slice(0, 8000) }] });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await axios.post(
      url,
      {
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' },
        ],
      },
      { timeout: 15000 }
    );

    const text =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      response?.data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('\n') ||
      '';

    return res.json({ text });
  } catch (err) {
    console.error('Gemini proxy error:', err?.response?.data || err.message);
    const status = err?.response?.status || 500;
    return res.status(status).json({ error: 'Gemini request failed', details: err?.response?.data || err.message });
  }
});

module.exports = router;
