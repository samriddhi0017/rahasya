import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, SafeAreaView, Animated, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const sw = Dimensions.get('window').width;

const SplashScreen = ({ navigation }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current; // Create an animated value

  // Rotation animation
  const startRotation = () => {
    rotateAnim.setValue(0); // Reset the animated value
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 2000, // Duration of the animation
      useNativeDriver: true,
    }).start(() => startRotation()); // Repeat the animation
  };

  useEffect(() => {
    startRotation(); // Start the rotation animation
    const timer = setTimeout(async () => {
      const user = await getLocalUser(); // Check local user data
      if (user?.email) {
        navigation.replace('Home'); // Navigate to Home if email exists
      } else {
        navigation.replace('Auth'); // Navigate to Auth if email is empty
      }
    }, 2000); // Changed to 2000ms for demo purpose
    return () => clearTimeout(timer);
  }, [navigation]);

  // Function to get the local user data from AsyncStorage
  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    // console.error(data);
    if (!data) return null;
    return JSON.parse(data);
  };

  // Interpolating rotation value
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Animated.Image
          source={require('../assets/logo.png')} // Replace with your image path
          style={[styles.image, { width: sw * 0.5, height: sw * 0.5, transform: [{ rotate: rotateInterpolate }] }]} // Responsive size
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff009d', // Change background color if needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    alignItems: 'center',
  },
});

export default SplashScreen;
