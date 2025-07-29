// main dashboard
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
  Platform,
  Image
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; // Assuming expo-router for navigation

const { width: screenWidth } = Dimensions.get('window');

// Define your essential modules/features
const essentialModules = [
  {
    id: 'scamProtection',
    title: 'Scam Protection',
    icon: '🚨',
    description: 'Identify and avoid common scams and phishing attempts.',
    route: '/ScamProtectionScreen', // Adjusted route to match the new screen
  },
  {
    id: 'fraudProtection',
    title: 'Fraud Protection',
    icon: '💳',
    description: 'Safeguard your bank accounts and financial transactions.',
    route: '/fraud-protection',
  },
  {
    id: 'passwordManagement',
    title: 'Password Management',
    icon: '🔑',
    description: 'Create, store, and manage strong, unique passwords securely.',
    route: '/password-management',
  },
  {
    id: 'identityTheft',
    title: 'Identity Theft',
    icon: '👤',
    description: 'Protect your personal information from identity theft and misuse.',
    route: '/identity-teft',
  },
  {
    id: 'creditMonitoring',
    title: 'Credit Monitoring',
    icon: '�',
    description: 'Monitor your credit score and reports for suspicious activity.',
    route: '/credit-monitoring',
  },
  {
    id: 'digitalPrivacy',
    title: 'Digital Privacy',
    icon: '🕵️',
    description: 'Control your online footprint and manage your data privacy settings.',
    route: '/digital-privacy',
  },
];

// Define featured sections/quick access items
const featuredSections = [
  {
    id: 'financialLiteracyQuiz',
    title: 'Financial Literacy Quiz',
    icon: '🧠',
    description: 'Test your knowledge and improve your financial IQ!',
    route: '/quiz', // Placeholder route for the quiz
    cardColor: '#A8C3D1', // Light accent color for the card
    textColor: '#1A213B', // Dark text for contrast
  },
  {
    id: 'leaderboard',
    title: 'Leaderboard',
    icon: '🏆',
    description: 'See how you rank among other security champions!',
    route: '/leaderboard', // Placeholder route for the leaderboard
    cardColor: '#1A213B', // Dark background for the card
    textColor: '#A8C3D1', // Light text for contrast
  },
  {
    id: 'securityTips',
    title: 'Daily Security Tips',
    icon: '💡',
    description: 'Get quick, actionable tips to boost your digital safety.',
    route: '/tips', // Placeholder route
    cardColor: '#A8C3D1',
    textColor: '#1A213B',
  },
  {
    id: 'reportIssue',
    title: 'Report an Issue',
    icon: '⚠️',
    description: 'Quickly report any suspicious activity or security concerns.',
    route: '/report', // Placeholder route
    cardColor: '#1A213B',
    textColor: '#A8C3D1',
  },
];


