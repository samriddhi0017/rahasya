import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Alert, Platform, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { fetchQuestions, incrementShareCount } from '../services/FirebaseService.js';
import Carousel from 'react-native-reanimated-carousel';
import Animated, { useSharedValue } from 'react-native-reanimated';
import ViewShot from 'react-native-view-shot';

const { width: sw, height: screenHeight } = Dimensions.get('window');
const PRIMARY_COLOR = '#ff009d';

const CARD_WIDTH = sw;
const CARD_HEIGHT = sw * 0.7;
const SPACING = 0;

const ShareScreen = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });



  

  const [activeIndex, setActiveIndex] = useState(0); // Start at the first index
  const [link, setLink] = useState('');
  const [userData, setUserData] = useState(null);
  const [uid, setUid] = useState('');
  const [questions, setQuestions] = useState([
    {
      id: "1000",
      color: ["#FF009D", "#fc328d"],
      text: "Tell me what you think about me !",
      name: "",
    },
  ]);

  const progressValue = useSharedValue(0);
  const viewShotRefs = useRef([]);

  // Fetch questions from Firebase
  useEffect(() => {
    const fetchQuestionsData = async () => {
      const questionsData = await fetchQuestions();
      if (Array.isArray(questionsData)) {
        setQuestions((prevQuestions) => [...prevQuestions, ...questionsData]);
        // After adding new questions, set the carousel index to 0
        setActiveIndex(0);
      }
    };

    fetchQuestionsData();
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = await AsyncStorage.getItem('@user');
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        setUserData(user);
        setUid(getUidFromEmail(user.email));
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData && questions.length > 0) {
      setLink(`https://rahasya-link.web.app/${uid}/${questions[activeIndex]?.name}`);
    }
  }, [activeIndex, userData, questions, uid]);

  const getUidFromEmail = (email) => {
    return email.split('@')[0];
  };

  const copyLink = async () => {
    await Clipboard.setStringAsync(link);
    Alert.alert('Link Copied!', 'The link has been copied to your clipboard.');
  };

  const shareLink = async () => {
    try {
      if (viewShotRefs.current[activeIndex]) {
        const uri = await viewShotRefs.current[activeIndex].capture();

        // For iOS, we need to use Sharing.shareAsync
        if (Platform.OS === 'ios') {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'Share your question',
            UTI: 'public.png',
          });

          // After sharing the image, share the text separately
          await Sharing.shareAsync(link, {
            mimeType: 'text/plain',
            dialogTitle: 'Share your link',
          });
        }
        // For Android, we can use the Share API to share both image and text
        else {
          const shareOptions = {
            message: `Want to spill some secrets or ask intriguing questions? 🤔💌 Dive into the world of Rahasya—the coolest anonymous messaging app! 🕵️‍♂️✨ Share your thoughts and mysteries without a worry! 🌟

Let the fun begin! 🎊💬
Send me your messages here:
${link}`,
            url: uri,
            title: 'Share your question',
          };
          await Share.share(shareOptions);
        }

        incrementShareCount();
      } else {
        console.error("ViewShot ref not found for the active index");
      }
    } catch (error) {
      console.error("Couldn't share the card", error);
      Alert.alert('Error', 'Failed to share the question. Please try again.');
    }
  };

  const renderCarouselItem = ({ item, index }) => {
    return (
      <View style={styles.cardWrapper}>
        <ViewShot ref={el => viewShotRefs.current[index] = el} options={{ format: "png", quality: 0.9 }}>
          <LinearGradient
            colors={[...item.color]}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.avatarContainer}>
              {userData && <Image source={{ uri: userData.picture }} style={styles.avatar} />}
            </View>
            <Text style={styles.questionText}>{item.text}</Text>
          </LinearGradient>
        </ViewShot>
      </View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {questions.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex ? styles.paginationDotActive : null
            ]}
          />
        ))}
      </View>
    );
  };

  if (!fontsLoaded) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Carousel
          loop={false}
          data={questions}
          renderItem={renderCarouselItem}
          width={CARD_WIDTH + SPACING}
          height={CARD_HEIGHT}
          onProgressChange={(_, absoluteProgress) => {
            progressValue.value = absoluteProgress;
            setActiveIndex(Math.round(absoluteProgress));
          }}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
          defaultIndex={0} // Keep the carousel at the first index
        />
        {renderPagination()}
      </View>

      <View style={styles.stepsContainer}>
        <Text style={styles.stepTitle}>Step 1: Copy your link</Text>
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>{link}</Text>
        </View>
        <TouchableOpacity
          style={[styles.copyButton, { borderColor: questions[activeIndex]?.color[0] }]}
          onPress={copyLink}
        >
          <AntDesign name="copy1" size={18} color={questions[activeIndex]?.color[0]} style={styles.buttonIcon} />
          <Text style={[styles.copyButtonText, { color: questions[activeIndex]?.color[0] }]}>Copy link</Text>
        </TouchableOpacity>

        <Text style={styles.stepTitle}>Step 2: Share link with friends</Text>
        <TouchableOpacity style={styles.shareButton} onPress={shareLink}>
          <LinearGradient colors={questions[activeIndex]?.color} style={styles.shareGradient}>
            <AntDesign name="sharealt" size={18} color="white" style={styles.buttonIcon} />
            <Text style={styles.shareButtonText}>Share!</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingTop: sw * 0.05,
  },
  carouselContainer: {
    height: CARD_HEIGHT+20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: sw * 0.12,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: sw * 0.05,
    padding: sw * 0.05,
  },
  avatarContainer: {
    width: sw * 0.15,
    height: sw * 0.15,
    borderRadius: sw * 0.075,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sw * 0.05,
  },
  avatar: {
    width: sw * 0.135,
    height: sw * 0.135,
    borderRadius: sw * 0.0625,
    backgroundColor: '#DDD',
  },
  questionText: {
    color: '#FFF',
    fontSize: sw * 0.049,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: sw * 0.02,
  },
  paginationDot: {
    width: sw * 0.02,
    height: sw * 0.02,
    borderRadius: sw * 0.01,
    backgroundColor: '#EEE',
    marginHorizontal: sw * 0.01,
  },
  paginationDotActive: {
    backgroundColor: PRIMARY_COLOR,
  },
  stepsContainer: {
    marginVertical: sw * 0.05,
    
  },
  stepTitle: {
    fontSize: sw * 0.046,
    color: PRIMARY_COLOR,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: sw * 0.04,
  },
  linkContainer: {
    width: sw * 0.9,
    padding: sw * 0.02,
    borderRadius: sw * 0.03,
    backgroundColor: '#F3F3F3',
    marginBottom: sw * 0.03,
  },
  linkText: {
    fontSize: sw * 0.026,
    color: '#333',
    textAlign: 'center',
    fontFamily:'Poppins_600SemiBold',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    paddingVertical: sw * 0.015,
    paddingHorizontal: sw * 0.04,
    marginHorizontal:sw*0.1,
    marginVertical:sw*0.04,
    borderWidth: 1,
    borderRadius: sw * 0.03,
  },
  copyButtonText: {
    fontSize: sw * 0.04,
    fontFamily: 'Poppins_600SemiBold',
    marginLeft: sw * 0.02,
  },
  buttonIcon: {
    marginRight: sw * 0.01,
  },
  shareButton: {
    marginTop: sw * 0.00,
  },
  shareGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: sw * 0.02,
    paddingHorizontal: sw * 0.02,
    marginHorizontal:sw*0.1,
    borderRadius: sw * 0.03,
  },
  shareButtonText: {
    color: '#FFF',
    fontSize: sw * 0.045,
    fontFamily: 'Poppins_700Bold',
    marginLeft: sw * 0.02,
  },
});

export default ShareScreen;
