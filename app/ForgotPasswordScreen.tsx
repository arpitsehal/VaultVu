import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  TextInput, 
  Text, 
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';
import { requestPasswordReset, resetPassword } from '../services/authService';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Enter OTP & New Password
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRequestOTP = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    const response = await requestPasswordReset(email);
    setLoading(false);

    if (response.success) {
      Alert.alert('Success', 'OTP has been sent to your email');
      setStep(2);
    } else {
      Alert.alert('Error', response.message || 'Failed to send OTP');
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
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1a73e8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
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
