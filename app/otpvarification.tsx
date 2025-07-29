import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; // Keep useSafeAreaInsets imported
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window'); // Get screen width for dynamic sizing

export default function OtpVerificationPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // <--- Access insets here, inside the component

  const [otp, setOtp] = useState(['', '', '', '']); // State for 4 OTP digits
  const otpInputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null)
  ];
  const [resendTimer, setResendTimer] = useState(55);
  const [canResend, setCanResend] = useState(false);

  // Focus on the first input when the component mounts
  useEffect(() => {
    otpInputRefs[0].current?.focus();
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [resendTimer]);

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text.charAt(0);
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text !== '' && index < otp.length - 1) {
      otpInputRefs[index + 1].current?.focus();
    } else if (text !== '' && index === otp.length - 1) {
      Keyboard.dismiss();
    }
  };

  const handleNumberPadInput = (value: string) => {
    if (value === 'backspace') {
      let currentEmptyIndex = otp.findIndex(digit => digit === '');
      let indexToClear = -1;

      if (currentEmptyIndex === 0) {
        return;
      } else if (currentEmptyIndex === -1) {
        indexToClear = otp.length - 1;
      } else {
        indexToClear = currentEmptyIndex - 1;
      }

      const newOtp = [...otp];
      if (indexToClear !== -1) {
        newOtp[indexToClear] = '';
        setOtp(newOtp);
        otpInputRefs[indexToClear].current?.focus();
      }
    } else {
      const firstEmptyIndex = otp.findIndex(digit => digit === '');
      if (firstEmptyIndex !== -1) {
        handleOtpChange(value, firstEmptyIndex);
      } else {
        const newOtp = [...otp];
        newOtp[otp.length - 1] = value;
        setOtp(newOtp);
        otpInputRefs[otp.length - 1].current?.focus();
      }
    }
  };

  const handleConfirm = () => {
    const fullOtp = otp.join('');
    if (fullOtp.length === 4) {
      console.log('Confirming OTP:', fullOtp);
      Alert.alert('Success', 'OTP verified successfully!', [
        { text: 'OK', onPress: () => router.push('/newpass') }
      ]);
    } else {
      Alert.alert('Error', 'Please enter the complete OTP.');
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      setResendTimer(55);
      setCanResend(false);
      console.log('Resending OTP code...');
      Alert.alert('Success', 'OTP resend request sent!');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Back Arrow - Positioned dynamically using safe area insets */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 20 }]} // This is correct
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              You've got <Text style={styles.highlightText}>mail</Text>
            </Text>
            <Text style={styles.mailIcon}>✉️</Text>
          </View>

          {/* Description */}
          <Text style={styles.descriptionText}>
            We have sent the OTP verification code to your email address. Check your email and enter the code below.
          </Text>

          {/* OTP Input Fields */}
          <View style={styles.otpInputContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={otpInputRefs[index]}
                style={[styles.otpInput, digit !== '' && styles.otpInputFilled]}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={(text) => handleOtpChange(text, index)}
                value={digit}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
                    otpInputRefs[index - 1].current?.focus();
                  }
                }}
                selectTextOnFocus={true}
                caretHidden={true}
                showSoftInputOnFocus={false}
              />
            ))}
          </View>

          {/* Resend Code */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive email?</Text>
            <TouchableOpacity onPress={handleResendCode} disabled={!canResend}>
              <Text style={[styles.resendLink, !canResend && styles.resendLinkDisabled]}>
                {canResend ? 'Resend code' : `You can resend code in ${resendTimer} s`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* CONFIRM Button */}
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>CONFIRM</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Number Pad - Always visible at the bottom */}
      <View style={[styles.numberPad, { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 10 }]}> {/* <--- FIXED: Apply paddingBottom dynamically */}
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
          ['*', '0', 'backspace'],
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={styles.numberPadRow}>
            {row.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.numberPadButton}
                onPress={() => handleNumberPadInput(item)}
              >
                {item === 'backspace' ? (
                  <Text style={styles.numberPadButtonText}>⌫</Text>
                ) : (
                  <Text style={styles.numberPadButtonText}>{item}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'normal',
    color: '#1A213B',
    textAlign: 'center',
  },
  highlightText: {
    color: '#1A213B',
    fontWeight: '900',
  },
  mailIcon: {
    fontSize: 28,
    marginLeft: 10,
  },
  descriptionText: {
    color: '#1A213B',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 30,
    lineHeight: 24,
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 30,
  },
  otpInput: {
    width: screenWidth / 4 - 30,
    height: 60,
    borderColor: '#1A213B',
    borderWidth: 1,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A213B',
    marginHorizontal: 2,
  },
  otpInputFilled: {
    borderColor: '#A8C3D1',
    borderWidth: 2,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  resendText: {
    color: '#1A213B',
    fontSize: 14,
    marginBottom: 5,
  },
  resendLink: {
    color: '#A8C3D1',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resendLinkDisabled: {
    color: 'rgba(168, 195, 209, 0.5)',
  },
  confirmButton: {
    backgroundColor: '#1A213B',
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 25,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  numberPad: {
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#E0E0E0',
    paddingTop: 10,
    // paddingBottom is now handled dynamically in the component
  },
  numberPadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  numberPadButton: {
    width: screenWidth / 3 - 30,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 5,
  },
  numberPadButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A213B',
  },
});