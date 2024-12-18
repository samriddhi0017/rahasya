import React, { useEffect, useState } from 'react';
import { View, Linking ,Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchStatistics } from '../services/FirebaseService'; 
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

const sw = Dimensions.get('window').width;

const ProfileScreen = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profilePic: '',
  });

  const [userStats, setUserStats] = useState({
    visitors: 0,
    message: 0,
    shares: 0,
  });

  // Load fonts at the top level of the component
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@user');
        const user = jsonValue != null ? JSON.parse(jsonValue) : null;
        if (user) {
          setUserData({
            name: user.name,
            email: user.email,
            profilePic: user.picture,
          });
          fetchUserStats(user.email); // Fetch stats after setting user data
        }
      } catch (e) {
        console.error("Error fetching user data", e);
      }
    };

    fetchUserData();
  }, []);

  const fetchUserStats = (email) => {
    fetchStatistics(email, (stats) => {
      setUserStats(stats); // Update user statistics
    });
  };




  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  // Show loading indicator until fonts are loaded
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Picture Section */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: userData.profilePic || 'https://images.playground.com/f400036529724cca81e41ecaefaf52f9.jpeg' }}
            style={styles.profilePic}
          />
          <Text style={styles.profileName}>{userData.name || 'User Name'}</Text>
          <Text style={styles.profileLocation}>{userData.email || 'User Email'}</Text>
        </View>

        {/* Action Section (Visitors, Messages, Clicks) */}
        <View style={styles.actionCard}>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionItem}>
              <FontAwesome5 name="eye" size={24} color="#4CAF50" /> 
              <Text style={styles.actionLabel}>Visitors</Text>
              <Text style={styles.statValue}>{userStats.visitors}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <FontAwesome5 name="envelope" size={24} color='#2196F3' /> 
              <Text style={styles.actionLabel}>Messages</Text>
              <Text style={styles.statValue}>{userStats.message}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <FontAwesome5 name="share" size={24} color='#FFC107' />
              <Text style={styles.actionLabel}>Shares</Text>
              <Text style={styles.statValue}>{userStats.shares}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Us Section */}


        <View style={styles.contactCard}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <TouchableOpacity style={styles.contactItem} onPress={() => openLink('https://t.me/rahasya_official')}>
        <FontAwesome5 name="telegram-plane" size={24} color="#0088CC" />
        <Text style={styles.contactText}>Telegram</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactItem} onPress={() => openLink('mailto:rahasya.app@gmail.com')}>
        <FontAwesome5 name="envelope" size={24} color="#2196F3" />
        <Text style={styles.contactText}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactItem} onPress={() => openLink('https://rahasya-official.web.app')}>
        <FontAwesome5 name="globe" size={24} color="#4CAF50" />
        <Text style={styles.contactText}>Website</Text>
        </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: sw * 0.1, // Responsive padding
    paddingTop: sw * 0.1, // Responsive padding
    elevation: 10,
  },
  profilePic: {
    width: sw * 0.4, // Responsive width
    height: sw * 0.4, // Responsive height
    borderRadius: sw * 0.2, // Responsive border radius
    borderWidth: 5,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: sw * 0.06, // Responsive font size
    marginTop: sw * 0.04, // Responsive margin
    fontFamily: 'Poppins_700Bold', // Updated font family
  },
  profileLocation: {
    color: '#888',
    fontSize: sw * 0.037, // Responsive font size
    fontFamily: 'Poppins_400Regular', // Updated font family
    marginBottom: sw * 0.04, // Responsive margin
  },
  actionCard: {
    backgroundColor: '#fff',
    marginTop: sw * 0.05, // Responsive margin
    borderRadius: 30,
    padding: sw * 0.05, // Responsive padding
    elevation: 5,
    marginHorizontal: sw * 0.04, // Responsive margin
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: sw * 0.05, // Responsive margin
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
  },
  actionLabel: {
    marginTop: sw * 0.02, // Responsive margin
    fontSize: sw * 0.04, // Responsive font size
    color: '#333',
    fontFamily: 'Poppins_400Regular', // Updated font family
  },
  statValue: {
    fontSize: sw * 0.04, // Responsive font size for stat values
    color: '#555',
    fontFamily: 'Poppins_600SemiBold', // Updated font family
  },
  contactCard: {
    backgroundColor: '#fff',
    marginTop: sw * 0.05, // Responsive margin
    borderRadius: 30,
    padding: sw * 0.05, // Responsive padding
    elevation: 5,
    marginHorizontal: sw * 0.04, // Responsive margin
    marginBottom: sw * 0.2, // Responsive margin
  },
  sectionTitle: {
    fontSize: sw * 0.05, // Responsive font size
    fontFamily: 'Poppins_700Bold', // Updated font family
    marginBottom: sw * 0.04, // Responsive margin
    color: '#333',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sw * 0.03, // Responsive margin
  },
  contactText: {
    marginLeft: 15,
    fontFamily: 'Poppins_400Regular', // Updated font family
    fontSize: sw * 0.04, // Responsive font size
    color: '#555',
  },
});

export default ProfileScreen;
