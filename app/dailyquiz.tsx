import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');
const QUESTION_TIME = 30; // 30 seconds per question
const BACKEND_URL = 'https://vaultvu.onrender.com/api/questions';
const LEADERBOARD_URL = 'https://vaultvu.onrender.com/api/leaderboard/scores';
const USER_API_URL = 'https://vaultvu.onrender.com/api/users';

interface Question {
    _id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    category?: string;
    difficulty?: string;
    tags?: string[];
    created_at?: string;
}

// Local questions for daily quiz
const DAILY_QUIZ_QUESTIONS: Question[] = [
    {
        _id: 'dq1',
        question: 'What is phishing?',
        options: [
            'A type of fishing sport',
            'A cybersecurity attack where attackers impersonate legitimate entities',
            'A software development methodology',
            'A network protocol'
        ],
        correctAnswer: 'A cybersecurity attack where attackers impersonate legitimate entities',
        category: 'Security',
        difficulty: 'easy'
    },
    {
        _id: 'dq2',
        question: 'Which of the following is a strong password?',
        options: [
            'password123',
            'qwerty',
            'P@$$w0rd2023!',
            'your name'
        ],
        correctAnswer: 'P@$$w0rd2023!',
        category: 'Security',
        difficulty: 'easy'
    },
    {
        _id: 'dq3',
        question: 'What is two-factor authentication (2FA)?',
        options: [
            'Using two different passwords',
            'A security process requiring two different authentication methods',
            'Logging in from two different devices',
            'Changing your password twice a year'
        ],
        correctAnswer: 'A security process requiring two different authentication methods',
        category: 'Security',
        difficulty: 'medium'
    },
    {
        _id: 'dq4',
        question: 'Which of these is NOT a common sign of a scam?',
        options: [
            'Urgent requests for personal information',
            'Offers that seem too good to be true',
            'Requests to verify account information via official company channels',
            'Unexpected prize notifications'
        ],
        correctAnswer: 'Requests to verify account information via official company channels',
        category: 'Fraud',
        difficulty: 'medium'
    },
    {
        _id: 'dq5',
        question: 'What should you do if you suspect your financial information has been compromised?',
        options: [
            'Ignore it and hope nothing happens',
            'Only monitor your accounts for unusual activity',
            'Contact your financial institutions and change passwords immediately',
            'Post about it on social media'
        ],
        correctAnswer: 'Contact your financial institutions and change passwords immediately',
        category: 'Finance',
        difficulty: 'medium'
    }
];

