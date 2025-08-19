import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  StatusBar, 
  ScrollView, 
  Platform, 
  TextInput, 
  KeyboardAvoidingView,
  Animated,
  Dimensions,
  Vibration,
  Alert
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

// Enhanced Input component with floating label and animation
const EnhancedInput = React.memo(({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  keyboardType, 
  icon, 
  suffix,
  inputKey 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  
  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: (isFocused || value) ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);
  
  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  
  return (
    <View style={styles.inputWrapper}>
      <Animated.View style={[
        styles.inputContainer,
        {
          borderColor: borderAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(255,255,255,0.2)', '#60A5FA'],
          }),
          shadowOpacity: borderAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.3],
          }),
          transform: [{
            scale: borderAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.02],
            })
          }]
        }
      ]}>
        <LinearGradient
          colors={isFocused ? ['rgba(96,165,250,0.1)', 'rgba(96,165,250,0.05)'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          style={styles.inputGradient}
        >
          <View style={styles.inputContent}>
            <View style={styles.inputIconContainer}>
              <Feather 
                name={icon} 
                size={20} 
                color={isFocused ? '#60A5FA' : 'rgba(255,255,255,0.6)'} 
              />
            </View>
            
            <View style={styles.inputFieldContainer}>
              <Animated.Text style={[
                styles.floatingLabel,
                {
                  opacity: labelAnim,
                  transform: [{
                    translateY: labelAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -8],
                    })
                  }],
                  color: isFocused ? '#60A5FA' : 'rgba(255,255,255,0.7)',
                }
              ]}>
                {label}
              </Animated.Text>
              
              <TextInput
                style={[
                  styles.enhancedInput,
                  { marginTop: (isFocused || value) ? 8 : 0 }
                ]}
                value={value}
                onChangeText={onChangeText}
                onFocus={handleFocus}
                onBlur={handleBlur}
                keyboardType={keyboardType}
                placeholder={!isFocused && !value ? placeholder : ''}
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
            </View>
            
            {suffix && (
              <View style={styles.inputSuffix}>
                <Text style={styles.suffixText}>{suffix}</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
});

// Result card component
type ResultCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
};

