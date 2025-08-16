import { Image } from 'expo-image';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to VaultVu!</ThemedText>
        <HelloWave />
      </ThemedView>
      
      {/* AI Assistant Quick Access */}
      <ThemedView style={styles.featureContainer}>
        <TouchableOpacity 
          style={styles.aiAssistantButton}
          onPress={() => router.push('/(tabs)/chatbot')}
        >
          <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
          <ThemedView style={styles.aiButtonContent}>
            <ThemedText type="subtitle" style={styles.aiButtonTitle}>
              🤖 AI Fraud Assistant
            </ThemedText>
            <ThemedText style={styles.aiButtonDescription}>
              Get instant help with banking fraud prevention
            </ThemedText>
          </ThemedView>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🛡️ Your Financial Security Hub</ThemedText>
        <ThemedText>
          VaultVu helps you learn about banking fraud prevention through interactive quizzes and AI-powered assistance.
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">📚 Learn & Practice</ThemedText>
        <ThemedText>
          Complete quiz levels to earn coins and test your knowledge of fraud prevention techniques.
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🎯 Stay Protected</ThemedText>
        <ThemedText>
          Use our AI assistant anytime to get expert advice on phishing, ATM safety, identity theft, and more.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  featureContainer: {
    marginBottom: 16,
  },
  aiAssistantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  aiButtonContent: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: 'transparent',
  },
  aiButtonTitle: {
    color: '#2d3748',
    marginBottom: 4,
  },
  aiButtonDescription: {
    color: '#718096',
    fontSize: 14,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
