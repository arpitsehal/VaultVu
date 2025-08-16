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
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const BACKEND_URL = 'https://vaultvu.onrender.com/api/questions';

interface Question {
    _id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    category?: string;
    difficulty?: string;
}

interface Player {
    name: string;
    score: number;
    currentQuestionIndex: number;
    selectedOption: string | null;
}

// Setup Modal Component
const SetupModal = ({
    isVisible,
    onStart,
    onCancel,
    player1Name,
    player2Name,
    setPlayer1Name,
    setPlayer2Name,
    questionCount,
    setQuestionCount,
}: {
    isVisible: boolean;
    onStart: () => void;
    onCancel: () => void;
    player1Name: string;
    player2Name: string;
    setPlayer1Name: (name: string) => void;
    setPlayer2Name: (name: string) => void;
    questionCount: number;
    setQuestionCount: (count: number) => void;
}) => (
    <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onCancel}
    >
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Quiz Battle Setup</Text>
                
                <Text style={styles.inputLabel}>Player 1 Name</Text>
                <TextInput
                    style={styles.input}
                    value={player1Name}
                    onChangeText={setPlayer1Name}
                    placeholder="Enter Player 1 Name"
                    placeholderTextColor="#666"
                />
                
                <Text style={styles.inputLabel}>Player 2 Name</Text>
                <TextInput
                    style={styles.input}
                    value={player2Name}
                    onChangeText={setPlayer2Name}
                    placeholder="Enter Player 2 Name"
                    placeholderTextColor="#666"
                />
                
                <Text style={styles.inputLabel}>Number of Questions</Text>
                <View style={styles.questionCountContainer}>
                    <TouchableOpacity 
                        style={styles.countButton}
                        onPress={() => setQuestionCount(Math.max(3, questionCount - 1))}
                    >
                        <Text style={styles.countButtonText}>-</Text>
                    </TouchableOpacity>
                    
                    <Text style={styles.questionCountText}>{questionCount}</Text>
                    
                    <TouchableOpacity 
                        style={styles.countButton}
                        onPress={() => setQuestionCount(Math.min(10, questionCount + 1))}
                    >
                        <Text style={styles.countButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.modalButtonsContainer}>
                    <Pressable
                        style={[styles.modalButton, styles.buttonCancel]}
                        onPress={onCancel}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.modalButton, styles.buttonStart]}
                        onPress={onStart}
                    >
                        <Text style={styles.buttonText}>Start Battle</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    </Modal>
);

