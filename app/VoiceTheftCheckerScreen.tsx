// VoiceTheftCheckerScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function VoiceTheftCheckerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      // Updated to handle the new API response format
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAudioFile(result.assets[0]);
        setResult(null); // Clear previous results
      }
    } catch (error) {
      console.error('Error picking audio file:', error);
      Alert.alert('Error', 'Could not select the audio file. Please try again.');
    }
  };

  const handleCheckVoice = async () => {
    if (!audioFile) {
      Alert.alert('Error', 'Please select an audio file to check.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Read the file as base64
      const fileBase64 = await FileSystem.readAsStringAsync(audioFile.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Call our backend API
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
    } catch (error) {
      console.error('Error checking voice message:', error);
      Alert.alert('Error', 'Could not check the voice message. Please try again.');
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
          {isGenuine ? 'Voice message appears genuine' : 'Potential fraud detected'}
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
            Be cautious! This voice message shows signs of potential fraud or manipulation.
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
        <Text style={styles.headerTitle}>Voice Theft Checker</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
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
    paddingVertical: 40,
  },
  promptText: {
    fontSize: 18,
    color: 'white',
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
    backgroundColor: '#444D62',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  filePickerText: {
    color: 'white',
    fontSize: 16,
  },
  selectedFileText: {
    color: '#A8C3D1',
    fontSize: 14,
    textAlign: 'center',
  },
  checkButton: {
    backgroundColor: '#A8C3D1',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
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
    textAlign: 'center',
    marginBottom: 10,
  },
  resultScore: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    marginBottom: 15,
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
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});