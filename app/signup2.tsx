import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
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
import { AntDesign } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

const { width: screenWidth } = Dimensions.get('window');

export default function CreateAccountPage2() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();

  const [username, setUsername] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [dobError, setDobError] = useState('');
  const [countryError, setCountryError] = useState('');
  const [genderError, setGenderError] = useState('');

  const COUNTRY_OPTIONS = [
    { label: translations.selectCountry || 'Select Country', value: '' },
    { label: 'United States', value: 'USA' },
    { label: 'Canada', value: 'CAN' },
    { label: 'United Kingdom', value: 'GBR' },
    { label: 'India', value: 'IND' },
    { label: 'Australia', value: 'AUS' },
    { label: 'Germany', value: 'DEU' },
    { label: 'France', value: 'FRA' },
    { label: 'Japan', value: 'JPN' },
    { label: 'Brazil', value: 'BRA' },
  ];

  const GENDER_OPTIONS = [
    { label: translations.selectGender || 'Select Gender', value: '' },
    { label: translations.male || 'Male', value: 'male' },
    { label: translations.female || 'Female', value: 'female' },
    { label: translations.other || 'Other', value: 'other' },
    { label: translations.preferNotToSay || 'Prefer not to say', value: 'prefer-not-to-say' },
  ];

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      setDobError('');
    }
  };

  const handleSignUp = () => {
    setUsernameError('');
    setDobError('');
    setCountryError('');
    setGenderError('');

    let isValid = true;

    if (!username.trim()) {
      setUsernameError(translations.usernameRequired || 'Username is required');
      isValid = false;
    }
    if (formatDate(selectedDate) === formatDate(new Date())) {
      setDobError(translations.dobRequired || 'Date of Birth is required');
      isValid = false;
    }
    if (!country) {
      setCountryError(translations.countryRequired || 'Country is required');
      isValid = false;
    }
    if (!gender) {
      setGenderError(translations.genderRequired || 'Gender is required');
      isValid = false;
    }

    if (isValid) {
      const formattedDateOfBirth = selectedDate.toISOString().split('T')[0];

      console.log('Signing up with:', { username, dateOfBirth: formattedDateOfBirth, country, gender });
      Alert.alert('Success', translations.accountCreatedSuccess || 'Account created successfully!', [
        { text: translations.ok || 'OK', onPress: () => router.push('/signin') }
      ]);
    } else {
      Alert.alert('Error', translations.allFieldsRequiredAlert || 'Please fill in all required fields.');
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
            {translations.signup2Header || 'Create an'} <Text style={styles.highlightText}>{translations.accountHighlight || 'account'}</Text>
          </Text>

          <Text style={styles.descriptionText}>
            {translations.signup2Description || 'Please enter your username, date of birth, country, and gender.'}
          </Text>

          {/* Username Input Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{translations.usernameLabel || 'Username'}</Text>
            <TextInput
              style={[styles.input, usernameError ? styles.inputError : null]}
              placeholder="andrew_ainsley"
              placeholderTextColor="#A8C3D1"
              value={username}
              onChangeText={setUsername}
            />
            {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
            <Text style={styles.inputIcon}>✓</Text>
          </View>

          {/* Date of Birth Input Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{translations.dateOfBirthLabel || 'Date of Birth'}</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInputTouchable}>
              <TextInput
                style={[styles.input, dobError ? styles.inputError : null]}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#A8C3D1"
                value={formatDate(selectedDate)}
                editable={false}
              />
              {dobError ? <Text style={styles.errorText}>{dobError}</Text> : null}
              <Text style={styles.inputIcon}>🗓️</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}

          {/* Country Picker Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{translations.countryLabel || 'Country'}</Text>
            <View style={[styles.pickerContainer, countryError ? styles.inputError : null]}>
              <Picker
                selectedValue={country}
                onValueChange={(itemValue) => {
                  setCountry(itemValue);
                  setCountryError('');
                }}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {COUNTRY_OPTIONS.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
              <Text style={styles.inputIcon}>▼</Text>
            </View>
            {countryError ? <Text style={styles.errorText}>{countryError}</Text> : null}
          </View>

          {/* Gender Picker Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{translations.genderLabel || 'Gender'}</Text>
            <View style={[styles.pickerContainer, genderError ? styles.inputError : null]}>
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => {
                  setGender(itemValue);
                  setGenderError('');
                }}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {GENDER_OPTIONS.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
              <Text style={styles.inputIcon}>▼</Text>
            </View>
            {genderError ? <Text style={styles.errorText}>{genderError}</Text> : null}
          </View>

          {/* SIGN UP Button */}
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>{translations.signUpButton || 'SIGN UP'}</Text>
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
    width: '75%',
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
  dateInputTouchable: {
    width: '100%',
    position: 'relative',
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
    transform: [{ translateY: -12 }],
    fontSize: 20,
    color: '#A8C3D1',
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    borderColor: '#1A213B',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#1A213B',
  },
  pickerItem: {
    fontSize: 16,
    color: '#1A213B',
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