// SettingsScreen.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; // For navigation within the stack

export default function SettingsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleLanguagePress = () => {
    // Placeholder for language selection logic
    Alert.alert("Language Settings", "Language selection options would appear here.");
    console.log("Language option clicked");
  };

  const handleLogoutPress = () => {
    // Placeholder for logout logic
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout cancelled"),
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => {
            console.log("User logged out");
            // In a real app, you would clear user session/auth tokens
            // and navigate back to a login/onboarding screen, e.g.:
            // navigation.reset({
            //   index: 0,
            //   routes: [{ name: 'Login' }], // Replace 'Login' with your actual login screen route name
            // });
            Alert.alert("Logged Out", "You have been successfully logged out.");
            navigation.goBack(); // For demonstration, just go back to dashboard
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />

      {/* Header for Settings Screen */}
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text> {/* Back arrow */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} /> {/* Spacer to balance header title */}
      </View>

      <View style={styles.contentContainer}>
        {/* Language Option */}
        <TouchableOpacity style={styles.settingOption} onPress={handleLanguagePress}>
          <Text style={styles.settingOptionText}>Language</Text>
          <Text style={styles.settingOptionArrow}>›</Text>
        </TouchableOpacity>

        {/* Logout Option */}
        <TouchableOpacity style={styles.settingOption} onPress={handleLogoutPress}>
          <Text style={styles.settingOptionText}>Logout</Text>
          <Text style={styles.settingOptionArrow}>›</Text>
        </TouchableOpacity>

        {/* Add more settings options here */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A213B', // Dark background
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
    borderBottomColor: 'rgba(255, 255, 255, 0.1)', // Subtle separator
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 28,
    color: '#A8C3D1', // Light accent color
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  settingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333A4B', // Slightly lighter dark background for options
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  settingOptionText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
  },
  settingOptionArrow: {
    fontSize: 20,
    color: '#A8C3D1', // Light accent color
  },
});