// Custom Modal Component for Quiz Results
const ResultModal = ({
    isVisible,
    score,
    totalQuestions,
    coinsEarned,
    onLeaderboardPress,
    onDashboardPress
}: {
    isVisible: boolean;
    score: number;
    totalQuestions: number;
    coinsEarned: number;
    onLeaderboardPress: () => void;
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
                <Text style={styles.modalTitle}>Quiz Finished!</Text>
                <Text style={styles.modalText}>You scored {score} out of {totalQuestions}.</Text>
                <Text style={styles.modalCoins}>+{coinsEarned} coins earned!</Text>
                <View style={styles.modalButtonsContainer}>
                    <Pressable
                        style={[styles.modalButton, styles.buttonLeaderboard]}
                        onPress={onLeaderboardPress}
                    >
                        <Text style={styles.buttonText}>Go to Leaderboard</Text>
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

export default function DailyQuizScreen() {
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
    const [canPlayQuiz, setCanPlayQuiz] = useState<boolean>(true);

    const router = useRouter();
    const insets = useSafeAreaInsets();

    const fetchQuestions = useCallback(async () => {
        try {
            setQuizQuestions(DAILY_QUIZ_QUESTIONS);
            
            let count = 3;
            const timer = setInterval(() => {
                setCountdown(count);
                count -= 1;
                
                if (count < 0) {
                    clearInterval(timer);
                    setCountdown(0);
                }
            }, 1000);
        } catch (e) {
            console.error("Error setting up quiz:", e);
            setError("Failed to set up quiz questions");
        } finally {
            setLoading(false);
        }
    }, []);

    const checkQuizAvailability = useCallback(async () => {
        try {
            const userDataStr = await AsyncStorage.getItem('user');
            if (!userDataStr) {
                console.log('No user data found in AsyncStorage.');
                return;
            }
            const user = JSON.parse(userDataStr);
            const userId = user._id;

            const lastPlayedDate = await AsyncStorage.getItem(`lastDailyQuizDate_${userId}`);
            if (lastPlayedDate) {
                const lastPlayed = new Date(lastPlayedDate);
                const now = new Date();
                
                if (
                    lastPlayed.getDate() === now.getDate() &&
                    lastPlayed.getMonth() === now.getMonth() &&
                    lastPlayed.getFullYear() === now.getFullYear()
                ) {
                    setCanPlayQuiz(false);
                    setError('You have already played the daily quiz today. Come back tomorrow!');
                } else {
                    setCanPlayQuiz(true);
                }
            } else {
                setCanPlayQuiz(true);
            }
        } catch (e) {
            console.error('Error checking quiz availability:', e);
            setCanPlayQuiz(true); // Default to true if there's an error
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            
            const prepareQuiz = async () => {
                setLoading(true);
                await checkQuizAvailability();
                if (isActive && canPlayQuiz) {
                    fetchQuestions();
                } else {
                    setLoading(false);
                }
            };

            prepareQuiz();

            return () => {
                isActive = false;
            };
        }, [fetchQuestions, checkQuizAvailability, canPlayQuiz])
    );
    
    useEffect(() => {
        if (loading || error || quizQuestions.length === 0 || !canPlayQuiz) return;
        if (countdown === 0) return;

        const countdownTimer = setInterval(() => {
            setCountdown(prevCount => {
                if (typeof prevCount === 'number') {
                    if (prevCount > 1) {
                        return prevCount - 1;
                    } else {
                        return 'Start!';
                    }
                }
                clearInterval(countdownTimer);
                return 0;
            });
        }, 1000);

        return () => clearInterval(countdownTimer);
    }, [loading, error, quizQuestions.length, canPlayQuiz]);

    const handleQuizEnd = async (finalScore: number) => {
        setQuizCompleted(true);
        setShowResultModal(true);
        
        const earnedCoins = finalScore * 2;
        setCoinsEarned(earnedCoins);
        
        const userDataStr = await AsyncStorage.getItem('user');
        if (!userDataStr) {
            console.error("No user data found.");
            return;
        }
        const user = JSON.parse(userDataStr);
        const userId = user._id;

        await AsyncStorage.setItem(`lastDailyQuizDate_${userId}`, new Date().toISOString());

        const token = await AsyncStorage.getItem('token');
        if (!token) {
            console.error("No token found, can't update user data");
            return;
        }

        try {
            const response = await fetch(`${USER_API_URL}/quiz-rewards`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    coins: earnedCoins,
                    quizType: 'daily',
                    score: finalScore
                }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log("✅ User data updated:", data);
                if (userDataStr) {
                    const userData = JSON.parse(userDataStr);
                    userData.coins = (userData.coins || 0) + earnedCoins;
                    await AsyncStorage.setItem('user', JSON.stringify(userData));
                }
            } else {
                console.error("❌ Failed to update user data:", data.message);
            }
        } catch (error) {
            console.error("⚠ Error while updating user data:", error);
        }

        try {
            const username = user.username || "Quiz Player";
            const email = user.email || "user@example.com";

            const response = await fetch(LEADERBOARD_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    score: finalScore,
                    quizType: 'daily'
                }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log("✅ Score submitted to leaderboard:", data);
            } else {
                console.error("❌ Failed to submit score:", data.message);
            }
        } catch (error) {
            console.error("⚠ Error while submitting score:", error);
        }
    };

    useEffect(() => {
        if (quizCompleted || loading || error || quizQuestions.length === 0 || countdown !== 0 || !canPlayQuiz) return;
        
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    if (currentQuestionIndex < quizQuestions.length - 1) {
                        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                        setSelectedOption(null);
                        return QUESTION_TIME;
                    } else {
                        handleQuizEnd(score);
                        return 0;
                    }
                }
                return prevTime - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [quizCompleted, loading, error, quizQuestions.length, score, countdown, currentQuestionIndex, canPlayQuiz, handleQuizEnd]);

    const handleOptionPress = (optionValue: string) => {
        if (selectedOption) return;
        setSelectedOption(optionValue);
        
        setTimeout(() => {
            handleNextQuestion(optionValue);
        }, 1000);
    };

    const handleNextQuestion = (optionValue: string) => {
        let newScore = score;
        const currentQuestion = quizQuestions[currentQuestionIndex];
        
        if (optionValue.trim() === currentQuestion.correctAnswer.trim()) {
            newScore = score + 1;
            setScore(newScore);
        }
        
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setSelectedOption(null);
            setTimeLeft(QUESTION_TIME);
        } else {
            handleQuizEnd(newScore);
        }
    };

    const getOptionStyle = (optionValue: string) => {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        if (selectedOption === null) {
            return styles.optionButton;
        }
        if (optionValue.trim() === currentQuestion.correctAnswer.trim()) {
            return styles.optionCorrect;
        }
        if (optionValue === selectedOption) {
            return styles.optionIncorrect;
        }
        return styles.optionButton;
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

    if (error || quizQuestions.length === 0 || !canPlayQuiz) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text style={styles.errorText}>{error || 'No quiz questions found.'}</Text>
                <TouchableOpacity style={styles.nextButton} onPress={() => router.back()}>
                    <Text style={styles.nextButtonText}>Return to Dashboard</Text>
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
                onLeaderboardPress={() => {
                    setShowResultModal(false);
                    router.push('/Leaderboard');
                }}
                onDashboardPress={() => {
                    setShowResultModal(false);
                    router.back();
                }}
            />
        );
    }

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
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Daily Quiz</Text>
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
                <Text style={styles.questionText}>{currentQuestion.question}</Text>
                <View style={styles.optionsContainer}>
                    {currentQuestion.options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.optionButton,
                                selectedOption === option && styles.optionSelected,
                                selectedOption && getOptionStyle(option),
                            ]}
                            onPress={() => handleOptionPress(option)}
                            disabled={selectedOption !== null}
                        >
                            <Text style={styles.optionLabelText}>{String.fromCharCode(65 + index)}</Text>
                            <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#1A213B' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A213B', padding: 20 },
    loadingText: { marginTop: 10, color: 'white', fontSize: 18 },
    errorText: { color: '#dc3545', fontSize: 20, textAlign: 'center', marginBottom: 20 },
    headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#1A213B' },
    backButton: { padding: 10, position: 'absolute', left: 10, zIndex: 1 },
    headerTitle: { flex: 1, fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center' },
    timerContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#333A4B', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    timerText: { fontSize: 16, fontWeight: 'bold', color: 'white', marginLeft: 5 },
    progressBarContainer: { height: 8, backgroundColor: '#333A4B', marginHorizontal: 20, borderRadius: 4, overflow: 'hidden', marginTop: 10, marginBottom: 20 },
    progressBar: { height: '100%', backgroundColor: '#6A8EAE' },
    mainContent: { flex: 1, padding: 20 },
    questionCounter: { fontSize: 16, color: '#A8C3D1', fontWeight: '600', marginBottom: 10 },
    questionText: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 30, lineHeight: 28 },
    optionsContainer: { flex: 1, justifyContent: 'center', gap: 15 },
    optionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#333A4B', borderRadius: 15, padding: 15, borderWidth: 2, borderColor: 'transparent' },
    optionSelected: { borderColor: '#6A8EAE' },
    optionCorrect: { backgroundColor: '#28a745', borderColor: '#218838' },
    optionIncorrect: { backgroundColor: '#dc3545', borderColor: '#c82333' },
    optionLabelText: { fontSize: 16, fontWeight: 'bold', color: 'white', marginRight: 15 },
    optionText: { flex: 1, fontSize: 16, color: 'white', fontWeight: '500' },
    nextButton: { backgroundColor: '#A8C3D1', borderRadius: 15, paddingVertical: 15, alignItems: 'center', marginTop: 30 },
    nextButtonText: { fontSize: 18, fontWeight: 'bold', color: '#1A213B' },
    countdownText: {
        fontSize: 80,
        fontWeight: 'bold',
        color: 'white',
    },
    // Styles for the custom modal
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalView: {
        margin: 20,
        backgroundColor: "#1A213B",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
    },
    modalText: {
        fontSize: 20,
        color: '#A8C3D1',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalCoins: {
        fontSize: 24,
        color: '#FFD700',
        fontWeight: 'bold',
        marginBottom: 25,
        textAlign: 'center',
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 25,
        elevation: 2,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonLeaderboard: {
        backgroundColor: '#6A8EAE',
    },
    buttonDashboard: {
        backgroundColor: '#333A4B',
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
    },
});