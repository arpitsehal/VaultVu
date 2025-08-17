import { Platform } from 'react-native';
import { apiConfig } from './apiConfig';

let RNCallKeep;

// Safely import RNCallKeep
try {
  RNCallKeep = require('react-native-callkeep').default;
} catch (error) {
  console.warn('Failed to import RNCallKeep:', error);
  // Create a dummy implementation to prevent crashes
  RNCallKeep = {
    setup: () => Promise.resolve(),
    setAvailable: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
  };
}

// Configure CallKeep
const setupCallKeep = async () => {
  try {
    if (Platform.OS !== 'android') {
      return; // CallKeep is primarily for Android
    }
    
    const options = {
      android: {
        alertTitle: 'Permissions required',
        alertDescription: 'This application needs to access your phone accounts',
        cancelButton: 'Cancel',
        okButton: 'OK',
      },
    };

    await RNCallKeep.setup(options);
    RNCallKeep.setAvailable(true);
    
    // Register event listeners
    RNCallKeep.addEventListener('didReceiveStartCallAction', handleStartCallAction);
    RNCallKeep.addEventListener('answerCall', handleAnswerCall);
    RNCallKeep.addEventListener('endCall', handleEndCall);
    RNCallKeep.addEventListener('didDisplayIncomingCall', handleIncomingCallDisplayed);
    
    console.log('CallKeep initialized successfully');
  } catch (error) {
    console.error('Error setting up CallKeep:', error);
  }
};

// Handle start call action
const handleStartCallAction = ({ handle }) => {
  // handle is the phone number
  console.log('Call started to:', handle);
};

// Handle answer call
const handleAnswerCall = ({ callUUID }) => {
  console.log('Call answered:', callUUID);
};

// Handle end call
const handleEndCall = ({ callUUID }) => {
  console.log('Call ended:', callUUID);
};

// Handle incoming call displayed
const handleIncomingCallDisplayed = async ({ handle, callUUID }) => {
  // handle is the phone number
  console.log('Incoming call from:', handle);
  
  // Check if the call is potentially fraudulent
  const result = await handleIncomingCall(handle);
  
  // You can use the result to update the UI or take other actions
  console.log('Call check result:', result);
};

// Clean up CallKeep
const cleanupCallKeep = () => {
  RNCallKeep.removeEventListener('didReceiveStartCallAction');
  RNCallKeep.removeEventListener('answerCall');
  RNCallKeep.removeEventListener('endCall');
  RNCallKeep.removeEventListener('didDisplayIncomingCall');
};

export {
  cleanupCallKeep, setupCallKeep
};

const { baseURL } = apiConfig;

export const callDetectionService = {
    analyzeCall: async (callData) => {
        const response = await fetch(`${baseURL}/calls/analyze`, {
            method: 'POST',
            headers: apiConfig.headers,
            body: JSON.stringify(callData)
        });
        return response.json();
    },
    // ...existing code...
};