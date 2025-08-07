// BudgetManagerScreen.tsx
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

export default function BudgetManagerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();

  const budgetModules = [
    { id: 'budgetTracker', title: translations.budgetTracker || 'Budget Tracker', routeName: 'BudgetTrackerScreen' },
    { id: 'emiCalculator', title: translations.emiCalculator || 'EMI Calculator & Manager', routeName: 'EMIManagerScreen' },
    { id: 'sipTracker', title: translations.sipTracker || 'SIP Tracker & Calculator', routeName: 'SIPTrackerScreen' },
  ];

  const handleModulePress = (routeName) => {
    navigation.navigate(routeName);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />

      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#A8C3D1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{translations.budgetManagerScreenTitle || 'Budget Manager'}</Text>
        <View style={{ width: 40 }} /> {/* Spacer to balance header title */}
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {budgetModules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={styles.moduleOption}
              onPress={() => handleModulePress(module.routeName)}
            >
              <Text style={styles.moduleOptionText}>{module.title}</Text>
              <Text style={styles.moduleOptionArrow}>›</Text>
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
  moduleOption: {
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
  moduleOptionText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    flexShrink: 1,
    marginRight: 10,
  },
  moduleOptionArrow: {
    fontSize: 20,
    color: '#A8C3D1',
  },
});