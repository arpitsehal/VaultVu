// DebtSettlementScamScreen
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

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
      <StatusBar barStyle="light-content" backgroundColor="#0F1419" />

      {/* Header */}
      <LinearGradient
        colors={["#0F1419", "#1A213B"]}
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
              colors={["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.04)"]}
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
                  colors={["rgba(255, 255, 255, 0.06)", "rgba(255, 255, 255, 0.03)"]}
                  style={styles.tipGradient}
                >
                  <View style={styles.tipContent}>
                    <View style={styles.tipIconWrapper}>
                      <View style={[styles.tipIconContainer, { backgroundColor: 'rgba(78, 205, 196, 0.15)' }]}>
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
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', textAlign: 'center' },
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
