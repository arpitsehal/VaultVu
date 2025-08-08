import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentLanguage, translations, changeLanguage } = useLanguage();

  // Available languages
  const languages = [
    { id: 'english', name: 'English', nativeName: 'English' },
    { id: 'hindi', name: 'Hindi', nativeName: 'हिंदी' },
    { id: 'punjabi', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  ];

  const handleLanguageChange = async (languageId: string) => {
    try {
      // Use the context's changeLanguage function
      const success = await changeLanguage(languageId);
      
      if (success) {
        // Show confirmation
        Alert.alert(
          translations.languageChanged,
          translations.languageChangeMessage,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Language Changed', 'App language is changed. Some changes require a restart.');
      }
    } catch (error) {
      console.error('Error changing language:', error);
      Alert.alert('Error', 'Failed to change language. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{translations.language}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.description}>
          {translations.selectLanguage}
        </Text>
        
        {languages.map((language) => (
          <TouchableOpacity
            key={language.id}
            style={styles.languageOption}
            onPress={() => handleLanguageChange(language.id)}
          >
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>{language.name}</Text>
              <Text style={styles.languageNativeName}>{language.nativeName}</Text>
            </View>
            {currentLanguage === language.id && (
              <Ionicons name="checkmark-circle" size={24} color="#A8C3D1" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles remain the same
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
    width: 30,
  },
  backButtonText: {
    fontSize: 28,
    color: '#A8C3D1',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#A8C3D1',
    marginBottom: 30,
    lineHeight: 22,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    marginBottom: 5,
  },
  languageNativeName: {
    fontSize: 14,
    color: '#A8C3D1',
  },
});