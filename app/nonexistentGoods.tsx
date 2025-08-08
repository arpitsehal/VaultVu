// NonexistentGoodsScamScreen.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function NonexistentGoodsScamScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const scamDetails = {
    title: 'Nonexistent Goods Scams',
    description: "In a nonexistent goods scam, a fraudster advertises products or services that do not exist or are not in their possession. This scam is common on online marketplaces, social media, and classified ad websites. The seller will list a highly desirable item, often at a low price, to attract buyers quickly. They'll ask for an upfront payment, usually through an untraceable method like a wire transfer or mobile payment app. Once the payment is made, the scammer disappears, and the buyer never receives the promised item.",
    whatToDo: [
      "Be suspicious of deals that seem too good to be true, especially for high-demand items. A deeply discounted price is a common tactic to lure buyers into a scam.",
      "Insist on using a secure and reputable payment method that offers buyer protection, such as a credit card or a verified payment platform. Avoid paying with wire transfers, gift cards, or cryptocurrency, as these transactions are almost impossible to reverse.",
      "Check the seller’s reputation. Look for reviews, ratings, and a history of successful transactions on the platform. If the seller has a new account or a vague profile, proceed with caution.",
      "Request to see the item in person or ask for a live video call to verify the product's existence before making a payment. If the seller refuses, it's a major red flag.",
      'File a complaint on the National Cybercrime Reporting Portal: cybercrime.gov.in or call the toll-free helpline 1930. Report the seller and the listing to the platform where you found the ad.'
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