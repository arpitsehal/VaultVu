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
  Animated
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Define a consistent color palette
const Colors = {
  background: '#121212', // A very dark gray, almost black
  cardBackground: '#1E1E1E', // Slightly lighter for cards
  primary: '#5B86E5', // A vibrant blue for key elements
  secondary: '#FFC107', // A warm gold for accents
  textPrimary: '#E0E0E0', // Light gray for main text
  textSecondary: '#A8C3D1', // The specified text color
  cardText: '#FAFAFA', // White for text on cards
  headerText: '#FFFFFF', // Pure white for the main app name
  indicator: '#5B86E5',
  border: 'rgba(255, 255, 255, 0.1)',
};

// Modern card component with press animation
const ModernCard = ({ children, style, onPress, gradient, ...props }) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const CardWrapper = gradient ? LinearGradient : View;
  const cardProps = gradient ? { colors: gradient, start: { x: 0, y: 0 }, end: { x: 1, y: 1 } } : { style: { backgroundColor: Colors.cardBackground } };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      {...props}
    >
      <Animated.View style={[{ transform: [{ scale: scaleValue }] }]}>
        <CardWrapper {...cardProps} style={[styles.modernCard, style]}>
          {children}
        </CardWrapper>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [dailyTip, setDailyTip] = useState('');

  const { translations } = useLanguage();

  useFocusEffect(
    useCallback(() => {
      if (translations.dailyTips && translations.dailyTips.length > 0) {
        const randomIndex = Math.floor(Math.random() * translations.dailyTips.length);
        setDailyTip(translations.dailyTips[randomIndex]);
      }
    }, [translations])
  );

  const quickAccessModules = [
  {
    id: 'voiceFraudChecker',
    title: translations.voiceFraudChecker || 'Voice Fraud Checker',
    icon: 'mic-outline',
    description:
      translations.voiceFraudCheckerDesc || 'Check if the voice is fraudulent or not.',
    route: '/VoiceTheftCheckerScreen',
    gradient: ['#4C6EF5', '#1A213B'], // Blue into deep navy
  },
  {
    id: 'checkSpam',
    title: translations.checkSpam || 'Check Spam',
    icon: 'shield-checkmark-outline',
    description:
      translations.checkSpamDesc || 'Protect you from spam and phishing attempts.',
    route: '/CheckSpamScreen',
    gradient: ['#00C9A7', '#1A213B'], // Teal into dark navy
  },
  {
    id: 'urlFraudChecker',
    title: translations.urlFraudChecker || 'URL Fraud Checker',
    icon: 'link-outline',
    description:
      translations.urlFraudCheckerDesc || 'Help you to identify if a given URL is genuine or not.',
    route: '/URLTheftCheckerScreen',
    gradient: ['#FFB74D', '#1A213B'], // Gold into dark navy
  },
  {
    id: 'fraudMessageChecker',
    title: translations.fraudMessageChecker || 'Fraud Message Checker',
    icon: 'chatbubble-ellipses-outline',
    description:
      translations.fraudMessageCheckerDesc || 'Check if the message is fraudulent or not.',
    route: '/FraudMessageCheckerScreen',
    gradient: ['#E63946', '#1A213B'], // Alert red into dark navy
  },
];

  const learningModules = [
  {
    id: 'scamProtection',
    title: translations.scamProtection || 'Scam Protection',
    icon: 'warning-outline',
    description:
      translations.scamProtectionDesc ||
      'Identify and avoid common scams and phishing attempts.',
    route: 'ScamProtectionScreen',
    color: '#E63946', // Strong red for danger/scam
  },
  {
    id: 'fraudProtection',
    title: translations.fraudProtection || 'Fraud Protection',
    icon: 'card-outline',
    description:
      translations.fraudProtectionDesc ||
      'Safeguard your bank accounts and financial transactions.',
    route: 'FraudProtectionScreen',
    color: '#00C9A7', // Teal for trust/safety
  },
  {
    id: 'budgetManager',
    title: translations.budgetManager || 'Budget Manager',
    icon: 'wallet-outline',
    description:
      translations.budgetManagerDesc ||
      'Manage your budgets, EMIs, SIPs and other financial tools.',
    route: 'BudgetManagerScreen',
    color: '#4C6EF5', // Theme’s primary blue for finance
  },
];

