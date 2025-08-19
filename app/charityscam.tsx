// CharityScamScreen.tsx
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

export default function CharityScamScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();

  const title = translations.scamProtectionTitle_charity || 'Charity Scams';
  const description =
    translations.scamCharity_description ||
    'A charity scam is when a thief poses as a real charity or makes up the name of a charity that sounds real to get money from you.';
  const whatToDoTitle = translations.scamCharity_whatToDoTitle || "What to do if you're targeted:";
  const tips = [
    translations.scamCharity_tip1 ||
      'Pause and question the urgency. Legitimate charities allow you to take time to verify—pressure tactics are red flags.',
    translations.scamCharity_tip2 ||
      'Never click links or download attachments from unsolicited messages—they may contain phishing or malware.',
    translations.scamCharity_tip3 ||
      'Do not share sensitive information (like PAN, bank accounts, UPI, Aadhaar, credit card details). Scammers may seek both money and identity theft.',
    translations.scamCharity_tip4 ||
      'Avoid paying by gift card, cash, wire transfer, or cryptocurrency. Use credit card or reputable payment gateways for better fraud protection.',
    translations.scamCharity_tip5 ||
      'File a complaint on the National Cybercrime Reporting Portal:  cybercrime.gov.in or call the toll‑free helpline 1930',
    translations.scamCharity_tip6 ||
      'Additionally, report to the bank or payment platform used, requesting they freeze the transaction or account if possible.',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1419" />

      {/* Header */}
      <LinearGradient
        colors={['#0F1419', '#1A213B']}
        style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <View style={styles.backButtonContainer}>
            <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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
                      <View style={[styles.tipIconContainer, { backgroundColor: 'rgba(78, 205, 196, 0.15)' }] }>
                        <MaterialIcons name="check-circle" size={18} color="#4ECDC4" />
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
  safeArea: { flex: 1, backgroundColor: '#0F1419' },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: { padding: 8 },
  backButtonContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  contentContainer: { paddingHorizontal: 16, paddingTop: 16 },
  descriptionCard: { marginBottom: 24, borderRadius: 16, overflow: 'hidden' },
  cardGradient: { padding: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  cardIconContainer: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(100,181,246,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  descriptionText: { fontSize: 16, color: '#CBD5E1', lineHeight: 26 },
  tipsSection: { marginBottom: 24 },
  tipsSectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingHorizontal: 4 },
  tipsIconContainer: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(78,205,196,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  whatToDoTitle: { fontSize: 20, fontWeight: '800', color: '#F1F5F9' },
  tipCard: { marginBottom: 12, borderRadius: 12, overflow: 'hidden' },
  tipGradient: { borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  tipContent: { flexDirection: 'row', padding: 16, alignItems: 'flex-start' },
  tipIconWrapper: { marginRight: 12, marginTop: 2 },
  tipIconContainer: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  tipTextContainer: { flex: 1 },
  tipText: { fontSize: 15, color: '#E2E8F0', lineHeight: 24, letterSpacing: 0.3, fontWeight: '500', textAlign: 'left' },
});
