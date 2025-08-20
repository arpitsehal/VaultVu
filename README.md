# VaultVu – Your Shield in the Digital World 🛡️

## Overview

VaultVu is a comprehensive Expo-powered mobile application to protect users from digital fraud and scams. It combines on-device heuristics with backend verification and AI assistance to help users stay safe online.

Highlights include proactive scam detection, rich URL analysis with pattern learning, fraud message and phone checks, voice call risk analysis, gamified security quizzes with leaderboard, and personal finance tools (budget, SIP & EMI trackers).

## 🚀 Key Features

- **URL Fraud Checker** (`app/URLTheftCheckerScreen.tsx`):
  - Local pattern analysis (brand spoofing, suspicious TLDs, URL shorteners, IPs, malware extensions) with weighted risk scoring
  - Parallel checks via Google Safe Browsing proxy (`backend/routes/urlCheck.js`) and Gemini verdicts (`/api/gemini/url-analyze`)
  - Interactive test examples (Safe/Phishing/Suspicious) and detailed analysis breakdown
- **Fraud Message Checker** (`app/FraudMessageCheckerScreen.tsx`):
  - Local regex indicators + APILayer Spam Checker fallback (`backend/routes/messageCheck.js`)
  - Risk scoring with clear reasons
- **Phone/Spam Number Checker** (`app/CheckSpamScreen.tsx`):
  - Numverify lookup with carrier/location + local spam indicators (`backend/routes/phoneCheck.js`)
- **Voice Fraud Checker** (`app/VoiceTheftCheckerScreen.tsx`):
  - Simulated voice transcription and deepfake/emotional manipulation scoring (`backend/routes/voiceCheck.js`)
- **AI Chatbot (Gemini)** (`app/chatbot.tsx`):
  - Server-side Gemini proxy endpoints (`backend/routes/gemini.js`) for chat and URL analysis
- **Gamified Learning**:
  - Daily quizzes, level progression, battle mode (`app/dailyquiz.tsx`, `app/quizLevel.tsx`, `app/quizBattle.tsx`)
  - Coins and points, unlockable levels, badges, and leaderboard (`backend/routes/userRoutes.js`, `backend/routes/leaderboardRoutes.js`)
- **Budget Manager & Trackers**:
  - Budget categories, transactions, and progress (`app/BudgetManagerScreen.tsx`, `app/BudgetTrackerScreen.tsx`, `backend/routes/budgetRoutes.js`)
  - SIP and EMI trackers (`app/SIPTrackerScreen.tsx`, `app/EMIManagerScreen.tsx`)
- **Multi-language support** (`contexts/LanguageContext.js`): English, Hindi, Punjabi (comprehensive fraud-type translations)
- **Auth & Profile** (`app/signin.tsx`, `app/signup.tsx`, `backend/routes/auth.js`): email/username login, complete profile, JWT-based auth
- **General Fraud Education**: Multiple screens covering common fraud types under `app/*.tsx` (e.g., phishing, KYC, loans, investments)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ (works well with Expo SDK 53 / RN 0.79)
- **npm** or **Yarn**
- **MongoDB** (Atlas or self-hosted)
- **Expo CLI** (`npm install -g expo-cli`)
- **Expo Go** app installed on your mobile device (for live testing)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd VaultVu
```

### 2. Install Frontend (Expo) Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Configure Backend Environment

Create a `.env` file in the `backend` directory and add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NUMVERIFY_API_KEY=your_numverify_api_key
SPAM_CHECK_API_KEY=your_spam_check_api_key
GOOGLE_SAFE_BROWSING_API_KEY=your_google_safe_browsing_api_key
VOICE_ANALYSIS_API_KEY=your_voice_analysis_api_key
GEMINI_API_KEY=your_gemini_api_key
# Optional: restrict CORS for production (comma-separated list)
CORS_ORIGIN=https://your-app-domain.com,https://another-domain.com
```

> **Note**: Replace the placeholder values with your actual API keys and MongoDB connection string.

### 5. Configure Frontend API Base URL

Frontend reads the base API URL from `EXPO_PUBLIC_API_URL` via `services/apiConfig.js`.

- For local development, create/update `./.env.development` in the project root:

```env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5000
```

- For production, set it to your deployed backend (default baked in repo: `https://vaultvu.onrender.com`).

Finding your IP address:
- Windows: `ipconfig`
- macOS/Linux: `ifconfig` or `ip addr`

## Running the Application

### 1. Start the Backend Server

Open a terminal and run:

```bash
cd backend
npm install
npm run dev   # or: npm start
```



The server will start on port 5000 (or the port specified in your `.env` file).

### 2. Start the Frontend (Expo)

In a new terminal window, run:

```bash
npm start
```

This will start the Expo development server and display a QR code.

### 3. Run on Your Mobile Device

1. Install the **Expo Go** app on your mobile device
2. Ensure your mobile device is connected to the same Wi-Fi network as your computer
3. Scan the QR code with your camera (iOS) or the Expo Go app (Android)

## Notable Modules & Behavior

