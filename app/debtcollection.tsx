// BlackmailScamScreen.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function BlackmailScamScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const scamDetails = {
    title: 'Debt Collection Scams',
    description: 'Debt collectors might contact you to collect on legitimate debts you owe. But there are scammers who pose as debt collectors to get you to pay for debts you don\'t owe.',
    whatToDo: [
      'If you\'re contacted unexpectedly by someone demanding money, pressuring for immediate payment, or requesting personal financial data—disconnect and cut contact.',
      'Verify the identity of collectors. If someone visits your home or calls: Request an official ID card and authorization letter from the bank or NBFC.',
      'Ask for written proof and details.',
      'File a complaint on : debtreliefindia.com or services.india.gov.in'
    ],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />

      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{scamDetails.title}</Text>
        {/* Spacer to balance header title */}
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Text style={styles.descriptionText}>{scamDetails.description}</Text>

          <Text style={styles.whatToDoTitle}>What to do if you're targeted:</Text>
          {scamDetails.whatToDo.map((tip, index) => (
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
