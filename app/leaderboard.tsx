import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');
const LEADERBOARD_URL = 'https://vaultvu.onrender.com/api/leaderboard/scores';

interface LeaderboardEntry {
    username: string;
    score: number;
    rank: number;
    badges?: string[];
}

export default function LeaderboardScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);

    useEffect(() => {
        fetchLeaderboardData();
    }, []);

    const fetchLeaderboardData = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            
            if (!token) {
                // If no token, show sample leaderboard data
                const sampleData = generateSampleLeaderboardData();
                setLeaderboardData(sampleData);
                setUserRank({
                    username: 'Guest User',
                    score: 0,
                    rank: 0,
                    badges: []
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
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
            setError('Failed to load leaderboard. Please try again later.');
            
            // Show sample data on error
            const sampleData = generateSampleLeaderboardData();
            setLeaderboardData(sampleData);
        } finally {
            setLoading(false);
        }
    };

    const generateSampleLeaderboardData = (): LeaderboardEntry[] => {
        return [
            { username: 'SecurityPro', score: 950, rank: 1, badges: ['🏆', '🔰', '🛡️'] },
            { username: 'CyberDefender', score: 920, rank: 2, badges: ['🔰', '🛡️'] },
            { username: 'DigitalGuardian', score: 880, rank: 3, badges: ['🔰'] },
            { username: 'SafetyFirst', score: 850, rank: 4 },
            { username: 'PrivacyProtector', score: 820, rank: 5 },
            { username: 'SecureUser', score: 780, rank: 6 },
            { username: 'DataDefender', score: 750, rank: 7 },
            { username: 'CyberSentry', score: 720, rank: 8 },
            { username: 'ThreatHunter', score: 690, rank: 9 },
            { username: 'SecurityNinja', score: 650, rank: 10 },
        ];
    };

    const renderLeaderboardItem = ({ item, index }: { item: LeaderboardEntry, index: number }) => (
        <View style={[styles.leaderboardItem, index < 3 ? styles.topThreeItem : null]}>
            <View style={styles.rankContainer}>
                <Text style={[styles.rankText, index < 3 ? styles.topThreeRank : null]}>{item.rank}</Text>
            </View>
            <View style={styles.userInfoContainer}>
                <Text style={styles.usernameText}>{item.username}</Text>
                {item.badges && item.badges.length > 0 && (
                    <View style={styles.badgesContainer}>
                        {item.badges.map((badge, idx) => (
                            <Text key={idx} style={styles.badgeIcon}>{badge}</Text>
                        ))}
                    </View>
                )}
            </View>
            <Text style={[styles.scoreText, index < 3 ? styles.topThreeScore : null]}>{item.score}</Text>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A8C3D1" />
                <Text style={styles.loadingText}>Loading leaderboard...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#1A213B" />
            
            <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Leaderboard</Text>
                <TouchableOpacity style={styles.refreshButton} onPress={fetchLeaderboardData}>
                    <Ionicons name="refresh" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <>
                    {userRank && (
                        <View style={styles.userRankContainer}>
                            <Text style={styles.userRankTitle}>Your Ranking</Text>
                            <View style={styles.userRankContent}>
                                <View style={styles.rankContainer}>
                                    <Text style={styles.userRankText}>{userRank.rank || '-'}</Text>
                                </View>
                                <View style={styles.userInfoContainer}>
                                    <Text style={styles.usernameText}>{userRank.username}</Text>
                                    {userRank.badges && userRank.badges.length > 0 && (
                                        <View style={styles.badgesContainer}>
                                            {userRank.badges.map((badge, idx) => (
                                                <Text key={idx} style={styles.badgeIcon}>{badge}</Text>
                                            ))}
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.userScoreText}>{userRank.score}</Text>
                            </View>
                        </View>
                    )}

                    <View style={styles.leaderboardContainer}>
                        <Text style={styles.leaderboardTitle}>Top Security Champions</Text>
                        <FlatList
                            data={leaderboardData}
                            renderItem={renderLeaderboardItem}
                            keyExtractor={(item, index) => `leaderboard-${index}`}
                            contentContainerStyle={styles.leaderboardList}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#2A2F3E',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2A2F3E',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#A8C3D1',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#1A213B',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F0F4F8',
    },
    refreshButton: {
        padding: 8,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#F44336',
        textAlign: 'center',
    },
    userRankContainer: {
        margin: 16,
        backgroundColor: '#3D4457',
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: '#A8C3D1',
    },
    userRankTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#A8C3D1',
        marginBottom: 12,
    },
    userRankContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userRankText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    userScoreText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#A8C3D1',
    },
    leaderboardContainer: {
        flex: 1,
        margin: 16,
        marginTop: 0,
    },
    leaderboardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F0F4F8',
        marginBottom: 12,
    },
    leaderboardList: {
        paddingBottom: 16,
    },
    leaderboardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3D4457',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    topThreeItem: {
        backgroundColor: '#1A213B',
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    rankContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rankText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#F0F4F8',
    },
    topThreeRank: {
        color: '#FFD700',
    },
    userInfoContainer: {
        flex: 1,
    },
    usernameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#F0F4F8',
    },
    badgesContainer: {
        flexDirection: 'row',
        marginTop: 4,
    },
    badgeIcon: {
        fontSize: 16,
        marginRight: 4,
    },
    scoreText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#A8C3D1',
    },
    topThreeScore: {
        color: '#FFD700',
    },
});