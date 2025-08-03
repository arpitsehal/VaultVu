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

const { width: screenWidth } = Dimensions.get('window');

export default function CreateAccountPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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

  // Password validation function (reused from CreateNewPasswordPage)
  const validatePassword = (pass: string) => {
    let errors = [];
    if (pass.length < 8) {
      errors.push('at least 8 characters');
    }
    if (!/[A-Z]/.test(pass)) {
      errors.push('at least one uppercase letter');
    }
    if (!/[a-z]/.test(pass)) {
      errors.push('at least one lowercase letter');
    }
    if (!/[0-9]/.test(pass)) {
      errors.push('at least one number');
    }
    if (!/[!@#$%^&*]/.test(pass)) {
      errors.push('at least one special character (!@#$%^&*)');
    }
    return errors;
  };

  // Basic email validation
  const validateEmail = (emailAddress: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(emailAddress);
  };

  const handleCreateAccount = async () => {
    // Reset errors
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');

    let isValid = true;

    if (!firstName.trim()) {
      setFirstNameError('First Name is required');
      isValid = false;
    }
    if (!lastName.trim()) {
      setLastNameError('Last Name is required');
      isValid = false;
    }
    if (!email.trim() || !validateEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }

    const passValidationErrors = validatePassword(password);
    if (passValidationErrors.length > 0) {
      setPasswordError('Password must contain: ' + passValidationErrors.join(', '));
      isValid = false;
    }

    if (isValid) {
      // API call to the backend registration endpoint
      try {
        const response = await fetch('http://192.168.35.74:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // Registration successful, log the response and navigate to the next screen
          console.log('Registration successful:', data);
          Alert.alert('Success', data.message, [
            { text: 'OK', onPress: () => router.push('/signup2') }
          ]);
        } else {
          // Registration failed, show the error message from the backend
          console.error('Registration failed:', data);
          Alert.alert('Error', data.message || 'Registration failed. Please try again.');
        }
      } catch (error) {
        // Handle network errors
        console.error('Network error during registration:', error);
        Alert.alert('Error', 'Could not connect to the server. Please try again.');
      }
    } else {
      // If client-side validation fails
      Alert.alert('Error', 'Please fix the errors to create an account.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Back Arrow - Positioned dynamically using safe area insets */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 20 }]}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      {/* KeyboardAvoidingView to handle keyboard overlap */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* ScrollView for content that might exceed screen height */}
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Progress Bar (Placeholder) */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarFill} />
          </View>

          {/* Header */}
          <Text style={styles.headerText}>
            Create an <Text style={styles.highlightText}>account</Text>
          </Text>

          {/* Description Text */}
          <Text style={styles.descriptionText}>
            Please complete your profile. Don't worry, your data will remain private and only you can see it.
          </Text>

          {/* Name Input Fields */}
          <View style={styles.nameInputContainer}>
            <View style={[styles.nameInputGroup, { marginRight: 10 }]}>
              <Text style={styles.inputLabel}>First Name</Text>
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
              <Text style={styles.inputLabel}>Last Name</Text>
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

          {/* Email Input Field */}
          <View style={styles.inputGroupFullWidth}>
            <Text style={styles.inputLabel}>Email</Text>
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

          {/* Password Input Field */}
          <View style={styles.inputGroupFullWidth}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={[styles.input, passwordError ? styles.inputError : null]}
              placeholder="••••••••••••"
              placeholderTextColor="#A8C3D1"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            {/* Eye icon button */}
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🔒'}</Text>
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

          {/* OR Separator */}
          <Text style={styles.orText}>or</Text>

          {/* Social Login Buttons - ONLY GOOGLE REMAINS */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png' }}
                style={styles.socialIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            {/* Apple and Facebook buttons removed */}
          </View>

          {/* Create Account Button */}
          <TouchableOpacity style={styles.createAccountButton} onPress={() => router.push('/signup2')}>
            <Text style={styles.createAccountButtonText}>CREATE ACCOUNT</Text>
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