- **Date/Document Picker**: `@react-native-community/datetimepicker`, `expo-document-picker`, `expo-file-system` are used by signup and voice checker flows.
- **Android UI adjustments**: URL checker improves StatusBar handling, safe area, and ScrollView behavior for better Android visibility.
- **TypeScript**: Strong typing across URL checker (interfaces like `AnalysisDetails`, `URLResult`) and quiz components.

## Backend API Endpoints

Base path defaults to `http://localhost:5000` (or your `EXPO_PUBLIC_API_URL`). See `backend/server.js`.

- **Auth** (`/api/auth`):
  - POST `/register` – create account
  - POST `/login` – login with email or username
  - POST `/complete-profile` – finalize profile
  - GET `/profile` – get profile (Bearer)
  - PUT `/profile` – update profile (Bearer)
- **Users / Quiz** (`/api/users`):
  - POST `/` – register user (alt path)
  - POST `/login` – login (alt path)
  - GET `/quiz-levels` (Bearer)
  - POST `/quiz-levels/unlock` (Bearer)
  - POST `/quiz-levels/complete` (Bearer)
  - POST `/quiz/battle` (Bearer)
  - POST `/quiz-rewards` (Bearer)
- **Leaderboard** (`/api/leaderboard`):
  - GET `/scores` – top users
  - POST `/scores` (Bearer) – submit score
- **Budget** (`/api/budget` – Bearer):
  - GET `/categories` – list/init categories
  - POST `/categories` – add category
  - PUT `/categories/:id` – update category
  - DELETE `/categories/:id` – remove category
  - POST `/categories/:id/transactions` – add transaction
- **Safety Checks**:
  - POST `/api/url-check` – URL risk analysis (Google Safe Browsing + heuristics)
  - POST `/api/message-check` – spam/fraud message analysis
  - POST `/api/phone-check` – phone number validation & risk
  - POST `/api/voice-check` – voice fraud analysis (simulated)
- **Gemini** (`/api/gemini`):
  - POST `/chat` – chat proxy
  - POST `/url-analyze` – URL verdict JSON { isSafe, riskScore, category, reasons }

Environment variables used by backend: see “Configure Backend Environment”.

## Tech Stack

- Frontend: Expo SDK 53, React 19, React Native 0.79, Expo Router, React Navigation, React Native Paper
- Backend: Node/Express, MongoDB (Mongoose), JWT Auth, CORS, Axios
- Services/APIs: Google Safe Browsing, APILayer Spam Check, Numverify, Gemini (Generative Language API)

## Security

This app follows OWASP Mobile Top 10 and CERT-In-aligned practices. Key measures in this codebase:

- __HTTPS only (Cleartext blocked)__
  - Android manifest attribute `android:usesCleartextTraffic=false` applied via `expo-build-properties`.
  - All API calls use `https://` (see `services/apiConfig.js`, `services/authService.js`).

- __No app data backup__
  - `android:allowBackup=false` set in `app.json` and manifest attributes via `expo-build-properties`.

- __Code minification/obfuscation__
  - Release builds enable Proguard and resource shrinking via `expo-build-properties`.

- __Compromised-device and dev-mode blocking__
  - `app/(tabs)/_layout.tsx` checks for rooted/jailbroken devices using `expo-device` and blocks in production variant.
  - Also blocks if a dev build is detected for production variant.

- __Sensitive input hardening__
  - Password fields (`app/signin.tsx`, `app/newpass.tsx`) disable context menu and autofill to reduce data leakage.

### Backend security

- __Password hashing__: `bcryptjs` with salt rounds (see `backend/routes/auth.js` `register` and `reset-password`). Passwords are never stored in plain text.
- __JWT authentication__: `jsonwebtoken` issues tokens with 7d expiry at login (see `backend/routes/auth.js`). Protected endpoints verify JWT via `Authorization: Bearer <token>`.
- __OTP-based password reset__: OTP hashed with bcrypt and expires in 15 minutes; on success, password is re-hashed and tokens cleared.

### Future/optional hardening

- SSL Pinning (requires custom dev client or bare workflow with a pinning lib).
- Encrypt local secrets at rest using `expo-secure-store` instead of `AsyncStorage` for tokens.
- Explicitly minimize Android permissions after auditing feature usage.

## Troubleshooting

### Connection Issues

If your mobile device cannot connect to the backend server:

- Ensure both devices are on the same Wi-Fi network
- Check if your computer's firewall is blocking the connection
- Verify that you've updated all API URLs with your correct IP address
- Try restarting both the backend and Expo development servers

### Date/Build Issues

- Ensure required packages are installed (see `package.json` dependencies)
- Clear Expo cache if needed:

```bash
expo r -c
```

### API Base URL

- Verify `EXPO_PUBLIC_API_URL` in `./.env.development`
- Check CORS settings via `CORS_ORIGIN` if calling from web/preview

## Team

- **Arpit Kumar** - Lead Developer
- **Mehakpreet Kaur Cheema** - UI/UX Designer and Frontend Developer
- **Bisman Kaur** - Backend Developer
- **Ananya Sawhney** - Frontend Developer

## License

MIT License
