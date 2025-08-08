// LotteryPrizeScamScreen.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function LotteryPrizeScamScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const scamDetails = {
    title: 'Lottery or Prize Scams',
    description: 'In a lottery or prize scam, you receive an unexpected notification—by phone, email, text, or mail—that you have won a large sum of money, a new car, or an expensive vacation. The catch is that to receive your winnings, you must first pay a fee for "taxes," "processing," or "insurance." Scammers will pressure you to pay this fee quickly, often by wire transfer, gift cards, or cryptocurrency, which are difficult to trace. Remember, if you didn\'t enter a lottery, you can\'t win one.',
    whatToDo: [
      "Be skeptical of any unexpected notification that you've won a prize. If you didn't enter a contest or lottery, it's a scam.",
      "Never pay a fee to collect your 'winnings.' Legitimate lotteries or sweepstakes do not require you to pay money upfront to receive a prize.",
      "Do not provide any personal or financial information, such as your bank account details or social security number, to claim a prize.",
      "If you receive a suspicious call or email, do not respond. Delete the message and block the sender. Do not click on any links in the email, as they may lead to malicious websites.",
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