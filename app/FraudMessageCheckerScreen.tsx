// FraudMessageCheckerScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Platform, ActivityIndicator, ScrollView, Modal, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons'; // Assuming you have @expo/vector-icons installed

export default function FraudMessageCheckerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // State for the custom modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'success' });

  // Function to show the custom modal
  const showModal = (title, message, type = 'success') => {
    setModalContent({ title, message, type });
    setModalVisible(true);
  };

  const handleCheckMessage = async () => {
    if (!message) {
      showModal('Input Required', 'Please enter a message to check.', 'error');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Call our backend API
      const apiUrl = 'http://192.168.1.7:5000/api/message-check';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setResult(data);
      if (data.isGenuine) {
        showModal('Check Complete', 'The message appears genuine.', 'success');
      } else {
        showModal('Check Complete', 'Potential fraud detected. Be cautious!', 'warning');
      }
    } catch (error) {
      console.error('Error checking message:', error);
      showModal('API Error', 'Could not check the message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    const { isGenuine, riskScore, reasons } = result;
    const resultColor = isGenuine ? '#5cb85c' : '#d9534f'; // Green for genuine, Red for fraud
    const borderColor = isGenuine ? '#5cb85c' : '#d9534f'; // Border color matches result status
    
    return (
      <View style={[styles.resultCard, { borderColor }]}>
        <Text style={[styles.resultTitle, { color: resultColor }]}>
          {isGenuine ? 'Message appears genuine' : 'Potential fraud detected'}
        </Text>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Risk Score:</Text>
          <Text style={[styles.resultScore, { color: resultColor }]}>{riskScore}/10</Text>
        </View>
        
        {reasons && reasons.length > 0 && (
          <View style={styles.reasonsContainer}>
            <Text style={styles.reasonsTitle}>Reasons for the score:</Text>
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

  // Helper function to get the appropriate icon for the modal
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
      {/* Status Bar: Matches the primary background color */}
      <StatusBar barStyle="light-content" backgroundColor={styles.safeArea.backgroundColor} />

      {/* Header Section */}
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#A8C3D1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Message Fraud Checker</Text>
        <View style={{ width: 40 }} /> {/* Spacer for symmetry */}
      </View>

      {/* Screen Title and Subtitle with Icon */}
      <View style={styles.screenTitleContainer}>
        <AntDesign name="message1" size={40} color="#A8C3D1" style={{ marginRight: 10 }} />
        <Text style={styles.screenSubtitle}>Analyze messages for fraudulent content</Text>
      </View>

      {/* Main Content Area (Scrollable) */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.promptText}>
          Enter a message to check for potential fraud or scam content.
        </Text>

        {/* Message Input Field */}
        <TextInput
          style={styles.input}
          placeholder="Paste message text here"
          placeholderTextColor="#A8C3D1"
          value={message}
          onChangeText={setMessage}
          multiline={true}
          numberOfLines={6}
          textAlignVertical="top" // Ensures text starts from the top on Android
        />

        {/* Check Button */}
        <TouchableOpacity 
          style={[styles.checkButton, loading ? styles.disabledButton : null]} 
          onPress={handleCheckMessage}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#1A213B" size="small" />
          ) : (
            <Text style={styles.checkButtonText}>Check Message</Text>
          )}
        </TouchableOpacity>
        
        {/* Render Result Card */}
        {renderResult()}
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
    backgroundColor: '#1A213B', // Adjusted to match the new background
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
    backgroundColor: '#1A213B', // Adjusted to match the new background
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f5f5f5', // Adjusted for better contrast on the new background
    flexShrink: 1,
    textAlign: 'center',
  },
  screenTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#1C2434', // Adjusted for the slightly darker card background
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#A8C3D1',
    textAlign: 'center',
  },
  contentContainer: {
    padding: 30,
    alignItems: 'center',
  },
  promptText: {
    fontSize: 18,
    color: '#A8C3D1',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 26,
  },
  input: {
    backgroundColor: '#1C2434', // Adjusted for the slightly darker card background
    color: '#A8C3D1',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    fontSize: 16,
    width: '100%',
    minHeight: 150,
    borderWidth: 2,
    borderColor: '#3a3a57',
  },
  checkButton: {
    backgroundColor: '#A8C3D1',
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
    color: '#1A213B', // Dark text on the light button
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCard: {
    marginTop: 30,
    backgroundColor: '#1C2434', // Adjusted for the slightly darker card background
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
    color: '#A8C3D1',
    marginRight: 5,
  },
  resultScore: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  reasonsContainer: {
    marginTop: 10,
  },
  reasonsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A8C3D1',
    marginBottom: 5,
  },
  reasonText: {
    fontSize: 14,
    color: '#A8C3D1',
    marginBottom: 5,
    lineHeight: 20,
  },
  warningText: {
    marginTop: 15,
    color: '#F44336',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
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
    backgroundColor: '#1C2434', // Adjusted for the slightly darker card background
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
    color: '#A8C3D1',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#A8C3D1',
  },
  modalButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  buttonClose: {
    backgroundColor: '#A8C3D1',
    width: 100,
  },
  modalButtonText: {
    color: '#1A213B',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});