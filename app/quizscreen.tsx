import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';
import { useIsFocused } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Define a consistent color palette
const Colors = {
  background: '#1A213B',
  darkBackground: '#121212',
  cardBackground: 'rgba(255, 255, 255, 0.1)',
  border: 'rgba(255, 255, 255, 0.1)',
  textPrimary: '#FFFFFF',
  textSecondary: '#A8C3D1',
  featuredBorder: '#FFD700',
  featuredStar: '#FFD700',
  buttonPrimary: '#667eea',
  buttonSecondary: '#A8C3D1',
  easyBadge: 'rgba(76, 175, 80, 0.3)',
  easyText: '#4CAF50',
  mediumBadge: 'rgba(255, 193, 7, 0.3)',
  mediumText: '#FFC107',
  hardBadge: 'rgba(244, 67, 54, 0.3)',
  hardText: '#F44336',
  statsPoints: '#FFD700',
  statsStreak: '#FF6B6B',
  statsAccuracy: '#4ECDC4',
  statsRank: '#9B59B6',
};

// Modern animated quiz card component
type QuizCardProps = {
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  gradient: string[];
  delay?: number;
  featured?: boolean;
  estimatedTime?: string;
};

const ModernQuizCard: React.FC<QuizCardProps> = ({ 
  title, 
  description, 
  iconName, 
  onPress, 
  gradient,
  delay = 0,
  featured = false,
  estimatedTime
}) => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        delay: delay,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeValue, {
        toValue: 1,
        delay: delay,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Difficulty badge removed per request

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleValue }, { scale: pressScale }],
          opacity: fadeValue,
        }
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.quizCard, featured && styles.featuredCard]}
        >
          {featured && (
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={16} color={Colors.featuredStar} />
              <Text style={styles.featuredText}>Popular</Text>
            </View>
          )}
          
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={32} color={Colors.textPrimary} />
            </View>
            {/* Difficulty label removed */}
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDescription}>{description}</Text>
            
            {estimatedTime && (
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.timeText}>{estimatedTime}</Text>
              </View>
            )}
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.startText}>Start Challenge</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.textPrimary} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function QuizScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();
  const isFocused = useIsFocused();
  
  const [headerAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Replay header animation on focus
    headerAnimation.setValue(0);
    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [isFocused]);

  const quizModules = [
    {
      id: 'dailyQuiz',
      title: translations.dailyQuiz || 'Daily Challenge',
      description: translations.dailyQuizDesc || 'Complete today\'s security challenge and earn points!',
      iconName: 'calendar-outline' as const,
      route: '/dailyquiz',
      gradient: ['#667eea', '#764ba2'],
      featured: true,
      estimatedTime: '5 min',
    },
    {
      id: 'quizBattle',
      title: translations.quizBattle || 'Quiz Battle',
      description: translations.quizBattleDesc || 'Challenge friends and compete in real-time security battles!',
      iconName: 'flash-outline' as const,
      route: '/quizBattle',
      gradient: ['#f093fb', '#f5576c'],
      estimatedTime: '10 min',
    },
    {
      id: 'levels',
      title: translations.levels || 'Progressive Levels',
      description: translations.levelsDesc || 'Unlock new levels and master fraud prevention skills!',
      iconName: 'layers-outline' as const,
      route: '/levels',
      gradient: ['#4facfe', '#00f2fe'],
      estimatedTime: '15 min',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#1A213B', '#2C3E50', '#34495E']}
        style={styles.backgroundGradient}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Modern Header */}
        <Animated.View
          style={[
            styles.header,
            {
              paddingTop: Platform.OS === 'android' ? insets.top + 10 : 10,
              opacity: headerAnimation,
              transform: [{
                translateY: headerAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                })
              }]
            }
          ]}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <BlurView intensity={20} style={styles.backButtonBlur}>
              <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
            </BlurView>
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{translations.testYourKnowledge || 'Test Your Knowledge'}</Text>
            {/* Subtitle removed per request */}
          </View>
        </Animated.View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Quiz Options Section */}
          <View style={styles.quizSection}>

            <View style={styles.quizCardsContainer}>
              {quizModules.map((quiz, index) => (
                <ModernQuizCard
                  key={`${quiz.id}-${isFocused ? '1' : '0'}`}
                  title={quiz.title}
                  description={quiz.description}
                  iconName={quiz.iconName}
                  onPress={() => router.push(quiz.route)}
                  gradient={quiz.gradient}
                  delay={index * 200}
                  featured={quiz.featured}
                  estimatedTime={quiz.estimatedTime}
                />
              ))}
            </View>
          </View>

          

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: screenHeight,
  },
  safeArea: {
    flex: 1,
  },
  
  // Header Styles
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'android' ? 50 : 10,
    zIndex: 10,
  },
  backButtonBlur: {
    borderRadius: 12,
    padding: 12,
    overflow: 'hidden',
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '400',
  },

  // Scroll Styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.buttonPrimary,
    fontWeight: '600',
    marginRight: 4,
  },

  // Quiz Section
  quizSection: {
    marginBottom: 32,
  },
  quizCardsContainer: {
    paddingHorizontal: 24,
    gap: 20,
  },
  quizCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: Colors.featuredBorder,
  },
  featuredBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.featuredBorder,
  },
  featuredText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.featuredStar,
    marginLeft: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  cardDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  startText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },

  // Tips Section
  

  // Utility Styles
  bottomSpacing: {
    height: 40,
  },
});