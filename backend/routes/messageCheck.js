const express = require('express');
const router = express.Router();
const axios = require('axios');

// You can get an API key from APILayer's Spam Check API
// https://apilayer.com/marketplace/spamchecker-api
const SPAM_CHECK_API_KEY = process.env.SPAM_CHECK_API_KEY || 'SqS0t646UxR1NE71M4V4D7PI4IXRCoqB';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Common fraud message indicators for local checking
const fraudIndicators = [
  { pattern: /urgent|immediate action|act now|limited time/i, reason: 'Uses urgency tactics' },
  { pattern: /congratulations|winner|won|prize|award|lottery/i, reason: 'Promises prizes or rewards' },
  { pattern: /bank|account|suspend|verify|confirm|security|update/i, reason: 'Banking/account verification keywords' },
  { pattern: /password|login|credential|verify identity|authenticate/i, reason: 'Requests sensitive credentials' },
  { pattern: /click|link|http|https|www|bit\.ly|tinyurl/i, reason: 'Contains suspicious links' },
  { pattern: /\$\d+|\d+\s*(USD|EUR|GBP)|money|cash|fund|payment/i, reason: 'Mentions money or payments' },
  { pattern: /government|tax|IRS|refund|stimulus|benefit/i, reason: 'Impersonates government entities' },
  { pattern: /investment|stock|crypto|bitcoin|ethereum|profit|return/i, reason: 'Suspicious investment opportunity' },
  { pattern: /dear customer|valued customer|user|client without specific name/i, reason: 'Generic greeting without personalization' },
  { pattern: /free|discount|offer|deal|save|bargain/i, reason: 'Too-good-to-be-true offers' },
  { pattern: /kindly|please|help|assist|support|favor/i, reason: 'Emotional manipulation tactics' },
  { pattern: /\+?\d{10,}/i, reason: 'Contains phone number - potential scam contact method' },
  { pattern: /[^\x00-\x7F]/i, reason: 'Contains non-ASCII characters (potential obfuscation)' },
];

// Check message for fraud indicators
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    // Initialize variables
    let isGenuine = true;
    let riskScore = 0;
    const reasons = [];
    let gemini = null;

    try {
      // First, check with Spam Check API from APILayer
      const apiUrl = `https://api.apilayer.com/spam_check`;
      const response = await axios.post(apiUrl, 
        { text: message },
        { 
          headers: {
            'apikey': SPAM_CHECK_API_KEY,
            'Content-Type': 'application/json'
          } 
        }
      );

      const data = response.data;

      if (data.spam) {
        isGenuine = false;
        // Convert the spam score to our 0-10 scale
        // APILayer returns a score between 0-100
        riskScore = Math.min(Math.round(data.score / 10), 10);
        reasons.push('Message identified as spam by automated analysis');

        if (data.details && data.details.length > 0) {
          data.details.forEach(detail => {
            reasons.push(detail);
          });
        }
      }

      // Second layer: Google Gemini analysis (if key is configured)
      if (GEMINI_API_KEY) {
        try {
          const prompt = {
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text:
                      'You are a security analyst. Analyze the following user message for fraud, phishing, or spam risk. Respond ONLY with strict JSON having keys: isGenuine (boolean), riskScore (integer 0-10), category ("Spam"|"Phishing"|"Legitimate"|"Scam"|"Suspicious"), reasons (string[]). Be concise.'
                  },
                  { text: `\n\nMessage:\n${message}` },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              topP: 0.9,
              topK: 40,
              maxOutputTokens: 256,
              responseMimeType: 'application/json',
            },
          };

          const gemRes = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
            prompt,
            { headers: { 'Content-Type': 'application/json' } }
          );

          const text = gemRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          gemini = safeParseGeminiJSON(text);
        } catch (gerr) {
          console.error('Gemini message analysis failed:', gerr?.response?.data || gerr?.message);
        }
      }

      // Even if API says it's not spam, still check our custom patterns
      // as a second layer of protection
      fraudIndicators.forEach(indicator => {
        if (indicator.pattern.test(message)) {
          isGenuine = false;
          riskScore += 1; // Increase risk score for each match

          // Only add the reason if it's not already in the list
          if (!reasons.includes(indicator.reason)) {
            reasons.push(indicator.reason);
          }
        }
      });

      // Merge Gemini result
      if (gemini) {
        if (typeof gemini.isGenuine === 'boolean') {
          isGenuine = isGenuine && gemini.isGenuine; // stricter outcome
        } else if (typeof gemini.isSafe === 'boolean') {
          // compatibility with {isSafe}
          isGenuine = isGenuine && gemini.isSafe;
        }
        if (Number.isFinite(gemini.riskScore)) {
          riskScore += Math.max(0, Math.min(10, Math.round(gemini.riskScore)));
        }
        if (Array.isArray(gemini.reasons)) {
          reasons.push(...gemini.reasons);
        }
      }

      // Cap the risk score at 10
      riskScore = Math.min(riskScore, 10);

      // If no indicators were found, the message is likely genuine
      if (reasons.length === 0) {
        reasons.push('No suspicious patterns detected');
      }

      res.json({
        message: message.substring(0, 100) + (message.length > 100 ? '...' : ''), // Truncate for response
        isGenuine,
        riskScore,
        reasons,
      });
    } catch (apiError) {
      console.error('Spam Check API error:', apiError);

      // Fallback to local checks if API fails
      fraudIndicators.forEach(indicator => {
        if (indicator.pattern.test(message)) {
          isGenuine = false;
          riskScore += 1;
          reasons.push(indicator.reason);
        }
      });

      // Add a note about the API failure
      reasons.push('Note: External spam check failed, using local checks only');

      if (reasons.length === 1) { // Only the API failure note
        reasons.push('No suspicious patterns detected locally');
      }

      res.json({
        message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
        isGenuine,
        riskScore,
        reasons,
      });
    }
  } catch (error) {
    console.error('Message check error:', error);
    res.status(500).json({ error: 'Server error during message check' });
  }
});

// Safe parser for Gemini JSON responses
function safeParseGeminiJSON(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (_) {
    // attempt to extract JSON object
    const m = text.match(/\{[\s\S]*\}/);
    if (m) {
      try { return JSON.parse(m[0]); } catch (_) {}
    }
  }
  return null;
}

module.exports = router;