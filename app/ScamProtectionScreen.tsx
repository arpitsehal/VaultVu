// ScamProtectionScreen.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Platform, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext'; // Import the useLanguage hook

export default function ScamProtectionScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();

  const scamModules = [
    { id: 'blackmail', title: translations.scamProtectionTitle_blackmail || 'Blackmail Scams', routeName: 'blackmail' },
    { id: 'charity', title: translations.scamProtectionTitle_charity || 'Charity Scams', routeName: 'charityscam' },
    { id: 'debtCollection', title: translations.scamProtectionTitle_debtCollection || 'Debt Collection Scams', routeName: 'debtcollection' },
    { id: 'debtSettlement', title: translations.scamProtectionTitle_debtSettlement || 'Debt Settlement and Debt Relief Scams', routeName: 'debtsettlement' },
    { id: 'rbiMisuse', title: translations.scamProtectionTitle_rbiMisuse || 'RBI Logo Misuse', routeName: 'rbimisuse' },
    { id: 'foreclosureRelief', title: translations.scamProtectionTitle_foreclosureRelief || 'Foreclosure Relief or Mortgage Loan Modification Scams', routeName: 'foreclosure' },
    { id: 'grandparent', title: translations.scamProtectionTitle_grandparent || 'Grandparent Scams', routeName: 'grandparent' },
    { id: 'impostor', title: translations.scamProtectionTitle_impostor || 'Impostor Scams', routeName: 'impostor' },
    { id: 'lottery', title: translations.scamProtectionTitle_lottery || 'Lottery or Prize Scams', routeName: 'lottery' },
    { id: 'mailFraud', title: translations.scamProtectionTitle_mailFraud || 'Mail Fraud', routeName: 'mailFraud' },
    { id: 'manInMiddle', title: translations.scamProtectionTitle_manInMiddle || 'Man-in-the-Middle Scams', routeName: 'manInMiddle' },
    { id: 'moneyMule', title: translations.scamProtectionTitle_moneyMule || 'Money Mule Scams', routeName: 'moneyMule' },
    { id: 'moneyTransfer', title: translations.scamProtectionTitle_moneyTransfer || 'Money Transfer or Mobile Payment Services Fraud', routeName: 'moneyTransfer' },
    { id: 'mortgageClosing', title: translations.scamProtectionTitle_mortgageClosing || 'Mortgage Closing Scams', routeName: 'mortgageClosing' },
    { id: 'romance', title: translations.scamProtectionTitle_romance || 'Romance Scams', routeName: 'romance' },
    { id: 'nonexistentGoods', title: translations.scamProtectionTitle_nonexistentGoods || 'Sale of Nonexistent Goods or Services Scams', routeName: 'nonexistentGoods' },
  ];

  const handleScamTypePress = (routeName) => {
    navigation.navigate(routeName);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />

      {/* Header for Scam Protection Screen */}
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          {/* Replaced text with AntDesign icon */}
          <AntDesign name="arrowleft" size={24} color="#A8C3D1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{translations.scamProtectionScreenTitle || 'Scam Protection'}</Text>
        <View style={{ width: 40 }} /> {/* Spacer to balance header title */}
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {scamModules.map((scam) => (
            <TouchableOpacity
              key={scam.id}
              style={styles.scamOption}
              onPress={() => handleScamTypePress(scam.routeName)}
            >
              <Text style={styles.scamOptionText}>{scam.title}</Text>
              <Text style={styles.scamOptionArrow}>›</Text>
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
  scamOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333A4B', // Slightly lighter dark background for options
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  scamOptionText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    flexShrink: 1, // Allow text to wrap if too long
    marginRight: 10, // Space before arrow
  },
  scamOptionArrow: {
    fontSize: 20,
    color: '#A8C3D1', // Light accent color
  },
});