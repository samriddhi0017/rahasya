import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

// Task Manager name
const NOTIFICATIONS_TASK = 'notificationsTask';

// Function to send notification token to the server
/*
const sendNotificationToken = async (id, expoToken) => {
  try {
    const url = 'https://bramhasmi.com/mserver/setNotifyId';
    const requestBody = JSON.stringify({ id, expoToken });

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    if (!response.ok) {
      throw new Error('Failed to send notification token');
    }

    const responseData = await response.json();
    console.log(responseData); // Handle the response data as needed
  } catch (error) {
    console.error('Error sending notification token:', error.message);
    // Handle the error
  }
};
*/



const handleForegroundNotification = (notification) => {
  console.log('Received Notification in Foreground:', notification);
  storeNotification(notification);
};


// Function to register for push notifications
const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return null;
  }

  token = (await Notifications.getExpoPushTokenAsync({
    projectId: "b0c72a87-de4e-4255-be5a-fa3ddf93edba",
  })).data;
  
  console.log('Expo Push Token:', token);

  /*
  sendNotificationToken(uid , token); // Replace 'user_id' with the appropriate id
  */
  await AsyncStorage.setItem('@ntoken', token);
  
  
  return token;
};

// Define background task to handle notifications
TaskManager.defineTask(NOTIFICATIONS_TASK, ({ data, error, executionInfo }) => {
  if (error) {
    console.error('Error in background task:', error);
    return;
  }

  if (data) {
    console.log('Received Notification in Background:', data);

    // Store the incoming notification in AsyncStorage
    storeNotification(data);
  }
});

// Function to store incoming notifications in AsyncStorage
const storeNotification = async (notification) => {
  try {/*
    const storedNotificationsJSON = await AsyncStorage.getItem('@notifications');
    const storedNotifications = storedNotificationsJSON ? JSON.parse(storedNotificationsJSON) : [];
    storedNotifications.push(notification);
    await AsyncStorage.setItem('@notifications', JSON.stringify(storedNotifications));

 */
 console.log("hello");
  } catch (error) {
    console.error('Error storing notification in AsyncStorage:', error);
  }
};


Notifications.addNotificationReceivedListener(handleForegroundNotification);


export { registerForPushNotificationsAsync , handleForegroundNotification};