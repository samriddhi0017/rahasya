// FirebaseService.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update, set , increment} from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNDS03Kg0zxewQqAlTmncj0uWUeGATN68",
  authDomain: "rahasya-official.firebaseapp.com",
  projectId: "rahasya-official",
  storageBucket: "rahasya-official.appspot.com",
  messagingSenderId: "436345225901",
  appId: "1:436345225901:android:e112f5e8f85cd76243bc24",
  databaseURL: "https://rahasya-official-default-rtdb.firebaseio.com/" // Realtime Database URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const FirebaseService = {
  // Function to fetch user profile picture
  fetchUserPic: async (userId) => {
    const userRef = ref(db, `Users/${userId}/picture`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No profile picture found");
      return null;
    }
  },





  fetchUserToken: async (userId) => {
    const userRef = ref(db, `Users/${userId}/token`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No token found");
      return null;
    }
  },






  // Function to fetch a specific question
  fetchQuestion: async (questionId) => {
    const questionRef = ref(db, `Questions/${questionId}`);
    const snapshot = await get(questionRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No question found");
      return null;
    }
  },

  // Function to increment visitor count
  incrementVisitorCount: async (uid) => {
    const visitorCountRef = ref(db, `Users/${uid}`);

    try {
      const snapshot = await get(visitorCountRef);
      const currentCount = snapshot.val()?.visitors || 0;

      console.log("Current visitor count:", currentCount);

      await update(visitorCountRef, {
        visitors: currentCount + 1
      });
    } catch (error) {
      console.error("Error incrementing visitor count:", error);
    }
  },

  sendMessage: async (uid, message, question, color, pushToken , ipAddress , deviceInfo) => {
    const messageId = Date.now(); // Use the current epoch timestamp as message ID
    const messageRef = ref(db, `Users/${uid}/messages/${messageId}`); // Reference to store the message
    const userRef = ref(db, `Users/${uid}/`); // Reference to the user to update the message counter
  
    try {
      // Save message in Firebase
      await set(messageRef, {
        message: message,
        question: question,
        color: color,
        seen: false,
        ip: ipAddress,
        device: deviceInfo
      });
      console.log("Message sent successfully");
  
      // Increment the message counter by 1
      await update(userRef, {
        message: increment(1), // Increase the message counter by 1
      });
  
      // Send push notification
      const notificationPayload = {
        to: pushToken, // Use the push token obtained from the user's device
        title: "You have a new message",
        body: "Tap to open!",
      };
  
      fetch("https://rahasya.onrender.com/api/notifications/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationPayload),
      });
  
      console.log("Push notification sent successfully");
    } catch (error) {
      console.error("Error sending message or notification:", error);
    }
  },
  

};

export default FirebaseService;
