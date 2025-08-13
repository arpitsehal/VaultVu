import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');
const API_URL = 'https://vaultvu.onrender.com/api/users';

interface Level {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  unlockCost: number;
  isLocked: boolean;
  completed: boolean;
  score?: number;
}

interface UserQuizLevel {
  levelId: number;
  completed: boolean;
  score: number;
  completedAt?: string;
}

// Predefined quiz levels
const QUIZ_LEVELS: Omit<Level, 'isLocked' | 'completed' | 'score'>[] = [
  {
    id: 1,
    title: 'Financial Basics',
    description: 'Learn the fundamentals of financial security',
    difficulty: 'easy',
    questionCount: 5,
    unlockCost: 0, // First level is free
  },
  {
    id: 2,
    title: 'Fraud Detection',
    description: 'Identify common fraud patterns and scams',
    difficulty: 'easy',
    questionCount: 5,
    unlockCost: 5,
  },
  {
    id: 3,
    title: 'Digital Security',
    description: 'Protect your digital assets and identity',
    difficulty: 'medium',
    questionCount: 7,
    unlockCost: 10,
  },
  {
    id: 4,
    title: 'Investment Safety',
    description: 'Navigate investment risks and opportunities',
    difficulty: 'medium',
    questionCount: 7,
    unlockCost: 15,
  },
  {
    id: 5,
    title: 'Advanced Protection',
    description: 'Master advanced financial security techniques',
    difficulty: 'hard',
    questionCount: 10,
    unlockCost: 25,
  },
];

// Unlock Modal Component
const UnlockModal = ({
  isVisible,
  level,
  userCoins,
  onUnlock,
  onCancel,
}: {
  isVisible: boolean;
  level: Level;
  userCoins: number;
  onUnlock: () => void;
  onCancel: () => void;
}) => {
  const canUnlock = userCoins >= level.unlockCost;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Unlock Level</Text>
          <Text style={styles.modalText}>
            Do you want to unlock "{level.title}" for {level.unlockCost} coins?
          </Text>
          <Text style={styles.modalCoins}>
            Your coins: {userCoins}
          </Text>
          
          {!canUnlock && (
            <Text style={styles.errorText}>
              You don't have enough coins to unlock this level.
            </Text>
          )}
          
          <View style={styles.modalButtonsContainer}>
            <Pressable
              style={[styles.modalButton, styles.buttonCancel]}
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, 
                canUnlock ? styles.buttonUnlock : styles.buttonDisabled]}
              onPress={canUnlock ? onUnlock : undefined}
            >
              <Text style={styles.buttonText}>Unlock</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Level Card Component
