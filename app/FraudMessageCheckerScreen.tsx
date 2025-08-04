// FraudMessageCheckerScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function FraudMessageCheckerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheckMessage = async () => {
    if (!message) {
      Alert.alert('Error', 'Please enter a message to check.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Call our backend API
      const apiUrl = 'http://192.168.35.74:5000/api/message-check';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error checking message:', error);
      Alert.alert('Error', 'Could not check the message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    const { isGenuine, riskScore, reasons } = result;
    const resultColor = isGenuine ? '#4CAF50' : '#F44336';
    
    return (
      <View style={styles.resultContainer}>
        <Text style={[styles.resultTitle, { color: resultColor }]}>
          {isGenuine ? 'Message appears genuine' : 'Potential fraud detected'}
        </Text>
        
        <Text style={styles.resultScore}>
          Risk score: <Text style={{ color: resultColor }}>{riskScore}/10</Text>
        </Text>
        
        {reasons && reasons.length > 0 && (
          <View style={styles.reasonsContainer}>
            <Text style={styles.reasonsTitle}>Reasons:</Text>
            {reasons.map((reason, index) => (
              <Text key={index} style={styles.reasonText}>• {reason}</Text>
            ))}
          </View>
        )}
        
        {!isGenuine && (
          <Text style={styles.warningText}>
            Be cautious! This message shows signs of potential fraud or scam.
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />

      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Message Fraud Checker</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.promptText}>
          Enter a message to check for potential fraud or scam content.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Paste message text here"
          placeholderTextColor="#A8C3D1"
          value={message}
          onChangeText={setMessage}
          multiline={true}
          numberOfLines={6}
          textAlignVertical="top"
        />

        <TouchableOpacity 
          style={styles.checkButton} 
          onPress={handleCheckMessage}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#1A213B" size="small" />
          ) : (
            <Text style={styles.checkButtonText}>Check Message</Text>
          )}
        </TouchableOpacity>
        
        {renderResult()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A213B',
  },
  scrollView: {
    flex: 1,
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
    padding: 30,
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
    fontSize: 16,
    width: '100%',
    minHeight: 150,
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
    marginTop: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    width: '100%',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultScore: {
    fontSize: 16,
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  reasonsContainer: {
    marginTop: 10,
  },
  reasonsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  reasonText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
    lineHeight: 20,
  },
  warningText: {
    marginTop: 15,
    color: '#F44336',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});