const gamificationModules = [
  {
    id: 'financialLiteracyQuiz',
    title: translations.financialLiteracyQuiz || 'Financial Literacy Quiz',
    icon: 'school-outline',
    description:
      translations.financialLiteracyQuizDesc ||
      'Test your knowledge and improve your financial IQ!',
    route: '/quizscreen',
    gradient: ['#4C6EF5', '#1A213B'], // Vibrant blue into deep navy
  },
  {
    id: 'leaderboard',
    title: translations.leaderboard || 'Leaderboard',
    icon: 'trophy-outline',
    description:
      translations.leaderboardDesc ||
      'See how you rank among other security champions!',
    route: '/leaderboard',
    gradient: ['#FFB74D', '#1A213B'], // Warm gold into dark navy
  },
];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#1A213B', '#1E2A3A']}
        style={styles.backgroundGradient}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Modern Header */}
          <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top + 10 : 10 }]}>
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.appName}>{translations.appName || "VaultVu"}</Text>
                <Text style={styles.tagline}>{translations.yourShieldInDigitalWorld || "Your Shield in the Digital World"}</Text>
              </View>
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => router.push('/settings')}
              >
                <BlurView intensity={20} tint="dark" style={styles.settingsBlur}>
                  <Ionicons name="settings-outline" size={24} color={Colors.textPrimary} />
                </BlurView>
              </TouchableOpacity>
            </View>
          </View>

          {/* Daily Tip Card with Glassmorphism */}
          <View style={styles.tipContainer}>
            <BlurView intensity={40} tint="dark" style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Ionicons name="bulb-outline" size={24} color={Colors.secondary} />
                <Text style={styles.tipHeading}>{translations.tipOfTheDay || "Tip of the Day"}</Text>
              </View>
              <Text style={styles.tipText}>{dailyTip}</Text>
            </BlurView>
          </View>

          {/* Quick Access Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{translations.quickAccessModules || "Quick Access"}</Text>
              <View style={styles.sectionIndicator} />
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {quickAccessModules.map((item, index) => (
                <ModernCard
                  key={item.id}
                  gradient={item.gradient}
                  style={[
                    styles.quickAccessCard,
                    index === 0 && styles.firstCard,
                    item.featured && styles.featuredCard
                  ]}
                  onPress={() => router.push(item.route)}
                >
                  <View style={styles.cardContainer}>
                    <View style={styles.cardTopContent}>
                      <View style={styles.cardIconContainer}>
                        <Ionicons name={item.icon} size={32} color={Colors.cardText} />
                      </View>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                    </View>
                    <Text style={styles.cardDescription}>{item.description}</Text>
                    {item.featured && (
                      <View style={styles.featuredBadge}>
                        <Text style={styles.featuredText}>Popular</Text>
                      </View>
                    )}
                  </View>
                </ModernCard>
              ))}
            </ScrollView>
          </View>

          {/* AI Assistant Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{translations.aiAssistant || "AI Assistant"}</Text>
              <View style={styles.sectionIndicator} />
            </View>

            <ModernCard
              gradient={['#667eea', '#764ba2']}
              style={styles.aiCard}
              onPress={() => router.push('/chatbot')}
            >
              <View style={styles.aiCardContent}>
                <View style={styles.aiIconContainer}>
                  <Ionicons name="chatbubbles-outline" size={28} color={Colors.cardText} />
                </View>
                <View style={styles.aiTextContainer}>
                  <Text style={styles.aiTitle}>{translations.aiAssistant || 'AI Fraud Assistant'}</Text>
                  <Text style={styles.aiDescription}>
                    {translations.aiAssistantDesc || 'Get instant help with banking fraud prevention!'}
                  </Text>
                </View>
                <View style={styles.aiArrow}>
                  <Ionicons name="arrow-forward" size={24} color={Colors.cardText} />
                </View>
              </View>
            </ModernCard>
          </View>

          {/* Gamification Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{translations.testYourKnowledge || "Test Your Knowledge"}</Text>
              <View style={styles.sectionIndicator} />
            </View>

            <View style={styles.gamificationGrid}>
              {gamificationModules.map((item) => (
                <ModernCard
                  key={item.id}
                  gradient={item.gradient}
                  style={styles.gamificationCard}
                  onPress={() => router.push(item.route)}
                >
                  <Ionicons name={item.icon} size={40} color={Colors.cardText} />
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                </ModernCard>
              ))}
            </View>
          </View>

          {/* Learning Modules */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{translations.learningModules || "Learning Modules"}</Text>
              <View style={styles.sectionIndicator} />
            </View>

            <View style={styles.learningContainer}>
              {learningModules.map((module) => (
                <ModernCard
                  key={module.id}
                  style={styles.learningCard}
                  onPress={() => router.push(module.route)}
                >
                  <View style={styles.learningContent}>
                    <View style={[styles.learningIconBg, { backgroundColor: module.color + '20' }]}>
                      <Ionicons name={module.icon} size={24} color={module.color} />
                    </View>
                    <View style={styles.learningTextContainer}>
                      <Text style={styles.learningTitle}>{module.title}</Text>
                      <Text style={styles.learningDesc}>{module.description}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                  </View>
                </ModernCard>
              ))}
            </View>
          </View>

          {/* Report Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{translations.report || "Report"}</Text>
              <View style={styles.sectionIndicator} />
            </View>

            <ModernCard
              style={styles.reportCard}
              onPress={() => router.push('/report')}
            >
              <View style={styles.reportContent}>
                <View style={styles.reportIconContainer}>
                  <Ionicons name="flag-outline" size={24} color="#FF6B6B" />
                </View>
                <View style={styles.reportTextContainer}>
                  <Text style={styles.reportTitle}>
                    {translations.reportAnIssue || 'Report an Issue'}
                  </Text>
                  <Text style={styles.reportDescription}>
                    {translations.reportAnIssueDesc || 'Quickly report any suspicious activity or security concerns.'}
                  </Text>
                </View>
                <View style={styles.reportArrow}>
                  <Ionicons name="arrow-forward" size={20} color={Colors.textSecondary} />
                </View>
              </View>
            </ModernCard>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: screenHeight,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // Header Styles
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.headerText,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '400',
  },
  settingsButton: {
    marginTop: 4,
  },
  settingsBlur: {
    borderRadius: 12,
    padding: 12,
    overflow: 'hidden',
  },

  // Daily Tip Styles
  tipContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  tipCard: {
    borderRadius: 20,
    padding: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.cardText,
    marginLeft: 12,
  },
  tipText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontWeight: '400',
  },

  // Section Styles
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  sectionIndicator: {
    width: 40,
    height: 4,
    backgroundColor: Colors.indicator,
    borderRadius: 2,
  },

  // Modern Card Base
  modernCard: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // Quick Access Styles
  horizontalScroll: {
    paddingLeft: 24,
    paddingRight: 16,
    alignItems: 'stretch', // Align items to stretch to the same height
  },
  quickAccessCard: {
    width: screenWidth * 0.8,
    padding: 24,
    marginRight: 16,
    minHeight: 180,
    justifyContent: 'flex-start',
    position: 'relative',
  },
  cardContainer: {
    // flex: 1,
    // justifyContent: 'space-between',
  },
  
  firstCard: {
    marginLeft: 0,
  },
  featuredBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.cardBackground,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.cardText,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },

  // AI Assistant Styles
  aiCard: {
    marginHorizontal: 24,
    padding: 0,
    overflow: 'hidden',
  },
  aiCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  aiIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.cardText,
    marginBottom: 6,
  },
  aiDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  aiArrow: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Gamification Styles
  gamificationGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  gamificationCard: {
    width: (screenWidth - 64) / 2,
    padding: 24, // Match Quick Access padding for consistency
    alignItems: 'flex-start',
    minHeight: 180, // Align height with Quick Access cards
    justifyContent: 'flex-start',
  },

  // Learning Modules Styles
  learningContainer: {
    paddingHorizontal: 24,
  },
  learningCard: {
    backgroundColor: Colors.cardBackground,
    marginBottom: 12,
    padding: 0,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  learningContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  learningTextContainer: {
    flex: 1,
  },
  learningIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  learningTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.cardText,
    marginBottom: 4,
  },
  learningDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  // Report Styles
  reportCard: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 24,
    padding: 0,
    overflow: 'hidden',
  },
  reportContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  reportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  reportTextContainer: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.cardText,
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  reportArrow: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  // Utility Styles
  bottomSpacing: {
    height: 40,
  },
});