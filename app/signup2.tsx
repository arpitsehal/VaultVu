import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,         // <--- ADDED for responsiveness
  KeyboardAvoidingView, // <--- ADDED for responsiveness
  Platform,             // <--- ADDED for OS specific logic
  Dimensions,           // <--- ADDED for responsiveness
  Alert                 // <--- ADDED for user feedback
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; // <--- ADDED useSafeAreaInsets
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window'); // For potential future responsive sizing, or minor adjustments

export default function CreateAccountPage2() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Get safe area insets

  const [username, setUsername] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(''); // Kept as string
  const [country, setCountry] = useState('');         // Kept as string
  const [gender, setGender] = useState('');           // Kept as string

  // State for validation errors
  const [usernameError, setUsernameError] = useState('');
  const [dobError, setDobError] = useState('');
  const [countryError, setCountryError] = useState('');
  const [genderError, setGenderError] = useState('');

  const handleSignUp = () => {
    // Reset errors
    setUsernameError('');
    setDobError('');
    setCountryError('');
    setGenderError('');

    let isValid = true;

    if (!username.trim()) {
      setUsernameError('Username is required');
      isValid = false;
    }
    // Basic validation for text inputs
    if (!dateOfBirth.trim()) {
      setDobError('Date of Birth is required');
      isValid = false;
    }
    if (!country.trim()) {
      setCountryError('Country is required');
      isValid = false;
    }
    if (!gender.trim()) {
      setGenderError('Gender is required');
      isValid = false;
    }

    if (isValid) {
      console.log('Signing up with:', { username, dateOfBirth, country, gender });
      Alert.alert('Success', 'Account created successfully!', [ // Using Alert for better UX
        { text: 'OK', onPress: () => router.push('/home') } // Adjust '/home' to your actual next route
      ]);
    } else {
      Alert.alert('Error', 'Please fill in all required fields.'); // Using Alert for better UX
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

      {/* KeyboardAvoidingView to handle keyboard overlap */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior for iOS/Android
      >
        {/* ScrollView for content that might exceed screen height */}
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarFill} />
          </View>

          {/* Header */}
          <Text style={styles.headerText}>
            Create an <Text style={styles.highlightText}>account</Text>
          </Text>

          {/* Description Text */}
          <Text style={styles.descriptionText}>
            Please enter your username, date of birth, country, and gender.
          </Text>

          {/* Username Input Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={[styles.input, usernameError ? styles.inputError : null]}
              placeholder="andrew_ainsley"
              placeholderTextColor="#A8C3D1"
              value={username}
              onChangeText={setUsername}
            />
            {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
            {/* Checkmark icon placeholder */}
            <Text style={styles.inputIcon}>✓</Text>
          </View>

          {/* Date of Birth Input Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <TextInput
              style={[styles.input, dobError ? styles.inputError : null]}
              placeholder="DD/MM/YYYY" // Changed placeholder to guide format
              placeholderTextColor="#A8C3D1"
              keyboardType="numeric"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
            />
            {dobError ? <Text style={styles.errorText}>{dobError}</Text> : null}
            {/* Calendar icon placeholder */}
            <Text style={styles.inputIcon}>🗓️</Text>
          </View>

          {/* Country Input Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Country</Text>
            <TextInput
              style={[styles.input, countryError ? styles.inputError : null]}
              placeholder="United States"
              placeholderTextColor="#A8C3D1"
              value={country}
              onChangeText={setCountry}
            />
            {countryError ? <Text style={styles.errorText}>{countryError}</Text> : null}
            {/* Dropdown arrow icon placeholder */}
            <Text style={styles.inputIcon}>▼</Text>
          </View>

          {/* Gender Input Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Gender</Text>
            <TextInput
              style={[styles.input, genderError ? styles.inputError : null]}
              placeholder="Male"
              placeholderTextColor="#A8C3D1"
              value={gender}
              onChangeText={setGender}
            />
            {genderError ? <Text style={styles.errorText}>{genderError}</Text> : null}
            {/* Dropdown arrow icon placeholder */}
            <Text style={styles.inputIcon}>▼</Text>
          </View>

          {/* SIGN UP Button */}
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>SIGN UP</Text>
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
    flexGrow: 1, // Allows content to grow and push elements
    alignItems: 'center',
    paddingTop: 20,
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
  progressBarContainer: {
    width: '80%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 30,
    marginTop: Platform.OS === 'ios' ? 0 : 40, // Adjust for top spacing after back button
  },
  progressBarFill: {
    width: '75%', // Example progress for step 2
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
  inputIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -12 }], // Adjusted to roughly center in 50px height input
    fontSize: 20,
    color: '#A8C3D1',
  },
  signUpButton: {
    backgroundColor: '#1A213B',
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 25,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});