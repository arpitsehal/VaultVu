// CheckSpamScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function CheckSpamScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheckSpam = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter a mobile number to check.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Make API call to our backend
      const response = await fetch('http://192.168.1.7:5000/api/phone-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        Alert.alert('Error', data.error || 'Failed to check phone number');
      }
    } catch (error) {
      console.error('Error checking phone number:', error);
      Alert.alert('Error', 'Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
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
          maxLength={15}
        />

        <TouchableOpacity 
          style={styles.checkButton} 
          onPress={handleCheckSpam}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#1A213B" />
          ) : (
            <Text style={styles.checkButtonText}>Check Number</Text>
          )}
        </TouchableOpacity>
        
        {result && (
          <View style={styles.resultContainer}>
            <Text style={[styles.resultText, { color: result.isGenuine ? '#4CAF50' : '#F44336' }]}>
              {result.isGenuine ? 'Number appears genuine' : 'Suspicious number detected'}
            </Text>
            <Text style={styles.riskScoreText}>
              Risk score: {result.riskScore}/10
            </Text>
            
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsTitle}>Details:</Text>
              {result.reasons.map((reason, index) => (
                <Text key={index} style={styles.reasonText}>• {reason}</Text>
              ))}
              
              {result.carrierInfo && (
                <Text style={styles.infoText}>Carrier: {result.carrierInfo}</Text>
              )}
              
              {result.location && (
                <Text style={styles.infoText}>Location: {result.location}</Text>
              )}
              
              {result.lineType && (
                <Text style={styles.infoText}>Line Type: {result.lineType}</Text>
              )}
            </View>
          </View>
        )}
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
  resultContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    width: '100%',
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  riskScoreText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  reasonText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
    paddingLeft: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#A8C3D1',
    marginTop: 5,
  },
});
