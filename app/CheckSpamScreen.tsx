// CheckSpamScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Platform, ActivityIndicator, ScrollView, Modal, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext'; // Import the useLanguage hook

export default function CheckSpamScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // State for the custom modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'success' });
  
  // Use the useLanguage hook to get translations
  const { translations } = useLanguage();

  // Function to show the custom modal
  const showModal = (title, message, type = 'success') => {
    setModalContent({ title, message, type });
    setModalVisible(true);
  };

  const handleCheckSpam = async () => {
    if (!phoneNumber) {
      showModal(translations.inputRequired || 'Input Required', translations.inputRequiredMessage || 'Please enter a mobile number to check.', 'error');
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
        if (data.isGenuine) {
          showModal(translations.checkComplete || 'Check Complete', translations.numberGenuine || 'The number appears genuine.', 'success');
        } else {
          showModal(translations.checkComplete || 'Check Complete', translations.numberSuspicious || 'Suspicious number detected. Be cautious!', 'warning');
        }
      } else {
        showModal(translations.apiError || 'Error', data.error || translations.apiConnectionError || 'Failed to check phone number', 'error');
      }
    } catch (error) {
      console.error('Error checking phone number:', error);
      showModal(translations.apiError || 'API Error', translations.apiConnectionError || 'Could not connect to the server. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    const { isGenuine, riskScore, reasons, carrierInfo, location, lineType } = result;
    const resultColor = isGenuine ? '#5cb85c' : '#d9534f';
    const borderColor = isGenuine ? '#5cb85c' : '#d9534f';
    
    return (
      <View style={[styles.resultCard, { borderColor }]}>
        <Text style={[styles.resultTitle, { color: resultColor }]}>
          {isGenuine ? translations.numberGenuine || 'Number appears genuine' : translations.numberSuspicious || 'Suspicious number detected'}
        </Text>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>{translations.riskScore || 'Risk Score'}:</Text>
          <Text style={[styles.resultScore, { color: resultColor }]}>{riskScore}/10</Text>
        </View>
        
        {reasons && reasons.length > 0 && (
          <View style={styles.reasonsContainer}>
            <Text style={styles.reasonsTitle}>{translations.reasonsTitle || 'Reasons for the score:'}</Text>
            {reasons.map((reason, index) => (
              <Text key={index} style={styles.reasonText}>• {reason}</Text>
            ))}
          </View>
        )}
        
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>{translations.additionalDetails || 'Additional Details'}:</Text>
          {carrierInfo && (
            <Text style={styles.infoText}>{translations.carrier || 'Carrier'}: {carrierInfo}</Text>
          )}
          {location && (
            <Text style={styles.infoText}>{translations.location || 'Location'}: {location}</Text>
          )}
          {lineType && (
            <Text style={styles.infoText}>{translations.lineType || 'Line Type'}: {lineType}</Text>
          )}
        </View>

        {!isGenuine && (
          <Text style={styles.warningText}>
            {translations.spamWarningText || 'Be cautious! This number shows signs of potential spam or fraud.'}
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
      <StatusBar barStyle="light-content" backgroundColor={styles.safeArea.backgroundColor} />

      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#A8C3D1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{translations.checkSpam || 'Check Spam'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.screenTitleContainer}>
        <AntDesign name="phone" size={40} color="#A8C3D1" style={{ marginRight: 10 }} />
        <Text style={styles.screenSubtitle}>{translations.verifyPhoneNumbers || 'Verify phone numbers for spam'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          <Text style={styles.promptText}>
            {translations.spamPrompt || 'Enter a mobile number to check for spam or fraudulent activity.'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={translations.enterMobileNumber || 'Enter mobile number'}
            placeholderTextColor="#A8C3D1"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={15}
          />

          <TouchableOpacity 
            style={[styles.checkButton, loading ? styles.disabledButton : null]} 
            onPress={handleCheckSpam}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#1A213B" size="small" />
            ) : (
              <Text style={styles.checkButtonText}>{translations.checkNumber || 'Check Number'}</Text>
            )}
          </TouchableOpacity>
          
          {renderResult()}
        </View>
      </ScrollView>

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
              <Text style={styles.modalButtonText}>{translations.ok || 'OK'}</Text>
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
    backgroundColor: '#1A213B',
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
    backgroundColor: '#1A213B',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f5f5f5',
    flexShrink: 1,
    textAlign: 'center',
  },
  screenTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#1C2434',
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#A8C3D1',
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
    color: '#A8C3D1',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 26,
  },
  input: {
    backgroundColor: '#1C2434',
    color: '#A8C3D1',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    fontSize: 18,
    width: '100%',
    textAlign: 'center',
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
    color: '#1A213B',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCard: {
    marginTop: 30,
    backgroundColor: '#1C2434',
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
  detailsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A8C3D1',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#A8C3D1',
    marginTop: 5,
  },
  warningText: {
    marginTop: 15,
    color: '#f0ad4e',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#1C2434',
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