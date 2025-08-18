const express = require('express');
const router = express.Router();
const axios = require('axios');

// You'll need to get an API key from Numverify
// https://numverify.com/
const NUMVERIFY_API_KEY = process.env.NUMVERIFY_API_KEY || 'ec1577ec5efa7dd8e193d57880e2fcdc';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Common spam indicators for phone numbers
const spamIndicators = [
  { pattern: /^\+?1800/, reason: 'Potential toll-free spam number' },
  { pattern: /^\+?1888/, reason: 'Potential toll-free spam number' },
  { pattern: /^\+?1877/, reason: 'Potential toll-free spam number' },
  { pattern: /^\+?1866/, reason: 'Potential toll-free spam number' },
  { pattern: /^\+?1855/, reason: 'Potential toll-free spam number' },
  { pattern: /^\+?1844/, reason: 'Potential toll-free spam number' },
  { pattern: /^\+?1833/, reason: 'Potential toll-free spam number' },
  { pattern: /^\+?1822/, reason: 'Potential toll-free spam number' },
  { pattern: /^\+?1900/, reason: 'Premium rate number - potential scam' },
  { pattern: /^\+?1976/, reason: 'Premium rate number - potential scam' },
];

// Check phone number for spam indicators
router.post('/', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Initialize variables
    let isGenuine = true;
    let riskScore = 0;
    const reasons = [];
    let carrierInfo = null;
    let location = null;
    let lineType = null;
    let gemini = null;

    try {
      // First, check with Numverify API
      const numverifyUrl = `http://apilayer.net/api/validate?access_key=${NUMVERIFY_API_KEY}&number=${phoneNumber}`;
      const response = await axios.get(numverifyUrl);
      const data = response.data;

      if (!data.valid) {
        isGenuine = false;
        riskScore = 10; // Maximum risk score for invalid numbers
        reasons.push('Invalid phone number format');
      } else {
        // Store carrier and location info
        carrierInfo = data.carrier || 'Unknown';
        location = data.location || data.country_name || 'Unknown';
        lineType = data.line_type || 'Unknown';

        // Check if it's a mobile, landline, or VoIP
        if (data.line_type === 'voip') {
          riskScore += 3;
          reasons.push('VoIP number - potentially higher risk');
        }

        // Check for toll-free or premium numbers using our patterns
        spamIndicators.forEach(indicator => {
          if (indicator.pattern.test(phoneNumber)) {
            isGenuine = false;
            riskScore += 2; // Increase risk score for each match
            reasons.push(indicator.reason);
          }
        });

        // Cap the risk score at 10
        riskScore = Math.min(riskScore, 10);

        // Gemini analysis as an additional layer
        if (GEMINI_API_KEY) {
          try {
            const prompt = {
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text:
                        'You are a telecom fraud analyst. Given a phone number and metadata, assess scam/spam risk. Return ONLY strict JSON with keys: isGenuine (boolean), riskScore (0-10 integer), category ("Scam"|"Spam"|"Legitimate"|"Suspicious"), reasons (string[]). Be concise.'
                    },
                    { text: `\n\nPhone Number: ${phoneNumber}` },
                    { text: `\nCarrier: ${carrierInfo}` },
                    { text: `\nLocation: ${location}` },
                    { text: `\nLine Type: ${lineType}` },
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

            if (gemini) {
              if (typeof gemini.isGenuine === 'boolean') {
                isGenuine = isGenuine && gemini.isGenuine;
              } else if (typeof gemini.isSafe === 'boolean') {
                isGenuine = isGenuine && gemini.isSafe;
              }
              if (Number.isFinite(gemini.riskScore)) {
                riskScore += Math.max(0, Math.min(10, Math.round(gemini.riskScore)));
              }
              if (Array.isArray(gemini.reasons)) {
                reasons.push(...gemini.reasons);
              }
              riskScore = Math.min(riskScore, 10);
            }
          } catch (gerr) {
            console.error('Gemini phone analysis failed:', gerr?.response?.data || gerr?.message);
          }
        }
      }

      // If no indicators were found, the phone number is likely genuine
      if (reasons.length === 0) {
        reasons.push('No suspicious patterns detected');
      }

      res.json({
        phoneNumber,
        isGenuine,
        riskScore,
        reasons,
        carrierInfo,
        location,
        lineType
      });
    } catch (apiError) {
      console.error('Numverify API error:', apiError);

      // Fallback to local checks if API fails
      spamIndicators.forEach(indicator => {
        if (indicator.pattern.test(phoneNumber)) {
          isGenuine = false;
          riskScore += 2;
          reasons.push(indicator.reason);
        }
      });

      // Cap the risk score
      riskScore = Math.min(riskScore, 10);

      // Add a note about the API failure
      reasons.push('Note: Numverify check failed, using local checks only');

      if (reasons.length === 1) { // Only the API failure note
        reasons.push('No suspicious patterns detected locally');
      }

      res.json({
        phoneNumber,
        isGenuine,
        riskScore,
        reasons,
        carrierInfo: 'Unknown (API error)',
        location: 'Unknown (API error)',
        lineType: 'Unknown (API error)'
      });
    }
  } catch (error) {
    console.error('Phone check error:', error);
    res.status(500).json({ error: 'Server error during phone number check' });
  }
});

// Safe parser for Gemini JSON responses
function safeParseGeminiJSON(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (_) {
    const m = text.match(/\{[\s\S]*\}/);
    if (m) {
      try { return JSON.parse(m[0]); } catch (_) {}
    }
  }
  return null;
}

module.exports = router;