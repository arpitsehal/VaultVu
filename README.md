# VaultVu – Your Shield in the Digital World 🛡️

## Overview

VaultVu is a comprehensive mobile application designed to protect users from digital fraud and scams. It provides proactive scam detection, fraud message analysis, URL safety checks, spam filtering, secure password management, and robust profile controls.

## 🚀 Key Features

- **Scam Protection**: Detects and alerts you to potential scams
- **Fraud Protection**: Flags fraudulent messages and suspicious activities
- **URL Fraud Checker**: Screens URLs for phishing or malicious intent
- **Spam Message Checker**: Automatically filters unwanted spam messages
- **Password Management**: Secure storage and management of credentials
- **Multi-Language Support**: Available in English, Hindi, and Punjabi
- **User Profile Management**: Customize and manage user settings and preferences

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **Yarn**
- **MongoDB** account (Atlas or self-hosted)
- **Expo CLI** (`npm install -g expo-cli`)
- **Expo Go** app installed on your mobile device (for live testing)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd VaultVu
```

### 2. Install Frontend Dependencies

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
```

> **Note**: Replace the placeholder values with your actual API keys and MongoDB connection string.

### 5. Update API URL for Mobile Testing

To run the app on your mobile device, update the API URL to match your computer's local IP address in the following files:

- `app/signin.tsx`
- `app/signup.tsx`
- `app/FraudMessageCheckerScreen.tsx`
- `app/URLTheftCheckerScreen.tsx`
- `app/CheckSpamScreen.tsx`

Replace `YOUR_IP_ADDRESS` with your computer's local IP address (e.g., `192.168.1.7`).

**Finding your IP address:**
- Windows: Run `ipconfig` in Command Prompt
- Mac/Linux: Run `ifconfig` in Terminal

## Running the Application

### 1. Start the Backend Server

Open a terminal window and run:

```bash
cd backend
npm run dev
```

The server will start on port 5000 (or the port specified in your `.env` file).

### 2. Start the Frontend

In a new terminal window, run:

```bash
npm start
```

This will start the Expo development server and display a QR code.

### 3. Run on Your Mobile Device

1. Install the **Expo Go** app on your mobile device
2. Ensure your mobile device is connected to the same Wi-Fi network as your computer
3. Scan the QR code with your camera (iOS) or the Expo Go app (Android)

## Date Picker Setup

The app uses `@react-native-community/datetimepicker` for date selection during the signup process.

### Installation

```bash
npm install @react-native-community/datetimepicker --save
```

### Platform Behavior

- **Android**: Date picker appears when you tap the date field and disappears after selection
- **iOS**: Date picker remains visible, and you must press "Done" to confirm selection

## Troubleshooting

### Connection Issues

If your mobile device cannot connect to the backend server:

- Ensure both devices are on the same Wi-Fi network
- Check if your computer's firewall is blocking the connection
- Verify that you've updated all API URLs with your correct IP address
- Try restarting both the backend and Expo development servers

### Date Picker Issues

If the date picker doesn't appear or work correctly:

- Make sure you've installed all required dependencies
- For Android, verify you're using the correct implementation as shown in `signup2.tsx`
- Try clearing the Expo cache:

```bash
expo r -c
```

## Team

- **Arpit Kumar** - Lead Developer
- **Mehakpreet Kaur Cheema** - UI/UX Designer and Frontend Developer
- **Bisman Kaur** - Backend Developer
- **Ananya Sawhney** - Frontend Developer

## License

[Include your license information here]

## Contributing

[Include contribution guidelines here]

## Support

[Include support contact information here]