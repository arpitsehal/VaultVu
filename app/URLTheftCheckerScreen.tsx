// URLTheftCheckerScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function URLTheftCheckerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheckUrl = async () => {
    if (!url) {
      Alert.alert('Error', 'Please enter a website URL to check.');
      return;
    }

    // A simple regex to check for valid URL format
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/?\w \.-]*)*\/?$/;
    if (!urlRegex.test(url)) {
      Alert.alert('Invalid URL', 'Please enter a valid website URL.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Call our backend API instead of redirecting to external site
      const apiUrl = 'http://192.168.1.7:5000/api/url-check';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error checking URL:', error);
      Alert.alert('Error', 'Could not check the URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    const { isSafe, riskScore, reasons } = result;
    const resultColor = isSafe ? '#4CAF50' : '#F44336';
    
    return (
      <View style={styles.resultContainer}>
        <Text style={[styles.resultTitle, { color: resultColor }]}>
          {isSafe ? 'URL appears safe' : 'Potential risk detected'}
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
        
        {!isSafe && (
          <Text style={styles.warningText}>
            Be cautious! This URL shows signs of potential phishing or fraud.
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
        <Text style={styles.headerTitle}>URL Theft Checker</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.promptText}>
          Enter a website URL to check for safety and fraud.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g., https://example.com"
          placeholderTextColor="#A8C3D1"
          value={url}
          onChangeText={setUrl}
          keyboardType="url"
          autoCapitalize="none"
        />

        <TouchableOpacity 
          style={styles.checkButton} 
          onPress={handleCheckUrl}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#1A213B" size="small" />
          ) : (
            <Text style={styles.checkButtonText}>Check Website</Text>
          )}
        </TouchableOpacity>
        
        {renderResult()}
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
