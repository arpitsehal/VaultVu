// URLTheftCheckerScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Platform, ActivityIndicator, ScrollView, Modal, Pressable, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

// Enhanced URL analysis patterns and test examples
const URL_PATTERNS = {
  phishing: {
    keywords: ['paypal', 'amazon', 'microsoft', 'apple', 'google', 'facebook', 'instagram', 'twitter', 'linkedin', 'netflix', 'spotify'],
    suspiciousChars: ['-', '_', '0', '1', 'l', 'I'],
    commonTricks: ['paypaI', 'arnazon', 'microsft', 'goog1e', 'face-book', 'net-flix'],
    domains: ['.tk', '.ml', '.ga', '.cf', '.pw', '.top', '.click', '.download']
  },
  malware: {
    // Note: '.com' is a TLD, not an executable. Removed to avoid false positives like google.com
    extensions: ['.exe', '.scr', '.bat', '.pif', '.vbs', '.jar', '.cmd'],
    keywords: ['download', 'install', 'update', 'urgent', 'security', 'virus', 'antivirus'],
    suspiciousPaths: ['/download/', '/install/', '/update/', '/security/']
  },
  suspicious: {
    shorteners: ['bit.ly', 'tinyurl', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly'],
    ipAddresses: /^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
    ports: [':8080', ':3000', ':8000', ':8888', ':9999']
  }
};

const TEST_EXAMPLES = [
  {
    category: 'Safe URLs',
    icon: '✅',
    color: '#5cb85c',
    urls: [
      { url: 'https://www.google.com', description: 'Legitimate Google homepage' },
      { url: 'https://github.com/microsoft', description: 'Official Microsoft GitHub' },
      { url: 'https://stackoverflow.com/questions', description: 'Popular developer forum' }
    ]
  },
  {
    category: 'Phishing Examples',
    icon: '🎣',
    color: '#d9534f',
    urls: [
      { url: 'https://paypaI-security.com', description: 'Fake PayPal (note the capital I)' },
      { url: 'https://amazon-update.tk', description: 'Suspicious domain extension' },
      { url: 'https://microsft-support.net', description: 'Misspelled Microsoft' }
    ]
  },
  {
    category: 'Suspicious Patterns',
    icon: '⚠️',
    color: '#f0ad4e',
    urls: [
      { url: 'http://192.168.1.100:8080', description: 'Direct IP address with port' },
      { url: 'https://bit.ly/3xYzAbc', description: 'URL shortener (could hide destination)' },
      { url: 'https://urgent-security-update.download', description: 'Suspicious keywords and domain' }
    ]
  }
];

interface AnalysisDetails {
  phishingIndicators: string[];
  malwareIndicators: string[];
  suspiciousIndicators: string[];
  riskScore: number;
}

interface URLResult {
  isSafe: boolean;
  riskScore: number;
  category?: string;
  reasons?: string[];
  localAnalysis?: AnalysisDetails;
  combinedRiskScore?: number;
  isOfflineAnalysis?: boolean;
}

type ModalType = 'success' | 'error' | 'warning' | 'info';
interface ModalContent {
  title: string;
  message: string;
  type: ModalType;
}

export default function URLTheftCheckerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<URLResult | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>({ title: '', message: '', type: 'success' });
  const [showExamples, setShowExamples] = useState(false);
  const [analysisDetails, setAnalysisDetails] = useState<AnalysisDetails | null>(null);
  
  // Use the useLanguage hook to get translations
  const { translations } = useLanguage();

  const showModal = (title: string, message: string, type: ModalType = 'success') => {
    setModalContent({ title, message, type });
    setModalVisible(true);
  };

  // Enhanced pattern analysis function
  const analyzeUrlPatterns = (url: string): AnalysisDetails => {
    const analysis: AnalysisDetails = {
      phishingIndicators: [],
      malwareIndicators: [],
      suspiciousIndicators: [],
      riskScore: 0
    };

    const lowerUrl = url.toLowerCase();

    // Check for phishing patterns
    URL_PATTERNS.phishing.keywords.forEach(keyword => {
      if (lowerUrl.includes(keyword)) {
        // Check for common phishing tricks
        URL_PATTERNS.phishing.commonTricks.forEach(trick => {
          if (lowerUrl.includes(trick)) {
            analysis.phishingIndicators.push(`Suspicious spelling of "${keyword}" detected`);
            analysis.riskScore += 3;
          }
        });
        
        // Check for suspicious characters in brand names
        if (lowerUrl.includes(keyword + '-') || lowerUrl.includes(keyword + '_')) {
          analysis.phishingIndicators.push(`Brand name "${keyword}" with suspicious separators`);
          analysis.riskScore += 2;
        }
      }
    });

    // Check for suspicious domains
    URL_PATTERNS.phishing.domains.forEach(domain => {
      if (lowerUrl.includes(domain)) {
        analysis.phishingIndicators.push(`Suspicious domain extension: ${domain}`);
        analysis.riskScore += 2;
      }
    });

    // Check for malware indicators
    URL_PATTERNS.malware.extensions.forEach(ext => {
      if (lowerUrl.includes(ext)) {
        analysis.malwareIndicators.push(`Potentially dangerous file extension: ${ext}`);
        analysis.riskScore += 4;
      }
    });

    URL_PATTERNS.malware.keywords.forEach(keyword => {
      if (lowerUrl.includes(keyword)) {
        analysis.malwareIndicators.push(`Suspicious keyword: "${keyword}"`);
        analysis.riskScore += 1;
      }
    });

    // Check for suspicious patterns
    if (URL_PATTERNS.suspicious.ipAddresses.test(url)) {
      analysis.suspiciousIndicators.push('Direct IP address instead of domain name');
      analysis.riskScore += 3;
    }

    URL_PATTERNS.suspicious.shorteners.forEach(shortener => {
      if (lowerUrl.includes(shortener)) {
        analysis.suspiciousIndicators.push(`URL shortener detected: ${shortener}`);
        analysis.riskScore += 1;
      }
    });

    URL_PATTERNS.suspicious.ports.forEach(port => {
      if (url.includes(port)) {
        analysis.suspiciousIndicators.push(`Unusual port detected: ${port}`);
        analysis.riskScore += 2;
      }
    });

    return analysis;
  };

  const handleCheckUrl = async () => {
    if (!url) {
      showModal(translations.inputRequired || 'Input Required', (translations as any)['enterUrlMessage'] || 'Please enter a website URL to check.', 'error');
      return;
    }

    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlRegex.test(url)) {
      showModal(translations.invalidUrl || 'Invalid URL', (translations as any)['invalidUrlMessage'] || 'Please enter a valid website URL.', 'error');
      return;
    }

    setLoading(true);
    setResult(null);

    // Perform local pattern analysis
    const patternAnalysis = analyzeUrlPatterns(url);
    setAnalysisDetails(patternAnalysis);

    try {
      // Call existing backend URL check and Gemini URL analysis in parallel
      const classicUrl = 'https://vaultvu.onrender.com/api/url-check';
      const geminiUrl = 'https://vaultvu.onrender.com/api/gemini/url-analyze';

      const [classicRes, geminiRes] = await Promise.allSettled([
        fetch(classicUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, patternAnalysis }),
        }),
        fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urlToCheck: url, patternAnalysis }),
        }),
      ]);

      // Parse results if fulfilled
      const classicData =
        classicRes.status === 'fulfilled'
          ? await classicRes.value.json().catch(() => null)
          : null;
      const geminiData =
        geminiRes.status === 'fulfilled' && geminiRes.value.ok
          ? await geminiRes.value.json().catch(() => null)
          : null;

      // Derive aggregate fields
      const classicRisk = classicData?.riskScore || 0;
      const geminiRisk = geminiData?.riskScore || 0;
      const apiIsSafe = classicData?.isSafe !== undefined ? classicData.isSafe : geminiData?.isSafe;

      const combinedReasons = [
        ...(classicData?.reasons || []),
        ...(geminiData?.reasons || []),
      ];

      const combinedCategory = geminiData?.category || classicData?.category;

      const combinedRiskScore = Math.min(
        10,
        (classicRisk || 0) + (geminiRisk || 0) + Math.min(5, patternAnalysis.riskScore)
      );

      const combinedIsSafe = apiIsSafe !== undefined ? apiIsSafe : patternAnalysis.riskScore < 3;

      const combinedResult = {
        isSafe: combinedIsSafe,
        riskScore: Math.max(classicRisk, geminiRisk),
        category: combinedCategory,
        reasons: combinedReasons.length > 0 ? combinedReasons : undefined,
        localAnalysis: patternAnalysis,
        combinedRiskScore,
      } as URLResult;

      setResult(combinedResult);

      if (combinedResult.isSafe && patternAnalysis.riskScore < 3) {
        showModal(
          translations.checkComplete || 'Check Complete',
          translations.urlSafe || 'The URL appears safe to visit.',
          'success'
        );
      } else {
        showModal(
          translations.checkComplete || 'Check Complete',
          translations.potentialRisk || 'Potential risk detected. Exercise caution!',
          'warning'
        );
      }

    } catch (error) {
      console.error('Error checking URL:', error);
      
      // Fallback to local analysis only
      const localResult = {
        isSafe: patternAnalysis.riskScore < 3,
        riskScore: Math.min(10, patternAnalysis.riskScore),
        category: patternAnalysis.riskScore >= 5 ? 'High Risk' : patternAnalysis.riskScore >= 3 ? 'Medium Risk' : 'Low Risk',
        reasons: [
          ...patternAnalysis.phishingIndicators,
          ...patternAnalysis.malwareIndicators,
          ...patternAnalysis.suspiciousIndicators
        ],
        localAnalysis: patternAnalysis,
        isOfflineAnalysis: true
      };
      
      setResult(localResult);
      showModal('Offline Analysis', 'Using local pattern analysis. Internet connection may be limited.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const clearUrl = () => {
    setUrl('');
    setResult(null);
    setAnalysisDetails(null);
  };

  const clearPatterns = () => {
    setResult(null);
    setAnalysisDetails(null);
    showModal('Patterns Cleared', 'All analysis patterns and results have been cleared.', 'info');
  };

  const selectTestUrl = (testUrl: string) => {
    setUrl(testUrl);
    setShowExamples(false);
    setResult(null);
    setAnalysisDetails(null);
  };

  const renderExampleCard = (example: any, category: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={[styles.exampleCard, { borderColor: category.color }]}
      onPress={() => selectTestUrl(example.url)}
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
      <Text style={styles.exampleUrl} numberOfLines={1} ellipsizeMode="middle">
        {example.url}
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
            Learn fraud patterns by testing these sample URLs
          </Text>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.examplesScrollContainer}
          style={styles.examplesScrollView}
        >
          {TEST_EXAMPLES.map((category, categoryIndex) => (
            <View key={categoryIndex} style={styles.categorySection}>
              {category.urls.map((example, exampleIndex) => 
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

    const { isSafe, riskScore, reasons, category, localAnalysis, combinedRiskScore, isOfflineAnalysis } = result;
    const displayRiskScore = combinedRiskScore || riskScore;
    const resultColor = isSafe ? '#5cb85c' : '#d9534f';
    const borderColor = isSafe ? '#5cb85c' : '#d9534f';

    return (
      <View style={[styles.resultCard, { borderColor }]}>
        {isOfflineAnalysis && (
          <View style={styles.offlineIndicator}>
            <Ionicons name="wifi-outline" size={16} color="#f0ad4e" />
            <Text style={styles.offlineText}>Offline Analysis</Text>
          </View>
        )}
        
        <Text style={[styles.resultTitle, { color: resultColor }]}>
          {isSafe ? translations.urlSafe || 'URL appears safe to visit' : translations.potentialRiskDetected || 'Potential risk detected'}
        </Text>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>{translations.riskScore || 'Risk Score'}:</Text>
          <Text style={[styles.resultScore, { color: resultColor }]}>{displayRiskScore}/10</Text>
        </View>

        {category && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>{translations.category || 'Category'}:</Text>
            <Text style={[styles.categoryText, { color: resultColor }]}>{category}</Text>
          </View>
        )}

        {reasons && reasons.length > 0 && (
          <View style={styles.reasonsContainer}>
            <Text style={styles.reasonsTitle}>{translations.analysisDetails || 'Analysis details'}:</Text>
            {reasons.map((reason, index) => (
              <Text key={index} style={styles.reasonText}>• {reason}</Text>
            ))}
          </View>
        )}

        {localAnalysis && (
          <View style={styles.patternAnalysisContainer}>
            <Text style={styles.patternAnalysisTitle}>🔍 Pattern Analysis</Text>
            
            {localAnalysis.phishingIndicators.length > 0 && (
              <View style={styles.indicatorSection}>
                <Text style={[styles.indicatorTitle, { color: '#d9534f' }]}>🎣 Phishing Indicators:</Text>
                {localAnalysis.phishingIndicators.map((indicator, index) => (
                  <Text key={index} style={[styles.indicatorText, { color: '#d9534f' }]}>• {indicator}</Text>
                ))}
              </View>
            )}

            {localAnalysis.malwareIndicators.length > 0 && (
              <View style={styles.indicatorSection}>
                <Text style={[styles.indicatorTitle, { color: '#dc3545' }]}>🦠 Malware Indicators:</Text>
                {localAnalysis.malwareIndicators.map((indicator, index) => (
                  <Text key={index} style={[styles.indicatorText, { color: '#dc3545' }]}>• {indicator}</Text>
                ))}
              </View>
            )}

            {localAnalysis.suspiciousIndicators.length > 0 && (
              <View style={styles.indicatorSection}>
                <Text style={[styles.indicatorTitle, { color: '#f0ad4e' }]}>⚠️ Suspicious Patterns:</Text>
                {localAnalysis.suspiciousIndicators.map((indicator, index) => (
                  <Text key={index} style={[styles.indicatorText, { color: '#f0ad4e' }]}>• {indicator}</Text>
                ))}
              </View>
            )}
          </View>
        )}
        
        {!isSafe && (
          <View style={styles.warningContainer}>
            <AntDesign name="warning" size={20} color="#f0ad4e" style={{ marginRight: 8 }} />
            <Text style={styles.warningText}>
              {translations.urlWarningText || 'This URL shows signs of potential phishing, malware, or fraud. Proceed with extreme caution.'}
            </Text>
          </View>
        )}
      </View>
    );
  };
  
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
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#1A213B" 
        translucent={Platform.OS === 'android'}
      />

      <View style={[
        styles.headerContainer, 
        { 
          paddingTop: Platform.OS === 'android' ? Math.max(insets.top, 20) : 0,
          minHeight: Platform.OS === 'android' ? 60 : 50
        }
      ]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#A8C3D1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit>
          {translations.urlSafetyChecker || 'URL Safety Checker'}
        </Text>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.screenTitleContainer}>
        <AntDesign name="link" size={40} color="#A8C3D1" style={{ marginRight: 10 }} />
        <Text style={styles.screenSubtitle}>{translations.verifyWebsiteSafety || 'Verify website safety & detect threats'}</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <View style={[styles.contentContainer, Platform.OS === 'android' && styles.androidContentContainer]}>
          <Text style={styles.promptText}>
            {translations.urlPrompt || 'Enter a website URL to analyze for potential security threats, phishing attempts, and malicious content.'}
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={translations.enterUrlPlaceholder || "https://example.com"}
              placeholderTextColor="#A8C3D1"
              value={url}
              onChangeText={setUrl}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {url.length > 0 && (
              <TouchableOpacity onPress={clearUrl} style={styles.clearButton}>
                <AntDesign name="close" size={20} color="#A8C3D1" />
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
              <Text style={styles.checkButtonText}>{translations.analyzeWebsiteSafety || 'Analyze Website Safety'}</Text>
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
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1C2434',
    color: '#A8C3D1',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingRight: 50,
    fontSize: 16,
    width: '100%',
    borderWidth: 2,
    borderColor: '#3a3a57',
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -10 }],
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
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryLabel: {
    fontSize: 16,
    color: '#A8C3D1',
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
    color: '#A8C3D1',
    marginBottom: 5,
  },
  reasonText: {
    fontSize: 14,
    color: '#A8C3D1',
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
  categoryTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
  },
  exampleItem: {
    backgroundColor: '#1A213B',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#A8C3D1',
  },
  exampleUrl: {
    color: '#A8C3D1',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  exampleDescription: {
    color: '#8A9BAE',
    fontSize: 12,
    lineHeight: 16,
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
  // Pattern Analysis Styles
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(240, 173, 78, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#f0ad4e',
  },
  offlineText: {
    color: '#f0ad4e',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  patternAnalysisContainer: {
    backgroundColor: '#2A3B5C',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#3D4F73',
  },
  patternAnalysisTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  indicatorSection: {
    marginBottom: 10,
  },
  indicatorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  indicatorText: {
    fontSize: 12,
    marginBottom: 3,
    marginLeft: 10,
    lineHeight: 16,
  },
  // Android-specific styles
  androidContentContainer: {
    paddingBottom: 30,
    minHeight: '100%',
  },
  // Professional Test Examples Styles
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
});