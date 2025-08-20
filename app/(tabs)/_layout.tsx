import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import * as Device from 'expo-device';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const [blocked, setBlocked] = useState(false);
  const isProduction = process.env.EXPO_PUBLIC_APP_VARIANT === 'production';

  useEffect(() => {
    const checkSecurity = async () => {
      try {
        // Only enforce in production builds to avoid blocking development
        if (!isProduction) return;

        // Block if app is running in dev mode (should not happen in prod binaries)
        if (__DEV__) {
          setBlocked(true);
          return;
        }

        // Block rooted/jailbroken devices
        const rooted = await Device.isRootedExperimentalAsync?.();
        if (rooted) {
          setBlocked(true);
        }
      } catch (e) {
        // Fail closed is risky; prefer fail open to avoid bricking legitimate users
        // Do nothing on error
      }
    };
    checkSecurity();
  }, [isProduction]);

  if (blocked) {
    return (
      <View style={styles.blockedContainer}>
        <Text style={styles.blockedTitle}>Security Policy</Text>
        <Text style={styles.blockedText}>
          This device or build configuration does not meet the app's security requirements.
        </Text>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'AI Assistant',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="message.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  blockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  blockedTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A213B',
    marginBottom: 12,
  },
  blockedText: {
    fontSize: 16,
    color: '#1A213B',
    textAlign: 'center',
  },
});
