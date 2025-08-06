// VoiceTheftCheckerScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Platform, ActivityIndicator, ScrollView, Modal, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { AntDesign } from '@expo/vector-icons'; // Assuming you have @expo/vector-icons installed

export default function VoiceTheftCheckerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'success' });

  const showModal = (title, message, type = 'success') => {
    setModalContent({ title, message, type });
    setModalVisible(true);
  };

  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAudioFile(result.assets[0]);
        setResult(null);
        showModal('File Selected', `Ready to check "${result.assets[0].name}"`, 'info');
      }
    } catch (error) {
      console.error('Error picking audio file:', error);
      showModal('Error', 'Could not select the audio file. Please try again.', 'error');
    }
  };

  const handleCheckVoice = async () => {
    if (!audioFile) {
      showModal('No File Selected', 'Please select an audio file to check.', 'error');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const fileBase64 = await FileSystem.readAsStringAsync(audioFile.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Simulating a network call
      const apiUrl = 'http://192.168.1.7:5000/api/voice-check';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioData: fileBase64,
          fileName: audioFile.name,
          fileType: audioFile.mimeType,
        }),
      });

      const data = await response.json();
      setResult(data);
      if (data.isGenuine) {
        showModal('Check Complete', 'The voice message appears genuine.', 'success');
      } else {
        showModal('Check Complete', 'Potential fraud detected. Be cautious!', 'warning');
      }

    } catch (error) {
      console.error('Error checking voice message:', error);
      showModal('API Error', 'Could not check the voice message. Please try again.', 'error');
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
          {isGenuine ? 'Voice message appears genuine' : 'Potential fraud detected'}
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
            This message shows signs of potential manipulation. Proceed with caution.
          </Text>
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
        <Text style={styles.headerTitle}>Voice Theft Checker</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.screenTitleContainer}>
        <AntDesign name="sound" size={40} color="#A8C3D1" style={{ marginRight: 10 }} /> {/* Adjusted color */}
        <Text style={styles.screenSubtitle}>Detect deepfake voice messages</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          <Text style={styles.promptText}>
            Upload a voice message to check for signs of fraud or manipulation.
          </Text>

          <View style={styles.filePickerContainer}>
            <TouchableOpacity style={styles.filePicker} onPress={pickAudioFile}>
              <Text style={styles.filePickerText}>
                {audioFile ? 'Change Audio File' : 'Select Audio File'}
              </Text>
            </TouchableOpacity>
            
            {audioFile && (
              <Text style={styles.selectedFileText}>
                Selected: {audioFile.name}
              </Text>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.checkButton, (!audioFile || loading) ? styles.disabledButton : null]} 
            onPress={handleCheckVoice}
            disabled={loading || !audioFile}
          >
            {loading ? (
              <ActivityIndicator color="#1A213B" size="small" /> 
            ) : (
              <Text style={styles.checkButtonText}>Check Voice Message</Text>
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
  filePickerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  filePicker: {
    backgroundColor: '#1C2434', // Secondary background for file picker
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#3a3a57', // Border for file picker
  },
  filePickerText: {
    color: '#A8C3D1', // Adjusted color
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedFileText: {
    color: '#A8C3D1', // Adjusted color
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
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
  warningText: {
    marginTop: 15,
    color: '#f0ad4e', // Warning accent color (orange)
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