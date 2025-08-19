// BudgetManagerScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../contexts/LanguageContext';

const Colors = {
  background: '#1A213B',
  textPrimary: '#FFFFFF',
  textSecondary: '#A8C3D1',
  border: 'rgba(255,255,255,0.1)',
  featuredBorder: '#FFD700',
  buttonPrimary: '#667eea',
};

type Module = {
  id: string;
  title: string;
  routeName: string;
  iconName: keyof typeof Ionicons.glyphMap;
  gradient: string[];
};

export default function BudgetManagerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();

  const [headerAnim] = useState(new Animated.Value(0));

  const budgetModules: Module[] = [
    {
      id: 'budgetTracker',
      title: translations.budgetTracker || 'Budget Tracker',
      routeName: 'BudgetTrackerScreen',
      iconName: 'wallet-outline',
      gradient: ['#667eea', '#764ba2'],
    },
    {
      id: 'emiCalculator',
      title: translations.emiCalculator || 'EMI Calculator & Manager',
      routeName: 'EMIManagerScreen',
      iconName: 'calculator-outline',
      gradient: ['#4facfe', '#00f2fe'],
    },
    {
      id: 'sipTracker',
      title: translations.sipTracker || 'SIP Tracker & Calculator',
      routeName: 'SIPTrackerScreen',
      iconName: 'bar-chart-outline',
      gradient: ['#f093fb', '#f5576c'],
    },
  ];

  useEffect(() => {
    headerAnim.setValue(0);
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleModulePress = (routeName: string) => {
    // @ts-ignore - route names are registered in navigator
    navigation.navigate(routeName);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient colors={["#1A213B", "#2C3E50", "#34495E"]} style={styles.backgroundGradient} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              paddingTop: Platform.OS === 'android' ? insets.top + 10 : 10,
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-40, 0] }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <BlurView intensity={20} style={styles.backButtonBlur}>
              <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
            </BlurView>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{translations.budgetManagerScreenTitle || 'Budget Manager'}</Text>
          </View>
        </Animated.View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.cardsContainer}>
            {budgetModules.map((mod, idx) => (
              <ModuleCard
                key={mod.id}
                title={mod.title}
                iconName={mod.iconName}
                gradient={mod.gradient}
                onPress={() => handleModulePress(mod.routeName)}
                delay={idx * 120}
              />
            ))}
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

type ModuleCardProps = {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  gradient: string[];
  delay?: number;
  onPress: () => void;
};

const ModuleCard: React.FC<ModuleCardProps> = ({ title, iconName, gradient, delay = 0, onPress }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, delay, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, delay, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [delay, fade, scale]);

  const onPressIn = () => {
    Animated.spring(press, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(press, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ opacity: fade, transform: [{ scale }, { scale: press }] }}>
      <TouchableOpacity activeOpacity={1} onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
          <View style={styles.cardInner}>
            <View style={styles.cardIconWrap}>
              <Ionicons name={iconName} size={28} color={Colors.textPrimary} />
            </View>
            <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
            <View style={styles.cardChevron}>
              <Ionicons name="chevron-forward" size={18} color={Colors.textPrimary} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  backgroundGradient: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  safeArea: { flex: 1 },

  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    position: 'relative',
  },
  backButton: { position: 'absolute', left: 20, top: Platform.OS === 'android' ? 50 : 10, zIndex: 10 },
  backButtonBlur: { borderRadius: 12, padding: 12, overflow: 'hidden' },
  headerContent: { alignItems: 'center', paddingTop: 60 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.5 },

  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  cardsContainer: { paddingHorizontal: 24, gap: 20 },
  card: {
    borderRadius: 24,
    width: '100%',
    minHeight: 140,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
    overflow: 'hidden',
  },
  cardInner: {
    flex: 1,
    gap: 14,
  },
  cardIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  cardChevron: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomSpacing: { height: 40 },
});