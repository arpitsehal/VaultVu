// DebtSettlementScamScreen
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../contexts/LanguageContext';

export default function DebtSettlementScamScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();

  const title = translations.scamProtectionTitle_debtSettlement || 'Debt Settlement and Debt Relief Scams';
  const description =
    translations.scamDebtSettlement_description ||
    'Debt settlement or debt relief companies often promise to renegotiate, settle, or in some way change the terms of a debt you owe to a creditor or debt collector. Dealing with debt settlement companies, though, can be risky and could leave you even further in debt.';
  const whatToDoTitle = translations.scamDebtSettlement_whatToDoTitle || "What to do if you're targeted:";
  const tips = [
    translations.scamDebtSettlement_tip1 ||
      'Research the Company: Look for independent reviews, check complaints, verify home office or physical address.',
    translations.scamDebtSettlement_tip2 ||
      'Demand Written Contracts: Get a clear, signed agreement that defines services, fees, and responsibilities.',
    translations.scamDebtSettlement_tip3 || 'Beware Pressure Tactics: Don’t rush—take time to compare options or seek advice.',
    translations.scamDebtSettlement_tip4 ||
      'Sancharsaathi (Do Not Call / Scam Reporting Portal): Report spam or fraud-related calls, SMS, WhatsApp messages via sancharsaathi.gov.in.',
    translations.scamDebtSettlement_tip5 ||
      'Reserve Bank of India (RBI) Grievance Portal: File complaints about unethical debt-relief or settlement agencies via RBI’s CMS (sachet.rbi.org.in or rbi.org.in complaints section)',
    translations.scamDebtSettlement_tip6 ||
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
        {/* Spacer to balance header title */}
        <View style={{ width: 40 }} />
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
