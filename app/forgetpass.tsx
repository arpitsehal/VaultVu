import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '@/services/authService';

const { width: screenWidth } = Dimensions.get('window'); // Get screen width for responsive image sizing

export default function ForgotPasswordPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Call the hook to get safe area insets

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(''); // State for email validation error
  const [isLoading, setIsLoading] = useState(false);

  // Basic email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle continue button press -> request OTP and navigate
  const handleContinue = async () => {
    setEmailError(''); // Clear previous error

    if (!email.trim()) {
      setEmailError('Email address is required');
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await authService.requestPasswordReset(email);
      if (res?.success) {
        await AsyncStorage.setItem('resetEmail', email);
        if (Platform.OS === 'web') {
          // Alert callbacks are unreliable on web; navigate immediately
          router.push({ pathname: '/otpvarification', params: { email } });
        } else {
          Alert.alert('Success', 'OTP sent to your email!', [
            { text: 'OK', onPress: () => router.push({ pathname: '/otpvarification', params: { email } }) }
          ]);
        }
      } else {
        Alert.alert('Error', res?.message || 'Failed to request OTP. Please try again.');
      }
    } catch (e) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}> {/* Use safeArea for overall container */}
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /> {/* Dark content on light background */}

      {/* Back Arrow - Positioned dynamically using safe area insets */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 20 }]} // Use insets.top for accurate positioning
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      {/* KeyboardAvoidingView to handle keyboard overlap */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior for iOS/Android
      >
        {/* ScrollView for content that might exceed screen height */}
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Robot Image */}
          <View style={styles.robotImageContainer}>
            <Image
              source={require('../assets/images/vaultvu-logo.jpg')} // Ensure path is correct
              style={styles.robotImage}
              resizeMode="contain"
            />
          </View>

          {/* Forgot Password Header */}
          <Text style={styles.headerText}>
            Forgot <Text style={styles.highlightText}>Password</Text>
          </Text>

          {/* Description Text */}
          <Text style={styles.descriptionText}>
            Enter your email address to get an OTP code to reset your password.
          </Text>

          {/* Email Input Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]} // Apply error style
              placeholder="john@beyondlogic.ai"
              placeholderTextColor="#A8C3D1"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null} {/* Display error */}
          </View>

          {/* CONTINUE Button */}
          <TouchableOpacity style={[styles.continueButton, isLoading && styles.continueButtonDisabled]} onPress={handleContinue} disabled={isLoading}>
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

const styles = StyleSheet.create({
  safeArea: { // New style for SafeAreaView
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: { // New style to make KeyboardAvoidingView take full space
    flex: 1,
    width: '100%',
  },
  scrollViewContent: { // New style for ScrollView content container
    flexGrow: 1, // Allows content to grow and push elements
    alignItems: 'center',
    paddingTop: 20, // Adjusted padding for content inside scroll view
    paddingHorizontal: 20,
    paddingBottom: 40, // Ensure space at bottom for buttons
    justifyContent: 'center', // Center content vertically when it fits
  },
  backButton: {
    position: 'absolute',
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
    width: screenWidth * 0.4, // Responsive width (40% of screen width)
    height: screenWidth * 0.4, // Keep aspect ratio
    maxWidth: 150, // Max size to prevent it from getting too large on tablets
    maxHeight: 150,
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
    marginBottom: 40,
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
  continueButton: {
    backgroundColor: '#1A213B',
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 25,
    marginBottom: 20, // Adjusted for responsiveness with ScrollView
    width: '80%',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.7,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});