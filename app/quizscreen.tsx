import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

// A reusable card component for the quiz options
type QuizCardProps = {
  title: string;
  description: string;
  iconName: string;
  onPress: () => void;
};

// Reusable card component with an updated, more gamified style
const QuizCard: React.FC<QuizCardProps> = ({ title, description, iconName, onPress }) => (
  <TouchableOpacity
    style={styles.quizCard}
    onPress={onPress}
  >
    <AntDesign name={iconName} size={48} color="#1A213B" style={styles.quizIcon} />
    <View style={styles.cardTextContainer}>
      <Text style={styles.quizTitle}>{title}</Text>
      <Text style={styles.quizDescription}>{description}</Text>
    </View>
  </TouchableOpacity>
);

export default function QuizScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2A2F3E" />

      {/* Header Section */}
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#F0F4F8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Test Your Knowledge</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Daily Quiz Card */}
        <QuizCard
          title="Daily Quiz"
          description="Challenge yourself with a new set of questions every day!"
          iconName="clockcircleo"
          onPress={() => router.push('/dailyquiz')}
        />

        {/* Quiz Battle Card */}
        <QuizCard
          title="Quiz Battle"
          description="Compete against friends or other users in real-time."
          iconName="rocket1"
          onPress={() => router.push('/quizBattle')}
        />

        {/* New Levels Card */}
        <QuizCard
          title="Levels"
          description="Progress through different levels to become a quiz master."
          iconName="bars"
          onPress={() => router.push('/levels')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A213B', // A unified dark slate gray background
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1A213B',
  },
  backButton: {
    padding: 10,
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A8C3D1', // Light text for contrast
    textAlign: 'center',
  },
  spacer: {
    width: 40, // To balance the back button and center the title
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 30,
    gap: 20,
  },
  quizCard: {
    backgroundColor: '#A8C3D1', // Light gray background for cards
    borderRadius: 20,
    padding: 25,
    width: screenWidth * 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  quizIcon: {
    marginRight: 20,
  },
  cardTextContainer: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A213B', // Dark text for the title
    marginBottom: 5,
  },
  quizDescription: {
    fontSize: 14,
    color: '#1A213B', // Dark text for the description
  },
});
