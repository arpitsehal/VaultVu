// main dashboard
import React, { useState, useEffect, useCallback } from 'react';
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

const { width: screenWidth } = Dimensions.get('window');

// Define a list of daily tips
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

// Define your essential modules/features
const essentialModules = [
  {
    id: 'scamProtection',
    title: 'Scam Protection',
    icon: '🚨',
    description: 'Identify and avoid common scams and phishing attempts.',
    route: 'ScamProtectionScreen',
  },
  {
    id: 'fraudProtection',
    title: 'Fraud Protection',
    icon: '💳',
    description: 'Safeguard your bank accounts and financial transactions.',
    route: 'FraudProtectionScreen',
  },
  {
    id: 'passwordManagement',
    title: 'Password Manager',
    icon: '🔑',
    description: 'Create, store, and manage strong, unique passwords securely.',
    route: '/password-management',
  },
  {
    id: 'identityTheft',
    title: 'Identity Theft',
    icon: '👤',
    description: 'Protect your personal information from identity theft and misuse.',
    route: '/identity-teft',
  },
  {
    id: 'creditMonitoring',
    title: 'Credit Monitoring',
    icon: '📊',
    description: 'Monitor your credit score and reports for suspicious activity.',
    route: '/credit-monitoring',
  },
  {
    id: 'digitalPrivacy',
    title: 'Digital Privacy',
    icon: '🕵️',
    description: 'Control your online footprint and manage your data privacy settings.',
    route: '/digital-privacy',
  },
];

// Define featured sections/quick access items
const featuredSections = [
  {
    id: 'financialLiteracyQuiz',
    title: 'Financial Literacy Quiz',
    icon: '🧠',
    description: 'Test your knowledge and improve your financial IQ!',
    route: 'Quiz',
    cardColor: '#A8C3D1',
    textColor: '#1A213B',
  },
  {
    id: 'leaderboard',
    title: 'Leaderboard',
    icon: '🏆',
    description: 'See how you rank among other security champions!',
    route: '/leaderboard',
    cardColor: '#1A213B',
    textColor: '#A8C3D1',
  },
  {
    id: 'securityTips',
    title: 'Daily Security Tips',
    icon: '💡',
    description: 'Get quick, actionable tips to boost your digital safety.',
    route: '/tips',
    cardColor: '#A8C3D1',
    textColor: '#1A213B',
  },
  {
    id: 'reportIssue',
    title: 'Report an Issue',
    icon: '⚠️',
    description: 'Quickly report any suspicious activity or security concerns.',
    route: '/report',
    cardColor: '#1A213B',
    textColor: '#A8C3D1',
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [dailyTip, setDailyTip] = useState('');

  // Function to get the current day of the year (1-366)
  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return day;
  };

  // Use useFocusEffect to update the tip every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      const randomIndex = Math.floor(Math.random() * dailyTips.length);
      setDailyTip(dailyTips[randomIndex]);
    }, [])
  );

  const handlePress = (route: string) => {
    console.log(`Navigating to: ${route}`);
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />

      {/* Header Section */}
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.appName}>VaultVu</Text>
          <Image
            source={require('../assets/images/vaultvu-logo.jpg')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity style={styles.profileIconContainer} onPress={() => handlePress('Settings')}>
          <Text style={styles.profileIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Welcome Message / Tagline */}
      <Text style={styles.welcomeText}>Your Shield in the Digital World</Text>

      {/* Daily Tip Card */}
      <View style={styles.dailyTipCard}>
        <Text style={styles.dailyTipHeading}>Tip of the Day</Text>
        <Text style={styles.dailyTipText}>{dailyTip}</Text>
      </View>

      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.mainContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Sections / Quick Access */}
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.featuredCardsContainer}>
          {featuredSections.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.featuredCard,
                { backgroundColor: item.cardColor },
                (item.id === 'leaderboard' || item.id === 'reportIssue') && styles.featuredCardBorder
              ]}
              onPress={() => handlePress(item.route)}
            >
              <Text style={[styles.featuredIcon, { color: item.textColor }]}>{item.icon}</Text>
              <Text style={[styles.featuredTitle, { color: item.textColor }]}>{item.title}</Text>
              <Text style={[styles.featuredDescription, { color: item.textColor }]}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Essential Modules Section */}
        <Text style={styles.sectionTitle}>Essential Modules</Text>
        <View style={styles.cardsGrid}>
          {essentialModules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={styles.moduleCard}
              onPress={() => handlePress(module.route)}
            >
              <Text style={styles.moduleIcon}>{module.icon}</Text>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Text style={styles.moduleDescription}>{module.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  profileIconContainer: {
    padding: 5,
  },
  profileIcon: {
    fontSize: 24,
    color: '#A8C3D1',
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
  // New Styles for the Daily Tip Card
  dailyTipCard: {
    backgroundColor: '#1C2434', // Darker background for more contrast
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
  // --- Featured Sections Styles ---
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
    // Added a subtle radial gradient effect using a background color and a layered view
    position: 'relative',
    overflow: 'hidden', // to contain the gradient
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
  // --- Essential Modules Grid Styles (adjusted for new theme and 3-column grid) ---
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 15,
  },
  moduleCard: {
    backgroundColor: '#333A4B',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    width: (screenWidth - 45) / 3,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  moduleIcon: {
    fontSize: 30,
    marginBottom: 8,
    color: '#A8C3D1',
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 3,
  },
  moduleDescription: {
    fontSize: 10,
    color: 'rgba(168, 195, 209, 0.8)',
    textAlign: 'center',
  },
});