const LevelCard = ({
  level,
  onPress,
  onUnlock,
}: {
  level: Level;
  onPress: () => void;
  onUnlock: () => void;
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FFC107';
      case 'hard': return '#F44336';
      default: return '#A8C3D1';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.levelCard, 
        level.completed ? styles.completedCard : null,
        level.isLocked ? styles.lockedCard : null]}
      onPress={level.isLocked ? onUnlock : onPress}
      disabled={level.isLocked && level.unlockCost === 0 ? false : level.isLocked}
    >
      <View style={styles.levelHeader}>
        <Text style={styles.levelTitle}>{level.title}</Text>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(level.difficulty) }]}>
          <Text style={styles.difficultyText}>{level.difficulty}</Text>
        </View>
      </View>
      
      <Text style={styles.levelDescription}>{level.description}</Text>
      
      <View style={styles.levelFooter}>
        <Text style={styles.questionCount}>{level.questionCount} questions</Text>
        
        {level.isLocked ? (
          <View style={styles.unlockContainer}>
            <Text style={styles.unlockCost}>{level.unlockCost} coins</Text>
            <AntDesign name="lock" size={16} color="#F0F4F8" />
          </View>
        ) : level.completed ? (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Score: {level.score}</Text>
            <AntDesign name="checkcircle" size={16} color="#4CAF50" />
          </View>
        ) : (
          <View style={styles.playContainer}>
            <Text style={styles.playText}>Play</Text>
            <AntDesign name="playcircleo" size={16} color="#F0F4F8" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function LevelsScreen() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [userCoins, setUserCoins] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState<boolean>(false);
  
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchUserLevels();
  }, []);

  const fetchUserLevels = async () => {
    try {
      setLoading(true);
      
      // Get user token from AsyncStorage
      const userDataStr = await AsyncStorage.getItem('user');
      const userData = userDataStr ? JSON.parse(userDataStr) : {};
      const token = userData.token;
      
      if (!token) {
        // Instead of showing error, use local data with first level unlocked
        const localLevels = QUIZ_LEVELS.map((level, index) => ({
          ...level,
          isLocked: index > 0 && level.unlockCost > 0, // Only first level unlocked
          completed: false,
          score: 0
        }));
        
        setLevels(localLevels);
        setUserCoins(0);
        setLoading(false);
        return;
      }
      
      // Fetch user's quiz levels from API
      const response = await fetch(`${API_URL}/quiz-levels`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch quiz levels');
      }
      
      const data = await response.json();
      const userQuizLevels: UserQuizLevel[] = data.quizLevels || [];
      const userCoins = data.coins || 0;
      
      // Combine predefined levels with user's progress
      const combinedLevels = QUIZ_LEVELS.map(level => {
        const userLevel = userQuizLevels.find(ul => ul.levelId === level.id);
        
        return {
          ...level,
          isLocked: !userLevel && level.unlockCost > 0,
          completed: userLevel ? userLevel.completed : false,
          score: userLevel ? userLevel.score : 0
        };
      });
      
      setLevels(combinedLevels);
      setUserCoins(userCoins);
    } catch (error) {
      console.error('Error fetching quiz levels:', error);
      setError('Failed to load quiz levels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLevelPress = (level: Level) => {
    // Navigate to the quiz level screen with the level ID
    router.push({
      pathname: '/quizLevel',
      params: { levelId: level.id }
    });
  };

  const handleUnlockPress = (level: Level) => {
    setSelectedLevel(level);
    setShowUnlockModal(true);
  };

  const handleUnlockConfirm = async () => {
    if (!selectedLevel) return;
    
    try {
      // Get user token from AsyncStorage
      const userDataStr = await AsyncStorage.getItem('user');
      const userData = userDataStr ? JSON.parse(userDataStr) : {};
      const token = userData.token;
      
      if (!token) {
        Alert.alert('Error', 'You must be logged in to unlock levels');
        return;
      }
      
      // Call API to unlock the level
      const response = await fetch(`${API_URL}/quiz-levels/unlock`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          levelId: selectedLevel.id,
          cost: selectedLevel.unlockCost
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to unlock level');
      }
      
      // Update local state
      setUserCoins(data.coins);
      
      // Update the levels list
      setLevels(prevLevels => 
        prevLevels.map(level => 
          level.id === selectedLevel.id 
            ? { ...level, isLocked: false } 
            : level
        )
      );
      
      // Close the modal
      setShowUnlockModal(false);
      setSelectedLevel(null);
      
      // Show success message
      Alert.alert('Success', `You've unlocked ${selectedLevel.title}!`);
    } catch (error) {
      console.error('Error unlocking level:', error);
      Alert.alert('Error', error.message || 'Failed to unlock level');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A8C3D1" />
        <Text style={styles.loadingText}>Loading quiz levels...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Return to Dashboard</Text>
        </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Quiz Levels</Text>
        <View style={styles.coinsContainer}>
          <Text style={styles.coinsText}>{userCoins}</Text>
          <AntDesign name="star" size={18} color="#FFD700" />
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {levels.map(level => (
          <LevelCard
            key={level.id}
            level={level}
            onPress={() => handleLevelPress(level)}
            onUnlock={() => handleUnlockPress(level)}
          />
        ))}
      </ScrollView>
      
      {selectedLevel && (
        <UnlockModal
          isVisible={showUnlockModal}
          level={selectedLevel}
          userCoins={userCoins}
          onUnlock={handleUnlockConfirm}
          onCancel={() => {
            setShowUnlockModal(false);
            setSelectedLevel(null);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2A2F3E',
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
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  coinsText: {
    color: '#F0F4F8',
    fontWeight: 'bold',
    marginRight: 4,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  levelCard: {
    backgroundColor: '#3D4457',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  lockedCard: {
    opacity: 0.7,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F0F4F8',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F0F4F8',
  },
  levelDescription: {
    fontSize: 14,
    color: '#A8C3D1',
    marginBottom: 12,
  },
  levelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionCount: {
    fontSize: 12,
    color: '#A8C3D1',
  },
  unlockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unlockCost: {
    fontSize: 12,
    color: '#FFD700',
    marginRight: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 12,
    color: '#4CAF50',
    marginRight: 4,
  },
  playContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playText: {
    fontSize: 12,
    color: '#F0F4F8',
    marginRight: 4,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2F3E',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1A213B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#F0F4F8',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: screenWidth * 0.8,
    backgroundColor: '#3D4457',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#A8C3D1',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalCoins: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 16,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  buttonCancel: {
    backgroundColor: '#6C757D',
  },
  buttonUnlock: {
    backgroundColor: '#007BFF',
  },
  buttonDisabled: {
    backgroundColor: '#6C757D',
    opacity: 0.5,
  },
});