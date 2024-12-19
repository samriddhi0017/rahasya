import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AppNavigator from './navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {registerForPushNotificationsAsync } from './notifications/notification.js';
import * as Notifications from 'expo-notifications';

export default function App() {


  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  
  React.useEffect(() => {
    // Call the function toregister for push notifications when the component mounts
    const registerPushNotifications = async () => {
      const expoPushToken = await registerForPushNotificationsAsync();
      console.log("token fetched");
      // You can use expoPushToken as needed, for example, send it to your server for targeted notifications.
    };


    registerPushNotifications();
       
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      const data = notification.request.content.data; 
      console.log("Main", data);
  });

  responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    console.log(response);
  });

    
    
    console.log("completed");

    // Clean up any necessary resources when the component unmounts
    return () => {
    }
    
   
    
  }, []);
  

  return (
    <Provider store={store}>
       <GestureHandlerRootView style={{ flex: 1 }}>    
        
        <AppNavigator />
  
       </GestureHandlerRootView>
  
    </Provider>
  );
}


