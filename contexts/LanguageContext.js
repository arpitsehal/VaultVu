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

    // Home Screen
    yourShieldInDigitalWorld: 'Your Shield in the Digital World',
    tipOfTheDay: 'Tip of the Day',
    quickAccessModules: 'Quick Access',
    essentialModules: 'Essential Modules',
    voiceFraudChecker: 'Voice Fraud Checker',
    voiceFraudCheckerDesc: 'Check if the voice is fraudulent or not.',
    checkSpam: 'Check Spam',
    checkSpamDesc: 'Protect you from spam and phishing attempts.',
    urlFraudChecker: 'URL Fraud Checker',
    urlFraudCheckerDesc: 'Help you to identify if a given URL is genuine or not.',
    fraudMessageChecker: 'Fraud Message Checker',
    fraudMessageCheckerDesc: 'Check if the message is fraudulent or not.',
    learningModules: 'Learning Modules',
    scamProtection: 'Scam Protection',
    scamProtectionDesc: 'Identify and avoid common scams and phishing attempts.',
    fraudProtection: 'Fraud Protection',
    fraudProtectionDesc: 'Safeguard your bank accounts and financial transactions.',
    testYourKnowledge: 'Test Your Knowledge',
    financialLiteracyQuiz: 'Financial Literacy Quiz',
    financialLiteracyQuizDesc: 'Test your knowledge and improve your financial IQ!',
    leaderboard: 'Leaderboard',
    leaderboardDesc: 'See how you rank among other security champions!',
    report: 'Report',
    reportAnIssue: 'Report an Issue',
    reportAnIssueDesc: 'Quickly report any suspicious activity or security concerns.',

    // Sign In Screen
    signIn: 'Sign in',
    signInTo: 'Sign in to',
    password: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    signUp: 'Sign up',
    orContinueWith: 'Or continue with',
    emailRequired: 'Email is required',
    invalidEmail: 'Please enter a valid email address',
    passwordRequired: 'Password is required',
    signInSuccess: 'Signed in successfully!',
    signInFailed: 'Sign-in failed. Please try again.',
    networkError: 'Could not connect to the server. Please check the network connection and the server IP address.',
    validationError: 'Please correct the highlighted errors.',

    // Voice Theft Checker Screen
    voiceTheftChecker: 'Voice Theft Checker',
    detectDeepfakeVoice: 'Detect deepfake voice messages',
    uploadPrompt: 'Upload a voice message to check for signs of fraud or manipulation.',
    selectAudioFile: 'Select Audio File',
    changeAudioFile: 'Change Audio File',
    selected: 'Selected',
    checkVoiceMessage: 'Check Voice Message',
    noFileSelected: 'No File Selected',
    selectFileMessage: 'Please select an audio file to check.',
    fileSelected: 'File Selected',
    readyToCheck: 'Ready to check',
    apiError: 'API Error',
    apiErrorMessage: 'Could not check the voice message. Please try again.',
    checkComplete: 'Check Complete',
    voiceGenuine: 'Voice message appears genuine',
    potentialFraud: 'Potential fraud detected',
    riskScore: 'Risk Score',
    reasonsTitle: 'Reasons for the score:',
    warningText: 'This message shows signs of potential manipulation. Proceed with caution.',
    ok: 'OK',
    goBack: 'Back',

    // Check Spam Screen
    verifyPhoneNumbers: 'Verify phone numbers for spam',
    spamPrompt: 'Enter a mobile number to check for spam or fraudulent activity.',
    enterMobileNumber: 'Enter mobile number',
    checkNumber: 'Check Number',
    inputRequired: 'Input Required',
    inputRequiredMessage: 'Please enter a mobile number to check.',
    numberGenuine: 'The number appears genuine',
    numberSuspicious: 'Suspicious number detected',
    apiConnectionError: 'Could not connect to the server. Please try again.',
    additionalDetails: 'Additional Details:',
    carrier: 'Carrier',
    location: 'Location',
    lineType: 'Line Type',
    spamWarningText: 'Be cautious! This number shows signs of potential spam or fraud.',

    // URL Theft Checker Screen
    urlSafetyChecker: 'URL Safety Checker',
    verifyWebsiteSafety: 'Verify website safety & detect threats',
    urlPrompt: 'Enter a website URL to analyze for potential security threats, phishing attempts, and malicious content.',
    enterUrlPlaceholder: 'https://example.com',
    analyzeWebsiteSafety: 'Analyze Website Safety',
    invalidUrl: 'Invalid URL',
    invalidUrlMessage: 'Please enter a valid website URL.',
    urlSafe: 'The URL appears safe to visit',
    potentialRisk: 'Potential risk detected. Exercise caution!',
    potentialRiskDetected: 'Potential risk detected',
    category: 'Category',
    analysisDetails: 'Analysis details:',
    urlWarningText: 'This URL shows signs of potential phishing, malware, or fraud. Proceed with extreme caution.',

    // Fraud Message Checker Screen
    messageFraudChecker: 'Message Fraud Checker',
    analyzeMessages: 'Analyze messages for fraudulent content',
    messagePrompt: 'Enter a message to check for potential fraud or scam content.',
    pasteMessagePlaceholder: 'Paste message text here',
    checkMessage: 'Check Message',
    enterMessageToCheck: 'Please enter a message to check.',
    messageGenuine: 'The message appears genuine',
    messageWarningText: 'Be cautious! This message shows signs of potential fraud or scam.',

    // Scam Protection Screen
    scamProtectionScreenTitle: 'Scam Protection',
    scamProtectionTitle_blackmail: 'Blackmail Scams',
    scamProtectionTitle_charity: 'Charity Scams',
    scamProtectionTitle_debtCollection: 'Debt Collection Scams',
    scamProtectionTitle_debtSettlement: 'Debt Settlement and Debt Relief Scams',
    scamProtectionTitle_rbiMisuse: 'RBI Logo Misuse',
    scamProtectionTitle_foreclosureRelief: 'Foreclosure Relief or Mortgage Loan Modification Scams',
    scamProtectionTitle_grandparent: 'Grandparent Scams',
    scamProtectionTitle_impostor: 'Impostor Scams',
    scamProtectionTitle_lottery: 'Lottery or Prize Scams',
    scamProtectionTitle_mailFraud: 'Mail Fraud',
    scamProtectionTitle_manInMiddle: 'Man-in-the-Middle Scams',
    scamProtectionTitle_moneyMule: 'Money Mule Scams',
    scamProtectionTitle_moneyTransfer: 'Money Transfer or Mobile Payment Services Fraud',
    scamProtectionTitle_mortgageClosing: 'Mortgage Closing Scams',
    scamProtectionTitle_nonexistentGoods: 'Sale of Nonexistent Goods or Services Scams',

    // Fraud Protection Screen
    fraudProtectionScreenTitle: 'Fraud Protection (RBI India)',
    fraudTitle_phishing: 'Phishing Fraud',
    fraudTitle_cardCloning: 'Card Cloning/Skimming',
    fraudTitle_upiFraud: 'UPI/Internet Banking Fraud',
    fraudTitle_loanFraud: 'Fake Loan Apps & Loan Fraud',
    fraudTitle_kycFraud: 'KYC Update Fraud',
    fraudTitle_atmFraud: 'ATM Fraud',
    fraudTitle_investmentFraud: 'Investment & Ponzi Schemes',
    fraudTitle_insuranceFraud: 'Insurance Fraud',
    fraudTitle_identityTheft: 'Identity Theft',
    fraudTitle_fakeCustomerCare: 'Fake Customer Care',

    // Onboarding Screen
    onboardingDescription: 'Secure your digital life with VaultVu. Experience seamless and secure access to your information.',
    onboardingSignInButton: 'SIGN IN OR SIGN UP',
    onboardingCopyright: 'Copyright © 2025 Punjab and Sindh Bank',
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

    // Home Screen
    yourShieldInDigitalWorld: 'डिजिटल दुनिया में आपकी सुरक्षा',
    tipOfTheDay: 'आज का टिप',
    quickAccessModules: 'त्वरित पहुंच',
    essentialModules: 'आवश्यक मॉड्यूल',
    voiceFraudChecker: 'वॉयस फ्रॉड चेकर',
    voiceFraudCheckerDesc: 'जांचें कि क्या आवाज धोखाधड़ी वाली है या नहीं।',
    checkSpam: 'स्पैम की जांच करें',
    checkSpamDesc: 'आपको स्पैम और फ़िशिंग प्रयासों से बचाएं।',
    urlFraudChecker: 'यूआरएल फ्रॉड चेकर',
    urlFraudCheckerDesc: 'आपको यह पहचानने में मदद करता है कि दिया गया यूआरएल असली है या नहीं।',
    fraudMessageChecker: 'धोखाधड़ी संदेश चेकर',
    fraudMessageCheckerDesc: 'जांचें कि क्या संदेश धोखाधड़ी वाला है या नहीं।',
    learningModules: 'लर्निंग मॉड्यूल',
    scamProtection: 'घोटाला संरक्षण',
    scamProtectionDesc: 'सामान्य घोटालों और फ़िशिंग प्रयासों को पहचानें और उनसे बचें।',
    fraudProtection: 'धोखाधड़ी से सुरक्षा',
    fraudProtectionDesc: 'अपने बैंक खातों और वित्तीय लेनदेन को सुरक्षित रखें।',
    testYourKnowledge: 'अपने ज्ञान का परीक्षण करें',
    financialLiteracyQuiz: 'वित्तीय साक्षरता क्विज़',
    financialLiteracyQuizDesc: 'अपने ज्ञान का परीक्षण करें और अपने वित्तीय आईक्यू में सुधार करें!',
    leaderboard: 'लीडरबोर्ड',
    leaderboardDesc: 'देखें कि आप अन्य सुरक्षा चैंपियंस के बीच कैसे रैंक करते हैं!',
    report: 'रिपोर्ट',
    reportAnIssue: 'एक समस्या की रिपोर्ट करें',
    reportAnIssueDesc: 'किसी भी संदिग्ध गतिविधि या सुरक्षा संबंधी चिंताओं की तुरंत रिपोर्ट करें।',

    // Sign In Screen
    signIn: 'साइन इन',
    signInTo: 'साइन इन करें',
    password: 'पासवर्ड',
    rememberMe: 'मुझे याद रखें',
    forgotPassword: 'पासवर्ड भूल गए?',
    dontHaveAccount: "खाता नहीं है?",
    signUp: 'साइन अप',
    orContinueWith: 'या जारी रखें',
    emailRequired: 'ईमेल आवश्यक है',
    invalidEmail: 'कृपया एक वैध ईमेल पता दर्ज करें',
    passwordRequired: 'पासवर्ड आवश्यक है',
    signInSuccess: 'सफलतापूर्वक साइन इन किया गया!',
    signInFailed: 'साइन इन विफल। कृपया पुनः प्रयास करें।',
    networkError: 'सर्वर से कनेक्ट नहीं हो सका। कृपया नेटवर्क कनेक्शन और सर्वर आईपी पते की जांच करें।',
    validationError: 'कृपया हाइलाइट की गई त्रुटियों को ठीक करें।',

    // Voice Theft Checker Screen
    voiceTheftChecker: 'वॉयस चोरी चेकर',
    detectDeepfakeVoice: 'डीपफेक वॉयस संदेशों का पता लगाएं',
    uploadPrompt: 'धोखाधड़ी या छेड़छाड़ के संकेतों की जांच के लिए एक वॉयस संदेश अपलोड करें।',
    selectAudioFile: 'ऑडियो फ़ाइल चुनें',
    changeAudioFile: 'ऑडियो फ़ाइल बदलें',
    selected: 'चुना गया',
    checkVoiceMessage: 'वॉयस संदेश की जांच करें',
    noFileSelected: 'कोई फ़ाइल नहीं चुनी गई',
    selectFileMessage: 'जांच के लिए कृपया एक ऑडियो फ़ाइल चुनें।',
    fileSelected: 'फ़ाइल चुनी गई',
    readyToCheck: 'जांच के लिए तैयार',
    apiError: 'एपीआई त्रुटि',
    apiErrorMessage: 'वॉयस संदेश की जांच नहीं हो सकी। कृपया पुनः प्रयास करें।',
    checkComplete: 'जांच पूरी हुई',
    voiceGenuine: 'वॉयस संदेश असली प्रतीत होता है',
    potentialFraud: 'संभावित धोखाधड़ी का पता चला',
    riskScore: 'जोखिम स्कोर',
    reasonsTitle: 'स्कोर के कारण:',
    warningText: 'यह संदेश संभावित हेरफेर के संकेत दिखाता है। सावधानी के साथ आगे बढ़ें।',
    ok: 'ठीक है',
    goBack: 'वापस',

    // Check Spam Screen
    verifyPhoneNumbers: 'स्पैम के लिए फोन नंबरों का सत्यापन करें',
    spamPrompt: 'स्पैम या धोखाधड़ी गतिविधि के लिए जांच करने के लिए एक मोबाइल नंबर दर्ज करें।',
    enterMobileNumber: 'मोबाइल नंबर दर्ज करें',
    checkNumber: 'नंबर की जांच करें',
    inputRequired: 'इनपुट आवश्यक है',
    inputRequiredMessage: 'जांच के लिए कृपया एक मोबाइल नंबर दर्ज करें।',
    numberGenuine: 'नंबर असली प्रतीत होता है',
    numberSuspicious: 'संदिग्ध नंबर का पता चला',
    apiConnectionError: 'सर्वर से कनेक्ट नहीं हो सका। कृपया पुनः प्रयास करें।',
    additionalDetails: 'अतिरिक्त विवरण:',
    carrier: 'कैरियर',
    location: 'स्थान',
    lineType: 'लाइन प्रकार',
    spamWarningText: 'सावधान रहें! यह नंबर संभावित स्पैम या धोखाधड़ी के संकेत दिखाता है।',

    // URL Theft Checker Screen
    urlSafetyChecker: 'यूआरएल सुरक्षा चेकर',
    verifyWebsiteSafety: 'वेबसाइट की सुरक्षा सत्यापित करें और खतरों का पता लगाएं',
    urlPrompt: 'संभावित सुरक्षा खतरों, फ़िशिंग प्रयासों और दुर्भावनापूर्ण सामग्री का विश्लेषण करने के लिए एक वेबसाइट यूआरएल दर्ज करें।',
    enterUrlPlaceholder: 'https://example.com',
    analyzeWebsiteSafety: 'वेबसाइट सुरक्षा का विश्लेषण करें',
    invalidUrl: 'अवैध यूआरएल',
    invalidUrlMessage: 'कृपया एक वैध वेबसाइट यूआरएल दर्ज करें।',
    urlSafe: 'यूआरएल देखने के लिए सुरक्षित प्रतीत होता है',
    potentialRisk: 'संभावित जोखिम का पता चला। सावधानी बरतें!',
    potentialRiskDetected: 'संभावित जोखिम का पता चला',
    category: 'श्रेणी',
    analysisDetails: 'विश्लेषण विवरण:',
    urlWarningText: 'यह यूआरएल संभावित फ़िशिंग, मैलवेयर या धोखाधड़ी के संकेत दिखाता है। अत्यधिक सावधानी के साथ आगे बढ़ें।',

    // Fraud Message Checker Screen
    messageFraudChecker: 'संदेश धोखाधड़ी चेकर',
    analyzeMessages: 'धोखाधड़ी वाली सामग्री के लिए संदेशों का विश्लेषण करें',
    messagePrompt: 'संभावित धोखाधड़ी या घोटाले की सामग्री की जांच के लिए एक संदेश दर्ज करें।',
    pasteMessagePlaceholder: 'संदेश पाठ यहां पेस्ट करें',
    checkMessage: 'संदेश की जांच करें',
    enterMessageToCheck: 'जांच के लिए कृपया एक संदेश दर्ज करें।',
    messageGenuine: 'संदेश असली प्रतीत होता है',
    messageWarningText: 'सावधान रहें! यह संदेश संभावित धोखाधड़ी या घोटाले के संकेत दिखाता है।',

    // Scam Protection Screen
    scamProtectionScreenTitle: 'घोटाला संरक्षण',
    scamProtectionTitle_blackmail: 'ब्लैकमेल घोटाले',
    scamProtectionTitle_charity: 'धर्मार्थ घोटाले',
    scamProtectionTitle_debtCollection: 'ऋण संग्रह घोटाले',
    scamProtectionTitle_debtSettlement: 'ऋण निपटान और ऋण राहत घोटाले',
    scamProtectionTitle_rbiMisuse: 'आरबीआई लोगो का दुरुपयोग',
    scamProtectionTitle_foreclosureRelief: 'फोरक्लोजर रिलीफ या मॉर्गेज लोन संशोधन घोटाले',
    scamProtectionTitle_grandparent: 'दादा-दादी के घोटाले',
    scamProtectionTitle_impostor: 'धोखेबाज घोटाले',
    scamProtectionTitle_lottery: 'लॉटरी या पुरस्कार घोटाले',
    scamProtectionTitle_mailFraud: 'मेल धोखाधड़ी',
    scamProtectionTitle_manInMiddle: 'मैन-इन-द-मिडिल घोटाले',
    scamProtectionTitle_moneyMule: 'मनी म्यूल घोटाले',
    scamProtectionTitle_moneyTransfer: 'मनी ट्रांसफर या मोबाइल भुगतान सेवा धोखाधड़ी',
    scamProtectionTitle_mortgageClosing: 'बंधक समापन घोटाले',
    scamProtectionTitle_nonexistentGoods: 'अस्तित्वहीन सामान या सेवाओं की बिक्री के घोटाले',

    // Fraud Protection Screen
    fraudProtectionScreenTitle: 'धोखाधड़ी से सुरक्षा (RBI भारत)',
    fraudTitle_phishing: 'फ़िशिंग धोखाधड़ी',
    fraudTitle_cardCloning: 'कार्ड क्लोनिंग/स्किमिंग',
    fraudTitle_upiFraud: 'यूपीआई/इंटरनेट बैंकिंग धोखाधड़ी',
    fraudTitle_loanFraud: 'फर्जी लोन ऐप्स और लोन धोखाधड़ी',
    fraudTitle_kycFraud: 'केवाईसी अपडेट धोखाधड़ी',
    fraudTitle_atmFraud: 'एटीएम धोखाधड़ी',
    fraudTitle_investmentFraud: 'निवेश और पोंजी योजनाएं',
    fraudTitle_insuranceFraud: 'बीमा धोखाधड़ी',
    fraudTitle_identityTheft: 'पहचान की चोरी',
    fraudTitle_fakeCustomerCare: 'फर्जी ग्राहक सेवा',

    // Onboarding Screen
    onboardingDescription: 'VaultVu के साथ अपने डिजिटल जीवन को सुरक्षित करें। अपनी जानकारी तक निर्बाध और सुरक्षित पहुंच का अनुभव करें।',
    onboardingSignInButton: 'साइन इन या साइन अप',
    onboardingCopyright: 'कॉपीराइट © 2025 पंजाब एंड सिंध बैंक',
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

    // Home Screen
    yourShieldInDigitalWorld: 'ਡਿਜੀਟਲ ਸੰਸਾਰ ਵਿੱਚ ਤੁਹਾਡੀ ਢਾਲ',
    tipOfTheDay: 'ਅੱਜ ਦੀ ਟਿਪ',
    quickAccessModules: 'ਤੁਰੰਤ ਪਹੁੰਚ',
    essentialModules: 'ਜ਼ਰੂਰੀ ਮੋਡੀਊਲ',
    voiceFraudChecker: 'ਵੌਇਸ ਫਰਾਡ ਚੈਕਰ',
    voiceFraudCheckerDesc: 'ਜਾਂਚ ਕਰੋ ਕਿ ਕੀ ਆਵਾਜ਼ ਧੋਖੇ ਵਾਲੀ ਹੈ ਜਾਂ ਨਹੀਂ।',
    checkSpam: 'ਸਪੈਮ ਦੀ ਜਾਂਚ ਕਰੋ',
    checkSpamDesc: 'ਤੁਹਾਨੂੰ ਸਪੈਮ ਅਤੇ ਫਿਸ਼ਿੰਗ ਕੋਸ਼ਿਸ਼ਾਂ ਤੋਂ ਬਚਾਓ।',
    urlFraudChecker: 'URL ਫਰਾਡ ਚੈਕਰ',
    urlFraudCheckerDesc: 'ਇਹ ਪਛਾਣਨ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰੋ ਕਿ ਕੀ ਦਿੱਤਾ ਗਿਆ URL ਅਸਲੀ ਹੈ ਜਾਂ ਨਹੀਂ।',
    fraudMessageChecker: 'ਧੋਖਾਧੜੀ ਸੰਦੇਸ਼ ਚੈਕਰ',
    fraudMessageCheckerDesc: 'ਜਾਂਚ ਕਰੋ ਕਿ ਕੀ ਸੰਦੇਸ਼ ਧੋਖੇ ਵਾਲਾ ਹੈ ਜਾਂ ਨਹੀਂ।',
    learningModules: 'ਲਰਨਿੰਗ ਮੋਡੀਊਲ',
    scamProtection: 'ਸਕੈਮ ਪ੍ਰੋਟੈਕਸ਼ਨ',
    scamProtectionDesc: 'ਆਮ ਘੁਟਾਲਿਆਂ ਅਤੇ ਫਿਸ਼ਿੰਗ ਕੋਸ਼ਿਸ਼ਾਂ ਦੀ ਪਛਾਣ ਕਰੋ ਅਤੇ ਉਹਨਾਂ ਤੋਂ ਬਚੋ।',
    fraudProtection: 'ਧੋਖਾਧੜੀ ਤੋਂ ਸੁਰੱਖਿਆ',
    fraudProtectionDesc: 'ਆਪਣੇ ਬੈਂਕ ਖਾਤਿਆਂ ਅਤੇ ਵਿੱਤੀ ਲੈਣ-ਦੇਣ ਦੀ ਸੁਰੱਖਿਆ ਕਰੋ।',
    testYourKnowledge: 'ਆਪਣੇ ਗਿਆਨ ਦੀ ਜਾਂਚ ਕਰੋ',
    financialLiteracyQuiz: 'ਵਿੱਤੀ ਸਾਖਰਤਾ ਕੁਇਜ਼',
    financialLiteracyQuizDesc: 'ਆਪਣੇ ਗਿਆਨ ਦੀ ਜਾਂਚ ਕਰੋ ਅਤੇ ਆਪਣੇ ਵਿੱਤੀ ਆਈਕਿਊ ਨੂੰ ਸੁਧਾਰੋ!',
    leaderboard: 'ਲੀਡਰਬੋਰਡ',
    leaderboardDesc: 'ਦੇਖੋ ਕਿ ਤੁਸੀਂ ਦੂਜੇ ਸੁਰੱਖਿਆ ਚੈਂਪੀਅਨਾਂ ਵਿੱਚ ਕਿਵੇਂ ਦਰਜਾ ਪ੍ਰਾਪਤ ਕਰਦੇ ਹੋ!',
    report: 'ਰਿਪੋਰਟ',
    reportAnIssue: 'ਇੱਕ ਸਮੱਸਿਆ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
    reportAnIssueDesc: 'ਕਿਸੇ ਵੀ ਸ਼ੱਕੀ ਗਤੀਵਿਧੀ ਜਾਂ ਸੁਰੱਖਿਆ ਚਿੰਤਾਵਾਂ ਦੀ ਤੁਰੰਤ ਰਿਪੋਰਟ ਕਰੋ।',

    // Sign In Screen
    signIn: 'ਸਾਈਨ ਇਨ',
    signInTo: 'ਸਾਈਨ ਇਨ ਕਰੋ',
    password: 'ਪਾਸਵਰਡ',
    rememberMe: 'ਮੈਨੂੰ ਯਾਦ ਰੱਖੋ',
    forgotPassword: 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?',
    dontHaveAccount: "ਖਾਤਾ ਨਹੀਂ ਹੈ?",
    signUp: 'ਸਾਈਨ ਅੱਪ',
    orContinueWith: 'ਜਾਂ ਇਸ ਨਾਲ ਜਾਰੀ ਰੱਖੋ',
    emailRequired: 'ਈਮੇਲ ਲੋੜੀਂਦੀ ਹੈ',
    invalidEmail: 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ ਈਮੇਲ ਪਤਾ ਦਾਖਲ ਕਰੋ',
    passwordRequired: 'ਪਾਸਵਰਡ ਲੋੜੀਂਦਾ ਹੈ',
    signInSuccess: 'ਸਫਲਤਾਪੂਰਵਕ ਸਾਈਨ ਇਨ ਕੀਤਾ ਗਿਆ!',
    signInFailed: 'ਸਾਈਨ-ਇਨ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    networkError: 'ਸਰਵਰ ਨਾਲ ਕਨੈਕਟ ਨਹੀਂ ਕਰ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਨੈੱਟਵਰਕ ਕਨੈਕਸ਼ਨ ਅਤੇ ਸਰਵਰ IP ਪਤੇ ਦੀ ਜਾਂਚ ਕਰੋ।',
    validationError: 'ਕਿਰਪਾ ਕਰਕੇ ਹਾਈਲਾਈਟ ਕੀਤੀਆਂ ਤਰੁੱਟੀਆਂ ਨੂੰ ਠੀਕ ਕਰੋ।',

    // Voice Theft Checker Screen
    voiceTheftChecker: 'ਵੌਇਸ ਚੋਰੀ ਚੈਕਰ',
    detectDeepfakeVoice: 'ਡੀਪਫੇਕ ਵੌਇਸ ਸੰਦੇਸ਼ਾਂ ਦਾ ਪਤਾ ਲਗਾਓ',
    uploadPrompt: 'ਧੋਖਾਧੜੀ ਜਾਂ ਹੇਰਾਫੇਰੀ ਦੇ ਸੰਕੇਤਾਂ ਦੀ ਜਾਂਚ ਕਰਨ ਲਈ ਇੱਕ ਵੌਇਸ ਸੰਦੇਸ਼ ਅੱਪਲੋਡ ਕਰੋ।',
    selectAudioFile: 'ਆਡੀਓ ਫਾਈਲ ਚੁਣੋ',
    changeAudioFile: 'ਆਡੀਓ ਫਾਈਲ ਬਦਲੋ',
    selected: 'ਚੁਣਿਆ ਗਿਆ',
    checkVoiceMessage: 'ਵੌਇਸ ਸੰਦੇਸ਼ ਦੀ ਜਾਂਚ ਕਰੋ',
    noFileSelected: 'ਕੋਈ ਫਾਈਲ ਨਹੀਂ ਚੁਣੀ ਗਈ',
    selectFileMessage: 'ਜਾਂਚ ਕਰਨ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਆਡੀਓ ਫਾਈਲ ਚੁਣੋ।',
    fileSelected: 'ਫਾਈਲ ਚੁਣੀ ਗਈ',
    readyToCheck: 'ਜਾਂਚ ਕਰਨ ਲਈ ਤਿਆਰ',
    apiError: 'API ਗਲਤੀ',
    apiErrorMessage: 'ਵੌਇਸ ਸੰਦੇਸ਼ ਦੀ ਜਾਂਚ ਨਹੀਂ ਹੋ ਸਕੀ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    checkComplete: 'ਜਾਂਚ ਪੂਰੀ ਹੋ ਗਈ',
    voiceGenuine: 'ਵੌਇਸ ਸੰਦੇਸ਼ ਅਸਲੀ ਜਾਪਦਾ ਹੈ',
    potentialFraud: 'ਸੰਭਾਵਿਤ ਧੋਖਾਧੜੀ ਦਾ ਪਤਾ ਲੱਗਾ',
    riskScore: 'ਜੋਖਮ ਸਕੋਰ',
    reasonsTitle: 'ਸਕੋਰ ਦੇ ਕਾਰਨ:',
    warningText: 'ਇਹ ਸੰਦੇਸ਼ ਸੰਭਾਵਿਤ ਹੇਰਾਫੇਰੀ ਦੇ ਸੰਕੇਤ ਦਿਖਾਉਂਦਾ ਹੈ। ਸਾਵਧਾਨੀ ਨਾਲ ਅੱਗੇ ਵਧੋ।',
    ok: 'ਠੀਕ ਹੈ',
    goBack: 'ਵਾਪਸ',

    // Check Spam Screen
    verifyPhoneNumbers: 'ਸਪੈਮ ਲਈ ਫ਼ੋਨ ਨੰਬਰਾਂ ਦੀ ਜਾਂਚ ਕਰੋ',
    spamPrompt: 'ਸਪੈਮ ਜਾਂ ਧੋਖਾਧੜੀ ਵਾਲੀ ਗਤੀਵਿਧੀ ਲਈ ਜਾਂਚ ਕਰਨ ਲਈ ਇੱਕ ਮੋਬਾਈਲ ਨੰਬਰ ਦਾਖਲ ਕਰੋ।',
    enterMobileNumber: 'ਮੋਬਾਈਲ ਨੰਬਰ ਦਾਖਲ ਕਰੋ',
    checkNumber: 'ਨੰਬਰ ਦੀ ਜਾਂਚ ਕਰੋ',
    inputRequired: 'ਇਨਪੁਟ ਲੋੜੀਂਦਾ ਹੈ',
    inputRequiredMessage: 'ਜਾਂਚ ਕਰਨ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਮੋਬਾਈਲ ਨੰਬਰ ਦਾਖਲ ਕਰੋ।',
    numberGenuine: 'ਨੰਬਰ ਅਸਲੀ ਜਾਪਦਾ ਹੈ',
    numberSuspicious: 'ਸ਼ੱਕੀ ਨੰਬਰ ਦਾ ਪਤਾ ਲੱਗਾ',
    apiConnectionError: 'ਸਰਵਰ ਨਾਲ ਕਨੈਕਟ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    additionalDetails: 'ਵਾਧੂ ਵੇਰਵੇ:',
    carrier: 'ਕੈਰੀਅਰ',
    location: 'ਟਿਕਾਣਾ',
    lineType: 'ਲਾਈਨ ਕਿਸਮ',
    spamWarningText: 'ਸਾਵਧਾਨ ਰਹੋ! ਇਹ ਨੰਬਰ ਸੰਭਾਵਿਤ ਸਪੈਮ ਜਾਂ ਧੋਖਾਧੜੀ ਦੇ ਸੰਕੇਤ ਦਿਖਾਉਂਦਾ ਹੈ।',

    // URL Theft Checker Screen
    urlSafetyChecker: 'URL ਸੁਰੱਖਿਆ ਚੈਕਰ',
    verifyWebsiteSafety: 'ਵੈੱਬਸਾਈਟ ਦੀ ਸੁਰੱਖਿਆ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਖਤਰਿਆਂ ਦਾ ਪਤਾ ਲਗਾਓ',
    urlPrompt: 'ਸੰਭਾਵੀ ਸੁਰੱਖਿਆ ਖਤਰਿਆਂ, ਫਿਸ਼ਿੰਗ ਕੋਸ਼ਿਸ਼ਾਂ, ਅਤੇ ਖਤਰਨਾਕ ਸਮੱਗਰੀ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਨ ਲਈ ਇੱਕ ਵੈੱਬਸਾਈਟ URL ਦਾਖਲ ਕਰੋ।',
    enterUrlPlaceholder: 'https://example.com',
    analyzeWebsiteSafety: 'ਵੈੱਬਸਾਈਟ ਸੁਰੱਖਿਆ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ',
    invalidUrl: 'ਗਲਤ URL',
    invalidUrlMessage: 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ ਵੈੱਬਸਾਈਟ URL ਦਾਖਲ ਕਰੋ।',
    urlSafe: 'URL ਦੇਖਣ ਲਈ ਸੁਰੱਖਿਅਤ ਲੱਗਦਾ ਹੈ',
    potentialRisk: 'ਸੰਭਾਵੀ ਖਤਰਾ ਪਾਇਆ ਗਿਆ। ਸਾਵਧਾਨੀ ਵਰਤੋ!',
    potentialRiskDetected: 'ਸੰਭਾਵੀ ਖਤਰਾ ਪਾਇਆ ਗਿਆ',
    category: 'ਸ਼੍ਰੇਣੀ',
    analysisDetails: 'ਵਿਸ਼ਲੇਸ਼ਣ ਵੇਰਵੇ:',
    urlWarningText: 'ਇਹ URL ਸੰਭਾਵੀ ਫਿਸ਼ਿੰਗ, ਮਾਲਵੇਅਰ ਜਾਂ ਧੋਖਾਧੜੀ ਦੇ ਸੰਕੇਤ ਦਿਖਾਉਂਦਾ ਹੈ। ਬਹੁਤ ਸਾਵਧਾਨੀ ਨਾਲ ਅੱਗੇ ਵਧੋ।',

    // Fraud Message Checker Screen
    messageFraudChecker: 'ਸੰਦੇਸ਼ ਧੋਖਾਧੜੀ ਚੈਕਰ',
    analyzeMessages: 'ਧੋਖਾਧੜੀ ਵਾਲੀ ਸਮੱਗਰੀ ਲਈ ਸੰਦੇਸ਼ਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ',
    messagePrompt: 'ਸੰਭਾਵੀ ਧੋਖਾਧੜੀ ਜਾਂ ਘੁਟਾਲੇ ਦੀ ਜਾਂਚ ਲਈ ਇੱਕ ਸੰਦੇਸ਼ ਦਾਖਲ ਕਰੋ।',
    pasteMessagePlaceholder: 'ਸੰਦੇਸ਼ ਪਾਠ ਇੱਥੇ ਪੇਸਟ ਕਰੋ',
    checkMessage: 'ਸੰਦੇਸ਼ ਦੀ ਜਾਂਚ ਕਰੋ',
    enterMessageToCheck: 'ਜਾਂਚ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਸੰਦੇਸ਼ ਦਾਖਲ ਕਰੋ।',
    messageGenuine: 'ਸੰਦੇਸ਼ ਅਸਲੀ ਲੱਗਦਾ ਹੈ',
    messageWarningText: 'ਸਾਵਧਾਨ ਰਹੋ! ਇਹ ਸੰਦੇਸ਼ ਸੰਭਾਵੀ ਧੋਖਾਧੜੀ ਜਾਂ ਘੁਟਾਲੇ ਦੇ ਸੰਕੇਤ ਦਿਖਾਉਂਦਾ ਹੈ।',

    // Scam Protection Screen
    scamProtectionScreenTitle: 'ਸਕੈਮ ਪ੍ਰੋਟੈਕਸ਼ਨ',
    scamProtectionTitle_blackmail: 'ਬਲੈਕਮੇਲ ਸਕੈਮ',
    scamProtectionTitle_charity: 'ਚੈਰਿਟੀ ਸਕੈਮ',
    scamProtectionTitle_debtCollection: 'ਕਰਜ਼ਾ ਵਸੂਲੀ ਸਕੈਮ',
    scamProtectionTitle_debtSettlement: 'ਕਰਜ਼ਾ ਨਿਪਟਾਰਾ ਅਤੇ ਕਰਜ਼ਾ ਰਾਹਤ ਸਕੈਮ',
    scamProtectionTitle_rbiMisuse: 'RBI ਲੋਗੋ ਦੀ ਦੁਰਵਰਤੋਂ',
    scamProtectionTitle_foreclosureRelief: 'ਫੋਰਕਲੋਜ਼ਰ ਰਾਹਤ ਜਾਂ ਮੋਰਟਗੇਜ ਲੋਨ ਸੋਧ ਸਕੈਮ',
    scamProtectionTitle_grandparent: 'ਦਾਦਾ-ਦਾਦੀ ਸਕੈਮ',
    scamProtectionTitle_impostor: 'ਨਕਲੀ ਸਕੈਮ',
    scamProtectionTitle_lottery: 'ਲਾਟਰੀ ਜਾਂ ਇਨਾਮ ਸਕੈਮ',
    scamProtectionTitle_mailFraud: 'ਮੇਲ ਧੋਖਾਧੜੀ',
    scamProtectionTitle_manInMiddle: 'ਮੈਨ-ਇਨ-ਦ-ਮਿਡਲ ਸਕੈਮ',
    scamProtectionTitle_moneyMule: 'ਮਨੀ ਮਿਊਲ ਸਕੈਮ',
    scamProtectionTitle_moneyTransfer: 'ਮਨੀ ਟ੍ਰਾਂਸਫਰ ਜਾਂ ਮੋਬਾਈਲ ਭੁਗਤਾਨ ਸੇਵਾਵਾਂ ਧੋਖਾਧੜੀ',
    scamProtectionTitle_mortgageClosing: 'ਮੋਰਟਗੇਜ ਸਮਾਪਤੀ ਸਕੈਮ',
    scamProtectionTitle_nonexistentGoods: 'ਗੈਰ-ਮੌਜੂਦ ਵਸਤੂਆਂ ਜਾਂ ਸੇਵਾਵਾਂ ਦੀ ਵਿਕਰੀ ਦੇ ਸਕੈਮ',
    
    // Fraud Protection Screen
    fraudProtectionScreenTitle: 'ਧੋਖਾਧੜੀ ਤੋਂ ਸੁਰੱਖਿਆ (RBI ਭਾਰਤ)',
    fraudTitle_phishing: 'ਫਿਸ਼ਿੰਗ ਧੋਖਾਧੜੀ',
    fraudTitle_cardCloning: 'ਕਾਰਡ ਕਲੋਨਿੰਗ/ਸਕਿਮਿੰਗ',
    fraudTitle_upiFraud: 'UPI/ਇੰਟਰਨੈੱਟ ਬੈਂਕਿੰਗ ਧੋਖਾਧੜੀ',
    fraudTitle_loanFraud: 'ਜਾਅਲੀ ਲੋਨ ਐਪਸ ਅਤੇ ਲੋਨ ਧੋਖਾਧੜੀ',
    fraudTitle_kycFraud: 'KYC ਅੱਪਡੇਟ ਧੋਖਾਧੜੀ',
    fraudTitle_atmFraud: 'ਏ.ਟੀ.ਐਮ. ਧੋਖਾਧੜੀ',
    fraudTitle_investmentFraud: 'ਨਿਵੇਸ਼ ਅਤੇ ਪੌਂਜੀ ਸਕੀਮਾਂ',
    fraudTitle_insuranceFraud: 'ਬੀਮਾ ਧੋਖਾਧੜੀ',
    fraudTitle_identityTheft: 'ਪਛਾਣ ਦੀ ਚੋਰੀ',
    fraudTitle_fakeCustomerCare: 'ਜਾਅਲੀ ਗਾਹਕ ਦੇਖਭਾਲ',

    // Onboarding Screen
    onboardingDescription: 'VaultVu ਨਾਲ ਆਪਣੇ ਡਿਜੀਟਲ ਜੀਵਨ ਨੂੰ ਸੁਰੱਖਿਅਤ ਕਰੋ। ਆਪਣੀ ਜਾਣਕਾਰੀ ਤੱਕ ਸਹਿਜ ਅਤੇ ਸੁਰੱਖਿਅਤ ਪਹੁੰਚ ਦਾ ਅਨੁਭਵ ਕਰੋ।',
    onboardingSignInButton: 'ਸਾਈਨ ਇਨ ਜਾਂ ਸਾਈਨ ਅੱਪ',
    onboardingCopyright: 'ਕਾਪੀਰਾਈਟ © 2025 ਪੰਜਾਬ ਐਂਡ ਸਿੰਧ ਬੈਂਕ',
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