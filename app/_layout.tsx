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
          <Stack.Screen name="signin.tsx" />
          <Stack.Screen name="signup.tsx" />
          <Stack.Screen name="signup2.tsx" />
          <Stack.Screen name="forgetpass.tsx" />
          <Stack.Screen name="otpvarification.tsx" />
          <Stack.Screen name="createaccount.tsx" />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="scamProtectionScreen" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="userProfile" options={{ headerShown: false }} />
          <Stack.Screen name="languageSettings" options={{ headerShown: false }} />
          <Stack.Screen name="aboutUs" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </LanguageProvider>
  );
};