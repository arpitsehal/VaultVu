import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

export default function UpiFraudScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { translations } = useLanguage();

  const title = translations.upiFraudTitle || 'UPI/Internet Banking Fraud';
  const description =
    translations.upiFraudDescription ||
    'UPI and internet banking frauds involve tricking users into sharing their UPI PIN, OTP, or login credentials, or luring them into authorizing fraudulent transactions. Scammers may impersonate bank officials or send fake payment requests.';

  const whatToDoTitle = translations.upiFraudWhatToDoTitle || "What to do if you're targeted:";
  const tips = [
    translations.upiFraudTip1 || 'Never share your UPI PIN, OTP, or internet banking credentials with anyone.',
    translations.upiFraudTip2 || 'Do not approve unknown or suspicious payment requests.',
    translations.upiFraudTip3 || 'Always verify the identity of callers claiming to be from your bank or RBI.',
    translations.upiFraudTip4 || 'Use official banking apps and avoid clicking on links in unsolicited messages.',
    translations.upiFraudTip5 ||
      'Report unauthorized transactions to your bank and the National Cybercrime Reporting Portal: cybercrime.gov.in or call 1930.',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1419" />

      <LinearGradient colors={['#0F1419', '#1A213B']} style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <View style={styles.backButtonContainer}>
            <AntDesign name="arrowleft" size={22} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={styles.descriptionCard}>
            <LinearGradient colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.04)']} style={styles.cardGradient}>
              <Text style={styles.descriptionText}>{description}</Text>
            </LinearGradient>
          </View>

          <View style={styles.tipsHeader}>
            <View style={styles.tipsIconCirle}>
              <MaterialIcons name="security" size={18} color="#4ECDC4" />
            </View>
            <Text style={styles.tipsTitle}>{whatToDoTitle}</Text>
          </View>

          {tips.map((tip, idx) => (
            <View key={idx} style={styles.tipCard}>
              <LinearGradient colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.04)']} style={styles.tipGradient}>
                <View style={styles.tipRow}>
                  <AntDesign name="checkcircle" size={18} color="#4ECDC4" style={{ marginRight: 10 }} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              </LinearGradient>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F1419' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.08)' },
  backButton: { padding: 6 },
  backButtonContainer: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },

  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  contentContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },

  descriptionCard: { marginBottom: 16, borderRadius: 16, overflow: 'hidden' },
  cardGradient: { padding: 16, borderRadius: 16 },
  descriptionText: { fontSize: 16, color: '#E6EDF3', lineHeight: 24 },

  tipsHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 6, marginBottom: 10 },
  tipsIconCirle: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(78,205,196,0.12)', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  tipsTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },

  tipCard: { borderRadius: 14, overflow: 'hidden', marginBottom: 10 },
  tipGradient: { padding: 14, borderRadius: 14 },
  tipRow: { flexDirection: 'row', alignItems: 'center' },
  tipText: { fontSize: 15, color: '#F1F5F9', lineHeight: 22, flex: 1 },
});