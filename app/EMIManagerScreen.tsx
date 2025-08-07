// EMIManagerScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Platform, TextInput, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

export default function EMIManagerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();
  
  // State for EMI calculator
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTenure, setLoanTenure] = useState('');
  const [emiResult, setEmiResult] = useState(null);
  
  // Calculate EMI
  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const ratePerMonth = parseFloat(interestRate) / (12 * 100);
    const time = parseFloat(loanTenure) * 12;
    
    if (principal && ratePerMonth && time) {
      const emi = principal * ratePerMonth * Math.pow(1 + ratePerMonth, time) / (Math.pow(1 + ratePerMonth, time) - 1);
      const totalAmount = emi * time;
      const totalInterest = totalAmount - principal;
      
      setEmiResult({
        monthlyEMI: emi.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        totalInterest: totalInterest.toFixed(2)
      });
    }
  };
  
  // Reset calculator
  const resetCalculator = () => {
    setLoanAmount('');
    setInterestRate('');
    setLoanTenure('');
    setEmiResult(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />

      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#A8C3D1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{translations.emiCalculator || 'EMI Calculator & Manager'}</Text>
        <View style={{ width: 40 }} /> {/* Spacer to balance header title */}
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>{translations.calculateEMI || 'Calculate EMI'}</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{translations.loanAmount || 'Loan Amount (₹)'}</Text>
              <TextInput
                style={styles.input}
                value={loanAmount}
                onChangeText={setLoanAmount}
                keyboardType="numeric"
                placeholder="e.g. 100000"
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{translations.interestRate || 'Interest Rate (% per annum)'}</Text>
              <TextInput
                style={styles.input}
                value={interestRate}
                onChangeText={setInterestRate}
                keyboardType="numeric"
                placeholder="e.g. 10.5"
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{translations.loanTenure || 'Loan Tenure (years)'}</Text>
              <TextInput
                style={styles.input}
                value={loanTenure}
                onChangeText={setLoanTenure}
                keyboardType="numeric"
                placeholder="e.g. 5"
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.calculateButton} onPress={calculateEMI}>
                <Text style={styles.calculateButtonText}>{translations.calculate || 'Calculate'}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.resetButton} onPress={resetCalculator}>
                <Text style={styles.resetButtonText}>{translations.reset || 'Reset'}</Text>
              </TouchableOpacity>
            </View>
            
            {emiResult && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>{translations.emiResults || 'EMI Results'}</Text>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{translations.monthlyEMI || 'Monthly EMI:'}</Text>
                  <Text style={styles.resultValue}>₹ {emiResult.monthlyEMI}</Text>
                </View>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{translations.totalAmount || 'Total Amount:'}</Text>
                  <Text style={styles.resultValue}>₹ {emiResult.totalAmount}</Text>
                </View>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{translations.totalInterest || 'Total Interest:'}</Text>
                  <Text style={styles.resultValue}>₹ {emiResult.totalInterest}</Text>
                </View>
              </View>
            )}
            
            <Text style={styles.disclaimer}>
              {translations.emiDisclaimer || 'Note: This calculator provides an estimate. Actual EMI may vary based on bank policies and loan terms.'}
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