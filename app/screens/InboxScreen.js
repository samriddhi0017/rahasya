import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, Share, View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { fetchMessages, markMessageAsSeen } from '../services/FirebaseService';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing'

const InboxScreen = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const navigation = useNavigation();
  const viewShotRef = React.useRef();

  const getUidFromEmail = (email) => {
    return email.split('@')[0];
  }

  const getUserUidFromStorage = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('@user');
      if (userData !== null) {
        const parsedUserData = JSON.parse(userData);
        const uid = getUidFromEmail(parsedUserData.email);
        setUserId(uid);
        return uid;
      } else {
        console.log('No user data found in storage');
        return null;
      }
    } catch (error) {
      console.error('Error retrieving user data from AsyncStorage:', error);
      return null;
    }
  }, []);

  const sortMessages = useCallback((unsortedMessages) => {
    return unsortedMessages.sort((a, b) => {
      if (a.seen === b.seen) {
        return b.id - a.id; // Most recent first
      }
      return a.seen ? 1 : -1; // Unseen messages first
    });
  }, []);

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    const uid = await getUserUidFromStorage();
    if (uid) {
      fetchMessages(uid, (fetchedMessages) => {
        const now = Date.now();
        const last24HoursMessages = fetchedMessages.filter((message) => now - message.id <= 86400000);
        const sortedMessages = sortMessages(last24HoursMessages);
        setMessages(sortedMessages);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [getUserUidFromStorage, sortMessages]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleOpenMessage = useCallback((item) => {
    setSelectedMessage(item);
    if (!item.seen) {
      markMessageAsSeen(userId, item.id);
      setMessages(prevMessages => 
        sortMessages(prevMessages.map(msg => 
          msg.id === item.id ? { ...msg, seen: true } : msg
        ))
      );
    }
  }, [userId, sortMessages]);



  const handleShare = useCallback(async () => {
    if (!viewShotRef.current) {
      console.error('ViewShot ref is not available');
      return;
    }
  
    try {
      const uri = await viewShotRef.current.capture();
      
      if (!uri) {
        console.error('Failed to capture the view');
        return;
      }
  
      const shareOptions = {
          mimeType: 'image/png',
          dialogTitle: 'Share your question',
          UTI: 'public.png',
          message: `Check out this question:`, // Combine the message with the link
        };
        await Sharing.shareAsync(uri, shareOptions);
      

    
  
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type of', result.activityType);
        } else {
          console.log('Shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // You might want to show an error message to the user here
      Alert.alert('Error', 'Failed to share the message. Please try again.');
    }
  }, []);



  const renderEmptyInbox = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Waiting for new messages</Text>
      <LottieView
        source={require('../assets/message.json')}
        autoPlay
        loop
        style={styles.lottieAnimation}
      />
      <TouchableOpacity onPress={loadMessages}>
        <LinearGradient
          colors={['#ff009d', '#ff00ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonText}>Refresh Messages</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderMessageItem = useCallback(({ item }) => (
    <TouchableOpacity style={styles.messageItem} onPress={() => handleOpenMessage(item)}>
      <LinearGradient
        colors={item.seen ? ['#e0e0e0', '#f0f0f0'] : ['#ff009d', '#ff00ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.messageIcon}
      >
        <Image source={require('../assets/message-icon.png')} style={styles.iconImage} />
      </LinearGradient>
      <View style={styles.messageContent}>
        <Text style={styles.messageTitle} numberOfLines={1}>
          {item.seen ? item.message : 'New Message!'}
        </Text>
        <Text style={styles.messageTime}>
          {moment(Number(item.id)).fromNow()}
        </Text>
      </View>
      <Text style={styles.arrowText}>›</Text>
    </TouchableOpacity>
  ), [handleOpenMessage]);

  const renderMessageDetail = () => (
    <View style={styles.detailContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => setSelectedMessage(null)} style={styles.detailCloseButton}>
          <Text style={styles.detailCloseButtonText}>✕</Text>
        </TouchableOpacity>
        {/* <View style={styles.detailInstagramIcon}>
          <Text style={styles.detailInstagramIconText}>📷</Text>
        </View> */}
      </View>
      <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }} style={styles.detailCardContainer}>
        <LinearGradient
          colors={selectedMessage.color}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.detailGradientCard}
        >
          <Text style={styles.detailGradientHeaderText}>{selectedMessage.question}</Text>
        </LinearGradient>
        <View style={styles.detailMessageContent}>
          <Text style={styles.detailMessageText}>{selectedMessage.message}</Text>
        </View>
        <View style={styles.detailShareSpaceContainer}>
          <Text style={styles.detailShareSpaceText}>Share your answer here!</Text>
        </View>
      </ViewShot>
      <TouchableOpacity style={styles.detailReplyButton} onPress={handleShare}>
        <Text style={styles.detailReplyButtonText}>📷 Share</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <LottieView
            source={require('../assets/load.json')}
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {selectedMessage ? (
        renderMessageDetail()
      ) : (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>INBOX</Text>
          </View>
          {messages.length > 0 ? (
            <FlatList
              data={messages}
              renderItem={renderMessageItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.messageList}
            />
          ) : (
            renderEmptyInbox()
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const { width: sw } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    paddingTop: sw * 0.05,
  },
  header: {
    padding: sw * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: sw * 0.05,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: sw * 0.1,
  },
  emptyTitle: {
    fontSize: sw * 0.05,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
    marginBottom: sw * 0.02,
  },
  lottieAnimation: {
    width: sw * 0.8,
    height: sw * 0.8,
    marginBottom: sw * 0.02,
  },
  gradientButton: {
    padding: sw * 0.04,
    borderRadius: sw * 0.1,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: sw * 0.04,
    fontFamily: 'Poppins_600SemiBold',
    color: '#ffffff',
  },
  messageList: {
    flex: 1,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sw * 0.05,
    borderWidth: 1.5,
    marginHorizontal: sw * 0.05,
    paddingVertical: sw * 0.035,
    marginVertical: sw * 0.03,
    borderRadius: sw * 0.25,
    borderColor: '#e0e0e0',
    elevation: 0.1,
    backgroundColor: 'white',
  },
  messageIcon: {
    width: sw * 0.1,
    height: sw * 0.1,
    borderRadius: sw * 0.125,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: sw * 0.04,
  },
  iconImage: {
    width: sw * 0.075,
    height: sw * 0.075,
  },
  messageContent: {
    flex: 1,
  },
  messageTitle: {
    fontSize: sw * 0.032,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
  },
  messageTime: {
    fontSize: sw * 0.027,
    fontFamily: 'Poppins_400Regular',
    color: '#777',
  },
  arrowText: {
    fontSize: sw * 0.05,
    color: '#777',
  },
  loadingText: {
    fontFamily: 'Poppins_400Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: sw * 0.05,
    alignItems:'center',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: sw*0.9,
    marginTop:sw*0.1,
    marginBottom: sw * 0.37,
  },
  detailCloseButton: {
    padding: sw * 0.02,
  },
  detailCloseButtonText: {
    fontSize: sw * 0.06,
    color: '#000',
  },
  detailInstagramIcon: {
    width: sw * 0.1,
    height: sw * 0.1,
    borderRadius: sw * 0.05,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailInstagramIconText: {
    fontSize: sw * 0.06,
  },
  detailCardContainer: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: sw * 0.05,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom:sw*0.15,
  },
  detailGradientCard: {
    padding: sw * 0.05,
  },
  detailGradientHeaderText: {
    fontSize: sw * 0.045,
    fontFamily: 'Poppins_600SemiBold',
    color: '#ffffff',
    textAlign: 'center',
  },
  detailMessageContent: {
    padding: sw * 0.05,
    backgroundColor: '#ffffff',
  },
  detailMessageText: {
    fontSize: sw * 0.04,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
    textAlign: 'center',
  },
  detailShareSpaceContainer: {
    height: sw * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  detailShareSpaceText: {
    fontSize: sw * 0.035,
    fontFamily: 'Poppins_400Regular',
    color: '#999',
  },
  detailReplyButton: {
    backgroundColor: '#ff009d',
    padding: sw * 0.04,
    marginTop: sw * 0.05,
    borderRadius: sw * 0.1,
    width: sw * 0.8,
    alignItems: 'center',
  },
  detailReplyButtonText: {
    color: '#ffffff',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: sw * 0.04,
  },
});

export default InboxScreen;