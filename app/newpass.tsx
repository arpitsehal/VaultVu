import { authService } from '@/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CreateNewPasswordPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const insets = useSafeAreaInsets();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State for validation errors
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Ensure we have required params
  useEffect(() => {
    const otpParam = typeof params.otp === 'string' ? params.otp : undefined;
    const emailParam = typeof params.email === 'string' ? params.email : undefined;
    if (!otpParam || !emailParam) {
      Alert.alert('Error', 'Missing verification info. Please re-enter OTP.');
      router.replace('/otpvarification');
    }
  }, [params]);

  // Password validation function
  const validatePassword = (password: string) => {
    let errors = [];
    if (password.length < 8) {
      errors.push('at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('at least one special character (!@#$%^&*)');
    }
    return errors;
  };

  // Handle continue button press
  const handleContinue = async () => {
    // Reset previous errors
    setNewPasswordError('');
    setConfirmPasswordError('');

    const newPassValidationErrors = validatePassword(newPassword);
    let isValid = true;

    if (newPassValidationErrors.length > 0) {
      setNewPasswordError('Password must contain: ' + newPassValidationErrors.join(', '));
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    if (!isValid) {
      Alert.alert('Error', 'Please fix the password errors.');
      return;
    }

    setIsLoading(true);

    try {
      const email = (typeof params.email === 'string' ? params.email : undefined) || (await AsyncStorage.getItem('resetEmail')) || '';
      const otp = typeof params.otp === 'string' ? params.otp : '';
      if (!email || !otp) {
        Alert.alert('Error', 'Missing verification info. Please re-enter OTP.');
        return router.replace('/otpvarification');
      }

      const data = await authService.resetPassword(email, otp, newPassword);

      if (data?.success) {
        // If remember me is checked, store the email for login BEFORE clearing
        if (rememberMe && email) {
          await AsyncStorage.setItem('rememberedEmail', email);
        }
        // Clear reset data
        await AsyncStorage.removeItem('resetEmail');

        Alert.alert('Success', 'Password reset successfully!', [
          { text: 'OK', onPress: () => router.push('/signin') }
        ]);
      } else {
        Alert.alert('Error', data?.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Back Arrow */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 20 }]}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Logo Image */}
          <View style={styles.robotImageContainer}>
            <Image
              source={require('../assets/images/vaultvu-logo.jpg')}
              style={styles.robotImage}
              resizeMode="contain"
            />
          </View>

          {/* Header */}
          <Text style={styles.headerText}>
            Create new <Text style={styles.highlightText}>password</Text>
            <Text style={styles.lockIcon}> 🔒</Text>
          </Text>

          {/* Description Text */}
          <Text style={styles.descriptionText}>
            Save the new password in a safe place, if you forget it then you have to do a forgot password again.
          </Text>

          {/* New Password Input Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Create a new password</Text>
            <TextInput
              style={[styles.input, newPasswordError ? styles.inputError : null]}
              placeholder="••••••••••••"
              placeholderTextColor="#A8C3D1"
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              contextMenuHidden
              textContentType={Platform.OS === 'ios' ? 'newPassword' : 'none'}
              autoComplete="off"
              importantForAutofill="no"
            />
            {newPasswordError ? <Text style={styles.errorText}>{newPasswordError}</Text> : null}
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Text style={styles.eyeIcon}>{showNewPassword ? '👁️' : '🔒'}</Text>
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm a new password</Text>
            <TextInput
              style={[styles.input, confirmPasswordError ? styles.inputError : null]}
              placeholder="••••••••••••"
              placeholderTextColor="#A8C3D1"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              contextMenuHidden
              textContentType={Platform.OS === 'ios' ? 'newPassword' : 'none'}
              autoComplete="off"
              importantForAutofill="no"
            />
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '🔒'}</Text>
            </TouchableOpacity>
          </View>

          {/* Remember Me Checkbox */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>Remember me</Text>
            </TouchableOpacity>
          </View>

          {/* CONTINUE Button */}
          <TouchableOpacity 
            style={[styles.continueButton, isLoading && styles.disabledButton]} 
            onPress={handleContinue}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.continueButtonText}>CONTINUE</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Keep existing styles and add new ones for loading state
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    // 'top' is now set dynamically in the component using insets.top
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#1A213B',
  },
  robotImageContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  robotImage: {
    width: 150,
    height: 150,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'normal',
    color: '#1A213B',
    marginBottom: 10,
    textAlign: 'center',
  },
  highlightText: {
    color: '#1A213B',
    fontWeight: '900',
  },
  lockIcon: {
    fontSize: 24,
    marginLeft: 5,
  },
  descriptionText: {
    color: '#1A213B',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
    lineHeight: 24,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#1A213B',
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#1A213B',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#1A213B',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
  },
  disabledButton: {
    backgroundColor: '#A8C3D1',
    opacity: 0.7,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
});