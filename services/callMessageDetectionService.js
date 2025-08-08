import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Function to check if a phone number is potentially fraudulent
async function checkPhoneNumber(phoneNumber) {
  try {
    const response = await fetch('http://192.168.1.7:5000/api/phone-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking phone number:', error);
    // Return a default response if the API call fails
    return {
      isGenuine: true,
      riskScore: 0,
      reasons: ['Unable to check - using local verification only'],
    };
  }
}

// Function to check if a message is potentially fraudulent
async function checkMessage(message) {
  try {
    const response = await fetch('http://192.168.1.7:5000/api/message-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking message:', error);
    // Return a default response if the API call fails
    return {
      isGenuine: true,
      riskScore: 0,
      reasons: ['Unable to check - using local verification only'],
    };
  }
}

// Function to show a notification
async function showNotification(title, body, data = {}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // Show immediately
  });
}

// Register for push notifications
async function registerForPushNotificationsAsync() {
  let token;
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

// Function to handle incoming calls
async function handleIncomingCall(phoneNumber) {
  const result = await checkPhoneNumber(phoneNumber);
  
  if (!result.isGenuine) {
    // Show a warning notification for suspicious calls
    await showNotification(
      'Suspicious Call Alert',
      `The call from ${phoneNumber} may be fraudulent (Risk: ${result.riskScore}/10)`,
      { type: 'call', phoneNumber, result }
    );
  } else {
    // Show a notification for genuine calls
    await showNotification(
      'Call Verified',
      `The call from ${phoneNumber} appears to be genuine`,
      { type: 'call', phoneNumber, result }
    );
  }
  
  return result;
}

// Function to handle incoming messages
async function handleIncomingMessage(message, sender) {
  const result = await checkMessage(message);
  
  if (!result.isGenuine) {
    // Show a warning notification for suspicious messages
    await showNotification(
      'Suspicious Message Alert',
      `Message from ${sender} may be fraudulent (Risk: ${result.riskScore}/10)`,
      { type: 'message', sender, message, result }
    );
  } else {
    // Show a notification for genuine messages
    await showNotification(
      'Message Verified',
      `Message from ${sender} appears to be genuine`,
      { type: 'message', sender, message, result }
    );
  }
  
  return result;
}

export {
  registerForPushNotificationsAsync,
  handleIncomingCall,
  handleIncomingMessage,
  showNotification,
};