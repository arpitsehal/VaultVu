import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LandingPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />

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
      
      {/* New line added below the logo with a larger font size */}
      <Text style={styles.poweredByText}>
        Powered by Punjab and Sindh Bank in collaboration with IKGPTU
      </Text>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.push('/getstarted')}
      >
        <Text style={styles.startButtonText}>CONTINUE</Text>
      </TouchableOpacity>

      <Text style={styles.copyright}>Copyright © 2025 Punjab and Sind Bank</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A213B',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 40,
  },
  welcomeText: {
    color: '#A8C3D1',
    fontSize: 28,
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 0.5,
  },
  vaultVuTextHighlight: {
    color: 'white',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 1,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
  poweredByText: {
    color: '#A8C3D1',
    fontSize: 16, // Increased font size
    marginTop: -20,
    marginBottom: 20,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#A8C3D1',
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 25,
    marginBottom: 0,
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
    bottom: 20,
  },
});