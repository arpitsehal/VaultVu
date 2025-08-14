import React from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Linking, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Changed from useNavigation to useRouter for consistency with QuizScreen
import { useLanguage } from '../contexts/LanguageContext';

export default function ReportIssueScreen() {
  const router = useRouter(); // Changed from navigation to router
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();

  const reportLinks = [
    {
      id: 'rbi',
      title: translations.rbiReportingTitle || 'RBI Fraud Reporting',
      description: translations.rbiReportingDesc || 'Report financial frauds directly to Reserve Bank of India',
      url: 'https://cms.rbi.org.in/',
      icon: 'account-balance'
    },
    {
      id: 'punjabBank',
      title: translations.punjabBankReportingTitle || 'Punjab and Sindh Bank Fraud Reporting',
      description: translations.punjabBankReportingDesc || 'Report suspicious activities related to Punjab and Sindh Bank accounts',
      url: 'https://punjabandsindbank.co.in/content/fraud-reporting',
      icon: 'security'
    },
    {
      id: 'cybercrime',
      title: translations.cybercrimeReportingTitle || 'National Cybercrime Reporting Portal',
      description: translations.cybercrimeReportingDesc || 'Report all types of cybercrimes including financial frauds',
      url: 'https://cybercrime.gov.in/',
      icon: 'computer'
    },
    {
      id: 'upifraud',
      title: translations.upiFraudReportingTitle || 'UPI Fraud Reporting',
      description: translations.upiFraudReportingDesc || 'Report UPI-related frauds and unauthorized transactions',
      url: 'https://www.npci.org.in/what-we-do/upi/upi-ecosystem-protection-framework',
      icon: 'smartphone'
    },
    {
      id: 'phishing',
      title: translations.phishingReportingTitle || 'Phishing Website Reporting',
      description: translations.phishingReportingDesc || 'Report phishing websites and emails to CERT-In',
      url: 'https://www.cert-in.org.in/',
      icon: 'web'
    }
  ];

  const handleLinkPress = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Use translations for the Alert
        Alert.alert(
          translations.error || 'Error',
          translations.cannotOpenUrlError || 'Cannot open this URL. Please try again later.',
          [{ text: translations.ok || 'OK' }]
        );
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />
      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#A8C3D1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{translations.reportAnIssue || 'Report an Issue'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Text style={styles.introText}>
            {translations.introText || 'Access official fraud reporting portals directly. Select the appropriate link below to report your issue.'}
          </Text>

          {reportLinks.map((link) => (
            <TouchableOpacity
              key={link.id}
              style={styles.linkCard}
              onPress={() => handleLinkPress(link.url)}
            >
              <View style={styles.linkIconContainer}>
                <MaterialIcons name={link.icon} size={28} color="#1A213B" />
              </View>
              <View style={styles.linkTextContainer}>
                <Text style={styles.linkTitle}>{link.title}</Text>
                <Text style={styles.linkDescription}>{link.description}</Text>
              </View>
              <MaterialIcons name="open-in-new" size={24} color="#1A213B" />
            </TouchableOpacity>
          ))}

          <Text style={styles.disclaimerText}>
            {translations.disclaimerText || 'Disclaimer: These links direct you to official websites. VaultVu is not responsible for the content or services provided by these external sites.'}
          </Text>
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
    paddingBottom: 40,
  },
  introText: {
    fontSize: 16,
    color: '#A8C3D1',
    marginBottom: 20,
    lineHeight: 22,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A8C3D1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  linkIconContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  linkTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A213B',
    marginBottom: 4,
  },
  linkDescription: {
    fontSize: 12,
    color: '#1A213B',
    opacity: 0.8,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#A8C3D1',
    opacity: 0.7,
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
