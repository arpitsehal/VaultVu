import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define translations
const translationsData = {
  english: {
    // Common
    settings: 'Settings',
    profile: 'Profile',
    language: 'Language',
    aboutUs: 'About Us',
    logout: 'Logout',
    save: 'Save',
    cancel: 'Cancel',
    back: 'Back',
    
    // Settings Screen
    preferences: 'Preferences',
    aboutTeam: 'Learn about the team behind VaultVu',
    
    // Profile Screen
    userProfile: 'User Profile',
    email: 'Email',
    username: 'Username',
    dateOfBirth: 'Date of Birth',
    country: 'Country',
    gender: 'Gender',
    saveProfile: 'Save Profile',
    
    // Language Screen
    selectLanguage: 'Select your preferred language for the app interface.',
    languageChanged: 'Language Changed',
    languageChangeMessage: 'The app language has been changed. Some changes may require restarting the app.',
    
    // About Us Screen
    ourTeam: 'Our Team',
    contactUs: 'Contact Us',
    appDescription: 'VaultVu is a comprehensive security application designed to protect users from various types of financial frauds and scams. Our mission is to empower users with knowledge and tools to stay safe in the digital world.',
    allRightsReserved: 'All rights reserved.',
  },
  hindi: {
    // Common
    settings: 'सेटिंग्स',
    profile: 'प्रोफाइल',
    language: 'भाषा',
    aboutUs: 'हमारे बारे में',
    logout: 'लॉग आउट',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    back: 'वापस',
    
    // Settings Screen
    preferences: 'प्राथमिकताएँ',
    aboutTeam: 'VaultVu के पीछे की टीम के बारे में जानें',
    
    // Profile Screen
    userProfile: 'उपयोगकर्ता प्रोफाइल',
    email: 'ईमेल',
    username: 'उपयोगकर्ता नाम',
    dateOfBirth: 'जन्म तिथि',
    country: 'देश',
    gender: 'लिंग',
    saveProfile: 'प्रोफाइल सहेजें',
    
    // Language Screen
    selectLanguage: 'ऐप इंटरफेस के लिए अपनी पसंदीदा भाषा चुनें।',
    languageChanged: 'भाषा बदल गई है',
    languageChangeMessage: 'ऐप की भाषा बदल दी गई है। कुछ परिवर्तनों के लिए ऐप को पुनरारंभ करने की आवश्यकता हो सकती है।',
    
    // About Us Screen
    ourTeam: 'हमारी टीम',
    contactUs: 'संपर्क करें',
    appDescription: 'VaultVu एक व्यापक सुरक्षा एप्लिकेशन है जो उपयोगकर्ताओं को विभिन्न प्रकार के वित्तीय धोखाधड़ी और घोटालों से बचाने के लिए डिज़ाइन किया गया है। हमारा मिशन उपयोगकर्ताओं को डिजिटल दुनिया में सुरक्षित रहने के लिए ज्ञान और उपकरणों से सशक्त बनाना है।',
    allRightsReserved: 'सर्वाधिकार सुरक्षित।',
  },
  punjabi: {
    // Common
    settings: 'ਸੈਟਿੰਗਾਂ',
    profile: 'ਪ੍ਰੋਫਾਈਲ',
    language: 'ਭਾਸ਼ਾ',
    aboutUs: 'ਸਾਡੇ ਬਾਰੇ',
    logout: 'ਲੌਗ ਆਊਟ',
    save: 'ਸੇਵ ਕਰੋ',
    cancel: 'ਰੱਦ ਕਰੋ',
    back: 'ਵਾਪਸ',
    
    // Settings Screen
    preferences: 'ਤਰਜੀਹਾਂ',
    aboutTeam: 'VaultVu ਦੇ ਪਿੱਛੇ ਟੀਮ ਬਾਰੇ ਜਾਣੋ',
    
    // Profile Screen
    userProfile: 'ਯੂਜ਼ਰ ਪ੍ਰੋਫਾਈਲ',
    email: 'ਈਮੇਲ',
    username: 'ਯੂਜ਼ਰਨੇਮ',
    dateOfBirth: 'ਜਨਮ ਮਿਤੀ',
    country: 'ਦੇਸ਼',
    gender: 'ਲਿੰਗ',
    saveProfile: 'ਪ੍ਰੋਫਾਈਲ ਸੇਵ ਕਰੋ',
    
    // Language Screen
    selectLanguage: 'ਐਪ ਇੰਟਰਫੇਸ ਲਈ ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ।',
    languageChanged: 'ਭਾਸ਼ਾ ਬਦਲੀ ਗਈ',
    languageChangeMessage: 'ਐਪ ਦੀ ਭਾਸ਼ਾ ਬਦਲ ਦਿੱਤੀ ਗਈ ਹੈ। ਕੁਝ ਤਬਦੀਲੀਆਂ ਲਈ ਐਪ ਨੂੰ ਮੁੜ ਚਾਲੂ ਕਰਨ ਦੀ ਲੋੜ ਹੋ ਸਕਦੀ ਹੈ।',
    
    // About Us Screen
    ourTeam: 'ਸਾਡੀ ਟੀਮ',
    contactUs: 'ਸੰਪਰਕ ਕਰੋ',
    appDescription: 'VaultVu ਇੱਕ ਵਿਆਪਕ ਸੁਰੱਖਿਆ ਐਪਲੀਕੇਸ਼ਨ ਹੈ ਜੋ ਉਪਭੋਗਤਾਵਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਕਿਸਮਾਂ ਦੀਆਂ ਵਿੱਤੀ ਧੋਖਾਧੜੀ ਅਤੇ ਘੁਟਾਲਿਆਂ ਤੋਂ ਬਚਾਉਣ ਲਈ ਡਿਜ਼ਾਈਨ ਕੀਤੀ ਗਈ ਹੈ। ਸਾਡਾ ਮਿਸ਼ਨ ਉਪਭੋਗਤਾਵਾਂ ਨੂੰ ਡਿਜੀਟਲ ਦੁਨੀਆ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਰਹਿਣ ਲਈ ਗਿਆਨ ਅਤੇ ਟੂਲਜ਼ ਨਾਲ ਸ਼ਕਤੀਸ਼ਾਲੀ ਬਣਾਉਣਾ ਹੈ।',
    allRightsReserved: 'ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।',
  },
};

// Create the context
const LanguageContext = createContext();

// Create provider component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [translations, setTranslations] = useState(translationsData.english);

  useEffect(() => {
    // Load saved language preference
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage) {
          setCurrentLanguage(savedLanguage);
          setTranslations(translationsData[savedLanguage]);
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
      }
    };

    loadLanguage();
  }, []);

  // Function to change language
  const changeLanguage = async (languageId) => {
    try {
      await AsyncStorage.setItem('language', languageId);
      setCurrentLanguage(languageId);
      setTranslations(translationsData[languageId]);
      return true;
    } catch (error) {
      console.error('Error saving language preference:', error);
      return false;
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, translations, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);