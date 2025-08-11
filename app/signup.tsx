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
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLanguage } from '../contexts/LanguageContext';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');

export default function CreateAccountPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (pass) => {
    let errors = [];
    if (pass.length < 8) {
      errors.push(translations.passwordRule_8char || 'at least 8 characters');
    }
    if (!/[A-Z]/.test(pass)) {
      errors.push(translations.passwordRule_uppercase || 'at least one uppercase letter');
    }
    if (!/[a-z]/.test(pass)) {
      errors.push(translations.passwordRule_lowercase || 'at least one lowercase letter');
    }
    if (!/[0-9]/.test(pass)) {
      errors.push(translations.passwordRule_number || 'at least one number');
    }
    if (!/[!@#$%^&*]/.test(pass)) {
      errors.push(translations.passwordRule_specialChar || 'at least one special character (!@#$%^&*)');
    }
    return errors;
  };

  const validateEmail = (emailAddress) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(emailAddress);
  };

  const handleCreateAccount = async () => {
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');

    let isValid = true;

    if (!firstName.trim()) {
      setFirstNameError(translations.firstNameRequired || 'First Name is required');
      isValid = false;
    }
    if (!lastName.trim()) {
      setLastNameError(translations.lastNameRequired || 'Last Name is required');
      isValid = false;
    }
    if (!email.trim() || !validateEmail(email)) {
      setEmailError(translations.invalidEmail_signup || 'Please enter a valid email');
      isValid = false;
    }

    const passValidationErrors = validatePassword(password);
    if (passValidationErrors.length > 0) {
      setPasswordError(`${translations.passwordValidationError || 'Password must contain: '}${passValidationErrors.join(', ')}`);
      isValid = false;
    }

    if (isValid) {
      try {
        const response = await fetch('https://vaultvu.onrender.com/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Registration successful:', data);
          // Store email for the next step
          await AsyncStorage.setItem('registrationEmail', email);
          Alert.alert(translations.signupSuccessAlertTitle || 'Success', data.message || translations.signupSuccessAlertMessage, [
            { text: translations.ok || 'OK', onPress: () => router.push('/signup2') }
          ]);
        } else {
          console.error('Registration failed:', data);
          Alert.alert(translations.errorAlertTitle_signup || 'Error', data.message || translations.signupFailedAlertMessage || 'Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Network error during registration:', error);
        Alert.alert(translations.errorAlertTitle_signup || 'Error', translations.serverConnectionError_signup || 'Could not connect to the server. Please try again.');
      }
    } else {
      Alert.alert(translations.errorAlertTitle_signup || 'Error', translations.formValidationError_signup || 'Please fix the errors to create an account.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 20 }]}
        onPress={() => router.back()}
      >
        <AntDesign name="arrowleft" size={24} color="#1A213B" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarFill} />
          </View>

          <Text style={styles.headerText}>
            {translations.createAccountHeader || 'Create an'} <Text style={styles.highlightText}>{translations.accountHighlight || 'account'}</Text>
          </Text>

          <Text style={styles.descriptionText}>
            {translations.signupDescription || "Please complete your profile. Don't worry, your data will remain private and only you can see it."}
          </Text>

          <View style={styles.nameInputContainer}>
            <View style={[styles.nameInputGroup, { marginRight: 10 }]}>
              <Text style={styles.inputLabel}>{translations.firstNameLabel || 'First Name'}</Text>
              <TextInput
                style={[styles.input, firstNameError ? styles.inputError : null]}
                placeholder="Andrew"
                placeholderTextColor="#A8C3D1"
                value={firstName}
                onChangeText={setFirstName}
              />
              {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}
            </View>
            <View style={styles.nameInputGroup}>
              <Text style={styles.inputLabel}>{translations.lastNameLabel || 'Last Name'}</Text>
              <TextInput
                style={[styles.input, lastNameError ? styles.inputError : null]}
                placeholder="Ainsley"
                placeholderTextColor="#A8C3D1"
                value={lastName}
                onChangeText={setLastName}
              />
              {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}
            </View>
          </View>

          <View style={styles.inputGroupFullWidth}>
            <Text style={styles.inputLabel}>{translations.emailLabel_signup || 'Email'}</Text>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="andrew.ainsley@yourdomain.com"
              placeholderTextColor="#A8C3D1"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          <View style={styles.inputGroupFullWidth}>
            <Text style={styles.inputLabel}>{translations.passwordLabel_signup || 'Password'}</Text>
            <TextInput
              style={[styles.input, passwordError ? styles.inputError : null]}
              placeholder="••••••••••••"
              placeholderTextColor="#A8C3D1"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <AntDesign name={showPassword ? "eyeo" : "eye"} size={20} color="#A8C3D1" />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <AntDesign name="check" size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.checkboxText}>{translations.rememberMe_signup || 'Remember me'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.orText}>{translations.or_signup || 'or'}</Text>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png' }}
                style={styles.socialIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.createAccountButton} onPress={handleCreateAccount}>
            <Text style={styles.createAccountButtonText}>{translations.createAccountButton || 'CREATE ACCOUNT'}</Text>
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
  progressBarContainer: {
    width: '80%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 30,
    marginTop: Platform.OS === 'ios' ? 0 : 40,
  },
  progressBarFill: {
    width: '50%',
    height: '100%',
    backgroundColor: '#1A213B',
    borderRadius: 4,
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
  nameInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  nameInputGroup: {
    flex: 1,
  },
  inputGroupFullWidth: {
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
  orText: {
    color: '#A8C3D1',
    fontSize: 14,
    marginBottom: 20,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '60%',
    marginBottom: 30,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
  createAccountButton: {
    backgroundColor: '#1A213B',
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 25,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  createAccountButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});