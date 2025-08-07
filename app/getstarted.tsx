import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLanguage } from '../contexts/LanguageContext';

export default function OnboardingScreen() {
  const router = useRouter();
  const { translations } = useLanguage();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />

      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/vaultvu-logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.descriptionText}>
        {translations.onboardingDescription || 'Secure your digital life with VaultVu. Experience seamless and secure access to your information.'}
      </Text>

      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => router.push('/getstarted2')}
      >
        <Text style={styles.signInButtonText}>{translations.onboardingSignInButton || 'SIGN IN OR SIGN UP'}</Text>
      </TouchableOpacity>

      <Text style={styles.copyright}>{translations.onboardingCopyright || 'Copyright © 2025 Punjab and Sindh Bank'}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A213B',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 250,
    height: 250,
  },
  descriptionText: {
    color: '#A8C3D1',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 28,
    marginBottom: 30,
  },
  signInButton: {
    backgroundColor: '#A8C3D1',
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 25,
    marginBottom: 40,
    width: 'auto',
    alignItems: 'center',
  },
  signInButtonText: {
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