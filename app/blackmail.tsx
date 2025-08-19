// BlackmailScamScreen.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Platform, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function BlackmailScamScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();

  // Helper to convert hex color to rgba with alpha for RN
  const hexToRgba = (hex: string, alpha: number = 0.15) => {
    try {
      const clean = hex.replace('#', '');
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } catch {
      return `rgba(78, 205, 196, ${alpha})`;
    }
  };

  const title = translations.scamProtectionTitle_blackmail || 'Blackmail Scams';
  const description =
    translations.scamBlackmail_description ||
    "A blackmailer's mission is to scare you into sending them money by threatening to distribute private content—from your computer or phone, or shared with them over an email, text, or social media—that could embarrass you. They might ask you to wire them money, or send it using a mobile app, a gift card, or cryptocurrency. Sometimes these scammers are complete strangers and other times they might be someone you met online and thought you could trust.";

  const whatToDoTitle = translations.scamBlackmail_whatToDoTitle || "What to do if you're targeted:";
  const tips = [
    translations.scamBlackmail_tip1 ||
      "Try to stay calm in spite of blackmailers' intimidation and high-pressure tactics. Stop communicating with them and don't pay them. Keep all messages as evidence to help law enforcement. Keep in mind that you don't need to deal with this alone.",
    translations.scamBlackmail_tip2 ||
      "Do NOT comply with demands for money, personal details, OTPs, or to install apps.",
    translations.scamBlackmail_tip3 ||
      "End the call immediately—do not press keys, share information, or click on any links.",
    translations.scamBlackmail_tip4 ||
      "Do not panic. Impersonators typically aim to create fear and urgency to push you into action",
    translations.scamBlackmail_tip5 ||
      "File a complaint on the National Cybercrime Reporting Portal:  cybercrime.gov.in or call the toll‑free helpline 1930",
  ];

  const tipIcons = [
    { name: 'shield-check', type: 'MaterialIcons', color: '#4ECDC4' },
    { name: 'block', type: 'MaterialIcons', color: '#FF6B6B' },
    { name: 'call-end', type: 'MaterialIcons', color: '#FFA726' },
    { name: 'psychology', type: 'MaterialIcons', color: '#66BB6A' },
    { name: 'report', type: 'MaterialIcons', color: '#42A5F5' },
  ];

  const renderIcon = (iconName, iconType, color, size = 20) => {
    const iconProps = { name: iconName, size, color };
    switch (iconType) {
      case 'MaterialIcons':
        return <MaterialIcons {...iconProps} />;
      case 'Ionicons':
        return <Ionicons {...iconProps} />;
      case 'AntDesign':
      default:
        return <AntDesign {...iconProps} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1419" />

      {/* Enhanced Header */}
      <LinearGradient
        colors={['#0F1419', '#1A213B']}
        style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <View style={styles.backButtonContainer}>
            <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={2}>
            {title}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Decorative Topography Background */}
        <View style={styles.topographyContainer}>
          <View style={styles.topographyOverlay} />
          <View style={[styles.topographyLine, styles.line1]} />
          <View style={[styles.topographyLine, styles.line2]} />
          <View style={[styles.topographyLine, styles.line3]} />
          <View style={[styles.topographyLine, styles.line4]} />
          <View style={[styles.topographyLine, styles.line5]} />
          <View style={[styles.topographyDot, styles.dot1]} />
          <View style={[styles.topographyDot, styles.dot2]} />
          <View style={[styles.topographyDot, styles.dot3]} />
        </View>

        <View style={styles.contentContainer}>
          {/* Description Card */}
          <View style={styles.descriptionCard}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)']}
              style={styles.cardGradient}
            >
              <Text style={styles.descriptionText}>{description}</Text>
            </LinearGradient>
          </View>

          {/* Tips Section */}
          <View style={styles.tipsSection}>
            <View style={styles.tipsSectionHeader}>
              <View style={styles.tipsIconContainer}>
                <MaterialIcons name="security" size={24} color="#4ECDC4" />
              </View>
              <Text style={styles.whatToDoTitle}>{whatToDoTitle}</Text>
            </View>

            {tips.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)']}
                  style={styles.tipGradient}
                >
                  <View style={styles.tipContent}>
                    <View style={styles.tipIconWrapper}>
                      <View style={[styles.tipIconContainer, { backgroundColor: hexToRgba(tipIcons[index]?.color || '#4ECDC4', 0.15) }]}>
                        {renderIcon(
                          tipIcons[index]?.name || 'check-circle',
                          tipIcons[index]?.type || 'MaterialIcons',
                          tipIcons[index]?.color || '#4ECDC4',
                          18
                        )}
                      </View>
                    </View>
                    <View style={styles.tipTextContainer}>
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F1419',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  topographyContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    overflow: 'hidden',
    opacity: 0.3,
  },
  topographyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  topographyLine: {
    position: 'absolute',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderStyle: 'solid',
  },
  line1: {
    top: 20,
    left: -50,
    width: width + 100,
    height: 1,
    borderTopWidth: 1,
    transform: [{ rotate: '2deg' }],
  },
  line2: {
    top: 45,
    left: -30,
    width: width + 60,
    height: 1,
    borderTopWidth: 1,
    transform: [{ rotate: '-1deg' }],
  },
  line3: {
    top: 80,
    left: -80,
    width: width + 160,
    height: 1,
    borderTopWidth: 1,
    transform: [{ rotate: '1.5deg' }],
  },
  line4: {
    top: 115,
    left: -20,
    width: width + 40,
    height: 1,
    borderTopWidth: 1,
    transform: [{ rotate: '-0.5deg' }],
  },
  line5: {
    top: 150,
    left: -60,
    width: width + 120,
    height: 1,
    borderTopWidth: 1,
    transform: [{ rotate: '1deg' }],
  },
  topographyDot: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  dot1: {
    width: 4,
    height: 4,
    top: 35,
    left: width * 0.2,
  },
  dot2: {
    width: 6,
    height: 6,
    top: 95,
    right: width * 0.15,
  },
  dot3: {
    width: 3,
    height: 3,
    top: 130,
    left: width * 0.7,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    position: 'relative',
    zIndex: 1,
  },
  descriptionCard: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(100, 181, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#E2E8F0',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  descriptionText: {
    fontSize: 16,
    color: '#CBD5E1',
    lineHeight: 26,
    letterSpacing: 0.4,
    fontWeight: '400',
    textAlign: 'justify',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  tipsSection: {
    marginBottom: 24,
  },
  tipsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  tipsIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  whatToDoTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F1F5F9',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  tipCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tipGradient: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tipContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  tipIconWrapper: {
    marginRight: 12,
    marginTop: 2,
  },
  tipIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipTextContainer: {
    flex: 1,
  },
  tipText: {
    fontSize: 15,
    color: '#E2E8F0',
    lineHeight: 24,
    letterSpacing: 0.3,
    fontWeight: '500',
    textAlign: 'left',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});