const ResultCard: React.FC<ResultCardProps> = ({ title, value, subtitle, icon, color }) => {
  const cardScale = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.spring(cardScale, {
      toValue: 1,
      tension: 50,
      friction: 7,
      delay: Math.random() * 200,
      useNativeDriver: true,
    }).start();
  }, []);
  
  return (
    <Animated.View style={[
      styles.resultCard,
      { transform: [{ scale: cardScale }] }
    ]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
        style={styles.resultCardGradient}
      >
        <View style={styles.resultCardHeader}>
          <View style={[styles.resultIconContainer, { backgroundColor: color + '20' }]}>
            <MaterialCommunityIcons name={icon} size={24} color={color} />
          </View>
          <Text style={styles.resultCardTitle}>{title}</Text>
        </View>
        
        <Text style={[styles.resultCardValue, { color }]}>₹{value}</Text>
        
        {subtitle && (
          <Text style={styles.resultCardSubtitle}>{subtitle}</Text>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

export default function SIPTrackerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const resultScaleAnim = useRef(new Animated.Value(0)).current;
  
  // Types
  type SIPResult = {
    futureValue: string;
    totalInvestment: string;
    estimatedReturns: string;
  };

  // State for SIP calculator
  const [monthlyInvestment, setMonthlyInvestment] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [sipResult, setSipResult] = useState<SIPResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Haptic feedback helper
  const triggerHaptic = (type = 'light') => {
    if (Platform.OS === 'ios') {
      switch (type) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'error':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    } else {
      Vibration.vibrate(50);
    }
  };
  
  // Entrance animations
  useFocusEffect(
    React.useCallback(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
      
      return () => {
        fadeAnim.setValue(0);
        slideAnim.setValue(50);
        scaleAnim.setValue(0.95);
        resultScaleAnim.setValue(0);
        progressAnim.setValue(0);
      };
    }, [])
  );
  
  // Calculate SIP returns
  const calculateSIP = () => {
    const investment = parseFloat(monthlyInvestment);
    const returnRate = parseFloat(expectedReturn) / 100;
    const years = parseFloat(timePeriod);
    const months = years * 12;

    if (!investment || !returnRate || !years) {
      triggerHaptic('error');
      Alert.alert('Error', translations.sipEnterDetails || 'Please enter all investment details.');
      return;
    }
    
    if (investment <= 0 || returnRate <= 0 || years <= 0) {
      triggerHaptic('error');
      Alert.alert('Error', translations.sipPositiveDetails || 'Investment details must be positive numbers.');
      return;
    }

    setIsCalculating(true);
    triggerHaptic('medium');

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      const monthlyRate = returnRate / 12;
      const futureValue = investment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      const totalInvestment = investment * months;
      const estimatedReturns = futureValue - totalInvestment;
      
      setSipResult({
        futureValue: futureValue.toFixed(2),
        totalInvestment: totalInvestment.toFixed(2),
        estimatedReturns: estimatedReturns.toFixed(2)
      });
      
      setIsCalculating(false);
      triggerHaptic('success');
      
      Animated.spring(resultScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }, 1500);
  };
  
  // Reset calculator
  const resetCalculator = () => {
    triggerHaptic('light');

    progressAnim.setValue(0);
    resultScaleAnim.setValue(0);

    setMonthlyInvestment('');
    setExpectedReturn('');
    setTimePeriod('');
    setSipResult(null);
    setIsCalculating(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" translucent />

      {/* Enhanced Header */}
      <LinearGradient
        colors={['#0F172A', '#1E293B']}
        style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top + 10 : 10 }]}
      >
        <TouchableOpacity 
          onPress={() => {
            triggerHaptic('light');
            navigation.goBack();
          }} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <View style={styles.backButtonBackground}>
            <AntDesign name="arrowleft" size={24} color="#A8C3D1" />
          </View>
        </TouchableOpacity>
        
        <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
          <Text style={styles.headerTitle}>{translations.sipTracker || 'SIP Tracker & Calculator'}</Text>
          <Text style={styles.headerSubtitle}>{translations.sipTrackerSubtitle || ''}</Text>
        </Animated.View>
        
        <View style={styles.rightSpacer} />
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Animated.View style={[
          { flex: 1 },
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            bounces={true}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.contentContainer}>
              {/* Calculator Card */}
              <Animated.View style={[
                styles.calculatorCard,
                { transform: [{ scale: scaleAnim }] }
              ]}>
                <LinearGradient
                  colors={['rgba(168,195,209,0.15)', 'rgba(168,195,209,0.05)']}
                  style={styles.calculatorGradient}
                >
                  <View style={styles.calculatorHeader}>
                    <MaterialCommunityIcons name="finance" size={28} color="#4ADE80" />
                    <Text style={styles.calculatorTitle}>{translations.calculateSIP || 'Calculate SIP Returns'}</Text>
                  </View>
                  
                  <View style={styles.inputSection}>
                    <EnhancedInput
                      label={translations.sipMonthlyInvestment || 'Monthly Investment (₹)'}
                      value={monthlyInvestment}
                      onChangeText={setMonthlyInvestment}
                      placeholder={translations.sipMonthlyInvestmentPlaceholder || "e.g. 5000"}
                      keyboardType="numeric"
                      icon="dollar-sign"
                      suffix="₹"
                      inputKey="investment"
                    />
                    
                    <EnhancedInput
                      label={translations.sipExpectedReturn || 'Expected Annual Return (%)'}
                      value={expectedReturn}
                      onChangeText={setExpectedReturn}
                      placeholder={translations.sipExpectedReturnPlaceholder || "e.g. 12"}
                      keyboardType="numeric"
                      icon="percent"
                      suffix="% p.a."
                      inputKey="return"
                    />
                    
                    <EnhancedInput
                      label={translations.sipTimePeriod || 'Time Period (years)'}
                      value={timePeriod}
                      onChangeText={setTimePeriod}
                      placeholder={translations.sipTimePeriodPlaceholder || "e.g. 10"}
                      keyboardType="numeric"
                      icon="clock"
                      suffix="years"
                      inputKey="time"
                    />
                  </View>
                  
                  {/* Progress Bar for Calculation */}
                  {isCalculating && (
                    <View style={styles.progressContainer}>
                      <Text style={styles.progressText}>
                        {translations.calculating || 'Calculating...'}
                      </Text>
                      <View style={styles.progressBarBackground}>
                        <Animated.View style={[
                          styles.progressBarFill,
                          {
                            width: progressAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', '100%'],
                            })
                          }
                        ]}>
                          <LinearGradient
                            colors={['#4ADE80', '#22C55E']}
                            style={styles.progressGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          />
                        </Animated.View>
                      </View>
                    </View>
                  )}
                  
                  {/* Action Buttons */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.calculateButton]}
                      onPress={calculateSIP}
                      disabled={isCalculating || !monthlyInvestment || !expectedReturn || !timePeriod}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={isCalculating || !monthlyInvestment || !expectedReturn || !timePeriod
                          ? ['rgba(74,222,128,0.3)', 'rgba(34,197,94,0.3)'] 
                          : ['#4ADE80', '#22C55E']}
                        style={styles.buttonGradient}
                      >
                        <MaterialCommunityIcons 
                          name={isCalculating ? "loading" : "rocket-launch"} 
                          size={20} 
                          color="white" 
                        />
                        <Text style={styles.calculateButtonText}>
                          {isCalculating ? translations.calculating || 'Calculating...' : (translations.calculate || 'Calculate')}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.resetButton]}
                      onPress={resetCalculator}
                      activeOpacity={0.8}
                    >
                      <View style={styles.resetButtonContent}>
                        <Feather name="refresh-cw" size={18} color="#94A3B8" />
                        <Text style={styles.resetButtonText}>{translations.reset || 'Reset'}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </Animated.View>
              
              {/* Results Section */}
              {sipResult && (
                <Animated.View style={[
                  styles.resultsSection,
                  { 
                    opacity: fadeAnim,
                    transform: [{ scale: resultScaleAnim }]
                  }
                ]}>
                  <View style={styles.resultsSectionHeader}>
                    <MaterialCommunityIcons name="chart-line" size={24} color="#60A5FA" />
                    <Text style={styles.resultsSectionTitle}>{translations.sipResults || 'SIP Results'}</Text>
                  </View>
                  
                  <View style={styles.resultsGrid}>
                    <ResultCard
                      title={translations.futureValue || "Future Value"}
                      value={sipResult.futureValue}
                      icon="sack"
                      color="#4ADE80"
                    />
                    
                    <ResultCard
                      title={translations.totalInvestment || "Total Investment"}
                      value={sipResult.totalInvestment}
                      icon="cash"
                      color="#60A5FA"
                    />
                    
                    <ResultCard
                      title={translations.estimatedReturns || "Estimated Returns"}
                      value={sipResult.estimatedReturns}
                      icon="trending-up"
                      color="#F59E0B"
                    />
                  </View>
                </Animated.View>
              )}
              
              {/* Disclaimer */}
              <View style={styles.disclaimerContainer}>
                <LinearGradient
                  colors={['rgba(251,146,60,0.1)', 'rgba(251,146,60,0.05)']}
                  style={styles.disclaimerGradient}
                >
                  <View style={styles.disclaimerHeader}>
                    <Feather name="alert-triangle" size={16} color="#FB923C" />
                    <Text style={styles.disclaimerTitle}>{translations.importantNote || 'Important Note'}</Text>
                  </View>
                  <Text style={styles.disclaimerText}>
                    {translations.sipDisclaimer || 'Note: This calculator provides an estimate. Actual returns may vary based on market conditions and fund performance.'}
                  </Text>
                </LinearGradient>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  backButtonBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(168,195,209,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  rightSpacer: {
    width: 40,
    height: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  calculatorCard: {
    marginBottom: 30,
  },
  calculatorGradient: {
    borderRadius: 20,
    padding: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  calculatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  calculatorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputContainer: {
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  inputGradient: {
    padding: 16,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  inputFieldContainer: {
    flex: 1,
    position: 'relative',
  },
  floatingLabel: {
    fontSize: 12,
    fontWeight: '600',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  enhancedInput: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    padding: 0,
    minHeight: 24,
  },
  inputSuffix: {
    marginLeft: 8,
  },
  suffixText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    color: '#60A5FA',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressGradient: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  calculateButton: {
    elevation: 4,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  resetButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  resetButtonText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsSection: {
    marginBottom: 30,
  },
  resultsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultsSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  resultsGrid: {
    gap: 16,
    marginBottom: 24,
  },
  resultCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  resultCardGradient: {
    padding: 20,
  },
  resultCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultCardTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  resultCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultCardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  chartContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  chartGradient: {
    padding: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  chartContent: {
    alignItems: 'center',
  },
  chartLegend: {
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    color: 'white',
    fontSize: 14,
  },
  disclaimerContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 20,
  },
  disclaimerGradient: {
    padding: 20,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FB923C',
    marginLeft: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
   },
});