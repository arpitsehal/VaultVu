import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    Platform,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Define a consistent color palette
const Colors = {
  background: '#0f0f23',
  cardBackground: '#1A213B',
  textPrimary: '#F7FAFC',
  textSecondary: '#A0AEC0',
  success: '#4ECDC4',
  warning: '#FF6B6B',
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
  rankDefault: '#4A5568',
  progressBar: 'rgba(160, 174, 192, 0.3)',
  progressFill: '#4ECDC4',
  avatarColors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'],
  gradients: {
    gold: ['#FFD700', '#FFA500'] as const,
    silver: ['#C0C0C0', '#A8A8A8'] as const,
    bronze: ['#CD7F32', '#B8860B'] as const,
    default: ['#4A5568', '#2D3748'] as const,
    userRank: ['#667eea', '#764ba2'] as const,
  },
};

const LEADERBOARD_URL = 'https://vaultvu.onrender.com/api/leaderboard/scores';

interface LeaderboardEntry {
  username: string;
  score: number;
  rank: number;
  badges?: string[];
  avatar?: string;
  level?: number;
  progressToNext?: number;
}

export default function LeaderboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    fetchLeaderboardData();
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchLeaderboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = await AsyncStorage.getItem('token');

      if (!token) {
        const sampleData = generateSampleLeaderboardData();
        setLeaderboardData(sampleData);
        setUserRank({
          username: 'Guest User',
          score: 0,
          rank: 0,
          badges: [],
          level: 1,
          progressToNext: 0,
        });
        return;
      }

      const response = await fetch(LEADERBOARD_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }

      const data = await response.json();
      setLeaderboardData(data.leaderboard || []);
      setUserRank(data.userRank || null);
      setError(null);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setError('Failed to load leaderboard. Please try again later.');

      const sampleData = generateSampleLeaderboardData();
      setLeaderboardData(sampleData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const generateSampleLeaderboardData = (): LeaderboardEntry[] => {
    return [
      { username: 'SecurityPro', score: 2850, rank: 1, badges: ['🏆', '🔰', '🛡'], level: 15, progressToNext: 85, avatar: Colors.avatarColors[0] },
      { username: 'CyberDefender', score: 2720, rank: 2, badges: ['🔰', '🛡', '⭐'], level: 14, progressToNext: 62, avatar: Colors.avatarColors[1] },
      { username: 'DigitalGuardian', score: 2580, rank: 3, badges: ['🔰', '⭐'], level: 13, progressToNext: 78, avatar: Colors.avatarColors[2] },
      { username: 'SafetyFirst', score: 2350, rank: 4, badges: ['🔰'], level: 12, progressToNext: 45, avatar: Colors.avatarColors[3] },
      { username: 'PrivacyProtector', score: 2120, rank: 5, badges: ['⭐'], level: 11, progressToNext: 92, avatar: Colors.avatarColors[4] },
      { username: 'SecureUser', score: 1980, rank: 6, level: 10, progressToNext: 34, avatar: Colors.avatarColors[5] },
      { username: 'DataDefender', score: 1750, rank: 7, level: 9, progressToNext: 67, avatar: Colors.avatarColors[6] },
      { username: 'CyberSentry', score: 1620, rank: 8, level: 8, progressToNext: 23, avatar: Colors.avatarColors[0] },
      { username: 'ThreatHunter', score: 1490, rank: 9, level: 7, progressToNext: 89, avatar: Colors.avatarColors[1] },
      { username: 'SecurityNinja', score: 1350, rank: 10, level: 6, progressToNext: 45, avatar: Colors.avatarColors[2] },
    ];
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '👑';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return null;
    }
  };

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1: return Colors.gradients.gold;
      case 2: return Colors.gradients.silver;
      case 3: return Colors.gradients.bronze;
      default: return Colors.gradients.default;
    }
  };

  const AnimatedLeaderboardItem = ({ item, index }: { item: LeaderboardEntry, index: number }) => {
    const itemAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(itemAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.leaderboardItem,
          index < 3 ? styles.topThreeItem : null,
          {
            opacity: itemAnim,
            transform: [{
              translateY: itemAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            }],
          },
        ]}
      >
        <LinearGradient
          colors={getRankGradient(item.rank)}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.itemContent}>
            <View style={styles.leftSection}>
              <View style={styles.rankContainer}>
                <Text style={[styles.rankText, index < 3 ? styles.topThreeRank : null]}>
                  {item.rank}
                </Text>
                {getRankIcon(item.rank) && (
                  <Text style={styles.rankIcon}>{getRankIcon(item.rank)}</Text>
                )}
              </View>

              <View style={[styles.avatar, { backgroundColor: item.avatar || Colors.rankDefault }]}>
                <Text style={styles.avatarText}>
                  {item.username.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={styles.userInfoContainer}>
                <Text style={styles.usernameText}>{item.username}</Text>
                <View style={styles.levelContainer}>
                  {item.progressToNext !== undefined && (
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${item.progressToNext}%` }
                        ]}
                      />
                    </View>
                  )}
                </View>
                {item.badges && item.badges.length > 0 && (
                  <View style={styles.badgesContainer}>
                    {item.badges.map((badge, idx) => (
                      <View key={idx} style={styles.badgeWrapper}>
                        <Text style={styles.badgeIcon}>{badge}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View style={styles.rightSection}>
              <Text style={[styles.scoreText, index < 3 ? styles.topThreeScore : null]}>
                {item.score.toLocaleString()}
              </Text>
              <Text style={styles.pointsLabel}>points</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={Colors.success} />
          <Text style={styles.loadingText}>Loading champions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header with Blur Effect */}
      <BlurView intensity={95} style={styles.headerBlur}>
        <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Leaderboard</Text>
            <Text style={styles.headerSubtitle}>Security Champions</Text>
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={() => fetchLeaderboardData(true)}>
            <Ionicons name="refresh" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </BlurView>

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={48} color={Colors.warning} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => fetchLeaderboardData()}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* User Rank Card */}
            {userRank && (
              <Animated.View style={[styles.userRankContainer, { transform: [{ scale: scaleAnim }] }]}>
                <LinearGradient
                  colors={Colors.gradients.userRank}
                  style={styles.userRankGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.userRankContent}>
                    <View style={styles.userRankLeft}>
                      <Text style={styles.userRankTitle}>Your Position</Text>
                      <View style={styles.userRankInfo}>
                        <View style={styles.userRankBadge}>
                          <Text style={styles.userRankText}>#{userRank.rank || '-'}</Text>
                        </View>
                        <View style={styles.userInfo}>
                          <Text style={styles.userRankName}>{userRank.username}</Text>
                          <Text style={styles.userRankScore}>{userRank.score.toLocaleString()} pts</Text>
                        </View>
                      </View>
                    </View>
                    {userRank.badges && userRank.badges.length > 0 && (
                      <View style={styles.userBadgesContainer}>
                        {userRank.badges.map((badge, idx) => (
                          <View key={idx} style={styles.userBadge}>
                            <Text style={styles.userBadgeIcon}>{badge}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </LinearGradient>
              </Animated.View>
            )}

            {/* Leaderboard List */}
            <View style={styles.leaderboardContainer}>
              <View style={styles.leaderboardHeader}>
                <Text style={styles.leaderboardTitle}>Top Champions</Text>
                <Text style={styles.leaderboardSubtitle}>Compete with the best</Text>
              </View>
              <FlatList
                data={leaderboardData}
                renderItem={({ item, index }) => <AnimatedLeaderboardItem item={item} index={index} />}
                keyExtractor={(item, index) => `leaderboard-${index}`}
                contentContainerStyle={styles.leaderboardList}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => fetchLeaderboardData(true)}
                    tintColor={Colors.success}
                    colors={[Colors.success]}
                  />
                }
              />
            </View>
          </>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  headerBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(15, 15, 35, 0.8)',
  },
  backButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  refreshButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 120 : 140,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.warning,
    textAlign: 'center',
    marginVertical: 16,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  userRankContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  userRankGradient: {
    padding: 20,
  },
  userRankContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userRankLeft: {
    flex: 1,
  },
  userRankTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
    fontWeight: '500',
  },
  userRankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRankBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 16,
  },
  userRankText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  userInfo: {
    flex: 1,
  },
  userRankName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  userRankScore: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  userBadgesContainer: {
    flexDirection: 'row',
  },
  userBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 8,
    borderRadius: 12,
    marginLeft: 8,
  },
  userBadgeIcon: {
    fontSize: 20,
  },
  leaderboardContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  leaderboardHeader: {
    marginBottom: 20,
  },
  leaderboardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  leaderboardSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  leaderboardList: {
    paddingBottom: 32,
  },
  leaderboardItem: {
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  topThreeItem: {
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  gradient: {
    padding: 2,
  },
  itemContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankContainer: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 40,
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  topThreeRank: {
    color: Colors.gold,
  },
  rankIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfoContainer: {
    flex: 1,
  },
  usernameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginRight: 8,
    fontWeight: '500',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.progressBar,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.progressFill,
    borderRadius: 2,
  },
  badgesContainer: {
    flexDirection: 'row',
  },
  badgeWrapper: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    padding: 6,
    borderRadius: 8,
    marginRight: 6,
  },
  badgeIcon: {
    fontSize: 16,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.success,
  },
  topThreeScore: {
    color: Colors.gold,
    fontSize: 22,
  },
  pointsLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
});