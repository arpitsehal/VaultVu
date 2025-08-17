// RbiMisuseScamScreen
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../contexts/LanguageContext';

export default function RbiMisuseScamScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();

  const title = translations.scamProtectionTitle_rbiMisuse || 'RBI Logo Misuse';
  const description =
    translations.scamRbiMisuse_description ||
    'The RBI logo is displayed on buildings, websites, advertisements, and other materials from its member banks. Sometimes, a scammer displays the RBI logo, or says its accounts are insured or regulated by the RBI, to try to assure you that your money is safe when it isn’t. Some of these scams could be related to cryptocurrencies.';
  const whatToDoTitle = translations.scamRbiMisuse_whatToDoTitle || "What to do if you're targeted:";
  const tips = [
    translations.scamRbiMisuse_tip1 ||
      'Never click links or open attachments from emails or messages claiming to be from RBI.',
    translations.scamRbiMisuse_tip2 ||
      'Do not respond or call back via any number or email address included in suspicious messages.',
    translations.scamRbiMisuse_tip3 ||
      'Report Immediately on National Cyber Crime Reporting Portal: File a complaint through cybercrime.gov.in or call 1930.',
    translations.scamRbiMisuse_tip4 ||
      'Inform Financial Institutions : Contact your bank or payment provider immediately if any financial or personal data might have been compromised.',
    translations.scamRbiMisuse_tip5 ||
      'File a complaint on the National Cybercrime Reporting Portal:  cybercrime.gov.in or call the toll‑free helpline 1930',
  ].filter(Boolean);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />

      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} /> {/* Spacer to balance header title */}
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Text style={styles.descriptionText}>{description}</Text>

          <Text style={styles.whatToDoTitle}>{whatToDoTitle}</Text>
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A213B', // Dark background
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1A213B',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)', // Subtle separator
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 28,
    color: '#A8C3D1', // Light accent color
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    flexShrink: 1, // Allows text to wrap if long
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  descriptionText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
    marginBottom: 20,
  },
  whatToDoTitle: { // Renamed from tipsTitle for clarity
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A8C3D1',
    marginTop: 10,
    marginBottom: 10,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: '#A8C3D1',
    marginRight: 10,
  },
  tipText: {
    fontSize: 16,
    color: 'white',
    flex: 1, // Allows text to wrap
    lineHeight: 22,
  },
});
