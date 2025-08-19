import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function FraudProtectionScreen() {

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();

  const fraudModules = [
    { id: 'phishing', title: translations.fraudTitle_phishing || 'Phishing Fraud', routeName: 'phishingFraud', icon: 'email', iconType: 'MaterialIcons', gradient: ['#ff9a9e', '#fecfef'] },
    { id: 'cardCloning', title: translations.fraudTitle_cardCloning || 'Card Cloning/Skimming', routeName: 'cardCloningFraud', icon: 'credit-card', iconType: 'MaterialIcons', gradient: ['#a8edea', '#fed6e3'] },
    { id: 'upiFraud', title: translations.fraudTitle_upiFraud || 'UPI/Internet Banking Fraud', routeName: 'upiFraud', icon: 'phone-portrait-outline', iconType: 'Ionicons', gradient: ['#667eea', '#764ba2'] },
    { id: 'loanFraud', title: translations.fraudTitle_loanFraud || 'Fake Loan Apps & Loan Fraud', routeName: 'loanFraud', icon: 'calculate', iconType: 'MaterialIcons', gradient: ['#FFD93D', '#FF6B6B'] },
    { id: 'kYCUpdate', title: translations.fraudTitle_kycFraud || 'KYC Update Fraud', routeName: 'kycFraud', icon: 'shield-checkmark', iconType: 'Ionicons', gradient: ['#4ECDC4', '#44A08D'] },
    { id: 'atmFraud', title: translations.fraudTitle_atmFraud || 'ATM Fraud', routeName: 'atmFraud', icon: 'atm', iconType: 'MaterialIcons', gradient: ['#4facfe', '#00f2fe'] },
    { id: 'investmentFraud', title: translations.fraudTitle_investmentFraud || 'Investment & Ponzi Schemes', routeName: 'investmentFraud', icon: 'trending-up', iconType: 'MaterialIcons', gradient: ['#f093fb', '#f5576c'] },
    { id: 'insuranceFraud', title: translations.fraudTitle_insuranceFraud || 'Insurance Fraud', routeName: 'insuranceFraud', icon: 'health-and-safety', iconType: 'MaterialIcons', gradient: ['#a8caba', '#5d4e75'] },
    { id: 'identityTheft', title: translations.fraudTitle_identityTheft || 'Identity Theft', routeName: 'identityTheftFraud', icon: 'person-outline', iconType: 'Ionicons', gradient: ['#fa709a', '#fee140'] },
    { id: 'fakeCustomerCare', title: translations.fraudTitle_fakeCustomerCare || 'Fake Customer Care', routeName: 'fakeCustomerCareFraud', icon: 'support-agent', iconType: 'MaterialIcons', gradient: ['#a8e6cf', '#7fcdcd'] },
  ] as const;

  const renderIcon = (iconName: string, iconType: string, size = 22) => {
    switch (iconType) {
      case 'MaterialIcons':
        return <MaterialIcons name={iconName as any} size={size} color="white" />;
      case 'Ionicons':
        return <Ionicons name={iconName as any} size={size} color="white" />;
      case 'AntDesign':
      default:
        return <AntDesign name={iconName as any} size={size} color="white" />;
    }
  };

  const handleFraudTypePress = (routeName: string) => {
    (navigation as any).navigate(routeName as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1419" />

      {/* Enhanced Header with Gradient */}
      <LinearGradient colors={['#0F1419', '#1A213B']} style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <View style={styles.backButtonContainer}>
            <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{translations.fraudProtectionScreenTitle || 'Fraud Protection'}</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          {fraudModules.map((fraud) => (
            <TouchableOpacity
              key={fraud.id}
              style={[styles.scamOption, { transform: [{ scale: 1 }], opacity: 1 }]}
              onPress={() => handleFraudTypePress(fraud.routeName)}
              activeOpacity={0.8}
            >
              <LinearGradient colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']} style={styles.cardGradient}>
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <LinearGradient colors={fraud.gradient as readonly [string, string]} style={styles.iconGradient}>
                      {renderIcon(fraud.icon as any, fraud.iconType as any, 22)}
                    </LinearGradient>
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.scamOptionText} numberOfLines={2}>{fraud.title}</Text>
                  </View>
                  <View style={styles.arrowContainer}>
                    <AntDesign name="right" size={18} color="#94A3B8" />
                  </View>
                </View>
              </LinearGradient>
              <View style={styles.shadowOverlay} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F1419' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255, 255, 255, 0.1)' },
  backButton: { padding: 8 },
  backButtonContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  contentContainer: { paddingHorizontal: 16, paddingTop: 16 },
  scamOption: { marginBottom: 12, borderRadius: 16, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  cardGradient: { padding: 1, borderRadius: 16 },
  cardContent: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E2936', borderRadius: 15, padding: 16, minHeight: 72 },
  iconContainer: { marginRight: 16 },
  iconGradient: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  textContainer: { flex: 1, marginRight: 12 },
  scamOptionText: { fontSize: 16, color: '#F1F5F9', fontWeight: '600', lineHeight: 22, letterSpacing: 0.3 },
  arrowContainer: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255, 255, 255, 0.08)', justifyContent: 'center', alignItems: 'center' },
  shadowOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 16, backgroundColor: 'rgba(0, 0, 0, 0.02)' },
});