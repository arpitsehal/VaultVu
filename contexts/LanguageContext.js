import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

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
    appName: "VaultVu",
    budgetManager: 'Budget Manager',
    budgetManagerDesc: 'Manage your budgets, EMIs, SIPs and other financial tools.',
    aiAssistant: 'AI Assistant',
    aiAssistantDesc: 'Get instant help with banking fraud prevention!',
    dailyTips: [
      "Always use a strong, unique password for your banking apps and email.",
      "Never share your OTP or PIN with anyone, not even bank employees.",
      "Be cautious of unsolicited calls asking for personal financial information.",
      "Check your bank statements regularly for any unauthorized transactions.",
      "Use two-factor authentication (2FA) wherever possible for added security.",
      "Don't click on suspicious links in emails or text messages.",
      "Only download apps from official app stores like Google Play or the App Store.",
      "Use a separate email address for online banking and sensitive accounts.",
      "When shopping online, use secure connections (HTTPS) and reputable sites.",
      "Be skeptical of urgent requests for money, especially from family or friends online.",
      "Review your privacy settings on social media to limit public information.",
      "Shred documents with personal information before discarding them.",
      "Protect your Wi-Fi network with a strong password to prevent unauthorized access.",
      "Never use public Wi-Fi for sensitive activities like banking or shopping.",
    ],

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
    scamProtectionTitle_romance: 'Romance Scams',
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

    // Onboarding Screen 1
    onboardingDescription: 'Secure your digital life with VaultVu. Experience seamless and secure access to your information.',
    onboardingSignInButton: 'SIGN IN OR SIGN UP',
    onboardingCopyright: 'Copyright © 2025 Punjab and Sindh Bank',
      
    // Onboarding Screen 2
    newOnboardingDescription: 'VaultVu helps you master financial literacy and protect yourself from fraud with interactive lessons and smart tools. Secure your financial future.',
    newOnboardingGetStartedButton: 'GET STARTED',
    newOnboardingAlreadyAccountButton: 'I ALREADY HAVE AN ACCOUNT',
    newOnboardingCopyright: 'Copyright © 2025 Punjab and Sindh Bank',
      
    // Sign In Page
    signInHeader: 'Sign in to',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot Password?',
    or: 'or',
    signInWithGoogle: 'Sign in with Google',
    signInMainButton: 'SIGN IN',
    signInAlertSuccess: 'Signed in successfully!',
    signInAlertFailed: 'Sign-in failed. Please try again.',
    serverConnectionError: 'Could not connect to the server. Please check the network connection and the server IP address.',
    formValidationError: 'Please correct the highlighted errors.',
    googleSignInTitle: 'Google Sign-in',
    googleSignInMessage: 'Initiating Google sign-in process...',

    // Create Account Page 1
    createAccountHeader: 'Create an',
    accountHighlight: 'account',
    signupDescription: "Please complete your profile. Don't worry, your data will remain private and only you can see it.",
    firstNameLabel: 'First Name',
    lastNameLabel: 'Last Name',
    emailLabel_signup: 'Email',
    passwordLabel_signup: 'Password',
    firstNameRequired: 'First Name is required',
    lastNameRequired: 'Last Name is required',
    invalidEmail_signup: 'Please enter a valid email',
    passwordValidationError: 'Password must contain: ',
    passwordRule_8char: 'at least 8 characters',
    passwordRule_uppercase: 'at least one uppercase letter',
    passwordRule_lowercase: 'at least one lowercase letter',
    passwordRule_number: 'at least one number',
    passwordRule_specialChar: 'at least one special character (!@#$%^&*)',
    rememberMe_signup: 'Remember me',
    or_signup: 'or',
    createAccountButton: 'CREATE ACCOUNT',
    signupSuccessAlertTitle: 'Success',
    signupFailedAlertMessage: 'Registration failed. Please try again.',
    serverConnectionError_signup: 'Could not connect to the server. Please try again.',
    formValidationError_signup: 'Please fix the errors to create an account.',

    // Create Account Page 2
    signup2Header: 'Create an',
    signup2Description: 'Please enter your username, date of birth, country, and gender.',
    usernameLabel: 'Username',
    dateOfBirthLabel: 'Date of Birth',
    countryLabel: 'Country',
    genderLabel: 'Gender',
    selectCountry: 'Select Country',
    selectGender: 'Select Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    preferNotToSay: 'Prefer not to say',
    usernameRequired: 'Username is required',
    dobRequired: 'Date of Birth is required',
    countryRequired: 'Country is required',
    genderRequired: 'Gender is required',
    signUpButton: 'SIGN UP',
    allFieldsRequiredAlert: 'Please fill in all required fields.',
    accountCreatedSuccess: 'Account created successfully!',

    // Budget Manager Screen
    budgetManagerScreenTitle: 'Budget Manager',
    budgetTracker: 'Budget Tracker',
    emiCalculator: 'EMI Calculator & Manager',
    sipTracker: 'SIP Tracker & Calculator',
    budgetManager: 'Budget Manager',
    budgetManagerDesc: 'Manage your budgets, EMIs, SIPs and other financial tools.',

    // QuizScreen keys
    dailyQuiz: "Daily Quiz",
    dailyQuizDesc: "Challenge yourself with a new set of questions every day!",
    quizBattle: "Quiz Battle",
    quizBattleDesc: "Compete against friends or other users in real-time.",
    levels: "Levels",
    levelsDesc: "Progress through different levels to become a quiz master.",

    // ReportIssueScreen keys
    introText: 'Access official fraud reporting portals directly. Select the appropriate link below to report your issue.',
    disclaimerText: 'Disclaimer: These links direct you to official websites. VaultVu is not responsible for the content or services provided by these external sites.',
    rbiReportingTitle: 'RBI Fraud Reporting',
    rbiReportingDesc: 'Report financial frauds directly to Reserve Bank of India',
    punjabBankReportingTitle: 'Punjab and Sindh Bank Fraud Reporting',
    punjabBankReportingDesc: 'Report suspicious activities related to Punjab and Sindh Bank accounts',
    cybercrimeReportingTitle: 'National Cybercrime Reporting Portal',
    cybercrimeReportingDesc: 'Report all types of cybercrimes including financial frauds',
    upiFraudReportingTitle: 'UPI Fraud Reporting',
    upiFraudReportingDesc: 'Report UPI-related frauds and unauthorized transactions',
    phishingReportingTitle: 'Phishing Website Reporting',
    phishingReportingDesc: 'Report phishing websites and emails to CERT-In',
    error: 'Error',
    cannotOpenUrlError: 'Cannot open this URL. Please try again later.',
    ok: 'OK',

    // Fraud Detection
    fraudDetection: 'Fraud Detection',
    callDetection: 'Call Detection',
    callDetectionDesc: 'Get alerts for potentially fraudulent calls',
    messageDetection: 'Message Detection',
    messageDetectionDesc: 'Get alerts for potentially fraudulent messages',
    suspiciousCallAlert: 'Suspicious Call Alert',
    suspiciousMessageAlert: 'Suspicious Message Alert',
    callVerified: 'Call Verified',
    messageVerified: 'Message Verified',

    // Landing Page
    welcomeTo: 'Welcome to',
    poweredByText: 'Powered by Punjab and Sindh Bank in collaboration with IKGPTU',
    continueButtonText: 'CONTINUE',
    copyright: 'Copyright © 2025 Punjab and Sind Bank',

    // Chatbot
    aiAssistantTitle: "VaultVu AI Assistant",
    aiAssistantSubtitle: "Banking Fraud Prevention",
    chatInputPlaceholder: "Ask about banking fraud prevention...",
    chatInitialMessage: "👋 Hello! I'm VaultVu AI, your banking fraud prevention assistant. I'm here to help you learn about financial security and protect yourself from scams. What would you like to know?",
    keywordHello: 'hello',
    keywordHi: 'hi',
    keywordHey: 'hey',
    keywordHelp: 'help',
    keywordAssist: 'assist',
    keywordThank: 'thank',
    responseHello: "👋 Hello! I'm here to help you learn about banking fraud prevention. What specific topic would you like to explore?",
    responseHelp: "🤝 I can help you with:\n\n• **Phishing** - Email and message scams\n• **ATM Safety** - Card skimming and ATM fraud\n• **Identity Theft** - Personal information protection\n• **Online Banking** - Digital security best practices\n• **Investment Scams** - Fraudulent investment schemes\n• **Mobile Banking** - Smartphone security\n\nJust ask about any of these topics!",
    responseThanks: "😊 You're welcome! Stay vigilant and keep learning about fraud prevention. Is there anything else you'd like to know?",
    generalResponses: [
      "I'm here to help you learn about banking fraud prevention! Ask me about phishing, ATM safety, identity theft, online banking security, investment scams, or mobile banking.",
      "Banking security is important! I can provide information about various fraud types and how to protect yourself. What specific topic interests you?",
      "Let me help you stay safe from financial fraud. You can ask about common scams, prevention tips, or what to do if you've been targeted.",
    ],
    fraudKnowledgeBase: {
      phishing: {
        keywords: ['phishing', 'fake email', 'suspicious email', 'email scam'],
        response: "🎣 **Phishing** is when scammers send fake emails, texts, or calls pretending to be from legitimate organizations like banks.\n\n**Warning signs:**\n• Urgent requests for personal info\n• Suspicious sender addresses\n• Poor grammar/spelling\n• Generic greetings\n\n**Stay safe:** Never click suspicious links, verify sender through official channels, and report phishing attempts."
      },
      atm: {
        keywords: ['atm', 'card skimming', 'atm fraud', 'card reader'],
        response: "🏧 **ATM Fraud** includes card skimming, shoulder surfing, and fake ATMs.\n\n**Protection tips:**\n• Cover your PIN when entering\n• Check for loose card readers\n• Use ATMs in well-lit, busy areas\n• Monitor your account regularly\n• Report suspicious devices immediately\n\n**If compromised:** Contact your bank immediately and change your PIN."
      },
      identity: {
        keywords: ['identity theft', 'personal information', 'ssn', 'social security'],
        response: "🆔 **Identity Theft** occurs when criminals steal your personal information to commit fraud.\n\n**Prevention:**\n• Secure personal documents\n• Monitor credit reports\n• Use strong, unique passwords\n• Be cautious sharing info online\n• Shred sensitive documents\n\n**If affected:** File police report, contact credit bureaus, and monitor accounts closely."
      },
      online: {
        keywords: ['online banking', 'internet banking', 'digital fraud', 'cybersecurity'],
        response: "💻 **Online Banking Security** is crucial in today's digital world.\n\n**Best practices:**\n• Use official bank apps/websites\n• Enable two-factor authentication\n• Never bank on public WiFi\n• Log out completely after sessions\n• Keep devices updated\n\n**Red flags:** Unexpected login alerts, unfamiliar transactions, or requests for credentials."
      },
      investment: {
        keywords: ['investment scam', 'ponzi scheme', 'fake investment', 'get rich quick'],
        response: "📈 **Investment Scams** promise unrealistic returns with little risk.\n\n**Warning signs:**\n• Guaranteed high returns\n• Pressure to invest quickly\n• Unlicensed sellers\n• Complex strategies you don't understand\n\n**Protection:** Research thoroughly, verify credentials, be skeptical of 'too good to be true' offers, and consult financial advisors."
      },
      mobile: {
        keywords: ['mobile banking', 'app security', 'smartphone fraud', 'mobile scam'],
        response: "📱 **Mobile Banking Security** requires extra vigilance.\n\n**Safety measures:**\n• Download apps from official stores\n• Use device lock screens\n• Enable app-specific PINs\n• Avoid banking on public networks\n• Keep apps updated\n\n**Threats:** Fake banking apps, SMS phishing, and malware targeting mobile devices."
      }
    },
    
    // About Us Page
    aboutUsTitle: 'About Us',
    appVersionText: 'Version 1.0.0',
    aboutUsDescription: 'VaultVu is a comprehensive security application designed to protect users from various types of financial frauds and scams. Our mission is to empower users with knowledge and tools to stay safe in the digital world. This is the official project of Punjab and Sindh Bank in collaboration with IK Gujral Punjab Technical University.',
    ourTeamTitle: 'Our Team',
    contactUsButton: 'Contact Us',
    aboutUsCopyright: '© {year} VaultVu. All rights reserved.',
    
    // Team Member Roles & Bios
    roleArpit: 'Lead Developer',
    bioArpit: 'Experienced developer with expertise in MERN stack.',
    roleMehakpreet: 'UI/UX Designer and Frontend Developer',
    bioMehakpreet: 'Creative designer focused on creating intuitive and secure user interfaces. Proficient in React Native and JavaScript.',
    roleBisman: 'Backend Developer',
    bioBisman: 'Experienced backend developer with expertise in Node.js, Express.js, and MongoDB.',
    roleAnanya: 'Frontend Developer',
    bioAnanya: 'Experienced frontend developer with expertise in React Native and JavaScript.',

    // Budget Tracker Screen
    budgetTracker: 'Budget Tracker',
    retry: 'Retry',
    budgetSummary: 'Budget Summary',
    totalBudget: 'Total Budget:',
    totalSpent: 'Total Spent:',
    remaining: 'Remaining:',
    used: 'used',
    categories: 'Categories',
    emptyStateText: 'No budget categories found. Add your first category!',
    addCategory: 'Add Category',
    editCategory: 'Edit Category',
    addTransaction: 'Add Transaction',
    addTransactionError: 'Please enter both description and amount',
    addTransactionInvalidAmount: 'Please enter a valid amount',
    addTransactionFailed: 'Failed to add transaction',
    categoryNamePlaceholder: 'Category Name',
    budgetAmountPlaceholder: 'Budget Amount',
    transactionDescriptionPlaceholder: 'Description',
    transactionAmountPlaceholder: 'Amount',
    modalCancelButtonText: 'Cancel',
    modalSaveButtonText: 'Save',
    confirmDeleteTitle: 'Confirm Delete',
    confirmDeleteMessage: 'Are you sure you want to delete this category? This action cannot be undone.',
    delete: 'Delete',
    deleteCategoryFailed: 'Failed to delete category',
    addCategoryError: 'Please enter both name and budget amount',
    addCategoryInvalidAmount: 'Please enter a valid budget amount',
    addCategoryFailed: 'Failed to add category',
    editCategoryFailed: 'Failed to update category',
    unexpectedError: 'An unexpected error occurred',

    // SIP Tracker
    calculateSIP: 'Calculate SIP Returns',
    sipMonthlyInvestment: 'Monthly Investment (₹)',
    sipMonthlyInvestmentPlaceholder: 'e.g. 5000',
    sipExpectedReturn: 'Expected Annual Return (%)',
    sipExpectedReturnPlaceholder: 'e.g. 12',
    sipTimePeriod: 'Time Period (years)',
    sipTimePeriodPlaceholder: 'e.g. 10',
    calculate: 'Calculate',
    reset: 'Reset',
    sipResults: 'SIP Results',
    futureValue: 'Future Value:',
    totalInvestment: 'Total Investment:',
    estimatedReturns: 'Estimated Returns:',
    sipDisclaimer: 'Note: This calculator provides an estimate. Actual returns may vary based on market conditions and fund performance.',

    // EMI Manager
    emiCalculator: 'EMI Calculator & Manager',
    calculateEMI: 'Calculate EMI',
    emiLoanAmount: 'Loan Amount (₹)',
    emiLoanAmountPlaceholder: 'e.g. 100000',
    emiInterestRate: 'Interest Rate (% per annum)',
    emiInterestRatePlaceholder: 'e.g. 10.5',
    emiLoanTenure: 'Loan Tenure (years)',
    emiLoanTenurePlaceholder: 'e.g. 5',
    emiResults: 'EMI Results',
    monthlyEMI: 'Monthly EMI:',
    totalAmount: 'Total Amount:',
    totalInterest: 'Total Interest:',
    emiDisclaimer: 'Note: This calculator provides an estimate. Actual EMI may vary based on bank policies and loan terms.'
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
    budgetManager: 'बजट मैनेजर',
    budgetManagerDesc: 'बजट, ईएमआई, सीपआई और अन्य वित्तीय औद्योगिक उपकरणों का प्रबंधन करें।',
    leaderboardDesc: 'देखें कि आप अन्य सुरक्षा चैंपियंस के बीच कैसे रैंक करते हैं!',
    report: 'रिपोर्ट',
    reportAnIssue: 'एक समस्या की रिपोर्ट करें',
    reportAnIssueDesc: 'किसी भी संदिग्ध गतिविधि या सुरक्षा संबंधी चिंताओं की तुरंत रिपोर्ट करें।',
    aiAssistant: 'AI सहायक',
    aiAssistantDesc: 'बैंकिंग धोखाधड़ी की रोकथाम में तात्कालिक सहायता प्राप्त करें!',
    dailyTips: [
      'अवांछित कॉलों से सावधान रहें जो व्यक्तिगत जानकारी मांगते हैं।',
      'किसी भी लिंक पर क्लिक करने से पहले हमेशा ईमेल भेजने वाले को सत्यापित करें।',
      'अपने सभी ऑनलाइन खातों के लिए मजबूत, अद्वितीय पासवर्ड का उपयोग करें।',
      'अपना ओटीपी या पिन कभी भी किसी के साथ साझा न करें, यहां तक कि बैंक अधिकारियों के साथ भी नहीं।',
      'अतिरिक्त सुरक्षा के लिए जहां भी संभव हो दो-कारक प्रमाणीकरण (2FA) का उपयोग करें।',
      'ईमेल या टेक्स्ट संदेशों में संदिग्ध लिंक पर क्लिक न करें।',
      'केवल Google Play या App Store जैसे आधिकारिक ऐप स्टोर से ही ऐप्स डाउनलोड करें।',
      'ऑनलाइन बैंकिंग और संवेदनशील खातों के लिए एक अलग ईमेल पते का उपयोग करें।',
      'ऑनलाइन खरीदारी करते समय, सुरक्षित कनेक्शन (HTTPS) और प्रतिष्ठित साइटों का उपयोग करें।',
      'पैसे के लिए तत्काल अनुरोधों के प्रति संदेह रखें, खासकर ऑनलाइन परिवार या दोस्तों से।',
      'सार्वजनिक जानकारी को सीमित करने के लिए सोशल मीडिया पर अपनी गोपनीयता सेटिंग्स की समीक्षा करें।',
      'व्यक्तिगत जानकारी वाले दस्तावेजों को फेंकने से पहले उन्हें काट दें।',
      'अवांछित पहुंच को रोकने के लिए अपने वाई-फाई नेटवर्क को एक मजबूत पासवर्ड से सुरक्षित रखें।',
      'बैंकिंग या खरीदारी जैसी संवेदनशील गतिविधियों के लिए कभी भी सार्वजनिक वाई-फाई का उपयोग न करें।',
    ],

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
    googleSignInTitle: 'Google साइन-इन',
    googleSignInMessage: 'Google साइन-इन प्रक्रिया शुरू की जा रही है...',

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
    scamProtectionTitle_romance: 'रोमांस घोटाले',

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

    // Onboarding Screen 1
    onboardingDescription: 'VaultVu के साथ अपने डिजिटल जीवन को सुरक्षित करें। अपनी जानकारी तक निर्बाध और सुरक्षित पहुंच का अनुभव करें।',
    onboardingSignInButton: 'साइन इन या साइन अप करें',
    onboardingCopyright: 'कॉपीराइट © 2025 पंजाब एंड सिंध बैंक',
      
    // Onboarding Screen 2
    newOnboardingDescription: 'VaultVu आपको इंटरैक्टिव पाठों और स्मार्ट टूल के साथ वित्तीय साक्षरता में महारत हासिल करने और धोखाधड़ी से खुद को बचाने में मदद करता है। अपने वित्तीय भविष्य को सुरक्षित करें।',
    newOnboardingGetStartedButton: 'शुरू करें',
    newOnboardingAlreadyAccountButton: 'मेरा पहले से ही खाता है',
    newOnboardingCopyright: 'कॉपीराइट © 2025 पंजाब एंड सिंध बैंक',
      
    // Sign In Page
    signInHeader: 'साइन इन करें',
    emailLabel: 'ईमेल',
    passwordLabel: 'पासवर्ड',
    rememberMe: 'मुझे याद रखें',
    forgotPassword: 'पासवर्ड भूल गए?',
    or: 'या',
    signInWithGoogle: 'Google के साथ साइन इन करें',
    signInMainButton: 'साइन इन करें',
    signInAlertSuccess: 'सफलतापूर्वक साइन इन किया गया!',
    signInAlertFailed: 'साइन इन विफल। कृपया पुनः प्रयास करें।',
    serverConnectionError: 'सर्वर से कनेक्ट नहीं हो सका। कृपया नेटवर्क कनेक्शन और सर्वर आईपी पते की जांच करें।',
    formValidationError: 'कृपया हाइलाइट की गई त्रुटियों को ठीक करें।',
    googleSignInTitle: 'Google साइन-इन',
    googleSignInMessage: 'Google साइन-इन प्रक्रिया शुरू की जा रही है...',

    // Create Account Page 1
    createAccountHeader: 'एक',
    accountHighlight: 'खाता बनाएं',
    signupDescription: 'कृपया अपनी प्रोफ़ाइल पूरी करें। चिंता न करें, आपका डेटा निजी रहेगा और केवल आप ही इसे देख सकते हैं।',
    firstNameLabel: 'पहला नाम',
    lastNameLabel: 'अंतिम नाम',
    emailLabel_signup: 'ईमेल',
    passwordLabel_signup: 'पासवर्ड',
    firstNameRequired: 'पहला नाम आवश्यक है',
    lastNameRequired: 'अंतिम नाम आवश्यक है',
    invalidEmail_signup: 'कृपया एक वैध ईमेल दर्ज करें',
    passwordValidationError: 'पासवर्ड में शामिल होना चाहिए:',
    passwordRule_8char: 'कम से कम 8 अक्षर',
    passwordRule_uppercase: 'कम से कम एक बड़ा अक्षर',
    passwordRule_lowercase: 'कम से कम एक छोटा अक्षर',
    passwordRule_number: 'कम से कम एक नंबर',
    passwordRule_specialChar: 'कम से कम एक विशेष वर्ण (!@#$%^&*)',
    rememberMe_signup: 'मुझे याद रखें',
    or_signup: 'या',
    createAccountButton: 'खाता बनाएं',
    signupSuccessAlertTitle: 'सफलता',
    signupFailedAlertMessage: 'पंजीकरण विफल। कृपया पुनः प्रयास करें।',
    serverConnectionError_signup: 'सर्वर से कनेक्ट नहीं हो सका। कृपया पुनः प्रयास करें।',
    formValidationError_signup: 'खाता बनाने के लिए कृपया त्रुटियों को ठीक करें।',

    // Create Account Page 2
    signup2Header: 'एक',
    signup2Description: 'कृपया अपना उपयोगकर्ता नाम, जन्म तिथि, देश और लिंग दर्ज करें।',
    usernameLabel: 'उपयोगकर्ता नाम',
    dateOfBirthLabel: 'जन्म तिथि',
    countryLabel: 'देश',
    genderLabel: 'लिंग',
    selectCountry: 'देश चुनें',
    selectGender: 'लिंग चुनें',
    male: 'पुरुष',
    female: 'महिला',
    other: 'अन्य',
    preferNotToSay: 'कहना पसंद नहीं',
    usernameRequired: 'उपयोगकर्ता नाम आवश्यक है',
    dobRequired: 'जन्म तिथि आवश्यक है',
    countryRequired: 'देश आवश्यक है',
    genderRequired: 'लिंग आवश्यक है',
    signUpButton: 'साइन अप',
    allFieldsRequiredAlert: 'कृपया सभी आवश्यक फ़ील्ड भरें।',
    accountCreatedSuccess: 'खाता सफलतापूर्वक बनाया गया है!',

    // Budget Manager Screen
    budgetManagerScreenTitle: 'ਬਜਟ ਮੈਨੇਜਰ',
    budgetTracker: 'ਬਜਟ ਟ੍ਰੈਕਰ',
    emiCalculator: 'ਈ.ਐੱਮ.ਆਈ. ਕੈਲਕੁਲੇਟਰ ਅਤੇ ਮੈਨੇਜਰ',
    sipTracker: 'ਸਿਪ ਟ੍ਰੈਕਰ ਅਤੇ ਕੈਲਕੁਲੇਟਰ',
    budgetManager: 'ਬਜਟ ਮੈਨੇਜਰ',
    budgetManagerDesc: 'ਆਪਣੇ ਬਜਟ, EMI, SIP ਅਤੇ ਹੋਰ ਵਿੱਤੀ ਸਾਧਨਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ।',

    // QuizScreen keys
    dailyQuiz: "ਰੋਜ਼ਾਨਾ ਕਵਿਜ਼",
    dailyQuizDesc: "ਹਰ ਰੋਜ਼ ਨਵੇਂ ਸਵਾਲਾਂ ਨਾਲ ਆਪਣੇ ਆਪ ਨੂੰ ਚੁਣੌਤੀ ਦਿਓ!",
    quizBattle: "ਕਵਿਜ਼ ਬੈਟਲ",
    quizBattleDesc: "ਦੋਸਤਾਂ ਜਾਂ ਹੋਰ ਉਪਭੋਗਤਾਵਾਂ ਨਾਲ ਅਸਲ-ਸਮੇਂ ਵਿੱਚ ਮੁਕਾਬਲਾ ਕਰੋ।",
    levels: "ਪੱਧਰ",
    levelsDesc: "ਕਵਿਜ਼ ਮਾਸਟਰ ਬਣਨ ਲਈ ਵੱਖ-ਵੱਖ ਪੱਧਰਾਂ ਵਿੱਚੋਂ ਲੰਘੋ।",

    // ReportIssueScreen keys
    introText: 'ਸਿੱਧੇ ਤੌਰ ਤੇ ਸਰਕਾਰੀ ਧੋਖਾਧੜੀ ਰਿਪੋਰਟਿੰਗ ਪੋਰਟਲ ਤੱਕ ਪਹੁੰਚ ਕਰੋ। ਆਪਣੀ ਸਮੱਸਿਆ ਦੀ ਰਿਪੋਰਟ ਕਰਨ ਲਈ ਹੇਠਾਂ ਦਿੱਤੇ ਢੁਕਵੇਂ ਲਿੰਕ ਦੀ ਚੋਣ ਕਰੋ।',
    disclaimerText: 'ਬੇਦਾਅਵਾ: ਇਹ ਲਿੰਕ ਤੁਹਾਨੂੰ ਸਰਕਾਰੀ ਵੈੱਬਸਾਈਟਾਂ ਤੇ ਭੇਜਦੇ ਹਨ। VaultVu ਇਹਨਾਂ ਬਾਹਰੀ ਸਾਈਟਾਂ ਦੁਆਰਾ ਪ੍ਰਦਾਨ ਕੀਤੀ ਸਮੱਗਰੀ ਜਾਂ ਸੇਵਾਵਾਂ ਲਈ ਜ਼ਿੰਮੇਵਾਰ ਨਹੀਂ ਹੈ।',
    rbiReportingTitle: 'ਆਰਬੀਆਈ ਧੋਖਾਧੜੀ ਰਿਪੋਰਟਿੰਗ',
    rbiReportingDesc: 'ਭਾਰਤੀ ਰਿਜ਼ਰਵ ਬੈਂਕ ਨੂੰ ਸਿੱਧੇ ਤੌਰ ਤੇ ਵਿੱਤੀ ਧੋਖਾਧੜੀ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
    punjabBankReportingTitle: 'ਪੰਜਾਬ ਐਂਡ ਸਿੰਧ ਬੈਂਕ ਧੋਖਾਧੜੀ ਰਿਪੋਰਟਿੰਗ',
    punjabBankReportingDesc: 'ਪੰਜਾਬ ਐਂਡ ਸਿੰਧ ਬੈਂਕ ਖਾਤਿਆਂ ਨਾਲ ਸੰਬੰਧਿਤ ਸ਼ੱਕੀ ਗਤੀਵਿਧੀਆਂ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
    cybercrimeReportingTitle: 'ਰਾਸ਼ਟਰੀ ਸਾਈਬਰ ਕ੍ਰਾਈਮ ਰਿਪੋਰਟਿੰਗ ਪੋਰਟਲ',
    cybercrimeReportingDesc: 'ਵਿੱਤੀ ਧੋਖਾਧੜੀ ਸਮੇਤ ਸਾਰੇ ਕਿਸਮ ਦੇ ਸਾਈਬਰ ਅਪਰਾਧਾਂ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
    upiFraudReportingTitle: 'ਯੂਪੀਆਈ ਧੋਖਾਧੜੀ ਰਿਪੋਰਟਿੰਗ',
    upiFraudReportingDesc: 'ਯੂਪੀਆਈ-ਸਬੰਧਤ ਧੋਖਾਧੜੀ ਅਤੇ ਅਣਅਧਿਕਾਰਤ ਲੈਣ-ਦੇਣ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
    phishingReportingTitle: 'ਫਿਸ਼ਿੰਗ ਵੈੱਬਸਾਈਟ ਰਿਪੋਰਟਿੰਗ',
    phishingReportingDesc: 'ਫਿਸ਼ਿੰਗ ਵੈੱਬਸਾਈਟਾਂ ਅਤੇ ਈਮੇਲਾਂ ਦੀ CERT-In ਨੂੰ ਰਿਪੋਰਟ ਕਰੋ',
    error: 'ਗਲਤੀ',
    cannotOpenUrlError: 'ਇਹ URL ਨਹੀਂ ਖੋਲ੍ਹਿਆ ਜਾ ਸਕਦਾ। ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    ok: 'ਠੀਕ ਹੈ',

    // Fraud Detection
    fraudDetection: 'ਧੋਖਾਧੜੀ ਦਾ ਪਤਾ ਲਗਾਉਣਾ',
    callDetection: 'ਕਾਲ ਡਿਟੈਕਸ਼ਨ',
    callDetectionDesc: 'ਸੰਭਾਵੀ ਧੋਖਾਧੜੀ ਵਾਲੀਆਂ ਕਾਲਾਂ ਲਈ ਅਲਰਟ ਪ੍ਰਾਪਤ ਕਰੋ',
    messageDetection: 'ਸੰਦੇਸ਼ ਡਿਟੈਕਸ਼ਨ',
    messageDetectionDesc: 'ਸੰਭਾਵੀ ਧੋਖਾਧੜੀ ਵਾਲੇ ਸੰਦੇਸ਼ਾਂ ਲਈ ਅਲਰਟ ਪ੍ਰਾਪਤ ਕਰੋ',
    suspiciousCallAlert: 'ਸ਼ੱਕੀ ਕਾਲ ਅਲਰਟ',
    suspiciousMessageAlert: 'ਸ਼ੱਕੀ ਸੰਦੇਸ਼ ਅਲਰਟ',
    callVerified: 'ਕਾਲ ਪ੍ਰਮਾਣਿਤ',
    messageVerified: 'ਸੰਦੇਸ਼ ਪ੍ਰਮਾਣਿਤ',

    // Landing Page
    welcomeTo: 'ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ',
    poweredByText: 'ਪੰਜਾਬ ਐਂਡ ਸਿੰਧ ਬੈਂਕ ਦੁਆਰਾ IKGPTU ਦੇ ਸਹਿਯੋਗ ਨਾਲ ਸੰਚਾਲਿਤ',
    continueButtonText: 'ਜਾਰੀ ਰੱਖੋ',
    copyright: 'ਕਾਪੀਰਾਈਟ © 2025 ਪੰਜਾਬ ਐਂਡ ਸਿੰਧ ਬੈਂਕ',
    
    // Chatbot
    aiAssistantTitle: "ਵਾਲਟਵੂ ਏ.ਆਈ. ਸਹਾਇਕ",
    aiAssistantSubtitle: "ਬੈਂਕਿੰਗ ਧੋਖਾਧੜੀ ਰੋਕਥਾਮ",
    chatInputPlaceholder: "ਬੈਂਕਿੰਗ ਧੋਖਾਧੜੀ ਰੋਕਥਾਮ ਬਾਰੇ ਪੁੱਛੋ...",
    chatInitialMessage: "👋 ਹੈਲੋ! ਮੈਂ ਵਾਲਟਵੂ ਏ.ਆਈ. ਹਾਂ, ਤੁਹਾਡਾ ਬੈਂਕਿੰਗ ਧੋਖਾਧੜੀ ਰੋਕਥਾਮ ਸਹਾਇਕ। ਮੈਂ ਇੱਥੇ ਵਿੱਤੀ ਸੁਰੱਖਿਆ ਬਾਰੇ ਸਿੱਖਣ ਅਤੇ ਆਪਣੇ ਆਪ ਨੂੰ ਘੁਟਾਲਿਆਂ ਤੋਂ ਬਚਾਉਣ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਲਈ ਹਾਂ। ਤੁਸੀਂ ਕੀ ਜਾਣਨਾ ਚਾਹੋਗੇ?",
    keywordHello: 'ਹੈਲੋ',
    keywordHi: 'ਹਾਇ',
    keywordHey: 'ਹੇ',
    keywordHelp: 'ਮਦਦ',
    keywordAssist: 'ਸਹਾਇਤਾ',
    keywordThank: 'ਧੰਨਵਾਦ',
    responseHello: "👋 ਹੈਲੋ! ਮੈਂ ਬੈਂਕਿੰਗ ਧੋਖਾਧੜੀ ਰੋਕਥਾਮ ਬਾਰੇ ਸਿੱਖਣ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਲਈ ਇੱਥੇ ਹਾਂ। ਤੁਸੀਂ ਕਿਹੜੇ ਖਾਸ ਵਿਸ਼ੇ ਦੀ ਪੜਚੋਲ ਕਰਨਾ ਚਾਹੋਗੇ?",
    responseHelp: "🤝 ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ:\n\n• **ਫਿਸ਼ਿੰਗ** - ਈਮੇਲ ਅਤੇ ਸੰਦੇਸ਼ ਘੁਟਾਲੇ\n• **ਏ.ਟੀ.ਐਮ. ਸੁਰੱਖਿਆ** - ਕਾਰਡ ਸਕਿਮਿੰਗ ਅਤੇ ਏ.ਟੀ.ਐਮ. ਧੋਖਾਧੜੀ\n• **ਪਛਾਣ ਦੀ ਚੋਰੀ** - ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਦੀ ਸੁਰੱਖਿਆ\n• **ਔਨਲਾਈਨ ਬੈਂਕਿੰਗ** - ਡਿਜੀਟਲ ਸੁਰੱਖਿਆ ਦੇ ਵਧੀਆ ਅਭਿਆਸ\n• **ਨਿਵੇਸ਼ ਘੁਟਾਲੇ** - ਧੋਖਾਧੜੀ ਵਾਲੀਆਂ ਨਿਵੇਸ਼ ਯੋਜਨਾਵਾਂ\n• **ਮੋਬਾਈਲ ਬੈਂਕਿੰਗ** - ਸਮਾਰਟਫੋਨ ਸੁਰੱਖਿਆ\n\nਬੱਸ ਇਹਨਾਂ ਵਿੱਚੋਂ ਕਿਸੇ ਵੀ ਵਿਸ਼ੇ ਬਾਰੇ ਪੁੱਛੋ!",
    responseThanks: "😊 ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ! ਸਾਵਧਾਨ ਰਹੋ ਅਤੇ ਧੋਖਾਧੜੀ ਰੋਕਥਾਮ ਬਾਰੇ ਸਿੱਖਦੇ ਰਹੋ। ਕੀ ਤੁਸੀਂ ਕੁਝ ਹੋਰ ਜਾਣਨਾ ਚਾਹੋਗੇ?",
    generalResponses: [
      "ਮੈਂ ਬੈਂਕਿੰਗ ਧੋਖਾਧੜੀ ਰੋਕਥਾਮ ਬਾਰੇ ਸਿੱਖਣ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਲਈ ਇੱਥੇ ਹਾਂ! ਤੁਸੀਂ ਮੈਨੂੰ ਫਿਸ਼ਿੰਗ, ਏ.ਟੀ.ਐਮ. ਸੁਰੱਖਿਆ, ਪਛਾਣ ਦੀ ਚੋਰੀ, ਔਨਲਾਈਨ ਬੈਂਕਿੰਗ ਸੁਰੱਖਿਆ, ਨਿਵੇਸ਼ ਘੁਟਾਲੇ, ਜਾਂ ਮੋਬਾਈਲ ਬੈਂਕਿੰਗ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।",
      "ਬੈਂਕਿੰਗ ਸੁਰੱਖਿਆ ਮਹੱਤਵਪੂਨ ਹੈ! ਮੈਂ ਵੱਖ-ਵੱਖ ਧੋਖਾਧੜੀ ਦੀਆਂ ਕਿਸਮਾਂ ਅਤੇ ਆਪਣੇ ਆਪ ਨੂੰ ਕਿਵੇਂ ਬਚਾਉਣਾ ਹੈ, ਬਾਰੇ ਜਾਣਕਾਰੀ ਪ੍ਰਦਾਨ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ਕਿਸ ਖਾਸ ਵਿਸ਼ੇ ਵਿੱਚ ਦਿਲਚਸਪੀ ਰੱਖਦੇ ਹੋ?",
      "ਮੈਨੂੰ ਵਿੱਤੀ ਧੋਖਾਧੜੀ ਤੋਂ ਸੁਰੱਖਿਅਤ ਰਹਿਣ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਦਿਓ। ਤੁਸੀਂ ਆਮ ਘੁਟਾਲਿਆਂ, ਰੋਕਥਾਮ ਸੁਝਾਅ, ਜਾਂ ਜੇਕਰ ਤੁਸੀਂ ਨਿਸ਼ਾਨਾ ਬਣੇ ਹੋ ਤਾਂ ਕੀ ਕਰਨਾ ਹੈ, ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।",
    ],
    fraudKnowledgeBase: {
      phishing: {
        keywords: ['ਫਿਸ਼ਿੰਗ', 'ਨਕਲੀ ਈਮੇਲ', 'ਸ਼ੱਕੀ ਈਮੇਲ', 'ਈਮੇਲ ਘੁਟਾਲਾ'],
        response: "🎣 **ਫਿਸ਼ਿੰਗ** ਉਦੋਂ ਹੁੰਦਾ ਹੈ ਜਦੋਂ ਘੁਟਾਲੇਬਾਜ਼ ਬੈਂਕਾਂ ਵਰਗੀਆਂ ਜਾਇਜ਼ ਸੰਸਥਾਵਾਂ ਬਣ ਕੇ ਨਕਲੀ ਈਮੇਲ, ਟੈਕਸਟ ਜਾਂ ਕਾਲਾਂ ਭੇਜਦੇ ਹਨ।\n\n**ਚੇਤਾਵਨੀ ਦੇ ਸੰਕੇਤ:**\n• ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਲਈ ਜ਼ਰੂਰੀ ਬੇਨਤੀਆਂ\n• ਸ਼ੱਕੀ ਭੇਜਣ ਵਾਲੇ ਪਤੇ\n• ਮਾੜਾ ਵਿਆਕਰਨ/ਸਪੈਲਿੰਗ\n• ਆਮ ਸ਼ੁਭਕਾਮਨਾਵਾਂ\n\n**ਸੁਰੱਖਿਅਤ ਰਹੋ:** ਕਦੇ ਵੀ ਸ਼ੱਕੀ ਲਿੰਕਾਂ 'ਤੇ ਕਲਿੱਕ ਨਾ ਕਰੋ, ਅਧਿਕਾਰਤ ਚੈਨਲਾਂ ਰਾਹੀਂ ਭੇਜਣ ਵਾਲੇ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ, ਅਤੇ ਫਿਸ਼ਿੰਗ ਕੋਸ਼ਿਸ਼ਾਂ ਦੀ ਰਿਪੋਰਟ ਕਰੋ।"
      },
      atm: {
        keywords: ['ਏ.ਟੀ.ਐਮ.', 'ਕਾਰਡ ਸਕਿਮਿੰਗ', 'ਏ.ਟੀ.ਐਮ. ਧੋਖਾਧੜੀ', 'ਕਾਰਡ ਰੀਡਰ'],
        response: "🏧 **ਏ.ਟੀ.ਐਮ. ਧੋਖਾਧੜੀ** ਵਿੱਚ ਕਾਰਡ ਸਕਿਮਿੰਗ, ਸ਼ੋਲਡਰ ਸਰਫਿੰਗ ਅਤੇ ਨਕਲੀ ਏ.ਟੀ.ਐਮ. ਸ਼ਾਮਲ ਹਨ।\n\n**ਸੁਰੱਖਿਆ ਸੁਝਾਅ:**\n• ਪਿੰਨ ਦਰਜ ਕਰਦੇ ਸਮੇਂ ਆਪਣੇ ਪਿੰਨ ਨੂੰ ਢਕੋ\n• ਢਿੱਲੇ ਕਾਰਡ ਰੀਡਰਾਂ ਦੀ ਜਾਂਚ ਕਰੋ\n• ਚੰਗੀ ਤਰ੍ਹਾਂ ਰੌਸ਼ਨੀ ਵਾਲੇ, ਰੁੱਝੇ ਹੋਏ ਖੇਤਰਾਂ ਵਿੱਚ ਏ.ਟੀ.ਐਮ. ਦੀ ਵਰਤੋਂ ਕਰੋ\n• ਆਪਣੇ ਖਾਤੇ ਦੀ ਨਿਯਮਤ ਤੌਰ 'ਤੇ ਨਿਗਰਾਨੀ ਕਰੋ\n• ਸ਼ੱਕੀ ਉਪਕਰਣਾਂ ਦੀ ਤੁਰੰਤ ਰਿਪੋਰਟ ਕਰੋ\n\n**ਜੇਕਰ ਸਮਝੌਤਾ ਕੀਤਾ ਗਿਆ ਹੈ:** ਤੁਰੰਤ ਆਪਣੇ ਬੈਂਕ ਨਾਲ ਸੰਪਰਕ ਕਰੋ ਅਤੇ ਆਪਣਾ ਪਿੰਨ ਬਦਲੋ।"
      },
      identity: {
        keywords: ['ਪਛਾਣ ਦੀ ਚੋਰੀ', 'ਨਿੱਜੀ ਜਾਣਕਾਰੀ', 'ਐਸਐਸਐਨ', 'ਸੋਸ਼ਲ ਸਿਕਿਓਰਿਟੀ'],
        response: "🆔 **ਪਛਾਣ ਦੀ ਚੋਰੀ** ਉਦੋਂ ਹੁੰਦੀ ਹੈ ਜਦੋਂ ਅਪਰਾਧੀ ਧੋਖਾਧੜੀ ਕਰਨ ਲਈ ਤੁਹਾਡੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਚੋਰੀ ਕਰ ਲੈਂਦੇ ਹਨ।\n\n**ਰੋਕਥਾਮ:**\n• ਨਿੱਜੀ ਦਸਤਾਵੇਜ਼ਾਂ ਨੂੰ ਸੁਰੱਖਿਅਤ ਰੱਖੋ\n• ਕ੍ਰੈਡਿਟ ਰਿਪੋਰਟਾਂ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ\n• ਮਜ਼ਬੂਤ, ਵਿਲੱਖਣ ਪਾਸਵਰਡਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ\n• ਔਨਲਾਈਨ ਜਾਣਕਾਰੀ ਸਾਂਝੀ ਕਰਨ ਬਾਰੇ ਸਾਵਧਾਨ ਰਹੋ\n• ਸੰਵੇਦਨਸ਼ੀਲ ਦਸਤਾਵੇਜ਼ਾਂ ਨੂੰ ਟੁਕੜੇ-ਟੁਕੜੇ ਕਰ ਦਿਓ\n\n**ਜੇਕਰ ਪ੍ਰਭਾਵਿਤ ਹੋਏ ਹੋ:** ਪੁਲਿਸ ਰਿਪੋਰਟ ਦਰਜ ਕਰੋ, ਕ੍ਰੈਡਿਟ ਬਿਊਰੋ ਨਾਲ ਸੰਪਰਕ ਕਰੋ, ਅਤੇ ਖਾਤਿਆਂ ਦੀ ਨੇੜਿਓਂ ਨਿਗਰਾਨੀ ਕਰੋ।"
      },
      online: {
        keywords: ['ਔਨਲਾਈਨ ਬੈਂਕਿੰਗ', 'ਇੰਟਰਨੈੱਟ ਬੈਂਕਿੰਗ', 'ਡਿਜੀਟਲ ਧੋਖਾਧੜੀ', 'ਸਾਈਬਰ ਸੁਰੱਖਿਆ'],
        response: "💻 **ਔਨਲਾਈਨ ਬੈਂਕਿੰਗ ਸੁਰੱਖਿਆ** ਅੱਜ ਦੇ ਡਿਜੀਟਲ ਸੰਸਾਰ ਵਿੱਚ ਬਹੁਤ ਮਹੱਤਵਪੂਰਨ ਹੈ।\n\n**ਵਧੀਆ ਅਭਿਆਸ:**\n• ਅਧਿਕਾਰਤ ਬੈਂਕ ਐਪਾਂ/ਵੈੱਬਸਾਈਟਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ\n• ਦੋ-ਕਾਰਕ ਪ੍ਰਮਾਣਿਕਤਾ ਨੂੰ ਸਮਰੱਥ ਕਰੋ\n• ਜਨਤਕ WiFi 'ਤੇ ਕਦੇ ਵੀ ਬੈਂਕਿੰਗ ਨਾ ਕਰੋ\n• ਸੈਸ਼ਨਾਂ ਤੋਂ ਬਾਅਦ ਪੂਰੀ ਤਰ੍ਹਾਂ ਲੌਗ ਆਉਟ ਕਰੋ\n• ਡਿਵਾਈਸਾਂ ਨੂੰ ਅੱਪਡੇਟ ਰੱਖੋ\n\n**ਲਾਲ ਝੰਡੇ:** ਅਚਾਨਕ ਲੌਗਇਨ ਅਲਰਟ, ਅਣਜਾਣ ਲੈਣ-ਦੇਣ, ਜਾਂ ਪ੍ਰਮਾਣ-ਪੱਤਰਾਂ ਲਈ ਬੇਨਤੀਆਂ।"
      },
      investment: {
        keywords: ['ਨਿਵੇਸ਼ ਘੁਟਾਲਾ', 'ਪੋਂਜ਼ੀ ਸਕੀਮ', 'ਨਕਲੀ ਨਿਵੇਸ਼', 'ਛੇਤੀ ਅਮੀਰ ਬਣੋ'],
        response: "📈 **ਨਿਵੇਸ਼ ਘੁਟਾਲੇ** ਘੱਟ ਜੋਖਮ ਨਾਲ ਅਵਾਸਤਵਿਕ ਰਿਟਰਨ ਦਾ ਵਾਅਦਾ ਕਰਦੇ ਹਨ।\n\n**ਚੇਤਾਵਨੀ ਦੇ ਸੰਕੇਤ:**\n• ਗਾਰੰਟੀਸ਼ੁਦਾ ਉੱਚ ਰਿਟਰਨ\n• ਛੇਤੀ ਨਿਵੇਸ਼ ਕਰਨ ਦਾ ਦਬਾਅ\n• ਬਿਨਾਂ ਲਾਇਸੈਂਸ ਵਾਲੇ ਵਿਕਰੇਤਾ\n• ਗੁੰਝਲਦਾਰ ਰਣਨੀਤੀਆਂ ਜੋ ਤੁਹਾਨੂੰ ਸਮਝ ਨਹੀਂ ਆਉਂਦੀਆਂ\n\n**ਸੁਰੱਖਿਆ:** ਚੰਗੀ ਤਰ੍ਹਾਂ ਖੋਜ ਕਰੋ, ਪ੍ਰਮਾਣ ਪੱਤਰਾਂ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ, 'ਸੱਚ ਹੋਣ ਲਈ ਬਹੁਤ ਵਧੀਆ' ਪੇਸ਼ਕਸ਼ਾਂ ਬਾਰੇ ਸ਼ੱਕੀ ਰਹੋ, ਅਤੇ ਵਿੱਤੀ ਸਲਾਹਕਾਰਾਂ ਨਾਲ ਸਲਾਹ ਕਰੋ।"
      },
      mobile: {
        keywords: ['ਮੋਬਾਈਲ ਬੈਂਕਿੰਗ', 'ਐਪ ਸੁਰੱਖਿਆ', 'ਸਮਾਰਟਫੋਨ ਧੋਖਾਧੜੀ', 'ਮੋਬਾਈਲ ਘੁਟਾਲਾ'],
        response: "📱 **ਮੋਬਾਈਲ ਬੈਂਕਿੰਗ ਸੁਰੱਖਿਆ** ਲਈ ਵਾਧੂ ਚੌਕਸੀ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ।\n\n**ਸੁਰੱਖਿਆ ਉਪਾਅ:**\n• ਅਧਿਕਾਰਤ ਸਟੋਰਾਂ ਤੋਂ ਐਪਸ ਡਾਊਨਲੋਡ ਕਰੋ\n• ਡਿਵਾਈਸ ਲਾਕ ਸਕ੍ਰੀਨਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ\n• ਐਪ-ਵਿਸ਼ੇਸ਼ ਪਿੰਨ ਸਮਰੱਥ ਕਰੋ\n• ਜਨਤਕ ਨੈੱਟਵਰਕਾਂ 'ਤੇ ਬੈਂਕਿੰਗ ਤੋਂ ਬਚੋ\n• ਐਪਸ ਨੂੰ ਅੱਪਡੇਟ ਰੱਖੋ\n\n**ਖਤਰੇ:** ਨਕਲੀ ਬੈਂਕਿੰਗ ਐਪਾਂ, ਐਸਐਮਐਸ ਫਿਸ਼ਿੰਗ, ਅਤੇ ਮੋਬਾਈਲ ਡਿਵਾਈਸਾਂ ਨੂੰ ਨਿਸ਼ਾਨਾ ਬਣਾਉਣ ਵਾਲੇ ਮਾਲਵੇਅਰ।"
      }
    },

    // About Us Page
    aboutUsTitle: 'हमारे बारे में',
    appVersionText: 'संस्करण 1.0.0',
    aboutUsDescription: 'वॉल्टवू एक व्यापक सुरक्षा एप्लिकेशन है जिसे उपयोगकर्ताओं को विभिन्न प्रकार की वित्तीय धोखाधड़ी और घोटालों से बचाने के लिए डिज़ाइन किया गया है। हमारा मिशन उपयोगकर्ताओं को डिजिटल दुनिया में सुरक्षित रहने के लिए ज्ञान और उपकरणों से सशक्त बनाना है। यह IK गुजराल पंजाब तकनीकी विश्वविद्यालय के सहयोग से पंजाब एंड सिंध बैंक का आधिकारिक प्रोजेक्ट है।',
    ourTeamTitle: 'हमारी टीम',
    contactUsButton: 'हमसे संपर्क करें',
    aboutUsCopyright: '© {year} वॉल्टवू। सर्वाधिकार सुरक्षित।',
    
    // Team Member Roles & Bios
    roleArpit: 'मुख्य डेवलपर',
    bioArpit: 'MERN स्टैक में विशेषज्ञता के साथ अनुभवी डेवलपर।',
    roleMehakpreet: 'यूआई/यूएक्स डिजाइनर और फ्रंटएंड डेवलपर',
    bioMehakpreet: 'सहज और सुरक्षित उपयोगकर्ता इंटरफेस बनाने पर केंद्रित रचनात्मक डिजाइनर। रिएक्ट नेटिव और जावास्क्रिप्ट में प्रवीण।',
    roleBisman: 'बैकएंड डेवलपर',
    bioBisman: 'Node.js, Express.js, और MongoDB में विशेषज्ञता के साथ अनुभवी बैकएंड डेवलपर।',
    roleAnanya: 'फ्रंटएंड डेवलपर',
    bioAnanya: 'React Native और JavaScript में विशेषज्ञता के साथ अनुभवी फ्रंटएंड डेवलपर।',

    // Budget Tracker Screen
    budgetTracker: 'बजट ट्रैकर',
    retry: 'पुनः प्रयास करें',
    budgetSummary: 'बजट सारांश',
    totalBudget: 'कुल बजट:',
    totalSpent: 'कुल खर्च:',
    remaining: 'शेष:',
    used: 'उपयोग किया गया',
    categories: 'श्रेणियाँ',
    emptyStateText: 'कोई बजट श्रेणियां नहीं मिलीं। अपनी पहली श्रेणी जोड़ें!',
    addCategory: 'श्रेणी जोड़ें',
    editCategory: 'श्रेणी संपादित करें',
    addTransaction: 'लेन-देन जोड़ें',
    addTransactionError: 'कृपया विवरण और राशि दोनों दर्ज करें',
    addTransactionInvalidAmount: 'कृपया एक वैध राशि दर्ज करें',
    addTransactionFailed: 'लेन-देन जोड़ने में विफल',
    categoryNamePlaceholder: 'श्रेणी का नाम',
    budgetAmountPlaceholder: 'बजट राशि',
    transactionDescriptionPlaceholder: 'विवरण',
    transactionAmountPlaceholder: 'राशि',
    modalCancelButtonText: 'रद्द करें',
    modalSaveButtonText: 'सहेजें',
    confirmDeleteTitle: 'पुष्टि करें हटाएँ',
    confirmDeleteMessage: 'क्या आप इस श्रेणी को हटाना चाहते हैं? यह कार्रवाई पूर्ववत नहीं की जा सकती।',
    delete: 'हटाएँ',
    deleteCategoryFailed: 'श्रेणी हटाने में विफल',
    addCategoryError: 'कृपया नाम और बजट राशि दोनों दर्ज करें',
    addCategoryInvalidAmount: 'कृपया एक वैध बजट राशि दर्ज करें',
    addCategoryFailed: 'श्रेणी जोड़ने में विफल',
    editCategoryFailed: 'श्रेणी को अपडेट करने में विफल',
    unexpectedError: 'एक अप्रत्याशित त्रुटि हुई',

    // SIP Tracker
    calculateSIP: 'SIP रिटर्न की गणना करें',
    sipMonthlyInvestment: 'मासिक निवेश (₹)',
    sipMonthlyInvestmentPlaceholder: 'उदा. 5000',
    sipExpectedReturn: 'अपेक्षित वार्षिक रिटर्न (%)',
    sipExpectedReturnPlaceholder: 'उदा. 12',
    sipTimePeriod: 'समय अवधि (वर्ष)',
    sipTimePeriodPlaceholder: 'उदा. 10',
    calculate: 'गणना करें',
    reset: 'रीसेट करें',
    sipResults: 'SIP परिणाम',
    futureValue: 'भविष्य का मूल्य:',
    totalInvestment: 'कुल निवेश:',
    estimatedReturns: 'अनुमानित रिटर्न:',
    sipDisclaimer: 'नोट: यह कैलकुलेटर एक अनुमान प्रदान करता है। वास्तविक रिटर्न बाजार की स्थितियों और फंड के प्रदर्शन के आधार पर भिन्न हो सकता है।',

    // EMI Manager
    emiCalculator: 'ईएमआई कैलकुलेटर और मैनेजर',
    calculateEMI: 'ईएमआई की गणना करें',
    emiLoanAmount: 'ऋण राशि (₹)',
    emiLoanAmountPlaceholder: 'उदा. 100000',
    emiInterestRate: 'ब्याज दर (% प्रति वर्ष)',
    emiInterestRatePlaceholder: 'उदा. 10.5',
    emiLoanTenure: 'ऋण अवधि (वर्ष)',
    emiLoanTenurePlaceholder: 'उदा. 5',
    emiResults: 'ईएमआई परिणाम',
    monthlyEMI: 'मासिक ईएमआई:',
    totalAmount: 'कुल राशि:',
    totalInterest: 'कुल ब्याज:',
    emiDisclaimer: 'नोट: यह कैलकुलेटर एक अनुमान प्रदान करता है। वास्तविक ईएमआई बैंक की नीतियों और ऋण शर्तों के आधार पर भिन्न हो सकती है।'
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
    urlFraudChecker: 'URL ਸੁਰੱਖਿਆ ਚੈਕਰ',
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
    budgetManager: 'ਬਜਟ ਮੈਨੇਜਰ',
    budgetManagerDesc: 'ਆਪਣੇ ਬਜਟ, EMI, SIP ਅਤੇ ਹੋਰ ਵਿੱਤੀ ਸਾਧਨਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ।',
    leaderboardDesc: 'ਦੇਖੋ ਕਿ ਤੁਸੀਂ ਦੂਜੇ ਸੁਰੱਖਿਆ ਚੈਂਪੀਅਨਾਂ ਵਿੱਚ ਕਿਵੇਂ ਦਰਜਾ ਪ੍ਰਾਪਤ ਕਰਦੇ ਹੋ!',
    report: 'ਰਿਪੋਰਟ',
    reportAnIssue: 'ਇੱਕ ਸਮੱਸਿਆ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
    reportAnIssueDesc: 'ਕਿਸੇ ਵੀ ਸ਼ੱਕੀ ਗਤੀਵਿਧੀ ਜਾਂ ਸੁਰੱਖਿਆ ਚਿੰਤਾਵਾਂ ਦੀ ਤੁਰੰਤ ਰਿਪੋਰਟ ਕਰੋ।',
    aiAssistant: 'AI ਸਹਾਇਕ',
    aiAssistantDesc: 'ਬੈਂਕਿੰਗ ਧੋਖਾਧੜੀ ਦੀ ਰੋਕਥਾਮ ਵਿੱਚ ਤੁਰੰਤ ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਕਰੋ!',
    dailyTips: [
      'ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਮੰਗਣ ਵਾਲੀਆਂ ਅਣਚਾਹੀਆਂ ਕਾਲਾਂ ਤੋਂ ਸਾਵਧਾਨ ਰਹੋ।',
      'ਕਿਸੇ ਵੀ ਲਿੰਕ ਤੇ ਕਲਿੱਕ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਈਮੇਲ ਭੇਜਣ ਵਾਲੇ ਦੀ ਹਮੇਸ਼ਾ ਪੁਸ਼ਟੀ ਕਰੋ।',
      'ਆਪਣੇ ਸਾਰੇ ਔਨਲਾਈਨ ਖਾਤਿਆਂ ਲਈ ਮਜ਼ਬੂਤ, ਵਿਲੱਖਣ ਪਾਸਵਰਡ ਦੀ ਵਰਤੋਂ ਕਰੋ।',
      'ਆਪਣਾ OTP ਜਾਂ PIN ਕਦੇ ਵੀ ਕਿਸੇ ਨਾਲ ਸਾਂਝਾ ਨਾ ਕਰੋ, ਇੱਥੋਂ ਤੱਕ ਕਿ ਬੈਂਕ ਅਧਿਕਾਰੀਆਂ ਨਾਲ ਵੀ ਨਹੀਂ।',
      'ਵਧੇਰੇ ਸੁਰੱਖਿਆ ਲਈ ਜਿੱਥੇ ਵੀ ਸੰਭਵ ਹੋਵੇ ਦੋ-ਕਾਰਕ ਪ੍ਰਮਾਣਿਕਤਾ (2FA) ਦੀ ਵਰਤੋਂ ਕਰੋ।',
      'ਈਮੇਲ ਜਾਂ ਟੈਕਸਟ ਸੰਦੇਸ਼ਾਂ ਵਿੱਚ ਸ਼ੱਕੀ ਲਿੰਕਾਂ ਤੇ ਕਲਿੱਕ ਨਾ ਕਰੋ।',
      'ਸਿਰਫ਼ Google Play ਜਾਂ App Store ਵਰਗੇ ਅਧਿਕਾਰਤ ਐਪ ਸਟੋਰਾਂ ਤੋਂ ਹੀ ਐਪਸ ਡਾਊਨਲੋਡ ਕਰੋ।',
      'ਔਨਲਾਈਨ ਬੈਂਕਿੰਗ ਅਤੇ ਸੰਵੇਦਨਸ਼ੀਲ ਖਾਤਿਆਂ ਲਈ ਇੱਕ ਵੱਖਰੇ ਈਮੇਲ ਪਤੇ ਦੀ ਵਰਤੋਂ ਕਰੋ।',
      'ਔਨਲਾਈਨ ਖਰੀਦਦਾਰੀ ਕਰਦੇ ਸਮੇਂ, ਸੁਰੱਖਿਅਤ ਕਨੈਕਸ਼ਨਾਂ (HTTPS) ਅਤੇ ਭਰੋਸੇਮੰਦ ਸਾਈਟਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ।',
      'ਪੈਸੇ ਲਈ ਤੁਰੰਤ ਬੇਨਤੀਆਂ ਤੇ ਸ਼ੱਕ ਕਰੋ, ਖਾਸ ਕਰਕੇ ਔਨਲਾਈਨ ਪਰਿਵਾਰ ਜਾਂ ਦੋਸਤਾਂ ਤੋਂ।',
      'ਜਨਤਕ ਜਾਣਕਾਰੀ ਨੂੰ ਸੀਮਤ ਕਰਨ ਲਈ ਸੋਸ਼ਲ ਮੀਡੀਆ ਤੇ ਆਪਣੀਆਂ ਗੋਪਨੀਯਤਾ ਸੈਟਿੰਗਾਂ ਦੀ ਸਮੀਖਿਆ ਕਰੋ।',
      'ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਵਾਲੇ ਦਸਤਾਵੇਜ਼ਾਂ ਨੂੰ ਰੱਦ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਟੁਕੜੇ-ਟੁਕੜੇ ਕਰ ਦਿਓ।',
      'ਅਣਅਧਿਕਾਰਤ ਪਹੁੰਚ ਨੂੰ ਰੋਕਣ ਲਈ ਆਪਣੇ Wi-Fi ਨੈੱਟਵਰਕ ਨੂੰ ਇੱਕ ਮਜ਼ਬੂਤ ਪਾਸਵਰਡ ਨਾਲ ਸੁਰੱਖਿਅਤ ਕਰੋ।',
      'ਬੈਂਕਿੰਗ ਜਾਂ ਖਰੀਦਦਾਰੀ ਵਰਗੀਆਂ ਸੰਵੇਦਨਸ਼ੀਲ ਗਤੀਵਿਧੀਆਂ ਲਈ ਕਦੇ ਵੀ ਜਨਤਕ Wi-Fi ਦੀ ਵਰਤੋਂ ਨਾ ਕਰੋ।',
    ],

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
    googleSignInTitle: 'Google ਸਾਈਨ-ਇਨ',
    googleSignInMessage: 'Google ਸਾਈਨ-ਇਨ ਪ੍ਰਕਿਰਿਆ ਸ਼ੁਰੂ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...',

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
    warningText: 'ਇਹ ਸੰਦੇਸ਼ ਸੰਭਾਵਿਤ ਹੇਰਾਫੇਰੀ ਦੇ ਸੰਕੇਤ ਦਿਖਾਉਂਦਾ ਹੈ। ਬਹੁਤ ਸਾਵਧਾਨੀ ਨਾਲ ਅੱਗੇ ਵਧੋ।',
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
    apiConnectionError: 'ਸਰਵਰ ਨਾਲ ਕਨੈਕਟ ਨਹੀਂ ਕਰ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
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
    scamProtectionTitle_romance: 'ਰੋਮਾਂਸ ਸਕੈਮ',


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

    // Onboarding Screen 1
    onboardingDescription: 'VaultVu ਨਾਲ ਆਪਣੇ ਡਿਜੀਟਲ ਜੀਵਨ ਨੂੰ ਸੁਰੱਖਿਅਤ ਕਰੋ। ਆਪਣੀ ਜਾਣਕਾਰੀ ਤੱਕ ਸਹਿਜ ਅਤੇ ਸੁਰੱਖਿਅਤ ਪਹੁੰਚ ਦਾ ਅਨੁਭਵ ਕਰੋ।',
    onboardingSignInButton: 'ਸਾਈਨ ਇਨ ਜਾਂ ਸਾਈਨ ਅੱਪ',
    onboardingCopyright: 'ਕਾਪੀਰਾਈਟ © 2025 ਪੰਜਾਬ ਐਂਡ ਸਿੰਧ ਬੈਂਕ',
      
    // Onboarding Screen 2
    newOnboardingDescription: 'VaultVu ਤੁਹਾਨੂੰ ਇੰਟਰਐਕਟਿਵ ਪਾਠਾਂ ਅਤੇ ਸਮਾਰਟ ਟੂਲਜ਼ ਨਾਲ ਵਿੱਤੀ ਸਾਖਰਤਾ ਵਿੱਚ ਮੁਹਾਰਤ ਹਾਸਲ ਕਰਨ ਅਤੇ ਧੋਖਾਧੜੀ ਤੋਂ ਆਪਣੇ ਆਪ ਨੂੰ ਬਚਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ। ਆਪਣੇ ਵਿੱਤੀ ਭਵਿੱਖ ਨੂੰ ਸੁਰੱਖਿਅਤ ਕਰੋ।',
    newOnboardingGetStartedButton: 'ਸ਼ੁਰੂ ਕਰੋ',
    newOnboardingAlreadyAccountButton: 'ਮੇਰੇ ਕੋਲ ਪਹਿਲਾਂ ਹੀ ਇੱਕ ਖਾਤਾ ਹੈ',
    newOnboardingCopyright: 'ਕਾਪੀਰਾਈਟ © 2025 ਪੰਜਾਬ ਐਂਡ ਸਿੰਧ ਬੈਂਕ',
      
    // Sign In Page
    signInHeader: 'ਸਾਈਨ ਇਨ ਕਰੋ',
    emailLabel: 'ਈਮੇਲ',
    passwordLabel: 'ਪਾਸਵਰਡ',
    rememberMe: 'ਮੈਨੂੰ ਯਾਦ ਰੱਖੋ',
    forgotPassword: 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?',
    or: 'ਜਾਂ',
    signInWithGoogle: 'Google ਨਾਲ ਸਾਈਨ ਇਨ ਕਰੋ',
    signInMainButton: 'ਸਾਈਨ ਇਨ',
    signInAlertSuccess: 'ਸਫਲਤਾਪੂਰਵਕ ਸਾਈਨ ਇਨ ਕੀਤਾ ਗਿਆ!',
    signInAlertFailed: 'ਸਾਈਨ-ਇਨ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    networkError: 'ਸਰਵਰ ਨਾਲ ਕਨੈਕਟ ਨਹੀਂ ਕਰ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਨੈੱਟਵਰਕ ਕਨੈਕਸ਼ਨ ਅਤੇ ਸਰਵਰ IP ਪਤੇ ਦੀ ਜਾਂਚ ਕਰੋ।',
    validationError: 'ਕਿਰਪਾ ਕਰਕੇ ਹਾਈਲਾਈਟ ਕੀਤੀਆਂ ਤਰੁੱਟੀਆਂ ਨੂੰ ਠੀਕ ਕਰੋ।',
    googleSignInTitle: 'Google ਸਾਈਨ-ਇਨ',
    googleSignInMessage: 'Google ਸਾਈਨ-ਇਨ ਪ੍ਰਕਿਰਿਆ ਸ਼ੁਰੂ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...',

    // Create Account Page 1
    createAccountHeader: 'ਇੱਕ',
    accountHighlight: 'ਖਾਤਾ ਬਣਾਓ',
    signupDescription: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਪ੍ਰੋਫਾਈਲ ਪੂਰਾ ਕਰੋ। ਚਿੰਤਾ ਨਾ ਕਰੋ, ਤੁਹਾਡਾ ਡਾਟਾ ਨਿੱਜੀ ਰਹੇਗਾ ਅਤੇ ਸਿਰਫ਼ ਤੁਸੀਂ ਹੀ ਇਸਨੂੰ ਦੇਖ ਸਕਦੇ ਹੋ।',
    firstNameLabel: 'ਪਹਿਲਾ ਨਾਮ',
    lastNameLabel: 'ਆਖਰੀ ਨਾਮ',
    emailLabel_signup: 'ਈਮੇਲ',
    passwordLabel_signup: 'ਪਾਸਵਰਡ',
    firstNameRequired: 'ਪਹਿਲਾ ਨਾਮ ਲਾਜ਼ਮੀ ਹੈ',
    lastNameRequired: 'ਆਖਰੀ ਨਾਮ ਲਾਜ਼ਮੀ ਹੈ',
    invalidEmail_signup: 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਸਹੀ ਈਮੇਲ ਦਾਖਲ ਕਰੋ',
    passwordValidationError: 'ਪਾਸਵਰਡ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ:',
    passwordRule_8char: 'ਘੱਟੋ-ਘੱਟ 8 ਅੱਖਰ',
    passwordRule_uppercase: 'ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵੱਡਾ ਅੱਖਰ',
    passwordRule_lowercase: 'ਘੱਟੋ-ਘੱਟ ਇੱਕ ਛੋਟਾ ਅੱਖਰ',
    passwordRule_number: 'ਘੱਟੋ-ਘੱਟ ਇੱਕ ਨੰਬਰ',
    passwordRule_specialChar: 'ਘੱਟੋ-ਘੱਟ ਇੱਕ ਖਾਸ ਅੱਖਰ (!@#$%^&*)',
    rememberMe_signup: 'ਮੈਨੂੰ ਯਾਦ ਰੱਖੋ',
    or_signup: 'ਜਾਂ',
    createAccountButton: 'ਖਾਤਾ ਬਣਾਓ',
    signupSuccessAlertTitle: 'ਸਫਲਤਾ',
    signupFailedAlertMessage: 'ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    serverConnectionError_signup: 'ਸਰਵਰ ਨਾਲ ਕਨੈਕਟ ਨਹੀਂ ਕਰ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    formValidationError_signup: 'ਖਾਤਾ ਬਣਾਉਣ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਤਰੁੱਟੀਆਂ ਨੂੰ ਠੀਕ ਕਰੋ।',

    // Create Account Page 2
    signup2Header: 'ਇੱਕ',
    signup2Description: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਯੂਜ਼ਰਨੇਮ, ਜਨਮ ਮਿਤੀ, ਦੇਸ਼ ਅਤੇ ਲਿੰਗ ਦਾਖਲ ਕਰੋ।',
    usernameLabel: 'ਯੂਜ਼ਰਨੇਮ',
    dateOfBirthLabel: 'ਜਨਮ ਮਿਤੀ',
    countryLabel: 'ਦੇਸ਼',
    genderLabel: 'ਲਿੰਗ',
    selectCountry: 'ਦੇਸ਼ ਚੁਣੋ',
    selectGender: 'ਲਿੰਗ ਚੁਣੋ',
    male: 'ਮਰਦ',
    female: 'ਔਰਤ',
    other: 'ਹੋਰ',
    preferNotToSay: 'ਦੱਸਣਾ ਪਸੰਦ ਨਹੀਂ',
    usernameRequired: 'ਯੂਜ਼ਰਨੇਮ ਲਾਜ਼ਮੀ ਹੈ',
    dobRequired: 'ਜਨਮ ਮਿਤੀ ਲਾਜ਼ਮੀ ਹੈ',
    countryRequired: 'ਦੇਸ਼ ਲਾਜ਼ਮੀ ਹੈ',
    genderRequired: 'ਲਿੰਗ ਲਾਜ਼ਮੀ ਹੈ',
    signUpButton: 'ਸਾਈਨ ਅੱਪ',
    allFieldsRequiredAlert: 'ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਲੋੜੀਂਦੇ ਖੇਤਰ ਭਰੋ।',
    accountCreatedSuccess: 'ਖਾਤਾ ਸਫਲਤਾਪੂਰਵਕ ਬਣਾਇਆ ਗਿਆ ਹੈ!',

    // Budget Manager Screen
    budgetManagerScreenTitle: 'ਬਜਟ ਮੈਨੇਜਰ',
    budgetTracker: 'ਬਜਟ ਟ੍ਰੈਕਰ',
    emiCalculator: 'ਈ.ਐੱਮ.ਆਈ. ਕੈਲਕੁਲੇਟਰ ਅਤੇ ਮੈਨੇਜਰ',
    sipTracker: 'ਸਿਪ ਟ੍ਰੈਕਰ ਅਤੇ ਕੈਲਕੁਲੇਟਰ',
    budgetManager: 'ਬਜਟ ਮੈਨੇਜਰ',
    budgetManagerDesc: 'ਆਪਣੇ ਬਜਟ, EMI, SIP ਅਤੇ ਹੋਰ ਵਿੱਤੀ ਸਾਧਨਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ।',

    // QuizScreen keys
    dailyQuiz: "ਰੋਜ਼ਾਨਾ ਕਵਿਜ਼",
    dailyQuizDesc: "ਹਰ ਰੋਜ਼ ਨਵੇਂ ਸਵਾਲਾਂ ਨਾਲ ਆਪਣੇ ਆਪ ਨੂੰ ਚੁਣੌਤੀ ਦਿਓ!",
    quizBattle: "ਕਵਿਜ਼ ਬੈਟਲ",
    quizBattleDesc: "ਦੋਸਤਾਂ ਜਾਂ ਹੋਰ ਉਪਭੋਗਤਾਵਾਂ ਨਾਲ ਅਸਲ-ਸਮੇਂ ਵਿੱਚ ਮੁਕਾਬਲਾ ਕਰੋ।",
    levels: "ਪੱਧਰ",
    levelsDesc: "ਕਵਿਜ਼ ਮਾਸਟਰ ਬਣਨ ਲਈ ਵੱਖ-ਵੱਖ ਪੱਧਰਾਂ ਵਿੱਚੋਂ ਲੰਘੋ।",

    // ReportIssueScreen keys
    introText: 'ਸਿੱਧੇ ਤੌਰ ਤੇ ਸਰਕਾਰੀ ਧੋਖਾਧੜੀ ਰਿਪੋਰਟਿੰਗ ਪੋਰਟਲ ਤੱਕ ਪਹੁੰਚ ਕਰੋ। ਆਪਣੀ ਸਮੱਸਿਆ ਦੀ ਰਿਪੋਰਟ ਕਰਨ ਲਈ ਹੇਠਾਂ ਦਿੱਤੇ ਢੁਕਵੇਂ ਲਿੰਕ ਦੀ ਚੋਣ ਕਰੋ।',
    disclaimerText: 'ਬੇਦਾਅਵਾ: ਇਹ ਲਿੰਕ ਤੁਹਾਨੂੰ ਸਰਕਾਰੀ ਵੈੱਬਸਾਈਟਾਂ ਤੇ ਭੇਜਦੇ ਹਨ। VaultVu ਇਹਨਾਂ ਬਾਹਰੀ ਸਾਈਟਾਂ ਦੁਆਰਾ ਪ੍ਰਦਾਨ ਕੀਤੀ ਸਮੱਗਰੀ ਜਾਂ ਸੇਵਾਵਾਂ ਲਈ ਜ਼ਿੰਮੇਵਾਰ ਨਹੀਂ ਹੈ।',
    rbiReportingTitle: 'ਆਰਬੀਆਈ ਧੋਖਾਧੜੀ ਰਿਪੋਰਟਿੰਗ',
    rbiReportingDesc: 'ਭਾਰਤੀ ਰਿਜ਼ਰਵ ਬੈਂਕ ਨੂੰ ਸਿੱਧੇ ਤੌਰ ਤੇ ਵਿੱਤੀ ਧੋਖਾਧੜੀ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
    punjabBankReportingTitle: 'ਪੰਜਾਬ ਐਂਡ ਸਿੰਧ ਬੈਂਕ ਧੋਖਾਧੜੀ ਰਿਪੋਰਟਿੰਗ',
    punjabBankReportingDesc: 'ਪੰਜਾਬ ਐਂਡ ਸਿੰਧ ਬੈਂਕ ਖਾਤਿਆਂ ਨਾਲ ਸੰਬੰਧਿਤ ਸ਼ੱਕੀ ਗਤੀਵਿਧੀਆਂ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
    cybercrimeReportingTitle: 'ਰਾਸ਼ਟਰੀ ਸਾਈਬਰ ਕ੍ਰਾਈਮ ਰਿਪੋਰਟਿੰਗ ਪੋਰਟਲ',
    cybercrimeReportingDesc: 'ਵਿੱਤੀ ਧੋਖਾਧੜੀ ਸਮੇਤ ਸਾਰੇ ਕਿਸਮ ਦੇ ਸਾਈਬਰ ਅਪਰਾਧਾਂ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
    upiFraudReportingTitle: 'ਯੂਪੀਆਈ ਧੋਖਾਧੜੀ ਰਿਪੋਰਟਿੰਗ',
    upiFraudReportingDesc: 'ਯੂਪੀਆਈ-ਸਬੰਧਤ ਧੋਖਾਧੜੀ ਅਤੇ ਅਣਅਧਿਕਾਰਤ ਲੈਣ-ਦੇਣ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
    phishingReportingTitle: 'ਫਿਸ਼ਿੰਗ ਵੈੱਬਸਾਈਟ ਰਿਪੋਰਟਿੰਗ',
    phishingReportingDesc: 'ਫਿਸ਼ਿੰਗ ਵੈੱਬਸਾਈਟਾਂ ਅਤੇ ਈਮੇਲਾਂ ਦੀ CERT-In ਨੂੰ ਰਿਪੋਰਟ ਕਰੋ',
    error: 'ਗਲਤੀ',
    cannotOpenUrlError: 'ਇਹ URL ਨਹੀਂ ਖੋਲ੍ਹਿਆ ਜਾ ਸਕਦਾ। ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    ok: 'ਠੀਕ ਹੈ',

    // Fraud Detection
    fraudDetection: 'ਧੋਖਾਧੜੀ ਦਾ ਪਤਾ ਲਗਾਉਣਾ',
    callDetection: 'ਕਾਲ ਡਿਟੈਕਸ਼ਨ',
    callDetectionDesc: 'ਸੰਭਾਵੀ ਧੋਖਾਧੜੀ ਵਾਲੀਆਂ ਕਾਲਾਂ ਲਈ ਅਲਰਟ ਪ੍ਰਾਪਤ ਕਰੋ',
    messageDetection: 'ਸੰਦੇਸ਼ ਡਿਟੈਕਸ਼ਨ',
    messageDetectionDesc: 'ਸੰਭਾਵੀ ਧੋਖਾਧੜੀ ਵਾਲੇ ਸੰਦੇਸ਼ਾਂ ਲਈ ਅਲਰਟ ਪ੍ਰਾਪਤ ਕਰੋ',
    suspiciousCallAlert: 'ਸ਼ੱਕੀ ਕਾਲ ਅਲਰਟ',
    suspiciousMessageAlert: 'ਸ਼ੱਕੀ ਸੰਦੇਸ਼ ਅਲਰਟ',
    callVerified: 'ਕਾਲ ਪ੍ਰਮਾਣਿਤ',
    messageVerified: 'ਸੰਦੇਸ਼ ਪ੍ਰਮਾਣਿਤ',

    // Landing Page
    welcomeTo: 'ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ',
    poweredByText: 'ਪੰਜਾਬ ਐਂਡ ਸਿੰਧ ਬੈਂਕ ਦੁਆਰਾ IKGPTU ਦੇ ਸਹਿਯੋਗ ਨਾਲ ਸੰਚਾਲਿਤ',
    continueButtonText: 'ਜਾਰੀ ਰੱਖੋ',
    copyright: 'ਕਾਪੀਰਾਈਟ © 2025 ਪੰਜਾਬ ਐਂਡ ਸਿੰਧ ਬੈਂਕ',
    
    // Chatbot
    aiAssistantTitle: "ਵਾਲਟਵੂ ਏ.ਆਈ. ਸਹਾਇਕ",
    aiAssistantSubtitle: "ਬੈਂਕਿੰਗ ਧੋਖਾਧੜੀ ਰੋਕਥਾਮ",
    chatInputPlaceholder: "ਬੈਂਕਿੰਗ ਧੋਖਾਧੜੀ ਰੋਕਥਾਮ ਬਾਰੇ ਪੁੱਛੋ...",
    chatInitialMessage: "👋 ਹੈਲੋ! ਮੈਂ ਵਾਲਟਵੂ ਏ.ਆਈ. ਹਾਂ, ਤੁਹਾਡਾ ਬੈਂਕਿੰਗ ਧੋਖਾਧੜੀ ਰੋਕਥਾਮ ਸਹਾਇਕ। ਮੈਂ ਇੱਥੇ ਵਿੱਤੀ ਸੁਰੱਖਿਆ ਬਾਰੇ ਸਿੱਖਣ ਅਤੇ ਆਪਣੇ ਆਪ ਨੂੰ ਘੁਟਾਲਿਆਂ ਤੋਂ ਬਚਾਉਣ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਲਈ ਹਾਂ। ਤੁਸੀਂ ਕੀ ਜਾਣਨਾ ਚਾਹੋਗੇ?",
    keywordHello: 'ਹੈਲੋ',
    keywordHi: 'ਹਾਇ',
    keywordHey: 'ਹੇ',
    keywordHelp: 'ਮਦਦ',
    keywordAssist: 'ਸਹਾਇਤਾ',
    keywordThank: 'ਧੰਨਵਾਦ',
    responseHello: "👋 ਹੈਲੋ! ਮੈਂ ਬੈਂਕਿੰਗ ਧੋਖਾਧੜੀ ਰੋਕਥਾਮ ਬਾਰੇ ਸਿੱਖਣ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਲਈ ਇੱਥੇ ਹਾਂ। ਤੁਸੀਂ ਕਿਹੜੇ ਖਾਸ ਵਿਸ਼ੇ ਦੀ ਪੜਚੋਲ ਕਰਨਾ ਚਾਹੋਗੇ?",
    responseHelp: "🤝 ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ:\n\n• **ਫਿਸ਼ਿੰਗ** - ਈਮੇਲ ਅਤੇ ਸੰਦੇਸ਼ ਘੁਟਾਲੇ\n• **ਏ.ਟੀ.ਐਮ. ਸੁਰੱਖਿਆ** - ਕਾਰਡ ਸਕਿਮਿੰਗ ਅਤੇ ਏ.ਟੀ.ਐਮ. ਧੋਖਾਧੜੀ\n• **ਪਛਾਣ ਦੀ ਚੋਰੀ** - ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਦੀ ਸੁਰੱਖਿਆ\n• **ਔਨਲਾਈਨ ਬੈਂਕਿੰਗ** - ਡਿਜੀਟਲ ਸੁਰੱਖਿਆ ਦੇ ਵਧੀਆ ਅਭਿਆਸ\n• **ਨਿਵੇਸ਼ ਘੁਟਾਲੇ** - ਧੋਖਾਧੜੀ ਵਾਲੀਆਂ ਨਿਵੇਸ਼ ਯੋਜਨਾਵਾਂ\n• **ਮੋਬਾਈਲ ਬੈਂਕਿੰਗ** - ਸਮਾਰਟਫੋਨ ਸੁਰੱਖਿਆ\n\nਬੱਸ ਇਹਨਾਂ ਵਿੱਚੋਂ ਕਿਸੇ ਵੀ ਵਿਸ਼ੇ ਬਾਰੇ ਪੁੱਛੋ!",
    responseThanks: "😊 ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ! ਸਾਵਧਾਨ ਰਹੋ ਅਤੇ ਧੋਖਾਧੜੀ ਰੋਕਥਾਮ ਬਾਰੇ ਸਿੱਖਦੇ ਰਹੋ। ਕੀ ਤੁਸੀਂ ਕੁਝ ਹੋਰ ਜਾਣਨਾ ਚਾਹੋਗੇ?",
    generalResponses: [
      "ਮੈਂ ਬੈਂਕਿੰਗ ਧੋਖਾਧੜੀ ਰੋਕਥਾਮ ਬਾਰੇ ਸਿੱਖਣ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਲਈ ਇੱਥੇ ਹਾਂ! ਤੁਸੀਂ ਮੈਨੂੰ ਫਿਸ਼ਿੰਗ, ਏ.ਟੀ.ਐਮ. ਸੁਰੱਖਿਆ, ਪਛਾਣ ਦੀ ਚੋਰੀ, ਔਨਲਾਈਨ ਬੈਂਕਿੰਗ ਸੁਰੱਖਿਆ, ਨਿਵੇਸ਼ ਘੁਟਾਲੇ, ਜਾਂ ਮੋਬਾਈਲ ਬੈਂਕਿੰਗ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।",
      "ਬੈਂਕਿੰਗ ਸੁਰੱਖਿਆ ਮਹੱਤਵਪੂਨ ਹੈ! ਮੈਂ ਵੱਖ-ਵੱਖ ਧੋਖਾਧੜੀ ਦੀਆਂ ਕਿਸਮਾਂ ਅਤੇ ਆਪਣੇ ਆਪ ਨੂੰ ਕਿਵੇਂ ਬਚਾਉਣਾ ਹੈ, ਬਾਰੇ ਜਾਣਕਾਰੀ ਪ੍ਰਦਾਨ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ਕਿਸ ਖਾਸ ਵਿਸ਼ੇ ਵਿੱਚ ਦਿਲਚਸਪੀ ਰੱਖਦੇ ਹੋ?",
      "ਮੈਨੂੰ ਵਿੱਤੀ ਧੋਖਾਧੜੀ ਤੋਂ ਸੁਰੱਖਿਅਤ ਰਹਿਣ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਦਿਓ। ਤੁਸੀਂ ਆਮ ਘੁਟਾਲਿਆਂ, ਰੋਕਥਾਮ ਸੁਝਾਅ, ਜਾਂ ਜੇਕਰ ਤੁਸੀਂ ਨਿਸ਼ਾਨਾ ਬਣੇ ਹੋ ਤਾਂ ਕੀ ਕਰਨਾ ਹੈ, ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।",
    ],
    fraudKnowledgeBase: {
      phishing: {
        keywords: ['ਫਿਸ਼ਿੰਗ', 'ਨਕਲੀ ਈਮੇਲ', 'ਸ਼ੱਕੀ ਈਮੇਲ', 'ਈਮੇਲ ਘੁਟਾਲਾ'],
        response: "🎣 **ਫਿਸ਼ਿੰਗ** ਉਦੋਂ ਹੁੰਦਾ ਹੈ ਜਦੋਂ ਘੁਟਾਲੇਬਾਜ਼ ਬੈਂਕਾਂ ਵਰਗੀਆਂ ਜਾਇਜ਼ ਸੰਸਥਾਵਾਂ ਬਣ ਕੇ ਨਕਲੀ ਈਮੇਲ, ਟੈਕਸਟ ਜਾਂ ਕਾਲਾਂ ਭੇਜਦੇ ਹਨ।\n\n**ਚੇਤਾਵਨੀ ਦੇ ਸੰਕੇਤ:**\n• ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਲਈ ਜ਼ਰੂਰੀ ਬੇਨਤੀਆਂ\n• ਸ਼ੱਕੀ ਭੇਜਣ ਵਾਲੇ ਪਤੇ\n• ਮਾੜਾ ਵਿਆਕਰਨ/ਸਪੈਲਿੰਗ\n• ਆਮ ਸ਼ੁਭਕਾਮਨਾਵਾਂ\n\n**ਸੁਰੱਖਿਅਤ ਰਹੋ:** ਕਦੇ ਵੀ ਸ਼ੱਕੀ ਲਿੰਕਾਂ 'ਤੇ ਕਲਿੱਕ ਨਾ ਕਰੋ, ਅਧਿਕਾਰਤ ਚੈਨਲਾਂ ਰਾਹੀਂ ਭੇਜਣ ਵਾਲੇ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ, ਅਤੇ ਫਿਸ਼ਿੰਗ ਕੋਸ਼ਿਸ਼ਾਂ ਦੀ ਰਿਪੋਰਟ ਕਰੋ।"
      },
      atm: {
        keywords: ['ਏ.ਟੀ.ਐਮ.', 'ਕਾਰਡ ਸਕਿਮਿੰਗ', 'ਏ.ਟੀ.ਐਮ. ਧੋਖਾਧੜੀ', 'ਕਾਰਡ ਰੀਡਰ'],
        response: "🏧 **ਏ.ਟੀ.ਐਮ. ਧੋਖਾਧੜੀ** ਵਿੱਚ ਕਾਰਡ ਸਕਿਮਿੰਗ, ਸ਼ੋਲਡਰ ਸਰਫਿੰਗ ਅਤੇ ਨਕਲੀ ਏ.ਟੀ.ਐਮ. ਸ਼ਾਮਲ ਹਨ।\n\n**ਸੁਰੱਖਿਆ ਸੁਝਾਅ:**\n• ਪਿੰਨ ਦਰਜ ਕਰਦੇ ਸਮੇਂ ਆਪਣੇ ਪਿੰਨ ਨੂੰ ਢਕੋ\n• ਢਿੱਲੇ ਕਾਰਡ ਰੀਡਰਾਂ ਦੀ ਜਾਂਚ ਕਰੋ\n• ਚੰਗੀ ਤਰ੍ਹਾਂ ਰੌਸ਼ਨੀ ਵਾਲੇ, ਰੁੱਝੇ ਹੋਏ ਖੇਤਰਾਂ ਵਿੱਚ ਏ.ਟੀ.ਐਮ. ਦੀ ਵਰਤੋਂ ਕਰੋ\n• ਆਪਣੇ ਖਾਤੇ ਦੀ ਨਿਯਮਤ ਤੌਰ 'ਤੇ ਨਿਗਰਾਨੀ ਕਰੋ\n• ਸ਼ੱਕੀ ਉਪਕਰਣਾਂ ਦੀ ਤੁਰੰਤ ਰਿਪੋਰਟ ਕਰੋ\n\n**ਜੇਕਰ ਸਮਝੌਤਾ ਕੀਤਾ ਗਿਆ ਹੈ:** ਤੁਰੰਤ ਆਪਣੇ ਬੈਂਕ ਨਾਲ ਸੰਪਰਕ ਕਰੋ ਅਤੇ ਆਪਣਾ ਪਿੰਨ ਬਦਲੋ।"
      },
      identity: {
        keywords: ['ਪਛਾਣ ਦੀ ਚੋਰੀ', 'ਨਿੱਜੀ ਜਾਣਕਾਰੀ', 'ਐਸਐਸਐਨ', 'ਸੋਸ਼ਲ ਸਿਕਿਓਰਿਟੀ'],
        response: "🆔 **ਪਛਾਣ ਦੀ ਚੋਰੀ** ਉਦੋਂ ਹੁੰਦੀ ਹੈ ਜਦੋਂ ਅਪਰਾਧੀ ਧੋਖਾਧੜੀ ਕਰਨ ਲਈ ਤੁਹਾਡੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਚੋਰੀ ਕਰ ਲੈਂਦੇ ਹਨ।\n\n**ਰੋਕਥਾਮ:**\n• ਨਿੱਜੀ ਦਸਤਾਵੇਜ਼ਾਂ ਨੂੰ ਸੁਰੱਖਿਅਤ ਰੱਖੋ\n• ਕ੍ਰੈਡਿਟ ਰਿਪੋਰਟਾਂ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ\n• ਮਜ਼ਬੂਤ, ਵਿਲੱਖਣ ਪਾਸਵਰਡਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ\n• ਔਨਲਾਈਨ ਜਾਣਕਾਰੀ ਸਾਂਝੀ ਕਰਨ ਬਾਰੇ ਸਾਵਧਾਨ ਰਹੋ\n• ਸੰਵੇਦਨਸ਼ੀਲ ਦਸਤਾਵੇਜ਼ਾਂ ਨੂੰ ਟੁਕੜੇ-ਟੁਕੜੇ ਕਰ ਦਿਓ\n\n**ਜੇਕਰ ਪ੍ਰਭਾਵਿਤ ਹੋਏ ਹੋ:** ਪੁਲਿਸ ਰਿਪੋਰਟ ਦਰਜ ਕਰੋ, ਕ੍ਰੈਡਿਟ ਬਿਊਰੋ ਨਾਲ ਸੰਪਰਕ ਕਰੋ, ਅਤੇ ਖਾਤਿਆਂ ਦੀ ਨੇੜਿਓਂ ਨਿਗਰਾਨੀ ਕਰੋ।"
      },
      online: {
        keywords: ['ਔਨਲਾਈਨ ਬੈਂਕਿੰਗ', 'ਇੰਟਰਨੈੱਟ ਬੈਂਕਿੰਗ', 'ਡਿਜੀਟਲ ਧੋਖਾਧੜੀ', 'ਸਾਈਬਰ ਸੁਰੱਖਿਆ'],
        response: "💻 **ਔਨਲਾਈਨ ਬੈਂਕਿੰਗ ਸੁਰੱਖਿਆ** ਅੱਜ ਦੇ ਡਿਜੀਟਲ ਸੰਸਾਰ ਵਿੱਚ ਬਹੁਤ ਮਹੱਤਵਪੂਰਨ ਹੈ।\n\n**ਵਧੀਆ ਅਭਿਆਸ:**\n• ਅਧਿਕਾਰਤ ਬੈਂਕ ਐਪਾਂ/ਵੈੱਬਸਾਈਟਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ\n• ਦੋ-ਕਾਰਕ ਪ੍ਰਮਾਣਿਕਤਾ ਨੂੰ ਸਮਰੱਥ ਕਰੋ\n• ਜਨਤਕ WiFi 'ਤੇ ਕਦੇ ਵੀ ਬੈਂਕਿੰਗ ਨਾ ਕਰੋ\n• ਸੈਸ਼ਨਾਂ ਤੋਂ ਬਾਅਦ ਪੂਰੀ ਤਰ੍ਹਾਂ ਲੌਗ ਆਉਟ ਕਰੋ\n• ਡਿਵਾਈਸਾਂ ਨੂੰ ਅੱਪਡੇਟ ਰੱਖੋ\n\n**ਲਾਲ ਝੰਡੇ:** ਅਚਾਨਕ ਲੌਗਇਨ ਅਲਰਟ, ਅਣਜਾਣ ਲੈਣ-ਦੇਣ, ਜਾਂ ਪ੍ਰਮਾਣ-ਪੱਤਰਾਂ ਲਈ ਬੇਨਤੀਆਂ।"
      },
      investment: {
        keywords: ['ਨਿਵੇਸ਼ ਘੁਟਾਲਾ', 'ਪੋਂਜ਼ੀ ਸਕੀਮ', 'ਨਕਲੀ ਨਿਵੇਸ਼', 'ਛੇਤੀ ਅਮੀਰ ਬਣੋ'],
        response: "📈 **ਨਿਵੇਸ਼ ਘੁਟਾਲੇ** ਘੱਟ ਜੋਖਮ ਨਾਲ ਅਵਾਸਤਵਿਕ ਰਿਟਰਨ ਦਾ ਵਾਅਦਾ ਕਰਦੇ ਹਨ।\n\n**ਚੇਤਾਵਨੀ ਦੇ ਸੰਕੇਤ:**\n• ਗਾਰੰਟੀਸ਼ੁਦਾ ਉੱਚ ਰਿਟਰਨ\n• ਛੇਤੀ ਨਿਵੇਸ਼ ਕਰਨ ਦਾ ਦਬਾਅ\n• ਬਿਨਾਂ ਲਾਇਸੈਂਸ ਵਾਲੇ ਵਿਕਰੇਤਾ\n• ਗੁੰਝਲਦਾਰ ਰਣਨੀਤੀਆਂ ਜੋ ਤੁਹਾਨੂੰ ਸਮਝ ਨਹੀਂ ਆਉਂਦੀਆਂ\n\n**ਸੁਰੱਖਿਆ:** ਚੰਗੀ ਤਰ੍ਹਾਂ ਖੋਜ ਕਰੋ, ਪ੍ਰਮਾਣ ਪੱਤਰਾਂ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ, 'ਸੱਚ ਹੋਣ ਲਈ ਬਹੁਤ ਵਧੀਆ' ਪੇਸ਼ਕਸ਼ਾਂ ਬਾਰੇ ਸ਼ੱਕੀ ਰਹੋ, ਅਤੇ ਵਿੱਤੀ ਸਲਾਹਕਾਰਾਂ ਨਾਲ ਸਲਾਹ ਕਰੋ।"
      },
      mobile: {
        keywords: ['ਮੋਬਾਈਲ ਬੈਂਕਿੰਗ', 'ਐਪ ਸੁਰੱਖਿਆ', 'ਸਮਾਰਟਫੋਨ ਧੋਖਾਧੜੀ', 'ਮੋਬਾਈਲ ਘੁਟਾਲਾ'],
        response: "📱 **ਮੋਬਾਈਲ ਬੈਂਕਿੰਗ ਸੁਰੱਖਿਆ** ਲਈ ਵਾਧੂ ਚੌਕਸੀ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ।\n\n**ਸੁਰੱਖਿਆ ਉਪਾਅ:**\n• ਅਧਿਕਾਰਤ ਸਟੋਰਾਂ ਤੋਂ ਐਪਸ ਡਾਊਨਲੋਡ ਕਰੋ\n• ਡਿਵਾਈਸ ਲਾਕ ਸਕ੍ਰੀਨਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ\n• ਐਪ-ਵਿਸ਼ੇਸ਼ ਪਿੰਨ ਸਮਰੱਥ ਕਰੋ\n• ਜਨਤਕ ਨੈੱਟਵਰਕਾਂ 'ਤੇ ਬੈਂਕਿੰਗ ਤੋਂ ਬਚੋ\n• ਐਪਸ ਨੂੰ ਅੱਪਡੇਟ ਰੱਖੋ\n\n**ਖਤਰੇ:** ਨਕਲੀ ਬੈਂਕਿੰਗ ਐਪਾਂ, ਐਸਐਮਐਸ ਫਿਸ਼ਿੰਗ, ਅਤੇ ਮੋਬਾਈਲ ਡਿਵਾਈਸਾਂ ਨੂੰ ਨਿਸ਼ਾਨਾ ਬਣਾਉਣ ਵਾਲੇ ਮਾਲਵੇਅਰ।"
      }
    },
    
    // About Us Page
    aboutUsTitle: 'ਸਾਡੇ ਬਾਰੇ',
    appVersionText: 'ਵਰਜਨ 1.0.0',
    aboutUsDescription: 'VaultVu ਇੱਕ ਵਿਆਪਕ ਸੁਰੱਖਿਆ ਐਪਲੀਕੇਸ਼ਨ ਹੈ ਜੋ ਉਪਭੋਗਤਾਵਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਕਿਸਮਾਂ ਦੀਆਂ ਵਿੱਤੀ ਧੋਖਾਧੜੀ ਅਤੇ ਘੁਟਾਲਿਆਂ ਤੋਂ ਬਚਾਉਣ ਲਈ ਡਿਜ਼ਾਈਨ ਕੀਤੀ ਗਈ ਹੈ। ਸਾਡਾ ਮਿਸ਼ਨ ਉਪਭੋਗਤਾਵਾਂ ਨੂੰ ਡਿਜੀਟਲ ਦੁਨੀਆ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਰਹਿਣ ਲਈ ਗਿਆਨ ਅਤੇ ਟੂਲਜ਼ ਨਾਲ ਸ਼ਕਤੀਸ਼ਾਲੀ ਬਣਾਉਣਾ ਹੈ। ਇਹ IK ਗੁਜਰਾਲ ਪੰਜਾਬ ਤਕਨੀਕੀ ਯੂਨੀਵਰਸਿਟੀ ਦੇ ਸਹਿਯੋਗ ਨਾਲ ਪੰਜਾਬ ਐਂਡ ਸਿੰਧ ਬੈਂਕ ਦਾ ਅਧਿਕਾਰਤ ਪ੍ਰੋਜੈਕਟ ਹੈ।',
    ourTeamTitle: 'ਸਾਡੀ ਟੀਮ',
    contactUsButton: 'ਸੰਪਰਕ ਕਰੋ',
    aboutUsCopyright: '© {year} VaultVu. ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।',

    // Team Member Roles & Bios
    roleArpit: 'ਮੁੱਖ ਡਿਵੈਲਪਰ',
    bioArpit: 'MERN ਸਟੈਕ ਵਿੱਚ ਮੁਹਾਰਤ ਵਾਲਾ ਤਜਰਬੇਕਾਰ ਡਿਵੈਲਪਰ।',
    roleMehakpreet: 'UI/UX ਡਿਜ਼ਾਈਨਰ ਅਤੇ ਫਰੰਟੈਂਡ ਡਿਵੈਲਪਰ',
    bioMehakpreet: 'ਅਨੁਭਵੀ ਅਤੇ ਸੁਰੱਖਿਅਤ ਯੂਜ਼ਰ ਇੰਟਰਫੇਸ ਬਣਾਉਣ ਤੇ ਕੇਂਦਰਿਤ ਰਚਨਾਤਮਕ ਡਿਜ਼ਾਈਨਰ। ਰੀਐਕਟ ਨੇਟਿਵ ਅਤੇ ਜਾਵਾਸਕ੍ਰਿਪਟ ਵਿੱਚ ਨਿਪੁੰਨ।',
    roleBisman: 'ਬੈਕਐਂਡ ਡਿਵੈਲਪਰ',
    bioBisman: 'Node.js, Express.js ਅਤੇ MongoDB ਵਿੱਚ ਮੁਹਾਰਤ ਵਾਲਾ ਤਜਰਬੇਕਾਰ ਬੈਕਐਂਡ ਡਿਵੈਲਪਰ।',
    roleAnanya: 'ਫਰੰਟੈਂਡ ਡਿਵੈਲਪਰ',
    bioAnanya: 'ਰੀਐਕਟ ਨੇਟਿਵ ਅਤੇ ਜਾਵਾਸਕ੍ਰਿਪਟ ਵਿੱਚ ਮੁਹਾਰਤ ਵਾਲਾ ਤਜਰਬੇਕਾਰ ਫਰੰਟੈਂਡ ਡਿਵੈਲਪਰ।',

  // Budget Tracker Screen
    budgetTracker: 'ਬਜਟ ਟਰੈਕਰ',
    retry: 'ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ',
    budgetSummary: 'ਬਜਟ ਦਾ ਸਾਰ',
    totalBudget: 'ਕੁੱਲ ਬਜਟ:',
    totalSpent: 'ਕੁੱਲ ਖਰਚ:',
    remaining: 'ਬਾਕੀ:',
    used: 'ਵਰਤਿਆ ਗਿਆ',
    categories: 'ਸ਼੍ਰੇਣੀਆਂ',
    emptyStateText: 'ਕੋਈ ਬਜਟ ਸ਼੍ਰੇਣੀਆਂ ਨਹੀਂ ਮਿਲੀਆਂ। ਆਪਣੀ ਪਹਿਲੀ ਸ਼੍ਰੇਣੀ ਸ਼ਾਮਲ ਕਰੋ!',
    addCategory: 'ਸ਼੍ਰੇਣੀ ਸ਼ਾਮਲ ਕਰੋ',
    editCategory: 'ਸ਼੍ਰੇਣੀ ਸੋਧੋ',
    addTransaction: 'ਲੈਣ-ਦੇਣ ਸ਼ਾਮਲ ਕਰੋ',
    addTransactionError: 'ਕਿਰਪਾ ਕਰਕੇ ਵੇਰਵਾ ਅਤੇ ਰਕਮ ਦੋਵੇਂ ਦਰਜ ਕਰੋ',
    addTransactionInvalidAmount: 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਸਹੀ ਰਕਮ ਦਰਜ ਕਰੋ',
    addTransactionFailed: 'ਲੈਣ-ਦੇਣ ਸ਼ਾਮਲ ਕਰਨ ਵਿੱਚ ਅਸਫਲ',
    categoryNamePlaceholder: 'ਸ਼੍ਰੇਣੀ ਦਾ ਨਾਮ',
    budgetAmountPlaceholder: 'ਬਜਟ ਦੀ ਰਕਮ',
    transactionDescriptionPlaceholder: 'ਵੇਰਵਾ',
    transactionAmountPlaceholder: 'ਰਕਮ',
    modalCancelButtonText: 'ਰੱਦ ਕਰੋ',
    modalSaveButtonText: 'ਸੇਵ ਕਰੋ',
    confirmDeleteTitle: 'ਹਟਾਉਣ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
    confirmDeleteMessage: 'ਕੀ ਤੁਸੀਂ ਇਸ ਸ਼੍ਰੇਣੀ ਨੂੰ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ? ਇਹ ਕਾਰਵਾਈ ਵਾਪਸ ਨਹੀਂ ਲਈ ਜਾ ਸਕਦੀ।',
    delete: 'ਹਟਾਓ',
    deleteCategoryFailed: 'ਸ਼੍ਰੇਣੀ ਹਟਾਉਣ ਵਿੱਚ ਅਸਫਲ',
    addCategoryError: 'ਕਿਰਪਾ ਕਰਕੇ ਨਾਮ ਅਤੇ ਬਜਟ ਰਕਮ ਦੋਵੇਂ ਦਰਜ ਕਰੋ',
    addCategoryInvalidAmount: 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਸਹੀ ਬਜਟ ਰਕਮ ਦਰਜ ਕਰੋ',
    addCategoryFailed: 'ਸ਼੍ਰੇਣੀ ਸ਼ਾਮਲ ਕਰਨ ਵਿੱਚ ਅਸਫਲ',
    editCategoryFailed: 'ਸ਼੍ਰੇਣੀ ਨੂੰ ਅੱਪਡੇਟ ਕਰਨ ਵਿੱਚ ਅਸਫਲ',
    unexpectedError: 'ਇੱਕ ਅਣਕਿਆਸੀ ਤਰੁੱਟੀ ਹੋਈ',

    // SIP Tracker
    calculateSIP: 'SIP ਰਿਟਰਨ ਦੀ ਗਣਨਾ ਕਰੋ',
    sipMonthlyInvestment: 'ਮਾਸਿਕ ਨਿਵੇਸ਼ (₹)',
    sipMonthlyInvestmentPlaceholder: 'ਉਦਾ. 5000',
    sipExpectedReturn: 'ਸਲਾਨਾ ਸੰਭਾਵਿਤ ਰਿਟਰਨ (%)',
    sipExpectedReturnPlaceholder: 'ਉਦਾ. 12',
    sipTimePeriod: 'ਸਮਾਂ ਅਵਧੀ (ਸਾਲ)',
    sipTimePeriodPlaceholder: 'ਉਦਾ. 10',
    calculate: 'ਗਣਨਾ ਕਰੋ',
    reset: 'ਰੀਸੈਟ ਕਰੋ',
    sipResults: 'SIP ਨਤੀਜੇ',
    futureValue: 'ਭਵਿੱਖ ਦਾ ਮੁੱਲ:',
    totalInvestment: 'ਕੁੱਲ ਨਿਵੇਸ਼:',
    estimatedReturns: 'ਅਨੁਮਾਨਿਤ ਰਿਟਰਨ:',
    sipDisclaimer: 'ਨੋਟ: ਇਹ ਕੈਲਕੁਲੇਟਰ ਇੱਕ ਅਨੁਮਾਨ ਦਿੰਦਾ ਹੈ। ਅਸਲ ਰਿਟਰਨ ਬਾਜ਼ਾਰ ਦੀਆਂ ਸਥਿਤੀਆਂ ਅਤੇ ਫੰਡ ਦੇ ਪ੍ਰਦਰਸ਼ਨ ਦੇ ਆਧਾਰ \'ਤੇ ਵੱਖਰੇ ਹੋ ਸਕਦੇ ਹਨ।',

    // EMI Manager
    emiCalculator: 'EMI ਕੈਲਕੁਲੇਟਰ ਅਤੇ ਮੈਨੇਜਰ',
    calculateEMI: 'EMI ਦੀ ਗਣਨਾ ਕਰੋ',
    emiLoanAmount: 'ਕਰਜ਼ੇ ਦੀ ਰਕਮ (₹)',
    emiLoanAmountPlaceholder: 'ਉਦਾ. 100000',
    emiInterestRate: 'ਵਿਆਜ ਦਰ (% ਪ੍ਰਤੀ ਸਾਲ)',
    emiInterestRatePlaceholder: 'ਉਦਾ. 10.5',
    emiLoanTenure: 'ਕਰਜ਼ੇ ਦੀ ਮਿਆਦ (ਸਾਲ)',
    emiLoanTenurePlaceholder: 'ਉਦਾ. 5',
    emiResults: 'EMI ਨਤੀਜੇ',
    monthlyEMI: 'ਮਾਸਿਕ EMI:',
    totalAmount: 'ਕੁੱਲ ਰਕਮ:',
    totalInterest: 'ਕੁੱਲ ਵਿਆਜ:',
    emiDisclaimer: 'ਨੋਟ: ਇਹ ਕੈਲਕੁਲੇਟਰ ਇੱਕ ਅਨੁਮਾਨ ਦਿੰਦਾ ਹੈ। ਅਸਲ EMI ਬੈਂਕ ਦੀਆਂ ਨੀਤੀਆਂ ਅਤੇ ਕਰਜ਼ੇ ਦੀਆਂ ਸ਼ਰਤਾਂ ਦੇ ਆਧਾਰ \'ਤੇ ਵੱਖਰੇ ਹੋ ਸਕਦੇ ਹਨ।',
  }
};

// Create the context
const LanguageContext = createContext({
  currentLanguage: 'english',
  translations: translationsData.english || {},
  changeLanguage: () => {},
});

// Create provider component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [translations, setTranslations] = useState(translationsData.english || {});

  useEffect(() => {
    // Load saved language preference
    const loadLanguagePreference = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage) {
          changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
      }
    };

    loadLanguagePreference();
  }, []);

  const changeLanguage = (language) => {
    if (translationsData[language]) {
      setCurrentLanguage(language);
      setTranslations(translationsData[language]);
      AsyncStorage.setItem('language', language).catch(error => {
        console.error('Error saving language preference:', error);
      });
    } else {
      console.warn(`Language '${language}' not found, defaulting to English`);
      setCurrentLanguage('english');
      setTranslations(translationsData.english || {});
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, translations, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create a custom hook for using the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    console.warn('useLanguage must be used within a LanguageProvider');
    // Return default values to prevent crashes
    return {
      currentLanguage: 'english',
      translations: translationsData.english || {},
      changeLanguage: () => {},
    };
  }
  return context;
};
