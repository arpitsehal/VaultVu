// ImposterScamScreen.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function ImposterScamScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const scamDetails = {
    title: 'Imposter Scams',
    description: 'In an imposter scam, a scammer pretends to be someone you know and trust, like a family member, a government official, a bank representative, or a tech support agent. They might claim there is a problem that requires your immediate attention, like a security breach on your account, a fine that needs to be paid, or a family emergency. The goal is to create fear and urgency to pressure you into sending money, providing personal information, or giving them remote access to your devices.',
    whatToDo: [
      "Do NOT panic. Impersonators typically aim to create fear and urgency to push you into action without thinking. Stop communicating with the person immediately.",
      "Verify the identity of the person or organization. If they claim to be from a bank or government agency, hang up and call them back using the official number from their website or your records, not a number they provided.",
      "Never share personal details, OTPs, or financial information like bank passwords or credit card numbers. Legitimate organizations will never ask for this information over the phone or in an unsolicited message.",
      "Do NOT comply with demands for money or to install apps. Be extremely cautious of requests to wire money, send gift cards, or pay with cryptocurrency.",
      'File a complaint on the National Cybercrime Reporting Portal: cybercrime.gov.in or call the toll‑free helpline 1930.'
    ],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />

      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{scamDetails.title}</Text>
        <View style={{ width: 40 }} /> {/* Spacer to balance header title */}
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Text style={styles.descriptionText}>{scamDetails.description}</Text>

          <Text style={styles.whatToDoTitle}>What to do if you're targeted:</Text>
          {scamDetails.whatToDo.map((tip, index) => (
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
    backgroundColor: '#1A213B', // Dark background
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
    borderBottomColor: 'rgba(255, 255, 255, 0.1)', // Subtle separator
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 28,
    color: '#A8C3D1', // Light accent color
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    flexShrink: 1, // Allows text to wrap if long
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