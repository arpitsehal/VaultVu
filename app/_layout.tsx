import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { LanguageProvider } from '../contexts/LanguageContext';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <LanguageProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="getstarted" />
          <Stack.Screen name="getstarted2" />
          <Stack.Screen name="signin" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="signup2" />
          <Stack.Screen name="forgetpass" />
          <Stack.Screen name="otpvarification" />
          {/* No createaccount route needed - using signup instead */}
          <Stack.Screen name="home" />
          <Stack.Screen name="ScamProtectionScreen" />
          <Stack.Screen name="FraudProtectionScreen" />
          <Stack.Screen name="CheckSpamScreen" />
          <Stack.Screen name="URLTheftCheckerScreen" />
          <Stack.Screen name="VoiceTheftCheckerScreen" />
          <Stack.Screen name="FraudMessageCheckerScreen" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="userProfile" />
          <Stack.Screen name="languageSettings" />
          <Stack.Screen name="aboutUs" />
          <Stack.Screen name="report" />
          
          {/* Fraud Types */}
          <Stack.Screen name="phishingFraud" />
          <Stack.Screen name="cardCloningFraud" />
          <Stack.Screen name="upiFraud" />
          <Stack.Screen name="loanFraud" />
          <Stack.Screen name="kycFraud" />
          <Stack.Screen name="atmFraud" />
          <Stack.Screen name="investmentFraud" />
          <Stack.Screen name="insuranceFraud" />
          <Stack.Screen name="identityTheftFraud" />
          <Stack.Screen name="fakeCustomerCareFraud" />
          
          {/* Scam Types */}
          <Stack.Screen name="blackmail" />
          <Stack.Screen name="charityscam" />
          <Stack.Screen name="debtcollection" />
          <Stack.Screen name="debtsettlement" />
          <Stack.Screen name="rbimisuse" />
          <Stack.Screen name="foreclosure" />
          <Stack.Screen name="grandparent" />
          <Stack.Screen name="impostor" />
          <Stack.Screen name="lottery" />
          <Stack.Screen name="mailFraud" />
          <Stack.Screen name="manInMiddle" />
          <Stack.Screen name="moneyMule" />
          <Stack.Screen name="moneyTransfer" />
          <Stack.Screen name="mortgageClosing" />
          <Stack.Screen name="romance" />
          <Stack.Screen name="nonexistentGoods" />
          <Stack.Screen name="dailyquiz" />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </LanguageProvider>
  );
};