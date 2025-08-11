import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useLanguage } from '../contexts/LanguageContext';

export default function UserProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { translations } = useLanguage();
  
  // User profile state
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('');
  
  // Error states
  const [usernameError, setUsernameError] = useState('');
  const [dateOfBirthError, setDateOfBirthError] = useState('');
  
  // Gender options
  const GENDER_OPTIONS = [
    { label: `${translations.gender}`, value: '' },
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer not to say', value: 'prefer-not-to-say' },
  ];

  useEffect(() => {
    // Load user data from backend and AsyncStorage
    const loadUserData = async () => {
      try {
        setLoading(true);
        // Get token from AsyncStorage
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          router.replace('/signin');
          return;
        }

        // Fetch user data from backend
        const response = await fetch('https://vaultvu.onrender.com/api/auth/profile', {


          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        let userData;
        if (response.ok) {
          const data = await response.json();
          userData = data.user;
          // Save updated user data to AsyncStorage
          await AsyncStorage.setItem('user', JSON.stringify(userData));
        } else {
          // If backend request fails, try to get data from AsyncStorage
          const cachedUserData = await AsyncStorage.getItem('user');
          if (cachedUserData) {
            userData = JSON.parse(cachedUserData);
          } else {
            throw new Error('No user data available');
          }
        }

        // Set user data to state
        setEmail(userData.email || '');
        setUsername(userData.username || '');
        setDateOfBirth(userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '');
        setCountry(userData.country || '');
        setGender(userData.gender || '');
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        // Try to get data from AsyncStorage as fallback
        try {
          const cachedUserData = await AsyncStorage.getItem('user');
          if (cachedUserData) {
            const userData = JSON.parse(cachedUserData);
            setEmail(userData.email || '');
            setUsername(userData.username || '');
            setDateOfBirth(userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '');
            setCountry(userData.country || '');
            setGender(userData.gender || '');
          }
        } catch (e) {
          console.error('Error loading cached user data:', e);
          Alert.alert('Error', 'Failed to load user data. Please try again.');
        }
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const validateForm = () => {
    let isValid = true;
    
    // Username validation
    if (!username.trim()) {
      setUsernameError('Username is required');
      isValid = false;
    } else {
      setUsernameError('');
    }
    
    // Date of birth validation (optional)
    if (dateOfBirth) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dateOfBirth)) {
        setDateOfBirthError('Please use YYYY-MM-DD format');
        isValid = false;
      } else {
        setDateOfBirthError('');
      }
    } else {
      setDateOfBirthError('');
    }
    
    return isValid;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    
    try {
      // Get the token
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Call API to update profile on server
      const response = await fetch('https://vaultvu.onrender.com/api/auth/profile', {
        method: 'PUT',  // Changed from POST to PUT
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
          country,
          gender
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update stored user data with profile info
        await AsyncStorage.setItem('user', JSON.stringify(result.user));
        Alert.alert('Success', 'Profile updated successfully');
        router.back();
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A8C3D1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{translations.userProfile}</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileInitials}>
              {email ? email.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
          
          {/* Email (non-editable) */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{translations.email}</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={email}
              editable={false}
            />
          </View>
          
          {/* Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{translations.username}</Text>
            <TextInput
              style={[styles.input, usernameError ? styles.inputError : null]}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor="#A8C3D1"
            />
            {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
          </View>
          
          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{translations.dateOfBirth} (YYYY-MM-DD)</Text>
            <TextInput
              style={[styles.input, dateOfBirthError ? styles.inputError : null]}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#A8C3D1"
            />
            {dateOfBirthError ? <Text style={styles.errorText}>{dateOfBirthError}</Text> : null}
          </View>
          
          {/* Country */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{translations.country}</Text>
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
              placeholder="Enter country"
              placeholderTextColor="#A8C3D1"
            />
          </View>
          
          {/* Gender */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{translations.gender}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                style={styles.picker}
                dropdownIconColor="#A8C3D1"
              >
                {GENDER_OPTIONS.map((option) => (
                  <Picker.Item 
                    key={option.value} 
                    label={option.label} 
                    value={option.value} 
                    color="#FFFFFF"
                  />
                ))}
              </Picker>
            </View>
          </View>
          
          {/* Save Button */}
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSaveProfile}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#1A213B" />
            ) : (
              <Text style={styles.saveButtonText}>{translations.saveProfile}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A213B',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A213B',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1A213B',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 5,
    width: 30,
  },
  backButtonText: {
    fontSize: 28,
    color: '#A8C3D1',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#A8C3D1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileInitials: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1A213B',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#A8C3D1',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  disabledInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#A8C3D1',
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  pickerContainer: {
    borderColor: '#A8C3D1',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
    color: 'white',
    backgroundColor: 'transparent',
  },
  saveButton: {
    backgroundColor: '#A8C3D1',
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 25,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#1A213B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});