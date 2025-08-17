import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';

export default function LandingPage() {
  const router = useRouter();
  const { translations } = useLanguage();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />

      <Text style={styles.welcomeText}>
        {translations.welcomeTo} <Text style={styles.vaultVuTextHighlight}>{translations.appName}</Text>
      </Text>

      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/vaultvu-logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <Text style={styles.poweredByText}>
        {translations.poweredByText}
      </Text>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.push('/getstarted')}
      >
        <Text style={styles.startButtonText}>{translations.continueButtonText}</Text>
      </TouchableOpacity>

      <Text style={styles.copyright}>{translations.copyright}</Text>
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
    fontSize: 16,
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