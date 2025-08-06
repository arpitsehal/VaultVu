// URLTheftCheckerScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Platform, ActivityIndicator, ScrollView, Modal, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

export default function URLTheftCheckerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'success' });

  const showModal = (title, message, type = 'success') => {
    setModalContent({ title, message, type });
    setModalVisible(true);
  };

  const handleCheckUrl = async () => {
    if (!url) {
      showModal('Input Required', 'Please enter a website URL to check.', 'error');
      return;
    }

    // Enhanced URL validation
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlRegex.test(url)) {
      showModal('Invalid URL', 'Please enter a valid website URL.', 'error');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Simulating API call - replace with your actual API endpoint
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
      
      if (data.isSafe) {
        showModal('Check Complete', 'The URL appears safe to visit.', 'success');
      } else {
        showModal('Check Complete', 'Potential risk detected. Exercise caution!', 'warning');
      }

    } catch (error) {
      console.error('Error checking URL:', error);
      showModal('API Error', 'Could not check the URL. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearUrl = () => {
    setUrl('');
    setResult(null);
  };

  const renderResult = () => {
    if (!result) return null;

    const { isSafe, riskScore, reasons, category } = result;
    const resultColor = isSafe ? '#5cb85c' : '#d9534f'; // Green for safe, Red for risk
    const borderColor = isSafe ? '#5cb85c' : '#d9534f'; // Border color matches result status

    return (
      <View style={[styles.resultCard, { borderColor }]}>
        <Text style={[styles.resultTitle, { color: resultColor }]}>
          {isSafe ? 'URL appears safe to visit' : 'Potential risk detected'}
        </Text>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Risk Score:</Text>
          <Text style={[styles.resultScore, { color: resultColor }]}>{riskScore}/10</Text>
        </View>

        {category && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Category:</Text>
            <Text style={[styles.categoryText, { color: resultColor }]}>{category}</Text>
          </View>
        )}

        {reasons && reasons.length > 0 && (
          <View style={styles.reasonsContainer}>
            <Text style={styles.reasonsTitle}>Analysis details:</Text>
            {reasons.map((reason, index) => (
              <Text key={index} style={styles.reasonText}>• {reason}</Text>
            ))}
          </View>
        )}
        
        {!isSafe && (
          <View style={styles.warningContainer}>
            <AntDesign name="warning" size={20} color="#f0ad4e" style={{ marginRight: 8 }} />
            <Text style={styles.warningText}>
              This URL shows signs of potential phishing, malware, or fraud. Proceed with extreme caution.
            </Text>
          </View>
        )}
      </View>
    );
  };
  
  const getModalIcon = (type) => {
    switch (type) {
      case 'success':
        return <AntDesign name="checkcircle" size={50} color="#5cb85c" />;
      case 'error':
        return <AntDesign name="exclamationcircle" size={50} color="#d9534f" />;
      case 'warning':
        return <AntDesign name="warning" size={50} color="#f0ad4e" />;
      case 'info':
        return <AntDesign name="infocirlce" size={50} color="#5bc0de" />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={styles.safeArea.backgroundColor} />

      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#A8C3D1" /> {/* Adjusted color */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>URL Safety Checker</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.screenTitleContainer}>
        <AntDesign name="link" size={40} color="#A8C3D1" style={{ marginRight: 10 }} /> {/* Adjusted color */}
        <Text style={styles.screenSubtitle}>Verify website safety & detect threats</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          <Text style={styles.promptText}>
            Enter a website URL to analyze for potential security threats, phishing attempts, and malicious content.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="https://example.com"
              placeholderTextColor="#A8C3D1" // Adjusted color
              value={url}
              onChangeText={setUrl}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {url.length > 0 && (
              <TouchableOpacity onPress={clearUrl} style={styles.clearButton}>
                <AntDesign name="close" size={20} color="#A8C3D1" /> {/* Adjusted color */}
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.checkButton, (loading || !url.trim()) ? styles.disabledButton : null]} 
            onPress={handleCheckUrl}
            disabled={loading || !url.trim()}
          >
            {loading ? (
              <ActivityIndicator color="#1A213B" size="small" /> 
            ) : (
              <Text style={styles.checkButtonText}>Analyze Website Safety</Text>
            )}
          </TouchableOpacity>
          
          {renderResult()}
        </View>
      </ScrollView>

      {/* Custom Modal for Notifications */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.centeredView} onPress={() => setModalVisible(false)}>
          <View style={styles.modalView}>
            {getModalIcon(modalContent.type)}
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            <Text style={styles.modalText}>{modalContent.message}</Text>
            <Pressable
              style={[styles.modalButton, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A213B', // Primary background color (soft dark blue)
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1A213B', // Primary background
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f5f5f5', // Light text for contrast
    flexShrink: 1,
    textAlign: 'center',
  },
  screenTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#1C2434', // Secondary background (slightly darker card color)
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#A8C3D1', // Adjusted color
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  promptText: {
    fontSize: 18,
    color: '#A8C3D1', // Adjusted color
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 26,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1C2434', // Secondary background for input
    color: '#A8C3D1', // Adjusted color
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingRight: 50, // Make room for clear button
    fontSize: 16,
    width: '100%',
    borderWidth: 2,
    borderColor: '#3a3a57', // Border for input field
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  checkButton: {
    backgroundColor: '#A8C3D1', // Button background from screenshot
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: '#6A7A88',
    opacity: 0.7,
  },
  checkButtonText: {
    color: '#1A213B', // Dark text on light button
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCard: {
    marginTop: 30,
    backgroundColor: '#1C2434', // Secondary background for result card
    borderRadius: 12,
    padding: 20,
    width: '100%',
    borderWidth: 2,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: 15,
  },
  scoreLabel: {
    fontSize: 18,
    color: '#A8C3D1', // Adjusted color
    marginRight: 5,
  },
  resultScore: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryLabel: {
    fontSize: 16,
    color: '#A8C3D1', // Adjusted color
    marginRight: 8,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reasonsContainer: {
    marginTop: 10,
  },
  reasonsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A8C3D1', // Adjusted color
    marginBottom: 5,
  },
  reasonText: {
    fontSize: 14,
    color: '#A8C3D1', // Adjusted color
    marginBottom: 5,
    lineHeight: 20,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 15,
    padding: 12,
    backgroundColor: 'rgba(240, 173, 78, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f0ad4e',
  },
  warningText: {
    flex: 1,
    color: '#f0ad4e',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  // Modal Styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#1C2434', // Secondary background for modal
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#A8C3D1', // Adjusted color
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#A8C3D1', // Adjusted color
  },
  modalButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  buttonClose: {
    backgroundColor: '#A8C3D1', // Button background from screenshot
    width: 100,
  },
  modalButtonText: {
    color: '#1A213B', // Dark text on light button
    fontWeight: 'bold',
    textAlign: 'center',
  },
});