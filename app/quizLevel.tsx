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
const BACKEND_URL = 'https://vaultvu.onrender.com/api/questions';
const USER_API_URL = 'https://vaultvu.onrender.com/api/users';

// Define quiz levels with question counts
const QUIZ_LEVELS = [
  { id: 1, questionCount: 5 },
  { id: 2, questionCount: 5 },
  { id: 3, questionCount: 5 },
  { id: 4, questionCount: 6 },
  { id: 5, questionCount: 7 },
  { id: 6, questionCount: 7 },
  { id: 7, questionCount: 8 },
  { id: 8, questionCount: 8 },
  { id: 9, questionCount: 10 },
  { id: 10, questionCount: 12 },
  { id: 11, questionCount: 15 },
  { id: 12, questionCount: 15 }
];

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
  completed,
  percentage,
  onLevelsPress,
  onDashboardPress
}: {
  isVisible: boolean;
  score: number;
  totalQuestions: number;
  coinsEarned: number;
  completed?: boolean;
  percentage?: number;
  onLevelsPress: () => void;
  onDashboardPress: () => void;
}) => {
  const actualPercentage = percentage || Math.round((score / totalQuestions) * 100);
  const isCompleted = completed !== undefined ? completed : actualPercentage >= 75;
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onDashboardPress}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            {isCompleted ? 'Level Completed! 🎉' : 'Level Attempted'}
          </Text>
          <Text style={styles.modalText}>
            You scored {score} out of {totalQuestions} ({actualPercentage}%)
          </Text>
          {isCompleted ? (
            <Text style={styles.modalSuccess}>
              ✅ Level completed with {actualPercentage}%! (75% required)
            </Text>
          ) : (
            <Text style={styles.modalWarning}>
              ⚠️ Need 75% to complete. Try again to improve your score!
            </Text>
          )}
          {coinsEarned > 0 && (
            <Text style={styles.modalCoins}>+{coinsEarned} coins earned!</Text>
          )}
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
};

