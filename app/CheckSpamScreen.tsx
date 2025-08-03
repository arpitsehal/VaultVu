// CheckSpamScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Platform, Alert, Linking } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function CheckSpamScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleCheckSpam = () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter a mobile number to check.');
      return;
    }

    // Truecaller website search URL
    const truecallerUrl = `https://www.truecaller.com/search/in/${phoneNumber}`;

    Linking.openURL(truecallerUrl).catch((err) => {
      console.error('Failed to open URL:', err);
      Alert.alert('Error', 'Could not open Truecaller website. Please try again.');
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />

      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check Spam</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.promptText}>
          Enter a mobile number to check for spam or fraudulent activity.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter mobile number"
          placeholderTextColor="#A8C3D1"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <TouchableOpacity style={styles.checkButton} onPress={handleCheckSpam}>
          <Text style={styles.checkButtonText}>Check Spam</Text>
        </TouchableOpacity>
        
        <Text style={styles.disclaimerText}>
          This will open the Truecaller website in your browser for verification.
        </Text>
      </View>
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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  promptText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 26,
  },
  input: {
    backgroundColor: '#444D62',
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    fontSize: 18,
    width: '100%',
    textAlign: 'center',
  },
  checkButton: {
    backgroundColor: '#A8C3D1',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
  },
  checkButtonText: {
    color: '#1A213B',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disclaimerText: {
    marginTop: 20,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});
