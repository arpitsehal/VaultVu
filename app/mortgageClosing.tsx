// MortgageClosingScamScreen.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../contexts/LanguageContext';

export default function MortgageClosingScamScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();
  const title = translations.scamProtectionTitle_mortgageClosing || 'Mortgage Closing Scams';
  const description =
    translations.scamMortgageClosing_description ||
    'A mortgage closing scam is a sophisticated type of fraud that targets home buyers and sellers. Scammers often hack into a real estate agent’s or title company’s email account and monitor the communication. Just before the closing date, the scammer sends a fake email to the buyer, pretending to be from the agent or title company. This email provides fraudulent wire transfer instructions for the down payment or closing costs. The buyer, believing the instructions are legitimate, sends the money to the scammer’s account, and the funds are stolen.';
  const whatToDoTitle = translations.scamMortgageClosing_whatToDoTitle || "What to do if you're targeted:";
  const tips = [
    translations.scamMortgageClosing_tip1 || 'Confirm all wire transfer instructions in person or over a verified phone number before sending any money. Do not use phone numbers or email addresses provided in the suspicious email.',
    translations.scamMortgageClosing_tip2 || 'Be wary of any last-minute changes to wiring instructions. This is a major red flag. Legitimate instructions rarely change at the last minute.',
    translations.scamMortgageClosing_tip3 || 'Check the email address carefully. Scammers often use an email address that looks very similar to the real one, with a slight change like a single letter or a different domain name.',
    translations.scamMortgageClosing_tip4 || 'Always call your real estate agent or a known contact at the title company directly to verify any wire transfer requests or changes to closing procedures.',
  ];

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
  whatToDoTitle: {
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
    flex: 1,
    lineHeight: 22,
  },
});