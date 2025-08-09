import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentLanguage, translations, changeLanguage } = useLanguage();
  const [callDetectionEnabled, setCallDetectionEnabled] = useState(true);
  const [messageDetectionEnabled, setMessageDetectionEnabled] = useState(true);

  useEffect(() => {
    // Load user data from AsyncStorage and backend
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

        if (response.ok) {
          const userData = await response.json();
          if (userData.success && userData.user) {
            setUser(userData.user);
            // Save updated user data to AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(userData.user));
          } else {
            throw new Error(userData.message || 'Failed to fetch user data');
          }
        } else {
          // If backend request fails, try to get data from AsyncStorage
          const cachedUserData = await AsyncStorage.getItem('user');
          if (cachedUserData) {
            setUser(JSON.parse(cachedUserData));
          } else {
            throw new Error('No user data available');
          }
        }

        // Load saved language preference
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage && savedLanguage !== currentLanguage) {
          changeLanguage(savedLanguage);
        }
        
        // Load call and message detection settings
        const callDetection = await AsyncStorage.getItem('callDetectionEnabled');
        const messageDetection = await AsyncStorage.getItem('messageDetectionEnabled');
        
        if (callDetection !== null) {
          setCallDetectionEnabled(callDetection === 'true');
        }
        
        if (messageDetection !== null) {
          setMessageDetectionEnabled(messageDetection === 'true');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        // Try to get data from AsyncStorage as fallback
        try {
          const cachedUserData = await AsyncStorage.getItem('user');
          if (cachedUserData) {
            setUser(JSON.parse(cachedUserData));
          }
        } catch (e) {
          console.error('Error loading cached user data:', e);
        }
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Toggle call detection
  const toggleCallDetection = async (value: boolean) => {

    setCallDetectionEnabled(value);
    await AsyncStorage.setItem('callDetectionEnabled', value.toString());
  };

  // Toggle message detection
  const toggleMessageDetection = async (value: boolean) => {

    setMessageDetectionEnabled(value);
    await AsyncStorage.setItem('messageDetectionEnabled', value.toString());
  };

  const handleLogout = async () => {
    Alert.alert(
      translations.logout,
      'Are you sure you want to logout?',
      [
        {
          text: translations.cancel,
          style: 'cancel',
        },
        {
          text: translations.logout,
          onPress: async () => {
            try {
              // Clear user data and token
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('user');
              // Navigate to sign in screen
              router.replace('/signin');
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
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
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{translations.settings}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* User Profile Section */}
        <TouchableOpacity 
          style={styles.profileSection}
          onPress={() => router.push('/userProfile')}
        >
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileInitials}>
              {user?.email ? user.email.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.username || user?.email || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'No email'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#A8C3D1" />
        </TouchableOpacity>

        {/* Settings Options */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>{translations.preferences}</Text>
          
          {/* 🔽 ADD CALL/MESSAGE DETECTION TOGGLES 🔽 */}
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="call" size={24} color="#A8C3D1" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Call Fraud Detection</Text>
              <Text style={styles.settingSubtitle}>Get alerts for suspicious calls</Text>
            </View>
            <Switch
              value={callDetectionEnabled}
              onValueChange={toggleCallDetection}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={callDetectionEnabled ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="chatbubble" size={24} color="#A8C3D1" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Message Fraud Detection</Text>
              <Text style={styles.settingSubtitle}>Get alerts for suspicious messages</Text>
            </View>
            <Switch
              value={messageDetectionEnabled}
              onValueChange={toggleMessageDetection}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={messageDetectionEnabled ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          {/* 🔼 END OF TOGGLE SECTION 🔼 */}
          
          {/* Language Option */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/languageSettings')}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="language" size={24} color="#A8C3D1" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{translations.language}</Text>
              <Text style={styles.settingValue}>
                {currentLanguage === 'english' ? 'English' : 
                 currentLanguage === 'hindi' ? 'हिंदी' : 
                 currentLanguage === 'punjabi' ? 'ਪੰਜਾਬੀ' : 'English'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#A8C3D1" />
          </TouchableOpacity>

          {/* About Us Option */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/aboutUs')}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="information-circle" size={24} color="#A8C3D1" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{translations.aboutUs}</Text>
              <Text style={styles.settingSubtitle}>{translations.aboutTeam}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#A8C3D1" />
          </TouchableOpacity>

          {/* Logout Option */}
          <TouchableOpacity 
            style={[styles.settingItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="log-out" size={24} color="#FF6B6B" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, styles.logoutText]}>{translations.logout}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A213B',
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
    paddingBottom: 30,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#A8C3D1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileInitials: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1A213B',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: '#A8C3D1',
  },
  settingsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    marginTop: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    marginBottom: 3,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#A8C3D1',
  },
  settingValue: {
    fontSize: 14,
    color: '#A8C3D1',
  },
  logoutItem: {
    marginTop: 30,
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#FF6B6B',
  },
});