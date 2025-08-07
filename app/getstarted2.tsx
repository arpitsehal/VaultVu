import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLanguage } from '../contexts/LanguageContext';

export default function NewOnboardingPage() {
  const router = useRouter();
  const { translations } = useLanguage();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />

      <View style={styles.robotImageContainer}>
        <Image
          source={require('../assets/images/vaultvu-logo.jpg')}
          style={styles.robotImage}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.descriptionText}>
        {translations.newOnboardingDescription || 'VaultVu helps you master financial literacy and protect yourself from fraud with interactive lessons and smart tools. Secure your financial future.'}
      </Text>

      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={() => router.push('/signup')}
      >
        <Text style={styles.getStartedButtonText}>{translations.newOnboardingGetStartedButton || 'GET STARTED'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.alreadyAccountButton}
        onPress={() => router.push('/signin')}
      >
        <Text style={styles.alreadyAccountButtonText}>{translations.newOnboardingAlreadyAccountButton || 'I ALREADY HAVE AN ACCOUNT'}</Text>
      </TouchableOpacity>

      <Text style={styles.copyright}>{translations.newOnboardingCopyright || 'Copyright © 2025 Punjab and Sindh Bank'}</Text>
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
  robotImageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 20,
  },
  robotImage: {
    width: '80%',
    height: '100%',
    maxHeight: 300,
    maxWidth: 300,
    borderRadius: 20,
  },
  descriptionText: {
    color: '#A8C3D1',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 28,
    marginBottom: 30,
  },
  getStartedButton: {
    backgroundColor: '#A8C3D1',
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 25,
    marginBottom: 20,
    width: 'auto',
    alignItems: 'center',
  },
  getStartedButtonText: {
    color: '#1A213B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alreadyAccountButton: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 0,
    marginBottom: 40,
    width: 'auto',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  alreadyAccountButtonText: {
    color: '#A8C3D1',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'none',
  },
  copyright: {
    color: 'rgba(168, 195, 209, 0.6)',
    fontSize: 12,
    position: 'absolute',
    bottom: 20,
  },
});