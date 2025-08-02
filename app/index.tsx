import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Ensure SafeAreaView is imported

export default function LandingPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}> {/* Use SafeAreaView */}
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />

      {/* Corrected: Entire welcome text wrapped in a single Text component */}
      <Text style={styles.welcomeText}>
        Welcome to <Text style={styles.vaultVuTextHighlight}>VaultVu</Text>
      </Text>

      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/vaultvu-logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Corrected: Applying button styles directly to TouchableOpacity */}
      <TouchableOpacity
        style={styles.startButton} // Apply button styles here
        onPress={() => router.push('/getstarted')}
      >
        <Text style={styles.startButtonText}>CONTINUE</Text>
      </TouchableOpacity>

      {/* Copyright text - Positioned absolutely, so it won't affect layout flow */}
      <Text style={styles.copyright}>Copyright © 2025 Punjab and Sind Bank</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A213B', // Dark blue/grey from the logo background
    alignItems: 'center',
    justifyContent: 'space-between', // Spreads items vertically
    paddingTop: 40, // Adjusted padding from top (SafeAreaView handles notch)
    paddingBottom: 40, // Adjusted padding from bottom
  },
  welcomeText: {
    color: '#A8C3D1', // Light blue/grey, matching the logo's accent colors
    fontSize: 28,
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: 30, // Space between welcome text and logo
    // marginTop removed as paddingTop on container handles overall top space
    letterSpacing: 0.5,
  },
  vaultVuTextHighlight: {
    color: 'white', // Making 'VaultVu' even brighter/more prominent
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 1,
  },
  logoContainer: {
    flex: 1, // Allows the logo to take up available space and be centered
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 40, // Removed, let flex:1 and justifyContent handle vertical centering
  },
  logo: {
    width: 250, // Adjust as needed to make the logo prominent
    height: 250, // Adjust as needed
  },
  startButton: {
    backgroundColor: '#A8C3D1',
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 25,
    marginBottom: 0, // Removed marginBottom here as container paddingBottom handles space
  },
  startButtonText: {
    color: '#1A213B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  copyright: {
    color: 'rgba(168, 195, 209, 0.6)',
    fontSize: 12,
    position: 'absolute',
    bottom: 20, // Fixed position at the bottom
    // No need for paddingVertical on container if this is absolute
  },
});