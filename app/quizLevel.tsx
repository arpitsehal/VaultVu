import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');
const QUESTION_TIME = 30; // 30 seconds per question
const BACKEND_URL = 'https://vaultvu-backend.onrender.com/api/questions';
const USER_API_URL = 'https://vaultvu-backend.onrender.com/api/users';

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  category?: string;
  difficulty?: string;
}

// Custom Modal Component for Quiz Results
const ResultModal = ({
  isVisible,
  score,
  totalQuestions,
  coinsEarned,
  onLevelsPress,
  onDashboardPress
}: {
  isVisible: boolean;
  score: number;
  totalQuestions: number;
  coinsEarned: number;
  onLevelsPress: () => void;
  onDashboardPress: () => void;
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={isVisible}
    onRequestClose={onDashboardPress}
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalTitle}>Level Completed!</Text>
        <Text style={styles.modalText}>You scored {score} out of {totalQuestions}.</Text>
        <Text style={styles.modalCoins}>+{coinsEarned} coins earned!</Text>
        <View style={styles.modalButtonsContainer}>
          <Pressable
            style={[styles.modalButton, styles.buttonLeaderboard]}
            onPress={onLevelsPress}
          >
            <Text style={styles.buttonText}>Back to Levels</Text>
          </Pressable>
          <Pressable
            style={[styles.modalButton, styles.buttonDashboard]}
            onPress={onDashboardPress}
          >
            <Text style={styles.buttonText}>Return to Dashboard</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);

export default function QuizLevelScreen() {
  const { levelId } = useLocalSearchParams<{ levelId: string }>();
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIME);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | string>(3);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!levelId) {
      setError('Invalid level ID');
      setLoading(false);
      return;
    }
    
    fetchQuestions();
  }, [levelId]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}?level=${levelId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Question[] = await response.json();
      
      // Use all questions for the level
      setQuizQuestions(data);
      
      // Start countdown
      startCountdown();
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      console.error("Fetching error:", e);
      setError(`Failed to load quiz questions: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    // 3-second countdown before starting the quiz
    let count = 3;
    const timer = setInterval(() => {
      if (count > 1) {
        setCountdown(count - 1);
        count -= 1;
      } else if (count === 1) {
        setCountdown('Start!');
        count -= 1;
      } else {
        clearInterval(timer);
        setCountdown(0);
      }
    }, 1000);
  };

  const handleOptionPress = (option: string) => {
    if (selectedOption) return; // Prevent multiple selections
    
    setSelectedOption(option);
    
    // Check if the answer is correct
    const isCorrect = option === quizQuestions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    
    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedOption(null);
        setTimeLeft(QUESTION_TIME);
      } else {
        // End of quiz
        handleQuizEnd(isCorrect ? score + 1 : score);
      }
    }, 1500);
  };

  const handleQuizEnd = async (finalScore: number) => {
    setQuizCompleted(true);
    
    // Calculate coins earned (1 coin per correct answer)
    const earnedCoins = finalScore;
    setCoinsEarned(earnedCoins);
    
    try {
      // Get user token from AsyncStorage
      const userDataStr = await AsyncStorage.getItem('user');
      const userData = userDataStr ? JSON.parse(userDataStr) : {};
      const token = userData.token;
      
      if (!token) {
        console.error("No auth token found");
        setShowResultModal(true);
        return;
      }
      
      // Submit level completion to API
      const response = await fetch(`${USER_API_URL}/quiz-levels/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          levelId: parseInt(levelId as string),
          score: finalScore
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit level completion');
      }
      
      const data = await response.json();
      console.log("✅ Level completion submitted:", data);
      
      // Show results modal
      setShowResultModal(true);
    } catch (error) {
      console.error("⚠ Error while updating user data:", error);
      // Still show results even if API call fails
      setShowResultModal(true);
    }
  };

  // Timer effect
  useEffect(() => {
    if (loading || error || quizCompleted || countdown !== 0 || quizQuestions.length === 0) {
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          
          // Auto-submit current question as incorrect
          setTimeout(() => {
            if (currentQuestionIndex < quizQuestions.length - 1) {
              setCurrentQuestionIndex(prevIndex => prevIndex + 1);
              setSelectedOption(null);
              setTimeLeft(QUESTION_TIME);
            } else {
              // End of quiz
              handleQuizEnd(score);
            }
          }, 1000);
          
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quizCompleted, loading, error, quizQuestions.length, score, countdown, currentQuestionIndex]);

  const getOptionStyle = (option: string) => {
    if (!selectedOption) return styles.optionButton;
    
    if (option === quizQuestions[currentQuestionIndex].correctAnswer) {
      return [styles.optionButton, styles.correctOption];
    }
    
    if (option === selectedOption) {
      return [styles.optionButton, styles.incorrectOption];
    }
    
    return [styles.optionButton, styles.disabledOption];
  };

  const formatTime = (time: number) => {
    return `${time}s`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A8C3D1" />
        <Text style={styles.loadingText}>Loading quiz questions...</Text>
      </SafeAreaView>
    );
  }

  if (error || quizQuestions.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error || 'No quiz questions found.'}</Text>
        <TouchableOpacity style={styles.nextButton} onPress={() => router.back()}>
          <Text style={styles.nextButtonText}>Return to Levels</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (quizCompleted) {
    return (
      <ResultModal 
        isVisible={showResultModal}
        score={score}
        totalQuestions={quizQuestions.length}
        coinsEarned={coinsEarned}
        onLevelsPress={() => {
          setShowResultModal(false);
          router.push('/levels');
        }}
        onDashboardPress={() => {
          setShowResultModal(false);
          router.push('/home');
        }}
      />
    );
  }

  // Countdown UI
  if (countdown > 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.countdownText}>{countdown}</Text>
      </SafeAreaView>
    );
  } else if (countdown === 'Start!') {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.countdownText}>{countdown}</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / quizQuestions.length) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => {
          Alert.alert(
            'Quit Quiz',
            'Are you sure you want to quit? Your progress will be lost.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Quit', style: 'destructive', onPress: () => router.back() }
            ]
          );
        }}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Level {levelId}</Text>
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={20} color="white" />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      <View style={styles.mainContent}>
        <Text style={styles.questionCounter}>
          Question {currentQuestionIndex + 1} of {quizQuestions.length}
        </Text>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={getOptionStyle(option)}
              onPress={() => handleOptionPress(option)}
              disabled={selectedOption !== null}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timerText: {
    color: '#F0F4F8',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#A8C3D1',
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  questionCounter: {
    fontSize: 14,
    color: '#A8C3D1',
    marginBottom: 16,
  },
  questionContainer: {
    backgroundColor: '#3D4457',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    color: '#F0F4F8',
    lineHeight: 26,
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    backgroundColor: '#3D4457',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionText: {
    fontSize: 16,
    color: '#F0F4F8',
  },
  correctOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderColor: '#F44336',
  },
  disabledOption: {
    opacity: 0.6,
  },
  nextButton: {
    backgroundColor: '#1A213B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 24,
  },
  nextButtonText: {
    color: '#F0F4F8',
    fontWeight: 'bold',
    fontSize: 16,
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
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginHorizontal: 24,
  },
  countdownText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#A8C3D1',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 24,
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
  buttonLeaderboard: {
    backgroundColor: '#1A213B',
  },
  buttonDashboard: {
    backgroundColor: '#3D4457',
    borderWidth: 1,
    borderColor: '#A8C3D1',
  },
  buttonText: {
    color: '#F0F4F8',
    fontWeight: 'bold',
    fontSize: 16,
  },
});