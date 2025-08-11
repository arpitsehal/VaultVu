import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
  Platform,
  Image
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

const { width: screenWidth } = Dimensions.get('window');

const dailyTips = [
  "Always use a strong, unique password for your banking apps and email.",
  "Never share your OTP or PIN with anyone, not even bank employees.",
  "Be cautious of unsolicited calls asking for personal financial information.",
  "Check your bank statements regularly for any unauthorized transactions.",
  "Use two-factor authentication (2FA) wherever possible for added security.",
  "Don't click on suspicious links in emails or text messages.",
  "Only download apps from official app stores like Google Play or the App Store.",
  "Use a separate email address for online banking and sensitive accounts.",
  "When shopping online, use secure connections (HTTPS) and reputable sites.",
  "Be skeptical of urgent requests for money, especially from family or friends online.",
  "Review your privacy settings on social media to limit public information.",
  "Shred documents with personal information before discarding them.",
  "Protect your Wi-Fi network with a strong password to prevent unauthorized access.",
  "Never use public Wi-Fi for sensitive activities like banking or shopping.",
];

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [dailyTip, setDailyTip] = useState('');

  const { translations } = useLanguage();

  useFocusEffect(
    useCallback(() => {
      const randomIndex = Math.floor(Math.random() * dailyTips.length);
      setDailyTip(dailyTips[randomIndex]);
    }, [])
  );

  // Define module data here so it can use the translations object
  const quickAccessModules = [
    {
      id: 'voiceFraudChecker',
      title: translations.voiceFraudChecker || 'Voice Fraud Checker',
      icon: '🔊',
      description: translations.voiceFraudCheckerDesc || 'Check if the voice is Fraudulent or not.',
      route: '/VoiceTheftCheckerScreen',
      cardColor: '#1A213B',
      textColor: '#A8C3D1',
    },
    {
      id: 'checkSpam',
      title: translations.checkSpam || 'Check Spam',
      icon: '👤',
      description: translations.checkSpamDesc || 'Protect you from spam and phishing attempts.',
      route: '/CheckSpamScreen',
      cardColor: '#A8C3D1',
      textColor: '#1A213B',
    },
    {
      id: 'urlFraudChecker',
      title: translations.urlFraudChecker || 'URL Fraud Checker',
      icon: '📊',
      description: translations.urlFraudCheckerDesc || 'Help you to identify if a given URL is genuine or not.',
      route: '/URLTheftCheckerScreen',
      cardColor: '#A8C3D1',
      textColor: '#1A213B',
    },
    {
      id: 'fraudMessageChecker',
      title: translations.fraudMessageChecker || 'Fraud Message Checker',
      icon: '🕵️',
      description: translations.fraudMessageCheckerDesc || 'Check if the message is Fraudulent or not.',
      route: '/FraudMessageCheckerScreen',
      cardColor: '#1A213B',
      textColor: '#A8C3D1',
    },
  ];

  const learningModules = [
    {
      id: 'scamProtection',
      title: translations.scamProtection || 'Scam Protection',
      icon: '🚨',
      description: translations.scamProtectionDesc || 'Identify and avoid common scams and phishing attempts.',
      route: 'ScamProtectionScreen',
    },
    {
      id: 'fraudProtection',
      title: translations.fraudProtection || 'Fraud Protection',
      icon: '💳',
      description: translations.fraudProtectionDesc || 'Safeguard your bank accounts and financial transactions.',
      route: 'FraudProtectionScreen',
    },
    {
      id: 'budgetManager',
      title: translations.budgetManager || 'Budget Manager',
      icon: '💰',
      description: translations.budgetManagerDesc || 'Manage your budgets, EMIs, SIPs and other financial tools.',
      route: 'BudgetManagerScreen',
    },
  ];

  const gamificationModules = [
    {
      id: 'financialLiteracyQuiz',
      title: translations.financialLiteracyQuiz || 'Financial Literacy Quiz',
      icon: '🧠',
      description: translations.financialLiteracyQuizDesc || 'Test your knowledge and improve your financial IQ!',
      route: '/quizscreen',
      cardColor: '#A8C3D1',
      textColor: '#1A213B',
    },
    {
      id: 'leaderboard',
      title: translations.leaderboard || 'Leaderboard',
      icon: '🏆',
      description: translations.leaderboardDesc || 'See how you rank among other security champions!',
      route: '/leaderboard',
      cardColor: '#1A213B',
      textColor: '#A8C3D1',
    },
  ];

  const reportModules = [
    {
      id: 'reportIssue',
      title: translations.reportAnIssue || 'Report an Issue',
      icon: '⚠️',
      description: translations.reportAnIssueDesc || 'Quickly report any suspicious activity or security concerns.',
      route: '/report',
      cardColor: '#A8C3D1',
      textColor: '#1A213B',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />

      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.appName}>{translations.appName || "VaultVu"}</Text>
          <Image
            source={require('../assets/images/vaultvu-logo.jpg')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.welcomeText}>{translations.yourShieldInDigitalWorld || "Your Shield in the Digital World"}</Text>

      <View style={styles.dailyTipCard}>
        <Text style={styles.dailyTipHeading}>{translations.tipOfTheDay || "Tip of the Day"}</Text>
        <Text style={styles.dailyTipText}>{dailyTip}</Text>
      </View>

      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.mainContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Access Section */}
        <Text style={styles.sectionTitle}>{translations.quickAccessModules || "Quick Access"}</Text>

        <View style={styles.featuredCardsContainer}>
          {quickAccessModules.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.featuredCard,
                { backgroundColor: item.cardColor },
                (item.id === 'voiceFraudChecker' || item.id === 'fraudMessageChecker') && styles.featuredCardBorder
              ]}
              onPress={() => router.push(item.route)}
            >
              <Text style={[styles.featuredIcon, { color: item.textColor }]}>{item.icon}</Text>
              <Text style={[styles.featuredTitle, { color: item.textColor }]}>{item.title}</Text>
              <Text style={[styles.featuredDescription, { color: item.textColor }]}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Learning Modules Section */}
        <Text style={styles.sectionTitle}>{translations.learningModules || "Learning Modules"}</Text>
        <View style={styles.learningModulesContainer}>
          {learningModules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={styles.learningCard}
              onPress={() => router.push(module.route)}
            >
              <Text style={styles.learningIcon}>{module.icon}</Text>
              <View style={styles.learningTextContainer}>
                <Text style={styles.learningTitle}>{module.title}</Text>
                <Text style={styles.learningDescription}>{module.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#A8C3D1" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Gamification Section */}
        <Text style={styles.sectionTitle}>{translations.testYourKnowledge || "Test Your Knowledge"}</Text>
        <View style={styles.gamificationCardsContainer}>
          {gamificationModules.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.featuredCard,
                { backgroundColor: item.cardColor },
                (item.id === 'leaderboard') && styles.featuredCardBorder
              ]}
              onPress={() => router.push(item.route)}
            >
              <Text style={[styles.featuredIcon, { color: item.textColor }]}>{item.icon}</Text>
              <Text style={[styles.featuredTitle, { color: item.textColor }]}>{item.title}</Text>
              <Text style={[styles.featuredDescription, { color: item.textColor }]}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{translations.report || "Report"}</Text>
        <View style={styles.reportModulesContainer}>
          {reportModules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={styles.reportCard}
              onPress={() => router.push(module.route)}
            >
              <View style={styles.reportIconContainer}>
                <Text style={styles.reportIcon}>{module.icon}</Text>
              </View>
              <View style={styles.reportTextContainer}>
                <Text style={styles.reportTitle}>{module.title}</Text>
                <Text style={styles.reportDescription}>{module.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#1A213B" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (Your existing styles remain the same)
  safeArea: {
    flex: 1,
    backgroundColor: '#1A213B',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1A213B',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 26,
    fontWeight: '900',
    color: 'white',
    marginRight: 8,
  },
  headerLogo: {
    width: 30,
    height: 30,
  },
  settingsButton: {
    padding: 5,
  },
  welcomeText: {
    fontSize: 18,
    color: '#A8C3D1',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 25,
    paddingHorizontal: 20,
    fontWeight: '500',
  },
  dailyTipCard: {
    backgroundColor: '#1C2434',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  dailyTipHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A8C3D1',
    marginBottom: 8,
  },
  dailyTipText: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
  },
  mainScrollView: {
    flex: 1,
    width: '100%',
  },
  mainContentContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    marginTop: 30,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  featuredCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  featuredCard: {
    borderRadius: 20,
    padding: 20,
    width: screenWidth * 0.45,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  featuredCardBorder: {
    borderWidth: 2,
    borderColor: '#A8C3D1',
  },
  featuredIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  featuredDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  learningModulesContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  learningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333A4B',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  learningIcon: {
    fontSize: 30,
    marginRight: 15,
    color: '#A8C3D1',
  },
  learningTextContainer: {
    flex: 1,
  },
  learningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  learningDescription: {
    fontSize: 12,
    color: 'rgba(168, 195, 209, 0.8)',
    marginTop: 2,
  },
  gamificationCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  reportModulesContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A8C3D1',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  reportIconContainer: {
    backgroundColor: '#1A213B',
    borderRadius: 12,
    padding: 10,
    marginRight: 15,
  },
  reportIcon: {
    fontSize: 30,
    color: '#A8C3D1',
  },
  reportTextContainer: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A213B',
  },
  reportDescription: {
    fontSize: 12,
    color: '#1A213B',
    marginTop: 2,
  },
});