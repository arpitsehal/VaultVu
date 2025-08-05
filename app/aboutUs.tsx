import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  Linking
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AboutUsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Arpit Kumar',
      role: 'Lead Developer',
      bio: 'Experienced developer with expertise in MERN stack.',
      // Use a placeholder image or add actual team member images to your assets folder
      image: require('../assets/images/vaultvu-logo.jpg'),
    },
    {
      id: 2,
      name: 'Mehakpreet Kaur Cheema',
      role: 'UI/UX Designer and Frontend Developer',
      bio: 'Creative designer focused on creating intuitive and secure user interfaces. Proficient in React Native and JavaScript.',
      image: require('../assets/images/vaultvu-logo.jpg'),
    },
    {
      id: 3,
      name: 'Bisman Kaur',
      role: 'Backend Developer',
      bio: 'Experienced backend developer with expertise in Node.js, Express.js, and MongoDB.',
      image: require('../assets/images/vaultvu-logo.jpg'),
    },
    {
      id: 4,
      name: 'Ananya Sawhney',
      role: 'Frontend Developer',
      bio: 'Experienced frontend developer with expertise in React Native and JavaScript.',
      image: require('../assets/images/vaultvu-logo.jpg'),
    },
  ];

  const handleContactUs = () => {
    Linking.openURL('2005sehalarpit@gmail.com');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/vaultvu-logo.jpg')} 
            style={styles.logo} 
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.appName}>VaultVu</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
        
        <Text style={styles.description}>
          VaultVu is a comprehensive security application designed to protect users from various types of financial frauds and scams. Our mission is to empower users with knowledge and tools to stay safe in the digital world. This is the official project of Punjab and Sindh Bank in collaboration with IK Gujral Punjab Technical University.
        </Text>
        
        <Text style={styles.sectionTitle}>Our Team</Text>
        
        {teamMembers.map((member) => (
          <View key={member.id} style={styles.teamMemberCard}>
            <Image source={member.image} style={styles.memberImage} />
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
              <Text style={styles.memberBio}>{member.bio}</Text>
            </View>
          </View>
        ))}
        
        <TouchableOpacity style={styles.contactButton} onPress={handleContactUs}>
          <Ionicons name="mail" size={20} color="#1A213B" style={styles.contactIcon} />
          <Text style={styles.contactButtonText}>Contact Us</Text>
        </TouchableOpacity>
        
        <Text style={styles.copyright}>
          © {new Date().getFullYear()} VaultVu. All rights reserved.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A213B',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1A213B',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 5,
    width: 30,
  },
  backButtonText: {
    fontSize: 28,
    color: '#A8C3D1',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 16,
    color: '#A8C3D1',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  teamMemberCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  memberImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  memberRole: {
    fontSize: 14,
    color: '#A8C3D1',
    marginBottom: 8,
  },
  memberBio: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
  },
  contactButton: {
    flexDirection: 'row',
    backgroundColor: '#A8C3D1',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    alignSelf: 'center',
  },
  contactIcon: {
    marginRight: 10,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A213B',
  },
  copyright: {
    fontSize: 14,
    color: '#A8C3D1',
    textAlign: 'center',
    marginBottom: 20,
  },
});