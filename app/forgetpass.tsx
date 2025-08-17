import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  TextInput, 
  Text, 
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { requestPasswordReset, resetPassword } from '../services/authService';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Enter OTP & New Password
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleRequestOTP = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    console.log('Sending request to:', `${process.env.EXPO_PUBLIC_API_URL || 'https://vaultvu.onrender.com'}/api/auth/request-password-reset`);
    console.log('Request body:', { email });
    
    setLoading(true);
    try {
      const response = await requestPasswordReset(email);
      console.log('Response:', response);
      
      if (response.success) {
        Alert.alert('Success', 'OTP has been sent to your email');
        setStep(2);
      } else {
        Alert.alert('Error', response.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error in handleRequestOTP:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      Alert.alert('Error', 'Please enter OTP and new password');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    const response = await resetPassword(email, otp, newPassword);
    setLoading(false);

    if (response.success) {
      Alert.alert('Success', 'Password has been reset successfully');
      router.back();
    } else {
      Alert.alert('Error', response.message || 'Failed to reset password');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>Reset Password</Text>
          
          {step === 1 ? (
            <>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                placeholderTextColor="#999"
              />
              <TouchableHighlight
                style={[styles.button, loading ? styles.buttonDisabled : null]}
                onPress={handleRequestOTP}
                disabled={loading}
                underlayColor="#1a73e8"
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Send OTP</Text>
                )}
              </TouchableHighlight>
            </>
          ) : (
            <>
              <Text style={styles.label}>OTP</Text>
              <TextInput
                value={otp}
                onChangeText={setOtp}
                style={styles.input}
                keyboardType="number-pad"
                placeholder="Enter OTP"
                placeholderTextColor="#999"
              />
              <Text style={styles.label}>New Password</Text>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor="#999"
              />
              <TouchableHighlight
                style={[styles.button, loading ? styles.buttonDisabled : null]}
                onPress={handleResetPassword}
                disabled={loading}
                underlayColor="#1a73e8"
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Reset Password</Text>
                )}
              </TouchableHighlight>
            </>
          )}
          
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backToLogin}>Back to Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: { 
    flex: 1,
    width: '100%',
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1A213B',
  },
  label: {
    fontSize: 16,
    color: '#1A213B',
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#1A213B',
  },
  button: {
    backgroundColor: '#1A213B',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#8ab4f8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backToLogin: {
    marginTop: 20,
    textAlign: 'center',
    color: '#1a73e8',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});