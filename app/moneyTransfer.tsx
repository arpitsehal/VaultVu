// MoneyTransferScamScreen
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

export default function MoneyTransferScamScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();
  const title = translations.scamProtectionTitle_moneyTransfer || 'Money Transfer or Mobile Payment Services Fraud';
  const description =
    translations.scamMoneyTransfer_description ||
    'Scammers impersonate banks/officials or family to trick you into authorizing payments via UPI or other apps.';
  const whatToDoTitle = translations.scamMoneyTransfer_whatToDoTitle || "What to do if you're targeted:";
  const tips = [
    translations.scamMoneyTransfer_tip1 || 'Verify urgent money requests via a known phone number before acting.',
    translations.scamMoneyTransfer_tip2 || 'Never share OTP, PIN, or passwords. Legitimate services do not ask.',
    translations.scamMoneyTransfer_tip3 || 'Do not scan unknown QR codes or approve unexpected requests.',
    translations.scamMoneyTransfer_tip4 || 'Enable MFA and contact your bank immediately if scammed.',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1419" />

      {/* Header */}
      <LinearGradient colors={['#0F1419', '#1A213B']} style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
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
            <LinearGradient colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)']} style={styles.cardGradient}>
              <Text style={styles.descriptionText}>{description}</Text>
            </LinearGradient>
          </View>

          {/* Tips */}
          <View style={styles.tipsSection}>
            <View style={styles.tipsSectionHeader}>
              <View style={styles.tipsIconContainer}>
                <MaterialIcons name="security" size={24} color="#4ECDC4" />
              </View>
              <Text style={styles.whatToDoTitle}>{whatToDoTitle}</Text>
            </View>

            {tips.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <LinearGradient colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)']} style={styles.tipGradient}>
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
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255, 255, 255, 0.1)' },
  backButton: { padding: 8 },
  backButtonContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', textAlign: 'center' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  contentContainer: { paddingHorizontal: 16, paddingTop: 16 },
  descriptionCard: { marginBottom: 24, borderRadius: 16, overflow: 'hidden' },
  cardGradient: { padding: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
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