export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handlePress = (route: string) => {
    console.log(`Navigating to: ${route}`);
    router.push(route); // Ensure these routes exist in your expo-router setup
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" /> {/* Dark status bar for dark background */}

      {/* Header Section */}
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        {/* Combined Text and Image for VaultVu Logo */}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.appName}>VaultVu</Text>
          <Image
            source={require('../assets/images/vaultvu-logo.jpg')} // Path to your VaultVu logo
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity style={styles.profileIconContainer} onPress={() => handlePress('/Setting')}> {/* <<== Changed route to '/SettingsScreen' */}
          <Text style={styles.profileIcon}>⚙️</Text> {/* Settings icon */}
        </TouchableOpacity>
      </View>

      {/* Welcome Message / Tagline */}
      <Text style={styles.welcomeText}>Your Shield in the Digital World</Text>

      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.mainContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Sections / Quick Access */}
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.featuredCardsContainer}>
          {featuredSections.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.featuredCard,
                { backgroundColor: item.cardColor },
                (item.id === 'leaderboard' || item.id === 'reportIssue') && styles.featuredCardBorder // Apply border to leaderboard and reportIssue
              ]}
              onPress={() => handlePress(item.route)}
            >
              <Text style={[styles.featuredIcon, { color: item.textColor }]}>{item.icon}</Text>
              <Text style={[styles.featuredTitle, { color: item.textColor }]}>{item.title}</Text>
              <Text style={[styles.featuredDescription, { color: item.textColor }]}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Essential Modules Section */}
        <Text style={styles.sectionTitle}>Essential Modules</Text>
        <View style={styles.cardsGrid}>
          {essentialModules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={styles.moduleCard}
              onPress={() => handlePress(module.route)}
            >
              <Text style={styles.moduleIcon}>{module.icon}</Text>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Text style={styles.moduleDescription}>{module.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Optional: Bottom Navigation Tabs (if you decide to use them later) */}
      {/* <View style={[styles.bottomNavBar, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.navTab}>
          <Text style={styles.navTabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navTab}>
          <Text style={styles.navTabText}>Alerts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navTab}>
          <Text style={styles.navTabText}>Settings</mText>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A213B', // Dark background for the whole screen
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1A213B', // Match screen background
  },
  headerTitleContainer: { // New container for text and logo
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 26,
    fontWeight: '900', // Extra bold for "VaultVu"
    color: 'white', // White text for app name
    marginRight: 8, // Space between text and logo
  },
  headerLogo: { // Style for the logo in the header
    width: 30, // Small width for the logo
    height: 30, // Small height for the logo
  },
  profileIconContainer: {
    padding: 5,
  },
  profileIcon: {
    fontSize: 24,
    color: '#A8C3D1', // Light accent color for icon
  },
  welcomeText: {
    fontSize: 18,
    color: '#A8C3D1', // Light accent color
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 25,
    paddingHorizontal: 20,
    fontWeight: '500',
  },
  mainScrollView: {
    flex: 1,
    width: '100%',
  },
  mainContentContainer: {
    alignItems: 'center',
    paddingBottom: 20, // Space at the bottom of the scroll view
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white', // White title for sections
    marginBottom: 20,
    marginTop: 30, // More space above new sections
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  // --- Featured Sections Styles ---
  featuredCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow cards to wrap to the next line
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  featuredCard: {
    borderRadius: 20, // More rounded for featured cards
    padding: 20,
    width: screenWidth * 0.45, // Two cards per row (kept as 2 for prominence)
    aspectRatio: 1, // Make them square
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // More prominent shadow
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 15, // Add margin bottom for wrapping cards
  },
  featuredCardBorder: { // New style for border
    borderWidth: 2,
    borderColor: '#A8C3D1',
  },
  featuredIcon: {
    fontSize: 40, // Smaller icons for featured sections (from 50)
    marginBottom: 10,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  featuredDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  // --- Essential Modules Grid Styles (adjusted for new theme and 3-column grid) ---
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Distribute cards evenly with space between
    width: '100%',
    paddingHorizontal: 15, // Adjusted padding for 3 columns
  },
  moduleCard: {
    backgroundColor: '#333A4B', // Slightly lighter dark background for cards
    borderRadius: 15,
    padding: 10, // Slightly reduced padding for smaller cards
    marginBottom: 15,
    width: (screenWidth - 45) / 3, // Calculated for 3 cards per row with 15px total horizontal padding
    aspectRatio: 1, // Make cards square
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    // Removed marginHorizontal as justifyContent:'space-between' and paddingHorizontal handle spacing
  },
  moduleIcon: {
    fontSize: 30, // Smaller icons for modules (from 40)
    marginBottom: 8, // Adjusted margin
    color: '#A8C3D1', // Light accent color for icons
  },
  moduleTitle: {
    fontSize: 14, // Slightly smaller title font for 3-column layout
    fontWeight: 'bold',
    color: 'white', // White text for module titles
    textAlign: 'center',
    marginBottom: 3,
  },
  moduleDescription: {
    fontSize: 10, // Smaller description font
    color: 'rgba(168, 195, 209, 0.8)', // Faded light accent color for descriptions
    textAlign: 'center',
  },
});