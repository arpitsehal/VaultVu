const express = require('express');
const router = express.Router();

// Import the Google Safe Browsing API client
const SafeBrowsing = require('safe-browse-url-lookup');

// You'll need to get an API key from Google Cloud Console
// https://console.cloud.google.com/apis/credentials
const GOOGLE_API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY || 'YOUR_API_KEY_HERE';

// Initialize the Safe Browsing client
const lookup = SafeBrowsing({ apiKey: GOOGLE_API_KEY });

// Generic indicators (brand-specific checks are handled via hostname logic below)
const phishingIndicators = [
  { pattern: /login|signin|verify|secure|account|password|update|confirm/i, reason: 'Contains sensitive keywords' },
  { pattern: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, reason: 'Contains IP address instead of domain name' },
  { pattern: /bit\.ly|tinyurl\.com|goo\.gl|t\.co|is\.gd|buff\.ly|ow\.ly|j\.mp/i, reason: 'Uses URL shortener service' },
  { pattern: /[^\x00-\x7F]/, reason: 'Contains non-ASCII characters (potential homograph attack)' },
  { pattern: /\.(tk|ml|ga|cf|gq|pw)\//i, reason: 'Uses free domain often associated with abuse' },
];

// Check URL for phishing indicators
router.post('/', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Initialize variables
    let isSafe = true;
    let riskScore = 0;
    const reasons = [];
    
    try {
      // First, check with Google Safe Browsing API
      const isMalicious = await lookup.checkSingle(url);
      
      if (isMalicious) {
        isSafe = false;
        riskScore = 10; // Maximum risk score for Google-identified threats
        reasons.push('URL identified as unsafe by Google Safe Browsing');
      } else {
        // If Google says it's safe, still check our custom patterns as a second layer
        // Extract hostname for brand checks
        let hostname = '';
        try {
          const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
          hostname = parsed.hostname.toLowerCase();
        } catch (_) {
          // ignore parse errors
        }

        // Brand rules: if hostname legitimately ends with brand domain, do NOT flag as suspicious brand
        const brands = [
          { name: 'google', domain: 'google.com' },
          { name: 'paypal', domain: 'paypal.com' },
          { name: 'apple', domain: 'apple.com' },
          { name: 'amazon', domain: 'amazon.com' },
          { name: 'microsoft', domain: 'microsoft.com' },
          { name: 'facebook', domain: 'facebook.com' },
          { name: 'instagram', domain: 'instagram.com' },
          { name: 'twitter', domain: 'twitter.com' },
          { name: 'netflix', domain: 'netflix.com' },
        ];

        brands.forEach(({ name, domain }) => {
          if (!hostname) return;
          const containsBrand = hostname.includes(name);
          const legit = hostname === domain || hostname.endsWith(`.${domain}`);
          if (containsBrand && !legit) {
            isSafe = false;
            riskScore += 2;
            reasons.push(`Suspicious ${name} domain`);
          }
        });

        // Generic regex indicators
        phishingIndicators.forEach((indicator) => {
          if (indicator.pattern.test(url)) {
            isSafe = false;
            riskScore += 2; // Increase risk score for each match
            reasons.push(indicator.reason);
          }
        });
        
        // Cap the risk score at 10
        riskScore = Math.min(riskScore, 10);
        
        // If no specific indicators were found but the URL looks suspicious
        if (reasons.length === 0) {
          // Check for excessive subdomains
          const subdomainCount = (url.match(/\./g) || []).length;
          if (subdomainCount > 3) {
            reasons.push('Excessive number of subdomains');
            riskScore += 2;
          }
          
          // Check for very long domain names
          const domainMatch = url.match(/:\/\/([^\/]+)/);
          if (domainMatch && domainMatch[1].length > 30) {
            reasons.push('Unusually long domain name');
            riskScore += 1;
          }
        }
        
        // If no indicators were found, the URL is likely safe
        if (reasons.length === 0) {
          reasons.push('No suspicious patterns detected');
        } else {
          isSafe = false;
        }
        
        res.json({
          url,
          isSafe,
          riskScore,
          reasons,
        });
      }
    } catch (apiError) {
      console.error('Google Safe Browsing API error:', apiError);
      
      // Fallback to local checks if Google API fails
      phishingIndicators.forEach((indicator) => {
        if (indicator.pattern.test(url)) {
          isSafe = false;
          riskScore += 2;
          reasons.push(indicator.reason);
        }
      });
      
      // Cap the risk score
      riskScore = Math.min(riskScore, 10);
      
      // Add a note about the API failure
      reasons.push('Note: Google Safe Browsing check failed, using local checks only');
      
      if (reasons.length === 1) { // Only the API failure note
        reasons.push('No suspicious patterns detected locally');
      }
      
      res.json({
        url,
        isSafe,
        riskScore,
        reasons,
      });
    }
  } catch (error) {
    console.error('URL check error:', error);
    res.status(500).json({ error: 'Server error during URL check' });
  }
});

module.exports = router;