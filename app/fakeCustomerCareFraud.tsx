import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';

export default function FakeCustomerCareFraudScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { translations } = useLanguage();

  const title = translations.fakeCustomerCareTitle || 'Fake Customer Care';
  const description =
    translations.fakeCustomerCareDescription ||
    'Fake customer care frauds involve scammers posing as bank or service provider representatives. They trick victims into sharing sensitive information or installing remote access apps, leading to financial loss.';

  const whatToDoTitle = translations.fakeCustomerCareWhatToDoTitle || "What to do if you're targeted:";
  const tips = [
    translations.fakeCustomerCareTip1 || 'Always use official customer care numbers from your bank’s website or RBI.',
    translations.fakeCustomerCareTip2 || 'Never share your OTP, PIN, or passwords with anyone over the phone.',
    translations.fakeCustomerCareTip3 || 'Do not install apps or software at the request of unknown callers.',
    translations.fakeCustomerCareTip4 || 'Be cautious of unsolicited calls claiming to resolve account or transaction issues.',
    translations.fakeCustomerCareTip5 ||
      'Report fake customer care scams to your bank and the National Cybercrime Reporting Portal: cybercrime.gov.in or call 1930.',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}> 
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
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