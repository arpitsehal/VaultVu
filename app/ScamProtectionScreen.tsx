// ScamProtectionScreen.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Platform, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ScamProtectionScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();

  // Enhanced scam modules with icons and colors
  const scamModules = [
    { 
      id: 'blackmail', 
      title: translations.scamProtectionTitle_blackmail || 'Blackmail Scams', 
      routeName: 'blackmail',
      icon: 'warning',
      iconType: 'MaterialIcons',
      gradient: ['#FF6B6B', '#FF8E53']
    },
    { 
      id: 'charity', 
      title: translations.scamProtectionTitle_charity || 'Charity Scams', 
      routeName: 'charityscam',
      icon: 'heart',
      iconType: 'AntDesign',
      gradient: ['#4ECDC4', '#44A08D']
    },
    { 
      id: 'debtCollection', 
      title: translations.scamProtectionTitle_debtCollection || 'Debt Collection Scams', 
      routeName: 'debtcollection',
      icon: 'creditcard',
      iconType: 'AntDesign',
      gradient: ['#A8E6CF', '#7FCDCD']
    },
    { 
      id: 'debtSettlement', 
      title: translations.scamProtectionTitle_debtSettlement || 'Debt Settlement and Debt Relief Scams', 
      routeName: 'debtsettlement',
      icon: 'calculate',
      iconType: 'MaterialIcons',
      gradient: ['#FFD93D', '#FF6B6B']
    },
    { 
      id: 'rbiMisuse', 
      title: translations.scamProtectionTitle_rbiMisuse || 'RBI Logo Misuse', 
      routeName: 'rbimisuse',
      icon: 'shield-checkmark',
      iconType: 'Ionicons',
      gradient: ['#667eea', '#764ba2']
    },
    { 
      id: 'foreclosureRelief', 
      title: translations.scamProtectionTitle_foreclosureRelief || 'Foreclosure Relief or Mortgage Loan Modification Scams', 
      routeName: 'foreclosure',
      icon: 'home',
      iconType: 'MaterialIcons',
      gradient: ['#f093fb', '#f5576c']
    },
    { 
      id: 'grandparent', 
      title: translations.scamProtectionTitle_grandparent || 'Grandparent Scams', 
      routeName: 'grandparent',
      icon: 'people',
      iconType: 'Ionicons',
      gradient: ['#4facfe', '#00f2fe']
    },
    { 
      id: 'impostor', 
      title: translations.scamProtectionTitle_impostor || 'Impostor Scams', 
      routeName: 'impostor',
      icon: 'person-outline',
      iconType: 'Ionicons',
      gradient: ['#fa709a', '#fee140']
    },
    { 
      id: 'lottery', 
      title: translations.scamProtectionTitle_lottery || 'Lottery or Prize Scams', 
      routeName: 'lottery',
      icon: 'trophy-outline',
      iconType: 'Ionicons',
      gradient: ['#a8edea', '#fed6e3']
    },
    { 
      id: 'mailFraud', 
      title: translations.scamProtectionTitle_mailFraud || 'Mail Fraud', 
      routeName: 'mailFraud',
      icon: 'mail',
      iconType: 'AntDesign',
      gradient: ['#ff9a9e', '#fecfef']
    },
    { 
      id: 'manInMiddle', 
      title: translations.scamProtectionTitle_manInMiddle || 'Man-in-the-Middle Scams', 
      routeName: 'manInMiddle',
      icon: 'swap-horizontal',
      iconType: 'Ionicons',
      gradient: ['#ffecd2', '#fcb69f']
    },
    { 
      id: 'moneyMule', 
      title: translations.scamProtectionTitle_moneyMule || 'Money Mule Scams', 
      routeName: 'moneyMule',
      icon: 'account-balance-wallet',
      iconType: 'MaterialIcons',
      gradient: ['#a8caba', '#5d4e75']
    },
    { 
      id: 'moneyTransfer', 
      title: translations.scamProtectionTitle_moneyTransfer || 'Money Transfer or Mobile Payment Services Fraud', 
      routeName: 'moneyTransfer',
      icon: 'phone-android',
      iconType: 'MaterialIcons',
      gradient: ['#667eea', '#764ba2']
    },
    { 
      id: 'mortgageClosing', 
      title: translations.scamProtectionTitle_mortgageClosing || 'Mortgage Closing Scams', 
      routeName: 'mortgageClosing',
      icon: 'business',
      iconType: 'MaterialIcons',
      gradient: ['#f093fb', '#f5576c']
    },
    { 
      id: 'romance', 
      title: translations.scamProtectionTitle_romance || 'Romance Scams', 
      routeName: 'romance',
      icon: 'heart',
      iconType: 'AntDesign',
      gradient: ['#ffecd2', '#fcb69f']
    },
    { 
      id: 'nonexistentGoods', 
      title: translations.scamProtectionTitle_nonexistentGoods || 'Sale of Nonexistent Goods or Services Scams', 
      routeName: 'nonexistentGoods',
      icon: 'shopping-cart',
      iconType: 'MaterialIcons',
      gradient: ['#a8edea', '#fed6e3']
    },
  ];

  const handleScamTypePress = (routeName) => {
    navigation.navigate(routeName);
  };

  const renderIcon = (iconName, iconType, size = 24) => {
    switch (iconType) {
      case 'MaterialIcons':
        return <MaterialIcons name={iconName} size={size} color="white" />;
      case 'Ionicons':
        return <Ionicons name={iconName} size={size} color="white" />;
      case 'AntDesign':
      default:
        return <AntDesign name={iconName} size={size} color="white" />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1419" />

      {/* Enhanced Header with Gradient */}
      <LinearGradient
        colors={['#0F1419', '#1A213B']}
        style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <View style={styles.backButtonContainer}>
            <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{translations.scamProtectionScreenTitle || 'Scam Protection'}</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentContainer}>
          {scamModules.map((scam, index) => (
            <TouchableOpacity
              key={scam.id}
              style={[
                styles.scamOption,
                { 
                  transform: [{ scale: 1 }],
                  opacity: 1,
                }
              ]}
              onPress={() => handleScamTypePress(scam.routeName)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                style={styles.cardGradient}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <LinearGradient
                      colors={scam.gradient}
                      style={styles.iconGradient}
                    >
                      {renderIcon(scam.icon, scam.iconType, 22)}
                    </LinearGradient>
                  </View>
                  
                  <View style={styles.textContainer}>
                    <Text style={styles.scamOptionText} numberOfLines={2}>
                      {scam.title}
                    </Text>
                  </View>
                  
                  <View style={styles.arrowContainer}>
                    <AntDesign name="right" size={18} color="#94A3B8" />
                  </View>
                </View>
              </LinearGradient>

              {/* Subtle shadow overlay */}
              <View style={styles.shadowOverlay} />
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
    backgroundColor: '#0F1419',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scamOption: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  cardGradient: {
    padding: 1,
    borderRadius: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2936',
    borderRadius: 15,
    padding: 16,
    minHeight: 72,
  },
  iconContainer: {
    marginRight: 16,
  },
  iconGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  scamOptionText: {
    fontSize: 16,
    color: '#F1F5F9',
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
});