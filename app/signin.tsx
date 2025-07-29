import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
  ScrollView,         // <--- ADDED for responsiveness
  KeyboardAvoidingView, // <--- ADDED for responsiveness
  Platform,             // <--- ADDED for OS specific logic
  Dimensions,           // <--- ADDED for responsive sizing
  Alert                 // <--- ADDED for user feedback
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; // <--- ADDED useSafeAreaInsets
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window'); // Get screen width for responsive image sizing

export default function SignInPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Call the hook to get safe area insets

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

  // Placeholder for sign-in logic
  const handleSignIn = () => {
    setEmailError('');
    setPasswordError('');

    let isValid = true;

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    }
    // You might want more sophisticated password validation here too

    if (isValid) {
      console.log('Signing in with:', { email, password, rememberMe });
      // Implement your actual authentication logic here (e.g., API call)

      // Assuming authentication is successful:
      Alert.alert('Success', 'Signed in successfully!', [
        { text: 'OK', onPress: () => router.push('/home') } // <--- This line links to /home (your DashboardScreen)
      ]);
    } else {
      Alert.alert('Error', 'Please correct the highlighted errors.');
    }
  };

  // Placeholder for Google sign-in
  const handleGoogleSignIn = () => {
    console.log('Signing in with Google');
    // Implement Google OAuth logic here
    Alert.alert('Google Sign-in', 'Initiating Google sign-in process...');
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
              source={require('../assets/images/vaultvu-logo.jpg')} // Ensure this path is correct
              style={styles.robotImage}
              resizeMode="contain"
            />
          </View>

          {/* Sign In Header */}
          <Text style={styles.signInHeader}>
            Sign in to <Text style={styles.vaultVuHighlight}>VaultVu</Text>
          </Text>

          {/* Input Fields */}
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

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={[styles.input, passwordError ? styles.inputError : null]} // Apply error style
              placeholder="••••••••••••"
              placeholderTextColor="#A8C3D1"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null} {/* Display error */}
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/forgetpass')}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* OR Separator */}
          <Text style={styles.orText}>or</Text>

          {/* Google Sign-in Button */}
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png' }} // Google logo
              style={styles.googleLogo}
              resizeMode="contain"
            />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>

          {/* SIGN IN Button */}
          <TouchableOpacity style={styles.signInMainButton} onPress={() => router.push('/home')}>
            <Text style={styles.signInMainButtonText}>SIGN IN</Text>
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