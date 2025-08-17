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
import { useLanguage } from '../contexts/LanguageContext'; // Ensure this path is correct

export default function AboutUsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();

  const teamMembersData = [
    {
      id: 1,
      image: require('../assets/images/vaultvu-logo.jpg'),
      name: 'Arpit Kumar',
      roleKey: 'roleArpit',
      bioKey: 'bioArpit'
    },
    {
      id: 2,
      image: require('../assets/images/vaultvu-logo.jpg'),
      name: 'Mehakpreet Kaur Cheema',
      roleKey: 'roleMehakpreet',
      bioKey: 'bioMehakpreet'
    },
    {
      id: 3,
      image: require('../assets/images/vaultvu-logo.jpg'),
      name: 'Bisman Kaur',
      roleKey: 'roleBisman',
      bioKey: 'bioBisman'
    },
    {
      id: 4,
      image: require('../assets/images/vaultvu-logo.jpg'),
      name: 'Ananya Sawhney',
      roleKey: 'roleAnanya',
      bioKey: 'bioAnanya'
    },
  ];

  const handleContactUs = () => {
    Linking.openURL('mailto:2005sehalarpit@gmail.com');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#A8C3D1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{translations.aboutUsTitle}</Text>
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
        
        <Text style={styles.appName}>{translations.appName}</Text>
        <Text style={styles.appVersion}>{translations.appVersionText}</Text>
        
        <Text style={styles.description}>
          {translations.aboutUsDescription}
        </Text>
        
        <Text style={styles.sectionTitle}>{translations.ourTeamTitle}</Text>
        
        {teamMembersData.map((member) => (
          <View key={member.id} style={styles.teamMemberCard}>
            <Image source={member.image} style={styles.memberImage} />
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{translations[member.roleKey]}</Text>
              <Text style={styles.memberBio}>{translations[member.bioKey]}</Text>
            </View>
          </View>
        ))}
        
        <TouchableOpacity style={styles.contactButton} onPress={handleContactUs}>
          <Ionicons name="mail" size={20} color="#1A213B" style={styles.contactIcon} />
          <Text style={styles.contactButtonText}>{translations.contactUsButton}</Text>
        </TouchableOpacity>
        
        <Text style={styles.copyright}>
          {translations.aboutUsCopyright.replace('{year}', new Date().getFullYear())}
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
