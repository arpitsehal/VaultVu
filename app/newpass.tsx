import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; // Import useSafeAreaInsets
import { useRouter } from 'expo-router';

export default function CreateNewPasswordPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Call the hook to get safe area insets

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for validation errors
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

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

  // Placeholder for handling continue button press
  const handleContinue = () => {
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

    if (isValid) {
      console.log('Creating new password:', { newPassword, confirmPassword, rememberMe });
      // Implement password reset logic here
      Alert.alert('Success', 'Password created successfully!', [
        { text: 'OK', onPress: () => router.push('/signin') }
      ]);
    } else {
      Alert.alert('Error', 'Please fix the password errors.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Back Arrow - Positioned dynamically using safe area insets */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 20 }]} // Use insets.top for accurate positioning
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Robot Image (Placeholder for the lock icon or similar) */}
          <View style={styles.robotImageContainer}>
            <Image
              source={require('../assets/images/vaultvu-logo.jpg')} // Ensure this path is correct
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
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>CONTINUE</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 5,
  },
  eyeIcon: {
    fontSize: 20,
    color: '#A8C3D1',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 40,
    paddingHorizontal: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#1A213B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#1A213B',
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  checkboxText: {
    color: '#1A213B',
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: '#1A213B',
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 25,
    marginBottom: 0,
    width: '80%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});