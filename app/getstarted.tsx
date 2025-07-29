import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Good practice for status bar and notches
import { useRouter } from 'expo-router'; // Ensure useRouter is imported

export default function OnboardingScreen() {
  const router = useRouter(); // Initialize useRouter

  return (
    <SafeAreaView style={styles.container}>
      {/* Set status bar to match the dark background */}
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />

      {/* Logo Image - Assuming this is the VaultVu logo, not a robot */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/vaultvu-logo.jpg')} // Using the VaultVu logo path
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Descriptive Text - Adjusted to match the previous page's text style */}
      <Text style={styles.descriptionText}>
        Secure your digital life with VaultVu. Experience seamless and secure access to your information.
      </Text>

      {/* Removed Pagination Dots as per previous page's UI */}

      {/* SIGN IN OR SIGN UP Button - Styled to match the previous page's button */}
      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => router.push('/getstarted2')} // Added onPress to navigate to getstarted2.tsx
      >
        <Text style={styles.signInButtonText}>SIGN IN OR SIGN UP</Text>
      </TouchableOpacity>

      {/* Copyright text - Styled to match the previous page's copyright */}
      <Text style={styles.copyright}>Copyright © 2025 Punjab and Sindh Bank</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A213B', // Dark blue/grey from the logo background (matching LandingPage)
    alignItems: 'center',
    justifyContent: 'space-between', // Distribute content evenly (matching LandingPage)
    paddingVertical: 60, // Padding at the top and bottom (matching LandingPage)
  },
  logoContainer: {
    flex: 1, // Allows the logo to take up available space and be centered
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40, // Consistent with LandingPage
  },
  logo: {
    width: 250, // Adjust as needed to make the logo prominent (matching LandingPage)
    height: 250, // Adjust as needed (matching LandingPage)
  },
  descriptionText: {
    color: '#A8C3D1', // Light blue/grey, matching the logo's accent colors (consistent with LandingPage welcome text)
    fontSize: 18, // Adjusted font size
    textAlign: 'center',
    paddingHorizontal: 40, // Add horizontal padding for text wrapping
    lineHeight: 28, // Improve readability
    marginBottom: 30, // Space between text and button
  },
  signInButton: {
    backgroundColor: '#A8C3D1', // Light blue/grey, matching the logo's text/accents (matching LandingPage button)
    paddingVertical: 14, // Consistent padding for button size
    paddingHorizontal: 45, // Consistent padding for button size
    borderRadius: 25, // Consistent border radius
    marginBottom: 40, // Space from bottom (consistent with LandingPage)
    width: 'auto', // Allow button to size based on content, not fixed width
    alignItems: 'center',
    // Removed shadow for consistency with LandingPage's button which doesn't have it explicitly
  },
  signInButtonText: {
    color: '#1A213B', // Dark background color for text on light button (matching LandingPage button text)
    fontSize: 16, // Consistent font size
    fontWeight: 'bold', // Consistent font weight
  },
  copyright: {
    color: 'rgba(168, 195, 209, 0.6)', // Faded version of the logo's light color (matching LandingPage)
    fontSize: 12,
    position: 'absolute',
    bottom: 20,
  },
  // Removed pagination dot styles as they are no longer needed
});
