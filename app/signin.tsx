import { useRouter, Link } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';

const { width: screenWidth } = Dimensions.get('window');

export default function SignInPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // State for validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Basic email validation
  const validateEmail = (emailAddress: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAddress);
  };

  const handleSignIn = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');

    let isValid = true;

    if (!email.trim()) {
      setEmailError(translations.emailRequired || 'Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError(translations.invalidEmail || 'Please enter a valid email address');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError(translations.passwordRequired || 'Password is required');
      isValid = false;
    }

    if (isValid) {
      try {
        const result = await login(email, password);
        
        if (result.success) {
          console.log('Sign-in successful:', result.user);
          router.push('/home');
          Alert.alert(translations.successAlertTitle || 'Success', translations.signInAlertSuccess || 'Signed in successfully!', [
            { text: translations.ok || 'OK', onPress: () => {} }
          ]);
        } else {
          console.error('Sign-in failed:', result.message);
          Alert.alert(translations.errorAlertTitle || 'Error', result.message || translations.signInAlertFailed || 'Sign-in failed. Please try again.');
        }
      } catch (error) {
        console.error('Network error during sign-in:', error);
        Alert.alert(translations.errorAlertTitle || 'Error', translations.serverConnectionError || 'Could not connect to the server. Please check the network connection and the server IP address.');
      }
    } else {
      Alert.alert(translations.errorAlertTitle || 'Error', translations.formValidationError || 'Please correct the highlighted errors.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

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
          <View style={styles.robotImageContainer}>
            <Image
              source={require('../assets/images/vaultvu-logo.jpg')}
              style={styles.robotImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.signInHeader}>
            {translations.signInTo || 'Sign in to'} <Text style={styles.vaultVuHighlight}>VaultVu</Text>
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{translations.emailLabel || 'Email'}</Text>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="john@beyondlogic.ai"
              placeholderTextColor="#A8C3D1"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{translations.passwordLabel || 'Password'}</Text>
            <TextInput
              style={[styles.input, passwordError ? styles.inputError : null]}
              placeholder="••••••••••••"
              placeholderTextColor="#A8C3D1"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>{translations.rememberMe || 'Remember me'}</Text>
            </TouchableOpacity>
            <Link href="/forgetpass" asChild>
              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>
                  {translations.forgotPassword || 'Forgot Password?'}
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          <TouchableOpacity style={styles.signInMainButton} onPress={handleSignIn}>
            <Text style={styles.signInMainButtonText}>{translations.signInMainButton || 'SIGN IN'}</Text>
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
    width: screenWidth * 0.4,
    height: screenWidth * 0.4,
    maxWidth: 150,
    maxHeight: 150,
  },
  signInHeader: {
    fontSize: 28,
    fontWeight: 'normal',
    color: '#1A213B',
    marginBottom: 30,
    textAlign: 'center',
  },
  vaultVuHighlight: {
    color: '#1A213B',
    fontWeight: '900',
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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
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
  forgotPasswordText: {
    color: '#A8C3D1',
    fontSize: 14,
    fontWeight: 'bold',
  },
  orText: {
    color: '#A8C3D1',
    fontSize: 14,
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1A213B',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    width: '80%',
    justifyContent: 'center',
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#1A213B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInMainButton: {
    backgroundColor: '#1A213B',
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 25,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  signInMainButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});