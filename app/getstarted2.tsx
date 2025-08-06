import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; // Ensure useRouter is imported

export default function NewOnboardingPage() {
  const router = useRouter(); // Initialize useRouter

  return (
    <SafeAreaView style={styles.container}>
      {/* Set status bar to match the dark background */}
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />

      {/* Robot Image */}
      <View style={styles.robotImageContainer}>
        <Image
          // Placeholder image for the robot. Replace with your actual robot image path.
          // Example: require('../assets/images/your-robot-image.png')
          source={require('../assets/images/vaultvu-logo.jpg')} // Using the VaultVu logo path
          style={styles.robotImage}
          resizeMode="contain"
        />
      </View>

      {/* Descriptive Text */}
      <Text style={styles.descriptionText}>
        VaultVu helps you master financial literacy and protect yourself from fraud with interactive lessons and smart tools. Secure your financial future.
      </Text>

      {/* Removed Pagination Dots for consistency with previous page UI */}

      {/* GET STARTED Button */}
      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={() => router.push('/signup')} // Link to signup page
      >
        <Text style={styles.getStartedButtonText}>GET STARTED</Text>
      </TouchableOpacity>

      {/* I ALREADY HAVE AN ACCOUNT Button - Now styled as a text link */}
      <TouchableOpacity
        style={styles.alreadyAccountButton}
        onPress={() => router.push('/signin')} // Added onPress to navigate to signin.tsx
      >
        <Text style={styles.alreadyAccountButtonText}>I ALREADY HAVE AN ACCOUNT</Text>
      </TouchableOpacity>

      {/* Copyright text */}
      <Text style={styles.copyright}>Copyright © 2025 Punjab and Sindh Bank</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A213B', // Dark blue/grey from the logo background
    alignItems: 'center',
    justifyContent: 'space-between', // Distribute content evenly
    paddingVertical: 60, // Padding at the top and bottom
  },
  robotImageContainer: {
    flex: 2, // Takes up more space to make the robot prominent
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 20, // Add some padding from the top
  },
  robotImage: {
    width: '80%', // Make the robot image responsive
    height: '100%',
    maxHeight: 300, // Max height to prevent it from getting too big on large screens
    maxWidth: 300, // Max width
    borderRadius: 20, // Rounded corners for the image container
  },
  descriptionText: {
    color: '#A8C3D1', // Light blue/grey, matching the logo's accent colors
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 40, // Add horizontal padding for text wrapping
    lineHeight: 28, // Improve readability
    marginBottom: 30, // Space between text and buttons
  },
  getStartedButton: {
    backgroundColor: '#A8C3D1', // Light blue/grey, matching the previous page's button
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 25,
    marginBottom: 20, // Space between this button and the next
    width: 'auto', // Allow button to size based on content
    alignItems: 'center',
  },
  getStartedButtonText: {
    color: '#1A213B', // Dark background color for text on light button
    fontSize: 16,
    fontWeight: 'bold',
  },
  alreadyAccountButton: {
    // Removed button-like styles to make it a text link
    backgroundColor: 'transparent',
    paddingVertical: 0, // Removed vertical padding
    paddingHorizontal: 0, // Removed horizontal padding
    borderRadius: 0, // Removed border radius
    marginBottom: 40, // Keep space from copyright
    width: 'auto',
    alignItems: 'center',
    borderWidth: 0, // Removed border
    borderColor: 'transparent', // Ensure no border color
  },
  alreadyAccountButtonText: {
    color: '#A8C3D1', // Text color matching the accent
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'none', // Explicitly remove underline
  },
  copyright: {
    color: 'rgba(168, 195, 209, 0.6)', // Faded version of the logo's light color
    fontSize: 12,
    position: 'absolute',
    bottom: 20,
  },
});
