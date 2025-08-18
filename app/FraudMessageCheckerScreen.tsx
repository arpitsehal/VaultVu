// FraudMessageCheckerScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Platform, ActivityIndicator, ScrollView, Modal, Pressable, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext'; // Import the useLanguage hook

// Message fraud test examples
const MESSAGE_TEST_EXAMPLES = [
  {
    category: 'Safe Messages',
    icon: '✅',
    color: '#5cb85c',
    messages: [
      { message: 'Hi! How are you doing today? Would love to catch up soon.', description: 'Normal friendly message' },
      { message: 'Meeting scheduled for 3 PM tomorrow in conference room B.', description: 'Legitimate business communication' },
      { message: 'Your order #12345 has been shipped and will arrive in 2-3 days.', description: 'Genuine delivery notification' }
    ]
  },
  {
    category: 'Phishing Messages',
    icon: '🎣',
    color: '#d9534f',
    messages: [
      { message: 'URGENT: Your bank account will be closed! Click here immediately to verify: bit.ly/bank-verify', description: 'Fake urgency with suspicious link' },
      { message: 'Congratulations! You won $50,000! Send your SSN and bank details to claim your prize now!', description: 'Too-good-to-be-true lottery scam' },
      { message: 'Your PayPal account has been limited. Verify now or lose access: paypal-security.tk/verify', description: 'Fake security alert with suspicious domain' }
    ]
  },
  {
    category: 'Suspicious Patterns',
    icon: '⚠️',
    color: '#f0ad4e',
    messages: [
      { message: 'Act fast! Limited time offer expires in 1 hour. Send $99 now to secure your spot!', description: 'High-pressure sales tactics' },
      { message: 'Hello dear, I am Prince of Nigeria. I need your help to transfer $10 million...', description: 'Classic advance fee fraud' },
      { message: 'Your package is held at customs. Pay $25 fee immediately or it will be returned.', description: 'Fake delivery fee scam' }
    ]
  }
];

type ModalType = 'success' | 'error' | 'warning' | 'info';

