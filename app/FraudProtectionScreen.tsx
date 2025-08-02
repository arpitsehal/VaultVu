import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const fraudModules = [
  { id: 'phishing', title: 'Phishing Fraud', routeName: 'phishingFraud' },
  { id: 'cardCloning', title: 'Card Cloning/Skimming', routeName: 'cardCloningFraud' },
  { id: 'upiFraud', title: 'UPI/Internet Banking Fraud', routeName: 'upiFraud' },
  { id: 'loanFraud', title: 'Fake Loan Apps & Loan Fraud', routeName: 'loanFraud' },
  { id: 'kYCUpdate', title: 'KYC Update Fraud', routeName: 'kycFraud' },
  { id: 'atmFraud', title: 'ATM Fraud', routeName: 'atmFraud' },
  { id: 'investmentFraud', title: 'Investment & Ponzi Schemes', routeName: 'investmentFraud' },
  { id: 'insuranceFraud', title: 'Insurance Fraud', routeName: 'insuranceFraud' },
  { id: 'identityTheft', title: 'Identity Theft', routeName: 'identityTheftFraud' },
  { id: 'fakeCustomerCare', title: 'Fake Customer Care', routeName: 'fakeCustomerCareFraud' },
];

export default function FraudProtectionScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleFraudTypePress = (routeName: string) => {
    navigation.navigate(routeName);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />
      {/* Header for Fraud Protection Screen */}
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}> 
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fraud Protection (RBI India)</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {fraudModules.map((fraud) => (
            <TouchableOpacity
              key={fraud.id}
              style={styles.fraudOption}
              onPress={() => handleFraudTypePress(fraud.routeName)}
            >
              <Text style={styles.fraudOptionText}>{fraud.title}</Text>
              <Text style={styles.fraudOptionArrow}>›</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1A213B',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 28,
    color: '#A8C3D1',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    flexShrink: 1,
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
  fraudOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333A4B',
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
  fraudOptionText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    flexShrink: 1,
    marginRight: 10,
  },
  fraudOptionArrow: {
    fontSize: 20,
    color: '#A8C3D1',
  },
}); 