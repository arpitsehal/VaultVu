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
          responseMimeType: 'text/plain',
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

// POST /api/gemini/url-analyze
// Analyze a URL for phishing/malware/suspicious patterns using Gemini and return a structured JSON verdict
router.post('/url-analyze', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });
    }

    const { urlToCheck, patternAnalysis } = req.body || {};
    if (!urlToCheck || typeof urlToCheck !== 'string') {
      return res.status(400).json({ error: 'urlToCheck is required' });
    }

    const model = req.query.model || 'gemini-1.5-flash-latest';

    // Craft a concise JSON-only instruction for reliable parsing
    const systemPrompt = [
      'You are a cybersecurity assistant. Analyze the given URL for phishing, malware, or suspicious behavior.',
      'Return ONLY compact JSON with keys: isSafe (boolean), riskScore (0-10 integer), category (string: Safe | Suspicious | Phishing | Malware | High Risk), reasons (string[]).',
      'Do not include any extra commentary or markdown.'
    ].join('\n');

    const userParts = [
      `URL: ${urlToCheck}`,
      'If provided, consider local pattern analysis as hints (not authoritative):',
      `Hints: ${patternAnalysis ? JSON.stringify(patternAnalysis).slice(0, 4000) : 'none'}`,
      'Be strict when indicators are strong. Set riskScore higher when multiple strong indicators exist.'
    ].join('\n');

    const contents = [
      { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userParts}` }] },
    ];

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await axios.post(
      url,
      {
        contents,
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 512,
          responseMimeType: 'application/json',
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

    const raw =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      response?.data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('\n') ||
      '';

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      // Fallback: try to extract JSON block
      const match = raw.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    if (!parsed || typeof parsed !== 'object') {
      return res.status(502).json({ error: 'Gemini returned unparseable result', raw });
    }

    // Normalize fields
    const result = {
      isSafe: Boolean(parsed.isSafe),
      riskScore: Math.max(0, Math.min(10, Number(parsed.riskScore) || 0)),
      category: String(parsed.category || ''),
      reasons: Array.isArray(parsed.reasons) ? parsed.reasons.map(String) : [],
    };

    return res.json(result);
  } catch (err) {
    console.error('Gemini URL analyze error:', err?.response?.data || err.message);
    const status = err?.response?.status || 500;
    return res.status(status).json({ error: 'Gemini URL analyze failed', details: err?.response?.data || err.message });
  }
});

module.exports = router;
