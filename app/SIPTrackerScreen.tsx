// SIPTrackerScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Platform, TextInput, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

export default function SIPTrackerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();
  
  // State for SIP calculator
  const [monthlyInvestment, setMonthlyInvestment] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [sipResult, setSipResult] = useState(null);
  
  // Calculate SIP returns
  const calculateSIP = () => {
    const investment = parseFloat(monthlyInvestment);
    const returnRate = parseFloat(expectedReturn) / 100;
    const months = parseFloat(timePeriod) * 12;
    
    if (investment && returnRate && months) {
      const monthlyRate = returnRate / 12;
      const futureValue = investment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      const totalInvestment = investment * months;
      const estimatedReturns = futureValue - totalInvestment;
      
      setSipResult({
        futureValue: futureValue.toFixed(2),
        totalInvestment: totalInvestment.toFixed(2),
        estimatedReturns: estimatedReturns.toFixed(2)
      });
    }
  };
  
  // Reset calculator
  const resetCalculator = () => {
    setMonthlyInvestment('');
    setExpectedReturn('');
    setTimePeriod('');
    setSipResult(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />

      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#A8C3D1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{translations.sipTracker || 'SIP Tracker & Calculator'}</Text>
        <View style={{ width: 40 }} /> {/* Spacer to balance header title */}
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>{translations.calculateSIP || 'Calculate SIP Returns'}</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{translations.sipMonthlyInvestment || 'Monthly Investment (₹)'}</Text>
              <TextInput
                style={styles.input}
                value={monthlyInvestment}
                onChangeText={setMonthlyInvestment}
                keyboardType="numeric"
                placeholder={translations.sipMonthlyInvestmentPlaceholder || "e.g. 5000"}
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{translations.sipExpectedReturn || 'Expected Annual Return (%)'}</Text>
              <TextInput
                style={styles.input}
                value={expectedReturn}
                onChangeText={setExpectedReturn}
                keyboardType="numeric"
                placeholder={translations.sipExpectedReturnPlaceholder || "e.g. 12"}
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{translations.sipTimePeriod || 'Time Period (years)'}</Text>
              <TextInput
                style={styles.input}
                value={timePeriod}
                onChangeText={setTimePeriod}
                keyboardType="numeric"
                placeholder={translations.sipTimePeriodPlaceholder || "e.g. 10"}
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.calculateButton} onPress={calculateSIP}>
                <Text style={styles.calculateButtonText}>{translations.calculate || 'Calculate'}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.resetButton} onPress={resetCalculator}>
                <Text style={styles.resetButtonText}>{translations.reset || 'Reset'}</Text>
              </TouchableOpacity>
            </View>
            
            {sipResult && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>{translations.sipResults || 'SIP Results'}</Text>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{translations.futureValue || 'Future Value:'}</Text>
                  <Text style={styles.resultValue}>₹ {sipResult.futureValue}</Text>
                </View>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{translations.totalInvestment || 'Total Investment:'}</Text>
                  <Text style={styles.resultValue}>₹ {sipResult.totalInvestment}</Text>
                </View>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{translations.estimatedReturns || 'Estimated Returns:'}</Text>
                  <Text style={styles.resultValue}>₹ {sipResult.estimatedReturns}</Text>
                </View>
              </View>
            )}
            
            <Text style={styles.disclaimer}>
              {translations.sipDisclaimer || 'Note: This calculator provides an estimate. Actual returns may vary based on market conditions and fund performance.'}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flexShrink: 1,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A8C3D1',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  calculateButton: {
    backgroundColor: '#A8C3D1',
    borderRadius: 8,
    padding: 15,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: '#1A213B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 15,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
  },
  resultContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A8C3D1',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 16,
    color: 'white',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A8C3D1',
  },
  disclaimer: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
});