// Add this after the interface definitions
const LEVEL_QUIZ_QUESTIONS: {[key: string]: Question[]} = {
    // Level 1: Financial Basics
    '1': [
        {
            _id: 'l1q1',
            question: 'What is a budget?',
            options: [
                'A type of investment',
                'A plan for managing income and expenses',
                'A type of bank account',
                'A government tax'
            ],
            correctAnswer: 'A plan for managing income and expenses',
            category: 'Finance',
            difficulty: 'easy'
        },
        {
            _id: 'l1q2',
            question: 'What is the difference between a debit card and a credit card?',
            options: [
                'There is no difference',
                'Debit cards are more secure',
                'Debit cards use money you already have, credit cards borrow money',
                'Credit cards can only be used online'
            ],
            correctAnswer: 'Debit cards use money you already have, credit cards borrow money',
            category: 'Finance',
            difficulty: 'easy'
        },
        {
            _id: 'l1q3',
            question: 'What is compound interest?',
            options: [
                'Interest paid only on the principal amount',
                'Interest calculated on both the initial principal and accumulated interest',
                'A fixed interest rate that never changes',
                'Interest paid to the government'
            ],
            correctAnswer: 'Interest calculated on both the initial principal and accumulated interest',
            category: 'Finance',
            difficulty: 'medium'
        },
        {
            _id: 'l1q4',
            question: 'What is a good first step in creating financial security?',
            options: [
                'Investing in high-risk stocks',
                'Building an emergency fund',
                'Taking out multiple loans',
                'Spending all your income'
            ],
            correctAnswer: 'Building an emergency fund',
            category: 'Finance',
            difficulty: 'easy'
        },
        {
            _id: 'l1q5',
            question: 'What is the purpose of a credit score?',
            options: [
                'To track your shopping habits',
                'To determine how much you should spend monthly',
                'To measure your creditworthiness to lenders',
                'To calculate your tax rate'
            ],
            correctAnswer: 'To measure your creditworthiness to lenders',
            category: 'Finance',
            difficulty: 'medium'
        },
        {
            _id: 'l1q6',
            question: 'What is a credit utilization ratio?',
            options: [
                'The ratio of your income to your debt',
                'The amount of credit you use compared to your credit limit',
                'The interest rate on your credit card',
                'The number of credit cards you own'
            ],
            correctAnswer: 'The amount of credit you use compared to your credit limit',
            category: 'Finance',
            difficulty: 'medium'
        },
        {
            _id: 'l1q7',
            question: 'What is the purpose of a budget?',
            options: [
                'To restrict your spending completely',
                'To track and plan your income and expenses',
                'To increase your debt',
                'To avoid using credit cards'
            ],
            correctAnswer: 'To track and plan your income and expenses',
            category: 'Finance',
            difficulty: 'easy'
        },
        {
            _id: 'l1q8',
            question: 'What is the difference between a debit card and a credit card?',
            options: [
                'There is no difference',
                'Debit cards can only be used online',
                'Debit cards use money from your bank account while credit cards borrow money',
                'Credit cards can only be used in stores'
            ],
            correctAnswer: 'Debit cards use money from your bank account while credit cards borrow money',
            category: 'Finance',
            difficulty: 'easy'
        }
    ],
    // Level 2: Fraud Detection
    '2': [
        {
            _id: 'l2q1',
            question: 'What is a common red flag of a phishing email?',
            options: [
                'It comes from a company you do business with',
                'It addresses you by your correct name',
                'It contains urgent requests for personal information',
                'It has the company\'s correct logo'
            ],
            correctAnswer: 'It contains urgent requests for personal information',
            category: 'Fraud',
            difficulty: 'easy'
        },
        {
            _id: 'l2q2',
            question: 'What should you do if you receive a suspicious call claiming to be from your bank?',
            options: [
                'Provide your information if they verify some details about you',
                'Hang up and call the official bank number on your card',
                'Give them your password so they can help you',
                'Provide your information if they sound professional'
            ],
            correctAnswer: 'Hang up and call the official bank number on your card',
            category: 'Fraud',
            difficulty: 'easy'
        },
        {
            _id: 'l2q3',
            question: 'Which of these is a sign of a potential online shopping scam?',
            options: [
                'The website has customer reviews',
                'The website has a secure (https) connection',
                'The prices are significantly lower than everywhere else',
                'The website has a clear return policy'
            ],
            correctAnswer: 'The prices are significantly lower than everywhere else',
            category: 'Fraud',
            difficulty: 'medium'
        },
        {
            _id: 'l2q4',
            question: 'What is "vishing"?',
            options: [
                'Video phishing using fake video calls',
                'Voice phishing using phone calls',
                'A legitimate verification process',
                'Verification of shopping identity'
            ],
            correctAnswer: 'Voice phishing using phone calls',
            category: 'Fraud',
            difficulty: 'medium'
        },
        {
            _id: 'l2q5',
            question: 'What is a common tactic in romance scams?',
            options: [
                'Meeting in person immediately',
                'Asking for small amounts of money initially',
                'Refusing to accept any gifts',
                'Providing extensive personal information'
            ],
            correctAnswer: 'Asking for small amounts of money initially',
            category: 'Fraud',
            difficulty: 'medium'
        }
    ],
    // Add more levels as needed (3, 4, 5)
    '3': [
        {
            _id: 'l3q1',
            question: 'What is a secure password practice?',
            options: [
                'Using the same password for all accounts',
                'Using simple, easy-to-remember words',
                'Using unique, complex passwords for each account',
                'Sharing passwords with trusted friends'
            ],
            correctAnswer: 'Using unique, complex passwords for each account',
            category: 'Security',
            difficulty: 'medium'
        },
        {
            _id: 'l3q2',
            question: 'What is encryption?',
            options: [
                'A type of computer virus',
                'The process of converting information into a code to prevent unauthorized access',
                'A method of deleting data permanently',
                'A type of firewall'
            ],
            correctAnswer: 'The process of converting information into a code to prevent unauthorized access',
            category: 'Security',
            difficulty: 'medium'
        },
        {
            _id: 'l3q3',
            question: 'Why is public WiFi potentially dangerous?',
            options: [
                'It uses too much battery power',
                'It\'s always too slow to be useful',
                'It can expose your data to potential hackers',
                'It requires a password'
            ],
            correctAnswer: 'It can expose your data to potential hackers',
            category: 'Security',
            difficulty: 'medium'
        },
        {
            _id: 'l3q4',
            question: 'What is a VPN used for?',
            options: [
                'Speeding up your internet connection',
                'Storing passwords securely',
                'Creating secure, encrypted connections',
                'Blocking all advertisements'
            ],
            correctAnswer: 'Creating secure, encrypted connections',
            category: 'Security',
            difficulty: 'medium'
        },
        {
            _id: 'l3q5',
            question: 'What is malware?',
            options: [
                'Hardware that has been physically damaged',
                'Software designed to damage or gain unauthorized access to systems',
                'A type of secure password',
                'A legitimate security tool'
            ],
            correctAnswer: 'Software designed to damage or gain unauthorized access to systems',
            category: 'Security',
            difficulty: 'medium'
        },
        {
            _id: 'l3q6',
            question: 'What is a digital footprint?',
            options: [
                'The size of digital files on your computer',
                'The trace of your activities you leave online',
                'A measurement of your computer\'s performance',
                'A type of computer virus'
            ],
            correctAnswer: 'The trace of your activities you leave online',
            category: 'Security',
            difficulty: 'medium'
        },
        {
            _id: 'l3q7',
            question: 'What is the purpose of a firewall?',
            options: [
                'To cool down your computer',
                'To monitor and filter network traffic',
                'To increase internet speed',
                'To store passwords'
            ],
            correctAnswer: 'To monitor and filter network traffic',
            category: 'Security',
            difficulty: 'hard'
        }
    ],
    '4': [
        {
            _id: 'l4q1',
            question: 'What is diversification in investing?',
            options: [
                'Investing all your money in one promising stock',
                'Spreading investments across various assets to reduce risk',
                'Investing only in foreign markets',
                'Changing your investment strategy every month'
            ],
            correctAnswer: 'Spreading investments across various assets to reduce risk',
            category: 'Finance',
            difficulty: 'medium'
        },
        {
            _id: 'l4q2',
            question: 'What is a Ponzi scheme?',
            options: [
                'A legitimate investment strategy',
                'A type of retirement account',
                'A fraudulent investment scam promising high returns with little risk',
                'A government-backed investment program'
            ],
            correctAnswer: 'A fraudulent investment scam promising high returns with little risk',
            category: 'Fraud',
            difficulty: 'medium'
        },
        {
            _id: 'l4q3',
            question: 'What is a cryptocurrency scam red flag?',
            options: [
                'The project has a detailed whitepaper',
                'The team members are publicly identified',
                'Promises of guaranteed returns',
                'The project has been audited by security firms'
            ],
            correctAnswer: 'Promises of guaranteed returns',
            category: 'Fraud',
            difficulty: 'hard'
        },
        {
            _id: 'l4q4',
            question: 'What is a pump and dump scheme?',
            options: [
                'A legitimate trading strategy',
                'A market manipulation fraud that boosts stock prices before selling',
                'A method of dollar-cost averaging',
                'A long-term investment approach'
            ],
            correctAnswer: 'A market manipulation fraud that boosts stock prices before selling',
            category: 'Fraud',
            difficulty: 'hard'
        },
        {
            _id: 'l4q5',
            question: 'What is a safe way to research investments?',
            options: [
                'Following tips from anonymous online forums',
                'Investing in whatever is trending on social media',
                'Using reputable financial news sources and official documents',
                'Listening to unsolicited investment advice calls'
            ],
            correctAnswer: 'Using reputable financial news sources and official documents',
            category: 'Finance',
            difficulty: 'medium'
        },
        {
            _id: 'l4q6',
            question: 'What is a legitimate way to check a financial advisor\'s credentials?',
            options: [
                'Ask the advisor to provide references',
                'Check their social media followers count',
                'Use official verification tools like FINRA\'s BrokerCheck',
                'See how nice their office looks'
            ],
            correctAnswer: 'Use official verification tools like FINRA\'s BrokerCheck',
            category: 'Finance',
            difficulty: 'medium'
        },
        {
            _id: 'l4q7',
            question: 'What is "FOMO" in investing and why is it dangerous?',
            options: [
                'Fear Of Missing Out - it can lead to impulsive, poorly researched investments',
                'Funds Of Major Organizations - it\'s not dangerous',
                'Financial Operations Management Overview - it\'s a helpful concept',
                'Future Of Money Opportunities - it\'s a legitimate strategy'
            ],
            correctAnswer: 'Fear Of Missing Out - it can lead to impulsive, poorly researched investments',
            category: 'Finance',
            difficulty: 'medium'
        }
    ],
    '5': [
        {
            _id: 'l5q1',
            question: 'What is identity theft insurance?',
            options: [
                'Insurance that prevents identity theft from happening',
                'Coverage that helps with costs related to resolving identity theft',
                'Insurance that compensates for all money stolen',
                'A type of life insurance'
            ],
            correctAnswer: 'Coverage that helps with costs related to resolving identity theft',
            category: 'Security',
            difficulty: 'hard'
        },
        {
            _id: 'l5q2',
            question: 'What is a credit freeze?',
            options: [
                'Temporarily stopping use of your credit cards',
                'When your credit card is blocked due to suspicious activity',
                'Restricting access to your credit report to prevent new accounts in your name',
                'Lowering your credit card interest rate'
            ],
            correctAnswer: 'Restricting access to your credit report to prevent new accounts in your name',
            category: 'Security',
            difficulty: 'hard'
        },
        {
            _id: 'l5q3',
            question: 'What is a zero-day vulnerability?',
            options: [
                'A software bug that exists for zero days',
                'A security flaw unknown to the software vendor with no available fix',
                'A day when no new security threats are discovered',
                'A type of secure password'
            ],
            correctAnswer: 'A security flaw unknown to the software vendor with no available fix',
            category: 'Security',
            difficulty: 'hard'
        },
        {
            _id: 'l5q4',
            question: 'What is multi-factor authentication (MFA)?',
            options: [
                'Using multiple passwords for one account',
                'Authentication requiring two or more verification factors from different categories',
                'Logging in from multiple devices',
                'Having multiple security questions'
            ],
            correctAnswer: 'Authentication requiring two or more verification factors from different categories',
            category: 'Security',
            difficulty: 'medium'
        },
        {
            _id: 'l5q5',
            question: 'What is a hardware security key?',
            options: [
                'A special key that unlocks your computer case',
                'A physical device used as a second factor for authentication',
                'A backup key for your house',
                'The main password to your computer'
            ],
            correctAnswer: 'A physical device used as a second factor for authentication',
            category: 'Security',
            difficulty: 'hard'
        },
        {
            _id: 'l5q6',
            question: 'What is social engineering in cybersecurity?',
            options: [
                'Using social media for marketing',
                'Building social networks securely',
                'Psychological manipulation to trick people into making security mistakes',
                'Engineering social media platforms'
            ],
            correctAnswer: 'Psychological manipulation to trick people into making security mistakes',
            category: 'Security',
            difficulty: 'hard'
        },
        {
            _id: 'l5q7',
            question: 'What is end-to-end encryption?',
            options: [
                'Encryption that only works at the beginning and end of communications',
                'A method where only the communicating users can read the messages',
                'Encryption that works only on end devices like phones',
                'The final stage of a multi-layer encryption process'
            ],
            correctAnswer: 'A method where only the communicating users can read the messages',
            category: 'Security',
            difficulty: 'hard'
        },
        {
            _id: 'l5q8',
            question: 'What is a security audit?',
            options: [
                'A financial review of security expenses',
                'A systematic evaluation of security of an information system',
                'A physical inspection of security cameras',
                'A test of alarm systems'
            ],
            correctAnswer: 'A systematic evaluation of security of an information system',
            category: 'Security',
            difficulty: 'hard'
        },
        {
            _id: 'l5q9',
            question: 'What is a secure element in mobile devices?',
            options: [
                'A special app that provides security',
                'A tamper-resistant platform capable of securely hosting applications and data',
                'The lock screen of your phone',
                'A secure case for your device'
            ],
            correctAnswer: 'A tamper-resistant platform capable of securely hosting applications and data',
            category: 'Security',
            difficulty: 'hard'
        },
        {
            _id: 'l5q10',
            question: 'What is the principle of least privilege in security?',
            options: [
                'Giving users the minimum levels of access necessary to complete their job',
                'Restricting access to privileged users only',
                'Ensuring everyone has equal access to systems',
                'Providing minimal security for unimportant systems'
            ],
            correctAnswer: 'Giving users the minimum levels of access necessary to complete their job',
            category: 'Security',
            difficulty: 'hard'
        }
    ]
};

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
  const [levelCompleted, setLevelCompleted] = useState<boolean>(false);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  
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

  // Replace the fetchQuestions function with this
  const fetchQuestions = async () => {
      try {
          if (!levelId) {
              throw new Error('Invalid level ID');
          }
          
          // Get questions for this level
          const levelQuestions = LEVEL_QUIZ_QUESTIONS[levelId as string];
          
          if (!levelQuestions || levelQuestions.length === 0) {
              throw new Error(`No questions found for level ${levelId}`);
          }
          
          // Shuffle the questions and select a subset based on the level's questionCount
          const shuffledQuestions = [...levelQuestions].sort(() => Math.random() - 0.5);
          
          // Get the appropriate number of questions based on the level
          const questionCount = QUIZ_LEVELS.find(l => l.id === parseInt(levelId as string))?.questionCount || 5;
          const selectedQuestions = shuffledQuestions.slice(0, questionCount);
          
          setQuizQuestions(selectedQuestions);
          
          // Start countdown
          startCountdown();
      } catch (e) {
          const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
          console.error("Error setting up quiz:", e);
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
          score: finalScore,
          totalQuestions: quizQuestions.length
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit level completion');
      }
      
      const data = await response.json();
      console.log("✅ Level completion submitted:", data);
      
      // Update completion status from backend response
      setCoinsEarned(data.coinsEarned || 0);
      setLevelCompleted(data.completed || false);
      setCompletionPercentage(data.percentage || Math.round((finalScore / quizQuestions.length) * 100));
      
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
        completed={levelCompleted}
        percentage={completionPercentage}
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
  if (typeof countdown === 'number' && countdown > 0) {
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
  modalSuccess: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalWarning: {
    fontSize: 14,
    color: '#FFC107',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
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