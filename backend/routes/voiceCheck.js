const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// You can get an API key from a voice analysis service
// For example: AssemblyAI, Google Speech-to-Text, etc.
const VOICE_ANALYSIS_API_KEY = process.env.VOICE_ANALYSIS_API_KEY || 'cefd9ec0b1354bbb8365faeab5e4c8d1';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Common voice fraud indicators
const fraudIndicators = [
  { pattern: /urgent|immediate action|act now|limited time/i, reason: 'Uses urgency tactics' },
  { pattern: /congratulations|winner|won|prize|award|lottery/i, reason: 'Promises prizes or rewards' },
  { pattern: /bank|account|suspend|verify|confirm|security|update/i, reason: 'Banking/account verification keywords' },
  { pattern: /password|login|credential|verify identity|authenticate/i, reason: 'Requests sensitive credentials' },
  { pattern: /money|cash|fund|payment|transfer|deposit/i, reason: 'Mentions money or payments' },
  { pattern: /government|tax|IRS|refund|stimulus|benefit/i, reason: 'Impersonates government entities' },
  { pattern: /investment|stock|crypto|bitcoin|ethereum|profit|return/i, reason: 'Suspicious investment opportunity' },
  { pattern: /free|discount|offer|deal|save|bargain/i, reason: 'Too-good-to-be-true offers' },
  { pattern: /kindly|please|help|assist|support|favor/i, reason: 'Emotional manipulation tactics' },
];

// Check voice message for fraud indicators
router.post('/', async (req, res) => {
  try {
    const { audioData, fileName, fileType } = req.body;
    
    if (!audioData) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    // Initialize variables
    let isGenuine = true;
    let riskScore = 0;
    const reasons = [];
    let gemini = null;
    
    try {
      // Save the audio file temporarily
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      const tempFilePath = path.join(tempDir, `${uuidv4()}-${fileName || 'audio.wav'}`);
      fs.writeFileSync(tempFilePath, Buffer.from(audioData, 'base64'));
      
      // For demonstration purposes, we'll simulate an API call to a voice analysis service
      // In a real implementation, you would use a service like AssemblyAI, Google Speech-to-Text, etc.
      
      // Simulated transcription result
      // In a real implementation, you would send the audio file to a speech-to-text API
      const transcription = simulateTranscription(tempFilePath);
      
      // Check for fraud indicators in the transcription
      let fraudCount = 0;
      for (const indicator of fraudIndicators) {
        if (indicator.pattern.test(transcription)) {
          reasons.push(indicator.reason);
          fraudCount++;
        }
      }
      
      // Calculate risk score based on number of fraud indicators found
      if (fraudCount > 0) {
        riskScore = Math.min(Math.round((fraudCount / fraudIndicators.length) * 10) + 2, 10);
        if (riskScore >= 5) {
          isGenuine = false;
        }
      }
      
      // Add voice analysis results
      const voiceAnalysis = simulateVoiceAnalysis();
      
      if (voiceAnalysis.deepfakeScore > 0.6) {
        isGenuine = false;
        riskScore = Math.max(riskScore, 8);
        reasons.push('Voice characteristics suggest possible deepfake or voice cloning');
      }
      
      if (voiceAnalysis.emotionalManipulation > 0.7) {
        riskScore += 2;
        reasons.push('Voice tone indicates emotional manipulation tactics');
      }
      
      // Gemini analysis as an additional layer (if configured)
      if (GEMINI_API_KEY) {
        try {
          const prompt = {
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text:
                      'You are a security analyst. Given a call transcript and simple acoustic risk cues, assess scam/fraud risk. Return ONLY strict JSON with keys: isGenuine (boolean), riskScore (0-10 integer), category ("Scam"|"Legitimate"|"Suspicious"|"Phishing"), reasons (string[]). Be concise.'
                  },
                  { text: `\n\nTranscript:\n${transcription}` },
                  { text: `\nDeepfakeScore: ${voiceAnalysis.deepfakeScore}` },
                  { text: `\nEmotionalManipulation: ${voiceAnalysis.emotionalManipulation}` },
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
              riskScore = Math.min(10, riskScore + Math.max(0, Math.min(10, Math.round(gemini.riskScore))));
            }
            if (Array.isArray(gemini.reasons)) {
              reasons.push(...gemini.reasons);
            }
          }
        } catch (gerr) {
          console.error('Gemini voice analysis failed:', gerr?.response?.data || gerr?.message);
        }
      }

      // Clean up the temporary file
      fs.unlinkSync(tempFilePath);
      
      // Return the result
      return res.json({
        isGenuine,
        riskScore: Math.min(riskScore, 10),
        reasons: [...new Set(reasons)], // Remove duplicates
      });
      
    } catch (error) {
      console.error('Error analyzing voice message:', error);
      return res.status(500).json({ error: 'Failed to analyze voice message' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Simulate transcription (in a real implementation, you would use a speech-to-text API)
function simulateTranscription(filePath) {
  // This is just a simulation - in a real implementation, you would send the file to a speech-to-text API
  const possibleTranscriptions = [
    "Hello, this is your bank calling. We need to verify your account information immediately.",
    "Congratulations! You've won a prize. Please provide your details to claim it.",
    "This is a normal message without any suspicious content.",
    "We detected unusual activity on your account. Please confirm your password.",
    "This is just a friendly reminder about our meeting tomorrow."
  ];
  
  return possibleTranscriptions[Math.floor(Math.random() * possibleTranscriptions.length)];
}

// Simulate voice analysis (in a real implementation, you would use a voice analysis API)
function simulateVoiceAnalysis() {
  return {
    deepfakeScore: Math.random(),  // 0-1 score, higher means more likely to be deepfake
    emotionalManipulation: Math.random(),  // 0-1 score, higher means more emotional manipulation
    confidence: 0.7 + (Math.random() * 0.3)  // 0.7-1.0 confidence score
  };
}

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