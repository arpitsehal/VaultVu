// GrandparentScamScreen.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function GrandparentScamScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const scamDetails = {
    title: 'Grandparent Scams',
    description: "In a 'grandparent scam,' a scammer poses as a desperate grandchild in trouble. You might receive a call, text, or social media message claiming they've been in an accident, arrested, or are stranded in another country. The scammer creates a sense of urgency, asking you to wire money, send gift cards, or use a mobile app to pay for bail, hospital bills, or travel expenses. They'll often beg you not to tell their parents, which isolates you and keeps the scam going.",
    whatToDo: [
      "Stay calm and don't act immediately. If you get a call, hang up and try to contact your grandchild directly using a phone number you know is theirs, not the one provided by the caller.",
      "Ask the caller personal questions that only your real grandchild would know, like a pet's name or a special family memory. If they can't answer, it's a scam.",
      "Never send money, gift cards, or personal information in response to an urgent, unexpected request. Scammers often pressure you to act fast so you don't have time to think or verify their story.",
      "Tell a trusted family member or friend about the call. A second opinion can help you realize it's a scam.",
      'File a complaint on the National Cybercrime Reporting Portal: cybercrime.gov.in or call the toll-free helpline 1930.'
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
  whatToDoTitle: { // Renamed from tipsTitle for clarity
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
    flex: 1, // Allows text to wrap
    lineHeight: 22,
  },
});