import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Dimensions, Image, Platform } from 'react-native';
import LottieView from 'lottie-react-native'; 
import { useFonts, Poppins_400Regular, Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { LinearGradient } from 'expo-linear-gradient'; 
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingModal from '../components/LoadingModal.js';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { saveUserToDatabase } from '../services/FirebaseService.js'; 

const sw = Dimensions.get('window').width;

WebBrowser.maybeCompleteAuthSession();

const AuthScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const [userInfo, setUserInfo] = useState(null);
  const [loadModal, setLoadModal] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "436345225901-9635t5ptp9f2rv87bb1j2kb7jja7c76c.apps.googleusercontent.com",
    iosClientId: "436345225901-m7pqbplb1sfi7vg3gpk8parfe1ua4ne8.apps.googleusercontent.com",
    webClientId: "436345225901-8s8ekvdakebn4clr57his19i6jh898gd.apps.googleusercontent.com",
  }, {
    useProxy: Platform.OS === 'ios',
  });

  useEffect(() => {
    handleEffect();
  }, [response]);

  async function handleEffect() {
    const user = await getLocalUser();
    
    if (!user) {
      if (response?.type === "success") {
        setLoadModal(true); // Show loading modal
        getUserInfo(response.authentication.accessToken);
        WebBrowser.maybeCompleteAuthSession();
      }
    } else {
      setUserInfo(user);
      navigation.replace('Home'); // Navigate to home if user is already authenticated
    }
  }

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    if (!data) return null;
    return JSON.parse(data);
  };

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
      console.error(user);
  
      // Retrieve the notification token from AsyncStorage
      const notificationToken = await AsyncStorage.getItem('@ntoken');
      
      // Save user data to Firebase, including the notification token
      await saveUserToDatabase({
        name: user.name,
        email: user.email,
        uid: user.id,  // Use the Google user ID
        token: notificationToken || 6000,   // Fetch the token from AsyncStorage
        picture: user.picture,
      });
  
      setLoadModal(false); // Hide loading modal after successful login
      navigation.replace('Home'); // Navigate to home after loading
    } catch (error) {
      console.error('Error fetching user info:', error);
      setLoadModal(false); // Hide loading modal on error
    }
  };
  



  const fakeLogin = async () => {  // Make the function async
    try {
      // Save user to the database
      const notificationToken = await AsyncStorage.getItem('@ntoken');
  
      await saveUserToDatabase({ // Add await here to ensure the promise resolves before proceeding
        name: 'Samriddhi Dubey',
        email: 'samriddhi0017@gmail.com',
        uid: '1029478278748728787',
        token: notificationToken,
        pic: 'https://lh3.googleusercontent.com/a/ACg8ocKcroHk2JPbKmF-gHfp9oM4OC4RoUpbcKRlfZM_MQgHbJNwGq_-=s96-c'
      });
  
      // Save user data to AsyncStorage
      await AsyncStorage.setItem("@user", JSON.stringify({ // Ensure you're saving the correct user object
        name: 'Samriddhi Dubey',
        email: 'samriddhi0017@gmail.com',
        uid: '1029478278748728787',
        token: notificationToken,
        pic: 'https://lh3.googleusercontent.com/a/ACg8ocKcroHk2JPbKmF-gHfp9oM4OC4RoUpbcKRlfZM_MQgHbJNwGq_-=s96-c'
      }));
  
      navigation.replace('Home'); // Navigate to Home
    } catch (error) {
      console.error('Error during fake login:', error); // Handle any errors
    }
  };
  



  const login = () => {
    promptAsync();
    // fakeLogin(); // Trigger Google login
};

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <LoadingModal isVisible={loadModal} />
      <Image source={require('../assets/header.png')} style={styles.appName} />
      <LottieView 
        source={require('../assets/login.json')} 
        autoPlay loop 
        style={styles.lottie}
      /> 
      <TouchableOpacity onPress={login}>
        <LinearGradient
          colors={['#FF3DFF', '#FF009d']}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.loginButton}
        >
          <Text style={styles.loginText}>Log In</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  appName: {
    width: sw * 0.65,
    height: sw * 0.26,
    marginBottom: sw * 0.26,
    resizeMode: 'contain',
  },
  lottie: {
    width: sw * 0.7,
    height: sw * 0.7,
    marginBottom: sw * 0.2,
  },
  loginButton: {
    width: sw * 0.65,
    paddingVertical: sw * 0.03,
    borderRadius: sw * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF3DFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  loginText: {
    fontSize: sw * 0.05,
    color: '#FFF',
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default AuthScreen;