// Results Modal Component
const ResultsModal = ({
    isVisible,
    player1,
    player2,
    onPlayAgain,
    onExit,
}: {
    isVisible: boolean;
    player1: Player;
    player2: Player;
    onPlayAgain: () => void;
    onExit: () => void;
}) => {
    // Add safety checks to prevent console errors
    if (!player1 || !player2) return null;
    
    const winner = player1.score > player2.score ? player1.name : 
                 player2.score > player1.score ? player2.name : "It's a tie!";
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onExit}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Battle Results</Text>
                    
                    {player1.score !== player2.score ? (
                        <Text style={styles.winnerText}>{winner} wins!</Text>
                    ) : (
                        <Text style={styles.winnerText}>It's a tie!</Text>
                    )}
                    
                    <View style={styles.scoreContainer}>
                        <View style={styles.playerScore}>
                            <Text style={styles.playerName}>{player1.name}</Text>
                            <Text style={styles.scoreText}>{player1.score}</Text>
                        </View>
                        
                        <Text style={styles.vsText}>vs</Text>
                        
                        <View style={styles.playerScore}>
                            <Text style={styles.playerName}>{player2.name}</Text>
                            <Text style={styles.scoreText}>{player2.score}</Text>
                        </View>
                    </View>
                    
                    <Text style={styles.coinsEarned}>+1 coin earned!</Text>
                    
                    <View style={styles.modalButtonsContainer}>
                        <Pressable
                            style={[styles.modalButton, styles.buttonPlayAgain]}
                            onPress={onPlayAgain}
                        >
                            <Text style={styles.buttonText}>Play Again</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.modalButton, styles.buttonExit]}
                            onPress={onExit}
                        >
                            <Text style={styles.buttonText}>Exit</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default function QuizBattleScreen() {
    const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const [showSetupModal, setShowSetupModal] = useState<boolean>(true);
    const [showResultsModal, setShowResultsModal] = useState<boolean>(false);
    const [questionCount, setQuestionCount] = useState<number>(5);
    
    const [player1, setPlayer1] = useState<Player>({
        name: 'Player 1',
        score: 0,
        currentQuestionIndex: 0,
        selectedOption: null,
    });
    
    const [player2, setPlayer2] = useState<Player>({
        name: 'Player 2',
        score: 0,
        currentQuestionIndex: 0,
        selectedOption: null,
    });
    
    const [battleStarted, setBattleStarted] = useState<boolean>(false);
    const [battleCompleted, setBattleCompleted] = useState<boolean>(false);
    
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    useEffect(() => {
        // Expanded battle quiz questions pool
        const BATTLE_QUIZ_QUESTIONS: Question[] = [
            {
                _id: 'bq1',
                question: 'What is a common technique used in social engineering attacks?',
                options: [
                    'Encryption',
                    'Pretexting (creating a fabricated scenario)',
                    'Firewall configuration',
                    'Software patching'
                ],
                correctAnswer: 'Pretexting (creating a fabricated scenario)',
                category: 'Security',
                difficulty: 'medium'
            },
            {
                _id: 'bq2',
                question: 'Which of these is a secure way to store your passwords?',
                options: [
                    'In a text file on your desktop',
                    'Using the same password for all accounts',
                    'Using a reputable password manager',
                    'Writing them down on sticky notes'
                ],
                correctAnswer: 'Using a reputable password manager',
                category: 'Security',
                difficulty: 'easy'
            },
            {
                _id: 'bq3',
                question: 'What is a "man-in-the-middle" attack?',
                options: [
                    'When someone physically stands between you and an ATM',
                    'When an attacker secretly intercepts and relays communications between two parties',
                    'When a bank employee steals your information',
                    'When someone looks over your shoulder as you type'
                ],
                correctAnswer: 'When an attacker secretly intercepts and relays communications between two parties',
                category: 'Security',
                difficulty: 'hard'
            },
            {
                _id: 'bq4',
                question: 'What is a secure way to make online purchases?',
                options: [
                    'Using public WiFi',
                    'Using a debit card linked to your main bank account',
                    'Using a credit card with fraud protection',
                    'Sending cash by mail'
                ],
                correctAnswer: 'Using a credit card with fraud protection',
                category: 'Finance',
                difficulty: 'medium'
            },
            {
                _id: 'bq5',
                question: 'Which of these is NOT a sign of identity theft?',
                options: [
                    'Unexpected bills or accounts in your name',
                    'Missing mail or statements',
                    'Receiving a tax refund',
                    'Unexplained withdrawals from your accounts'
                ],
                correctAnswer: 'Receiving a tax refund',
                category: 'Fraud',
                difficulty: 'medium'
            },
            {
                _id: 'bq6',
                question: 'What is a good practice for mobile device security?',
                options: [
                    'Never updating your apps',
                    'Using the same PIN for all your accounts',
                    'Enabling biometric authentication when available',
                    'Downloading apps from any source'
                ],
                correctAnswer: 'Enabling biometric authentication when available',
                category: 'Security',
                difficulty: 'easy'
            },
            {
                _id: 'bq7',
                question: 'What is a "smishing" attack?',
                options: [
                    'A phishing attack via SMS or text messages',
                    'A physical theft of a smartphone',
                    'A virus that affects only iPhones',
                    'When someone smashes your phone to steal data'
                ],
                correctAnswer: 'A phishing attack via SMS or text messages',
                category: 'Security',
                difficulty: 'medium'
            },
            {
                _id: 'bq8',
                question: 'Which of these is a secure way to access your bank account online?',
                options: [
                    'Using public computers',
                    'Using the bank\'s official app on a secured device',
                    'Clicking links from emails that appear to be from your bank',
                    'Sharing your login with a family member'
                ],
                correctAnswer: 'Using the bank\'s official app on a secured device',
                category: 'Finance',
                difficulty: 'easy'
            },
            {
                _id: 'bq9',
                question: 'What should you do before disposing of an old computer?',
                options: [
                    'Nothing special is needed',
                    'Just delete your files',
                    'Securely wipe the hard drive or remove and destroy it',
                    'Sell it immediately to recover value'
                ],
                correctAnswer: 'Securely wipe the hard drive or remove and destroy it',
                category: 'Security',
                difficulty: 'medium'
            },
            {
                _id: 'bq10',
                question: 'Which of these is NOT a recommended practice for online shopping?',
                options: [
                    'Using secure (https) websites',
                    'Saving your payment information on all websites for convenience',
                    'Checking seller reviews and ratings',
                    'Using strong, unique passwords for shopping accounts'
                ],
                correctAnswer: 'Saving your payment information on all websites for convenience',
                category: 'Finance',
                difficulty: 'easy'
            },
            {
                _id: 'bq11',
                question: 'What is the best way to handle a suspicious phone call asking for personal information?',
                options: [
                    'Provide the information if they sound official',
                    'Hang up and call the organization directly using official numbers',
                    'Ask them to call back later',
                    'Transfer them to someone else'
                ],
                correctAnswer: 'Hang up and call the organization directly using official numbers',
                category: 'Fraud',
                difficulty: 'easy'
            },
            {
                _id: 'bq12',
                question: 'What is malware?',
                options: [
                    'Software designed to help your computer run faster',
                    'Malicious software designed to damage or gain unauthorized access',
                    'A type of hardware component',
                    'Software for managing emails'
                ],
                correctAnswer: 'Malicious software designed to damage or gain unauthorized access',
                category: 'Security',
                difficulty: 'easy'
            },
            {
                _id: 'bq13',
                question: 'Which practice helps prevent credit card fraud?',
                options: [
                    'Writing your PIN on the back of your card',
                    'Sharing your card details with friends',
                    'Regularly monitoring your statements for unauthorized charges',
                    'Using the same PIN for all your cards'
                ],
                correctAnswer: 'Regularly monitoring your statements for unauthorized charges',
                category: 'Finance',
                difficulty: 'easy'
            },
            {
                _id: 'bq14',
                question: 'What is a botnet?',
                options: [
                    'A network of robots',
                    'A network of compromised computers controlled by cybercriminals',
                    'A type of fishing net',
                    'A social networking platform'
                ],
                correctAnswer: 'A network of compromised computers controlled by cybercriminals',
                category: 'Security',
                difficulty: 'hard'
            },
            {
                _id: 'bq15',
                question: 'What should you do if you accidentally click on a suspicious link?',
                options: [
                    'Continue browsing normally',
                    'Immediately close the browser and run antivirus scan',
                    'Share the link with others to warn them',
                    'Try clicking it again to see what happens'
                ],
                correctAnswer: 'Immediately close the browser and run antivirus scan',
                category: 'Security',
                difficulty: 'medium'
            },
            {
                _id: 'bq16',
                question: 'Which is a characteristic of a secure website?',
                options: [
                    'It has many pop-up advertisements',
                    'It uses HTTPS encryption and displays a lock icon',
                    'It asks for personal information immediately',
                    'It has flashy graphics and animations'
                ],
                correctAnswer: 'It uses HTTPS encryption and displays a lock icon',
                category: 'Security',
                difficulty: 'easy'
            },
            {
                _id: 'bq17',
                question: 'What is the safest way to connect to WiFi in public places?',
                options: [
                    'Connect to any available free WiFi',
                    'Use your mobile data or a trusted VPN service',
                    'Share your hotspot password with everyone',
                    'Connect to networks with no password'
                ],
                correctAnswer: 'Use your mobile data or a trusted VPN service',
                category: 'Security',
                difficulty: 'medium'
            },
            {
                _id: 'bq18',
                question: 'What is pharming?',
                options: [
                    'Growing crops using technology',
                    'Redirecting users from legitimate websites to fraudulent ones',
                    'A type of fishing technique',
                    'Managing pharmaceutical inventory'
                ],
                correctAnswer: 'Redirecting users from legitimate websites to fraudulent ones',
                category: 'Security',
                difficulty: 'hard'
            },
            {
                _id: 'bq19',
                question: 'How often should you back up important data?',
                options: [
                    'Never, it\'s not necessary',
                    'Only when buying a new device',
                    'Regularly, following the 3-2-1 backup rule',
                    'Once a decade'
                ],
                correctAnswer: 'Regularly, following the 3-2-1 backup rule',
                category: 'Security',
                difficulty: 'medium'
            },
            {
                _id: 'bq20',
                question: 'What is the most important step when setting up online banking?',
                options: [
                    'Use the same password as your email',
                    'Enable two-factor authentication and use strong passwords',
                    'Share your login details with family members',
                    'Access it only from public computers'
                ],
                correctAnswer: 'Enable two-factor authentication and use strong passwords',
                category: 'Finance',
                difficulty: 'medium'
            }
        ];

        // Function to shuffle questions for fair battle
        const shuffleQuestions = (questions: Question[]): Question[] => {
            const shuffled = [...questions];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        };

        // Replace the fetchQuestions function with this
        const fetchQuestions = async () => {
            try {
                // Shuffle questions and select the requested number for fair battle
                const shuffledQuestions = shuffleQuestions(BATTLE_QUIZ_QUESTIONS);
                setQuizQuestions(shuffledQuestions.slice(0, questionCount));
            } catch (e) {
                console.error("Error setting up quiz:", e);
                setError("Failed to set up battle questions");
            } finally {
                setLoading(false);
            }
        };

        if (battleStarted && !battleCompleted) {
            fetchQuestions();
        }
    }, [battleStarted, questionCount]);
    
    const handleStartBattle = () => {
        if (!player1.name.trim() || !player2.name.trim()) {
            Alert.alert('Missing Names', 'Please enter names for both players');
            return;
        }
        
        setShowSetupModal(false);
        setBattleStarted(true);
    };
    
    const handleOptionPress = (playerNum: 1 | 2, optionValue: string) => {
        const player = playerNum === 1 ? player1 : player2;
        const setPlayer = playerNum === 1 ? setPlayer1 : setPlayer2;
        
        if (player.selectedOption) return;
        
        const currentQuestion = quizQuestions[player.currentQuestionIndex];
        const isCorrect = optionValue.trim() === currentQuestion.correctAnswer.trim();
        
        setPlayer({
            ...player,
            selectedOption: optionValue,
            score: isCorrect ? player.score + 1 : player.score,
        });
    };
    
    const handleNextQuestion = (playerNum: 1 | 2) => {
        const player = playerNum === 1 ? player1 : player2;
        const setPlayer = playerNum === 1 ? setPlayer1 : setPlayer2;
        
        if (player.currentQuestionIndex < quizQuestions.length - 1) {
            setPlayer({
                ...player,
                currentQuestionIndex: player.currentQuestionIndex + 1,
                selectedOption: null,
            });
        } else {
            // Check if both players have finished
            const otherPlayer = playerNum === 1 ? player2 : player1;
            if (otherPlayer.currentQuestionIndex >= quizQuestions.length - 1 && otherPlayer.selectedOption) {
                handleBattleEnd();
            } else {
                setPlayer({
                    ...player,
                    selectedOption: 'DONE',
                });
            }
        }
    };
    
    const handleBattleEnd = async () => {
        setBattleCompleted(true);
        setShowResultsModal(true);
        
        // Award 1 coin to the user
        try {
            // Get user data and token consistently
            const userDataStr = await AsyncStorage.getItem('user');
            if (!userDataStr) {
                console.error('No user data found');
                return;
            }
            
            const userData = JSON.parse(userDataStr);
            let token = userData.token;
            
            // Fallback: try to get token from separate storage if not in user object
            if (!token) {
                token = await AsyncStorage.getItem('token');
            }
            
            if (!token) {
                console.error('No token found in user data or separate storage');
                return;
            }

            const response = await fetch('https://vaultvu.onrender.com/api/users/quiz-rewards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    coins: 1, // Fixed 1 coin for battle completion
                    quizType: 'battle',
                    score: Math.max(player1.score, player2.score)
                }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('✅ Battle score submitted successfully:', data);
                // Update user's coins in AsyncStorage with the earned coins
                const updatedUserData = {
                    ...userData,
                    coins: (userData.coins || 0) + 1 // Add 1 coin to existing coins
                };
                await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
                console.log('✅ AsyncStorage updated with new coin count:', updatedUserData.coins);
            } else {
                console.error('❌ Failed to submit battle score:', data.message);
            }
        } catch (error) {
            console.error('⚠ Error submitting battle score:', error);
        }
    };
    
    const resetBattle = () => {
        setPlayer1({
            ...player1,
            score: 0,
            currentQuestionIndex: 0,
            selectedOption: null,
        });
        
        setPlayer2({
            ...player2,
            score: 0,
            currentQuestionIndex: 0,
            selectedOption: null,
        });
        
        setBattleCompleted(false);
        setShowResultsModal(false);
        setLoading(true);
        
        // Fetch new questions
        setBattleStarted(true);
    };
    
    const getOptionStyle = (playerNum: 1 | 2, optionValue: string) => {
        const player = playerNum === 1 ? player1 : player2;
        if (!player.selectedOption) return styles.optionButton;
        
        const currentQuestion = quizQuestions[player.currentQuestionIndex];
        if (optionValue.trim() === currentQuestion.correctAnswer.trim()) {
            return styles.optionCorrect;
        }
        if (optionValue === player.selectedOption) {
            return styles.optionIncorrect;
        }
        return styles.optionButton;
    };
    
    if (loading && battleStarted) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A8C3D1" />
                <Text style={styles.loadingText}>Loading battle questions...</Text>
            </SafeAreaView>
        );
    }
    
    if (error) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.nextButton} onPress={() => router.back()}>
                    <Text style={styles.nextButtonText}>Return to Dashboard</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
    
    if (!battleStarted) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="light-content" backgroundColor="#1A213B" />
                <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Quiz Battle</Text>
                    <View style={styles.spacer} />
                </View>
                
                <View style={styles.startContainer}>
                    <Text style={styles.startTitle}>Ready for a Challenge?</Text>
                    <Text style={styles.startDescription}>Battle with a friend on the same device!</Text>
                    
                    <TouchableOpacity 
                        style={styles.startButton}
                        onPress={() => setShowSetupModal(true)}
                    >
                        <Text style={styles.startButtonText}>Start Battle</Text>
                    </TouchableOpacity>
                </View>
                
                <SetupModal 
                    isVisible={showSetupModal}
                    onStart={handleStartBattle}
                    onCancel={() => setShowSetupModal(false)}
                    player1Name={player1.name}
                    player2Name={player2.name}
                    setPlayer1Name={(name) => setPlayer1({...player1, name})}
                    setPlayer2Name={(name) => setPlayer2({...player2, name})}
                    questionCount={questionCount}
                    setQuestionCount={setQuestionCount}
                />
            </SafeAreaView>
        );
    }
    
    // Render the battle screen with split view
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#1A213B" />
            
            {/* Divider line */}
            <View style={styles.divider} />
            
            {/* Player 1 Section (Top) */}
            <View style={styles.playerSection}>
                <View style={styles.playerHeader}>
                    <Text style={styles.playerHeaderText}>{player1.name}</Text>
                    <Text style={styles.playerScore}>{player1.score}</Text>
                </View>
                
                {player1.selectedOption === 'DONE' ? (
                    <View style={styles.waitingContainer}>
                        <Text style={styles.waitingText}>Waiting for {player2.name}...</Text>
                    </View>
                ) : (
                    <View style={styles.questionContainer}>
                        <Text style={styles.questionText}>
                            {quizQuestions[player1.currentQuestionIndex]?.question}
                        </Text>
                        
                        <View style={styles.optionsContainer}>
                            {quizQuestions[player1.currentQuestionIndex]?.options.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.optionButton,
                                        player1.selectedOption === option && styles.optionSelected,
                                        player1.selectedOption && getOptionStyle(1, option),
                                    ]}
                                    onPress={() => handleOptionPress(1, option)}
                                    disabled={player1.selectedOption !== null}
                                >
                                    <Text style={styles.optionLabelText}>{String.fromCharCode(65 + index)}</Text>
                                    <Text style={styles.optionText}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        
                        {player1.selectedOption && player1.selectedOption !== 'DONE' && (
                            <TouchableOpacity
                                style={styles.nextButton}
                                onPress={() => handleNextQuestion(1)}
                            >
                                <Text style={styles.nextButtonText}>
                                    {player1.currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
            
            {/* Player 2 Section (Bottom) */}
            <View style={styles.playerSection}>
                <View style={styles.playerHeader}>
                    <Text style={styles.playerHeaderText}>{player2.name}</Text>
                    <Text style={styles.playerScore}>{player2.score}</Text>
                </View>
                
                {player2.selectedOption === 'DONE' ? (
                    <View style={styles.waitingContainer}>
                        <Text style={styles.waitingText}>Waiting for {player1.name}...</Text>
                    </View>
                ) : (
                    <View style={styles.questionContainer}>
                        <Text style={styles.questionText}>
                            {quizQuestions[player2.currentQuestionIndex]?.question}
                        </Text>
                        
                        <View style={styles.optionsContainer}>
                            {quizQuestions[player2.currentQuestionIndex]?.options.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.optionButton,
                                        player2.selectedOption === option && styles.optionSelected,
                                        player2.selectedOption && getOptionStyle(2, option),
                                    ]}
                                    onPress={() => handleOptionPress(2, option)}
                                    disabled={player2.selectedOption !== null}
                                >
                                    <Text style={styles.optionLabelText}>{String.fromCharCode(65 + index)}</Text>
                                    <Text style={styles.optionText}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        
                        {player2.selectedOption && player2.selectedOption !== 'DONE' && (
                            <TouchableOpacity
                                style={styles.nextButton}
                                onPress={() => handleNextQuestion(2)}
                            >
                                <Text style={styles.nextButtonText}>
                                    {player2.currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
            
            {showResultsModal && (
                <ResultsModal 
                    isVisible={showResultsModal}
                    player1={player1}
                    player2={player2}
                    onPlayAgain={resetBattle}
                    onExit={() => router.back()}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: '#1A213B' 
    },
    loadingContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#1A213B', 
        padding: 20 
    },
    loadingText: { 
        marginTop: 10, 
        color: 'white', 
        fontSize: 18 
    },
    errorText: { 
        color: '#dc3545', 
        fontSize: 20, 
        textAlign: 'center', 
        marginBottom: 20 
    },
    headerContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 20, 
        paddingVertical: 15, 
        backgroundColor: '#1A213B' 
    },
    backButton: { 
        padding: 10 
    },
    headerTitle: { 
        flex: 1, 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: 'white', 
        textAlign: 'center' 
    },
    spacer: { 
        width: 44 
    },
    startContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    startTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
    startDescription: {
        fontSize: 18,
        color: '#A8C3D1',
        marginBottom: 40,
        textAlign: 'center',
    },
    startButton: {
        backgroundColor: '#6A8EAE',
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    startButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    divider: {
        height: 2,
        backgroundColor: '#333A4B',
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        zIndex: 10,
    },
    playerSection: {
        flex: 1,
        padding: 10,
    },
    playerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#333A4B',
        borderRadius: 10,
        marginBottom: 10,
    },
    playerHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    playerScore: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#A8C3D1',
    },
    questionContainer: {
        flex: 1,
        padding: 10,
    },
    questionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    optionsContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: 8,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333A4B',
        borderRadius: 10,
        padding: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    optionSelected: {
        borderColor: '#6A8EAE',
    },
    optionCorrect: {
        backgroundColor: '#28a745',
        borderColor: '#218838',
    },
    optionIncorrect: {
        backgroundColor: '#dc3545',
        borderColor: '#c82333',
    },
    optionLabelText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
        marginRight: 10,
    },
    optionText: {
        flex: 1,
        fontSize: 14,
        color: 'white',
    },
    nextButton: {
        backgroundColor: '#A8C3D1',
        borderRadius: 10,
        paddingVertical: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    nextButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1A213B',
    },
    waitingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    waitingText: {
        fontSize: 18,
        color: '#A8C3D1',
        fontStyle: 'italic',
    },
    // Modal styles
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalView: {
        margin: 20,
        backgroundColor: '#1A213B',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputLabel: {
        fontSize: 16,
        color: '#A8C3D1',
        alignSelf: 'flex-start',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#333A4B',
        borderRadius: 10,
        padding: 12,
        color: 'white',
        width: '100%',
        marginBottom: 15,
    },
    questionCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 25,
    },
    countButton: {
        backgroundColor: '#6A8EAE',
        borderRadius: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    countButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    questionCountText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        elevation: 2,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonCancel: {
        backgroundColor: '#333A4B',
    },
    buttonStart: {
        backgroundColor: '#6A8EAE',
    },
    buttonPlayAgain: {
        backgroundColor: '#6A8EAE',
    },
    buttonExit: {
        backgroundColor: '#333A4B',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    winnerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 20,
        textAlign: 'center',
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    playerName: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginBottom: 5,
    },
    scoreText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#A8C3D1',
        textAlign: 'center',
    },
    vsText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6A8EAE',
    },
    coinsEarned: {
        fontSize: 18,
        color: 'gold',
        marginBottom: 20,
        textAlign: 'center',
    },
});