export default function FraudMessageCheckerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showExamples, setShowExamples] = useState(false);

  // State for the custom modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; message: string; type: ModalType }>({ title: '', message: '', type: 'success' });
  
  // Use the useLanguage hook to get translations
  const { translations } = useLanguage();

  // Function to show the custom modal
  const showModal = (title: string, message: string, type: ModalType = 'success') => {
    setModalContent({ title, message, type });
    setModalVisible(true);
  };

  const clearPatterns = () => {
    setResult(null);
    showModal('Patterns Cleared', 'All analysis patterns and results have been cleared.', 'info');
  };

  const selectTestMessage = (testMessage: string) => {
    setMessage(testMessage);
    setShowExamples(false);
    setResult(null);
  };

  const handleCheckMessage = async () => {
    if (!message) {
      showModal(translations.inputRequired || 'Input Required', translations.enterMessageToCheck || 'Please enter a message to check.', 'error');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Call our backend API
      const apiUrl = 'https://vaultvu.onrender.com/api/message-check';
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
        showModal(translations.checkComplete || 'Check Complete', translations.messageGenuine || 'The message appears genuine.', 'success');
      } else {
        showModal(translations.checkComplete || 'Check Complete', translations.potentialFraud || 'Potential fraud detected. Be cautious!', 'warning');
      }
    } catch (error) {
      console.error('Error checking message:', error);
      showModal(
        translations.apiError || 'API Error',
        translations.apiConnectionError || 'Could not check the message. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderExampleCard = (example: any, category: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={[styles.exampleCard, { borderColor: category.color }]}
      onPress={() => selectTestMessage(example.message)}
      activeOpacity={0.7}
    >
      <View style={styles.exampleHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
          <Text style={styles.categoryBadgeText}>{category.icon}</Text>
        </View>
        <Text style={[styles.exampleStatus, { color: category.color }]} numberOfLines={1}>
          {category.category}
        </Text>
      </View>
      <Text style={styles.exampleMessage} numberOfLines={3} ellipsizeMode="tail">
        {example.message}
      </Text>
      <Text style={styles.exampleDescription} numberOfLines={2}>
        {example.description}
      </Text>
      <View style={styles.tapHint}>
        <Ionicons name="hand-left-outline" size={12} color="#A8C3D1" />
        <Text style={styles.tapHintText}>Tap to test</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTestExamples = () => {
    return (
      <View style={styles.examplesContainer}>
        <View style={styles.examplesHeader}>
          <View style={styles.examplesTitleContainer}>
            <Ionicons name="flask" size={24} color="#A8C3D1" />
            <Text style={styles.examplesTitle}>Test Examples</Text>
          </View>
          <Text style={styles.examplesSubtitle}>
            Learn fraud patterns by testing these sample messages
          </Text>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.examplesScrollContainer}
          style={styles.examplesScrollView}
        >
          {MESSAGE_TEST_EXAMPLES.map((category, categoryIndex) => (
            <View key={categoryIndex} style={styles.categorySection}>
              {category.messages.map((example, exampleIndex) => 
                renderExampleCard(example, category, exampleIndex)
              )}
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.examplesFooter}>
          <TouchableOpacity
            style={styles.clearPatternsButton}
            onPress={clearPatterns}
          >
            <Ionicons name="refresh-outline" size={16} color="#f0ad4e" />
            <Text style={styles.clearPatternsText}>Clear Patterns</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.hideExamplesButton}
            onPress={() => setShowExamples(false)}
          >
            <Ionicons name="chevron-up" size={16} color="#A8C3D1" />
            <Text style={styles.hideExamplesText}>Hide Examples</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderResult = () => {
    if (!result) return null;

    const { isGenuine, riskScore, combinedRiskScore, reasons, category, isOfflineAnalysis, localAnalysis } = result as any;
    const displayRisk = typeof combinedRiskScore === 'number' ? combinedRiskScore : riskScore;
    const resultColor = isGenuine ? '#5cb85c' : '#d9534f'; // Green for genuine, Red for fraud
    const borderColor = isGenuine ? '#5cb85c' : '#d9534f'; // Border color matches result status
    
    return (
      <View style={[styles.resultCard, { borderColor }]}>
        {isOfflineAnalysis && (
          <View style={styles.offlineIndicator}>
            <Ionicons name="wifi-outline" size={16} color="#f0ad4e" />
            <Text style={styles.offlineText}>Offline Analysis</Text>
          </View>
        )}

        <Text style={[styles.resultTitle, { color: resultColor }]}>
          {isGenuine
            ? translations.messageGenuine || 'Message appears genuine'
            : translations.potentialFraud || 'Potential fraud detected'}
        </Text>

        {category && (
          <View style={styles.categoryBadgeRow}>
            <Text style={styles.resultCategoryBadgeText}>{String(category)}</Text>
          </View>
        )}
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>{translations.riskScore || 'Risk Score'}:</Text>
          <Text style={[styles.resultScore, { color: resultColor }]}>{displayRisk}/10</Text>
        </View>
        
        {reasons && reasons.length > 0 && (
          <View style={styles.reasonsContainer}>
            <Text style={styles.reasonsTitle}>{translations.reasonsTitle || 'Reasons for the score:'}</Text>
            {reasons.map((reason: string, index: number) => (
              <Text key={index} style={styles.reasonText}>• {reason}</Text>
            ))}
          </View>
        )}

        {localAnalysis && (localAnalysis.patterns || localAnalysis.indicators) && (
          <View style={styles.localAnalysisContainer}>
            <Text style={styles.localAnalysisTitle}>Local Analysis Highlights</Text>
            {(localAnalysis.patterns || localAnalysis.indicators || []).slice(0, 5).map((it: string, idx: number) => (
              <Text key={idx} style={styles.localAnalysisItem}>• {it}</Text>
            ))}
          </View>
        )}
        
        {!isGenuine && (
          <Text style={styles.warningText}>
            {translations.messageWarningText || 'Be cautious! This message shows signs of potential fraud or scam.'}
          </Text>
        )}
      </View>
    );
  };

  // Helper function to get the appropriate icon for the modal
  const getModalIcon = (type: ModalType) => {
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
        <Text style={styles.headerTitle}>{translations.messageFraudChecker || 'Message Fraud Checker'}</Text>
        <View style={{ width: 40 }} /> {/* Spacer for symmetry */}
      </View>

      {/* Screen Title and Subtitle with Icon */}
      <View style={styles.screenTitleContainer}>
        <AntDesign name="message1" size={40} color="#A8C3D1" style={{ marginRight: 10 }} />
        <Text style={styles.screenSubtitle}>{translations.analyzeMessages || 'Analyze messages for fraudulent content'}</Text>
      </View>

      {/* Main Content Area (Scrollable) */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.promptText}>
          {translations.messagePrompt || 'Enter a message to check for potential fraud or scam content.'}
        </Text>

        {/* Message Input Field */}
        <TextInput
          style={styles.input}
          placeholder={translations.pasteMessagePlaceholder || "Paste message text here"}
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
            <Text style={styles.checkButtonText}>{translations.checkMessage || 'Check Message'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.examplesToggleButton}
          onPress={() => setShowExamples(!showExamples)}
        >
          <Ionicons 
            name={showExamples ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#A8C3D1" 
            style={{ marginRight: 8 }}
          />
          <Text style={styles.examplesToggleText}>
            {showExamples ? 'Hide Test Examples' : 'Show Test Examples'}
          </Text>
        </TouchableOpacity>

        {showExamples && renderTestExamples()}
        
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
    backgroundColor: '#1C2434',
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
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(240, 173, 78, 0.1)',
    borderColor: '#f0ad4e',
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  offlineText: {
    color: '#f0ad4e',
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  categoryBadgeRow: {
    alignSelf: 'center',
    backgroundColor: '#2A3B5C',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  resultCategoryBadgeText: {
    color: '#A8C3D1',
    fontSize: 12,
    fontWeight: '600',
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
  localAnalysisContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  localAnalysisTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A8C3D1',
    marginBottom: 6,
  },
  localAnalysisItem: {
    fontSize: 13,
    color: '#A8C3D1',
    marginBottom: 4,
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
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Professional Test Examples Styles
  examplesToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A3B5C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#3D4F73',
  },
  examplesToggleText: {
    color: '#A8C3D1',
    fontSize: 16,
    fontWeight: '500',
  },
  examplesContainer: {
    backgroundColor: '#2A3B5C',
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#3D4F73',
  },
  examplesTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  examplesSubtitle: {
    color: '#A8C3D1',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  exampleCard: {
    backgroundColor: '#1A213B',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 280,
    borderWidth: 1,
    borderColor: '#3D4F73',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  categoryBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  exampleStatus: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  exampleMessage: {
    color: '#A8C3D1',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 18,
  },
  exampleDescription: {
    color: '#8A9BAE',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    opacity: 0.7,
  },
  tapHintText: {
    color: '#A8C3D1',
    fontSize: 11,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  examplesHeader: {
    marginBottom: 16,
  },
  examplesTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  examplesScrollContainer: {
    paddingHorizontal: 4,
  },
  examplesScrollView: {
    maxHeight: 200,
  },
  categorySection: {
    flexDirection: 'row',
  },
  examplesFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#3D4F73',
  },
  clearPatternsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(240, 173, 78, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f0ad4e',
  },
  clearPatternsText: {
    color: '#f0ad4e',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  hideExamplesButton: {
    backgroundColor: '#3D4F73',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 15,
    alignSelf: 'center',
  },
  hideExamplesText: {
    color: '#A8C3D1',
    fontSize: 14,
    fontWeight: '500',
  },
});